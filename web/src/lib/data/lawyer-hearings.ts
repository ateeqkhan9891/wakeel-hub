import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export interface LawyerHearingRow {
  id: string;
  caseId: string;
  caseTitle: string;
  clientName: string | null;
  date: string;
  time: string | null;
  court: string | null;
  judge: string | null;
  purpose: string | null;
  status: string;
  outcome: string | null;
  notes: string | null;
}

export async function getLawyerHearings(): Promise<LawyerHearingRow[]> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("hearing_dates")
    .select("id, case_id, hearing_date, hearing_time, court, judge, purpose, status, outcome, notes, cases!inner(id, title, client_name, lawyer_id)")
    .eq("cases.lawyer_id", user.id)
    .order("hearing_date", { ascending: true });

  return ((data as Record<string, unknown>[] | null) ?? []).map((h) => {
    const c = (h.cases ?? {}) as { title?: string; client_name?: string | null };
    return {
      id: h.id as string,
      caseId: h.case_id as string,
      caseTitle: c.title ?? "Case",
      clientName: c.client_name ?? null,
      date: h.hearing_date as string,
      time: (h.hearing_time as string) ?? null,
      court: (h.court as string) ?? null,
      judge: (h.judge as string) ?? null,
      purpose: (h.purpose as string) ?? null,
      status: (h.status as string) ?? "scheduled",
      outcome: (h.outcome as string) ?? null,
      notes: (h.notes as string) ?? null,
    };
  });
}

