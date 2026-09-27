import type { Metadata } from "next";

import { getLawyerHearings } from "@/lib/data/lawyer-hearings";
import { DashboardPageHeader } from "@/components/dashboard/lawyer/lawyer-dashboard-ui";
import { LawyerHearingsCalendar } from "@/components/dashboard/lawyer/lawyer-hearings-calendar";

export const metadata: Metadata = { title: "Hearings" };

export default async function LawyerHearingsPage() {
  const hearings = await getLawyerHearings();

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Hearings" description="Review today, weekly, upcoming, and past court dates across your cases." />
      <LawyerHearingsCalendar hearings={hearings} />
    </div>
  );
}
