import type { Metadata } from "next";

import ClientDashboard from "@/components/dashboard/client/client-dashboard";

import { requireUser } from "@/lib/supabase/guard";
import { getClientBookings } from "@/lib/data/bookings";
import { getClientCases } from "@/lib/data/client-cases";
import { getMyConversations } from "@/lib/data/messages";
import { getClientPayments } from "@/lib/data/client-payments";
import { getMyNotifications } from "@/lib/data/notifications";

export const metadata: Metadata = {
  title: "Client Dashboard",
};

export default async function ClientDashboardPage() {
  const [
    profile,
    bookings,
    cases,
    conversations,
    payments,
    notifications,
  ] = await Promise.all([
    requireUser("client"),
    getClientBookings(),
    getClientCases(),
    getMyConversations(),
    getClientPayments(),
    getMyNotifications(),
  ]);

  return (
    <ClientDashboard
      profile={profile}
      bookings={bookings}
      cases={cases}
      conversations={conversations}
      payments={payments}
      notifications={notifications}
    />
  );
}