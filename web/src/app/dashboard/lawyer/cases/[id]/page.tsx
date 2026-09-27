import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Gavel, Hash, User, Scale, CalendarClock } from "lucide-react";

import { getLawyerCase } from "@/lib/data/cases";
import { caseStatusLabel } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { LawyerCaseWorkspace } from "@/components/dashboard/lawyer/lawyer-case-workspace";
import { CaseRealtime } from "@/components/dashboard/shared/case-realtime";

export const metadata: Metadata = { title: "Case Detail" };

export default async function LawyerCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getLawyerCase(id);
  if (!detail) notFound();

  const { record } = detail;

  const headerMeta: { icon: typeof Gavel; value: string }[] = [
    record.client_name ? { icon: User, value: record.client_name } : null,
    record.case_type ? { icon: Scale, value: record.case_type } : null,
    record.court ? { icon: Gavel, value: record.court } : null,
    record.case_number || record.court_case_number
      ? { icon: Hash, value: (record.case_number ?? record.court_case_number) as string }
      : null,
    record.next_hearing_date ? { icon: CalendarClock, value: `Next hearing ${formatDate(record.next_hearing_date)}` } : null,
  ].filter((m): m is { icon: typeof Gavel; value: string } => m !== null);

  return (
    <div className="space-y-6">
      <CaseRealtime caseId={record.id} />
      <Link href="/dashboard/lawyer/cases" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-950">
        <ArrowLeft className="h-4 w-4" /> Back to cases
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">{record.title}</h1>
          <StatusBadge status={caseStatusLabel(record.status)} />
        </div>
        {headerMeta.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
            {headerMeta.map((m, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <m.icon className="h-4 w-4 text-slate-400" aria-hidden />
                {m.value}
              </span>
            ))}
          </div>
        )}
      </div>

      <LawyerCaseWorkspace
        record={record}
        note={detail.note}
        documents={detail.documents}
        timeline={detail.timeline}
        hearings={detail.hearings}
      />
    </div>
  );
}
