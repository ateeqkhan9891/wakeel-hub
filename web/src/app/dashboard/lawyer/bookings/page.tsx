import type { Metadata } from "next";

import { getLawyerBookings } from "@/lib/data/bookings";
import { DashboardPageHeader } from "@/components/dashboard/lawyer/lawyer-dashboard-ui";
import { LawyerBookingsLive } from "@/components/dashboard/lawyer/lawyer-bookings-live";

export const metadata: Metadata = { title: "Bookings" };

export default async function LawyerBookingsPage() {
  const bookings = await getLawyerBookings();

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Bookings"
        description="Review consultation requests, manage scheduled sessions, and convert consultations into cases."
      />
      <LawyerBookingsLive bookings={bookings} />
    </div>
  );
}
