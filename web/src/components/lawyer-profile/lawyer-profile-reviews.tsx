import {
  BadgeCheck,
  MessageSquareText,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { RatingStars } from "@/components/shared/rating-stars";
import { ReviewForm } from "@/components/lawyer-profile/review-form";
import { ReviewsDialog } from "@/components/lawyer-profile/reviews-dialog";

import { formatDate, initials } from "@/lib/utils";

import type { Lawyer } from "@/lib/types";

type LawyerProfileReviewsProps = {
  lawyer: Lawyer;
  matterOptions: {
    value: string;
    label: string;
  }[];
};

export function LawyerProfileReviews({
  lawyer,
  matterOptions,
}: LawyerProfileReviewsProps) {
  const visibleReviews = lawyer.reviews.slice(0, 8);
  const hasReviews = visibleReviews.length > 0;
  const totalReviews = lawyer.reviewCount || lawyer.reviews.length;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-50/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full border border-slate-100" />

      <div className="relative mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
          <MessageSquareText className="h-4 w-4" />
        </div>

        <div>
          <h2 className="font-heading text-base font-semibold tracking-tight text-slate-950">
            Client reviews
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Feedback from clients on Wakeel360
          </p>
        </div>
      </div>

      <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-slate-50 p-4">
            <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full border border-blue-100/70" />

            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-blue-100">
                  <span className="font-heading text-2xl font-semibold tracking-tight text-slate-950">
                    {lawyer.rating.toFixed(1)}
                  </span>

                  <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
                    Rating
                  </span>
                </div>

                <div>
                  <RatingStars
                    rating={lawyer.rating}
                    size="md"
                  />

                  <p className="mt-1.5 text-xs text-slate-500">
                    {totalReviews
                      ? `${totalReviews} published ${totalReviews === 1 ? "review" : "reviews"}`
                      : "No published reviews yet"}
                  </p>
                </div>
              </div>

              <Badge
                variant="outline"
                className="rounded-full border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700"
              >
                <BadgeCheck className="mr-1 h-3 w-3" />
                Verified feedback
              </Badge>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {hasReviews ? (
              visibleReviews.map((review) => (
                <article
                  key={review.id}
                  className="group rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-blue-100 hover:bg-blue-50/20 hover:shadow-sm"
                >
                  <div className="flex gap-3">
                    <Avatar className="h-9 w-9 shrink-0 ring-1 ring-slate-200">
                      <AvatarImage
                        src={review.avatarUrl}
                        alt={review.clientName}
                      />

                      <AvatarFallback className="bg-blue-50 text-xs font-semibold text-blue-600">
                        {initials(review.clientName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-950">
                            <span className="truncate">
                              {review.clientName}
                            </span>

                            <BadgeCheck
                              className="h-3.5 w-3.5 shrink-0 text-emerald-600"
                              aria-label="Verified client"
                            />
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-400">
                            {formatDate(review.date)}
                          </p>
                        </div>

                        <RatingStars
                          rating={review.rating}
                          size="sm"
                        />
                      </div>

                      <ReviewsDialog
                        reviews={lawyer.reviews}
                        rating={lawyer.rating}
                        reviewCount={lawyer.reviewCount}
                        lawyerName={lawyer.fullName}
                      >
                        <button
                          type="button"
                          className="mt-2 inline-flex"
                        >
                          <Badge
                            variant="outline"
                            className="cursor-pointer rounded-full border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium text-slate-500 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            {review.caseType}
                          </Badge>
                        </button>
                      </ReviewsDialog>

                      <p className="mt-2.5 text-sm leading-6 text-slate-600">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="relative overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-9 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm ring-1 ring-slate-200">
                  <Star className="h-4 w-4" />
                </div>

                <h3 className="mt-3 font-heading text-sm font-semibold text-slate-950">
                  No public reviews yet
                </h3>

                <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-slate-500">
                  Once clients leave feedback, ratings and review notes will
                  appear here.
                </p>
              </div>
            )}

            {hasReviews && (
              <ReviewsDialog
                reviews={lawyer.reviews}
                rating={lawyer.rating}
                reviewCount={lawyer.reviewCount}
                lawyerName={lawyer.fullName}
              >
                <button
                  type="button"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Star className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                  See all {totalReviews} reviews
                </button>
              </ReviewsDialog>
            )}
          </div>
        </div>

        <div className="relative rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl" />

          <div className="relative">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-600 ring-1 ring-slate-200">
                <MessageSquareText className="h-3.5 w-3.5" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-950">
                  Share your experience
                </h3>

                <p className="text-[11px] text-slate-500">
                  Leave feedback for this advocate
                </p>
              </div>
            </div>

            <ReviewForm
              lawyerId={lawyer.id}
              lawyerSlug={lawyer.slug}
              lawyerName={lawyer.fullName}
              matterOptions={matterOptions}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
