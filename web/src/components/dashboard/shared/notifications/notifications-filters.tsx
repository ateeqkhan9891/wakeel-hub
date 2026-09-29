"use client";

import { cn } from "@/lib/utils";

type NotificationFilter = {
  key: string;
  label: string;
};

type NotificationsFiltersProps = {
  filters: NotificationFilter[];
  counts: Record<string, number>;
  activeFilter: string;
  onFilterChange: (value: string) => void;
};

export function NotificationsFilters({
  filters,
  counts,
  activeFilter,
  onFilterChange,
}: NotificationsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {filters.map((filter) => {
        const active = activeFilter === filter.key;
        const count = counts[filter.key] ?? 0;

        return (
          <button
            key={filter.key}
            type="button"
            aria-pressed={active}
            onClick={() => onFilterChange(filter.key)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950",
            )}
          >
            {filter.label}

            {count > 0 && (
              <span
                className={cn(
                  "inline-flex min-w-4.5 items-center justify-center rounded-md px-1 py-0.5 text-[10px] font-semibold leading-none",
                  active
                    ? "bg-white/15 text-primary-foreground"
                    : "bg-slate-100 text-slate-500",
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
