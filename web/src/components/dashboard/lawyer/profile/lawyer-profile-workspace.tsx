"use client";

import { useMemo, useState } from "react";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { LawyerFullProfile } from "@/lib/data/lawyer-profile-types";

import { LawyerProfileEditor } from "@/components/dashboard/lawyer/lawyer-profile-editor";

import {
  LawyerProfileHero,
  type SubscriptionInfo,
} from "./lawyer-profile-hero";

export type { SubscriptionInfo };

import { LawyerProfilePerformance } from "./lawyer-profile-performance";

import { LawyerProfileDetails } from "./lawyer-profile-details";

import { LawyerProfileConsultation } from "./lawyer-profile-consultation";

import { LawyerProfileSidebar } from "./lawyer-profile-sidebar";

const COMPLETION_ITEMS = [
  {
    label: "Profile photo",
    check: (profile: LawyerFullProfile) =>
      Boolean(profile.photoUrl),
  },
  {
    label: "Biography",
    check: (profile: LawyerFullProfile) =>
      profile.about.trim().length >= 40,
  },
  {
    label: "Professional title",
    check: (profile: LawyerFullProfile) =>
      Boolean(profile.professionalTitle.trim()),
  },
  {
    label: "Practice areas",
    check: (profile: LawyerFullProfile) =>
      profile.practiceAreas.length > 0,
  },
  {
    label: "Courts",
    check: (profile: LawyerFullProfile) =>
      profile.courts.length > 0,
  },
  {
    label: "Experience",
    check: (profile: LawyerFullProfile) =>
      profile.experience.length > 0 ||
      Boolean(profile.experienceYears),
  },
  {
    label: "Education",
    check: (profile: LawyerFullProfile) =>
      profile.education.length > 0,
  },
  {
    label: "Languages",
    check: (profile: LawyerFullProfile) =>
      profile.languages.length > 0,
  },
  {
    label: "Consultation fees",
    check: (profile: LawyerFullProfile) =>
      Number(profile.onlineConsultationFee) > 0 ||
      Number(profile.officeConsultationFee) > 0 ||
      Number(profile.phoneConsultationFee) > 0,
  },
  {
    label: "Availability",
    check: (profile: LawyerFullProfile) =>
      profile.availabilityDays.length > 0 &&
      profile.availabilitySlots.length > 0,
  },
  {
    label: "Office address",
    check: (profile: LawyerFullProfile) =>
      Boolean(profile.officeAddress.trim()),
  },
  {
    label: "Verification documents",
    check: (profile: LawyerFullProfile) =>
      Boolean(
        profile.barCouncilNumber.trim() &&
          profile.licenseNumber.trim() &&
          profile.barEnrollmentYear.trim(),
      ),
  },
] as const;

export function LawyerProfileWorkspace({
  profile,
  subscription,
}: {
  profile: LawyerFullProfile;
  subscription: SubscriptionInfo | null;
}) {
  const [editing, setEditing] = useState(false);

  const completion = useMemo(() => {
    const items = COMPLETION_ITEMS.map((item) => ({
      label: item.label,
      done: item.check(profile),
    }));

    const done = items.filter((item) => item.done).length;
    const total = items.length;
    const pct = Math.round((done / total) * 100);

    return {
      items,
      done,
      total,
      pct,
    };
  }, [profile]);

  function startEditing() {
    setEditing(true);
  }

  function stopEditing() {
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={stopEditing}
            className="gap-2 px-2 text-slate-600 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to profile
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={stopEditing}
          >
            Done editing
          </Button>
        </div>

        <LawyerProfileEditor user={profile} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LawyerProfileHero
        profile={profile}
        subscription={subscription}
        completion={{
          done: completion.done,
          total: completion.total,
          pct: completion.pct,
        }}
        onEdit={startEditing}
      />

      <LawyerProfilePerformance profile={profile} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <LawyerProfileDetails
            profile={profile}
            onEdit={startEditing}
          />

          <LawyerProfileConsultation
            profile={profile}
            onEdit={startEditing}
          />
        </div>

        <LawyerProfileSidebar
          profile={profile}
          completion={completion}
          onEdit={startEditing}
        />
      </div>
    </div>
  );
}