import { getEntry } from "@/data/calculatorRegistry";

/**
 * Compute a safe back path for calculator pages using the registry.
 * - If the calculator slug exists in the registry, returns "/category/subcategory" or "/category".
 * - If not, uses the provided defaultCategory if available, else "/".
 * - Optionally accepts a fallbackSubcategory (e.g. from route params) used when registry lacks subcategory.
 */
export function computeBackPath(
  calculatorSlug?: string,
  defaultCategory?: string,
  fallbackSubcategory?: string
): string {
  const entry = calculatorSlug ? getEntry(calculatorSlug) : undefined;
  const category = entry?.category ?? defaultCategory;

  // Com URLs curtas, sempre voltar para a raiz da categoria
  if (category) return `/${category}`;
  return "/";
}

/** Category icon registry — must mirror the header icons exactly. */
export const CATEGORY_ICON_EMOJI: Record<string, string> = {
  financial: "💰",
  health: "🩺",
  cooking: "🍳",
  conversion: "🔁",
  math: "🧮",
  pet: "🐶",
  science: "🔬",
  time: "⏱️",
  video: "📺",
  recipes: "📚",
  tips: "💡",
  quotes: "💬",
  everyday: "🏠",
  sports: "🏅",
  funny: "😄",
  automotive: "🚗",
  construction: "🏗️",
  electrical: "⚡",
};

/** Safe getter (falls back to calculator emoji) */
export function getCategoryIcon(kind?: string): string {
  if (!kind) return "🧮";
  const key = kind.toLowerCase().replace(/\s+/g, "").replace(/[-_]/g, "");
  return CATEGORY_ICON_EMOJI[key] ?? "🧮";
}