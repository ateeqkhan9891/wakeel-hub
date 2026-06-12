import type { Metadata } from "next";
import Link from "next/link";
import { Receipt, Wallet, CheckCircle2, FileDown, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { getClientReceipts } from "@/lib/data/commission";
import { formatDate, formatPKR } from "@/lib/utils";

export const metadata: Metadata = { title: "Payments & Receipts" };

export default async function ClientPaymentsPage() {
  const receipts = await getClientReceipts();
  const paid = receipts.filter((r) => r.paymentStatus === "paid");
  const totalPaid = paid.reduce((s, r) => s + r.gross, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Payments &amp; Receipts</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your consultation payments, with downloadable receipts.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Total paid" value={formatPKR(totalPaid)} accent="gold" />
        <StatCard icon={CheckCircle2} label="Paid consultations" value={String(paid.length)} />
        <StatCard icon={Receipt} label="Transactions" value={String(receipts.length)} />
      </div>

      {receipts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 border-dashed border-border/80 px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 text-primary"><Receipt className="h-6 w-6" /></span>
          <div>
            <p className="font-heading text-base font-semibold text-foreground">No payments yet</p>
            <p className="mt-1 text-sm text-muted-foreground">When you pay for a consultation, your receipt will appear here to download.</p>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden border-border/80 p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Advocate</TableHead>
                  <TableHead>Date / time</TableHead>
                  <TableHead className="text-right">Amount paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium text-foreground">{r.receiptNumber}</TableCell>
                    <TableCell className="text-muted-foreground">{r.lawyerName ?? "-"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{formatDate(r.bookingDate ?? r.paidAt ?? r.createdAt)}{r.bookingTime ? ` - ${r.bookingTime.slice(0, 5)}` : ""}</span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">{formatPKR(r.gross)}</TableCell>
                    <TableCell><StatusBadge status={r.paymentStatus} /></TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/client/payments/${r.id}/invoice`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                        <FileDown className="h-3.5 w-3.5" /> Receipt
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
