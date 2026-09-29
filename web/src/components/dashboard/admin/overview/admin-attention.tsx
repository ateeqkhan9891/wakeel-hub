import {
  AlertCircle,
  ArrowUpRight,
  CreditCard,
  FileCheck2,
  MessageSquareWarning,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { AdminStats } from "@/lib/data/admin";
import type {
  AttentionItem,
  AttentionTone,
} from "./admin-overview-types";

const TONE_STYLES: Record<
  AttentionTone,
  {
    icon: string;
    accent: string;
    count: string;
  }
> = {
  amber: {
    icon: "bg-amber-50 text-amber-600",
    accent: "bg-amber-500",
    count: "text-amber-700",
  },
  rose: {
    icon: "bg-rose-50 text-rose-600",
    accent: "bg-rose-500",
    count: "text-rose-700",
  },
  slate: {
    icon: "bg-slate-100 text-slate-500",
    accent: "bg-slate-400",
    count: "text-slate-700",
  },
};

type AdminAttentionProps = {
  stats: AdminStats;
};

export function AdminAttention({ stats }: AdminAttentionProps) {
  const items: AttentionItem[] = [
    {
      icon: FileCheck2,
      label: "Pending lawyer verifications",
      count: stats.pendingVerifications,
      href: "/dashboard/admin/lawyers",
      tone: "amber",
    },
    {
      icon: ShieldCheck,
      label: "Verification rejections",
      count: stats.rejectedVerifications,
      href: "/dashboard/admin/lawyers",
      tone: "slate",
    },
    {
      icon: MessageSquareWarning,
      label: "Open complaints",
      count: stats.openComplaints,
      href: "/dashboard/admin/reports",
      tone: "rose",
    },
    {
      icon: CreditCard,
      label: "Failed payments",
      count: stats.failedPayments,
      href: "/dashboard/admin/payments",
      tone: "slate",
    },
    {
      icon: AlertCircle,
      label: "Subscriptions expiring soon",
      count: stats.expiringSubscriptions,
      href: "/dashboard/admin/subscriptions",
      tone: "slate",
    },
  ];

  const visibleItems = items.filter((item) => item.count > 0);

  if (visibleItems.length === 0) {
    return <ClearState />;
  }

  return (
    <section aria-labelledby="admin-attention-heading">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Operations
          </p>

          <h2
            id="admin-attention-heading"
            className="mt-1 font-heading text-lg font-semibold tracking-tight text-slate-950"
          >
            Attention required
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Items that may require administrator action.
          </p>
        </div>

        <span className="hidden text-xs text-slate-400 sm:block">
          {visibleItems.length} active{" "}
          {visibleItems.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div
        className={cn(
          "grid overflow-hidden rounded-2xl border border-slate-200 bg-slate-200",
          visibleItems.length >= 5
            ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-5"
            : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
        )}
      >
        {visibleItems.map((item) => (
          <AttentionRow key={item.label} item={item} />
        ))}
      </div>
    </section>
  );
}

function AttentionRow({ item }: { item: AttentionItem }) {
  const Icon = item.icon;
  const styles = TONE_STYLES[item.tone];

  return (
    <Link
      href={item.href}
      className="group relative block bg-white p-5 transition-colors hover:bg-slate-50/80"
    >
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-0.5",
          styles.accent,
        )}
      />

      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            styles.icon,
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>

        <ArrowUpRight
          className="h-4 w-4 text-slate-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-500"
          aria-hidden
        />
      </div>

      <div className="mt-5">
        <p
          className={cn(
            "text-3xl font-semibold tracking-tight",
            styles.count,
          )}
        >
          {item.count}
        </p>

        <p className="mt-1.5 text-xs font-medium leading-5 text-slate-600">
          {item.label}
        </p>
      </div>

      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 transition-colors group-hover:text-slate-500">
        Review item
      </p>
    </Link>
  );
}

function ClearState() {
  return (
    <section aria-labelledby="admin-attention-heading">
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Operations
        </p>

        <h2
          id="admin-attention-heading"
          className="mt-1 font-heading text-lg font-semibold tracking-tight text-slate-950"
        >
          Attention required
        </h2>
      </div>

      <Card className="border-emerald-200 bg-emerald-50/40 p-5 shadow-none ring-0">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <FileCheck2 className="h-4 w-4" aria-hidden />
          </span>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Everything looks clear
            </p>

            <p className="mt-0.5 text-xs leading-5 text-slate-500">
              There are no outstanding operational items requiring attention.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}