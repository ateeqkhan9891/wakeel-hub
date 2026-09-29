import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { getLawyerEarnings } from "@/lib/data/commission";

import { DashboardPageHeader } from "@/components/dashboard/lawyer/lawyer-dashboard-ui";

import { LawyerEarningsStats } from "@/components/dashboard/lawyer/earnings/lawyer-earnings-stats";
import { LawyerEarningsTable } from "@/components/dashboard/lawyer/earnings/lawyer-earnings-table";

export const metadata: Metadata = {
  title: "Earnings",
};

export default async function LawyerPaymentsPage() {
  const earnings = await getLawyerEarnings();

  if (!earnings) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Earnings & Payouts"
        description="Your consultation earnings after platform commission, and the status of each payout."
      />

      <LawyerEarningsStats earnings={earnings} />

      <LawyerEarningsTable earnings={earnings} />

      <p className="text-xs text-muted-foreground">
        Payouts are processed by Wakeel360 after each consultation is
        completed. You&apos;ll be notified when a payout is marked paid.
      </p>
    </div>
  );
}
