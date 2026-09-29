import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import { Kicker } from "./Kicker";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-[-30%] h-[420px] w-[420px] rounded-full bg-amber-400/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <Kicker dark>Start with the next step</Kicker>

          <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            A better legal journey starts with a clearer first step.
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
            Whether you are looking for legal help or building your practice,
            Wakeel360 is designed to bring the important parts of the journey
            into one connected experience.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/lawyers"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-slate-950 transition-colors hover:bg-zinc-100"
            >
              Find a Lawyer
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/auth/register?role=LAWYER"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] px-5 text-sm font-semibold text-white transition-colors hover:border-white/25 hover:bg-white/[0.1]"
            >
              Join as Advocate
            </Link>
          </div>
        </motion.div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-white/45">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            Designed around clarity, trust, and organized legal work.
          </div>

          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
            Wakeel360
          </span>
        </div>
      </div>
    </section>
  );
}
