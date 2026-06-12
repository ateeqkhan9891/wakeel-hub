// Client-safe case types (no "server-only").

export interface CaseRecord {
  id: string;
  title: string;
  case_number: string | null;
  court_case_number: string | null;
  court: string | null;
  judge_name: string | null;
  case_type: string | null;
  status: string;
  client_id: string | null;
  client_name: string | null;
  client_phone: string | null;
  client_email: string | null;
  client_cnic: string | null;
  client_address: string | null;
  opponent_name: string | null;
  opponent_lawyer: string | null;
  opponent_contact: string | null;
  filing_date: string | null;
  next_hearing_date: string | null;
  total_fee: number;
  advance_received: number;
  remaining_fee: number;
  final_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaseDocument {
  id: string;
  name: string;
  file_type: string | null;
  storage_path: string;
  size_bytes: number;
  created_at: string;
  url: string | null; // signed URL for private viewing
}

export interface CaseUpdateRow {
  id: string;
  title: string;
  updateType: string;
  description: string;
  visibleToClient: boolean;
  createdAt: string;
  attachmentName: string | null;
  attachmentUrl: string | null;
}

export interface CaseHearingRow {
  id: string;
  date: string;
  time: string | null;
  court: string | null;
  judge: string | null;
  purpose: string | null;
  status: string;
  outcome: string | null;
  notes: string | null;
}

export interface CaseInput {
  title: string;
  caseType: string;
  status: string;
  caseNumber: string;
  courtCaseNumber: string;
  court: string;
  judgeName: string;
  nextHearingDate: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientCnic: string;
  clientAddress: string;
  opponentName: string;
  opponentLawyer: string;
  opponentContact: string;
  totalFee: string;
  advanceReceived: string;
  notes: string;
}
