
import Link from "next/link";

import { Bell, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

type NotificationEmptyStateProps = {
  filtered?: boolean;
};

export function NotificationEmptyState({
  filtered = false,
}: NotificationEmptyStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
        <Bell className="h-5 w-5" aria-hidden />
      </span>

      <h3 className="mt-3 font-heading text-sm font-semibold text-slate-950">
        You&apos;re all caught up
      </h3>

      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
        {filtered
          ? "No notifications match this filter."
          : "No new notifications at the moment."}
      </p>

      {!filtered && (
        <Button
          asChild
          variant="outline"
          size="sm"
          className="mt-5 gap-1.5"
        >
          <Link href="/dashboard/lawyer/settings">
            <SlidersHorizontal className="h-4 w-4" />
            Notification preferences
          </Link>
        </Button>
      )}
    </div>
  );
}
