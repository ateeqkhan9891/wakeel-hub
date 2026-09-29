import {
  Activity,
  Eye,
  MousePointerClick,
  Search,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import type { LawyerFullProfile } from "@/lib/data/lawyer-profile-types";

type PerformanceCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  accent: "violet" | "amber" | "emerald" | "blue" | "cyan" | "rose";
};

const accents = {
  violet: {
    card: "border-violet-100 bg-gradient-to-br from-violet-50/80 via-white to-white",
    icon: "bg-violet-100 text-violet-600",
    glow: "bg-violet-200/40",
    shape: "border-violet-200/50",
    value: "text-violet-950",
  },
  amber: {
    card: "border-amber-100 bg-gradient-to-br from-amber-50/80 via-white to-white",
    icon: "bg-amber-100 text-amber-600",
    glow: "bg-amber-200/40",
    shape: "border-amber-200/50",
    value: "text-amber-950",
  },
  emerald: {
    card: "border-emerald-100 bg-gradient-to-br from-emerald-50/80 via-white to-white",
    icon: "bg-emerald-100 text-emerald-600",
    glow: "bg-emerald-200/40",
    shape: "border-emerald-200/50",
    value: "text-emerald-950",
  },
  blue: {
    card: "border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-white",
    icon: "bg-blue-100 text-blue-600",
    glow: "bg-blue-200/40",
    shape: "border-blue-200/50",
    value: "text-blue-950",
  },
  cyan: {
    card: "border-cyan-100 bg-gradient-to-br from-cyan-50/80 via-white to-white",
    icon: "bg-cyan-100 text-cyan-600",
    glow: "bg-cyan-200/40",
    shape: "border-cyan-200/50",
    value: "text-cyan-950",
  },
  rose: {
    card: "border-rose-100 bg-gradient-to-br from-rose-50/80 via-white to-white",
    icon: "bg-rose-100 text-rose-600",
    glow: "bg-rose-200/40",
    shape: "border-rose-200/50",
    value: "text-rose-950",
  },
};

function PerformanceCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: PerformanceCardProps) {
  const styles = accents[accent];

  return (
    <Card
      className={`group relative min-h-[178px] overflow-hidden rounded-2xl border p-5 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 ${styles.card}`}
    >
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125 ${styles.glow}`}
      />

      <div
        className={`absolute -bottom-10 -right-10 h-28 w-28 rotate-45 rounded-[2rem] border ${styles.shape}`}
      />

      <div
        className={`absolute right-7 top-8 h-3 w-3 rounded-full opacity-50 ${styles.glow}`}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon}`}
        >
          <Icon className="h-[17px] w-[17px]" />
        </div>

        <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          Metric
        </span>
      </div>

      <div className="relative mt-7">
        <p
          className={`font-heading text-[27px] font-semibold tracking-tight ${styles.value}`}
        >
          {value}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-800">
          {label}
        </p>

        {hint && (
          <p className="mt-1.5 max-w-[180px] text-[11px] leading-4 text-slate-400">
            {hint}
          </p>
        )}
      </div>
    </Card>
  );
}

export function LawyerProfilePerformance({
  profile,
}: {
  profile: LawyerFullProfile;
}) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3 className="font-heading text-sm font-semibold text-slate-950">
            Performance overview
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            A snapshot of your activity and client engagement.
          </p>
        </div>

        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 sm:block">
          Profile analytics
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <PerformanceCard
          icon={Users}
          label="Consultations"
          value={profile.totalConsultations.toLocaleString()}
          hint="Completed consultations"
          accent="violet"
        />

        <PerformanceCard
          icon={Star}
          label="Client rating"
          value={profile.reviewCount > 0 ? profile.rating.toFixed(1) : "—"}
          hint={
            profile.reviewCount > 0
              ? `${profile.reviewCount.toLocaleString()} reviews`
              : "No reviews yet"
          }
          accent="amber"
        />

        <PerformanceCard
          icon={Activity}
          label="Response rate"
          value={`${profile.responseRate}%`}
          hint="Client response performance"
          accent="emerald"
        />

        <PerformanceCard
          icon={Eye}
          label="Profile views"
          value="—"
          hint="Analytics coming soon"
          accent="blue"
        />

        <PerformanceCard
          icon={Search}
          label="Search appearances"
          value="—"
          hint="Analytics coming soon"
          accent="cyan"
        />

        <PerformanceCard
          icon={MousePointerClick}
          label="Client clicks"
          value="—"
          hint="Analytics coming soon"
          accent="rose"
        />
      </div>
    </section>
  );
}
