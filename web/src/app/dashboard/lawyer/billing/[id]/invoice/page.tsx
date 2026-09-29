import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Scale } from "lucide-react";

import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { InvoicePrintButton } from "@/components/dashboard/shared/invoice-print-button";
import { getSubscriptionInvoice } from "@/lib/data/lawyer-subscription";
import { formatDate, formatPKR } from "@/lib/utils";

export const metadata: Metadata = { title: "Subscription Invoice" };

const PLAN_LABEL: Record<string, string> = { pro: "Wakeel360 Pro", commission: "Pay-as-you-go" };

export default async function SubscriptionInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = await getSubscriptionInvoice(id);
  if (!inv) notFound();

  const desc = `${PLAN_LABEL[inv.plan] ?? inv.plan} subscription - ${inv.period}`;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between print:hidden">
        <Link href="/dashboard/lawyer/billing" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to billing
        </Link>
        <InvoicePrintButton />
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm print:border-0 print:shadow-none">
        <div className="flex items-start justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Scale className="h-5 w-5" /></span>
            <div><p className="font-heading text-lg font-semibold text-foreground">Wakeel360 Pakistan</p><p className="text-xs text-muted-foreground">Verified legal marketplace</p></div>
          </div>
          <div className="text-right"><p className="font-heading text-xl font-semibold text-foreground">INVOICE</p><p className="mt-1 text-xs text-muted-foreground">{inv.invoiceNumber}</p></div>
        </div>

        <div className="grid grid-cols-2 gap-6 py-6 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Billed to</p>
            <p className="mt-1 font-medium text-foreground">{inv.lawyerName}</p>
            <p className="text-muted-foreground">{inv.lawyerEmail}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Paid</p>
            <p className="mt-1 font-medium text-foreground">{formatDate(inv.paidAt)}</p>
            <p className="text-muted-foreground">Ref: {inv.reference}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border">
          <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"><span>Description</span><span>Amount</span></div>
          <div className="flex items-center justify-between px-4 py-3.5"><p className="text-sm font-medium capitalize text-foreground">{desc}</p><span className="font-medium text-foreground">{formatPKR(inv.amount)}</span></div>
        </div>

        <div className="mt-4 ml-auto max-w-xs space-y-2 text-sm">
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium text-foreground">{formatPKR(inv.amount)}</span></div>
          <div className="flex items-center justify-between border-t border-border pt-2"><span className="font-semibold text-foreground">Total paid</span><span className="font-heading text-lg font-semibold text-foreground">{formatPKR(inv.amount)}</span></div>
          <div className="flex justify-end pt-1"><StatusBadge status={inv.status} /></div>
        </div>

        <p className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">Thank you for subscribing to Wakeel360 Pakistan. This invoice was generated electronically and is valid without a signature.</p>
      </div>
    </div>
  );
}
