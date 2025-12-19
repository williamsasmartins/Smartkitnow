/** Category icon registry — used across header and pages. */
export const CATEGORY_ICON_EMOJI: Record<string, string> = {
  // Core
  financial: "💰",
  health: "❤️",
  cooking: "🍳",
  conversion: "🔁",
  math: "🧮",
  science: "🔬",
  time: "⏱️",
  recipes: "📚",
  tips: "💡",
  quotes: "💬",
  everyday: "🏠",
  sports: "🏅",
  funny: "😄",
  automotive: "🚗",
  construction: "🏗️",
  electrical: "⚡",
  video: "📺",
  games: "🎮",
  "free-games": "🎮",
  qr: "🔳",
  "qr-code": "🔳",
  "qr-code-generator": "🔳",

  // Synonyms (normalized by getCategoryIcon)
  pets: "🐶", // alias of pet
  pet: "🐶",
  tv: "📺", // alias of video
  smarttips: "💡", // alias of tips
  dailyquotes: "💬", // alias of quotes
  everydaylife: "🏠", // alias of everyday
  freegames: "🎮",
  qrcode: "🔳",
};

import { getEntry } from "@/data/calculatorRegistry";

/** Safe getter (falls back to calculator emoji) */
export function getCategoryIcon(kind?: string): string {
  if (!kind) return "🧮";
  const key = kind.toLowerCase().replace(/\s+/g, "").replace(/[-_]/g, "");
  return CATEGORY_ICON_EMOJI[key] ?? "🧮";
}

function norm(s?: string) {
  return (s || "").trim().toLowerCase().replace(/\s+/g, "-");
}

export function computeBackPath(slug?: string, defaultCategory?: string, fallbackSubcategory?: string): string {
  const entry = slug ? getEntry(slug) : undefined;
  const cat = norm(entry?.category ?? defaultCategory);
  const sub = norm(entry?.subcategory ?? fallbackSubcategory);
  if (!cat) return "/";
  if (sub) return `/${cat}/${sub}`;
  return `/${cat}`;
}
