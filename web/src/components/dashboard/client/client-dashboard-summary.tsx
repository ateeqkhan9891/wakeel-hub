import {
  CalendarCheck,
  CheckSquare,
  Gavel,
  MessageSquare,
} from "lucide-react";

import { Card } from "@/components/ui/card";

type ClientDashboardSummaryProps = {
  activeCases: number;
  upcomingConsultations: number;
  unreadMessages: number;
  pendingActions: number;
};

type Tone = "navy" | "gold" | "emerald";

const TONES: Record<
  Tone,
  {
    icon: string;
    value: string;
    dot: string;
  }
> = {
  navy: {
    icon: "bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary",
    value: "text-foreground",
    dot: "bg-primary",
  },
  gold: {
    icon: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    value: "text-foreground",
    dot: "bg-amber-500",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    value: "text-foreground",
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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        tone="gold"
      />

      <SummaryCard
        icon={MessageSquare}
        label="Unread messages"
        value={unreadMessages}
        tone="navy"
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
  icon: typeof Gavel;
  label: string;
  value: number;
  tone: Tone;
}) {
  const styles = TONES[tone];

  return (
    <Card className="border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">
            {label}
          </p>

          <p
            className={`mt-3 truncate text-2xl font-semibold tracking-tight ${styles.value}`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />

        <span className="text-xs text-muted-foreground">
          Current overview
        </span>
      </div>
    </Card>
  );
}