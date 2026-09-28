"use client";

import { useState, useTransition } from "react";
import { Bell, BriefcaseBusiness, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { WEEK_DAYS, TIME_SLOTS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { LawyerSettings } from "@/lib/data/lawyer-settings";
import type { LawyerVerificationStatus } from "@/lib/lawyer-dashboard-data";
import {
  changePassword,
  updateLawyerSettings,
} from "@/app/actions/settings-actions";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { SettingsPractice } from "./settings-practice";
import { SettingsNotifications } from "./settings-notifications";
import { SettingsPrivacy } from "./settings-privacy";
import { SettingsSecurity } from "./settings-security";
import {
  SettingsSubscription,
  type SettingsSubscription as SubscriptionData,
} from "./settings-subscription";

export type SettingsSidebarMeta = {
  completionPct: number;
  verificationStatus: LawyerVerificationStatus;
  isVerified: boolean;
  publicLive: boolean;
  slug: string;
};

type LawyerSettingsPanelProps = {
  settings: LawyerSettings;
  subscription: SubscriptionData;
  meta: SettingsSidebarMeta;
};

type FormTab =
  | "practice"
  | "notifications"
  | "privacy"
  | "security"
  | "subscription";

export function LawyerSettingsPanel({
  settings,
  subscription,
  meta,
}: LawyerSettingsPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<FormTab>("practice");

  const [form, setForm] = useState<LawyerSettings>(settings);

  const set = <K extends keyof LawyerSettings>(
    key: K,
    value: LawyerSettings[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const toggleArr = (
    key: "availabilityDays" | "availabilitySlots",
    value: string,
  ) => {
    setForm((current) => {
      const currentValues = current[key];

      return {
        ...current,
        [key]: currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  };

  const save = () => {
    startTransition(async () => {
      const result = await updateLawyerSettings({
        onlineFee: form.onlineFee,
        officeFee: form.officeFee,
        phoneFee: form.phoneFee,
        followUpFee: form.followUpFee,
        durationMinutes: form.durationMinutes,
        freeInitial: form.freeInitial,
        acceptsOnline: form.acceptsOnline,
        acceptsInPerson: form.acceptsInPerson,
        availabilityDays: form.availabilityDays,
        availabilitySlots: form.availabilitySlots,
        availabilityHours: form.availabilityHours,
        showPhone: form.showPhone,
        showEmail: form.showEmail,
        notifyBookings: form.notifyBookings,
        notifyMessages: form.notifyMessages,
        notifyPayments: form.notifyPayments,
        hearingReminders: form.hearingReminders,
      });

      if (!result.ok) {
        toast.error(result.error ?? "Failed to save settings.");
        return;
      }

      toast.success("Settings saved.");
      router.refresh();
    });
  };

  const handleChangePassword = async (
    password: string,
    confirmPassword: string,
  ) => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const result = await changePassword(password);

    if (!result.ok) {
      toast.error(result.error ?? "Failed to change password.");
      return;
    }

    toast.success("Password updated successfully.");
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    router.push("/login");
    router.refresh();
  };

  const handleRequestDeletion = () => {
    const confirmed = window.confirm(
      "Are you sure you want to request account deletion?",
    );

    if (!confirmed) return;

    toast.success(
      "Deletion request noted. Please contact support to complete the process.",
    );
  };

  return (
    <div className="space-y-5">
      <Card className="border-slate-200 p-2 ring-0">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as FormTab)}
        >
          <TabsList className="grid h-auto w-full grid-cols-5 bg-slate-50 p-1">
            <TabsTrigger
              value="practice"
              className="gap-1.5 py-2.5 text-xs sm:text-sm"
            >
              <BriefcaseBusiness className="h-4 w-4" />
              <span>Practice</span>
            </TabsTrigger>

            <TabsTrigger
              value="notifications"
              className="gap-1.5 py-2.5 text-xs sm:text-sm"
            >
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>

            <TabsTrigger
              value="privacy"
              className="gap-1.5 py-2.5 text-xs sm:text-sm"
            >
              <UserRound className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>

            <TabsTrigger
              value="security"
              className="gap-1.5 py-2.5 text-xs sm:text-sm"
            >
              <LockKeyhole className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>

            <TabsTrigger
              value="subscription"
              className="gap-1.5 py-2.5 text-xs sm:text-sm"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Subscription</span>
            </TabsTrigger>
          </TabsList>

          <div className="p-3 pt-5 sm:p-5">
            <TabsContent value="practice" className="mt-0">
              <SettingsPractice
                form={form}
                set={set}
                toggleArr={toggleArr}
              />
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <SettingsNotifications
                form={form}
                set={set}
              />
            </TabsContent>

            <TabsContent value="privacy" className="mt-0">
              <SettingsPrivacy
                form={form}
                set={set}
              />
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <SettingsSecurity
                settings={settings}
                isVerified={meta.isVerified}
                onChangePassword={handleChangePassword}
                onSignOut={handleSignOut}
                onRequestDeletion={handleRequestDeletion}
              />
            </TabsContent>

            <TabsContent value="subscription" className="mt-0">
              <SettingsSubscription subscription={subscription} />
            </TabsContent>
          </div>
        </Tabs>
      </Card>

      {activeTab !== "security" && activeTab !== "subscription" && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={save}
            disabled={isPending}
            className="min-w-32"
          >
            {isPending ? "Saving..." : "Save settings"}
          </Button>
        </div>
      )}
    </div>
  );
}