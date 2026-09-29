import {
  ExternalLink,
  MapPin,
} from "lucide-react";

import type { Lawyer } from "@/lib/types";

type LawyerProfileOfficeProps = {
  lawyer: Lawyer;
};

export function LawyerProfileOffice({
  lawyer,
}: LawyerProfileOfficeProps) {
  if (
    !lawyer.officeName &&
    !lawyer.officeAddress &&
    !lawyer.googleMapsLink
  ) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 rounded-full border border-slate-100" />

      <div className="relative flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
          <MapPin className="h-4 w-4" />
        </div>

        <div>
          <h2 className="font-heading text-base font-semibold tracking-tight text-slate-950">
            Office details
          </h2>

          <p className="mt-0.5 text-[11px] text-slate-500">
            Where you can meet the advocate
          </p>
        </div>
      </div>

      <div className="relative mt-4 space-y-2 text-sm leading-6 text-slate-600">
        {lawyer.officeName && (
          <p className="font-semibold text-slate-950">
            {lawyer.officeName}
          </p>
        )}

        {lawyer.officeAddress && (
          <p>{lawyer.officeAddress}</p>
        )}

        {lawyer.googleMapsLink && (
          <a
            href={lawyer.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
          >
            View location
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </section>
  );
}
