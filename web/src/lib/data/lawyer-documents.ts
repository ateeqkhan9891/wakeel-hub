import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export interface LawyerDocumentRow {
  id: string;
  caseId: string;
  caseTitle: string;
  clientName: string | null;
  name: string;
  fileType: string | null;
  storagePath: string;
  size: number;
  isPrivate: boolean;
  createdAt: string;
  url: string | null;
}

export interface LawyerDocumentCase {
  id: string;
  title: string;
  clientName: string | null;
}

export interface LawyerDocumentsData {
  cases: LawyerDocumentCase[];
  documents: LawyerDocumentRow[];
}

export async function getLawyerDocuments(): Promise<LawyerDocumentsData> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { cases: [], documents: [] };

  const [{ data: cases }, { data: docs }] = await Promise.all([
    supabase.from("cases").select("id, title, client_name").eq("lawyer_id", user.id).order("updated_at", { ascending: false }),
    supabase
      .from("documents")
      .select("id, case_id, name, file_type, storage_path, size_bytes, is_private, created_at, cases!inner(id, title, client_name, lawyer_id)")
      .eq("cases.lawyer_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const documents: LawyerDocumentRow[] = [];
  for (const d of (docs as Record<string, unknown>[] | null) ?? []) {
    const caseRow = (d.cases ?? {}) as { id?: string; title?: string; client_name?: string | null };
    let url: string | null = null;
    try {
      const { data: signed } = await supabase.storage.from("case-documents").createSignedUrl(d.storage_path as string, 3600);
      url = signed?.signedUrl ?? null;
    } catch {
      url = null;
    }

    documents.push({
      id: d.id as string,
      caseId: (d.case_id as string) ?? caseRow.id ?? "",
      caseTitle: caseRow.title ?? "Case",
      clientName: caseRow.client_name ?? null,
      name: d.name as string,
      fileType: (d.file_type as string) ?? null,
      storagePath: d.storage_path as string,
      size: Number(d.size_bytes ?? 0),
      isPrivate: d.is_private !== false,
      createdAt: d.created_at as string,
      url,
    });
  }

  return {
    cases: ((cases as Record<string, unknown>[] | null) ?? []).map((c) => ({
      id: c.id as string,
      title: c.title as string,
      clientName: (c.client_name as string) ?? null,
    })),
    documents,
  };
}
