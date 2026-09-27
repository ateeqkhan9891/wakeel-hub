import Link from "next/link";

import {
  ArrowRight,
  CalendarCheck,
  Gavel,
  type LucideIcon,
} from "lucide-react";

import { LawyerOverviewRequests } from "@/components/dashboard/lawyer/lawyer-overview-requests";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type LawyerDashboardRequestsProps = {
  requests: Parameters<typeof LawyerOverviewRequests>[0]["requests"];
};

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h2 className="font-heading text-base font-semibold text-slate-950">
          {title}
        </h2>

        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="w-full shrink-0 sm:w-auto">
          {action}
        </div>
      )}
    </div>
  );
}

function RequestsEmptyState() {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
      <div className="flex flex-col items-center px-5 py-7 text-center sm:px-8 sm:py-8">
        <div className="relative">
          <span className="absolute -inset-2 rounded-3xl bg-emerald-100/60 blur-md" />

          <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-emerald-600 shadow-sm">
            <CalendarCheck className="h-6 w-6" />
          </span>
        </div>

        <div className="mt-5 max-w-md">
          <h3 className="font-heading text-base font-semibold text-slate-950">
            You&apos;re all caught up
          </h3>

          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            There are no consultation requests waiting for your response.
            New client requests will appear here automatically.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button
            asChild
            size="sm"
            className="rounded-xl bg-slate-950 px-4 text-white hover:bg-slate-800"
          >
            <Link href="/dashboard/lawyer/profile">
              Improve your profile
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-xl border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50 hover:text-slate-950"
          >
            <Link href="/dashboard/lawyer/bookings">
              View bookings
            </Link>
          </Button>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white/70 px-5 py-3.5 sm:px-6">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <Gavel className="h-3.5 w-3.5 text-slate-400" />
          <span>
            Keep your profile and availability up to date to stay ready for
            new clients.
          </span>
        </div>
      </div>
    </div>
  );
}

export function LawyerDashboardRequests({
  requests,
}: LawyerDashboardRequestsProps) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 sm:rounded-3xl sm:p-5">
      <SectionHeader
        title="New consultation requests"
        description="Review client requests and respond when you are ready to take the consultation."
        action={
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full rounded-xl sm:w-auto"
          >
            <Link href="/dashboard/lawyer/bookings">
              All bookings
            </Link>
          </Button>
        }
      />

      {requests.length === 0 ? (
        <RequestsEmptyState />
      ) : (
        <div className="mt-5">
          <LawyerOverviewRequests requests={requests.slice(0, 5)} />
        </div>
      )}
    </Card>
  );
}