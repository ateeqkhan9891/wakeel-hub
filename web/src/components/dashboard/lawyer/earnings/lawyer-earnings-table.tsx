import type { LawyerEarnings } from "@/lib/data/commission";

import { formatDate, formatPKR } from "@/lib/utils";

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

import { LawyerEarningsEmpty } from "./lawyer-earnings-empty";

type LawyerEarningsTableProps = {
  earnings: LawyerEarnings;
};

export function LawyerEarningsTable({
  earnings,
}: LawyerEarningsTableProps) {
  const consultationCount = earnings.rows.length;

  return (
    <Card className="overflow-hidden border-border/80 p-0 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-sm font-semibold text-foreground">
            Booking-wise earnings
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            {formatPKR(earnings.grossCollected)} collected across{" "}
            {consultationCount} paid consultation
            {consultationCount === 1 ? "" : "s"}.
          </p>
        </div>

        {consultationCount > 0 && (
          <div className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {consultationCount}{" "}
            {consultationCount === 1 ? "record" : "records"}
          </div>
        )}
      </div>

      {consultationCount === 0 ? (
        <LawyerEarningsEmpty />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                <TableHead className="pl-5">Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">
                  Gross
                </TableHead>
                <TableHead className="text-right">
                  Commission
                </TableHead>
                <TableHead className="text-right">
                  Net earning
                </TableHead>
                <TableHead className="pr-5">
                  Payout
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {earnings.rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-colors hover:bg-secondary/30"
                >
                  <TableCell className="pl-5">
                    <div className="max-w-44">
                      <p className="truncate font-medium text-foreground">
                        {row.clientName ?? "Client"}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDate(
                      row.bookingDate ??
                        row.paidAt ??
                        row.createdAt,
                    )}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-right text-muted-foreground">
                    {formatPKR(row.gross)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-right">
                    <span className="text-rose-600">
                      − {formatPKR(row.commissionAmount)}
                    </span>

                    <span className="ml-1 text-[11px] text-muted-foreground">
                      ({row.commissionPct}%)
                    </span>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-right font-semibold text-foreground">
                    {formatPKR(row.lawyerNet)}
                  </TableCell>

                  <TableCell className="pr-5">
                    <StatusBadge status={row.payoutStatus} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}