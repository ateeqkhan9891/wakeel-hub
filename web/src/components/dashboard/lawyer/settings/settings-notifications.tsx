"use client";

import {
  Bell,
  CalendarCheck,
  CreditCard,
  MessageSquare,
  Scale,
} from "lucide-react";

import type { LawyerSettings } from "@/lib/data/lawyer-settings";

import { SettingsCard, Toggle, ToggleGroup } from "./settings-ui";

type SettingsNotificationsProps = {
  form: LawyerSettings;
  set: <K extends keyof LawyerSettings>(
    key: K,
    value: LawyerSettings[K],
  ) => void;
};

const notificationItems = [
  {
    key: "notifyBookings",
    label: "Booking requests",
    description: "Get notified when a client requests a consultation.",
    icon: CalendarCheck,
  },
  {
    key: "notifyMessages",
    label: "Messages",
    description: "Get notified when clients send you a new message.",
    icon: MessageSquare,
  },
  {
    key: "notifyPayments",
    label: "Payment updates",
    description: "Receive notifications about consultation payments.",
    icon: CreditCard,
  },
  {
    key: "hearingReminders",
    label: "Hearing reminders",
    description: "Receive reminders about upcoming case hearings.",
    icon: Scale,
  },
] as const;

export function SettingsNotifications({
  form,
  set,
}: SettingsNotificationsProps) {
  return (
    <div className="space-y-5">
      <SettingsCard
        icon={Bell}
        title="Notifications"
        description="Choose which activity and account updates you want to receive."
      >
        <ToggleGroup>
          {notificationItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.key}
                className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition-colors group-hover:border-primary/15 group-hover:bg-primary/5 group-hover:text-primary">
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

          <div className="flex items-center gap-4 py-4 last:pb-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
              <Bell className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <Toggle
                label="Subscription alerts"
                description="Get notified about subscription expiry and account-related changes."
                checked
                onChange={() => {}}
                disabled
                comingSoon
              />
            </div>
          </div>
        </ToggleGroup>
      </SettingsCard>

      <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3.5">
        <div className="flex items-start gap-3">
          <Bell className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

          <div>
            <p className="text-xs font-medium text-slate-700">
              Notification preferences
            </p>
            <p className="mt-0.5 text-xs leading-5 text-slate-500">
              These preferences control the notifications sent to your account.
              You can change them at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
