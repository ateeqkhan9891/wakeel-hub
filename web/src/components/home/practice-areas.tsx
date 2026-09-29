"use client";

import { useState } from "react";

import Link from "next/link";

import { motion } from "framer-motion";

import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  Globe2,
  Gavel,
  Handshake,
  HardHat,
  House,
  Landmark,
  ReceiptText,
  Scale,
  ShieldCheck,
  ShoppingBag,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  UsersRound,
  House,
  Gavel,
  Scale,
  BriefcaseBusiness,
  ReceiptText,
  Globe2,
  Landmark,
  HardHat,
  FileText,
  ShieldCheck,
  ShoppingBag,
};

const easeOut = [0.22, 1, 0.36, 1] as const;

const DIRECTORY_NOTE =
  "Live advocate profiles are available in the directory";

interface Area {
  slug: string;
  name: string;
  icon: string;
  finder: string | null;
  services: string[];
}

const FEATURED: Area[] = [
  {
    slug: "family-law",
    name: "Family Law",
    icon: "UsersRound",
    finder: "family",
    services: ["Khula", "Divorce", "Child Custody"],
  },
  {
    slug: "property-law",
    name: "Property Law",
    icon: "House",
    finder: "property",
    services: ["Possession", "Transfers", "Title Verification"],
  },
  {
    slug: "criminal-law",
    name: "Criminal Law",
    icon: "Gavel",
    finder: "criminal",
    services: ["Bail", "FIR Quashing", "Appeals"],
  },
];

const REST: Area[] = [
  {
    slug: "civil-law",
    name: "Civil Law",
    icon: "Scale",
    finder: null,
    services: ["Recovery", "Contracts", "Damages"],
  },
  {
    slug: "corporate-law",
    name: "Corporate Law",
    icon: "BriefcaseBusiness",
    finder: "corporate",
    services: ["Incorporation", "Compliance", "Contracts"],
  },
  {
    slug: "tax-law",
    name: "Tax Law",
    icon: "ReceiptText",
    finder: null,
    services: ["FBR Notices", "Appeals", "Returns"],
  },
  {
    slug: "immigration-law",
    name: "Immigration Law",
    icon: "Globe2",
    finder: "immigration",
    services: ["Visas", "Citizenship", "Appeals"],
  },
  {
    slug: "banking-law",
    name: "Banking Law",
    icon: "Landmark",
    finder: null,
    services: ["Loan Recovery", "Finance Disputes"],
  },
  {
    slug: "labour-law",
    name: "Labour Law",
    icon: "HardHat",
    finder: null,
    services: ["Termination", "Wages", "Disputes"],
  },
  {
    slug: "constitutional-law",
    name: "Constitutional Law",
    icon: "FileText",
    finder: null,
    services: ["Writ Petitions", "Fundamental Rights"],
  },
  {
    slug: "cyber-crime",
    name: "Cyber Crime",
    icon: "ShieldCheck",
    finder: null,
    services: ["FIA Complaints", "Online Harassment"],
  },
  {
    slug: "consumer-law",
    name: "Consumer Law",
    icon: "ShoppingBag",
    finder: null,
    services: ["Protection Claims", "Service Disputes"],
  },
];

const FINDERS = [
  {
    key: "family",
    label: "Family",
    icon: UsersRound,
  },
  {
    key: "property",
    label: "Property",
    icon: House,
  },
  {
    key: "criminal",
    label: "Criminal",
    icon: Gavel,
  },
  {
    key: "corporate",
    label: "Corporate",
    icon: BriefcaseBusiness,
  },
  {
    key: "immigration",
    label: "Immigration",
    icon: Globe2,
  },
] as const;

function Backdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 opacity-[0.028] [background-image:radial-gradient(circle,currentColor_1px,transparent_1px)] [background-size:32px_32px] text-foreground" />

      <motion.div
        className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-gold/8 blur-3xl"
        animate={{
          x: [0, 24, 0],
          y: [0, -16, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-primary/6 blur-3xl"
        animate={{
          x: [0, -20, 0],
          y: [0, 18, 0],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
        }}
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
      initial={{
        opacity: 0,
        y: featured ? 24 : 18,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: featured ? 0.3 : 0.4,
      }}
      transition={{
        duration: featured ? 0.55 : 0.45,
        ease: easeOut,
        delay: Math.min(index, 5) * 0.06,
      }}
      animate={{
        opacity: dimmed ? 0.42 : 1,
        scale: highlighted ? 1.015 : 1,
      }}
      className={
        featured
          ? "group relative w-[86%] shrink-0 snap-center sm:w-[56%] lg:w-auto lg:shrink"
          : ""
      }
    >
      <Link
        href={`/practice-areas/${area.slug}`}
        className={`group relative flex h-full flex-col overflow-hidden border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl hover:shadow-primary/8 ${
          featured
            ? "rounded-[1.5rem] p-5 shadow-md sm:p-6"
            : "rounded-2xl p-4 shadow-sm sm:p-5"
        } ${
          highlighted
            ? "border-gold/60 bg-gold/[0.025] ring-1 ring-gold/30"
            : "border-border"
        }`}
      >
        <div
          aria-hidden
          className={`pointer-events-none absolute bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 ${
            featured
              ? "-right-16 -top-16 h-48 w-48"
              : "-right-12 -top-12 h-36 w-36"
          }`}
        />

        <div className="relative flex items-start justify-between gap-3 sm:gap-4">
          <span
            className={`flex shrink-0 items-center justify-center border border-primary/8 bg-primary/[0.055] text-primary transition-all duration-300 group-hover:border-gold/20 group-hover:bg-gold/10 group-hover:text-gold-foreground group-hover:shadow-sm ${
              featured
                ? "h-12 w-12 rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl"
                : "h-10 w-10 rounded-xl sm:h-11 sm:w-11"
            }`}
          >
            <Icon
              className={featured ? "h-5 w-5 sm:h-6 sm:w-6" : "h-5 w-5"}
              strokeWidth={1.8}
            />
          </span>

          {featured && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold/20 bg-gold/8 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-gold-foreground/80 sm:text-[10px]">
              Popular
            </span>
          )}
        </div>

        <h3
          className={`relative font-heading font-semibold tracking-tight text-foreground ${
            featured
              ? "mt-5 text-lg sm:mt-6 sm:text-xl"
              : "mt-3 text-base sm:mt-4"
          }`}
        >
          {area.name}
        </h3>

        <p
          className={`relative text-muted-foreground ${
            featured
              ? "mt-2 text-sm leading-6"
              : "mt-2 text-xs leading-5 sm:text-sm"
          }`}
        >
          Find guidance and connect with advocates experienced in{" "}
          {area.name.toLowerCase()} matters.
        </p>

        <div className="relative mt-4 flex flex-wrap gap-1.5">
          {area.services.map((service) => (
            <span
              key={service}
              className="rounded-full border border-border bg-secondary/40 px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition-colors group-hover:border-gold/15 group-hover:bg-gold/5 group-hover:text-foreground sm:text-[11px]"
            >
              {service}
            </span>
          ))}
        </div>

        <span
          className={`relative mt-auto inline-flex items-center gap-1.5 font-semibold text-primary transition-colors group-hover:text-gold-foreground ${
            featured
              ? "pt-5 text-sm sm:pt-6"
              : "pt-4 text-xs sm:pt-5 sm:text-sm"
          }`}
        >
          Explore area
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </Link>
    </motion.div>
  );
}

export function PracticeAreas() {
  const [selected, setSelected] = useState<string | null>(null);

  function isHighlighted(area: Area) {
    return selected !== null && area.finder === selected;
  }

  function isDimmed(area: Area) {
    return selected !== null && area.finder !== selected;
  }

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      <Backdrop />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/8 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-foreground/80 sm:text-[11px]">
            <Scale className="h-3.5 w-3.5" />
            Legal expertise
          </span>

          <h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem]">
            Legal help for every matter
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-base sm:leading-7">
            Explore the areas of law covered by Wakeel360, from family and
            property matters to corporate, tax, and specialist disputes.
          </p>

          <div className="mx-auto mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-[11px] font-medium text-muted-foreground shadow-sm sm:mt-5 sm:px-4 sm:text-xs">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/50 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>

            <span className="truncate">{DIRECTORY_NOTE}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: 0.5,
            ease: easeOut,
            delay: 0.1,
          }}
          className="mx-auto mt-8 max-w-3xl sm:mt-10"
        >
          <div className="rounded-2xl border border-border bg-card/80 p-2.5 shadow-sm backdrop-blur sm:p-3">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-1 sm:px-2">
                <Handshake className="h-4 w-4 shrink-0 text-gold-foreground" />

                <span className="text-sm font-semibold text-foreground">
                  What do you need help with?
                </span>
              </div>

              <div className="hidden h-px w-full bg-border sm:block" />

              <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:pb-0">
                {FINDERS.map((finder) => {
                  const active = selected === finder.key;
                  const FinderIcon = finder.icon;

                  return (
                    <button
                      key={finder.key}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        setSelected(active ? null : finder.key)
                      }
                      className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                        active
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-transparent bg-secondary/60 text-foreground hover:border-gold/25 hover:bg-gold/8"
                      }`}
                    >
                      <FinderIcon className="h-3.5 w-3.5" />
                      {finder.label}
                    </button>
                  );
                })}

                {selected && (
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="min-h-10 shrink-0 px-2 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 sm:mt-12">
          <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">
                Popular areas
              </p>

              <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground sm:text-lg">
                Start with a common legal matter
              </h3>
            </div>

            <Link
              href="/practice-areas"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-gold-foreground sm:inline-flex"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
            {FEATURED.map((area, index) => (
              <AreaCard
                key={area.slug}
                area={area}
                index={index}
                highlighted={isHighlighted(area)}
                dimmed={isDimmed(area)}
                featured
              />
            ))}
          </div>
        </div>

        <div className="mt-7 sm:mt-8">
          <div className="mb-4 flex items-center gap-3 sm:mb-5">
            <div className="h-px flex-1 bg-border" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">
              More practice areas
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {REST.map((area, index) => (
              <AreaCard
                key={area.slug}
                area={area}
                index={index}
                highlighted={isHighlighted(area)}
                dimmed={isDimmed(area)}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: 0.5,
            ease: easeOut,
          }}
          className="mt-10 text-center sm:mt-12"
        >
          <Link
            href="/practice-areas"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/15"
          >
            Explore all practice areas
            <ArrowRight className="h-4 w-4" />
          </Link>

          <p className="mt-3 text-xs text-muted-foreground">
            Or browse verified advocates directly
          </p>

          <Link
            href="/find-lawyers"
            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Open lawyer directory
            <ArrowRight className="h-3 w-3" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}