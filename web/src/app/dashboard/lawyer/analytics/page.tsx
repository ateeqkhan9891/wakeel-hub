import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";

import { DashboardCard, DashboardPageHeader, EmptyState, MetricCard } from "@/components/dashboard/lawyer/lawyer-dashboard-ui";

export const metadata: Metadata = { title: "Analytics" };

export default function LawyerAnalyticsPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Analytics" description="Analytics will populate after real profile views, bookings, cases, and payments exist." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard icon={BarChart3} label="Profile views" value="0" helper="No traffic yet" tone="slate" />
        <MetricCard icon={BarChart3} label="Bookings" value="0" helper="No requests yet" tone="slate" />
        <MetricCard icon={BarChart3} label="Payments" value="Rs. 0" helper="No payments yet" tone="slate" />
        <MetricCard icon={BarChart3} label="Reviews" value="0" helper="No reviews yet" tone="slate" />
      </div>
      <DashboardCard title="Practice analytics" description="No demo charts are shown in authenticated dashboards.">
        <EmptyState title="No analytics yet" description="Real analytics will appear after account-specific activity is recorded." />
      </DashboardCard>
    </div>
  );
}

