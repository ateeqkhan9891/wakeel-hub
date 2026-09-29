import {
  Bell,
  CalendarCheck,
  CreditCard,
  Gavel,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import { cn } from "@/lib/utils";

type Tone = "navy" | "gold" | "emerald";

const TONES: Record<
  Tone,
  {
    icon: string;
    accent: string;
  }
> = {
  navy: {
    icon: "bg-primary/8 text-primary",
    accent: "bg-primary",
  },
  gold: {
    icon: "bg-amber-50 text-amber-600",
    accent: "bg-amber-500",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    accent: "bg-emerald-500",
  },
};

type SummaryCardProps = {
  icon: LucideIcon;
  tone: Tone;
  label: string;
  value: number;
};

function SummaryCard({
  icon: Icon,
  tone,
  label,
  value,
}: SummaryCardProps) {
  const styles = TONES[tone];

  return (
    <Card className="relative overflow-hidden rounded-xl border-slate-200 bg-white px-3.5 py-3 shadow-sm shadow-slate-200/30">
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-0.5",
          styles.accent,
        )}
      />

      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            styles.icon,
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>

        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.07em] text-slate-400">
            {label}
          </p>

          <p className="mt-0.5 font-heading text-xl font-semibold leading-none tracking-tight text-slate-950">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

type NotificationsSummaryProps = {
  unread: number;
  booking: number;
  case: number;
  payment: number;
  verification: number;
};

export function NotificationsSummary({
  unread,
  booking,
  case: caseCount,
  payment,
  verification,
}: NotificationsSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-5">
      <SummaryCard
        icon={Bell}
        tone="navy"
        label="Unread"
        value={unread}
      />

      <SummaryCard
        icon={CalendarCheck}
        tone="gold"
        label="Bookings"
        value={booking}
      />

      <SummaryCard
        icon={Gavel}
        tone="navy"
        label="Cases"
        value={caseCount}
      />

      <SummaryCard
        icon={CreditCard}
        tone="emerald"
        label="Payments"
        value={payment}
      />

      <SummaryCard
        icon={ShieldCheck}
        tone="navy"
        label="Verification"
        value={verification}
      />
    </div>
  );
}
