"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  CreditCard, CalendarDays, Bell, Shield, KeyRound, LogOut, Loader2, Clock,
  Wallet, Video, Building2, Phone, BadgeCheck, Globe, Crown, AlertTriangle,
  CheckCircle2, ExternalLink, Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { WEEK_DAYS, TIME_SLOTS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { cn, formatPKR, formatDateTime, formatDate } from "@/lib/utils";
import type { LawyerSettings } from "@/lib/data/lawyer-settings";
import type { LawyerVerificationStatus } from "@/lib/lawyer-dashboard-data";
import { updateLawyerSettings, changePassword } from "@/app/actions/settings-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type SettingsSubscription = {
  status: "inactive" | "active";
  plan: string | null;
  period: string | null;
  expiresAt: string | null;
  daysRemaining: number | null;
  expired: boolean;
  expiringSoon: boolean;
};

export type SettingsSidebarMeta = {
  completionPct: number;
  verificationStatus: LawyerVerificationStatus;
  isVerified: boolean;
  publicLive: boolean;
  slug: string;
};

const FORM_TABS = new Set(["practice", "notifications", "privacy"]);

export function LawyerSettingsPanel({
  settings,
  subscription,
  meta,
}: {
  settings: LawyerSettings;
  subscription: SettingsSubscription | null;
  meta: SettingsSidebarMeta;
}) {
  const router = useRouter();
  const [saving, startSave] = useTransition();
  const [form, setForm] = useState<LawyerSettings>(settings);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [changingPw, startPw] = useTransition();
  const [tab, setTab] = useState("practice");

  function set<K extends keyof LawyerSettings>(key: K, value: LawyerSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function toggleArr(key: "availabilityDays" | "availabilitySlots", value: string) {
    setForm((f) => {
      const list = f[key];
      return { ...f, [key]: list.includes(value) ? list.filter((x) => x !== value) : [...list, value] };
    });
  }

  function save() {
    startSave(async () => {
      const r = await updateLawyerSettings({
        onlineFee: form.onlineFee, officeFee: form.officeFee, phoneFee: form.phoneFee, followUpFee: form.followUpFee,
        durationMinutes: form.durationMinutes, freeInitial: form.freeInitial,
        acceptsOnline: form.acceptsOnline, acceptsInPerson: form.acceptsInPerson,
        availabilityDays: form.availabilityDays, availabilitySlots: form.availabilitySlots, availabilityHours: form.availabilityHours,
        showPhone: form.showPhone, showEmail: form.showEmail,
        notifyBookings: form.notifyBookings, notifyMessages: form.notifyMessages, notifyPayments: form.notifyPayments,
        hearingReminders: form.hearingReminders,
      });
      if (!r.ok) { toast.error("Could not save settings", { description: r.error }); return; }
      toast.success("Settings saved");
      router.refresh();
    });
  }

  function savePassword() {
    if (pw.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (pw !== pw2) { toast.error("Passwords do not match"); return; }
    startPw(async () => {
      const r = await changePassword(pw);
      if (!r.ok) { toast.error("Could not update password", { description: r.error }); return; }
      toast.success("Password updated");
      setPw(""); setPw2("");
    });
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function requestDeletion() {
    if (!window.confirm("Request account deletion? Our support team will verify and process your request.")) return;
    toast.info("Account deletion is handled by support", {
      description: `Email support@wakeelhub.pk from ${settings.email} and we'll close your account.`,
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-xl border border-slate-200 bg-white p-1">
            <TabsTrigger value="practice" className="rounded-lg">Practice</TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg">Notifications</TabsTrigger>
            <TabsTrigger value="privacy" className="rounded-lg">Privacy</TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg">Security</TabsTrigger>
            <TabsTrigger value="subscription" className="rounded-lg">Subscription</TabsTrigger>
          </TabsList>

          {/* ---- PRACTICE ---- */}
          <TabsContent value="practice" className="mt-5 space-y-5">
            <SettingsCard icon={Wallet} title="Consultation fees" description="The fees clients see before booking a consultation with you.">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <NumField icon={Video} label="Online fee" value={form.onlineFee} onChange={(v) => set("onlineFee", v)} helper={formatPKR(Number(form.onlineFee) || 0)} />
                <NumField icon={Building2} label="Office fee" value={form.officeFee} onChange={(v) => set("officeFee", v)} helper={formatPKR(Number(form.officeFee) || 0)} />
                <NumField icon={Phone} label="Phone fee" value={form.phoneFee} onChange={(v) => set("phoneFee", v)} helper={formatPKR(Number(form.phoneFee) || 0)} />
              </div>
              <div className="mt-4 max-w-xs">
                <NumField label="Default duration (minutes)" value={form.durationMinutes} onChange={(v) => set("durationMinutes", v)} />
              </div>
            </SettingsCard>

            <SettingsCard icon={CreditCard} title="Consultation rules" description="Control how clients can consult with you.">
              <ToggleGroup>
                <Toggle label="Offer a free initial consultation" description="A free first session can attract more enquiries." checked={form.freeInitial} onChange={(v) => set("freeInitial", v)} />
                <Toggle label="Accept online consultations" description="Video and online sessions with clients." checked={form.acceptsOnline} onChange={(v) => set("acceptsOnline", v)} />
                <Toggle label="Accept in-person consultations" description="Office visits for clients near you." checked={form.acceptsInPerson} onChange={(v) => set("acceptsInPerson", v)} />
              </ToggleGroup>
            </SettingsCard>

            <SettingsCard icon={CalendarDays} title="Availability" description="When clients can book you.">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Available days</p>
              <div className="mt-2"><Chips items={WEEK_DAYS} selected={form.availabilityDays} onToggle={(v) => toggleArr("availabilityDays", v)} /></div>
              <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-500">Time slots</p>
              <div className="mt-2"><Chips items={TIME_SLOTS} selected={form.availabilitySlots} onToggle={(v) => toggleArr("availabilitySlots", v)} /></div>
              <div className="mt-5 max-w-sm">
                <Label className="flex items-center gap-1.5 text-xs"><Clock className="h-3.5 w-3.5 text-gold" /> Working hours</Label>
                <Input value={form.availabilityHours} onChange={(e) => set("availabilityHours", e.target.value)} placeholder="e.g. 10:00 AM - 6:00 PM" className="mt-1.5 h-10" />
              </div>
            </SettingsCard>
          </TabsContent>

          {/* ---- NOTIFICATIONS ---- */}
          <TabsContent value="notifications" className="mt-5 space-y-5">
            <SettingsCard icon={Bell} title="Notifications" description="Choose what WakeelHub alerts you about.">
              <ToggleGroup>
                <Toggle label="New booking requests" description="When a client requests a consultation." checked={form.notifyBookings} onChange={(v) => set("notifyBookings", v)} />
                <Toggle label="New messages" description="When a client sends you a message." checked={form.notifyMessages} onChange={(v) => set("notifyMessages", v)} />
                <Toggle label="Payment updates" description="When a payment is received or its status changes." checked={form.notifyPayments} onChange={(v) => set("notifyPayments", v)} />
                <Toggle label="Hearing reminders" description="Reminders ahead of scheduled court hearings." checked={form.hearingReminders} onChange={(v) => set("hearingReminders", v)} />
                <Toggle label="Subscription alerts" description="We always remind you before your plan expires." checked disabled onChange={() => {}} />
              </ToggleGroup>
            </SettingsCard>
          </TabsContent>

          {/* ---- PRIVACY ---- */}
          <TabsContent value="privacy" className="mt-5 space-y-5">
            <SettingsCard icon={Shield} title="Privacy & public visibility" description="Control what appears on your public advocate profile.">
              <ToggleGroup>
                <Toggle label="Show phone number publicly" description="Clients can see your phone number on your profile." checked={form.showPhone} onChange={(v) => set("showPhone", v)} />
                <Toggle label="Show email publicly" description="Clients can see your email address on your profile." checked={form.showEmail} onChange={(v) => set("showEmail", v)} />
                <Toggle label="Show office address" description="Your office address appears once you add it on your profile." checked={Boolean(meta.publicLive)} disabled onChange={() => {}} comingSoon />
                <Toggle label="Show profile in search results" description="Verified profiles are automatically listed in the public directory." checked={meta.isVerified} disabled onChange={() => {}} comingSoon />
                <Toggle label="Accept public inquiries" description="Allow clients to send booking requests from your public profile." checked disabled onChange={() => {}} comingSoon />
              </ToggleGroup>
            </SettingsCard>
          </TabsContent>

          {/* ---- SECURITY ---- */}
          <TabsContent value="security" className="mt-5 space-y-5">
            <SettingsCard icon={KeyRound} title="Change password" description="Use at least 6 characters. You'll stay signed in on this device.">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">New password</Label>
                  <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Confirm new password</Label>
                  <Input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Re-enter password" autoComplete="new-password" className="h-10" />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={savePassword} disabled={changingPw || !pw} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  {changingPw && <Loader2 className="h-4 w-4 animate-spin" />} Update password
                </Button>
              </div>
            </SettingsCard>

            <SettingsCard icon={Shield} title="Account" description="Your sign-in details and account status.">
              <dl className="divide-y divide-slate-100">
                <InfoRow label="Email">{settings.email}</InfoRow>
                <InfoRow label="Account status">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", meta.isVerified ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700")}>
                    <CheckCircle2 className="h-3 w-3" /> {meta.isVerified ? "Verified & active" : "Active"}
                  </span>
                </InfoRow>
                {settings.lastSignInAt && <InfoRow label="Last sign-in">{formatDateTime(settings.lastSignInAt)}</InfoRow>}
                {settings.accountCreatedAt && <InfoRow label="Member since">{formatDate(settings.accountCreatedAt)}</InfoRow>}
              </dl>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={signOut} className="gap-2"><LogOut className="h-4 w-4" /> Sign out</Button>
              </div>
            </SettingsCard>

            <Card className="border-rose-200 bg-rose-50/40 p-5 ring-0">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600"><AlertTriangle className="h-4.5 w-4.5" /></span>
                <div className="min-w-0">
                  <h3 className="font-heading text-sm font-semibold text-rose-700">Danger zone</h3>
                  <p className="mt-0.5 text-xs leading-5 text-rose-600/90">Deleting your account removes your public profile and is permanent. Our support team verifies every request.</p>
                  <Button onClick={requestDeletion} variant="outline" size="sm" className="mt-3 gap-1.5 border-rose-300 bg-white text-rose-600 hover:bg-rose-50">
                    <Trash2 className="h-4 w-4" /> Delete account
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* ---- SUBSCRIPTION ---- */}
          <TabsContent value="subscription" className="mt-5 space-y-5">
            <SubscriptionCard subscription={subscription} publicLive={meta.publicLive} />
          </TabsContent>
        </Tabs>

        {/* Sticky save bar - only on tabs that edit settings */}
        {FORM_TABS.has(tab) && (
          <div className="sticky bottom-4 z-10 mt-5 flex justify-end">
            <Button onClick={save} disabled={saving} className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save settings
            </Button>
          </div>
        )}
      </div>

      {/* ---- SIDEBAR ---- */}
      <aside className="space-y-5">
        <Card className="border-slate-200 p-5 ring-0">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-semibold text-slate-950">Profile completion</h3>
            <span className="text-sm font-semibold text-primary">{meta.completionPct}%</span>
          </div>
          <Progress value={meta.completionPct} className="mt-3 h-2 bg-slate-100" />
          <p className="mt-2 text-xs text-slate-500">A complete, verified profile ranks higher in search.</p>
          <Button asChild variant="outline" size="sm" className="mt-3 w-full gap-1.5">
            <Link href="/dashboard/lawyer/profile">Improve profile</Link>
          </Button>
        </Card>

        <Card className="border-slate-200 p-5 ring-0">
          <h3 className="font-heading text-sm font-semibold text-slate-950">Status</h3>
          <div className="mt-3 space-y-2.5">
            <StatusRow icon={BadgeCheck} label="Verification" value={verifyLabel(meta.verificationStatus)} tone={meta.isVerified ? "emerald" : "amber"} />
            <StatusRow icon={Crown} label="Subscription" value={subscription?.status === "active" && !subscription.expired ? planLabel(subscription.plan) : "Free plan"} tone={subscription?.status === "active" && !subscription.expired ? "amber" : "slate"} />
            <StatusRow icon={Globe} label="Public profile" value={meta.publicLive ? "Live" : "Not public"} tone={meta.publicLive ? "emerald" : "slate"} />
          </div>
          {meta.publicLive && (
            <Button asChild variant="outline" size="sm" className="mt-3 w-full gap-1.5">
              <a href={`/lawyers/${meta.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5" /> View public profile</a>
            </Button>
          )}
        </Card>
      </aside>
    </div>
  );
}

// ---- subscription card ----------------------------------------------------
function SubscriptionCard({ subscription, publicLive }: { subscription: SettingsSubscription | null; publicLive: boolean }) {
  const active = subscription?.status === "active" && !subscription.expired;

  if (!active) {
    return (
      <Card className="border-slate-200 p-6 ring-0">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Crown className="h-5 w-5" /></span>
          <div>
            <h3 className="font-heading text-base font-semibold text-slate-950">You&apos;re on the free plan</h3>
            <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
              Upgrade to a Pro subscription for better search placement, featured visibility, and a stronger public profile.
            </p>
            <Button asChild className="mt-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/dashboard/lawyer/billing"><Crown className="h-4 w-4" /> Upgrade subscription</Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 p-6 ring-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Crown className="h-5 w-5" /></span>
          <div>
            <h3 className="font-heading text-base font-semibold text-slate-950">{planLabel(subscription!.plan)} plan</h3>
            <p className="text-xs text-slate-500">{subscription!.period ? `Billed ${subscription!.period}` : "Active subscription"}</p>
          </div>
        </div>
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium", subscription!.expiringSoon ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700")}>
          <CheckCircle2 className="h-3 w-3" /> {subscription!.expiringSoon ? "Expiring soon" : "Active"}
        </span>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
        <SubRow label="Status">{subscription!.expired ? "Expired" : "Active"}</SubRow>
        <SubRow label="Renews / expires">{subscription!.expiresAt ? formatDate(subscription!.expiresAt) : "No expiry"}</SubRow>
        <SubRow label="Days remaining">{subscription!.daysRemaining !== null ? `${subscription!.daysRemaining} days` : "-"}</SubRow>
        <SubRow label="Public visibility">{publicLive ? "Live in directory" : "Not public yet"}</SubRow>
      </dl>

      <div className="mt-5 flex justify-end">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/dashboard/lawyer/billing"><Wallet className="h-4 w-4" /> Manage subscription</Link>
        </Button>
      </div>
    </Card>
  );
}

// ---- helpers --------------------------------------------------------------
function planLabel(plan: string | null) {
  if (!plan) return "Pro";
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

function verifyLabel(status: LawyerVerificationStatus) {
  return status === "approved" ? "Verified" : status === "pending" ? "Under review" : status === "rejected" ? "Rejected" : "Not submitted";
}

function SettingsCard({ icon: Icon, title, description, children }: { icon: LucideIcon; title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card className="border-slate-200 p-5 ring-0">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 text-primary"><Icon className="h-4.5 w-4.5" /></span>
        <div>
          <h3 className="font-heading text-sm font-semibold text-slate-950">{title}</h3>
          {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

function NumField({ icon: Icon, label, value, onChange, helper }: { icon?: LucideIcon; label: string; value: string; onChange: (v: string) => void; helper?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs">{Icon && <Icon className="h-3.5 w-3.5 text-gold" />} {label}</Label>
      <Input type="number" min={0} value={value} onChange={(e) => onChange(e.target.value)} className="h-10" />
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  );
}

function ToggleGroup({ children }: { children: React.ReactNode }) {
  return <div className="divide-y divide-slate-100">{children}</div>;
}

function Toggle({ label, description, checked, onChange, disabled, comingSoon }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; comingSoon?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Label className={cn("text-sm font-medium text-slate-900", disabled && "text-slate-500")}>{label}</Label>
          {comingSoon && <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">Coming soon</span>}
        </div>
        {description && <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} aria-label={label} />
    </div>
  );
}

function Chips({ items, selected, onToggle }: { items: readonly string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => {
        const active = selected.includes(it);
        return (
          <button
            key={it}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(it)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              active ? "border-primary bg-primary text-primary-foreground" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            {it}
          </button>
        );
      })}
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0 text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-900">{children}</dd>
    </div>
  );
}

function SubRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-900">{children}</dd>
    </div>
  );
}

type StatusTone = "emerald" | "amber" | "slate";
const STATUS_TONES: Record<StatusTone, string> = {
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  slate: "bg-slate-100 text-slate-500",
};

function StatusRow({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: string; tone: StatusTone }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-sm text-slate-600">
        <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", STATUS_TONES[tone])}><Icon className="h-3.5 w-3.5" /></span>
        {label}
      </span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}
