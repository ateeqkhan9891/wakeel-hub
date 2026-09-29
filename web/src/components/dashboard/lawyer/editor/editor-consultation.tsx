"use client";

import type { LawyerFullProfile } from "@/lib/data/lawyer-profile-types";

import {
  TIME_SLOTS,
  WEEK_DAYS,
} from "@/lib/constants";

import {
  TagSelector,
  TextField,
  ToggleRow,
} from "@/components/dashboard/lawyer/editor/editor-ui";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function EditorConsultation({
  form,
  set,
  toggle,
}: {
  form: LawyerFullProfile;
  set: <K extends keyof LawyerFullProfile>(
    key: K,
    value: LawyerFullProfile[K],
  ) => void;
  toggle: (
    key: "availabilityDays" | "availabilitySlots",
    value: string,
  ) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consultation fees & availability</CardTitle>
      </CardHeader>

      <CardContent className="space-y-7">
        <div className="grid gap-5 md:grid-cols-3">
          <TextField
            label="Online consultation fee"
            value={form.onlineConsultationFee}
            onChange={(value) => set("onlineConsultationFee", value)}
            placeholder="e.g. 2500"
            type="number"
          />

          <TextField
            label="Office consultation fee"
            value={form.officeConsultationFee}
            onChange={(value) => set("officeConsultationFee", value)}
            placeholder="e.g. 3000"
            type="number"
          />

          <TextField
            label="Phone consultation fee"
            value={form.phoneConsultationFee}
            onChange={(value) => set("phoneConsultationFee", value)}
            placeholder="e.g. 1500"
            type="number"
          />
        </div>

        <ToggleRow
          label="Free initial consultation"
          description="Allow clients to request an initial consultation without a consultation fee."
          checked={form.freeInitialConsultation}
          onCheckedChange={(checked) =>
            set("freeInitialConsultation", checked)
          }
        />

        <div className="space-y-3">
          <TagSelector
            label="Available days"
            items={WEEK_DAYS}
            selected={form.availabilityDays}
            onToggle={(value) => toggle("availabilityDays", value)}
          />
        </div>

        <div className="space-y-3">
          <TagSelector
            label="Available time slots"
            items={TIME_SLOTS}
            selected={form.availabilitySlots}
            onToggle={(value) => toggle("availabilitySlots", value)}
          />
        </div>

        <TextField
          label="Availability hours"
          value={form.availabilityHours}
          onChange={(value) => set("availabilityHours", value)}
          placeholder="e.g. 10:00 AM - 6:00 PM"
        />
      </CardContent>
    </Card>
  );
}
