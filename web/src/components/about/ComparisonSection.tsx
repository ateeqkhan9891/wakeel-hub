import { ArrowRight, Check, Minus } from "lucide-react";
import { motion } from "framer-motion";

import { COMPARE_ROWS, fadeUp } from "./about.constants";
import { Kicker } from "./Kicker";

export function ComparisonSection() {
  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <motion.div
          {...fadeUp}
          className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16"
        >
          <div>
            <Kicker>The difference</Kicker>

            <h2 className="mt-5 max-w-lg text-3xl font-semibold tracking-[-0.035em] text-zinc-950 sm:text-4xl">
              From referral guesswork to a more visible workflow.
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-zinc-600 sm:text-base lg:justify-self-end">
            WakeelHub brings common parts of the legal journey into one
            structured experience, giving clients and advocates clearer
            information about the work happening around a matter.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-12 overflow-hidden rounded-[24px] border border-zinc-200"
        >
          <div className="grid grid-cols-[1fr_1.1fr] border-b border-zinc-200 bg-zinc-50">
            <div className="px-5 py-4 sm:px-7">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                Common friction
              </span>
            </div>

            <div className="border-l border-zinc-200 px-5 py-4 sm:px-7">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">
                With WakeelHub
              </span>
            </div>
          </div>

          <div className="divide-y divide-zinc-100">
            {COMPARE_ROWS.map((row, index) => (
              <div
                key={`${row.traditional}-${index}`}
                className="grid grid-cols-[1fr_1.1fr] transition-colors hover:bg-zinc-50/70"
              >
                <div className="flex items-start gap-3 px-5 py-6 sm:px-7">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                    <Minus className="h-3 w-3" strokeWidth={2} />
                  </span>

                  <span className="text-sm leading-6 text-zinc-600">
                    {row.traditional}
                  </span>
                </div>

                <div className="flex items-start gap-3 border-l border-zinc-100 bg-amber-50/30 px-5 py-6 sm:px-7">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <Check className="h-3 w-3" strokeWidth={2.2} />
                  </span>

                  <span className="text-sm font-medium leading-6 text-zinc-800">
                    {row.wakeelHub}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-200 bg-slate-950 px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-white/70">
                A clearer workflow starts with clearer information.
              </p>

              <ArrowRight className="hidden h-4 w-4 text-amber-400 sm:block" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}