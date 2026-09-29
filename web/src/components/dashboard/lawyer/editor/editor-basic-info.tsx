"use client";

import { Camera, Loader2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  SelectField,
  TextField,
} from "@/components/dashboard/lawyer/editor/editor-ui";

import {
  CITIES,
  GENDERS,
} from "@/lib/constants";

import type { LawyerFullProfile } from "@/lib/data/lawyer-profile-types";
import { initials } from "@/lib/utils";

export function EditorBasicInfo({
  form,
  set,
  uploadingPhoto,
  onPhotoUpload,
}: {
  form: LawyerFullProfile;
  set: <K extends keyof LawyerFullProfile>(
    key: K,
    value: LawyerFullProfile[K],
  ) => void;
  uploadingPhoto: boolean;
  onPhotoUpload: (file: File) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={form.photoUrl || undefined} alt={form.name} />
            <AvatarFallback>{initials(form.name)}</AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-900">
              Profile photo
            </p>

            <p className="text-xs text-slate-500">
              Use a clear professional photo. JPG or PNG recommended.
            </p>

            <label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingPhoto}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) onPhotoUpload(file);
                  event.currentTarget.value = "";
                }}
              />

              <Button
                type="button"
                variant="outline"
                disabled={uploadingPhoto}
                asChild
              >
                <span className="cursor-pointer">
                  {uploadingPhoto ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="mr-2 h-4 w-4" />
                  )}
                  {uploadingPhoto ? "Uploading..." : "Change photo"}
                </span>
              </Button>
            </label>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            label="Full name"
            value={form.name}
            onChange={(value) => set("name", value)}
            placeholder="Your full name"
          />

          <TextField
            label="Phone"
            value={form.phone}
            onChange={(value) => set("phone", value)}
            placeholder="+92 300 1234567"
          />

          <SelectField
            label="Gender"
            value={form.gender}
            onChange={(value) => set("gender", value)}
            options={GENDERS}
            placeholder="Select gender"
          />

          <TextField
            label="Date of birth"
            type="date"
            value={form.dateOfBirth}
            onChange={(value) => set("dateOfBirth", value)}
          />

          <SelectField
            label="City"
            value={form.city}
            onChange={(value) => set("city", value)}
            options={CITIES}
            placeholder="Select city"
          />

          <TextField
            label="Email"
            value={form.email}
            onChange={() => undefined}
            disabled
          />
        </div>
      </CardContent>
    </Card>
  );
}
