import Link from "next/link";
import { BookOpen, Bot, MapPin, Scale, ShieldCheck, UserRound } from "lucide-react";

import { Card } from "@/components/ui/card";
import { LEGAL_GUIDES, topCityPracticeLinks, topSeoPracticeLinks } from "@/lib/seo-content";

type FeaturedLink = {
  href: string;
  label: string;
  meta: string;
};

export function SeoInternalLinks({ featuredLawyers }: { featuredLawyers: FeaturedLink[] }) {
  const groups = [
    {
      title: "Popular practice areas",
      icon: Scale,
      links: topSeoPracticeLinks().map((item) => ({ ...item, meta: "Pakistan" })),
    },
    {
      title: "Top city searches",
      icon: MapPin,
      links: topCityPracticeLinks().slice(0, 8).map((item) => ({ ...item, meta: "Local SEO page" })),
    },
    {
      title: "Featured lawyer profiles",
      icon: UserRound,
      links: featuredLawyers,
    },
    {
      title: "Legal guides",
      icon: BookOpen,
      links: LEGAL_GUIDES.slice(0, 5).map((guide) => ({
        href: `/legal-guides/${guide.slug}`,
        label: guide.title,
        meta: "General information",
      })),
    },
  ];

  return (
    <section className="border-y border-slate-200 bg-[#f8fafc]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" />
              SEO navigation
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-slate-950">
              Explore WakeelHub by legal need
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Browse useful pages by practice area, city, lawyer profile and guide. WakeelHub uses real profile data and
              avoids fake rankings, fake reviews and inflated lawyer counts.
            </p>
            <Link
              href="/#wakeel-ai-assistant"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Bot className="h-4 w-4" />
              Ask Wakeel AI
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {groups.map(({ title, icon: Icon, links }) => (
              <Card key={title} className="border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold-foreground ring-1 ring-gold/20">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-heading text-base font-semibold text-slate-950">{title}</h3>
                </div>
                <div className="mt-4 space-y-2">
                  {links.length > 0 ? (
                    links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm transition hover:border-gold/50 hover:bg-white"
                      >
                        <span className="font-medium text-slate-800">{link.label}</span>
                        <span className="shrink-0 text-xs text-slate-500">{link.meta}</span>
                      </Link>
                    ))
                  ) : (
                    <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
                      Featured profile links will appear as verified lawyer profiles go live.
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
