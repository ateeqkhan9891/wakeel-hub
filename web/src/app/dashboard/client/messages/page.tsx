import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { getMyConversations, getConversationThread } from "@/lib/data/messages";
import { ChatView } from "@/components/dashboard/shared/chat/chat-view";

export const metadata: Metadata = { title: "Messages" };

export default async function ClientMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  const supabase = await createClient();
  const [{ data: auth }, conversations] = await Promise.all([supabase.auth.getUser(), getMyConversations()]);
  const active = c ? await getConversationThread(c) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">Chat directly with your advocates in real time.</p>
      </div>
      <ChatView conversations={conversations} active={active} meId={auth.user?.id ?? ""} basePath="/dashboard/client/messages" />
    </div>
  );
}
