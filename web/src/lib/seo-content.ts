import { CITIES, PRACTICE_AREAS, type City, type PracticeAreaSlug } from "@/lib/constants";
import { citySlug } from "@/lib/seo";

export type SeoPracticeKey = "family" | "property" | "criminal" | "corporate" | "divorce" | "tax";

export type SeoPracticePage = {
  key: SeoPracticeKey;
  slug: string;
  title: string;
  shortName: string;
  practiceAreaSlug: PracticeAreaSlug;
  description: string;
  intro: string;
  services: string[];
  faqs: { question: string; answer: string }[];
};

export const SEO_PRACTICE_PAGES: readonly SeoPracticePage[] = [
  {
    key: "family",
    slug: "family-lawyers-pakistan",
    title: "Family Lawyers in Pakistan",
    shortName: "Family Lawyers",
    practiceAreaSlug: "family-law",
    description: "Find family lawyers in Pakistan for divorce, khula, child custody, maintenance, guardianship and related family court matters.",
    intro: "Family matters can be sensitive and time-bound. Wakeel360 helps you compare verified lawyer profiles, courts, languages and consultation fees before speaking with an advocate.",
    services: ["Divorce and khula", "Child custody", "Maintenance", "Guardianship", "Family court petitions"],
    faqs: [
      { question: "How do I choose a family lawyer in Pakistan?", answer: "Compare the lawyer's city, courts, family law experience, languages, consultation fee and availability before booking a consultation." },
      { question: "Can Wakeel360 give family law advice?", answer: "No. Wakeel360 is a marketplace. A qualified advocate can review your facts and guide you after consultation." },
      { question: "What should I prepare before a family law consultation?", answer: "Bring CNIC details, marriage documents if relevant, notices, court papers, and a short timeline of events." },
    ],
  },
  {
    key: "property",
    slug: "property-lawyers-pakistan",
    title: "Property Lawyers in Pakistan",
    shortName: "Property Lawyers",
    practiceAreaSlug: "property-law",
    description: "Find property lawyers in Pakistan for land disputes, possession issues, transfer matters, tenancy disputes and title verification.",
    intro: "Property disputes often depend on documents, possession history and local court practice. Use Wakeel360 to shortlist verified profiles before booking a consultation.",
    services: ["Land disputes", "Possession matters", "Title verification", "Transfer documents", "Tenancy disputes"],
    faqs: [
      { question: "When should I contact a property lawyer?", answer: "Consider speaking with a lawyer when a dispute involves possession, title documents, notices, inheritance property, tenancy, or transfer issues." },
      { question: "Can a lawyer verify property documents?", answer: "A property lawyer can review documents and explain legal risks, but verification may also require revenue records and official searches." },
      { question: "What documents help in a property consultation?", answer: "Bring sale deeds, mutation records, allotment letters, lease documents, notices, tax records and any court papers." },
    ],
  },
  {
    key: "criminal",
    slug: "criminal-lawyers-pakistan",
    title: "Criminal Lawyers in Pakistan",
    shortName: "Criminal Lawyers",
    practiceAreaSlug: "criminal-law",
    description: "Find criminal lawyers in Pakistan for bail, FIR matters, criminal trials, appeals and police-related legal issues.",
    intro: "Criminal matters can move quickly. Wakeel360 helps you find verified advocates by city, court, language and consultation mode so you can act with better preparation.",
    services: ["Bail", "FIR matters", "Criminal trial", "Appeals", "Police complaints"],
    faqs: [
      { question: "How quickly should I speak with a criminal lawyer?", answer: "If arrest, bail, FIR or court dates are involved, speak with a qualified advocate as soon as possible." },
      { question: "Does Wakeel360 handle emergency legal representation?", answer: "Wakeel360 lists lawyer profiles and consultation options. Availability depends on the individual advocate." },
      { question: "What information should I share with a criminal lawyer?", answer: "Share FIR details, police station, court notices, dates, names of parties and any available documents." },
    ],
  },
  {
    key: "corporate",
    slug: "corporate-lawyers-pakistan",
    title: "Corporate Lawyers in Pakistan",
    shortName: "Corporate Lawyers",
    practiceAreaSlug: "corporate-law",
    description: "Find corporate lawyers in Pakistan for company matters, contracts, compliance, business disputes and commercial documentation.",
    intro: "Business legal work needs clarity, documentation and timely review. Wakeel360 helps companies and founders compare verified corporate lawyer profiles.",
    services: ["Company registration", "Commercial contracts", "Compliance", "Shareholder matters", "Business disputes"],
    faqs: [
      { question: "What does a corporate lawyer help with?", answer: "Corporate lawyers may assist with company documents, contracts, compliance, notices, business disputes and transaction review." },
      { question: "Can startups use Wakeel360?", answer: "Yes. Founders can compare corporate lawyer profiles and book a consultation for business legal needs." },
      { question: "What should a business prepare before consultation?", answer: "Prepare company documents, contracts, notices, correspondence and a short explanation of the business issue." },
    ],
  },
  {
    key: "divorce",
    slug: "divorce-lawyers-pakistan",
    title: "Divorce Lawyers in Pakistan",
    shortName: "Divorce Lawyers",
    practiceAreaSlug: "family-law",
    description: "Find divorce lawyers in Pakistan for divorce, khula, maintenance, custody and family court preparation.",
    intro: "Divorce and khula matters require careful document preparation and court guidance. Wakeel360 helps you compare family lawyer profiles without overstating outcomes.",
    services: ["Divorce", "Khula", "Maintenance", "Custody issues", "Family court process"],
    faqs: [
      { question: "Is divorce handled by family lawyers in Pakistan?", answer: "Yes. Divorce, khula, maintenance and custody issues are commonly handled by family law advocates." },
      { question: "Can Wakeel360 predict the result of a divorce case?", answer: "No. Outcomes depend on facts, documents, court process and legal advice from a qualified advocate." },
      { question: "What should I ask a divorce lawyer?", answer: "Ask about process, required documents, expected court steps, fee structure, timelines and communication method." },
    ],
  },
  {
    key: "tax",
    slug: "tax-lawyers-pakistan",
    title: "Tax Lawyers in Pakistan",
    shortName: "Tax Lawyers",
    practiceAreaSlug: "tax-law",
    description: "Find tax lawyers in Pakistan for FBR notices, income tax, sales tax, appeals, compliance and tax dispute support.",
    intro: "Tax matters often involve notices, deadlines and document-heavy replies. Wakeel360 helps you compare verified tax lawyer profiles before booking a consultation.",
    services: ["FBR notices", "Income tax", "Sales tax", "Tax appeals", "Compliance review"],
    faqs: [
      { question: "When should I contact a tax lawyer?", answer: "Consider speaking with a tax lawyer when you receive an FBR notice, need to file an appeal, or face a tax dispute." },
      { question: "Can Wakeel360 file tax documents for me?", answer: "Wakeel360 is a marketplace. The advocate or tax professional you hire can explain whether they provide filing support." },
      { question: "What should I prepare for a tax consultation?", answer: "Prepare notices, tax returns, NTN details, business records, bank statements and relevant correspondence." },
    ],
  },
] as const;

export function seoPracticeBySlug(slug: string) {
  return SEO_PRACTICE_PAGES.find((page) => page.slug === slug);
}

export function seoPracticeByKey(key: string) {
  return SEO_PRACTICE_PAGES.find((page) => page.key === key);
}

export function cityPracticeSlug(page: SeoPracticePage, city: City) {
  return `${page.key}-lawyers-${citySlug(city)}`;
}

export function getSeoCityPracticePages() {
  return SEO_PRACTICE_PAGES.flatMap((page) =>
    CITIES.map((city) => ({
      page,
      city,
      slug: cityPracticeSlug(page, city),
    }))
  );
}

export function parseSeoSlug(slug: string) {
  const practicePage = seoPracticeBySlug(slug);
  if (practicePage) return { type: "practice" as const, page: practicePage };

  const cityPage = getSeoCityPracticePages().find((item) => item.slug === slug);
  if (cityPage) return { type: "city-practice" as const, ...cityPage };

  return null;
}

export const LEGAL_GUIDES = [
  {
    slug: "how-to-find-lawyer-in-pakistan",
    title: "How to Find a Lawyer in Pakistan",
    description: "A practical checklist for comparing lawyer profiles, courts, practice areas, consultation fees and communication before booking a consultation.",
    sections: [
      { heading: "Start with the legal issue", body: "Write down what happened, who is involved, where it happened, and whether any court date or notice exists. This helps you choose the right practice area." },
      { heading: "Compare profile details", body: "Look at city, courts, practice areas, languages, consultation fee and availability. A profile should help you decide whether to request a consultation." },
      { heading: "Prepare documents before booking", body: "Collect notices, contracts, CNIC details, receipts, messages, court papers or any other record connected to your matter." },
    ],
  },
  {
    slug: "family-court-process-pakistan",
    title: "Family Court Process in Pakistan",
    description: "A general overview of family court preparation for matters such as divorce, khula, custody and maintenance in Pakistan.",
    sections: [
      { heading: "Family matters vary by facts", body: "The process depends on the type of matter, documents, parties, jurisdiction and court schedule. A lawyer can explain the steps for your situation." },
      { heading: "Common preparation", body: "People usually prepare identity documents, marriage records where relevant, notices, prior orders and a written timeline." },
      { heading: "Court communication", body: "Keep hearing dates, orders and lawyer communication organized so you can track progress clearly." },
    ],
  },
  {
    slug: "property-dispute-lawyer-pakistan",
    title: "Property Dispute Lawyer in Pakistan",
    description: "Learn what to prepare before speaking with a lawyer about land, possession, tenancy, transfer or title disputes in Pakistan.",
    sections: [
      { heading: "Documents matter", body: "Property disputes often depend on ownership documents, possession history, revenue records, lease terms, notices and correspondence." },
      { heading: "Local context matters", body: "City, court and local property records can affect the next step. Choose a lawyer familiar with the relevant area and court." },
      { heading: "Ask focused questions", body: "Ask what documents are missing, what immediate risks exist, and what court or non-court options may be available." },
    ],
  },
  {
    slug: "criminal-vs-civil-case-pakistan",
    title: "Criminal vs Civil Case in Pakistan",
    description: "A plain-English distinction between criminal and civil cases in Pakistan, written for general information before speaking with a lawyer.",
    sections: [
      { heading: "Civil cases", body: "Civil matters usually involve private disputes such as recovery, damages, contracts, property or family-related claims." },
      { heading: "Criminal cases", body: "Criminal matters usually involve allegations of offences, police process, FIRs, bail, trial or appeals." },
      { heading: "Some facts overlap", body: "One dispute can sometimes involve both civil and criminal questions. A qualified advocate can classify the issue after reviewing facts." },
    ],
  },
  {
    slug: "lawyer-fees-in-pakistan",
    title: "Lawyer Fees in Pakistan",
    description: "General information about consultation fees, case fees and what to clarify before hiring a lawyer in Pakistan.",
    sections: [
      { heading: "Ask what the fee covers", body: "Clarify whether the fee covers consultation, drafting, court appearance, filing support, follow-up calls or the full matter." },
      { heading: "Complexity affects fees", body: "Fees can vary by city, court, urgency, documents, hearings, lawyer experience and the type of legal work required." },
      { heading: "Keep payment records", body: "Use written fee terms, invoices or receipts where possible so both client and lawyer have a clear record." },
    ],
  },
] as const;

export function legalGuideBySlug(slug: string) {
  return LEGAL_GUIDES.find((guide) => guide.slug === slug);
}

export function topSeoPracticeLinks() {
  return SEO_PRACTICE_PAGES.map((page) => ({
    href: `/${page.slug}`,
    label: page.title,
  }));
}

export function topCityPracticeLinks() {
  const priorityCities: City[] = ["Lahore", "Karachi", "Islamabad", "Peshawar", "Rawalpindi", "Quetta"];
  const priorityPractices = SEO_PRACTICE_PAGES.slice(0, 3);
  return priorityPractices.flatMap((page) =>
    priorityCities.slice(0, 4).map((city) => ({
      href: `/${cityPracticeSlug(page, city)}`,
      label: `${page.shortName} in ${city}`,
    }))
  );
}

export function practiceAreaBySlug(slug: PracticeAreaSlug) {
  return PRACTICE_AREAS.find((area) => area.slug === slug);
}

export function relatedPracticeLinks(current: PracticeAreaSlug) {
  return SEO_PRACTICE_PAGES.filter((page) => page.practiceAreaSlug !== current)
    .slice(0, 6)
    .map((page) => ({
      href: `/${page.slug}`,
      label: page.title,
    }));
}

