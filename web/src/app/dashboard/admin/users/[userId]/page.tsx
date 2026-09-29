import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";

import { getAdminUserById } from "@/lib/data/admin";
import { formatDate, initials } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";

type AdminUserDetailsPageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export async function generateMetadata({
  params,
}: AdminUserDetailsPageProps): Promise<Metadata> {
  const { userId } = await params;
  const user = await getAdminUserById(userId);

  return {
    title: user ? `${user.name} · User` : "User",
  };
}

export default async function AdminUserDetailsPage({
  params,
}: AdminUserDetailsPageProps) {
  const { userId } = await params;
  const user = await getAdminUserById(userId);

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[1200px] items-center justify-center">
        <Card className="w-full max-w-md border-slate-200 p-8 text-center ring-0">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <UserRound className="h-5 w-5" aria-hidden />
          </span>

          <h1 className="mt-4 font-heading text-lg font-semibold text-slate-950">
            User not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This account may have been removed or is no longer available.
          </p>

          <Link
            href="/dashboard/admin/users"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to users
          </Link>
        </Card>
      </div>
    );
  }

  const roleLabel =
    user.role === "lawyer"
      ? "Lawyer"
      : user.role === "admin"
        ? "Admin"
        : "Client";

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-6">
      <Link
        href="/dashboard/admin/users"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to users
      </Link>

      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/30">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary" />
          <div className="absolute right-6 top-6 h-3 w-3 rounded-full bg-gold" />
        </div>

        <div className="relative flex flex-col gap-6 px-5 py-6 sm:px-7 sm:py-7 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="h-16 w-16 shrink-0 rounded-2xl">
              <AvatarFallback className="rounded-2xl bg-primary/8 text-lg font-semibold text-primary">
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">
                  {user.name}
                </h1>

                <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-600">
                  {roleLabel}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">{user.email}</p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                  Joined {formatDate(user.createdAt)}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={
                      user.isActive
                        ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
                        : "h-1.5 w-1.5 rounded-full bg-slate-400"
                    }
                  />
                  {user.isActive ? "Active account" : "Inactive account"}
                </span>
              </div>
            </div>
          </div>

          <AccountStatus isActive={user.isActive} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-slate-200 p-5 ring-0 sm:p-6">
          <SectionHeading
            icon={UserRound}
            title="Account information"
            description="Core identity and contact information."
          />

          <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <DetailItem
              icon={UserRound}
              label="Full name"
              value={user.name}
            />

            <DetailItem
              icon={Mail}
              label="Email"
              value={user.email}
            />

            <DetailItem
              icon={Phone}
              label="Phone"
              value={user.phone}
            />

            <DetailItem
              icon={MapPin}
              label="City"
              value={user.city}
            />

            <DetailItem
              icon={MapPin}
              label="Province"
              value={user.province}
            />

            <DetailItem
              icon={CalendarDays}
              label="Last updated"
              value={formatDate(user.updatedAt)}
            />
          </div>
        </Card>

        <Card className="border-slate-200 p-5 ring-0 sm:p-6">
          <SectionHeading
            icon={ShieldCheck}
            title="Account status"
            description="Current access state for this account."
          />

          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Account access
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {user.isActive
                    ? "This account can access the platform."
                    : "This account is currently disabled."}
                </p>
              </div>

              <AccountStatus isActive={user.isActive} />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-100 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                <ShieldCheck className="h-4 w-4" aria-hidden />
              </span>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Role
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  This account is registered as a {roleLabel.toLowerCase()}.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {user.lawyer && (
        <Card className="border-slate-200 p-5 ring-0 sm:p-6">
          <SectionHeading
            icon={BriefcaseBusiness}
            title="Lawyer profile"
            description="Professional and verification information for this advocate."
          />

          <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              icon={BriefcaseBusiness}
              label="Profile slug"
              value={user.lawyer.slug}
            />

            <DetailItem
              icon={ShieldCheck}
              label="Bar council"
              value={user.lawyer.barCouncilName}
            />

            <DetailItem
              icon={ShieldCheck}
              label="Bar council number"
              value={user.lawyer.barCouncilNumber}
            />

            <DetailItem
              icon={UserRound}
              label="Gender"
              value={user.lawyer.gender}
            />

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                Verification
              </p>

              <div className="mt-2">
                <StatusBadge
                  status={
                    user.lawyer.isVerified ? "approved" : "pending"
                  }
                />
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                Lawyer profile
              </p>

              <div className="mt-2">
                <AccountStatus isActive={user.lawyer.isActive} />
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="border-slate-200 p-5 ring-0 sm:p-6">
        <SectionHeading
          icon={CalendarDays}
          title="Account timeline"
          description="Basic lifecycle information for this account."
        />

        <div className="mt-6 space-y-4">
          <TimelineItem
            label="Account created"
            value={formatDate(user.createdAt)}
            icon={UserRound}
          />

          <TimelineItem
            label="Last profile update"
            value={formatDate(user.updatedAt)}
            icon={CalendarDays}
          />

          {user.lawyer?.verifiedAt && (
            <TimelineItem
              label="Lawyer verified"
              value={formatDate(user.lawyer.verifiedAt)}
              icon={CheckCircle2}
            />
          )}
        </div>
      </Card>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof UserRound;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
        <Icon className="h-4 w-4" aria-hidden />
      </span>

      <div>
        <h2 className="font-heading text-sm font-semibold text-slate-950">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string | null;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
          {label}
        </p>
      </div>

      <p className="mt-1.5 truncate text-sm font-medium text-slate-800">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function AccountStatus({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
      <XCircle className="h-3.5 w-3.5" aria-hidden />
      Inactive
    </span>
  );
}

function TimelineItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof UserRound;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
        <Icon className="h-3.5 w-3.5" aria-hidden />
      </span>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="shrink-0 text-xs text-slate-400">{value}</p>
      </div>
    </div>
  );
}