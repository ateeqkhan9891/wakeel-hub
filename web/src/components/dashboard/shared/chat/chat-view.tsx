
"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { MessageSquare } from "lucide-react";

import type { RealtimeChannel } from "@supabase/supabase-js";

import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { createClient } from "@/lib/supabase/client";

import {
  markConversationRead,
  sendMessage,
  type AttachmentInput,
} from "@/app/actions/message-actions";

import type {
  ActiveConversation,
  ChatMessage,
  ConversationSummary,
} from "@/lib/data/message-types";

import { ChatComposer } from "./chat-composer";
import { ChatConversationList } from "./chat-conversation-list";
import { ChatThread } from "./chat-thread";

type ChatViewProps = {
  conversations: ConversationSummary[];
  active: ActiveConversation | null;
  meId: string;
  basePath: string;
};

export function ChatView({
  conversations,
  active,
  meId,
  basePath,
}: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    active?.messages ?? [],
  );
  const [text, setText] = useState("");
  const [sending, startSending] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const typingCooldown = useRef(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const activeId = active?.id ?? null;

  const [trackedId, setTrackedId] = useState(activeId);

  if (trackedId !== activeId) {
    setTrackedId(activeId);
    setMessages(active?.messages ?? []);
    setOtherTyping(false);
  }

  useEffect(() => {
    if (activeId) {
      markConversationRead(activeId);
    }
  }, [activeId]);

  useEffect(() => {
    if (!activeId) {
      return;
    }

    const supabase = createClient();

    async function withUrl(message: ChatMessage) {
      if (
        message.attachment_path &&
        !message.attachment_url
      ) {
        const { data } = await supabase.storage
          .from("message-attachments")
          .createSignedUrl(
            message.attachment_path,
            3600,
          );

        return {
          ...message,
          attachment_url: data?.signedUrl ?? null,
        };
      }

      return message;
    }

    const channel = supabase
      .channel(`conv:${activeId}`, {
        config: {
          broadcast: {
            self: false,
          },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeId}`,
        },
        async (payload) => {
          const incoming = payload.new as ChatMessage;
          const message = await withUrl(incoming);

          setMessages((previous) =>
            previous.some((item) => item.id === message.id)
              ? previous
              : [...previous, message],
          );

          if (message.sender_id !== meId) {
            markConversationRead(activeId);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeId}`,
        },
        (payload) => {
          const updated = payload.new as ChatMessage;

          setMessages((previous) =>
            previous.map((message) =>
              message.id === updated.id
                ? {
                    ...message,
                    is_read: updated.is_read,
                  }
                : message,
            ),
          );
        },
      )
      .on(
        "broadcast",
        {
          event: "typing",
        },
        (payload) => {
          if (
            (payload.payload as { from?: string })?.from ===
            meId
          ) {
            return;
          }

          setOtherTyping(true);

          if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
          }

          typingTimeout.current = setTimeout(
            () => setOtherTyping(false),
            2500,
          );
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [activeId, meId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, otherTyping]);

  function broadcastTyping() {
    if (
      typingCooldown.current ||
      !channelRef.current
    ) {
      return;
    }

    typingCooldown.current = true;

    channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: {
        from: meId,
      },
    });

    setTimeout(() => {
      typingCooldown.current = false;
    }, 1500);
  }

  function appendOwn(message: ChatMessage) {
    setMessages((previous) =>
      previous.some((item) => item.id === message.id)
        ? previous
        : [...previous, message],
    );
  }

  function handleSend() {
    const body = text.trim();

    if (!body || !activeId) {
      return;
    }

    setText("");

    startSending(async () => {
      const result = await sendMessage(
        activeId,
        body,
      );

      if (!result.ok || !result.message) {
        toast.error("Message not sent", {
          description: result.error,
        });

        setText(body);
        return;
      }

      appendOwn(result.message);
    });
  }

  async function uploadAndSend(
    file: Blob,
    name: string,
    type: string,
  ) {
    if (!activeId) {
      return;
    }

    setUploading(true);

    const supabase = createClient();

    const extension = (
      name.split(".").pop() ||
      type.split("/")[1] ||
      "bin"
    ).toLowerCase();

    const path = `${activeId}/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("message-attachments")
      .upload(path, file, {
        contentType: type || undefined,
      });

    if (error) {
      setUploading(false);

      toast.error("Upload failed", {
        description: error.message,
      });

      return;
    }

    const attachment: AttachmentInput = {
      path,
      type,
      name,
      size: file.size,
    };

    const result = await sendMessage(
      activeId,
      "",
      attachment,
    );

    setUploading(false);

    if (!result.ok || !result.message) {
      toast.error("Could not send attachment", {
        description: result.error,
      });

      return;
    }

    appendOwn(result.message);
  }

  async function toggleRecording() {
    if (recording) {
      recorderRef.current?.stop();
      return;
    }

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        stream
          .getTracks()
          .forEach((track) => track.stop());

        const blob = new Blob(
          chunksRef.current,
          {
            type: "audio/webm",
          },
        );

        setRecording(false);

        if (blob.size > 0) {
          uploadAndSend(
            blob,
            "voice-note.webm",
            "audio/webm",
          );
        }
      };

      recorder.start();

      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      toast.error("Microphone unavailable", {
        description:
          "Allow microphone access to record a voice note.",
      });
    }
  }

  return (
    <div className="grid h-[calc(100svh-13rem)] grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[320px_1fr]">
      <ChatConversationList
        conversations={conversations}
        activeId={activeId}
        basePath={basePath}
      />

      <div
        className={cn(
          "flex min-h-0 flex-col overflow-hidden",
          !active && "hidden lg:flex",
        )}
      >
        {!active ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-secondary to-primary/10">
  <div className="absolute -inset-4 animate-[spin_6s_linear_infinite] bg-gradient-to-r from-primary/15 via-transparent to-primary/20 blur-xl" />

  <MessageSquare className="relative h-5 w-5 text-primary" />
</div>

            <h3 className="mt-4 font-heading text-sm font-semibold text-foreground">
                Your messages
            </h3>

            <p className="mt-1.5 max-w-xs text-sm leading-6 text-muted-foreground">
                Select a conversation from the list to view messages and continue the conversation.
            </p>
            </div>
        ) : (
          <>
            <ChatThread
              active={active}
              messages={messages}
              meId={meId}
              otherTyping={otherTyping}
              basePath={basePath}
              scrollRef={scrollRef}
            />

            <ChatComposer
              text={text}
              sending={sending}
              uploading={uploading}
              recording={recording}
              onTextChange={(value) => {
                setText(value);
                broadcastTyping();
              }}
              onSend={handleSend}
              onFile={(file) =>
                uploadAndSend(
                  file,
                  file.name,
                  file.type ||
                    "application/octet-stream",
                )
              }
              onToggleRecording={toggleRecording}
            />
          </>
        )}
      </div>
    </div>
  );
}
