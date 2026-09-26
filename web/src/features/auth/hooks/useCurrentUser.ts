"use client";

import { useCallback, useEffect, useState } from "react";

import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

type Profile = {
  role?: string | null;
};

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRole = useCallback(
    async (
      currentUser: User | null,
      supabase: ReturnType<typeof createClient>
    ) => {
      if (!currentUser) {
        setRole(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (error) {
          setRole(null);
          return;
        }

        const profile = data as Profile | null;

        setRole(profile?.role ?? null);
      } catch {
        setRole(null);
      }
    },
    []
  );

  useEffect(() => {
    const supabase = createClient();

    async function initialize() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const currentUser = session?.user ?? null;

        setUser(currentUser);

        await loadRole(currentUser, supabase);
      } catch {
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    void initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;

        setUser(currentUser);

        window.setTimeout(() => {
          void loadRole(currentUser, supabase);
        }, 0);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [loadRole]);

  const signOut = useCallback(async () => {
    const supabase = createClient();

    await supabase.auth.signOut();

    setUser(null);
    setRole(null);
  }, []);

  return {
    user,
    role,
    loading,
    signOut,
  };
}