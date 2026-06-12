"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const complaintSchema = z.object({
  subject: z.string().min(5).max(160),
  category: z.string().min(1).max(80),
  description: z.string().min(20).max(4000),
  againstId: z.string().uuid().optional().nullable(),
});

export interface ComplaintActionResult {
  ok: boolean;
  error?: string;
}

async function isAdmin(supabase: SupabaseClient, uid: string) {
  const { data } = await supabase.from("profiles").select("role").eq("id", uid).maybeSingle();
  return (data as { role?: string } | null)?.role === "admin";
}

export async function fileComplaint(input: z.infer<typeof complaintSchema>): Promise<ComplaintActionResult> {
  const parsed = complaintSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please complete the complaint form." };

  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  const { error } = await supabase.from("complaints").insert({
    reporter_id: user.id,
    against_id: parsed.data.againstId || null,
    subject: parsed.data.subject,
    category: parsed.data.category,
    description: parsed.data.description,
    status: "open",
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/admin/reports");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/client");
  revalidatePath("/dashboard/lawyer");
  return { ok: true };
}

export async function updateComplaintStatus(id: string, status: "investigating" | "resolved" | "dismissed"): Promise<ComplaintActionResult> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };
  if (!(await isAdmin(supabase, user.id))) return { ok: false, error: "Admins only." };

  const { error } = await supabase
    .from("complaints")
    .update({
      status,
      resolved_by: status === "resolved" || status === "dismissed" ? user.id : null,
      resolved_at: status === "resolved" || status === "dismissed" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  await supabase.from("admin_logs").insert({
    actor_id: user.id,
    action: `complaint.${status}`,
    target_type: "complaint",
    target_id: id,
    target_label: id,
  });

  revalidatePath("/dashboard/admin/reports");
  revalidatePath("/dashboard/admin");
  return { ok: true };
}
