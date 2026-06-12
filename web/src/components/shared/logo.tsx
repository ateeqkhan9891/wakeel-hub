import Link from "next/link";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, iconOnly }: { className?: string; iconOnly?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 group", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
        <Scale className="h-5 w-5" strokeWidth={2.25} />
      </span>
      {!iconOnly && (
        <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
          WakeelHub <span className="text-gold">Pakistan</span>
        </span>
      )}
    </Link>
  );
}
