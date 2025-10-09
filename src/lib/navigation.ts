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