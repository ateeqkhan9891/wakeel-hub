import Link from "next/link";
import { Scale } from "lucide-react";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  iconOnly?: boolean;
};

export function Logo({
  className,
  iconOnly = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5",
        className
      )}
    >
      <Scale
        className="h-7 w-7 text-primary transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"
        strokeWidth={2.1}
      />

      {!iconOnly && (
        <span className="font-heading text-[1.15rem] font-semibold tracking-[-0.02em] text-foreground">
          Wakeel360
          <span className="ml-1 text-gold">
            Pakistan
          </span>
        </span>
      )}
    </Link>
  );
}
