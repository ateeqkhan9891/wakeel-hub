import Link from "next/link";

import {
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";

type LawyerDashboardHeaderProps = {
  isVerified: boolean;
  isSubscribed: boolean;
  verificationStatus?: string | null;
  displayName: string;
  publicProfileHref: string;
  strength: number;
};

function greeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function LawyerDashboardHeader({
  isVerified,
  isSubscribed,
  verificationStatus,
  displayName,
  publicProfileHref,
  strength,
}: LawyerDashboardHeaderProps) {
  const isLive = isVerified && isSubscribed;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60 sm:rounded-3xl">
      <div
        className={
          isLive
            ? "h-1 bg-emerald-500"
            : "h-1 bg-amber-400"
        }
      />

      <div className="p-5 sm:p-7 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center lg:gap-12">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                status={
                  isVerified
                    ? "approved"
                    : verificationStatus ?? "not_submitted"
                }
              />

              <StatusBadge
                status={isSubscribed ? "active" : "inactive"}
              />

              {isLive && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Profile live
                </span>
              )}
            </div>

            <p className="mt-7 text-sm font-medium text-slate-500">
              {greeting()}
            </p>

            <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {displayName}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              {isLive
                ? "Your profile is live and visible to clients on WakeelHub Pakistan."
                : isVerified
                  ? "Your verification is complete. Activate your subscription to stay visible to clients."
                  : "Complete your verification and subscription setup to make your public profile client-ready."}
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <Button
                asChild
                className="w-full rounded-xl bg-slate-950 px-5 text-white shadow-sm hover:bg-slate-800 sm:w-auto"
              >
                <Link href="/dashboard/lawyer/profile">
                  Update Profile
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full rounded-xl border-slate-200 bg-white px-5 text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-950 sm:w-auto"
              >
                <Link href="/dashboard/lawyer/billing">
                  Manage Subscription
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full rounded-xl px-4 text-slate-600 hover:bg-slate-100 hover:text-slate-950 sm:w-auto"
              >
                <Link
                  href={publicProfileHref}
                  className="inline-flex items-center gap-1.5"
                >
                  View Public Profile
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:rounded-3xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Profile strength
                </p>

                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-semibold tracking-tight text-slate-950">
                    {strength}
                  </span>

                  <span className="text-base font-medium text-slate-400">
                    / 100
                  </span>
                </div>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-emerald-600 shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">
                  Completion
                </span>

                <span className="font-semibold text-slate-700">
                  {strength}%
                </span>
              </div>

              <Progress
                value={strength}
                className="h-2 bg-slate-200"
              />
            </div>

            <div className="mt-5 border-t border-slate-200 pt-4">
              <div className="flex items-start gap-2.5">
                {strength >= 80 ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                )}

                <p className="text-xs leading-5 text-slate-500">
                  {strength >= 80
                    ? "Your profile is well prepared. Keep your information and documents current."
                    : "Complete the checklist below to improve your profile completeness and client trust."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}