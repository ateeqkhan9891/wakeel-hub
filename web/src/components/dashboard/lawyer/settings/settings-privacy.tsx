"use client";

import {
  Eye,
  Globe2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
} from "lucide-react";

import type { LawyerSettings } from "@/lib/data/lawyer-settings";

import { SettingsCard, Toggle, ToggleGroup } from "./settings-ui";

type SettingsPrivacyProps = {
  form: LawyerSettings;
  set: <K extends keyof LawyerSettings>(
    key: K,
    value: LawyerSettings[K],
  ) => void;
};

const privacyItems = [
  {
    label: "Show phone number",
    description: "Allow visitors to see your phone number on your public profile.",
    icon: Phone,
    key: "showPhone",
  },
  {
    label: "Show email address",
    description: "Allow visitors to see your email address on your public profile.",
    icon: Mail,
    key: "showEmail",
  },
] as const;

const upcomingItems = [
  {
    label: "Show office address",
    description: "Display your office address publicly.",
    icon: MapPin,
  },
  {
    label: "Appear in lawyer search",
    description: "Allow clients to discover your profile through lawyer search.",
    icon: Globe2,
  },
  {
    label: "Allow public enquiries",
    description: "Allow visitors to send you an enquiry from your public profile.",
    icon: MessageSquare,
  },
];

export function SettingsPrivacy({
  form,
  set,
}: SettingsPrivacyProps) {
  return (
    <div className="space-y-5">
      <SettingsCard
        icon={Eye}
        title="Public profile"
        description="Control the contact information and visibility options available to potential clients."
      >
        <ToggleGroup>
          {privacyItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.key}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <Toggle
                    label={item.label}
                    description={item.description}
                    checked={form[item.key]}
                    onChange={(value) => set(item.key, value)}
                  />
                </div>
              </div>
            );
          })}

          {upcomingItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-4 py-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <Toggle
                    label={item.label}
                    description={item.description}
                    checked={false}
                    onChange={() => {}}
                    disabled
                    comingSoon
                  />
                </div>
              </div>
            );
          })}
        </ToggleGroup>
      </SettingsCard>

      <SettingsCard
        icon={ShieldCheck}
        title="Privacy & security"
        description="Understand how your private account information is handled."
      >
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm ring-1 ring-slate-200/80">
              <ShieldCheck className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900">
                Your private information stays private
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your account email, authentication credentials, and other
                private account information are only available to you and
                authorized platform services.
              </p>
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
