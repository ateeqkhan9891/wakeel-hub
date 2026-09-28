import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { LawyerProfileHeader } from "@/components/lawyer-profile/lawyer-profile-header";
import { LawyerProfileSidebar } from "@/components/lawyer-profile/lawyer-profile-sidebar";
import { LawyerProfileOverview } from "@/components/lawyer-profile/lawyer-profile-overview";
import { LawyerProfileReviews } from "@/components/lawyer-profile/lawyer-profile-reviews";
import { LawyerProfileFaqs } from "@/components/lawyer-profile/lawyer-profile-faqs";
import { LawyerProfileTrust } from "@/components/lawyer-profile/lawyer-profile-trust";
import { LawyerProfileOffice } from "@/components/lawyer-profile/lawyer-profile-office";
import { LawyerProfileLinks } from "@/components/lawyer-profile/lawyer-profile-links";
import { SimilarLawyers } from "@/components/lawyer-profile/similar-lawyers";

import {
  getPublicLawyerBySlug,
  getVerifiedLawyers,
} from "@/lib/data/public-lawyers";

import { PRACTICE_AREAS } from "@/lib/constants";

import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  lawyerLegalServiceJsonLd,
  lawyerPersonJsonLd,
} from "@/lib/seo";

type LawyerPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: LawyerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lawyer = await getPublicLawyerBySlug(slug);

  if (!lawyer) {
    return {
      title: "Lawyer not found | WakeelHub",
    };
  }

  const practiceAreas = lawyer.practiceAreas
    .map(
      (value: string) =>
        PRACTICE_AREAS.find((area) => area.slug === value)?.name ??
        value.replace(/-/g, " "),
    )
    .join(", ");

  return {
    title: `${lawyer.fullName} | ${practiceAreas || "Advocate"} | WakeelHub`,
    description:
      lawyer.about ||
      `View ${lawyer.fullName}'s profile, practice areas, experience, reviews, availability, and consultation details on WakeelHub.`,
    alternates: {
      canonical: absoluteUrl(`/lawyers/${lawyer.slug}`),
    },
  };
}

export default async function LawyerPage({
  params,
}: LawyerPageProps) {
  const { slug } = await params;

  const lawyer = await getPublicLawyerBySlug(slug);

  if (!lawyer) {
    notFound();
  }

  const verifiedLawyers = await getVerifiedLawyers();

  const similarLawyers = verifiedLawyers
    .filter((candidate) => candidate.id !== lawyer.id)
    .filter((candidate) => candidate.city === lawyer.city)
    .slice(0, 3);

  const practiceAreas = lawyer.practiceAreas.map((value: string) => ({
    value,
    label:
      PRACTICE_AREAS.find((area) => area.slug === value)?.name ??
      value.replace(/-/g, " "),
  }));

  const faqs = [
    {
      question: `What practice areas does ${lawyer.fullName} handle?`,
      answer: `${lawyer.fullName} lists ${
        practiceAreas.map((area) => area.label).join(", ") ||
        "legal matters"
      } on this WakeelHub profile.`,
    },
    {
      question: `Where does ${lawyer.fullName} practice?`,
      answer: `${lawyer.fullName} is listed in ${lawyer.city}${
        lawyer.province ? `, ${lawyer.province}` : ""
      }, Pakistan.`,
    },
    {
      question: `What languages does ${lawyer.fullName} speak?`,
      answer: lawyer.languages.length
        ? `${lawyer.fullName} lists ${lawyer.languages.join(", ")} as available languages.`
        : "Language details are not currently listed on this profile.",
    },
    {
      question: "Is this profile legal advice?",
      answer:
        "No. WakeelHub is a lawyer marketplace and does not provide legal advice. Consult a qualified advocate for advice about your specific circumstances.",
    },
  ];

  const breadcrumb = breadcrumbJsonLd([
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Find lawyers",
    path: "/lawyers",
  },
  {
    name: lawyer.fullName,
    path: `/lawyers/${lawyer.slug}`,
  },
]);

  const person = lawyerPersonJsonLd(lawyer);
  const legalService = lawyerLegalServiceJsonLd(lawyer);
  const faq = faqJsonLd(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumb,
            person,
            legalService,
            faq,
          ]),
        }}
      />

      <main className="min-h-screen bg-slate-50">
        <LawyerProfileHeader
          lawyer={lawyer}
          title="Advocate"
          practiceAreas={practiceAreas}
          hasReviews={lawyer.reviews.length > 0}
        />

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div className="min-w-0 space-y-6">
              <LawyerProfileOverview lawyer={lawyer} />

              <LawyerProfileReviews
                lawyer={lawyer}
                matterOptions={practiceAreas}
              />

              <LawyerProfileFaqs lawyer={lawyer} />

              <LawyerProfileOffice lawyer={lawyer} />

              <LawyerProfileLinks lawyer={lawyer} />

              <SimilarLawyers lawyers={similarLawyers} />
            </div>

            <div className="space-y-6">
              <LawyerProfileSidebar lawyer={lawyer} />

              <LawyerProfileTrust lawyer={lawyer} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}