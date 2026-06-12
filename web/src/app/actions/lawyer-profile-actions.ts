"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { LawyerProfileUpdate } from "@/lib/data/lawyer-profile-types";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

function toNum(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
function toIntOrNull(value: string): number | null {
  if (!value.trim()) return null;
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
}
function genderToDb(value: string): string | null {
  if (value === "Male") return "male";
  if (value === "Female") return "female";
  return null;
}

/**
 * Persists the signed-in lawyer's full profile across profiles / lawyers /
 * lawyer_profiles / lawyer_settings / lawyer_practice_areas. Scoped to
 * auth.uid(); RLS enforces the same server-side.
 */
export async function updateLawyerProfile(input: LawyerProfileUpdate): Promise<ActionResult> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Your session expired. Please log in again." };
  const uid = user.id;

  const { error: pErr } = await supabase
    .from("profiles")
    .update({ full_name: input.name, phone: input.phone || null, city: input.city || null })
    .eq("id", uid);
  if (pErr) return { ok: false, error: pErr.message };

  const { error: lErr } = await supabase
    .from("lawyers")
    .update({
      gender: genderToDb(input.gender),
      date_of_birth: input.dateOfBirth || null,
      professional_title: input.professionalTitle || null,
      headline: input.professionalTitle || null,
      office_name: input.officeName || null,
      office_address: input.officeAddress || null,
      google_maps_link: input.googleMapsLink || null,
      bar_enrollment_year: toIntOrNull(input.barEnrollmentYear),
      bar_council_number: input.barCouncilNumber || null,
      license_number: input.licenseNumber || null,
      experience_years: toIntOrNull(input.experienceYears) ?? 0,
      about: input.about || null,
      languages: input.languages,
      courts: input.courts,
      education_entries: input.education,
      experience: input.experience,
      achievements: input.achievements,
      publications: input.publications,
    })
    .eq("id", uid);
  if (lErr) return { ok: false, error: lErr.message };

  const { error: lpErr } = await supabase
    .from("lawyer_profiles")
    .upsert(
      {
        lawyer_id: uid,
        photo_url: input.photoUrl || null,
        social_links: {
          linkedin: input.social.linkedin || "",
          facebook: input.social.facebook || "",
          website: input.social.website || "",
        },
      },
      { onConflict: "lawyer_id" }
    );
  if (lpErr) return { ok: false, error: lpErr.message };

  const { error: sErr } = await supabase
    .from("lawyer_settings")
    .upsert(
      {
        lawyer_id: uid,
        online_consultation_fee: toNum(input.onlineConsultationFee),
        in_person_consultation_fee: toNum(input.officeConsultationFee),
        phone_consultation_fee: toNum(input.phoneConsultationFee),
        free_initial_consultation: input.freeInitialConsultation,
        availability_days: input.availabilityDays,
        availability_slots: input.availabilitySlots,
        availability_hours: input.availabilityHours || null,
        accepts_online_consultations: true,
        accepts_in_person_consultations: toNum(input.officeConsultationFee) > 0,
        show_phone_publicly: input.showPhonePublicly,
        show_email_publicly: input.showEmailPublicly,
      },
      { onConflict: "lawyer_id" }
    );
  if (sErr) return { ok: false, error: sErr.message };

  // Replace practice-area set.
  const { data: areaRows } = await supabase
    .from("practice_areas")
    .select("id")
    .in("slug", input.practiceAreas.length ? input.practiceAreas : ["__none__"]);
  await supabase.from("lawyer_practice_areas").delete().eq("lawyer_id", uid);
  if (areaRows && areaRows.length) {
    const rows = (areaRows as { id: string }[]).map((a) => ({ lawyer_id: uid, practice_area_id: a.id }));
    const { error: paErr } = await supabase.from("lawyer_practice_areas").insert(rows);
    if (paErr) return { ok: false, error: paErr.message };
  }

  revalidatePath("/dashboard/lawyer/profile");
  revalidatePath("/dashboard/lawyer");
  revalidatePath("/find-lawyers");
  return { ok: true };
}

export interface VerificationDoc {
  type: "cnic_front" | "bar_council_card" | "law_license" | "enrollment_certificate";
  path: string;
}

/**
 * Submits the lawyer's private verification documents for admin review.
 * Creates a verification_requests row (status 'pending') and its document
 * rows. Documents live in the private `verification-documents` bucket.
 */
export async function submitVerification(
  barCouncilNumber: string,
  docs: VerificationDoc[]
): Promise<ActionResult> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Your session expired. Please log in again." };
  if (!barCouncilNumber.trim()) return { ok: false, error: "Enter your Bar Council enrollment number." };
  if (docs.length === 0) return { ok: false, error: "Upload at least your CNIC and Bar Council card." };

  const { data: vr, error: vErr } = await supabase
    .from("verification_requests")
    .insert({ lawyer_id: user.id, enrollment_number: barCouncilNumber, status: "pending" })
    .select("id")
    .single();
  if (vErr || !vr) return { ok: false, error: vErr?.message ?? "Could not create verification request." };

  if (docs.length) {
    const rows = docs.map((d) => ({ verification_request_id: vr.id, doc_type: d.type, storage_path: d.path }));
    const { error: dErr } = await supabase.from("verification_documents").insert(rows);
    if (dErr) return { ok: false, error: dErr.message };
  }

  revalidatePath("/dashboard/lawyer/profile");
  revalidatePath("/dashboard/lawyer");
  return { ok: true };
}
