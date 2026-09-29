"use client";

import Link from "next/link";

import {
  Activity,
  BadgeCheck,
  BriefcaseBusiness,
  ChevronRight,
  Crown,
  ExternalLink,
  Globe2,
  MapPin,
  Pencil,
  Scale,
  ShieldCheck,
  Sparkles,
  Clock,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { cn } from "@/lib/utils";

import type { LawyerFullProfile } from "@/lib/data/lawyer-profile-types";

export type SubscriptionInfo = {
  status: "inactive" | "active";
  plan: string | null;
  daysRemaining: number | null;
  expired: boolean;
};

type VerifyState =
  | "approved"
  | "pending"
  | "rejected"
  | "not_submitted";

const VERIFY: Record<
  VerifyState,
  {
    label: string;
    description: string;
    cls: string;
    icon: LucideIcon;
  }
> = {
  approved: {
    label: "Verified advocate",
    description: "Your professional credentials are verified.",
    cls: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    icon: BadgeCheck,
  },
  pending: {
    label: "Verification under review",
    description: "Your verification request is being reviewed.",
    cls: "bg-blue-50 text-blue-700 ring-blue-100",
    icon: Clock,
  },
  rejected: {
    label: "Verification rejected",
    description: "Review your details and resubmit.",
    cls: "bg-rose-50 text-rose-700 ring-rose-100",
    icon: ShieldCheck,
  },
  not_submitted: {
    label: "Verification required",
    description: "Complete verification to build client trust.",
    cls: "bg-amber-50 text-amber-700 ring-amber-100",
    icon: ShieldCheck,
  },
};

export function LawyerProfileHero({
  profile,
  subscription,
  completion,
  onEdit,
}: {
  profile: LawyerFullProfile;
  subscription: SubscriptionInfo | null;
  completion: {
    done: number;
    total: number;
    pct: number;
  };
  onEdit: () => void;
}) {
  const verificationStatus = (
    profile.verificationStatus in VERIFY
      ? profile.verificationStatus
      : "not_submitted"
  ) as VerifyState;

  const verification = VERIFY[verificationStatus];
  const VerificationIcon = verification.icon;

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const publicLive =
    profile.isVerified && Boolean(profile.slug);

  return (
    <Card className="relative overflow-hidden border-slate-200 bg-white p-0 shadow-sm ring-0">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-primary/[0.07] via-primary/[0.025] to-gold/[0.08]" />

      <div className="relative p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative shrink-0">
                <Avatar className="h-20 w-20 rounded-2xl border-4 border-white shadow-md ring-1 ring-slate-200 sm:h-24 sm:w-24">
                  {profile.photoUrl && (
                    <AvatarImage
                      src={profile.photoUrl}
                      alt={profile.name}
                    />
                  )}

                  <AvatarFallback className="rounded-xl bg-primary text-xl font-semibold text-primary-foreground sm:text-2xl">
                    {initials || "?"}
                  </AvatarFallback>
                </Avatar>

                {profile.isVerified && (
                  <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white shadow-sm">
                    <BadgeCheck className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">
                    {profile.name || "Your name"}
                  </h2>

                  {profile.isFeatured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-100">
                      <Crown className="h-3 w-3" />
                      Featured
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  {profile.professionalTitle || "Advocate"}
                </p>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                  {profile.city && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gold" />
                      {profile.city}
                    </span>
                  )}

                  {profile.experienceYears && (
                    <span className="inline-flex items-center gap-1.5">
                      <BriefcaseBusiness className="h-3.5 w-3.5 text-gold" />
                      {profile.experienceYears} years experience
                    </span>
                  )}

                  {profile.barCouncilNumber && (
                    <span className="inline-flex items-center gap-1.5">
                      <Scale className="h-3.5 w-3.5 text-gold" />
                      Bar #{profile.barCouncilNumber}
                    </span>
                  )}

                  {profile.responseRate > 0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-gold" />
                      {profile.responseRate}% response rate
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-sm">
              <CompletionRing pct={completion.pct} />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Profile strength
                </p>

                <p className="mt-0.5 font-heading text-lg font-semibold text-slate-950">
                  {completion.pct}%
                </p>

                <p className="text-[11px] text-slate-500">
                  {completion.done} of {completion.total} complete
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill
                icon={VerificationIcon}
                label={verification.label}
                className={verification.cls}
              />

              <StatusPill
                icon={Globe2}
                label={
                  publicLive
                    ? "Public profile live"
                    : "Profile not public"
                }
                className={
                  publicLive
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                    : "bg-slate-100 text-slate-600 ring-slate-200"
                }
              />

              <SubscriptionPill subscription={subscription} />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={onEdit}
                className="h-9 gap-2 bg-primary px-4 text-sm font-medium shadow-sm hover:bg-primary/90"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit profile
              </Button>

              {publicLive ? (
                <Button
                  asChild
                  variant="outline"
                  className="h-9 gap-2 border-slate-200 px-3.5 text-sm"
                >
                  <a
                    href={`/lawyers/${profile.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View profile
                  </a>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  disabled
                  className="h-9 gap-2 border-slate-200 px-3.5 text-sm"
                  title={verification.description}
                >
                  <Globe2 className="h-3.5 w-3.5" />
                  View profile
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={onEdit}
                className="h-9 gap-1.5 px-3 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              >
                Verification
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function StatusPill({
  icon: Icon,
  label,
  className,
}: {
  icon: LucideIcon;
  label: string;
  className: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1",
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function CompletionRing({ pct }: { pct: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const safePct = Math.min(100, Math.max(0, pct));
  const offset =
    circumference - (safePct / 100) * circumference;

  return (
    <div className="relative h-12 w-12 shrink-0">
      <svg
        viewBox="0 0 44 44"
        className="h-12 w-12 -rotate-90"
        aria-hidden
      >
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          strokeWidth="4"
          className="stroke-slate-100"
        />

        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-primary transition-all duration-500"
        />
      </svg>

      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-slate-950">
        {safePct}%
      </span>
    </div>
  );
}

function SubscriptionPill({
  subscription,
}: {
  subscription: SubscriptionInfo | null;
}) {
  if (
    !subscription ||
    subscription.status !== "active" ||
    subscription.expired
  ) {
    return (
      <Link
        href="/dashboard/lawyer/billing"
        className="group inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-200 hover:text-slate-900"
      >
        <Crown className="h-3 w-3" />
        Free plan
        <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </Link>
    );
  }

  const planLabel = subscription.plan
    ? subscription.plan.charAt(0).toUpperCase() +
      subscription.plan.slice(1)
    : "Pro";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 ring-1 ring-amber-100">
      <Sparkles className="h-3 w-3" />
      {planLabel}

      {subscription.daysRemaining !== null &&
        ` · ${subscription.daysRemaining}d left`}
    </span>
  );
}
