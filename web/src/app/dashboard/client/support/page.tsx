import type { Metadata } from "next";

import { ComplaintForm } from "@/components/dashboard/client/complaint-form";

export const metadata: Metadata = { title: "Support" };

export default function ClientSupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Support & Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">File a complaint or report a booking, payment, case, or account issue.</p>
      </div>
      <ComplaintForm />
    </div>
  );
}
