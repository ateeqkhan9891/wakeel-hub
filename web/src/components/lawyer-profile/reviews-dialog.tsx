"use client";

import { Star, BadgeCheck, Quote } from "lucide-react";
import type { Review } from "@/lib/types";
import { cn, formatDate, initials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/shared/rating-stars";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ReviewsDialog({
  reviews,
  rating,
  reviewCount,
  lawyerName,
  children,
}: {
  reviews: Review[];
  rating: number;
  reviewCount: number;
  lawyerName: string;
  children: React.ReactNode;
}) {
  const total = reviews.length || reviewCount || 0;
  const dist = [5, 4, 3, 2, 1].map((star) => {
    const n = reviews.filter((r) => Math.round(r.rating) === star).length;
    return { star, n, pct: reviews.length ? Math.round((n / reviews.length) * 100) : 0 };
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[88vh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border bg-secondary/30 px-6 py-5">
          <DialogTitle className="font-heading text-lg">Client reviews</DialogTitle>
          <p className="text-sm text-muted-foreground">Verified feedback for {lawyerName}</p>

          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex shrink-0 flex-col items-center rounded-2xl border border-border bg-card px-6 py-3 text-center">
              <span className="font-heading text-4xl font-bold text-foreground">{rating.toFixed(1)}</span>
              <RatingStars rating={rating} />
              <span className="mt-1 text-xs text-muted-foreground">{total} review{total === 1 ? "" : "s"}</span>
            </div>
            <div className="flex-1 space-y-1.5">
              {dist.map((d) => (
                <div key={d.star} className="flex items-center gap-2">
                  <span className="flex w-7 shrink-0 items-center gap-0.5 text-xs text-muted-foreground">{d.star}<Star className="h-3 w-3 fill-gold text-gold" /></span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className="w-7 shrink-0 text-right text-xs text-muted-foreground">{d.n}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[52vh] space-y-3 overflow-y-auto px-6 py-5">
          {reviews.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No published reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 shrink-0 ring-1 ring-border">
                    <AvatarImage src={review.avatarUrl} alt={review.clientName} />
                    <AvatarFallback className="bg-primary/5 text-sm font-semibold text-primary">{initials(review.clientName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                          {review.clientName}
                          <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" aria-label="Verified client" />
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(review.date)}</p>
                      </div>
                      <RatingStars rating={review.rating} />
                    </div>
                    <Badge variant="outline" className="mt-2.5 rounded-full bg-secondary/40 text-xs font-normal">{review.caseType}</Badge>
                    <p className="mt-2.5 flex gap-2 text-sm leading-6 text-muted-foreground">
                      <Quote className="mt-1 h-3.5 w-3.5 shrink-0 -scale-x-100 text-gold/60" />
                      {review.comment}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ReviewTagButton({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" className={cn("cursor-pointer transition-colors", className)}>
      {children}
    </button>
  );
}
