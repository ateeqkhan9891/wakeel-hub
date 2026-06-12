import type { MetadataRoute } from "next";
import { CITIES, PRACTICE_AREAS } from "@/lib/constants";
import { getVerifiedLawyers } from "@/lib/data/public-lawyers";
import { getPracticeAreaSlugs, getSubcategoryStaticParams } from "@/lib/practice-area-pages";
import { LEGAL_GUIDES, SEO_PRACTICE_PAGES, getSeoCityPracticePages } from "@/lib/seo-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wakeelhub.pk";

const STATIC_ROUTES = [
  "",
  "/find-lawyers",
  "/pricing",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/login",
  "/register/client",
  "/register/lawyer",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const lawyers = await getVerifiedLawyers();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const lawyerEntries: MetadataRoute.Sitemap = lawyers.map((lawyer) => ({
    url: `${siteUrl}/lawyers/${lawyer.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const practiceAreaEntries: MetadataRoute.Sitemap = getPracticeAreaSlugs().map(({ slug }) => ({
    url: `${siteUrl}/practice-areas/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const subcategoryEntries: MetadataRoute.Sitemap = getSubcategoryStaticParams().map(({ slug, subcategory }) => ({
    url: `${siteUrl}/practice-areas/${slug}/${subcategory}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  const seoLandingEntries: MetadataRoute.Sitemap = PRACTICE_AREAS.flatMap((area) =>
    CITIES.map((city) => ({
      url: `${siteUrl}/lawyers/${area.slug}/${city.toLowerCase()}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }))
  );

  const cleanPracticeEntries: MetadataRoute.Sitemap = SEO_PRACTICE_PAGES.map((page) => ({
    url: `${siteUrl}/${page.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const cleanCityPracticeEntries: MetadataRoute.Sitemap = getSeoCityPracticePages().map((page) => ({
    url: `${siteUrl}/${page.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const legalGuideEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/legal-guides`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...LEGAL_GUIDES.map((guide) => ({
      url: `${siteUrl}/legal-guides/${guide.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];

  return [
    ...staticEntries,
    ...practiceAreaEntries,
    ...subcategoryEntries,
    ...cleanPracticeEntries,
    ...cleanCityPracticeEntries,
    ...legalGuideEntries,
    ...lawyerEntries,
    ...seoLandingEntries,
  ];
}
