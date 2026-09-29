import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export interface ConsultationPaymentRow {
  id: string;
  bookingId: string;
  clientId: string;
  lawyerId: string;
  gross: number;
  commissionPct: number;
  commissionAmount: number;
  lawyerNet: number;
  gatewayFee: number;
  currency: string;
  paymentStatus: string;
  payoutStatus: string;
  provider: string;
  reference: string;
  receiptNumber: string;
  paidAt: string | null;
  createdAt: string;
}

function mapRow(r: Record<string, unknown>): ConsultationPaymentRow {
  return {
    id: r.id as string,
    bookingId: r.booking_id as string,
    clientId: r.client_id as string,
    lawyerId: r.lawyer_id as string,
    gross: Number(r.gross_amount ?? 0),
    commissionPct: Number(r.platform_commission_percentage ?? 0),
    commissionAmount: Number(r.platform_commission_amount ?? 0),
    lawyerNet: Number(r.lawyer_net_amount ?? 0),
    gatewayFee: Number(r.gateway_fee ?? 0),
    currency: (r.currency as string) ?? "PKR",
    paymentStatus: (r.payment_status as string) ?? "pending",
    payoutStatus: (r.payout_status as string) ?? "pending",
    provider: (r.provider as string) ?? "manual",
    reference: (r.transaction_reference as string) ?? "-",
    receiptNumber: (r.receipt_number as string) ?? "-",
    paidAt: (r.paid_at as string) ?? null,
    createdAt: r.created_at as string,
  };
}

export interface CommissionSettings {
  commissionPercentage: number;
  gatewayFeePercentage: number;
  currency: string;
}

export async function getCommissionSettings(): Promise<CommissionSettings> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const { data } = await supabase.from("platform_settings").select("*").eq("id", 1).maybeSingle();
  const s = (data ?? {}) as Record<string, unknown>;
  return {
    commissionPercentage: Number(s.commission_percentage ?? 20),
    gatewayFeePercentage: Number(s.gateway_fee_percentage ?? 0),
    currency: (s.currency as string) ?? "PKR",
  };
}

// ---- Lawyer earnings ------------------------------------------------------
export interface LawyerEarningRow extends ConsultationPaymentRow {
  clientName: string | null;
  bookingDate: string | null;
}

export interface LawyerEarnings {
  totalEarnings: number;
  pendingPayout: number;
  paidPayout: number;
  commissionDeducted: number;
  grossCollected: number;
  rows: LawyerEarningRow[];
}

export async function getLawyerEarnings(): Promise<LawyerEarnings | null> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("consultation_payments")
    .select("*, bookings(client_name, scheduled_date)")
    .eq("lawyer_id", user.id)
    .eq("payment_status", "paid")
    .order("created_at", { ascending: false });

  const rows: LawyerEarningRow[] = ((data as Record<string, unknown>[] | null) ?? []).map((r) => {
    const b = (r.bookings ?? {}) as { client_name?: string; scheduled_date?: string };
    return { ...mapRow(r), clientName: b.client_name ?? null, bookingDate: b.scheduled_date ?? null };
  });

  return {
    totalEarnings: rows.reduce((s, r) => s + r.lawyerNet, 0),
    pendingPayout: rows.filter((r) => r.payoutStatus === "pending" || r.payoutStatus === "processing").reduce((s, r) => s + r.lawyerNet, 0),
    paidPayout: rows.filter((r) => r.payoutStatus === "paid").reduce((s, r) => s + r.lawyerNet, 0),
    commissionDeducted: rows.reduce((s, r) => s + r.commissionAmount, 0),
    grossCollected: rows.reduce((s, r) => s + r.gross, 0),
    rows,
  };
}

// ---- Client receipts ------------------------------------------------------
export interface ClientReceiptRow extends ConsultationPaymentRow {
  lawyerName: string | null;
  bookingDate: string | null;
  bookingTime: string | null;
}

export async function getClientReceipts(): Promise<ClientReceiptRow[]> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("consultation_payments")
    .select("*, bookings(lawyer_name, scheduled_date, scheduled_time)")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  return ((data as Record<string, unknown>[] | null) ?? []).map((r) => {
    const b = (r.bookings ?? {}) as { lawyer_name?: string; scheduled_date?: string; scheduled_time?: string };
    return { ...mapRow(r), lawyerName: b.lawyer_name ?? null, bookingDate: b.scheduled_date ?? null, bookingTime: b.scheduled_time ?? null };
  });
}

export interface ClientReceipt extends ClientReceiptRow {
  clientName: string;
  clientEmail: string;
}

export async function getClientReceipt(id: string): Promise<ClientReceipt | null> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("consultation_payments")
    .select("*, bookings(lawyer_name, scheduled_date, scheduled_time)")
    .eq("id", id)
    .eq("client_id", user.id)
    .maybeSingle();
  if (!data) return null;
  const r = data as Record<string, unknown>;
  const b = (r.bookings ?? {}) as { lawyer_name?: string; scheduled_date?: string; scheduled_time?: string };

  const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", user.id).maybeSingle();
  const p = profile as { full_name?: string; email?: string } | null;

  return {
    ...mapRow(r),
    lawyerName: b.lawyer_name ?? null,
    bookingDate: b.scheduled_date ?? null,
    bookingTime: b.scheduled_time ?? null,
    clientName: p?.full_name ?? "Client",
    clientEmail: p?.email ?? user.email ?? "",
  };
}

// ---- Admin commission overview -------------------------------------------
export interface AdminPaymentRow extends ConsultationPaymentRow {
  clientName: string | null;
  lawyerName: string | null;
}

export interface AdminCommissionOverview {
  totalGross: number;
  totalCommission: number;
  totalLawyerPayable: number;
  totalGatewayFees: number;
  rows: AdminPaymentRow[];
}

export async function getAdminCommissionOverview(limit = 200): Promise<AdminCommissionOverview> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const { data } = await supabase
    .from("consultation_payments")
    .select("*, bookings(client_name, lawyer_name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  const rows: AdminPaymentRow[] = ((data as Record<string, unknown>[] | null) ?? []).map((r) => {
    const b = (r.bookings ?? {}) as { client_name?: string; lawyer_name?: string };
    return { ...mapRow(r), clientName: b.client_name ?? null, lawyerName: b.lawyer_name ?? null };
  });

  const paid = rows.filter((r) => r.paymentStatus === "paid");
  return {
    totalGross: paid.reduce((s, r) => s + r.gross, 0),
    totalCommission: paid.reduce((s, r) => s + r.commissionAmount, 0),
    totalLawyerPayable: paid.filter((r) => r.payoutStatus !== "paid" && r.payoutStatus !== "cancelled").reduce((s, r) => s + r.lawyerNet, 0),
    totalGatewayFees: paid.reduce((s, r) => s + r.gatewayFee, 0),
    rows,
  };
}

