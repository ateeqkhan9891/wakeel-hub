import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type KickerProps = {
  children: ReactNode;
  dark?: boolean;
  className?: string;
};

export function Kicker({
  children,
  dark = false,
  className,
}: KickerProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]",
        dark
          ? "border-white/15 bg-white/[0.06] text-white/70"
          : "border-zinc-200 bg-white text-zinc-600 shadow-sm",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          dark ? "bg-amber-400" : "bg-amber-500",
        )}
      />
      {children}
    </span>
  );
}