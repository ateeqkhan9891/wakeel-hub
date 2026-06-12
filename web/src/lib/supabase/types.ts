// Typed schema surface for the Supabase client.
// This is a hand-written subset covering the tables the app reads/writes
// today. To regenerate the FULL types from the live database, run:
//   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts

export type UserRoleEnum = "client" | "lawyer" | "admin";
export type ConsultationModeEnum = "online" | "in_person" | "phone";
export type BookingStatusEnum =
  | "pending" | "confirmed" | "completed" | "cancelled" | "rejected" | "rescheduled";
export type CaseStatusEnum =
  | "pending" | "active" | "in_progress" | "adjourned" | "won" | "lost" | "closed" | "archived";
export type CasePriorityEnum = "low" | "medium" | "high" | "urgent";
export type HearingStatusEnum = "scheduled" | "completed" | "adjourned" | "cancelled";
export type PaymentStatusEnum =
  | "pending" | "partially_paid" | "paid" | "overdue" | "refunded" | "failed";
export type PaymentMethodEnum =
  | "cash" | "bank_transfer" | "jazzcash" | "easypaisa" | "card" | "other";
export type PaymentTypeEnum =
  | "consultation_fee" | "case_fee" | "drafting_fee"
  | "court_appearance_fee" | "retainer_fee" | "platform_fee" | "other";
export type NotificationTypeEnum =
  | "booking" | "payment" | "case" | "message" | "hearing" | "verification" | "system";
export type VerificationStatusEnum = "not_submitted" | "pending" | "approved" | "rejected";

type WithDefaults<T> = Partial<T>;

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          role: UserRoleEnum;
          avatar_url: string | null;
          city: string | null;
          province: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          email: string;
          phone?: string | null;
          role?: UserRoleEnum;
          avatar_url?: string | null;
          city?: string | null;
          province?: string | null;
          is_active?: boolean;
        };
        Update: WithDefaults<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };

      lawyers: {
        Row: {
          id: string;
          slug: string;
          gender: "male" | "female" | "other" | null;
          bar_council_number: string | null;
          bar_council_name: string | null;
          is_verified: boolean;
          verified_at: string | null;
          is_active: boolean;
          experience_years: number;
          education: string[];
          languages: string[];
          about: string | null;
          headline: string | null;
          response_time: string | null;
          cases_handled: number;
          success_rate: number;
          rating: number;
          review_count: number;
          is_featured: boolean;
          joined_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: { id: string; slug: string } & WithDefaults<Database["public"]["Tables"]["lawyers"]["Row"]>;
        Update: WithDefaults<Database["public"]["Tables"]["lawyers"]["Row"]>;
      };

      lawyer_settings: {
        Row: {
          lawyer_id: string;
          online_consultation_fee: number;
          in_person_consultation_fee: number;
          follow_up_consultation_fee: number | null;
          consultation_duration_minutes: number;
          availability_days: string[];
          availability_hours: string | null;
          accepts_online_consultations: boolean;
          accepts_in_person_consultations: boolean;
          show_phone_publicly: boolean;
          show_email_publicly: boolean;
          notify_bookings: boolean;
          notify_messages: boolean;
          notify_payments: boolean;
          hearing_reminders: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: { lawyer_id: string } & WithDefaults<Database["public"]["Tables"]["lawyer_settings"]["Row"]>;
        Update: WithDefaults<Database["public"]["Tables"]["lawyer_settings"]["Row"]>;
      };

      bookings: {
        Row: {
          id: string;
          client_id: string;
          lawyer_id: string;
          practice_area_id: string | null;
          client_name: string | null;
          client_phone: string | null;
          client_city: string | null;
          lawyer_name: string | null;
          practice_area_name: string | null;
          issue_summary: string | null;
          mode: ConsultationModeEnum;
          scheduled_date: string | null;
          scheduled_time: string | null;
          fee_amount: number;
          payment_status: PaymentStatusEnum;
          status: BookingStatusEnum;
          meeting_link: string | null;
          lawyer_notes: string | null;
          client_notes: string | null;
          cancellation_reason: string | null;
          reschedule_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: { client_id: string; lawyer_id: string } & WithDefaults<Database["public"]["Tables"]["bookings"]["Row"]>;
        Update: WithDefaults<Database["public"]["Tables"]["bookings"]["Row"]>;
      };

      cases: {
        Row: {
          id: string;
          client_id: string;
          lawyer_id: string;
          practice_area_id: string | null;
          title: string;
          case_number: string | null;
          court: string | null;
          opposing_party: string | null;
          status: CaseStatusEnum;
          priority: CasePriorityEnum;
          filing_date: string | null;
          next_hearing_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: { client_id: string; lawyer_id: string; title: string } & WithDefaults<Database["public"]["Tables"]["cases"]["Row"]>;
        Update: WithDefaults<Database["public"]["Tables"]["cases"]["Row"]>;
      };

      payments: {
        Row: {
          id: string;
          reference_number: string;
          client_id: string | null;
          lawyer_id: string | null;
          booking_id: string | null;
          case_id: string | null;
          payment_type: PaymentTypeEnum;
          description: string | null;
          total_amount: number;
          paid_amount: number;
          remaining_amount: number;
          status: PaymentStatusEnum;
          method: PaymentMethodEnum | null;
          payment_date: string | null;
          due_date: string | null;
          notes: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: { total_amount: number } & WithDefaults<Database["public"]["Tables"]["payments"]["Row"]>;
        Update: WithDefaults<Database["public"]["Tables"]["payments"]["Row"]>;
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: NotificationTypeEnum;
          title: string;
          body: string | null;
          related_entity_type: string | null;
          related_entity_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: { user_id: string; title: string } & WithDefaults<Database["public"]["Tables"]["notifications"]["Row"]>;
        Update: WithDefaults<Database["public"]["Tables"]["notifications"]["Row"]>;
      };
    };

    Views: {
      lawyer_directory: {
        Row: {
          id: string;
          slug: string;
          full_name: string;
          city: string | null;
          province: string | null;
          photo_url: string | null;
          gender: "male" | "female" | "other" | null;
          bar_council_number: string | null;
          practice_area_slugs: string[];
          courts: string[];
          experience_years: number;
          education: string[];
          languages: string[];
          about: string | null;
          headline: string | null;
          response_time: string | null;
          cases_handled: number;
          success_rate: number;
          rating: number;
          review_count: number;
          is_featured: boolean;
          joined_date: string;
          online_consultation_fee: number | null;
          in_person_consultation_fee: number | null;
          consultation_duration_minutes: number | null;
          availability_days: string[] | null;
          availability_hours: string | null;
          accepts_online_consultations: boolean | null;
          accepts_in_person_consultations: boolean | null;
          public_email: string | null;
          public_phone: string | null;
        };
      };
    };

    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };

    Enums: {
      user_role: UserRoleEnum;
      consultation_mode: ConsultationModeEnum;
      booking_status: BookingStatusEnum;
      case_status: CaseStatusEnum;
      case_priority: CasePriorityEnum;
      hearing_status: HearingStatusEnum;
      payment_status: PaymentStatusEnum;
      payment_method: PaymentMethodEnum;
      payment_type: PaymentTypeEnum;
      notification_type: NotificationTypeEnum;
      verification_status: VerificationStatusEnum;
    };
  };
}
