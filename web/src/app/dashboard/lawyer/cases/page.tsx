import type { Metadata } from "next";

import { getLawyerCases } from "@/lib/data/cases";
import { DashboardPageHeader } from "@/components/dashboard/lawyer/lawyer-dashboard-ui";
import { LawyerCasesWorkspace } from "@/components/dashboard/lawyer/lawyer-cases-workspace";

export const metadata: Metadata = { title: "Cases" };

export default async function LawyerCasesPage() {
  const cases = await getLawyerCases();

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Cases"
        description="Create and manage your case files. Cases are private to your account - add one manually or it's created automatically when a client hires you."
      />
      <LawyerCasesWorkspace cases={cases} />
    </div>
  );
}
