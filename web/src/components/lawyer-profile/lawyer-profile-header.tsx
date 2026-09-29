import Image from "next/image";

import {
  Briefcase,
  Clock3,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/shared/rating-stars";
import { VerifiedBadge } from "@/components/shared/verified-badge";
import { ReviewsDialog } from "@/components/lawyer-profile/reviews-dialog";

import type { Lawyer } from "@/lib/types";

type LawyerProfileHeaderProps = {
  lawyer: Lawyer;
  title: string;
  practiceAreas: {
    value: string;
    label: string;
  }[];
  hasReviews: boolean;
};

export function LawyerProfileHeader({
  lawyer,
  title,
  practiceAreas,
  hasReviews,
}: LawyerProfileHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div className="pointer-events-none absolute -left-20 top-10 h-48 w-48 rounded-full bg-blue-50/70 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full border border-slate-100" />
      <div className="pointer-events-none absolute right-16 top-16 h-24 w-24 rounded-full border border-blue-100/80" />

      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <span>Home</span>
          <span>/</span>
          <span>Find lawyers</span>
          <span>/</span>
          <span className="font-medium text-slate-600">
            {lawyer.fullName}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-5">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
              <div className="absolute -inset-1 rounded-full bg-blue-50 ring-1 ring-blue-100/80" />

              <div className="relative h-full w-full overflow-hidden rounded-full border border-white bg-slate-100 shadow-sm ring-1 ring-slate-200">
                <Image
                  src={lawyer.photoUrl}
                  alt={lawyer.fullName}
                  fill
                  sizes="112px"
                  className="object-cover"
                  priority
                />
              </div>

              {lawyer.verified && (
                <span className="absolute bottom-1 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-sm">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {lawyer.verified && <VerifiedBadge />}

                <Badge
                  variant="outline"
                  className="rounded-full border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-500"
                >
                  Public profile
                </Badge>
              </div>

              <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {lawyer.fullName}
                </h1>

                <span className="text-sm font-medium text-slate-500">
                  {title}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-500" />
                  {lawyer.city}
                  {lawyer.province ? `, ${lawyer.province}` : ""}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-blue-500" />
                  {lawyer.experienceYears} years experience
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5 text-blue-500" />
                  Responds {lawyer.responseTime}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <RatingStars
                    rating={lawyer.rating}
                    size="md"
                    showValue
                  />

                  {hasReviews ? (
                    <ReviewsDialog
                      reviews={lawyer.reviews}
                      rating={lawyer.rating}
                      reviewCount={lawyer.reviewCount}
                      lawyerName={lawyer.fullName}
                    >
                      <button
                        type="button"
                        className="text-xs font-medium text-slate-500 underline-offset-4 transition-colors hover:text-blue-600 hover:underline"
                      >
                        {lawyer.reviewCount} reviews
                      </button>
                    </ReviewsDialog>
                  ) : (
                    <span className="text-xs text-slate-400">
                      No reviews yet
                    </span>
                  )}
                </div>
              </div>

              {practiceAreas.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {practiceAreas.map((area) => (
                    <Badge
                      key={area.value}
                      variant="secondary"
                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-600 transition-colors hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {area.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden shrink-0 self-stretch border-l border-slate-100 pl-5 lg:flex lg:w-44 lg:flex-col lg:justify-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Profile status
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-semibold text-slate-700">
                  Active on Wakeel360
                </span>
              </div>

              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                Profile information is managed by the advocate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
