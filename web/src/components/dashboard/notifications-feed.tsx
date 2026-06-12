"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Bell, CalendarCheck, CreditCard, Gavel, MessageSquare, Settings, ShieldCheck, Clock,
  CheckCheck, Trash2, SlidersHorizontal, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, timeAgo } from "@/lib/utils";
import type { NotificationRow } from "@/lib/data/notifications";
import type { NotificationTypeEnum } from "@/lib/supabase/types";
import { markAllNotificationsRead, clearReadNotifications } from "@/app/actions/booking-actions";
import { OpenChatButton } from "@/components/dashboard/open-chat-button";

type Priority = "urgent" | "important" | "info";

const TYPE_META: Record<NotificationTypeEnum, { icon: LucideIcon; cls: string; label: string; priority: Priority }> = {
  booking: { icon: CalendarCheck, cls: "bg-gold/15 text-gold", label: "Booking", priority: "important" },
  case: { icon: Gavel, cls: "bg-primary/10 text-primary", label: "Case", priority: "info" },
  payment: { icon: CreditCard, cls: "bg-emerald-50 text-emerald-600", label: "Payment", priority: "important" },
  message: { icon: MessageSquare, cls: "bg-blue-50 text-blue-600", label: "Message", priority: "info" },
  hearing: { icon: Clock, cls: "bg-amber-50 text-amber-600", label: "Hearing", priority: "urgent" },
  verification: { icon: ShieldCheck, cls: "bg-primary/10 text-primary", label: "Verification", priority: "important" },
  system: { icon: Settings, cls: "bg-slate-100 text-slate-500", label: "System", priority: "info" },
};

const PRIORITY_BADGE: Record<Priority, string> = {
  urgent: "bg-rose-50 text-rose-600",
  important: "bg-amber-50 text-amber-700",
  info: "bg-slate-100 text-slate-500",
};

const easeOut = [0.22, 1, 0.36, 1] as const;

// Filters mapped to the real notification type enum. "subscription" alerts are
// delivered as system messages, so that filter targets the `system` type.
const FILTERS: { key: string; label: string; match: (t: NotificationTypeEnum) => boolean }[] = [
  { key: "all", label: "All", match: () => true },
  { key: "unread", label: "Unread", match: () => true },
  { key: "booking", label: "Bookings", match: (t) => t === "booking" },
  { key: "case", label: "Cases", match: (t) => t === "case" },
  { key: "payment", label: "Payments", match: (t) => t === "payment" },
  { key: "message", label: "Messages", match: (t) => t === "message" },
  { key: "hearing", label: "Hearings", match: (t) => t === "hearing" },
  { key: "verification", label: "Verification", match: (t) => t === "verification" },
  { key: "system", label: "System", match: (t) => t === "system" },
];

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function timeBucket(iso: string): string {
  const today = startOfDay(new Date());
  const day = startOfDay(new Date(iso));
  const diffDays = Math.round((today - day) / 86_400_000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "Earlier this week";
  if (diffDays <= 31) return "Earlier this month";
  return "Older";
}

const BUCKET_ORDER = ["Today", "Yesterday", "Earlier this week", "Earlier this month", "Older"];

export function NotificationsFeed({ notifications }: { notifications: NotificationRow[] }) {
  const router = useRouter();
  const reduce = !!useReducedMotion();
  const [marking, startMark] = useTransition();
  const [clearing, startClear] = useTransition();
  const [filter, setFilter] = useState<string>("all");

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const readCount = notifications.length - unreadCount;

  const summary = useMemo(() => {
    const by = (t: NotificationTypeEnum) => notifications.filter((n) => n.type === t).length;
    return {
      unread: unreadCount,
      booking: by("booking"),
      case: by("case"),
      payment: by("payment"),
      verification: by("verification"),
    };
  }, [notifications, unreadCount]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const f of FILTERS) {
      c[f.key] = f.key === "unread" ? unreadCount : notifications.filter((n) => f.match(n.type)).length;
    }
    return c;
  }, [notifications, unreadCount]);

  const filtered = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter((n) => !n.is_read);
    const f = FILTERS.find((x) => x.key === filter);
    return f ? notifications.filter((n) => f.match(n.type)) : notifications;
  }, [notifications, filter]);

  // Only show filters that have something (plus All & Unread always).
  const visibleFilters = FILTERS.filter((f) => f.key === "all" || f.key === "unread" || counts[f.key] > 0);

  const grouped = useMemo(() => {
    const map = new Map<string, NotificationRow[]>();
    for (const n of filtered) {
      const b = timeBucket(n.created_at);
      (map.get(b) ?? map.set(b, []).get(b)!).push(n);
    }
    return BUCKET_ORDER.filter((b) => map.has(b)).map((b) => ({ bucket: b, items: map.get(b)! }));
  }, [filtered]);

  function markAll() {
    startMark(async () => {
      const res = await markAllNotificationsRead();
      if (!res.ok) { toast.error("Could not update notifications", { description: res.error }); return; }
      router.refresh();
    });
  }

  function clearRead() {
    if (!window.confirm("Permanently delete all read notifications? This cannot be undone.")) return;
    startClear(async () => {
      const res = await clearReadNotifications();
      if (!res.ok) { toast.error("Could not clear notifications", { description: res.error }); return; }
      toast.success("Read notifications cleared");
      router.refresh();
    });
  }

  if (notifications.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
          <Bell className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="mt-4 font-heading text-base font-semibold text-slate-950">You&apos;re all caught up</h3>
        <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">No new notifications at the moment.</p>
        <Button asChild variant="outline" size="sm" className="mt-5 gap-1.5">
          <Link href="/dashboard/lawyer/settings"><SlidersHorizontal className="h-4 w-4" /> Notification preferences</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <SummaryCard icon={Bell} tone="navy" label="Unread" value={summary.unread} />
        <SummaryCard icon={CalendarCheck} tone="gold" label="Booking alerts" value={summary.booking} />
        <SummaryCard icon={Gavel} tone="navy" label="Case alerts" value={summary.case} />
        <SummaryCard icon={CreditCard} tone="emerald" label="Payment alerts" value={summary.payment} />
        <SummaryCard icon={ShieldCheck} tone="navy" label="Verification" value={summary.verification} />
      </div>

      {/* Top actions */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={markAll} disabled={marking || unreadCount === 0} className="gap-1.5">
          <CheckCheck className="h-4 w-4" /> Mark all read
        </Button>
        <Button variant="outline" size="sm" onClick={clearRead} disabled={clearing || readCount === 0} className="gap-1.5 text-slate-600">
          <Trash2 className="h-4 w-4" /> Clear read
        </Button>
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link href="/dashboard/lawyer/settings"><SlidersHorizontal className="h-4 w-4" /> Preferences</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {visibleFilters.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
              )}
            >
              {f.label}
              {counts[f.key] > 0 && (
                <span className={cn("inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold", active ? "bg-white/20 text-primary-foreground" : "bg-slate-100 text-slate-600")}>
                  {counts[f.key]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Grouped list */}
      {filtered.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm"><Bell className="h-5 w-5" /></span>
          <h3 className="mt-3 font-heading text-sm font-semibold text-slate-950">You&apos;re all caught up</h3>
          <p className="mt-1 text-sm text-slate-500">No notifications match this filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ bucket, items }) => (
            <div key={bucket}>
              <p className="mb-2.5 text-xs font-medium uppercase tracking-wide text-slate-400">{bucket}</p>
              <div className="space-y-2.5">
                <AnimatePresence mode="popLayout" initial={false}>
                  {items.map((n, i) => (
                    <motion.div
                      key={n.id}
                      layout
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.3, ease: easeOut, delay: reduce ? 0 : Math.min(i, 8) * 0.03 }}
                    >
                      <NotificationCard n={n} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationCard({ n }: { n: NotificationRow }) {
  const meta = TYPE_META[n.type] ?? TYPE_META.system;
  const Icon = meta.icon;
  const actions = renderActions(n);

  return (
    <Card className={cn("flex items-start gap-3.5 rounded-xl border-slate-200 p-4 ring-0 transition-colors", !n.is_read && "border-primary/30 bg-primary/[0.03]")}>
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", n.is_read ? "bg-slate-100 text-slate-400" : meta.cls)}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <p className="text-sm font-semibold text-slate-950">{n.title}</p>
          <span className="shrink-0 text-xs text-slate-400">{timeAgo(n.created_at)}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">{meta.label}</span>
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium capitalize", PRIORITY_BADGE[meta.priority])}>{meta.priority}</span>
          {!n.is_read && <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">New</span>}
        </div>
        {n.body && <p className="mt-1.5 text-sm leading-6 text-slate-600">{n.body}</p>}
        {actions.length > 0 && <div className="mt-2.5 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </Card>
  );
}

/** Contextual quick actions, only when a destination is genuinely supported. */
function renderActions(n: NotificationRow): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const entityId = n.related_entity_id ?? undefined;
  const isBookingEntity = n.related_entity_type === "booking" && entityId;

  switch (n.type) {
    case "booking":
      out.push(<ActionLink key="b" href="/dashboard/lawyer/bookings" label="View booking" />);
      if (isBookingEntity) {
        out.push(<OpenChatButton key="m" bookingId={entityId!} basePath="/dashboard/lawyer/messages" label="Message client" />);
      }
      break;
    case "case":
      out.push(<ActionLink key="c" href={entityId ? `/dashboard/lawyer/cases/${entityId}` : "/dashboard/lawyer/cases"} label="Open case" />);
      break;
    case "payment":
      out.push(<ActionLink key="p" href="/dashboard/lawyer/payments" label="View payment" />);
      break;
    case "hearing":
      out.push(<ActionLink key="h" href="/dashboard/lawyer/hearings" label="View hearings" />);
      break;
    case "message":
      out.push(<ActionLink key="msg" href="/dashboard/lawyer/messages" label="Open messages" />);
      break;
    case "verification":
      out.push(<ActionLink key="v" href="/dashboard/lawyer/profile" label="View profile" />);
      break;
    case "system":
      out.push(<ActionLink key="s" href="/dashboard/lawyer/billing" label="Manage subscription" />);
      break;
  }
  return out;
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild size="sm" variant="outline" className="gap-1.5">
      <Link href={href}>{label} <ArrowRight className="h-3.5 w-3.5" /></Link>
    </Button>
  );
}

type Tone = "navy" | "gold" | "emerald";
const TONES: Record<Tone, string> = {
  navy: "bg-primary/8 text-primary",
  gold: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

function SummaryCard({ icon: Icon, tone, label, value }: { icon: LucideIcon; tone: Tone; label: string; value: number }) {
  return (
    <Card className="rounded-xl border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 ring-0">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", TONES[tone])}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
    </Card>
  );
}
