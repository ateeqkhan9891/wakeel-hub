import type { Metadata } from "next";
import { Briefcase, ShieldCheck, Users, UserCheck } from "lucide-react";

import { AdminStat } from "@/components/dashboard/admin-ui";
import { AdminUsersTable } from "@/components/dashboard/admin-users-table";
import { getAdminStats, getAdminUsers } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const [stats, users] = await Promise.all([getAdminStats(), getAdminUsers(300)]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">Users</h1>
        <p className="mt-1 text-sm text-slate-500">Every registered account on WakeelHub - clients, advocates and admins.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AdminStat icon={Users} tone="navy" label="Total users" value={stats.totalUsers.toLocaleString()} />
        <AdminStat icon={UserCheck} tone="navy" label="Clients" value={stats.totalClients.toLocaleString()} />
        <AdminStat icon={Briefcase} tone="gold" label="Lawyers" value={stats.totalLawyers.toLocaleString()} />
        <AdminStat icon={ShieldCheck} tone="emerald" label="Verified lawyers" value={stats.verifiedLawyers.toLocaleString()} />
      </div>

      <AdminUsersTable users={users} />
    </div>
  );
}
