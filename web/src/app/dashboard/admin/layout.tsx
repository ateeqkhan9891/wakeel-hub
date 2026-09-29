import { DashboardShell } from "@/components/dashboard/shared/dashboard-shell";
import { requireUser } from "@/lib/supabase/guard";
import { getPendingVerificationCount } from "@/lib/data/admin-verifications";
import { getAdminComplaints } from "@/lib/data/admin";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireUser("admin");
  const [pendingVerifications, complaints] = await Promise.all([getPendingVerificationCount(), getAdminComplaints()]);
  const openReports = complaints.filter((r) => r.status === "open" || r.status === "investigating").length;
  const name = profile.full_name || "Administrator";

  return (
    <DashboardShell
      role="admin"
      user={{ name, email: profile.email, avatarSeed: name }}
      badges={{ verifications: pendingVerifications, reports: openReports }}
    >
      {children}
    </DashboardShell>
  );
}

