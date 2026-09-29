"use client";

import { useMemo, useState } from "react";

import { Search } from "lucide-react";

import type { AdminCase } from "@/lib/data/admin";

import { caseStatusLabel } from "@/lib/constants";
import { cn, formatDate, timeAgo } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";

const FILTERS: {
  key: string;
  label: string;
  match: (status: string) => boolean;
}[] = [
  { key: "all", label: "All", match: () => true },
  {
    key: "active",
    label: "Active",
    match: (status) =>
      status === "active" ||
      status === "in_progress" ||
      status === "pending",
  },
  {
    key: "adjourned",
    label: "Adjourned",
    match: (status) => status === "adjourned",
  },
  {
    key: "won",
    label: "Won",
    match: (status) => status === "won",
  },
  {
    key: "lost",
    label: "Lost",
    match: (status) => status === "lost",
  },
  {
    key: "closed",
    label: "Closed",
    match: (status) => status === "closed",
  },
  {
    key: "archived",
    label: "Archived",
    match: (status) => status === "archived",
  },
];

export function AdminCasesTable({
  cases,
}: {
  cases: AdminCase[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const counts = useMemo(() => {
    const result: Record<string, number> = {};

    for (const item of FILTERS) {
      result[item.key] = cases.filter((caseItem) =>
        item.match(caseItem.status),
      ).length;
    }

    return result;
  }, [cases]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    const activeFilter =
      FILTERS.find((item) => item.key === filter) ?? FILTERS[0];

    return cases
      .filter((caseItem) => activeFilter.match(caseItem.status))
      .filter((caseItem) => {
        if (!term) return true;

        return [
          caseItem.title,
          caseItem.clientName,
          caseItem.lawyerName,
          caseItem.court,
          caseItem.caseNumber,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      });
  }, [cases, query, filter]);

  const visibleFilters = FILTERS.filter(
    (item) =>
      item.key === "all" ||
      item.key === "active" ||
      counts[item.key] > 0,
  );

  return (
    <div className="space-y-2.5">
      <div className="flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm shadow-slate-200/20 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
          {visibleFilters.map((item) => {
            const active = filter === item.key;

            return (
              <button
                key={item.key}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(item.key)}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {item.label}

                <span
                  className={cn(
                    "text-[10px]",
                    active
                      ? "text-primary-foreground/70"
                      : "text-slate-400",
                  )}
                >
                  {counts[item.key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            aria-hidden
          />

          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search case, client, lawyer..."
            aria-label="Search cases"
            className="h-8 border-slate-200 bg-slate-50 pl-9 text-xs shadow-none focus-visible:bg-white"
          />
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200 p-0 shadow-sm shadow-slate-200/20 ring-0">
        {filtered.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-medium text-slate-700">
              No cases found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try adjusting your search or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 bg-slate-50/60 hover:bg-slate-50/60">
                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Case
                  </TableHead>

                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Client
                  </TableHead>

                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Lawyer
                  </TableHead>

                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Court
                  </TableHead>

                  <TableHead className="h-10 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Next hearing
                  </TableHead>

                  <TableHead className="h-10 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Last activity
                  </TableHead>

                  <TableHead className="h-10 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((caseItem) => (
                  <TableRow
                    key={caseItem.id}
                    className="border-slate-100 hover:bg-slate-50/60"
                  >
                    <TableCell className="py-3">
                      <p className="max-w-[220px] truncate text-sm font-medium text-slate-950">
                        {caseItem.title}
                      </p>

                      {caseItem.caseNumber && (
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {caseItem.caseNumber}
                        </p>
                      )}
                    </TableCell>

                    <TableCell className="py-3 text-xs text-slate-600">
                      {caseItem.clientName ?? "-"}
                    </TableCell>

                    <TableCell className="py-3 text-xs text-slate-600">
                      {caseItem.lawyerName}
                    </TableCell>

                    <TableCell className="max-w-[180px] truncate py-3 text-xs text-slate-600">
                      {caseItem.court ?? "-"}
                    </TableCell>

                    <TableCell className="whitespace-nowrap py-3 text-xs text-slate-600">
                      {caseItem.nextHearing
                        ? formatDate(caseItem.nextHearing)
                        : "-"}
                    </TableCell>

                    <TableCell className="whitespace-nowrap py-3 text-xs text-slate-500">
                      {timeAgo(caseItem.updatedAt)}
                    </TableCell>

                    <TableCell className="py-3 text-right">
                      <StatusBadge
                        status={caseStatusLabel(caseItem.status)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] text-slate-400">
          Showing{" "}
          <span className="font-medium text-slate-500">
            {filtered.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-500">
            {cases.length}
          </span>{" "}
          cases
        </p>
      </div>
    </div>
  );
}