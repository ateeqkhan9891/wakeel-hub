"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CITIES, PROVINCES, PRACTICE_AREAS, LANGUAGES, GENDERS,
  EXPERIENCE_RANGES, FEE_RANGES,
} from "@/lib/constants";
import type { Filters } from "@/components/find-lawyers/types";

export function FiltersSidebar({
  filters,
  onChange,
  onReset,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
}) {
  function toggle<K extends "cities" | "provinces" | "practiceAreas" | "languages" | "genders">(
    key: K,
    value: string
  ) {
    const current = filters[key] as string[];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ ...filters, [key]: next });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-foreground">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onReset} className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
          Reset all
        </Button>
      </div>
      <Separator className="my-4" />

      <Accordion type="multiple" defaultValue={["city", "practiceArea", "experience", "fee", "rating"]} className="space-y-1">
        <AccordionItem value="city">
          <AccordionTrigger className="text-sm font-medium">City</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2.5">
              {CITIES.map((city) => (
                <FilterCheckbox key={city} id={`city-${city}`} label={city} checked={filters.cities.includes(city)} onChange={() => toggle("cities", city)} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="province">
          <AccordionTrigger className="text-sm font-medium">Province</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5">
              {PROVINCES.map((p) => (
                <FilterCheckbox key={p} id={`prov-${p}`} label={p} checked={filters.provinces.includes(p)} onChange={() => toggle("provinces", p)} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="practiceArea">
          <AccordionTrigger className="text-sm font-medium">Practice Area</AccordionTrigger>
          <AccordionContent>
            <div className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
              {PRACTICE_AREAS.map((area) => (
                <FilterCheckbox key={area.slug} id={`pa-${area.slug}`} label={area.name} checked={filters.practiceAreas.includes(area.slug)} onChange={() => toggle("practiceAreas", area.slug)} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience">
          <AccordionTrigger className="text-sm font-medium">Experience</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5">
              {EXPERIENCE_RANGES.map((range) => (
                <FilterCheckbox
                  key={range.label}
                  id={`exp-${range.label}`}
                  label={range.label}
                  checked={filters.experience === range.label}
                  onChange={() => onChange({ ...filters, experience: filters.experience === range.label ? null : range.label })}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="fee">
          <AccordionTrigger className="text-sm font-medium">Consultation Fee</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5">
              {FEE_RANGES.map((range) => (
                <FilterCheckbox
                  key={range.label}
                  id={`fee-${range.label}`}
                  label={range.label}
                  checked={filters.fee === range.label}
                  onChange={() => onChange({ ...filters, fee: filters.fee === range.label ? null : range.label })}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="language">
          <AccordionTrigger className="text-sm font-medium">Language</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2.5">
              {LANGUAGES.map((lang) => (
                <FilterCheckbox key={lang} id={`lang-${lang}`} label={lang} checked={filters.languages.includes(lang)} onChange={() => toggle("languages", lang)} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="gender">
          <AccordionTrigger className="text-sm font-medium">Gender</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5">
              {GENDERS.map((g) => (
                <FilterCheckbox key={g} id={`gender-${g}`} label={g} checked={filters.genders.includes(g)} onChange={() => toggle("genders", g)} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger className="text-sm font-medium">Minimum Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5">
              {[4.5, 4, 3.5].map((r) => (
                <FilterCheckbox
                  key={r}
                  id={`rating-${r}`}
                  label={`${r}+ stars`}
                  checked={filters.minRating === r}
                  onChange={() => onChange({ ...filters, minRating: filters.minRating === r ? null : r })}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger className="text-sm font-medium">Availability</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2.5">
              {(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const).map((day) => (
                <FilterCheckbox
                  key={day}
                  id={`day-${day}`}
                  label={day}
                  checked={filters.availabilityDay === day}
                  onChange={() => onChange({ ...filters, availabilityDay: filters.availabilityDay === day ? null : day })}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function FilterCheckbox({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="cursor-pointer text-sm font-normal text-muted-foreground">
        {label}
      </Label>
    </div>
  );
}

