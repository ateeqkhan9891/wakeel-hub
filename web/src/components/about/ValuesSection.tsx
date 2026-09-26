import { motion } from "framer-motion";

import { VALUES, fadeUp, stagger, itemFadeUp } from "./about.constants";
import { FeatureTile } from "./FeatureTile";
import { Kicker } from "./Kicker";

export function ValuesSection() {
  return (
    <section className="border-b border-zinc-200 bg-[#f7f8fa]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <motion.div
          {...fadeUp}
          className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16"
        >
          <div>
            <Kicker>Our principles</Kicker>

            <h2 className="mt-5 max-w-lg text-3xl font-semibold tracking-[-0.035em] text-zinc-950 sm:text-4xl">
              The product should feel as professional as the work it supports.
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-zinc-600 sm:text-base lg:justify-self-end">
            Legal matters often involve sensitive information, important
            decisions, and long timelines. That makes clarity, trust, and
            organization more than visual choices—they shape how the platform
            should work.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-70px" }}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {VALUES.map((value) => (
            <motion.div key={value.title} variants={itemFadeUp}>
              <FeatureTile
                icon={value.icon}
                title={value.title}
                text={value.text}
                interactive={false}
                className="h-full"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          {...fadeUp}
          className="mt-6 rounded-2xl border border-zinc-200 bg-white px-6 py-5 sm:px-7"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-zinc-600">
              Every part of the experience should help people understand where
              they are, what has happened, and what comes next.
            </p>

            <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
              Clarity by design
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}