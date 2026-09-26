import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import { Kicker } from "./Kicker";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-[#fbfcfd]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-12%] top-[-18%] h-[420px] w-[420px] rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[360px] w-[360px] rounded-full bg-slate-100/80 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <Kicker>About WakeelHub</Kicker>

            <h1 className="mt-7 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-5xl lg:text-6xl">
              Making legal help easier to{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">find in Pakistan.</span>
                <motion.span
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{
                    delay: 0.55,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className="absolute -inset-x-2 bottom-0.5 h-3 origin-left rounded-full bg-amber-200/70"
                />
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
              WakeelHub brings legal discovery, consultations, communication,
              documents, hearings, and case progress into a more organized
              digital experience for clients and advocates.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/lawyers"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Find a Lawyer
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/auth/register?role=LAWYER"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-800 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
              >
                Join as Advocate
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-zinc-500">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                Verification-focused profiles
              </span>

              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-600" />
                Built for Pakistan
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
            className="relative"
          >
            <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.35)] sm:p-6">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    The idea
                  </p>
                  <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-zinc-950">
                    One connected legal journey
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
                </div>
              </div>

              <div className="py-5">
                {[
                  {
                    title: "Discover",
                    text: "Find advocates using practical legal requirements.",
                  },
                  {
                    title: "Connect",
                    text: "Request consultations and keep communication organized.",
                  },
                  {
                    title: "Manage",
                    text: "Keep documents, hearings, updates, and case activity together.",
                  },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
                    {index < 2 && (
                      <span className="absolute left-[15px] top-8 h-[calc(100%-8px)] w-px bg-zinc-200" />
                    )}

                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-700">
                      <CheckCircle2 className="h-4 w-4" strokeWidth={1.8} />
                    </div>

                    <div className="pt-0.5">
                      <h3 className="text-sm font-semibold text-zinc-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-4">
                <p className="text-xs leading-5 text-zinc-500">
                  The goal is simple: make the path from finding legal help
                  to managing a matter easier to understand and navigate.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 hidden rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.5)] sm:block">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-semibold text-zinc-700">
                  Built around the legal journey
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}