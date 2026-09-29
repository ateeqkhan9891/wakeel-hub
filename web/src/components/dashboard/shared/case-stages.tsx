import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = ["Consultation", "Case opened", "Documents filed", "Hearings", "Decision", "Closed"] as const;

const TERMINAL = new Set(["closed", "won", "lost", "archived"]);

/** Maps the raw case status to the furthest active stage index. */
function statusIndex(status: string): number {
  if (status === "closed" || status === "archived") return 5;
  if (status === "won" || status === "lost") return 4;
  if (status === "adjourned" || status === "in_progress") return 3;
  if (status === "pending") return 1;
  return 1; // active and anything else → Case opened
}

export function CaseStages({
  status,
  hasDocuments,
  hasHearings,
}: {
  status: string;
  hasDocuments: boolean;
  hasHearings: boolean;
}) {
  const terminal = TERMINAL.has(status);
  const signalIndex = Math.max(1, hasDocuments ? 2 : 0, hasHearings ? 3 : 0);
  const current = Math.max(statusIndex(status), signalIndex);

  return (
    <div>
      <h3 className="font-heading text-sm font-semibold text-slate-950">Case progress</h3>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STAGES.map((label, i) => {
          const done = terminal ? i <= current : i < current;
          const isCurrent = !terminal && i === current;
          return (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ring-1",
                  done
                    ? "bg-primary text-primary-foreground ring-primary"
                    : isCurrent
                      ? "bg-gold/15 text-gold ring-gold/40"
                      : "bg-slate-50 text-slate-400 ring-slate-200"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={cn("text-xs leading-tight", isCurrent ? "font-semibold text-slate-950" : done ? "font-medium text-slate-700" : "text-slate-400")}>
                {label}
              </span>
              {isCurrent && <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-gold">In progress</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

