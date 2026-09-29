import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getMyLawyerProfile } from "@/lib/data/lawyer-profile";
import { getLawyerSubscription } from "@/lib/data/lawyer-subscription";
import { DashboardPageHeader } from "@/components/dashboard/lawyer/lawyer-dashboard-ui";
import {
  LawyerProfileWorkspace,
  type SubscriptionInfo,
} from "@/components/dashboard/lawyer/profile/lawyer-profile-workspace";

export const metadata: Metadata = { title: "Profile & Verification" };

export default async function LawyerProfilePage() {
  const [profile, sub] = await Promise.all([getMyLawyerProfile(), getLawyerSubscription()]);
  if (!profile) redirect("/login");

  const subscription: SubscriptionInfo | null = sub
    ? { status: sub.status, plan: sub.plan, daysRemaining: sub.daysRemaining, expired: sub.expired }
    : null;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Profile & Verification"
        description="Your public advocate profile - see how clients view you, and edit any section."
      />
      <LawyerProfileWorkspace profile={profile} subscription={subscription} />
    </div>
  );
}

