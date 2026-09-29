import {
  CheckCircle2,
  Clock,
  Percent,
  Wallet,
} from "lucide-react";

import type { LawyerEarnings } from "@/lib/data/commission";

import { formatPKR } from "@/lib/utils";

import { StatCard } from "@/components/dashboard/shared/stat-card";

type LawyerEarningsStatsProps = {
  earnings: LawyerEarnings;
};

export function LawyerEarningsStats({
  earnings,
}: LawyerEarningsStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Wallet}
        label="Total earnings (net)"
        value={formatPKR(earnings.totalEarnings)}
        accent="gold"
      />

      <StatCard
        icon={Clock}
        label="Pending payout"
        value={formatPKR(earnings.pendingPayout)}
      />

      <StatCard
        icon={CheckCircle2}
        label="Paid out"
        value={formatPKR(earnings.paidPayout)}
      />

      <StatCard
        icon={Percent}
        label="Commission deducted"
        value={formatPKR(earnings.commissionDeducted)}
      />
    </div>
  );
}
