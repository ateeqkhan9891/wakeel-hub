import type { Metadata } from "next";
import { NotificationsFeed } from "@/components/dashboard/shared/notifications-feed";
import { getMyNotifications } from "@/lib/data/notifications";

export const metadata: Metadata = { title: "Notifications" };

export default async function ClientNotificationsPage() {
  const notifications = await getMyNotifications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Notifications</h1>
        <p className="mt-1 text-sm text-muted-foreground">Stay up to date on bookings, case progress, payments, and messages.</p>
      </div>
      <NotificationsFeed notifications={notifications} />
    </div>
  );
}
