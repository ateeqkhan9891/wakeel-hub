import { motion } from "framer-motion";

import { CheckCircle2 } from "lucide-react";

import {
  fadeUp,
  TRUST_INDICATORS,
} from "./hero.constants";

export function HeroTrustIndicators() {
  return (
    <motion.div
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay: 0.2 }}
      className="relative z-10 mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {TRUST_INDICATORS.map(
        ({ title, subtitle, icon: Icon }) => (
          <div
            key={title}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/35 hover:shadow-lg hover:shadow-slate-900/8"
          >
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            <div
              aria-hidden
              className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gold/5 blur-2xl transition-opacity duration-300 group-hover:bg-gold/10"
            />

            <div className="relative flex items-start gap-3.5">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gradient-to-br from-gold/15 to-gold/5 shadow-sm">
                <Icon
                  className="h-5 w-5 text-gold-foreground transition-transform duration-300 group-hover:scale-110"
                  aria-hidden
                />

                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
                  <CheckCircle2
                    className="h-2.5 w-2.5 text-white"
                    aria-hidden
                  />
                </span>
              </div>

              <div className="min-w-0 pt-0.5">
                <p className="font-heading text-[15px] font-semibold leading-snug text-slate-950">
                  {title}
                </p>

                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  {subtitle}
                </p>
              </div>
            </div>

            <div className="relative mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Trusted platform
              </span>
            </div>
          </div>
        ),
      )}
    </motion.div>
  );
}