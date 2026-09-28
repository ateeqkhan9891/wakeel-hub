"use server";

import { createClient } from "@/lib/supabase/server";

const ROLE_HOME: Record<string, string> = {
  client: "/dashboard/client",
  lawyer: "/dashboard/lawyer",
  admin: "/dashboard/admin",
};

type CompleteOnboardingResult =
  | {
      success: true;
      redirectTo: string;
    }
  | {
      success: false;
      message: string;
    };

export async function completeOnboarding(): Promise<CompleteOnboardingResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "You must be signed in.",
    };
  }

  const { data, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !data) {
    return {
      success: false,
      message: "Unable to load your profile.",
    };
  }

  const profile = data as { role: string };

  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_completed: true } as never)
    .eq("id", user.id);

  if (error) {
    return {
      success: false,
      message: "Unable to complete onboarding.",
    };
  }

  return {
    success: true,
    redirectTo: ROLE_HOME[profile.role] ?? "/dashboard/client",
  };
}