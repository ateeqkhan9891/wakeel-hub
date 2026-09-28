import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";

import { LawyerCard } from "@/components/shared/lawyer-card";

import type { Lawyer } from "@/lib/types";

type SimilarLawyersProps = {
  lawyers: Lawyer[];
};

export function SimilarLawyers({
  lawyers,
}: SimilarLawyersProps) {
  if (lawyers.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-blue-50/70 blur-2xl" />

      <div className="relative mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
            <Users className="h-4 w-4" />
          </div>

          <div>
            <h2 className="font-heading text-base font-semibold tracking-tight text-slate-950">
              Similar advocates
            </h2>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Other advocates you may want to compare
            </p>
          </div>
        </div>

        <Link
          href="/lawyers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lawyers.slice(0, 3).map((lawyer) => (
          <LawyerCard
            key={lawyer.id}
            lawyer={lawyer}
          />
        ))}
      </div>
    </section>
  );
}