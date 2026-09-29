import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SubcategoryExperience } from "@/components/practice-areas/subcategory-experience";
import { getSubcategoryPage, getSubcategoryStaticParams } from "@/lib/practice-area-pages";

interface PageProps {
  params: Promise<{ slug: string; subcategory: string }>;
}

export function generateStaticParams() {
  return getSubcategoryStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, subcategory } = await params;
  const data = getSubcategoryPage(slug, subcategory);
  if (!data) return {};

  return {
    title: data.headline,
    description: data.subheadline,
    alternates: { canonical: `/practice-areas/${data.parentSlug}/${data.slug}` },
    openGraph: {
      title: `${data.headline} | Wakeel360 Pakistan`,
      description: data.subheadline,
    },
  };
}

export default async function PracticeAreaSubcategoryPage({ params }: PageProps) {
  const { slug, subcategory } = await params;
  const data = getSubcategoryPage(slug, subcategory);

  if (!data) notFound();

  return <SubcategoryExperience data={data} />;
}
