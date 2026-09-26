import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

import { fadeUp } from "./about.constants";
import { LiveFlowSimulator } from "./LiveFlowSimulator";
import { Kicker } from "./Kicker";

export function LiveSimulationSection() {
  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <motion.div
          {...fadeUp}
          className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end"
        >
          <div>
            <Kicker>How it works</Kicker>

            <h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-[-0.035em] text-zinc-950 sm:text-4xl">
              Watch one legal matter move through WakeelHub.
            </h2>
          </div>

          <div className="flex gap-4 lg:justify-end">
            <ArrowDownRight className="mt-1 hidden h-5 w-5 shrink-0 text-amber-600 sm:block" />

            <p className="max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">
              From the first search to the final outcome, the platform is
              designed around the actual stages of a legal relationship rather
              than treating discovery, communication, and case management as
              separate experiences.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
          className="mt-12"
        >
          <LiveFlowSimulator />
        </motion.div>

        <div className="mt-5 flex flex-col gap-2 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Explore each stage to see how the client and advocate experience
            stays connected.
          </span>

          <span className="font-medium text-zinc-500">
            Discovery → Consultation → Case → Resolution
          </span>
        </div>
      </div>
    </section>
  );
}