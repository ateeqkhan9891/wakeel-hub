import type { Metadata } from "next";

import { getCurrentLawyerDashboardData } from "@/lib/lawyer-dashboard-data";
import { DashboardCard, DashboardPageHeader, EmptyState } from "@/components/dashboard/lawyer/lawyer-dashboard-ui";

export const metadata: Metadata = { title: "Clients" };

export default async function LawyerClientsPage() {
  const data = await getCurrentLawyerDashboardData();

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Clients" description="Client records will appear only after they are linked to your lawyer account." />
      <DashboardCard title="Client directory" description="This direct route is intentionally empty for new lawyers.">
        {data.bookings.length === 0 && data.cases.length === 0 ? (
          <EmptyState title="No clients yet" description="Clients will appear after a real booking or case is connected to your account." />
        ) : null}
      </DashboardCard>
    </div>
  );
}

