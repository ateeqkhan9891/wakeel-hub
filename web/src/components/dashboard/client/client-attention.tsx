import Link from "next/link";

import type { LucideIcon } from "lucide-react";

import { AlertCircle, ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

type AttentionTask = {
  icon: LucideIcon;
  title: string;
  desc: string;
  href: string;
  cta: string;
  tone: string;
};

type ClientAttentionProps = {
  tasks: AttentionTask[];
};

export function ClientAttention({ tasks }: ClientAttentionProps) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <Card className="relative overflow-hidden border-slate-200 bg-white p-0 shadow-sm ring-0">
      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-50/70 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 h-24 w-24 rounded-full border border-slate-100" />
      <div className="pointer-events-none absolute right-8 top-7 h-10 w-10 rounded-full border border-blue-100/70" />

      <div className="relative flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <AlertCircle className="h-4 w-4" strokeWidth={1.8} aria-hidden />
          </div>

          <div>
            <h2 className="font-heading text-base font-semibold tracking-tight text-slate-950">
              Attention required
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              A few items may need your attention
            </p>
          </div>
        </div>

        <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500 sm:inline-flex">
          {tasks.length} {tasks.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="relative space-y-2 p-3">
        {tasks.map((task) => {
          const Icon = task.icon;

          return (
            <div
              key={task.title}
              className="group flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${task.tone}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {task.title}
                  </p>

                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                    {task.desc}
                  </p>
                </div>
              </div>

              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-8 shrink-0 gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              >
                <Link href={task.href}>
                  {task.cta}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}