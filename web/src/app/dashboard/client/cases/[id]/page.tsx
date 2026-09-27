import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft, CalendarClock, Gavel, Scale, UserCog, FileText, Download, Clock, MessageSquare,
  BadgeCheck, Briefcase, ExternalLink, History, Hash, Bell, ChevronRight, FolderOpen, Activity,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { ClientCaseTimeline } from "@/components/dashboard/client/client-case-timeline";
import { CaseRealtime } from "@/components/dashboard/shared/case-realtime";
import { CaseStages } from "@/components/dashboard/shared/case-stages";
import { getClientCase } from "@/lib/data/client-cases";
import type { ClientCaseDetail } from "@/lib/data/client-cases";
import { caseStatusLabel } from "@/lib/constants";
import { cn, formatDate, timeAgo, initials } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const detail = await getClientCase(id);
  return { title: detail ? detail.record.title : "Case not found" };
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const TERMINAL = new Set(["closed", "won", "lost", "archived"]);

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
function dayOf(iso: string) {
  return new Date(iso).setHours(0, 0, 0, 0);
}

type NextAction = { icon: LucideIcon; title: string; desc: string };

function buildNextActions(detail: ClientCaseDetail): NextAction[] {
  const { record, hearings } = detail;
  const today = startOfToday();
  const upcoming = hearings
    .filter((h) => dayOf(h.date) >= today && h.status !== "cancelled")
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const out: NextAction[] = [];
  if (upcoming) {
    out.push({
      icon: CalendarClock,
      title: "Attend your hearing",
      desc: `Your next hearing is on ${formatDate(upcoming.date)}${upcoming.time ? ` at ${upcoming.time.slice(0, 5)}` : ""}${upcoming.court ? ` - ${upcoming.court}` : ""}.`,
    });
  }
  if (!upcoming && record.status === "adjourned") {
    out.push({ icon: Clock, title: "Awaiting your next hearing date", desc: "Your hearing was adjourned. Your advocate will confirm the new date soon." });
  }
  if (!upcoming && (record.status === "active" || record.status === "in_progress" || record.status === "pending")) {
    out.push({ icon: Scale, title: "Your advocate is progressing your case", desc: "There's nothing for you to do right now - we'll notify you of any updates." });
  }
  if (TERMINAL.has(record.status)) {
    out.push({ icon: FileText, title: "This case has concluded", desc: "You can still review the full case timeline and shared documents below." });
  }
  return out;
}

function Info({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
        <p className="truncate text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function RecentRow({ icon: Icon, title, meta }: { icon: LucideIcon; title: string; meta: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><Icon className="h-4 w-4" /></span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">{title}</p>
        <p className="truncate text-xs text-slate-500">{meta}</p>
      </div>
    </div>
  );
}

export default async function ClientCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getClientCase(id);
  if (!detail) notFound();

  const { record, lawyer, timeline, hearings, documents } = detail;
  const today = startOfToday();
  const nextActions = buildNextActions(detail);

  const latestUpdate = timeline[0] ?? null;
  const latestHearing = hearings[0] ?? null;
  const latestDoc = documents[0] ?? null;
  const hasRecent = Boolean(latestUpdate || latestHearing || latestDoc);

  const upcomingHearings = hearings
    .filter((h) => dayOf(h.date) >= today && h.status !== "cancelled")
    .sort((a, b) => a.date.localeCompare(b.date));
  const pastHearings = hearings.filter((h) => !(dayOf(h.date) >= today && h.status !== "cancelled"));
  const orderedHearings = [...upcomingHearings, ...pastHearings];

  return (
    <div className="space-y-6">
      <CaseRealtime caseId={record.id} />
      <Link href="/dashboard/client/cases" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-950">
        <ArrowLeft className="h-4 w-4" /> Back to cases
      </Link>

      {/* Header */}
      <Card className="border-slate-200 p-5 ring-0 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">{record.title}</h1>
          <StatusBadge status={caseStatusLabel(record.status)} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
          {record.lawyerName && <span className="flex items-center gap-1.5"><UserCog className="h-4 w-4 text-slate-400" /> {record.lawyerName}</span>}
          {record.caseType && <span className="flex items-center gap-1.5"><Scale className="h-4 w-4 text-slate-400" /> {record.caseType}</span>}
          {record.court && <span className="flex items-center gap-1.5"><Gavel className="h-4 w-4 text-slate-400" /> {record.court}</span>}
          <span className="flex items-center gap-1.5"><CalendarClock className="h-4 w-4 text-slate-400" /> {record.nextHearing ? `Next hearing ${formatDate(record.nextHearing)}` : "No hearing scheduled"}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-slate-400" /> Opened {formatDate(record.createdAt)}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/dashboard/client/messages"><MessageSquare className="h-4 w-4" /> Message advocate</Link>
          </Button>
          {hearings.length > 0 && (
            <Button asChild variant="outline" className="gap-2">
              <a href="#hearings"><CalendarClock className="h-4 w-4" /> View hearing details</a>
            </Button>
          )}
        </div>
      </Card>

      {/* Progress stages */}
      <Card className="border-slate-200 p-5 ring-0">
        <CaseStages status={record.status} hasDocuments={documents.length > 0} hasHearings={hearings.length > 0} />
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        {/* MAIN */}
        <div className="space-y-6">
          {/* What happens next */}
          {nextActions.length > 0 && (
            <Card className="border-slate-200 p-5 ring-0">
              <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-slate-950"><ChevronRight className="h-4 w-4 text-gold" /> What happens next?</h2>
              <div className="mt-4 space-y-3">
                {nextActions.map((a) => (
                  <div key={a.title} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary"><a.icon className="h-4.5 w-4.5" /></span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-950">{a.title}</p>
                      <p className="mt-0.5 text-sm leading-6 text-slate-600">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Timeline */}
          <Card className="border-slate-200 p-5 ring-0">
            <h2 className="mb-4 flex items-center gap-2 font-heading text-sm font-semibold text-slate-950"><History className="h-4 w-4 text-gold" /> Case timeline</h2>
            <ClientCaseTimeline timeline={timeline} />
          </Card>

          {/* Hearings */}
          <Card id="hearings" className="scroll-mt-6 border-slate-200 p-5 ring-0">
            <h2 className="mb-4 flex items-center gap-2 font-heading text-sm font-semibold text-slate-950"><CalendarClock className="h-4 w-4 text-gold" /> Hearings</h2>
            {orderedHearings.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-sm text-slate-500">No hearings scheduled yet.</p>
            ) : (
              <div className="space-y-3">
                {orderedHearings.map((h) => {
                  const isUpcoming = dayOf(h.date) >= today && h.status !== "cancelled";
                  return (
                    <div key={h.id} className={cn("rounded-xl border p-4", isUpcoming ? "border-gold/40 bg-gold/[0.05]" : "border-slate-200")}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", isUpcoming ? "bg-gold/15 text-gold" : "bg-primary/8 text-primary")}><CalendarClock className="h-5 w-5" /></span>
                          <div>
                            <p className="text-sm font-semibold text-slate-950">{formatDate(h.date)}{h.time ? ` - ${h.time.slice(0, 5)}` : ""}</p>
                            <p className="mt-0.5 text-xs text-slate-500">{[h.purpose, h.court].filter(Boolean).join(" - ") || "Hearing"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isUpcoming && <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-gold">Upcoming</span>}
                          <StatusBadge status={h.status} />
                        </div>
                      </div>
                      {(h.outcome || h.notes) && (
                        <dl className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                          {h.outcome && <div><dt className="text-[11px] uppercase tracking-wide text-slate-500">Outcome</dt><dd className="mt-0.5 text-sm text-slate-700">{h.outcome}</dd></div>}
                          {h.notes && <div><dt className="text-[11px] uppercase tracking-wide text-slate-500">Notes</dt><dd className="mt-0.5 text-sm text-slate-700">{h.notes}</dd></div>}
                        </dl>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          {/* Lawyer card */}
          {lawyer && (
            <Card className="border-slate-200 p-5 ring-0">
              <h3 className="font-heading text-sm font-semibold text-slate-950">Your advocate</h3>
              <div className="mt-4 flex items-center gap-3">
                <Avatar className="h-12 w-12 shrink-0">
                  {lawyer.photoUrl && <AvatarImage src={lawyer.photoUrl} alt={lawyer.name ?? "Advocate"} />}
                  <AvatarFallback className="bg-primary/8 text-sm font-semibold text-primary">{lawyer.name ? initials(lawyer.name) : "AD"}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-slate-950">{lawyer.name ?? "Advocate"}</p>
                    {lawyer.isVerified && <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-600" />}
                  </div>
                  <p className="truncate text-xs text-slate-500">{lawyer.professionalTitle || record.caseType || "Advocate"}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", lawyer.isVerified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                  <BadgeCheck className="h-3 w-3" /> {lawyer.isVerified ? "Verified advocate" : "Verification pending"}
                </span>
                {lawyer.experienceYears !== null && lawyer.experienceYears > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"><Briefcase className="h-3 w-3" /> {lawyer.experienceYears} yrs</span>
                )}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild size="sm" className="w-full gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/dashboard/client/messages"><MessageSquare className="h-4 w-4" /> Message advocate</Link>
                </Button>
                {lawyer.slug && lawyer.isVerified && (
                  <Button asChild size="sm" variant="outline" className="w-full gap-1.5">
                    <a href={`/lawyers/${lawyer.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /> View public profile</a>
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Case details */}
          <Card className="border-slate-200 p-5 ring-0">
            <h3 className="font-heading text-sm font-semibold text-slate-950">Case details</h3>
            <div className="mt-4 space-y-3">
              {record.lawyerName && <Info icon={UserCog} label="Advocate" value={record.lawyerName} />}
              {record.caseType && <Info icon={Scale} label="Case type" value={record.caseType} />}
              {record.court && <Info icon={Gavel} label="Court" value={record.court} />}
              {(record.caseNumber || record.courtCaseNumber) && <Info icon={Hash} label="Case number" value={(record.caseNumber ?? record.courtCaseNumber) as string} />}
              <Info icon={Activity} label="Status" value={caseStatusLabel(record.status)} />
              <Info icon={CalendarClock} label="Next hearing" value={record.nextHearing ? formatDate(record.nextHearing) : "Not scheduled"} />
              {record.opponentName && <Info icon={UserCog} label="Opposing party" value={record.opponentName} />}
              <Info icon={Clock} label="Opened" value={formatDate(record.createdAt)} />
              <Info icon={History} label="Last update" value={timeAgo(record.updatedAt)} />
            </div>
          </Card>

          {/* Recent updates widget */}
          {hasRecent && (
            <Card className="border-slate-200 p-5 ring-0">
              <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-slate-950"><Bell className="h-4 w-4 text-gold" /> Recent updates</h3>
              <div className="mt-3 space-y-2.5">
                {latestUpdate && <RecentRow icon={History} title={latestUpdate.title} meta={`Update - ${timeAgo(latestUpdate.createdAt)}`} />}
                {latestHearing && <RecentRow icon={CalendarClock} title={`Hearing ${formatDate(latestHearing.date)}`} meta={`${caseStatusLabel(latestHearing.status)}${latestHearing.court ? ` - ${latestHearing.court}` : ""}`} />}
                {latestDoc && <RecentRow icon={FileText} title={latestDoc.name} meta={`Document - ${timeAgo(latestDoc.createdAt)}`} />}
              </div>
            </Card>
          )}

          {/* Documents */}
          <Card className="border-slate-200 p-5 ring-0">
            <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-slate-950"><FolderOpen className="h-4 w-4 text-gold" /> Shared documents</h3>
            {documents.length === 0 ? (
              <p className="mt-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-3 py-3 text-center text-xs text-slate-500">Your advocate hasn&apos;t shared any documents yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {documents.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary"><FileText className="h-4 w-4" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{d.name}</p>
                      <p className="text-xs text-slate-500">{fmtSize(d.size)} - {formatDate(d.createdAt)}</p>
                    </div>
                    {d.url && (
                      <a href={d.url} target="_blank" rel="noopener noreferrer" className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label={`Download ${d.name}`}>
                        <Download className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
