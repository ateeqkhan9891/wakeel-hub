"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Plus,
  Search,
  Briefcase,
  CalendarClock,
  Gavel,
  Wallet,
  AlertCircle,
  Hash,
  History,
  ArrowRight,
} from "lucide-react";

import { CASE_STATUSES, caseStatusLabel } from "@/lib/constants";
import { cn, formatPKR, formatDate, timeAgo } from "@/lib/utils";
import type { CaseRecord, CaseInput } from "@/lib/data/case-types";
import { createCase } from "@/app/actions/case-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { CaseForm, EMPTY_CASE_INPUT } from "@/components/dashboard/shared/case-form";

const OPEN_STATUSES = new Set(["pending", "active", "in_progress", "adjourned"]);

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

type StatTone = "navy" | "gold" | "emerald" | "rose";

const STAT_TONES: Record<StatTone, string> = {
  navy: "bg-primary/8 text-primary",
  gold: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  rose: "bg-rose-50 text-rose-600",
};

export function LawyerCasesWorkspace({ cases }: { cases: CaseRecord[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return cases
      .filter((c) => status === "all" || c.status === status)
      .filter((c) =>
        !term
          ? true
          : [c.title, c.client_name, c.court, c.case_type, c.case_number, c.court_case_number]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(term)
      );
  }, [cases, query, status]);

  async function handleCreate(input: CaseInput) {
    const result = await createCase(input);
    if (result.ok) {
      setOpen(false);
      router.refresh();
      if (result.id) router.push(`/dashboard/lawyer/cases/${result.id}`);
    }
    return result;
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: cases.length };
    for (const x of cases) c[x.status] = (c[x.status] ?? 0) + 1;
    return c;
  }, [cases]);

  const stats = useMemo(() => {
    const today = startOfToday();
    let active = 0;
    let upcomingHearings = 0;
    let pendingPayments = 0;
    let requiringAction = 0;
    for (const c of cases) {
      const isOpen = OPEN_STATUSES.has(c.status);
      if (isOpen) active += 1;
      const hearing = c.next_hearing_date ? new Date(c.next_hearing_date).setHours(0, 0, 0, 0) : null;
      if (hearing !== null && hearing >= today) upcomingHearings += 1;
      if (c.total_fee > 0 && c.remaining_fee > 0) pendingPayments += 1;
      if (c.status === "pending" || (isOpen && hearing !== null && hearing < today)) requiringAction += 1;
    }
    return { active, upcomingHearings, pendingPayments, requiringAction };
  }, [cases]);

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Briefcase} tone="navy" label="Active cases" value={stats.active} helper="Currently open" />
        <StatCard icon={CalendarClock} tone="gold" label="Upcoming hearings" value={stats.upcomingHearings} helper="Scheduled ahead" />
        <StatCard icon={Wallet} tone="emerald" label="Pending payments" value={stats.pendingPayments} helper="With a balance due" />
        <StatCard icon={AlertCircle} tone="rose" label="Requiring action" value={stats.requiringAction} helper="New or overdue hearing" />
      </div>

      {/* Search + create */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases, client, court, case no..."
            aria-label="Search cases"
            className="h-11 rounded-xl border-slate-200 pl-10 text-sm shadow-sm shadow-slate-200/40 placeholder:text-slate-400 hover:border-slate-300"
          />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 shrink-0 gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" /> New case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create a new case</DialogTitle>
            </DialogHeader>
            <CaseForm initial={EMPTY_CASE_INPUT} onSubmit={handleCreate} submitLabel="Create case" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        <FilterChip label="All" active={status === "all"} count={counts.all} onClick={() => setStatus("all")} />
        {CASE_STATUSES.map((s) => (
          <FilterChip key={s.value} label={s.label} active={status === s.value} count={counts[s.value]} onClick={() => setStatus(s.value)} />
        ))}
      </div>

      {/* Cases */}
      {filtered.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
            <Briefcase className="h-6 w-6" aria-hidden />
          </span>
          <h3 className="mt-4 font-heading text-base font-semibold text-slate-950">
            {cases.length === 0 ? "No cases yet" : "No cases match your filters"}
          </h3>
          <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
            Cases created from consultations or manually added cases will appear here.
          </p>
          <Button className="mt-5 gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Create new case
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filtered.map((c) => (
            <CaseCard key={c.id} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function CaseCard({ c }: { c: CaseRecord }) {
  const caseNo = c.case_number ?? c.court_case_number;
  const hasFee = c.total_fee > 0;
  const collectedPct = hasFee ? Math.min(100, Math.round((c.advance_received / c.total_fee) * 100)) : 0;

  return (
    <Link href={`/dashboard/lawyer/cases/${c.id}`} className="group block">
      <Card className="h-full rounded-xl border-slate-200 bg-white p-0 shadow-sm shadow-slate-200/40 ring-0 transition-all hover:border-slate-300 hover:shadow-md">
        <div className="flex flex-col gap-4 p-5">
          {/* Title + status */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-heading text-[0.95rem] font-semibold text-slate-950 group-hover:text-primary">
                {c.title}
              </p>
              <p className="mt-0.5 truncate text-sm text-slate-500">
                {[c.client_name, c.case_type].filter(Boolean).join(" - ") || "No client set"}
              </p>
            </div>
            <StatusBadge status={caseStatusLabel(c.status)} />
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-slate-100 pt-3 text-sm">
            <Meta icon={Gavel} label="Court">{c.court ?? "-"}</Meta>
            <Meta icon={Hash} label="Case no.">{caseNo ?? "-"}</Meta>
            <Meta icon={CalendarClock} label="Next hearing">
              {c.next_hearing_date ? formatDate(c.next_hearing_date) : "Not scheduled"}
            </Meta>
            <Meta icon={History} label="Last activity">{timeAgo(c.updated_at)}</Meta>
          </div>

          {/* Fee progress */}
          {hasFee && (
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">Fee collected</span>
                <span className="font-medium text-slate-900">
                  {formatPKR(c.advance_received)} <span className="text-slate-400">/ {formatPKR(c.total_fee)}</span>
                </span>
              </div>
              <Progress value={collectedPct} className="mt-2 h-1.5 bg-slate-100" />
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-xs text-slate-400">Opened {timeAgo(c.created_at)}</span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 group-hover:text-primary">
              View case <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function Meta({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-wide text-slate-400">
        <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
      </p>
      <p className="mt-0.5 truncate font-medium text-slate-800">{children}</p>
    </div>
  );
}

function StatCard({
  icon: Icon,
  tone,
  label,
  value,
  helper,
}: {
  icon: LucideIcon;
  tone: StatTone;
  label: string;
  value: number;
  helper: string;
}) {
  return (
    <Card className="rounded-xl border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 ring-0">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", STAT_TONES[tone])}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
    </Card>
  );
}

function FilterChip({ label, active, count, onClick }: { label: string; active: boolean; count?: number; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
      )}
    >
      {label}
      {count ? (
        <span
          className={cn(
            "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
            active ? "bg-white/20 text-primary-foreground" : "bg-slate-100 text-slate-600"
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
