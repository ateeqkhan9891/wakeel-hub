"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTransactionalEmail } from "@/lib/email";
import { PRACTICE_AREAS } from "@/lib/constants";

// The hand-written Database type is intentionally partial; for write-heavy
// server actions we use an untyped client and re-type results ourselves.
async function db(): Promise<SupabaseClient> {
  return (await createClient()) as unknown as SupabaseClient;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
  requireAuth?: boolean;
}

export interface CreateBookingInput {
  lawyerId: string;
  mode: "online" | "in_person" | "phone";
  scheduledDate?: string;
  scheduledTime?: string;
  practiceAreaSlug?: string;
  issueSummary?: string;
}

function revalidateDashboards() {
  revalidatePath("/dashboard/client");
  revalidatePath("/dashboard/client/bookings");
  revalidatePath("/dashboard/client/notifications");
  revalidatePath("/dashboard/lawyer");
  revalidatePath("/dashboard/lawyer/bookings");
  revalidatePath("/dashboard/lawyer/notifications");
}

/**
 * Client books a consultation with a verified lawyer. Inserts the booking
 * (RLS requires client_id = auth.uid()); a database trigger then creates the
 * lawyer's "new request" notification automatically.
 */
export async function createBooking(input: CreateBookingInput): Promise<ActionResult> {
  const supabase = await db();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, requireAuth: true, error: "Please log in to book a consultation." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, city, role")
    .eq("id", user.id)
    .single();

  if (!profile) return { ok: false, requireAuth: true, error: "Your session expired. Please log in again." };
  if (profile.role !== "client") {
    return { ok: false, error: "Only client accounts can book consultations." };
  }

  const { data: lawyer } = await supabase
    .from("lawyer_directory")
    .select("id, full_name, online_consultation_fee, in_person_consultation_fee")
    .eq("id", input.lawyerId)
    .maybeSingle();

  if (!lawyer) {
    return { ok: false, error: "This advocate is not currently available for booking." };
  }

  const fee =
    input.mode === "in_person"
      ? lawyer.in_person_consultation_fee ?? lawyer.online_consultation_fee ?? 0
      : lawyer.online_consultation_fee ?? 0;

  const areaName = input.practiceAreaSlug
    ? PRACTICE_AREAS.find((a) => a.slug === input.practiceAreaSlug)?.name ?? null
    : null;

  let practiceAreaId: string | null = null;
  if (input.practiceAreaSlug) {
    const { data: area } = await supabase
      .from("practice_areas")
      .select("id")
      .eq("slug", input.practiceAreaSlug)
      .maybeSingle();
    practiceAreaId = area?.id ?? null;
  }

  const { data: created, error } = await supabase.from("bookings").insert({
    client_id: user.id,
    lawyer_id: input.lawyerId,
    practice_area_id: practiceAreaId,
    client_name: profile.full_name,
    client_phone: profile.phone,
    client_city: profile.city,
    lawyer_name: lawyer.full_name,
    practice_area_name: areaName,
    issue_summary: input.issueSummary || null,
    mode: input.mode,
    scheduled_date: input.scheduledDate || null,
    scheduled_time: input.scheduledTime || null,
    fee_amount: fee,
    status: "pending",
    payment_status: "pending",
  }).select("id").single();

  if (error) return { ok: false, error: error.message };

  try {
    const admin = createAdminClient() as unknown as SupabaseClient;
    const { data: lawyerProfile } = await admin.from("profiles").select("email, full_name").eq("id", input.lawyerId).maybeSingle();
    await Promise.all([
      sendTransactionalEmail({
        to: user.email,
        subject: "Your consultation request was sent",
        title: "Consultation request sent",
        body: `Your request with ${lawyer.full_name} has been sent. You will be notified when the advocate responds.`,
        path: "/dashboard/client/bookings",
        idempotencyKey: `booking-created-client-${created?.id}`,
      }),
      sendTransactionalEmail({
        to: (lawyerProfile as { email?: string } | null)?.email,
        subject: "New consultation request",
        title: "New consultation request",
        body: `${profile.full_name} requested a consultation on WakeelHub.`,
        path: "/dashboard/lawyer/bookings",
        idempotencyKey: `booking-created-lawyer-${created?.id}`,
      }),
    ]);
  } catch (mailError) {
    console.warn("Booking notification email skipped", mailError);
  }

  revalidateDashboards();
  return { ok: true };
}

/**
 * Lawyer accepts or rejects a pending booking. RLS restricts the update to
 * the booking's own lawyer; a trigger notifies the client of the outcome.
 */
export async function respondToBooking(
  bookingId: string,
  decision: "accept" | "reject",
  reason?: string
): Promise<ActionResult> {
  const supabase = await db();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, requireAuth: true, error: "Please log in again." };

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, lawyer_id, client_id, lawyer_name, status")
    .eq("id", bookingId)
    .maybeSingle();

  if (!booking || booking.lawyer_id !== user.id) {
    return { ok: false, error: "Booking not found." };
  }

  const patch: Record<string, unknown> = {
    status: decision === "accept" ? "confirmed" : "rejected",
  };
  if (decision === "reject" && reason) patch.cancellation_reason = reason;

  const { error } = await supabase.from("bookings").update(patch).eq("id", bookingId);
  if (error) return { ok: false, error: error.message };

  try {
    const admin = createAdminClient() as unknown as SupabaseClient;
    const { data: clientProfile } = await admin.from("profiles").select("email, full_name").eq("id", booking.client_id).maybeSingle();
    await sendTransactionalEmail({
      to: (clientProfile as { email?: string } | null)?.email,
      subject: decision === "accept" ? "Your consultation was confirmed" : "Your consultation request was declined",
      title: decision === "accept" ? "Consultation confirmed" : "Consultation declined",
      body:
        decision === "accept"
          ? `${booking.lawyer_name ?? "Your advocate"} confirmed your consultation. You can pay and track it from your dashboard.`
          : `${booking.lawyer_name ?? "Your advocate"} declined this request.${reason ? ` Reason: ${reason}` : ""}`,
      path: "/dashboard/client/bookings",
      idempotencyKey: `booking-response-${bookingId}-${decision}`,
    });
  } catch (mailError) {
    console.warn("Booking response email skipped", mailError);
  }

  revalidateDashboards();
  return { ok: true };
}

/** Lawyer marks a confirmed consultation as completed. */
export async function completeBooking(bookingId: string): Promise<ActionResult> {
  const supabase = await db();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, requireAuth: true, error: "Please log in again." };

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, lawyer_id")
    .eq("id", bookingId)
    .maybeSingle();
  if (!booking || booking.lawyer_id !== user.id) return { ok: false, error: "Booking not found." };

  const { error } = await supabase.from("bookings").update({ status: "completed" }).eq("id", bookingId);
  if (error) return { ok: false, error: error.message };

  revalidateDashboards();
  return { ok: true };
}

/** Mark all of the signed-in user's notifications as read. */
export async function markAllNotificationsRead(): Promise<ActionResult> {
  const supabase = await db();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, requireAuth: true };

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/client/notifications");
  revalidatePath("/dashboard/lawyer/notifications");
  revalidatePath("/dashboard/client");
  revalidatePath("/dashboard/lawyer");
  return { ok: true };
}

/** Permanently removes the signed-in user's already-read notifications (RLS-scoped). */
export async function clearReadNotifications(): Promise<ActionResult> {
  const supabase = await db();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, requireAuth: true };

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("user_id", user.id)
    .eq("is_read", true);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/client/notifications");
  revalidatePath("/dashboard/lawyer/notifications");
  revalidatePath("/dashboard/client");
  revalidatePath("/dashboard/lawyer");
  return { ok: true };
}
