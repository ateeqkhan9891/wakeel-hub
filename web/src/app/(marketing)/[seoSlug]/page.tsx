import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, ChevronRight, Gavel, Scale, ShieldCheck } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { LawyerCard } from "@/components/shared/lawyer-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CITIES, COURTS_BY_CITY, type City, type PracticeAreaSlug } from "@/lib/constants";
import { getVerifiedLawyers } from "@/lib/data/public-lawyers";
import {
  SEO_PRACTICE_PAGES,
  cityPracticeSlug,
  getSeoCityPracticePages,
  parseSeoSlug,
  relatedPracticeLinks,
} from "@/lib/seo-content";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd, practiceAreaName } from "@/lib/seo";
import type { Lawyer } from "@/lib/types";

type PageParams = { seoSlug: string };

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams(): PageParams[] {
  return [
    ...SEO_PRACTICE_PAGES.map((page) => ({ seoSlug: page.slug })),
    ...getSeoCityPracticePages().map((page) => ({ seoSlug: page.slug })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { seoSlug } = await params;
  const parsed = parseSeoSlug(seoSlug);
  if (!parsed) return {};

  const path = `/${seoSlug}`;
  const title =
    parsed.type === "practice"
      ? `${parsed.page.title} | Wakeel360`
      : `${parsed.page.shortName} in ${parsed.city} | Wakeel360`;
  const description =
    parsed.type === "practice"
      ? parsed.page.description
      : `Find ${parsed.page.shortName.toLowerCase()} in ${parsed.city}, Pakistan. Compare verified lawyer profiles, practice areas, courts, fees and consultation options on Wakeel360.`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      type: "website",
      siteName: "Wakeel360 Pakistan",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default async function SeoLandingPage({ params }: { params: Promise<PageParams> }) {
  const { seoSlug } = await params;
  const parsed = parseSeoSlug(seoSlug);
  if (!parsed) notFound();

  const lawyers = await getVerifiedLawyers();

  if (parsed.type === "practice") {
    const matches = matchingLawyers(lawyers, parsed.page.practiceAreaSlug);
    return (
      <PracticeSeoPage
        page={parsed.page}
        matches={matches}
        allLawyers={lawyers}
      />
    );
  }

  const matches = matchingLawyers(lawyers, parsed.page.practiceAreaSlug, parsed.city);
  return (
    <CityPracticeSeoPage
      city={parsed.city}
      page={parsed.page}
      matches={matches}
      allLawyers={lawyers}
    />
  );
}

function matchingLawyers(lawyers: Lawyer[], practiceAreaSlug: PracticeAreaSlug, city?: City) {
  return lawyers
    .filter((lawyer) => lawyer.practiceAreas.includes(practiceAreaSlug))
    .filter((lawyer) => (city ? lawyer.city.toLowerCase() === city.toLowerCase() : true));
}

function PracticeSeoPage({
  page,
  matches,
  allLawyers,
}: {
  page: (typeof SEO_PRACTICE_PAGES)[number];
  matches: Lawyer[];
  allLawyers: Lawyer[];
}) {
  const path = `/${page.slug}`;
  const cityLinks = CITIES.slice(0, 10).map((city) => ({
    href: `/${cityPracticeSlug(page, city)}`,
    label: `${page.shortName} in ${city}`,
  }));
  const relatedLawyers = matches.length ? matches.slice(0, 6) : allLawyers.slice(0, 6);
  const schema = [
    legalServiceSchema(page.title, path, page.description, "Pakistan", practiceAreaName(page.practiceAreaSlug)),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: page.title, path },
    ]),
    faqJsonLd(page.faqs),
  ];

  return (
    <main className="bg-[#f8fafc] text-foreground">
      <JsonLd data={schema} />
      <SeoHero
        eyebrow="Practice area guide"
        title={`${page.title}`}
        description={page.intro}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: page.title },
        ]}
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <div className="space-y-10">
          <Card className="border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-2xl font-semibold text-slate-950">How Wakeel360 helps with {page.shortName.toLowerCase()}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Wakeel360 does not provide legal advice or promise outcomes. It helps you compare verified lawyer
              profiles, practice areas, city, courts, languages, consultation fees and availability before you speak
              with a qualified advocate.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {page.services.map((service) => (
                <Badge key={service} variant="secondary" className="rounded-full px-3 py-1 font-normal">
                  {service}
                </Badge>
              ))}
            </div>
          </Card>

          <LawyerResults
            title={`${page.shortName} on Wakeel360`}
            description="These are real public lawyer profiles from the Wakeel360 directory. Availability, fees and profile details are controlled from each lawyer profile."
            matches={relatedLawyers}
            emptyHref={`/find-lawyers?practiceArea=${page.practiceAreaSlug}`}
          />

          <FaqBlock faqs={page.faqs} />
        </div>

        <aside className="space-y-6">
          <LinkCard
            title={`${page.shortName} by city`}
            links={cityLinks}
          />
          <LinkCard
            title="Related practice areas"
            links={SEO_PRACTICE_PAGES.filter((item) => item.slug !== page.slug).map((item) => ({
              href: `/${item.slug}`,
              label: item.title,
            }))}
          />
          <TrustCard />
        </aside>
      </section>
    </main>
  );
}

function CityPracticeSeoPage({
  page,
  city,
  matches,
  allLawyers,
}: {
  page: (typeof SEO_PRACTICE_PAGES)[number];
  city: City;
  matches: Lawyer[];
  allLawyers: Lawyer[];
}) {
  const path = `/${cityPracticeSlug(page, city)}`;
  const courts = COURTS_BY_CITY[city] ?? [];
  const nearbyCities = CITIES.filter((item) => item !== city).slice(0, 6);
  const relatedLawyers = matches.length ? matches.slice(0, 6) : matchingLawyers(allLawyers, page.practiceAreaSlug).slice(0, 6);
  const localFaqs = [
    {
      question: `How do I find ${page.shortName.toLowerCase()} in ${city}?`,
      answer: `Compare verified profiles by practice area, courts, languages, consultation fee and availability. You can then book a consultation with a lawyer whose profile fits your matter.`,
    },
    {
      question: `Are ${city} lawyer profiles verified on Wakeel360?`,
      answer: "Wakeel360 verifies lawyer profiles through Bar Council credential checks before a verified profile appears publicly.",
    },
    {
      question: `Can Wakeel360 advise me on a ${page.shortName.toLowerCase()} matter?`,
      answer: "No. Wakeel360 is a marketplace and preparation tool. Legal advice should come from a qualified advocate after reviewing your facts.",
    },
  ];
  const schema = [
    legalServiceSchema(`${page.shortName} in ${city}`, path, page.description, city, practiceAreaName(page.practiceAreaSlug)),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: page.title, path: `/${page.slug}` },
      { name: `${page.shortName} in ${city}`, path },
    ]),
    faqJsonLd(localFaqs),
  ];

  return (
    <main className="bg-[#f8fafc] text-foreground">
      <JsonLd data={schema} />
      <SeoHero
        eyebrow={`${city}, Pakistan`}
        title={`${page.shortName} in ${city}`}
        description={`${page.intro} This local page focuses on ${city} so you can compare relevant lawyer profiles, courts and nearby city options without keyword-stuffed listings.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: page.title, href: `/${page.slug}` },
          { label: `${page.shortName} in ${city}` },
        ]}
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <div className="space-y-10">
          <Card className="border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-2xl font-semibold text-slate-950">Local legal help in {city}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Legal process can vary by court, documents and urgency. Use this page to start with local profiles and
              then ask a qualified advocate about the next step for your facts.
            </p>
            {courts.length > 0 && (
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {courts.map((court) => (
                  <div key={court} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    <Gavel className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    {court}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <LawyerResults
            title={`${page.shortName} listed for ${city}`}
            description="If no exact local match is available yet, Wakeel360 shows relevant nationwide profiles and keeps the directory honest."
            matches={relatedLawyers}
            emptyHref={`/find-lawyers?practiceArea=${page.practiceAreaSlug}&city=${encodeURIComponent(city)}`}
          />

          <FaqBlock faqs={localFaqs} />
        </div>

        <aside className="space-y-6">
          <LinkCard
            title={`${page.shortName} nearby`}
            links={nearbyCities.map((nearby) => ({
              href: `/${cityPracticeSlug(page, nearby)}`,
              label: `${page.shortName} in ${nearby}`,
            }))}
          />
          <LinkCard
            title={`Other lawyers in ${city}`}
            links={SEO_PRACTICE_PAGES.filter((item) => item.key !== page.key).map((item) => ({
              href: `/${cityPracticeSlug(item, city)}`,
              label: `${item.shortName} in ${city}`,
            }))}
          />
          <LinkCard title="Related practice areas" links={relatedPracticeLinks(page.practiceAreaSlug)} />
          <TrustCard />
        </aside>
      </section>
    </main>
  );
}

function SeoHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
}: {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs: { label: string; href?: string }[];
}) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.label} className="inline-flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-slate-950">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-slate-950">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <div className="mt-7 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <Scale className="h-3.5 w-3.5 text-gold" />
            {eyebrow}
          </span>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">{description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild className="bg-slate-950 text-white hover:bg-slate-800">
              <Link href="/find-lawyers">
                Search lawyer directory
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/legal-guides">Read legal guides</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LawyerResults({
  title,
  description,
  matches,
  emptyHref,
}: {
  title: string;
  description: string;
  matches: Lawyer[];
  emptyHref: string;
}) {
  return (
    <section>
      <SectionHeading align="left" title={title} description={description} />
      {matches.length > 0 ? (
        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
          {matches.map((lawyer) => (
            <LawyerCard key={lawyer.id} lawyer={lawyer} />
          ))}
        </div>
      ) : (
        <Card className="mt-7 border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="font-heading text-lg font-semibold text-slate-950">No exact public profiles listed yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            Wakeel360 avoids fake listings. Browse the live directory to compare currently available verified profiles.
          </p>
          <Button asChild className="mt-5 bg-slate-950 text-white hover:bg-slate-800">
            <Link href={emptyHref}>Browse live directory</Link>
          </Button>
        </Card>
      )}
    </section>
  );
}

function LinkCard({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <Card className="border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-heading text-base font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Badge variant="outline" className="rounded-full bg-slate-50 font-normal hover:border-gold/50 hover:text-gold-foreground">
              {link.label}
            </Badge>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function FaqBlock({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-2xl font-semibold text-slate-950">Frequently asked questions</h2>
      <div className="mt-5 divide-y divide-slate-100">
        {faqs.map((faq) => (
          <div key={faq.question} className="py-4 first:pt-0 last:pb-0">
            <h3 className="font-heading text-base font-semibold text-slate-950">{faq.question}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrustCard() {
  return (
    <Card className="border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          <ShieldCheck className="h-5 w-5 text-gold" />
        </span>
        <h2 className="font-heading text-base font-semibold">Trust-first marketplace</h2>
      </div>
      <div className="mt-4 space-y-3 text-sm leading-6 text-white/70">
        <p className="flex gap-2"><BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-gold" /> No fake reviews or staged lawyer cards.</p>
        <p className="flex gap-2"><BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-gold" /> Public pages use live verified profile data.</p>
        <p className="flex gap-2"><BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-gold" /> Wakeel360 is not a law firm and does not provide legal advice.</p>
      </div>
    </Card>
  );
}

function legalServiceSchema(name: string, path: string, description: string, areaServed: string, serviceType: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name,
    url: absoluteUrl(path),
    description,
    areaServed: {
      "@type": areaServed === "Pakistan" ? "Country" : "City",
      name: areaServed,
    },
    provider: {
      "@type": "Organization",
      name: "Wakeel360 Pakistan",
      url: absoluteUrl("/"),
    },
    serviceType,
  };
}
