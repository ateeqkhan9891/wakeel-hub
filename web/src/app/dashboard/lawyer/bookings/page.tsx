import type { Metadata } from "next";

import { getLawyerBookings } from "@/lib/data/bookings";

import { LawyerBookingsLive } from "@/components/dashboard/lawyer/bookings/lawyer-bookings-live";

export const metadata: Metadata = {
  title: "Bookings",
};

export default async function LawyerBookingsPage() {
  const bookings = await getLawyerBookings();

  return (
    <div className="space-y-6">
      <LawyerBookingsLive bookings={bookings} />
    </div>
  );
}
