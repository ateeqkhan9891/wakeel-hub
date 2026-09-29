import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type AdminTone =
  | "navy"
  | "gold"
  | "emerald"
  | "rose"
  | "blue"
  | "slate";

const TONES: Record<
  AdminTone,
  {
    icon: string;
    accent: string;
  }
> = {
  navy: {
    icon: "bg-primary/8 text-primary",
    accent: "bg-primary",
  },
  gold: {
    icon: "bg-amber-50 text-amber-600",
    accent: "bg-amber-500",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    accent: "bg-emerald-500",
  },
  rose: {
    icon: "bg-rose-50 text-rose-600",
    accent: "bg-rose-500",
  },
  blue: {
    icon: "bg-blue-50 text-blue-600",
    accent: "bg-blue-500",
  },
  slate: {
    icon: "bg-slate-100 text-slate-500",
    accent: "bg-slate-400",
  },
};

export function AdminStat({
  icon: Icon,
  label,
  value,
  helper,
  tone = "navy",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  helper?: string;
  tone?: AdminTone;
}) {
  const styles = TONES[tone];

  return (
    <Card className="group relative overflow-hidden rounded-none border-0 bg-white p-5 shadow-none ring-0 transition-colors hover:bg-slate-50/70">
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-0.5 opacity-0 transition-opacity group-hover:opacity-100",
          styles.accent,
        )}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            {label}
          </p>

          <p className="mt-3 truncate text-2xl font-semibold tracking-tight text-slate-950 sm:text-[26px]">
            {value}
          </p>

          {helper && (
            <p className="mt-1.5 truncate text-xs leading-5 text-slate-500">
              {helper}
            </p>
          )}
        </div>

        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105",
            styles.icon,
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </Card>
  );
}

export function AdminSection({
  title,
  icon: Icon,
  action,
  children,
  className,
}: {
  title: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-slate-200 p-5 ring-0", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-slate-950">
          {Icon && <Icon className="h-4 w-4 text-gold" />}
          {title}
        </h2>
        {action}
      </div>

      {children}
    </Card>
  );
}