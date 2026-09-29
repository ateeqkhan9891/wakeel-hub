import {
  BriefcaseBusiness,
  CircleDollarSign,
  FileCheck2,
  MessageSquareWarning,
  Scale,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import { AdminStat } from "@/components/dashboard/admin/admin-ui";
import type { AdminStats } from "@/lib/data/admin";
import { formatPKR } from "@/lib/utils";

type AdminOverviewStatsProps = {
  stats: AdminStats;
  verifiedShare: number;
};

export function AdminOverviewStats({
  stats,
  verifiedShare,
}: AdminOverviewStatsProps) {
  return (
    <section aria-label="Platform metrics">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            At a glance
          </p>
          <h2 className="mt-1 font-heading text-lg font-semibold tracking-tight text-slate-950">
            Platform metrics
          </h2>
        </div>

        <p className="hidden text-xs text-slate-400 sm:block">
          Current platform performance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStat
          icon={Users}
          label="Total users"
          value={stats.totalUsers}
          helper={`${stats.totalClients} clients · ${stats.totalLawyers} lawyers`}
          tone="navy"
        />

        <AdminStat
          icon={Scale}
          label="Lawyers"
          value={stats.totalLawyers}
          helper={`${stats.verifiedLawyers} verified · ${verifiedShare}% verified`}
          tone="blue"
        />

        <AdminStat
          icon={ShieldCheck}
          label="Verified lawyers"
          value={stats.verifiedLawyers}
          helper={`${stats.pendingVerifications} awaiting review`}
          tone="emerald"
        />

        <AdminStat
          icon={UserRound}
          label="Clients"
          value={stats.totalClients}
          helper={`${stats.totalBookings} total bookings`}
          tone="slate"
        />

        <AdminStat
          icon={BriefcaseBusiness}
          label="Total cases"
          value={stats.totalCases}
          helper={`${stats.activeCases} currently active`}
          tone="blue"
        />

        <AdminStat
          icon={CircleDollarSign}
          label="Monthly revenue"
          value={formatPKR(stats.monthlyRevenue)}
          helper={`${formatPKR(stats.totalRevenue)} total revenue`}
          tone="gold"
        />

        <AdminStat
          icon={FileCheck2}
          label="Pending verification"
          value={stats.pendingVerifications}
          helper={`${stats.rejectedVerifications} rejected`}
          tone="gold"
        />

        <AdminStat
          icon={MessageSquareWarning}
          label="Open complaints"
          value={stats.openComplaints}
          helper={`${stats.failedPayments} failed payments`}
          tone="rose"
        />
      </div>
    </section>
  );
}