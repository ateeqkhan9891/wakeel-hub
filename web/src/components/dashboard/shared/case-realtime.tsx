"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Subscribes to live changes for a single case (updates, hearings, the case
 * record) and refreshes the server-rendered page so both the lawyer and the
 * client see new activity instantly - no manual refresh.
 */
export function CaseRealtime({ caseId }: { caseId: string }) {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`case:${caseId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "case_updates", filter: `case_id=eq.${caseId}` }, () => router.refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "hearing_dates", filter: `case_id=eq.${caseId}` }, () => router.refresh())
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "cases", filter: `id=eq.${caseId}` }, () => router.refresh())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [caseId, router]);
  return null;
}

