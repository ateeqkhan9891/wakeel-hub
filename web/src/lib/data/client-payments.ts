import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export interface ClientPayment {
  id: string;
  reference: string;
  type: string;
  description: string | null;
  total: number;
  paid: number;
  remaining: number;
  status: string;
  method: string | null;
  date: string;
  dueDate: string | null;
  lawyerName: string | null;
}

export interface ClientPaymentInvoice extends ClientPayment {
  clientName: string;
  clientEmail: string;
  createdAt: string;
}

function mapRow(r: Record<string, unknown>, lawyerName: string | null): ClientPayment {
  return {
    id: r.id as string,
    reference: (r.reference_number as string) ?? "-",
    type: ((r.payment_type as string) ?? "other").replace(/_/g, " "),
    description: (r.description as string) ?? null,
    total: Number(r.total_amount ?? 0),
    paid: Number(r.paid_amount ?? 0),
    remaining: Number(r.remaining_amount ?? 0),
    status: (r.status as string) ?? "pending",
    method: (r.method as string) ?? null,
    date: (r.payment_date as string) ?? (r.created_at as string),
    dueDate: (r.due_date as string) ?? null,
    lawyerName,
  };
}

async function lawyerNamesByBooking(supabase: SupabaseClient, bookingIds: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (!bookingIds.length) return map;
  const { data } = await supabase.from("bookings").select("id, lawyer_name").in("id", bookingIds);
  for (const b of (data as { id: string; lawyer_name: string | null }[] | null) ?? []) {
    if (b.lawyer_name) map.set(b.id, b.lawyer_name);
  }
  return map;
}

export async function getClientPayments(): Promise<ClientPayment[]> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("payments")
    .select("id, reference_number, payment_type, description, total_amount, paid_amount, remaining_amount, status, method, payment_date, due_date, created_at, booking_id")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  const rows = (data as Record<string, unknown>[] | null) ?? [];
  const names = await lawyerNamesByBooking(supabase, [...new Set(rows.map((r) => r.booking_id).filter(Boolean) as string[])]);
  return rows.map((r) => mapRow(r, names.get(r.booking_id as string) ?? null));
}

export async function getClientPaymentInvoice(id: string): Promise<ClientPaymentInvoice | null> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("payments")
    .select("id, reference_number, payment_type, description, total_amount, paid_amount, remaining_amount, status, method, payment_date, due_date, created_at, booking_id")
    .eq("id", id)
    .eq("client_id", user.id)
    .maybeSingle();
  if (!data) return null;
  const r = data as Record<string, unknown>;

  const names = await lawyerNamesByBooking(supabase, r.booking_id ? [r.booking_id as string] : []);
  const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", user.id).maybeSingle();
  const p = profile as { full_name?: string; email?: string } | null;

  return {
    ...mapRow(r, names.get(r.booking_id as string) ?? null),
    clientName: p?.full_name ?? "Client",
    clientEmail: p?.email ?? user.email ?? "",
    createdAt: r.created_at as string,
  };
}
