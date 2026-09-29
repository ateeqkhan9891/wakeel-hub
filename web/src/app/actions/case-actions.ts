"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { CASE_TYPES } from "@/lib/constants";
import type { CaseInput } from "@/lib/data/case-types";

/** Maps a practice-area name (e.g. "Family Law") to a case type ("Family"). */
function practiceAreaToCaseType(name: string | null | undefined): string {
  if (!name) return "Other";
  const base = name.replace(/\s*Law$/i, "").trim();
  return (CASE_TYPES as readonly string[]).find((t) => t.toLowerCase() === base.toLowerCase()) ?? "Other";
}

export interface CaseActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

function toNum(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function rowFromInput(input: CaseInput, uid: string) {
  return {
    lawyer_id: uid,
    title: input.title.trim(),
    case_type: input.caseType || null,
    status: input.status || "active",
    case_number: input.caseNumber.trim() || null,
    court_case_number: input.courtCaseNumber.trim() || null,
    court: input.court.trim() || null,
    judge_name: input.judgeName.trim() || null,
    next_hearing_date: input.nextHearingDate || null,
    client_name: input.clientName.trim() || null,
    client_phone: input.clientPhone.trim() || null,
    client_email: input.clientEmail.trim() || null,
    client_cnic: input.clientCnic.trim() || null,
    client_address: input.clientAddress.trim() || null,
    opponent_name: input.opponentName.trim() || null,
    opponent_lawyer: input.opponentLawyer.trim() || null,
    opponent_contact: input.opponentContact.trim() || null,
    total_fee: toNum(input.totalFee),
    advance_received: toNum(input.advanceReceived),
  };
}

async function saveNote(supabase: SupabaseClient, caseId: string, uid: string, body: string) {
  await supabase.from("case_notes").delete().eq("case_id", caseId).eq("lawyer_id", uid);
  if (body.trim()) {
    await supabase.from("case_notes").insert({ case_id: caseId, lawyer_id: uid, body });
  }
}

// Shared, client-visible timeline entry (case_updates). The client sees these
// in their dashboard, so the case stays in sync as the lawyer works.
async function addTimeline(supabase: SupabaseClient, caseId: string, authorId: string, title: string, description: string) {
  await supabase.from("case_updates").insert({ case_id: caseId, author_id: authorId, title, description });
}

async function lawyerDisplayName(supabase: SupabaseClient, uid: string): Promise<string | null> {
  const { data } = await supabase.from("profiles").select("full_name").eq("id", uid).maybeSingle();
  return (data as { full_name?: string } | null)?.full_name ?? null;
}

export async function createCase(input: CaseInput): Promise<CaseActionResult> {
  if (!input.title.trim()) return { ok: false, error: "Case title is required." };

  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  const lawyerName = await lawyerDisplayName(supabase, user.id);
  const { data, error } = await supabase
    .from("cases")
    .insert({ ...rowFromInput(input, user.id), lawyer_name: lawyerName })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Could not create case." };

  await saveNote(supabase, data.id, user.id, input.notes);
  await addTimeline(supabase, data.id, user.id, "Case created", "Your case file was opened on Wakeel360.");

  revalidatePath("/dashboard/lawyer/cases");
  revalidatePath("/dashboard/lawyer");
  return { ok: true, id: data.id };
}

export async function updateCase(id: string, input: CaseInput): Promise<CaseActionResult> {
  if (!input.title.trim()) return { ok: false, error: "Case title is required." };

  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  // Snapshot current values so we can record what changed.
  const { data: before } = await supabase
    .from("cases")
    .select("status, next_hearing_date")
    .eq("id", id)
    .eq("lawyer_id", user.id)
    .maybeSingle();

  const { lawyer_id: _omit, ...patch } = rowFromInput(input, user.id);
  void _omit;
  const { error } = await supabase.from("cases").update(patch).eq("id", id).eq("lawyer_id", user.id);
  if (error) return { ok: false, error: error.message };

  await saveNote(supabase, id, user.id, input.notes);

  // Record client-visible timeline entries for meaningful changes.
  const prev = before as { status?: string; next_hearing_date?: string | null } | null;
  if (prev && patch.status && patch.status !== prev.status) {
    await addTimeline(supabase, id, user.id, "Status updated", `Case status changed to "${String(patch.status).replace(/_/g, " ")}".`);
  }
  if (patch.next_hearing_date && patch.next_hearing_date !== prev?.next_hearing_date) {
    await addTimeline(supabase, id, user.id, "Hearing scheduled", `A new hearing is set for ${patch.next_hearing_date}.`);
  }

  revalidatePath("/dashboard/lawyer/cases");
  revalidatePath(`/dashboard/lawyer/cases/${id}`);
  revalidatePath(`/dashboard/client/cases/${id}`);
  revalidatePath("/dashboard/client/cases");
  revalidatePath("/dashboard/lawyer");
  return { ok: true, id };
}

/**
 * Creates a case pre-filled from a consultation booking (client name, phone,
 * practice area → case type, issue summary → private note). Idempotent: if a
 * case already exists for this booking it returns that one instead.
 */
export async function createCaseFromBooking(bookingId: string): Promise<CaseActionResult> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  // Already converted? Return the existing case.
  const { data: existing } = await supabase
    .from("cases")
    .select("id")
    .eq("source_booking_id", bookingId)
    .eq("lawyer_id", user.id)
    .maybeSingle();
  if (existing) return { ok: true, id: existing.id };

  const { data: b } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .eq("lawyer_id", user.id)
    .maybeSingle();
  if (!b) return { ok: false, error: "Booking not found." };

  const title = b.client_name ? `${b.client_name} - Consultation` : "Consultation case";

  const { data, error } = await supabase
    .from("cases")
    .insert({
      lawyer_id: user.id,
      client_id: b.client_id,
      source_booking_id: bookingId,
      title,
      case_type: practiceAreaToCaseType(b.practice_area_name),
      status: "active",
      lawyer_name: b.lawyer_name,
      client_name: b.client_name,
      client_phone: b.client_phone,
      client_address: b.client_city,
      next_hearing_date: b.scheduled_date,
    })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Could not create case." };

  if (b.issue_summary) await saveNote(supabase, data.id, user.id, b.issue_summary);
  await addTimeline(supabase, data.id, user.id, "Case opened", "A case file was created from your consultation.");

  revalidatePath("/dashboard/lawyer/cases");
  revalidatePath("/dashboard/lawyer/bookings");
  revalidatePath("/dashboard/client/cases");
  revalidatePath("/dashboard/lawyer");
  return { ok: true, id: data.id };
}

export async function deleteCase(id: string): Promise<CaseActionResult> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  const { error } = await supabase.from("cases").delete().eq("id", id).eq("lawyer_id", user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/lawyer/cases");
  revalidatePath("/dashboard/lawyer");
  return { ok: true };
}

export async function addCaseDocument(
  caseId: string,
  doc: { name: string; path: string; fileType: string; size: number; isPrivate?: boolean }
): Promise<CaseActionResult> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  const { error } = await supabase.from("documents").insert({
    owner_id: user.id,
    case_id: caseId,
    name: doc.name,
    file_type: doc.fileType || null,
    storage_path: doc.path,
    size_bytes: doc.size,
    is_private: doc.isPrivate ?? true,
  });
  if (error) return { ok: false, error: error.message };

  await addTimeline(supabase, caseId, user.id, "Document uploaded", `"${doc.name}" was added to your case file.`);

  revalidatePath(`/dashboard/lawyer/cases/${caseId}`);
  revalidatePath(`/dashboard/client/cases/${caseId}`);
  revalidatePath("/dashboard/client/cases");
  return { ok: true };
}

export async function deleteCaseDocument(docId: string, caseId: string, storagePath: string): Promise<CaseActionResult> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  const { error } = await supabase.from("documents").delete().eq("id", docId).eq("owner_id", user.id);
  if (error) return { ok: false, error: error.message };
  try {
    await supabase.storage.from("case-documents").remove([storagePath]);
  } catch {
    // ignore storage cleanup failure
  }

  revalidatePath(`/dashboard/lawyer/cases/${caseId}`);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Case updates (the timeline) - the heart of the workflow
// ---------------------------------------------------------------------------
export interface CaseUpdateInput {
  caseId: string;
  title: string;
  updateType: string;
  description: string;
  date?: string;
  visibleToClient: boolean;
  notifyClient: boolean;
  newStatus?: string;
  nextHearingDate?: string;
  attachment?: { path: string; name: string; type: string; size: number };
}

export async function addCaseUpdate(input: CaseUpdateInput): Promise<CaseActionResult> {
  if (!input.title.trim()) return { ok: false, error: "Update title is required." };

  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  // Confirm ownership + get client for notifications.
  const { data: caseRow } = await supabase
    .from("cases")
    .select("id, client_id, title")
    .eq("id", input.caseId)
    .eq("lawyer_id", user.id)
    .maybeSingle();
  if (!caseRow) return { ok: false, error: "Case not found." };

  const { error } = await supabase.from("case_updates").insert({
    case_id: input.caseId,
    author_id: user.id,
    title: input.title.trim(),
    update_type: input.updateType || "general",
    description: input.description.trim(),
    visible_to_client: input.visibleToClient,
    created_at: input.date ? new Date(input.date).toISOString() : undefined,
    attachment_path: input.attachment?.path ?? null,
    attachment_name: input.attachment?.name ?? null,
    attachment_type: input.attachment?.type ?? null,
    attachment_size: input.attachment?.size ?? null,
  });
  if (error) return { ok: false, error: error.message };

  // A client-visible attachment also lands in the shared Documents list.
  if (input.attachment && input.visibleToClient) {
    await supabase.from("documents").insert({
      owner_id: user.id,
      case_id: input.caseId,
      name: input.attachment.name,
      file_type: input.attachment.type || null,
      storage_path: input.attachment.path,
      size_bytes: input.attachment.size,
      is_private: false,
    });
  }

  // Optional case-record changes triggered from the update.
  const patch: Record<string, unknown> = {};
  if (input.newStatus) patch.status = input.newStatus;
  if (input.nextHearingDate) patch.next_hearing_date = input.nextHearingDate;
  if (Object.keys(patch).length) {
    await supabase.from("cases").update(patch).eq("id", input.caseId).eq("lawyer_id", user.id);
  }

  // Notify the client (only for visible updates).
  if (input.notifyClient && input.visibleToClient && caseRow.client_id) {
    await supabase.from("notifications").insert({
      user_id: caseRow.client_id,
      type: input.updateType === "hearing" ? "hearing" : "case",
      title: input.title.trim(),
      body: input.description.trim().slice(0, 200),
      related_entity_type: "case",
      related_entity_id: input.caseId,
    });
  }

  revalidatePath(`/dashboard/lawyer/cases/${input.caseId}`);
  revalidatePath(`/dashboard/client/cases/${input.caseId}`);
  revalidatePath("/dashboard/lawyer/cases");
  revalidatePath("/dashboard/client/cases");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Hearings
// ---------------------------------------------------------------------------
export interface HearingInput {
  caseId: string;
  date: string;
  time?: string;
  court?: string;
  judge?: string;
  purpose?: string;
  status: string;
  outcome?: string;
  notes?: string;
}

export async function addHearing(input: HearingInput): Promise<CaseActionResult> {
  if (!input.date) return { ok: false, error: "Hearing date is required." };

  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  const { data: caseRow } = await supabase.from("cases").select("id").eq("id", input.caseId).eq("lawyer_id", user.id).maybeSingle();
  if (!caseRow) return { ok: false, error: "Case not found." };

  const { error } = await supabase.from("hearing_dates").insert({
    case_id: input.caseId,
    hearing_date: input.date,
    hearing_time: input.time || null,
    court: input.court || null,
    judge: input.judge || null,
    purpose: input.purpose || null,
    status: input.status,
    outcome: input.outcome || null,
    notes: input.notes || null,
  });
  if (error) return { ok: false, error: error.message };

  // Scheduled hearings update the case's next hearing; completed ones land on the timeline.
  if (input.status === "scheduled") {
    await supabase.from("cases").update({ next_hearing_date: input.date }).eq("id", input.caseId).eq("lawyer_id", user.id);
    await addTimeline(supabase, input.caseId, user.id, "Hearing scheduled", `A hearing is set for ${input.date}${input.court ? ` at ${input.court}` : ""}.`);
  } else if (input.status === "completed") {
    await addTimeline(supabase, input.caseId, user.id, "Hearing completed", input.outcome || `Hearing on ${input.date} was completed.`);
  }

  revalidatePath(`/dashboard/lawyer/cases/${input.caseId}`);
  revalidatePath(`/dashboard/client/cases/${input.caseId}`);
  return { ok: true };
}

export async function updateHearingStatus(hearingId: string, caseId: string, status: string, outcome?: string): Promise<CaseActionResult> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  const { data: caseRow } = await supabase.from("cases").select("id").eq("id", caseId).eq("lawyer_id", user.id).maybeSingle();
  if (!caseRow) return { ok: false, error: "Case not found." };

  const { error } = await supabase.from("hearing_dates").update({ status, outcome: outcome || null }).eq("id", hearingId);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/dashboard/lawyer/cases/${caseId}`);
  revalidatePath(`/dashboard/client/cases/${caseId}`);
  return { ok: true };
}

export async function deleteHearing(hearingId: string, caseId: string): Promise<CaseActionResult> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  const { data: caseRow } = await supabase.from("cases").select("id").eq("id", caseId).eq("lawyer_id", user.id).maybeSingle();
  if (!caseRow) return { ok: false, error: "Case not found." };

  const { error } = await supabase.from("hearing_dates").delete().eq("id", hearingId);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/dashboard/lawyer/cases/${caseId}`);
  return { ok: true };
}

// Standalone private-note save (Private Notes tab).
export async function saveCaseNote(caseId: string, body: string): Promise<CaseActionResult> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  const { data: caseRow } = await supabase.from("cases").select("id").eq("id", caseId).eq("lawyer_id", user.id).maybeSingle();
  if (!caseRow) return { ok: false, error: "Case not found." };

  await saveNote(supabase, caseId, user.id, body);
  revalidatePath(`/dashboard/lawyer/cases/${caseId}`);
  return { ok: true };
}

