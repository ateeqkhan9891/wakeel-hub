"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Layers3,
  Languages,
  Landmark,
  LockKeyhole,
  MapPin,
  MessageSquareText,
  Scale,
  Search,
  ShieldCheck,
  Star,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CITIES, COURTS_BY_CITY, FEE_RANGES, LANGUAGES, PRACTICE_AREAS, type City } from "@/lib/constants";
import { cn } from "@/lib/utils";

const POPULAR_SEARCHES = [
  { label: "Family Law", value: "family-law" },
  { label: "Property Law", value: "property-law" },
  { label: "Criminal Law", value: "criminal-law" },
  { label: "Corporate Law", value: "corporate-law" },
] as const;

const TOP_COURTS: readonly string[] = [
  "Lahore High Court",
  "Sindh High Court",
  "Islamabad High Court",
  "Peshawar High Court",
  "District Court Lahore",
  "District Court Islamabad",
] as const;

export interface AdvocateMatch {
  name: string;
  initials: string;
  slug: string;
  city: string;
  area: string;
  court: string;
  fee: string;
  availability: string;
  rating: string;
}

const COVERAGE_CITIES = ["Islamabad", "Lahore", "Karachi", "Peshawar", "Rawalpindi", "Quetta"] as const;

const WORKFLOW_STEPS = [
  { label: "Search", description: "Filter by court, city, fee, and specialty.", icon: Search },
  { label: "Verify", description: "Review Bar Council checked profiles.", icon: ShieldCheck },
  { label: "Consult", description: "Book online or office consultations.", icon: CalendarCheck2 },
] as const;

const TRUST_INDICATORS: readonly { title: string; subtitle: string; icon: LucideIcon }[] = [
  {
    title: "Verified Lawyer Profiles",
    subtitle: "Bar Council Verification",
    icon: ShieldCheck,
  },
  {
    title: "Multiple Practice Areas",
    subtitle: "Family, Property, Criminal & More",
    icon: Layers3,
  },
  {
    title: "Secure Consultations",
    subtitle: "Protected Communication",
    icon: LockKeyhole,
  },
  {
    title: "Nationwide Coverage",
    subtitle: "Major Cities Across Pakistan",
    icon: Landmark,
  },
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut" },
} as const;

function JusticeWatermark() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1280 300"
      className="pointer-events-none absolute left-1/2 top-16 z-0 w-[90%] max-w-[1200px] -translate-x-1/2 select-none text-gold opacity-[0.045] sm:top-12 sm:w-[88%] lg:top-8"
    >
      <text
        x="640"
        y="173"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2.5"
        textAnchor="middle"
        style={{
          fontFamily: '"Segoe Script", "Brush Script MT", "Lucida Handwriting", cursive',
          fontSize: 156,
          fontStyle: "italic",
          fontWeight: 400,
          letterSpacing: 9,
        }}
      >
        JUSTICE
      </text>
      <path
        d="M170 205 C350 240 596 226 770 217 C912 210 1048 219 1130 238"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="9"
      />
    </svg>
  );
}

function SearchControl({
  icon: Icon,
  label,
  children,
  className,
}: {
  icon: typeof Search;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 border-b border-slate-200 pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-4", className)}>
      <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon className="h-3.5 w-3.5 text-slate-400" aria-hidden />
        {label}
      </div>
      {children}
    </div>
  );
}

function CleanSelect({
  value,
  onChange,
  placeholder,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  children: ReactNode;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-full border-0 bg-transparent px-0 text-left text-sm font-semibold text-slate-950 shadow-none focus:ring-0">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}

function AdvocateRow({ advocate }: { advocate: AdvocateMatch }) {
  return (
    <article
      className="group grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-gold/50 hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white">
        {advocate.initials}
      </div>
      <div className="min-w-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-slate-950">{advocate.name}</h3>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                <CheckCircle2 className="h-3 w-3" aria-hidden />
                Verified
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {advocate.area} - {advocate.court}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-800">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden />
            {advocate.rating}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden />
            {advocate.city}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1">
            <WalletCards className="h-3.5 w-3.5 text-slate-400" aria-hidden />
            {advocate.fee}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-1 font-medium text-slate-800">
            <Clock3 className="h-3.5 w-3.5 text-gold-foreground" aria-hidden />
            {advocate.availability}
          </span>
          <Link
            href={`/lawyers/${advocate.slug}`}
            className="ml-auto inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-gold/50 hover:bg-slate-50 hover:text-slate-950"
          >
            View profile
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function Hero({ advocates = [] }: { advocates?: AdvocateMatch[] }) {
  const router = useRouter();
  const [practiceArea, setPracticeArea] = useState("");
  const [city, setCity] = useState("");
  const [court, setCourt] = useState("");
  const [language, setLanguage] = useState("");
  const [feeRange, setFeeRange] = useState("");

  const courtOptions = useMemo<readonly string[]>(() => {
    if (city && city in COURTS_BY_CITY) return COURTS_BY_CITY[city as City];
    return TOP_COURTS;
  }, [city]);

  function handleCityChange(nextCity: string) {
    setCity(nextCity);
    setCourt("");
  }

  function runSearch(selectedPracticeArea = practiceArea) {
    const params = new URLSearchParams();
    if (selectedPracticeArea) params.set("practiceArea", selectedPracticeArea);
    if (city) params.set("city", city);
    if (court) params.set("court", court);
    if (language) params.set("language", language);
    if (feeRange) params.set("fee", feeRange);
    router.push(`/find-lawyers?${params.toString()}`);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runSearch();
  }

  function handlePopularSearch(value: string) {
    setPracticeArea(value);
    runSearch(value);
  }

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#fbfaf7]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(15,23,42,0.06),transparent_34rem)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-20">
        <JusticeWatermark />

        <motion.div {...fadeUp} className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-gold-foreground" aria-hidden />
            Verified by Pakistan Bar Councils
          </span>

          <h1 className="mt-6 text-balance font-heading text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.04]">
            Find the right lawyer for your legal matter
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Search verified advocates across Pakistan by practice area, city, court, language, and fee.
            Compare real profiles, book consultations, and manage your matter from one secure platform.
          </p>
        </motion.div>

        <motion.form
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.12 }}
          role="search"
          aria-label="Search verified advocates"
          onSubmit={handleSubmit}
          className="relative z-10 mx-auto mt-9 max-w-6xl rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-950/8"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.1fr_0.82fr_1fr_0.82fr_0.82fr_auto] md:items-end">
            <SearchControl icon={Scale} label="Practice area">
              <CleanSelect value={practiceArea} onChange={setPracticeArea} placeholder="Family, property, criminal...">
                {PRACTICE_AREAS.map((area) => (
                  <SelectItem key={area.slug} value={area.slug}>
                    {area.name}
                  </SelectItem>
                ))}
              </CleanSelect>
            </SearchControl>

            <SearchControl icon={MapPin} label="City">
              <CleanSelect value={city} onChange={handleCityChange} placeholder="Any city">
                {CITIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </CleanSelect>
            </SearchControl>

            <SearchControl icon={Landmark} label="Court">
              <CleanSelect value={court} onChange={setCourt} placeholder="Any court">
                {courtOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </CleanSelect>
            </SearchControl>

            <SearchControl icon={Languages} label="Language">
              <CleanSelect value={language} onChange={setLanguage} placeholder="Any">
                {LANGUAGES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </CleanSelect>
            </SearchControl>

            <SearchControl icon={WalletCards} label="Fee" className="md:border-r-0 md:pr-0">
              <CleanSelect value={feeRange} onChange={setFeeRange} placeholder="Any fee">
                {FEE_RANGES.map((item) => (
                  <SelectItem key={item.label} value={item.label}>
                    {item.label}
                  </SelectItem>
                ))}
              </CleanSelect>
            </SearchControl>

            <Button type="submit" size="lg" className="h-12 rounded-xl bg-slate-950 px-6 text-white hover:bg-slate-800">
              <Search className="h-4 w-4" aria-hidden />
              Find Lawyer
            </Button>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-500">Popular:</span>
              {POPULAR_SEARCHES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handlePopularSearch(item.value)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-gold/50 hover:bg-gold/10 hover:text-slate-950"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <Button asChild variant="ghost" className="justify-start rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-950 sm:justify-center">
              <Link href="/register/lawyer">
                Register as Advocate
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </motion.form>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
          className="relative z-10 mt-8 grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          {TRUST_INDICATORS.map(({ title, subtitle, icon: Icon }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm shadow-slate-950/5 backdrop-blur transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-gold/40"
            >
              <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-slate-950 sm:h-10 sm:w-10">
                  <Icon className="h-4.5 w-4.5 text-gold-foreground sm:h-5 sm:w-5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="font-heading text-[15px] font-semibold leading-snug text-slate-950 sm:text-base">{title}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-500">{subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="relative z-10 mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.28 }}
            className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-4 shadow-xl shadow-slate-950/5 backdrop-blur"
          >
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Matched advocates</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">Verified lawyers accepting consultations</h2>
              </div>
              {advocates.length > 0 && (
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                  {advocates.length} verified {advocates.length === 1 ? "advocate" : "advocates"}
                </span>
              )}
            </div>

            {advocates.length === 0 ? (
              <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">
                <p className="text-sm font-medium text-slate-700">Verified advocates are joining WakeelHub</p>
                <p className="text-xs text-slate-500">Be the first to list your practice, or browse the directory.</p>
                <Button asChild size="sm" className="bg-slate-950 text-white hover:bg-slate-800">
                  <Link href="/find-lawyers">Browse directory</Link>
                </Button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {advocates.map((advocate) => (
                  <AdvocateRow key={advocate.slug} advocate={advocate} />
                ))}
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 gap-5">
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.34 }}
              className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Landmark className="h-5 w-5 text-gold" aria-hidden />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/55">Court coverage</p>
                  <h2 className="text-lg font-semibold">Across Pakistan</h2>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {COVERAGE_CITIES.map((item) => (
                  <span key={item} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85">
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-white/65">
                High Courts, District Courts, Banking Courts, Family Courts, and specialist tribunals.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.4 }}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">How it works</p>
              <div className="mt-4 space-y-4">
                {WORKFLOW_STEPS.map(({ icon: Icon, label, description }) => (
                  <div key={label} className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold-foreground">
                      <Icon className="h-4 w-4" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{label}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                  <MessageSquareText className="h-4 w-4 text-gold-foreground" aria-hidden />
                  Secure chat and matter tracking included
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
