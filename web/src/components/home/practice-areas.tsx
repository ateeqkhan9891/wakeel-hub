"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Gavel,
  HardHat,
  Landmark,
  Plane,
  Receipt,
  Scale,
  ScrollText,
  ShieldAlert,
  ShoppingCart,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Users,
  Gavel,
  Building2,
  Scale,
  Briefcase,
  Receipt,
  Plane,
  Landmark,
  HardHat,
  ScrollText,
  ShieldAlert,
  ShoppingCart,
};

const easeOut = [0.22, 1, 0.36, 1] as const;
const DIRECTORY_NOTE = "Live advocate data appears inside the lawyer directory";

interface Area {
  slug: string;
  name: string;
  icon: string;
  finder: string | null;
  services: string[];
}

const FEATURED: Area[] = [
  { slug: "family-law", name: "Family Law", icon: "Users", finder: "family", services: ["Khula", "Divorce", "Child Custody"] },
  { slug: "property-law", name: "Property Law", icon: "Building2", finder: "property", services: ["Possession", "Transfers", "Title Verification"] },
  { slug: "criminal-law", name: "Criminal Law", icon: "Gavel", finder: "criminal", services: ["Bail", "FIR Quashing", "Appeals"] },
];

const REST: Area[] = [
  { slug: "civil-law", name: "Civil Law", icon: "Scale", finder: null, services: ["Recovery", "Contracts", "Damages"] },
  { slug: "corporate-law", name: "Corporate Law", icon: "Briefcase", finder: "corporate", services: ["Incorporation", "Compliance", "Contracts"] },
  { slug: "tax-law", name: "Tax Law", icon: "Receipt", finder: null, services: ["FBR Notices", "Appeals", "Returns"] },
  { slug: "immigration-law", name: "Immigration Law", icon: "Plane", finder: "immigration", services: ["Visas", "Citizenship", "Appeals"] },
  { slug: "banking-law", name: "Banking Law", icon: "Landmark", finder: null, services: ["Loan Recovery", "Finance Disputes"] },
  { slug: "labour-law", name: "Labour Law", icon: "HardHat", finder: null, services: ["Termination", "Wages", "Disputes"] },
  { slug: "constitutional-law", name: "Constitutional Law", icon: "ScrollText", finder: null, services: ["Writ Petitions", "Fundamental Rights"] },
  { slug: "cyber-crime", name: "Cyber Crime", icon: "ShieldAlert", finder: null, services: ["FIA Complaints", "Online Harassment"] },
  { slug: "consumer-law", name: "Consumer Law", icon: "ShoppingCart", finder: null, services: ["Protection Claims", "Service Disputes"] },
];

const FINDERS = [
  { key: "family", label: "Family", icon: Users },
  { key: "property", label: "Property", icon: Building2 },
  { key: "criminal", label: "Criminal", icon: Gavel },
  { key: "corporate", label: "Corporate", icon: Briefcase },
  { key: "immigration", label: "Immigration", icon: Plane },
] as const;

function Backdrop({ reduce }: { reduce: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle,currentColor_1px,transparent_1px)] [background-size:30px_30px] text-foreground" />
      <motion.div
        className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
        animate={reduce ? undefined : { x: [0, 26, 0], y: [0, -18, 0] }}
        transition={reduce ? undefined : { duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        animate={reduce ? undefined : { x: [0, -24, 0], y: [0, 20, 0] }}
        transition={reduce ? undefined : { duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function AreaCard({
  area,
  dimmed,
  highlighted,
  index,
  featured = false,
}: {
  area: Area;
  dimmed: boolean;
  highlighted: boolean;
  index: number;
  featured?: boolean;
}) {
  const Icon = ICONS[area.icon] ?? Scale;

  return (
    <motion.div
      initial={{ opacity: 0, y: featured ? 28 : 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: featured ? 0.3 : 0.4 }}
      transition={{ duration: featured ? 0.55 : 0.45, ease: easeOut, delay: Math.min(index, 5) * 0.06 }}
      animate={{ opacity: dimmed ? 0.45 : 1, scale: highlighted ? 1.02 : 1 }}
      className={featured ? "group relative shrink-0 basis-[85%] snap-center sm:basis-[55%] lg:basis-auto lg:shrink" : ""}
    >
      <Link
        href={`/practice-areas/${area.slug}`}
        className={`group relative flex h-full flex-col overflow-hidden border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl hover:shadow-primary/10 ${
          featured ? "rounded-3xl p-6" : "rounded-2xl p-5"
        } ${highlighted ? "border-gold/60 ring-1 ring-gold/40" : "border-border"}`}
      >
        {featured && (
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
        )}

        <div className="flex items-start justify-between gap-3">
          <span className={`${featured ? "h-14 w-14 rounded-2xl" : "h-11 w-11 rounded-xl"} flex items-center justify-center bg-primary/8 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-gold/15 group-hover:text-gold-foreground`}>
            <Icon className={featured ? "h-6.5 w-6.5" : "h-5 w-5"} strokeWidth={2} />
          </span>
          {featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-[11px] font-semibold text-gold-foreground/80 ring-1 ring-inset ring-gold/20">
              <Sparkles className="h-3 w-3" /> Common matter
            </span>
          )}
        </div>

        <h3 className={`${featured ? "mt-5 text-xl" : "mt-4 text-base"} font-heading font-semibold text-foreground`}>{area.name}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Explore guidance first, then compare real advocate profiles from the live directory.
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {area.services.map((service) => (
            <span key={service} className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-xs font-medium text-foreground">
              {service}
            </span>
          ))}
        </div>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary transition-colors group-hover:text-gold-foreground">
          Explore area
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </Link>
    </motion.div>
  );
}

export function PracticeAreas() {
  const reduce = !!useReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);

  function isHighlighted(area: Area) {
    return selected !== null && area.finder === selected;
  }
  function isDimmed(area: Area) {
    return selected !== null && area.finder !== selected;
  }

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <Backdrop reduce={reduce} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-foreground/80 ring-1 ring-inset ring-gold/20">
            <Scale className="h-3.5 w-3.5" /> Practice areas
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Find the right lawyer for your legal matter
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Browse Pakistan&apos;s most important legal specialties. Each category leads to guidance and then to real advocate profiles from WakeelHub.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60" />}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            {DIRECTORY_NOTE}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: easeOut, delay: 0.1 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <p className="text-sm font-medium text-foreground">What legal help do you need?</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {FINDERS.map((finder) => {
              const active = selected === finder.key;
              return (
                <button
                  key={finder.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelected(active ? null : finder.key)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "border-border bg-card text-foreground hover:border-gold/40 hover:bg-secondary"
                  }`}
                >
                  <finder.icon className="h-4 w-4" />
                  {finder.label}
                </button>
              );
            })}
            {selected && (
              <button type="button" onClick={() => setSelected(null)} className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline">
                Clear
              </button>
            )}
          </div>
        </motion.div>

        <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {FEATURED.map((area, index) => (
            <AreaCard key={area.slug} area={area} index={index} highlighted={isHighlighted(area)} dimmed={isDimmed(area)} featured />
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-6 lg:grid-cols-3">
          {REST.map((area, index) => (
            <AreaCard key={area.slug} area={area} index={index} highlighted={isHighlighted(area)} dimmed={isDimmed(area)} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="mt-12 text-center"
        >
          <Link
            href="/find-lawyers"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          >
            Browse live directory
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
