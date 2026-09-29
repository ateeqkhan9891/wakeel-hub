import Link from "next/link";

import {
  ArrowUpRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Scale,
  Star,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import { cn, formatPKR } from "@/lib/utils";

import type {
  EducationEntry,
  ExperienceEntry,
  PublicationEntry,
  SocialLinks,
} from "@/lib/data/lawyer-profile-types";

export function Section({
  icon: Icon,
  title,
  count,
  action,
  children,
}: {
  icon: typeof Scale;
  title: string;
  count?: number;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-slate-200 p-5 ring-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
            <Icon className="h-4 w-4" />
          </span>

          <div className="flex min-w-0 items-center gap-2">
            <h3 className="font-heading text-sm font-semibold text-slate-950">
              {title}
            </h3>

            {count !== undefined && count > 0 && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                {count}
              </span>
            )}
          </div>
        </div>

        {action}
      </div>

      <div className="mt-5">{children}</div>
    </Card>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-4 py-5 text-sm text-slate-500">
      {children}
    </div>
  );
}

export function ChipRow({
  items,
  tone = "slate",
}: {
  items: string[];
  tone?: "slate" | "gold";
}) {
  if (items.length === 0) {
    return <Empty>Nothing added yet.</Empty>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium",
            tone === "gold"
              ? "bg-amber-50 text-amber-700"
              : "bg-slate-100 text-slate-600",
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function ExperienceCard({
  item,
}: {
  item: ExperienceEntry;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-medium text-slate-950">
            {item.position || "Position"}
          </p>

          <p className="mt-0.5 text-sm text-slate-500">
            {item.firm || "Organization"}
          </p>
        </div>

        {(item.startDate || item.endDate) && (
          <span className="text-xs text-slate-400">
            {item.startDate || "—"} - {item.endDate || "Present"}
          </span>
        )}
      </div>

      {item.description && (
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {item.description}
        </p>
      )}
    </div>
  );
}

export function EducationCard({
  item,
}: {
  item: EducationEntry;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-slate-950">
            {item.degree || "Degree"}
          </p>

          <p className="mt-0.5 text-sm text-slate-500">
            {item.institution || "Institution"}
          </p>
        </div>

        {item.year && (
          <span className="shrink-0 text-xs text-slate-400">
            {item.year}
          </span>
        )}
      </div>
    </div>
  );
}

export function Fee({
  label,
  value,
  enabled = true,
}: {
  label: string;
  value: string;
  enabled?: boolean;
}) {
  const amount = Number(value);

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        enabled && amount > 0
          ? "border-slate-200 bg-white"
          : "border-slate-100 bg-slate-50/70",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-700">{label}</p>

        {enabled && amount > 0 ? (
          <span className="text-sm font-semibold text-slate-950">
            {formatPKR(amount)}
          </span>
        ) : (
          <span className="text-xs font-medium text-slate-400">
            Not available
          </span>
        )}
      </div>
    </div>
  );
}

export function Row({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof MapPin;
  label: string;
  value?: string | null;
  href?: string;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-3.5 w-3.5" />
      </span>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <span className="break-all">{value}</span>
            <ArrowUpRight className="h-3 w-3 shrink-0" />
          </a>
        ) : (
          <p className="mt-0.5 break-words text-sm text-slate-600">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

export function SocialLink({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-950"
    >
      {label}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

export function PublicationCard({
  item,
}: {
  item: PublicationEntry;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
          <BookOpen className="h-4 w-4" />
        </span>

        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-950">
            {item.title || "Untitled publication"}
          </p>

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex max-w-full items-center gap-1 text-xs text-primary hover:underline"
            >
              <span className="truncate">{item.url}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
