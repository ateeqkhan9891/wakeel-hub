"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import { sendTransactionalEmail } from "@/lib/email";

export interface AdminVerificationResult {
  ok: boolean;
  error?: string;
}

async function db(): Promise<SupabaseClient> {
  return (await createClient()) as unknown as SupabaseClient;
}

async function requireAdmin(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.role === "admin" ? user : null;
}

export async function decideVerificationRequest(
  requestId: string,
  decision: "approved" | "rejected"
): Promise<AdminVerificationResult> {
  const supabase = await db();
  const admin = await requireAdmin(supabase);
  if (!admin) return { ok: false, error: "Only admin accounts can review lawyer verification requests." };

  const { data: request } = await supabase
    .from("verification_requests")
    .select("id, lawyer_id, enrollment_number, status")
    .eq("id", requestId)
    .maybeSingle();

  if (!request) return { ok: false, error: "Verification request not found." };

  const { data: lawyer } = await supabase
    .from("lawyers")
    .select("id, slug")
    .eq("id", request.lawyer_id)
    .maybeSingle();

  const { error: requestError } = await supabase
    .from("verification_requests")
    .update({
      status: decision,
      reviewed_by: admin.id,
      reviewed_at: new Date().toISOString(),
      rejection_reason: decision === "rejected" ? "Rejected by WakeelHub admin review." : null,
    })
    .eq("id", requestId);

  if (requestError) return { ok: false, error: requestError.message };

  const { error: lawyerError } = await supabase
    .from("lawyers")
    .update(
      decision === "approved"
        ? {
            is_verified: true,
            verified_at: new Date().toISOString(),
            bar_council_number: request.enrollment_number,
          }
        : {
            is_verified: false,
            verified_at: null,
          }
    )
    .eq("id", request.lawyer_id);

  if (lawyerError) return { ok: false, error: lawyerError.message };

  await supabase.from("notifications").insert({
    user_id: request.lawyer_id,
    type: "verification",
    title: decision === "approved" ? "Verification approved" : "Verification rejected",
    body:
      decision === "approved"
        ? "Your advocate profile is now verified and can appear in the public lawyer directory."
        : "Your verification request was rejected. Please review your documents and submit again.",
    related_entity_type: "verification_request",
    related_entity_id: requestId,
  });

  const { data: profile } = await supabase.from("profiles").select("email").eq("id", request.lawyer_id).maybeSingle();
  await sendTransactionalEmail({
    to: (profile as { email?: string } | null)?.email,
    subject: decision === "approved" ? "Your WakeelHub verification was approved" : "Your WakeelHub verification needs attention",
    title: decision === "approved" ? "Verification approved" : "Verification rejected",
    body:
      decision === "approved"
        ? "Your advocate profile is verified and can appear in the public lawyer directory when your subscription is active."
        : "Your verification request was rejected. Please review your documents and submit again.",
    path: "/dashboard/lawyer/profile",
    idempotencyKey: `verification-${requestId}-${decision}`,
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/lawyers");
  revalidatePath("/dashboard/lawyer");
  revalidatePath("/dashboard/lawyer/profile");
  revalidatePath("/find-lawyers");
  revalidatePath("/");
  if (lawyer?.slug) revalidatePath(`/lawyers/${lawyer.slug}`);

  return { ok: true };
}
