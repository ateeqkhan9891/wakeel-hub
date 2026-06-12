import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight, ArrowRight, CalendarCheck, Clock, Bell, Search, Briefcase,
  MessageSquare, Wallet, Gavel, Scale, CreditCard, ShieldCheck, Settings, Video, Phone, MapPin,
  AlertCircle, FileText, ChevronRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { OpenChatButton } from "@/components/dashboard/open-chat-button";
import { requireUser } from "@/lib/supabase/guard";
import { getClientBookings, MODE_LABEL } from "@/lib/data/bookings";
import { getClientCases } from "@/lib/data/client-cases";
import { getMyConversations } from "@/lib/data/messages";
import { getClientPayments } from "@/lib/data/client-payments";
import { getMyNotifications } from "@/lib/data/notifications";
import type { NotificationRow } from "@/lib/data/notifications";
import type { NotificationTypeEnum, ConsultationModeEnum } from "@/lib/supabase/types";
import { cn, formatDate, formatPKR, timeAgo, initials } from "@/lib/utils";

export const metadata: Metadata = { title: "Client Dashboard" };

const CLOSED_CASE = new Set(["closed", "won", "lost", "archived"]);

const MODE_ICON: Record<ConsultationModeEnum, LucideIcon> = { online: Video, phone: Phone, in_person: MapPin };

const ACTIVITY_ICON: Record<NotificationTypeEnum, { icon: LucideIcon; cls: string }> = {
  booking: { icon: CalendarCheck, cls: "bg-gold/15 text-gold" },
  case: { icon: Gavel, cls: "bg-primary/10 text-primary" },
  payment: { icon: CreditCard, cls: "bg-emerald-50 text-emerald-600" },
  message: { icon: MessageSquare, cls: "bg-blue-50 text-blue-600" },
  hearing: { icon: Clock, cls: "bg-amber-50 text-amber-600" },
  verification: { icon: ShieldCheck, cls: "bg-primary/10 text-primary" },
  system: { icon: Settings, cls: "bg-slate-100 text-slate-500" },
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function activityBucket(iso: string): string {
  const diff = Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / 86_400_000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff <= 7) return "Earlier this week";
  return "Earlier";
}
const BUCKET_ORDER = ["Today", "Yesterday", "Earlier this week", "Earlier"];

export default async function ClientDashboardPage() {
  const [profile, bookings, cases, conversations, payments, notifications] = await Promise.all([
    requireUser("client"),
    getClientBookings(),
    getClientCases(),
    getMyConversations(),
    getClientPayments(),
    getMyNotifications(),
  ]);

  const firstName = (profile.full_name || "there").split(" ")[0];
  const today = startOfDay(new Date());

  const activeCases = cases.filter((c) => !CLOSED_CASE.has(c.status));
  const upcomingConsultations = bookings
    .filter((b) => b.status === "confirmed" || b.status === "pending")
    .sort((a, b) => (a.scheduled_date ?? "9999").localeCompare(b.scheduled_date ?? "9999"));
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const unreadConversations = conversations.filter((c) => c.unreadCount > 0);
  const pendingPayments = payments.filter((p) => p.remaining > 0 || p.status === "pending");
  const pendingTotal = pendingPayments.reduce((sum, p) => sum + (p.remaining || 0), 0);
  const totalPaid = payments.reduce((sum, p) => sum + (p.paid || 0), 0);
  const upcomingHearings = cases.filter((c) => c.nextHearing && startOfDay(new Date(c.nextHearing)) >= today);

  // ---- Attention required (only real, actionable items) ----
  const tasks: { icon: LucideIcon; title: string; desc: string; href: string; cta: string; tone: string }[] = [];
  if (pendingPayments.length > 0) {
    tasks.push({ icon: Wallet, title: "Complete a payment", desc: `${pendingPayments.length} payment${pendingPayments.length === 1 ? "" : "s"} totalling ${formatPKR(pendingTotal)} outstanding.`, href: "/dashboard/client/payments", cta: "View payments", tone: "amber" });
  }
  if (unreadMessages > 0) {
    tasks.push({ icon: MessageSquare, title: "Respond to your lawyer", desc: `You have ${unreadMessages} unread message${unreadMessages === 1 ? "" : "s"}.`, href: "/dashboard/client/messages", cta: "Open messages", tone: "blue" });
  }
  if (activeCases.length === 0 && bookings.length === 0) {
    tasks.push({ icon: Search, title: "Schedule your first consultation", desc: "Find a verified advocate and book a consultation to get started.", href: "/find-lawyers", cta: "Find a lawyer", tone: "primary" });
  }

  const recentBookings = bookings.slice(0, 4);
  const recentActivity = notifications.slice(0, 7);
  const groupedActivity = BUCKET_ORDER
    .map((bucket) => ({ bucket, items: recentActivity.filter((n) => activityBucket(n.created_at) === bucket) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      {/* ---- HERO ---- */}
      <Card className="border-slate-200 p-6 ring-0">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-slate-500">Welcome back,</p>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">{firstName}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
              <HeroStat icon={Briefcase} label="Active cases" value={activeCases.length} />
              <span className="hidden h-4 w-px bg-slate-200 sm:block" aria-hidden />
              <HeroStat icon={CalendarCheck} label="Upcoming consultations" value={upcomingConsultations.length} />
              <span className="hidden h-4 w-px bg-slate-200 sm:block" aria-hidden />
              <HeroStat icon={MessageSquare} label="Unread messages" value={unreadMessages} />
            </div>
          </div>
          <Button asChild className="shrink-0 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/find-lawyers"><Search className="h-4 w-4" /> Find a lawyer</Link>
          </Button>
        </div>
      </Card>

      {/* ---- SUMMARY CARDS ---- */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <SummaryCard icon={Briefcase} tone="navy" label="Active cases" value={activeCases.length} />
        <SummaryCard icon={CalendarCheck} tone="gold" label="Bookings" value={bookings.length} />
        <SummaryCard icon={MessageSquare} tone="navy" label="Unread messages" value={unreadMessages} />
        <SummaryCard icon={Wallet} tone="emerald" label="Pending payments" value={pendingPayments.length} />
        <SummaryCard icon={Clock} tone="navy" label="Upcoming hearings" value={upcomingHearings.length} />
      </div>

      {/* ---- ATTENTION REQUIRED ---- */}
      {tasks.length > 0 && (
        <Card className="border-slate-200 p-5 ring-0">
          <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-slate-950">
            <AlertCircle className="h-4 w-4 text-amber-500" /> Attention required
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {tasks.map((t) => (
              <Link key={t.title} href={t.href} className="group flex items-start gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50">
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", TASK_TONES[t.tone] ?? TASK_TONES.primary)}><t.icon className="h-4.5 w-4.5" /></span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-950">{t.title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-500">{t.desc}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary">{t.cta} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" /></span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* ---- MAIN GRID ---- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* LEFT */}
        <div className="space-y-6">
          {/* Active cases */}
          <SectionCard title="Active cases" icon={Scale} viewAllHref={cases.length > 0 ? "/dashboard/client/cases" : undefined}>
            {activeCases.length === 0 ? (
              <Empty icon={Scale} title="No active cases yet" text="When an advocate takes on your matter, your case will appear here." cta={{ href: "/find-lawyers", label: "Find a lawyer" }} />
            ) : (
              <div className="space-y-3">
                {activeCases.slice(0, 3).map((c) => (
                  <div key={c.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">{c.title}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">{[c.lawyerName, c.caseType, c.court].filter(Boolean).join(" - ") || "Case file"}</p>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1.5"><CalendarCheck className="h-3.5 w-3.5 text-slate-400" /> {c.nextHearing ? `Next hearing ${formatDate(c.nextHearing)}` : "No hearing scheduled"}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-slate-400" /> Updated {timeAgo(c.updatedAt)}</span>
                      <Button asChild size="sm" variant="outline" className="ml-auto gap-1.5">
                        <Link href={`/dashboard/client/cases/${c.id}`}>View case <ChevronRight className="h-3.5 w-3.5" /></Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Upcoming consultations */}
          <SectionCard title="Upcoming consultations" icon={CalendarCheck} viewAllHref={bookings.length > 0 ? "/dashboard/client/bookings" : undefined}>
            {upcomingConsultations.length === 0 ? (
              <Empty icon={CalendarCheck} title="No upcoming consultations" text="Book a consultation with a verified advocate to get started." cta={{ href: "/find-lawyers", label: "Find a lawyer" }} />
            ) : (
              <div className="space-y-3">
                {upcomingConsultations.slice(0, 3).map((b) => {
                  const ModeIcon = MODE_ICON[b.mode];
                  return (
                    <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="h-10 w-10 shrink-0"><AvatarFallback className="bg-primary/8 text-xs font-semibold text-primary">{b.lawyer_name ? initials(b.lawyer_name) : "AD"}</AvatarFallback></Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-950">{b.lawyer_name ?? "Advocate"}</p>
                          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                            {b.practice_area_name && <span>{b.practice_area_name}</span>}
                            <span className="flex items-center gap-1"><ModeIcon className="h-3 w-3" /> {MODE_LABEL[b.mode]}</span>
                            {b.scheduled_date && <span className="flex items-center gap-1"><CalendarCheck className="h-3 w-3" /> {formatDate(b.scheduled_date)}{b.scheduled_time ? `, ${b.scheduled_time.slice(0, 5)}` : ""}</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={b.status} />
                        <Button asChild size="sm" variant="outline"><Link href="/dashboard/client/bookings">View</Link></Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* Recent bookings */}
          <SectionCard title="Recent bookings" icon={CalendarCheck} viewAllHref={bookings.length > 0 ? "/dashboard/client/bookings" : undefined}>
            {recentBookings.length === 0 ? (
              <Empty icon={CalendarCheck} title="No bookings yet" text="Browse verified advocates and book your first consultation." cta={{ href: "/find-lawyers", label: "Find a lawyer" }} />
            ) : (
              <div className="space-y-3">
                {recentBookings.map((b) => {
                  const ModeIcon = MODE_ICON[b.mode];
                  return (
                    <div key={b.id} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar className="h-10 w-10 shrink-0"><AvatarFallback className="bg-primary/8 text-xs font-semibold text-primary">{b.lawyer_name ? initials(b.lawyer_name) : "AD"}</AvatarFallback></Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-950">{b.lawyer_name ?? "Advocate"}</p>
                            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                              {b.practice_area_name && <span>{b.practice_area_name}</span>}
                              <span className="flex items-center gap-1"><ModeIcon className="h-3 w-3" /> {MODE_LABEL[b.mode]}</span>
                              {b.scheduled_date && <span>{formatDate(b.scheduled_date)}</span>}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <StatusBadge status={b.status} />
                          <span className="text-sm font-semibold text-slate-900">{formatPKR(b.fee_amount)}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-3">
                        <Button asChild size="sm" variant="ghost" className="gap-1.5 text-slate-600 hover:text-slate-950"><Link href="/dashboard/client/bookings"><FileText className="h-4 w-4" /> View details</Link></Button>
                        <OpenChatButton bookingId={b.id} basePath="/dashboard/client/messages" label="Message lawyer" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* Messages preview */}
          <SectionCard title="Messages" icon={MessageSquare} viewAllHref={conversations.length > 0 ? "/dashboard/client/messages" : undefined}>
            {conversations.length === 0 ? (
              <Empty icon={MessageSquare} title="No messages yet" text="Message your advocate once you've booked a consultation." />
            ) : (
              <div className="space-y-2.5">
                {(unreadConversations.length > 0 ? unreadConversations : conversations).slice(0, 4).map((c) => (
                  <Link key={c.id} href={`/dashboard/client/messages?c=${c.id}`} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-slate-300 hover:bg-slate-50">
                    <Avatar className="h-9 w-9 shrink-0">
                      {c.otherPhoto && <AvatarImage src={c.otherPhoto} alt={c.otherName} />}
                      <AvatarFallback className="bg-primary/8 text-xs font-semibold text-primary">{initials(c.otherName)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-slate-950">{c.otherName}</p>
                        {c.lastMessageAt && <span className="shrink-0 text-[11px] text-slate-400">{timeAgo(c.lastMessageAt)}</span>}
                      </div>
                      <p className="truncate text-xs text-slate-500">{c.lastMessage ?? "No messages yet"}</p>
                    </div>
                    {c.unreadCount > 0 && <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">{c.unreadCount}</span>}
                  </Link>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Payments snapshot */}
          <SectionCard title="Payments" icon={Wallet} viewAllHref={payments.length > 0 ? "/dashboard/client/payments" : undefined}>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Total paid</p>
                <p className="mt-1 font-heading text-lg font-semibold text-emerald-600">{formatPKR(totalPaid)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Pending</p>
                <p className="mt-1 font-heading text-lg font-semibold text-slate-950">{formatPKR(pendingTotal)}</p>
              </div>
            </div>
            {payments.length === 0 ? (
              <p className="mt-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-3 py-3 text-center text-xs text-slate-500">No payments recorded yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Recent transactions</p>
                {payments.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium capitalize text-slate-900">{p.type}</p>
                      <p className="text-[11px] text-slate-400">{formatDate(p.date)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900">{formatPKR(p.total)}</span>
                      <StatusBadge status={p.status} className="px-2 py-0 text-[10px]" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Recent activity */}
          <SectionCard title="Recent activity" icon={Bell} viewAllHref={notifications.length > 0 ? "/dashboard/client/notifications" : undefined}>
            {recentActivity.length === 0 ? (
              <Empty icon={Bell} title="You're all caught up" text="Updates about your cases and consultations will appear here." />
            ) : (
              <div className="space-y-4">
                {groupedActivity.map(({ bucket, items }) => (
                  <div key={bucket}>
                    <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">{bucket}</p>
                    <div className="space-y-2.5">
                      {items.map((n) => <ActivityRow key={n.id} n={n} />)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

// ---- helpers --------------------------------------------------------------
function HeroStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <span className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-gold" aria-hidden />
      <span className="font-semibold text-slate-900">{value}</span>
      <span className="text-slate-500">{label}</span>
    </span>
  );
}

type Tone = "navy" | "gold" | "emerald";
const TONES: Record<Tone, string> = {
  navy: "bg-primary/8 text-primary",
  gold: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

const TASK_TONES: Record<string, string> = {
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-blue-50 text-blue-600",
  primary: "bg-primary/8 text-primary",
};

function SummaryCard({ icon: Icon, tone, label, value }: { icon: LucideIcon; tone: Tone; label: string; value: number }) {
  return (
    <Card className="rounded-xl border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 ring-0">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", TONES[tone])}><Icon className="h-4 w-4" aria-hidden /></span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
    </Card>
  );
}

function SectionCard({ title, icon: Icon, viewAllHref, children }: { title: string; icon: LucideIcon; viewAllHref?: string; children: React.ReactNode }) {
  return (
    <Card className="border-slate-200 p-5 ring-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-slate-950"><Icon className="h-4 w-4 text-gold" /> {title}</h2>
        {viewAllHref && (
          <Button variant="ghost" size="sm" asChild className="h-8 gap-1 text-primary hover:text-primary">
            <Link href={viewAllHref}>View all <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </Button>
        )}
      </div>
      {children}
    </Card>
  );
}

function Empty({ icon: Icon, title, text, cta }: { icon: LucideIcon; title: string; text: string; cta?: { href: string; label: string } }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm"><Icon className="h-5 w-5" aria-hidden /></span>
      <h3 className="mt-3 text-sm font-semibold text-slate-950">{title}</h3>
      <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">{text}</p>
      {cta && (
        <Button asChild size="sm" variant="outline" className="mt-4">
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
      )}
    </div>
  );
}

function ActivityRow({ n }: { n: NotificationRow }) {
  const meta = ACTIVITY_ICON[n.type] ?? ACTIVITY_ICON.system;
  const Icon = meta.icon;
  return (
    <div className="flex items-start gap-3">
      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", meta.cls)}><Icon className="h-4 w-4" /></span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900">{n.title}</p>
        {n.body && <p className="truncate text-xs text-slate-500">{n.body}</p>}
        <p className="mt-0.5 text-[11px] text-slate-400">{timeAgo(n.created_at)}</p>
      </div>
    </div>
  );
}
