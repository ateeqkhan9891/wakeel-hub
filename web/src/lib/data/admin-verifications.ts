import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export interface AdminVerificationDoc {
  type: string;
  label: string;
  url: string | null;
}

export interface AdminVerificationDetail {
  id: string;
  lawyerId: string;
  lawyerName: string;
  email: string;
  phone: string | null;
  city: string | null;
  barCouncilNumber: string;
  professionalTitle: string | null;
  experienceYears: number;
  about: string | null;
  languages: string[];
  education: string[];
  practiceAreas: string[];
  onlineFee: number | null;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  isVerified: boolean;
  documents: AdminVerificationDoc[];
}

const DOC_LABELS: Record<string, string> = {
  cnic_front: "CNIC",
  cnic_back: "CNIC (back)",
  bar_council_card: "Bar Council Card",
  law_license: "Advocate License",
  enrollment_certificate: "Enrollment Certificate",
  chamber_address_proof: "Chamber Address Proof",
  degree: "Degree",
  other: "Document",
};

async function db(): Promise<SupabaseClient> {
  return (await createClient()) as unknown as SupabaseClient;
}

function formatEducation(entries: unknown): string[] {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((e) => {
      const x = e as { degree?: string; institution?: string; year?: string };
      const left = [x.degree, x.institution].filter(Boolean).join(" - ");
      return x.year ? `${left}${left ? " " : ""}(${x.year})` : left;
    })
    .filter(Boolean);
}

export async function getPendingVerificationCount() {
  const supabase = await db();
  const { count } = await supabase
    .from("verification_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");
  return count ?? 0;
}

export async function getAdminVerificationRequests(): Promise<AdminVerificationDetail[]> {
  const supabase = await db();
  const { data: requests, error } = await supabase
    .from("verification_requests")
    .select("id, lawyer_id, enrollment_number, status, submitted_at")
    .order("submitted_at", { ascending: false });

  if (error || !requests?.length) return [];

  const rows = requests as { id: string; lawyer_id: string; enrollment_number: string; status: string; submitted_at: string }[];
  const lawyerIds = [...new Set(rows.map((r) => r.lawyer_id))];
  const requestIds = rows.map((r) => r.id);

  const [{ data: profiles }, { data: lawyers }, { data: settings }, { data: areaLinks }, { data: documents }] =
    await Promise.all([
      supabase.from("profiles").select("id, full_name, email, phone, city").in("id", lawyerIds),
      supabase.from("lawyers").select("id, professional_title, experience_years, about, languages, education_entries, is_verified").in("id", lawyerIds),
      supabase.from("lawyer_settings").select("lawyer_id, online_consultation_fee").in("lawyer_id", lawyerIds),
      supabase.from("lawyer_practice_areas").select("lawyer_id, practice_areas(slug)").in("lawyer_id", lawyerIds),
      supabase.from("verification_documents").select("verification_request_id, doc_type, storage_path").in("verification_request_id", requestIds),
    ]);

  const profileById = new Map((profiles as Record<string, unknown>[] | null ?? []).map((p) => [p.id as string, p]));
  const lawyerById = new Map((lawyers as Record<string, unknown>[] | null ?? []).map((l) => [l.id as string, l]));
  const feeByLawyer = new Map((settings as { lawyer_id: string; online_consultation_fee: number }[] | null ?? []).map((s) => [s.lawyer_id, s.online_consultation_fee]));

  const practiceByLawyer = new Map<string, string[]>();
  for (const link of (areaLinks as { lawyer_id: string; practice_areas: { slug: string } | { slug: string }[] | null }[] | null ?? [])) {
    const pa = link.practice_areas;
    const slug = Array.isArray(pa) ? pa[0]?.slug : pa?.slug;
    if (!slug) continue;
    const cur = practiceByLawyer.get(link.lawyer_id) ?? [];
    cur.push(slug);
    practiceByLawyer.set(link.lawyer_id, cur);
  }

  // Sign all document URLs in one batch (private verification-documents bucket).
  const docRows = (documents as { verification_request_id: string; doc_type: string; storage_path: string }[] | null) ?? [];
  const paths = docRows.map((d) => d.storage_path);
  const signedByPath = new Map<string, string>();
  if (paths.length) {
    const { data: signed } = await supabase.storage.from("verification-documents").createSignedUrls(paths, 3600);
    for (const s of signed ?? []) {
      if (s.path && s.signedUrl) signedByPath.set(s.path, s.signedUrl);
    }
  }
  const docsByRequest = new Map<string, AdminVerificationDoc[]>();
  for (const d of docRows) {
    const cur = docsByRequest.get(d.verification_request_id) ?? [];
    cur.push({ type: d.doc_type, label: DOC_LABELS[d.doc_type] ?? "Document", url: signedByPath.get(d.storage_path) ?? null });
    docsByRequest.set(d.verification_request_id, cur);
  }

  return rows.map((req) => {
    const profile = profileById.get(req.lawyer_id) as Record<string, unknown> | undefined;
    const lawyer = lawyerById.get(req.lawyer_id) as Record<string, unknown> | undefined;
    return {
      id: req.id,
      lawyerId: req.lawyer_id,
      lawyerName: (profile?.full_name as string) || "Unknown advocate",
      email: (profile?.email as string) || "",
      phone: (profile?.phone as string) ?? null,
      city: (profile?.city as string) ?? null,
      barCouncilNumber: req.enrollment_number,
      professionalTitle: (lawyer?.professional_title as string) ?? null,
      experienceYears: (lawyer?.experience_years as number) ?? 0,
      about: (lawyer?.about as string) ?? null,
      languages: Array.isArray(lawyer?.languages) ? (lawyer!.languages as string[]) : [],
      education: formatEducation(lawyer?.education_entries),
      practiceAreas: practiceByLawyer.get(req.lawyer_id) ?? [],
      onlineFee: feeByLawyer.get(req.lawyer_id) ?? null,
      status: req.status === "approved" ? "approved" : req.status === "rejected" ? "rejected" : "pending",
      submittedAt: req.submitted_at,
      isVerified: lawyer?.is_verified === true,
      documents: docsByRequest.get(req.id) ?? [],
    };
  });
}
