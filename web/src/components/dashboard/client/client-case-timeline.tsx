"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity, CalendarClock, FileText, FolderPlus, CircleDot, Gavel, Scale, ShieldCheck, Wallet, CheckCheck, PauseCircle,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { CaseTimelineEntry } from "@/lib/data/client-cases";

const easeOut = [0.22, 1, 0.36, 1] as const;

function metaFor(title: string): { icon: LucideIcon; label: string; cls: string } {
  const t = title.toLowerCase();
  if (t.includes("open") || t.includes("created")) return { icon: FolderPlus, label: "Case opened", cls: "bg-primary/10 text-primary" };
  if (t.includes("adjourn")) return { icon: PauseCircle, label: "Adjourned", cls: "bg-amber-50 text-amber-600" };
  if (t.includes("hearing")) return { icon: CalendarClock, label: "Hearing", cls: "bg-amber-50 text-amber-600" };
  if (t.includes("order") || t.includes("judg")) return { icon: Gavel, label: "Court order", cls: "bg-primary/10 text-primary" };
  if (t.includes("evidence")) return { icon: Scale, label: "Evidence", cls: "bg-blue-50 text-blue-600" };
  if (t.includes("document") || t.includes("upload") || t.includes("file")) return { icon: FileText, label: "Document", cls: "bg-blue-50 text-blue-600" };
  if (t.includes("payment") || t.includes("fee")) return { icon: Wallet, label: "Payment", cls: "bg-emerald-50 text-emerald-600" };
  if (t.includes("settle") || t.includes("verif")) return { icon: ShieldCheck, label: "Update", cls: "bg-emerald-50 text-emerald-600" };
  if (t.includes("clos") || t.includes("won") || t.includes("complete")) return { icon: CheckCheck, label: "Closed", cls: "bg-emerald-50 text-emerald-600" };
  if (t.includes("status")) return { icon: Activity, label: "Status update", cls: "bg-slate-100 text-slate-500" };
  return { icon: CircleDot, label: "Update", cls: "bg-slate-100 text-slate-500" };
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}
function bucketFor(iso: string): string {
  const diff = Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / 86_400_000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff <= 7) return "Earlier this week";
  if (diff <= 31) return "Earlier this month";
  return "Older";
}
const BUCKET_ORDER = ["Today", "Yesterday", "Earlier this week", "Earlier this month", "Older"];

function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" });
}

export function ClientCaseTimeline({ timeline }: { timeline: CaseTimelineEntry[] }) {
  const reduce = !!useReducedMotion();

  if (timeline.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center text-sm text-slate-500">
        No updates yet. Your advocate&apos;s case activity will appear here as it happens.
      </div>
    );
  }

  const groups = BUCKET_ORDER
    .map((bucket) => ({ bucket, items: timeline.filter((e) => bucketFor(e.createdAt) === bucket) }))
    .filter((g) => g.items.length > 0);

  const newestId = timeline[0]?.id;

  return (
    <div className="space-y-6">
      {groups.map(({ bucket, items }) => (
        <div key={bucket}>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">{bucket}</p>
          <div className="relative pl-8">
            <div className="absolute left-[0.7rem] top-1 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-gold via-gold/40 to-transparent" aria-hidden />
            <div className="space-y-4">
              {items.map((entry) => {
                const meta = metaFor(entry.title);
                const Icon = meta.icon;
                const newest = entry.id === newestId;
                return (
                  <motion.div
                    key={entry.id}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.45, ease: easeOut }}
                    className="relative"
                  >
                    <span className={cn("absolute -left-8 top-0.5 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white", newest ? "bg-gold text-primary" : "bg-primary text-primary-foreground")}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className={cn("rounded-xl border p-4", newest ? "border-gold/40 bg-gold/[0.05]" : "border-slate-200 bg-white")}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-950">{entry.title}</p>
                        <span className="text-[11px] text-slate-400">{formatDate(entry.createdAt)} - {timeOf(entry.createdAt)}</span>
                      </div>
                      <span className={cn("mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", meta.cls)}>{meta.label}</span>
                      {entry.description && <p className="mt-2 text-sm leading-6 text-slate-600">{entry.description}</p>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

