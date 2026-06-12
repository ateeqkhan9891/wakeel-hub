"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, FileText, MessageSquareText, ShieldCheck, Star, UserCheck } from "lucide-react";

const REVIEW_PRINCIPLES = [
  {
    title: "Linked to real profiles",
    body: "Reviews are displayed on the advocate profile they belong to, so visitors can judge feedback in context.",
    icon: UserCheck,
  },
  {
    title: "Published after moderation",
    body: "Client feedback can be reviewed before it appears publicly, keeping private legal details out of the marketplace.",
    icon: ShieldCheck,
  },
  {
    title: "Useful legal context",
    body: "Practice area, rating, and consultation context matter more than anonymous marketing quotes.",
    icon: FileText,
  },
] as const;

const REVIEW_FLOW = [
  "Client books or completes a consultation",
  "Client submits rating and feedback",
  "WakeelHub reviews it for privacy and abuse",
  "Approved review appears on the lawyer profile",
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" },
} as const;

export function Testimonials() {
  const reduce = !!useReducedMotion();

  return (
    <section className="border-y border-slate-200 bg-[#fbfaf7] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(360px,0.55fr)] lg:items-center">
          <motion.div {...fadeUp} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm">
              <Star className="h-4 w-4 text-gold-foreground" aria-hidden />
              Client reviews
            </span>
            <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Real feedback belongs on real advocate profiles.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              WakeelHub does not need staged client stories on the homepage. When clients review an advocate, that feedback should appear beside the verified profile, consultation fee, courts, and practice areas.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.08 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Review publishing flow</p>
            <div className="mt-5 space-y-3">
              {REVIEW_FLOW.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.42, delay: reduce ? 0 : 0.08 + index * 0.06, ease: "easeOut" }}
                  className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-700">{step}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {REVIEW_PRINCIPLES.map(({ title, body, icon: Icon }, index) => (
            <motion.article
              key={title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 + index * 0.06 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-gold/50 hover:shadow-xl hover:shadow-slate-950/8"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/10 text-gold-foreground">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-base font-semibold text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.16 }}
          className="mt-8 flex items-start gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-foreground" aria-hidden />
          <p className="text-sm leading-6 text-slate-600">
            Real published reviews are already supported on individual lawyer pages, including ratings and client comments from the database.
          </p>
          <MessageSquareText className="ml-auto hidden h-5 w-5 shrink-0 text-slate-300 sm:block" aria-hidden />
        </motion.div>
      </div>
    </section>
  );
}
