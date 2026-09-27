import type { LucideIcon } from "lucide-react";
import {
  MessageSquare,
  Search,
  Wallet,
} from "lucide-react";

import { ClientDashboardHero } from "@/components/dashboard/client/client-dashboard-hero";
import { ClientDashboardSummary } from "@/components/dashboard/client/client-dashboard-summary";
import { ClientAttention } from "@/components/dashboard/client/client-attention";
import { ClientActiveCases } from "@/components/dashboard/client/client-active-cases";
import { ClientUpcomingConsultations } from "@/components/dashboard/client/client-upcoming-consultations";
import { ClientRecentBookings } from "@/components/dashboard/client/client-recent-bookings";
import { ClientMessagesPreview } from "@/components/dashboard/client/client-messages-preview";
import { ClientPaymentsSnapshot } from "@/components/dashboard/client/client-payments-snapshot";
import { ClientRecentActivity } from "@/components/dashboard/client/client-recent-activity";

import { formatPKR } from "@/lib/utils";

type ClientDashboardProps = {
  profile: Awaited<
    ReturnType<typeof import("@/lib/supabase/guard").requireUser>
  >;
  bookings: Awaited<
    ReturnType<typeof import("@/lib/data/bookings").getClientBookings>
  >;
  cases: Awaited<
    ReturnType<typeof import("@/lib/data/client-cases").getClientCases>
  >;
  conversations: Awaited<
    ReturnType<typeof import("@/lib/data/messages").getMyConversations>
  >;
  payments: Awaited<
    ReturnType<typeof import("@/lib/data/client-payments").getClientPayments>
  >;
  notifications: Awaited<
    ReturnType<typeof import("@/lib/data/notifications").getMyNotifications>
  >;
};

const CLOSED_CASE = new Set([
  "closed",
  "won",
  "lost",
  "archived",
]);

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

export default function ClientDashboard({
  profile,
  bookings,
  cases,
  conversations,
  payments,
  notifications,
}: ClientDashboardProps) {
  const firstName = (profile.full_name || "there").split(" ")[0];

  const activeCases = cases.filter(
    (c) => !CLOSED_CASE.has(c.status),
  );

  const upcomingConsultations = bookings
    .filter(
      (b) =>
        b.status === "confirmed" ||
        b.status === "pending",
    )
    .sort((a, b) =>
      (a.scheduled_date ?? "9999").localeCompare(
        b.scheduled_date ?? "9999",
      ),
    );

  const unreadMessages = conversations.reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );

  const pendingPayments = payments.filter(
    (p) => p.remaining > 0 || p.status === "pending",
  );

  const pendingTotal = pendingPayments.reduce(
    (sum, p) => sum + (p.remaining || 0),
    0,
  );

  const totalPaid = payments.reduce(
    (sum, p) => sum + (p.paid || 0),
    0,
  );

  const tasks: {
    icon: LucideIcon;
    title: string;
    desc: string;
    href: string;
    cta: string;
    tone: string;
  }[] = [];

  if (pendingPayments.length > 0) {
    tasks.push({
      icon: Wallet,
      title: "Complete a payment",
      desc: `${pendingPayments.length} payment${
        pendingPayments.length === 1 ? "" : "s"
      } totalling ${formatPKR(pendingTotal)} outstanding.`,
      href: "/dashboard/client/payments",
      cta: "View payments",
      tone: "amber",
    });
  }

  if (unreadMessages > 0) {
    tasks.push({
      icon: MessageSquare,
      title: "Respond to your lawyer",
      desc: `You have ${unreadMessages} unread message${
        unreadMessages === 1 ? "" : "s"
      }.`,
      href: "/dashboard/client/messages",
      cta: "Open messages",
      tone: "blue",
    });
  }

  if (
    activeCases.length === 0 &&
    bookings.length === 0
  ) {
    tasks.push({
      icon: Search,
      title: "Schedule your first consultation",
      desc: "Find a verified advocate and book a consultation to get started.",
      href: "/find-lawyers",
      cta: "Find a lawyer",
      tone: "primary",
    });
  }

  return (
    <div className="space-y-6">
      <ClientDashboardHero
        firstName={firstName}
        activeCases={activeCases.length}
        upcomingConsultations={upcomingConsultations.length}
        unreadMessages={unreadMessages}
      />

      <ClientDashboardSummary
        activeCases={activeCases.length}
        upcomingConsultations={upcomingConsultations.length}
        unreadMessages={unreadMessages}
        pendingPayments={pendingPayments.length}
        totalPaid={totalPaid}
      />

      <ClientAttention tasks={tasks} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <ClientActiveCases cases={cases} />
          <ClientUpcomingConsultations bookings={bookings} />
          <ClientRecentBookings bookings={bookings} />
        </div>

        <div className="space-y-6">
          <ClientMessagesPreview conversations={conversations} />

          <ClientPaymentsSnapshot
            payments={payments}
            totalPaid={totalPaid}
            pendingTotal={pendingTotal}
          />

          <ClientRecentActivity
            notifications={notifications}
          />
        </div>
      </div>
    </div>
  );
}