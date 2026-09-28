import type { Metadata } from "next";

import Link from "next/link";

import {
  ArrowUpRight,
  Clock,
  FileDown,
  Receipt,
  Wallet,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";

import { getClientReceipts } from "@/lib/data/commission";
import { formatDate, formatPKR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Payments & Receipts",
};

export default async function ClientPaymentsPage() {
  const receipts = await getClientReceipts();

  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden border-slate-200 bg-white p-0 shadow-sm ring-0">
        <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-50/70 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-10 h-28 w-28 rounded-full bg-blue-50/70 blur-2xl" />
        <div className="pointer-events-none absolute right-10 top-8 h-14 w-14 rounded-full border border-emerald-100/70" />
        <div className="pointer-events-none absolute right-14 top-12 h-6 w-6 rounded-full border border-emerald-100/50" />

        <div className="relative flex items-center gap-3 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Wallet className="h-4 w-4" strokeWidth={1.8} />
          </div>

          <div>
            <h1 className="font-heading text-lg font-semibold tracking-tight text-slate-950">
              Payments & Receipts
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              View your consultation payments and receipts.
            </p>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden border-slate-200 bg-white p-0 shadow-sm ring-0">
        <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-blue-50/60 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-14 -left-10 h-24 w-24 rounded-full border border-slate-100" />

        <div className="relative flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-heading text-base font-semibold tracking-tight text-slate-950">
              Payment history
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Your consultation transactions
            </p>
          </div>

          {receipts.length > 0 && (
            <div className="flex h-8 items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 text-xs font-medium text-slate-500">
              <Receipt className="h-3.5 w-3.5" />
              {receipts.length} transaction{receipts.length === 1 ? "" : "s"}
            </div>
          )}
        </div>

        {receipts.length === 0 ? (
          <div className="relative flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 ring-1 ring-slate-200/70">
              <Receipt className="h-4 w-4" strokeWidth={1.8} />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-950">
              No payments yet
            </p>

            <p className="mt-1 max-w-sm text-xs text-slate-500">
              Your consultation receipts will appear here once you make a
              payment.
            </p>

            <Link
              href="/dashboard/client/lawyers"
              className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Find a lawyer
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="relative p-3">
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Receipt
                    </th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Advocate
                    </th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Date / time
                    </th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Amount
                    </th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Status
                    </th>
                    <th className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {receipts.map((receipt) => (
                    <tr
                      key={receipt.id}
                      className="group border-b border-slate-100 last:border-0"
                    >
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                            <Receipt
                              className="h-3.5 w-3.5"
                              strokeWidth={1.8}
                            />
                          </div>
                          <span className="font-semibold text-slate-800">
                            {receipt.receiptNumber}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-3.5 text-xs text-slate-600">
                        {receipt.lawyerName ?? "-"}
                      </td>

                      <td className="px-3 py-3.5 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {formatDate(
                            receipt.bookingDate ??
                              receipt.paidAt ??
                              receipt.createdAt,
                          )}
                          {receipt.bookingTime
                            ? ` · ${receipt.bookingTime.slice(0, 5)}`
                            : ""}
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-xs font-semibold text-slate-950">
                        {formatPKR(receipt.gross)}
                      </td>

                      <td className="px-3 py-3.5">
                        <StatusBadge status={receipt.paymentStatus} />
                      </td>

                      <td className="px-3 py-3.5 text-right">
                        <Link
                          href={`/dashboard/client/payments/${receipt.id}/invoice`}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
                        >
                          <FileDown className="h-3.5 w-3.5" />
                          Receipt
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 md:hidden">
              {receipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition-colors hover:border-slate-200 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm ring-1 ring-slate-200/70">
                        <Receipt
                          className="h-3.5 w-3.5"
                          strokeWidth={1.8}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-900">
                          {receipt.receiptNumber}
                        </p>
                        <p className="mt-0.5 truncate text-[10px] text-slate-500">
                          {receipt.lawyerName ?? "Advocate"}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={receipt.paymentStatus} />
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        {formatPKR(receipt.gross)}
                      </p>

                      <p className="mt-1 inline-flex items-center gap-1.5 text-[10px] text-slate-400">
                        <Clock className="h-3 w-3" />
                        {formatDate(
                          receipt.bookingDate ??
                            receipt.paidAt ??
                            receipt.createdAt,
                        )}
                        {receipt.bookingTime
                          ? ` · ${receipt.bookingTime.slice(0, 5)}`
                          : ""}
                      </p>
                    </div>

                    <Link
                      href={`/dashboard/client/payments/${receipt.id}/invoice`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-2.5 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200/70 transition-colors hover:bg-slate-100 hover:text-slate-950"
                    >
                      <FileDown className="h-3.5 w-3.5" />
                      Receipt
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}