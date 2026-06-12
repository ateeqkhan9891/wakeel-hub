import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { CaseRecord, CaseDocument, CaseUpdateRow, CaseHearingRow } from "@/lib/data/case-types";

export type { CaseRecord, CaseDocument, CaseUpdateRow, CaseHearingRow } from "@/lib/data/case-types";

/** All cases owned by the signed-in lawyer (RLS also enforces this). */
export async function getLawyerCases(): Promise<CaseRecord[]> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("cases")
    .select("*")
    .eq("lawyer_id", user.id)
    .order("updated_at", { ascending: false });

  return (data as CaseRecord[] | null) ?? [];
}

export interface CaseDetail {
  record: CaseRecord;
  note: string;
  documents: CaseDocument[];
  timeline: CaseUpdateRow[];
  hearings: CaseHearingRow[];
}

/** One case (with the lawyer's private note + documents) or null. */
export async function getLawyerCase(id: string): Promise<CaseDetail | null> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: record } = await supabase
    .from("cases")
    .select("*")
    .eq("id", id)
    .eq("lawyer_id", user.id)
    .maybeSingle();

  if (!record) return null;

  const [{ data: noteRow }, { data: docRows }, { data: updateRows }, { data: hearingRows }] = await Promise.all([
    supabase.from("case_notes").select("body").eq("case_id", id).eq("lawyer_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("documents").select("id, name, file_type, storage_path, size_bytes, created_at").eq("case_id", id).order("created_at", { ascending: false }),
    supabase.from("case_updates").select("id, title, update_type, description, visible_to_client, created_at, attachment_path, attachment_name").eq("case_id", id).order("created_at", { ascending: false }),
    supabase.from("hearing_dates").select("id, hearing_date, hearing_time, court, judge, purpose, status, outcome, notes").eq("case_id", id).order("hearing_date", { ascending: false }),
  ]);

  const documents: CaseDocument[] = [];
  for (const d of (docRows as Omit<CaseDocument, "url">[] | null) ?? []) {
    let url: string | null = null;
    try {
      const { data: signed } = await supabase.storage.from("case-documents").createSignedUrl(d.storage_path, 3600);
      url = signed?.signedUrl ?? null;
    } catch {
      url = null;
    }
    documents.push({ ...d, url });
  }

  const timeline: CaseUpdateRow[] = [];
  for (const u of (updateRows as Record<string, unknown>[] | null) ?? []) {
    let attachmentUrl: string | null = null;
    if (u.attachment_path) {
      try {
        const { data: signed } = await supabase.storage.from("case-documents").createSignedUrl(u.attachment_path as string, 3600);
        attachmentUrl = signed?.signedUrl ?? null;
      } catch {
        attachmentUrl = null;
      }
    }
    timeline.push({
      id: u.id as string,
      title: u.title as string,
      updateType: (u.update_type as string) ?? "general",
      description: u.description as string,
      visibleToClient: u.visible_to_client === true,
      createdAt: u.created_at as string,
      attachmentName: (u.attachment_name as string) ?? null,
      attachmentUrl,
    });
  }

  const hearings: CaseHearingRow[] = ((hearingRows as Record<string, unknown>[] | null) ?? []).map((h) => ({
    id: h.id as string,
    date: h.hearing_date as string,
    time: (h.hearing_time as string) ?? null,
    court: (h.court as string) ?? null,
    judge: (h.judge as string) ?? null,
    purpose: (h.purpose as string) ?? null,
    status: (h.status as string) ?? "scheduled",
    outcome: (h.outcome as string) ?? null,
    notes: (h.notes as string) ?? null,
  }));

  return {
    record: record as CaseRecord,
    note: (noteRow as { body: string } | null)?.body ?? "",
    documents,
    timeline,
    hearings,
  };
}
