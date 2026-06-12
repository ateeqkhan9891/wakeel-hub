import { PRACTICE_AREAS, type PracticeAreaSlug } from "@/lib/constants";

export interface PracticeStat {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}

export interface LegalService {
  slug: string;
  title: string;
  summary: string;
}

export interface CoverItem {
  title: string;
  body: string;
}

export interface FeaturedSpecialist {
  name: string;
  initials: string;
  city: string;
  court: string;
  specialty: string;
  experience: string;
  fee: number;
  rating: number;
  availability: string;
}

export interface ConsultationActivity {
  title: string;
  city: string;
  mode: string;
  rating: number;
  status: string;
}

export interface PracticeAreaPageData {
  slug: PracticeAreaSlug;
  name: string;
  headline: string;
  subheadline: string;
  stats: PracticeStat[];
  services: LegalService[];
  covers: CoverItem[];
  featuredLawyers: FeaturedSpecialist[];
  recentConsultations: ConsultationActivity[];
  faqs: CoverItem[];
}

export interface SubcategoryPageData {
  parentSlug: PracticeAreaSlug;
  slug: string;
  title: string;
  headline: string;
  subheadline: string;
  stats: PracticeStat[];
  guideSteps: CoverItem[];
  documents: string[];
  specialists: FeaturedSpecialist[];
  faqs: CoverItem[];
}

const FAMILY_LAW: PracticeAreaPageData = {
  slug: "family-law",
  name: "Family Law",
  headline: "Family Law Lawyers Across Pakistan",
  subheadline:
    "Get help with divorce, khula, child custody, maintenance, inheritance disputes, and family settlements from verified family law specialists.",
  stats: [
  ],
  services: [
    {
      slug: "divorce",
      title: "Divorce",
      summary: "Legal guidance for divorce notices, settlement terms, documentation, and family court proceedings.",
    },
    {
      slug: "khula",
      title: "Khula",
      summary: "Support for khula petitions, reconciliation notices, dower disputes, and decree follow-up.",
    },
    {
      slug: "child-custody",
      title: "Child Custody",
      summary: "Find advocates for custody disputes, guardianship petitions, visitation rights, and welfare hearings.",
    },
    {
      slug: "maintenance",
      title: "Maintenance",
      summary: "Advice on monthly maintenance claims, arrears, execution petitions, and evidence preparation.",
    },
    {
      slug: "inheritance",
      title: "Inheritance",
      summary: "Guidance on succession certificates, legal heirs, family settlements, and property distribution.",
    },
    {
      slug: "family-settlements",
      title: "Family Settlements",
      summary: "Draft and review private settlement agreements, consent terms, and family mediation outcomes.",
    },
  ],
  covers: [
    {
      title: "Divorce",
      body: "Understand notices, reconciliation proceedings, settlement documentation, and court timelines before filing.",
    },
    {
      title: "Khula",
      body: "Prepare the petition, supporting documents, dower position, and hearing expectations with a verified advocate.",
    },
    {
      title: "Custody",
      body: "Get guidance on guardianship petitions, child welfare factors, visitation arrangements, and family court evidence.",
    },
    {
      title: "Maintenance",
      body: "Estimate claims, organize proof of expenses, respond to notices, and plan execution if payments are delayed.",
    },
    {
      title: "Inheritance",
      body: "Map heirs, succession requirements, property records, and settlement routes before the dispute escalates.",
    },
  ],
  featuredLawyers: [],
  recentConsultations: [],
  faqs: [
    {
      title: "How much does a family lawyer cost?",
      body: "Most initial consultations on WakeelHub range from Rs. 2,000 to Rs. 5,000 depending on city, seniority, and consultation mode.",
    },
    {
      title: "How long does a custody case take?",
      body: "Timelines vary by court and facts, but a lawyer can usually explain the expected petition, evidence, interim custody, and visitation stages in the first consultation.",
    },
    {
      title: "Can I file khula online?",
      body: "You can consult online and prepare documents digitally, but court filing and hearings depend on the relevant family court process.",
    },
    {
      title: "What documents are required?",
      body: "Common documents include CNIC, nikah nama, child birth certificate where relevant, prior orders, notices, and any proof of expenses or communication.",
    },
  ],
};

const CHILD_CUSTODY: SubcategoryPageData = {
  parentSlug: "family-law",
  slug: "child-custody",
  title: "Child Custody",
  headline: "Child Custody Lawyers Across Pakistan",
  subheadline:
    "Find experienced advocates for child custody disputes, guardianship matters, visitation rights, and family court proceedings.",
  stats: [],
  guideSteps: [
    { title: "Prepare Documents", body: "Collect CNIC, child birth certificate, marriage record, school records, and any previous court orders." },
    { title: "Consult Lawyer", body: "Review facts, welfare concerns, possible interim relief, and the correct family court jurisdiction." },
    { title: "File Petition", body: "Your advocate prepares the guardianship or custody petition with supporting affidavits and annexures." },
    { title: "Court Hearings", body: "Attend hearings, respond to notices, present evidence, and address visitation or interim custody issues." },
    { title: "Judgment", body: "Receive the court order and understand compliance, appeal, or modification options if circumstances change." },
  ],
  documents: ["CNIC", "Child Birth Certificate", "Marriage Certificate", "Previous Court Orders", "School or Medical Records", "Proof of Expenses"],
  specialists: [],
  faqs: [
    {
      title: "What does the court consider in custody cases?",
      body: "Family courts generally focus on the welfare of the child, including age, care history, education, safety, and the circumstances of each parent.",
    },
    {
      title: "Can grandparents file a guardianship case?",
      body: "In some circumstances, close relatives may seek guardianship or visitation relief. A lawyer can assess standing and documentation.",
    },
    {
      title: "Is online consultation enough before filing?",
      body: "Online consultation is useful for initial strategy and document review. Filing and hearings still follow the relevant family court process.",
    },
  ],
};

const SUBCATEGORY_OVERRIDES: Record<string, SubcategoryPageData> = {
  "family-law/child-custody": CHILD_CUSTODY,
};

function fallbackPracticeArea(slug: PracticeAreaSlug): PracticeAreaPageData {
  const area = PRACTICE_AREAS.find((item) => item.slug === slug)!;
  const serviceBase = area.name.replace(" Law", "");
  return {
    slug,
    name: area.name,
    headline: `${area.name} Lawyers Across Pakistan`,
    subheadline: `${area.description} Explore common legal services, understand the process, and connect with verified advocates only when you are ready to compare lawyers.`,
    stats: [],
    services: [
      {
        slug: `${slug}-consultation`,
        title: `${serviceBase} Consultation`,
        summary: `Discuss your matter with a verified ${area.name.toLowerCase()} advocate before entering the lawyer directory.`,
      },
      {
        slug: `${slug}-documents`,
        title: "Document Review",
        summary: "Review notices, contracts, petitions, records, and supporting documents with a specialist.",
      },
      {
        slug: `${slug}-court-representation`,
        title: "Court Representation",
        summary: "Understand filing routes, hearing stages, evidence, and court representation options.",
      },
    ],
    covers: [
      { title: "Initial Consultation", body: "Understand your legal position, urgency, documents, expected cost, and next procedural step." },
      { title: "Document Strategy", body: "Organize the proof, notices, records, and filings needed before formal proceedings begin." },
      { title: "Court Process", body: "Learn the likely court or tribunal path, hearings, timeline, and practical risks." },
    ],
    featuredLawyers: [],
    recentConsultations: [],
    faqs: [
      { title: `How do I choose a ${area.name.toLowerCase()} lawyer?`, body: "Compare verification, court experience, relevant services, consultation fee, response time, and client ratings." },
      { title: "Do I see lawyer listings immediately?", body: "No. WakeelHub first helps you understand the service and subcategory, then shows listings after you choose to view all lawyers." },
      { title: "Can I book online?", body: "Yes. Once you enter the lawyer directory or profile, you can request online or office consultations where available." },
    ],
  };
}

export function getPracticeAreaPage(slug: string): PracticeAreaPageData | null {
  const area = PRACTICE_AREAS.find((item) => item.slug === slug);
  if (!area) return null;
  if (slug === FAMILY_LAW.slug) return FAMILY_LAW;
  return fallbackPracticeArea(slug as PracticeAreaSlug);
}

export function getSubcategoryPage(parentSlug: string, subcategorySlug: string): SubcategoryPageData | null {
  return SUBCATEGORY_OVERRIDES[`${parentSlug}/${subcategorySlug}`] ?? null;
}

export function getPracticeAreaSlugs() {
  return PRACTICE_AREAS.map((area) => ({ slug: area.slug }));
}

export function getSubcategoryStaticParams() {
  return Object.values(SUBCATEGORY_OVERRIDES).map((item) => ({
    slug: item.parentSlug,
    subcategory: item.slug,
  }));
}
