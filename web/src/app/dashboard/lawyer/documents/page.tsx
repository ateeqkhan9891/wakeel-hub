import type { Metadata } from "next";

import { getLawyerDocuments } from "@/lib/data/lawyer-documents";
import { DashboardPageHeader } from "@/components/dashboard/lawyer/lawyer-dashboard-ui";
import { LawyerDocumentsLibrary } from "@/components/dashboard/lawyer/lawyer-documents-library";

export const metadata: Metadata = { title: "Documents" };

export default async function LawyerDocumentsPage() {
  const data = await getLawyerDocuments();

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Documents" description="Upload, share, and download case documents from one library." />
      <LawyerDocumentsLibrary data={data} />
    </div>
  );
}
