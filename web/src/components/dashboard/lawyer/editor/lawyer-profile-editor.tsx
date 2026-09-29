"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import {
  submitVerification,
  updateLawyerProfile,
  type VerificationDoc,
} from "@/app/actions/lawyer-profile-actions";
import type { LawyerFullProfile } from "@/lib/data/lawyer-profile-types";

import { EditorBasicInfo } from "./editor-basic-info";
import { EditorProfessional } from "./editor-professional";
import { EditorPractice } from "./editor-practice";
import { EditorEducation } from "./editor-education";
import { EditorExperience } from "./editor-experience";
import { EditorConsultation } from "./editor-consultation";
import { EditorOffice } from "./editor-office";
import { EditorAchievements } from "./editor-achievements";
import { EditorSocial } from "./editor-social";
import { EditorVerification } from "./editor-verification";
import { EditorSidebar } from "./editor-sidebar";

type DocKey =
  | "cnic_front"
  | "bar_council_card"
  | "law_license"
  | "enrollment_certificate";

const DOCS = [
  { key: "cnic_front", label: "CNIC" },
  { key: "bar_council_card", label: "Bar Council Card" },
  { key: "law_license", label: "Advocate License" },
  { key: "enrollment_certificate", label: "Enrollment Certificate" },
] as const;

function asNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function LawyerProfileEditor({
  user,
}: {
  user: LawyerFullProfile;
}) {
  const router = useRouter();

  const [saving, startSaving] = useTransition();
  const [submittingVerification, startVerification] = useTransition();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<DocKey | null>(null);
  const [docPaths, setDocPaths] = useState<
    Partial<Record<DocKey, string>>
  >({});
  const [form, setForm] = useState<LawyerFullProfile>(user);

  function set<K extends keyof LawyerFullProfile>(
    key: K,
    value: LawyerFullProfile[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggle(
    key:
      | "practiceAreas"
      | "courts"
      | "languages"
      | "availabilityDays"
      | "availabilitySlots",
    value: string,
  ) {
    setForm((current) => {
      const list = current[key];

      const next = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];

      return {
        ...current,
        [key]: next,
      };
    });
  }

  const completion = useMemo(() => {
    const checks = [
      Boolean(form.photoUrl),
      form.name.trim().length > 2,
      Boolean(form.city),
      Boolean(form.professionalTitle),
      form.about.trim().length > 20,
      form.practiceAreas.length > 0,
      form.courts.length > 0,
      asNumber(form.experienceYears) > 0,
      form.languages.length > 0,
      asNumber(form.onlineConsultationFee) > 0,
      form.availabilityDays.length > 0,
      form.education.length > 0,
    ];

    const done = checks.filter(Boolean).length;
    const total = checks.length;

    return {
      done,
      total,
      pct: Math.round((done / total) * 100),
    };
  }, [form]);

  async function handlePhotoUpload(file: File) {
    setUploadingPhoto(true);

    const supabase = createClient();
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${form.id}/profile-${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, {
        upsert: true,
        contentType: file.type || undefined,
      });

    if (error) {
      setUploadingPhoto(false);

      toast.error("Photo upload failed", {
        description: error.message,
      });

      return;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);

    set("photoUrl", data.publicUrl);
    setUploadingPhoto(false);

    toast.success("Photo uploaded", {
      description: 'Click "Save profile" to publish it.',
    });
  }

  async function handleDocUpload(key: DocKey, file: File) {
    setUploadingDoc(key);

    const supabase = createClient();
    const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
    const path = `${form.id}/${key}-${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("verification-documents")
      .upload(path, file, {
        upsert: true,
        contentType: file.type || undefined,
      });

    setUploadingDoc(null);

    if (error) {
      toast.error("Upload failed", {
        description: error.message,
      });

      return;
    }

    setDocPaths((current) => ({
      ...current,
      [key]: path,
    }));

    toast.success(
      `${DOCS.find((doc) => doc.key === key)?.label} attached`,
    );
  }

  function handleSave() {
    startSaving(async () => {
      const result = await updateLawyerProfile({
        name: form.name,
        phone: form.phone,
        photoUrl: form.photoUrl,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        city: form.city,
        officeAddress: form.officeAddress,
        experienceYears: form.experienceYears,
        barEnrollmentYear: form.barEnrollmentYear,
        barCouncilNumber: form.barCouncilNumber,
        licenseNumber: form.licenseNumber,
        professionalTitle: form.professionalTitle,
        about: form.about,
        practiceAreas: form.practiceAreas,
        courts: form.courts,
        education: form.education,
        experience: form.experience,
        languages: form.languages,
        onlineConsultationFee: form.onlineConsultationFee,
        officeConsultationFee: form.officeConsultationFee,
        phoneConsultationFee: form.phoneConsultationFee,
        freeInitialConsultation: form.freeInitialConsultation,
        availabilityDays: form.availabilityDays,
        availabilitySlots: form.availabilitySlots,
        availabilityHours: form.availabilityHours,
        officeName: form.officeName,
        googleMapsLink: form.googleMapsLink,
        achievements: form.achievements,
        publications: form.publications,
        social: form.social,
        showPhonePublicly: form.showPhonePublicly,
        showEmailPublicly: form.showEmailPublicly,
      });

      if (!result.ok) {
        toast.error("Could not save profile", {
          description: result.error,
        });

        return;
      }

      toast.success("Profile saved", {
        description:
          "Your changes are live. Verified profiles appear in the public directory.",
      });

      router.refresh();
    });
  }

  function handleSubmitVerification() {
    const docs: VerificationDoc[] = (
      Object.entries(docPaths) as [DocKey, string][]
    )
      .filter(([, path]) => Boolean(path))
      .map(([type, path]) => ({
        type,
        path,
      }));

    startVerification(async () => {
      const result = await submitVerification(
        form.barCouncilNumber,
        docs,
      );

      if (!result.ok) {
        toast.error("Verification not submitted", {
          description: result.error,
        });

        return;
      }

      toast.success("Verification submitted", {
        description:
          "Our team will review your documents shortly.",
      });

      router.refresh();
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <EditorBasicInfo
          form={form}
          set={set}
          uploadingPhoto={uploadingPhoto}
          onPhotoUpload={handlePhotoUpload}
        />

        <EditorProfessional
          form={form}
          set={set}
        />

        <EditorPractice
          form={form}
          toggle={toggle}
        />

        <EditorEducation
          form={form}
          set={set}
        />

        <EditorExperience
          form={form}
          set={set}
        />

        <EditorConsultation
          form={form}
          set={set}
          toggle={toggle}
        />

        <EditorOffice
          form={form}
          set={set}
        />

        <EditorAchievements
          form={form}
          set={set}
        />

        <EditorSocial
          form={form}
          set={set}
        />

        <EditorVerification
          form={form}
          docPaths={docPaths}
          uploadingDoc={uploadingDoc}
          submitting={submittingVerification}
          onUpload={handleDocUpload}
          onSubmit={handleSubmitVerification}
        />

        <div className="sticky bottom-4 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploadingPhoto}
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save profile"}
          </button>

          <span className="self-center text-xs text-slate-500">
            Changes publish to your public profile once you&apos;re
            verified.
          </span>
        </div>
      </div>

      <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
        <EditorSidebar
          form={form}
          completion={completion}
          set={set}
        />
      </aside>
    </div>
  );
}
