"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Pencil, MapPin, Star, Briefcase, GraduationCap, Languages as LangIcon, Award, BookOpen,
  Scale, Wallet, CalendarDays, Building2, Phone, Mail, Globe, Link2, BadgeCheck,
  ShieldCheck, Clock, ArrowLeft, CheckCircle2, Gavel, Sparkles, ExternalLink, Crown,
  Eye, Search, MousePointerClick, MessageSquare, TrendingUp, Activity, Circle, Video,
} from "lucide-react";

import { PRACTICE_AREAS } from "@/lib/constants";
import { cn, formatPKR } from "@/lib/utils";
import type { LawyerFullProfile } from "@/lib/data/lawyer-profile-types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LawyerProfileEditor } from "@/components/dashboard/lawyer-profile-editor";

export type SubscriptionInfo = {
  status: "inactive" | "active";
  plan: string | null;
  daysRemaining: number | null;
  expired: boolean;
};

const areaName = (slug: string) => PRACTICE_AREAS.find((a) => a.slug === slug)?.name ?? slug.replace(/-/g, " ");

type VerifyState = "approved" | "pending" | "rejected" | "not_submitted";

const VERIFY: Record<VerifyState, { label: string; cls: string; icon: LucideIcon }> = {
  approved: { label: "Verified advocate", cls: "bg-emerald-50 text-emerald-700 ring-emerald-100", icon: BadgeCheck },
  pending: { label: "Verification under review", cls: "bg-blue-50 text-blue-700 ring-blue-100", icon: Clock },
  rejected: { label: "Verification rejected", cls: "bg-rose-50 text-rose-700 ring-rose-100", icon: ShieldCheck },
  not_submitted: { label: "Not verified yet", cls: "bg-amber-50 text-amber-700 ring-amber-100", icon: ShieldCheck },
};

export function LawyerProfileWorkspace({ profile, subscription }: { profile: LawyerFullProfile; subscription: SubscriptionInfo | null }) {
  const [editing, setEditing] = useState(false);
  const edit = () => setEditing(true);

  // ---- Profile completion checklist (all derived from real fields) --------
  const checklist = useMemo(() => {
    const items: { label: string; done: boolean; hint: string }[] = [
      { label: "Profile photo", done: Boolean(profile.photoUrl), hint: "Add a professional headshot." },
      { label: "Biography", done: profile.about.trim().length >= 40, hint: "Write at least a few sentences about your practice." },
      { label: "Professional title", done: Boolean(profile.professionalTitle), hint: "e.g. Advocate High Court." },
      { label: "Practice areas", done: profile.practiceAreas.length > 0, hint: "Help clients discover you by specialism." },
      { label: "Courts", done: profile.courts.length > 0, hint: "List the courts you appear in." },
      { label: "Experience", done: profile.experience.length > 0, hint: "Add your professional history." },
      { label: "Education", done: profile.education.length > 0, hint: "Add your degrees and institutions." },
      { label: "Languages", done: profile.languages.length > 0, hint: "List the languages you speak." },
      { label: "Consultation fees", done: Number(profile.onlineConsultationFee) > 0 || Number(profile.officeConsultationFee) > 0 || Number(profile.phoneConsultationFee) > 0, hint: "Set at least one consultation fee." },
      { label: "Availability", done: profile.availabilityDays.length > 0, hint: "Choose the days you take consultations." },
      { label: "Office address", done: Boolean(profile.officeAddress), hint: "Add an office address for in-person clients." },
      { label: "Verification documents", done: profile.verificationStatus !== "not_submitted", hint: "Submit documents to get the verified badge." },
    ];
    const done = items.filter((i) => i.done).length;
    const pct = Math.round((done / items.length) * 100);
    return { items, done, total: items.length, pct };
  }, [profile]);

  if (editing) {
    return (
      <div className="space-y-4">
        <button onClick={() => setEditing(false)} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-950">
          <ArrowLeft className="h-4 w-4" /> Back to profile
        </button>
        <LawyerProfileEditor user={profile} />
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setEditing(false)} className="gap-2"><CheckCircle2 className="h-4 w-4" /> Done editing</Button>
        </div>
      </div>
    );
  }

  const vState = (profile.verificationStatus in VERIFY ? profile.verificationStatus : "not_submitted") as VerifyState;
  const v = VERIFY[vState];
  const initials = profile.name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

  // ---- consultation modes & availability ---------------------------------
  const modes = [
    Number(profile.onlineConsultationFee) > 0 ? { label: "Online", icon: Video } : null,
    Number(profile.officeConsultationFee) > 0 ? { label: "In-person", icon: Building2 } : null,
    Number(profile.phoneConsultationFee) > 0 ? { label: "Phone", icon: Phone } : null,
  ].filter((m): m is { label: string; icon: LucideIcon } => m !== null);

  const publicLive = profile.isVerified && Boolean(profile.slug);

  return (
    <div className="space-y-6">
      {/* ---- HERO ---- */}
      <Card className="border-slate-200 p-6 ring-0">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <Avatar className="h-20 w-20 rounded-2xl ring-1 ring-slate-200">
              {profile.photoUrl && <AvatarImage src={profile.photoUrl} alt={profile.name} />}
              <AvatarFallback className="rounded-2xl bg-primary text-xl font-semibold text-primary-foreground">{initials || "?"}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-xl font-semibold text-slate-950">{profile.name || "Your name"}</h2>
                {profile.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100"><BadgeCheck className="h-3 w-3" /> Verified</span>
                )}
                {profile.isFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-100"><Crown className="h-3 w-3" /> Featured</span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-slate-500">{profile.professionalTitle || "Advocate"}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
                {profile.city && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-gold" /> {profile.city}</span>}
                {profile.experienceYears && <span className="inline-flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-gold" /> {profile.experienceYears} yrs experience</span>}
                {profile.barCouncilNumber && <span className="inline-flex items-center gap-1.5"><Scale className="h-3.5 w-3.5 text-gold" /> Bar #{profile.barCouncilNumber}</span>}
                {profile.responseRate > 0 && <span className="inline-flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-gold" /> {profile.responseRate}% response rate</span>}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1", v.cls)}><v.icon className="h-3 w-3" /> {v.label}</span>
                <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1", publicLive ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-slate-100 text-slate-600 ring-slate-200")}>
                  <Globe className="h-3 w-3" /> {publicLive ? "Public profile live" : "Not public yet"}
                </span>
                <SubscriptionPill subscription={subscription} />
              </div>
            </div>
          </div>

          {/* Completion ring + actions */}
          <div className="flex flex-col items-stretch gap-3 sm:items-end">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-2.5">
              <CompletionRing pct={checklist.pct} />
              <div>
                <p className="text-sm font-semibold text-slate-950">Profile strength</p>
                <p className="text-xs text-slate-500">{checklist.done} of {checklist.total} sections complete</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <Button onClick={edit} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"><Pencil className="h-4 w-4" /> Edit profile</Button>
              {publicLive ? (
                <Button asChild variant="outline" className="gap-2">
                  <a href={`/lawyers/${profile.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /> View public profile</a>
                </Button>
              ) : (
                <Button variant="outline" disabled className="gap-2" title="Your public profile goes live after verification."><ExternalLink className="h-4 w-4" /> View public profile</Button>
              )}
              <Button variant="outline" onClick={edit} className="gap-2"><ShieldCheck className="h-4 w-4" /> Manage verification</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* ---- PERFORMANCE ---- */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-gold" />
          <h3 className="font-heading text-sm font-semibold text-slate-950">Profile performance</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <PerfCard icon={MessageSquare} label="Consultations" value={profile.totalConsultations > 0 ? String(profile.totalConsultations) : "0"} helper={profile.totalConsultations > 0 ? "Total requests received" : "No requests yet"} muted={profile.totalConsultations === 0} />
          <PerfCard icon={Star} label="Rating" value={profile.rating > 0 ? profile.rating.toFixed(1) : "-"} helper={profile.reviewCount > 0 ? `${profile.reviewCount} review${profile.reviewCount === 1 ? "" : "s"}` : "No reviews yet"} muted={profile.rating === 0} />
          <PerfCard icon={Activity} label="Response rate" value={profile.responseRate > 0 ? `${profile.responseRate}%` : "-"} helper={profile.responseRate > 0 ? "How often you reply" : "Not measured yet"} muted={profile.responseRate === 0} />
          <PerfCard icon={Eye} label="Profile views" value="-" helper="Not measured yet" muted />
          <PerfCard icon={Search} label="Search appearances" value="-" helper="Not measured yet" muted />
          <PerfCard icon={MousePointerClick} label="Client clicks" value="-" helper="Not measured yet" muted />
        </div>
      </div>

      {/* ---- MAIN + SIDEBAR ---- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {/* About */}
          <Section icon={Sparkles} title="About" onEdit={edit}>
            {profile.about ? (
              <p className="text-sm leading-7 text-slate-600">{profile.about}</p>
            ) : (
              <Empty text="Add a short professional biography. A detailed bio improves client trust and helps you stand out." />
            )}
          </Section>

          {/* Practice areas + courts */}
          <Section
            icon={Gavel}
            title="Practice areas & courts"
            count={profile.practiceAreas.length + profile.courts.length || undefined}
            onEdit={edit}
          >
            {profile.practiceAreas.length === 0 && profile.courts.length === 0 ? (
              <Empty text="Add your practice areas and the courts you appear in so clients can find you." />
            ) : (
              <div className="space-y-4">
                {profile.practiceAreas.length > 0 && <ChipRow label={`Practice areas (${profile.practiceAreas.length})`} items={profile.practiceAreas.map(areaName)} tone="gold" />}
                {profile.courts.length > 0 && <ChipRow label={`Courts (${profile.courts.length})`} items={profile.courts} tone="slate" />}
              </div>
            )}
          </Section>

          {/* Experience */}
          <Section icon={Briefcase} title="Professional experience" count={profile.experience.length || undefined} onEdit={edit}>
            {profile.experience.length === 0 ? <Empty text="Add your work experience and roles to build credibility." /> : (
              <div className="space-y-3">
                {profile.experience.map((e, i) => (
                  <ExperienceCard key={i} position={e.position} firm={e.firm} startDate={e.startDate} endDate={e.endDate} description={e.description} />
                ))}
              </div>
            )}
          </Section>

          {/* Education */}
          <Section icon={GraduationCap} title="Education" count={profile.education.length || undefined} onEdit={edit}>
            {profile.education.length === 0 ? <Empty text="Add your degrees and institutions." /> : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {profile.education.map((e, i) => (
                  <div key={i} className="flex gap-3 rounded-xl border border-slate-200 p-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary"><GraduationCap className="h-4 w-4" /></span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-950">{e.degree || "Degree"}</p>
                      {(e.institution || e.year) && <p className="text-xs text-slate-500">{[e.institution, e.year].filter(Boolean).join(" - ")}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Languages */}
          <Section icon={LangIcon} title="Languages" count={profile.languages.length || undefined} onEdit={edit}>
            {profile.languages.length === 0 ? <Empty text="Add the languages you speak to reassure clients." /> : <ChipRow items={profile.languages} tone="slate" />}
          </Section>

          {/* Achievements + publications */}
          {(profile.achievements.length > 0 || profile.publications.length > 0) && (
            <Section icon={Award} title="Achievements & publications" onEdit={edit}>
              <div className="space-y-4">
                {profile.achievements.length > 0 && (
                  <ul className="space-y-2">
                    {profile.achievements.map((a, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600"><Award className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {a}</li>
                    ))}
                  </ul>
                )}
                {profile.publications.length > 0 && (
                  <div className="space-y-2">
                    {profile.publications.map((p, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm"><BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-gold" /><div><span className="font-medium text-slate-900">{p.title}</span>{p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-primary hover:underline">View</a>}</div></div>
                    ))}
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Consultation fees & availability */}
          <Section icon={Wallet} title="Consultation fees & availability" onEdit={edit}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Fee icon={Video} label="Online consultation" value={profile.onlineConsultationFee} />
              <Fee icon={Building2} label="Office consultation" value={profile.officeConsultationFee} />
              <Fee icon={Phone} label="Phone consultation" value={profile.phoneConsultationFee} />
            </div>
            {profile.freeInitialConsultation && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Free initial consultation</p>
            )}
            {(modes.length > 0 || profile.availabilityDays.length > 0 || profile.availabilityHours) && (
              <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                {modes.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">Consultation modes</p>
                    <div className="flex flex-wrap gap-1.5">
                      {modes.map((m) => (
                        <span key={m.label} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"><m.icon className="h-3 w-3" /> {m.label}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.availabilityDays.length > 0 && <ChipRow label="Working days" items={profile.availabilityDays} tone="slate" icon={CalendarDays} />}
                {profile.availabilityHours && <p className="flex items-center gap-1.5 text-sm text-slate-600"><Clock className="h-4 w-4 text-gold" /> {profile.availabilityHours}</p>}
              </div>
            )}
          </Section>

          {/* Office & contact */}
          <Section icon={Building2} title="Office & contact information" onEdit={edit}>
            {profile.officeName || profile.officeAddress || (profile.showPhonePublicly && profile.phone) || (profile.showEmailPublicly && profile.email) ? (
              <div className="space-y-2.5 text-sm">
                {profile.officeName && <Row icon={Building2} value={profile.officeName} />}
                {profile.officeAddress && <Row icon={MapPin} value={profile.officeAddress} />}
                {profile.city && <Row icon={MapPin} value={profile.city} />}
                {profile.showPhonePublicly && profile.phone && <Row icon={Phone} value={`${profile.phone} (public)`} />}
                {profile.showEmailPublicly && profile.email && <Row icon={Mail} value={`${profile.email} (public)`} />}
              </div>
            ) : (
              <Empty text="Add your office address so clients can find you for in-person consultations." />
            )}
            {(profile.social.website || profile.social.linkedin || profile.social.facebook || profile.googleMapsLink) && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                {profile.social.website && <SocialLink icon={Globe} label="Website" href={profile.social.website} />}
                {profile.social.linkedin && <SocialLink icon={Link2} label="LinkedIn" href={profile.social.linkedin} />}
                {profile.social.facebook && <SocialLink icon={Link2} label="Facebook" href={profile.social.facebook} />}
                {profile.googleMapsLink && <SocialLink icon={MapPin} label="Map" href={profile.googleMapsLink} />}
              </div>
            )}
          </Section>
        </div>

        {/* ---- SIDEBAR ---- */}
        <div className="space-y-6">
          {/* Completion checklist */}
          <Card className="border-slate-200 p-5 ring-0">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-semibold text-slate-950">Profile completion</h3>
              <span className="text-sm font-semibold text-primary">{checklist.pct}%</span>
            </div>
            <Progress value={checklist.pct} className="mt-3 h-2 bg-slate-100" />
            <p className="mt-2 text-xs text-slate-500">A complete, verified profile ranks higher and earns client trust.</p>
            <ul className="mt-4 space-y-2.5">
              {checklist.items.map((it) => (
                <li key={it.label} className="flex items-start gap-2.5">
                  {it.done ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                  )}
                  <div className="min-w-0">
                    <p className={cn("text-sm", it.done ? "text-slate-500 line-through" : "font-medium text-slate-800")}>{it.label}</p>
                    {!it.done && <p className="text-xs text-slate-400">{it.hint}</p>}
                  </div>
                </li>
              ))}
            </ul>
            {checklist.pct < 100 && (
              <Button onClick={edit} variant="outline" size="sm" className="mt-4 w-full gap-1.5">
                <Pencil className="h-3.5 w-3.5" /> Complete your profile
              </Button>
            )}
          </Card>

          {/* Verification center */}
          <Card className="border-slate-200 p-5 ring-0">
            <div className="flex items-center gap-3">
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl ring-1", v.cls)}><v.icon className="h-5 w-5" /></span>
              <div className="min-w-0">
                <h3 className="font-heading text-sm font-semibold text-slate-950">Verification center</h3>
                <p className="text-xs text-slate-500">{vState === "approved" ? "Your profile is live in the public directory." : "Verified lawyers receive higher visibility."}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              <VerifyRow label="Verification status" state={vState} />
              <CredentialRow label="Bar council number" provided={Boolean(profile.barCouncilNumber)} />
              <CredentialRow label="License number" provided={Boolean(profile.licenseNumber)} />
              <CredentialRow label="Bar enrollment year" provided={Boolean(profile.barEnrollmentYear)} />
              <CredentialRow label="Office address" provided={Boolean(profile.officeAddress)} />
            </div>

            <Button onClick={edit} className="mt-4 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <ShieldCheck className="h-4 w-4" /> Manage verification
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ---- helpers --------------------------------------------------------------
function CompletionRing({ pct }: { pct: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative h-12 w-12 shrink-0">
      <svg viewBox="0 0 44 44" className="h-12 w-12 -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" strokeWidth="4" className="stroke-slate-100" />
        <circle cx="22" cy="22" r={r} fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} className="stroke-primary transition-all" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-slate-950">{pct}%</span>
    </div>
  );
}

function SubscriptionPill({ subscription }: { subscription: SubscriptionInfo | null }) {
  if (!subscription || subscription.status !== "active" || subscription.expired) {
    return (
      <Link href="/dashboard/lawyer/billing" className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200">
        <Crown className="h-3 w-3" /> Free plan - Upgrade
      </Link>
    );
  }
  const planLabel = subscription.plan ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) : "Pro";
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-100">
      <Crown className="h-3 w-3" /> {planLabel}
      {subscription.daysRemaining !== null && ` - ${subscription.daysRemaining}d left`}
    </span>
  );
}

function PerfCard({ icon: Icon, label, value, helper, muted }: { icon: LucideIcon; label: string; value: string; helper: string; muted?: boolean }) {
  return (
    <Card className="rounded-xl border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 ring-0">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", muted ? "bg-slate-100 text-slate-400" : "bg-primary/8 text-primary")}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <p className={cn("mt-3 text-2xl font-semibold tracking-tight", muted ? "text-slate-400" : "text-slate-950")}>{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
    </Card>
  );
}

function Section({ icon: Icon, title, count, onEdit, children }: { icon: LucideIcon; title: string; count?: number; onEdit: () => void; children: React.ReactNode }) {
  return (
    <Card className="border-slate-200 p-5 ring-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-slate-950">
          <Icon className="h-4 w-4 text-gold" /> {title}
          {count !== undefined && <span className="rounded-full bg-slate-100 px-1.5 text-xs font-semibold text-slate-600">{count}</span>}
        </h3>
        <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 gap-1.5 text-slate-500 hover:text-slate-950"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
      </div>
      {children}
    </Card>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-4 py-4 text-sm leading-6 text-slate-500">{text}</p>;
}

function ChipRow({ label, items, tone, icon: Icon }: { label?: string; items: string[]; tone: "gold" | "slate"; icon?: LucideIcon }) {
  return (
    <div>
      {label && <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>}
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span key={it} className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize", tone === "gold" ? "bg-gold/10 text-gold-foreground" : "bg-slate-100 text-slate-700")}>
            {Icon && <Icon className="h-3 w-3" />} {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExperienceCard({ position, firm, startDate, endDate, description }: { position: string; firm: string; startDate: string; endDate: string; description: string }) {
  const period = [startDate, endDate].filter(Boolean).join(" - ");
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary"><Briefcase className="h-4 w-4" /></span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="text-sm font-semibold text-slate-950">{position || "Position"}</p>
          {period && <span className="text-xs text-slate-400">{period}</span>}
        </div>
        {firm && <p className="text-xs text-slate-500">{firm}</p>}
        {description && <p className="mt-1.5 text-sm leading-6 text-slate-600">{description}</p>}
      </div>
    </div>
  );
}

function Fee({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  const n = Number(value) || 0;
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="flex items-center gap-1.5 text-xs text-slate-500"><Icon className="h-3.5 w-3.5 text-gold" /> {label}</p>
      <p className={cn("mt-1.5 font-heading text-base font-semibold", n > 0 ? "text-slate-950" : "text-slate-400")}>{n > 0 ? formatPKR(n) : "Not set"}</p>
    </div>
  );
}

function Row({ icon: Icon, value }: { icon: LucideIcon; value: string }) {
  return <p className="flex items-start gap-2.5 text-sm text-slate-600"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {value}</p>;
}

function SocialLink({ icon: Icon, label, href }: { icon: LucideIcon; label: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-gold/50 hover:bg-slate-50">
      <Icon className="h-3.5 w-3.5 text-gold" /> {label}
    </a>
  );
}

const VERIFY_BADGE: Record<VerifyState, { label: string; cls: string }> = {
  approved: { label: "Verified", cls: "bg-emerald-50 text-emerald-700" },
  pending: { label: "Pending", cls: "bg-blue-50 text-blue-700" },
  rejected: { label: "Rejected", cls: "bg-rose-50 text-rose-700" },
  not_submitted: { label: "Not submitted", cls: "bg-amber-50 text-amber-700" },
};

function VerifyRow({ label, state }: { label: string; state: VerifyState }) {
  const b = VERIFY_BADGE[state];
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", b.cls)}>{b.label}</span>
    </div>
  );
}

function CredentialRow({ label, provided }: { label: string; provided: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", provided ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>
        {provided ? "Provided" : "Missing"}
      </span>
    </div>
  );
}
