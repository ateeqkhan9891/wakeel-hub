import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getLawyerSettings } from "@/lib/data/lawyer-settings";
import { getMyLawyerProfile } from "@/lib/data/lawyer-profile";
import { getLawyerSubscription } from "@/lib/data/lawyer-subscription";
import { DashboardPageHeader } from "@/components/dashboard/lawyer/lawyer-dashboard-ui";
import {
  LawyerSettingsPanel,
  type SettingsSubscription,
  type SettingsSidebarMeta,
} from "@/components/dashboard/lawyer/lawyer-settings-panel";

export const metadata: Metadata = { title: "Settings" };

/** Profile-completion checklist shared with the profile view (real fields only). */
function completionPct(p: NonNullable<Awaited<ReturnType<typeof getMyLawyerProfile>>>): number {
  const checks = [
    Boolean(p.photoUrl),
    p.about.trim().length >= 40,
    Boolean(p.professionalTitle),
    p.practiceAreas.length > 0,
    p.courts.length > 0,
    p.experience.length > 0,
    p.education.length > 0,
    p.languages.length > 0,
    Number(p.onlineConsultationFee) > 0 || Number(p.officeConsultationFee) > 0 || Number(p.phoneConsultationFee) > 0,
    p.availabilityDays.length > 0,
    Boolean(p.officeAddress),
    p.verificationStatus !== "not_submitted",
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default async function LawyerSettingsPage() {
  const [settings, profile, sub] = await Promise.all([
    getLawyerSettings(),
    getMyLawyerProfile(),
    getLawyerSubscription(),
  ]);
  if (!settings) redirect("/login");

  const subscription: SettingsSubscription | null = sub
    ? {
        status: sub.status,
        plan: sub.plan,
        period: sub.period,
        expiresAt: sub.expiresAt,
        daysRemaining: sub.daysRemaining,
        expired: sub.expired,
        expiringSoon: sub.expiringSoon,
      }
    : null;

  const meta: SettingsSidebarMeta = {
    completionPct: profile ? completionPct(profile) : 0,
    verificationStatus: profile?.verificationStatus ?? "not_submitted",
    isVerified: profile?.isVerified ?? false,
    publicLive: Boolean(profile?.isVerified && profile?.slug),
    slug: profile?.slug ?? "",
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Settings"
        description="Manage your practice details, notifications, privacy settings, security, and subscription."
      />
      <LawyerSettingsPanel settings={settings} subscription={subscription} meta={meta} />
    </div>
  );
}
