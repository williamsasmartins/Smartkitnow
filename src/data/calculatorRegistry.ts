// src/data/calculatorRegistry.ts
// Centralized calculator registry and helpers used by pages and templates.

import type React from "react";

export type UrlStyle = "nested" | "flat";

export interface CalculatorEntry {
  slug: string;
  title: string;
  category: string; // e.g., "financial", "health", "pets"
  subcategory?: string; // e.g., "dogs", "cats"
  description?: string;
  aliases?: string[]; // optional alternative search terms
  loader: () => Promise<{ default: React.ComponentType<any> }>; // dynamic import to component
  namedExport?: string; // optional named export if component is not default
  /** NEW: if "flat", links will be /:category/:slug */
  urlStyle?: UrlStyle; // "nested" (default) | "flat"
}

// Friendly category titles shown on hubs and index pages
export const FRIENDLY_TITLES: Record<string, string> = {
  financial: "Financial Calculators",
  health: "Health Calculators",
  cooking: "Cooking Calculators",
  pets: "Pets Calculators",
  math: "Math Calculators",
  conversion: "Conversion Calculators",
  science: "Science Calculators",
  time: "Time Calculators",
  "everyday-life": "Everyday Life Calculators",
  sports: "Sports Calculators",
  funny: "Funny Calculators",
  automotive: "Automotive Calculators",
  construction: "Construction Calculators",
  electrical: "Electrical Calculators",
  recipes: "Recipe Collections",
};

// Optional friendlier titles per subcategory
export const SUBCATEGORY_TITLES: Record<string, Record<string, string>> = {
  pets: {
    dogs: "Dog Care",
    cats: "Cat Care",
    "pet-care-calculators": "Pet Care Tools",
    general: "General",
  },
  financial: {
    general: "General",
  },
  health: {
    general: "General",
  },
  cooking: {
    general: "General",
  },
  math: {
    general: "General",
  },
};

function normalize(v?: string) {
  return String(v ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "");
}

// Emoji icons per category (used by CategoryCalculatorsTemplate header)
export function categoryIcon(category?: string): string {
  const key = normalize(category);
  const MAP: Record<string, string> = {
    financial: "💰",
    health: "🩺",
    cooking: "🍳",
    pets: "🐾",
    math: "🧮",
    conversion: "🔁",
    science: "🔬",
    time: "⏱️",
    "everyday-life": "🏠",
    sports: "🏅",
    funny: "😄",
    automotive: "🚗",
    construction: "🏗️",
    electrical: "⚡",
    recipes: "📚",
  };
  return MAP[key] ?? "🧮";
}

// Emoji icons per subcategory — allows pages to avoid repeating the same icon
export function subcategoryIcon(subcategory?: string, category?: string): string | undefined {
  const sub = normalize(subcategory);
  const cat = normalize(category);
  const PETS: Record<string, string> = {
    dogs: "🐶",
    cats: "🐈",
    "pet-care-calculators": "🐾",
    general: "📦",
  };
  const GENERIC: Record<string, string> = {
    general: "📦",
  };
  if (cat === "pets") return PETS[sub] ?? "🐾";
  return GENERIC[sub] ?? undefined;
}

// The actual registry of calculators. Keep lightweight and focused.
export const calculatorRegistry: CalculatorEntry[] = [
  {
    slug: "dog-water-intake",
    title: "Dog Water Intake — Daily Hydration",
    category: "pets",
    subcategory: "dogs",
    aliases: ["dog daily water intake", "dog hydration"],
    loader: () => import("@/components/calculators/DogWaterIntakeCalculator"),
    urlStyle: "flat",
  },
  {
    slug: "cat-water-intake",
    category: "pets",
    subcategory: "cats",
    title: "Cat Water Intake Calculator",
    description: "Estimate an educational daily water intake range for cats by weight and diet, and compare with your observation.",
    loader: () => import("@/components/calculators/CatWaterIntakeCalculator"),
    aliases: ["cat daily water intake", "cat hydration"],
    urlStyle: "flat",
  },
  {
    slug: "cat-daily-water-intake-checker",
    category: "pets",
    subcategory: "cats",
    title: "Cat Daily Water Intake Checker",
    description: "Estimate an educational daily water intake range for cats by weight and diet, and compare with your observation.",
    loader: () => import("@/components/calculators/CatWaterIntakeCalculator"),
    aliases: ["cat-water-intake", "cat-water-intake-calculator"],
    urlStyle: "flat",
  },
  {
    slug: "dog-caffeine-toxicity-calculator",
    category: "pets",
    subcategory: "dogs",
    title: "Dog Caffeine Toxicity Calculator",
    description: "Estimate educational risk bands from caffeine sources; includes mg/kg estimation and triage steps.",
    loader: () => import("@/components/calculators/DogCaffeineToxicityCalculator"),
    aliases: ["caffeine-dogs", "dog-caffeine-toxicity"],
    urlStyle: "flat",
  },
  {
    slug: "dog-weight-loss-planner",
    category: "pets",
    subcategory: "pet-care-calculators",
    title: "Dog Weight Loss Planner",
    description: "Plan an educational daily calorie target using 0.8×RER (target) or 70% of maintenance, plus weeks-to-goal estimate.",
    loader: () => import("@/components/calculators/DogWeightLossPlanner"),
    aliases: ["dog weight loss", "dog weight loss planner", "dog diet", "canine weight management"],
    urlStyle: "flat",
  },
  {
    slug: "cat-weight-loss-planner",
    category: "pets",
    subcategory: "pet-care-calculators",
    title: "Cat Weight Loss Planner",
    description: "Plan an educational daily calorie target using 0.8×RER (target) or 70% of maintenance, plus weeks-to-goal estimate.",
    loader: () => import("@/components/calculators/CatWeightLossPlanner"),
    aliases: ["cat weight loss", "cat weight loss planner", "feline weight management", "cat diet"],
    urlStyle: "flat",
  },
  {
    slug: "dog-calorie-needs-rer-mer",
    category: "pets",
    subcategory: "general",
    title: "Dog Calorie Needs (RER/MER) Calculator",
    description: "Estimate dog RER and MER from weight and life stage/activity.",
    loader: () => import("@/components/calculators/DogCalorieNeedsRerMer"),
    aliases: ["dog calorie needs", "dog rer mer", "canine energy requirements"],
    urlStyle: "flat",
  },
  {
    slug: "dog-chocolate-toxicity-calculator",
    category: "pets",
    subcategory: "dogs",
    title: "Dog Chocolate Toxicity Calculator",
    description: "Estimate educational dose bands (mg/kg) by chocolate type and amount; strong veterinarian disclaimer.",
    loader: () => import("@/components/calculators/DogChocolateToxicityCalculator"),
    aliases: ["dog-chocolate-toxicity", "dog-chocolate-toxicity-checker"],
    urlStyle: "flat",
  },
  {
    slug: "dog-grape-raisin-exposure-risk",
    category: "pets",
    subcategory: "dogs",
    title: "Dog Grape/Raisin Exposure Risk Calculator",
    description: "Education-first triage for suspected grape/raisin ingestion — treat any ingestion as urgent and call your vet.",
    loader: () => import("@/components/calculators/DogGrapeRaisinExposureCalculator"),
    aliases: ["dog-grape-toxicity", "dog-raisins-toxicity", "grapes-for-dogs"],
    urlStyle: "flat",
  },
  {
    slug: "dog-onion-garlic-exposure-risk",
    category: "pets",
    subcategory: "dogs",
    title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator",
    description: "Converts intake to raw-onion-equivalent g/kg and classifies bands; educational guidance only.",
    loader: () => import("@/components/calculators/DogAlliumExposureCalculator"),
    aliases: ["dog-onion-toxicity", "dog-garlic-toxicity", "allium-exposure-dogs"],
    urlStyle: "flat",
  },
  {
    slug: "dog-xylitol-exposure-risk",
    category: "pets",
    subcategory: "dogs",
    title: "Dog Xylitol Exposure Risk Calculator",
    description: "Educational triage for suspected xylitol ingestion (sugar-free gum, baked goods); call your veterinarian.",
    loader: () => import("@/components/calculators/DogXylitolExposureCalculator"),
    aliases: ["xylitol-dogs", "dog-xylitol-toxicity"],
    urlStyle: "flat",
  },
];

// Backwards-compat alias expected by various pages/scripts
export const REGISTRY: CalculatorEntry[] = calculatorRegistry;

// Lookup an entry by slug
export function getEntry(slug?: string): CalculatorEntry | undefined {
  if (!slug) return undefined;
  const key = normalize(slug);
  return calculatorRegistry.find((e) => normalize(e.slug) === key);
}

// List calculators under a category
export function listByCategory(category?: string): CalculatorEntry[] {
  const key = normalize(category);
  return calculatorRegistry.filter((e) => normalize(e.category) === key);
}

// List calculators under a specific category and subcategory
export function listByCategorySubcategory(category?: string, subcategory?: string): CalculatorEntry[] {
  const cat = normalize(category);
  const sub = normalize(subcategory);
  return calculatorRegistry.filter(
    (e) => normalize(e.category) === cat && normalize(e.subcategory) === sub
  );
}

// List subcategories that exist for a category, with friendly titles when available
export function listSubcategoriesOfCategory(category?: string): Array<{ slug: string; title: string }> {
  const cat = normalize(category);
  // Prefer dynamic discovery from registry
  const subs = new Set(
    calculatorRegistry
      .filter((e) => normalize(e.category) === cat)
      .map((e) => normalize(e.subcategory))
      .filter(Boolean)
  );
  const titles = SUBCATEGORY_TITLES[cat] ?? {};
  const result = Array.from(subs).map((slug) => ({ slug, title: titles[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) }));
  // If no dynamic subs found, fall back to static map
  if (result.length === 0 && Object.keys(titles).length > 0) {
    return Object.entries(titles).map(([slug, title]) => ({ slug, title }));
  }
  return result;
}

/** Helper único para gerar a rota desejada de um entry */
export function calcPath(e: CalculatorEntry): string {
  const style: UrlStyle = e.urlStyle ?? "nested";
  return style === "flat"
    ? `/${e.category}/${e.slug}`
    : `/${e.category}/${e.subcategory}/${e.slug}`;
}

// Backward compat: calcLink maps to calcPath
export function calcLink(e: CalculatorEntry) {
  return calcPath(e);
}