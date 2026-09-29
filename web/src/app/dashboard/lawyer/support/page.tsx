import type { Metadata } from "next";

import { DashboardPageHeader } from "@/components/dashboard/lawyer/lawyer-dashboard-ui";
import { ComplaintForm } from "@/components/dashboard/client/complaint-form";

export const metadata: Metadata = { title: "Support" };

export default function LawyerSupportPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Support & Reports" description="File a complaint or report a booking, payment, case, or account issue." />
      <ComplaintForm />
    </div>
  );
}

