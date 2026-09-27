"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import type { AdminCase } from "@/lib/data/admin";
import { caseStatusLabel } from "@/lib/constants";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";

const FILTERS: { key: string; label: string; match: (s: string) => boolean }[] = [
  { key: "all", label: "All", match: () => true },
  { key: "active", label: "Active", match: (s) => s === "active" || s === "in_progress" || s === "pending" },
  { key: "adjourned", label: "Adjourned", match: (s) => s === "adjourned" },
  { key: "won", label: "Won", match: (s) => s === "won" },
  { key: "lost", label: "Lost", match: (s) => s === "lost" },
  { key: "closed", label: "Closed", match: (s) => s === "closed" },
  { key: "archived", label: "Archived", match: (s) => s === "archived" },
];

export function AdminCasesTable({ cases }: { cases: AdminCase[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const f of FILTERS) c[f.key] = cases.filter((x) => f.match(x.status)).length;
    return c; 
  }, [cases]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const f = FILTERS.find((x) => x.key === filter) ?? FILTERS[0];
    return cases
      .filter((c) => f.match(c.status))
      .filter((c) => !term ? true : [c.title, c.clientName, c.lawyerName, c.court, c.caseNumber].filter(Boolean).join(" ").toLowerCase().includes(term));
  }, [cases, query, filter]);

  const visible = FILTERS.filter((f) => f.key === "all" || f.key === "active" || counts[f.key] > 0);

  return (
    <div className="space-y-4">
      <div className="relative w-full lg:max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search case, client, lawyer, court..." aria-label="Search cases" className="h-10 rounded-xl border-slate-200 pl-10 text-sm placeholder:text-slate-400 hover:border-slate-300" />
      </div>

      <div className="flex flex-wrap gap-2">
        {visible.map((f) => {
          const active = filter === f.key;
          return (
            <button key={f.key} type="button" aria-pressed={active} onClick={() => setFilter(f.key)} className={cn("inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors", active ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950")}>
              {f.label}
              {counts[f.key] > 0 && <span className={cn("inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold", active ? "bg-white/20 text-primary-foreground" : "bg-slate-100 text-slate-600")}>{counts[f.key]}</span>}
            </button>
          );
        })}
      </div>

      <Card className="overflow-hidden border-slate-200 p-0 ring-0">
        {filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">No cases match your filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Lawyer</TableHead>
                  <TableHead>Court</TableHead>
                  <TableHead>Next hearing</TableHead>
                  <TableHead>Last activity</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <p className="font-medium text-slate-950">{c.title}</p>
                      {c.caseNumber && <p className="text-xs text-slate-500">{c.caseNumber}</p>}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{c.clientName ?? "-"}</TableCell>
                    <TableCell className="text-sm text-slate-600">{c.lawyerName}</TableCell>
                    <TableCell className="text-sm text-slate-600">{c.court ?? "-"}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-slate-600">{c.nextHearing ? formatDate(c.nextHearing) : "-"}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-slate-500">{timeAgo(c.updatedAt)}</TableCell>
                    <TableCell className="text-right"><StatusBadge status={caseStatusLabel(c.status)} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
      <p className="text-xs text-slate-400">Showing {filtered.length} of {cases.length} cases.</p>
    </div>
  );
}
