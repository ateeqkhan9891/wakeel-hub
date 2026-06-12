import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireUser } from "@/lib/supabase/guard";
import { getUnreadNotificationCount } from "@/lib/data/notifications";
import { getUnreadMessagesCount } from "@/lib/data/messages";
import { getLawyerBookings } from "@/lib/data/bookings";

export default async function LawyerDashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireUser("lawyer");
  const [unread, messages, bookings] = await Promise.all([
    getUnreadNotificationCount(),
    getUnreadMessagesCount(),
    getLawyerBookings(),
  ]);
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const name = profile.full_name || "Advocate";

  return (
    <DashboardShell
      role="lawyer"
      user={{ name, email: profile.email, avatarSeed: name }}
      badges={{ notifications: unread, messages, bookings: pendingBookings }}
    >
      {children}
    </DashboardShell>
  );
}
