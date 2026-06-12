// Client-safe chat types (no "server-only").

export interface ConversationSummary {
  id: string;
  otherName: string;
  otherPhoto: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  bookingId: string | null;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
  attachment_path: string | null;
  attachment_type: string | null;
  attachment_name: string | null;
  attachment_size: number | null;
  attachment_url?: string | null; // signed URL (server-provided or client-fetched)
}

export interface ActiveConversation {
  id: string;
  otherName: string;
  otherPhoto: string | null;
  bookingId: string | null;
  messages: ChatMessage[];
}
