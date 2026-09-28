"use client";

import { CalendarDays, Building2, CreditCard, Phone, Video, Wallet, Clock } from "lucide-react";

import { WEEK_DAYS, TIME_SLOTS } from "@/lib/constants";
import { formatPKR } from "@/lib/utils";
import type { LawyerSettings } from "@/lib/data/lawyer-settings";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Chips,
  NumField,
  SettingsCard,
  Toggle,
  ToggleGroup,
} from "./settings-ui";

type SettingsPracticeProps = {
  form: LawyerSettings;
  set: <K extends keyof LawyerSettings>(
    key: K,
    value: LawyerSettings[K],
  ) => void;
  toggleArr: (
    key: "availabilityDays" | "availabilitySlots",
    value: string,
  ) => void;
};

export function SettingsPractice({
  form,
  set,
  toggleArr,
}: SettingsPracticeProps) {
  return (
    <div className="space-y-5">
      <SettingsCard
        icon={Wallet}
        title="Consultation fees"
        description="The fees clients see before booking a consultation with you."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <NumField
            icon={Video}
            label="Online fee"
            value={form.onlineFee}
            onChange={(value) => set("onlineFee", value)}
            helper={formatPKR(Number(form.onlineFee) || 0)}
          />

          <NumField
            icon={Building2}
            label="Office fee"
            value={form.officeFee}
            onChange={(value) => set("officeFee", value)}
            helper={formatPKR(Number(form.officeFee) || 0)}
          />

          <NumField
            icon={Phone}
            label="Phone fee"
            value={form.phoneFee}
            onChange={(value) => set("phoneFee", value)}
            helper={formatPKR(Number(form.phoneFee) || 0)}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumField
            label="Follow-up fee"
            value={form.followUpFee}
            onChange={(value) => set("followUpFee", value)}
            helper={formatPKR(Number(form.followUpFee) || 0)}
          />

          <NumField
            label="Default duration (minutes)"
            value={form.durationMinutes}
            onChange={(value) => set("durationMinutes", value)}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        icon={CreditCard}
        title="Consultation rules"
        description="Control how clients can consult with you."
      >
        <ToggleGroup>
          <Toggle
            label="Offer a free initial consultation"
            description="A free first session can attract more enquiries."
            checked={form.freeInitial}
            onChange={(value) => set("freeInitial", value)}
          />

          <Toggle
            label="Accept online consultations"
            description="Video and online sessions with clients."
            checked={form.acceptsOnline}
            onChange={(value) => set("acceptsOnline", value)}
          />

          <Toggle
            label="Accept in-person consultations"
            description="Office visits for clients near you."
            checked={form.acceptsInPerson}
            onChange={(value) => set("acceptsInPerson", value)}
          />
        </ToggleGroup>
      </SettingsCard>

      <SettingsCard
        icon={CalendarDays}
        title="Availability"
        description="When clients can book you."
      >
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Available days
        </p>

        <div className="mt-2">
          <Chips
            items={WEEK_DAYS}
            selected={form.availabilityDays}
            onToggle={(value) => toggleArr("availabilityDays", value)}
          />
        </div>

        <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-500">
          Time slots
        </p>

        <div className="mt-2">
          <Chips
            items={TIME_SLOTS}
            selected={form.availabilitySlots}
            onToggle={(value) => toggleArr("availabilitySlots", value)}
          />
        </div>

        <div className="mt-5 max-w-sm">
          <Label className="flex items-center gap-1.5 text-xs">
            <Clock className="h-3.5 w-3.5 text-gold" />
            Working hours
          </Label>

          <Input
            value={form.availabilityHours}
            onChange={(event) =>
              set("availabilityHours", event.target.value)
            }
            placeholder="e.g. 10:00 AM - 6:00 PM"
            className="mt-1.5 h-10"
          />
        </div>
      </SettingsCard>
    </div>
  );
}