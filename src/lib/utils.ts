import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Serialize JSON-LD safely: escapes </script> so the tag can't be broken. */
export function safeJsonLd(data: object): string {
  try {
    return JSON.stringify(data).replace(/<\/script>/gi, "<\\/script>");
  } catch {
    return "{}";
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type WeightUnit = "kg" | "lb";

export const LB_PER_KG = 2.2046226218;

export function weightToKg(value: number, unit: WeightUnit): number {
  if (unit === "kg") return value;
  return value / LB_PER_KG;
}

export function kgToWeight(valueKg: number, unit: WeightUnit): number {
  if (unit === "kg") return valueKg;
  return valueKg * LB_PER_KG;
}

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
  if (from === to) return value;
  const kg = weightToKg(value, from);
  return kgToWeight(kg, to);
}

export function formatNumberForInput(value: number, maxFractionDigits = 2): string {
  if (!Number.isFinite(value)) return "";
  const fixed = value.toFixed(maxFractionDigits);
  return fixed.replace(/\.?0+$/, "");
}
