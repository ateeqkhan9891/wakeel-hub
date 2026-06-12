"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Gavel,
  LockKeyhole,
  MessageSquare,
  Scale,
  Search,
  ShieldCheck,
  UploadCloud,
  UserCheck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FLOW_STEPS = [
  {
    icon: Search,
    label: "Search",
    title: "Client searches for the right advocate",
    description: "A client starts with city, legal area, language, fee, and consultation mode instead of asking around blindly.",
    clientTitle: "Find lawyers",
    clientRows: ["Family Law", "Islamabad", "Online consultation", "Rs. 3,000 max"],
    lawyerTitle: "Public profile",
    lawyerRows: ["Verified advocate", "Courts listed", "Availability shown"],
    status: "Discovery",
  },
  {
    icon: UserCheck,
    label: "Compare",
    title: "Profiles make trust visible",
    description: "The client compares verification, courts, practice areas, fee, response time, reviews, and profile details.",
    clientTitle: "Compare advocates",
    clientRows: ["Verified badge", "Practice areas", "Consultation fee", "Languages"],
    lawyerTitle: "Profile strength",
    lawyerRows: ["Bar Council checked", "Professional details", "Public card ready"],
    status: "Shortlist",
  },
  {
    icon: CalendarCheck,
    label: "Book",
    title: "Consultation request is structured",
    description: "The client shares issue summary, preferred date, time, and consultation mode before the advocate accepts.",
    clientTitle: "Booking request",
    clientRows: ["Preferred date", "Issue summary", "Consultation mode", "No payment yet"],
    lawyerTitle: "New request",
    lawyerRows: ["Matter preview", "Client city", "Accept or reschedule"],
    status: "Request sent",
  },
  {
    icon: BadgeCheck,
    label: "Accept",
    title: "Lawyer accepts from the chamber dashboard",
    description: "The advocate reviews the request and confirms the consultation, keeping both sides aligned.",
    clientTitle: "Client notified",
    clientRows: ["Request accepted", "Time confirmed", "Next step visible"],
    lawyerTitle: "Bookings",
    lawyerRows: ["Accepted", "Client notified", "Consultation scheduled"],
    status: "Confirmed",
  },
  {
    icon: MessageSquare,
    label: "Message",
    title: "Communication stays matter-linked",
    description: "Questions, notes, preparation, and document requests stay in a secure thread instead of disappearing into scattered calls.",
    clientTitle: "Secure messages",
    clientRows: ["Document question", "Preparation note", "Private thread"],
    lawyerTitle: "Matter chat",
    lawyerRows: ["Client context", "Shared notes", "Unread alerts"],
    status: "In progress",
  },
  {
    icon: Briefcase,
    label: "Case",
    title: "Consultation becomes a managed case",
    description: "The advocate can open a case with client, court, practice area, documents, hearings, and updates linked together.",
    clientTitle: "Case opened",
    clientRows: ["Case title", "Court", "Linked documents", "Status active"],
    lawyerTitle: "Case workspace",
    lawyerRows: ["Client linked", "Priority", "Next hearing"],
    status: "Case active",
  },
  {
    icon: Gavel,
    label: "Hearing",
    title: "Hearings become visible and trackable",
    description: "Dates, court, purpose, and hearing status become part of the client and lawyer dashboard.",
    clientTitle: "Upcoming hearing",
    clientRows: ["Date", "Courtroom", "Purpose", "Reminder"],
    lawyerTitle: "Hearing schedule",
    lawyerRows: ["Scheduled", "Adjourned", "Completed"],
    status: "Scheduled",
  },
  {
    icon: FileText,
    label: "Updates",
    title: "Progress is shared without confusion",
    description: "Advocates share case notes, document updates, hearing outcomes, and next steps in one timeline.",
    clientTitle: "Case timeline",
    clientRows: ["Draft reviewed", "Document uploaded", "Next step", "Payment record"],
    lawyerTitle: "Update posted",
    lawyerRows: ["Client can view", "File attached", "Status changed"],
    status: "Updated",
  },
  {
    icon: CheckCircle2,
    label: "Resolve",
    title: "The matter closes with a clear record",
    description: "The client keeps the history of consultations, documents, hearings, messages, payments, and final outcome.",
    clientTitle: "Matter resolved",
    clientRows: ["Closed status", "Saved record", "Review advocate"],
    lawyerTitle: "Practice history",
    lawyerRows: ["Consultation complete", "Case archived", "Review visible"],
    status: "Resolved",
  },
] as const;

const PROBLEM_POINTS = [
  ["Referral uncertainty", "Choosing a lawyer often starts with who someone knows, not what the case needs."],
  ["Unknown fees", "Clients may not know the consultation cost until after they have already committed time."],
  ["Scattered updates", "Messages, documents, hearing dates, and payment details often live in separate places."],
  ["No shared workspace", "Clients and advocates need a common view of the legal matter as it moves forward."],
] as const;

const CLIENT_ACTIONS = [
  { icon: Search, title: "Find verified advocates", text: "Search by city, practice area, court, fee, language, and mode." },
  { icon: CalendarCheck, title: "Book consultations", text: "Send a structured request with the right context from the start." },
  { icon: UploadCloud, title: "Share documents", text: "Keep files connected to the matter instead of scattered across devices." },
  { icon: Bell, title: "Track hearings", text: "See scheduled, completed, and adjourned hearings from the dashboard." },
] as const;

const ADVOCATE_ACTIONS = [
  { icon: ShieldCheck, title: "Build a verified profile", text: "Show courts, practice areas, fee, availability, and verification status." },
  { icon: Briefcase, title: "Manage client work", text: "Turn requests into consultations, cases, notes, documents, and hearings." },
  { icon: MessageSquare, title: "Keep communication organized", text: "Use matter-linked threads instead of disconnected conversations." },
  { icon: CircleDollarSign, title: "Grow professionally", text: "Maintain consultation history, reviews, payments, and profile completeness." },
] as const;

const VALUES = [
  { icon: BadgeCheck, title: "Trust Through Verification", text: "Admin-reviewed lawyer verification controls who appears publicly." },
  { icon: Scale, title: "Transparency", text: "Fees, profile details, availability, and workflow status should be visible." },
  { icon: Users, title: "Accessibility", text: "People should be able to start legal help without unnecessary friction." },
  { icon: LockKeyhole, title: "Professionalism", text: "Legal work needs calm tools, clear records, and respectful communication." },
] as const;

const COMPARE_ROWS = [
  ["Ask around for referrals", "Search verified advocates"],
  ["Unclear consultation fees", "Compare fees before booking"],
  ["Paper files and phone updates", "Track documents, hearings, and messages"],
  ["No shared progress view", "Client and advocate dashboards stay connected"],
] as const;

export function AboutStory() {
  return (
    <main className="overflow-hidden bg-[#fbfcfd] text-zinc-950">
      <Hero />
      <LiveSimulationSection />
      <ProblemSection />
      <AudienceSection />
      <ValuesSection />
      <ComparisonSection />
      <FinalCta />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative border-b border-zinc-200 bg-white">
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp}>
            <Kicker>WakeelHub story</Kicker>
          </motion.div>
          <motion.h1 variants={fadeUp} className="mt-4 max-w-3xl font-heading text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
            Making legal help easier to find in Pakistan
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
            WakeelHub exists because legal help should not depend on luck, scattered referrals, or unclear next steps.
            It gives clients and advocates one modern workflow for discovery, consultation, communication, and case progress.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2 bg-zinc-950 text-white hover:bg-zinc-800">
              <Link href="/find-lawyers">Find a Lawyer <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/register/lawyer">Join as Advocate</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
          <LiveFlowSimulator compact />
        </motion.div>
      </div>
    </section>
  );
}

function LiveSimulationSection() {
  return (
    <section className="relative bg-[#f5f8fb] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Kicker>Live product simulation</Kicker>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            Watch one legal matter move through WakeelHub
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-600">
            This is the core idea: the client side and advocate side stay connected while the matter moves from search to resolution.
          </p>
        </div>

        <div className="mt-10">
          <LiveFlowSimulator />
        </div>
      </div>
    </section>
  );
}

function LiveFlowSimulator({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const step = FLOW_STEPS[active];
  const Icon = step.icon;

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % FLOW_STEPS.length);
    }, compact ? 2300 : 2800);
    return () => window.clearInterval(timer);
  }, [compact, reduceMotion]);

  return (
    <div className={cn("rounded-[2rem] border border-zinc-200 bg-white p-3 shadow-2xl shadow-zinc-200/80", compact ? "max-w-3xl" : "mx-auto max-w-7xl")}>
      <div className={cn("grid gap-3", compact ? "lg:grid-cols-[1fr]" : "lg:grid-cols-[310px_1fr]")}>
        {!compact && (
          <div className="rounded-[1.5rem] bg-zinc-950 p-5 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-zinc-950">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Current stage</p>
                <p className="text-sm font-semibold">{step.status}</p>
              </div>
            </div>
            <motion.div key={step.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
              <h3 className="font-heading text-2xl font-semibold leading-tight">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{step.description}</p>
            </motion.div>
            <div className="mt-8 grid grid-cols-3 gap-1.5">
              {FLOW_STEPS.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActive(index)}
                  className={cn(
                    "rounded-full px-2 py-1.5 text-[11px] font-medium transition",
                    index === active ? "bg-white text-zinc-950" : "bg-white/8 text-zinc-300 hover:bg-white/14"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="relative overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-[#fbfcfd] p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Matter flow</p>
              <p className="mt-1 font-heading text-lg font-semibold text-zinc-950">{step.title}</p>
            </div>
            <Badge className="rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-50">{step.status}</Badge>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_110px_1fr]">
            <DashboardPane title="Client workspace" heading={step.clientTitle} rows={step.clientRows} tone="client" />
            <FlowBridge active={active} />
            <DashboardPane title="Advocate chamber" heading={step.lawyerTitle} rows={step.lawyerRows} tone="lawyer" />
          </div>

          <div className="mt-5 grid grid-cols-9 gap-1.5">
            {FLOW_STEPS.map((item, index) => {
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show ${item.label} step`}
                  className={cn(
                    "group flex h-12 items-center justify-center rounded-xl border transition",
                    index === active
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : index < active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-zinc-200 bg-white text-zinc-400 hover:border-zinc-300"
                  )}
                >
                  <ItemIcon className="h-4 w-4" />
                </button>
              );
            })}
          </div>

          <motion.div
            key={active}
            className="mt-3 h-1 rounded-full bg-zinc-100"
          >
            <motion.div
              className="h-full rounded-full bg-zinc-950"
              initial={{ width: "0%" }}
              animate={{ width: reduceMotion ? "100%" : "100%" }}
              transition={{ duration: compact ? 2.2 : 2.7, ease: "linear" }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function DashboardPane({
  title,
  heading,
  rows,
  tone,
}: {
  title: string;
  heading: string;
  rows: readonly string[];
  tone: "client" | "lawyer";
}) {
  return (
    <motion.div layout className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-3">
        <div>
          <p className="text-xs font-medium text-zinc-500">{title}</p>
          <motion.h4 key={heading} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-1 font-heading text-base font-semibold text-zinc-950">
            {heading}
          </motion.h4>
        </div>
        <span className={cn("h-2.5 w-2.5 rounded-full", tone === "client" ? "bg-blue-500" : "bg-amber-500")} />
      </div>
      <div className="mt-4 space-y-2.5">
        {rows.map((row, index) => (
          <motion.div
            key={row}
            initial={{ opacity: 0, x: tone === "client" ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 }}
            className="flex items-center gap-2 rounded-xl bg-[#f5f8fb] px-3 py-2.5"
          >
            <span className={cn("h-2 w-2 rounded-full", tone === "client" ? "bg-blue-500" : "bg-amber-500")} />
            <span className="text-sm font-medium text-zinc-700">{row}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function FlowBridge({ active }: { active: number }) {
  return (
    <div className="relative hidden items-center justify-center lg:flex">
      <div className="absolute inset-y-8 left-1/2 w-px -translate-x-1/2 bg-zinc-200" />
      <motion.div
        key={active}
        initial={{ y: -82, scale: 0.85, opacity: 0 }}
        animate={{ y: 82, scale: 1, opacity: 1 }}
        transition={{ duration: 1.15, ease: "easeInOut" }}
        className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg"
      >
        <ArrowRight className="h-4 w-4 rotate-90" />
      </motion.div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Kicker>The reason it exists</Kicker>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Legal help should feel guided, not improvised.
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              WakeelHub is not trying to replace advocates. It gives clients and advocates a clearer way to start,
              communicate, and keep legal work organized.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {PROBLEM_POINTS.map(([title, text], index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.06 }}
                className="rounded-2xl border border-zinc-200 bg-[#fbfcfd] p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">0{index + 1}</p>
                <h3 className="mt-4 font-heading text-lg font-semibold text-zinc-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AudienceSection() {
  return (
    <section className="border-y border-zinc-200 bg-[#f5f8fb] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <AudiencePanel title="For clients" description="A simpler way to move from uncertainty to action." items={CLIENT_ACTIONS} />
          <AudiencePanel title="For advocates" description="A cleaner operating system for digital legal work." items={ADVOCATE_ACTIONS} />
        </div>
      </div>
    </section>
  );
}

function AudiencePanel({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: readonly { icon: LucideIcon; title: string; text: string }[];
}) {
  return (
    <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-zinc-950">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-zinc-600">{description}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <FeatureTile key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}

function ValuesSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Kicker>What guides the product</Kicker>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Trust is designed into the workflow.
          </h2>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((item) => (
            <FeatureTile key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section className="bg-[#fbfcfd] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Kicker>Why WakeelHub</Kicker>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            From referral guesswork to a visible workflow.
          </h2>
        </div>
        <div className="mt-10 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
          <div className="grid bg-zinc-950 text-sm font-semibold text-white sm:grid-cols-2">
            <div className="p-5">Traditional way</div>
            <div className="border-t border-white/10 p-5 sm:border-l sm:border-t-0">WakeelHub</div>
          </div>
          {COMPARE_ROWS.map(([left, right]) => (
            <div key={left} className="grid border-b border-zinc-200 last:border-b-0 sm:grid-cols-2">
              <div className="p-5 text-sm text-zinc-600">{left}</div>
              <div className="flex items-center gap-2 border-t border-zinc-200 bg-[#f5f8fb] p-5 text-sm font-semibold text-zinc-950 sm:border-l sm:border-t-0">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {right}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-16 text-white sm:py-24">
      <motion.div
        aria-hidden
        animate={{ x: ["0%", "-20%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0 48%, rgba(255,255,255,.2) 48% 52%, transparent 52% 100%)",
          backgroundSize: "90px 100%",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Kicker dark>Start now</Kicker>
        <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-5xl">Ready to get legal help?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
          Search for a verified advocate, or join as an advocate and manage your practice through a modern digital chamber.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="gap-2 bg-white text-zinc-950 hover:bg-zinc-100">
            <Link href="/find-lawyers">Find a Lawyer <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white">
            <Link href="/register/lawyer">Join as Advocate</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function FeatureTile({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <h3 className="mt-4 font-heading text-base font-semibold text-zinc-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{text}</p>
    </motion.article>
  );
}

function Kicker({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        dark ? "border-white/15 bg-white/10 text-zinc-200" : "border-zinc-200 bg-white text-zinc-500"
      )}
    >
      {children}
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
