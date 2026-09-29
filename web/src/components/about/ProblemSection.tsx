import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { PROBLEM_POINTS, fadeUp, stagger, itemFadeUp } from "./about.constants";
import { Kicker } from "./Kicker";

export function ProblemSection() {
  return (
    <section className="border-b border-zinc-200 bg-[#f7f8fa]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <motion.div {...fadeUp}>
            <Kicker>Why it exists</Kicker>

            <h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-[-0.035em] text-zinc-950 sm:text-4xl">
              Legal help should not begin with guesswork.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-600 sm:text-base">
              Finding an advocate is only the first part of a legal matter.
              People also need clearer information, organized communication,
              accessible records, and visibility into what happens next.
            </p>

            <div className="mt-8 border-l-2 border-amber-400 pl-5">
              <p className="text-sm font-medium leading-6 text-zinc-700">
                Wakeel360 is designed to make the legal journey easier to
                discover, understand, and manage.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-70px" }}
            className="grid gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2"
          >
            {PROBLEM_POINTS.map((point) => (
              <motion.article
                key={point.number}
                variants={itemFadeUp}
                className="group relative bg-white p-6 transition-colors duration-300 hover:bg-zinc-50 sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[11px] font-bold tracking-[0.16em] text-amber-600">
                    {point.number}
                  </span>

                  <ArrowUpRight
                    className="h-4 w-4 text-zinc-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-600"
                    strokeWidth={1.7}
                  />
                </div>

                <h3 className="mt-10 text-base font-semibold tracking-[-0.01em] text-zinc-950">
                  {point.title}
                </h3>

                <p className="mt-2.5 text-sm leading-6 text-zinc-600">
                  {point.text}
                </p>

                <div className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-amber-500 transition-transform duration-300 group-hover:scale-x-100 sm:inset-x-7" />
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
