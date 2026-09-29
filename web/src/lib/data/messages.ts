import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { ConversationSummary, ChatMessage, ActiveConversation } from "@/lib/data/message-types";

export type { ConversationSummary, ChatMessage, ActiveConversation } from "@/lib/data/message-types";

interface ConversationRow {
  id: string;
  client_id: string;
  lawyer_id: string;
  client_name: string | null;
  lawyer_name: string | null;
  client_photo: string | null;
  lawyer_photo: string | null;
  booking_id: string | null;
  last_message_at: string | null;
}

/** All conversations for the signed-in user (RLS scopes to participant). */
export async function getMyConversations(): Promise<ConversationSummary[]> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const uid = user.id;

  const { data: convos } = await supabase
    .from("conversations")
    .select("id, client_id, lawyer_id, client_name, lawyer_name, client_photo, lawyer_photo, booking_id, last_message_at")
    .order("last_message_at", { ascending: false, nullsFirst: false });

  const rows = (convos as ConversationRow[] | null) ?? [];
  if (rows.length === 0) return [];

  const ids = rows.map((c) => c.id);
  const { data: msgs } = await supabase
    .from("messages")
    .select("conversation_id, body, attachment_name, sender_id, is_read, created_at")
    .in("conversation_id", ids)
    .order("created_at", { ascending: true });

  const byConvo = new Map<string, { body: string; created_at: string }>();
  const unread = new Map<string, number>();
  for (const m of (msgs as { conversation_id: string; body: string | null; attachment_name: string | null; sender_id: string; is_read: boolean; created_at: string }[] | null) ?? []) {
    byConvo.set(m.conversation_id, { body: m.body || (m.attachment_name ? `📎 ${m.attachment_name}` : ""), created_at: m.created_at });
    if (m.sender_id !== uid && !m.is_read) unread.set(m.conversation_id, (unread.get(m.conversation_id) ?? 0) + 1);
  }

  return rows.map((c) => {
    const last = byConvo.get(c.id);
    const viewerIsClient = c.client_id === uid;
    return {
      id: c.id,
      otherName: (viewerIsClient ? c.lawyer_name : c.client_name) || (viewerIsClient ? "Advocate" : "Client"),
      otherPhoto: (viewerIsClient ? c.lawyer_photo : c.client_photo) || null,
      lastMessage: last?.body ?? null,
      lastMessageAt: last?.created_at ?? c.last_message_at,
      unreadCount: unread.get(c.id) ?? 0,
      bookingId: c.booking_id,
    };
  });
}

type MessageRow = Omit<ChatMessage, "attachment_url">;

/** A single conversation thread (verified by RLS) with its messages. */
export async function getConversationThread(id: string): Promise<ActiveConversation | null> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: convo } = await supabase
    .from("conversations")
    .select("id, client_id, lawyer_id, client_name, lawyer_name, client_photo, lawyer_photo, booking_id")
    .eq("id", id)
    .maybeSingle();
  if (!convo) return null;

  const c = convo as ConversationRow;
  const viewerIsClient = c.client_id === user.id;

  const { data: messages } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_id, body, is_read, created_at, attachment_path, attachment_type, attachment_name, attachment_size")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  const withUrls: ChatMessage[] = [];
  for (const m of (messages as MessageRow[] | null) ?? []) {
    let attachment_url: string | null = null;
    if (m.attachment_path) {
      try {
        const { data: signed } = await supabase.storage.from("message-attachments").createSignedUrl(m.attachment_path, 3600);
        attachment_url = signed?.signedUrl ?? null;
      } catch {
        attachment_url = null;
      }
    }
    withUrls.push({ ...m, attachment_url });
  }

  return {
    id: c.id,
    otherName: (viewerIsClient ? c.lawyer_name : c.client_name) || (viewerIsClient ? "Advocate" : "Client"),
    otherPhoto: (viewerIsClient ? c.lawyer_photo : c.client_photo) || null,
    bookingId: c.booking_id,
    messages: withUrls,
  };
}

export async function getUnreadMessagesCount(): Promise<number> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .neq("sender_id", user.id)
    .eq("is_read", false);

  return count ?? 0;
}

