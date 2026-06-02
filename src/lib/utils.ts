import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function generateSlugSuffix(): string {
  return Math.random().toString(36).slice(2, 7)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

export const PREDEFINED_TAGS = [
  "DeFi",
  "AI Oracle",
  "Gaming",
  "Social",
  "Tooling",
  "Infrastructure",
  "NFT",
  "DAO",
  "Identity",
  "Data",
] as const

export type PredefinedTag = (typeof PREDEFINED_TAGS)[number]

export const UPDATE_TYPE_LABELS = {
  GENERAL: "Update",
  MILESTONE: "Milestone",
  BLOCKER: "Blocker",
  BREAKTHROUGH: "Breakthrough",
} as const

export const REVIEW_THRESHOLDS = {
  APPROVALS_NEEDED: 3,
  REJECTIONS_NEEDED: 3,
  UPVOTES_FOR_CREDIT: 5,
  // Option B hook: swap the canReview() check to use this instead of publishedProjects >= 1
  MIN_REPUTATION_TO_REVIEW: 50,
} as const

export const UPDATE_TYPE_COLORS = {
  GENERAL: "bg-gray-100 text-gray-600",
  MILESTONE: "bg-violet-100 text-violet-700",
  BLOCKER: "bg-red-100 text-red-700",
  BREAKTHROUGH: "bg-emerald-100 text-emerald-700",
} as const
