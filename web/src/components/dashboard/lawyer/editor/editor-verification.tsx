"use client";

import { FileCheck2, Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { LawyerFullProfile } from "@/lib/data/lawyer-profile-types";

export type VerificationDocKey =
  | "cnic_front"
  | "bar_council_card"
  | "law_license"
  | "enrollment_certificate";

export interface VerificationDocConfig {
  key: VerificationDocKey;
  label: string;
  description: string;
}

export const VERIFICATION_DOCS: VerificationDocConfig[] = [
  {
    key: "cnic_front",
    label: "CNIC",
    description: "Upload the front side of your CNIC.",
  },
  {
    key: "bar_council_card",
    label: "Bar Council Card",
    description: "Upload your Bar Council card.",
  },
  {
    key: "law_license",
    label: "Advocate License",
    description: "Upload your advocate license.",
  },
  {
    key: "enrollment_certificate",
    label: "Enrollment Certificate",
    description: "Upload your enrollment certificate.",
  },
];

export function EditorVerification({
  form,
  docPaths,
  uploadingDoc,
  onUpload,
}: {
  form: LawyerFullProfile;
  docPaths: Partial<Record<VerificationDocKey, string>>;
  uploadingDoc: VerificationDocKey | null;
  onUpload: (type: VerificationDocKey, file: File) => void;
}) {
  return (
    <Card id="verification">
      <CardHeader>
        <CardTitle>Verification documents</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-medium text-amber-900">
            Keep your verification documents private
          </p>
          <p className="mt-1 text-xs leading-5 text-amber-800">
            These documents are submitted privately for admin verification and
            are not displayed on your public lawyer profile.
          </p>
        </div>

        <div className="space-y-4">
          {VERIFICATION_DOCS.map((doc) => {
            const uploaded = Boolean(docPaths[doc.key]);
            const uploading = uploadingDoc === doc.key;

            return (
              <div
                key={doc.key}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    {uploaded ? (
                      <FileCheck2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Upload className="h-4 w-4 text-slate-500" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {doc.label}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {doc.description}
                    </p>

                    {uploaded ? (
                      <p className="mt-2 text-xs font-medium text-emerald-600">
                        Document uploaded
                      </p>
                    ) : null}
                  </div>
                </div>

                <Label className="shrink-0">
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    disabled={uploading}
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (file) {
                        onUpload(doc.key, file);
                      }

                      event.currentTarget.value = "";
                    }}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    asChild
                  >
                    <span className="cursor-pointer">
                      {uploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}

                      {uploading
                        ? "Uploading..."
                        : uploaded
                          ? "Replace"
                          : "Upload"}
                    </span>
                  </Button>
                </Label>
              </div>
            );
          })}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-900">
              Bar Council enrollment number
            </p>

            <p className="text-xs text-slate-500">
              This must match the number on your submitted documents.
            </p>

            <Input value={form.barCouncilNumber} disabled />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-900">
              Enrollment year
            </p>

            <p className="text-xs text-slate-500">
              Your professional enrollment year.
            </p>

            <Input value={form.barEnrollmentYear} disabled />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}