import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { getMyConversations, getConversationThread } from "@/lib/data/messages";
import { DashboardPageHeader } from "@/components/dashboard/lawyer-dashboard-ui";
import { ChatView } from "@/components/dashboard/chat-view";

export const metadata: Metadata = { title: "Messages" };

export default async function LawyerMessagesPage({
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
      <DashboardPageHeader
        title="Messages"
        description="Chat with your clients in real time. Conversations are private to you and the client."
      />
      <ChatView conversations={conversations} active={active} meId={auth.user?.id ?? ""} basePath="/dashboard/lawyer/messages" />
    </div>
  );
}
