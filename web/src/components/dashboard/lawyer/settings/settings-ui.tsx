
"use client";

import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden border-slate-200/80 bg-white p-0 shadow-sm ring-0">
      <div className="border-b border-slate-100 bg-slate-50/40 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/10 bg-primary/5 text-primary">
            <Icon className="h-4 w-4" />
          </span>

          <div className="min-w-0">
            <h3 className="font-heading text-sm font-semibold tracking-tight text-slate-950">
              {title}
            </h3>

            {description && (
              <p className="mt-0.5 max-w-2xl text-xs leading-5 text-slate-500">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5">{children}</div>
    </Card>
  );
}

export function NumField({
  icon: Icon,
  label,
  value,
  onChange,
  helper,
}: {
  icon?: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
        {Icon && <Icon className="h-3.5 w-3.5 text-primary" />}
        {label}
      </Label>

      <Input
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 border-slate-200 bg-white text-sm shadow-none transition-colors focus-visible:border-primary/40 focus-visible:ring-primary/15"
      />

      {helper && (
        <p className="text-[11px] leading-4 text-slate-500">{helper}</p>
      )}
    </div>
  );
}

export function ToggleGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="divide-y divide-slate-100">{children}</div>;
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled,
  comingSoon,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  comingSoon?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0",
        disabled && "opacity-70",
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Label
            className={cn(
              "text-sm font-medium text-slate-900",
              disabled && "text-slate-500",
            )}
          >
            {label}
          </Label>

          {comingSoon && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
              Coming soon
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>

      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        aria-label={label}
      />
    </div>
  );
}

export function Chips({
  items,
  selected,
  onToggle,
}: {
  items: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = selected.includes(item);

        return (
          <button
            key={item}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(item)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900",
            )}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

export function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-3 first:pt-0 last:pb-0">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>

      <dd className="text-right text-sm font-medium text-slate-900">
        {children}
      </dd>
    </div>
  );
}

export function SubRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </dt>

      <dd className="mt-1 text-sm font-medium text-slate-900">
        {children}
      </dd>
    </div>
  );
}

export type StatusTone = "emerald" | "amber" | "slate";

const STATUS_TONES: Record<StatusTone, string> = {
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  slate: "bg-slate-100 text-slate-500",
};

export function StatusRow({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: StatusTone;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
            STATUS_TONES[tone],
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>

        <span className="truncate text-sm text-slate-600">{label}</span>
      </div>

      <span className="shrink-0 text-sm font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}

