// Client-safe shared types for the full lawyer profile (no "server-only"),
// used by both the server loader/action and the client editor.
import type { LawyerVerificationStatus } from "@/lib/lawyer-dashboard-data";

export interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
}

export interface ExperienceEntry {
  firm: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface PublicationEntry {
  title: string;
  url: string;
}

export interface SocialLinks {
  linkedin: string;
  facebook: string;
  website: string;
}

/** Everything the lawyer can edit, plus read-only system fields. */
export interface LawyerFullProfile {
  id: string;
  slug: string; // public directory slug (read-only)

  // Basic information
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  gender: string; // "" | "Male" | "Female"
  dateOfBirth: string; // yyyy-mm-dd | ""
  city: string;
  officeAddress: string;
  experienceYears: string;
  barEnrollmentYear: string;
  barCouncilNumber: string;
  licenseNumber: string;

  // Professional
  professionalTitle: string;
  about: string;
  practiceAreas: string[];
  courts: string[]; // court types
  education: EducationEntry[];
  experience: ExperienceEntry[];
  languages: string[];

  // Consultation & availability
  onlineConsultationFee: string;
  officeConsultationFee: string;
  phoneConsultationFee: string;
  freeInitialConsultation: boolean;
  availabilityDays: string[];
  availabilitySlots: string[];
  availabilityHours: string;

  // Office details
  officeName: string;
  googleMapsLink: string;

  // Achievements / publications / social
  achievements: string[];
  publications: PublicationEntry[];
  social: SocialLinks;

  // Visibility
  showPhonePublicly: boolean;
  showEmailPublicly: boolean;

  // System (read-only)
  verificationStatus: LawyerVerificationStatus;
  rating: number;
  reviewCount: number;
  totalConsultations: number;
  responseRate: number;
  isFeatured: boolean;
  isVerified: boolean;
}

/** The subset the editor submits to the save action. */
export type LawyerProfileUpdate = Omit<
  LawyerFullProfile,
  "id" | "slug" | "email" | "verificationStatus" | "rating" | "reviewCount" | "totalConsultations" | "responseRate" | "isFeatured" | "isVerified"
>;

