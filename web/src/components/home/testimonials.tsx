"use client";

import { motion, useReducedMotion } from "framer-motion";

import {
  BadgeCheck,
  FileText,
  MessageSquareText,
  ShieldCheck,
  Star,
  UserCheck,
} from "lucide-react";

const REVIEW_PRINCIPLES = [
  {
    title: "Real advocate profiles",
    body: "Reviews stay attached to the advocate profile they belong to, giving visitors the context needed to evaluate feedback.",
    icon: UserCheck,
  },
  {
    title: "Moderated feedback",
    body: "Reviews can be checked for abuse and unnecessary private legal details before appearing publicly.",
    icon: ShieldCheck,
  },
  {
    title: "Context matters",
    body: "Ratings are viewed alongside practice areas, courts, fees, and advocate information.",
    icon: FileText,
  },
] as const;

const REVIEW_FLOW = [
  "Consultation is completed",
  "Client submits a review",
  "WakeelHub checks the submission",
  "Approved review appears on the profile",
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: {
    duration: 0.5,
    ease: "easeOut",
  },
} as const;

export function Testimonials() {
  const reduce = !!useReducedMotion();

  return (
    <section className="border-y border-border/70 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <motion.div {...fadeUp} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <Star
                className="h-3.5 w-3.5 text-gold-foreground"
                aria-hidden
              />
              Client reviews
            </span>

            <h2 className="mt-5 max-w-2xl font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Reviews that belong where the legal relationship happens.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Client feedback is most useful when it appears alongside the
              advocate, practice areas, courts, and other information that
              helps people make an informed decision.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck
                  className="h-4 w-4 text-gold-foreground"
                  aria-hidden
                />
                Profile-based reviews
              </span>

              <span className="inline-flex items-center gap-2">
                <MessageSquareText
                  className="h-4 w-4 text-gold-foreground"
                  aria-hidden
                />
                Client feedback
              </span>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.08 }}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Review process
                </p>

                <h3 className="mt-1 font-heading text-lg font-semibold tracking-tight text-foreground">
                  From consultation to feedback
                </h3>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                <MessageSquareText
                  className="h-4 w-4 text-gold-foreground"
                  aria-hidden
                />
              </div>
            </div>

            <div className="relative mt-6">
              <div
                aria-hidden
                className="absolute bottom-5 left-4 top-5 w-px bg-border"
              />

              <div className="space-y-4">
                {REVIEW_FLOW.map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: reduce ? 0 : 0.06 + index * 0.06,
                      ease: "easeOut",
                    }}
                    className="relative flex items-center gap-3"
                  >
                    <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-xs font-semibold text-foreground">
                      {index + 1}
                    </span>

                    <span className="text-sm font-medium text-muted-foreground">
                      {step}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 border-t border-border md:grid-cols-3">
          {REVIEW_PRINCIPLES.map(
            ({ title, body, icon: Icon }, index) => (
              <motion.article
                key={title}
                {...fadeUp}
                transition={{
                  ...fadeUp.transition,
                  delay: 0.1 + index * 0.06,
                }}
                className={`group border-b border-border px-6 py-8 transition-colors duration-200 hover:bg-secondary/30 ${
                  index > 0 ? "md:border-l" : ""
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/20 bg-gold/8 text-gold-foreground transition-colors duration-200 group-hover:border-gold/35 group-hover:bg-gold/12">
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={1.8}
                    aria-hidden
                  />
                </div>

                <h3 className="mt-5 font-heading text-base font-semibold tracking-tight text-foreground">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {body}
                </p>
              </motion.article>
            ),
          )}
        </div>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.18 }}
          className="mx-auto mt-8 flex max-w-6xl items-start gap-3 rounded-2xl border border-gold/15 bg-gold/5 px-5 py-4"
        >
          <BadgeCheck
            className="mt-0.5 h-5 w-5 shrink-0 text-gold-foreground"
            aria-hidden
          />

          <p className="text-sm leading-6 text-muted-foreground">
            Reviews are presented as part of the advocate profile, alongside
            the information clients need to understand their practice.
          </p>
        </motion.div>
      </div>
    </section>
  );
}