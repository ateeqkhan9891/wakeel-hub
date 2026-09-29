import Link from "next/link";

import {
  ArrowUpRight,
  CreditCard,
  Wallet,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { getClientPayments } from "@/lib/data/client-payments";

import { formatDate, formatPKR } from "@/lib/utils";

type Payments = Awaited<ReturnType<typeof getClientPayments>>;

type ClientPaymentsSnapshotProps = {
  payments: Payments;
  totalPaid: number;
  pendingTotal: number;
};

export function ClientPaymentsSnapshot({
  payments,
  totalPaid,
  pendingTotal,
}: ClientPaymentsSnapshotProps) {
  return (
    <Card className="relative overflow-hidden border-slate-200 bg-white p-0 shadow-sm ring-0">
      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-50/70 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-8 h-24 w-24 rounded-full border border-slate-100" />
      <div className="pointer-events-none absolute right-9 top-7 h-8 w-8 rounded-full border border-emerald-100/70" />

      <div className="relative flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Wallet
              className="h-4 w-4"
              strokeWidth={1.8}
              aria-hidden
            />
          </div>

          <div>
            <h2 className="font-heading text-base font-semibold tracking-tight text-slate-950">
              Payments
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Your payment activity
            </p>
          </div>
        </div>

        {payments.length > 0 && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 gap-1 rounded-lg px-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          >
            <Link href="/dashboard/client/payments">
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>

      <div className="relative p-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                Total paid
              </p>
            </div>

            <p className="mt-1.5 text-base font-semibold tracking-tight text-slate-950">
              {formatPKR(totalPaid)}
            </p>
          </div>

          <div className="rounded-xl border border-blue-100/80 bg-blue-50/50 p-3.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-blue-500">
                Pending
              </p>
            </div>

            <p className="mt-1.5 text-base font-semibold tracking-tight text-slate-950">
              {formatPKR(pendingTotal)}
            </p>
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="mt-2 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-8 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200/70">
              <CreditCard
                className="h-4 w-4"
                strokeWidth={1.8}
                aria-hidden
              />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-950">
              No payments yet
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Your completed transactions will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                Recent transactions
              </p>

              <span className="text-[10px] font-medium text-slate-400">
                Latest
              </span>
            </div>

            <div className="space-y-1.5">
              {payments.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-slate-200 hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <CreditCard
                        className="h-3.5 w-3.5"
                        strokeWidth={1.8}
                        aria-hidden
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-800">
                        {p.type}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {formatDate(p.date)}
                      </p>
                    </div>
                  </div>

                  <p className="shrink-0 text-xs font-semibold text-slate-950">
                    {formatPKR(p.total)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
