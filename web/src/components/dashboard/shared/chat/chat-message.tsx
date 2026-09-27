"use client";

import {
  Check,
  CheckCheck,
  Download,
  FileText,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { ChatMessage } from "@/lib/data/message-types";

type ChatMessageProps = {
  message: ChatMessage;
  mine: boolean;
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatSize(bytes: number | null) {
  if (!bytes) return "";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function MessageBody({
  message,
  mine,
}: {
  message: ChatMessage;
  mine: boolean;
}) {
  const type = message.attachment_type ?? "";

  return (
    <div className="space-y-1.5">
      {message.attachment_path &&
        (type.startsWith("image/") ? (
          message.attachment_url ? (
            <a
              href={message.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={message.attachment_url}
                alt={message.attachment_name ?? "image"}
                className="max-h-60 w-full rounded-lg object-cover"
              />
            </a>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-lg bg-black/5 text-xs">
              Loading image...
            </div>
          )
        ) : type.startsWith("audio/") ? (
          message.attachment_url ? (
            <audio
              controls
              src={message.attachment_url}
              className="h-10 w-56 max-w-full"
            />
          ) : (
            <div className="text-xs opacity-80">
              Loading voice note...
            </div>
          )
        ) : (
          <a
            href={message.attachment_url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-2 rounded-lg px-2.5 py-2",
              mine ? "bg-white/15" : "bg-secondary",
            )}
          >
            <FileText className="h-4 w-4 shrink-0" />

            <span className="min-w-0 flex-1">
              <span className="block truncate">
                {message.attachment_name ?? "Document"}
              </span>

              <span className="text-[10px] opacity-70">
                {formatSize(message.attachment_size)}
              </span>
            </span>

            <Download className="h-3.5 w-3.5 shrink-0 opacity-80" />
          </a>
        ))}

      {message.body && (
        <p className="whitespace-pre-wrap break-words leading-6">
          {message.body}
        </p>
      )}
    </div>
  );
}

export function ChatMessage({
  message,
  mine,
}: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex",
        mine ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-3.5 py-2 text-sm",
          mine
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm border border-border bg-card text-foreground",
        )}
      >
        <MessageBody message={message} mine={mine} />

        <div
          className={cn(
            "mt-1 flex items-center justify-end gap-1 text-[10px]",
            mine
              ? "text-primary-foreground/70"
              : "text-muted-foreground",
          )}
        >
          <span>{formatTime(message.created_at)}</span>

          {mine &&
            (message.is_read ? (
              <CheckCheck className="h-3.5 w-3.5" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            ))}
        </div>
      </div>
    </div>
  );
}