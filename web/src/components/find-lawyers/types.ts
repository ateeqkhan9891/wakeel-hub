import type { AvailabilityDay } from "@/lib/types";

export interface Filters {
  query: string;
  cities: string[];
  provinces: string[];
  practiceAreas: string[];
  experience: string | null;
  fee: string | null;
  languages: string[];
  genders: string[];
  minRating: number | null;
  availabilityDay: AvailabilityDay | null;
  sortBy: string;
}

export const emptyFilters: Filters = {
  query: "",
  cities: [],
  provinces: [],
  practiceAreas: [],
  experience: null,
  fee: null,
  languages: [],
  genders: [],
  minRating: null,
  availabilityDay: null,
  sortBy: "rating",
};
