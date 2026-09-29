import { BadgeCheck } from "lucide-react";

import { cn } from "@/lib/utils";

export function VerifiedBadge({
  className,
  label = "Verified Advocate",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600",
        className,
      )}
    >
      <BadgeCheck className="h-3 w-3" strokeWidth={2.25} />
      {label}
    </span>
  );
}
