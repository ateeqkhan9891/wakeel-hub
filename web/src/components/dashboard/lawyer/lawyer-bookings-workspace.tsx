"use client";

import { useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";

import type { LawyerBookingRecord, LawyerBookingStatus } from "@/lib/lawyer-dashboard-data";
import { formatPKR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { DashboardCard, EmptyState, TableScroll, subduedButtonClass } from "@/components/dashboard/lawyer/lawyer-dashboard-ui";

const BOOKING_TABS: { label: string; value: "all" | LawyerBookingStatus }[] = [
  { label: "All", value: "all" },
  { label: "New requests", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Rejected", value: "rejected" },
  { label: "Rescheduled", value: "rescheduled" },
];

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Date ascending", value: "date-asc" },
  { label: "Date descending", value: "date-desc" },
  { label: "Fee high to low", value: "fee-desc" },
  { label: "Fee low to high", value: "fee-asc" },
] as const;

export function LawyerBookingsWorkspace({ bookings }: { bookings: LawyerBookingRecord[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof BOOKING_TABS)[number]["value"]>("all");
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]["value"]>("newest");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return bookings
      .filter((booking) => filter === "all" || booking.status === filter)
      .filter((booking) =>
        !term
          ? true
          : [booking.clientName, booking.issueType, booking.issueSummary, booking.mode]
              .join(" ")
              .toLowerCase()
              .includes(term)
      )
      .toSorted((a, b) => {
        if (sort === "fee-desc") return b.fee - a.fee;
        if (sort === "fee-asc") return a.fee - b.fee;
        if (sort === "oldest" || sort === "date-asc") return a.date.localeCompare(b.date);
        return b.date.localeCompare(a.date);
      });
  }, [bookings, filter, query, sort]);

  return (
    <DashboardCard title="Consultation bookings" description="Only bookings linked to your lawyer account will appear here.">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bookings..." className="h-10 rounded-lg border-slate-200 pl-9" />
        </div>
        <Select value={sort} onValueChange={(value) => setSort(value as typeof sort)}>
          <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white lg:w-52">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {BOOKING_TABS.map((tab) => (
          <Button
            key={tab.value}
            type="button"
            variant={filter === tab.value ? "default" : "outline"}
            className={filter === tab.value ? "rounded-lg bg-slate-950 text-white hover:bg-slate-800" : subduedButtonClass}
            onClick={() => setFilter(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No consultation bookings yet"
          description="Complete your profile to start receiving requests."
          actionLabel="Complete profile"
        />
      ) : (
        <TableScroll>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Matter</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <button className="font-medium text-blue-700 hover:underline">{booking.clientName}</button>
                  </TableCell>
                  <TableCell className="text-slate-600">{booking.issueType}</TableCell>
                  <TableCell className="text-slate-600">{booking.date} {booking.time}</TableCell>
                  <TableCell className="text-slate-600">{booking.mode}</TableCell>
                  <TableCell className="font-medium text-slate-950">{formatPKR(booking.fee)}</TableCell>
                  <TableCell><StatusBadge status={booking.paymentStatus} /></TableCell>
                  <TableCell><StatusBadge status={booking.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableScroll>
      )}
    </DashboardCard>
  );
}
