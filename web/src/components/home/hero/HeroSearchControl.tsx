import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface HeroSearchControlProps {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
  className?: string;
}

export function HeroSearchControl({
  icon: Icon,
  label,
  children,
  className,
}: HeroSearchControlProps) {
  return (
    <div
      className={cn(
        "min-w-0 border-b border-slate-200 pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-4",
        className,
      )}
    >
      <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon className="h-3.5 w-3.5 text-slate-400" aria-hidden />
        {label}
      </div>

      {children}
    </div>
  );
}