import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Users, Gavel, Building2, Scale, Briefcase, Receipt,
  Plane, Landmark, HardHat, ScrollText, ShieldAlert, ShoppingCart,
  MapPin, ShieldCheck, Star,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LawyerCard } from "@/components/shared/lawyer-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { CITIES, CITY_PROVINCE, COURTS_BY_CITY, PRACTICE_AREAS } from "@/lib/constants";
import { getVerifiedLawyers } from "@/lib/data/public-lawyers";
import type { City, PracticeAreaSlug } from "@/lib/constants";

const ICONS: Record<string, LucideIcon> = {
  Users, Gavel, Building2, Scale, Briefcase, Receipt,
  Plane, Landmark, HardHat, ScrollText, ShieldAlert, ShoppingCart,
};

interface PageParams {
  slug: string;
  city: string;
}

function findPracticeArea(slug: string) {
  return PRACTICE_AREAS.find((p) => p.slug === slug);
}

function findCity(slug: string): City | undefined {
  return (CITIES as readonly string[]).find((c) => c.toLowerCase() === slug.toLowerCase()) as City | undefined;
}

export async function generateStaticParams() {
  const params: PageParams[] = [];
  for (const area of PRACTICE_AREAS) {
    for (const city of CITIES) {
      params.push({ slug: area.slug, city: city.toLowerCase() });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug, city } = await params;
  const area = findPracticeArea(slug);
  const cityName = findCity(city);

  if (!area || !cityName) return {};

  const title = `${area.name} Lawyers in ${cityName} - Verified Advocates`;
  const description = `Find and book verified ${area.name.toLowerCase()} advocates in ${cityName}, Pakistan. Compare experience, fees, ratings and reviews, then book a consultation online with Wakeel360.`;

  return {
    title,
    description,
    alternates: { canonical: `/lawyers/${area.slug}/${city.toLowerCase()}` },
    openGraph: { title, description },
  };
}

export default async function PracticeAreaCityPage({ params }: { params: Promise<PageParams> }) {
  const { slug, city } = await params;
  const area = findPracticeArea(slug);
  const cityName = findCity(city);

  if (!area || !cityName) notFound();

  const Icon = ICONS[area.icon] ?? Scale;
  const province = CITY_PROVINCE[cityName];
  const courts = COURTS_BY_CITY[cityName] ?? [];
  const lawyers = await getVerifiedLawyers();

  const matches = lawyers.filter(
    (lawyer) =>
      lawyer.city.toLowerCase() === cityName.toLowerCase() &&
      lawyer.practiceAreas.includes(area.slug as PracticeAreaSlug)
  );
  const verifiedCount = matches.length;
  const ratedMatches = matches.filter((lawyer) => lawyer.rating > 0);
  const avgRating =
    ratedMatches.length > 0 ? ratedMatches.reduce((sum, lawyer) => sum + lawyer.rating, 0) / ratedMatches.length : 0;

  const otherCities = CITIES.filter((c) => c !== cityName).slice(0, 6);
  const otherAreas = PRACTICE_AREAS.filter((p) => p.slug !== area.slug).slice(0, 6);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary/60 via-background to-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60%_50%_at_50%_0%,oklch(0.78_0.13_85_/_0.10),transparent)]"
        />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/find-lawyers" className="hover:text-foreground">Find Lawyers</Link>
            <span>/</span>
            <span className="text-foreground">{area.name} in {cityName}</span>
          </nav>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                <Icon className="h-3.5 w-3.5 text-gold" />
                {area.name} - {cityName}, {province}
              </span>
              <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Best {area.name} lawyers in {cityName}
              </h1>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {area.description} Browse verified {area.name.toLowerCase()} advocates practicing in {cityName} -
                compare profile details, consultation fees, ratings and client reviews, then book a consultation online
                in minutes.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href={`/find-lawyers?practiceArea=${area.slug}&city=${encodeURIComponent(cityName)}`}>
                    Search &amp; filter all advocates
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/register/client">Create a free account</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <Card className="border-border/80 p-4 text-center">
                <p className="font-heading text-2xl font-semibold text-foreground">{matches.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">Real profiles found</p>
              </Card>
              <Card className="border-border/80 p-4 text-center">
                <p className="font-heading text-2xl font-semibold text-foreground">{verifiedCount}</p>
                <p className="mt-1 text-xs text-muted-foreground">Verified profiles</p>
              </Card>
              <Card className="border-border/80 p-4 text-center">
                <p className="flex items-center justify-center gap-1 font-heading text-2xl font-semibold text-foreground">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  {avgRating > 0 ? avgRating.toFixed(1) : "-"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Average rating</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading
              align="left"
              eyebrow={`${matches.length} found`}
              title={`${area.name} advocates practicing in ${cityName}`}
              description={`These are verified advocate profiles currently available on Wakeel360 for ${cityName}.`}
            />

            {matches.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {matches.map((lawyer) => (
                  <LawyerCard key={lawyer.id} lawyer={lawyer} />
                ))}
              </div>
            ) : (
              <Card className="mt-8 border-border/80 p-8 text-center">
                <p className="text-sm font-medium text-foreground">
                  No {area.name.toLowerCase()} advocates are listed in {cityName} just yet.
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Try browsing all {area.name.toLowerCase()} advocates across Pakistan, or explore other practice
                  areas available in {cityName}.
                </p>
                <Button asChild className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href={`/find-lawyers?practiceArea=${area.slug}`}>Browse {area.name} advocates nationwide</Link>
                </Button>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-border/80 p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-4.5 w-4.5" />
                </span>
                <p className="text-sm font-semibold text-foreground">Courts in {cityName}</p>
              </div>
              <ul className="mt-4 space-y-2.5">
                {courts.map((court) => (
                  <li key={court} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Gavel className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                    {court}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="border-border/80 p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </span>
                <p className="text-sm font-semibold text-foreground">Why book through Wakeel360</p>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm leading-6 text-muted-foreground">
                <li>Every advocate badge is checked against Bar Council records.</li>
                <li>Transparent consultation fees - no surprises.</li>
                <li>Secure online payments and digital invoices.</li>
                <li>Track your case, hearings and documents in one dashboard.</li>
              </ul>
            </Card>

            <Card className="border-border/80 p-6">
              <p className="text-sm font-semibold text-foreground">{area.name} in other cities</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {otherCities.map((c) => (
                  <Link key={c} href={`/lawyers/${area.slug}/${c.toLowerCase()}`}>
                    <Badge variant="outline" className="rounded-full font-normal hover:border-gold/40 hover:text-gold-foreground">
                      {c}
                    </Badge>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="border-border/80 p-6">
              <p className="text-sm font-semibold text-foreground">Other practice areas in {cityName}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {otherAreas.map((p) => (
                  <Link key={p.slug} href={`/lawyers/${p.slug}/${cityName.toLowerCase()}`}>
                    <Badge variant="outline" className="rounded-full font-normal hover:border-gold/40 hover:text-gold-foreground">
                      {p.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
