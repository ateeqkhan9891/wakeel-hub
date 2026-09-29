import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";

import { formatDate } from "@/lib/utils";

type LawyerDashboardSubscriptionProps = {
  plan?: string | null;
  isSubscribed: boolean;
  expiresAt?: string | null;
};

function SubscriptionLabel({ plan }: { plan: string | null | undefined }) {
  if (plan === "pro") return "Wakeel360 Pro";
  if (plan === "commission") return "Pay-as-you-go";
  return "No active plan";
}

export function LawyerDashboardSubscription({
  plan,
  isSubscribed,
  expiresAt,
}: LawyerDashboardSubscriptionProps) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 sm:rounded-3xl sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold text-slate-950">
            Subscription status
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Your public visibility depends on active verification and subscription.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Current plan
            </p>

            <p className="mt-1 font-heading text-xl font-semibold text-slate-950">
              <SubscriptionLabel plan={plan} />
            </p>
          </div>

          <StatusBadge status={isSubscribed ? "active" : "inactive"} />
        </div>

        {expiresAt && (
          <p className="mt-3 text-sm text-slate-600">
            Expires {formatDate(expiresAt)}
          </p>
        )}

        {!isSubscribed && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
            Your profile is not publicly visible until your subscription is active.
          </div>
        )}

        <Button
          asChild
          className="mt-4 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800"
        >
          <Link href="/dashboard/lawyer/billing">
            {isSubscribed ? "Manage plan" : "Upgrade / Renew"}
          </Link>
        </Button>
      </div>
    </Card>
  );
}
