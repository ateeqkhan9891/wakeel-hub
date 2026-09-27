import type { Metadata } from "next";
import Link from "next/link";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Briefcase,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  CircleCheck,
  Clock,
  CreditCard,
  Eye,
  FileText,
  Gavel,
  MessageSquare,
  MousePointerClick,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { LawyerOverviewRequests } from "@/components/dashboard/lawyer/lawyer-overview-requests";
import { getLawyerBookings } from "@/lib/data/bookings";
import { getLawyerCases } from "@/lib/data/cases";
import { getLawyerEarnings } from "@/lib/data/commission";
import { getLawyerHearings } from "@/lib/data/lawyer-hearings";
import { getMyConversations } from "@/lib/data/messages";
import { getMyLawyerProfile } from "@/lib/data/lawyer-profile";
import { getLawyerSubscription } from "@/lib/data/lawyer-subscription";
import { createClient } from "@/lib/supabase/server";
import { cn, formatDate, formatPKR } from "@/lib/utils";

export const metadata: Metadata = { title: "Lawyer Dashboard" };

const ACTIVE_CASE_STATUSES = new Set(["pending", "active", "in_progress", "adjourned"]);

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function completionItems(profile: Awaited<ReturnType<typeof getMyLawyerProfile>>) {
  const p = profile;
  return [
    {
      label: "Basic profile completed",
      done: Boolean(p?.name && p.city && p.professionalTitle && p.about),
      helper: "Name, city, title and biography",
    },
    {
      label: "CNIC / Bar verification uploaded",
      done: p?.verificationStatus === "approved" || p?.verificationStatus === "pending",
      helper: p?.verificationStatus === "approved" ? "Approved by WakeelHub" : "Submit verification documents",
    },
    {
      label: "Practice areas selected",
      done: Boolean(p?.practiceAreas.length),
      helper: `${p?.practiceAreas.length ?? 0} selected`,
    },
    {
      label: "Consultation fee added",
      done: Number(p?.onlineConsultationFee ?? 0) > 0,
      helper: Number(p?.onlineConsultationFee ?? 0) > 0 ? formatPKR(Number(p?.onlineConsultationFee ?? 0)) : "Add online consultation fee",
    },
    {
      label: "Availability configured",
      done: Boolean(p?.availabilityDays.length || p?.availabilityHours),
      helper: p?.availabilityDays.length ? `${p.availabilityDays.length} available days` : "Add available days and hours",
    },
    {
      label: "Profile photo uploaded",
      done: Boolean(p?.photoUrl),
      helper: p?.photoUrl ? "Photo visible on profile" : "Add a professional headshot",
    },
  ];
}

function profileStrength(items: { done: boolean }[]) {
  if (items.length === 0) return 0;
  return Math.round((items.filter((item) => item.done).length / items.length) * 100);
}

function sameMonth(value: string | null | undefined, now = new Date()) {
  if (!value) return false;
  const date = new Date(value);
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

function formatTime(value: string | null) {
  return value ? value.slice(0, 5) : "Time not set";
}

function CardShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Card className={cn("rounded-2xl border-slate-200 bg-white shadow-sm shadow-slate-200/60 sm:rounded-3xl", className)}>{children}</Card>;
}

function SectionHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h2 className="font-heading text-base font-semibold text-slate-950">{title}</h2>
        {description && <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {action && <div className="w-full shrink-0 sm:w-auto">{action}</div>}
    </div>
  );
}

function PremiumEmpty({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-5 text-center sm:min-h-44 sm:p-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 font-heading text-sm font-semibold text-slate-950">{title}</p>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
  tone: "navy" | "emerald" | "gold" | "slate";
}) {
  const toneClass = {
    navy: "bg-slate-950 text-white",
    emerald: "bg-emerald-50 text-emerald-700",
    gold: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
  }[tone];

  return (
    <CardShell className="min-h-[136px] p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70 sm:min-h-0 sm:p-4">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase leading-4 tracking-wide text-slate-500 sm:text-xs">{label}</p>
          <p className="mt-2 break-words font-heading text-xl font-semibold leading-tight tracking-tight text-slate-950 sm:mt-3 sm:text-2xl">{value}</p>
        </div>
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl", toneClass)}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
      </div>
      <p className="mt-2 text-[11px] leading-5 text-slate-500 sm:text-xs">{helper}</p>
    </CardShell>
  );
}

function VisibilityMetric({ icon: Icon, label, value, helper }: { icon: LucideIcon; label: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Icon className="h-4 w-4 text-amber-600" />
        {label}
      </div>
      <p className="mt-3 font-heading text-lg font-semibold text-slate-950 sm:text-xl">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
    </div>
  );
}

function SubscriptionLabel({ plan }: { plan: string | null | undefined }) {
  if (plan === "pro") return "WakeelHub Pro";
  if (plan === "commission") return "Pay-as-you-go";
  return "No active plan";
}

export default async function LawyerDashboardPage() {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [bookings, cases, hearings, conversations, earnings, subscription, profile, lawyerRow] = await Promise.all([
    getLawyerBookings(),
    getLawyerCases(),
    getLawyerHearings(),
    getMyConversations(),
    getLawyerEarnings(),
    getLawyerSubscription(),
    getMyLawyerProfile(),
    user
      ? supabase
          .from("lawyers")
          .select("slug, is_verified, subscription_status, subscription_plan")
          .eq("id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const lawyer = (lawyerRow.data ?? {}) as { slug?: string; is_verified?: boolean; subscription_status?: string; subscription_plan?: string | null };
  const pendingRequests = bookings.filter((booking) => booking.status === "pending");
  const activeCases = cases.filter((caseFile) => ACTIVE_CASE_STATUSES.has(caseFile.status));
  const now = new Date();
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);
  const today = dateKey(now);
  const tomorrow = dateKey(tomorrowDate);
  const upcomingHearings = hearings.filter((hearing) => hearing.date >= today && hearing.status !== "cancelled").slice(0, 4);
  const tomorrowHearings = hearings.filter((hearing) => hearing.date === tomorrow && hearing.status !== "cancelled");
  const unreadMessages = conversations.reduce((sum, thread) => sum + thread.unreadCount, 0);
  const monthlyRevenue = (earnings?.rows ?? []).filter((row) => sameMonth(row.paidAt ?? row.createdAt)).reduce((sum, row) => sum + row.lawyerNet, 0);
  const pendingPaymentBookings = bookings.filter((booking) => booking.status === "confirmed" && booking.payment_status !== "paid" && Number(booking.fee_amount ?? 0) > 0);
  const completedThisMonth = bookings.filter((booking) => booking.status === "completed" && sameMonth(booking.created_at)).length;
  const conversionRate = bookings.length ? Math.round((bookings.filter((booking) => booking.status === "confirmed" || booking.status === "completed").length / bookings.length) * 100) : null;
  const checklist = completionItems(profile);
  const strength = profileStrength(checklist);
  const isVerified = lawyer.is_verified === true || profile?.verificationStatus === "approved";
  const isSubscribed = (subscription?.status ?? lawyer.subscription_status) === "active";
  const publicProfileHref = lawyer.slug ? `/lawyers/${lawyer.slug}` : "/dashboard/lawyer/profile";
  const displayName = profile?.name || "Advocate";

  const attentionItems = [
    ...tomorrowHearings.slice(0, 2).map((hearing) => ({
      icon: CalendarClock,
      title: "Hearing tomorrow",
      detail: `${hearing.caseTitle} - ${hearing.court ?? "Court not set"}`,
      href: `/dashboard/lawyer/cases/${hearing.caseId}`,
    })),
    ...conversations
      .filter((thread) => thread.unreadCount > 0)
      .slice(0, 2)
      .map((thread) => ({
        icon: MessageSquare,
        title: "Client awaiting reply",
        detail: `${thread.otherName} sent ${thread.unreadCount} unread ${thread.unreadCount === 1 ? "message" : "messages"}`,
        href: "/dashboard/lawyer/messages",
      })),
    ...pendingPaymentBookings.slice(0, 2).map((booking) => ({
      icon: CreditCard,
      title: "Payment pending",
      detail: `${booking.client_name ?? "Client"} - ${formatPKR(Number(booking.fee_amount ?? 0))}`,
      href: "/dashboard/lawyer/bookings",
    })),
  ];

  return (
    <div className="space-y-4 text-slate-950 sm:space-y-6">
      <section className="overflow-hidden rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-300/40 sm:rounded-[2rem]">
        <div className="relative p-4 sm:p-7 lg:p-8">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.28),transparent_38%),radial-gradient(circle_at_bottom,rgba(245,158,11,0.18),transparent_34%)] lg:block" />
          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={isVerified ? "approved" : profile?.verificationStatus ?? "not_submitted"} className="border-white/10 bg-white/10 text-white" />
                <StatusBadge status={isSubscribed ? "active" : "inactive"} className={isSubscribed ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-100" : "border-amber-300/40 bg-amber-400/15 text-amber-100"} />
              </div>
              <h1 className="mt-5 font-heading text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {greeting()}, {displayName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                {isVerified && isSubscribed
                  ? "Your profile is live and visible to clients on WakeelHub Pakistan."
                  : isVerified
                    ? "Your verification is complete. Activate your subscription to stay visible to clients."
                    : "Complete verification and subscription setup to make your public profile client-ready."}
              </p>
              <div className="mt-6 grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
                <Button asChild className="w-full rounded-xl bg-white text-slate-950 hover:bg-slate-100 sm:w-auto">
                  <Link href="/dashboard/lawyer/profile">Update Profile</Link>
                </Button>
                <Button asChild variant="outline" className="w-full rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 sm:w-auto">
                  <Link href="/dashboard/lawyer/billing">Manage Subscription</Link>
                </Button>
                <Button asChild variant="ghost" className="w-full rounded-xl text-white hover:bg-white/10 sm:w-auto">
                  <Link href={publicProfileHref}>View Public Profile <ArrowUpRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur sm:rounded-3xl sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Profile strength</p>
                  <p className="mt-1 font-heading text-2xl font-semibold sm:text-3xl">{strength}%</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                  <Sparkles className="h-5 w-5" />
                </span>
              </div>
              <Progress value={strength} className="mt-4 h-2 bg-white/15" />
              <p className="mt-3 text-xs leading-5 text-slate-300">
                {strength >= 80 ? "Strong profile. Keep availability and documents current." : "Complete the checklist below to improve trust and conversion."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-6">
        <MetricCard icon={UserRound} label="New leads / requests" value={String(pendingRequests.length)} helper={pendingRequests.length ? "Awaiting your decision" : "No pending requests"} tone="gold" />
        <MetricCard icon={Briefcase} label="Active cases" value={String(activeCases.length)} helper={activeCases.length ? "Open matters in progress" : "No active cases"} tone="navy" />
        <MetricCard icon={CalendarCheck} label="Upcoming hearings" value={String(upcomingHearings.length)} helper={upcomingHearings.length ? "Scheduled from case hearings" : "No hearings scheduled"} tone="emerald" />
        <MetricCard icon={Wallet} label="Monthly revenue" value={formatPKR(monthlyRevenue)} helper={monthlyRevenue > 0 ? "Paid consultation earnings" : "No paid earnings this month"} tone="emerald" />
        <MetricCard icon={MessageSquare} label="Unread messages" value={String(unreadMessages)} helper={unreadMessages ? "Client replies need attention" : "Inbox is clear"} tone="slate" />
        <MetricCard icon={Eye} label="Profile views" value="-" helper="Visibility tracking not connected yet" tone="slate" />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.9fr)]">
        <CardShell className="p-4 sm:p-5">
          <SectionHeader
            title="Lawyer growth & visibility"
            description="Visibility analytics help advocates understand how clients discover and engage with their profile."
            action={<Button asChild variant="outline" size="sm" className="w-full rounded-xl sm:w-auto"><Link href="/dashboard/lawyer/analytics">Open analytics</Link></Button>}
          />
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <VisibilityMetric icon={Eye} label="Profile views this month" value="-" helper="No event table yet" />
            <VisibilityMetric icon={SearchCheck} label="Search appearances" value="-" helper="Search tracking not connected" />
            <VisibilityMetric icon={MousePointerClick} label="Client clicks" value="-" helper="Click tracking not connected" />
            <VisibilityMetric icon={TrendingUp} label="Booking conversion" value={conversionRate === null ? "-" : `${conversionRate}%`} helper={conversionRate === null ? "No bookings yet" : "Confirmed or completed requests"} />
          </div>
        </CardShell>

        <CardShell className="p-4 sm:p-5">
          <SectionHeader title="Subscription status" description="Your public visibility depends on active verification and subscription." />
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current plan</p>
                <p className="mt-1 font-heading text-xl font-semibold text-slate-950"><SubscriptionLabel plan={subscription?.plan ?? lawyer.subscription_plan} /></p>
              </div>
              <StatusBadge status={isSubscribed ? "active" : "inactive"} />
            </div>
            {subscription?.expiresAt && <p className="mt-3 text-sm text-slate-600">Expires {formatDate(subscription.expiresAt)}</p>}
            {!isSubscribed && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
                Your profile is not publicly visible until your subscription is active.
              </div>
            )}
            <Button asChild className="mt-4 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800">
              <Link href="/dashboard/lawyer/billing">{isSubscribed ? "Manage plan" : "Upgrade / Renew"}</Link>
            </Button>
          </div>
        </CardShell>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <CardShell className="p-4 sm:p-5">
          <SectionHeader title="Upcoming hearings" description="Prepare for the next court dates linked to your active cases." />
          {upcomingHearings.length === 0 ? (
            <div className="mt-5"><PremiumEmpty icon={CalendarClock} title="No upcoming hearings" description="Add hearings inside Cases to stay prepared." /></div>
          ) : (
            <div className="mt-5 space-y-3">
              {upcomingHearings.map((hearing) => (
                <Link key={hearing.id} href={`/dashboard/lawyer/cases/${hearing.caseId}`} className="block rounded-2xl border border-slate-200 bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-heading text-sm font-semibold text-slate-950">{hearing.caseTitle}</p>
                      <p className="mt-1 text-sm text-slate-500">{hearing.court ?? "Court not set"}</p>
                    </div>
                    <StatusBadge status={hearing.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>{formatDate(hearing.date)}</span>
                    <span>{formatTime(hearing.time)}</span>
                    {hearing.purpose && <span>{hearing.purpose}</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardShell>

        <CardShell className="p-4 sm:p-5">
          <SectionHeader title="Cases needing attention" description="Urgent items from real hearings, messages and payment status." />
          {attentionItems.length === 0 ? (
            <div className="mt-5"><PremiumEmpty icon={CircleCheck} title="All caught up" description="No urgent case actions right now." /></div>
          ) : (
            <div className="mt-5 space-y-3">
              {attentionItems.map((item, index) => (
                <Link key={`${item.title}-${index}`} href={item.href} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.detail}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardShell>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)]">
        <CardShell className="p-4 sm:p-5">
          <SectionHeader
            title="New consultation requests"
            description="Review client leads quickly. Accepting a request notifies the client automatically."
            action={<Button asChild variant="outline" size="sm" className="w-full rounded-xl sm:w-auto"><Link href="/dashboard/lawyer/bookings">All bookings</Link></Button>}
          />
          {pendingRequests.length === 0 ? (
            <div className="mt-5"><PremiumEmpty icon={Gavel} title="No pending consultation requests" description="New client requests will appear here." /></div>
          ) : (
            <div className="mt-5"><LawyerOverviewRequests requests={pendingRequests.slice(0, 5)} /></div>
          )}
        </CardShell>

        <CardShell className="p-4 sm:p-5">
          <SectionHeader title="Revenue snapshot" description="Consultation revenue and payment health from current bookings." />
          <div className="mt-5 space-y-3">
            <RevenueRow icon={Wallet} label="Consultation earnings this month" value={formatPKR(monthlyRevenue)} />
            <RevenueRow icon={CreditCard} label="Pending payments" value={formatPKR(pendingPaymentBookings.reduce((sum, booking) => sum + Number(booking.fee_amount ?? 0), 0))} />
            <RevenueRow icon={CheckCircle2} label="Completed consultations" value={String(completedThisMonth)} />
            <RevenueRow icon={BarChart3} label="Average online fee" value={formatPKR(Number(profile?.onlineConsultationFee ?? 0))} />
          </div>
        </CardShell>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <CardShell className="p-4 sm:p-5">
          <SectionHeader title="Profile completion checklist" description="A complete profile builds trust before the first consultation." />
          <div className="mt-5 space-y-3">
            {checklist.map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4">
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", item.done ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                  {item.done ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.helper}</p>
                </div>
              </div>
            ))}
          </div>
        </CardShell>

        <CardShell className="overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/80 p-4 sm:p-5">
            <SectionHeader title="Practice readiness" description="A quick read on how clients see your practice right now." />
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-5">
            <ReadinessTile icon={ShieldCheck} label="Verification" value={isVerified ? "Verified" : "Not verified"} ok={isVerified} />
            <ReadinessTile icon={CreditCard} label="Subscription" value={isSubscribed ? "Active" : "Inactive"} ok={isSubscribed} />
            <ReadinessTile icon={FileText} label="Cases" value={`${activeCases.length} active`} ok={activeCases.length > 0} />
            <ReadinessTile icon={Clock} label="Availability" value={profile?.availabilityDays.length ? "Configured" : "Needs setup"} ok={Boolean(profile?.availabilityDays.length)} />
          </div>
          <div className="border-t border-slate-100 p-4 sm:p-5">
            {!isVerified || !isSubscribed ? (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Complete verification and keep your subscription active so clients can find and book your profile.</p>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Your profile is ready for client discovery. Keep hearings, messages and payments current.</p>
              </div>
            )}
          </div>
        </CardShell>
      </section>
    </div>
  );
}

function RevenueRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 sm:items-center sm:p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm sm:h-10 sm:w-10">
          <Icon className="h-4 w-4" />
        </span>
        <p className="min-w-0 text-sm leading-5 text-slate-600">{label}</p>
      </div>
      <p className="shrink-0 text-right font-heading text-sm font-semibold text-slate-950 sm:text-base">{value}</p>
    </div>
  );
}

function ReadinessTile({ icon: Icon, label, value, ok }: { icon: LucideIcon; label: string; value: string; ok: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon className={cn("h-4 w-4", ok ? "text-emerald-600" : "text-amber-600")} />
        {label}
      </div>
      <p className="mt-2 font-heading text-base font-semibold text-slate-950 sm:mt-3 sm:text-lg">{value}</p>
    </div>
  );
}
