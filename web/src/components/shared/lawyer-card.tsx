import Link from "next/link";

import Image from "next/image";

import {
  ArrowUpRight,
  Briefcase,
  Languages,
  MapPin,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { RatingStars } from "@/components/shared/rating-stars";

import { VerifiedBadge } from "@/components/shared/verified-badge";

import { PRACTICE_AREAS } from "@/lib/constants";

import { formatPKR } from "@/lib/utils";

import type { Lawyer } from "@/lib/types";

function practiceAreaName(slug: string) {
  return PRACTICE_AREAS.find((area) => area.slug === slug)?.name ?? slug;
}

export function LawyerCard({ lawyer }: { lawyer: Lawyer }) {
  return (
    <Card className="group relative flex h-full flex-col gap-0 overflow-hidden border-slate-200 bg-white p-0 shadow-sm ring-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-blue-50/70 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-8 h-20 w-20 rounded-full border border-slate-100" />

      <div className="relative flex gap-3.5 p-4 pb-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
          <Image
            src={lawyer.photoUrl}
            alt={lawyer.fullName}
            fill
            sizes="56px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <Link
                href={`/lawyers/${lawyer.slug}`}
                className="block truncate font-heading text-[15px] font-semibold tracking-tight text-slate-950 transition-colors hover:text-blue-600"
                title={lawyer.fullName}
              >
                {lawyer.fullName}
              </Link>

              <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                <span className="truncate" title={lawyer.city}>
                  {lawyer.city}
                </span>
              </div>
            </div>

            {lawyer.verified && (
              <div className="shrink-0">
                <VerifiedBadge label="Verified" />
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <RatingStars rating={lawyer.rating} showValue />

            <span className="text-[11px] text-slate-400">
              {lawyer.reviewCount} review
              {lawyer.reviewCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex min-h-[24px] flex-wrap gap-1.5 px-4">
        {lawyer.practiceAreas.slice(0, 3).map((area) => (
          <Badge
            key={area}
            variant="secondary"
            className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 hover:bg-slate-100"
          >
            {practiceAreaName(area)}
          </Badge>
        ))}
      </div>

      <div className="relative mt-3 grid grid-cols-2 gap-2.5 border-t border-slate-100 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Briefcase className="h-3.5 w-3.5" />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Experience
            </p>
            <p className="mt-0.5 truncate text-[11px] font-medium text-slate-700">
              {lawyer.experienceYears} years
            </p>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Languages className="h-3.5 w-3.5" />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Languages
            </p>
            <p className="mt-0.5 truncate text-[11px] font-medium text-slate-700">
              {lawyer.languages.slice(0, 2).join(", ")}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-auto flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            Consultation
          </p>

          <p className="mt-0.5 font-heading text-sm font-semibold tracking-tight text-slate-950">
            {formatPKR(lawyer.consultationFee)}
          </p>
        </div>

        <Button
          asChild
          size="sm"
          className="h-8 shrink-0 gap-1.5 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          <Link href={`/lawyers/${lawyer.slug}`}>
            View profile
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
