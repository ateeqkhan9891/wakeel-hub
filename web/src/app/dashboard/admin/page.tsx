import type { Metadata } from "next";

import {
  FileWarning,
  Gavel,
  Receipt,
  ShieldCheck,
  Star,
  UserPlus,
} from "lucide-react";

import {
  getAdminCases,
  getAdminComplaints,
  getAdminPayments,
  getAdminReviews,
  getAdminStats,
  getAdminUsers,
} from "@/lib/data/admin";
import { getAdminVerificationRequests } from "@/lib/data/admin-verifications";
import { formatPKR, timeAgo } from "@/lib/utils";

import { AdminAttention } from "@/components/dashboard/admin/overview/admin-attention";
import { AdminOverviewHeader } from "@/components/dashboard/admin/overview/admin-overview-header";
import { AdminOverviewStats } from "@/components/dashboard/admin/overview/admin-overview-stats";
import { AdminPlatformActivity } from "@/components/dashboard/admin/overview/admin-platform-activity";
import { AdminPlatformHealth } from "@/components/dashboard/admin/overview/admin-platform-health";
import { AdminRecentRegistrations } from "@/components/dashboard/admin/overview/admin-recent-registrations";
import { AdminVerificationPreview } from "@/components/dashboard/admin/overview/admin-verification-preview";
import type {
  ActivityItem,
  ActivityTone,
} from "@/components/dashboard/admin/overview/admin-overview-types";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const ROLE_LABEL: Record<string, string> = {
  client: "Client",
  lawyer: "Lawyer",
  admin: "Admin",
};

export default async function AdminDashboardPage() {
  const [
    stats,
    requests,
    recentUsers,
    recentCases,
    recentPayments,
    complaints,
    reviews,
  ] = await Promise.all([
    getAdminStats(),
    getAdminVerificationRequests(),
    getAdminUsers(6),
    getAdminCases(6),
    getAdminPayments(6),
    getAdminComplaints(50),
    getAdminReviews(6),
  ]);

  const pending = requests.filter(
    (request) => request.status === "pending",
  );

  const verifiedShare =
    stats.totalLawyers > 0
      ? Math.round(
          (stats.verifiedLawyers / stats.totalLawyers) * 100,
        )
      : 0;

  const decided =
    stats.verifiedLawyers + stats.rejectedVerifications;

  const approvalRate =
    decided > 0
      ? Math.round(
          (stats.verifiedLawyers / decided) * 100,
        )
      : 0;

  const caseActivityRate =
    stats.totalCases > 0
      ? Math.round(
          (stats.activeCases / stats.totalCases) * 100,
        )
      : 0;

  const activity: ActivityItem[] = [
    ...recentUsers.map((user) => ({
      id: `u-${user.id}`,
      icon: UserPlus,
      tone: "blue" as ActivityTone,
      text: `New ${ROLE_LABEL[user.role] ?? "user"} registered - ${user.name}`,
      when: user.createdAt,
    })),

    ...requests.map((request) => ({
      id: `v-${request.id}`,
      icon: ShieldCheck,
      tone: "primary" as ActivityTone,
      text:
        request.status === "approved"
          ? `Verification approved - ${request.lawyerName}`
          : request.status === "rejected"
            ? `Verification rejected - ${request.lawyerName}`
            : `Verification submitted - ${request.lawyerName}`,
      when: request.submittedAt,
    })),

    ...recentCases.map((item) => ({
      id: `c-${item.id}`,
      icon: Gavel,
      tone: "primary" as ActivityTone,
      text: `Case activity - ${item.title}`,
      when: item.updatedAt,
    })),

    ...recentPayments.map((payment) => ({
      id: `p-${payment.id}`,
      icon: Receipt,
      tone: "emerald" as ActivityTone,
      text: `Payment ${payment.status} - ${formatPKR(
        payment.paid || payment.total,
      )}`,
      when: payment.date,
    })),

    ...complaints.slice(0, 6).map((complaint) => ({
      id: `cm-${complaint.id}`,
      icon: FileWarning,
      tone: "rose" as ActivityTone,
      text: `Complaint filed - ${complaint.subject}`,
      when: complaint.createdAt,
    })),

    ...reviews.map((review) => ({
      id: `r-${review.id}`,
      icon: Star,
      tone: "amber" as ActivityTone,
      text: `${review.rating}★ review on ${review.lawyerName}`,
      when: review.createdAt,
    })),
  ]
    .filter((item) => Boolean(item.when))
    .sort((a, b) => b.when.localeCompare(a.when))
    .slice(0, 8)
    .map((item) => ({
      ...item,
      when: timeAgo(item.when),
    }));

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <AdminOverviewHeader />

      <AdminOverviewStats
        stats={stats}
        verifiedShare={verifiedShare}
      />

      <AdminAttention stats={stats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <AdminVerificationPreview requests={pending} />

          <AdminPlatformActivity activities={activity} />
        </div>

        <div className="space-y-6">
          <AdminPlatformHealth
            stats={stats}
            verifiedShare={verifiedShare}
            approvalRate={approvalRate}
            caseActivityRate={caseActivityRate}
          />

          <AdminRecentRegistrations users={recentUsers} />
        </div>
      </div>
    </div>
  );
}