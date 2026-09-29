import type { Metadata } from "next";

import {
  Briefcase,
  ShieldCheck,
  Users,
  UserCheck,
} from "lucide-react";

import { AdminUsersTable } from "@/components/dashboard/admin/admin-users-table";
import { getAdminStats, getAdminUsers } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Users",
};

export default async function AdminUsersPage() {
  const [stats, users] = await Promise.all([
    getAdminStats(),
    getAdminUsers(300),
  ]);

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5">
      <header className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/30">
        <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 overflow-hidden">
          <div className="absolute -right-14 -top-14 h-28 w-28 rounded-full bg-primary" />
          <div className="absolute right-5 top-5 h-2.5 w-2.5 rounded-full bg-gold" />
        </div>

        <div className="relative px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2.5 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <Users className="h-3.5 w-3.5" aria-hidden />
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  User management
                </span>
              </div>

              <h1 className="font-heading text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                Users
              </h1>

              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                Manage registered clients, advocates, and administrators.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/70 p-1">
              <SummaryItem
                icon={Users}
                label="Total"
                value={stats.totalUsers}
              />

              <SummaryItem
                icon={UserCheck}
                label="Clients"
                value={stats.totalClients}
              />

              <SummaryItem
                icon={Briefcase}
                label="Lawyers"
                value={stats.totalLawyers}
              />

              <SummaryItem
                icon={ShieldCheck}
                label="Verified"
                value={stats.verifiedLawyers}
                tone="emerald"
              />
            </div>
          </div>
        </div>
      </header>

      <AdminUsersTable users={users} />
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: {
  icon: typeof Users;
  label: string;
  value: number;
  tone?: "primary" | "emerald";
}) {
  return (
    <div className="flex min-w-[78px] items-center gap-2 rounded-lg px-2.5 py-2">
      <span
        className={
          tone === "emerald"
            ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600"
            : "flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-primary shadow-sm"
        }
      >
        <Icon className="h-3 w-3" aria-hidden />
      </span>

      <div className="min-w-0">
        <p className="text-sm font-semibold leading-none text-slate-900">
          {value.toLocaleString()}
        </p>

        <p className="mt-1 text-[10px] font-medium leading-none text-slate-400">
          {label}
        </p>
      </div>
    </div>
  );
}