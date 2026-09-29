import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { LawyerVerificationStatus } from "@/lib/lawyer-dashboard-data";
import type {
  LawyerFullProfile,
  EducationEntry,
  ExperienceEntry,
  PublicationEntry,
  SocialLinks,
} from "@/lib/data/lawyer-profile-types";

/**
 * Loads the signed-in lawyer's full editable profile. Written defensively:
 * `select("*")` + per-query error tolerance means a partially-applied schema
 * or a missing sub-row can never crash the page.
 */
export async function getMyLawyerProfile(): Promise<LawyerFullProfile | null> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const uid = user.id;
  const meta = (user.user_metadata ?? {}) as Record<string, string | undefined>;

  const safe = async <T>(p: PromiseLike<{ data: T | null }>): Promise<T | null> => {
    try {
      const { data } = await p;
      return data ?? null;
    } catch {
      return null;
    }
  };

  const [profile, lawyer, lp, settings, lpaRows, vr] = await Promise.all([
    safe<Record<string, unknown>>(supabase.from("profiles").select("*").eq("id", uid).maybeSingle()),
    safe<Record<string, unknown>>(supabase.from("lawyers").select("*").eq("id", uid).maybeSingle()),
    safe<Record<string, unknown>>(supabase.from("lawyer_profiles").select("*").eq("lawyer_id", uid).maybeSingle()),
    safe<Record<string, unknown>>(supabase.from("lawyer_settings").select("*").eq("lawyer_id", uid).maybeSingle()),
    safe<{ practice_area_id: string }[]>(supabase.from("lawyer_practice_areas").select("practice_area_id").eq("lawyer_id", uid)),
    safe<{ status: string }>(
      supabase.from("verification_requests").select("status").eq("lawyer_id", uid).order("submitted_at", { ascending: false }).limit(1).maybeSingle()
    ),
  ]);

  let practiceAreas: string[] = [];
  const areaIds = (lpaRows ?? []).map((r) => r.practice_area_id).filter(Boolean);
  if (areaIds.length) {
    const pa = await safe<{ slug: string }[]>(supabase.from("practice_areas").select("slug").in("id", areaIds));
    practiceAreas = (pa ?? []).map((r) => r.slug);
  }

  const str = (v: unknown, fb = ""): string => (typeof v === "string" ? v : v == null ? fb : String(v));
  const numStr = (v: unknown, fb = ""): string => (typeof v === "number" ? String(v) : typeof v === "string" ? v : fb);
  const num = (v: unknown, fb = 0): number => (typeof v === "number" ? v : fb);
  const bool = (v: unknown): boolean => v === true;
  const arr = (v: unknown): string[] => (Array.isArray(v) ? (v as unknown[]).map((x) => String(x)) : []);
  const jsonArr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

  let verificationStatus: LawyerVerificationStatus = "not_submitted";
  if (lawyer?.is_verified === true) verificationStatus = "approved";
  else if (vr?.status === "pending") verificationStatus = "pending";
  else if (vr?.status === "rejected") verificationStatus = "rejected";
  else if (vr?.status === "approved") verificationStatus = "approved";

  const social = (lp?.social_links ?? {}) as Partial<SocialLinks>;
  const name = str(profile?.full_name) || str(meta.full_name);

  return {
    id: uid,
    slug: str(lawyer?.slug),
    name,
    email: str(profile?.email) || str(user.email),
    phone: str(profile?.phone) || str(meta.phone),
    photoUrl: str(lp?.photo_url),
    gender: str(lawyer?.gender) === "female" ? "Female" : str(lawyer?.gender) === "male" ? "Male" : "",
    dateOfBirth: str(lawyer?.date_of_birth),
    city: str(profile?.city) || str(meta.city),
    officeAddress: str(lawyer?.office_address),
    experienceYears: numStr(lawyer?.experience_years, ""),
    barEnrollmentYear: numStr(lawyer?.bar_enrollment_year, ""),
    barCouncilNumber: str(lawyer?.bar_council_number),
    licenseNumber: str(lawyer?.license_number),

    professionalTitle: str(lawyer?.professional_title),
    about: str(lawyer?.about),
    practiceAreas,
    courts: arr(lawyer?.courts),
    education: jsonArr<EducationEntry>(lawyer?.education_entries),
    experience: jsonArr<ExperienceEntry>(lawyer?.experience),
    languages: arr(lawyer?.languages),

    onlineConsultationFee: numStr(settings?.online_consultation_fee, "2000"),
    officeConsultationFee: numStr(settings?.in_person_consultation_fee, "0"),
    phoneConsultationFee: numStr(settings?.phone_consultation_fee, "0"),
    freeInitialConsultation: bool(settings?.free_initial_consultation),
    availabilityDays: arr(settings?.availability_days),
    availabilitySlots: arr(settings?.availability_slots),
    availabilityHours: str(settings?.availability_hours),

    officeName: str(lawyer?.office_name),
    googleMapsLink: str(lawyer?.google_maps_link),

    achievements: arr(lawyer?.achievements),
    publications: jsonArr<PublicationEntry>(lawyer?.publications),
    social: {
      linkedin: str(social.linkedin),
      facebook: str(social.facebook),
      website: str(social.website),
    },

    showPhonePublicly: bool(settings?.show_phone_publicly),
    showEmailPublicly: bool(settings?.show_email_publicly),

    verificationStatus,
    rating: num(lawyer?.rating),
    reviewCount: num(lawyer?.review_count),
    totalConsultations: num(lawyer?.total_consultations),
    responseRate: num(lawyer?.response_rate),
    isFeatured: bool(lawyer?.is_featured),
    isVerified: bool(lawyer?.is_verified),
  };
}

