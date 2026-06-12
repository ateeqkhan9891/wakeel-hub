"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Percent, Wallet, Banknote, Loader2, Search, SlidersHorizontal, FileDown, CheckSquare } from "lucide-react";
import { toast } from "sonner";

import { formatDate, formatPKR } from "@/lib/utils";
import type { AdminCommissionOverview, CommissionSettings } from "@/lib/data/commission";
import { bulkUpdatePayoutStatus, updatePayoutStatus, updateCommissionSettings } from "@/app/actions/payment-actions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/dashboard/stat-card";

const PAYOUT_STATUSES = ["pending", "processing", "paid", "failed", "cancelled"];

export function AdminCommission({ overview, settings }: { overview: AdminCommissionOverview; settings: CommissionSettings }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const [commission, setCommission] = useState(String(settings.commissionPercentage));
  const [gateway, setGateway] = useState(String(settings.gatewayFeePercentage));

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const rows = useMemo(() => {
    return overview.rows.filter((r) => {
      if (status !== "all" && r.payoutStatus !== status) return false;
      if (q) {
        const hay = `${r.lawyerName ?? ""} ${r.clientName ?? ""} ${r.reference} ${r.receiptNumber}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      const d = (r.paidAt ?? r.createdAt).slice(0, 10);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }, [overview.rows, q, status, from, to]);

  const visibleIds = rows.map((row) => row.id);
  const selectedVisible = selected.filter((id) => visibleIds.includes(id));
  const allVisibleSelected = visibleIds.length > 0 && selectedVisible.length === visibleIds.length;

  function saveSettings() {
    start(async () => {
      const res = await updateCommissionSettings(Number(commission), Number(gateway));
      if (!res.ok) { toast.error("Could not save", { description: res.error }); return; }
      toast.success("Commission settings updated");
      router.refresh();
    });
  }

  function setPayout(id: string, value: string) {
    start(async () => {
      const res = await updatePayoutStatus(id, value);
      if (!res.ok) { toast.error("Could not update payout", { description: res.error }); return; }
      toast.success(`Payout marked ${value}`);
      router.refresh();
    });
  }

  function bulkSetPayout(value: string) {
    start(async () => {
      const res = await bulkUpdatePayoutStatus(selectedVisible, value);
      if (!res.ok) { toast.error("Could not update payouts", { description: res.error }); return; }
      toast.success(`${selectedVisible.length} payout${selectedVisible.length === 1 ? "" : "s"} marked ${value}`);
      setSelected([]);
      router.refresh();
    });
  }

  function toggleAllVisible(checked: boolean) {
    setSelected((current) => {
      const currentSet = new Set(current);
      for (const id of visibleIds) {
        if (checked) currentSet.add(id);
        else currentSet.delete(id);
      }
      return [...currentSet];
    });
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((current) => {
      const currentSet = new Set(current);
      if (checked) currentSet.add(id);
      else currentSet.delete(id);
      return [...currentSet];
    });
  }

  function exportCsv() {
    const header = ["Date", "Client", "Lawyer", "Gross", "Commission", "Lawyer net", "Gateway fee", "Payment status", "Payout status", "Reference", "Receipt"];
    const csvRows = rows.map((r) => [
      formatDate(r.paidAt ?? r.createdAt),
      r.clientName ?? "Client",
      r.lawyerName ?? "",
      r.gross,
      r.commissionAmount,
      r.lawyerNet,
      r.gatewayFee,
      r.paymentStatus,
      r.payoutStatus,
      r.reference,
      r.receiptNumber,
    ]);
    const escape = (value: unknown) => `"${String(value).replaceAll("\"", "\"\"")}"`;
    const csv = [header, ...csvRows].map((row) => row.map(escape).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `wakeelhub-payouts-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={TrendingUp} label="Total gross payments" value={formatPKR(overview.totalGross)} accent="gold" />
        <StatCard icon={Percent} label="Platform commission" value={formatPKR(overview.totalCommission)} />
        <StatCard icon={Wallet} label="Lawyer payable" value={formatPKR(overview.totalLawyerPayable)} />
        <StatCard icon={Banknote} label="Gateway fees" value={formatPKR(overview.totalGatewayFees)} />
      </div>

      <Card className="border-border/80 p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 text-primary"><SlidersHorizontal className="h-4.5 w-4.5" /></span>
          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground">Commission settings</h3>
            <p className="text-xs text-muted-foreground">Applied to every new consultation payment. Pro-plan lawyers are charged 0%.</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Platform commission (%)</Label>
            <Input type="number" min={0} max={100} value={commission} onChange={(e) => setCommission(e.target.value)} className="h-10 w-40" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Gateway fee (%)</Label>
            <Input type="number" min={0} max={100} value={gateway} onChange={(e) => setGateway(e.target.value)} className="h-10 w-40" />
          </div>
          <Button onClick={saveSettings} disabled={pending} className="h-10 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            {pending && <Loader2 className="h-4 w-4 animate-spin" />} Save settings
          </Button>
          <p className="text-xs text-muted-foreground">Currency: <span className="font-medium text-foreground">{settings.currency}</span></p>
        </div>
      </Card>

      <Card className="border-border/80 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search lawyer, client, ref..." value={q} onChange={(e) => setQ(e.target.value)} className="h-10 pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10"><SelectValue placeholder="Payout status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payouts</SelectItem>
              {PAYOUT_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-10" aria-label="From date" />
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-10" aria-label="To date" />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <p className="text-xs text-muted-foreground">{selectedVisible.length} selected in current view</p>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={exportCsv} className="gap-1.5">
              <FileDown className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => bulkSetPayout("processing")} disabled={pending || selectedVisible.length === 0} className="gap-1.5">
              {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckSquare className="h-3.5 w-3.5" />} Mark processing
            </Button>
            <Button type="button" size="sm" onClick={() => bulkSetPayout("paid")} disabled={pending || selectedVisible.length === 0} className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckSquare className="h-3.5 w-3.5" />} Mark paid
            </Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-border/80 p-0">
        <div className="border-b border-border px-5 py-3">
          <h3 className="font-heading text-sm font-semibold text-foreground">Payments & payouts</h3>
          <p className="text-xs text-muted-foreground">{rows.length} of {overview.rows.length} records</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allVisibleSelected} onCheckedChange={(v) => toggleAllVisible(v === true)} aria-label="Select visible payouts" />
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Lawyer</TableHead>
                <TableHead className="text-right">Gross</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Lawyer net</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Payout</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">No payments match your filters.</TableCell></TableRow>
              ) : rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Checkbox checked={selected.includes(r.id)} onCheckedChange={(v) => toggleOne(r.id, v === true)} aria-label={`Select payout ${r.receiptNumber}`} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(r.paidAt ?? r.createdAt)}</TableCell>
                  <TableCell className="font-medium text-foreground">{r.clientName ?? "Client"}</TableCell>
                  <TableCell className="text-muted-foreground">{r.lawyerName ?? "-"}</TableCell>
                  <TableCell className="text-right text-foreground">{formatPKR(r.gross)}</TableCell>
                  <TableCell className="text-right text-emerald-600">{formatPKR(r.commissionAmount)} <span className="text-[11px] text-muted-foreground">({r.commissionPct}%)</span></TableCell>
                  <TableCell className="text-right text-foreground">{formatPKR(r.lawyerNet)}</TableCell>
                  <TableCell><span className="text-xs font-medium capitalize text-muted-foreground">{r.paymentStatus}</span></TableCell>
                  <TableCell>
                    <Select value={r.payoutStatus} onValueChange={(v) => setPayout(r.id, v)} disabled={pending}>
                      <SelectTrigger className="h-8 w-[130px] text-xs capitalize"><SelectValue /></SelectTrigger>
                      <SelectContent>{PAYOUT_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
