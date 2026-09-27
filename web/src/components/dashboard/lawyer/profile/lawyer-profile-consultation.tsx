"use client";

import {
  CalendarDays,
  Globe,
  MapPin,
  Phone,
  Pencil,
  Building2,
  Mail,
  Clock3,
  BadgeCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { LawyerFullProfile } from "@/lib/data/lawyer-profile-types";

import {
  Fee,
  Row,
  Section,
  SocialLink,
} from "./lawyer-profile-shared";

export function LawyerProfileConsultation({
  profile,
  onEdit,
}: {
  profile: LawyerFullProfile;
  onEdit: () => void;
}) {
  return (
    <div className="space-y-3">
      <Section
        icon={CalendarDays}
        title="Consultation & availability"
        action={<EditButton onClick={onEdit} />}
      >
        <div className="space-y-5">
          <div className="grid gap-2.5 sm:grid-cols-3">
            <Fee
              label="Online"
              value={profile.onlineConsultationFee}
            />
            <Fee
              label="Office"
              value={profile.officeConsultationFee}
            />
            <Fee
              label="Phone"
              value={profile.phoneConsultationFee}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <ScheduleGroup
              icon={CalendarDays}
              label="Available days"
              items={profile.availabilityDays}
            />

            <ScheduleGroup
              icon={Clock3}
              label="Time slots"
              items={profile.availabilitySlots}
            />
          </div>

          {profile.availabilityHours && (
            <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Clock3 className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                  Consultation hours
                </p>
                <p className="mt-0.5 text-sm font-medium text-slate-700">
                  {profile.availabilityHours}
                </p>
              </div>
            </div>
          )}

          {profile.freeInitialConsultation && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <BadgeCheck className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  Free initial consultation
                </p>
                <p className="mt-0.5 text-xs text-emerald-700/80">
                  Clients can request an initial consultation at no charge.
                </p>
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section
        icon={Building2}
        title="Office & contact"
        action={<EditButton onClick={onEdit} />}
      >
        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <Row
            icon={Building2}
            label="Office"
            value={profile.officeName}
          />

          <Row
            icon={MapPin}
            label="Address"
            value={profile.officeAddress}
          />

          <Row
            icon={Globe}
            label="Google Maps"
            value={
              profile.googleMapsLink
                ? "Open location"
                : undefined
            }
            href={profile.googleMapsLink || undefined}
          />

          <Row
            icon={Phone}
            label="Phone"
            value={
              profile.showPhonePublicly
                ? profile.phone
                : undefined
            }
          />

          <Row
            icon={Mail}
            label="Email"
            value={
              profile.showEmailPublicly
                ? profile.email
                : undefined
            }
          />
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
              Social & web
            </p>

            <span className="text-[10px] text-slate-400">
              Public links
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <SocialLink
              label="LinkedIn"
              href={profile.social.linkedin}
            />

            <SocialLink
              label="Facebook"
              href={profile.social.facebook}
            />

            <SocialLink
              label="Website"
              href={profile.social.website}
            />
          </div>
        </div>
      </Section>
    </div>
  );
}

function ScheduleGroup({
  icon: Icon,
  label,
  items,
}: {
  icon: typeof CalendarDays;
  label: string;
  items: string[];
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-slate-400" />

        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
          {label}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span
              key={item}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">
          Not specified
        </p>
      )}
    </div>
  );
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="h-7 gap-1.5 rounded-md px-2 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    >
      <Pencil className="h-3 w-3" />
      Edit
    </Button>
  );
}