import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type AdminTone = "navy" | "gold" | "emerald" | "rose" | "blue" | "slate";

const TONES: Record<AdminTone, string> = {
  navy: "bg-primary/8 text-primary",
  gold: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  rose: "bg-rose-50 text-rose-600",
  blue: "bg-blue-50 text-blue-600",
  slate: "bg-slate-100 text-slate-500",
};

/** Compact white metric card used across the admin panel. */
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
  return (
    <Card className="rounded-xl border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 ring-0">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", TONES[tone])}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
      {helper && <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>}
    </Card>
  );
}

/** Standard admin section card with a heading + optional action slot. */
export function AdminSection({
  title,
  icon: Icon,
  action,
  children,
  className,
}: {
  title: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-slate-200 p-5 ring-0", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-slate-950">
          {Icon && <Icon className="h-4 w-4 text-gold" />} {title}
        </h2>
        {action}
      </div>
      {children}
    </Card>
  );
}
