import Link from "next/link";

import type { LucideIcon } from "lucide-react";

import {
  ArrowRight,
  Briefcase,
  CalendarCheck,
  MessageSquare,
  Search,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ClientDashboardHeroProps = {
  firstName: string;
  activeCases: number;
  upcomingConsultations: number;
  unreadMessages: number;
};

export function ClientDashboardHero({
  firstName,
  activeCases,
  upcomingConsultations,
  unreadMessages,
}: ClientDashboardHeroProps) {
  return (
    <Card className="relative overflow-hidden border-slate-200 bg-white p-0 shadow-sm ring-0">
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-32 h-36 w-36 rounded-full bg-slate-100/80 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-7 h-20 w-20 rounded-full border border-blue-100/80" />
      <div className="pointer-events-none absolute right-16 top-13 h-8 w-8 rounded-full border border-blue-100/60" />

      <div className="relative p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-600">
              Legal matters
            </p>

            <div className="mt-1.5 flex items-baseline gap-2">
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">
                Your dashboard
              </h1>

              <span className="hidden text-sm text-slate-300 sm:inline">
                /
              </span>

              <span className="hidden text-sm font-medium text-slate-500 sm:inline">
                Welcome back, {firstName}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <HeroStat
                icon={Briefcase}
                label="Active cases"
                value={activeCases}
              />

              <HeroStat
                icon={CalendarCheck}
                label="Upcoming"
                value={upcomingConsultations}
              />

              <HeroStat
                icon={MessageSquare}
                label="Messages"
                value={unreadMessages}
                highlight={unreadMessages > 0}
              />
            </div>
          </div>

          <Button
            asChild
            className="h-10 shrink-0 gap-2 rounded-xl bg-slate-950 px-4 text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md"
          >
            <Link href="/find-lawyers">
              <Search className="h-4 w-4" />
              Find a lawyer
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function HeroStat({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2"
          : "flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2"
      }
    >
      <span
        className={
          highlight
            ? "flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600"
            : "flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm ring-1 ring-slate-200/80"
        }
      >
        <Icon className="h-3.5 w-3.5" aria-hidden />
      </span>

      <span className="flex items-baseline gap-1.5">
        <span className="text-sm font-semibold text-slate-950">
          {value}
        </span>

        <span className="text-[11px] font-medium text-slate-500">
          {label}
        </span>
      </span>
    </div>
  );
}