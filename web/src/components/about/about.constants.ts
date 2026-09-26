import {
  BadgeCheck,
  Bell,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Gavel,
  LockKeyhole,
  MessageSquare,
  Scale,
  Search,
  ShieldCheck,
  UploadCloud,
  UserCheck,
  Users,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export const FLOW_STEPS = [
  {
    icon: Search,
    label: "Search",
    title: "Find the right advocate",
    description:
      "Start with the legal area, city, court, language, fee, and consultation mode that matter to you.",
    clientTitle: "Find lawyers",
    clientRows: [
      "Family Law",
      "Islamabad",
      "Online consultation",
      "Rs. 3,000 max",
    ],
    lawyerTitle: "Public profile",
    lawyerRows: [
      "Verified advocate",
      "Courts listed",
      "Availability shown",
    ],
    status: "Discovery",
  },
  {
    icon: UserCheck,
    label: "Compare",
    title: "Compare advocate profiles",
    description:
      "Review verification, practice areas, courts, fees, availability, reviews, and professional details.",
    clientTitle: "Compare advocates",
    clientRows: [
      "Verified badge",
      "Practice areas",
      "Consultation fee",
      "Languages",
    ],
    lawyerTitle: "Profile strength",
    lawyerRows: [
      "Verification status",
      "Professional details",
      "Public profile",
    ],
    status: "Shortlist",
  },
  {
    icon: CalendarCheck,
    label: "Book",
    title: "Send a consultation request",
    description:
      "Share the essential context, preferred time, and consultation mode before the advocate responds.",
    clientTitle: "Booking request",
    clientRows: [
      "Preferred date",
      "Issue summary",
      "Consultation mode",
      "Request submitted",
    ],
    lawyerTitle: "New request",
    lawyerRows: [
      "Matter preview",
      "Client details",
      "Accept or reschedule",
    ],
    status: "Request sent",
  },
  {
    icon: BadgeCheck,
    label: "Accept",
    title: "Confirm the consultation",
    description:
      "The advocate reviews the request and confirms the consultation while both sides stay informed.",
    clientTitle: "Client notified",
    clientRows: [
      "Request accepted",
      "Time confirmed",
      "Next step visible",
    ],
    lawyerTitle: "Bookings",
    lawyerRows: [
      "Accepted",
      "Client notified",
      "Consultation scheduled",
    ],
    status: "Confirmed",
  },
  {
    icon: MessageSquare,
    label: "Message",
    title: "Keep communication together",
    description:
      "Questions, preparation notes, and document requests stay connected to the legal matter.",
    clientTitle: "Secure messages",
    clientRows: [
      "Document question",
      "Preparation note",
      "Private thread",
    ],
    lawyerTitle: "Matter chat",
    lawyerRows: [
      "Client context",
      "Shared notes",
      "Unread alerts",
    ],
    status: "In progress",
  },
  {
    icon: Briefcase,
    label: "Case",
    title: "Turn the consultation into a case",
    description:
      "Keep the client, court, practice area, documents, hearings, and updates connected in one workspace.",
    clientTitle: "Case opened",
    clientRows: [
      "Case title",
      "Court",
      "Linked documents",
      "Status active",
    ],
    lawyerTitle: "Case workspace",
    lawyerRows: [
      "Client linked",
      "Priority",
      "Next hearing",
    ],
    status: "Case active",
  },
  {
    icon: Gavel,
    label: "Hearing",
    title: "Track important hearings",
    description:
      "Court dates, hearing status, purpose, and upcoming actions become visible from the dashboard.",
    clientTitle: "Upcoming hearing",
    clientRows: [
      "Date",
      "Courtroom",
      "Purpose",
      "Reminder",
    ],
    lawyerTitle: "Hearing schedule",
    lawyerRows: [
      "Scheduled",
      "Adjourned",
      "Completed",
    ],
    status: "Scheduled",
  },
  {
    icon: FileText,
    label: "Updates",
    title: "Keep progress visible",
    description:
      "Case notes, documents, hearing outcomes, and next steps stay organized in one timeline.",
    clientTitle: "Case timeline",
    clientRows: [
      "Draft reviewed",
      "Document uploaded",
      "Next step",
      "Payment record",
    ],
    lawyerTitle: "Update posted",
    lawyerRows: [
      "Client can view",
      "File attached",
      "Status changed",
    ],
    status: "Updated",
  },
  {
    icon: CheckCircle2,
    label: "Resolve",
    title: "Close the matter with a record",
    description:
      "Keep the history of consultations, documents, hearings, messages, payments, and the final outcome.",
    clientTitle: "Matter resolved",
    clientRows: [
      "Closed status",
      "Saved record",
      "Review advocate",
    ],
    lawyerTitle: "Practice history",
    lawyerRows: [
      "Consultation complete",
      "Case archived",
      "Review visible",
    ],
    status: "Resolved",
  },
] as const;

export const PROBLEM_POINTS = [
  {
    number: "01",
    title: "Referral uncertainty",
    text: "Choosing a lawyer can start with who someone knows rather than what the legal matter actually requires.",
  },
  {
    number: "02",
    title: "Unknown fees",
    text: "Clients may not know consultation costs until after they have already invested time in the process.",
  },
  {
    number: "03",
    title: "Scattered updates",
    text: "Messages, documents, hearing dates, and payment information can end up spread across different channels.",
  },
  {
    number: "04",
    title: "No shared workspace",
    text: "Clients and advocates need a common view of the matter as it moves from consultation to resolution.",
  },
] as const;

export const CLIENT_ACTIONS: {
  icon: LucideIcon;
  title: string;
  text: string;
}[] = [
  {
    icon: Search,
    title: "Find verified advocates",
    text: "Search by city, practice area, court, fee, language, and consultation mode.",
  },
  {
    icon: CalendarCheck,
    title: "Book consultations",
    text: "Send a structured request with the relevant context from the beginning.",
  },
  {
    icon: UploadCloud,
    title: "Share documents",
    text: "Keep important files connected to the legal matter instead of scattered across devices.",
  },
  {
    icon: Bell,
    title: "Track hearings",
    text: "See scheduled, completed, and adjourned hearings from one dashboard.",
  },
];

export const ADVOCATE_ACTIONS: {
  icon: LucideIcon;
  title: string;
  text: string;
}[] = [
  {
    icon: ShieldCheck,
    title: "Build a verified profile",
    text: "Present courts, practice areas, fees, availability, and verification information clearly.",
  },
  {
    icon: Briefcase,
    title: "Manage client work",
    text: "Turn requests into consultations, cases, notes, documents, and hearings.",
  },
  {
    icon: MessageSquare,
    title: "Organize communication",
    text: "Keep matter-related conversations together instead of relying on disconnected channels.",
  },
  {
    icon: CircleDollarSign,
    title: "Grow professionally",
    text: "Maintain consultation history, reviews, payments, and profile information in one place.",
  },
];

export const VALUES = [
  {
    icon: BadgeCheck,
    title: "Trust through verification",
    text: "Verification should give clients clearer information about the advocates they discover.",
  },
  {
    icon: Scale,
    title: "Transparency",
    text: "Fees, profile details, availability, and workflow status should be easy to understand.",
  },
  {
    icon: Users,
    title: "Accessibility",
    text: "People should be able to take the first step toward legal help without unnecessary friction.",
  },
  {
    icon: LockKeyhole,
    title: "Professionalism",
    text: "Legal work benefits from calm tools, organized records, and respectful communication.",
  },
] as const;

export const COMPARE_ROWS = [
  {
    traditional: "Ask around for referrals",
    wakeelHub: "Search advocates by your requirements",
  },
  {
    traditional: "Unclear consultation fees",
    wakeelHub: "Compare available fee information",
  },
  {
    traditional: "Paper files and phone updates",
    wakeelHub: "Track documents, hearings, and messages",
  },
  {
    traditional: "No shared progress view",
    wakeelHub: "Keep client and advocate workflows connected",
  },
] as const;

export const fadeUp = {
  initial: {
    opacity: 0,
    y: 20,
  },
  whileInView: {
    opacity: 1,
    y: 0,
  },
  viewport: {
    once: true,
    margin: "-80px",
  },
  transition: {
    duration: 0.5,
    ease: "easeOut",
  },
} as const;

export const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

export const itemFadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
  },
} as const;