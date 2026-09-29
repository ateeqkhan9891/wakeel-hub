"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

export interface ReviewActionResult {
  ok: boolean;
  error?: string;
  requireAuth?: boolean;
}

export interface SubmitLawyerReviewInput {
  lawyerId: string;
  lawyerSlug: string;
  rating: number;
  caseType: string;
  comment: string;
}

async function db(): Promise<SupabaseClient> {
  return (await createClient()) as unknown as SupabaseClient;
}

function cleanText(value: string, maxLength: number) {
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export async function submitLawyerReview(input: SubmitLawyerReviewInput): Promise<ReviewActionResult> {
  const supabase = await db();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, requireAuth: true, error: "Please log in with a client account to leave a review." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return { ok: false, requireAuth: true, error: "Your session expired. Please log in again." };
  if (profile.role !== "client") return { ok: false, error: "Only client accounts can review advocates." };

  const reviewerName = ((profile as { full_name?: string }).full_name ?? (user.user_metadata?.full_name as string) ?? "Verified client").trim();
  const reviewerPhoto = (profile as { avatar_url?: string }).avatar_url ?? null;

  const rating = Math.max(1, Math.min(5, Math.round(Number(input.rating))));
  const caseType = cleanText(input.caseType, 80);
  const comment = cleanText(input.comment, 700);

  if (!input.lawyerId || !input.lawyerSlug) return { ok: false, error: "Advocate profile not found." };
  if (!caseType) return { ok: false, error: "Select the legal matter this review relates to." };
  if (comment.length < 20) return { ok: false, error: "Please write at least 20 characters about your experience." };

  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("lawyer_id", input.lawyerId)
    .eq("client_id", user.id)
    .is("booking_id", null)
    .maybeSingle();

  const payload = {
    lawyer_id: input.lawyerId,
    client_id: user.id,
    rating,
    case_type: caseType,
    comment,
    is_published: true,
    client_name: reviewerName,
    client_photo: reviewerPhoto,
  };

  const { error } = existing?.id
    ? await supabase.from("reviews").update(payload).eq("id", existing.id)
    : await supabase.from("reviews").insert(payload);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/lawyers/${input.lawyerSlug}`);
  revalidatePath("/find-lawyers");
  revalidatePath("/");
  return { ok: true };
}

