import {
  CalendarCheck,
  Clock,
  CreditCard,
  Gavel,
  MessageSquare,
  Settings,
  ShieldCheck,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

import type { NotificationRow } from "@/lib/data/notifications";
import type { NotificationTypeEnum } from "@/lib/supabase/types";

import { cn, timeAgo } from "@/lib/utils";

type ClientRecentActivityProps = {
  notifications: NotificationRow[];
};

const ACTIVITY_ICON: Record<
  NotificationTypeEnum,
  { icon: LucideIcon; cls: string; dot: string }
> = {
  booking: {
    icon: CalendarCheck,
    cls: "bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
  },
  case: {
    icon: Gavel,
    cls: "bg-slate-100 text-slate-700",
    dot: "bg-slate-600",
  },
  payment: {
    icon: CreditCard,
    cls: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
  message: {
    icon: MessageSquare,
    cls: "bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
  },
  hearing: {
    icon: Clock,
    cls: "bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
  },
  verification: {
    icon: ShieldCheck,
    cls: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
  system: {
    icon: Settings,
    cls: "bg-slate-100 text-slate-500",
    dot: "bg-slate-400",
  },
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function activityBucket(iso: string): string {
  const diff = Math.round(
    (startOfDay(new Date()) - startOfDay(new Date(iso))) /
      86_400_000,
  );

  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff <= 7) return "Earlier this week";

  return "Earlier";
}

const BUCKET_ORDER = [
  "Today",
  "Yesterday",
  "Earlier this week",
  "Earlier",
];

function ActivityRow({
  notification,
  isLast,
}: {
  notification: NotificationRow;
  isLast: boolean;
}) {
  const meta =
    ACTIVITY_ICON[notification.type] ?? ACTIVITY_ICON.system;

  const Icon = meta.icon;

  return (
    <div className="relative flex gap-3">
      {!isLast && (
        <div className="absolute bottom-0 left-[15px] top-9 w-px bg-slate-100" />
      )}

      <div
        className={cn(
          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
          meta.cls,
        )}
      >
        <Icon
          className="h-3.5 w-3.5"
          strokeWidth={1.8}
          aria-hidden
        />
      </div>

      <div className="min-w-0 flex-1 pb-4">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 text-xs font-semibold leading-5 text-slate-900">
            {notification.title}
          </p>

          <span className="shrink-0 pt-0.5 text-[10px] font-medium text-slate-400">
            {timeAgo(notification.created_at)}
          </span>
        </div>

        {notification.body && (
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-5 text-slate-500">
            {notification.body}
          </p>
        )}
      </div>
    </div>
  );
}

export function ClientRecentActivity({
  notifications,
}: ClientRecentActivityProps) {
  const recentActivity = notifications.slice(0, 7);

  const groupedActivity = BUCKET_ORDER
    .map((bucket) => ({
      bucket,
      items: recentActivity.filter(
        (notification) =>
          activityBucket(notification.created_at) === bucket,
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Card className="relative overflow-hidden border-slate-200 bg-white p-0 shadow-sm ring-0">
      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-50/70 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-8 h-24 w-24 rounded-full border border-slate-100" />
      <div className="pointer-events-none absolute right-9 top-7 h-8 w-8 rounded-full border border-blue-100/70" />

      <div className="relative flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Clock
            className="h-4 w-4"
            strokeWidth={1.8}
            aria-hidden
          />
        </div>

        <div>
          <h2 className="font-heading text-base font-semibold tracking-tight text-slate-950">
            Recent activity
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Your latest account updates
          </p>
        </div>
      </div>

      <div className="relative p-4">
        {groupedActivity.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-8 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200/70">
              <Clock
                className="h-4 w-4"
                strokeWidth={1.8}
                aria-hidden
              />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-950">
              No recent activity
            </p>

            <p className="mt-1 text-xs text-slate-500">
              New bookings, messages, payments, and case updates will
              appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {groupedActivity.map((group) => (
              <div key={group.bucket}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                    {group.bucket}
                  </span>

                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                <div>
                  {group.items.map((notification, index) => (
                    <ActivityRow
                      key={notification.id}
                      notification={notification}
                      isLast={index === group.items.length - 1}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
