"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatDateTime, initials } from "@/lib/utils";
import type { MessageThread } from "@/lib/types";

interface ConversationMessage {
  id: string;
  fromMe: boolean;
  content: string;
  sentAt: string;
}

function buildConversation(thread: MessageThread, viewerName: string): ConversationMessage[] {
  return [
    { id: `${thread.id}-1`, fromMe: false, content: `Hi ${viewerName.split(" ")[0]}, just checking in on where things stand with your matter.`, sentAt: thread.lastMessageAt },
    { id: `${thread.id}-2`, fromMe: true, content: "Thanks for reaching out - I appreciate the update. Could you walk me through the next steps?", sentAt: thread.lastMessageAt },
    { id: `${thread.id}-3`, fromMe: false, content: thread.lastMessage, sentAt: thread.lastMessageAt },
  ];
}

interface ComposeValues {
  message: string;
}

export function MessagesView({ threads, viewerName }: { threads: MessageThread[]; viewerName: string }) {
  const [activeId, setActiveId] = useState(threads[0]?.id);
  const [conversations, setConversations] = useState<Record<string, ConversationMessage[]>>(() =>
    Object.fromEntries(threads.map((t) => [t.id, buildConversation(t, viewerName)]))
  );

  const active = threads.find((t) => t.id === activeId) ?? threads[0];
  const { register, handleSubmit, reset } = useForm<ComposeValues>({ defaultValues: { message: "" } });

  function onSubmit(values: ComposeValues) {
    if (!values.message.trim() || !active) return;
    const newMessage: ConversationMessage = {
      id: `${active.id}-${crypto.randomUUID()}`,
      fromMe: true,
      content: values.message.trim(),
      sentAt: new Date().toISOString(),
    };
    setConversations((prev) => ({ ...prev, [active.id]: [...(prev[active.id] ?? []), newMessage] }));
    reset();
    toast.success("Message sent");
  }

  if (!active) {
    return (
      <Card className="flex h-[28rem] items-center justify-center rounded-xl border-slate-200 bg-white p-6 text-sm text-slate-500">
        No conversations yet.
      </Card>
    );
  }

  return (
    <Card className="grid grid-cols-1 overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm shadow-slate-200/40 md:grid-cols-[300px_1fr]">
      <div className="border-b border-slate-200 md:border-b-0 md:border-r">
        <div className="border-b border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-950">Conversations</p>
        </div>
        <div className="max-h-[32rem] overflow-y-auto">
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={cn(
                "flex w-full items-start gap-3 border-b border-slate-100 p-4 text-left transition-colors hover:bg-slate-50",
                t.id === active.id && "bg-slate-50"
              )}
            >
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(t.participantName)}`} alt={t.participantName} />
                <AvatarFallback>{initials(t.participantName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-slate-950">{t.participantName}</p>
                  {t.unreadCount > 0 && (
                    <Badge className="h-5 min-w-5 shrink-0 justify-center rounded-full bg-amber-50 px-1.5 text-[11px] text-amber-700 shadow-none">
                      {t.unreadCount}
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{t.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-[34rem] flex-col">
        <div className="flex items-center gap-3 border-b border-slate-200 p-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(active.participantName)}`} alt={active.participantName} />
            <AvatarFallback>{initials(active.participantName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-slate-950">{active.participantName}</p>
            <p className="text-xs capitalize text-slate-500">{active.participantRole}</p>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {(conversations[active.id] ?? []).map((m) => (
            <div key={m.id} className={cn("flex", m.fromMe ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-6",
                m.fromMe ? "rounded-br-sm bg-slate-950 text-white" : "rounded-bl-sm bg-slate-100 text-slate-800"
              )}>
                <p>{m.content}</p>
                <p className={cn("mt-1 text-[11px]", m.fromMe ? "text-primary-foreground/60" : "text-muted-foreground")}>
                  {formatDateTime(m.sentAt)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 border-t border-slate-200 p-3">
          <Input placeholder="Type your message..." className="h-10 rounded-lg border-slate-200 bg-white" {...register("message")} />
          <Button type="submit" size="icon" className="shrink-0 rounded-lg bg-slate-950 text-white hover:bg-slate-800">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}

