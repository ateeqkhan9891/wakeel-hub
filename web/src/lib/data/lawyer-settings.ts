import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export interface LawyerSettings {
  email: string;
  lastSignInAt: string; // ISO | ""
  accountCreatedAt: string; // ISO | ""
  onlineFee: string;
  officeFee: string;
  phoneFee: string;
  followUpFee: string;
  durationMinutes: string;
  freeInitial: boolean;
  acceptsOnline: boolean;
  acceptsInPerson: boolean;
  availabilityDays: string[];
  availabilitySlots: string[];
  availabilityHours: string;
  showPhone: boolean;
  showEmail: boolean;
  notifyBookings: boolean;
  notifyMessages: boolean;
  notifyPayments: boolean;
  hearingReminders: boolean;
}

const numStr = (v: unknown, fb = ""): string => (typeof v === "number" ? String(v) : typeof v === "string" ? v : fb);
const arr = (v: unknown): string[] => (Array.isArray(v) ? (v as unknown[]).map(String) : []);
const bool = (v: unknown, fb = false): boolean => (typeof v === "boolean" ? v : fb);

export async function getLawyerSettings(): Promise<LawyerSettings | null> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: s }, { data: p }] = await Promise.all([
    supabase.from("lawyer_settings").select("*").eq("lawyer_id", user.id).maybeSingle(),
    supabase.from("profiles").select("email").eq("id", user.id).maybeSingle(),
  ]);
  const set = (s ?? {}) as Record<string, unknown>;

  return {
    email: (p as { email?: string } | null)?.email ?? user.email ?? "",
    lastSignInAt: user.last_sign_in_at ?? "",
    accountCreatedAt: user.created_at ?? "",
    onlineFee: numStr(set.online_consultation_fee, "2000"),
    officeFee: numStr(set.in_person_consultation_fee, "0"),
    phoneFee: numStr(set.phone_consultation_fee, "0"),
    followUpFee: numStr(set.follow_up_consultation_fee, ""),
    durationMinutes: numStr(set.consultation_duration_minutes, "30"),
    freeInitial: bool(set.free_initial_consultation),
    acceptsOnline: bool(set.accepts_online_consultations, true),
    acceptsInPerson: bool(set.accepts_in_person_consultations),
    availabilityDays: arr(set.availability_days),
    availabilitySlots: arr(set.availability_slots),
    availabilityHours: numStr(set.availability_hours, ""),
    showPhone: bool(set.show_phone_publicly),
    showEmail: bool(set.show_email_publicly),
    notifyBookings: bool(set.notify_bookings, true),
    notifyMessages: bool(set.notify_messages, true),
    notifyPayments: bool(set.notify_payments, true),
    hearingReminders: bool(set.hearing_reminders, true),
  };
}

