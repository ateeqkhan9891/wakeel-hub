import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/guard";
import { getLawyerBookings } from "@/lib/data/bookings";
import { getLawyerCases } from "@/lib/data/cases";
import { getLawyerEarnings } from "@/lib/data/commission";
import { getMyConversations } from "@/lib/data/messages";
import { getMyNotifications } from "@/lib/data/notifications";
import { PRACTICE_AREAS, type PracticeAreaSlug } from "@/lib/constants";
import type { BookingStatusEnum, CaseStatusEnum, PaymentMethodEnum, PaymentStatusEnum, PaymentTypeEnum, VerificationStatusEnum } from "@/lib/supabase/types";

export type LawyerVerificationStatus = VerificationStatusEnum;
export type LawyerBookingStatus = BookingStatusEnum;
export type LawyerPaymentStatus = PaymentStatusEnum;
export type LawyerPaymentMethod = PaymentMethodEnum;
export type LawyerPaymentType = Exclude<PaymentTypeEnum, "platform_fee">;
export type LawyerNotificationType = "booking" | "payment" | "case" | "hearing" | "message" | "verification" | "system";

export interface LawyerDashboardUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  avatarSeed: string;
  photoUrl?: string;
  headline: string;
  about: string;
  showPhonePublicly: boolean;
  showEmailPublicly: boolean;
  verificationStatus: LawyerVerificationStatus;
  profileCompletion: number;
  fees: {
    onlineConsultation: number;
    inPersonConsultation: number;
    followUpConsultation?: number;
  };
  availability: {
    days: string[];
    hours: string;
  };
  practiceAreas: PracticeAreaSlug[];
  courts: string[];
  languages: string[];
  experienceYears: number;
  barCouncilNumber: string;
}

export interface LawyerBookingRecord {
  id: string;
  lawyerId: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  clientCity?: string;
  issueType: string;
  issueSummary: string;
  date: string;
  time: string;
  mode: "Online" | "In-person";
  fee: number;
  paymentStatus: LawyerPaymentStatus;
  status: LawyerBookingStatus;
  documents: string[];
  notes?: string;
}

export interface LawyerCaseRecord {
  id: string;
  lawyerId: string;
  title: string;
  clientName: string;
  court: string;
  caseNumber: string;
  practiceArea: PracticeAreaSlug;
  nextHearingDate?: string;
  status: CaseStatusEnum;
  lastUpdated: string;
  timeline: { id: string; title: string; date: string; note: string }[];
  hearings: string[];
  documents: string[];
  notes: string[];
  linkedPayments: string[];
}

export interface LawyerMessageThread {
  id: string;
  lawyerId: string;
  clientName: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageAt: string;
  attachments: string[];
}

export interface LawyerPaymentRecord {
  id: string;
  lawyerId: string;
  clientName: string;
  relatedMatter?: string;
  type: LawyerPaymentType;
  totalAmount: number;
  paidAmount: number;
  status: LawyerPaymentStatus;
  method: LawyerPaymentMethod;
  paymentDate?: string;
  dueDate?: string;
  notes?: string;
  referenceNumber?: string;
}

export interface LawyerNotificationRecord {
  id: string;
  lawyerId: string;
  type: LawyerNotificationType;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
}

export interface LawyerDashboardData {
  user: LawyerDashboardUser;
  bookings: LawyerBookingRecord[];
  cases: LawyerCaseRecord[];
  messages: LawyerMessageThread[];
  payments: LawyerPaymentRecord[];
  notifications: LawyerNotificationRecord[];
}

export async function getCurrentLawyerDashboardData(): Promise<LawyerDashboardData> {
  const profile = await requireUser("lawyer");
  const supabase = (await createClient()) as unknown as SupabaseClient;

  const [
    { data: profileRow },
    { data: lawyer },
    { data: settings },
    { data: verification },
    { data: practiceRows },
    { data: courtRows },
    bookings,
    cases,
    conversations,
    earnings,
    notifications,
  ] =
    await Promise.all([
      supabase.from("profiles").select("phone, city").eq("id", profile.id).maybeSingle(),
      supabase
        .from("lawyers")
        .select("headline, about, is_verified, languages, experience_years, bar_council_number")
        .eq("id", profile.id)
        .maybeSingle(),
      supabase
        .from("lawyer_settings")
        .select(
          "online_consultation_fee, in_person_consultation_fee, follow_up_consultation_fee, availability_days, availability_hours, show_phone_publicly, show_email_publicly"
        )
        .eq("lawyer_id", profile.id)
        .maybeSingle(),
      supabase
        .from("verification_requests")
        .select("status")
        .eq("lawyer_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from("lawyer_practice_areas").select("practice_areas(slug)").eq("lawyer_id", profile.id),
      supabase.from("lawyer_courts").select("courts(name)").eq("lawyer_id", profile.id),
      getLawyerBookings(),
      getLawyerCases(),
      getMyConversations(),
      getLawyerEarnings(),
      getMyNotifications(),
    ]);

  const userProfile = (profileRow ?? {}) as Record<string, unknown>;
  const lawyerRow = (lawyer ?? {}) as Record<string, unknown>;
  const settingsRow = (settings ?? {}) as Record<string, unknown>;
  const verificationRow = (verification ?? {}) as Record<string, unknown>;
  const practiceAreas = ((practiceRows as { practice_area_slug: string }[] | null) ?? [])
    .map((row) => {
      const area = (row as unknown as { practice_areas?: { slug?: string } }).practice_areas;
      return area?.slug ?? "";
    })
    .filter(isPracticeAreaSlug);

  return {
    user: {
      id: profile.id,
      name: profile.full_name || "Advocate",
      email: profile.email,
      phone: (userProfile.phone as string | null) ?? "",
      city: (userProfile.city as string | null) ?? "",
      avatarSeed: profile.full_name || profile.email,
      photoUrl: profile.avatar_url ?? undefined,
      headline: (lawyerRow.headline as string | null) ?? "",
      about: (lawyerRow.about as string | null) ?? "",
      showPhonePublicly: settingsRow.show_phone_publicly === true,
      showEmailPublicly: settingsRow.show_email_publicly === true,
      verificationStatus: mapVerificationStatus(lawyerRow, verificationRow),
      profileCompletion: calculateProfileCompletion({ profile, lawyerRow, settingsRow, practiceAreas }),
      fees: {
        onlineConsultation: Number(settingsRow.online_consultation_fee ?? 0),
        inPersonConsultation: Number(settingsRow.in_person_consultation_fee ?? 0),
        followUpConsultation: Number(settingsRow.follow_up_consultation_fee ?? 0),
      },
      availability: {
        days: Array.isArray(settingsRow.availability_days) ? (settingsRow.availability_days as string[]) : [],
        hours: (settingsRow.availability_hours as string | null) ?? "",
      },
      practiceAreas,
      courts: ((courtRows as Record<string, unknown>[] | null) ?? [])
        .map((row) => (row.courts as { name?: string } | undefined)?.name)
        .filter((name): name is string => Boolean(name)),
      languages: Array.isArray(lawyerRow.languages) ? (lawyerRow.languages as string[]) : [],
      experienceYears: Number(lawyerRow.experience_years ?? 0),
      barCouncilNumber: (lawyerRow.bar_council_number as string | null) ?? "",
    },
    bookings: bookings.map((booking) => ({
      id: booking.id,
      lawyerId: booking.lawyer_id,
      clientName: booking.client_name ?? "Client",
      clientPhone: booking.client_phone ?? undefined,
      clientCity: booking.client_city ?? undefined,
      issueType: booking.practice_area_name ?? "Consultation",
      issueSummary: booking.issue_summary ?? "",
      date: booking.scheduled_date ?? "",
      time: booking.scheduled_time ?? "",
      mode: booking.mode === "in_person" ? "In-person" : "Online",
      fee: Number(booking.fee_amount ?? 0),
      paymentStatus: mapPaymentStatus(booking.payment_status),
      status: mapBookingStatus(booking.status),
      documents: [],
    })),
    cases: cases.map((caseFile) => ({
      id: caseFile.id,
      lawyerId: profile.id,
      title: caseFile.title,
      clientName: caseFile.client_name ?? "Client",
      court: caseFile.court ?? "",
      caseNumber: caseFile.case_number ?? caseFile.court_case_number ?? "",
      practiceArea: practiceAreaForCase(caseFile.case_type),
      nextHearingDate: caseFile.next_hearing_date ?? undefined,
      status: mapCaseStatus(caseFile.status),
      lastUpdated: caseFile.updated_at,
      timeline: [],
      hearings: caseFile.next_hearing_date ? [caseFile.next_hearing_date] : [],
      documents: [],
      notes: caseFile.final_notes ? [caseFile.final_notes] : [],
      linkedPayments: [],
    })),
    messages: conversations.map((thread) => ({
      id: thread.id,
      lawyerId: profile.id,
      clientName: thread.otherName,
      unreadCount: thread.unreadCount,
      lastMessage: thread.lastMessage ?? "",
      lastMessageAt: thread.lastMessageAt ?? "",
      attachments: [],
    })),
    payments: (earnings?.rows ?? []).map((row) => ({
      id: row.id,
      lawyerId: row.lawyerId,
      clientName: row.clientName ?? "Client",
      relatedMatter: row.bookingId,
      type: "consultation_fee",
      totalAmount: row.gross,
      paidAmount: row.paymentStatus === "paid" ? row.gross : 0,
      status: mapPaymentStatus(row.paymentStatus),
      method: "card",
      paymentDate: row.paidAt ?? undefined,
      referenceNumber: row.reference,
    })),
    notifications: notifications.map((notification) => ({
      id: notification.id,
      lawyerId: profile.id,
      type: notification.type,
      title: notification.title,
      description: notification.body ?? "",
      createdAt: notification.created_at,
      read: notification.is_read,
    })),
  };
}

function isPracticeAreaSlug(value: string): value is PracticeAreaSlug {
  return PRACTICE_AREAS.some((area) => area.slug === value);
}

function practiceAreaForCase(value: string | null): PracticeAreaSlug {
  return value && isPracticeAreaSlug(value) ? value : "civil-law";
}

function mapVerificationStatus(lawyerRow: Record<string, unknown>, verificationRow: Record<string, unknown>): LawyerVerificationStatus {
  if (lawyerRow.is_verified === true) return "approved";
  if (verificationRow.status === "pending") return "pending";
  if (verificationRow.status === "rejected") return "rejected";
  if (verificationRow.status === "approved") return "approved";
  return "not_submitted";
}

function calculateProfileCompletion(input: {
  profile: { full_name: string; email: string };
  lawyerRow: Record<string, unknown>;
  settingsRow: Record<string, unknown>;
  practiceAreas: PracticeAreaSlug[];
}) {
  const checks = [
    input.profile.full_name,
    input.profile.email,
    input.lawyerRow.headline,
    input.lawyerRow.about,
    input.lawyerRow.bar_council_number,
    Number(input.lawyerRow.experience_years ?? 0) > 0,
    input.practiceAreas.length > 0,
    Number(input.settingsRow.online_consultation_fee ?? 0) > 0,
    Array.isArray(input.settingsRow.availability_days) && input.settingsRow.availability_days.length > 0,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function mapBookingStatus(status: string): LawyerBookingStatus {
  if (["pending", "confirmed", "completed", "cancelled", "rejected", "rescheduled"].includes(status)) {
    return status as LawyerBookingStatus;
  }
  return "pending";
}

function mapPaymentStatus(status: string): LawyerPaymentStatus {
  if (["pending", "partially_paid", "paid", "overdue", "refunded", "failed"].includes(status)) {
    return status as LawyerPaymentStatus;
  }
  return "pending";
}

function mapCaseStatus(status: string): LawyerCaseRecord["status"] {
  if (["pending", "active", "in_progress", "adjourned", "won", "lost", "closed", "archived"].includes(status)) {
    return status as CaseStatusEnum;
  }
  return "active";
}

export function getLawyerDashboardStats(data: LawyerDashboardData) {
  return {
    bookings: data.bookings.length,
    cases: data.cases.length,
    messages: data.messages.reduce((sum, thread) => sum + thread.unreadCount, 0),
    pendingPayments: data.payments
      .filter((payment) => payment.status === "pending" || payment.status === "partially_paid" || payment.status === "overdue")
      .reduce((sum, payment) => sum + Math.max(payment.totalAmount - payment.paidAmount, 0), 0),
    notifications: data.notifications.filter((notification) => !notification.read).length,
  };
}
