"use client";

import Link from "next/link";

import { MessageSquare } from "lucide-react";

import { cn, initials } from "@/lib/utils";

import type { ConversationSummary } from "@/lib/data/message-types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ChatConversationListProps = {
  conversations: ConversationSummary[];
  activeId: string | null;
  basePath: string;
};

function fmtDay(iso: string) {
  return new Date(iso).toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });
}

export function ChatConversationList({
  conversations,
  activeId,
  basePath,
}: ChatConversationListProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden border-r border-border",
        activeId && "hidden lg:flex",
      )}
    >
      <div className="border-b border-border px-4 py-3.5">
            <div className="flex items-center justify-between">
                <div>
                <p className="font-heading text-sm font-semibold text-foreground">
                    Conversations
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                    Your client messages
                </p>
                </div>

                {conversations.length > 0 && (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {conversations.length}
                </span>
                )}
            </div>
            </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                </div>

                <h3 className="mt-4 font-heading text-sm font-semibold text-foreground">
                    No conversations yet
                </h3>

                <p className="mt-1.5 max-w-xs text-sm leading-6 text-muted-foreground">
                    Conversations with clients will appear here once you receive a booking.
                </p>
                </div>
        ) : (
          conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`${basePath}?c=${conversation.id}`}
              className={cn(
                "flex items-start gap-3 border-b border-border/60 px-4 py-3 transition-colors hover:bg-secondary/50",
                activeId === conversation.id && "bg-secondary",
              )}
            >
              <Avatar className="h-9 w-9">
                {conversation.otherPhoto && (
                  <AvatarImage
                    src={conversation.otherPhoto}
                    alt={conversation.otherName}
                    className="object-cover"
                  />
                )}

                <AvatarFallback className="text-xs">
                  {initials(conversation.otherName)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {conversation.otherName}
                  </p>

                  {conversation.lastMessageAt && (
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {fmtDay(conversation.lastMessageAt)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-muted-foreground">
                    {conversation.lastMessage ?? "No messages yet"}
                  </p>

                  {conversation.unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}