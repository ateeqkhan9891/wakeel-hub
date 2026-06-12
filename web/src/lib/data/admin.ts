import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

async function db(): Promise<SupabaseClient> {
  return (await createClient()) as unknown as SupabaseClient;
}

export interface AdminStats {
  totalUsers: number;
  totalClients: number;
  totalLawyers: number;
  verifiedLawyers: number;
  pendingVerifications: number;
  rejectedVerifications: number;
  totalBookings: number;
  totalCases: number;
  activeCases: number;
  totalRevenue: number;
  monthlyRevenue: number;
  failedPayments: number;
  openComplaints: number;
  expiringSubscriptions: number;
}

const OPEN_CASE_STATUSES = ["pending", "active", "in_progress", "adjourned"];

function startOfMonthISO(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await db();
  const head = { count: "exact" as const, head: true };
  const monthStart = startOfMonthISO();
  const nowISO = new Date().toISOString();
  const in7Days = new Date(Date.now() + 7 * 86_400_000).toISOString();

  const [
    users, clients, lawyers, verified, pending, rejected, bookings, cases, activeCases,
    openComplaints, expiring, payments,
  ] = await Promise.all([
    supabase.from("profiles").select("id", head),
    supabase.from("profiles").select("id", head).eq("role", "client"),
    supabase.from("profiles").select("id", head).eq("role", "lawyer"),
    supabase.from("lawyers").select("id", head).eq("is_verified", true),
    supabase.from("verification_requests").select("id", head).eq("status", "pending"),
    supabase.from("verification_requests").select("id", head).eq("status", "rejected"),
    supabase.from("bookings").select("id", head),
    supabase.from("cases").select("id", head),
    supabase.from("cases").select("id", head).in("status", OPEN_CASE_STATUSES),
    supabase.from("complaints").select("id", head).in("status", ["open", "investigating"]),
    supabase.from("lawyers").select("id", head).eq("subscription_status", "active").gte("subscription_expires_at", nowISO).lte("subscription_expires_at", in7Days),
    supabase.from("payments").select("paid_amount, payment_date, created_at, status"),
  ]);

  const payRows = (payments.data as { paid_amount: number; payment_date: string | null; created_at: string | null; status: string | null }[] | null) ?? [];
  let revenue = 0;
  let monthlyRevenue = 0;
  let failedPayments = 0;
  for (const p of payRows) {
    const amt = Number(p.paid_amount || 0);
    revenue += amt;
    const when = p.payment_date ?? p.created_at;
    if (when && when >= monthStart) monthlyRevenue += amt;
    if (p.status === "failed") failedPayments += 1;
  }

  return {
    totalUsers: users.count ?? 0,
    totalClients: clients.count ?? 0,
    totalLawyers: lawyers.count ?? 0,
    verifiedLawyers: verified.count ?? 0,
    pendingVerifications: pending.count ?? 0,
    rejectedVerifications: rejected.count ?? 0,
    totalBookings: bookings.count ?? 0,
    totalCases: cases.count ?? 0,
    activeCases: activeCases.count ?? 0,
    totalRevenue: revenue,
    monthlyRevenue,
    failedPayments,
    openComplaints: openComplaints.count ?? 0,
    expiringSubscriptions: expiring.count ?? 0,
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "client" | "lawyer" | "admin";
  city: string | null;
  createdAt: string;
  isVerified: boolean;
}

export async function getAdminUsers(limit = 100): Promise<AdminUser[]> {
  const supabase = await db();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, city, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  const rows = (profiles as { id: string; full_name: string; email: string; role: string; city: string | null; created_at: string }[] | null) ?? [];
  const lawyerIds = rows.filter((r) => r.role === "lawyer").map((r) => r.id);

  const verifiedSet = new Set<string>();
  if (lawyerIds.length) {
    const { data: lawyers } = await supabase.from("lawyers").select("id, is_verified").in("id", lawyerIds);
    for (const l of (lawyers as { id: string; is_verified: boolean }[] | null) ?? []) {
      if (l.is_verified) verifiedSet.add(l.id);
    }
  }

  return rows.map((r) => ({
    id: r.id,
    name: r.full_name || "-",
    email: r.email,
    role: (r.role as AdminUser["role"]) ?? "client",
    city: r.city,
    createdAt: r.created_at,
    isVerified: verifiedSet.has(r.id),
  }));
}

export interface AdminCase {
  id: string;
  title: string;
  caseNumber: string | null;
  court: string | null;
  status: string;
  clientName: string | null;
  lawyerName: string;
  nextHearing: string | null;
  updatedAt: string;
}

export async function getAdminCases(limit = 100): Promise<AdminCase[]> {
  const supabase = await db();
  const { data } = await supabase
    .from("cases")
    .select("id, title, case_number, court, status, client_name, lawyer_id, next_hearing_date, updated_at")
    .order("updated_at", { ascending: false })
    .limit(limit);

  const rows = (data as { id: string; title: string; case_number: string | null; court: string | null; status: string; client_name: string | null; lawyer_id: string; next_hearing_date: string | null; updated_at: string }[] | null) ?? [];
  const lawyerIds = [...new Set(rows.map((r) => r.lawyer_id))];
  const nameById = new Map<string, string>();
  if (lawyerIds.length) {
    const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", lawyerIds);
    for (const p of (profiles as { id: string; full_name: string }[] | null) ?? []) nameById.set(p.id, p.full_name);
  }

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    caseNumber: r.case_number,
    court: r.court,
    status: r.status,
    clientName: r.client_name,
    lawyerName: nameById.get(r.lawyer_id) ?? "-",
    nextHearing: r.next_hearing_date,
    updatedAt: r.updated_at,
  }));
}

export interface AdminPayment {
  id: string;
  reference: string;
  type: string;
  total: number;
  paid: number;
  remaining: number;
  status: string;
  method: string | null;
  clientName: string;
  lawyerName: string;
  date: string;
}

export async function getAdminPayments(limit = 100): Promise<AdminPayment[]> {
  const supabase = await db();
  const { data } = await supabase
    .from("payments")
    .select("id, reference_number, payment_type, total_amount, paid_amount, remaining_amount, status, method, client_id, lawyer_id, payment_date, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  const rows = (data as Record<string, unknown>[] | null) ?? [];
  const ids = [...new Set(rows.flatMap((r) => [r.client_id, r.lawyer_id]).filter(Boolean) as string[])];
  const nameById = new Map<string, string>();
  if (ids.length) {
    const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", ids);
    for (const p of (profiles as { id: string; full_name: string }[] | null) ?? []) nameById.set(p.id, p.full_name);
  }

  return rows.map((r) => ({
    id: r.id as string,
    reference: (r.reference_number as string) ?? "-",
    type: ((r.payment_type as string) ?? "other").replace(/_/g, " "),
    total: Number(r.total_amount ?? 0),
    paid: Number(r.paid_amount ?? 0),
    remaining: Number(r.remaining_amount ?? 0),
    status: (r.status as string) ?? "pending",
    method: (r.method as string) ?? null,
    clientName: nameById.get(r.client_id as string) ?? "-",
    lawyerName: nameById.get(r.lawyer_id as string) ?? "-",
    date: (r.payment_date as string) ?? (r.created_at as string),
  }));
}

export interface AdminComplaint {
  id: string;
  subject: string;
  category: string;
  description: string | null;
  status: string;
  reportedBy: string;
  against: string | null;
  createdAt: string;
}

export async function getAdminComplaints(limit = 100): Promise<AdminComplaint[]> {
  const supabase = await db();
  const { data } = await supabase
    .from("complaints")
    .select("id, subject, category, description, status, reporter_id, against_id, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  const rows = (data as { id: string; subject: string; category: string; description: string | null; status: string; reporter_id: string; against_id: string | null; created_at: string }[] | null) ?? [];
  const ids = [...new Set(rows.flatMap((r) => [r.reporter_id, r.against_id]).filter(Boolean) as string[])];
  const nameById = new Map<string, string>();
  if (ids.length) {
    const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", ids);
    for (const p of (profiles as { id: string; full_name: string }[] | null) ?? []) nameById.set(p.id, p.full_name);
  }

  return rows.map((r) => ({
    id: r.id,
    subject: r.subject,
    category: r.category,
    description: r.description,
    status: r.status,
    reportedBy: nameById.get(r.reporter_id) ?? "-",
    against: r.against_id ? nameById.get(r.against_id) ?? "User" : null,
    createdAt: r.created_at,
  }));
}

export interface AdminReview {
  id: string;
  rating: number;
  comment: string | null;
  caseType: string | null;
  lawyerName: string;
  createdAt: string;
}

export async function getAdminReviews(limit = 12): Promise<AdminReview[]> {
  const supabase = await db();
  const { data } = await supabase
    .from("reviews")
    .select("id, rating, comment, case_type, lawyer_id, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  const rows = (data as { id: string; rating: number; comment: string | null; case_type: string | null; lawyer_id: string; created_at: string }[] | null) ?? [];
  const ids = [...new Set(rows.map((r) => r.lawyer_id))];
  const nameById = new Map<string, string>();
  if (ids.length) {
    const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", ids);
    for (const p of (profiles as { id: string; full_name: string }[] | null) ?? []) nameById.set(p.id, p.full_name);
  }

  return rows.map((r) => ({
    id: r.id,
    rating: Number(r.rating ?? 0),
    comment: r.comment,
    caseType: r.case_type,
    lawyerName: nameById.get(r.lawyer_id) ?? "Advocate",
    createdAt: r.created_at,
  }));
}

// ---- Subscriptions --------------------------------------------------------
export interface AdminSubscription {
  lawyerId: string;
  lawyerName: string;
  plan: string | null;
  period: string | null;
  status: string;
  amount: number;
  startedAt: string | null;
  expiresAt: string | null;
  daysRemaining: number | null;
  expired: boolean;
  paymentStatus: string;
}

export interface AdminSubscriptionStats {
  active: number;
  expired: number;
  renewalsThisMonth: number;
  cancelled: number;
  mrr: number;
}

interface SubscriptionAggregate {
  rows: AdminSubscription[];
  stats: AdminSubscriptionStats;
}

/** All lawyers that have ever held a subscription, plus platform MRR/renewal stats. */
export async function getAdminSubscriptions(limit = 200): Promise<SubscriptionAggregate> {
  const supabase = await db();
  const monthStart = startOfMonthISO();
  const now = Date.now();

  const { data: lawyerRows } = await supabase
    .from("lawyers")
    .select("id, subscription_plan, subscription_period, subscription_status, subscription_started_at, subscription_expires_at")
    .not("subscription_plan", "is", null)
    .order("subscription_expires_at", { ascending: false })
    .limit(limit);

  const lawyers = (lawyerRows as Record<string, unknown>[] | null) ?? [];
  const ids = [...new Set(lawyers.map((l) => l.id as string))];

  const [{ data: profiles }, { data: payments }] = await Promise.all([
    ids.length ? supabase.from("profiles").select("id, full_name").in("id", ids) : Promise.resolve({ data: [] }),
    supabase.from("subscription_payments").select("lawyer_id, amount, status, created_at, paid_at").order("created_at", { ascending: false }),
  ]);

  const nameById = new Map((profiles as { id: string; full_name: string }[] | null ?? []).map((p) => [p.id, p.full_name]));

  const latestPayByLawyer = new Map<string, { amount: number; status: string }>();
  let renewalsThisMonth = 0;
  for (const p of (payments as { lawyer_id: string; amount: number; status: string; created_at: string | null; paid_at: string | null }[] | null) ?? []) {
    if (!latestPayByLawyer.has(p.lawyer_id)) latestPayByLawyer.set(p.lawyer_id, { amount: Number(p.amount || 0), status: p.status ?? "paid" });
    const when = p.paid_at ?? p.created_at;
    if (when && when >= monthStart && p.status === "paid") renewalsThisMonth += 1;
  }

  let active = 0, expired = 0, cancelled = 0, mrr = 0;
  const rows: AdminSubscription[] = lawyers.map((l) => {
    const expiresAt = (l.subscription_expires_at as string) ?? null;
    const status = (l.subscription_status as string) ?? "inactive";
    const period = (l.subscription_period as string) ?? null;
    const isExpired = expiresAt ? new Date(expiresAt).getTime() < now : false;
    const pay = latestPayByLawyer.get(l.id as string);
    const amount = pay?.amount ?? 0;
    const daysRemaining = expiresAt ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - now) / 86_400_000)) : null;

    if (status === "cancelled") cancelled += 1;
    else if (status === "active" && !isExpired) {
      active += 1;
      mrr += period === "annual" ? amount / 12 : amount;
    } else if (isExpired) expired += 1;

    return {
      lawyerId: l.id as string,
      lawyerName: nameById.get(l.id as string) ?? "Advocate",
      plan: (l.subscription_plan as string) ?? null,
      period,
      status: isExpired && status === "active" ? "expired" : status,
      amount,
      startedAt: (l.subscription_started_at as string) ?? null,
      expiresAt,
      daysRemaining,
      expired: isExpired,
      paymentStatus: pay?.status ?? "-",
    };
  });

  return { rows, stats: { active, expired, renewalsThisMonth, cancelled, mrr: Math.round(mrr) } };
}
