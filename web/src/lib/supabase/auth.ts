import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/types";

export interface SignUpDetails {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  role: UserRole;
}

/**
 * Creates a Supabase Auth account. The `handle_new_user()` database
 * trigger reads this `user_metadata` and provisions the matching
 * `public.profiles` row plus the role-specific `clients` / `lawyers`
 * records (a new lawyer also gets a `lawyer_settings` row with the
 * online consultation fee defaulting to Rs. 2,000).
 */
export async function signUp({ fullName, email, password, phone, city, role }: SignUpDetails) {
  const supabase = createClient();

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone, city, role },
    },
  });
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}

export async function getCurrentSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

/**
 * Looks up the `public.profiles` row for the active auth session, which
 * carries the platform role used to route users to the correct dashboard
 * (`/dashboard/client`, `/dashboard/lawyer`, `/dashboard/admin`).
 *
 * `profiles.id` equals the Supabase Auth user id (1:1), so we filter by
 * `id` directly rather than a separate `auth_user_id` column.
 */
export async function getCurrentAppUser() {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, city, avatar_url")
    .eq("id", auth.user.id)
    .single();

  if (error) return null;
  return data;
}

export const ROLE_DASHBOARD_PATH: Record<UserRole, string> = {
  client: "/dashboard/client",
  lawyer: "/dashboard/lawyer",
  admin: "/dashboard/admin",
};
