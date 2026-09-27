
import { CreditCard, Wallet } from "lucide-react";

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
    <Card className="overflow-hidden border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-slate-950">
            Payments
          </h2>
        </div>

        {payments.length > 0 && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-1"
          >
            <a href="/dashboard/client/payments">
              View all
            </a>
          </Button>
        )}
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              Total paid
            </p>
            <p className="mt-1 text-lg font-bold text-slate-950">
              {formatPKR(totalPaid)}
            </p>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-xs font-medium text-amber-700">
              Pending
            </p>
            <p className="mt-1 text-lg font-bold text-amber-900">
              {formatPKR(pendingTotal)}
            </p>
          </div>
        </div>

        {payments.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            No payments recorded yet.
          </p>
        ) : (
          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Recent transactions
            </p>

            <div className="space-y-2.5">
              {payments.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {p.type}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(p.date)}
                      </p>
                    </div>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-slate-900">
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