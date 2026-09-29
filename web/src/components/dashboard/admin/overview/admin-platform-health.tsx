import {
  Activity,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AdminStats } from "@/lib/data/admin";

type AdminPlatformHealthProps = {
  stats: AdminStats;
  verifiedShare: number;
  approvalRate: number;
  caseActivityRate: number;
};

export function AdminPlatformHealth({
  stats,
  verifiedShare,
  approvalRate,
  caseActivityRate,
}: AdminPlatformHealthProps) {
  return (
    <Card className="border-slate-200 p-5 ring-0">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Activity className="h-4 w-4" aria-hidden />
          </span>

          <h2 className="font-heading text-sm font-semibold text-slate-950">
            Platform health
          </h2>
        </div>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          Key operational indicators across the platform.
        </p>
      </div>

      <div className="space-y-5">
        <HealthMetric
          icon={ShieldCheck}
          label="Lawyer verification"
          value={verifiedShare}
          helper={`${stats.verifiedLawyers} of ${stats.totalLawyers} lawyers verified`}
        />

        <HealthMetric
          icon={CheckCircle2}
          label="Verification approval"
          value={approvalRate}
          helper={`${stats.verifiedLawyers} approved · ${stats.rejectedVerifications} rejected`}
        />

        <HealthMetric
          icon={TrendingUp}
          label="Active case ratio"
          value={caseActivityRate}
          helper={`${stats.activeCases} of ${stats.totalCases} cases active`}
        />
      </div>
    </Card>
  );
}

function HealthMetric({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: number;
  helper: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Icon
            className="h-3.5 w-3.5 shrink-0 text-slate-400"
            aria-hidden
          />

          <span className="truncate text-xs font-medium text-slate-700">
            {label}
          </span>
        </div>

        <span className="shrink-0 text-xs font-semibold text-slate-900">
          {value}%
        </span>
      </div>

      <Progress
        value={Math.min(Math.max(value, 0), 100)}
        className="h-1.5"
      />

      <p className="mt-1.5 text-[11px] leading-4 text-slate-400">
        {helper}
      </p>
    </div>
  );
}