import Link from "next/link";

import {
  ArrowUpRight,
  CalendarClock,
  Clock3,
} from "lucide-react";

import { StatusBadge } from "@/components/dashboard/shared/status-badge";

import { Card } from "@/components/ui/card";

import { cn, formatDate } from "@/lib/utils";

type Hearing = {
  id: string;
  caseId: string;
  caseTitle: string;
  court: string | null;
  date: string;
  time: string | null;
  purpose: string | null;
  status: string;
};

type LawyerDashboardHearingsProps = {
  hearings: Hearing[];
};

function formatTime(value: string | null) {
  return value ? value.slice(0, 5) : "Time not set";
}

function HearingsEmptyState() {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
      <div className="flex flex-col items-center px-5 py-7 text-center sm:px-8 sm:py-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-emerald-600 shadow-sm">
          <CalendarClock className="h-6 w-6" />
        </span>

        <div className="mt-5 max-w-md">
          <h3 className="font-heading text-base font-semibold text-slate-950">
            No hearings on the calendar
          </h3>

          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            Enjoy the rare moment when the court isn&apos;t asking for your
            time. Add your next hearing inside a case to keep everything
            organized.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white/70 px-5 py-3.5">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <Clock3 className="h-3.5 w-3.5 text-slate-400" />
          <span>No court dates coming up. Your calendar is unusually calm.</span>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h2 className="font-heading text-base font-semibold text-slate-950">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

export function LawyerDashboardHearings({
  hearings,
}: LawyerDashboardHearingsProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60",
        "sm:rounded-3xl sm:p-5",
      )}
    >
      <SectionHeader
        title="Upcoming hearings"
        description="Prepare for the next court dates linked to your active cases."
      />

      {hearings.length === 0 ? (
        <HearingsEmptyState />
      ) : (
        <div className="mt-5 space-y-3">
          {hearings.map((hearing) => (
            <Link
              key={hearing.id}
              href={`/dashboard/lawyer/cases/${hearing.caseId}`}
              className="group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/60 sm:p-4"
            >
              <span className="absolute inset-y-0 left-0 w-0.5 bg-emerald-500" />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-start gap-2">
                    <p className="font-heading text-sm font-semibold text-slate-950">
                      {hearing.caseTitle}
                    </p>

                    <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300 transition-colors group-hover:text-slate-600" />
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {hearing.court ?? "Court not set"}
                  </p>
                </div>

                <StatusBadge status={hearing.status} />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {formatDate(hearing.date)}
                </span>

                <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {formatTime(hearing.time)}
                </span>

                {hearing.purpose && (
                  <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {hearing.purpose}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}