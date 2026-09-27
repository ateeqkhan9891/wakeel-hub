import {
  CalendarCheck,
  Briefcase,
  Eye,
  MessageSquare,
  UserRound,
  Wallet,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import { cn, formatPKR } from "@/lib/utils";

type LawyerDashboardMetricsProps = {
  pendingRequests: number;
  activeCases: number;
  upcomingHearings: number;
  monthlyRevenue: number;
  unreadMessages: number;
};

type MetricCardProps = {
  icon: typeof UserRound;
  label: string;
  value: string;
  helper: string;
  tone: "amber" | "emerald" | "slate";
};

function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
  tone,
}: MetricCardProps) {
  const toneClasses = {
    amber: {
      icon: "border-amber-200 bg-amber-50 text-amber-700",
      accent: "bg-amber-400",
    },
    emerald: {
      icon: "border-emerald-200 bg-emerald-50 text-emerald-700",
      accent: "bg-emerald-500",
    },
    slate: {
      icon: "border-slate-200 bg-slate-50 text-slate-600",
      accent: "bg-slate-300",
    },
  };

  const styles = toneClasses[tone];

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/70 sm:rounded-3xl sm:p-5">
      <span
        className={cn(
          "absolute inset-x-0 top-0 h-0.5",
          styles.accent,
        )}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500 sm:text-[11px]">
            {label}
          </p>

          <p className="mt-2 font-heading text-2xl font-semibold tracking-tight text-slate-950 sm:mt-3 sm:text-3xl">
            {value}
          </p>
        </div>

        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105 sm:h-11 sm:w-11 sm:rounded-2xl",
            styles.icon,
          )}
        >
          <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
        </span>
      </div>

      <p className="mt-3 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500 sm:mt-4">
        {helper}
      </p>
    </Card>
  );
}

export function LawyerDashboardMetrics({
  pendingRequests,
  activeCases,
  upcomingHearings,
  monthlyRevenue,
  unreadMessages,
}: LawyerDashboardMetricsProps) {
  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-6">
      <MetricCard
        icon={UserRound}
        label="New requests"
        value={String(pendingRequests)}
        helper={
          pendingRequests
            ? "Awaiting your decision"
            : "No pending requests"
        }
        tone="amber"
      />

      <MetricCard
        icon={Briefcase}
        label="Active cases"
        value={String(activeCases)}
        helper={
          activeCases
            ? "Open matters in progress"
            : "No active cases"
        }
        tone="slate"
      />

      <MetricCard
        icon={CalendarCheck}
        label="Upcoming hearings"
        value={String(upcomingHearings)}
        helper={
          upcomingHearings
            ? "Scheduled case hearings"
            : "No hearings scheduled"
        }
        tone="emerald"
      />

      <MetricCard
        icon={Wallet}
        label="Monthly revenue"
        value={formatPKR(monthlyRevenue)}
        helper={
          monthlyRevenue > 0
            ? "Paid consultation earnings"
            : "No paid earnings this month"
        }
        tone="emerald"
      />

      <MetricCard
        icon={MessageSquare}
        label="Unread messages"
        value={String(unreadMessages)}
        helper={
          unreadMessages
            ? "Client replies need attention"
            : "Inbox is clear"
        }
        tone="slate"
      />

      <MetricCard
        icon={Eye}
        label="Profile views"
        value="—"
        helper="Visibility tracking not connected yet"
        tone="slate"
      />
    </section>
  );
}