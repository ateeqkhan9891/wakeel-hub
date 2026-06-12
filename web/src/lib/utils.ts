import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK")}`
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  })
}

export function formatDateTime(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

/** Compact relative time, e.g. "just now", "3 days ago", "2 months ago". */
export function timeAgo(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date
  const sec = Math.round((Date.now() - d.getTime()) / 1000)
  if (sec < 60) return "just now"
  const min = Math.round(sec / 60)
  if (min < 60) return `${min} min${min === 1 ? "" : "s"} ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`
  const day = Math.round(hr / 24)
  if (day < 30) return `${day} day${day === 1 ? "" : "s"} ago`
  const mon = Math.round(day / 30)
  if (mon < 12) return `${mon} month${mon === 1 ? "" : "s"} ago`
  const yr = Math.round(mon / 12)
  return `${yr} year${yr === 1 ? "" : "s"} ago`
}

/** Whole days between a past date and now (floored, min 0). */
export function daysSince(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86_400_000))
}

export function initials(name: string) {
  return name
    .replace(/^(Barrister|Advocate)\s+/, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function slugifyPracticeArea(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}
