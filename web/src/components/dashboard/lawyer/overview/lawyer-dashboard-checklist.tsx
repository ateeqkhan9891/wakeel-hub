import {
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-react";

import Link from "next/link";

import { Card } from "@/components/ui/card";

type ChecklistItem = {
  label: string;
  done: boolean;
  helper: string;
};

type LawyerDashboardChecklistProps = {
  items: ChecklistItem[];
};

export function LawyerDashboardChecklist({
  items,
}: LawyerDashboardChecklistProps) {
  const completed = items.filter((item) => item.done).length;

  const progress =
    items.length > 0
      ? Math.round((completed / items.length) * 100)
      : 0;

  return (
    <Card className="rounded-2xl border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 sm:rounded-3xl sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold text-slate-950">
            Profile completion
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Complete these items to make your profile ready for clients.
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-heading text-xl font-semibold tracking-tight text-slate-950">
            {progress}%
          </p>

          <p className="mt-0.5 text-[10px] font-medium text-slate-400">
            {completed}/{items.length} complete
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {items.map((item) => (
          <div
            key={item.label}
            className={
              item.done
                ? "flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3.5"
                : "group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 transition-colors hover:border-amber-200 hover:bg-amber-50/30"
            }
          >
            <span
              className={
                item.done
                  ? "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-emerald-600"
                  : "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-slate-300"
              }
            >
              {item.done ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </span>

            <div className="min-w-0 flex-1">
              <p
                className={
                  item.done
                    ? "text-sm font-semibold text-slate-700"
                    : "text-sm font-semibold text-slate-950"
                }
              >
                {item.label}
              </p>

              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                {item.helper}
              </p>
            </div>

            {!item.done && (
              <Link
                href="/dashboard/lawyer/profile"
                className="mt-0.5 flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-950"
              >
                Fix
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        ))}
      </div>

      {progress === 100 && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-3">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

          <p className="text-xs font-medium text-emerald-800">
            Your profile is fully completed and ready for clients.
          </p>
        </div>
      )}
    </Card>
  );
}
