import Link from "next/link";

import { ArrowUpRight, MessageSquare } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import type { getMyConversations } from "@/lib/data/messages";

import { initials, timeAgo } from "@/lib/utils";

type Conversations = Awaited<ReturnType<typeof getMyConversations>>;

type ClientMessagesPreviewProps = {
  conversations: Conversations;
};

export function ClientMessagesPreview({
  conversations,
}: ClientMessagesPreviewProps) {
  const unreadConversations = conversations.filter(
    (c) => c.unreadCount > 0,
  );

  const visibleConversations = (
    unreadConversations.length > 0
      ? unreadConversations
      : conversations
  ).slice(0, 4);

  return (
    <Card className="relative overflow-hidden border-slate-200 bg-white p-0 shadow-sm ring-0">
      <div className="pointer-events-none absolute -right-14 -top-14 h-28 w-28 rounded-full bg-blue-50/80 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-20 w-20 rounded-full border border-slate-100" />
      <div className="pointer-events-none absolute right-8 top-7 h-8 w-8 rounded-full border border-blue-100/70" />

      <div className="relative flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <MessageSquare
              className="h-4 w-4"
              strokeWidth={1.8}
              aria-hidden
            />
          </div>

          <div>
            <h2 className="font-heading text-base font-semibold tracking-tight text-slate-950">
              Messages
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {unreadConversations.length > 0
                ? `${unreadConversations.length} unread ${
                    unreadConversations.length === 1
                      ? "conversation"
                      : "conversations"
                  }`
                : "Recent conversations"}
            </p>
          </div>
        </div>

        {conversations.length > 0 && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 gap-1 rounded-lg px-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          >
            <Link href="/dashboard/client/messages">
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>

      <div className="relative p-3">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-9 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
              <MessageSquare
                className="h-5 w-5"
                strokeWidth={1.7}
                aria-hidden
              />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-950">
              No messages yet
            </p>

            <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
              Your conversations with advocates will appear here after you
              connect with one.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {visibleConversations.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/client/messages?c=${c.id}`}
                className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-slate-200 hover:bg-slate-50"
              >
                <div className="relative shrink-0">
                  <Avatar className="h-9 w-9 ring-1 ring-slate-200">
                    {c.otherPhoto && (
                      <AvatarImage
                        src={c.otherPhoto}
                        alt={c.otherName}
                      />
                    )}

                    <AvatarFallback className="bg-slate-100 text-[11px] font-semibold text-slate-600">
                      {initials(c.otherName)}
                    </AvatarFallback>
                  </Avatar>

                  {c.unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-500" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`min-w-0 flex-1 truncate text-sm ${
                        c.unreadCount > 0
                          ? "font-semibold text-slate-950"
                          : "font-medium text-slate-800"
                      }`}
                    >
                      {c.otherName}
                    </p>

                    {c.lastMessageAt && (
                      <span className="shrink-0 text-[10px] font-medium text-slate-400">
                        {timeAgo(c.lastMessageAt)}
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-0.5 truncate text-xs ${
                      c.unreadCount > 0
                        ? "font-medium text-slate-600"
                        : "text-slate-400"
                    }`}
                  >
                    {c.lastMessage ?? "No messages yet"}
                  </p>
                </div>

                {c.unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white shadow-sm">
                    {c.unreadCount}
                  </span>
                )}

                <ArrowUpRight className="hidden h-3.5 w-3.5 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-500 sm:block" />
              </Link>
            ))}
          </div>
        )}

        {conversations.length > 4 && (
          <div className="mt-2 border-t border-slate-100 pt-2 text-center">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 text-xs font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Link href="/dashboard/client/messages">
                View all conversations
                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}