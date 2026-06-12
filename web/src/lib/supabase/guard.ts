import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";

export interface GuardedProfile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
}

const ROLE_HOME: Record<UserRole, string> = {
  client: "/dashboard/client",
  lawyer: "/dashboard/lawyer",
  admin: "/dashboard/admin",
};

/**
 * Server-side route guard for dashboard layouts (defence in depth on top
 * of `proxy.ts`). Validates the Supabase session, loads the `profiles`
 * row, and - when an `expectedRole` is given - redirects users who land on
 * the wrong dashboard to their own. Returns the authenticated profile so
 * the layout can render real identity (no hard-coded demo user).
 */
export async function requireUser(expectedRole?: UserRole): Promise<GuardedProfile> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, avatar_url")
    .eq("id", user.id)
    .single();

  const profile = data as GuardedProfile | null;

  if (!profile) {
    redirect("/login");
  }

  if (expectedRole && profile.role !== expectedRole) {
    redirect(ROLE_HOME[profile.role] ?? "/login");
  }

  return profile;
}
