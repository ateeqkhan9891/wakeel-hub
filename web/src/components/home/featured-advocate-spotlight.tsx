"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  Landmark,
  LockKeyhole,
  Scale,
  ShieldCheck,
  Sparkles,
  Star,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/utils";

export interface FeaturedAdvocateProfile {
  name: string;
  slug: string;
  title: string;
  city: string;
  photoUrl: string;
  barCouncilNumber: string;
  experienceYears: number;
  casesHandled: number;
  successRate: number;
  responseTime: string;
  consultationFee: number;
  rating: number;
  expertise: string[];
}

const trustItems = [
  "Bar Council Verified",
  "Secure Consultations",
  "Transparent Pricing",
  "Nationwide Legal Coverage",
] as const;

const defaultExpertise = ["Family Law", "Civil Law", "Corporate Law", "Property Disputes", "High Court Practice"];

const cardReveal = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0 },
} as const;

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
} as const;

function responseHours(value: string) {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 24;
}

function AnimatedCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(reduceMotion ? value : 0);
  const renderedDisplay = reduceMotion ? value : display;

  useEffect(() => {
    if (reduceMotion) return;
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.15,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
      <p className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        <span ref={ref}>{renderedDisplay.toLocaleString()}</span>
        {suffix}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-white/55">{label}</p>
    </div>
  );
}

function LegalMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 280 280" className="absolute -right-10 -top-12 h-44 w-44 text-white/[0.055] sm:h-64 sm:w-64">
      <path d="M140 28v196" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M82 78h116" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M92 78 48 164h88L92 78Z" fill="none" stroke="currentColor" strokeWidth="7" strokeLinejoin="round" />
      <path d="M188 78 144 164h88L188 78Z" fill="none" stroke="currentColor" strokeWidth="7" strokeLinejoin="round" />
      <path d="M94 224h92" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export function FeaturedAdvocateSpotlight({ advocate }: { advocate: FeaturedAdvocateProfile | null }) {
  const reduceMotion = useReducedMotion();

  const expertise = useMemo(() => {
    const clean = advocate?.expertise.filter(Boolean) ?? [];
    return Array.from(new Set([...clean, ...defaultExpertise])).slice(0, 5);
  }, [advocate?.expertise]);

  if (!advocate) return null;

  const stats = [
    { value: Math.max(advocate.experienceYears, 1), suffix: "+", label: "Years Experience" },
    { value: Math.max(advocate.casesHandled, 1), suffix: "+", label: "Cases Handled" },
    { value: Math.max(advocate.successRate || Math.round((advocate.rating / 5) * 100), 1), suffix: "%", label: "Client Satisfaction" },
    { value: responseHours(advocate.responseTime), suffix: "h", label: "Average Response Time" },
  ];

  return (
    <motion.section
      id="featured-advocate"
      aria-labelledby="featured-advocate-title"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.28 }}
      variants={stagger}
      className="relative z-10 mx-auto mt-10 max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#071126] p-3 text-white shadow-2xl shadow-slate-950/25 sm:mt-12 sm:rounded-[2.5rem] sm:p-4 lg:mt-14"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,17,38,0.98),rgba(12,31,67,0.96)_45%,rgba(7,17,38,0.98))]" aria-hidden />
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:38px_38px]" aria-hidden />
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-0 h-72 w-[34rem] -translate-x-1/2 rounded-full bg-gold/18 blur-3xl"
        animate={reduceMotion ? undefined : { opacity: [0.22, 0.38, 0.22], scale: [1, 1.08, 1] }}
        transition={reduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-28 right-0 h-80 w-[34rem] rounded-full bg-emerald-400/10 blur-3xl"
        animate={reduceMotion ? undefined : { opacity: [0.14, 0.28, 0.14], x: [0, -18, 0] }}
        transition={reduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <LegalMark />

      <div className="relative grid gap-8 rounded-[1.55rem] border border-white/10 bg-white/[0.035] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-xl sm:rounded-[2rem] sm:p-6 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10 lg:p-8 xl:p-10">
        <motion.div variants={cardReveal} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} className="relative">
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={reduceMotion ? undefined : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={reduceMotion ? undefined : { rotateX: 2.5, rotateY: -3, y: -12 }}
            className="group relative mx-auto max-w-md rounded-[2rem] border border-gold/35 bg-gradient-to-br from-white/[0.12] to-white/[0.035] p-3 shadow-2xl shadow-black/35"
          >
            <div className="absolute -inset-1 rounded-[2.15rem] bg-gradient-to-br from-gold/35 via-transparent to-emerald-300/20 opacity-70 blur-lg transition-opacity group-hover:opacity-100" aria-hidden />
            <div className="relative overflow-hidden rounded-[1.55rem] border border-white/10 bg-slate-900">
              <div className="absolute inset-x-0 top-0 z-10 h-1/3 bg-gradient-to-b from-white/18 to-transparent" aria-hidden />
              <Image
                src={advocate.photoUrl}
                alt={`${advocate.name}, featured advocate on WakeelHub Pakistan`}
                width={720}
                height={860}
                sizes="(min-width: 1024px) 430px, 92vw"
                className="aspect-[4/5] w-full object-cover grayscale-[8%] transition duration-500 group-hover:scale-[1.025] group-hover:grayscale-0"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071126]/78 via-transparent to-transparent" aria-hidden />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.45, ease: "easeOut" }}
              className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-[#071126]/82 p-4 shadow-xl shadow-black/25 backdrop-blur-xl"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold text-[#071126] shadow-lg shadow-gold/20">
                  <BadgeCheck className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Verified Advocate</p>
                  <p className="mt-0.5 text-xs leading-5 text-white/62">Pakistan Bar Council</p>
                  <p className="mt-1 text-[11px] text-white/42">Enrollment: {advocate.barCouncilNumber}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div variants={stagger} className="flex min-w-0 flex-col justify-center">
          <motion.div variants={cardReveal} transition={{ duration: 0.55, ease: "easeOut" }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Featured Advocate
            </span>

            <h2 id="featured-advocate-title" className="mt-5 text-balance font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Meet Our Recommended Legal Expert
            </h2>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/62">
              <span className="inline-flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-gold" aria-hidden />
                {advocate.title}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/35" aria-hidden />
              <span className="inline-flex items-center gap-1.5">
                <Landmark className="h-4 w-4 text-gold" aria-hidden />
                {advocate.city}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/35" aria-hidden />
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-gold text-gold" aria-hidden />
                {advocate.rating.toFixed(1)} rating
              </span>
            </div>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
              A trusted legal professional helping clients across Pakistan with expert representation, transparent consultation, and proven courtroom experience.
            </p>
          </motion.div>

          <motion.div variants={cardReveal} transition={{ duration: 0.55, ease: "easeOut" }} className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((stat) => (
              <AnimatedCounter key={stat.label} {...stat} />
            ))}
          </motion.div>

          <motion.div variants={cardReveal} transition={{ duration: 0.55, ease: "easeOut" }} className="mt-6 flex flex-wrap gap-2">
            {expertise.map((item) => (
              <motion.span
                key={item}
                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.03 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="rounded-full border border-white/[0.12] bg-white/[0.065] px-3.5 py-2 text-sm font-medium text-white/78 shadow-sm backdrop-blur transition-colors hover:border-gold/40 hover:bg-gold/[0.12] hover:text-white"
              >
                {item}
              </motion.span>
            ))}
          </motion.div>

          <motion.div variants={cardReveal} transition={{ duration: 0.55, ease: "easeOut" }} className="mt-8 grid grid-cols-1 gap-3 sm:flex">
            <motion.div whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.99 }}>
              <Button asChild size="lg" className="w-full rounded-2xl bg-white px-6 text-[#071126] shadow-xl shadow-gold/10 hover:bg-gold hover:shadow-gold/25 sm:w-auto">
                <Link href={`/lawyers/${advocate.slug}#book-consultation`}>
                  Book Consultation
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.99 }}>
              <Button asChild size="lg" variant="outline" className="w-full rounded-2xl border-white/15 bg-white/[0.045] px-6 text-white backdrop-blur hover:bg-white/10 sm:w-auto">
                <Link href={`/lawyers/${advocate.slug}`}>View Full Profile</Link>
              </Button>
            </motion.div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white/62 backdrop-blur sm:ml-auto">
              <WalletCards className="h-4 w-4 text-gold" aria-hidden />
              From {formatPKR(advocate.consultationFee)}
            </div>
          </motion.div>

          <motion.div variants={cardReveal} transition={{ duration: 0.55, ease: "easeOut" }} className="mt-7 grid grid-cols-1 gap-2 border-t border-white/10 pt-5 sm:grid-cols-2 xl:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-medium text-white/68">
                {item === "Secure Consultations" ? <LockKeyhole className="h-4 w-4 text-gold" aria-hidden /> : item === "Transparent Pricing" ? <Clock3 className="h-4 w-4 text-gold" aria-hidden /> : item === "Nationwide Legal Coverage" ? <BriefcaseBusiness className="h-4 w-4 text-gold" aria-hidden /> : <ShieldCheck className="h-4 w-4 text-gold" aria-hidden />}
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
