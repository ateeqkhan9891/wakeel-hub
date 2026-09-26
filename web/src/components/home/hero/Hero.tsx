"use client";

import { useMemo, useState } from "react";

import Link from "next/link";


import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

import {
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  COURTS_BY_CITY,
  type City,
} from "@/lib/constants";

import {
  POPULAR_SEARCHES,
  TOP_COURTS,
  fadeUp,
} from "./hero.constants";

import { HeroAdvocates } from "./HeroAdvocates";
import { HeroSearch } from "./HeroSearch";
import { HeroSidebar } from "./HeroSidebar";
import { HeroTrustIndicators } from "./HeroTrustIndicators";

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
          fontFamily:
            '"Segoe Script", "Brush Script MT", "Lucida Handwriting", cursive',
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

export function Hero({
  advocates = [],
}: {
  advocates?: AdvocateMatch[];
}) {
  const router = useRouter();

  const [practiceArea, setPracticeArea] = useState("");
  const [city, setCity] = useState("");
  const [court, setCourt] = useState("");
  const [language, setLanguage] = useState("");
  const [feeRange, setFeeRange] = useState("");

  const courtOptions = useMemo<readonly string[]>(() => {
    if (city && city in COURTS_BY_CITY) {
      return COURTS_BY_CITY[city as City];
    }

    return TOP_COURTS;
  }, [city]);

  function handleCityChange(nextCity: string) {
    setCity(nextCity);
    setCourt("");
  }

  function runSearch(selectedPracticeArea = practiceArea) {
    const params = new URLSearchParams();

    if (selectedPracticeArea) {
      params.set("practiceArea", selectedPracticeArea);
    }

    if (city) {
      params.set("city", city);
    }

    if (court) {
      params.set("court", court);
    }

    if (language) {
      params.set("language", language);
    }

    if (feeRange) {
      params.set("fee", feeRange);
    }

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
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(15,23,42,0.06),transparent_34rem)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-20">
        <JusticeWatermark />

        <motion.div
          {...fadeUp}
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm">
            <ShieldCheck
              className="h-4 w-4 text-gold-foreground"
              aria-hidden
            />

            Verified by Pakistan Bar Councils
          </span>

          <h1 className="mt-6 text-balance font-heading text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.04]">
                Find the{" "}
                <span className="relative inline-block px-2">
                    <motion.span
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                        pathLength: {
                        duration: 1.2,
                        ease: "easeInOut",
                        },
                        opacity: {
                        duration: 0.2,
                        },
                    }}
                    className="pointer-events-none absolute -inset-x-1 -inset-y-1 rounded-lg border-2 border-gold/60"
                    aria-hidden
                    />

                    <span className="relative z-10 text-gold-foreground">
                    right lawyer
                    </span>
                </span>{" "}
                for your legal matter
                </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Search verified advocates across Pakistan by practice area,
            city, court, language, and fee. Compare real profiles, book
            consultations, and manage your matter from one secure platform.
          </p>
        </motion.div>

        <HeroSearch
          practiceArea={practiceArea}
          city={city}
          court={court}
          language={language}
          feeRange={feeRange}
          courtOptions={courtOptions}
          onPracticeAreaChange={setPracticeArea}
          onCityChange={handleCityChange}
          onCourtChange={setCourt}
          onLanguageChange={setLanguage}
          onFeeRangeChange={setFeeRange}
          onSubmit={handleSubmit}
          onPopularSearch={handlePopularSearch}
        />

        <div className="relative z-10 mt-4 flex justify-end">
          <Button
            asChild
            variant="ghost"
            className="rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-950"
          >
            <Link href="/register/lawyer">
              Register as Advocate
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <HeroTrustIndicators />

        <div className="relative z-10 mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <HeroAdvocates advocates={advocates} />

          <HeroSidebar />
        </div>
      </div>
    </section>
  );
}