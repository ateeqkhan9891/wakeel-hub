import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  size = "sm",
  showValue = false,
  className,
}: {
  rating: number;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}) {
  const starSize = size === "md" ? "h-4.5 w-4.5" : "h-3.5 w-3.5";
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.min(Math.max(rating - i, 0), 1);
          return (
            <span key={i} className="relative inline-block">
              <Star className={cn(starSize, "text-muted-foreground/30")} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={cn(starSize, "fill-gold text-gold")} />
              </span>
            </span>
          );
        })}
      </div>
      {showValue && <span className="text-sm font-medium text-foreground">{rating.toFixed(1)}</span>}
    </div>
  );
}
