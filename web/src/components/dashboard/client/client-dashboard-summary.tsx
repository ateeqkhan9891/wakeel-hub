
import { CalendarCheck, CreditCard, Gavel, MessageSquare, Wallet } from "lucide-react";

import { Card } from "@/components/ui/card";

type ClientDashboardSummaryProps = {
  activeCases: number;
  upcomingConsultations: number;
  unreadMessages: number;
  pendingPayments: number;
  totalPaid: number;
};

export function ClientDashboardSummary({
  activeCases,
  upcomingConsultations,
  unreadMessages,
  pendingPayments,
  totalPaid,
}: ClientDashboardSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
        icon={CreditCard}
        label="Pending payments"
        value={pendingPayments}
        tone="gold"
      />

      <SummaryCard
        icon={Wallet}
        label="Total paid"
        value={totalPaid}
        tone="emerald"
        formatValue={(value) => `PKR ${value.toLocaleString()}`}
      />
    </div>
  );
}

type Tone = "navy" | "gold" | "emerald";

const TONES: Record<Tone, string> = {
  navy: "bg-primary/8 text-primary",
  gold: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
  formatValue,
}: {
  icon: typeof Gavel;
  label: string;
  value: number;
  tone: Tone;
  formatValue?: (value: number) => string;
}) {
  return (
    <Card className="border-slate-200 p-5 ring-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {formatValue ? formatValue(value) : value}
          </p>
        </div>

        <div className={`rounded-lg p-2 ${TONES[tone]}`}>
          <Icon className="h-4 w-4" aria-hidden />
        </div>
      </div>
    </Card>
  );
}