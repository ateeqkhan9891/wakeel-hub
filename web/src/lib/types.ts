import type { City, PracticeAreaSlug, Province } from "@/lib/constants";

export type UserRole = "client" | "lawyer" | "admin";

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  city: City;
  createdAt: string;
}

export interface PracticeArea {
  slug: PracticeAreaSlug;
  name: string;
  description: string;
  icon: string;
}

export type AvailabilityDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface Availability {
  days: AvailabilityDay[];
  hours: string;
  mode: ("In-person" | "Video" | "Phone")[];
}

export interface Review {
  id: string;
  clientName: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
  date: string;
  caseType: string;
}

export interface CaseHighlight {
  id: string;
  title: string;
  outcome: string;
  summary: string;
  year: number;
}

export interface Lawyer {
  id: string;
  slug: string;
  fullName: string;
  gender: "Male" | "Female";
  photoUrl: string;
  verified: boolean;
  barCouncilNumber: string;
  city: City;
  province: Province;
  courts: string[];
  experienceYears: number;
  education: string[];
  practiceAreas: PracticeAreaSlug[];
  languages: string[];
  consultationFee: number;
  rating: number;
  reviewCount: number;
  about: string;
  availability: Availability;
  reviews: Review[];
  caseHighlights: CaseHighlight[];
  responseTime: string;
  casesHandled: number;
  successRate: number;
  joinedDate: string;
  featured: boolean;
  // Optional rich fields populated from the live directory (not in mock data).
  professionalTitle?: string;
  officeName?: string;
  officeAddress?: string;
  googleMapsLink?: string;
  experienceEntries?: { firm: string; position: string; startDate: string; endDate: string; description: string }[];
  achievements?: string[];
  socialLinks?: { linkedin?: string; facebook?: string; website?: string };
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  lawyerId: string;
  lawyerName: string;
  clientName: string;
  date: string;
  time: string;
  mode: "In-person" | "Video" | "Phone";
  status: BookingStatus;
  fee: number;
  practiceArea: PracticeAreaSlug;
}

export type CaseStatus = "active" | "in-progress" | "adjourned" | "closed" | "won" | "lost";

export interface HearingDate {
  id: string;
  caseId: string;
  date: string;
  court: string;
  purpose: string;
  status: "upcoming" | "completed" | "adjourned";
}

export interface CaseUpdate {
  id: string;
  caseId: string;
  date: string;
  title: string;
  description: string;
  author: string;
}

export interface CaseFile {
  id: string;
  title: string;
  caseNumber: string;
  client: string;
  lawyer: string;
  practiceArea: PracticeAreaSlug;
  court: string;
  status: CaseStatus;
  filedDate: string;
  nextHearing?: string;
  updates: CaseUpdate[];
  hearings: HearingDate[];
  documents: DocumentFile[];
}

export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
}

export interface Message {
  id: string;
  threadId: string;
  sender: string;
  senderRole: UserRole;
  content: string;
  sentAt: string;
  read: boolean;
}

export interface MessageThread {
  id: string;
  participantName: string;
  participantRole: UserRole;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export type PaymentStatus = "paid" | "pending" | "refunded" | "failed";

export interface Payment {
  id: string;
  invoiceNumber: string;
  description: string;
  party: string;
  amount: number;
  status: PaymentStatus;
  date: string;
  method: string;
}

export type NotificationType = "booking" | "case" | "payment" | "message" | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  date: string;
  read: boolean;
}

export type VerificationStatus = "pending" | "approved" | "rejected";

export interface VerificationRequest {
  id: string;
  lawyerName: string;
  barCouncilNumber: string;
  city: City;
  practiceAreas: PracticeAreaSlug[];
  submittedAt: string;
  status: VerificationStatus;
  documents: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  city: City;
  quote: string;
  rating: number;
  avatarUrl?: string;
}

export interface AdminLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  date: string;
}

export interface ComplaintReport {
  id: string;
  subject: string;
  reportedBy: string;
  against: string;
  category: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  submittedAt: string;
}

