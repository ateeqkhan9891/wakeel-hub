import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Wallet, Clock, CheckCircle2, Percent, Receipt } from "lucide-react";

import { getLawyerEarnings } from "@/lib/data/commission";
import { formatDate, formatPKR } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { StatCard } from "@/components/dashboard/shared/stat-card";
import { DashboardPageHeader } from "@/components/dashboard/lawyer/lawyer-dashboard-ui";

export const metadata: Metadata = { title: "Earnings" };

export default async function LawyerPaymentsPage() {
  const earnings = await getLawyerEarnings();
  if (!earnings) redirect("/login");

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Earnings & Payouts"
        description="Your consultation earnings after platform commission, and the status of each payout."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Wallet} label="Total earnings (net)" value={formatPKR(earnings.totalEarnings)} accent="gold" />
        <StatCard icon={Clock} label="Pending payout" value={formatPKR(earnings.pendingPayout)} />
        <StatCard icon={CheckCircle2} label="Paid out" value={formatPKR(earnings.paidPayout)} />
        <StatCard icon={Percent} label="Commission deducted" value={formatPKR(earnings.commissionDeducted)} />
      </div>

      <Card className="overflow-hidden border-border/80 p-0">
        <div className="border-b border-border px-5 py-3">
          <h2 className="font-heading text-sm font-semibold text-foreground">Booking-wise earnings</h2>
          <p className="text-xs text-muted-foreground">Gross of {formatPKR(earnings.grossCollected)} collected across {earnings.rows.length} paid consultation{earnings.rows.length === 1 ? "" : "s"}.</p>
        </div>
        {earnings.rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 text-primary"><Receipt className="h-6 w-6" /></span>
            <div>
              <p className="font-heading text-base font-semibold text-foreground">No earnings yet</p>
              <p className="mt-1 text-sm text-muted-foreground">When clients pay for consultations, your net earnings and payout status appear here.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                  <TableHead className="text-right">Net earning</TableHead>
                  <TableHead>Payout</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earnings.rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium text-foreground">{r.clientName ?? "Client"}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(r.bookingDate ?? r.paidAt ?? r.createdAt)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatPKR(r.gross)}</TableCell>
                    <TableCell className="text-right text-rose-600">− {formatPKR(r.commissionAmount)} <span className="text-[11px] text-muted-foreground">({r.commissionPct}%)</span></TableCell>
                    <TableCell className="text-right font-semibold text-foreground">{formatPKR(r.lawyerNet)}</TableCell>
                    <TableCell><StatusBadge status={r.payoutStatus} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <p className="text-xs text-muted-foreground">
        Payouts are processed by WakeelHub after each consultation is completed. You&apos;ll be notified when a payout is marked paid.
      </p>
    </div>
  );
}
