import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";

export interface GuardedProfile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  onboarding_completed: boolean;
}

const ROLE_HOME: Record<UserRole, string> = {
  client: "/dashboard/client",
  lawyer: "/dashboard/lawyer",
  admin: "/dashboard/admin",
};

export async function requireUser(
  expectedRole?: UserRole
): Promise<GuardedProfile> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, role, avatar_url, onboarding_completed"
    )
    .eq("id", user.id)
    .single();

  const profile = data as GuardedProfile | null;

  if (!profile) {
    redirect("/login");
  }

  if (!profile.onboarding_completed) {
    redirect("/onboarding");
  }

  if (expectedRole && profile.role !== expectedRole) {
    redirect(ROLE_HOME[profile.role] ?? "/login");
  }

  return profile;
}
