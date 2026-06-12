"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, Sparkles, Percent, Users, Crown, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "annual";
const easeOut = [0.22, 1, 0.36, 1] as const;

const CLIENT_FEATURES = [
  "Unlimited lawyer search & filters",
  "Book online, in-person or phone consultations",
  "Secure, encrypted chat with your advocate",
  "Live case tracking & timeline",
  "Document sharing & downloads",
  "No fees - free forever",
];

const COMMISSION_FEATURES = [
  "Verified profile in the public directory",
  "Receive booking & consultation requests",
  "Full case & client management tools",
  "Secure client chat & document sharing",
  "Only pay when you actually earn",
  "Standard support",
];

const PRO_FEATURES = [
  "Everything in Pay-as-you-go, plus:",
  "Verified advocate badge",
  "Featured placement in search results",
  "Unlimited client bookings",
  "Hearing tracker & case timeline tools",
  "Practice analytics dashboard",
  "Priority support",
  "0% commission - keep 100% of your fees",
];

function FeatureList({ items, accent = false }: { items: string[]; accent?: boolean }) {
  return (
    <ul className="space-y-3">
      {items.map((f) => {
        const isHeader = f.endsWith("plus:");
        return (
          <li key={f} className={cn("flex items-start gap-2.5 text-sm", isHeader ? "font-semibold text-foreground" : "text-muted-foreground")}>
            {!isHeader && (
              <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full", accent ? "bg-gold/20 text-gold" : "bg-primary/10 text-primary")}>
                <Check className="h-3 w-3" />
              </span>
            )}
            <span className={isHeader ? "" : "leading-6"}>{f}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function PricingPlans() {
  const reduce = useReducedMotion();
  const [billing, setBilling] = useState<Billing>("annual");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* billing toggle */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="flex flex-col items-center gap-3"
      >
        <div className="inline-flex items-center rounded-full border border-border bg-card p-1">
          {(["monthly", "annual"] as Billing[]).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBilling(b)}
              className={cn("relative z-10 rounded-full px-5 py-2 text-sm font-semibold capitalize transition-colors", billing === b ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              {billing === b && <motion.span layoutId="billing-pill" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              {b}
            </button>
          ))}
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-foreground/80">
          <Sparkles className="h-3.5 w-3.5 text-gold" /> Save Rs. 6,000 a year with annual billing
        </span>
      </motion.div>

      {/* plans */}
      <div className="mt-12 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Client - Free */}
        <PlanCard index={0} reduce={reduce}>
          <PlanHeader icon={Users} tone="slate" eyebrow="For clients" name="Free" />
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Find verified lawyers, book consultations, and track your cases - at no cost.</p>
          <div className="mt-6 flex items-baseline gap-1.5">
            <span className="font-heading text-4xl font-bold tracking-tight text-foreground">Rs. 0</span>
            <span className="text-sm text-muted-foreground">/ forever</span>
          </div>
          <Link href="/register/client" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground transition-colors hover:border-gold/40 hover:bg-secondary">
            Create free account
          </Link>
          <div className="mt-6 border-t border-border/70 pt-6"><FeatureList items={CLIENT_FEATURES} /></div>
        </PlanCard>

        {/* Advocate Pro - highlighted */}
        <PlanCard index={1} reduce={reduce} highlighted>
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-gold px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-md">
            Most popular
          </span>
          <PlanHeader icon={Crown} tone="gold" eyebrow="For advocates" name="Pro" />
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Grow your practice with featured placement, full tools, and zero commission.</p>
          <div className="mt-6 min-h-[68px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={billing}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-baseline gap-1.5">
                  <span className="font-heading text-4xl font-bold tracking-tight text-foreground">{billing === "monthly" ? "Rs. 2,000" : "Rs. 18,000"}</span>
                  <span className="text-sm text-muted-foreground">/ {billing === "monthly" ? "month" : "year"}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {billing === "monthly" ? "Billed monthly, cancel anytime" : "≈ Rs. 1,500 / month - billed annually"}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          <Link href="/register/lawyer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl">
            Start as a Pro advocate <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="mt-6 border-t border-border/70 pt-6"><FeatureList items={PRO_FEATURES} accent /></div>
        </PlanCard>

        {/* Commission - pay as you go */}
        <PlanCard index={2} reduce={reduce}>
          <PlanHeader icon={Percent} tone="slate" eyebrow="For advocates" name="Pay-as-you-go" />
          <p className="mt-2 text-sm leading-6 text-muted-foreground">No monthly fee. Pay a small commission only when you earn from a booking.</p>
          <div className="mt-6 flex items-baseline gap-1.5">
            <span className="font-heading text-4xl font-bold tracking-tight text-foreground">10%</span>
            <span className="text-sm text-muted-foreground">/ paid consultation</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Rs. 0 monthly - perfect to get started</p>
          <Link href="/register/lawyer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground transition-colors hover:border-gold/40 hover:bg-secondary">
            Join free, pay per booking
          </Link>
          <div className="mt-6 border-t border-border/70 pt-6"><FeatureList items={COMMISSION_FEATURES} /></div>
        </PlanCard>
      </div>

      {/* trust strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
      >
        <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-gold" /> Secure, encrypted payments</span>
        <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-gold" /> No setup fees</span>
        <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-gold" /> Cancel anytime</span>
        <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-gold" /> Digital invoice for every payment</span>
      </motion.div>
    </div>
  );
}

function PlanCard({ children, index, reduce, highlighted }: { children: React.ReactNode; index: number; reduce: boolean | null; highlighted?: boolean }) {
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: easeOut, delay: index * 0.1 }}
      className={cn(
        "relative flex flex-col rounded-3xl border bg-card p-7",
        highlighted ? "border-gold/40 shadow-2xl shadow-primary/10 ring-1 ring-gold/30 lg:-mt-4 lg:pb-9" : "border-border/80 shadow-sm"
      )}
    >
      {highlighted && <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-3xl" aria-hidden />}
      {children}
    </motion.div>
  );
}

function PlanHeader({ icon: Icon, tone, eyebrow, name }: { icon: typeof Users; tone: "slate" | "gold"; eyebrow: string; name: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", tone === "gold" ? "bg-gold/15 text-gold" : "bg-primary/8 text-primary")}>
        <Icon className="h-5.5 w-5.5" />
      </span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{eyebrow}</p>
        <p className="font-heading text-lg font-semibold text-foreground">{name}</p>
      </div>
    </div>
  );
}
