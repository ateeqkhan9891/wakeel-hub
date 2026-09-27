import type { Metadata } from "next";

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  CalendarClock,
  CreditCard,
  MessageSquare,
} from "lucide-react";

// refracted into sepaarte section comps -- we will later move these into seaparte folder inside laywer - overview page sections
import { LawyerDashboardHeader } from "@/components/dashboard/lawyer/overview/lawyer-dashboard-header";
import { LawyerDashboardMetrics } from "@/components/dashboard/lawyer/overview/lawyer-dashboard-metrics";
import { LawyerDashboardVisibility } from "@/components/dashboard/lawyer/overview/lawyer-dashboard-visibility";
import { LawyerDashboardSubscription } from "@/components/dashboard/lawyer/overview/lawyer-dashboard-subscription";
import { LawyerDashboardHearings } from "@/components/dashboard/lawyer/overview/lawyer-dashboard-hearings";
import { LawyerDashboardAttention } from "@/components/dashboard/lawyer/overview/lawyer-dashboard-attention";
import { LawyerDashboardRequests } from "@/components/dashboard/lawyer/overview/lawyer-dashboard-requests";
import { LawyerDashboardRevenue } from "@/components/dashboard/lawyer/overview/lawyer-dashboard-revenue";
import { LawyerDashboardChecklist } from "@/components/dashboard/lawyer/overview/lawyer-dashboard-checklist";
import { LawyerDashboardReadiness } from "@/components/dashboard/lawyer/overview/lawyer-dashboard-readiness";




import { getLawyerBookings } from "@/lib/data/bookings";
import { getLawyerCases } from "@/lib/data/cases";
import { getLawyerEarnings } from "@/lib/data/commission";
import { getLawyerHearings } from "@/lib/data/lawyer-hearings";
import { getMyConversations } from "@/lib/data/messages";
import { getMyLawyerProfile } from "@/lib/data/lawyer-profile";
import { getLawyerSubscription } from "@/lib/data/lawyer-subscription";
import { createClient } from "@/lib/supabase/server";
import { formatPKR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Lawyer Dashboard",
};

const ACTIVE_CASE_STATUSES = new Set([
  "pending",
  "active",
  "in_progress",
  "adjourned",
]);

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function completionItems(
  profile: Awaited<ReturnType<typeof getMyLawyerProfile>>,
) {
  const p = profile;

  return [
    {
      label: "Basic profile completed",
      done: Boolean(
        p?.name && p.city && p.professionalTitle && p.about,
      ),
      helper: "Name, city, title and biography",
    },
    {
      label: "CNIC / Bar verification uploaded",
      done:
        p?.verificationStatus === "approved" ||
        p?.verificationStatus === "pending",
      helper:
        p?.verificationStatus === "approved"
          ? "Approved by WakeelHub"
          : "Submit verification documents",
    },
    {
      label: "Practice areas selected",
      done: Boolean(p?.practiceAreas.length),
      helper: `${p?.practiceAreas.length ?? 0} selected`,
    },
    {
      label: "Consultation fee added",
      done: Number(p?.onlineConsultationFee ?? 0) > 0,
      helper:
        Number(p?.onlineConsultationFee ?? 0) > 0
          ? formatPKR(Number(p?.onlineConsultationFee ?? 0))
          : "Add online consultation fee",
    },
    {
      label: "Availability configured",
      done: Boolean(
        p?.availabilityDays.length || p?.availabilityHours,
      ),
      helper: p?.availabilityDays.length
        ? `${p.availabilityDays.length} available days`
        : "Add available days and hours",
    },
    {
      label: "Profile photo uploaded",
      done: Boolean(p?.photoUrl),
      helper: p?.photoUrl
        ? "Photo visible on profile"
        : "Add a professional headshot",
    },
  ];
}

function profileStrength(items: { done: boolean }[]) {
  if (items.length === 0) return 0;

  return Math.round(
    (items.filter((item) => item.done).length / items.length) * 100,
  );
}

function sameMonth(
  value: string | null | undefined,
  now = new Date(),
) {
  if (!value) return false;

  const date = new Date(value);

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

export default async function LawyerDashboardPage() {
  const supabase = (await createClient()) as unknown as SupabaseClient;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    bookings,
    cases,
    hearings,
    conversations,
    earnings,
    subscription,
    profile,
    lawyerRow,
  ] = await Promise.all([
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
          .select(
            "slug, is_verified, subscription_status, subscription_plan",
          )
          .eq("id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const lawyer = (lawyerRow.data ?? {}) as {
    slug?: string;
    is_verified?: boolean;
    subscription_status?: string;
    subscription_plan?: string | null;
  };

  const pendingRequests = bookings.filter(
    (booking) => booking.status === "pending",
  );

  const activeCases = cases.filter((caseFile) =>
    ACTIVE_CASE_STATUSES.has(caseFile.status),
  );

  const now = new Date();

  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);

  const today = dateKey(now);
  const tomorrow = dateKey(tomorrowDate);

  const upcomingHearings = hearings
    .filter(
      (hearing) =>
        hearing.date >= today && hearing.status !== "cancelled",
    )
    .slice(0, 4);

  const tomorrowHearings = hearings.filter(
    (hearing) =>
      hearing.date === tomorrow && hearing.status !== "cancelled",
  );

  const unreadMessages = conversations.reduce(
    (sum, thread) => sum + thread.unreadCount,
    0,
  );

  const monthlyRevenue = (earnings?.rows ?? [])
    .filter((row) => sameMonth(row.paidAt ?? row.createdAt))
    .reduce((sum, row) => sum + row.lawyerNet, 0);

  const pendingPaymentBookings = bookings.filter(
    (booking) =>
      booking.status === "confirmed" &&
      booking.payment_status !== "paid" &&
      Number(booking.fee_amount ?? 0) > 0,
  );

  const pendingPayments = pendingPaymentBookings.reduce(
    (sum, booking) => sum + Number(booking.fee_amount ?? 0),
    0,
  );

  const completedThisMonth = bookings.filter(
    (booking) =>
      booking.status === "completed" &&
      sameMonth(booking.created_at),
  ).length;

  const conversionRate = bookings.length
    ? Math.round(
        (bookings.filter(
          (booking) =>
            booking.status === "confirmed" ||
            booking.status === "completed",
        ).length /
          bookings.length) *
          100,
      )
    : null;

  const checklist = completionItems(profile);
  const strength = profileStrength(checklist);

  const availabilityConfigured = Boolean(
    profile?.availabilityDays.length || profile?.availabilityHours,
  );

  const isVerified =
    lawyer.is_verified === true ||
    profile?.verificationStatus === "approved";

  const isSubscribed =
    (subscription?.status ?? lawyer.subscription_status) === "active";

  const publicProfileHref = lawyer.slug
    ? `/lawyers/${lawyer.slug}`
    : "/dashboard/lawyer/profile";

  const displayName = profile?.name || "Advocate";

  const attentionItems = [
    ...tomorrowHearings.slice(0, 2).map((hearing) => ({
      icon: CalendarClock,
      title: "Hearing tomorrow",
      detail: `${hearing.caseTitle} - ${
        hearing.court ?? "Court not set"
      }`,
      href: `/dashboard/lawyer/cases/${hearing.caseId}`,
    })),

    ...conversations
      .filter((thread) => thread.unreadCount > 0)
      .slice(0, 2)
      .map((thread) => ({
        icon: MessageSquare,
        title: "Client awaiting reply",
        detail: `${thread.otherName} sent ${
          thread.unreadCount
        } unread ${
          thread.unreadCount === 1 ? "message" : "messages"
        }`,
        href: "/dashboard/lawyer/messages",
      })),

    ...pendingPaymentBookings.slice(0, 2).map((booking) => ({
      icon: CreditCard,
      title: "Payment pending",
      detail: `${booking.client_name ?? "Client"} - ${formatPKR(
        Number(booking.fee_amount ?? 0),
      )}`,
      href: "/dashboard/lawyer/bookings",
    })),
  ];

  return (
    <div className="space-y-4 text-slate-950 sm:space-y-6">
      <LawyerDashboardHeader
        isVerified={isVerified}
        isSubscribed={isSubscribed}
        verificationStatus={profile?.verificationStatus}
        displayName={displayName}
        publicProfileHref={publicProfileHref}
        strength={strength}
      />

      <LawyerDashboardMetrics
        pendingRequests={pendingRequests.length}
        activeCases={activeCases.length}
        upcomingHearings={upcomingHearings.length}
        monthlyRevenue={monthlyRevenue}
        unreadMessages={unreadMessages}
      />

      <section className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.9fr)]">
        <LawyerDashboardVisibility
          conversionRate={conversionRate}
        />

        <LawyerDashboardSubscription
          plan={subscription?.plan ?? lawyer.subscription_plan}
          isSubscribed={isSubscribed}
          expiresAt={subscription?.expiresAt ?? null}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <LawyerDashboardHearings hearings={upcomingHearings} />

        <LawyerDashboardAttention items={attentionItems} />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)]">
        <LawyerDashboardRequests requests={pendingRequests} />

        <LawyerDashboardRevenue
          monthlyRevenue={monthlyRevenue}
          pendingPayments={pendingPayments}
          completedConsultations={completedThisMonth}
          averageOnlineFee={Number(
            profile?.onlineConsultationFee ?? 0,
          )}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <LawyerDashboardChecklist items={checklist} />

        <LawyerDashboardReadiness
          isVerified={isVerified}
          isSubscribed={isSubscribed}
          activeCases={activeCases.length}
          availabilityConfigured={availabilityConfigured}
        />
      </section>
    </div>
  );
}