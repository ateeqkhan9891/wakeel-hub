import type { Metadata } from "next";

import {
  CreditCard,
  Receipt,
  RotateCcw,
  TrendingUp,
} from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { StatusBadge } from "@/components/dashboard/shared/status-badge";

import { AdminCommission } from "@/components/dashboard/admin/admin-commission";

import {
  getAdminStats,
  getAdminPayments,
} from "@/lib/data/admin";

import {
  getAdminCommissionOverview,
  getCommissionSettings,
} from "@/lib/data/commission";

import { formatDate, formatPKR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Payments & Commission",
};

export default async function AdminPaymentsPage() {
  const [overview, settings, stats, payments] = await Promise.all([
    getAdminCommissionOverview(200),
    getCommissionSettings(),
    getAdminStats(),
    getAdminPayments(50),
  ]);

  const refunds = payments.filter((payment) => payment.status === "refunded").length;

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-2.5">
      <header className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/30">
        <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 overflow-hidden">
          <div className="absolute -right-14 -top-14 h-28 w-28 rounded-full bg-primary" />
          <div className="absolute right-5 top-5 h-2.5 w-2.5 rounded-full bg-gold" />
        </div>

        <div className="relative px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2.5 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <Receipt className="h-3.5 w-3.5" aria-hidden />
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Financial operations
                </span>
              </div>

              <h1 className="font-heading text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                Payments &amp; Commission
              </h1>

              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                Track transactions, revenue, platform commission, refunds, and
                payment performance.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/70 p-1">
              <SummaryItem
                icon={Receipt}
                label="Revenue"
                value={formatPKR(stats.totalRevenue)}
              />

              <SummaryItem
                icon={TrendingUp}
                label="This month"
                value={formatPKR(stats.monthlyRevenue)}
              />

              <SummaryItem
                icon={RotateCcw}
                label="Refunds"
                value={refunds}
                tone="slate"
              />

              <SummaryItem
                icon={CreditCard}
                label="Failed"
                value={stats.failedPayments}
                tone="rose"
              />
            </div>
          </div>
        </div>
      </header>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/20">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8 text-primary">
              <Receipt className="h-3.5 w-3.5" aria-hidden />
            </span>

            <div>
              <h2 className="text-sm font-semibold text-slate-950">
                Recent transactions
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Latest payment activity across the platform
              </p>
            </div>
          </div>

          <span className="text-[11px] font-medium text-slate-400">
            {payments.length} transactions
          </span>
        </div>

        {payments.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-medium text-slate-700">
              No transactions recorded yet.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Payment activity will appear here once transactions are recorded.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 bg-slate-50/60 hover:bg-slate-50/60">
                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Transaction
                  </TableHead>

                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Client
                  </TableHead>

                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Lawyer
                  </TableHead>

                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Type
                  </TableHead>

                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Date
                  </TableHead>

                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Amount
                  </TableHead>

                  <TableHead className="h-10 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {payments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    className="border-slate-100 hover:bg-slate-50/60"
                  >
                    <TableCell className="py-3">
                      <span className="font-mono text-[11px] text-slate-600">
                        {payment.reference}
                      </span>
                    </TableCell>

                    <TableCell className="py-3 text-xs text-slate-600">
                      {payment.clientName}
                    </TableCell>

                    <TableCell className="py-3 text-xs text-slate-600">
                      {payment.lawyerName}
                    </TableCell>

                    <TableCell className="py-3 text-xs capitalize text-slate-600">
                      {payment.type}
                    </TableCell>

                    <TableCell className="whitespace-nowrap py-3 text-xs text-slate-500">
                      {formatDate(payment.date)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap py-3 text-xs font-semibold text-slate-900">
                      {formatPKR(payment.paid || payment.total)}
                    </TableCell>

                    <TableCell className="py-3 text-right">
                      <StatusBadge status={payment.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      <section>
        <div className="mb-2.5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <h2 className="font-heading text-sm font-semibold text-slate-950">
            Commission &amp; payouts
          </h2>
        </div>

        <AdminCommission
          overview={overview}
          settings={settings}
        />
      </section>
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: {
  icon: typeof Receipt;
  label: string;
  value: string | number;
  tone?: "primary" | "slate" | "rose";
}) {
  const iconClass =
    tone === "rose"
      ? "bg-rose-50 text-rose-600"
      : tone === "slate"
        ? "bg-slate-100 text-slate-500"
        : "bg-white text-primary shadow-sm";

  return (
    <div className="flex min-w-[88px] items-center gap-2 rounded-lg px-2.5 py-2">
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${iconClass}`}
      >
        <Icon className="h-3 w-3" aria-hidden />
      </span>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold leading-none text-slate-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>

        <p className="mt-1 text-[10px] font-medium leading-none text-slate-400">
          {label}
        </p>
      </div>
    </div>
  );
}