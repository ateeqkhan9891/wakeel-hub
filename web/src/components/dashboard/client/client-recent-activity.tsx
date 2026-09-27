
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
  { icon: LucideIcon; cls: string }
> = {
  booking: {
    icon: CalendarCheck,
    cls: "bg-gold/15 text-gold",
  },
  case: {
    icon: Gavel,
    cls: "bg-primary/10 text-primary",
  },
  payment: {
    icon: CreditCard,
    cls: "bg-emerald-50 text-emerald-600",
  },
  message: {
    icon: MessageSquare,
    cls: "bg-blue-50 text-blue-600",
  },
  hearing: {
    icon: Clock,
    cls: "bg-amber-50 text-amber-600",
  },
  verification: {
    icon: ShieldCheck,
    cls: "bg-primary/10 text-primary",
  },
  system: {
    icon: Settings,
    cls: "bg-slate-100 text-slate-500",
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

function ActivityRow({ notification }: { notification: NotificationRow }) {
  const meta = ACTIVITY_ICON[notification.type] ?? ACTIVITY_ICON.system;
  const Icon = meta.icon;

  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          meta.cls,
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900">
          {notification.title}
        </p>

        {notification.body && (
          <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
            {notification.body}
          </p>
        )}

        <p className="mt-1 text-[11px] text-slate-400">
          {timeAgo(notification.created_at)}
        </p>
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
    <Card className="overflow-hidden border-slate-200">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-slate-950">
            Recent activity
          </h2>
        </div>
      </div>

      <div className="p-5">
        {groupedActivity.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            No recent activity.
          </p>
        ) : (
          <div className="space-y-6">
            {groupedActivity.map((group) => (
              <div key={group.bucket}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {group.bucket}
                </p>

                <div className="space-y-4">
                  {group.items.map((notification) => (
                    <ActivityRow
                      key={notification.id}
                      notification={notification}
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