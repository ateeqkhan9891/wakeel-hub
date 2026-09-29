import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { Hero, type AdvocateMatch } from "@/components/home/hero";
import { FeaturedLawyers } from "@/components/home/featured-lawyers";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { BenefitsSplit } from "@/components/home/benefits-split";
import { SeoInternalLinks } from "@/components/home/seo-internal-links";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { getVerifiedLawyers } from "@/lib/data/public-lawyers";
import { PRACTICE_AREAS } from "@/lib/constants";
import { formatPKR, initials } from "@/lib/utils";

const PracticeAreas = dynamic(
  () => import("@/components/home/practice-areas").then((m) => m.PracticeAreas),
  { loading: () => null }
);
const HowItWorks = dynamic(
  () => import("@/components/home/how-it-works").then((m) => m.HowItWorks),
  { loading: () => null }
);
const CaseTrackingPreview = dynamic(
  () => import("@/components/home/case-tracking-preview").then((m) => m.CaseTrackingPreview),
  { loading: () => null }
);
const Testimonials = dynamic(
  () => import("@/components/home/testimonials").then((m) => m.Testimonials),
  { loading: () => null }
);

export const metadata: Metadata = {
  title: "Find & Hire Verified Advocates Across Pakistan",
  description:
    "Search verified lawyers in Peshawar, Islamabad, Lahore, Karachi and more. Compare practice areas, book consultations, pay securely online, and track your case from one dashboard.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const lawyers = await getVerifiedLawyers();
  const practiceAreaName = (slug: string) => PRACTICE_AREAS.find((a) => a.slug === slug)?.name ?? slug;
  const advocates: AdvocateMatch[] = lawyers.slice(0, 3).map((l) => ({
    name: l.fullName,
    initials: initials(l.fullName),
    slug: l.slug,
    city: l.city || "Pakistan",
    area: practiceAreaName(l.practiceAreas[0] ?? "legal-practice"),
    court: l.courts[0] ?? "Pakistan courts",
    fee: formatPKR(l.consultationFee),
    availability: l.availability.mode.includes("Video") ? "Online slot open" : "Office consult",
    rating: (l.rating || 0).toFixed(1),
  }));
  const featuredLawyerLinks = lawyers.slice(0, 5).map((lawyer) => ({
    href: `/lawyers/${lawyer.slug}`,
    label: lawyer.fullName,
    meta: lawyer.city || "Pakistan",
  }));

  return (
    <>
      <Hero advocates={advocates} />
      <PracticeAreas />
      <HowItWorks />
      <FeaturedLawyers lawyers={lawyers} />
      <SeoInternalLinks featuredLawyers={featuredLawyerLinks} />
      <WhyChooseUs />
      <CaseTrackingPreview />
      <BenefitsSplit />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}

