"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, Gavel, Search } from "lucide-react";

import { formatDate } from "@/lib/utils";
import type { LawyerHearingRow } from "@/lib/data/lawyer-hearings";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/dashboard/status-badge";

function bucket(row: LawyerHearingRow) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const hearing = new Date(`${row.date}T00:00:00`);
  const diff = hearing.getTime() - today.getTime();
  if (diff < 0) return "past";
  if (diff < 86_400_000) return "today";
  if (diff < 7 * 86_400_000) return "week";
  return "upcoming";
}

export function LawyerHearingsCalendar({ hearings }: { hearings: LawyerHearingRow[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return hearings.filter((h) => !q || `${h.caseTitle} ${h.clientName ?? ""} ${h.court ?? ""} ${h.purpose ?? ""}`.toLowerCase().includes(q));
  }, [hearings, query]);

  const groups = {
    today: filtered.filter((h) => bucket(h) === "today"),
    week: filtered.filter((h) => bucket(h) === "week" || bucket(h) === "today"),
    upcoming: filtered.filter((h) => bucket(h) === "upcoming" || bucket(h) === "week" || bucket(h) === "today"),
    past: filtered.filter((h) => bucket(h) === "past"),
  };

  return (
    <div className="space-y-5">
      <Card className="border-border/80 p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search case, client, court..." className="pl-9" />
        </div>
      </Card>

      <Tabs defaultValue="upcoming">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 rounded-xl border border-border bg-card p-1">
          <TabsTrigger value="today" className="rounded-lg">Today {groups.today.length}</TabsTrigger>
          <TabsTrigger value="week" className="rounded-lg">This week {groups.week.length}</TabsTrigger>
          <TabsTrigger value="upcoming" className="rounded-lg">Upcoming {groups.upcoming.length}</TabsTrigger>
          <TabsTrigger value="past" className="rounded-lg">Past {groups.past.length}</TabsTrigger>
        </TabsList>
        {Object.entries(groups).map(([key, rows]) => (
          <TabsContent key={key} value={key} className="mt-4">
            {rows.length === 0 ? (
              <Card className="flex flex-col items-center gap-2 border-dashed border-border/80 p-8 text-center">
                <CalendarClock className="h-8 w-8 text-muted-foreground/60" />
                <p className="text-sm font-medium text-foreground">No hearings in this view</p>
                <p className="text-sm text-muted-foreground">Add hearings from a case workspace to populate the schedule.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {rows.map((h) => (
                  <Card key={h.id} className="border-border/80 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link href={`/dashboard/lawyer/cases/${h.caseId}`} className="text-sm font-semibold text-foreground hover:underline">{h.caseTitle}</Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">{h.clientName ?? "Client"} - {formatDate(h.date)}{h.time ? ` at ${h.time.slice(0, 5)}` : ""}</p>
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground"><Gavel className="h-3.5 w-3.5 text-gold" /> {[h.purpose, h.court, h.judge].filter(Boolean).join(" - ") || "Hearing"}</p>
                        {h.outcome && <p className="mt-1 text-sm text-muted-foreground">{h.outcome}</p>}
                      </div>
                      <StatusBadge status={h.status} />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
