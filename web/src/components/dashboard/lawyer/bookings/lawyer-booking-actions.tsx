import {
  Check,
  CheckCheck,
  Eye,
  FolderPlus,
  Loader2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { OpenChatButton } from "@/components/dashboard/shared/open-chat-button";

import type { BookingRow } from "@/lib/data/booking-types";

type LawyerBookingActionsProps = {
  booking: BookingRow;
  pending: boolean;
  onView: () => void;
  onAccept: () => void;
  onReject: () => void;
  onComplete: () => void;
  onCreateCase: () => void;
};

export function LawyerBookingActions({
  booking,
  pending,
  onView,
  onAccept,
  onReject,
  onComplete,
  onCreateCase,
}: LawyerBookingActionsProps) {
  const showResponse = booking.status === "pending";
  const showComplete = booking.status === "confirmed";
  const showCreateCase =
    booking.status === "confirmed" ||
    booking.status === "completed";

  const showMessage =
    booking.status === "pending" ||
    booking.status === "confirmed" ||
    booking.status === "completed";

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="gap-1.5 text-slate-600 hover:text-slate-950"
        onClick={onView}
      >
        <Eye className="h-4 w-4" />
        View details
      </Button>

      {showMessage && (
        <OpenChatButton
          bookingId={booking.id}
          basePath="/dashboard/lawyer/messages"
          label="Message client"
        />
      )}

      {showResponse && (
        <>
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={onReject}
            className="gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            Decline
          </Button>

          <Button
            size="sm"
            disabled={pending}
            onClick={onAccept}
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Accept
          </Button>
        </>
      )}

      {showComplete && (
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={onComplete}
          className="gap-1.5"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCheck className="h-4 w-4" />
          )}
          Mark completed
        </Button>
      )}

      {showCreateCase && (
        <Button
          size="sm"
          disabled={pending}
          onClick={onCreateCase}
          className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FolderPlus className="h-4 w-4" />
          )}
          Create case from consultation
        </Button>
      )}
    </>
  );
}