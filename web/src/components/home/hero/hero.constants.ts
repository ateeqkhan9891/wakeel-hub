import {
  CalendarCheck2,
  Layers3,
  Landmark,
  LockKeyhole,
  Search,
  ShieldCheck,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export const POPULAR_SEARCHES = [
  { label: "Family Law", value: "family-law" },
  { label: "Property Law", value: "property-law" },
  { label: "Criminal Law", value: "criminal-law" },
  { label: "Corporate Law", value: "corporate-law" },
] as const;

export const TOP_COURTS: readonly string[] = [
  "Lahore High Court",
  "Sindh High Court",
  "Islamabad High Court",
  "Peshawar High Court",
  "District Court Lahore",
  "District Court Islamabad",
] as const;

export const COVERAGE_CITIES = [
  "Islamabad",
  "Lahore",
  "Karachi",
  "Peshawar",
  "Rawalpindi",
  "Quetta",
] as const;

export const WORKFLOW_STEPS = [
  {
    label: "Search",
    description: "Filter by court, city, fee, and specialty.",
    icon: Search,
  },
  {
    label: "Verify",
    description: "Review Bar Council checked profiles.",
    icon: ShieldCheck,
  },
  {
    label: "Consult",
    description: "Book online or office consultations.",
    icon: CalendarCheck2,
  },
] as const;

export const TRUST_INDICATORS: readonly {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Verified Lawyer Profiles",
    subtitle: "Bar Council Verification",
    icon: ShieldCheck,
  },
  {
    title: "Multiple Practice Areas",
    subtitle: "Family, Property, Criminal & More",
    icon: Layers3,
  },
  {
    title: "Secure Consultations",
    subtitle: "Protected Communication",
    icon: LockKeyhole,
  },
  {
    title: "Nationwide Coverage",
    subtitle: "Major Cities Across Pakistan",
    icon: Landmark,
  },
];

export const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut" },
} as const;