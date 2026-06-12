"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Award, BadgeCheck, Briefcase, Camera, FileCheck2,
  Loader2, MapPin, Plus, ShieldCheck, Sparkles, Star, Trash2, Upload, Zap,
} from "lucide-react";
import { toast } from "sonner";

import {
  CITIES, COURT_TYPES, GENDERS, LANGUAGES, PRACTICE_AREAS, PROFESSIONAL_TITLES, TIME_SLOTS, WEEK_DAYS,
} from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { updateLawyerProfile, submitVerification, type VerificationDoc } from "@/app/actions/lawyer-profile-actions";
import type {
  LawyerFullProfile, EducationEntry, ExperienceEntry, PublicationEntry,
} from "@/lib/data/lawyer-profile-types";
import { cn, formatPKR, initials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DashboardCard, subduedButtonClass } from "@/components/dashboard/lawyer-dashboard-ui";

const DOCS = [
  { key: "cnic_front", label: "CNIC" },
  { key: "bar_council_card", label: "Bar Council Card" },
  { key: "law_license", label: "Advocate License" },
  { key: "enrollment_certificate", label: "Enrollment Certificate" },
] as const;

type DocKey = (typeof DOCS)[number]["key"];

function asNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function LawyerProfileEditor({ user }: { user: LawyerFullProfile }) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [submittingVerification, startVerification] = useTransition();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<DocKey | null>(null);
  const [docPaths, setDocPaths] = useState<Partial<Record<DocKey, string>>>({});
  const [form, setForm] = useState<LawyerFullProfile>(user);

  function set<K extends keyof LawyerFullProfile>(key: K, value: LawyerFullProfile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggle(key: "practiceAreas" | "courts" | "languages" | "availabilityDays" | "availabilitySlots", value: string) {
    setForm((f) => {
      const list = f[key];
      const next = list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
      return { ...f, [key]: next };
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
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form]);

  // ---- uploads -----------------------------------------------------------
  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    const supabase = createClient();
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${form.id}/profile-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type || undefined });
    if (error) {
      setUploadingPhoto(false);
      toast.error("Photo upload failed", { description: error.message });
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    set("photoUrl", data.publicUrl);
    setUploadingPhoto(false);
    toast.success("Photo uploaded", { description: 'Click "Save profile" to publish it.' });
  }

  async function handleDocChange(key: DocKey, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(key);
    const supabase = createClient();
    const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
    const path = `${form.id}/${key}-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("verification-documents").upload(path, file, { upsert: true, contentType: file.type || undefined });
    setUploadingDoc(null);
    if (error) {
      toast.error("Upload failed", { description: error.message });
      return;
    }
    setDocPaths((d) => ({ ...d, [key]: path }));
    toast.success(`${DOCS.find((x) => x.key === key)?.label} attached`);
  }

  // ---- save --------------------------------------------------------------
  function handleSave() {
    startSaving(async () => {
      const result = await updateLawyerProfile({
        name: form.name, phone: form.phone, photoUrl: form.photoUrl, gender: form.gender,
        dateOfBirth: form.dateOfBirth, city: form.city, officeAddress: form.officeAddress,
        experienceYears: form.experienceYears, barEnrollmentYear: form.barEnrollmentYear,
        barCouncilNumber: form.barCouncilNumber, licenseNumber: form.licenseNumber,
        professionalTitle: form.professionalTitle, about: form.about,
        practiceAreas: form.practiceAreas, courts: form.courts,
        education: form.education, experience: form.experience, languages: form.languages,
        onlineConsultationFee: form.onlineConsultationFee, officeConsultationFee: form.officeConsultationFee,
        phoneConsultationFee: form.phoneConsultationFee, freeInitialConsultation: form.freeInitialConsultation,
        availabilityDays: form.availabilityDays, availabilitySlots: form.availabilitySlots,
        availabilityHours: form.availabilityHours, officeName: form.officeName,
        googleMapsLink: form.googleMapsLink, achievements: form.achievements,
        publications: form.publications, social: form.social,
        showPhonePublicly: form.showPhonePublicly, showEmailPublicly: form.showEmailPublicly,
      });
      if (!result.ok) {
        toast.error("Could not save profile", { description: result.error });
        return;
      }
      toast.success("Profile saved", { description: "Your changes are live. Verified profiles appear in the public directory." });
      router.refresh();
    });
  }

  function handleSubmitVerification() {
    const docs: VerificationDoc[] = (Object.entries(docPaths) as [DocKey, string][])
      .filter(([, path]) => Boolean(path))
      .map(([type, path]) => ({ type, path }));
    startVerification(async () => {
      const result = await submitVerification(form.barCouncilNumber, docs);
      if (!result.ok) {
        toast.error("Verification not submitted", { description: result.error });
        return;
      }
      toast.success("Verification submitted", { description: "Our team will review your documents shortly." });
      router.refresh();
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        {/* Basic information */}
        <DashboardCard title="Basic information" description="Core identity details. Name, photo and city are public; date of birth stays private.">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[170px_1fr]">
            <div>
              <Label>Profile photo</Label>
              <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                <Avatar className="mx-auto h-24 w-24 rounded-2xl">
                  {form.photoUrl && <AvatarImage src={form.photoUrl} alt={form.name} className="rounded-2xl object-cover" />}
                  <AvatarFallback className="rounded-2xl text-lg">{initials(form.name || "Advocate")}</AvatarFallback>
                </Avatar>
                <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                  {uploadingPhoto ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  {uploadingPhoto ? "Uploading..." : "Upload photo"}
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={uploadingPhoto} onChange={handlePhotoChange} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField label="Full name" value={form.name} onChange={(v) => set("name", v)} required />
              <TextField label="Email" value={form.email} onChange={() => {}} disabled helper="Tied to your login." />
              <SelectField label="Gender (optional)" value={form.gender} placeholder="Select" onChange={(v) => set("gender", v)} options={[...GENDERS]} />
              <TextField label="Date of birth (optional)" value={form.dateOfBirth} onChange={(v) => set("dateOfBirth", v)} type="date" />
              <SelectField label="City" value={form.city} placeholder="Select city" onChange={(v) => set("city", v)} options={[...CITIES]} />
              <TextField label="Years of experience" value={form.experienceYears} onChange={(v) => set("experienceYears", v)} type="number" required />
              <TextField label="Bar enrollment year" value={form.barEnrollmentYear} onChange={(v) => set("barEnrollmentYear", v)} type="number" placeholder="e.g. 2016" />
              <TextField label="Phone" value={form.phone} onChange={(v) => set("phone", v)} placeholder="03XX XXXXXXX" />
              <TextField label="Bar Council enrollment number" value={form.barCouncilNumber} onChange={(v) => set("barCouncilNumber", v)} placeholder="e.g. PBC-12345-A" required />
              <TextField label="License number (optional)" value={form.licenseNumber} onChange={(v) => set("licenseNumber", v)} />
              <div className="md:col-span-2">
                <TextField label="Office address" value={form.officeAddress} onChange={(v) => set("officeAddress", v)} placeholder="Street, area, city" />
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Professional */}
        <DashboardCard title="Professional information" description="Your title and biography shown to clients on your public profile.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField label="Professional title" value={form.professionalTitle} placeholder="Select title" onChange={(v) => set("professionalTitle", v)} options={[...PROFESSIONAL_TITLES]} />
          </div>
          <div className="mt-4 space-y-2">
            <Label>About me (biography)</Label>
            <Textarea
              rows={5}
              value={form.about}
              onChange={(e) => set("about", e.target.value)}
              placeholder="e.g. I specialize in family and civil litigation with over 8 years of courtroom experience..."
              className="rounded-lg border-slate-200 bg-white"
            />
          </div>
        </DashboardCard>

        {/* Practice, courts, languages */}
        <DashboardCard title="Practice areas, courts & languages" description="Help clients understand whether you're the right advocate for their matter.">
          <TagSelector title="Practice areas" items={PRACTICE_AREAS.map((a) => ({ value: a.slug, label: a.name }))} selected={form.practiceAreas} onToggle={(v) => toggle("practiceAreas", v)} />
          <div className="mt-5">
            <TagSelector title="Courts practiced in" items={COURT_TYPES.map((c) => ({ value: c, label: c }))} selected={form.courts} onToggle={(v) => toggle("courts", v)} />
          </div>
          <div className="mt-5">
            <TagSelector title="Languages" items={LANGUAGES.map((l) => ({ value: l, label: l }))} selected={form.languages} onToggle={(v) => toggle("languages", v)} />
          </div>
        </DashboardCard>

        {/* Education */}
        <DashboardCard title="Education" description="Add your degrees and qualifications.">
          <RepeatableList
            items={form.education}
            onChange={(items) => set("education", items)}
            empty={{ degree: "", institution: "", year: "" } as EducationEntry}
            addLabel="Add education"
            render={(item, update) => (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Input value={item.degree} onChange={(e) => update({ ...item, degree: e.target.value })} placeholder="Degree (e.g. LLB)" className="h-10 rounded-lg border-slate-200 bg-white" />
                <Input value={item.institution} onChange={(e) => update({ ...item, institution: e.target.value })} placeholder="Institution" className="h-10 rounded-lg border-slate-200 bg-white" />
                <Input value={item.year} onChange={(e) => update({ ...item, year: e.target.value })} placeholder="Year" className="h-10 rounded-lg border-slate-200 bg-white" />
              </div>
            )}
          />
        </DashboardCard>

        {/* Experience */}
        <DashboardCard title="Experience" description="Your professional history at law firms and chambers.">
          <RepeatableList
            items={form.experience}
            onChange={(items) => set("experience", items)}
            empty={{ firm: "", position: "", startDate: "", endDate: "", description: "" } as ExperienceEntry}
            addLabel="Add experience"
            render={(item, update) => (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input value={item.firm} onChange={(e) => update({ ...item, firm: e.target.value })} placeholder="Law firm / chamber" className="h-10 rounded-lg border-slate-200 bg-white" />
                  <Input value={item.position} onChange={(e) => update({ ...item, position: e.target.value })} placeholder="Position" className="h-10 rounded-lg border-slate-200 bg-white" />
                  <Input value={item.startDate} onChange={(e) => update({ ...item, startDate: e.target.value })} placeholder="Start (e.g. 2018)" className="h-10 rounded-lg border-slate-200 bg-white" />
                  <Input value={item.endDate} onChange={(e) => update({ ...item, endDate: e.target.value })} placeholder="End (e.g. 2022 or Present)" className="h-10 rounded-lg border-slate-200 bg-white" />
                </div>
                <Textarea value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} rows={2} placeholder="Brief description of your role" className="rounded-lg border-slate-200 bg-white" />
              </div>
            )}
          />
        </DashboardCard>

        {/* Consultation & availability */}
        <DashboardCard title="Consultation fees & availability" description="Clients see these before booking. Online consultation defaults to Rs. 2,000.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <TextField label="Online consultation fee" value={form.onlineConsultationFee} onChange={(v) => set("onlineConsultationFee", v)} type="number" helper={formatPKR(asNumber(form.onlineConsultationFee))} required />
            <TextField label="Office consultation fee" value={form.officeConsultationFee} onChange={(v) => set("officeConsultationFee", v)} type="number" helper={formatPKR(asNumber(form.officeConsultationFee))} />
            <TextField label="Phone consultation fee" value={form.phoneConsultationFee} onChange={(v) => set("phoneConsultationFee", v)} type="number" helper={formatPKR(asNumber(form.phoneConsultationFee))} />
          </div>
          <div className="mt-4">
            <ToggleRow label="Offer a free initial consultation" checked={form.freeInitialConsultation} onCheckedChange={(c) => set("freeInitialConsultation", c)} />
          </div>
          <div className="mt-5">
            <TagSelector title="Available days" items={WEEK_DAYS.map((d) => ({ value: d, label: d }))} selected={form.availabilityDays} onToggle={(v) => toggle("availabilityDays", v)} />
          </div>
          <div className="mt-5">
            <TagSelector title="Time slots" items={TIME_SLOTS.map((t) => ({ value: t, label: t }))} selected={form.availabilitySlots} onToggle={(v) => toggle("availabilitySlots", v)} />
          </div>
        </DashboardCard>

        {/* Office details */}
        <DashboardCard title="Office details" description="Where clients can meet you for in-person consultations.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField label="Office name" value={form.officeName} onChange={(v) => set("officeName", v)} placeholder="e.g. Ali & Associates" />
            <TextField label="Google Maps link" value={form.googleMapsLink} onChange={(v) => set("googleMapsLink", v)} placeholder="https://maps.google.com/..." />
          </div>
        </DashboardCard>

        {/* Achievements & publications */}
        <DashboardCard title="Achievements & publications" description="Highlights that build client trust. Optional.">
          <StringList label="Achievements" items={form.achievements} onChange={(items) => set("achievements", items)} placeholder="e.g. 500+ Cases Handled" addLabel="Add achievement" />
          <div className="mt-5">
            <RepeatableList
              items={form.publications}
              onChange={(items) => set("publications", items)}
              empty={{ title: "", url: "" } as PublicationEntry}
              addLabel="Add publication"
              label="Publications & articles"
              render={(item, update) => (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr]">
                  <Input value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} placeholder="Title" className="h-10 rounded-lg border-slate-200 bg-white" />
                  <Input value={item.url} onChange={(e) => update({ ...item, url: e.target.value })} placeholder="Link (optional)" className="h-10 rounded-lg border-slate-200 bg-white" />
                </div>
              )}
            />
          </div>
        </DashboardCard>

        {/* Social links */}
        <DashboardCard title="Social links" description="Optional links shown on your public profile.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <TextField label="LinkedIn" value={form.social.linkedin} onChange={(v) => set("social", { ...form.social, linkedin: v })} placeholder="https://linkedin.com/in/..." />
            <TextField label="Facebook" value={form.social.facebook} onChange={(v) => set("social", { ...form.social, facebook: v })} placeholder="https://facebook.com/..." />
            <TextField label="Website" value={form.social.website} onChange={(v) => set("social", { ...form.social, website: v })} placeholder="https://..." />
          </div>
        </DashboardCard>

        {/* Verification */}
        <DashboardCard title="Verification documents" description="Private documents for admin review - never shown on your public profile.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {DOCS.map((doc) => (
              <div key={doc.key} className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
                <FileCheck2 className={cn("mx-auto h-6 w-6", docPaths[doc.key] ? "text-emerald-600" : "text-slate-400")} />
                <p className="mt-2 text-sm font-medium text-slate-950">{doc.label}</p>
                <p className="mt-1 text-xs text-slate-500">{docPaths[doc.key] ? "Attached" : "Private verification document"}</p>
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                  {uploadingDoc === doc.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploadingDoc === doc.key ? "Uploading..." : "Upload"}
                  <input type="file" accept="image/png,image/jpeg,application/pdf" className="sr-only" disabled={uploadingDoc === doc.key} onChange={(e) => handleDocChange(doc.key, e)} />
                </label>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-950">Verification status</p>
              <StatusBadge status={form.verificationStatus} />
            </div>
            <Button variant="outline" className={subduedButtonClass} onClick={handleSubmitVerification} disabled={submittingVerification}>
              {submittingVerification && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit for verification
            </Button>
          </div>
        </DashboardCard>

        <div className="sticky bottom-4 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur">
          <Button className="gap-2 rounded-lg bg-slate-950 text-white hover:bg-slate-800" onClick={handleSave} disabled={saving || uploadingPhoto}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : "Save profile"}
          </Button>
          <span className="self-center text-xs text-slate-500">Changes publish to your public profile once you&apos;re verified.</span>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
        <DashboardCard title="Public card preview" description="How your details appear to clients.">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 rounded-2xl">
                {form.photoUrl && <AvatarImage src={form.photoUrl} alt={form.name} className="rounded-2xl object-cover" />}
                <AvatarFallback className="rounded-2xl text-base">{initials(form.name || "Advocate")}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-base font-semibold text-slate-950">{form.name || "Your name"}</h2>
                  {form.isVerified && <BadgeCheck className="h-4 w-4 shrink-0 text-blue-700" />}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{form.professionalTitle || "Professional title"}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{form.city || "City"}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {form.practiceAreas.length ? form.practiceAreas.slice(0, 3).map((slug) => (
                <Badge key={slug} variant="secondary" className="rounded-full text-xs font-normal">{PRACTICE_AREAS.find((a) => a.slug === slug)?.name ?? slug}</Badge>
              )) : <Badge variant="outline" className="rounded-full border-slate-200 text-slate-500">Practice areas</Badge>}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
              <div><p className="text-xs text-slate-500">Experience</p><p className="mt-1 font-medium text-slate-950">{form.experienceYears || "0"} years</p></div>
              <div><p className="text-xs text-slate-500">Online fee</p><p className="mt-1 font-medium text-slate-950">{formatPKR(asNumber(form.onlineConsultationFee))}</p></div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Profile completion" description={`${completion}% complete.`}>
          <Progress value={completion} className="h-2" />
          <p className="mt-3 text-xs leading-5 text-slate-500">A complete profile ranks higher and earns client trust. Fill every section above.</p>
        </DashboardCard>

        <DashboardCard title="Reputation" description="Calculated from activity on WakeelHub. These fields cannot be edited manually.">
          <div className="grid grid-cols-2 gap-3">
            <ReadStat icon={Star} label="Avg. rating" value={form.rating ? form.rating.toFixed(1) : "-"} />
            <ReadStat icon={Award} label="Reviews" value={String(form.reviewCount)} />
            <ReadStat icon={Briefcase} label="Consultations" value={String(form.totalConsultations)} />
            <ReadStat icon={Zap} label="Response rate" value={form.responseRate ? `${form.responseRate}%` : "-"} />
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {form.isVerified && <BadgeTag icon={ShieldCheck} label="Verified Lawyer" tone="blue" />}
            {form.rating >= 4.5 && <BadgeTag icon={Star} label="Top Rated" tone="gold" />}
            {form.responseRate >= 80 && <BadgeTag icon={Zap} label="Quick Responder" tone="emerald" />}
            {form.isFeatured && <BadgeTag icon={Sparkles} label="Featured" tone="gold" />}
            {!form.isVerified && form.rating < 4.5 && form.responseRate < 80 && !form.isFeatured && (
              <p className="text-xs text-slate-500">Earn badges as clients work with you.</p>
            )}
          </div>
        </DashboardCard>

        <DashboardCard title="Public visibility" description="Choose which contact fields appear publicly.">
          <ToggleRow label="Show phone publicly" checked={form.showPhonePublicly} onCheckedChange={(c) => set("showPhonePublicly", c)} />
          <ToggleRow label="Show email publicly" checked={form.showEmailPublicly} onCheckedChange={(c) => set("showEmailPublicly", c)} />
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-900">
            <div className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /> CNIC, license & enrollment documents always stay private.</div>
          </div>
        </DashboardCard>
      </aside>
    </div>
  );
}

// ---- small building blocks ------------------------------------------------
function TextField({
  label, value, onChange, type = "text", placeholder, helper, required = false, disabled = false,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
  placeholder?: string; helper?: string; required?: boolean; disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}{required && <span className="ml-1 text-rose-600">*</span>}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} type={type} placeholder={placeholder} disabled={disabled} className="h-10 rounded-lg border-slate-200 bg-white" />
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  );
}

function SelectField({
  label, value, onChange, options, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger className="h-10 rounded-lg border-slate-200 bg-white"><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}

function TagSelector({
  title, items, selected, onToggle,
}: {
  title: string; items: { value: string; label: string }[]; selected: string[]; onToggle: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-950">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => {
          const active = selected.includes(item.value);
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onToggle(item.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                active ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (c: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 first:pt-0 last:border-0 last:pb-0">
      <Label className="text-sm font-medium text-slate-700">{label}</Label>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function RepeatableList<T>({
  items, onChange, empty, render, addLabel, label,
}: {
  items: T[]; onChange: (items: T[]) => void; empty: T; addLabel: string; label?: string;
  render: (item: T, update: (next: T) => void) => React.ReactNode;
}) {
  return (
    <div>
      {label && <p className="mb-2 text-sm font-medium text-slate-950">{label}</p>}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <div className="flex items-start gap-3">
              <div className="flex-1">{render(item, (next) => onChange(items.map((it, i) => (i === idx ? next : it))))}</div>
              <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600" onClick={() => onChange(items.filter((_, i) => i !== idx))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" className={cn("mt-3 gap-1.5", subduedButtonClass)} onClick={() => onChange([...items, empty])}>
        <Plus className="h-4 w-4" /> {addLabel}
      </Button>
    </div>
  );
}

function StringList({
  label, items, onChange, placeholder, addLabel,
}: {
  label: string; items: string[]; onChange: (items: string[]) => void; placeholder: string; addLabel: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-950">{label}</p>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Input value={item} onChange={(e) => onChange(items.map((it, i) => (i === idx ? e.target.value : it)))} placeholder={placeholder} className="h-10 rounded-lg border-slate-200 bg-white" />
            <Button type="button" variant="ghost" size="icon" className="shrink-0 text-slate-400 hover:text-rose-600" onClick={() => onChange(items.filter((_, i) => i !== idx))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" className={cn("mt-3 gap-1.5", subduedButtonClass)} onClick={() => onChange([...items, ""])}>
        <Plus className="h-4 w-4" /> {addLabel}
      </Button>
    </div>
  );
}

function ReadStat({ icon: Icon, label, value }: { icon: typeof Star; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2 text-xs text-slate-500"><Icon className="h-3.5 w-3.5 text-slate-400" />{label}</div>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function BadgeTag({ icon: Icon, label, tone }: { icon: typeof Star; label: string; tone: "blue" | "gold" | "emerald" }) {
  const cls = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    gold: "border-amber-200 bg-amber-50 text-amber-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  }[tone];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", cls)}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </span>
  );
}
