import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireUser } from "@/lib/supabase/guard";
import { getUnreadNotificationCount } from "@/lib/data/notifications";
import { getUnreadMessagesCount } from "@/lib/data/messages";

export default async function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireUser("client");
  const [unread, messages] = await Promise.all([getUnreadNotificationCount(), getUnreadMessagesCount()]);
  const name = profile.full_name || "Client";

  return (
    <DashboardShell
      role="client"
      user={{ name, email: profile.email, avatarSeed: name }}
      badges={{ notifications: unread, messages }}
    >
      {children}
    </DashboardShell>
  );
}
