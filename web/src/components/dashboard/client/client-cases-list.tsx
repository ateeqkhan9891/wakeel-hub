"use client";

import { useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import type { LucideIcon } from "lucide-react";

import {
  AlertCircle,
  Bell,
  CalendarClock,
  ChevronRight,
  Gavel,
  History,
  Search,
  Scale,
  UserCog,
} from "lucide-react";

import { caseStatusLabel, STATUS_PROGRESS } from "@/lib/constants";
import { cn, formatDate, timeAgo } from "@/lib/utils";

import type { ClientCaseSummary } from "@/lib/data/client-cases";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";

const OPEN_STATUSES = new Set([
  "pending",
  "active",
  "in_progress",
  "adjourned",
]);

const FILTERS: {
  key: string;
  label: string;
  match: (status: string) => boolean;
}[] = [
  { key: "all", label: "All", match: () => true },
  {
    key: "active",
    label: "Active",
    match: (status) =>
      status === "active" ||
      status === "in_progress" ||
      status === "pending",
  },
  {
    key: "adjourned",
    label: "Adjourned",
    match: (status) => status === "adjourned",
  },
  {
    key: "won",
    label: "Won",
    match: (status) => status === "won",
  },
  {
    key: "lost",
    label: "Lost",
    match: (status) => status === "lost",
  },
  {
    key: "closed",
    label: "Closed",
    match: (status) => status === "closed",
  },
  {
    key: "archived",
    label: "Archived",
    match: (status) => status === "archived",
  },
];

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function quickSummary(c: ClientCaseSummary): string {
  const hearing = c.nextHearing ? formatDate(c.nextHearing) : null;

  switch (c.status) {
    case "won":
      return "Case won - your advocate secured a favourable outcome.";
    case "lost":
      return "This case has concluded.";
    case "closed":
      return "This case is now closed.";
    case "archived":
      return "This case has been archived.";
    case "adjourned":
      return hearing
        ? `Adjourned - next hearing on ${hearing}.`
        : "Adjourned - awaiting the next hearing date.";
    case "in_progress":
      return hearing
        ? `In progress - next hearing on ${hearing}.`
        : "In progress with your advocate.";
    case "pending":
      return "Your case is being set up by your advocate.";
    default:
      return hearing
        ? `Active - next hearing on ${hearing}.`
        : "Active - your advocate is preparing your case.";
  }
}

export function ClientCasesList({
  cases,
  unreadUpdates,
}: {
  cases: ClientCaseSummary[];
  unreadUpdates: number;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const stats = useMemo(() => {
    const today = startOfToday();

    let active = 0;
    let upcomingHearings = 0;
    let awaitingAction = 0;

    for (const c of cases) {
      if (OPEN_STATUSES.has(c.status)) {
        active += 1;
      }

      const hearing = c.nextHearing
        ? new Date(c.nextHearing).setHours(0, 0, 0, 0)
        : null;

      if (hearing !== null && hearing >= today) {
        upcomingHearings += 1;
      }

      const soon =
        hearing !== null &&
        hearing >= today &&
        hearing <= today + 7 * 86_400_000;

      if (c.status === "adjourned" || soon) {
        awaitingAction += 1;
      }
    }

    return {
      active,
      upcomingHearings,
      awaitingAction,
    };
  }, [cases]);

  const counts = useMemo(() => {
    const result: Record<string, number> = {};

    for (const filter of FILTERS) {
      result[filter.key] = cases.filter((c) =>
        filter.match(c.status),
      ).length;
    }

    return result;
  }, [cases]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    const selectedFilter =
      FILTERS.find((item) => item.key === filter) ?? FILTERS[0];

    return cases
      .filter((c) => selectedFilter.match(c.status))
      .filter((c) => {
        if (!term) {
          return true;
        }

        return [
          c.title,
          c.lawyerName,
          c.caseType,
          c.court,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      });
  }, [cases, query, filter]);

  const visibleFilters = FILTERS.filter(
    (item) =>
      item.key === "all" ||
      item.key === "active" ||
      counts[item.key] > 0,
  );

  if (cases.length === 0) {
    return (
      <div className="relative flex min-h-64 flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-14 text-center">
        <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-blue-50 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-24 w-24 rounded-full border border-slate-200/70" />

        <Image
          src="/client/no-cases.png"
          alt=""
          width={120}
          height={120}
          className="relative h-24 w-24 object-contain"
          aria-hidden
        />

        <h3 className="relative mt-4 font-heading text-base font-semibold text-slate-950">
          No cases yet
        </h3>

        <p className="relative mt-1 max-w-md text-sm leading-6 text-slate-500">
          When an advocate opens a case for you, you&apos;ll be able to
          track updates, hearings, and progress here.
        </p>

        <Button
          asChild
          className="relative mt-5 h-9 gap-2 rounded-lg bg-slate-950 px-3.5 text-xs font-semibold text-white hover:bg-slate-800"
        >
          <Link href="/find-lawyers">
            <Search className="h-3.5 w-3.5" />
            Find an advocate
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          icon={Scale}
          tone="navy"
          label="Active cases"
          value={stats.active}
          helper="Currently open"
        />

        <StatCard
          icon={CalendarClock}
          tone="blue"
          label="Upcoming hearings"
          value={stats.upcomingHearings}
          helper="Scheduled ahead"
        />

        <StatCard
          icon={AlertCircle}
          tone="blue"
          label="Awaiting action"
          value={stats.awaitingAction}
          helper="Hearing soon or adjourned"
        />

        <StatCard
          icon={Bell}
          tone="emerald"
          label="Unread updates"
          value={unreadUpdates}
          helper="New case activity"
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases, advocates, or courts..."
            aria-label="Search cases"
            className="h-10 rounded-xl border-slate-200 bg-white pl-10 text-xs shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {visibleFilters.map((item) => {
            const active = filter === item.key;

            return (
              <button
                key={item.key}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(item.key)}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-semibold transition-all",
                  active
                    ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                {item.label}

                {counts[item.key] > 0 && (
                  <span
                    className={cn(
                      "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold",
                      active
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {counts[item.key]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="relative flex min-h-48 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">
          <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-blue-50/70 blur-xl" />

          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200/70">
            <Scale className="h-4 w-4" />
          </div>

          <h3 className="relative mt-3 text-sm font-semibold text-slate-950">
            No cases match your filters
          </h3>

          <p className="relative mt-1 text-xs text-slate-500">
            Try a different status or search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {filtered.map((c) => (
            <CaseCard key={c.id} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function CaseCard({ c }: { c: ClientCaseSummary }) {
  const progress = STATUS_PROGRESS[c.status] ?? 25;

  return (
    <Link
      href={`/dashboard/client/cases/${c.id}`}
      className="group block"
    >
      <Card className="relative h-full overflow-hidden rounded-xl border-slate-200 bg-white p-0 shadow-sm ring-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-blue-50/70 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-8 h-20 w-20 rounded-full border border-slate-100" />
        <div className="pointer-events-none absolute right-8 top-7 h-6 w-6 rounded-full border border-blue-100/70" />

        <div className="relative p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-heading text-sm font-semibold text-slate-950 transition-colors group-hover:text-blue-600">
                {c.title}
              </p>

              <p className="mt-1 flex items-center gap-1.5 truncate text-[11px] text-slate-500">
                <UserCog
                  className="h-3.5 w-3.5 shrink-0 text-slate-400"
                  aria-hidden
                />

                {c.lawyerName
                  ? `Advocate: ${c.lawyerName}`
                  : "Advocate to be assigned"}
              </p>
            </div>

            <StatusBadge status={caseStatusLabel(c.status)} />
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-600">
            {quickSummary(c)}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-3">
            <Meta icon={Scale} label="Case type">
              {c.caseType ?? "-"}
            </Meta>

            <Meta icon={Gavel} label="Court">
              {c.court ?? "-"}
            </Meta>

            <Meta icon={CalendarClock} label="Next hearing">
              {c.nextHearing ? formatDate(c.nextHearing) : "Not scheduled"}
            </Meta>

            <Meta icon={History} label="Last update">
              {timeAgo(c.updatedAt)}
            </Meta>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                Progress
              </span>

              <span className="text-[11px] font-semibold text-slate-700">
                {progress}%
              </span>
            </div>

            <Progress
              value={progress}
              className="mt-1.5 h-1.5 bg-slate-100"
            />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-[10px] font-medium text-slate-400">
              Case file
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 transition-colors group-hover:text-blue-600">
              View timeline

              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function Meta({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
        <Icon
          className="h-3 w-3 shrink-0"
          strokeWidth={1.8}
          aria-hidden
        />

        {label}
      </p>

      <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-800">
        {children}
      </p>
    </div>
  );
}

type Tone = "navy" | "blue" | "emerald";

const TONES: Record<
  Tone,
  {
    icon: string;
    shape: string;
    dot: string;
  }
> = {
  navy: {
    icon: "bg-slate-100 text-slate-700",
    shape: "bg-slate-100/70",
    dot: "bg-slate-700",
  },
  blue: {
    icon: "bg-blue-50 text-blue-600",
    shape: "bg-blue-50/80",
    dot: "bg-blue-500",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    shape: "bg-emerald-50/80",
    dot: "bg-emerald-500",
  },
};

function StatCard({
  icon: Icon,
  tone,
  label,
  value,
  helper,
}: {
  icon: LucideIcon;
  tone: Tone;
  label: string;
  value: number;
  helper: string;
}) {
  const styles = TONES[tone];

  return (
    <Card className="group relative overflow-hidden rounded-xl border-slate-200 bg-white p-0 shadow-sm ring-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div
        className={cn(
          "pointer-events-none absolute -right-7 -top-7 h-20 w-20 rounded-full blur-2xl",
          styles.shape,
        )}
      />

      <div
        className={cn(
          "pointer-events-none absolute -bottom-7 -left-6 h-14 w-14 rounded-full border",
          tone === "blue"
            ? "border-blue-100/70"
            : tone === "emerald"
              ? "border-emerald-100/70"
              : "border-slate-200/70",
        )}
      />

      <div className="relative p-3.5">
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-[9px] font-semibold uppercase tracking-[0.09em] text-slate-400">
            {label}
          </p>

          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              styles.icon,
            )}
          >
            <Icon
              className="h-3.5 w-3.5"
              strokeWidth={1.8}
              aria-hidden
            />
          </div>
        </div>

        <div className="mt-2 flex items-end gap-1.5">
          <span className="text-xl font-semibold tracking-tight text-slate-950">
            {value}
          </span>

          <span
            className={cn(
              "mb-1.5 h-1.5 w-1.5 rounded-full",
              styles.dot,
            )}
          />
        </div>

        <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
          {helper}
        </p>
      </div>
    </Card>
  );
}