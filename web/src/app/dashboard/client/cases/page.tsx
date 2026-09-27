import type { Metadata } from "next";

import { getClientCases } from "@/lib/data/client-cases";
import { getMyNotifications } from "@/lib/data/notifications";
import { ClientCasesList } from "@/components/dashboard/client/client-cases-list";

export const metadata: Metadata = { title: "My Cases" };

export default async function ClientCasesPage() {
  const [cases, notifications] = await Promise.all([getClientCases(), getMyNotifications()]);
  const unreadUpdates = notifications.filter((n) => !n.is_read && (n.type === "case" || n.type === "hearing")).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">My Cases</h1>
        <p className="mt-1 text-sm text-slate-500">Track every case your advocate is handling - status, hearings, and progress in one place.</p>
      </div>
      <ClientCasesList cases={cases} unreadUpdates={unreadUpdates} />
    </div>
  );
}
