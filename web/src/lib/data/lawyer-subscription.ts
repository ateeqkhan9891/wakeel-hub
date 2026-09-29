import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export interface SubscriptionPayment {
  id: string;
  plan: string;
  period: string;
  amount: number;
  reference: string;
  invoiceNumber: string;
  status: string;
  paidAt: string;
}

export interface LawyerSubscription {
  status: "inactive" | "active";
  plan: string | null;
  period: string | null;
  startedAt: string | null;
  expiresAt: string | null;
  daysRemaining: number | null; // null for commission / no expiry
  totalDays: number | null; // length of the current billing period
  expiringSoon: boolean; // <= 7 days left
  expired: boolean;
  currentAmount: number; // amount of the latest payment (Pro)
  isVerified: boolean;
  payments: SubscriptionPayment[];
}

function mapPayment(r: Record<string, unknown>): SubscriptionPayment {
  return {
    id: r.id as string,
    plan: (r.plan as string) ?? "pro",
    period: (r.period as string) ?? "monthly",
    amount: Number(r.amount ?? 0),
    reference: (r.reference_number as string) ?? "-",
    invoiceNumber: (r.invoice_number as string) ?? "-",
    status: (r.status as string) ?? "paid",
    paidAt: (r.paid_at as string) ?? (r.created_at as string),
  };
}

export async function getLawyerSubscription(): Promise<LawyerSubscription | null> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: lawyer }, { data: payments }] = await Promise.all([
    supabase.from("lawyers").select("subscription_plan, subscription_period, subscription_status, subscription_started_at, subscription_expires_at, is_verified").eq("id", user.id).maybeSingle(),
    supabase.from("subscription_payments").select("*").eq("lawyer_id", user.id).order("created_at", { ascending: false }),
  ]);

  const l = (lawyer ?? {}) as Record<string, unknown>;
  const startedAt = (l.subscription_started_at as string) ?? null;
  const expiresAt = (l.subscription_expires_at as string) ?? null;
  const period = (l.subscription_period as string) ?? null;

  const MS_DAY = 86_400_000;
  let daysRemaining: number | null = null;
  let totalDays: number | null = null;
  if (expiresAt) {
    daysRemaining = Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / MS_DAY));
    totalDays = period === "annual" ? 365 : 30;
    if (startedAt) {
      const span = Math.round((new Date(expiresAt).getTime() - new Date(startedAt).getTime()) / MS_DAY);
      if (span > 0) totalDays = span;
    }
  }
  const expired = expiresAt ? new Date(expiresAt).getTime() < Date.now() : false;
  const mapped = ((payments as Record<string, unknown>[] | null) ?? []).map(mapPayment);

  return {
    status: l.subscription_status === "active" ? "active" : "inactive",
    plan: (l.subscription_plan as string) ?? null,
    period,
    startedAt,
    expiresAt,
    daysRemaining,
    totalDays,
    expiringSoon: daysRemaining !== null && daysRemaining <= 7,
    expired,
    currentAmount: mapped[0]?.amount ?? 0,
    isVerified: l.is_verified === true,
    payments: mapped,
  };
}

export interface SubscriptionInvoice extends SubscriptionPayment {
  lawyerName: string;
  lawyerEmail: string;
}

export async function getSubscriptionInvoice(id: string): Promise<SubscriptionInvoice | null> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("subscription_payments").select("*").eq("id", id).eq("lawyer_id", user.id).maybeSingle();
  if (!data) return null;

  const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", user.id).maybeSingle();
  const p = profile as { full_name?: string; email?: string } | null;

  return {
    ...mapPayment(data as Record<string, unknown>),
    lawyerName: p?.full_name ?? "Advocate",
    lawyerEmail: p?.email ?? user.email ?? "",
  };
}

