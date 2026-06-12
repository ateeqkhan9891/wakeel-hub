import type { Metadata } from "next";

import { DashboardCard, DashboardPageHeader, EmptyState } from "@/components/dashboard/lawyer-dashboard-ui";

export const metadata: Metadata = { title: "Reviews" };

export default function LawyerReviewsPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Reviews" description="Client reviews will appear after verified consultations or cases are completed." />
      <DashboardCard title="Client feedback" description="No public or private feedback is shown until real clients leave reviews.">
        <EmptyState title="No reviews yet" description="Reviews will appear after completed real client work." />
      </DashboardCard>
    </div>
  );
}
