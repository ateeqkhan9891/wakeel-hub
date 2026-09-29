import { motion } from "framer-motion";

import {
  ArrowRight,
  CheckCircle2,
  Landmark,
  MessageSquareText,
} from "lucide-react";

import {
  COVERAGE_CITIES,
  WORKFLOW_STEPS,
  fadeUp,
} from "./hero.constants";

export function HeroSidebar() {
  return (
    <div className="grid grid-cols-1 gap-5">
      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.34 }}
        className="group relative overflow-hidden rounded-[1.75rem] border border-[#24324a] bg-[#17243a] p-6 text-white shadow-xl shadow-slate-900/10"
      >
        <div
          aria-hidden
          className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-gold/10 blur-3xl"
        />

        <div
          aria-hidden
          className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-blue-400/5 blur-3xl"
        />

        <div
          aria-hidden
          className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-sm">
                <Landmark
                  className="h-5 w-5 text-gold"
                  aria-hidden
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                  Coverage
                </p>

                <h2 className="mt-1 text-lg font-semibold tracking-tight">
                  Across Pakistan
                </h2>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-200">
              <span
                className="h-1.5 w-1.5 rounded-full bg-emerald-300"
                aria-hidden
              />
              Expanding
            </span>
          </div>

          <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
            Find legal professionals across major cities, courts,
            and specialist tribunals.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {COVERAGE_CITIES.map((city) => (
              <div
                key={city}
                className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.055] px-3 py-2.5 transition-colors hover:border-gold/25 hover:bg-white/[0.09]"
              >
                <CheckCircle2
                  className="h-3.5 w-3.5 shrink-0 text-gold"
                  aria-hidden
                />

                <span className="text-sm font-medium text-white/80">
                  {city}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-white/8 pt-4">
            <span className="text-xs font-medium text-white/40">
              Courts & tribunals
            </span>

            <ArrowRight
              className="h-3.5 w-3.5 text-gold"
              aria-hidden
            />

            <span className="text-xs font-medium text-white/65">
              High, District & Specialist
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.4 }}
        className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Simple process
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
              How Wakeel360 works
            </h2>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
            <MessageSquareText
              className="h-4 w-4 text-gold-foreground"
              aria-hidden
            />
          </div>
        </div>

        <div className="relative mt-6">
          <div
            aria-hidden
            className="absolute bottom-6 left-[17px] top-6 w-px bg-slate-200"
          />

          <div className="space-y-5">
            {WORKFLOW_STEPS.map(
              ({ icon: Icon, label, description }, index) => (
                <div
                  key={label}
                  className="relative flex gap-4"
                >
                  <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                    <Icon
                      className="h-4 w-4 text-gold-foreground"
                      aria-hidden
                    />
                  </div>

                  <div className="min-w-0 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        0{index + 1}
                      </span>

                      <p className="text-sm font-semibold text-slate-950">
                        {label}
                      </p>
                    </div>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      {description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-gold/15 bg-gold/5 p-4">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <MessageSquareText
                className="h-4 w-4 text-gold-foreground"
                aria-hidden
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-950">
                Stay connected
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Secure communication and matter tracking in one
                place.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
