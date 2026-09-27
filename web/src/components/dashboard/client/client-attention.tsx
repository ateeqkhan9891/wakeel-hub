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
    <Card className="border-slate-200 p-5 ring-0">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-amber-600" aria-hidden />
        <h2 className="font-heading text-lg font-semibold text-slate-950">
          Attention required
        </h2>
      </div>

      <div className="mt-4 space-y-3">
        {tasks.map((task) => {
          const Icon = task.icon;

          return (
            <div
              key={task.title}
              className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className={`rounded-lg p-2 ${task.tone}`}>
                  <Icon className="h-4 w-4" aria-hidden />
                </div>

                <div className="min-w-0">
                  <p className="font-medium text-slate-900">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{task.desc}</p>
                </div>
              </div>

              <Button asChild variant="outline" className="shrink-0 gap-2">
                <Link href={task.href}>
                  {task.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}