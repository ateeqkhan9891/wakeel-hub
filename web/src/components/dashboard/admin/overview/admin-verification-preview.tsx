import { ArrowUpRight, Clock3, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { AdminSection } from "@/components/dashboard/admin/admin-ui";
import type { AdminVerificationDetail } from "@/lib/data/admin-verifications";
import { initials, timeAgo } from "@/lib/utils";

type AdminVerificationPreviewProps = {
  requests: AdminVerificationDetail[];
};

export function AdminVerificationPreview({
  requests,
}: AdminVerificationPreviewProps) {
  return (
    <AdminSection
      title="Pending lawyer verifications"
      icon={ShieldCheck}
      action={
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-8 gap-1.5 px-2 text-xs font-medium text-primary hover:bg-primary/5 hover:text-primary"
        >
          <Link href="/dashboard/admin/lawyers">
            Review all
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </Button>
      }
    >
      {requests.length === 0 ? (
        <EmptyVerificationState />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto] items-center gap-4 border-b border-slate-200 bg-slate-50/70 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:grid">
            <span>Applicant</span>
            <span>Submission</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-slate-100">
            {requests.slice(0, 4).map((request) => (
              <VerificationRow key={request.id} request={request} />
            ))}
          </div>
        </div>
      )}
    </AdminSection>
  );
}

function VerificationRow({
  request,
}: {
  request: AdminVerificationDetail;
}) {
  return (
    <div className="group grid grid-cols-1 gap-3 px-4 py-4 transition-colors hover:bg-slate-50/60 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0 rounded-xl">
          <AvatarFallback className="rounded-xl bg-primary/8 text-xs font-semibold text-primary">
            {initials(request.lawyerName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">
            {request.lawyerName}
          </p>

          <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-slate-500">
            <span className="truncate">
              Bar #{request.barCouncilNumber}
            </span>

            <span className="text-slate-300">•</span>

            <span className="truncate">{request.city ?? "—"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500 sm:block">
        <Clock3 className="h-3.5 w-3.5 shrink-0 text-slate-400 sm:hidden" aria-hidden />
        <div>
          <p className="font-medium text-slate-700">
            Submitted {timeAgo(request.submittedAt)}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Awaiting administrator review
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 sm:hidden">
          Status
        </span>
        <StatusBadge status={request.status} />
      </div>
    </div>
  );
}

function EmptyVerificationState() {
  return (
    <div className="flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <ShieldCheck className="h-4 w-4" aria-hidden />
      </span>

      <p className="mt-3 text-sm font-semibold text-slate-800">
        Verification queue is clear
      </p>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
        There are no pending lawyer verification requests requiring review.
      </p>
    </div>
  );
}