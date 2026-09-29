"use client";

import Link from "next/link";

import {
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";

import type { LawyerVerificationStatus } from "@/lib/lawyer-dashboard-data";

import type { SettingsSubscription } from "./settings-subscription";

import { StatusRow } from "./settings-ui";

export type SettingsSidebarMeta = {
  completionPct: number;
  verificationStatus: LawyerVerificationStatus;
  isVerified: boolean;
  publicLive: boolean;
  slug: string;
};

type SettingsSidebarProps = {
  meta: SettingsSidebarMeta;
  subscription: SettingsSubscription;
};

function verifyLabel(status: LawyerVerificationStatus) {
  switch (status) {
    case "approved":
      return "Verified";
    case "pending":
      return "Pending review";
    case "rejected":
      return "Rejected";
    default:
      return "Not submitted";
  }
}

function verificationTone(
  status: LawyerVerificationStatus,
): "emerald" | "amber" | "slate" {
  if (status === "approved") return "emerald";
  if (status === "pending") return "amber";
  return "slate";
}

export function SettingsSidebar({
  meta,
  subscription,
}: SettingsSidebarProps) {
  const subscriptionActive =
    subscription.status === "active" && !subscription.expired;

  return (
    <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-primary/[0.12] via-primary/[0.05] to-transparent" />

        <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-primary/[0.06]" />

        <div className="relative p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-white text-primary shadow-sm">
                <UserRound className="h-4.5 w-4.5" />
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary/70">
                  Profile
                </p>

                <h3 className="mt-0.5 font-heading text-sm font-semibold tracking-tight text-slate-950">
                  Profile completion
                </h3>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-2xl font-semibold tracking-tight text-slate-950">
                {meta.completionPct}%
              </p>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Complete
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-100">
              <Progress
                value={meta.completionPct}
                className="h-full rounded-full"
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Profile strength</span>
              <span className="font-medium text-slate-600">
                {meta.completionPct >= 90
                  ? "Excellent"
                  : meta.completionPct >= 70
                    ? "Good"
                    : meta.completionPct >= 40
                      ? "Getting there"
                      : "Needs attention"}
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5">
            <p className="text-xs font-medium text-slate-700">
              Complete your profile
            </p>

            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              Add your experience, practice areas, education, and availability
              so clients can better understand your services.
            </p>
          </div>

          <Link
            href="/dashboard/lawyer/profile"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Improve profile
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/10 bg-primary/5 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </span>

            <div>
              <h3 className="font-heading text-sm font-semibold tracking-tight text-slate-950">
                Account status
              </h3>

              <p className="text-xs text-slate-500">
                Current account overview
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="space-y-1">
            <StatusRow
              icon={ShieldCheck}
              label="Verification"
              value={verifyLabel(meta.verificationStatus)}
              tone={verificationTone(meta.verificationStatus)}
            />

            <StatusRow
              icon={CheckCircle2}
              label="Subscription"
              value={subscriptionActive ? "Active" : "Inactive"}
              tone={subscriptionActive ? "emerald" : "slate"}
            />

            <StatusRow
              icon={UserRound}
              label="Public profile"
              value={meta.publicLive ? "Live" : "Hidden"}
              tone={meta.publicLive ? "emerald" : "slate"}
            />
          </div>

          {meta.publicLive && meta.slug && (
            <Link
              href={`/lawyers/${meta.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
            >
              View public profile
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
