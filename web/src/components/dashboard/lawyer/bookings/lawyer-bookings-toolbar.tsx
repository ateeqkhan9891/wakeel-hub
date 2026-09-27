"use client";

import { Card } from "@/components/ui/card";

import type { BookingStatusEnum } from "@/lib/supabase/types";

type LawyerBookingsToolbarProps = {
  tab: "all" | BookingStatusEnum;
  counts: Record<string, number>;
  onTabChange: (value: "all" | BookingStatusEnum) => void;
};

const TABS: {
  label: string;
  value: "all" | BookingStatusEnum;
}[] = [
  { label: "All", value: "all" },
  { label: "New requests", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Declined", value: "rejected" },
];

export function LawyerBookingsToolbar({
  tab,
  counts,
  onTabChange,
}: LawyerBookingsToolbarProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm shadow-slate-200/40">
      <div className="px-3 sm:px-4">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((item) => {
            const active = tab === item.value;
            const count = counts[item.value] ?? 0;

            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={active}
                onClick={() => onTabChange(item.value)}
                className={
                  active
                    ? "relative inline-flex shrink-0 items-center gap-2 px-3 py-3 text-sm font-semibold text-slate-950"
                    : "inline-flex shrink-0 items-center gap-2 px-3 py-3 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                }
              >
                {item.label}

                <span
                  className={
                    active
                      ? "inline-flex min-w-5 items-center justify-center rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700"
                      : "inline-flex min-w-5 items-center justify-center rounded-full bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-500"
                  }
                >
                  {count}
                </span>

                {active && (
                  <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-slate-950" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}