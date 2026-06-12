"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LawyerCard } from "@/components/shared/lawyer-card";
import { FiltersSidebar } from "@/components/find-lawyers/filters-sidebar";
import { emptyFilters, type Filters } from "@/components/find-lawyers/types";
import { EXPERIENCE_RANGES, FEE_RANGES, PRACTICE_AREAS, SORT_OPTIONS } from "@/lib/constants";
import type { Lawyer } from "@/lib/types";

function applyFilters(items: Lawyer[], filters: Filters) {
  let result = items;

  if (filters.query.trim()) {
    const q = filters.query.trim().toLowerCase();
    result = result.filter(
      (l) =>
        l.fullName.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.courts.some((c) => c.toLowerCase().includes(q)) ||
        l.practiceAreas.some((pa) => PRACTICE_AREAS.find((p) => p.slug === pa)?.name.toLowerCase().includes(q))
    );
  }
  if (filters.cities.length) result = result.filter((l) => filters.cities.includes(l.city));
  if (filters.provinces.length) result = result.filter((l) => filters.provinces.includes(l.province));
  if (filters.practiceAreas.length) result = result.filter((l) => l.practiceAreas.some((pa) => filters.practiceAreas.includes(pa)));
  if (filters.experience) {
    const range = EXPERIENCE_RANGES.find((r) => r.label === filters.experience);
    if (range) result = result.filter((l) => l.experienceYears >= range.min && l.experienceYears <= range.max);
  }
  if (filters.fee) {
    const range = FEE_RANGES.find((r) => r.label === filters.fee);
    if (range) result = result.filter((l) => l.consultationFee >= range.min && l.consultationFee <= range.max);
  }
  if (filters.languages.length) result = result.filter((l) => l.languages.some((lang) => filters.languages.includes(lang)));
  if (filters.genders.length) result = result.filter((l) => filters.genders.includes(l.gender));
  if (filters.minRating) result = result.filter((l) => l.rating >= filters.minRating!);
  if (filters.availabilityDay) result = result.filter((l) => l.availability.days.includes(filters.availabilityDay!));

  return result;
}

function sortLawyers(items: Lawyer[], sortBy: string) {
  const sorted = [...items];
  switch (sortBy) {
    case "experience":
      return sorted.sort((a, b) => b.experienceYears - a.experienceYears);
    case "fee-low":
      return sorted.sort((a, b) => a.consultationFee - b.consultationFee);
    case "fee-high":
      return sorted.sort((a, b) => b.consultationFee - a.consultationFee);
    case "newest":
      return sorted.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime());
    case "rating":
    default:
      return sorted.sort((a, b) => b.rating - a.rating);
  }
}

function activeFilterChips(filters: Filters): { key: string; label: string; clear: (f: Filters) => Filters }[] {
  const chips: { key: string; label: string; clear: (f: Filters) => Filters }[] = [];
  filters.cities.forEach((c) => chips.push({ key: `city-${c}`, label: c, clear: (f) => ({ ...f, cities: f.cities.filter((x) => x !== c) }) }));
  filters.provinces.forEach((p) => chips.push({ key: `prov-${p}`, label: p, clear: (f) => ({ ...f, provinces: f.provinces.filter((x) => x !== p) }) }));
  filters.practiceAreas.forEach((pa) => {
    const name = PRACTICE_AREAS.find((p) => p.slug === pa)?.name ?? pa;
    chips.push({ key: `pa-${pa}`, label: name, clear: (f) => ({ ...f, practiceAreas: f.practiceAreas.filter((x) => x !== pa) }) });
  });
  if (filters.experience) chips.push({ key: "exp", label: filters.experience, clear: (f) => ({ ...f, experience: null }) });
  if (filters.fee) chips.push({ key: "fee", label: filters.fee, clear: (f) => ({ ...f, fee: null }) });
  filters.languages.forEach((l) => chips.push({ key: `lang-${l}`, label: l, clear: (f) => ({ ...f, languages: f.languages.filter((x) => x !== l) }) }));
  filters.genders.forEach((g) => chips.push({ key: `gender-${g}`, label: g, clear: (f) => ({ ...f, genders: f.genders.filter((x) => x !== g) }) }));
  if (filters.minRating) chips.push({ key: "rating", label: `${filters.minRating}+ stars`, clear: (f) => ({ ...f, minRating: null }) });
  if (filters.availabilityDay) chips.push({ key: "day", label: `Available ${filters.availabilityDay}`, clear: (f) => ({ ...f, availabilityDay: null }) });
  return chips;
}

export function FindLawyersClient({
  initialFilters,
  lawyers,
}: {
  initialFilters: Partial<Filters>;
  lawyers: Lawyer[];
}) {
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters, ...initialFilters });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => applyFilters(lawyers, filters), [lawyers, filters]);
  const sorted = useMemo(() => sortLawyers(filtered, filters.sortBy), [filtered, filters.sortBy]);
  const chips = useMemo(() => activeFilterChips(filters), [filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Find a Lawyer</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Browse {lawyers.length}+ verified advocates across Pakistan and filter by what matters most to you.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            placeholder="Search by name, city, court or practice area..."
            className="h-11 rounded-full pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-11 gap-2 rounded-full lg:hidden">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] overflow-y-auto sm:w-[380px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-8">
                <FiltersSidebar filters={filters} onChange={setFilters} onReset={() => setFilters(emptyFilters)} />
              </div>
            </SheetContent>
          </Sheet>

          <Select value={filters.sortBy} onValueChange={(v) => setFilters({ ...filters, sortBy: v })}>
            <SelectTrigger className="h-11 w-[180px] rounded-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <Badge key={chip.key} variant="secondary" className="gap-1.5 rounded-full py-1.5 pl-3 pr-2 font-normal">
              {chip.label}
              <button onClick={() => setFilters(chip.clear(filters))} aria-label={`Remove ${chip.label} filter`} className="rounded-full p-0.5 hover:bg-muted-foreground/15">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <button onClick={() => setFilters(emptyFilters)} className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
            Clear all
          </button>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FiltersSidebar filters={filters} onChange={setFilters} onReset={() => setFilters(emptyFilters)} />
          </div>
        </aside>

        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{sorted.length}</span> {sorted.length === 1 ? "lawyer" : "lawyers"}
          </p>
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
              <p className="font-heading text-lg font-semibold text-foreground">No lawyers match your filters</p>
              <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">Try removing some filters or searching with different keywords.</p>
              <Button variant="outline" className="mt-5" onClick={() => setFilters(emptyFilters)}>
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sorted.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
