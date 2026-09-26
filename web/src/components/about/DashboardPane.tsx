import {
  Bell,
  CalendarDays,
  CheckCircle2,
  FileText,
  MessageSquare,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type DashboardPaneProps = {
  mode: "client" | "lawyer";
  title: string;
  rows: readonly string[];
  active?: boolean;
};

const clientIcons = [
  UserRound,
  CalendarDays,
  FileText,
  CheckCircle2,
];

const lawyerIcons = [
  Bell,
  UserRound,
  MessageSquare,
  CheckCircle2,
];

export function DashboardPane({
  mode,
  title,
  rows,
  active = false,
}: DashboardPaneProps) {
  const icons = mode === "client" ? clientIcons : lawyerIcons;

  return (
    <motion.div
      animate={{
        y: active ? 0 : 2,
        opacity: active ? 1 : 0.72,
      }}
      transition={{ duration: 0.35 }}
      className={cn(
        "overflow-hidden rounded-2xl border bg-white",
        active
          ? "border-zinc-300 shadow-[0_20px_50px_-32px_rgba(15,23,42,0.45)]"
          : "border-zinc-200",
      )}
    >
      <div className="border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
              {mode === "client" ? (
                <UserRound className="h-3.5 w-3.5" />
              ) : (
                <FileText className="h-3.5 w-3.5" />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                {mode === "client" ? "Client workspace" : "Advocate workspace"}
              </p>
              <h3 className="truncate text-sm font-semibold text-zinc-900">
                {title}
              </h3>
            </div>
          </div>

          <span
            className={cn(
              "h-2 w-2 shrink-0 rounded-full",
              active ? "bg-emerald-500" : "bg-zinc-300",
            )}
          />
        </div>
      </div>

      <div className="divide-y divide-zinc-100">
        {rows.slice(0, 4).map((row, index) => {
          const Icon = icons[index % icons.length];

          return (
            <motion.div
              key={`${row}-${index}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: active ? 1 : 0.75, x: 0 }}
              transition={{
                duration: 0.3,
                delay: active ? index * 0.04 : 0,
              }}
              className="flex items-center gap-3 px-4 py-3"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
              </div>

              <span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-700">
                {row}
              </span>

              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-300" />
            </motion.div>
          );
        })}
      </div>

      <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400">
            {active ? "Live workspace" : "Connected workspace"}
          </span>

          <span className="text-[10px] font-semibold text-zinc-500">
            {mode === "client" ? "Client view" : "Advocate view"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}