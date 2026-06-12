"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Mail, Lock, Eye, EyeOff, User, Phone, MapPin, ShieldCheck, Loader2,
  ArrowLeft, ArrowRight, Briefcase, CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { CITIES, PRACTICE_AREAS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Tab = "login" | "signup";
type Role = "client" | "lawyer";

const ROLE_HOME: Record<string, string> = { client: "/dashboard/client", lawyer: "/dashboard/lawyer", admin: "/dashboard/admin" };
const easeOut = [0.22, 1, 0.36, 1] as const;
const pill = "h-12 rounded-xl border-slate-200 bg-white/80 pl-11 pr-4 text-sm shadow-sm shadow-slate-950/[0.03] transition-all duration-200 hover:border-gold/40 hover:bg-white focus-visible:border-gold/70 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-gold/15";
const selectPill = "mt-1.5 h-12 rounded-xl border-slate-200 bg-white/80 shadow-sm shadow-slate-950/[0.03] transition-all hover:border-gold/40 hover:bg-white data-[state=open]:border-gold/60 data-[state=open]:ring-4 data-[state=open]:ring-gold/15";

function isTaken(msg: string) {
  return /already|registered|exists/i.test(msg);
}

// ---- small building blocks ------------------------------------------------
function FieldIcon({ icon: Icon }: { icon: typeof Mail }) {
  return <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" aria-hidden />;
}
function ErrText({ children }: { children?: string }) {
  return children ? <p className="mt-1 px-1 text-xs font-medium text-destructive">{children}</p> : null;
}
function Field({ label, icon, error, children }: { label: string; icon: typeof Mail; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="px-1 text-xs">{label}</Label>
      <div className="group relative mt-1.5">
        <FieldIcon icon={icon} />
        {children}
      </div>
      <ErrText>{error}</ErrText>
    </div>
  );
}

// ===========================================================================
export function AuthCard({ initialTab = "login", initialRole, isNew = false }: { initialTab?: Tab; initialRole?: Role; isNew?: boolean }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const reduce = useReducedMotion();

  return (
    <div className="w-full">
      {/* tabs */}
      <div className="relative mb-7 grid grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-slate-100/70 p-1 shadow-inner shadow-slate-950/[0.03]">
        {(["login", "signup"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn("relative z-10 rounded-xl py-2.5 text-sm font-semibold transition-colors", tab === t ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            {tab === t && (
              <motion.span layoutId="auth-tab" className="absolute inset-0 -z-10 rounded-xl bg-primary shadow-lg shadow-primary/20" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
            )}
            {t === "login" ? "Log in" : "Create account"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "login" ? (
          <motion.div key="login" initial={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }} transition={{ duration: 0.3, ease: easeOut }}>
            <LoginPanel isNew={isNew} onSwitch={() => setTab("signup")} />
          </motion.div>
        ) : (
          <motion.div key="signup" initial={reduce ? { opacity: 0 } : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: 16 }} transition={{ duration: 0.3, ease: easeOut }}>
            <SignupPanel initialRole={initialRole} onSwitch={() => setTab("login")} />
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] leading-5 text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-gold" />
        Your information is encrypted and protected. WakeelHub never shares private case details without permission.
      </p>
    </div>
  );
}

// ===========================================================================
function LoginPanel({ isNew, onSwitch }: { isNew: boolean; onSwitch: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<{ email?: string; password?: string }>({});

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof err = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address";
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    setErr(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      setErr({ password: "Invalid email or password." });
      toast.error("Sign in failed", { description: error.message === "Invalid login credentials" ? "No account matches those details. Check them or create an account." : error.message });
      return;
    }
    const { data: profile } = data.user ? await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle() : { data: null };
    const role = ((profile as { role?: string } | null)?.role ?? (data.user?.user_metadata?.role as string) ?? "client");
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("redirectTo");
    const dest = requested?.startsWith("/dashboard") && requested.split("/")[2] === role ? requested : ROLE_HOME[role] ?? "/dashboard/client";
    toast.success(isNew ? "Welcome to WakeelHub!" : "Welcome back!", { description: "Redirecting to your dashboard..." });
    router.push(dest);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="mb-2">
        <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{isNew ? "Welcome to WakeelHub" : "Welcome back"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{isNew ? "Confirm your email if prompted, then log in." : "Log in to manage your legal matters."}</p>
      </div>

      <Field label="Email address" icon={Mail} error={err.email}>
        <Input type="email" autoComplete="email" placeholder="you@example.com" className={pill} value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>

      <div>
        <div className="flex items-center justify-between px-1">
          <Label className="text-xs">Password</Label>
          <Link href="/contact" className="text-xs font-medium text-primary underline-offset-4 hover:underline">Forgot password?</Link>
        </div>
        <div className="group relative mt-1.5">
          <FieldIcon icon={Lock} />
          <Input type={show ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" className={`${pill} pr-11`} value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <ErrText>{err.password}</ErrText>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 px-1">
        <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
        <span className="text-sm text-muted-foreground">Keep me signed in</span>
      </label>

      <SubmitButton loading={loading} icon={ArrowRight}>{loading ? "Signing in..." : "Log in"}</SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        New to WakeelHub?{" "}
        <button type="button" onClick={onSwitch} className="font-medium text-primary underline-offset-4 hover:underline">Create an account</button>
      </p>
    </form>
  );
}

// ===========================================================================
function SignupPanel({ initialRole, onSwitch }: { initialRole?: Role; onSwitch: () => void }) {
  const [role, setRole] = useState<Role | null>(initialRole ?? null);
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {!role ? (
        <motion.div key="role" initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: easeOut }}>
          <RoleSelect onPick={setRole} onSwitch={onSwitch} />
        </motion.div>
      ) : (
        <motion.div key={role} initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: easeOut }}>
          {role === "client" ? <ClientForm onBack={() => setRole(null)} /> : <LawyerForm onBack={() => setRole(null)} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RoleSelect({ onPick, onSwitch }: { onPick: (r: Role) => void; onSwitch: () => void }) {
  const roles = [
    { key: "client" as Role, icon: User, title: "I need legal help", subtitle: "Join as a client", desc: "Find advocates, book consultations and track your cases." },
    { key: "lawyer" as Role, icon: Briefcase, title: "I want to receive clients", subtitle: "Join as a lawyer", desc: "Build your verified profile and grow your practice." },
  ];
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">First, tell us how you&apos;ll use WakeelHub.</p>
      </div>
      <div className="space-y-3">
        {roles.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => onPick(r.key)}
            className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors group-hover:bg-gold/15 group-hover:text-gold-foreground">
              <r.icon className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.subtitle} - {r.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </button>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="font-medium text-primary underline-offset-4 hover:underline">Log in</button>
      </p>
    </div>
  );
}

// ---- shared signup field state -------------------------------------------
interface BaseErrors { fullName?: string; phone?: string; email?: string; password?: string; city?: string; terms?: string; barCouncilNumber?: string; primaryPracticeArea?: string }

function validateBase(v: { fullName: string; phone: string; email: string; password: string; city: string; terms: boolean }): BaseErrors {
  const e: BaseErrors = {};
  if (v.fullName.trim().length < 3) e.fullName = "Enter your full name";
  if (v.phone.trim().length < 10) e.phone = "Enter a valid phone number";
  if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email address";
  if (v.password.length < 6) e.password = "At least 6 characters";
  if (!v.city) e.city = "Select your city";
  if (!v.terms) e.terms = "Please accept the terms";
  return e;
}

function ClientForm({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const [f, setF] = useState({ fullName: "", phone: "", email: "", password: "", city: "" });
  const [terms, setTerms] = useState(false);
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<BaseErrors>({});
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = validateBase({ ...f, terms });
    setErr(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: f.email, password: f.password,
      options: { emailRedirectTo: `${window.location.origin}/login`, data: { full_name: f.fullName, phone: f.phone, city: f.city, role: "client" } },
    });
    if (error) {
      setLoading(false);
      if (isTaken(error.message)) setErr({ email: "An account with this email already exists." });
      toast.error("Could not create account", { description: isTaken(error.message) ? "Try logging in instead." : error.message });
      return;
    }
    if (data.session) {
      toast.success("Account created", { description: `Welcome to WakeelHub, ${f.fullName.split(" ")[0]}!` });
      router.push("/dashboard/client"); router.refresh(); return;
    }
    toast.success("Confirm your email", { description: `We sent a link to ${f.email}.` });
    router.push("/login?new=1");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <SignupHeader onBack={onBack} title="Client account" subtitle="Find & hire trusted advocates" icon={User} />
      <Field label="Full name" icon={User} error={err.fullName}><Input className={pill} placeholder="Your full name" autoComplete="name" value={f.fullName} onChange={(e) => set("fullName", e.target.value)} /></Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Phone" icon={Phone} error={err.phone}><Input type="tel" className={pill} placeholder="03XX XXXXXXX" autoComplete="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
        <CityField value={f.city} onChange={(v) => set("city", v)} error={err.city} />
      </div>
      <Field label="Email" icon={Mail} error={err.email}><Input type="email" className={pill} placeholder="you@example.com" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></Field>
      <PasswordField value={f.password} onChange={(v) => set("password", v)} error={err.password} show={show} setShow={setShow} />
      <TermsRow checked={terms} onChange={setTerms} error={err.terms} />
      <SubmitButton loading={loading} icon={CheckCircle2}>{loading ? "Creating account..." : "Create client account"}</SubmitButton>
    </form>
  );
}

function LawyerForm({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const [f, setF] = useState({ fullName: "", phone: "", email: "", password: "", city: "", barCouncilNumber: "", primaryPracticeArea: "" });
  const [terms, setTerms] = useState(false);
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<BaseErrors>({});
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = validateBase({ ...f, terms });
    if (f.barCouncilNumber.trim().length < 3) next.barCouncilNumber = "Enter your enrollment number";
    if (!f.primaryPracticeArea) next.primaryPracticeArea = "Select a practice area";
    setErr(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: f.email, password: f.password,
      options: { emailRedirectTo: `${window.location.origin}/login`, data: { full_name: f.fullName, phone: f.phone, city: f.city, role: "lawyer", bar_council_number: f.barCouncilNumber, practice_area_slugs: [f.primaryPracticeArea] } },
    });
    if (error) {
      setLoading(false);
      if (isTaken(error.message)) setErr({ email: "An account with this email already exists." });
      toast.error("Could not create account", { description: isTaken(error.message) ? "Try logging in instead." : error.message });
      return;
    }
    if (data.session) {
      toast.success("Welcome to WakeelHub", { description: "Let's set up your profile and verification." });
      router.push("/dashboard/lawyer/profile"); router.refresh(); return;
    }
    toast.success("Confirm your email", { description: `We sent a link to ${f.email}.` });
    router.push("/login?new=1");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <SignupHeader onBack={onBack} title="Lawyer account" subtitle="Grow your practice online" icon={Briefcase} />
      <Field label="Full name" icon={User} error={err.fullName}><Input className={pill} placeholder="Your professional name" autoComplete="name" value={f.fullName} onChange={(e) => set("fullName", e.target.value)} /></Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Phone" icon={Phone} error={err.phone}><Input type="tel" className={pill} placeholder="03XX XXXXXXX" autoComplete="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
        <CityField value={f.city} onChange={(v) => set("city", v)} error={err.city} />
      </div>
      <Field label="Email" icon={Mail} error={err.email}><Input type="email" className={pill} placeholder="you@example.com" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Bar Council enrollment no." icon={ShieldCheck} error={err.barCouncilNumber}><Input className={pill} placeholder="e.g. PBC-12345-A" value={f.barCouncilNumber} onChange={(e) => set("barCouncilNumber", e.target.value)} /></Field>
        <div>
          <Label className="px-1 text-xs">Primary practice area</Label>
          <Select value={f.primaryPracticeArea || undefined} onValueChange={(v) => set("primaryPracticeArea", v)}>
            <SelectTrigger className={selectPill}><SelectValue placeholder="Select area" /></SelectTrigger>
            <SelectContent>{PRACTICE_AREAS.map((a) => <SelectItem key={a.slug} value={a.slug}>{a.name}</SelectItem>)}</SelectContent>
          </Select>
          <ErrText>{err.primaryPracticeArea}</ErrText>
        </div>
      </div>
      <PasswordField value={f.password} onChange={(v) => set("password", v)} error={err.password} show={show} setShow={setShow} />
      <TermsRow checked={terms} onChange={setTerms} error={err.terms} />
      <SubmitButton loading={loading} icon={CheckCircle2}>{loading ? "Creating account..." : "Create lawyer account"}</SubmitButton>
    </form>
  );
}

// ---- shared signup bits ---------------------------------------------------
function SignupHeader({ onBack, title, subtitle, icon: Icon }: { onBack: () => void; title: string; subtitle: string; icon: typeof User }) {
  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={onBack} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Change role">
        <ArrowLeft className="h-4 w-4" />
      </button>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 text-primary"><Icon className="h-4.5 w-4.5" /></span>
      <div>
        <p className="font-heading text-base font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function CityField({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <div>
      <Label className="px-1 text-xs">City</Label>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger className={cn(selectPill, "gap-2")}>
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
          <SelectValue placeholder="Select city" />
        </SelectTrigger>
        <SelectContent>{CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
      </Select>
      <ErrText>{error}</ErrText>
    </div>
  );
}

function PasswordField({ value, onChange, error, show, setShow }: { value: string; onChange: (v: string) => void; error?: string; show: boolean; setShow: (f: (s: boolean) => boolean) => void }) {
  return (
    <div>
      <Label className="px-1 text-xs">Password</Label>
      <div className="group relative mt-1.5">
        <FieldIcon icon={Lock} />
        <Input type={show ? "text" : "password"} autoComplete="new-password" placeholder="At least 6 characters" className={`${pill} pr-11`} value={value} onChange={(e) => onChange(e.target.value)} />
        <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={show ? "Hide password" : "Show password"}>
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <ErrText>{error}</ErrText>
    </div>
  );
}

function TermsRow({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-2.5 px-1">
        <Checkbox checked={checked} onCheckedChange={(v) => onChange(!!v)} className="mt-0.5" />
        <span className="text-sm leading-5 text-muted-foreground">
          I agree to WakeelHub&apos;s{" "}
          <Link href="/terms" className="font-medium text-primary underline-offset-4 hover:underline">Terms</Link> and{" "}
          <Link href="/privacy" className="font-medium text-primary underline-offset-4 hover:underline">Privacy Policy</Link>.
        </span>
      </label>
      <ErrText>{error}</ErrText>
    </div>
  );
}

function SubmitButton({ loading, icon: Icon, children }: { loading: boolean; icon: typeof ArrowRight; children: React.ReactNode }) {
  return (
    <motion.div whileHover={loading ? undefined : { y: -2 }} whileTap={loading ? undefined : { scale: 0.99 }} transition={{ duration: 0.16, ease: easeOut }}>
      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="group h-12 w-full gap-2 rounded-xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/25 disabled:opacity-80"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
        {children}
      </Button>
    </motion.div>
  );
}
