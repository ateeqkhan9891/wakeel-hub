import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { BookingRow } from "@/lib/data/booking-types";

export { MODE_LABEL } from "@/lib/data/booking-types";
export type { BookingRow } from "@/lib/data/booking-types";

/** Bookings made by the signed-in client (RLS also enforces this). */
export async function getClientBookings(): Promise<BookingRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("bookings")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  return (data as BookingRow[] | null) ?? [];
}

/** Bookings addressed to the signed-in lawyer (RLS also enforces this). */
export async function getLawyerBookings(): Promise<BookingRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("bookings")
    .select("*")
    .eq("lawyer_id", user.id)
    .order("created_at", { ascending: false });

  return (data as BookingRow[] | null) ?? [];
}

