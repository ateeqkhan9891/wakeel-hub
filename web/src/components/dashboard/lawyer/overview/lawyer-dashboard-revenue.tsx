import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  CreditCard,
  Wallet,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import { formatPKR } from "@/lib/utils";

type LawyerDashboardRevenueProps = {
  monthlyRevenue: number;
  pendingPayments: number;
  completedConsultations: number;
  averageOnlineFee: number;
};

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h2 className="font-heading text-base font-semibold text-slate-950">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

function MiniMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
          <Icon className="h-4 w-4" />
        </span>

        <p className="text-xs font-medium text-slate-500">{label}</p>
      </div>

      <p className="mt-3 font-heading text-lg font-semibold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}

export function LawyerDashboardRevenue({
  monthlyRevenue,
  pendingPayments,
  completedConsultations,
  averageOnlineFee,
}: LawyerDashboardRevenueProps) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 sm:rounded-3xl sm:p-5">
      <SectionHeader
        title="Revenue snapshot"
        description="A quick view of your consultation earnings and payment activity."
      />

      <div className="mt-5">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 sm:p-6">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-100/70" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <Wallet className="h-4 w-4" />
                </span>

                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700">
                  This month
                </p>
              </div>

              <p className="mt-4 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {formatPKR(monthlyRevenue)}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Paid consultation earnings
              </p>
            </div>

            <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm sm:flex">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
              <CreditCard className="h-4 w-4" />
            </span>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                Pending payments
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Awaiting payment completion
              </p>
            </div>
          </div>

          <p className="shrink-0 font-heading text-base font-semibold text-slate-950 sm:text-lg">
            {formatPKR(pendingPayments)}
          </p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <MiniMetric
            icon={CheckCircle2}
            label="Completed"
            value={String(completedConsultations)}
          />

          <MiniMetric
            icon={BarChart3}
            label="Average fee"
            value={formatPKR(averageOnlineFee)}
          />
        </div>
      </div>
    </Card>
  );
}
