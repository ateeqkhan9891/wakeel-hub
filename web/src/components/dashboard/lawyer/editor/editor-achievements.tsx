"use client";

import { Plus, Trash2 } from "lucide-react";

import type {
  LawyerFullProfile,
  PublicationEntry,
} from "@/lib/data/lawyer-profile-types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function EditorAchievements({
  form,
  set,
}: {
  form: LawyerFullProfile;
  set: <K extends keyof LawyerFullProfile>(
    key: K,
    value: LawyerFullProfile[K],
  ) => void;
}) {
  function updatePublication(
    index: number,
    field: keyof PublicationEntry,
    value: string,
  ) {
    const publications = [...form.publications];

    publications[index] = {
      ...publications[index],
      [field]: value,
    };

    set("publications", publications);
  }

  function addPublication() {
    set("publications", [
      ...form.publications,
      {
        title: "",
        url: "",
      },
    ]);
  }

  function removePublication(index: number) {
    set(
      "publications",
      form.publications.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  function updateAchievement(index: number, value: string) {
    const achievements = [...form.achievements];
    achievements[index] = value;
    set("achievements", achievements);
  }

  function addAchievement() {
    set("achievements", [...form.achievements, ""]);
  }

  function removeAchievement(index: number) {
    set(
      "achievements",
      form.achievements.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements & publications</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Achievements
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Add awards, recognitions, memberships, or other professional
                achievements.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAchievement}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          {form.achievements.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 px-5 py-7 text-center">
              <p className="text-sm text-slate-600">
                No achievements added.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {form.achievements.map((achievement, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={achievement}
                    onChange={(event) =>
                      updateAchievement(index, event.target.value)
                    }
                    placeholder="e.g. Best Advocate Award, 2024"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAchievement(index)}
                    className="shrink-0 text-destructive hover:text-destructive"
                    aria-label={`Remove achievement ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Publications
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Add articles, papers, books, or other published work.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPublication}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          {form.publications.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 px-5 py-7 text-center">
              <p className="text-sm text-slate-600">
                No publications added.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {form.publications.map((publication, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-5"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">
                      Publication {index + 1}
                    </p>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePublication(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Publication title</Label>
                      <Input
                        value={publication.title}
                        onChange={(event) =>
                          updatePublication(
                            index,
                            "title",
                            event.target.value,
                          )
                        }
                        placeholder="Enter publication title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Publication URL</Label>
                      <Input
                        type="url"
                        value={publication.url}
                        onChange={(event) =>
                          updatePublication(index, "url", event.target.value)
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}