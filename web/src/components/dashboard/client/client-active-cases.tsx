import Image from "next/image";
import Link from "next/link";

import {
  CalendarCheck,
  ChevronRight,
  Clock,
  Scale,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";

import type { getClientCases } from "@/lib/data/client-cases";

import { formatDate, timeAgo } from "@/lib/utils";

type ActiveCases = Awaited<ReturnType<typeof getClientCases>>;

type ClientActiveCasesProps = {
  cases: ActiveCases;
};

export function ClientActiveCases({ cases }: ClientActiveCasesProps) {
  const activeCases = cases.filter(
    (c) => !new Set(["closed", "won", "lost", "archived"]).has(c.status),
  );

  return (
    <Card className="relative overflow-hidden border-slate-200 bg-white p-0 shadow-sm ring-0">
      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-50/70 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-8 h-24 w-24 rounded-full border border-slate-100" />
      <div className="pointer-events-none absolute right-10 top-7 h-8 w-8 rounded-full border border-blue-100/70" />

      <div className="relative flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Scale className="h-4 w-4" strokeWidth={1.8} aria-hidden />
          </div>

          <div>
            <h2 className="font-heading text-base font-semibold tracking-tight text-slate-950">
              Active cases
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {activeCases.length > 0
                ? `${activeCases.length} active ${
                    activeCases.length === 1 ? "matter" : "matters"
                  }`
                : "Your current legal matters"}
            </p>
          </div>
        </div>

        {cases.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 gap-1 rounded-lg px-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          >
            <Link href="/dashboard/client/cases">
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>

      {activeCases.length === 0 ? (
        <div className="relative mx-4 my-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-9 text-center">
          <div className="absolute right-5 top-5 h-8 w-8 rounded-full border border-slate-200/70" />

          <Image
            src="/client/no-booking.png"
            alt=""
            width={100}
            height={100}
            className="h-20 w-20 object-contain"
            aria-hidden
          />

          <h3 className="mt-3 text-sm font-semibold text-slate-950">
            No active cases
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
            Once a lawyer takes on your matter, your case details and updates
            will appear here.
          </p>

          <Button
            asChild
            size="sm"
            className="mt-4 h-8 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Link href="/find-lawyers">
              Find a lawyer
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="relative space-y-2 p-3">
          {activeCases.slice(0, 3).map((c) => (
            <div
              key={c.id}
              className="group rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/dashboard/client/cases/${c.id}`}
                    className="block truncate text-sm font-semibold text-slate-950 transition-colors hover:text-blue-600"
                  >
                    {c.title}
                  </Link>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {[c.lawyerName, c.caseType, c.court]
                      .filter(Boolean)
                      .join(" · ") || "Case file"}
                  </p>
                </div>

                <StatusBadge status={c.status} />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200/70 pt-3">
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                  <CalendarCheck className="h-3.5 w-3.5 text-blue-500" />
                  {c.nextHearing
                    ? formatDate(c.nextHearing)
                    : "No hearing scheduled"}
                </span>

                <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  {timeAgo(c.updatedAt)}
                </span>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-7 gap-1 rounded-lg px-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                >
                  <Link href={`/dashboard/client/cases/${c.id}`}>
                    View case
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}

          {activeCases.length > 3 && (
            <div className="pt-1 text-center">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                <Link href="/dashboard/client/cases">
                  View {activeCases.length - 3} more{" "}
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
