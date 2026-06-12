import "server-only";
import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Lawyer, Review } from "@/lib/types";
import type { City, PracticeAreaSlug, Province } from "@/lib/constants";

const PLACEHOLDER_PHOTO = "/images/avatar-placeholder.svg";

type DirectoryRow = {
  id: string;
  slug: string;
  full_name: string;
  city: string | null;
  province: string | null;
  photo_url: string | null;
  gender: "male" | "female" | "other" | null;
  bar_council_number: string | null;
  practice_area_slugs: string[] | null;
  courts: string[] | null;
  experience_years: number;
  education: string[] | null;
  languages: string[] | null;
  about: string | null;
  response_time: string | null;
  cases_handled: number;
  success_rate: number;
  rating: number;
  review_count: number;
  is_featured: boolean;
  joined_date: string;
  online_consultation_fee: number | null;
  in_person_consultation_fee: number | null;
  availability_days: string[] | null;
  availability_hours: string | null;
  accepts_online_consultations: boolean | null;
  accepts_in_person_consultations: boolean | null;
  professional_title?: string | null;
  office_name?: string | null;
  office_address?: string | null;
  google_maps_link?: string | null;
  education_entries?: { degree?: string; institution?: string; year?: string }[] | null;
  experience?: { firm?: string; position?: string; startDate?: string; endDate?: string; description?: string }[] | null;
  achievements?: string[] | null;
  social_links?: { linkedin?: string; facebook?: string; website?: string } | null;
};

type ReviewRow = {
  id: string;
  rating: number;
  comment: string | null;
  case_type: string | null;
  created_at: string;
  client_name: string | null;
  client_photo: string | null;
};

function reviewerAvatar(name: string, photo: string | null): string {
  if (photo) return photo;
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundType=gradientLinear`;
}

function formatEducation(entries: DirectoryRow["education_entries"]): string[] {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((e) => {
      const left = [e.degree, e.institution].filter(Boolean).join(" - ");
      return e.year ? `${left}${left ? " " : ""}(${e.year})` : left;
    })
    .filter(Boolean);
}

function toReview(row: ReviewRow): Review {
  const name = (row.client_name ?? "").trim() || "Verified client";
  return {
    id: row.id,
    clientName: name,
    avatarUrl: reviewerAvatar(name, row.client_photo),
    rating: Number(row.rating ?? 0),
    comment: row.comment ?? "Shared a rating after working with this advocate.",
    date: row.created_at,
    caseType: row.case_type ?? "Legal consultation",
  };
}

async function getPublishedReviewsForLawyer(lawyerId: string): Promise<Review[]> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, case_type, created_at, client_name, client_photo")
    .eq("lawyer_id", lawyerId)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as ReviewRow[]).map(toReview);
}

/**
 * Maps a row of the public `lawyer_directory` view onto the rich `Lawyer`
 * shape the existing cards / profile UI expect. Fields the directory does
 * not carry yet (reviews, case highlights) default to empty - real data,
 * no mock fillers.
 */
function toLawyer(row: DirectoryRow): Lawyer {
  const modes: ("In-person" | "Video" | "Phone")[] = [];
  if (row.accepts_online_consultations) modes.push("Video");
  if (row.accepts_in_person_consultations) modes.push("In-person");
  if (modes.length === 0) modes.push("Video");

  return {
    id: row.id,
    slug: row.slug,
    fullName: row.full_name,
    gender: row.gender === "female" ? "Female" : "Male",
    photoUrl: row.photo_url || PLACEHOLDER_PHOTO,
    verified: true,
    barCouncilNumber: row.bar_council_number ?? "-",
    city: (row.city ?? "") as City,
    province: (row.province ?? "") as Province,
    courts: row.courts ?? [],
    experienceYears: row.experience_years ?? 0,
    education: formatEducation(row.education_entries).length ? formatEducation(row.education_entries) : row.education ?? [],
    practiceAreas: (row.practice_area_slugs ?? []) as PracticeAreaSlug[],
    languages: row.languages ?? [],
    consultationFee: row.online_consultation_fee ?? row.in_person_consultation_fee ?? 0,
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    about: row.about ?? "",
    availability: {
      days: (row.availability_days ?? []) as Lawyer["availability"]["days"],
      hours: row.availability_hours ?? "By appointment",
      mode: modes,
    },
    reviews: [],
    caseHighlights: [],
    responseTime: row.response_time ?? "Within 24 hours",
    casesHandled: row.cases_handled ?? 0,
    successRate: Number(row.success_rate ?? 0),
    joinedDate: row.joined_date,
    featured: row.is_featured ?? false,
    professionalTitle: row.professional_title ?? undefined,
    officeName: row.office_name ?? undefined,
    officeAddress: row.office_address ?? undefined,
    googleMapsLink: row.google_maps_link ?? undefined,
    experienceEntries: Array.isArray(row.experience)
      ? row.experience.map((e) => ({
          firm: e.firm ?? "",
          position: e.position ?? "",
          startDate: e.startDate ?? "",
          endDate: e.endDate ?? "",
          description: e.description ?? "",
        }))
      : [],
    achievements: Array.isArray(row.achievements) ? row.achievements : [],
    socialLinks: row.social_links ?? undefined,
  };
}

/** All verified + active advocates, for the public directory. */
export const getVerifiedLawyers = cache(async (): Promise<Lawyer[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lawyer_directory")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false })
    .limit(60);

  if (error || !data) return [];
  return (data as DirectoryRow[]).map(toLawyer);
});

/** A single verified advocate by slug, or null if not found / not public. */
export async function getPublicLawyerBySlug(slug: string): Promise<Lawyer | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lawyer_directory")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  const lawyer = toLawyer(data as DirectoryRow);
  const reviews = await getPublishedReviewsForLawyer(lawyer.id);
  if (reviews.length === 0) return lawyer;

  const rating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  return {
    ...lawyer,
    rating,
    reviewCount: reviews.length,
    reviews,
  };
}
