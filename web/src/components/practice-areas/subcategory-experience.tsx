"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Gavel,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { SubcategoryPageData } from "@/lib/practice-area-pages";

const DIRECTORY_PROMPTS = [
  "Understand the process",
  "Prepare relevant documents",
  "Open the live lawyer directory",
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-90px" },
  transition: { duration: 0.52, ease: "easeOut" },
} as const;

export function SubcategoryExperience({ data }: { data: SubcategoryPageData }) {
  return (
    <main className="bg-[#fbfaf7]">
      <section className="relative overflow-hidden border-b border-slate-200">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:48px_48px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-950">Home</Link>
            <span>/</span>
            <Link href={`/practice-areas/${data.parentSlug}`} className="hover:text-slate-950">Family Law</Link>
            <span>/</span>
            <span className="text-slate-950">{data.title}</span>
          </nav>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(380px,0.55fr)] lg:items-center">
            <motion.div {...fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-gold-foreground" aria-hidden />
                Subcategory Guide
              </span>
              <h1 className="mt-6 max-w-4xl text-balance font-heading text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.04]">
                {data.headline}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{data.subheadline}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-xl bg-slate-950 px-6 text-white hover:bg-slate-800">
                  <Link href="#case-guide">Understand the process</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl border-slate-200 bg-white px-6">
                  <Link href={`/find-lawyers?practiceArea=${data.parentSlug}&subcategory=${data.slug}`}>
                    View all lawyers
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/6"
            >
              <div className="space-y-3">
                {DIRECTORY_PROMPTS.map((prompt, index) => (
                  <motion.div
                    key={prompt}
                    initial={{ opacity: 0, x: 14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.08 + index * 0.06, ease: "easeOut" }}
                    className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-sm font-medium text-slate-700"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    {prompt}
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-[#fbfaf7] p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                  <ShieldCheck className="h-4 w-4 text-gold-foreground" aria-hidden />
                  Consultation-first flow
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Learn the matter, check documents, review specialists, then enter the directory only when ready.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="case-guide" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
            <Gavel className="h-3.5 w-3.5 text-gold-foreground" aria-hidden />
            Case guide
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            The usual path for a {data.title.toLowerCase()} matter
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            A structured view of the process helps clients understand what a lawyer will likely do before they book.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-5">
          {data.guideSteps.map((step, index) => (
            <motion.article
              key={step.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: index * 0.08 }}
              className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="mt-5 text-base font-semibold text-slate-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
              {index < data.guideSteps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-8 hidden h-5 w-5 text-slate-300 lg:block" aria-hidden />
              )}
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.7fr_1fr] lg:px-8">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold-foreground">
              <ClipboardCheck className="h-3.5 w-3.5" aria-hidden />
              Document checklist
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-slate-950">
              Prepare before your consultation
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Bring the relevant documents so your lawyer can give precise advice in the first session.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {data.documents.map((document, index) => (
              <motion.div
                key={document}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: index * 0.05 }}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#fbfaf7] p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-sm font-semibold text-slate-800">{document}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 py-16 text-white">
        <motion.div {...fadeUp} className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/70">
            <Scale className="h-3.5 w-3.5 text-gold" aria-hidden />
            Ready to compare lawyers
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            View real {data.title.toLowerCase()} lawyers
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-white/65">
            You have reviewed the process and documents. Continue to the live directory to compare registered advocates by city, court, language, fee, and availability.
          </p>
          <Button asChild size="lg" className="mt-7 rounded-xl bg-white px-7 text-slate-950 hover:bg-white/90">
            <Link href={`/find-lawyers?practiceArea=${data.parentSlug}&subcategory=${data.slug}`}>
              View All Lawyers
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </motion.div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
            <Gavel className="h-3.5 w-3.5 text-gold-foreground" aria-hidden />
            Questions
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {data.title} FAQs
          </h2>
        </motion.div>

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
