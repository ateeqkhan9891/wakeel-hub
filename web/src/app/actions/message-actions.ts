"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { ChatMessage } from "@/lib/data/message-types";

export interface MessageActionResult {
  ok: boolean;
  error?: string;
  id?: string;
  message?: ChatMessage;
}

export interface AttachmentInput {
  path: string;
  type: string;
  name: string;
  size: number;
}

/**
 * Finds (or creates) the conversation between the client and lawyer of a
 * booking, then returns its id so the caller can open the chat.
 */
export async function getOrCreateConversationFromBooking(bookingId: string): Promise<MessageActionResult> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  const { data: booking } = await supabase
    .from("bookings")
    .select("client_id, lawyer_id, client_name, lawyer_name")
    .eq("id", bookingId)
    .maybeSingle();
  if (!booking) return { ok: false, error: "Booking not found." };
  if (booking.client_id !== user.id && booking.lawyer_id !== user.id) {
    return { ok: false, error: "You can't open this conversation." };
  }

  // Lawyer's public photo comes from the directory view (readable by anyone).
  const { data: dir } = await supabase
    .from("lawyer_directory")
    .select("photo_url")
    .eq("id", booking.lawyer_id)
    .maybeSingle();
  const lawyerPhoto = dir?.photo_url ?? null;

  const { data: existing } = await supabase
    .from("conversations")
    .select("id, lawyer_photo")
    .eq("client_id", booking.client_id)
    .eq("lawyer_id", booking.lawyer_id)
    .maybeSingle();
  if (existing) {
    if (!existing.lawyer_photo && lawyerPhoto) {
      await supabase.from("conversations").update({ lawyer_photo: lawyerPhoto }).eq("id", existing.id);
    }
    return { ok: true, id: existing.id };
  }

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({
      client_id: booking.client_id,
      lawyer_id: booking.lawyer_id,
      booking_id: bookingId,
      client_name: booking.client_name,
      lawyer_name: booking.lawyer_name,
      lawyer_photo: lawyerPhoto,
      last_message_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (error || !created) return { ok: false, error: error?.message ?? "Could not start conversation." };

  return { ok: true, id: created.id };
}

export async function sendMessage(
  conversationId: string,
  body: string,
  attachment?: AttachmentInput
): Promise<MessageActionResult> {
  const trimmed = body.trim();
  if (!trimmed && !attachment) return { ok: false, error: "Message is empty." };

  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body: trimmed || null,
      attachment_path: attachment?.path ?? null,
      attachment_type: attachment?.type ?? null,
      attachment_name: attachment?.name ?? null,
      attachment_size: attachment?.size ?? null,
    })
    .select("id, conversation_id, sender_id, body, is_read, created_at, attachment_path, attachment_type, attachment_name, attachment_size")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Could not send message." };

  let attachment_url: string | null = null;
  if (data.attachment_path) {
    const { data: signed } = await supabase.storage.from("message-attachments").createSignedUrl(data.attachment_path, 3600);
    attachment_url = signed?.signedUrl ?? null;
  }

  revalidatePath("/dashboard/client/messages");
  revalidatePath("/dashboard/lawyer/messages");
  return { ok: true, message: { ...(data as ChatMessage), attachment_url } };
}

export async function markConversationRead(conversationId: string): Promise<MessageActionResult> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .eq("is_read", false);

  revalidatePath("/dashboard/client/messages");
  revalidatePath("/dashboard/lawyer/messages");
  revalidatePath("/dashboard/client");
  revalidatePath("/dashboard/lawyer");
  return { ok: true };
}

