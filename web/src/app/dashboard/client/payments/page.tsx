import type { Metadata } from "next";

import Link from "next/link";

import {
  Receipt,
  Wallet,
  CheckCircle2,
  FileDown,
  Clock,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { StatCard } from "@/components/dashboard/shared/stat-card";

import { getClientReceipts } from "@/lib/data/commission";
import { formatDate, formatPKR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Payments & Receipts",
};

export default async function ClientPaymentsPage() {
  const receipts = await getClientReceipts();

  const paid = receipts.filter((r) => r.paymentStatus === "paid");

  const totalPaid = paid.reduce(
    (sum, receipt) => sum + receipt.gross,
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Payments & Receipts
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View your consultation payments and receipts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Wallet}
          label="Total paid"
          value={formatPKR(totalPaid)}
          accent="gold"
        />

        <StatCard
          icon={CheckCircle2}
          label="Paid consultations"
          value={String(paid.length)}
        />

        <StatCard
          icon={Receipt}
          label="Transactions"
          value={String(receipts.length)}
        />
      </div>

      <Card className="overflow-hidden border-border/80 p-0">
        <div className="border-b border-border/70 px-5 py-4">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Payment history
          </h2>
        </div>

        {receipts.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <Receipt className="h-7 w-7 text-muted-foreground" />
            <p className="mt-3 font-medium text-foreground">
              No payments yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your consultation receipts will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Receipt</TableHead>
                  <TableHead>Advocate</TableHead>
                  <TableHead>Date / time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-5 text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {receipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="pl-5 font-medium text-foreground">
                      {receipt.receiptNumber}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {receipt.lawyerName ?? "-"}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(
                          receipt.bookingDate ??
                            receipt.paidAt ??
                            receipt.createdAt,
                        )}
                        {receipt.bookingTime
                          ? ` · ${receipt.bookingTime.slice(0, 5)}`
                          : ""}
                      </span>
                    </TableCell>

                    <TableCell className="font-medium text-foreground">
                      {formatPKR(receipt.gross)}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={receipt.paymentStatus} />
                    </TableCell>

                    <TableCell className="pr-5 text-right">
                      <Link
                        href={`/dashboard/client/payments/${receipt.id}/invoice`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        <FileDown className="h-3.5 w-3.5" />
                        Receipt
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}