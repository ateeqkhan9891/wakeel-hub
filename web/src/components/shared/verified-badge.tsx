import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedBadge({ className, label = "Verified Advocate" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/15",
        className
      )}
    >
      <BadgeCheck className="h-3.5 w-3.5 text-gold" strokeWidth={2.25} />
      {label}
    </span>
  );
}
