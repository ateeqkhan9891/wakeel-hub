"use server";

import { revalidatePath } from "next/cache";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

type AdminActionResult = {
  ok: boolean;
  error?: string;
};

async function getAdminContext(): Promise<
  { supabase: SupabaseClient; userId: string } | AdminActionResult
> {
  const supabase = (await createClient()) as unknown as SupabaseClient;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      error: "Please log in again.",
    };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || profile?.role !== "admin") {
    return {
      ok: false,
      error: "You are not authorized to perform this action.",
    };
  }

  return {
    supabase,
    userId: user.id,
  };
}

export async function setUserActive(
  userId: string,
  isActive: boolean,
): Promise<AdminActionResult> {
  if (!userId) {
    return {
      ok: false,
      error: "Invalid user.",
    };
  }

  const context = await getAdminContext();

  if (!("supabase" in context)) {
    return context;
  }

  const { supabase, userId: adminId } = context;

  const { data: target, error: targetError } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active")
    .eq("id", userId)
    .single();

  if (targetError || !target) {
    return {
      ok: false,
      error: "User not found.",
    };
  }

  if (target.id === adminId && !isActive) {
    return {
      ok: false,
      error: "You cannot deactivate your own admin account.",
    };
  }

  if (target.is_active === isActive) {
    return {
      ok: true,
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", userId);

  if (error) {
    return {
      ok: false,
      error: error.message,
    };
  }

  await supabase.from("admin_logs").insert({
    actor_id: adminId,
    action: isActive ? "user_activated" : "user_deactivated",
    target_type: "user",
    target_id: userId,
    target_label: target.full_name || target.id,
    metadata: {
      role: target.role,
    },
  });

  revalidatePath("/dashboard/admin/users");
  revalidatePath("/dashboard/admin");

  return {
    ok: true,
  };
}