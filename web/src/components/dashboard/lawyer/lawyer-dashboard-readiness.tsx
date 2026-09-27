import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  BriefcaseBusiness,
} from "lucide-react";

import { Card } from "@/components/ui/card";

type LawyerDashboardReadinessProps = {
  isVerified: boolean;
  isSubscribed: boolean;
  activeCases: number;
  availabilityConfigured: boolean;
};

function ReadinessTile({
  label,
  done,
  detail,
}: {
  label: string;
  done: boolean;
  detail: string;
}) {
  return (
    <div
      className={
        done
          ? "rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4"
          : "rounded-2xl border border-amber-200 bg-amber-50/50 p-4"
      }
    >
      <div className="flex items-start gap-3">
        <span
          className={
            done
              ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm"
              : "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm"
          }
        >
          {done ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
        </span>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">
            {label}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}

export function LawyerDashboardReadiness({
  isVerified,
  isSubscribed,
  activeCases,
  availabilityConfigured,
}: LawyerDashboardReadinessProps) {
  const ready =
    isVerified && isSubscribed && availabilityConfigured;

  return (
    <Card className="rounded-2xl border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 sm:rounded-3xl sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-base font-semibold text-slate-950">
            Practice readiness
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Make sure your account is ready to receive and manage new
            client consultations.
          </p>
        </div>

        <span
          className={
            ready
              ? "hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex"
              : "hidden shrink-0 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 sm:inline-flex"
          }
        >
          {ready ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <CircleDashed className="h-3.5 w-3.5" />
          )}

          {ready ? "Ready" : "Setup needed"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ReadinessTile
          label="Verification"
          done={isVerified}
          detail={
            isVerified
              ? "Your profile is verified."
              : "Complete verification to build client trust."
          }
        />

        <ReadinessTile
          label="Subscription"
          done={isSubscribed}
          detail={
            isSubscribed
              ? "Your subscription is active."
              : "Activate a plan to remain publicly visible."
          }
        />

        <ReadinessTile
          label="Availability"
          done={availabilityConfigured}
          detail={
            availabilityConfigured
              ? "Your consultation availability is configured."
              : "Add your available days and hours."
          }
        />

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
              <BriefcaseBusiness className="h-4 w-4" />
            </span>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                Active cases
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {activeCases > 0
                  ? `${activeCases} active ${
                      activeCases === 1 ? "case" : "cases"
                    } currently in progress.`
                  : "No active cases currently. You're ready for new work."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          ready
            ? "mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
            : "mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4"
        }
      >
        <span
          className={
            ready
              ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm"
              : "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm"
          }
        >
          {ready ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
        </span>

        <div>
          <p
            className={
              ready
                ? "text-sm font-semibold text-emerald-900"
                : "text-sm font-semibold text-amber-900"
            }
          >
            {ready
              ? "Your practice is ready."
              : "A few setup steps remain."}
          </p>

          <p
            className={
              ready
                ? "mt-0.5 text-xs leading-5 text-emerald-800/80"
                : "mt-0.5 text-xs leading-5 text-amber-800/80"
            }
          >
            {ready
              ? "Clients can find you and request consultations based on your configured availability."
              : "Complete the outstanding items above to make your profile fully client-ready."}
          </p>
        </div>
      </div>
    </Card>
  );
}