import {
  CalendarDays,
  Clock3,
  Globe2,
  Scale,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { BookingActions } from "@/components/lawyer-profile/booking-actions";

import { formatPKR } from "@/lib/utils";

import type { Lawyer } from "@/lib/types";

type LawyerProfileSidebarProps = {
  lawyer: Lawyer;
};

export function LawyerProfileSidebar({
  lawyer,
}: LawyerProfileSidebarProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Consultation fee
          </p>

          <p className="mt-1 font-heading text-2xl font-semibold tracking-tight text-slate-950">
            {formatPKR(lawyer.consultationFee)}
          </p>
        </div>

        <Badge className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-50">
          Available
        </Badge>
      </div>

      <Separator className="my-5 bg-slate-100" />

      <dl className="space-y-3.5 text-sm">
        <InfoRow
          icon={Clock3}
          label="Response"
          value={lawyer.responseTime}
        />

        <InfoRow
          icon={CalendarDays}
          label="Hours"
          value={lawyer.availability.hours || "By appointment"}
        />

        <InfoRow
          icon={Globe2}
          label="Mode"
          value={
            lawyer.availability.mode.length
              ? lawyer.availability.mode.join(", ")
              : "By appointment"
          }
        />

        <InfoRow
          icon={Scale}
          label="Enrollment"
          value={lawyer.barCouncilNumber}
        />
      </dl>

      <div className="mt-5">
        <BookingActions
          lawyerId={lawyer.id}
          lawyerName={lawyer.fullName}
          onlineFee={lawyer.consultationFee}
          inPersonFee={lawyer.consultationFee}
          acceptsOnline={lawyer.availability.mode.includes("Video")}
          acceptsInPerson={lawyer.availability.mode.includes("In-person")}
          practiceAreas={lawyer.practiceAreas}
        />
      </div>

      <p className="mt-4 text-[11px] leading-5 text-slate-500">
        Booking requests are sent to the advocate first. Payment is handled
        after acceptance.
      </p>
    </aside>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="inline-flex items-center gap-2 text-slate-500">
        <Icon className="h-3.5 w-3.5 text-blue-500" />
        {label}
      </dt>

      <dd className="max-w-[180px] text-right text-xs font-semibold text-slate-900">
        {value}
      </dd>
    </div>
  );
}