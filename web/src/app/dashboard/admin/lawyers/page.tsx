import type { Metadata } from "next";
import { Clock, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

import { VerificationQueue } from "@/components/dashboard/admin/verification-queue";
import { AdminStat } from "@/components/dashboard/admin/admin-ui";
import { getAdminVerificationRequests } from "@/lib/data/admin-verifications";

export const metadata: Metadata = { title: "Lawyer Verification" };

export default async function AdminLawyersPage() {
  const requests = await getAdminVerificationRequests();
  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "approved").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">Lawyer Verification</h1>
        <p className="mt-1 text-sm text-slate-500">Review Bar Council credentials and supporting documents before approving advocates to go live.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AdminStat icon={Clock} tone="gold" label="Pending" value={pending} helper="Awaiting review" />
        <AdminStat icon={CheckCircle2} tone="emerald" label="Approved" value={approved} helper="Verified advocates" />
        <AdminStat icon={XCircle} tone="rose" label="Rejected" value={rejected} helper="Declined applications" />
        <AdminStat icon={ShieldCheck} tone="navy" label="Total requests" value={requests.length} helper="All submissions" />
      </div>

      <VerificationQueue requests={requests} />
    </div>
  );
}
