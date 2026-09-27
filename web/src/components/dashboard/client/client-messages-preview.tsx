
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

  return (
    <Card className="overflow-hidden border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-slate-950">
            Messages
          </h2>
        </div>

        {conversations.length > 0 && (
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link href="/dashboard/client/messages">
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>

      <div className="p-5">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <MessageSquare className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-900">
              No messages yet
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Message your advocate once you've booked a consultation.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {(unreadConversations.length > 0
              ? unreadConversations
              : conversations
            )
              .slice(0, 4)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/dashboard/client/messages?c=${c.id}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    {c.otherPhoto && (
                      <AvatarImage
                        src={c.otherPhoto}
                        alt={c.otherName}
                      />
                    )}
                    <AvatarFallback className="bg-primary/8 text-xs font-semibold text-primary">
                      {initials(c.otherName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {c.otherName}
                      </p>

                      {c.lastMessageAt && (
                        <span className="shrink-0 text-[11px] text-slate-400">
                          {timeAgo(c.lastMessageAt)}
                        </span>
                      )}
                    </div>

                    <p className="truncate text-xs text-slate-500">
                      {c.lastMessage ?? "No messages yet"}
                    </p>
                  </div>

                  {c.unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                      {c.unreadCount}
                    </span>
                  )}
                </Link>
              ))}
          </div>
        )}
      </div>
    </Card>
  );
}