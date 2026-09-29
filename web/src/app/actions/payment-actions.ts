"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getPaymentProvider } from "@/lib/payments/provider";

export interface PaymentResult {
  ok: boolean;
  error?: string;
  paymentId?: string;
  checkoutUrl?: string;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

async function isAdmin(supabase: SupabaseClient, uid: string): Promise<boolean> {
  const { data } = await supabase.from("profiles").select("role").eq("id", uid).maybeSingle();
  return (data as { role?: string } | null)?.role === "admin";
}

async function requestOrigin() {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function paymentReference(prefix: string, id: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${id.slice(0, 8).toUpperCase()}`;
}

/**
 * Starts consultation checkout. The payment row remains pending until the
 * gateway callback confirms it with the service role.
 */
export async function payForBooking(bookingId: string): Promise<PaymentResult> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, client_id, lawyer_id, fee_amount, payment_status, lawyer_name")
    .eq("id", bookingId)
    .maybeSingle();
  if (!booking) return { ok: false, error: "Booking not found." };
  if (booking.client_id !== user.id) return { ok: false, error: "This booking isn't yours." };
  if (booking.payment_status === "paid") return { ok: false, error: "This consultation is already paid." };

  const gross = Number(booking.fee_amount ?? 0);
  if (gross <= 0) return { ok: false, error: "This consultation has no fee set." };

  const provider = getPaymentProvider();
  const origin = await requestOrigin();

  const { data: existing } = await supabase
    .from("consultation_payments")
    .select("id, transaction_reference, payment_status, gross_amount, currency")
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (existing) {
    const row = existing as Record<string, unknown>;
    if (row.payment_status === "paid") return { ok: true, paymentId: row.id as string };

    const checkout = await provider.createCheckout({
      amount: Number(row.gross_amount ?? gross),
      currency: (row.currency as string) ?? "PKR",
      reference: row.transaction_reference as string,
      kind: "consultation",
      description: "Legal consultation",
      customerEmail: user.email ?? undefined,
      origin,
      successPath: `/dashboard/client/payments/${row.id}/invoice`,
      failurePath: "/dashboard/client/bookings?payment=failed",
    });
    return { ok: true, paymentId: row.id as string, checkoutUrl: checkout.checkoutUrl };
  }

  const { data: settings } = await supabase.from("platform_settings").select("*").eq("id", 1).maybeSingle();
  const s = (settings ?? {}) as Record<string, unknown>;
  const currency = (s.currency as string) ?? "PKR";
  const gatewayPct = Number(s.gateway_fee_percentage ?? 0);

  const { data: lawyer } = await supabase.from("lawyers").select("subscription_plan, subscription_status").eq("id", booking.lawyer_id).maybeSingle();
  const lw = (lawyer ?? {}) as Record<string, unknown>;
  const isPro = lw.subscription_plan === "pro" && lw.subscription_status === "active";
  const commissionPct = isPro ? 0 : Number(s.commission_percentage ?? 20);

  const commissionAmount = round2((gross * commissionPct) / 100);
  const gatewayFee = round2((gross * gatewayPct) / 100);
  const lawyerNet = round2(gross - commissionAmount - gatewayFee);
  const ref = paymentReference("CON", bookingId);

  const { data: inserted, error } = await supabase
    .from("consultation_payments")
    .insert({
      booking_id: bookingId,
      client_id: booking.client_id,
      lawyer_id: booking.lawyer_id,
      gross_amount: gross,
      platform_commission_percentage: commissionPct,
      platform_commission_amount: commissionAmount,
      lawyer_net_amount: lawyerNet,
      gateway_fee: gatewayFee,
      currency,
      payment_status: "pending",
      payout_status: "pending",
      provider: provider.name,
      transaction_reference: ref,
      paid_at: null,
    })
    .select("id, transaction_reference")
    .single();
  if (error) return { ok: false, error: error.message };

  const paymentId = inserted?.id as string | undefined;
  const checkout = await provider.createCheckout({
    amount: gross,
    currency,
    reference: (inserted?.transaction_reference as string | undefined) ?? ref,
    kind: "consultation",
    description: "Legal consultation",
    customerEmail: user.email ?? undefined,
    origin,
    successPath: paymentId ? `/dashboard/client/payments/${paymentId}/invoice` : "/dashboard/client/payments",
    failurePath: "/dashboard/client/bookings?payment=failed",
  });

  revalidatePath("/dashboard/client/payments");
  revalidatePath("/dashboard/client/bookings");
  revalidatePath("/dashboard/admin/payments");
  return { ok: true, paymentId, checkoutUrl: checkout.checkoutUrl };
}

const PAYOUT_STATUSES = ["pending", "processing", "paid", "failed", "cancelled"] as const;

export async function updatePayoutStatus(paymentId: string, status: string): Promise<PaymentResult> {
  if (!PAYOUT_STATUSES.includes(status as (typeof PAYOUT_STATUSES)[number])) return { ok: false, error: "Invalid payout status." };
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };
  if (!(await isAdmin(supabase, user.id))) return { ok: false, error: "Admins only." };

  const { error } = await supabase
    .from("consultation_payments")
    .update({ payout_status: status, payout_at: status === "paid" ? new Date().toISOString() : null, updated_at: new Date().toISOString() })
    .eq("id", paymentId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/admin/payments");
  revalidatePath("/dashboard/lawyer/payments");
  return { ok: true };
}

export async function bulkUpdatePayoutStatus(paymentIds: string[], status: string): Promise<PaymentResult> {
  if (!PAYOUT_STATUSES.includes(status as (typeof PAYOUT_STATUSES)[number])) return { ok: false, error: "Invalid payout status." };
  if (paymentIds.length === 0) return { ok: false, error: "Select at least one payout." };

  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };
  if (!(await isAdmin(supabase, user.id))) return { ok: false, error: "Admins only." };

  const { error } = await supabase
    .from("consultation_payments")
    .update({ payout_status: status, payout_at: status === "paid" ? new Date().toISOString() : null, updated_at: new Date().toISOString() })
    .in("id", paymentIds);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/admin/payments");
  revalidatePath("/dashboard/lawyer/payments");
  return { ok: true };
}

export async function updateCommissionSettings(commissionPercentage: number, gatewayFeePercentage: number): Promise<PaymentResult> {
  if (commissionPercentage < 0 || commissionPercentage > 100) return { ok: false, error: "Commission must be between 0 and 100." };
  if (gatewayFeePercentage < 0 || gatewayFeePercentage > 100) return { ok: false, error: "Gateway fee must be between 0 and 100." };

  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };
  if (!(await isAdmin(supabase, user.id))) return { ok: false, error: "Admins only." };

  const { error } = await supabase
    .from("platform_settings")
    .update({ commission_percentage: commissionPercentage, gateway_fee_percentage: gatewayFeePercentage, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/admin/payments");
  return { ok: true };
}

