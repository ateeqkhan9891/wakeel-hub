import {
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";

import type { Lawyer } from "@/lib/types";

import { formatDate } from "@/lib/utils";

type LawyerProfileTrustProps = {
  lawyer: Lawyer;
};

export function LawyerProfileTrust({
  lawyer,
}: LawyerProfileTrustProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-50/70 blur-2xl" />

      <div className="relative flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
          <ShieldCheck className="h-4 w-4" />
        </div>

        <div>
          <h2 className="font-heading text-base font-semibold tracking-tight text-slate-950">
            Trust and verification
          </h2>

          <p className="mt-0.5 text-[11px] text-slate-500">
            Profile information and activity
          </p>
        </div>
      </div>

      <div className="relative mt-4 space-y-3">
        <TrustLine>
          Bar Council enrollment displayed publicly
        </TrustLine>

        <TrustLine>
          Profile details controlled from lawyer dashboard
        </TrustLine>

        <TrustLine>
          Client reviews are published from real accounts
        </TrustLine>

        <TrustLine>
          Joined WakeelHub on {formatDate(lawyer.joinedDate)}
        </TrustLine>
      </div>
    </section>
  );
}

function TrustLine({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-start gap-2.5 text-xs leading-5 text-slate-600">
      <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
      <span>{children}</span>
    </p>
  );
}