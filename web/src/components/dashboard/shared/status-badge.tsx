import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  // booking / general positive
  accepted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  won: "border-emerald-200 bg-emerald-50 text-emerald-700",
  active: "border-blue-200 bg-blue-50 text-blue-700",
  "in-progress": "border-blue-200 bg-blue-50 text-blue-700",
  in_progress: "border-blue-200 bg-blue-50 text-blue-700",
  scheduled: "border-blue-200 bg-blue-50 text-blue-700",

  // pending / neutral
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  not_submitted: "border-amber-200 bg-amber-50 text-amber-700",
  investigating: "border-amber-200 bg-amber-50 text-amber-700",
  open: "border-amber-200 bg-amber-50 text-amber-700",
  adjourned: "border-amber-200 bg-amber-50 text-amber-700",
  upcoming: "border-amber-200 bg-amber-50 text-amber-700",
  new: "border-amber-200 bg-amber-50 text-amber-700",
  rescheduled: "border-amber-200 bg-amber-50 text-amber-700",
  overdue: "border-rose-200 bg-rose-50 text-rose-700",

  // negative
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
  declined: "border-rose-200 bg-rose-50 text-rose-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
  lost: "border-rose-200 bg-rose-50 text-rose-700",
  suspended: "border-rose-200 bg-rose-50 text-rose-700",

  // muted
  refunded: "border-slate-200 bg-slate-50 text-slate-600",
  partially_paid: "border-slate-200 bg-slate-50 text-slate-600",
  closed: "border-slate-200 bg-slate-50 text-slate-600",
  dismissed: "border-slate-200 bg-slate-50 text-slate-600",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const style = STATUS_STYLES[status.toLowerCase()] ?? "border-slate-200 bg-slate-50 text-slate-600";
  return (
    <Badge className={cn("rounded-full border px-2.5 py-0.5 font-normal capitalize shadow-none hover:opacity-100", style, className)}>
      {status.replace(/[_-]/g, " ")}
    </Badge>
  );
}

