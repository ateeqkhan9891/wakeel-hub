import type { Metadata } from "next";

import { getLawyerCases } from "@/lib/data/cases";

// import { DashboardPageHeader } from "@/components/dashboard/lawyer/lawyer-dashboard-ui";

import { LawyerCasesLive } from "@/components/dashboard/lawyer/cases/lawyer-cases-live";

export const metadata: Metadata = {
  title: "Cases",
};

export default async function LawyerCasesPage() {
  const cases = await getLawyerCases();

  return (
    <div className="space-y-8">
      {/* <DashboardPageHeader
        title="Cases"
        description="Manage your active matters, track hearings, and stay on top of client work."
      /> */}

      <LawyerCasesLive cases={cases} />
    </div>
  );
}
