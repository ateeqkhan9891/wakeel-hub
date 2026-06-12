import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight, ArrowRight, Briefcase, Receipt, ShieldCheck, TrendingUp, Users, UserPlus,
  UserCheck, Gavel, AlertCircle, CreditCard, FileWarning, Star, CheckCircle2, Activity, CircleDot, Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { AdminStat, AdminSection } from "@/components/dashboard/admin-ui";
import {
  getAdminStats, getAdminUsers, getAdminCases, getAdminPayments, getAdminComplaints, getAdminReviews,
} from "@/lib/data/admin";
import { getAdminVerificationRequests } from "@/lib/data/admin-verifications";
import { formatDate, formatPKR, timeAgo, initials } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin Dashboard" };

const ROLE_LABEL: Record<string, string> = { client: "Client", lawyer: "Lawyer", admin: "Admin" };

type ActivityItem = { id: string; icon: LucideIcon; cls: string; text: string; when: string };

export default async function AdminDashboardPage() {
  const [stats, requests, recentUsers, recentCases, recentPayments, complaints, reviews] = await Promise.all([
    getAdminStats(),
    getAdminVerificationRequests(),
    getAdminUsers(6),
    getAdminCases(6),
    getAdminPayments(6),
    getAdminComplaints(50),
    getAdminReviews(6),
  ]);

  const pending = requests.filter((r) => r.status === "pending");
  const verifiedShare = stats.totalLawyers > 0 ? Math.round((stats.verifiedLawyers / stats.totalLawyers) * 100) : 0;
  const decided = stats.verifiedLawyers + stats.rejectedVerifications;
  const approvalRate = decided > 0 ? Math.round((stats.verifiedLawyers / decided) * 100) : 0;
  const caseActivityRate = stats.totalCases > 0 ? Math.round((stats.activeCases / stats.totalCases) * 100) : 0;

  // Attention required - real, count-driven.
  const attention: { icon: LucideIcon; label: string; count: number; href: string; tone: string }[] = [
    { icon: ShieldCheck, label: "Pending verifications", count: stats.pendingVerifications, href: "/dashboard/admin/lawyers", tone: "amber" },
    { icon: FileWarning, label: "Open complaints", count: stats.openComplaints, href: "/dashboard/admin/reports", tone: "rose" },
    { icon: CreditCard, label: "Failed payments", count: stats.failedPayments, href: "/dashboard/admin/payments", tone: "rose" },
    { icon: Wallet, label: "Subscriptions expiring soon", count: stats.expiringSubscriptions, href: "/dashboard/admin/subscriptions", tone: "amber" },
    { icon: ShieldCheck, label: "Verification rejections", count: stats.rejectedVerifications, href: "/dashboard/admin/lawyers", tone: "slate" },
  ].filter((a) => a.count > 0);

  // Recent activity - merged from real entities.
  const activity: ActivityItem[] = [
    ...recentUsers.map((u) => ({ id: `u-${u.id}`, icon: UserPlus, cls: "bg-blue-50 text-blue-600", text: `New ${ROLE_LABEL[u.role] ?? "user"} registered - ${u.name}`, when: u.createdAt })),
    ...requests.map((r) => ({
      id: `v-${r.id}`, icon: ShieldCheck, cls: "bg-primary/10 text-primary",
      text: r.status === "approved" ? `Verification approved - ${r.lawyerName}` : r.status === "rejected" ? `Verification rejected - ${r.lawyerName}` : `Verification submitted - ${r.lawyerName}`,
      when: r.submittedAt,
    })),
    ...recentCases.map((c) => ({ id: `c-${c.id}`, icon: Gavel, cls: "bg-primary/10 text-primary", text: `Case activity - ${c.title}`, when: c.updatedAt })),
    ...recentPayments.map((p) => ({ id: `p-${p.id}`, icon: Receipt, cls: "bg-emerald-50 text-emerald-600", text: `Payment ${p.status} - ${formatPKR(p.paid || p.total)}`, when: p.date })),
    ...complaints.slice(0, 6).map((c) => ({ id: `cm-${c.id}`, icon: FileWarning, cls: "bg-rose-50 text-rose-600", text: `Complaint filed - ${c.subject}`, when: c.createdAt })),
    ...reviews.map((r) => ({ id: `r-${r.id}`, icon: Star, cls: "bg-amber-50 text-amber-600", text: `${r.rating}★ review on ${r.lawyerName}`, when: r.createdAt })),
  ]
    .filter((a) => Boolean(a.when))
    .sort((a, b) => b.when.localeCompare(a.when))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">Platform Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Your WakeelHub command center - growth, revenue, verification, cases and what needs attention.</p>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AdminStat icon={Users} tone="navy" label="Total users" value={stats.totalUsers.toLocaleString()} helper={`${stats.totalClients.toLocaleString()} clients - ${stats.totalLawyers.toLocaleString()} lawyers`} />
        <AdminStat icon={Briefcase} tone="navy" label="Active lawyers" value={stats.totalLawyers.toLocaleString()} helper={`${stats.verifiedLawyers.toLocaleString()} verified`} />
        <AdminStat icon={ShieldCheck} tone="emerald" label="Verified lawyers" value={stats.verifiedLawyers.toLocaleString()} helper={`${verifiedShare}% of advocates`} />
        <AdminStat icon={UserCheck} tone="navy" label="Active clients" value={stats.totalClients.toLocaleString()} helper="Registered clients" />
        <AdminStat icon={Gavel} tone="navy" label="Total cases" value={stats.totalCases.toLocaleString()} helper={`${stats.activeCases.toLocaleString()} active`} />
        <AdminStat icon={Receipt} tone="emerald" label="Monthly revenue" value={formatPKR(stats.monthlyRevenue)} helper="Collected this month" />
        <AdminStat icon={ShieldCheck} tone="gold" label="Pending verifications" value={stats.pendingVerifications.toLocaleString()} helper="Awaiting review" />
        <AdminStat icon={FileWarning} tone="rose" label="Open complaints" value={stats.openComplaints.toLocaleString()} helper="Need investigation" />
      </div>

      {/* Attention required */}
      <AdminSection title="Attention required" icon={AlertCircle}>
        {attention.length === 0 ? (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-700">All clear - nothing needs your attention right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {attention.map((a) => (
              <Link key={a.label} href={a.href} className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50">
                <span className={cnTone(a.tone)}><a.icon className="h-4.5 w-4.5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-950">{a.count} {a.label}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">Review now <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" /></span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </AdminSection>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Left: verifications + activity */}
        <div className="space-y-6">
          <AdminSection
            title="Pending lawyer verifications"
            icon={ShieldCheck}
            action={<Button variant="ghost" size="sm" asChild className="h-8 gap-1 text-primary hover:text-primary"><Link href="/dashboard/admin/lawyers">Review all <ArrowUpRight className="h-3.5 w-3.5" /></Link></Button>}
          >
            {pending.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-sm text-slate-500">No pending verification requests right now.</p>
            ) : (
              <div className="space-y-3">
                {pending.slice(0, 4).map((v) => (
                  <div key={v.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0"><AvatarFallback className="bg-primary/8 text-xs font-semibold text-primary">{initials(v.lawyerName)}</AvatarFallback></Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">{v.lawyerName}</p>
                        <p className="truncate text-xs text-slate-500">Bar #{v.barCouncilNumber} - {v.city ?? "-"} - {timeAgo(v.submittedAt)}</p>
                      </div>
                    </div>
                    <StatusBadge status={v.status} />
                  </div>
                ))}
              </div>
            )}
          </AdminSection>

          <AdminSection title="Recent platform activity" icon={Activity}>
            {activity.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-sm text-slate-500">No recent activity yet.</p>
            ) : (
              <div className="space-y-3">
                {activity.map((a) => (
                  <div key={a.id} className="flex items-start gap-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${a.cls}`}><a.icon className="h-4 w-4" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-800">{a.text}</p>
                      <p className="text-xs text-slate-400">{timeAgo(a.when)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminSection>
        </div>

        {/* Right: platform health + registrations */}
        <div className="space-y-6">
          <AdminSection title="Platform health" icon={TrendingUp}>
            <div className="space-y-4">
              <HealthBar label="Verification rate" value={verifiedShare} hint={`${stats.verifiedLawyers} of ${stats.totalLawyers} lawyers verified`} />
              <HealthBar label="Approval rate" value={approvalRate} hint={`${stats.verifiedLawyers} approved - ${stats.rejectedVerifications} rejected`} />
              <HealthBar label="Case activity rate" value={caseActivityRate} hint={`${stats.activeCases} of ${stats.totalCases} cases active`} />
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <span className="flex items-center gap-2 text-sm text-slate-600"><CircleDot className="h-4 w-4 text-emerald-500" /> System status</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Operational</span>
              </div>
            </div>
          </AdminSection>

          <AdminSection
            title="New registrations"
            icon={UserPlus}
            action={<Button variant="ghost" size="sm" asChild className="h-8 gap-1 text-primary hover:text-primary"><Link href="/dashboard/admin/users">View all <ArrowUpRight className="h-3.5 w-3.5" /></Link></Button>}
          >
            {recentUsers.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-sm text-slate-500">No users yet.</p>
            ) : (
              <div className="space-y-2.5">
                {recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                    <Avatar className="h-9 w-9 shrink-0"><AvatarFallback className="bg-primary/8 text-xs font-semibold text-primary">{initials(u.name)}</AvatarFallback></Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-950">{u.name}</p>
                      <p className="truncate text-xs text-slate-500">{ROLE_LABEL[u.role] ?? u.role} - {u.city ?? "-"} - {formatDate(u.createdAt)}</p>
                    </div>
                    {u.role === "lawyer" ? <StatusBadge status={u.isVerified ? "approved" : "pending"} /> : <span className="text-[11px] text-slate-400">Active</span>}
                  </div>
                ))}
              </div>
            )}
          </AdminSection>
        </div>
      </div>
    </div>
  );
}

function HealthBar({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{value}%</span>
      </div>
      <Progress value={value} className="mt-1.5 h-2 bg-slate-100" />
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </div>
  );
}

const TONE_BADGE: Record<string, string> = {
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
  slate: "bg-slate-100 text-slate-500",
};
function cnTone(tone: string) {
  return `flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${TONE_BADGE[tone] ?? TONE_BADGE.slate}`;
}
