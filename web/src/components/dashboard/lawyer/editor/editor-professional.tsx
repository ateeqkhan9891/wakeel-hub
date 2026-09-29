"use client";

import type { LawyerFullProfile } from "@/lib/data/lawyer-profile-types";
import { PROFESSIONAL_TITLES } from "@/lib/constants";

import {
  SelectField,
  TextField,
} from "@/components/dashboard/lawyer/editor/editor-ui";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function EditorProfessional({
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
        <CardTitle>Professional information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <SelectField
            label="Professional title"
            value={form.professionalTitle}
            onChange={(value) => set("professionalTitle", value)}
            options={PROFESSIONAL_TITLES}
            placeholder="Select professional title"
          />

          <TextField
            label="Years of experience"
            value={form.experienceYears}
            onChange={(value) => set("experienceYears", value)}
            placeholder="e.g. 8"
            type="number"
          />

          <TextField
            label="Bar enrollment year"
            value={form.barEnrollmentYear}
            onChange={(value) => set("barEnrollmentYear", value)}
            placeholder="e.g. 2018"
            type="number"
          />

          <TextField
            label="Bar Council number"
            value={form.barCouncilNumber}
            onChange={(value) => set("barCouncilNumber", value)}
            placeholder="Enter your Bar Council number"
          />

          <TextField
            label="License number"
            value={form.licenseNumber}
            onChange={(value) => set("licenseNumber", value)}
            placeholder="Enter your license number"
          />
        </div>

        <div className="space-y-2">
          <Label>Professional biography</Label>

          <Textarea
            value={form.about}
            onChange={(event) => set("about", event.target.value)}
            placeholder="Tell clients about your legal experience, expertise, and professional background."
            rows={7}
          />

          <p className="text-xs text-slate-500">
            A clear and informative biography helps clients understand your
            background and areas of expertise.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
