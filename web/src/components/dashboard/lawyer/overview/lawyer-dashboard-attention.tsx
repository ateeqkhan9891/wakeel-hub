import Link from "next/link";

import {
  ArrowUpRight,
  CircleCheck,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";

type AttentionItem = {
  icon: LucideIcon;
  title: string;
  detail: string;
  href: string;
};

type LawyerDashboardAttentionProps = {
  items: AttentionItem[];
};

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h2 className="font-heading text-base font-semibold text-slate-950">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

function AttentionEmptyState() {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
      <div className="flex flex-col items-center px-5 py-7 text-center sm:px-8 sm:py-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-emerald-600 shadow-sm">
          <CircleCheck className="h-6 w-6" />
        </span>

        <div className="mt-5 max-w-md">
          <h3 className="font-heading text-base font-semibold text-slate-950">
            Everything is under control
          </h3>

          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            No hearings, client messages, or payment issues currently require
            your attention.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white/70 px-5 py-3.5">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <CircleCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Your dashboard is clear for now.</span>
        </div>
      </div>
    </div>
  );
}

export function LawyerDashboardAttention({
  items,
}: LawyerDashboardAttentionProps) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 sm:rounded-3xl sm:p-5">
      <SectionHeader
        title="Cases needing attention"
        description="Important items from hearings, messages and payment activity."
      />

      {items.length === 0 ? (
        <AttentionEmptyState />
      ) : (
        <div className="mt-5 space-y-3">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                key={`${item.title}-${index}`}
                href={item.href}
                className="group relative flex items-start gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/60 sm:p-4"
              >
                <span className="absolute inset-y-0 left-0 w-0.5 bg-amber-400" />

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700">
                  <Icon className="h-4 w-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-950">
                      {item.title}
                    </p>

                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-slate-600" />
                  </div>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {item.detail}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
}