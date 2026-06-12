import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export interface ClientCaseSummary {
  id: string;
  title: string;
  caseType: string | null;
  court: string | null;
  status: string;
  lawyerName: string | null;
  nextHearing: string | null;
  updatedAt: string;
}

export interface CaseTimelineEntry {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface CaseHearing {
  id: string;
  date: string;
  time: string | null;
  court: string | null;
  purpose: string | null;
  status: string;
  outcome: string | null;
  notes: string | null;
}

export interface CaseDoc {
  id: string;
  name: string;
  fileType: string | null;
  size: number;
  createdAt: string;
  url: string | null;
}

export interface ClientCaseLawyer {
  name: string | null;
  slug: string | null;
  photoUrl: string | null;
  isVerified: boolean;
  professionalTitle: string | null;
  experienceYears: number | null;
}

export interface ClientCaseDetail {
  record: ClientCaseSummary & {
    caseNumber: string | null;
    courtCaseNumber: string | null;
    opponentName: string | null;
    createdAt: string;
  };
  lawyer: ClientCaseLawyer | null;
  timeline: CaseTimelineEntry[];
  hearings: CaseHearing[];
  documents: CaseDoc[];
}

export async function getClientCases(): Promise<ClientCaseSummary[]> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("cases")
    .select("id, title, case_type, court, status, lawyer_name, next_hearing_date, updated_at")
    .eq("client_id", user.id)
    .order("updated_at", { ascending: false });

  return ((data as Record<string, unknown>[] | null) ?? []).map((r) => ({
    id: r.id as string,
    title: r.title as string,
    caseType: (r.case_type as string) ?? null,
    court: (r.court as string) ?? null,
    status: (r.status as string) ?? "active",
    lawyerName: (r.lawyer_name as string) ?? null,
    nextHearing: (r.next_hearing_date as string) ?? null,
    updatedAt: r.updated_at as string,
  }));
}

export async function getClientCase(id: string): Promise<ClientCaseDetail | null> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: c } = await supabase
    .from("cases")
    .select("id, title, case_type, case_number, court_case_number, court, status, lawyer_id, lawyer_name, opponent_name, next_hearing_date, created_at, updated_at")
    .eq("id", id)
    .eq("client_id", user.id)
    .maybeSingle();
  if (!c) return null;
  const rec = c as Record<string, unknown>;

  const lawyerId = (rec.lawyer_id as string) ?? null;

  const [{ data: updates }, { data: hearings }, { data: docRows }, lawyer] = await Promise.all([
    supabase.from("case_updates").select("id, title, description, created_at").eq("case_id", id).order("created_at", { ascending: false }),
    supabase.from("hearing_dates").select("id, hearing_date, hearing_time, court, purpose, status, outcome, notes").eq("case_id", id).order("hearing_date", { ascending: false }),
    supabase.from("documents").select("id, name, file_type, size_bytes, storage_path, created_at").eq("case_id", id).order("created_at", { ascending: false }),
    getCaseLawyer(supabase, lawyerId, (rec.lawyer_name as string) ?? null),
  ]);

  const documents: CaseDoc[] = [];
  for (const d of (docRows as Record<string, unknown>[] | null) ?? []) {
    let url: string | null = null;
    try {
      const { data: signed } = await supabase.storage.from("case-documents").createSignedUrl(d.storage_path as string, 3600);
      url = signed?.signedUrl ?? null;
    } catch {
      url = null;
    }
    documents.push({
      id: d.id as string,
      name: d.name as string,
      fileType: (d.file_type as string) ?? null,
      size: Number(d.size_bytes ?? 0),
      createdAt: d.created_at as string,
      url,
    });
  }

  return {
    record: {
      id: rec.id as string,
      title: rec.title as string,
      caseType: (rec.case_type as string) ?? null,
      caseNumber: (rec.case_number as string) ?? null,
      courtCaseNumber: (rec.court_case_number as string) ?? null,
      court: (rec.court as string) ?? null,
      status: (rec.status as string) ?? "active",
      lawyerName: (rec.lawyer_name as string) ?? null,
      opponentName: (rec.opponent_name as string) ?? null,
      nextHearing: (rec.next_hearing_date as string) ?? null,
      createdAt: rec.created_at as string,
      updatedAt: rec.updated_at as string,
    },
    lawyer,
    timeline: ((updates as Record<string, unknown>[] | null) ?? []).map((u) => ({
      id: u.id as string,
      title: u.title as string,
      description: u.description as string,
      createdAt: u.created_at as string,
    })),
    hearings: ((hearings as Record<string, unknown>[] | null) ?? []).map((h) => ({
      id: h.id as string,
      date: h.hearing_date as string,
      time: (h.hearing_time as string) ?? null,
      court: (h.court as string) ?? null,
      purpose: (h.purpose as string) ?? null,
      status: (h.status as string) ?? "scheduled",
      outcome: (h.outcome as string) ?? null,
      notes: (h.notes as string) ?? null,
    })),
    documents,
  };
}

/** Public-safe advocate info for the case's lawyer (defensive: never throws). */
async function getCaseLawyer(
  supabase: SupabaseClient,
  lawyerId: string | null,
  fallbackName: string | null
): Promise<ClientCaseLawyer | null> {
  if (!lawyerId) return fallbackName ? { name: fallbackName, slug: null, photoUrl: null, isVerified: false, professionalTitle: null, experienceYears: null } : null;
  try {
    const [{ data: lawyer }, { data: profile }, { data: lp }] = await Promise.all([
      supabase.from("lawyers").select("slug, is_verified, professional_title, experience_years").eq("id", lawyerId).maybeSingle(),
      supabase.from("profiles").select("full_name").eq("id", lawyerId).maybeSingle(),
      supabase.from("lawyer_profiles").select("photo_url").eq("lawyer_id", lawyerId).maybeSingle(),
    ]);
    const l = (lawyer ?? {}) as Record<string, unknown>;
    const expRaw = l.experience_years;
    return {
      name: ((profile as { full_name?: string } | null)?.full_name) || fallbackName,
      slug: (l.slug as string) ?? null,
      photoUrl: ((lp as { photo_url?: string } | null)?.photo_url) ?? null,
      isVerified: l.is_verified === true,
      professionalTitle: (l.professional_title as string) ?? null,
      experienceYears: typeof expRaw === "number" ? expRaw : null,
    };
  } catch {
    return fallbackName ? { name: fallbackName, slug: null, photoUrl: null, isVerified: false, professionalTitle: null, experienceYears: null } : null;
  }
}
