import { Activity, ArrowUpRight, ShieldCheck } from "lucide-react";

export function AdminOverviewHeader() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/30">
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary" />
        <div className="absolute right-6 top-6 h-3 w-3 rounded-full bg-gold shadow-sm" />
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-1/3 bg-gradient-to-r from-gold/60 to-transparent" />

      <div className="relative flex flex-col gap-7 px-5 py-6 sm:px-7 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            <ShieldCheck
              className="h-3.5 w-3.5 text-gold"
              aria-hidden
            />
            Administration
          </div>

          <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Platform Overview
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor platform activity, lawyer verification, user growth,
            revenue, and operational issues from one place.
          </p>
        </div>

        <div className="relative flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Activity className="h-4 w-4" aria-hidden />

            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-50" />
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-slate-900">
                System status
              </p>

              <span className="h-1 w-1 rounded-full bg-slate-300" />

              <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-emerald-600">
                Operational
              </span>
            </div>

            <p className="mt-0.5 text-[11px] text-slate-400">
              All platform services are running normally
            </p>
          </div>

          <ArrowUpRight
            className="ml-1 h-3.5 w-3.5 shrink-0 text-slate-300"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}