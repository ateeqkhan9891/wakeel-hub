import { Activity, ArrowUpRight, Clock3 } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type {
  ActivityItem,
  ActivityTone,
} from "./admin-overview-types";

const TONE_STYLES: Record<
  ActivityTone,
  {
    icon: string;
    dot: string;
  }
> = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
  },
  primary: {
    icon: "bg-primary/8 text-primary",
    dot: "bg-primary",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
  rose: {
    icon: "bg-rose-50 text-rose-600",
    dot: "bg-rose-500",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
  },
};

type AdminPlatformActivityProps = {
  activities: ActivityItem[];
};

export function AdminPlatformActivity({
  activities,
}: AdminPlatformActivityProps) {
  return (
    <Card className="border-slate-200 p-5 ring-0">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8 text-primary">
              <Activity className="h-4 w-4" aria-hidden />
            </span>

            <div>
              <h2 className="font-heading text-sm font-semibold text-slate-950">
                Recent platform activity
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Latest events across the platform
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/admin/reports"
          className="hidden items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950 sm:flex"
        >
          View reports
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      {activities.length === 0 ? (
        <EmptyActivity />
      ) : (
        <div className="relative">
          <div className="absolute bottom-5 left-[15px] top-5 w-px bg-slate-200" />

          <div className="space-y-0.5">
            {activities.slice(0, 8).map((activity, index) => (
              <ActivityRow
                key={activity.id}
                activity={activity}
                isLast={index === Math.min(activities.length, 8) - 1}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function ActivityRow({
  activity,
  isLast,
}: {
  activity: ActivityItem;
  isLast: boolean;
}) {
  const Icon = activity.icon;
  const styles = TONE_STYLES[activity.tone];

  return (
    <div
      className={cn(
        "group relative flex gap-3 rounded-xl px-1 py-3 transition-colors hover:bg-slate-50/70",
        !isLast && "mb-0",
      )}
    >
      <div className="relative z-10 flex shrink-0">
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg ring-4 ring-white",
            styles.icon,
          )}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm leading-5 text-slate-700">
          {activity.text}
        </p>

        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-400">
          <Clock3 className="h-3 w-3" aria-hidden />
          <span>{activity.when}</span>
        </div>
      </div>

      <span
        className={cn(
          "mt-3 h-1.5 w-1.5 shrink-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100",
          styles.dot,
        )}
      />
    </div>
  );
}

function EmptyActivity() {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
        <Activity className="h-4 w-4" aria-hidden />
      </span>

      <p className="mt-3 text-sm font-semibold text-slate-700">
        No recent activity
      </p>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
        Platform activity will appear here as users, lawyers, and clients
        interact with WakeelHub.
      </p>
    </div>
  );
}