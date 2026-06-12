"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, CheckCircle2, ShieldCheck, Sparkles, Star } from "lucide-react";

const TRUST_STATS = [
  { value: "500+", label: "Verified Lawyers" },
  { value: "50+", label: "Practice Areas" },
  { value: "Nationwide", label: "Coverage" },
] as const;

const PARTICLES = [
  { left: "12%", top: "16%", size: "h-1 w-1", d: 7 },
  { left: "78%", top: "12%", size: "h-1.5 w-1.5", d: 8.5 },
  { left: "66%", top: "28%", size: "h-1 w-1", d: 9 },
  { left: "22%", top: "54%", size: "h-1.5 w-1.5", d: 10 },
  { left: "88%", top: "62%", size: "h-1 w-1", d: 8 },
  { left: "46%", top: "82%", size: "h-1.5 w-1.5", d: 9.5 },
  { left: "58%", top: "70%", size: "h-1 w-1", d: 7.8 },
  { left: "34%", top: "34%", size: "h-1 w-1", d: 11 },
] as const;

const easeOut = [0.22, 1, 0.36, 1] as const;

export function AuthPanel() {
  const reduce = useReducedMotion();

  return (
    <aside className="relative hidden min-h-[720px] overflow-hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-12">
      <Image
        src="/images/auth-advocate-illustration.svg"
        alt=""
        fill
        sizes="50vw"
        priority
        className="pointer-events-none object-cover object-center opacity-80"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.88),rgba(15,23,42,0.78)_45%,rgba(2,6,23,0.86)),radial-gradient(circle_at_82%_14%,rgba(199,154,77,0.24),transparent_32rem)]"
      />
      <div aria-hidden className="absolute inset-0 bg-slate-950/20" />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:48px_48px]" />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/25 blur-3xl"
        animate={reduce ? undefined : { x: [0, -22, 0], y: [0, 22, 0], opacity: [0.55, 0.85, 0.55] }}
        transition={reduce ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-cyan-200/10 blur-3xl"
        animate={reduce ? undefined : { x: [0, 18, 0], y: [0, -18, 0], opacity: [0.45, 0.72, 0.45] }}
        transition={reduce ? undefined : { duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      {!reduce &&
        PARTICLES.map((p, i) => (
          <motion.span
            key={`${p.left}-${p.top}`}
            aria-hidden
            className={`absolute rounded-full bg-gold/55 shadow-[0_0_18px_rgba(199,154,77,0.65)] ${p.size}`}
            style={{ left: p.left, top: p.top }}
            animate={{ y: [0, -16, 0], opacity: [0.22, 0.72, 0.22], scale: [1, 1.4, 1] }}
            transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: i * 0.32 }}
          />
        ))}

      <div className="relative z-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: easeOut }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white/90 shadow-lg shadow-slate-950/20 backdrop-blur-xl">
            <ShieldCheck className="h-3.5 w-3.5 text-gold" />
            Pakistan&apos;s Trusted Legal Marketplace
          </span>

          <h2 className="mt-6 max-w-lg font-heading text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">
            Find The Right Lawyer With Confidence
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/76">
            Connect with verified advocates, schedule consultations, track cases, and manage legal matters securely.
          </p>
        </motion.div>

        <div className="mt-9 grid grid-cols-3 gap-3">
          {TRUST_STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={reduce ? undefined : { y: -4, scale: 1.015 }}
              transition={{ duration: 0.42, ease: easeOut, delay: 0.12 + index * 0.08 }}
              className="rounded-2xl border border-white/14 bg-white/[0.09] p-4 shadow-2xl shadow-slate-950/20 backdrop-blur-xl"
            >
              <p className="font-heading text-2xl font-semibold text-white">{stat.value}</p>
              <p className="mt-1 text-xs font-medium leading-5 text-white/62">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={reduce ? undefined : { y: -3 }}
          transition={{ duration: 0.55, ease: easeOut, delay: 0.28 }}
          className="relative overflow-hidden rounded-3xl border border-white/14 bg-white/[0.10] p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl"
        >
          <div aria-hidden className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gold/20 blur-3xl" />
          <div className="flex items-center gap-1 text-gold">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <blockquote className="mt-4 text-base leading-7 text-white/88">
            &quot;WakeelHub helped me find the right advocate within hours. The process was simple and professional.&quot;
          </blockquote>
          <p className="mt-4 text-sm font-semibold text-white">&mdash; Client, Lahore</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut, delay: 0.42 }}
          className="flex items-center justify-between gap-4 rounded-2xl border border-gold/25 bg-slate-950/35 px-4 py-3 shadow-xl shadow-slate-950/20 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/25">
              <BadgeCheck className="h-5 w-5" />
            </span>
            <p className="text-sm font-semibold text-white">Bar Council Verification Required For Every Advocate</p>
          </div>
          <Sparkles className="hidden h-4 w-4 text-gold/80 xl:block" />
        </motion.div>
      </div>

      <div className="relative z-10 flex items-center gap-2 text-xs font-medium text-white/55">
        <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
        Secure access for clients, lawyers, and legal teams.
      </div>
    </aside>
  );
}
