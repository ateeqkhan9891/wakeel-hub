import {
  ExternalLink,
  Globe2,
} from "lucide-react";

import type { Lawyer } from "@/lib/types";

type LawyerProfileLinksProps = {
  lawyer: Lawyer;
};

export function LawyerProfileLinks({
  lawyer,
}: LawyerProfileLinksProps) {
  const links = lawyer.socialLinks
    ? [
        {
          label: "Website",
          href: lawyer.socialLinks.website,
        },
        {
          label: "LinkedIn",
          href: lawyer.socialLinks.linkedin,
        },
        {
          label: "Facebook",
          href: lawyer.socialLinks.facebook,
        },
      ].filter(
        (link): link is { label: string; href: string } =>
          Boolean(link.href),
      )
    : [];

  if (links.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-50/60 blur-2xl" />

      <div className="relative flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-200">
          <Globe2 className="h-4 w-4" />
        </div>

        <div>
          <h2 className="font-heading text-base font-semibold tracking-tight text-slate-950">
            Professional links
          </h2>

          <p className="mt-0.5 text-[11px] text-slate-500">
            External professional profiles
          </p>
        </div>
      </div>

      <div className="relative mt-4 flex flex-col gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5 text-xs font-medium text-slate-700 transition-colors hover:border-blue-100 hover:bg-blue-50/50 hover:text-blue-600"
          >
            <span className="flex items-center gap-2">
              <Globe2 className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-blue-500" />
              {link.label}
            </span>

            <ExternalLink className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-500" />
          </a>
        ))}
      </div>
    </section>
  );
}