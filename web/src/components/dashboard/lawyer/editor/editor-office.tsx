"use client";

import type { LawyerFullProfile } from "@/lib/data/lawyer-profile-types";

import { TextField } from "@/components/dashboard/lawyer/editor/editor-ui";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function EditorOffice({
  form,
  set,
}: {
  form: LawyerFullProfile;
  set: <K extends keyof LawyerFullProfile>(
    key: K,
    value: LawyerFullProfile[K],
  ) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Office details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <TextField
          label="Office name"
          value={form.officeName}
          onChange={(value) => set("officeName", value)}
          placeholder="e.g. Khan Legal Associates"
        />

        <TextField
          label="Office address"
          value={form.officeAddress}
          onChange={(value) => set("officeAddress", value)}
          placeholder="Enter your complete office address"
        />

        <TextField
          label="Google Maps link"
          value={form.googleMapsLink}
          onChange={(value) => set("googleMapsLink", value)}
          placeholder="https://maps.google.com/..."
        />
      </CardContent>
    </Card>
  );
}