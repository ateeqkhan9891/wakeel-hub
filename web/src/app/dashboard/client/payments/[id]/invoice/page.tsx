import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Scale } from "lucide-react";

import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { InvoicePrintButton } from "@/components/dashboard/shared/invoice-print-button";
import { getClientReceipt } from "@/lib/data/commission";
import { formatDate, formatPKR } from "@/lib/utils";

export const metadata: Metadata = { title: "Consultation Receipt" };

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className={strong ? "font-semibold text-foreground" : "text-muted-foreground"}>{label}</span>
      <span className={strong ? "font-heading text-lg font-semibold text-foreground" : "font-medium text-foreground"}>{value}</span>
    </div>
  );
}

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await getClientReceipt(id);
  if (!r) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between print:hidden">
        <Link href="/dashboard/client/payments" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to payments
        </Link>
        <InvoicePrintButton />
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm print:border-0 print:shadow-none">
        <div className="flex items-start justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Scale className="h-5 w-5" /></span>
            <div><p className="font-heading text-lg font-semibold text-foreground">WakeelHub Pakistan</p><p className="text-xs text-muted-foreground">Verified legal marketplace</p></div>
          </div>
          <div className="text-right"><p className="font-heading text-xl font-semibold text-foreground">RECEIPT</p><p className="mt-1 text-xs text-muted-foreground">{r.receiptNumber}</p></div>
        </div>

        <div className="grid grid-cols-2 gap-6 py-6 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Paid by</p>
            <p className="mt-1 font-medium text-foreground">{r.clientName}</p>
            <p className="text-muted-foreground">{r.clientEmail}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Paid on</p>
            <p className="mt-1 font-medium text-foreground">{formatDate(r.paidAt ?? r.createdAt)}</p>
            <p className="text-muted-foreground">Ref: {r.reference}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border">
          <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"><span>Description</span><span>Amount</span></div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-foreground">Legal consultation</p>
              {r.lawyerName && <p className="text-xs text-muted-foreground">Advocate: {r.lawyerName}{r.bookingDate ? ` - ${formatDate(r.bookingDate)}${r.bookingTime ? ` ${r.bookingTime.slice(0, 5)}` : ""}` : ""}</p>}
            </div>
            <span className="font-medium text-foreground">{formatPKR(r.gross)}</span>
          </div>
        </div>

        <div className="mt-4 ml-auto max-w-xs">
          <Row label="Amount paid" value={formatPKR(r.gross)} />
          <div className="border-t border-border"><Row label="Total" value={formatPKR(r.gross)} strong /></div>
          <div className="mt-2 flex justify-end"><StatusBadge status={r.paymentStatus} /></div>
        </div>

        <p className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          Thank you for using WakeelHub Pakistan. This receipt was generated electronically and is valid without a signature.
        </p>
      </div>
    </div>
  );
}
