"use client";

import { useRef } from "react";

import {
  Loader2,
  Mic,
  Paperclip,
  Send,
  Square,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatComposerProps = {
  text: string;
  sending: boolean;
  uploading: boolean;
  recording: boolean;
  onTextChange: (value: string) => void;
  onSend: () => void;
  onFile: (file: File) => void;
  onToggleRecording: () => void;
};

export function ChatComposer({
  text,
  sending,
  uploading,
  recording,
  onTextChange,
  onSend,
  onFile,
  onToggleRecording,
}: ChatComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (file) {
      onFile(file);
    }
  }

  return (
    <div className="flex items-end gap-2 border-t border-border p-3">
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Attach file"
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Paperclip className="h-4 w-4" />
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf,.doc,.docx"
        className="sr-only"
        disabled={uploading}
        onChange={handleFileChange}
      />

      <Button
        type="button"
        size="icon"
        variant={recording ? "default" : "outline"}
        onClick={onToggleRecording}
        disabled={uploading}
        className={cn(
          "h-10 w-10 shrink-0 rounded-xl",
          recording &&
            "bg-rose-600 text-white hover:bg-rose-600",
        )}
        aria-label={
          recording
            ? "Stop recording"
            : "Record voice note"
        }
      >
        {recording ? (
          <Square className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>

      <Textarea
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSend();
          }
        }}
        rows={1}
        placeholder={
          recording
            ? "Recording voice note..."
            : "Type a message..."
        }
        className="max-h-32 min-h-10 flex-1 resize-none rounded-xl"
      />

      <Button
        type="button"
        onClick={onSend}
        disabled={sending || !text.trim()}
        size="icon"
        className="h-10 w-10 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        aria-label="Send message"
      >
        {sending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
