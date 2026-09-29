"use client";

import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Crown,
  Clock3,
} from "lucide-react";

import { formatDate, formatDateTime } from "@/lib/utils";

import {
  InfoRow,
  SettingsCard,
  SubRow,
} from "./settings-ui";

export type SettingsSubscription = {
  status: "inactive" | "active";
  plan: string | null;
  period: string | null;
  expiresAt: string | null;
  daysRemaining: number | null;
  expired: boolean;
  expiringSoon: boolean;
};

type SettingsSubscriptionProps = {
  subscription: SettingsSubscription;
};

function planLabel(plan: string | null) {
  if (!plan) return "No active plan";

  return plan
    .replace(/[\_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function SettingsSubscription({
  subscription,
}: SettingsSubscriptionProps) {
  const active =
    subscription.status === "active" && !subscription.expired;

  const statusLabel = active ? "Active" : "Inactive";

  return (
    <div className="space-y-5">
      <SettingsCard
        icon={Crown}
        title="Subscription"
        description="Review your current plan, billing period, and subscription status."
      >
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-primary/[0.07] via-white to-white p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary">
                  <Crown className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Current plan
                  </p>

                  <h3 className="mt-0.5 text-base font-semibold tracking-tight text-slate-950">
                    {planLabel(subscription.plan)}
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {subscription.period
                      ? `${subscription.period} billing period`
                      : "No billing period configured"}
                  </p>
                </div>
              </div>

              <span
                className={
                  active
                    ? "inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                    : "inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600"
                }
              >
                <span
                  className={
                    active
                      ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
                      : "h-1.5 w-1.5 rounded-full bg-slate-400"
                  }
                />
                {statusLabel}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200/80 bg-white/80 p-3.5">
                <SubRow label="Expires">
                  {subscription.expiresAt
                    ? formatDate(subscription.expiresAt)
                    : "No expiry date"}
                </SubRow>
              </div>

              <div className="rounded-lg border border-slate-200/80 bg-white/80 p-3.5">
                <SubRow label="Remaining">
                  {active && subscription.daysRemaining !== null
                    ? `${subscription.daysRemaining} days`
                    : "—"}
                </SubRow>
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={CreditCard}
        title="Subscription details"
        description="Current subscription information associated with your account."
      >
        <dl className="divide-y divide-slate-100">
          <InfoRow label="Plan">
            {planLabel(subscription.plan)}
          </InfoRow>

          <InfoRow label="Status">
            <span
              className={
                active
                  ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                  : "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
              }
            >
              <span
                className={
                  active
                    ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
                    : "h-1.5 w-1.5 rounded-full bg-slate-400"
                }
              />
              {statusLabel}
            </span>
          </InfoRow>

          <InfoRow label="Billing period">
            {subscription.period || "Not available"}
          </InfoRow>

          <InfoRow label="Expiry date">
            {subscription.expiresAt
              ? formatDateTime(subscription.expiresAt)
              : "Not available"}
          </InfoRow>
        </dl>
      </SettingsCard>

      {subscription.expiringSoon && active && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-amber-100 text-amber-600">
              <Clock3 className="h-4 w-4" />
            </span>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                Subscription expiring soon
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Your current subscription is approaching its expiry date.
                Review your plan before it expires to avoid interruption.
              </p>
            </div>
          </div>
        </div>
      )}

      {subscription.expired && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-500">
              <CalendarDays className="h-4 w-4" />
            </span>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                Subscription expired
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Your subscription has expired. Review your subscription
                options to continue using subscription features.
              </p>
            </div>
          </div>
        </div>
      )}

      {!active && !subscription.expired && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
              <CheckCircle2 className="h-4 w-4" />
            </span>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                No active subscription
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Your account currently does not have an active subscription.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
