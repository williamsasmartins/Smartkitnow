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
    category: "financial",
    subcategory: "income-budget-expenses",
    title: "Absence Percentage Calculator",
    slug: "absence-percentage-calculator",
    loader: () => import("@/components/calculators/Financial/Budget/AbsencePercentageCalculator"),
  },
  {
    slug: "loan-payment",
    title: "Loan Payment Calculator",
    category: "financial",
    subcategory: "loans-mortgages-payments",
    loader: () => import("@/components/calculators/Financial/LoanPaymentCalculator"),
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
    slug: "dog-xylitol-exposure",
    category: "pets",
    subcategory: "dogs",
    title: "Dog Xylitol Exposure Calculator",
    description: "Estimate dose (mg/kg) from gum, mints, or foods; educational risk bands with urgent vet CTA.",
    loader: () => import("@/components/calculators/DogXylitolExposureCalculator"),
    aliases: ["dog-xylitol-toxicity", "xylitol-for-dogs"],
    urlStyle: "flat",
  },
  {
    slug: "cat-allium-toxicity",
    category: "pets",
    subcategory: "cats",
    title: "Cat Onion/Garlic Toxicity Calculator",
    description: "Allium exposure bands in g/kg and supportive advice — vet CTA.",
    loader: () => import("@/components/calculators/CatAlliumToxicityCalculator"),
    aliases: ["cat-onion-garlic"],
    urlStyle: "flat",
  },
  {
    slug: "cat-grape-raisin-education",
    category: "pets",
    subcategory: "cats",
    title: "Cat Grape/Raisin Exposure Risk (education-first)",
    description: "Educational guidance — immediate veterinary contact recommended.",
    loader: () => import("@/components/calculators/CatGrapeRaisinEducation"),
    aliases: ["cat-grapes-raisins"],
    urlStyle: "flat",
  },
  {
    slug: "cat-xylitol-exposure",
    category: "pets",
    subcategory: "cats",
    title: "Xylitol Exposure Risk for Cats (rare but educational)",
    description: "Rare exposure scenarios — educational overview and vet CTA.",
    loader: () => import("@/components/calculators/CatXylitolExposure"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-caffeine-toxicity",
    category: "pets",
    subcategory: "cats",
    title: "Caffeine Toxicity Risk for Cats",
    description: "Estimate caffeine dose (mg/kg) and educational guidance.",
    loader: () => import("@/components/calculators/CatCaffeineToxicity"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-essential-oils-exposure",
    category: "pets",
    subcategory: "cats",
    title: "Essential Oils Exposure Risk (diffuser/dermal)",
    description: "Educational guidance for essential oil exposures in cats.",
    loader: () => import("@/components/calculators/CatEssentialOilsExposure"),
    aliases: ["cats-essential-oils"],
    urlStyle: "flat",
  },
  {
    slug: "cats-lilies-risk",
    category: "pets",
    subcategory: "cats",
    title: "Lilies Poisoning Risk Guide (cats)",
    description: "Education-first guidance on lily exposures (emergency).",
    loader: () => import("@/components/calculators/CatsLiliesRiskGuide"),
    aliases: ["cat-lilies-risk"],
    urlStyle: "flat",
  },
  {
    slug: "cat-human-meds-exposure",
    category: "pets",
    subcategory: "cats",
    title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)",
    description: "Educational triage for common human medications exposure in cats.",
    loader: () => import("@/components/calculators/CatHumanMedsExposure"),
    aliases: ["cat-human-meds"],
    urlStyle: "flat",
  },
  {
    slug: "cat-benadryl-dose",
    category: "pets",
    subcategory: "cats",
    title: "Benadryl (Diphenhydramine) Dose Calculator for Cats*",
    description: "Educational dose calculator with strong veterinary disclaimer.",
    loader: () => import("@/components/calculators/CatBenadrylDoseCalculator"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-cephalexin-dose",
    category: "pets",
    subcategory: "cats",
    title: "Cephalexin Dose Calculator for Cats*",
    description: "Educational cephalexin dosing helper — not a substitute for vet.",
    loader: () => import("@/components/calculators/CatCephalexinDoseCalculator"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-meloxicam-dose",
    category: "pets",
    subcategory: "cats",
    title: "Meloxicam Dose Calculator for Cats*",
    description: "Educational NSAID dosing guidance for cats (vet oversight required).",
    loader: () => import("@/components/calculators/CatMeloxicamDoseCalculator"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-gabapentin-dose",
    category: "pets",
    subcategory: "cats",
    title: "Gabapentin Dose Calculator for Cats*",
    description: "Educational gabapentin dose helper (consult your veterinarian).",
    loader: () => import("@/components/calculators/CatGabapentinDoseCalculator"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-prednisolone-dose",
    category: "pets",
    subcategory: "cats",
    title: "Prednisolone Dose Calculator for Cats*",
    description: "Educational steroid dosing bands — strong vet disclaimer.",
    loader: () => import("@/components/calculators/CatPrednisoloneDoseCalculator"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-omega3-supplement",
    category: "pets",
    subcategory: "cats",
    title: "Omega-3 (EPA/DHA) Supplement Calculator for Cats*",
    description: "Estimate EPA/DHA targets per weight and product label info.",
    loader: () => import("@/components/calculators/CatOmega3Calculator"),
    aliases: ["cat-omega-3"],
    urlStyle: "flat",
  },
  {
    slug: "cat-insulin-starter-info",
    category: "pets",
    subcategory: "cats",
    title: "Insulin Starter Reference (info-only)*",
    description: "Info-only insulin starter reference — educational, not diagnostic.",
    loader: () => import("@/components/calculators/CatInsulinStarterInfo"),
    aliases: ["cat-insulin-info"],
    urlStyle: "flat",
  },
  {
    slug: "kitten-adult-weight-predictor",
    category: "pets",
    subcategory: "cats",
    title: "Kitten Adult Weight Predictor",
    description: "Predict adult weight from age/weight data.",
    loader: () => import("@/components/calculators/KittenAdultWeightPredictor"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-bcs-helper",
    category: "pets",
    subcategory: "cats",
    title: "Cat Body Condition Score Helper (BCS → Target Plan)",
    description: "BCS helper with target plan and calorie adjustments.",
    loader: () => import("@/components/calculators/CatBCSHelper"),
    aliases: ["cat-body-condition-score"],
    urlStyle: "flat",
  },
  {
    slug: "cat-bmi-index",
    category: "pets",
    subcategory: "cats",
    title: "Cat BMI/Body Index (educational)",
    description: "Educational body index calculator for cats.",
    loader: () => import("@/components/calculators/CatBMICalculator"),
    aliases: ["cat-bmi"],
    urlStyle: "flat",
  },
  {
    slug: "cat-carrier-size",
    category: "pets",
    subcategory: "cats",
    title: "Cat Carrier Size & Fit Guide",
    description: "Find a suitable carrier size from body measures.",
    loader: () => import("@/components/calculators/CatCarrierSizeGuide"),
    aliases: ["carrier-size-cat"],
    urlStyle: "flat",
  },
  {
    slug: "cat-harness-size",
    category: "pets",
    subcategory: "cats",
    title: "Cat Harness Size & Fit Guide",
    description: "Measure-and-fit helper for harness selection.",
    loader: () => import("@/components/calculators/CatHarnessSizeGuide"),
    aliases: ["harness-size-cat"],
    urlStyle: "flat",
  },
  {
    slug: "cat-activity-calorie-adjuster",
    category: "pets",
    subcategory: "cats",
    title: "Indoor/Outdoor Activity Calorie Adjuster",
    description: "Adjust calorie targets by indoor/outdoor activity level.",
    loader: () => import("@/components/calculators/CatActivityCalorieAdjuster"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-play-session-planner",
    category: "pets",
    subcategory: "cats",
    title: "Play Session Planner (Feather/Chase Time Targets)",
    description: "Plan play sessions and time targets for enrichment.",
    loader: () => import("@/components/calculators/CatPlaySessionPlanner"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-rest-active-balance",
    category: "pets",
    subcategory: "cats",
    title: "Resting vs. Active Hours Balance Tracker",
    description: "Track balance of resting vs. active hours (owner input).",
    loader: () => import("@/components/calculators/CatRestActiveBalance"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-age-human-years",
    category: "pets",
    subcategory: "cats",
    title: "Cat Age in Human Years (Breed/Size Aware)",
    description: "Convert cat age to human years with breed/size awareness.",
    loader: () => import("@/components/calculators/CatAgeHumanYears"),
    aliases: ["cat-age-in-human-years"],
    urlStyle: "flat",
  },
  {
    slug: "senior-cat-readiness-checklist",
    category: "pets",
    subcategory: "cats",
    title: "Senior Cat Care Readiness Checklist (scored)",
    description: "Checklist-style helper to gauge senior cat care readiness.",
    loader: () => import("@/components/calculators/SeniorCatReadinessChecklist"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-life-expectancy",
    category: "pets",
    subcategory: "cats",
    title: "Life Expectancy Estimator (lifestyle factors; educational)",
    description: "Educational estimator of life expectancy from lifestyle factors.",
    loader: () => import("@/components/calculators/CatLifeExpectancyEstimator"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-litter-output-tracker",
    category: "pets",
    subcategory: "cats",
    title: "Litter Box Output Tracker (Normal vs. Increased)",
    description: "Track litter box output vs. intake for kidney/urinary awareness.",
    loader: () => import("@/components/calculators/CatLitterOutputTracker"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-intake-vs-urine-balance",
    category: "pets",
    subcategory: "cats",
    title: "Fluid Intake vs. Urine Output Balance Checker",
    description: "Compare fluid intake vs. urine output for balance awareness.",
    loader: () => import("@/components/calculators/CatIntakeUrineBalance"),
    aliases: ["cat-intake-urine"],
    urlStyle: "flat",
  },
  {
    slug: "cat-phosphorus-per-meal",
    category: "pets",
    subcategory: "cats",
    title: "Phosphorus per Meal Estimator (diet label helper)",
    description: "Estimate phosphorus per meal using label data (owner helper).",
    loader: () => import("@/components/calculators/CatPhosphorusPerMeal"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-gestation-due-date",
    category: "pets",
    subcategory: "cats",
    title: "Cat Pregnancy (Gestation) Due-Date Calculator",
    description: "Estimate due date and stages across gestation.",
    loader: () => import("@/components/calculators/CatGestationDueDate"),
    aliases: ["cat-pregnancy-due-date"],
    urlStyle: "flat",
  },
  {
    slug: "kitten-weaning-timeline",
    category: "pets",
    subcategory: "cats",
    title: "Kitten Weaning Timeline & Feeding Amounts",
    description: "Timeline and amounts for weaning kittens.",
    loader: () => import("@/components/calculators/KittenWeaningTimeline"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-shedding-combing-planner",
    category: "pets",
    subcategory: "cats",
    title: "Shedding & Combing Time Planner",
    description: "Plan combing time based on coat type and shedding.",
    loader: () => import("@/components/calculators/CatSheddingCombingPlanner"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-nail-trim-interval",
    category: "pets",
    subcategory: "cats",
    title: "Nail Trim Interval Planner (activity/surface based)",
    description: "Plan nail trimming interval from activity and surfaces.",
    loader: () => import("@/components/calculators/CatNailTrimInterval"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "multi-cat-litterbox-count",
    category: "pets",
    subcategory: "cats",
    title: "Multi-Cat Litter Box Count Calculator",
    description: "Recommended litter box count by number of cats and rooms.",
    loader: () => import("@/components/calculators/MultiCatLitterboxCount"),
    aliases: ["multi-cat-litterbox"],
    urlStyle: "flat",
  },
  {
    slug: "cat-enrichment-planner",
    category: "pets",
    subcategory: "cats",
    title: "Environmental Enrichment Planner (per room)",
    description: "Room-by-room enrichment planner for indoor cats.",
    loader: () => import("@/components/calculators/CatEnrichmentPlanner"),
    aliases: [],
    urlStyle: "flat",
  },
  {
    slug: "cat-stress-score-playtime-offset",
    category: "pets",
    subcategory: "cats",
    title: "Stress Score & Playtime Offset Planner",
    description: "Estimate stress score and offset with planned playtime.",
    loader: () => import("@/components/calculators/CatStressScorePlaytimeOffset"),
    aliases: ["cat-stress-score"],
    urlStyle: "flat",
  },

  // SKN-AUTO-REGISTER: do not remove this line,
  {
  slug: "new-calculator",
  title: "New Calculator",
  category: "financial",
  subcategory: "general",
  description: "New Calculator — financial calculator",
  loader: () => import("@/components/calculators/Financial/NewCalculator"),
  urlStyle: "flat"
},
  {
    slug: "final-test",
    title: "Final Test Calculator",
    category: "math",
    subcategory: "general",
    description: "Final test before success",
    loader: () => import("@/components/calculators/Math/FinalTestCalculator"),
    urlStyle: "nested"
  }
];

// Backwards-compat alias expected by various pages/scripts
export const REGISTRY: CalculatorEntry[] = calculatorRegistry;

// Include aliases in lookup
function allSlugs(entry: CalculatorEntry): string[] {
  return [entry.slug, ...(entry.aliases ?? [])];
}

// Lookup an entry by slug or alias
export function getEntry(slugOrAlias?: string): CalculatorEntry | undefined {
  const s = (slugOrAlias || "").toLowerCase();
  return REGISTRY.find((e) => allSlugs(e).some((x) => (x || "").toLowerCase() === s));
}

// List calculators under a category
export function listByCategory(category?: string): CalculatorEntry[] {
  const key = normalize(category);
  return REGISTRY.filter((e) => normalize(e.category) === key);
}

// List calculators under a specific category and subcategory
export function listByCategorySubcategory(category?: string, subcategory?: string): CalculatorEntry[] {
  const cat = normalize(category);
  const sub = normalize(subcategory);
  return REGISTRY.filter(
    (e) => normalize(e.category) === cat && normalize(e.subcategory) === sub
  );
}

// List calculators by subcategory (dogs, cats, general, etc.)
export function listBy(subcategory: CalculatorEntry["subcategory"]) {
  return REGISTRY.filter((e) => e.subcategory === subcategory);
}

// List subcategories that exist for a category, with friendly titles when available
export function listSubcategoriesOfCategory(category?: string): Array<{ slug: string; title: string }> {
  const cat = normalize(category);
  // Prefer dynamic discovery from registry
  const subs = new Set(
    REGISTRY
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
// -------- Helper para montar o path correto a partir do entry --------
export function calcLink(entry: CalculatorEntry): string {
  // Suporta urlStyle: "flat"  => /:category/:slug
  // e o padrão "nested"       => /:category/:subcategory/:slug
  const category = entry.category;
  const slug = entry.slug || (entry as any).name?.toLowerCase().replace(/\s+/g, "-") || "";
  const subcategory = entry.subcategory;

  const style = (entry as any).urlStyle; // alguns entries já têm urlStyle: "flat"
  if (style === "flat") {
    return `/${category}/${slug}`;
  }

  // fallback: nested
  if (subcategory) {
    return `/${category}/${subcategory}/${slug}`;
  }
  // fallback extra: se não houver subcategory, retorna flat mesmo
  return `/${category}/${slug}`;
}
