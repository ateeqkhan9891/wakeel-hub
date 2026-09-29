"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getOrCreateConversationFromBooking } from "@/app/actions/message-actions";

export function OpenChatButton({
  bookingId, basePath, label = "Message", variant = "outline", className,
}: {
  bookingId: string;
  basePath: string;
  label?: string;
  variant?: "outline" | "default" | "secondary";
  className?: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function open() {
    start(async () => {
      const res = await getOrCreateConversationFromBooking(bookingId);
      if (!res.ok || !res.id) {
        toast.error("Could not open chat", { description: res.error });
        return;
      }
      router.push(`${basePath}?c=${res.id}`);
    });
  }

  return (
    <Button type="button" size="sm" variant={variant} onClick={open} disabled={pending} className={cn("gap-1.5", className)}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
      {label}
    </Button>
  );
}

