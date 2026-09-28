import type { LucideIcon } from "lucide-react";

import {
  CalendarCheck,
  CheckSquare,
  Gavel,
  MessageSquare,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ClientDashboardSummaryProps = {
  activeCases: number;
  upcomingConsultations: number;
  unreadMessages: number;
  pendingActions: number;
};

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

export function ClientDashboardSummary({
  activeCases,
  upcomingConsultations,
  unreadMessages,
  pendingActions,
}: ClientDashboardSummaryProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        icon={Gavel}
        label="Active cases"
        value={activeCases}
        tone="navy"
      />

      <SummaryCard
        icon={CalendarCheck}
        label="Upcoming consultations"
        value={upcomingConsultations}
        tone="blue"
      />

      <SummaryCard
        icon={MessageSquare}
        label="Unread messages"
        value={unreadMessages}
        tone="blue"
      />

      <SummaryCard
        icon={CheckSquare}
        label="Pending actions"
        value={pendingActions}
        tone="emerald"
      />
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: Tone;
}) {
  const styles = TONES[tone];

  return (
    <Card className="group relative overflow-hidden border-slate-200 bg-white p-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div
        className={cn(
          "pointer-events-none absolute -right-7 -top-7 h-20 w-20 rounded-full blur-2xl",
          styles.shape,
        )}
      />

      <div
        className={cn(
          "pointer-events-none absolute -bottom-8 -left-6 h-16 w-16 rounded-full border",
          tone === "blue"
            ? "border-blue-100/70"
            : tone === "emerald"
              ? "border-emerald-100/70"
              : "border-slate-200/70",
        )}
      />

      <div className="pointer-events-none absolute right-5 top-4 h-7 w-7 rounded-full border border-slate-100/80" />

      <div className="relative flex items-center gap-3 p-4">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            styles.icon,
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
        </div>

        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
            {label}
          </p>

          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="text-xl font-semibold tracking-tight text-slate-950">
              {value}
            </span>

            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                styles.dot,
              )}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}