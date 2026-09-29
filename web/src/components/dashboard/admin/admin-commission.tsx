"use client";

import { useMemo, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import {
  Banknote,
  CheckSquare,
  FileDown,
  Loader2,
  Percent,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { toast } from "sonner";

import { formatDate, formatPKR } from "@/lib/utils";

import type {
  AdminCommissionOverview,
  CommissionSettings,
} from "@/lib/data/commission";

import {
  bulkUpdatePayoutStatus,
  updateCommissionSettings,
  updatePayoutStatus,
} from "@/app/actions/payment-actions";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAYOUT_STATUSES = [
  "pending",
  "processing",
  "paid",
  "failed",
  "cancelled",
];

export function AdminCommission({
  overview,
  settings,
}: {
  overview: AdminCommissionOverview;
  settings: CommissionSettings;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const [commission, setCommission] = useState(
    String(settings.commissionPercentage),
  );

  const [gateway, setGateway] = useState(
    String(settings.gatewayFeePercentage),
  );

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const rows = useMemo(() => {
    return overview.rows.filter((row) => {
      if (status !== "all" && row.payoutStatus !== status) {
        return false;
      }

      if (q) {
        const haystack =
          `${row.lawyerName ?? ""} ${row.clientName ?? ""} ${row.reference} ${row.receiptNumber}`.toLowerCase();

        if (!haystack.includes(q.toLowerCase())) {
          return false;
        }
      }

      const date = (row.paidAt ?? row.createdAt).slice(0, 10);

      if (from && date < from) {
        return false;
      }

      if (to && date > to) {
        return false;
      }

      return true;
    });
  }, [overview.rows, q, status, from, to]);

  const visibleIds = rows.map((row) => row.id);

  const selectedVisible = selected.filter((id) => visibleIds.includes(id));

  const allVisibleSelected =
    visibleIds.length > 0 &&
    selectedVisible.length === visibleIds.length;

  function saveSettings() {
    start(async () => {
      const result = await updateCommissionSettings(
        Number(commission),
        Number(gateway),
      );

      if (!result.ok) {
        toast.error("Could not save", {
          description: result.error,
        });
        return;
      }

      toast.success("Commission settings updated");
      router.refresh();
    });
  }

  function setPayout(id: string, value: string) {
    start(async () => {
      const result = await updatePayoutStatus(id, value);

      if (!result.ok) {
        toast.error("Could not update payout", {
          description: result.error,
        });
        return;
      }

      toast.success(`Payout marked ${value}`);
      router.refresh();
    });
  }

  function bulkSetPayout(value: string) {
    start(async () => {
      const result = await bulkUpdatePayoutStatus(
        selectedVisible,
        value,
      );

      if (!result.ok) {
        toast.error("Could not update payouts", {
          description: result.error,
        });
        return;
      }

      toast.success(
        `${selectedVisible.length} payout${
          selectedVisible.length === 1 ? "" : "s"
        } marked ${value}`,
      );

      setSelected([]);
      router.refresh();
    });
  }

  function toggleAllVisible(checked: boolean) {
    setSelected((current) => {
      const currentSet = new Set(current);

      for (const id of visibleIds) {
        if (checked) {
          currentSet.add(id);
        } else {
          currentSet.delete(id);
        }
      }

      return [...currentSet];
    });
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((current) => {
      const currentSet = new Set(current);

      if (checked) {
        currentSet.add(id);
      } else {
        currentSet.delete(id);
      }

      return [...currentSet];
    });
  }

  function exportCsv() {
    const header = [
      "Date",
      "Client",
      "Lawyer",
      "Gross",
      "Commission",
      "Lawyer net",
      "Gateway fee",
      "Payment status",
      "Payout status",
      "Reference",
      "Receipt",
    ];

    const csvRows = rows.map((row) => [
      formatDate(row.paidAt ?? row.createdAt),
      row.clientName ?? "Client",
      row.lawyerName ?? "",
      row.gross,
      row.commissionAmount,
      row.lawyerNet,
      row.gatewayFee,
      row.paymentStatus,
      row.payoutStatus,
      row.reference,
      row.receiptNumber,
    ]);

    const escape = (value: unknown) =>
      `"${String(value).replaceAll('"', '""')}"`;

    const csv = [header, ...csvRows]
      .map((row) => row.map(escape).join(","))
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], {
        type: "text/csv;charset=utf-8",
      }),
    );

    const link = document.createElement("a");

    link.href = url;
    link.download = `Wakeel360-payouts-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <CommissionStat
          icon={TrendingUp}
          label="Total gross"
          value={formatPKR(overview.totalGross)}
          tone="gold"
        />

        <CommissionStat
          icon={Percent}
          label="Platform commission"
          value={formatPKR(overview.totalCommission)}
        />

        <CommissionStat
          icon={Wallet}
          label="Lawyer payable"
          value={formatPKR(overview.totalLawyerPayable)}
        />

        <CommissionStat
          icon={Banknote}
          label="Gateway fees"
          value={formatPKR(overview.totalGatewayFees)}
          tone="slate"
        />
      </div>

      <Card className="border-slate-200 p-0 shadow-sm shadow-slate-200/20">
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3 sm:px-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8 text-primary">
            <SlidersHorizontal
              className="h-3.5 w-3.5"
              aria-hidden
            />
          </span>

          <div>
            <h3 className="text-sm font-semibold text-slate-950">
              Commission settings
            </h3>

            <p className="mt-0.5 text-[11px] text-slate-400">
              Applied to new consultation payments. Pro-plan lawyers are
              charged 0%.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-end sm:px-5">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-slate-500">
              Platform commission (%)
            </Label>

            <Input
              type="number"
              min={0}
              max={100}
              value={commission}
              onChange={(event) => setCommission(event.target.value)}
              className="h-8 w-full text-xs sm:w-36"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-slate-500">
              Gateway fee (%)
            </Label>

            <Input
              type="number"
              min={0}
              max={100}
              value={gateway}
              onChange={(event) => setGateway(event.target.value)}
              className="h-8 w-full text-xs sm:w-36"
            />
          </div>

          <Button
            onClick={saveSettings}
            disabled={pending}
            className="h-8 gap-2 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {pending && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}
            Save settings
          </Button>

          <div className="flex h-8 items-center px-1 text-[11px] text-slate-400">
            Currency:
            <span className="ml-1 font-medium text-slate-700">
              {settings.currency}
            </span>
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 p-0 shadow-sm shadow-slate-200/20">
        <div className="flex flex-col gap-2.5 p-2.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex">
            <div className="relative sm:col-span-2 lg:w-64">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                aria-hidden
              />

              <Input
                placeholder="Search lawyer, client, ref..."
                value={q}
                onChange={(event) => setQ(event.target.value)}
                className="h-8 border-slate-200 bg-slate-50 pl-9 text-xs shadow-none focus-visible:bg-white"
              />
            </div>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 text-xs lg:w-36">
                <SelectValue placeholder="Payout status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All payouts</SelectItem>

                {PAYOUT_STATUSES.map((value) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="capitalize"
                  >
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="h-8 text-xs lg:w-36"
              aria-label="From date"
            />

            <Input
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="h-8 text-xs lg:w-36"
              aria-label="To date"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 lg:justify-end">
            <p className="text-[11px] text-slate-400">
              <span className="font-medium text-slate-600">
                {selectedVisible.length}
              </span>{" "}
              selected
            </p>

            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={exportCsv}
                className="h-8 gap-1.5 px-2.5 text-xs"
              >
                <FileDown className="h-3.5 w-3.5" />
                Export CSV
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => bulkSetPayout("processing")}
                disabled={pending || selectedVisible.length === 0}
                className="h-8 gap-1.5 px-2.5 text-xs"
              >
                {pending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckSquare className="h-3.5 w-3.5" />
                )}
                Mark processing
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={() => bulkSetPayout("paid")}
                disabled={pending || selectedVisible.length === 0}
                className="h-8 gap-1.5 bg-primary px-2.5 text-xs text-primary-foreground hover:bg-primary/90"
              >
                {pending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckSquare className="h-3.5 w-3.5" />
                )}
                Mark paid
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-slate-200 p-0 shadow-sm shadow-slate-200/20">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-950">
              Payments &amp; payouts
            </h3>

            <p className="mt-0.5 text-[11px] text-slate-400">
              {rows.length} of {overview.rows.length} records
            </p>
          </div>

          {selectedVisible.length > 0 && (
            <span className="rounded-md bg-primary/8 px-2 py-1 text-[10px] font-medium text-primary">
              {selectedVisible.length} selected
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50/60 hover:bg-slate-50/60">
                <TableHead className="h-9 w-10">
                  <Checkbox
                    checked={allVisibleSelected}
                    onCheckedChange={(value) =>
                      toggleAllVisible(value === true)
                    }
                    aria-label="Select visible payouts"
                  />
                </TableHead>

                <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Date
                </TableHead>

                <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Client
                </TableHead>

                <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Lawyer
                </TableHead>

                <TableHead className="h-9 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Gross
                </TableHead>

                <TableHead className="h-9 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Commission
                </TableHead>

                <TableHead className="h-9 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Lawyer net
                </TableHead>

                <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Payment
                </TableHead>

                <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Payout
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-10 text-center text-xs text-slate-400"
                  >
                    No payments match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-slate-100 hover:bg-slate-50/60"
                  >
                    <TableCell className="py-2.5">
                      <Checkbox
                        checked={selected.includes(row.id)}
                        onCheckedChange={(value) =>
                          toggleOne(row.id, value === true)
                        }
                        aria-label={`Select payout ${row.receiptNumber}`}
                      />
                    </TableCell>

                    <TableCell className="whitespace-nowrap py-2.5 text-xs text-slate-500">
                      {formatDate(row.paidAt ?? row.createdAt)}
                    </TableCell>

                    <TableCell className="py-2.5 text-xs font-medium text-slate-900">
                      {row.clientName ?? "Client"}
                    </TableCell>

                    <TableCell className="py-2.5 text-xs text-slate-500">
                      {row.lawyerName ?? "-"}
                    </TableCell>

                    <TableCell className="whitespace-nowrap py-2.5 text-right text-xs text-slate-900">
                      {formatPKR(row.gross)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap py-2.5 text-right text-xs text-emerald-600">
                      {formatPKR(row.commissionAmount)}{" "}
                      <span className="text-[10px] text-slate-400">
                        ({row.commissionPct}%)
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap py-2.5 text-right text-xs text-slate-900">
                      {formatPKR(row.lawyerNet)}
                    </TableCell>

                    <TableCell className="py-2.5">
                      <span className="text-[11px] font-medium capitalize text-slate-500">
                        {row.paymentStatus}
                      </span>
                    </TableCell>

                    <TableCell className="py-2.5">
                      <Select
                        value={row.payoutStatus}
                        onValueChange={(value) =>
                          setPayout(row.id, value)
                        }
                        disabled={pending}
                      >
                        <SelectTrigger className="h-7 w-[118px] text-[11px] capitalize">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          {PAYOUT_STATUSES.map((value) => (
                            <SelectItem
                              key={value}
                              value={value}
                              className="capitalize"
                            >
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

function CommissionStat({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  tone?: "primary" | "gold" | "slate";
}) {
  const iconClass =
    tone === "gold"
      ? "bg-amber-50 text-amber-600"
      : tone === "slate"
        ? "bg-slate-100 text-slate-500"
        : "bg-primary/8 text-primary";

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm shadow-slate-200/20">
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </span>

        <div className="min-w-0">
          <p className="truncate text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">
            {label}
          </p>

          <p className="mt-0.5 truncate text-sm font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}