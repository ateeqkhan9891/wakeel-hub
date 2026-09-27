import type { Metadata } from "next";
import { Receipt, TrendingUp, CreditCard, RotateCcw } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { AdminStat, AdminSection } from "@/components/dashboard/admin/admin-ui";
import { AdminCommission } from "@/components/dashboard/admin/admin-commission";
import { getAdminCommissionOverview, getCommissionSettings } from "@/lib/data/commission";
import { getAdminStats, getAdminPayments } from "@/lib/data/admin";
import { formatDate, formatPKR } from "@/lib/utils";

export const metadata: Metadata = { title: "Payments & Commission" };

export default async function AdminPaymentsPage() {
  const [overview, settings, stats, payments] = await Promise.all([
    getAdminCommissionOverview(200),
    getCommissionSettings(),
    getAdminStats(),
    getAdminPayments(50),
  ]);

  const refunds = payments.filter((p) => p.status === "refunded").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">Payments &amp; Commission</h1>
        <p className="mt-1 text-sm text-slate-500">Track revenue, transactions, platform commission, lawyer payouts, and gateway fees.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AdminStat icon={Receipt} tone="emerald" label="Total revenue" value={formatPKR(stats.totalRevenue)} helper="All collected payments" />
        <AdminStat icon={TrendingUp} tone="navy" label="This month" value={formatPKR(stats.monthlyRevenue)} helper="Collected this month" />
        <AdminStat icon={RotateCcw} tone="slate" label="Refunds" value={refunds} helper="Recent refunded payments" />
        <AdminStat icon={CreditCard} tone="rose" label="Failed payments" value={stats.failedPayments} helper="Across all transactions" />
      </div>

      <AdminSection title="Recent transactions" icon={Receipt}>
        {payments.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-sm text-slate-500">No transactions recorded yet.</p>
        ) : (
          <div className="-mx-5 overflow-x-auto px-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Lawyer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs text-slate-600">{p.reference}</TableCell>
                    <TableCell className="text-sm text-slate-600">{p.clientName}</TableCell>
                    <TableCell className="text-sm text-slate-600">{p.lawyerName}</TableCell>
                    <TableCell className="text-sm capitalize text-slate-600">{p.type}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-slate-500">{formatDate(p.date)}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm font-medium text-slate-900">{formatPKR(p.paid || p.total)}</TableCell>
                    <TableCell className="text-right"><StatusBadge status={p.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </AdminSection>

      <div>
        <h2 className="mb-4 font-heading text-base font-semibold text-slate-950">Commission &amp; payouts</h2>
        <AdminCommission overview={overview} settings={settings} />
      </div>
    </div>
  );
}
