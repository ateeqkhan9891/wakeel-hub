import type { Metadata } from "next";

import {
  Archive,
  Briefcase,
  CheckCircle2,
  PauseCircle,
  ScrollText,
  XCircle,
} from "lucide-react";

import { AdminCasesTable } from "@/components/dashboard/admin/admin-cases-table";
import { getAdminCases } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Cases",
};

const OPEN = ["pending", "active", "in_progress"];

export default async function AdminCasesPage() {
  const cases = await getAdminCases(300);

  const open = cases.filter((caseItem) =>
    OPEN.includes(caseItem.status),
  ).length;

  const adjourned = cases.filter(
    (caseItem) => caseItem.status === "adjourned",
  ).length;

  const won = cases.filter(
    (caseItem) => caseItem.status === "won",
  ).length;

  const lost = cases.filter(
    (caseItem) => caseItem.status === "lost",
  ).length;

  const closed = cases.filter(
    (caseItem) =>
      caseItem.status === "closed" ||
      caseItem.status === "archived",
  ).length;

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-2.5">
      <header className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/30">
        <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 overflow-hidden">
          <div className="absolute -right-14 -top-14 h-28 w-28 rounded-full bg-primary" />
          <div className="absolute right-5 top-5 h-2.5 w-2.5 rounded-full bg-gold" />
        </div>

        <div className="relative px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2.5 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <Briefcase className="h-3.5 w-3.5" aria-hidden />
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Case management
                </span>
              </div>

              <h1 className="font-heading text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                Cases
              </h1>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                A platform-wide view of cases being managed between clients
                and advocates.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/70 p-1">
              <SummaryItem
                icon={Briefcase}
                label="Total"
                value={cases.length}
              />

              <SummaryItem
                icon={ScrollText}
                label="Open"
                value={open}
                tone="gold"
              />

              <SummaryItem
                icon={PauseCircle}
                label="Adjourned"
                value={adjourned}
                tone="gold"
              />

              <SummaryItem
                icon={CheckCircle2}
                label="Won"
                value={won}
                tone="emerald"
              />

              <SummaryItem
                icon={XCircle}
                label="Lost"
                value={lost}
                tone="rose"
              />

              <SummaryItem
                icon={Archive}
                label="Closed"
                value={closed}
                tone="slate"
              />
            </div>
          </div>
        </div>
      </header>

      <AdminCasesTable cases={cases} />
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: {
  icon: typeof Briefcase;
  label: string;
  value: number;
  tone?: "primary" | "gold" | "emerald" | "rose" | "slate";
}) {
  const toneClasses = {
    primary: "bg-white text-primary",
    gold: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    slate: "bg-slate-100 text-slate-500",
  };

  return (
    <div className="flex min-w-[72px] items-center gap-2 rounded-lg px-2.5 py-2">
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md shadow-sm ${toneClasses[tone]}`}
      >
        <Icon className="h-3 w-3" aria-hidden />
      </span>

      <div className="min-w-0">
        <p className="text-sm font-semibold leading-none text-slate-900">
          {value.toLocaleString()}
        </p>

        <p className="mt-1 text-[10px] font-medium leading-none text-slate-400">
          {label}
        </p>
      </div>
    </div>
  );
}