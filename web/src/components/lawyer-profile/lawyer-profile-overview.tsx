import {
  CalendarDays,
  CheckCircle2,
  Gavel,
  GraduationCap,
  Languages,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Lawyer } from "@/lib/types";

type LawyerProfileOverviewProps = {
  lawyer: Lawyer;
};

export function LawyerProfileOverview({
  lawyer,
}: LawyerProfileOverviewProps) {
  return (
    <div className="space-y-5">
      <ProfilePanel
        icon={GraduationCap}
        title="Professional summary"
        description="About the advocate and their legal practice"
        variant="featured"
      >
        <p className="max-w-3xl text-sm leading-7 text-slate-600">
          {lawyer.about ||
            `${lawyer.fullName} is a verified advocate available for consultations through Wakeel360.`}
        </p>
      </ProfilePanel>

      <div className="grid gap-5 md:grid-cols-2">
        <ProfilePanel
          icon={Gavel}
          title="Courts practiced"
          description="Courts and jurisdictions"
        >
          <SimpleList
            items={lawyer.courts}
            empty="Court details will appear after the advocate updates this profile."
          />
        </ProfilePanel>

        <section className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md">
          <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rotate-12 rounded-[45%_55%_60%_40%] bg-gradient-to-br from-blue-200/70 via-indigo-100/50 to-transparent blur-2xl transition-transform duration-500 group-hover:scale-110" />

          <div className="pointer-events-none absolute right-12 top-12 h-20 w-20 rounded-[60%_40%_45%_55%] bg-gradient-to-br from-indigo-100/60 to-blue-50/20 blur-xl" />

          <div className="pointer-events-none absolute -bottom-10 -left-8 h-20 w-20 rounded-full bg-gradient-to-tr from-blue-100/50 to-transparent blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-blue-600 ring-1 ring-slate-200">
                <Languages className="h-4 w-4" />
              </span>

              <div className="min-w-0">
                <h2 className="font-heading text-base font-semibold tracking-tight text-slate-950">
                  Languages
                </h2>

                <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                  Languages available for consultation
                </p>
              </div>
            </div>

            <div className="relative mt-3">
              {lawyer.languages.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {lawyer.languages.map((language) => (
                    <Badge
                      key={language}
                      variant="outline"
                      className="rounded-full border-blue-100/80 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-slate-600 backdrop-blur-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {language}
                    </Badge>
                  ))}
                </div>
              ) : (
                <EmptyText>Language details are not listed yet.</EmptyText>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <ProfilePanel
          icon={GraduationCap}
          title="Education"
          description="Academic and professional background"
        >
          <SimpleList
            items={lawyer.education}
            empty="Education details will appear after profile completion."
          />
        </ProfilePanel>

        <ProfilePanel
          icon={CalendarDays}
          title="Availability"
          description="Consultation schedule and modes"
          compact
        >
          <div className="divide-y divide-slate-100">
            <InfoLine
              label="Days"
              value={
                lawyer.availability.days.length
                  ? lawyer.availability.days.join(", ")
                  : "By appointment"
              }
            />

            <InfoLine
              label="Hours"
              value={lawyer.availability.hours || "By appointment"}
            />

            <InfoLine
              label="Modes"
              value={
                lawyer.availability.mode.length
                  ? lawyer.availability.mode.join(", ")
                  : "By appointment"
              }
            />
          </div>
        </ProfilePanel>
      </div>
    </div>
  );
}

function ProfilePanel({
  icon: Icon,
  title,
  description,
  children,
  variant = "default",
  compact = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  variant?: "default" | "featured";
  compact?: boolean;
}) {
  const isFeatured = variant === "featured";

  return (
    <section
      className={[
        "group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300",
        "hover:border-slate-300 hover:shadow-md",
        isFeatured
          ? "border-blue-100 p-5 sm:p-6"
          : compact
            ? "border-slate-200 p-4"
            : "border-slate-200 p-4 sm:p-5",
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full blur-3xl transition-opacity duration-300",
          isFeatured
            ? "bg-gradient-to-br from-blue-200/70 via-indigo-100/50 to-transparent opacity-80"
            : "bg-gradient-to-br from-blue-100/80 via-indigo-50/50 to-transparent opacity-70 group-hover:opacity-100",
        ].join(" ")}
      />

      <div
        className={[
          "pointer-events-none absolute -bottom-10 -left-10 h-24 w-24 rounded-full blur-2xl",
          isFeatured
            ? "bg-gradient-to-tr from-indigo-100/50 via-blue-50/30 to-transparent"
            : "bg-gradient-to-tr from-blue-50/70 via-indigo-50/30 to-transparent",
        ].join(" ")}
      />

      {isFeatured && (
        <div className="pointer-events-none absolute right-16 top-5 h-14 w-14 rounded-full border border-blue-100/60" />
      )}

      <div className="relative">
        <div className="flex items-center gap-3">
          <span
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1",
              isFeatured
                ? "bg-blue-50 text-blue-600 ring-blue-100"
                : "bg-slate-50 text-blue-600 ring-slate-200",
            ].join(" ")}
          >
            <Icon className="h-4 w-4" />
          </span>

          <div className="min-w-0">
            <h2 className="font-heading text-base font-semibold tracking-tight text-slate-950">
              {title}
            </h2>

            <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <div className={isFeatured ? "mt-5" : compact ? "mt-3" : "mt-4"}>
          {children}
        </div>
      </div>
    </section>
  );
}

function SimpleList({
  items,
  empty,
}: {
  items: string[];
  empty: string;
}) {
  if (!items.length) {
    return <EmptyText>{empty}</EmptyText>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 text-sm leading-5 text-slate-600 transition-colors hover:border-blue-100 hover:bg-blue-50/40"
        >
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
      <span className="shrink-0 text-xs font-medium text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm text-slate-700">{value}</span>
    </div>
  );
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-5 text-slate-500">{children}</p>;
}