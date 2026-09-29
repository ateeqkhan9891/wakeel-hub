"use client";

import { Plus, Trash2 } from "lucide-react";

import type {
  EducationEntry,
  LawyerFullProfile,
} from "@/lib/data/lawyer-profile-types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EditorEducation({
  form,
  set,
}: {
  form: LawyerFullProfile;
  set: <K extends keyof LawyerFullProfile>(
    key: K,
    value: LawyerFullProfile[K],
  ) => void;
}) {
  function update(index: number, field: keyof EducationEntry, value: string) {
    const education = [...form.education];
    education[index] = {
      ...education[index],
      [field]: value,
    };
    set("education", education);
  }

  function add() {
    set("education", [
      ...form.education,
      {
        degree: "",
        institution: "",
        year: "",
      },
    ]);
  }

  function remove(index: number) {
    set(
      "education",
      form.education.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Education</CardTitle>

        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="mr-2 h-4 w-4" />
          Add education
        </Button>
      </CardHeader>

      <CardContent className="space-y-5">
        {form.education.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 px-5 py-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              No education added
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Add your legal education and qualifications.
            </p>
          </div>
        ) : (
          form.education.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-5"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">
                  Education {index + 1}
                </p>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Degree / qualification</Label>
                  <Input
                    value={item.degree}
                    onChange={(event) =>
                      update(index, "degree", event.target.value)
                    }
                    placeholder="e.g. LLB"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input
                    value={item.institution}
                    onChange={(event) =>
                      update(index, "institution", event.target.value)
                    }
                    placeholder="e.g. University of Peshawar"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    value={item.year}
                    onChange={(event) =>
                      update(index, "year", event.target.value)
                    }
                    placeholder="e.g. 2020"
                  />
                </div>
              </div>
            </div>
          ))
        )}

        {form.education.length === 0 && (
          <Button type="button" variant="outline" onClick={add}>
            <Plus className="mr-2 h-4 w-4" />
            Add your first qualification
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
