
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getLawyerSettings } from "@/lib/data/lawyer-settings";
import { getMyLawyerProfile } from "@/lib/data/lawyer-profile";
import { getLawyerSubscription } from "@/lib/data/lawyer-subscription";

import { DashboardPageHeader } from "@/components/dashboard/lawyer/lawyer-dashboard-ui";
import { LawyerSettingsPanel } from "@/components/dashboard/lawyer/settings/lawyer-settings-panel";
import { SettingsSidebar } from "@/components/dashboard/lawyer/settings/settings-sidebar";

export const metadata: Metadata = {
  title: "Settings",
};

function completionPct(
  profile: Awaited<ReturnType<typeof getMyLawyerProfile>>,
) {
  if (!profile) return 0;

  const checks = [
    Boolean(profile.photoUrl),
    Boolean(profile.about && profile.about.length >= 40),
    Boolean(profile.professionalTitle),
    profile.practiceAreas.length > 0,
    profile.courts.length > 0,
    profile.experience.length > 0,
    profile.education.length > 0,
    profile.languages.length > 0,
    [
      profile.onlineConsultationFee,
      profile.officeConsultationFee,
      profile.phoneConsultationFee,
    ].some((fee) => Number(fee) > 0),
    profile.availabilityDays.length > 0,
    Boolean(profile.officeAddress),
    profile.verificationStatus !== "not_submitted",
  ];

  return Math.round(
    (checks.filter(Boolean).length / checks.length) * 100,
  );
}

export default async function LawyerSettingsPage() {
  const [settings, profile, subscription] = await Promise.all([
    getLawyerSettings(),
    getMyLawyerProfile(),
    getLawyerSubscription(),
  ]);

  if (!settings) {
    redirect("/login");
  }

  const settingsSubscription = {
    status: subscription?.status === "active" ? "active" : "inactive",
    plan: subscription?.plan ?? null,
    period: subscription?.period ?? null,
    expiresAt: subscription?.expiresAt ?? null,
    daysRemaining: subscription?.daysRemaining ?? null,
    expired: subscription?.expired ?? false,
    expiringSoon: subscription?.expiringSoon ?? false,
  } as const;

  const meta = {
    completionPct: completionPct(profile),
    verificationStatus: profile?.verificationStatus ?? "not_submitted",
    isVerified: profile?.verificationStatus === "approved",
    publicLive: Boolean(profile?.slug),
    slug: profile?.slug ?? "",
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Settings"
        description="Manage your practice, notifications, privacy, security, and subscription."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <LawyerSettingsPanel
          settings={settings}
          subscription={settingsSubscription}
          meta={meta}
        />

        <SettingsSidebar
          meta={meta}
          subscription={settingsSubscription}
        />
      </div>
    </div>
  );
}

