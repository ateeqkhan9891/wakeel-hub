"use client";

import type { LawyerFullProfile } from "@/lib/data/lawyer-profile-types";

import { TextField } from "@/components/dashboard/lawyer/editor/editor-ui";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function EditorSocial({
  form,
  set,
}: {
  form: LawyerFullProfile;
  set: <K extends keyof LawyerFullProfile>(
    key: K,
    value: LawyerFullProfile[K],
  ) => void;
}) {
  function updateSocial(
    key: keyof LawyerFullProfile["social"],
    value: string,
  ) {
    set("social", {
      ...form.social,
      [key]: value,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social links</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <TextField
          label="LinkedIn"
          value={form.social.linkedin}
          onChange={(value) => updateSocial("linkedin", value)}
          placeholder="https://linkedin.com/in/your-profile"
          type="url"
        />

        <TextField
          label="Facebook"
          value={form.social.facebook}
          onChange={(value) => updateSocial("facebook", value)}
          placeholder="https://facebook.com/your-profile"
          type="url"
        />

        <TextField
          label="Website"
          value={form.social.website}
          onChange={(value) => updateSocial("website", value)}
          placeholder="https://yourwebsite.com"
          type="url"
        />
      </CardContent>
    </Card>
  );
}