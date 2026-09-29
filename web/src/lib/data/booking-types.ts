// Client-safe booking types & constants (no "server-only" import), so client
// components can use them without pulling in the server data layer.
import type { ConsultationModeEnum, BookingStatusEnum, PaymentStatusEnum } from "@/lib/supabase/types";

export interface BookingRow {
  id: string;
  client_id: string;
  lawyer_id: string;
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
  cancellation_reason: string | null;
  created_at: string;
}

export const MODE_LABEL: Record<ConsultationModeEnum, string> = {
  online: "Online",
  in_person: "In-person",
  phone: "Phone",
};

