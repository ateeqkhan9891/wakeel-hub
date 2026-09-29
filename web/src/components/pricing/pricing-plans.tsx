"use client";

import { useState } from "react";

import Link from "next/link";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import {
  ArrowRight,
  Check,
  Crown,
  Percent,
  ShieldCheck,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Billing = "monthly" | "annual";

const easeOut = [0.22, 1, 0.36, 1] as const;

const CLIENT_FEATURES = [
  "Unlimited lawyer search & filters",
  "Book online, in-person or phone consultations",
  "Secure advocate communication",
  "Case tracking & timeline",
  "Document sharing & downloads",
  "Free forever",
];

const COMMISSION_FEATURES = [
  "Verified public advocate profile",
  "Receive booking & consultation requests",
  "Case & client management tools",
  "Client chat & document sharing",
  "Pay only when you earn",
  "Standard support",
];

const PRO_FEATURES = [
  "Everything in Pay-as-you-go",
  "Verified advocate badge",
  "Featured placement in search",
  "Unlimited client bookings",
  "Hearing tracker & case timeline",
  "Practice analytics dashboard",
  "Priority support",
  "0% commission",
];

function FeatureList({
  items,
  accent = false,
}: {
  items: string[];
  accent?: boolean;
}) {
  return (
    <ul className="space-y-3.5">
      {items.map((feature, index) => {
        const isHeader =
          index === 0 && feature === "Everything in Pay-as-you-go";

        return (
          <li
            key={feature}
            className={cn(
              "flex items-start gap-3 text-sm",
              isHeader
                ? "font-semibold text-foreground"
                : "text-muted-foreground",
            )}
          >
            {!isHeader && (
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                  accent
                    ? "bg-gold/12 text-gold-foreground"
                    : "bg-primary/8 text-primary",
                )}
              >
                <Check className="h-3 w-3" strokeWidth={2.5} />
              </span>
            )}

            <span className={cn(!isHeader && "leading-5.5")}>
              {feature}
            </span>
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
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="flex flex-col items-center"
      >
        <div className="inline-flex rounded-xl border border-border bg-card p-1 shadow-sm">
          {(["monthly", "annual"] as Billing[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setBilling(option)}
              className={cn(
                "relative rounded-lg px-5 py-2 text-sm font-semibold capitalize transition-colors",
                billing === option
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {billing === option && (
                <motion.span
                  layoutId="billing-pill"
                  className="absolute inset-0 -z-10 rounded-lg bg-primary"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 32,
                  }}
                />
              )}

              {option}
            </button>
          ))}
        </div>

        <p className="mt-3 text-xs font-medium text-muted-foreground">
          Annual billing saves Rs. 6,000
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:items-start">
        <PlanCard index={0} reduce={reduce}>
          <PlanHeader
            icon={Percent}
            tone="slate"
            eyebrow="For advocates"
            name="Pay-as-you-go"
          />

          <p className="mt-4 min-h-[48px] text-sm leading-6 text-muted-foreground">
            Start building your practice without a monthly subscription.
          </p>

          <div className="mt-7">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-4xl font-bold tracking-tight text-foreground">
                10%
              </span>

              <span className="text-sm text-muted-foreground">
                / paid consultation
              </span>
            </div>

            <p className="mt-1.5 text-xs text-muted-foreground">
              Rs. 0 monthly
            </p>
          </div>

          <Link
            href="/register/lawyer"
            className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-semibold text-foreground transition-all hover:border-gold/40 hover:bg-secondary"
          >
            Join as an advocate
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="mt-7 border-t border-border pt-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Includes
            </p>

            <FeatureList items={COMMISSION_FEATURES} />
          </div>
        </PlanCard>

        <PlanCard index={1} reduce={reduce} highlighted>
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className="inline-flex items-center rounded-full border border-gold/25 bg-gold/8 px-2.5 py-1 text-[11px] font-semibold text-gold-foreground">
              Recommended
            </span>

            <span className="text-[11px] font-medium text-muted-foreground">
              For growing practices
            </span>
          </div>

          <PlanHeader
            icon={Crown}
            tone="gold"
            eyebrow="For advocates"
            name="Pro"
          />

          <p className="mt-4 min-h-[48px] text-sm leading-6 text-muted-foreground">
            More visibility, more tools, and no commission on your earnings.
          </p>

          <div className="mt-7 min-h-[70px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={billing}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-baseline gap-1.5">
                  <span className="font-heading text-4xl font-bold tracking-tight text-foreground">
                    {billing === "monthly" ? "Rs. 2,000" : "Rs. 18,000"}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    / {billing === "monthly" ? "month" : "year"}
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-muted-foreground">
                  {billing === "monthly"
                    ? "Billed monthly"
                    : "≈ Rs. 1,500 / month when billed annually"}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <Link
            href="/register/lawyer"
            className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            Start with Pro
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="mt-7 border-t border-border pt-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Everything included
            </p>

            <FeatureList items={PRO_FEATURES} accent />
          </div>
        </PlanCard>

        <PlanCard index={2} reduce={reduce}>
          <PlanHeader
            icon={Users}
            tone="slate"
            eyebrow="For clients"
            name="Free"
          />

          <p className="mt-4 min-h-[48px] text-sm leading-6 text-muted-foreground">
            Find advocates, compare options, and manage your legal matters at
            no cost.
          </p>

          <div className="mt-7">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-4xl font-bold tracking-tight text-foreground">
                Rs. 0
              </span>

              <span className="text-sm text-muted-foreground">
                / forever
              </span>
            </div>

            <p className="mt-1.5 text-xs text-muted-foreground">
              No subscription required
            </p>
          </div>

          <Link
            href="/register/client"
            className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-semibold text-foreground transition-all hover:border-gold/40 hover:bg-secondary"
          >
            Create free account
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="mt-7 border-t border-border pt-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Includes
            </p>

            <FeatureList items={CLIENT_FEATURES} />
          </div>
        </PlanCard>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-border pt-6 text-xs text-muted-foreground"
      >
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-gold" />
          Secure payments
        </span>

        <span className="inline-flex items-center gap-1.5">
          <Check className="h-4 w-4 text-gold" />
          No setup fees
        </span>

        <span className="inline-flex items-center gap-1.5">
          <Check className="h-4 w-4 text-gold" />
          Cancel anytime
        </span>

        <span className="inline-flex items-center gap-1.5">
          <Check className="h-4 w-4 text-gold" />
          Digital invoices
        </span>
      </motion.div>
    </div>
  );
}

function PlanCard({
  children,
  index,
  reduce,
  highlighted,
}: {
  children: React.ReactNode;
  index: number;
  reduce: boolean | null;
  highlighted?: boolean;
}) {
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        ease: easeOut,
        delay: index * 0.08,
      }}
      className={cn(
        "relative flex flex-col rounded-3xl border bg-card p-7",
        highlighted
          ? "border-gold/35 shadow-lg shadow-slate-950/8 ring-1 ring-gold/20 lg:-mt-3"
          : "border-border shadow-sm",
      )}
    >
      {highlighted && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gold/8 blur-3xl"
        />
      )}

      <div className="relative">{children}</div>
    </motion.div>
  );
}

function PlanHeader({
  icon: Icon,
  tone,
  eyebrow,
  name,
}: {
  icon: typeof Users;
  tone: "slate" | "gold";
  eyebrow: string;
  name: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          tone === "gold"
            ? "bg-gold/12 text-gold-foreground"
            : "bg-primary/8 text-primary",
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
      </span>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {eyebrow}
        </p>

        <p className="font-heading text-lg font-semibold tracking-tight text-foreground">
          {name}
        </p>
      </div>
    </div>
  );
}
