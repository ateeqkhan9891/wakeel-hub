"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Search, CalendarCheck, CreditCard, FolderCheck, MapPin, Scale, Gavel,
  Star, ShieldCheck, Check, Loader2, Clock, Bell, ArrowRight, FileText,
} from "lucide-react";
import { useRef } from "react";

// ---------------------------------------------------------------------------
// Static config (module scope - never recreated on render)
// ---------------------------------------------------------------------------
const SEARCH_QUERY = "Family Lawyer Islamabad";
const SEARCH_FILTERS = [
  { icon: MapPin, label: "Islamabad" },
  { icon: Scale, label: "Family Law" },
  { icon: Gavel, label: "Family Court" },
  { icon: CreditCard, label: "Rs. 2,000-5,000" },
  { icon: Star, label: "4.5+ rating" },
] as const;
const SEARCH_RESULTS = [
  { name: "Verified advocate profile", meta: "Family Law - Islamabad", fee: "Fee shown" },
  { name: "High Court practitioner", meta: "Family Law - Islamabad", fee: "Availability shown" },
] as const;

const WEEK = ["M", "T", "W", "T", "F", "S", "S"] as const;
const DATES = [11, 12, 13, 14, 15, 16, 17] as const;
const SLOTS = ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"] as const;

const PAY_PHASES = [
  { label: "Processing payment", tone: "muted" as const },
  { label: "Verifying with bank", tone: "muted" as const },
  { label: "Payment successful", tone: "success" as const },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

// ---------------------------------------------------------------------------
// Shared ticker hook - increments 0..max once when `active`, respects reduce
// ---------------------------------------------------------------------------
function useTicker(active: boolean, max: number, interval: number, reduce: boolean) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active || reduce) return;
    let t = 0;
    const id = setInterval(() => {
      t += 1;
      setTick(t);
      if (t >= max) clearInterval(id);
    }, interval);
    return () => clearInterval(id);
  }, [active, max, interval, reduce]);
  return reduce ? max : tick;
}

// ---------------------------------------------------------------------------
// Step 1 - Search panel (auto-type + filters + results + counter)
// ---------------------------------------------------------------------------
function SearchPanel({ active, reduce }: { active: boolean; reduce: boolean }) {
  const [typed, setTyped] = useState("");
  const tick = useTicker(active, 8, 360, reduce);
  const shownTyped = reduce ? SEARCH_QUERY : typed;

  useEffect(() => {
    if (!active || reduce) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(SEARCH_QUERY.slice(0, i));
      if (i >= SEARCH_QUERY.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [active, reduce]);

  return (
    <Panel>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="text-sm text-foreground">
          {shownTyped}
          {shownTyped.length < SEARCH_QUERY.length && <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-primary align-middle" />}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {SEARCH_FILTERS.map((f, i) => (
          <motion.span
            key={f.label}
            initial={false}
            animate={tick > i ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.32, ease: easeOut }}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-foreground"
          >
            <f.icon className="h-3 w-3 text-gold" />
            {f.label}
          </motion.span>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {SEARCH_RESULTS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={false}
            animate={tick > i + 5 ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">{r.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{r.meta}</p>
            </div>
            <span className="text-[11px] font-semibold text-foreground">{r.fee}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={false}
        animate={tick >= 8 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.4, ease: easeOut }}
        className="mt-4 flex items-center justify-between rounded-xl bg-primary px-3.5 py-2.5 text-primary-foreground"
      >
        <span className="text-xs font-medium text-primary-foreground/80">Verified advocates</span>
        <span className="font-heading text-sm font-semibold">
          Live profiles found
        </span>
      </motion.div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Step 2 - Booking panel (calendar + slot + confirm)
// ---------------------------------------------------------------------------
function BookingPanel({ active, reduce }: { active: boolean; reduce: boolean }) {
  const tick = useTicker(active, 3, 700, reduce);
  const selectedDateIndex = 4; // 15th
  const selectedSlotIndex = 2; // 2:00 PM

  return (
    <Panel>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-foreground">June 2026</p>
        <CalendarCheck className="h-4 w-4 text-gold" />
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {WEEK.map((d, i) => (
          <span key={i} className="text-center text-[10px] font-medium text-muted-foreground">{d}</span>
        ))}
        {DATES.map((date, i) => {
          const isSel = tick >= 1 && i === selectedDateIndex;
          return (
            <motion.span
              key={date}
              animate={isSel ? { scale: [1, 1.15, 1] } : { scale: 1 }}
              transition={{ duration: 0.4, ease: easeOut }}
              className={`flex h-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                isSel ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-foreground"
              }`}
            >
              {date}
            </motion.span>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-1.5">
        {SLOTS.map((slot, i) => {
          const isSel = tick >= 2 && i === selectedSlotIndex;
          return (
            <span
              key={slot}
              className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-medium transition-colors ${
                isSel ? "border-gold/50 bg-gold/15 text-gold-foreground" : "border-border bg-card text-muted-foreground"
              }`}
            >
              <Clock className="h-3 w-3" />
              {slot}
            </span>
          );
        })}
      </div>

      <motion.div
        initial={false}
        animate={tick >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.4, ease: easeOut }}
        className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5"
      >
        <Check className="h-4 w-4 text-emerald-600" />
        <span className="text-xs font-medium text-emerald-700">Consultation booked - 15 Jun, 2:00 PM</span>
      </motion.div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Step 3 - Payment panel (status transitions + receipt)
// ---------------------------------------------------------------------------
function PaymentPanel({ active, reduce }: { active: boolean; reduce: boolean }) {
  const tick = useTicker(active, 3, 900, reduce);
  const phase = Math.min(tick, 2);
  const current = PAY_PHASES[phase];
  const done = tick >= 2;

  return (
    <Panel>
      <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-primary-foreground/60">WakeelHub Pay</span>
          <CreditCard className="h-4 w-4 text-gold" />
        </div>
        <p className="mt-4 font-heading text-xl font-semibold">Rs. 4,000</p>
        <p className="text-[11px] text-primary-foreground/60">Consultation request</p>
      </div>

      <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-3">
        <AnimatePresence mode="wait">
          <motion.span
            key={phase}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            className={`flex h-7 w-7 items-center justify-center rounded-full ${done ? "bg-emerald-100 text-emerald-600" : "bg-secondary text-muted-foreground"}`}
          >
            {done ? <Check className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
          </motion.span>
        </AnimatePresence>
        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.p
              key={current.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className={`text-xs font-semibold ${current.tone === "success" ? "text-emerald-700" : "text-foreground"}`}
            >
              {current.label}
              {current.tone === "success" && " done"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={done ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
        transition={{ duration: 0.4, ease: easeOut }}
        className="overflow-hidden"
      >
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 px-3.5 py-2.5">
          <FileText className="h-4 w-4 text-gold" />
          <span className="text-[11px] font-medium text-muted-foreground">Receipt INV-2026-0143 generated</span>
        </div>
      </motion.div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Step 4 - Confirmation panel (notification + dashboard preview)
// ---------------------------------------------------------------------------
function ConfirmPanel({ active, reduce }: { active: boolean; reduce: boolean }) {
  const tick = useTicker(active, 3, 800, reduce);

  return (
    <Panel>
      <motion.div
        initial={false}
        animate={tick >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
        transition={{ duration: 0.45, ease: easeOut }}
        className="flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/10 px-3.5 py-3"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
          <Bell className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-semibold text-foreground">Your advocate accepted the consultation</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Just now</p>
        </div>
      </motion.div>

      <motion.div
        initial={false}
        animate={tick >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.45, ease: easeOut }}
        className="mt-3 rounded-xl border border-border bg-card p-3.5"
      >
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Your dashboard</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <Check className="h-3 w-3" /> Confirmed
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {["Consultation confirmed", "Hearing reminder set", "Secure chat ready"].map((row, i) => (
            <motion.div
              key={row}
              initial={false}
              animate={tick >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
              transition={{ duration: 0.35, ease: easeOut, delay: reduce ? 0 : i * 0.08 }}
              className="flex items-center gap-2 text-[11px] text-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {row}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Generic premium panel frame
// ---------------------------------------------------------------------------
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-md rounded-2xl border border-border bg-card/90 p-4 shadow-xl shadow-primary/5 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Steps definition
// ---------------------------------------------------------------------------
const STEPS = [
  { num: "01", icon: Search, title: "Search & compare", description: "Filter verified advocates by city, court, practice area, fee and rating, then shortlist the profiles that fit your matter.", Panel: SearchPanel },
  { num: "02", icon: CalendarCheck, title: "Book a consultation", description: "Choose a date, time slot and consultation mode, whether online, in person or by phone.", Panel: BookingPanel },
  { num: "03", icon: CreditCard, title: "Pay securely online", description: "Complete payment through an encrypted gateway and receive a digital receipt for every transaction.", Panel: PaymentPanel },
  { num: "04", icon: FolderCheck, title: "Hire & track your case", description: "Once your advocate accepts, your dashboard keeps hearing dates, updates, documents and secure chat in one record.", Panel: ConfirmPanel },
] as const;

function StepBlock({ step, index, reduce }: { step: (typeof STEPS)[number]; index: number; reduce: boolean }) {
  const [active, setActive] = useState(false);
  const PanelComp = step.Panel;

  return (
    <motion.div
      onViewportEnter={() => setActive(true)}
      viewport={{ once: true, amount: 0.4 }}
      className="relative pl-12 sm:pl-16"
    >
      {/* node on the spine */}
      <motion.span
        initial={false}
        animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
        transition={{ duration: 0.5, ease: easeOut }}
        className={`absolute left-3 top-1.5 flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-background transition-colors duration-500 sm:left-4 ${
          active ? "bg-gold text-primary" : "bg-primary text-primary-foreground"
        }`}
      >
        <step.icon className="h-3.5 w-3.5" />
      </motion.span>

      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className={index % 2 === 1 ? "lg:order-2" : ""}
        >
          <span className="font-heading text-sm font-semibold text-gold">{step.num}</span>
          <h3 className="mt-1 font-heading text-xl font-semibold text-foreground sm:text-2xl">{step.title}</h3>
          <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">{step.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeOut }}
          className={`flex justify-center ${index % 2 === 1 ? "lg:order-1 lg:justify-end" : "lg:justify-start"}`}
          aria-hidden
        >
          <PanelComp active={active} reduce={reduce} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  const reduce = !!useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start center", "end center"] });
  const fillScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative overflow-hidden bg-secondary/30 py-20 sm:py-28">
      <PremiumBackdrop reduce={reduce} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeadingLocal
          eyebrow="How it works"
          title="From lawyer search to case tracking"
          description="A simple look at how WakeelHub helps clients compare advocates, book consultations and keep legal matters organized."
        />

        <div ref={trackRef} className="relative mt-16">
          {/* vertical spine */}
          <div className="absolute left-[1.6rem] top-0 h-full w-px bg-border sm:left-[1.85rem]" aria-hidden />
          <motion.div
            style={{ scaleY: reduce ? 1 : fillScale }}
            className="absolute left-[1.6rem] top-0 h-full w-px origin-top bg-gradient-to-b from-gold via-gold to-primary sm:left-[1.85rem]"
            aria-hidden
          />

          <div className="space-y-16 sm:space-y-24">
            {STEPS.map((step, i) => (
              <StepBlock key={step.num} step={step} index={i} reduce={reduce} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Local heading (keeps the section self-contained / animated)
function SectionHeadingLocal({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: easeOut }}
      className="mx-auto max-w-2xl text-center"
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-foreground/80 ring-1 ring-inset ring-gold/20">
        <ArrowRight className="h-3.5 w-3.5" /> {eyebrow}
      </span>
      <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
    </motion.div>
  );
}

// Subtle premium legal-tech backdrop: drifting glow + faint network dots.
export function PremiumBackdrop({ reduce }: { reduce: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle,var(--color-foreground,currentColor)_1px,transparent_1px)] [background-size:32px_32px]" />
      <motion.div
        className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
        animate={reduce ? undefined : { x: [0, 30, 0], y: [0, -20, 0] }}
        transition={reduce ? undefined : { duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        animate={reduce ? undefined : { x: [0, -28, 0], y: [0, 22, 0] }}
        transition={reduce ? undefined : { duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
