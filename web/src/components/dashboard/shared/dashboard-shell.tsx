"use client";

import { useState } from "react";

import { DashboardSidebar } from "@/components/dashboard/shared/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/shared/dashboard-topbar";

import { DashboardInsight } from "@/components/dashboard/shared/dashboard-insight";

type DashboardRole = "client" | "lawyer" | "admin";

interface DashboardShellProps {
  role: DashboardRole;
  user: {
    name: string;
    email: string;
    avatarSeed: string;
  };
  badges?: Record<string, number>;
  children: React.ReactNode;
}

export function DashboardShell({
  role,
  user,
  badges = {},
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-svh bg-background">
      <DashboardSidebar
        role={role}
        badges={badges}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardInsight role={role} />
        <DashboardTopbar
          role={role}
          user={user}
          badges={badges}
          onMenuOpen={() => setMobileOpen(true)}
        />

        {/* <DashboardInsight role={role} /> */}

        <main className="flex-1 px-4 py-3 sm:px-6 lg:px-4 lg:py-3">
          {children}
        </main>
      </div>
    </div>
  );
}
