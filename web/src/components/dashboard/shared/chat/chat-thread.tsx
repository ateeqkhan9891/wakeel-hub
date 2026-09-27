"use client";

import Link from "next/link";

import { ArrowLeft, MessageSquare, X } from "lucide-react";

import { cn, initials } from "@/lib/utils";

import type {
  ActiveConversation,
  ChatMessage as ChatMessageType,
} from "@/lib/data/message-types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ChatMessage } from "./chat-message";

type ChatThreadProps = {
  active: ActiveConversation;
  messages: ChatMessageType[];
  meId: string;
  otherTyping: boolean;
  basePath: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

export function ChatThread({
  active,
  messages,
  meId,
  otherTyping,
  basePath,
  scrollRef,
}: ChatThreadProps) {
  return (
    <div className="flex min-h-0 flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Link href={basePath} className="lg:hidden">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>

        <Avatar className="h-9 w-9">
          {active.otherPhoto && (
            <AvatarImage
              src={active.otherPhoto}
              alt={active.otherName}
              className="object-cover"
            />
          )}

          <AvatarFallback className="text-xs">
            {initials(active.otherName)}
          </AvatarFallback>
        </Avatar>

        <div>
          <p className="font-heading text-sm font-semibold text-foreground">
            {active.otherName}
          </p>

          {otherTyping && (
            <p className="text-xs text-primary">
              typing...
            </p>
          )}
        </div>

        <Link
          href={basePath}
          aria-label="Close chat"
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4.5 w-4.5" />
        </Link>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-secondary/20 px-4 py-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-8 text-center">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />

            <p className="mt-2 text-sm text-muted-foreground">
              No messages yet. Say hello 👋
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              mine={message.sender_id === meId}
            />
          ))
        )}

        {otherTyping && (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-border bg-card px-3.5 py-3">
              <TypingDot />
              <TypingDot delay="150ms" />
              <TypingDot delay="300ms" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TypingDot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
      style={{ animationDelay: delay }}
    />
  );
}