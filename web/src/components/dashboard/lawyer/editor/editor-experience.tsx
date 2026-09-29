"use client";

import { Plus, Trash2 } from "lucide-react";

import type {
  ExperienceEntry,
  LawyerFullProfile,
} from "@/lib/data/lawyer-profile-types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function EditorExperience({
  form,
  set,
}: {
  form: LawyerFullProfile;
  set: <K extends keyof LawyerFullProfile>(
    key: K,
    value: LawyerFullProfile[K],
  ) => void;
}) {
  function update(
    index: number,
    field: keyof ExperienceEntry,
    value: string,
  ) {
    const experience = [...form.experience];

    experience[index] = {
      ...experience[index],
      [field]: value,
    };

    set("experience", experience);
  }

  function add() {
    set("experience", [
      ...form.experience,
      {
        firm: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  }

  function remove(index: number) {
    set(
      "experience",
      form.experience.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Professional experience</CardTitle>

        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="mr-2 h-4 w-4" />
          Add experience
        </Button>
      </CardHeader>

      <CardContent className="space-y-5">
        {form.experience.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 px-5 py-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              No experience added
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Add your previous firms, chambers, or legal positions.
            </p>
          </div>
        ) : (
          form.experience.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-5"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">
                  Experience {index + 1}
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
                  <Label>Firm / chamber</Label>
                  <Input
                    value={item.firm}
                    onChange={(event) =>
                      update(index, "firm", event.target.value)
                    }
                    placeholder="e.g. ABC Law Associates"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input
                    value={item.position}
                    onChange={(event) =>
                      update(index, "position", event.target.value)
                    }
                    placeholder="e.g. Senior Associate"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start date</Label>
                  <Input
                    type="date"
                    value={item.startDate}
                    onChange={(event) =>
                      update(index, "startDate", event.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>End date</Label>
                  <Input
                    type="date"
                    value={item.endDate}
                    onChange={(event) =>
                      update(index, "endDate", event.target.value)
                    }
                    placeholder="Leave empty if current"
                  />
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <Label>Description</Label>

                <Textarea
                  value={item.description}
                  onChange={(event) =>
                    update(index, "description", event.target.value)
                  }
                  placeholder="Describe your responsibilities, cases, or professional experience."
                  rows={5}
                />
              </div>
            </div>
          ))
        )}

        {form.experience.length === 0 && (
          <Button type="button" variant="outline" onClick={add}>
            <Plus className="mr-2 h-4 w-4" />
            Add your first experience
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
