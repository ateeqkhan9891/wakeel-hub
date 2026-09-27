"use client";

import type { LawyerFullProfile } from "@/lib/data/lawyer-profile-types";
import {
  COURT_TYPES,
  LANGUAGES,
  PRACTICE_AREAS,
} from "@/lib/constants";
import { TagSelector } from "@/components/dashboard/lawyer/editor/editor-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EditorPractice({
  form,
  toggle,
}: {
  form: LawyerFullProfile;
  toggle: (
    key: "practiceAreas" | "courts" | "languages",
    value: string,
  ) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice areas, courts & languages</CardTitle>
      </CardHeader>

      <CardContent className="space-y-7">
        <TagSelector
          label="Practice areas"
          items={PRACTICE_AREAS.map((area) => area.name)}
          selected={form.practiceAreas}
          onToggle={(value) => toggle("practiceAreas", value)}
        />

        <TagSelector
          label="Courts"
          items={COURT_TYPES}
          selected={form.courts}
          onToggle={(value) => toggle("courts", value)}
        />

        <TagSelector
          label="Languages"
          items={LANGUAGES}
          selected={form.languages}
          onToggle={(value) => toggle("languages", value)}
        />
      </CardContent>
    </Card>
  );
}