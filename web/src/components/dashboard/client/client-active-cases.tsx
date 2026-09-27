import Link from "next/link";
import { CalendarCheck, ChevronRight, Clock, Scale } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import type { getClientCases } from "@/lib/data/client-cases";
import { formatDate, timeAgo } from "@/lib/utils";
import Image from "next/image";

type ActiveCases = Awaited<ReturnType<typeof getClientCases>>;

type ClientActiveCasesProps = {
  cases: ActiveCases;
};

export function ClientActiveCases({ cases }: ClientActiveCasesProps) {
  const activeCases = cases.filter(
    (c) => !new Set(["closed", "won", "lost", "archived"]).has(c.status),
  );

  return (
    <Card className="border-slate-200 p-5 ring-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-slate-950">
          <Scale className="h-4 w-4 text-gold" />
          Active cases
        </h2>

        {cases.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 gap-1 text-primary hover:text-primary"
          >
            <Link href="/dashboard/client/cases">
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>

      {activeCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center">
          <Image
            src="/client/no-booking.png"
            alt=""
            width={120}
            height={120}
            className="h-24 w-24 object-contain"
            aria-hidden
          />

          <h3 className="mt-3 text-sm font-semibold text-slate-950">
            No active cases yet
          </h3>

          <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
            When an advocate takes on your matter, your case will appear here.
          </p>

          <Button asChild size="sm" variant="outline" className="mt-4">
            <Link href="/find-lawyers">Find a lawyer</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {activeCases.slice(0, 3).map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">
                    {c.title}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {[c.lawyerName, c.caseType, c.court]
                      .filter(Boolean)
                      .join(" - ") || "Case file"}
                  </p>
                </div>

                <StatusBadge status={c.status} />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CalendarCheck className="h-3.5 w-3.5 text-slate-400" />
                  {c.nextHearing
                    ? `Next hearing ${formatDate(c.nextHearing)}`
                    : "No hearing scheduled"}
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  Updated {timeAgo(c.updatedAt)}
                </span>

                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="ml-auto gap-1.5"
                >
                  <Link href={`/dashboard/client/cases/${c.id}`}>
                    View case
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}