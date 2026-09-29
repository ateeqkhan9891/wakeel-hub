import type { Metadata } from "next";
import { FindLawyersClient } from "@/components/find-lawyers/find-lawyers-client";
import { getVerifiedLawyers } from "@/lib/data/public-lawyers";
import { CITIES, PROVINCES, LANGUAGES, GENDERS, PRACTICE_AREAS } from "@/lib/constants";
import type { Filters } from "@/components/find-lawyers/types";

export const metadata: Metadata = {
  title: "Find Verified Lawyers in Pakistan",
  description:
    "Search and filter verified advocates across Pakistan by city, province, practice area, experience, consultation fee, language, gender, rating and availability.",
  alternates: { canonical: "/find-lawyers" },
};

function toArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function FindLawyersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const cities = toArray(params.city).filter((c) => (CITIES as readonly string[]).includes(c));
  const provinces = toArray(params.province).filter((p) => (PROVINCES as readonly string[]).includes(p));
  const practiceAreas = toArray(params.practiceArea).filter((p) => PRACTICE_AREAS.some((pa) => pa.slug === p));
  const languages = toArray(params.language).filter((l) => (LANGUAGES as readonly string[]).includes(l));
  const genders = toArray(params.gender).filter((g) => (GENDERS as readonly string[]).includes(g));

  const initialFilters: Partial<Filters> = {
    query: typeof params.q === "string" ? params.q : "",
    cities,
    provinces,
    practiceAreas,
    languages,
    genders,
    sortBy: typeof params.sort === "string" ? params.sort : "rating",
  };

  const lawyers = await getVerifiedLawyers();

  return <FindLawyersClient initialFilters={initialFilters} lawyers={lawyers} />;
}

