import type { FormEvent, ReactNode } from "react";

import {
  Languages,
  Landmark,
  MapPin,
  Scale,
  Search,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  CITIES,
  FEE_RANGES,
  LANGUAGES,
  PRACTICE_AREAS,
} from "@/lib/constants";

import { POPULAR_SEARCHES } from "./hero.constants";
import { HeroSearchControl } from "./HeroSearchControl";

interface HeroSearchProps {
  practiceArea: string;
  city: string;
  court: string;
  language: string;
  feeRange: string;
  courtOptions: readonly string[];
  onPracticeAreaChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onCourtChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onFeeRangeChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onPopularSearch: (value: string) => void;
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
      <SelectTrigger className="h-10 w-full border-0 bg-transparent px-0 text-left text-sm font-semibold text-slate-950 shadow-none focus:ring-0 focus:ring-offset-0">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>{children}</SelectContent>
    </Select>
  );
}

export function HeroSearch({
  practiceArea,
  city,
  court,
  language,
  feeRange,
  courtOptions,
  onPracticeAreaChange,
  onCityChange,
  onCourtChange,
  onLanguageChange,
  onFeeRangeChange,
  onSubmit,
  onPopularSearch,
}: HeroSearchProps) {
  return (
    <form
      role="search"
      aria-label="Search verified advocates"
      onSubmit={onSubmit}
      className="relative z-10 mx-auto mt-9 max-w-6xl overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-xl shadow-slate-950/8"
    >
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-gold/[0.035] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950">
            <Search
              className="h-3.5 w-3.5 text-white"
              aria-hidden
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-950">
              Find your lawyer
            </p>

            <p className="text-xs text-slate-500">
              Search verified advocates by your requirements
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.1fr_0.82fr_1fr_0.82fr_0.82fr_auto] md:items-end">
          <HeroSearchControl
            icon={Scale}
            label="Practice area"
          >
            <CleanSelect
              value={practiceArea}
              onChange={onPracticeAreaChange}
              placeholder="Family, property, criminal..."
            >
              {PRACTICE_AREAS.map((area) => (
                <SelectItem
                  key={area.slug}
                  value={area.slug}
                >
                  {area.name}
                </SelectItem>
              ))}
            </CleanSelect>
          </HeroSearchControl>

          <HeroSearchControl
            icon={MapPin}
            label="City"
          >
            <CleanSelect
              value={city}
              onChange={onCityChange}
              placeholder="Any city"
            >
              {CITIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </CleanSelect>
          </HeroSearchControl>

          <HeroSearchControl
            icon={Landmark}
            label="Court"
          >
            <CleanSelect
              value={court}
              onChange={onCourtChange}
              placeholder="Any court"
            >
              {courtOptions.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </CleanSelect>
          </HeroSearchControl>

          <HeroSearchControl
            icon={Languages}
            label="Language"
          >
            <CleanSelect
              value={language}
              onChange={onLanguageChange}
              placeholder="Any"
            >
              {LANGUAGES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </CleanSelect>
          </HeroSearchControl>

        <HeroSearchControl
  icon={WalletCards}
  label="Fee"
  className="md:border-r-0 md:pr-0 opacity-50 pointer-events-none"
>
  <CleanSelect
    value=""
    onChange={() => {}}
    placeholder="Any fee"
  >
    {FEE_RANGES.map((item) => (
      <SelectItem
        key={item.label}
        value={item.label}
      >
        {item.label}
      </SelectItem>
    ))}
  </CleanSelect>
</HeroSearchControl>

          <Button
            type="submit"
            size="lg"
            className="h-12 rounded-xl bg-[#17243a] px-6 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#20324f] hover:shadow-md"
          >
            <Search
              className="h-4 w-4"
              aria-hidden
            />

            Find Lawyer
          </Button>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Popular
            </span>

            <span
              aria-hidden
              className="h-1 w-1 rounded-full bg-gold"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => onPopularSearch(item.value)}
                className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:bg-gold/10 hover:text-slate-950"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
