import type { Metadata } from "next";

import {
  CheckCircle2,
  CreditCard,
  RefreshCw,
  TrendingUp,
  XCircle,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { getAdminSubscriptions } from "@/lib/data/admin";
import { formatDate, formatPKR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Subscriptions",
};

function planLabel(plan: string | null) {
  if (!plan) {
    return "-";
  }

  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

export default async function AdminSubscriptionsPage() {
  const { rows, stats } = await getAdminSubscriptions(300);

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
                  <CreditCard className="h-3.5 w-3.5" aria-hidden />
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Revenue operations
                </span>
              </div>

              <h1 className="font-heading text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                Subscriptions
              </h1>

              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                Monitor advocate subscription status, commission access,
                payment activity, and recurring revenue.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/70 p-1">
              <SummaryItem
                icon={CheckCircle2}
                label="Active"
                value={stats.active}
                tone="emerald"
              />

              <SummaryItem
                icon={XCircle}
                label="Expired"
                value={stats.expired}
                tone="rose"
              />

              <SummaryItem
                icon={RefreshCw}
                label="Renewals"
                value={stats.renewalsThisMonth}
                tone="primary"
              />

              <SummaryItem
                icon={CreditCard}
                label="Cancelled"
                value={stats.cancelled}
                tone="slate"
              />

              <SummaryItem
                icon={TrendingUp}
                label="MRR"
                value={formatPKR(stats.mrr)}
                tone="gold"
              />
            </div>
          </div>
        </div>
      </header>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/20">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
              <CreditCard className="h-4 w-4" aria-hidden />
            </span>

            <p className="mt-1 text-sm font-semibold text-slate-950">
              No subscriptions yet
            </p>

            <p className="max-w-md text-xs leading-5 text-slate-400">
              Advocate subscription records will appear here once lawyers
              activate a subscription model.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <CreditCard className="h-3.5 w-3.5" aria-hidden />
                </span>

                <div>
                  <h2 className="text-sm font-semibold text-slate-950">
                    Advocate subscriptions
                  </h2>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Current subscription and payment status
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-medium text-slate-400">
                {rows.length} subscriptions
              </span>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 bg-slate-50/60 hover:bg-slate-50/60">
                    <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Advocate
                    </TableHead>

                    <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Model
                    </TableHead>

                    <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Status
                    </TableHead>

                    <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Started
                    </TableHead>

                    <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Expires
                    </TableHead>

                    <TableHead className="h-10 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Payment
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rows.map((subscription) => (
                    <TableRow
                      key={subscription.lawyerId}
                      className="border-slate-100 hover:bg-slate-50/60"
                    >
                      <TableCell className="py-3">
                        <span className="text-xs font-medium text-slate-950">
                          {subscription.lawyerName}
                        </span>
                      </TableCell>

                      <TableCell className="py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center rounded-md bg-primary/8 px-2 py-0.5 text-[11px] font-medium capitalize text-primary">
                            {planLabel(subscription.plan)}
                          </span>

                          {subscription.period && (
                            <span className="text-[10px] text-slate-400">
                              {subscription.period}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="py-3">
                        <StatusBadge status={subscription.status} />
                      </TableCell>

                      <TableCell className="whitespace-nowrap py-3 text-xs text-slate-500">
                        {subscription.startedAt
                          ? formatDate(subscription.startedAt)
                          : "-"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap py-3 text-xs text-slate-500">
                        {subscription.expiresAt ? (
                          <>
                            {formatDate(subscription.expiresAt)}

                            {subscription.daysRemaining !== null &&
                              !subscription.expired && (
                                <span className="ml-1.5 text-[10px] text-slate-400">
                                  ({subscription.daysRemaining}d)
                                </span>
                              )}
                          </>
                        ) : (
                          <span className="text-slate-400">No expiry</span>
                        )}
                      </TableCell>

                      <TableCell className="py-3 text-right">
                        <StatusBadge
                          status={
                            subscription.paymentStatus ?? "Not recorded"
                          }
                          className="px-2 py-0 text-[10px]"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="border-t border-slate-100 px-4 py-2.5 sm:px-5">
              <p className="text-[11px] text-slate-400">
                Showing{" "}
                <span className="font-medium text-slate-600">
                  {rows.length}
                </span>{" "}
                subscription records
              </p>
            </div>
          </>
        )}
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
  icon: typeof CreditCard;
  label: string;
  value: string | number;
  tone?: "primary" | "emerald" | "rose" | "slate" | "gold";
}) {
  const iconClass =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-600"
      : tone === "rose"
        ? "bg-rose-50 text-rose-600"
        : tone === "slate"
          ? "bg-slate-100 text-slate-500"
          : tone === "gold"
            ? "bg-amber-50 text-amber-600"
            : "bg-white text-primary shadow-sm";

  return (
    <div className="flex min-w-[82px] items-center gap-2 rounded-lg px-2.5 py-2">
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