import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PracticeAreaExperience } from "@/components/practice-areas/practice-area-experience";
import { getPracticeAreaPage, getPracticeAreaSlugs } from "@/lib/practice-area-pages";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getPracticeAreaSlugs();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getPracticeAreaPage(slug);
  if (!data) return {};

  return {
    title: `${data.name} Lawyers Across Pakistan`,
    description: data.subheadline,
    alternates: { canonical: `/practice-areas/${data.slug}` },
    openGraph: {
      title: `${data.name} Lawyers Across Pakistan | WakeelHub Pakistan`,
      description: data.subheadline,
    },
  };
}

export default async function PracticeAreaPage({ params }: PageProps) {
  const { slug } = await params;
  const data = getPracticeAreaPage(slug);

  if (!data) notFound();

  return <PracticeAreaExperience data={data} />;
}
