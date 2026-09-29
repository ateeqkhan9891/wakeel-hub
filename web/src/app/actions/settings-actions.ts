"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export interface SettingsResult {
  ok: boolean;
  error?: string;
}

export interface LawyerSettingsInput {
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

function toNum(v: string): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function toIntOrNull(v: string): number | null {
  if (!v.trim()) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

export async function updateLawyerSettings(input: LawyerSettingsInput): Promise<SettingsResult> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  const { error } = await supabase.from("lawyer_settings").upsert(
    {
      lawyer_id: user.id,
      online_consultation_fee: toNum(input.onlineFee),
      in_person_consultation_fee: toNum(input.officeFee),
      phone_consultation_fee: toNum(input.phoneFee),
      follow_up_consultation_fee: toIntOrNull(input.followUpFee),
      consultation_duration_minutes: toIntOrNull(input.durationMinutes) ?? 30,
      free_initial_consultation: input.freeInitial,
      accepts_online_consultations: input.acceptsOnline,
      accepts_in_person_consultations: input.acceptsInPerson,
      availability_days: input.availabilityDays,
      availability_slots: input.availabilitySlots,
      availability_hours: input.availabilityHours || null,
      show_phone_publicly: input.showPhone,
      show_email_publicly: input.showEmail,
      notify_bookings: input.notifyBookings,
      notify_messages: input.notifyMessages,
      notify_payments: input.notifyPayments,
      hearing_reminders: input.hearingReminders,
    },
    { onConflict: "lawyer_id" }
  );
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/lawyer/settings");
  revalidatePath("/dashboard/lawyer/profile");
  revalidatePath("/find-lawyers");
  return { ok: true };
}

export async function changePassword(newPassword: string): Promise<SettingsResult> {
  if (newPassword.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

