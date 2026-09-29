export const CITIES = [
  "Peshawar",
  "Islamabad",
  "Rawalpindi",
  "Lahore",
  "Karachi",
  "Quetta",
  "Multan",
  "Faisalabad",
  "Abbottabad",
  "Swat",
] as const;

export type City = (typeof CITIES)[number];

export const PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
] as const;

export type Province = (typeof PROVINCES)[number];

export const CITY_PROVINCE: Record<City, Province> = {
  Peshawar: "Khyber Pakhtunkhwa",
  Islamabad: "Islamabad Capital Territory",
  Rawalpindi: "Punjab",
  Lahore: "Punjab",
  Karachi: "Sindh",
  Quetta: "Balochistan",
  Multan: "Punjab",
  Faisalabad: "Punjab",
  Abbottabad: "Khyber Pakhtunkhwa",
  Swat: "Khyber Pakhtunkhwa",
};

export const COURTS_BY_CITY: Record<City, string[]> = {
  Peshawar: ["Peshawar High Court", "District & Sessions Court Peshawar", "Banking Court Peshawar"],
  Islamabad: ["Islamabad High Court", "District Court Islamabad", "Federal Service Tribunal"],
  Rawalpindi: ["District & Sessions Court Rawalpindi", "Anti-Terrorism Court Rawalpindi"],
  Lahore: ["Lahore High Court", "District Court Lahore", "Banking Court Lahore", "Labour Court Lahore"],
  Karachi: ["Sindh High Court", "District & Sessions Court Karachi (South)", "Banking Court Karachi"],
  Quetta: ["Balochistan High Court", "District & Sessions Court Quetta"],
  Multan: ["Lahore High Court - Multan Bench", "District Court Multan"],
  Faisalabad: ["District & Sessions Court Faisalabad", "Labour Court Faisalabad"],
  Abbottabad: ["Peshawar High Court - Abbottabad Bench", "District Court Abbottabad"],
  Swat: ["District & Sessions Court Swat"],
};

export const PRACTICE_AREAS = [
  { slug: "family-law", name: "Family Law", icon: "Users", description: "Divorce, custody, khula, maintenance & inheritance disputes." },
  { slug: "criminal-law", name: "Criminal Law", icon: "Gavel", description: "Bail, FIR quashing, criminal trials & appeals." },
  { slug: "property-law", name: "Property Law", icon: "Building2", description: "Land disputes, possession, transfers & title verification." },
  { slug: "civil-law", name: "Civil Law", icon: "Scale", description: "Contracts, recovery suits, damages & civil litigation." },
  { slug: "corporate-law", name: "Corporate Law", icon: "Briefcase", description: "Company incorporation, compliance & commercial contracts." },
  { slug: "tax-law", name: "Tax Law", icon: "Receipt", description: "Income tax, sales tax, FBR notices & appeals." },
  { slug: "immigration-law", name: "Immigration Law", icon: "Plane", description: "Visas, citizenship, deportation & overseas matters." },
  { slug: "banking-law", name: "Banking Law", icon: "Landmark", description: "Loan recovery, banking court litigation & finance disputes." },
  { slug: "labour-law", name: "Labour Law", icon: "HardHat", description: "Wrongful termination, wages & industrial relations." },
  { slug: "constitutional-law", name: "Constitutional Law", icon: "ScrollText", description: "Writ petitions, fundamental rights & public interest litigation." },
  { slug: "cyber-crime", name: "Cyber Crime", icon: "ShieldAlert", description: "FIA complaints, online harassment & data crime cases." },
  { slug: "consumer-law", name: "Consumer Law", icon: "ShoppingCart", description: "Consumer protection court claims & service disputes." },
] as const;

export type PracticeAreaSlug = (typeof PRACTICE_AREAS)[number]["slug"];

export const LANGUAGES = ["Urdu", "English", "Punjabi", "Pashto", "Sindhi", "Balochi", "Saraiki"] as const;

export const GENDERS = ["Male", "Female"] as const;

export const PROFESSIONAL_TITLES = [
  "Advocate",
  "Senior Advocate",
  "Legal Consultant",
  "Corporate Lawyer",
  "Barrister",
] as const;

export const COURT_TYPES = [
  "Family Courts",
  "Civil Courts",
  "Sessions Courts",
  "District Courts",
  "Banking Courts",
  "Consumer Courts",
  "Labour Courts",
  "Anti-Corruption Courts",
  "High Courts",
  "Supreme Court",
] as const;

export const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const TIME_SLOTS = [
  "9 AM - 1 PM",
  "2 PM - 6 PM",
  "6 PM - 9 PM",
] as const;

export const CASE_TYPES = [
  "Family",
  "Civil",
  "Criminal",
  "Property",
  "Corporate",
  "Tax",
  "Labour",
  "Other",
] as const;

export const CASE_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "in_progress", label: "In Progress" },
  { value: "adjourned", label: "Adjourned" },
  { value: "closed", label: "Closed" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "archived", label: "Archived" },
] as const;

export function caseStatusLabel(value: string) {
  return CASE_STATUSES.find((s) => s.value === value)?.label ?? value.replace(/_/g, " ");
}

export const UPDATE_TYPES = [
  { value: "general", label: "General Update" },
  { value: "hearing", label: "Hearing" },
  { value: "document", label: "Document" },
  { value: "court_order", label: "Court Order" },
  { value: "milestone", label: "Milestone" },
  { value: "payment", label: "Payment" },
  { value: "message", label: "Message" },
  { value: "settlement", label: "Settlement" },
  { value: "judgment", label: "Judgment" },
] as const;

export function updateTypeLabel(value: string) {
  return UPDATE_TYPES.find((t) => t.value === value)?.label ?? value.replace(/_/g, " ");
}

// Maps a case status to an approximate progress % for client progress bars.
export const STATUS_PROGRESS: Record<string, number> = {
  pending: 30,
  active: 45,
  in_progress: 60,
  adjourned: 55,
  won: 100,
  closed: 100,
  lost: 100,
  archived: 100,
};

export const EXPERIENCE_RANGES = [
  { label: "0-3 years", min: 0, max: 3 },
  { label: "4-7 years", min: 4, max: 7 },
  { label: "8-15 years", min: 8, max: 15 },
  { label: "15+ years", min: 16, max: 60 },
] as const;

export const FEE_RANGES = [
  { label: "Under Rs. 2,000", min: 0, max: 2000 },
  { label: "Rs. 2,000 - 5,000", min: 2000, max: 5000 },
  { label: "Rs. 5,000 - 10,000", min: 5000, max: 10000 },
  { label: "Rs. 10,000+", min: 10000, max: 1000000 },
] as const;

export const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" },
  { value: "experience", label: "Most Experienced" },
  { value: "fee-low", label: "Lowest Fee" },
  { value: "fee-high", label: "Highest Fee" },
  { value: "newest", label: "Newest" },
] as const;

export const PRICING_PLANS = [
  {
    name: "Client - Free",
    price: "Rs. 0",
    period: "forever",
    audience: "client" as const,
    description: "Search, compare and book trusted advocates across Pakistan at no cost.",
    features: [
      "Unlimited lawyer search & filters",
      "Book consultations online",
      "Secure online payments",
      "Case tracking dashboard",
      "Document uploads & messaging",
    ],
    cta: "Create free account",
    highlighted: false,
  },
  {
    name: "Lawyer - Professional",
    price: "Rs. 3,500",
    period: "/month",
    audience: "lawyer" as const,
    description: "Build your verified profile, manage clients and grow your practice online.",
    features: [
      "Verified advocate badge",
      "Featured profile placement",
      "Client & case management tools",
      "Booking & fee management",
      "Analytics dashboard",
      "Priority support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Law Firm - Enterprise",
    price: "Custom",
    period: "pricing",
    audience: "firm" as const,
    description: "Multi-advocate firms managing large caseloads with dedicated support.",
    features: [
      "Multiple advocate seats",
      "Team case & document management",
      "Custom firm branding",
      "Dedicated account manager",
      "Priority verification",
    ],
    cta: "Talk to sales",
    highlighted: false,
  },
];

export const FAQS = [
  {
    question: "How does Wakeel360 verify advocates?",
    answer:
      "Every lawyer on Wakeel360 submits their Bar Council enrollment number and credentials, which our admin team manually cross-checks against Bar Council records before granting the verified advocate badge.",
  },
  {
    question: "Is it safe to pay for consultations online?",
    answer:
      "Yes. Payments are processed through secure, encrypted gateways. Funds for a consultation are only released to the advocate once the session is confirmed, and you receive a digital invoice for every transaction.",
  },
  {
    question: "Can I track my case after hiring a lawyer?",
    answer:
      "Absolutely. Once you hire an advocate through Wakeel360, you get access to a case dashboard showing status updates, hearing dates, shared documents, and direct messaging with your lawyer.",
  },
  {
    question: "What cities and courts are covered?",
    answer:
      "Wakeel360 currently covers advocates practicing in Peshawar, Islamabad, Rawalpindi, Lahore, Karachi, Quetta, Multan, Faisalabad, Abbottabad and Swat - across High Courts, District Courts and specialized tribunals.",
  },
  {
    question: "How do I register as a lawyer on the platform?",
    answer:
      "Click \"Register as Lawyer\", complete your professional profile including your Bar Council number, education, practice areas and fee structure, then submit it for verification. Our team typically reviews submissions within 2-3 business days.",
  },
  {
    question: "What happens if I'm not satisfied with a consultation?",
    answer:
      "You can leave a review describing your experience, and our support team can help mediate. Repeated complaints against an advocate trigger an internal review by our admin team.",
  },
];

