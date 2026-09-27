import type { Metadata } from "next";
import { CreditCard, CheckCircle2, XCircle, RefreshCw, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { AdminStat } from "@/components/dashboard/admin/admin-ui";
import { getAdminSubscriptions } from "@/lib/data/admin";
import { formatDate, formatPKR } from "@/lib/utils";

export const metadata: Metadata = { title: "Subscriptions" };

function planLabel(plan: string | null) {
  if (!plan) return "-";
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

export default async function AdminSubscriptionsPage() {
  const { rows, stats } = await getAdminSubscriptions(300);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">Subscriptions</h1>
        <p className="mt-1 text-sm text-slate-500">Advocate subscription health and recurring revenue - the core of WakeelHub&apos;s business.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <AdminStat icon={CheckCircle2} tone="emerald" label="Active" value={stats.active} helper="Currently subscribed" />
        <AdminStat icon={XCircle} tone="rose" label="Expired" value={stats.expired} helper="Past renewal date" />
        <AdminStat icon={RefreshCw} tone="navy" label="Renewals this month" value={stats.renewalsThisMonth} helper="Paid this month" />
        <AdminStat icon={CreditCard} tone="slate" label="Cancelled" value={stats.cancelled} helper="Opted out" />
        <AdminStat icon={TrendingUp} tone="gold" label="MRR" value={formatPKR(stats.mrr)} helper="Monthly recurring" />
      </div>

      <Card className="overflow-hidden border-slate-200 p-0 ring-0">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400"><CreditCard className="h-5 w-5" /></span>
            <p className="mt-1 text-sm font-semibold text-slate-950">No subscriptions yet</p>
            <p className="text-sm text-slate-500">Advocate subscriptions will appear here once lawyers upgrade to a paid plan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Advocate</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Renews / expires</TableHead>
                  <TableHead className="text-right">Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((s) => (
                  <TableRow key={s.lawyerId}>
                    <TableCell className="font-medium text-slate-950">{s.lawyerName}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-primary/8 px-2 py-0.5 text-xs font-medium capitalize text-primary">{planLabel(s.plan)}</span>
                      {s.period && <span className="ml-1.5 text-xs text-slate-400">{s.period}</span>}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-slate-900">{s.amount > 0 ? formatPKR(s.amount) : "-"}</TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-slate-500">{s.startedAt ? formatDate(s.startedAt) : "-"}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-slate-600">
                      {s.expiresAt ? formatDate(s.expiresAt) : "-"}
                      {s.daysRemaining !== null && !s.expired && <span className="ml-1.5 text-xs text-slate-400">({s.daysRemaining}d)</span>}
                    </TableCell>
                    <TableCell className="text-right"><StatusBadge status={s.paymentStatus} className="px-2 py-0 text-[10px]" /></TableCell>
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
