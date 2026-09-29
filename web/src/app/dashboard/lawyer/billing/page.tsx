import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getLawyerSubscription } from "@/lib/data/lawyer-subscription";
import { DashboardPageHeader } from "@/components/dashboard/lawyer/lawyer-dashboard-ui";
import { BillingPanel } from "@/components/dashboard/shared/billing-panel";

export const metadata: Metadata = { title: "Subscription & Billing" };

export default async function LawyerBillingPage() {
  const subscription = await getLawyerSubscription();
  if (!subscription) redirect("/login");

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Subscription & Billing"
        description="Choose a plan to start receiving clients, manage your subscription, and download invoices."
      />
      <BillingPanel subscription={subscription} />
    </div>
  );
}

