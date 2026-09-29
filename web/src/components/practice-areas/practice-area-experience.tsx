"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  FileText,
  Gavel,
  Scale,
  ShieldCheck,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { LegalService, PracticeAreaPageData } from "@/lib/practice-area-pages";

const SERVICE_ICONS: LucideIcon[] = [Scale, FileText, UsersRound, WalletCards, Gavel, BadgeCheck];
const DIRECTORY_STEPS = [
  "Browse live verified profiles",
  "Compare fees and availability",
  "Book a secure consultation",
  "Track matters from your dashboard",
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-90px" },
  transition: { duration: 0.52, ease: "easeOut" },
} as const;

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
        <Scale className="h-3.5 w-3.5 text-gold-foreground" aria-hidden />
        {eyebrow}
      </span>
      <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
    </motion.div>
  );
}

function ServiceCard({
  service,
  index,
  areaSlug,
}: {
  service: LegalService;
  index: number;
  areaSlug: string;
}) {
  const reduceMotion = useReducedMotion();
  const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length] ?? Scale;

  return (
    <motion.article
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay: index * 0.06 }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      className="group relative min-h-64 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-gold/50 hover:shadow-xl hover:shadow-slate-950/8"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent opacity-0 transition group-hover:opacity-100" aria-hidden />
      <div className="flex items-start justify-between gap-4">
        <motion.span
          whileHover={reduceMotion ? undefined : { rotate: -4, scale: 1.08 }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white"
        >
          <Icon className="h-5 w-5" aria-hidden />
        </motion.span>
        <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
          Service guide
        </span>
      </div>

      <h3 className="mt-5 text-xl font-semibold text-slate-950">{service.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{service.summary}</p>

      <Link
        href={`/practice-areas/${areaSlug}/${service.slug}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-950 transition hover:text-gold-foreground"
      >
        Explore
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
      </Link>
    </motion.article>
  );
}

export function PracticeAreaExperience({ data }: { data: PracticeAreaPageData }) {
  return (
    <main className="bg-[#fbfaf7]">
      <section className="relative overflow-hidden border-b border-slate-200">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:48px_48px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <nav className="mb-8 flex items-center gap-1.5 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-950">Home</Link>
            <span>/</span>
            <span className="text-slate-950">{data.name}</span>
          </nav>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.94fr)_minmax(420px,0.62fr)] lg:items-end">
            <motion.div {...fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-gold-foreground" aria-hidden />
                Practice Area
              </span>
              <h1 className="mt-6 max-w-4xl text-balance font-heading text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.04]">
                {data.headline}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{data.subheadline}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-xl bg-slate-950 px-6 text-white hover:bg-slate-800">
                  <Link href="#services">Explore services</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl border-slate-200 bg-white px-6">
                  <Link href={`/find-lawyers?practiceArea=${data.slug}`}>View all lawyers</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-xl shadow-slate-950/6 backdrop-blur"
            >
              <p className="text-sm font-semibold text-slate-950">Live directory flow</p>
              <div className="mt-4 space-y-3">
                {DIRECTORY_STEPS.map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.08 + index * 0.06, ease: "easeOut" }}
                    className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-sm font-medium text-slate-700"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    {step}
                  </motion.div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Lawyer availability, fees, ratings and reviews are shown from registered advocate profiles only.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Legal service explorer"
          title={`Choose the ${data.name.toLowerCase()} service that matches your situation`}
          description="Start with the legal problem, understand the likely service, then continue into specialists only when you are ready."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.services.map((service, index) => (
            <ServiceCard key={service.slug} service={service} index={index} areaSlug={data.slug} />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.7fr_1fr] lg:px-8">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold-foreground">
              <Gavel className="h-3.5 w-3.5" aria-hidden />
              What this area covers
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-slate-950">
              Learn the legal path before comparing lawyers
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              This page is designed to educate first. Expand each item to understand what a specialist can help with.
            </p>
          </motion.div>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }}>
            <Accordion type="single" collapsible defaultValue={data.covers[0]?.title} className="gap-3">
              {data.covers.map((item, index) => (
                <AccordionItem key={item.title} value={item.title} className="rounded-2xl border border-slate-200 bg-[#fbfaf7] px-4">
                  <AccordionTrigger className="py-4 text-base font-semibold text-slate-950 hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pl-11 text-sm leading-6 text-slate-600">{item.body}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 py-16 text-white">
        <motion.div {...fadeUp} className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/70">
            <ShieldCheck className="h-3.5 w-3.5 text-gold" aria-hidden />
            Live lawyer directory
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Compare real verified advocates
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-white/65">
            Profiles, reviews, fees and availability are pulled from registered advocates instead of demo cards.
          </p>
          <Button asChild size="lg" className="mt-7 rounded-xl bg-white px-7 text-slate-950 hover:bg-white/90">
            <Link href={`/find-lawyers?practiceArea=${data.slug}`}>
              View Live Lawyers
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </motion.div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionIntro eyebrow="Questions" title={`${data.name} FAQs`} description="Quick answers before you decide whether to book a consultation." />
        <motion.div {...fadeUp} className="mt-10">
          <Accordion type="single" collapsible className="gap-3">
            {data.faqs.map((item) => (
              <AccordionItem key={item.title} value={item.title} className="rounded-2xl border border-slate-200 bg-white px-4">
                <AccordionTrigger className="py-4 text-base font-semibold text-slate-950 hover:no-underline">{item.title}</AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-6 text-slate-600">{item.body}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>
    </main>
  );
}

