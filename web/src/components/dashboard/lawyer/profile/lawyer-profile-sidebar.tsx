"use client";

import Link from "next/link";

import {
  BadgeCheck,
  Check,
  Clock,
  FileCheck2,
  Pencil,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import type { LawyerFullProfile } from "@/lib/data/lawyer-profile-types";

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
    icon: typeof ShieldCheck;
  }
> = {
  approved: {
    label: "Verified advocate",
    description: "Your professional credentials have been verified.",
    cls: "border-emerald-100 bg-emerald-50/70 text-emerald-700",
    icon: BadgeCheck,
  },
  pending: {
    label: "Under review",
    description: "Your verification request is being reviewed.",
    cls: "border-blue-100 bg-blue-50/70 text-blue-700",
    icon: Clock,
  },
  rejected: {
    label: "Verification rejected",
    description: "Review your details and resubmit your documents.",
    cls: "border-rose-100 bg-rose-50/70 text-rose-700",
    icon: ShieldCheck,
  },
  not_submitted: {
    label: "Not verified yet",
    description: "Submit your professional documents to get verified.",
    cls: "border-amber-100 bg-amber-50/70 text-amber-700",
    icon: ShieldCheck,
  },
};

export function LawyerProfileSidebar({
  profile,
  completion,
  onEdit,
}: {
  profile: LawyerFullProfile;
  completion: {
    done: number;
    total: number;
    pct: number;
    items: {
      label: string;
      done: boolean;
    }[];
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

  return (
    <aside className="space-y-3">
      <Card className="overflow-hidden rounded-2xl border-slate-200 p-0 shadow-none">
        <div className="relative p-5">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileCheck2 className="h-4 w-4" />
                </span>

                <div>
                  <h3 className="font-heading text-sm font-semibold text-slate-950">
                    Profile completion
                  </h3>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Build client confidence
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="font-heading text-xl font-semibold tracking-tight text-slate-950">
                {completion.pct}%
              </p>

              <p className="text-[10px] text-slate-400">
                complete
              </p>
            </div>
          </div>

          <div className="relative mt-5">
            <Progress
              value={completion.pct}
              className="h-2 bg-slate-100"
            />

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {completion.done} of {completion.total} completed
              </span>

              {completion.pct === 100 && (
                <span className="text-[10px] font-medium text-emerald-600">
                  Profile complete
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 px-5 py-4">
          <div className="space-y-1">
            {completion.items.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2 py-2",
                  item.done
                    ? "text-slate-600"
                    : "text-slate-400",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    item.done
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-300",
                  )}
                >
                  <Check className="h-3 w-3" />
                </span>

                <span className="text-xs font-medium">
                  {item.label}
                </span>

                {item.done && (
                  <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider text-emerald-500">
                    Done
                  </span>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            onClick={onEdit}
            size="sm"
            className="mt-4 w-full gap-1.5"
          >
            <Pencil className="h-3.5 w-3.5" />
            Complete profile
          </Button>
        </div>
      </Card>

      <Card className="rounded-2xl border-slate-200 p-5 shadow-none">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </span>

            <div>
              <h3 className="font-heading text-sm font-semibold text-slate-950">
                Verification
              </h3>

              <p className="mt-0.5 text-[11px] text-slate-400">
                Professional credentials
              </p>
            </div>
          </div>

          <ArrowUpRight className="h-4 w-4 text-slate-300" />
        </div>

        <div
          className={cn(
            "mt-5 rounded-xl border p-3.5",
            verification.cls,
          )}
        >
          <div className="flex items-center gap-2">
            <VerificationIcon className="h-4 w-4" />

            <p className="text-xs font-semibold">
              {verification.label}
            </p>
          </div>

          <p className="mt-1.5 text-[11px] leading-4 opacity-80">
            {verification.description}
          </p>
        </div>

        <div className="mt-5 divide-y divide-slate-100">
          <Credential
            label="Bar council number"
            value={profile.barCouncilNumber}
          />

          <Credential
            label="License number"
            value={profile.licenseNumber}
          />

          <Credential
            label="Enrollment year"
            value={profile.barEnrollmentYear}
          />

          <Credential
            label="Office address"
            value={profile.officeAddress}
          />
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="mt-5 w-full gap-1.5"
        >
          <Link href="/dashboard/lawyer/verification">
            <ShieldCheck className="h-3.5 w-3.5" />
            Manage verification
            <ArrowUpRight className="ml-auto h-3 w-3" />
          </Link>
        </Button>
      </Card>
    </aside>
  );
}

function Credential({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <p className="shrink-0 text-[11px] text-slate-400">
        {label}
      </p>

      <p
        className={cn(
          "max-w-[62%] break-words text-right text-xs font-medium leading-5",
          value ? "text-slate-700" : "text-slate-300",
        )}
      >
        {value || "Not provided"}
      </p>
    </div>
  );
}