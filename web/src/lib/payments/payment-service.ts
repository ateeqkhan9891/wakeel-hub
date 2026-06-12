import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTransactionalEmail } from "@/lib/email";

type AdminClient = SupabaseClient;
type PaymentStatus = "pending" | "paid" | "failed";

export const PRO_PRICE: Record<"monthly" | "annual", number> = { monthly: 2000, annual: 18000 };

export function subscriptionExpiry(period: "monthly" | "annual", from = new Date()) {
  const expires = new Date(from);
  if (period === "annual") expires.setFullYear(expires.getFullYear() + 1);
  else expires.setMonth(expires.getMonth() + 1);
  return expires.toISOString();
}

function paymentStatusFromGateway(status: PaymentStatus) {
  return status === "paid" ? "paid" : status === "failed" ? "failed" : "pending";
}

function revalidatePaymentPaths() {
  revalidatePath("/dashboard/client/payments");
  revalidatePath("/dashboard/client/bookings");
  revalidatePath("/dashboard/lawyer/payments");
  revalidatePath("/dashboard/lawyer/bookings");
  revalidatePath("/dashboard/admin/payments");
}

export async function confirmConsultationPayment(
  reference: string,
  status: PaymentStatus,
  gatewayFee?: number,
  supabase: AdminClient = createAdminClient() as unknown as AdminClient
) {
  const { data: existing, error: readError } = await supabase
    .from("consultation_payments")
    .select("*, bookings(lawyer_name)")
    .eq("transaction_reference", reference)
    .maybeSingle();

  if (readError) throw readError;
  if (!existing) return { ok: false, error: "Payment reference not found." };

  const row = existing as Record<string, unknown>;
  if (row.payment_status === "paid") return { ok: true, paymentId: row.id as string, alreadyConfirmed: true };

  const paymentStatus = paymentStatusFromGateway(status);
  const now = new Date().toISOString();

  const update: Record<string, unknown> = {
    payment_status: paymentStatus,
    updated_at: now,
  };
  if (paymentStatus === "paid") update.paid_at = now;
  if (typeof gatewayFee === "number" && Number.isFinite(gatewayFee)) {
    update.gateway_fee = gatewayFee;
    const gross = Number(row.gross_amount ?? 0);
    const commission = Number(row.platform_commission_amount ?? 0);
    update.lawyer_net_amount = Math.max(0, Math.round((gross - commission - gatewayFee) * 100) / 100);
  }

  const { error: updateError } = await supabase.from("consultation_payments").update(update).eq("id", row.id as string);
  if (updateError) throw updateError;

  if (paymentStatus === "paid") {
    await supabase.from("bookings").update({ payment_status: "paid", status: "confirmed" }).eq("id", row.booking_id as string);

    const bookings = (row.bookings ?? {}) as { lawyer_name?: string };
    const gross = Number(row.gross_amount ?? 0);
    const currency = (row.currency as string) ?? "PKR";
    const lawyerNet = Number(update.lawyer_net_amount ?? row.lawyer_net_amount ?? 0);

    await supabase.from("notifications").insert([
      {
        user_id: row.lawyer_id as string,
        type: "payment",
        title: "Consultation paid",
        body: `A client paid ${currency} ${gross.toLocaleString()} for a consultation. Your net earning is ${currency} ${lawyerNet.toLocaleString()}.`,
        related_entity_type: "booking",
        related_entity_id: row.booking_id as string,
      },
      {
        user_id: row.client_id as string,
        type: "payment",
        title: "Payment successful",
        body: `Your consultation with ${bookings.lawyer_name ?? "your advocate"} is confirmed.`,
        related_entity_type: "booking",
        related_entity_id: row.booking_id as string,
      },
    ]);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .in("id", [row.client_id as string, row.lawyer_id as string]);
    const byId = new Map(((profiles as { id: string; email: string; full_name: string }[] | null) ?? []).map((profile) => [profile.id, profile]));
    await Promise.all([
      sendTransactionalEmail({
        to: byId.get(row.client_id as string)?.email,
        subject: "Payment received",
        title: "Payment successful",
        body: `Your consultation payment of ${currency} ${gross.toLocaleString()} was received and your booking is confirmed.`,
        path: `/dashboard/client/payments/${row.id}/invoice`,
        idempotencyKey: `consultation-payment-client-${row.id}`,
      }),
      sendTransactionalEmail({
        to: byId.get(row.lawyer_id as string)?.email,
        subject: "Consultation paid",
        title: "Consultation paid",
        body: `A client paid ${currency} ${gross.toLocaleString()}. Your net earning is ${currency} ${lawyerNet.toLocaleString()}.`,
        path: "/dashboard/lawyer/payments",
        idempotencyKey: `consultation-payment-lawyer-${row.id}`,
      }),
    ]);
  }

  revalidatePaymentPaths();
  return { ok: true, paymentId: row.id as string };
}

export async function confirmSubscriptionPayment(
  reference: string,
  status: PaymentStatus,
  supabase: AdminClient = createAdminClient() as unknown as AdminClient
) {
  const { data: existing, error: readError } = await supabase
    .from("subscription_payments")
    .select("*")
    .eq("reference_number", reference)
    .maybeSingle();

  if (readError) throw readError;
  if (!existing) return { ok: false, error: "Subscription reference not found." };

  const row = existing as Record<string, unknown>;
  if (row.status === "paid") return { ok: true, invoiceId: row.id as string, alreadyConfirmed: true };

  const paymentStatus = paymentStatusFromGateway(status);
  const now = new Date().toISOString();

  const { error: paymentError } = await supabase
    .from("subscription_payments")
    .update({ status: paymentStatus, paid_at: paymentStatus === "paid" ? now : row.paid_at })
    .eq("id", row.id as string);
  if (paymentError) throw paymentError;

  if (paymentStatus === "paid") {
    const period = row.period === "annual" ? "annual" : "monthly";
    const { error: lawyerError } = await supabase
      .from("lawyers")
      .update({
        subscription_plan: "pro",
        subscription_period: period,
        subscription_status: "active",
        subscription_started_at: now,
        subscription_expires_at: subscriptionExpiry(period, new Date(now)),
      })
      .eq("id", row.lawyer_id as string);
    if (lawyerError) throw lawyerError;

    await supabase.from("notifications").insert({
      user_id: row.lawyer_id as string,
      type: "payment",
      title: "Pro subscription active",
      body: "Your WakeelHub Pro payment was confirmed and your 0% commission plan is active.",
      related_entity_type: "subscription_payment",
      related_entity_id: row.id as string,
    });

    const { data: profile } = await supabase.from("profiles").select("email").eq("id", row.lawyer_id as string).maybeSingle();
    await sendTransactionalEmail({
      to: (profile as { email?: string } | null)?.email,
      subject: "Pro subscription active",
      title: "WakeelHub Pro is active",
      body: "Your Pro payment was confirmed. Your 0% commission plan is now active.",
      path: `/dashboard/lawyer/billing/${row.id}/invoice`,
      idempotencyKey: `subscription-paid-${row.id}`,
    });
  }

  revalidatePath("/dashboard/lawyer");
  revalidatePath("/dashboard/lawyer/billing");
  revalidatePath("/dashboard/lawyer/profile");
  revalidatePath("/find-lawyers");
  revalidatePath("/");
  return { ok: true, invoiceId: row.id as string };
}

export async function expirePastDueSubscriptions(supabase: AdminClient = createAdminClient() as unknown as AdminClient) {
  const now = new Date().toISOString();

  const { data: expiring, error: readError } = await supabase
    .from("lawyers")
    .select("id")
    .eq("subscription_plan", "pro")
    .eq("subscription_status", "active")
    .lt("subscription_expires_at", now);

  if (readError) throw readError;
  const rows = ((expiring as { id: string }[] | null) ?? []);
  if (rows.length === 0) return { ok: true, expired: 0 };

  const ids = rows.map((row) => row.id);
  const { error: updateError } = await supabase
    .from("lawyers")
    .update({ subscription_status: "inactive" })
    .in("id", ids);
  if (updateError) throw updateError;

  await supabase.from("notifications").insert(
    ids.map((id) => ({
      user_id: id,
      type: "payment",
      title: "Pro subscription expired",
      body: "Your Pro plan has expired. Renew to restore 0% commission and Pro placement.",
      related_entity_type: "subscription",
      related_entity_id: id,
    }))
  );

  revalidatePath("/find-lawyers");
  revalidatePath("/");
  return { ok: true, expired: ids.length };
}
