import type { Metadata } from "next";
import { Briefcase, ScrollText, PauseCircle, CheckCircle2, XCircle, Archive } from "lucide-react";

import { AdminStat } from "@/components/dashboard/admin/admin-ui";
import { AdminCasesTable } from "@/components/dashboard/admin/admin-cases-table";
import { getAdminCases } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Cases" };

const OPEN = ["pending", "active", "in_progress"];

export default async function AdminCasesPage() {
  const cases = await getAdminCases(300);
  const open = cases.filter((c) => OPEN.includes(c.status)).length;
  const adjourned = cases.filter((c) => c.status === "adjourned").length;
  const won = cases.filter((c) => c.status === "won").length;
  const lost = cases.filter((c) => c.status === "lost").length;
  const closed = cases.filter((c) => c.status === "closed" || c.status === "archived").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">Cases</h1>
        <p className="mt-1 text-sm text-slate-500">A platform-wide view of cases being managed between clients and advocates.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <AdminStat icon={Briefcase} tone="navy" label="Total" value={cases.length} />
        <AdminStat icon={ScrollText} tone="gold" label="Open" value={open} />
        <AdminStat icon={PauseCircle} tone="gold" label="Adjourned" value={adjourned} />
        <AdminStat icon={CheckCircle2} tone="emerald" label="Won" value={won} />
        <AdminStat icon={XCircle} tone="rose" label="Lost" value={lost} />
        <AdminStat icon={Archive} tone="slate" label="Closed" value={closed} />
      </div>

      <AdminCasesTable cases={cases} />
    </div>
  );
}
