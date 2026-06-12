"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { ArrowLeft, MessageSquare, Send, Loader2, Paperclip, Mic, Square, FileText, Check, CheckCheck, Download, X } from "lucide-react";
import { toast } from "sonner";

import { cn, initials } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { sendMessage, markConversationRead, type AttachmentInput } from "@/app/actions/message-actions";
import type { ConversationSummary, ActiveConversation, ChatMessage } from "@/lib/data/message-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
}
function fmtDay(iso: string) {
  return new Date(iso).toLocaleDateString([], { day: "numeric", month: "short" });
}
function fmtSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ChatView({
  conversations, active, meId, basePath,
}: {
  conversations: ConversationSummary[];
  active: ActiveConversation | null;
  meId: string;
  basePath: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(active?.messages ?? []);
  const [text, setText] = useState("");
  const [sending, startSending] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const typingCooldown = useRef(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const activeId = active?.id ?? null;

  // Reset thread when the selected conversation changes (adjust during render).
  const [trackedId, setTrackedId] = useState(activeId);
  if (trackedId !== activeId) {
    setTrackedId(activeId);
    setMessages(active?.messages ?? []);
    setOtherTyping(false);
  }

  useEffect(() => {
    if (activeId) markConversationRead(activeId);
  }, [activeId]);

  // Realtime: inserts (new messages), updates (read receipts), typing broadcast.
  useEffect(() => {
    if (!activeId) return;
    const supabase = createClient();

    async function withUrl(m: ChatMessage): Promise<ChatMessage> {
      if (m.attachment_path && !m.attachment_url) {
        const { data } = await supabase.storage.from("message-attachments").createSignedUrl(m.attachment_path, 3600);
        return { ...m, attachment_url: data?.signedUrl ?? null };
      }
      return m;
    }

    const channel = supabase
      .channel(`conv:${activeId}`, { config: { broadcast: { self: false } } })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${activeId}` }, async (payload) => {
        const incoming = payload.new as ChatMessage;
        const m = await withUrl(incoming);
        setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
        if (m.sender_id !== meId) markConversationRead(activeId);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "messages", filter: `conversation_id=eq.${activeId}` }, (payload) => {
        const u = payload.new as ChatMessage;
        setMessages((prev) => prev.map((x) => (x.id === u.id ? { ...x, is_read: u.is_read } : x)));
      })
      .on("broadcast", { event: "typing" }, (payload) => {
        if ((payload.payload as { from?: string })?.from === meId) return;
        setOtherTyping(true);
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setOtherTyping(false), 2500);
      })
      .subscribe();

    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [activeId, meId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, otherTyping]);

  function broadcastTyping() {
    if (typingCooldown.current || !channelRef.current) return;
    typingCooldown.current = true;
    channelRef.current.send({ type: "broadcast", event: "typing", payload: { from: meId } });
    setTimeout(() => {
      typingCooldown.current = false;
    }, 1500);
  }

  function appendOwn(message: ChatMessage) {
    setMessages((prev) => (prev.some((x) => x.id === message.id) ? prev : [...prev, message]));
  }

  function handleSend() {
    const body = text.trim();
    if (!body || !activeId) return;
    setText("");
    startSending(async () => {
      const res = await sendMessage(activeId, body);
      if (!res.ok || !res.message) {
        toast.error("Message not sent", { description: res.error });
        setText(body);
        return;
      }
      appendOwn(res.message);
    });
  }

  async function uploadAndSend(file: Blob, name: string, type: string) {
    if (!activeId) return;
    setUploading(true);
    const supabase = createClient();
    const ext = (name.split(".").pop() || type.split("/")[1] || "bin").toLowerCase();
    const path = `${activeId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("message-attachments").upload(path, file, { contentType: type || undefined });
    if (error) {
      setUploading(false);
      toast.error("Upload failed", { description: error.message });
      return;
    }
    const attachment: AttachmentInput = { path, type, name, size: file.size };
    const res = await sendMessage(activeId, "", attachment);
    setUploading(false);
    if (!res.ok || !res.message) {
      toast.error("Could not send attachment", { description: res.error });
      return;
    }
    appendOwn(res.message);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) uploadAndSend(file, file.name, file.type || "application/octet-stream");
  }

  async function toggleRecording() {
    if (recording) {
      recorderRef.current?.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecording(false);
        if (blob.size > 0) uploadAndSend(blob, `voice-note.webm`, "audio/webm");
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      toast.error("Microphone unavailable", { description: "Allow microphone access to record a voice note." });
    }
  }

  return (
    <div className="grid h-[calc(100svh-13rem)] grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[320px_1fr]">
      {/* Conversation list */}
      <div className={cn("flex min-h-0 flex-col overflow-hidden border-r border-border", active && "hidden lg:flex")}>
        <div className="border-b border-border px-4 py-3">
          <p className="font-heading text-sm font-semibold text-foreground">Conversations</p>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No conversations yet. Start one from a booking.</p>
            </div>
          ) : (
            conversations.map((c) => (
              <Link
                key={c.id}
                href={`${basePath}?c=${c.id}`}
                className={cn(
                  "flex items-start gap-3 border-b border-border/60 px-4 py-3 transition-colors hover:bg-secondary/50",
                  activeId === c.id && "bg-secondary"
                )}
              >
                <Avatar className="h-9 w-9">
                  {c.otherPhoto && <AvatarImage src={c.otherPhoto} alt={c.otherName} className="object-cover" />}
                  <AvatarFallback className="text-xs">{initials(c.otherName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{c.otherName}</p>
                    {c.lastMessageAt && <span className="shrink-0 text-[11px] text-muted-foreground">{fmtDay(c.lastMessageAt)}</span>}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-muted-foreground">{c.lastMessage ?? "No messages yet"}</p>
                    {c.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Thread */}
      <div className={cn("flex min-h-0 flex-col overflow-hidden", !active && "hidden lg:flex")}>
        {!active ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <MessageSquare className="h-7 w-7 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Select a conversation to start chatting.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Link href={basePath} className="lg:hidden">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <Avatar className="h-9 w-9">
                {active.otherPhoto && <AvatarImage src={active.otherPhoto} alt={active.otherName} className="object-cover" />}
                <AvatarFallback className="text-xs">{initials(active.otherName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-heading text-sm font-semibold text-foreground">{active.otherName}</p>
                {otherTyping && <p className="text-xs text-primary">typing...</p>}
              </div>
              <Link
                href={basePath}
                aria-label="Close chat"
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4.5 w-4.5" />
              </Link>
            </div>

            <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-secondary/20 px-4 py-4">
              {messages.length === 0 ? (
                <p className="mt-8 text-center text-sm text-muted-foreground">No messages yet. Say hello 👋</p>
              ) : (
                messages.map((m) => {
                  const mine = m.sender_id === meId;
                  return (
                    <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[78%] rounded-2xl px-3.5 py-2 text-sm",
                          mine ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm border border-border bg-card text-foreground"
                        )}
                      >
                        <MessageBody message={m} mine={mine} />
                        <div className={cn("mt-1 flex items-center justify-end gap-1 text-[10px]", mine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                          <span>{fmtTime(m.created_at)}</span>
                          {mine && (m.is_read ? <CheckCheck className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {otherTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-border bg-card px-3.5 py-3">
                    <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-end gap-2 border-t border-border p-3">
              <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-secondary">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
                <input type="file" accept="image/*,application/pdf,.doc,.docx" className="sr-only" disabled={uploading} onChange={handleFile} />
              </label>
              <Button
                type="button"
                size="icon"
                variant={recording ? "default" : "outline"}
                onClick={toggleRecording}
                disabled={uploading}
                className={cn("h-10 w-10 shrink-0 rounded-xl", recording && "bg-rose-600 text-white hover:bg-rose-600")}
                aria-label={recording ? "Stop recording" : "Record voice note"}
              >
                {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  broadcastTyping();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                placeholder={recording ? "Recording voice note..." : "Type a message..."}
                className="max-h-32 min-h-10 flex-1 resize-none rounded-xl"
              />
              <Button onClick={handleSend} disabled={sending || !text.trim()} size="icon" className="h-10 w-10 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MessageBody({ message: m, mine }: { message: ChatMessage; mine: boolean }) {
  const type = m.attachment_type ?? "";
  return (
    <div className="space-y-1.5">
      {m.attachment_path && (
        type.startsWith("image/") ? (
          m.attachment_url ? (
            <a href={m.attachment_url} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.attachment_url} alt={m.attachment_name ?? "image"} className="max-h-60 w-full rounded-lg object-cover" />
            </a>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-lg bg-black/5 text-xs">Loading image...</div>
          )
        ) : type.startsWith("audio/") ? (
          m.attachment_url ? (
            <audio controls src={m.attachment_url} className="h-10 w-56 max-w-full" />
          ) : (
            <div className="text-xs opacity-80">Loading voice note...</div>
          )
        ) : (
          <a
            href={m.attachment_url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("flex items-center gap-2 rounded-lg px-2.5 py-2", mine ? "bg-white/15" : "bg-secondary")}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block truncate">{m.attachment_name ?? "Document"}</span>
              <span className="text-[10px] opacity-70">{fmtSize(m.attachment_size)}</span>
            </span>
            <Download className="h-3.5 w-3.5 shrink-0 opacity-80" />
          </a>
        )
      )}
      {m.body && <p className="whitespace-pre-wrap break-words leading-6">{m.body}</p>}
    </div>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: delay }} />;
}
