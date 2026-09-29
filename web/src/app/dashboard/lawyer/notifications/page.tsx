import type { Metadata } from "next";

import { getMyNotifications } from "@/lib/data/notifications";
// import { DashboardPageHeader } from "@/components/dashboard/lawyer/lawyer-dashboard-ui";
import { NotificationsFeed } from "@/components/dashboard/shared/notifications/notifications-feed";

export const metadata: Metadata = { title: "Notifications" };

export default async function LawyerNotificationsPage() {
  const notifications = await getMyNotifications();

  return (
    <div className="space-y-6">
      {/* <DashboardPageHeader
        title="Notifications"
        description="Booking requests, payments, case updates, hearings, and verification alerts - scoped to your account."
      /> */}
      <NotificationsFeed notifications={notifications} />
    </div>
  );
}

