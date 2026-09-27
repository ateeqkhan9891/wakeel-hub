"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { BriefcaseBusiness } from "lucide-react";
import { toast } from "sonner";

import type { CaseRecord } from "@/lib/data/case-types";

import { deleteCase } from "@/app/actions/case-actions";

import { LawyerCasesToolbar } from "./lawyer-cases-toolbar";
import { LawyerCaseCard } from "./lawyer-case-card";
import { LawyerCaseStats } from "./lawyer-case-stats";

type LawyerCasesLiveProps = {
  cases: CaseRecord[];
};

export function LawyerCasesLive({
  cases,
}: LawyerCasesLiveProps) {
  const router = useRouter();

  const [status, setStatus] = useState("all");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const counts = useMemo(() => {
    const result: Record<string, number> = {
      all: cases.length,
    };

    for (const caseItem of cases) {
      result[caseItem.status] =
        (result[caseItem.status] ?? 0) + 1;
    }

    return result;
  }, [cases]);

  const filteredCases = useMemo(() => {
    if (status === "all") {
      return cases;
    }

    return cases.filter(
      (caseItem) => caseItem.status === status,
    );
  }, [cases, status]);

  function handleDelete(id: string) {
    setPendingId(id);

    startTransition(async () => {
      const result = await deleteCase(id);

      setPendingId(null);

      if (!result.ok) {
        toast.error("Could not delete case", {
          description: result.error,
        });

        return;
      }

      toast.success("Case deleted");

      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <LawyerCaseStats cases={cases} />

      <LawyerCasesToolbar
        status={status}
        counts={counts}
        onStatusChange={setStatus}
      />

      {filteredCases.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
            <BriefcaseBusiness className="h-5 w-5 text-slate-400" />
          </div>

          <h3 className="mt-4 font-heading text-base font-semibold text-slate-950">
            No cases found
          </h3>

          <p className="mt-1.5 max-w-sm text-sm leading-6 text-slate-500">
            There are no cases in this status yet. Cases you create
            or convert from consultations will appear here.
          </p>

          {status !== "all" && (
            <button
              type="button"
              onClick={() => setStatus("all")}
              className="mt-5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-950"
            >
              View all cases
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCases.map((caseItem) => (
            <LawyerCaseCard
              key={caseItem.id}
              caseItem={caseItem}
              pending={
                pendingId === caseItem.id && isPending
              }
              onDelete={() => handleDelete(caseItem.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}