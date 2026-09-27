"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Search, Scale, CalendarClock, AlertCircle, Bell, Gavel, UserCog, History, ChevronRight,
} from "lucide-react";

import { caseStatusLabel, STATUS_PROGRESS } from "@/lib/constants";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import type { ClientCaseSummary } from "@/lib/data/client-cases";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";

const OPEN_STATUSES = new Set(["pending", "active", "in_progress", "adjourned"]);

const FILTERS: { key: string; label: string; match: (s: string) => boolean }[] = [
  { key: "all", label: "All", match: () => true },
  { key: "active", label: "Active", match: (s) => s === "active" || s === "in_progress" || s === "pending" },
  { key: "adjourned", label: "Adjourned", match: (s) => s === "adjourned" },
  { key: "won", label: "Won", match: (s) => s === "won" },
  { key: "lost", label: "Lost", match: (s) => s === "lost" },
  { key: "closed", label: "Closed", match: (s) => s === "closed" },
  { key: "archived", label: "Archived", match: (s) => s === "archived" },
];

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function quickSummary(c: ClientCaseSummary): string {
  const hearing = c.nextHearing ? formatDate(c.nextHearing) : null;
  switch (c.status) {
    case "won": return "Case won - your advocate secured a favourable outcome.";
    case "lost": return "This case has concluded.";
    case "closed": return "This case is now closed.";
    case "archived": return "This case has been archived.";
    case "adjourned": return hearing ? `Adjourned - next hearing on ${hearing}.` : "Adjourned - awaiting the next hearing date.";
    case "in_progress": return hearing ? `In progress - next hearing on ${hearing}.` : "In progress with your advocate.";
    case "pending": return "Your case is being set up by your advocate.";
    default: return hearing ? `Active - next hearing on ${hearing}.` : "Active - your advocate is preparing your case.";
  }
}

export function ClientCasesList({ cases, unreadUpdates }: { cases: ClientCaseSummary[]; unreadUpdates: number }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const stats = useMemo(() => {
    const today = startOfToday();
    let active = 0, upcomingHearings = 0, awaitingAction = 0;
    for (const c of cases) {
      if (OPEN_STATUSES.has(c.status)) active += 1;
      const hearing = c.nextHearing ? new Date(c.nextHearing).setHours(0, 0, 0, 0) : null;
      if (hearing !== null && hearing >= today) upcomingHearings += 1;
      const soon = hearing !== null && hearing >= today && hearing <= today + 7 * 86_400_000;
      if (c.status === "adjourned" || soon) awaitingAction += 1;
    }
    return { active, upcomingHearings, awaitingAction };
  }, [cases]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const f of FILTERS) c[f.key] = cases.filter((x) => f.match(x.status)).length;
    return c;
  }, [cases]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const f = FILTERS.find((x) => x.key === filter) ?? FILTERS[0];
    return cases
      .filter((c) => f.match(c.status))
      .filter((c) =>
        !term ? true : [c.title, c.lawyerName, c.caseType, c.court].filter(Boolean).join(" ").toLowerCase().includes(term)
      );
  }, [cases, query, filter]);

  const visibleFilters = FILTERS.filter((f) => f.key === "all" || f.key === "active" || counts[f.key] > 0);

  if (cases.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm"><Scale className="h-6 w-6" aria-hidden /></span>
        <h3 className="mt-4 font-heading text-base font-semibold text-slate-950">No active cases yet</h3>
        <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
          When an advocate opens a case for you, you&apos;ll be able to track updates, hearings, and progress here.
        </p>
        <Button asChild className="mt-5 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/find-lawyers"><Search className="h-4 w-4" /> Find an advocate</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Scale} tone="navy" label="Active cases" value={stats.active} helper="Currently open" />
        <StatCard icon={CalendarClock} tone="gold" label="Upcoming hearings" value={stats.upcomingHearings} helper="Scheduled ahead" />
        <StatCard icon={AlertCircle} tone="amber" label="Awaiting action" value={stats.awaitingAction} helper="Adjourned or hearing soon" />
        <StatCard icon={Bell} tone="navy" label="Unread updates" value={unreadUpdates} helper="New case activity" />
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by case, advocate, or court..."
          aria-label="Search cases"
          className="h-11 rounded-xl border-slate-200 pl-10 text-sm shadow-sm shadow-slate-200/40 placeholder:text-slate-400 hover:border-slate-300"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {visibleFilters.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
              )}
            >
              {f.label}
              {counts[f.key] > 0 && (
                <span className={cn("inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold", active ? "bg-white/20 text-primary-foreground" : "bg-slate-100 text-slate-600")}>{counts[f.key]}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cases */}
      {filtered.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm"><Scale className="h-5 w-5" /></span>
          <h3 className="mt-3 font-heading text-sm font-semibold text-slate-950">No cases match your filters</h3>
          <p className="mt-1 text-sm text-slate-500">Try a different status or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filtered.map((c) => <CaseCard key={c.id} c={c} />)}
        </div>
      )}
    </div>
  );
}

function CaseCard({ c }: { c: ClientCaseSummary }) {
  const progress = STATUS_PROGRESS[c.status] ?? 25;
  return (
    <Link href={`/dashboard/client/cases/${c.id}`} className="group block">
      <Card className="h-full rounded-xl border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 ring-0 transition-all hover:border-slate-300 hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-heading text-[0.95rem] font-semibold text-slate-950 group-hover:text-primary">{c.title}</p>
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500"><UserCog className="h-3.5 w-3.5 text-slate-400" /> {c.lawyerName ? `Advocate: ${c.lawyerName}` : "Advocate to be assigned"}</p>
          </div>
          <StatusBadge status={caseStatusLabel(c.status)} />
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-600">{quickSummary(c)}</p>

        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-slate-100 pt-3 text-xs">
          <Meta icon={Scale} label="Case type">{c.caseType ?? "-"}</Meta>
          <Meta icon={Gavel} label="Court">{c.court ?? "-"}</Meta>
          <Meta icon={CalendarClock} label="Next hearing">{c.nextHearing ? formatDate(c.nextHearing) : "Not scheduled"}</Meta>
          <Meta icon={History} label="Last update">{timeAgo(c.updatedAt)}</Meta>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-500">Progress</span>
            <span className="font-medium text-slate-900">{progress}%</span>
          </div>
          <Progress value={progress} className="mt-2 h-1.5 bg-slate-100" />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-400">Opened case file</span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 group-hover:text-primary">View timeline <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
        </div>
      </Card>
    </Link>
  );
}

function Meta({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-wide text-slate-400"><Icon className="h-3.5 w-3.5" aria-hidden /> {label}</p>
      <p className="mt-0.5 truncate font-medium text-slate-800">{children}</p>
    </div>
  );
}

type Tone = "navy" | "gold" | "amber";
const TONES: Record<Tone, string> = {
  navy: "bg-primary/8 text-primary",
  gold: "bg-amber-50 text-amber-600",
  amber: "bg-amber-50 text-amber-600",
};

function StatCard({ icon: Icon, tone, label, value, helper }: { icon: LucideIcon; tone: Tone; label: string; value: number; helper: string }) {
  return (
    <Card className="rounded-xl border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 ring-0">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", TONES[tone])}><Icon className="h-4 w-4" aria-hidden /></span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
    </Card>
  );
}
