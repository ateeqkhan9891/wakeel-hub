"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BadgeAlert, BriefcaseBusiness, FileText, Gavel, HelpCircle, Loader2, MessageSquareText, Scale, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type IssueProfile = {
  category: string;
  urgency: string;
  lawyerType: string;
  summary: string;
  questions: string[];
  href: string;
};

const examples = [
  {
    terms: ["landlord", "rent", "security deposit", "tenant", "lease"],
    category: "Property / tenancy dispute",
    lawyerType: "Property lawyer",
    href: "/find-lawyers?practice=property-law",
  },
  {
    terms: ["divorce", "khula", "custody", "maintenance", "nikah"],
    category: "Family law matter",
    lawyerType: "Family lawyer",
    href: "/find-lawyers?practice=family-law",
  },
  {
    terms: ["fir", "bail", "police", "arrest", "criminal"],
    category: "Criminal law matter",
    lawyerType: "Criminal defence lawyer",
    href: "/find-lawyers?practice=criminal-law",
  },
  {
    terms: ["company", "contract", "shareholder", "startup", "business"],
    category: "Corporate / contract issue",
    lawyerType: "Corporate lawyer",
    href: "/find-lawyers?practice=corporate-law",
  },
];

function analyzeIssue(text: string): IssueProfile {
  const normalized = text.toLowerCase();
  const match = examples.find((item) => item.terms.some((term) => normalized.includes(term)));
  const urgent = ["today", "tomorrow", "notice", "deadline", "court date", "arrest", "eviction"].some((term) => normalized.includes(term));

  return {
    category: match?.category ?? "General legal issue",
    urgency: urgent ? "Time-sensitive" : "Needs lawyer review",
    lawyerType: match?.lawyerType ?? "Relevant practice-area lawyer",
    summary: text.trim() || "Describe your legal issue to generate a short preparation summary.",
    questions: [
      "Which city and court jurisdiction is involved?",
      "Do you have documents, notices, receipts, or messages as proof?",
      "What outcome do you want from the lawyer consultation?",
    ],
    href: match?.href ?? "/find-lawyers",
  };
}

function ResultCard({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon className="h-4 w-4 text-emerald-700" />
        {title}
      </div>
      <div className="mt-3 text-sm leading-6 text-slate-700">{children}</div>
    </div>
  );
}

export function WakeelAIAssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [issue, setIssue] = useState("");
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const profile = useMemo(() => analyzeIssue(issue), [issue]);

  function handleAnalyze() {
    setIsThinking(true);
    window.setTimeout(() => {
      setHasAnalyzed(true);
      setIsThinking(false);
    }, 320);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close Wakeel AI Assistant"
            className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="wakeel-ai-title"
            className="fixed inset-x-3 bottom-3 z-50 flex max-h-[calc(100svh-1.5rem)] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 shadow-2xl shadow-slate-950/20 sm:inset-x-auto sm:top-6 sm:bottom-24 sm:right-6 sm:w-[440px] sm:max-h-none"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-slate-950 p-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                    <Scale className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 id="wakeel-ai-title" className="font-heading text-lg font-semibold">Wakeel AI Assistant</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-300">Describe your legal issue and find the right lawyer faster.</p>
                  </div>
                </div>
                <button type="button" onClick={onClose} aria-label="Close assistant" className="rounded-full p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <Textarea
                value={issue}
                onChange={(event) => {
                  setIssue(event.target.value);
                  setHasAnalyzed(false);
                }}
                placeholder="Example: My landlord is not returning my security deposit..."
                className="min-h-28 resize-none rounded-2xl border-slate-200 bg-white p-4 text-sm shadow-sm"
              />

              <Button
                type="button"
                onClick={handleAnalyze}
                disabled={isThinking || issue.trim().length < 8}
                className="mt-3 h-11 w-full rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 hover:bg-slate-800"
              >
                {isThinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquareText className="h-4 w-4" />}
                {isThinking ? "Analyzing..." : "Analyze Issue"}
              </Button>

              <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                Not legal advice. Wakeel AI helps organize your issue before speaking with a qualified lawyer.
              </p>

              <div className="mt-5 grid gap-3">
                <ResultCard icon={Gavel} title="Legal Category">
                  {hasAnalyzed ? profile.category : "Your likely legal category will appear here."}
                </ResultCard>
                <ResultCard icon={BadgeAlert} title="Urgency">
                  {hasAnalyzed ? profile.urgency : "We will flag time-sensitive details from your description."}
                </ResultCard>
                <ResultCard icon={BriefcaseBusiness} title="Recommended Lawyer Type">
                  {hasAnalyzed ? profile.lawyerType : "Wakeel360 will suggest the type of lawyer to compare."}
                </ResultCard>
                <ResultCard icon={FileText} title="Case Summary">
                  {hasAnalyzed ? profile.summary : "A short, lawyer-ready summary will be prepared here."}
                </ResultCard>
                <ResultCard icon={HelpCircle} title="Follow-up Questions">
                  {hasAnalyzed ? (
                    <ul className="space-y-1.5">
                      {profile.questions.map((question) => (
                        <li key={question}>- {question}</li>
                      ))}
                    </ul>
                  ) : (
                    "Answer prompts will help make your consultation request clearer."
                  )}
                </ResultCard>
              </div>

              <Button asChild className="mt-4 h-11 w-full rounded-2xl bg-emerald-700 text-white hover:bg-emerald-800">
                <Link href={hasAnalyzed ? profile.href : "/find-lawyers"} onClick={onClose}>
                  Find Matching Lawyers
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

