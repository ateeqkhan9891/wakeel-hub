
"use client";

import { useMemo, useState, useTransition } from "react";

import { CheckCheck, Trash2, SlidersHorizontal } from "lucide-react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import type { NotificationRow } from "@/lib/data/notifications";
import type { NotificationTypeEnum } from "@/lib/supabase/types";

import {
  clearReadNotifications,
  markAllNotificationsRead,
} from "@/app/actions/booking-actions";

import { NotificationsSummary } from "./notifications-summary";
import { NotificationsFilters } from "./notifications-filters";
import { NotificationCard } from "./notification-card";
import { NotificationEmptyState } from "./notification-empty-state";

const FILTERS: {
  key: string;
  label: string;
  match: (type: NotificationTypeEnum) => boolean;
}[] = [
  {
    key: "all",
    label: "All",
    match: () => true,
  },
  {
    key: "unread",
    label: "Unread",
    match: () => true,
  },
  {
    key: "booking",
    label: "Bookings",
    match: (type) => type === "booking",
  },
  {
    key: "case",
    label: "Cases",
    match: (type) => type === "case",
  },
  {
    key: "payment",
    label: "Payments",
    match: (type) => type === "payment",
  },
  {
    key: "message",
    label: "Messages",
    match: (type) => type === "message",
  },
  {
    key: "hearing",
    label: "Hearings",
    match: (type) => type === "hearing",
  },
  {
    key: "verification",
    label: "Verification",
    match: (type) => type === "verification",
  },
  {
    key: "system",
    label: "System",
    match: (type) => type === "system",
  },
];

const BUCKET_ORDER = [
  "Today",
  "Yesterday",
  "Earlier this week",
  "Earlier this month",
  "Older",
];

function startOfDay(date: Date) {
  const value = new Date(date);

  value.setHours(0, 0, 0, 0);

  return value.getTime();
}

function timeBucket(iso: string) {
  const today = startOfDay(new Date());
  const day = startOfDay(new Date(iso));
  const diffDays = Math.round(
    (today - day) / 86_400_000,
  );

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "Earlier this week";
  if (diffDays <= 31) return "Earlier this month";

  return "Older";
}

export function NotificationsFeed({
  notifications,
}: {
  notifications: NotificationRow[];
}) {
  const router = useRouter();

  const [marking, startMark] = useTransition();
  const [clearing, startClear] = useTransition();

  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read,
  ).length;

  const readCount = notifications.length - unreadCount;

  const summary = useMemo(() => {
    const countByType = (
      type: NotificationTypeEnum,
    ) =>
      notifications.filter(
        (notification) => notification.type === type,
      ).length;

    return {
      unread: unreadCount,
      booking: countByType("booking"),
      case: countByType("case"),
      payment: countByType("payment"),
      verification: countByType("verification"),
    };
  }, [notifications, unreadCount]);

  const counts = useMemo(() => {
    const result: Record<string, number> = {};

    for (const item of FILTERS) {
      result[item.key] =
        item.key === "unread"
          ? unreadCount
          : notifications.filter((notification) =>
              item.match(notification.type),
            ).length;
    }

    return result;
  }, [notifications, unreadCount]);

  const visibleFilters = FILTERS.filter(
    (item) =>
      item.key === "all" ||
      item.key === "unread" ||
      counts[item.key] > 0,
  );

  const filtered = useMemo(() => {
    if (filter === "all") {
      return notifications;
    }

    if (filter === "unread") {
      return notifications.filter(
        (notification) => !notification.is_read,
      );
    }

    const selectedFilter = FILTERS.find(
      (item) => item.key === filter,
    );

    return selectedFilter
      ? notifications.filter((notification) =>
          selectedFilter.match(notification.type),
        )
      : notifications;
  }, [notifications, filter]);

  const grouped = useMemo(() => {
    const groups = new Map<string, NotificationRow[]>();

    for (const notification of filtered) {
      const bucket = timeBucket(notification.created_at);
      const existing = groups.get(bucket);

      if (existing) {
        existing.push(notification);
      } else {
        groups.set(bucket, [notification]);
      }
    }

    return BUCKET_ORDER.filter((bucket) =>
      groups.has(bucket),
    ).map((bucket) => ({
      bucket,
      items: groups.get(bucket) ?? [],
    }));
  }, [filtered]);

  function markAll() {
    startMark(async () => {
      const result = await markAllNotificationsRead();

      if (!result.ok) {
        toast.error("Could not update notifications", {
          description: result.error,
        });

        return;
      }

      router.refresh();
    });
  }

  function clearRead() {
    if (
      !window.confirm(
        "Permanently delete all read notifications? This cannot be undone.",
      )
    ) {
      return;
    }

    startClear(async () => {
      const result = await clearReadNotifications();

      if (!result.ok) {
        toast.error("Could not clear notifications", {
          description: result.error,
        });

        return;
      }

      toast.success("Read notifications cleared");

      router.refresh();
    });
  }

  if (notifications.length === 0) {
    return <NotificationEmptyState />;
  }

  return (
    <div className="space-y-6">
      <NotificationsSummary {...summary} />

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={markAll}
          disabled={marking || unreadCount === 0}
          className="gap-1.5"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all read
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={clearRead}
          disabled={clearing || readCount === 0}
          className="gap-1.5 text-slate-600"
        >
          <Trash2 className="h-4 w-4" />
          Clear read
        </Button>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="gap-1.5"
        >
          <a href="/dashboard/lawyer/settings">
            <SlidersHorizontal className="h-4 w-4" />
            Preferences
          </a>
        </Button>
      </div>

      <NotificationsFilters
        filters={visibleFilters}
        counts={counts}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      {filtered.length === 0 ? (
        <NotificationEmptyState filtered />
      ) : (
        <div className="space-y-6">
          {grouped.map(({ bucket, items }) => (
            <div key={bucket}>
              <p className="mb-2.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                {bucket}
              </p>

              <div className="space-y-2.5">
                {items.map((notification) => (
                  <NotificationCard
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
  );
}