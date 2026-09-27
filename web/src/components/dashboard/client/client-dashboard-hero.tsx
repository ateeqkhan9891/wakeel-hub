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
    <Card className="border-slate-200 p-6 ring-0">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
                <p className="text-sm text-slate-500">
          Your legal matters at a glance
        </p>

        <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">
          Your dashboard
        </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
            <HeroStat
              icon={Briefcase}
              label="Active cases"
              value={activeCases}
            />

            <span
              className="hidden h-4 w-px bg-slate-200 sm:block"
              aria-hidden
            />

            <HeroStat
              icon={CalendarCheck}
              label="Upcoming consultations"
              value={upcomingConsultations}
            />

            <span
              className="hidden h-4 w-px bg-slate-200 sm:block"
              aria-hidden
            />

            <HeroStat
              icon={MessageSquare}
              label="Unread messages"
              value={unreadMessages}
            />
          </div>
        </div>

        <Button
          asChild
          className="shrink-0 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/find-lawyers">
            <Search className="h-4 w-4" />
            Find a lawyer
          </Link>
        </Button>
      </div>
    </Card>
  );
}

function HeroStat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <span className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-gold" aria-hidden />
      <span className="font-semibold text-slate-900">{value}</span>
      <span className="text-slate-500">{label}</span>
    </span>
  );
}