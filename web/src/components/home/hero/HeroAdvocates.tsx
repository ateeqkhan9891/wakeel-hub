import Link from "next/link";

import { motion } from "framer-motion";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Star,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AdvocateMatch } from "./Hero";
import { fadeUp } from "./hero.constants";

interface HeroAdvocatesProps {
  advocates: AdvocateMatch[];
}

function AdvocateRow({ advocate }: { advocate: AdvocateMatch }) {
  return (
    <article className="group grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-gold/50 hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white">
        {advocate.initials}
      </div>

      <div className="min-w-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-slate-950">
                {advocate.name}
              </h3>

              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                <CheckCircle2 className="h-3 w-3" aria-hidden />
                Verified
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {advocate.area} - {advocate.court}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-800">
            <Star
              className="h-3.5 w-3.5 fill-gold text-gold"
              aria-hidden
            />
            {advocate.rating}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden />
            {advocate.city}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1">
            <WalletCards
              className="h-3.5 w-3.5 text-slate-400"
              aria-hidden
            />
            {advocate.fee}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-1 font-medium text-slate-800">
            <Clock3
              className="h-3.5 w-3.5 text-gold-foreground"
              aria-hidden
            />
            {advocate.availability}
          </span>

          <Link
            href={`/lawyers/${advocate.slug}`}
            className="ml-auto inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-gold/50 hover:bg-slate-50 hover:text-slate-950"
          >
            View profile
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function HeroAdvocates({
  advocates,
}: HeroAdvocatesProps) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay: 0.28 }}
      className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-4 shadow-xl shadow-slate-950/5 backdrop-blur"
    >
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Matched advocates
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Verified lawyers accepting consultations
          </h2>
        </div>

        {advocates.length > 0 && (
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
            <span
              className="h-2 w-2 rounded-full bg-emerald-500"
              aria-hidden
            />

            {advocates.length} verified{" "}
            {advocates.length === 1 ? "advocate" : "advocates"}
          </span>
        )}
      </div>

      {advocates.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">
          <p className="text-sm font-medium text-slate-700">
            Verified advocates are joining Wakeel360
          </p>

          <p className="text-xs text-slate-500">
            Be the first to list your practice, or browse the directory.
          </p>

          <Button
            asChild
            size="sm"
            className="bg-slate-950 text-white hover:bg-slate-800"
          >
            <Link href="/find-lawyers">Browse directory</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {advocates.map((advocate) => (
            <AdvocateRow key={advocate.slug} advocate={advocate} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
