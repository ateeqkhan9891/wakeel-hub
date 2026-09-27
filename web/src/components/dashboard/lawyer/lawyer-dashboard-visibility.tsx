import Link from "next/link";

import {
  Eye,
  MousePointerClick,
  SearchCheck,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type LawyerDashboardVisibilityProps = {
  conversionRate: number | null;
};

function VisibilityMetric({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Icon className="h-4 w-4 text-amber-600" />
        {label}
      </div>

      <p className="mt-3 font-heading text-lg font-semibold text-slate-950 sm:text-xl">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {helper}
      </p>
    </div>
  );
}

export function LawyerDashboardVisibility({
  conversionRate,
}: LawyerDashboardVisibilityProps) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 sm:rounded-3xl sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold text-slate-950">
            Lawyer growth & visibility
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Visibility analytics help advocates understand how clients
            discover and engage with their profile.
          </p>
        </div>

        <div className="w-full shrink-0 sm:w-auto">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full rounded-xl sm:w-auto"
          >
            <Link href="/dashboard/lawyer/analytics">
              Open analytics
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <VisibilityMetric
          icon={Eye}
          label="Profile views this month"
          value="-"
          helper="No event table yet"
        />

        <VisibilityMetric
          icon={SearchCheck}
          label="Search appearances"
          value="-"
          helper="Search tracking not connected"
        />

        <VisibilityMetric
          icon={MousePointerClick}
          label="Client clicks"
          value="-"
          helper="Click tracking not connected"
        />

        <VisibilityMetric
          icon={TrendingUp}
          label="Booking conversion"
          value={conversionRate === null ? "-" : `${conversionRate}%`}
          helper={
            conversionRate === null
              ? "No bookings yet"
              : "Confirmed or completed requests"
          }
        />
      </div>
    </Card>
  );
}