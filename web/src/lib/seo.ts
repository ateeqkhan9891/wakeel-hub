import { CITIES, PRACTICE_AREAS, type City, type PracticeAreaSlug } from "@/lib/constants";
import type { Lawyer } from "@/lib/types";
import { formatPKR } from "@/lib/utils";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wakeelhub.pk";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

export function practiceAreaName(slug: string) {
  return PRACTICE_AREAS.find((area) => area.slug === slug)?.name ?? titleCase(slug.replace(/-/g, " "));
}

export function titleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function citySlug(city: City) {
  return city.toLowerCase();
}

export function findCityFromSlug(slug: string): City | undefined {
  return CITIES.find((city) => city.toLowerCase() === slug.toLowerCase());
}

export function lawyerFeeRange(lawyer: Lawyer) {
  return lawyer.consultationFee > 0 ? formatPKR(lawyer.consultationFee) : "Fee available on profile";
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WakeelHub Pakistan",
    url: siteUrl,
    logo: absoluteUrl("/og-image.png"),
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      areaServed: "PK",
      availableLanguage: ["English", "Urdu"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WakeelHub Pakistan",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/find-lawyers?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function lawyerPersonJsonLd(lawyer: Lawyer) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: lawyer.fullName,
    image: absoluteUrl(lawyer.photoUrl),
    jobTitle: lawyer.professionalTitle ?? "Advocate",
    url: absoluteUrl(`/lawyers/${lawyer.slug}`),
    address: {
      "@type": "PostalAddress",
      addressLocality: lawyer.city,
      addressRegion: lawyer.province,
      addressCountry: "PK",
    },
    knowsLanguage: lawyer.languages,
    worksFor: lawyer.officeName ? { "@type": "Organization", name: lawyer.officeName } : undefined,
    alumniOf: lawyer.education.map((name) => ({ "@type": "EducationalOrganization", name })),
  };
}

export function lawyerLegalServiceJsonLd(lawyer: Lawyer) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: `${lawyer.fullName} - WakeelHub lawyer profile`,
    url: absoluteUrl(`/lawyers/${lawyer.slug}`),
    image: absoluteUrl(lawyer.photoUrl),
    areaServed: [
      {
        "@type": "City",
        name: lawyer.city,
      },
      {
        "@type": "Country",
        name: "Pakistan",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: lawyer.officeAddress,
      addressLocality: lawyer.city,
      addressRegion: lawyer.province,
      addressCountry: "PK",
    },
    priceRange: lawyerFeeRange(lawyer),
    serviceType: lawyer.practiceAreas.map(practiceAreaName),
    knowsLanguage: lawyer.languages,
    aggregateRating:
      lawyer.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: Number(lawyer.rating.toFixed(1)),
            reviewCount: lawyer.reviewCount,
          }
        : undefined,
  };
}

export function practiceSlugFromName(name: string): PracticeAreaSlug | undefined {
  return PRACTICE_AREAS.find((area) => area.name.toLowerCase() === name.toLowerCase())?.slug;
}
