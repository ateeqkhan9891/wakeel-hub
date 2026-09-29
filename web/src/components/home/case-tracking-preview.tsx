"use client";

import { useEffect, useRef, useState } from "react";

import {
  motion,
  AnimatePresence,
  useInView,
} from "framer-motion";

import {
  FileText,
  Gavel,
  CalendarClock,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  Activity,
} from "lucide-react";

import { PremiumBackdrop } from "@/components/home/how-it-works";

const easeOut = [0.22, 1, 0.36, 1] as const;

type EventType = "milestone" | "hearing" | "message" | "document";

const LIVE_EVENTS: {
  type: EventType;
  icon: typeof FileText;
  title: string;
  meta: string;
  progress: number;
}[] = [
  {
    type: "milestone",
    icon: FileText,
    title: "Case filed",
    meta: "Petition registered - CV-2026-0114",
    progress: 25,
  },
  {
    type: "milestone",
    icon: Gavel,
    title: "Evidence submitted",
    meta: "Property registry & witness records",
    progress: 40,
  },
  {
    type: "hearing",
    icon: CalendarClock,
    title: "New hearing scheduled",
    meta: "18 June 2026 - District Court Lahore",
    progress: 55,
  },
  {
    type: "message",
    icon: MessageSquare,
    title: "New message from advocate",
    meta: "\"I've uploaded the counter-affidavit for your review.\"",
    progress: 65,
  },
  {
    type: "document",
    icon: FileText,
    title: "Document uploaded",
    meta: "Counter_Affidavit.pdf - 640 KB",
    progress: 75,
  },
];

const TRUST = [
  "Hearing and status alerts",
  "Documents kept with the case record",
  "Direct chat with your advocate",
];

const LOOP = LIVE_EVENTS.length + 1;

export function CaseTrackingPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });

  const [mounted, setMounted] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);

    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const updateReducedMotion = () => {
      setReduce(mediaQuery.matches);
    };

    updateReducedMotion();

    mediaQuery.addEventListener("change", updateReducedMotion);

    return () => {
      mediaQuery.removeEventListener("change", updateReducedMotion);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (reduce) {
      setTick(LIVE_EVENTS.length);
      return;
    }

    setTick(0);
  }, [mounted, reduce]);

  useEffect(() => {
    if (!mounted || reduce || !inView) return;

    const id = setInterval(
      () => setTick((t) => (t + 1) % LOOP),
      2000,
    );

    return () => clearInterval(id);
  }, [mounted, inView, reduce]);

  const shown = LIVE_EVENTS.slice(
    0,
    tick === 0 ? 0 : tick,
  );

  const visible = reduce ? LIVE_EVENTS : shown;

  const progress = visible.length
    ? visible[visible.length - 1].progress
    : 20;

  return (
    <section className="relative overflow-hidden bg-secondary/30 py-20 sm:py-28">
      <PremiumBackdrop reduce={reduce} />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left - copy */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 24 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-foreground/80 ring-1 ring-inset ring-gold/20">
            <Activity className="h-3.5 w-3.5" /> Case tracking
          </span>

          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Watch your case move forward, live
          </h2>

          <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">
            After you hire an advocate, your private dashboard keeps filings,
            hearings, messages and documents organized, so you can follow the
            matter without chasing updates across different channels.
          </p>

          <ul className="mt-7 space-y-3">
            {TRUST.map((t, i) => (
              <motion.li
                key={t}
                initial={
                  mounted
                    ? { opacity: 0, x: reduce ? 0 : -12 }
                    : false
                }
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: reduce ? 0 : 0.45,
                  ease: easeOut,
                  delay: reduce ? 0 : i * 0.1,
                }}
                className="flex items-center gap-3 text-sm text-foreground"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                </span>

                {t}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right - live case card */}
        <motion.div
          ref={ref}
          initial={
            mounted
              ? { opacity: 0, y: 30, scale: 0.97 }
              : false
          }
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="relative"
        >
          {/* glow */}
          <div
            className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-gold/10 to-primary/10 blur-2xl"
            aria-hidden
          />

          <div className="rounded-2xl border border-border bg-card p-5 shadow-2xl shadow-primary/10 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Case CV-2026-0114
                </p>

                <h3 className="mt-1 font-heading text-base font-semibold text-foreground sm:text-lg">
                  Property Possession Suit - Gulberg Residency
                </h3>
              </div>

              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>

                Live
              </span>
            </div>

            {/* progress */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Case progress
                </span>

                <motion.span
                  key={progress}
                  initial={mounted ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  className="font-semibold text-foreground"
                >
                  {progress}%
                </motion.span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-gold"
                  animate={{ width: `${progress}%` }}
                  transition={{
                    duration: reduce ? 0 : 0.8,
                    ease: easeOut,
                  }}
                />
              </div>
            </div>

            {/* live activity feed */}
            <div className="mt-5 min-h-[15rem] space-y-2.5">
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((e, i) => {
                  const newest = i === visible.length - 1;

                  return (
                    <motion.div
                      key={e.title}
                      layout
                      initial={
                        mounted
                          ? {
                              opacity: 0,
                              y: reduce ? 0 : 14,
                              scale: 0.97,
                            }
                          : false
                      }
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.97,
                        transition: {
                          duration: reduce ? 0 : 0.2,
                        },
                      }}
                      transition={{
                        duration: reduce ? 0 : 0.45,
                        ease: easeOut,
                      }}
                      className={`flex items-start gap-3 rounded-xl border p-3 ${
                        newest
                          ? "border-gold/40 bg-gold/[0.07]"
                          : "border-border bg-secondary/30"
                      }`}
                    >
                      <span
                        className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          e.type === "message"
                            ? "bg-primary/10 text-primary"
                            : "bg-gold/15 text-gold"
                        }`}
                      >
                        <e.icon className="h-4.5 w-4.5" />

                        {newest && (
                          <motion.span
                            className="absolute inset-0 rounded-lg ring-2 ring-gold/50 motion-reduce:hidden"
                            initial={
                              mounted
                                ? {
                                    opacity: 0.8,
                                    scale: 1,
                                  }
                                : false
                            }
                            animate={{
                              opacity: 0,
                              scale: 1.4,
                            }}
                            transition={{
                              duration: reduce ? 0 : 1.1,
                              ease: "easeOut",
                            }}
                          />
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground">
                            {e.title}
                          </p>

                          {newest && (
                            <span className="shrink-0 text-[10px] font-medium text-gold">
                              just now
                            </span>
                          )}
                        </div>

                        {e.type === "message" ? (
                          <p className="mt-1 rounded-lg bg-card px-2.5 py-1.5 text-[11px] italic leading-5 text-muted-foreground">
                            {e.meta}
                          </p>
                        ) : (
                          <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
                            {e.meta}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {visible.length === 0 && (
                <div className="flex h-full items-center justify-center pt-12 text-center text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-gold" />
                    Awaiting first case update...
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}