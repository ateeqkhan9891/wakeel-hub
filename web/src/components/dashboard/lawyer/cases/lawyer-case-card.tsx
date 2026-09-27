import {
  CalendarClock,
  ChevronRight,
  CircleDollarSign,
  FileText,
  Gavel,
  Loader2,
  Trash2,
  UserRound,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { StatusBadge } from "@/components/dashboard/shared/status-badge";

import type { CaseRecord } from "@/lib/data/case-types";

import { formatDate, formatPKR } from "@/lib/utils";

type LawyerCaseCardProps = {
  caseItem: CaseRecord;
  pending: boolean;
  onDelete: () => void;
};

function Meta({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="truncate">{children}</span>
    </div>
  );
}

export function LawyerCaseCard({
  caseItem,
  pending,
  onDelete,
}: LawyerCaseCardProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm shadow-slate-200/40 transition-shadow hover:shadow-md">
      <div className="p-4 sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-[0.95rem] font-semibold text-slate-950">
                    {caseItem.title}
                  </h3>

                  <StatusBadge status={caseItem.status} />
                </div>

                {caseItem.case_number && (
                  <p className="mt-1 text-xs text-slate-400">
                    Case #{caseItem.case_number}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {caseItem.client_name && (
                <Meta icon={UserRound}>
                  {caseItem.client_name}
                </Meta>
              )}

              {caseItem.court && (
                <Meta icon={Gavel}>
                  {caseItem.court}
                </Meta>
              )}

              {caseItem.case_type && (
                <Meta icon={FileText}>
                  {caseItem.case_type}
                </Meta>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <div>
              <p className="text-xs text-slate-400">
                Total fee
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-950">
                {formatPKR(caseItem.total_fee)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Remaining
              </p>

              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-950">
                <CircleDollarSign className="h-3.5 w-3.5 text-slate-400" />
                {formatPKR(caseItem.remaining_fee)}
              </p>
            </div>

            {caseItem.next_hearing_date && (
              <div className="col-span-2">
                <p className="text-xs text-slate-400">
                  Next hearing
                </p>

                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <CalendarClock className="h-3.5 w-3.5 text-slate-400" />
                  {formatDate(caseItem.next_hearing_date)}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-end justify-between gap-2 border-t border-slate-100 pt-4 lg:flex-col lg:items-end lg:justify-between lg:border-t-0 lg:pt-0">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="gap-1.5 text-slate-600 hover:text-slate-950"
              onClick={() => {
                window.location.href = `/dashboard/lawyer/cases/${caseItem.id}`;
              }}
            >
              View case
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={pending}
              onClick={onDelete}
              className="gap-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}