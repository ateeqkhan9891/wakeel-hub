"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  Search,
  CalendarCheck,
  Clock,
  Phone,
  Video,
  MapPin,
  Loader2,
  CheckCheck,
  FolderPlus,
  Inbox,
  CircleCheck,
  CircleX,
  Eye,
  Wallet,
  CalendarRange,
  Settings2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatDate, formatPKR, initials, cn } from "@/lib/utils";
import { MODE_LABEL, type BookingRow } from "@/lib/data/booking-types";
import type { ConsultationModeEnum, BookingStatusEnum } from "@/lib/supabase/types";
import { respondToBooking, completeBooking } from "@/app/actions/booking-actions";
import { createCaseFromBooking } from "@/app/actions/case-actions";
import { OpenChatButton } from "@/components/dashboard/open-chat-button";

const MODE_ICON: Record<ConsultationModeEnum, LucideIcon> = {
  online: Video,
  phone: Phone,
  in_person: MapPin,
};

const TABS: { label: string; value: "all" | BookingStatusEnum }[] = [
  { label: "All", value: "all" },
  { label: "New requests", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Declined", value: "rejected" },
];

type SummaryTone = "navy" | "emerald" | "gold" | "slate";

const SUMMARY: {
  label: string;
  helper: string;
  status: BookingStatusEnum;
  icon: LucideIcon;
  tone: SummaryTone;
}[] = [
  { label: "New requests", helper: "Awaiting your response", status: "pending", icon: Inbox, tone: "gold" },
  { label: "Confirmed sessions", helper: "Scheduled & upcoming", status: "confirmed", icon: CalendarCheck, tone: "emerald" },
  { label: "Completed consultations", helper: "Ready to convert to cases", status: "completed", icon: CircleCheck, tone: "navy" },
  { label: "Declined requests", helper: "Not proceeding", status: "rejected", icon: CircleX, tone: "slate" },
];

const TONE_STYLES: Record<SummaryTone, string> = {
  navy: "bg-primary/8 text-primary",
  emerald: "bg-emerald-50 text-emerald-600",
  gold: "bg-amber-50 text-amber-600",
  slate: "bg-slate-100 text-slate-500",
};

function formatTime(value: string) {
  const [h, m] = value.split(":");
  const hour = Number(h);
  if (Number.isNaN(hour)) return value.slice(0, 5);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m ?? "00"} ${period}`;
}

function Meta({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-sm text-slate-600">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
      <span className="truncate">{children}</span>
    </span>
  );
}

export function LawyerBookingsLive({ bookings }: { bookings: BookingRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | BookingStatusEnum>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [detail, setDetail] = useState<BookingRow | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return bookings
      .filter((b) => tab === "all" || b.status === tab)
      .filter((b) =>
        !term
          ? true
          : [b.client_name, b.practice_area_name, b.issue_summary, b.client_city]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(term)
      );
  }, [bookings, tab, query]);

  function runAction(
    id: string,
    fn: () => Promise<{ ok: boolean; error?: string; requireAuth?: boolean }>,
    success: string
  ) {
    setPendingId(id);
    startTransition(async () => {
      const res = await fn();
      setPendingId(null);
      if (!res.ok) {
        if (res.requireAuth) {
          router.push("/login");
          return;
        }
        toast.error("Action failed", { description: res.error });
        return;
      }
      toast.success(success);
      setDetail(null);
      router.refresh();
    });
  }

  function createCase(id: string) {
    setPendingId(id);
    startTransition(async () => {
      const res = await createCaseFromBooking(id);
      setPendingId(null);
      if (!res.ok) {
        toast.error("Could not create case", { description: res.error });
        return;
      }
      toast.success("Case created from consultation", {
        description: "Client name, phone, type and notes were auto-filled.",
      });
      if (res.id) router.push(`/dashboard/lawyer/cases/${res.id}`);
    });
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: bookings.length };
    for (const b of bookings) c[b.status] = (c[b.status] ?? 0) + 1;
    return c;
  }, [bookings]);

  function renderActions(b: BookingRow, context: "card" | "drawer") {
    const busy = pendingId === b.id && isPending;
    const showResponse = b.status === "pending";
    const showComplete = b.status === "confirmed";
    const showCreateCase = b.status === "confirmed" || b.status === "completed";
    const showMessage = b.status === "pending" || b.status === "confirmed" || b.status === "completed";

    return (
      <>
        {context === "card" && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="gap-1.5 text-slate-600 hover:text-slate-950"
            onClick={() => setDetail(b)}
          >
            <Eye className="h-4 w-4" />
            View details
          </Button>
        )}
        {showMessage && (
          <OpenChatButton bookingId={b.id} basePath="/dashboard/lawyer/messages" label="Message client" />
        )}
        {showResponse && (
          <>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => runAction(b.id, () => respondToBooking(b.id, "reject"), "Booking declined - client notified")}
              className="gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
              Decline
            </Button>
            <Button
              size="sm"
              disabled={busy}
              onClick={() => runAction(b.id, () => respondToBooking(b.id, "accept"), "Booking accepted - client notified")}
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Accept
            </Button>
          </>
        )}
        {showComplete && (
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => runAction(b.id, () => completeBooking(b.id), "Marked as completed")}
            className="gap-1.5"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
            Mark completed
          </Button>
        )}
        {showCreateCase && (
          <Button
            size="sm"
            disabled={busy}
            onClick={() => createCase(b.id)}
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderPlus className="h-4 w-4" />}
            Create case from consultation
          </Button>
        )}
      </>
    );
  }

  const hasActions = (b: BookingRow) =>
    b.status === "pending" || b.status === "confirmed" || b.status === "completed";

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {SUMMARY.map((s) => (
          <Card
            key={s.status}
            className="rounded-xl border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 ring-0"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
              <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", TONE_STYLES[s.tone])}>
                <s.icon className="h-4 w-4" aria-hidden />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{counts[s.status] ?? 0}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{s.helper}</p>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full lg:max-w-lg">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by client, matter, or city..."
          aria-label="Search bookings"
          className="h-11 rounded-xl border-slate-200 pl-10 text-sm shadow-sm shadow-slate-200/40 placeholder:text-slate-400 hover:border-slate-300"
        />
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = tab === t.value;
          return (
            <button
              key={t.value}
              type="button"
              aria-pressed={active}
              onClick={() => setTab(t.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
              )}
            >
              {t.label}
              {counts[t.value] ? (
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                    active ? "bg-white/20 text-primary-foreground" : "bg-slate-100 text-slate-600"
                  )}
                >
                  {counts[t.value]}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Bookings list */}
      {filtered.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
            <CalendarRange className="h-6 w-6" aria-hidden />
          </span>
          <h3 className="mt-4 font-heading text-base font-semibold text-slate-950">No bookings found</h3>
          <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
            Client consultation requests will appear here when they match this status.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-5 gap-1.5 rounded-lg border-slate-200 bg-white">
            <Link href="/dashboard/lawyer/profile">
              <Settings2 className="h-4 w-4" />
              Update availability &amp; fees
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const ModeIcon = MODE_ICON[b.mode];
            const showPayment = b.payment_status && b.payment_status !== "pending";
            return (
              <Card
                key={b.id}
                className="overflow-hidden rounded-xl border-slate-200 bg-white p-0 shadow-sm shadow-slate-200/40 ring-0 transition-all hover:border-slate-300 hover:shadow-md"
              >
                <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]">
                  {/* Left - client & matter */}
                  <div className="flex min-w-0 items-start gap-3.5">
                    <Avatar size="lg" className="shrink-0">
                      <AvatarFallback className="bg-primary/8 text-sm font-semibold text-primary">
                        {b.client_name ? initials(b.client_name) : "CL"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-[0.95rem] font-semibold text-slate-950">{b.client_name ?? "Client"}</p>
                      <p className="mt-0.5 truncate text-sm text-slate-500">
                        {[b.practice_area_name, b.client_city].filter(Boolean).join(" - ") || "Consultation request"}
                      </p>
                      {b.issue_summary && (
                        <p className="mt-2 line-clamp-2 max-w-prose text-sm leading-6 text-slate-600">
                          &ldquo;{b.issue_summary}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Middle - schedule & contact */}
                  <div className="flex flex-col gap-2 lg:border-l lg:border-slate-100 lg:pl-5">
                    {b.scheduled_date && <Meta icon={CalendarCheck}>{formatDate(b.scheduled_date)}</Meta>}
                    {b.scheduled_time && <Meta icon={Clock}>{formatTime(b.scheduled_time)}</Meta>}
                    <Meta icon={ModeIcon}>{MODE_LABEL[b.mode]}</Meta>
                    {b.client_phone && <Meta icon={Phone}>{b.client_phone}</Meta>}
                  </div>

                  {/* Right - status & fee */}
                  <div className="flex flex-row items-center justify-between gap-2 lg:flex-col lg:items-end lg:justify-start lg:text-right">
                    <StatusBadge status={b.status} />
                    <div className="lg:mt-2">
                      <p className="text-base font-semibold text-slate-950">{formatPKR(b.fee_amount)}</p>
                      {showPayment ? (
                        <div className="mt-1 flex items-center gap-1.5 lg:justify-end">
                          <Wallet className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                          <StatusBadge status={b.payment_status} className="px-2 py-0 text-[0.7rem]" />
                        </div>
                      ) : (
                        <p className="mt-0.5 text-xs text-slate-400">Consultation fee</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action row */}
                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3">
                  {renderActions(b, "card")}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail drawer */}
      <Sheet open={detail !== null} onOpenChange={(open) => !open && setDetail(null)}>
        <SheetContent className="w-full gap-0 sm:max-w-md">
          {detail && (
            <>
              <SheetHeader className="border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Avatar size="lg" className="shrink-0">
                    <AvatarFallback className="bg-primary/8 text-sm font-semibold text-primary">
                      {detail.client_name ? initials(detail.client_name) : "CL"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <SheetTitle className="truncate text-base">{detail.client_name ?? "Client"}</SheetTitle>
                    <SheetDescription className="truncate">
                      {[detail.practice_area_name, detail.client_city].filter(Boolean).join(" - ") ||
                        "Consultation request"}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
                <div className="flex items-center justify-between">
                  <StatusBadge status={detail.status} />
                  <div className="text-right">
                    <p className="text-base font-semibold text-slate-950">{formatPKR(detail.fee_amount)}</p>
                    <p className="text-xs text-slate-400">Consultation fee</p>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
                  <DetailRow label="Date">
                    {detail.scheduled_date ? formatDate(detail.scheduled_date) : "Not scheduled"}
                  </DetailRow>
                  <DetailRow label="Time">
                    {detail.scheduled_time ? formatTime(detail.scheduled_time) : "-"}
                  </DetailRow>
                  <DetailRow label="Consultation type">{MODE_LABEL[detail.mode]}</DetailRow>
                  <DetailRow label="Phone">{detail.client_phone ?? "-"}</DetailRow>
                  <DetailRow label="Practice area">{detail.practice_area_name ?? "-"}</DetailRow>
                  <DetailRow label="Location">{detail.client_city ?? "-"}</DetailRow>
                  <DetailRow label="Payment status">
                    <StatusBadge status={detail.payment_status} className="px-2 py-0 text-[0.7rem]" />
                  </DetailRow>
                  <DetailRow label="Requested on">{formatDate(detail.created_at)}</DetailRow>
                </dl>

                {detail.issue_summary && (
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Matter summary</dt>
                    <p className="mt-1.5 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                      {detail.issue_summary}
                    </p>
                  </div>
                )}

                {detail.cancellation_reason && (
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Cancellation reason</dt>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600">{detail.cancellation_reason}</p>
                  </div>
                )}
              </div>

              {hasActions(detail) && (
                <SheetFooter className="flex-row flex-wrap justify-end gap-2 border-t border-slate-100">
                  {renderActions(detail, "drawer")}
                </SheetFooter>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 truncate text-sm font-medium text-slate-900">{children}</dd>
    </div>
  );
}
