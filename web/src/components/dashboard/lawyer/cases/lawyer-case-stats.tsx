import {
  BriefcaseBusiness,
  CalendarClock,
  CircleAlert,
  Wallet,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

import type { CaseRecord } from "@/lib/data/case-types";

import { formatPKR } from "@/lib/utils";

type LawyerCaseStatsProps = {
  cases: CaseRecord[];
};

type Stat = {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  iconBackground: string;
  iconColor: string;
};

export function LawyerCaseStats({
  cases,
}: LawyerCaseStatsProps) {
  const activeCases = cases.filter(
    (caseItem) => caseItem.status === "active",
  ).length;

  const upcomingHearings = cases.filter(
    (caseItem) => Boolean(caseItem.next_hearing_date),
  ).length;

  const outstandingFees = cases.reduce(
    (total, caseItem) => total + caseItem.remaining_fee,
    0,
  );

  const casesNeedingAttention = cases.filter(
    (caseItem) =>
      caseItem.status === "active" &&
      !caseItem.next_hearing_date,
  ).length;

  const stats: Stat[] = [
    {
      label: "Active cases",
      value: activeCases.toString(),
      description:
        activeCases === 1
          ? "case currently active"
          : "cases currently active",
      icon: BriefcaseBusiness,
      accent: "border-l-emerald-400",
      iconBackground: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Upcoming hearings",
      value: upcomingHearings.toString(),
      description:
        upcomingHearings === 1
          ? "hearing scheduled"
          : "hearings scheduled",
      icon: CalendarClock,
      accent: "border-l-blue-400",
      iconBackground: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Outstanding fees",
      value: formatPKR(outstandingFees),
      description: "remaining across cases",
      icon: Wallet,
      accent: "border-l-amber-400",
      iconBackground: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Needs attention",
      value: casesNeedingAttention.toString(),
      description:
        casesNeedingAttention === 1
          ? "active case without a hearing"
          : "active cases without hearings",
      icon: CircleAlert,
      accent: "border-l-rose-400",
      iconBackground: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.label}
            className={`rounded-2xl border-slate-200 border-l-[3px] bg-white p-0 shadow-sm shadow-slate-200/40 ${stat.accent}`}
          >
            <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">
                  {stat.label}
                </p>

                <p className="mt-1.5 truncate text-xl font-semibold tracking-tight text-slate-950">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>

              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${stat.iconBackground}`}
              >
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
