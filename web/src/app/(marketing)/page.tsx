import type { Metadata } from "next";
import { Hero, type AdvocateMatch } from "@/components/home/hero";
import type { FeaturedAdvocateProfile } from "@/components/home/featured-advocate-spotlight";
import { getVerifiedLawyers } from "@/lib/data/public-lawyers";
import { PRACTICE_AREAS } from "@/lib/constants";
import { formatPKR, initials } from "@/lib/utils";
import { PracticeAreas } from "@/components/home/practice-areas";
import { HowItWorks } from "@/components/home/how-it-works";
import { FeaturedLawyers } from "@/components/home/featured-lawyers";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { CaseTrackingPreview } from "@/components/home/case-tracking-preview";
import { BenefitsSplit } from "@/components/home/benefits-split";
import { Testimonials } from "@/components/home/testimonials";
import { SeoInternalLinks } from "@/components/home/seo-internal-links";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";

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
  const recommendedLawyer = lawyers.find((lawyer) => lawyer.featured && lawyer.verified) ?? lawyers.find((lawyer) => lawyer.verified) ?? null;
  const featuredAdvocate: FeaturedAdvocateProfile | null = recommendedLawyer
    ? {
        name: recommendedLawyer.fullName,
        slug: recommendedLawyer.slug,
        title: recommendedLawyer.professionalTitle || "Senior Advocate High Court",
        city: recommendedLawyer.city || "Pakistan",
        photoUrl: recommendedLawyer.photoUrl,
        barCouncilNumber: recommendedLawyer.barCouncilNumber,
        experienceYears: recommendedLawyer.experienceYears,
        casesHandled: recommendedLawyer.casesHandled,
        successRate: recommendedLawyer.successRate,
        responseTime: recommendedLawyer.responseTime,
        consultationFee: recommendedLawyer.consultationFee,
        rating: recommendedLawyer.rating || 0,
        expertise: recommendedLawyer.practiceAreas.map(practiceAreaName),
      }
    : null;
  const featuredLawyerLinks = lawyers.slice(0, 5).map((lawyer) => ({
    href: `/lawyers/${lawyer.slug}`,
    label: lawyer.fullName,
    meta: lawyer.city || "Pakistan",
  }));

  return (
    <>
      <Hero advocates={advocates} featuredAdvocate={featuredAdvocate} />
      <PracticeAreas />
      <HowItWorks />
      <FeaturedLawyers />
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
