// src/data/calculatorRegistry.ts
// Unified calculator registry consumed by scripts (sitemap, checks)
// - Exports types `CalculatorEntry` and `RegistryEntry` (alias)
// - Preserves loader functions using dynamic import specs
// - Provides helpers: calcLink, getEntry, listByCategory, listByCategorySubcategory

export type CalculatorEntry = {
  slug: string;
  category: string; // canonical category key, e.g. "pets", "health", "financial"
  subcategory: string; // canonical subcategory key when applicable, e.g. "dogs", "cats", "general"
  title: string; // display title
  description?: string;
  loader: () => Promise<any>;
  aliases?: string[];
  // Optional display labels (if different from canonical keys)
  displayCategory?: string;
  displaySubcategory?: string;
};

export type RegistryEntry = CalculatorEntry;


// Map canonical category key to short URL segment
function categoryToPathSegment(category: string): string {
  const key = category.trim().toLowerCase();
  const map: Record<string, string> = {
    // canonical keys
    pets: "pets",
    health: "health",
    financial: "financial",
    cooking: "cooking",
    conversion: "conversion",
    math: "math",
    science: "science",
    time: "time",
    tv: "tv",
    automotive: "automotive",
    construction: "construction",
    electrical: "electrical",
    sports: "sports",
    funny: "funny",
    everyday: "everyday",
    "smart-tips": "smart-tips",
    recipes: "recipes",
  };
  return map[key] ?? key.replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

// Generate the short path used by sitemap generator
export function calcLink(e: CalculatorEntry): string {
  const seg = categoryToPathSegment(e.category);
  if (e.subcategory && e.subcategory.trim().length > 0) {
    return `/${seg}/${e.subcategory}/${e.slug}`;
  }
  return `/${seg}/${e.slug}`;
}

// ------------------------------
// Registry content
// ------------------------------

// NOTE: This initial registry focuses on Pets entries required by scripts/check-expected.ts
// You can expand other categories (construction, electrical, health, etc.) incrementally.

const pets: RegistryEntry[] = [
  // Reptiles — Habitat & Lighting
  {
    title: "Enclosure Size & Floor Area by Species",
    category: "pets",
    subcategory: "reptiles",
    slug: "reptile-enclosure-size",
    loader: () => import("@/components/calculators/Pets/Reptile/Habitat/ReptileEnclosureSize"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Reptiles — Habitat & Lighting",
  },
  {
    title: "Basking Gradient & Heat Lamp Distance",
    category: "pets",
    subcategory: "reptiles",
    slug: "reptile-basking-gradient",
    loader: () => import("@/components/calculators/Pets/Reptile/Habitat/ReptileBaskingGradient"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Reptiles — Habitat & Lighting",
  },
  {
    title: "UVB Index & Lamp Distance Helper",
    category: "pets",
    subcategory: "reptiles",
    slug: "reptile-uvb-distance",
    loader: () => import("@/components/calculators/Pets/Reptile/Habitat/ReptileUVBDistanceHelper"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Reptiles — Habitat & Lighting",
  },
  {
    title: "Feeder Quantity by Body Weight (educational)",
    category: "pets",
    subcategory: "reptiles",
    slug: "reptile-feeder-quantity",
    loader: () => import("@/components/calculators/Pets/Reptile/Nutrition/ReptileFeederQuantity"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Reptiles — Nutrition",
  },

  // Small Mammals — Nutrition & Weight
  {
    title: "Rabbit Daily Hay & Greens Portion",
    category: "pets",
    subcategory: "small-mammals",
    slug: "rabbit-hay-greens-portion",
    loader: () => import("@/components/calculators/Pets/SmallMammals/Nutrition/RabbitHayGreensPortion"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Small Mammals — Nutrition & Weight",
  },
  {
    title: "Guinea Pig Vitamin C Intake Checker",
    category: "pets",
    subcategory: "small-mammals",
    slug: "guinea-pig-vitamin-c-intake",
    loader: () => import("@/components/calculators/Pets/SmallMammals/Nutrition/GuineaPigVitaminCIntake"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Small Mammals — Nutrition & Weight",
  },

  // Small Mammals — Activity & Housing
  {
    title: "Hamster Wheel Size & Speed (educational)",
    category: "pets",
    subcategory: "small-mammals",
    slug: "hamster-wheel-size-speed",
    loader: () => import("@/components/calculators/Pets/SmallMammals/Housing/HamsterWheelSizeSpeed"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Small Mammals — Activity & Housing",
  },
  {
    title: "Cage Size & Bar Spacing Guide",
    category: "pets",
    subcategory: "small-mammals",
    slug: "small-mammal-cage-size",
    loader: () => import("@/components/calculators/Pets/SmallMammals/Housing/SmallMammalCageSizeGuide"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Small Mammals — Activity & Housing",
  },

  // --- Cats (expected by scripts/expected-pets.ts) ---
  // Medication & Dosing*
  {
    slug: "cat-benadryl-dose",
    category: "pets",
    subcategory: "cats",
    title: "Benadryl (Diphenhydramine) Dose Calculator for Cats*",
    loader: () => import("@/components/calculators/CatBenadrylDoseCalculator"),
  },
  {
    slug: "cat-cephalexin-dose",
    category: "pets",
    subcategory: "cats",
    title: "Cephalexin Dose Calculator for Cats*",
    loader: () => import("@/components/calculators/CatCephalexinDoseCalculator"),
  },
  {
    slug: "cat-meloxicam-dose",
    category: "pets",
    subcategory: "cats",
    title: "Meloxicam Dose Calculator for Cats*",
    loader: () => import("@/components/calculators/CatMeloxicamDoseCalculator"),
  },
  {
    slug: "cat-gabapentin-dose",
    category: "pets",
    subcategory: "cats",
    title: "Gabapentin Dose Calculator for Cats*",
    loader: () => import("@/components/calculators/CatGabapentinDoseCalculator"),
  },
  {
    slug: "cat-prednisolone-dose",
    category: "pets",
    subcategory: "cats",
    title: "Prednisolone Dose Calculator for Cats*",
    loader: () => import("@/components/calculators/CatPrednisoloneDoseCalculator"),
  },
  {
    slug: "cat-omega3-supplement",
    category: "pets",
    subcategory: "cats",
    title: "Omega-3 (EPA/DHA) Supplement Calculator for Cats*",
    loader: () => import("@/components/calculators/CatOmega3Calculator"),
  },
  {
    slug: "cat-insulin-starter-info",
    category: "pets",
    subcategory: "cats",
    title: "Insulin Starter Reference (info-only)*",
    loader: () => import("@/components/calculators/CatInsulinStarterInfo"),
  },

  // Growth, Size & Body Measures
  {
    slug: "kitten-adult-weight-predictor",
    category: "pets",
    subcategory: "cats",
    title: "Kitten Adult Weight Predictor",
    loader: () => import("@/components/calculators/KittenAdultWeightPredictor"),
  },
  {
    slug: "cat-bcs-helper",
    category: "pets",
    subcategory: "cats",
    title: "Cat Body Condition Score Helper (BCS → Target Plan)",
    loader: () => import("@/components/calculators/CatBCSHelper"),
  },
  {
    slug: "cat-bmi-index",
    category: "pets",
    subcategory: "cats",
    title: "Cat BMI/Body Index (educational)",
    loader: () => import("@/components/calculators/CatBMICalculator"),
  },
  {
    slug: "cat-carrier-size",
    category: "pets",
    subcategory: "cats",
    title: "Cat Carrier Size & Fit Guide",
    loader: () => import("@/components/calculators/CatCarrierSizeGuide"),
  },
  {
    slug: "cat-harness-size",
    category: "pets",
    subcategory: "cats",
    title: "Cat Harness Size & Fit Guide",
    loader: () => import("@/components/calculators/CatHarnessSizeGuide"),
  },

  // Activity & Lifestyle
  {
    slug: "cat-activity-calorie-adjuster",
    category: "pets",
    subcategory: "cats",
    title: "Indoor/Outdoor Activity Calorie Adjuster",
    loader: () => import("@/components/calculators/CatActivityCalorieAdjuster"),
  },
  {
    slug: "cat-play-session-planner",
    category: "pets",
    subcategory: "cats",
    title: "Play Session Planner (Feather/Chase Time Targets)",
    loader: () => import("@/components/calculators/CatPlaySessionPlanner"),
  },
  {
    slug: "cat-rest-active-balance",
    category: "pets",
    subcategory: "cats",
    title: "Resting vs. Active Hours Balance Tracker",
    loader: () => import("@/components/calculators/CatRestActiveBalance"),
  },

  // Age, Life Stage & Longevity
  {
    slug: "cat-age-human-years",
    category: "pets",
    subcategory: "cats",
    title: "Cat Age in Human Years (Breed/Size Aware)",
    loader: () => import("@/components/calculators/CatAgeHumanYears"),
  },
  {
    slug: "senior-cat-readiness-checklist",
    category: "pets",
    subcategory: "cats",
    title: "Senior Cat Care Readiness Checklist (scored)",
    loader: () => import("@/components/calculators/SeniorCatReadinessChecklist"),
  },
  {
    slug: "cat-life-expectancy",
    category: "pets",
    subcategory: "cats",
    title: "Life Expectancy Estimator (lifestyle factors; educational)",
    loader: () => import("@/components/calculators/CatLifeExpectancyEstimator"),
  },

  // Urinary & Kidney Health
  {
    slug: "cat-litter-output-tracker",
    category: "pets",
    subcategory: "cats",
    title: "Litter Box Output Tracker (Normal vs. Increased)",
    loader: () => import("@/components/calculators/CatLitterOutputTracker"),
  },
  {
    slug: "cat-intake-vs-urine-balance",
    category: "pets",
    subcategory: "cats",
    title: "Fluid Intake vs. Urine Output Balance Checker",
    loader: () => import("@/components/calculators/CatIntakeUrineBalance"),
  },
  {
    slug: "cat-phosphorus-per-meal",
    category: "pets",
    subcategory: "cats",
    title: "Phosphorus per Meal Estimator (diet label helper)",
    loader: () => import("@/components/calculators/CatPhosphorusPerMeal"),
  },

  // Reproduction
  {
    slug: "cat-gestation-due-date",
    category: "pets",
    subcategory: "cats",
    title: "Cat Pregnancy (Gestation) Due-Date Calculator",
    loader: () => import("@/components/calculators/CatGestationDueDate"),
  },
  {
    slug: "kitten-weaning-timeline",
    category: "pets",
    subcategory: "cats",
    title: "Kitten Weaning Timeline & Feeding Amounts",
    loader: () => import("@/components/calculators/KittenWeaningTimeline"),
  },

  // Grooming & Care
  {
    slug: "cat-shedding-combing-planner",
    category: "pets",
    subcategory: "cats",
    title: "Shedding & Combing Time Planner",
    loader: () => import("@/components/calculators/CatSheddingCombingPlanner"),
  },
  {
    slug: "cat-nail-trim-interval",
    category: "pets",
    subcategory: "cats",
    title: "Nail Trim Interval Planner (activity/surface based)",
    loader: () => import("@/components/calculators/CatNailTrimInterval"),
  },

  // Behavior & Environment
  {
    slug: "multi-cat-litterbox-count",
    category: "pets",
    subcategory: "cats",
    title: "Multi-Cat Litter Box Count Calculator",
    loader: () => import("@/components/calculators/MultiCatLitterboxCount"),
  },
  {
    slug: "cat-enrichment-planner",
    category: "pets",
    subcategory: "cats",
    title: "Environmental Enrichment Planner (per room)",
    loader: () => import("@/components/calculators/CatEnrichmentPlanner"),
  },
  {
    slug: "cat-stress-score-playtime-offset",
    category: "pets",
    subcategory: "cats",
    title: "Stress Score & Playtime Offset Planner",
    loader: () => import("@/components/calculators/CatStressScorePlaytimeOffset"),
  },

  // -- Dogs: add a few high-demand medication calculators
  {
    title: "Meloxicam/Metacam Dose — Dogs",
    category: "pets",
    subcategory: "dogs",
    slug: "meloxicam-dose-dogs",
    loader: () => import("@/components/calculators/Pets/Dog/Medication/MeloxicamDoseDogs"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Dog — Medication & Dosing",
  },
  {
    title: "Gabapentin Dose — Dogs",
    category: "pets",
    subcategory: "dogs",
    slug: "gabapentin-dose-dogs",
    loader: () => import("@/components/calculators/Pets/Dog/Medication/GabapentinDoseDogs"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Dog — Medication & Dosing",
  },
  {
    title: "Dog Calorie Needs (RER/MER)",
    category: "pets",
    subcategory: "dog-nutrition-weight",
    slug: "dog-calorie-needs-rer-mer",
    loader: () => import("@/components/calculators/Pets/Dog/Nutrition/DogCalorieNeedsCalculator"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Dog — Nutrition & Weight",
  },

  // -- Cats: popular meds/utilities
  {
    title: "Prednisolone Dose — Cats",
    category: "pets",
    subcategory: "cats",
    slug: "prednisolone-dose-cats",
    loader: () => import("@/components/calculators/Pets/Cat/Medication/PrednisoloneDoseCats"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Cat — Medication & Dosing",
  },
  {
    title: "Omega-3 (EPA/DHA) Supplement — Cats",
    category: "pets",
    subcategory: "cats",
    slug: "omega3-supplement-cats",
    loader: () => import("@/components/calculators/Pets/Cat/Medication/Omega3SupplementCats"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Cat — Medication & Dosing",
  },

  // -- All Pets: two frequent food label helpers
  {
    title: "Dry Matter Basis Converter (DMB)",
    category: "pets",
    subcategory: "general",
    slug: "dry-matter-basis-converter",
    loader: () => import("@/components/calculators/Pets/All/Utilities/DryMatterBasisConverter"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "All Pets — Utilities",
  },
  {
    title: "As-Fed ↔ Metabolizable Energy (kcal) Converter",
    category: "pets",
    subcategory: "general",
    slug: "asfed-me-kcal-converter",
    loader: () => import("@/components/calculators/Pets/All/Utilities/AsFedMEKcalConverter"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "All Pets — Utilities",
  },

  // -- Horses: hydration & workload
  {
    title: "Horse Daily Water Intake Estimator",
    category: "pets",
    subcategory: "horses",
    slug: "horse-water-intake",
    loader: () => import("@/components/calculators/Pets/Horse/Nutrition/HorseWaterIntake"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Horse — Nutrition & Weight",
  },
  {
    title: "Horse Workload Calories (educational)",
    category: "pets",
    subcategory: "horses",
    slug: "horse-workload-calories",
    loader: () => import("@/components/calculators/Pets/Horse/Nutrition/HorseWorkloadCalories"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Horse — Nutrition & Weight",
  },

  // -- Birds: weight & intake
  {
    title: "Bird Weight Trend & Alert (owner input)",
    category: "pets",
    subcategory: "birds",
    slug: "bird-weight-trend-alert",
    loader: () => import("@/components/calculators/Pets/Bird/Body/BirdWeightTrendAlert"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Birds — Growth, Size & Body Measures",
  },

  // -- Fish & Aquatics: water maintenance essentials
  {
    title: "Water Change Calculator (nitrate control)",
    category: "pets",
    subcategory: "fish",
    slug: "aquarium-water-change",
    loader: () => import("@/components/calculators/Pets/Fish/Tank/AquariumWaterChangeCalculator"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Fish & Aquatics — Tank & Equipment",
  },
  {
    title: "Salinity / SG ↔ PPT Converter (marine)",
    category: "pets",
    subcategory: "fish",
    slug: "salinity-sg-ppt-converter",
    loader: () => import("@/components/calculators/Pets/Fish/Tank/SalinitySGPPTConverter"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Fish & Aquatics — Tank & Equipment",
  },

  // -- Reptiles: humidity
  {
    title: "Enclosure Humidity Target & Misting Interval",
    category: "pets",
    subcategory: "reptiles",
    slug: "reptile-humidity-misting-interval",
    loader: () => import("@/components/calculators/Pets/Reptile/Habitat/ReptileHumidityMistingInterval"),
    displayCategory: "Pet Care Calculators",
    displaySubcategory: "Reptiles — Habitat & Lighting",
  },
];

// Placeholder arrays for other categories (to be populated incrementally)
const construction: RegistryEntry[] = [];
const electrical: RegistryEntry[] = [];
const financial: RegistryEntry[] = [];
const health: RegistryEntry[] = [];
const cooking: RegistryEntry[] = [];
const conversion: RegistryEntry[] = [
  {
    title: "Length Converter",
    category: "conversion",
    subcategory: "core-units",
    slug: "length-converter",
    loader: () => import("@/components/calculators/Conversion/Core/LengthConverter"),
    displayCategory: "Unit Converters",
    displaySubcategory: "Core Units",
  },
];
const math: RegistryEntry[] = [];
const science: RegistryEntry[] = [];
const timeDate: RegistryEntry[] = [];
const video: RegistryEntry[] = [];
const automotive: RegistryEntry[] = [];
const sports: RegistryEntry[] = [];
const funny: RegistryEntry[] = [];
const everyday: RegistryEntry[] = [
  {
    title: "Light Bulb Cost per Year",
    category: "everyday",
    subcategory: "home",
    slug: "light-bulb-cost-per-year",
    loader: () => import("@/components/calculators/Everyday/Home/LightBulbCostPerYear"),
    displayCategory: "Everyday Life Calculators",
    displaySubcategory: "Home & Routine",
  },
  {
    title: "Water Heater Recovery Time",
    category: "everyday",
    subcategory: "home",
    slug: "water-heater-recovery-time",
    loader: () => import("@/components/calculators/Everyday/Home/WaterHeaterRecoveryTime"),
    displayCategory: "Everyday Life Calculators",
    displaySubcategory: "Home & Routine",
  },
  {
    title: "Propane Tank Burn Time",
    category: "everyday",
    subcategory: "home",
    slug: "propane-tank-burn-time",
    loader: () => import("@/components/calculators/Everyday/Home/PropaneTankBurnTime"),
    displayCategory: "Everyday Life Calculators",
    displaySubcategory: "Home & Routine",
  },
  {
    title: "Wine/Beer/Soft Drink Mix Planner",
    category: "everyday",
    subcategory: "events",
    slug: "beverage-mix-planner",
    loader: () => import("@/components/calculators/Everyday/Events/BeverageMixPlanner"),
    displayCategory: "Everyday Life Calculators",
    displaySubcategory: "Events & Hosting",
  },
  {
    title: "Coffee Urn Yield & Strength",
    category: "everyday",
    subcategory: "events",
    slug: "coffee-urn-yield-strength",
    loader: () => import("@/components/calculators/Everyday/Events/CoffeeUrnYieldStrength"),
    displayCategory: "Everyday Life Calculators",
    displaySubcategory: "Events & Hosting",
  },
  {
    title: "Mulch Coverage — Bags Needed",
    category: "everyday",
    subcategory: "garden",
    slug: "mulch-bags-needed",
    loader: () => import("@/components/calculators/Everyday/Garden/MulchBagsNeeded"),
    displayCategory: "Everyday Life Calculators",
    displaySubcategory: "Garden & Outdoor",
  },
];
const smartTips: RegistryEntry[] = [
  {
    title: "Sleep Debt & Ideal Bedtime",
    category: "smart-tips",
    subcategory: "wellbeing",
    slug: "sleep-debt-ideal-bedtime",
    loader: () => import("@/components/calculators/SmartTips/Wellbeing/SleepDebtIdealBedtime"),
    displayCategory: "Smart Tips",
    displaySubcategory: "Wellbeing",
  },
  {
    title: "Caffeine Max per Day (by body weight)",
    category: "smart-tips",
    subcategory: "wellbeing",
    slug: "caffeine-max-per-day",
    loader: () => import("@/components/calculators/SmartTips/Wellbeing/CaffeineMaxPerDay"),
    displayCategory: "Smart Tips",
    displaySubcategory: "Wellbeing",
  },
  {
    title: "Commute Cost & Time",
    category: "smart-tips",
    subcategory: "planning",
    slug: "commute-cost-time",
    loader: () => import("@/components/calculators/SmartTips/Planning/CommuteCostTime"),
    displayCategory: "Smart Tips",
    displaySubcategory: "Everyday Planning",
  },
];

// ---- Combined export the scripts expect ----
export const REGISTRY: RegistryEntry[] = [
  ...construction,
  ...electrical,
  ...financial,
  ...health,
  ...cooking,
  ...conversion,
  ...math,
  ...science,
  ...timeDate,
  ...video,
  ...automotive,
  ...sports,
  ...funny,
  ...everyday,
  ...smartTips,
  ...pets,
];

// Optional helpers
export const getEntry = (slugOrAlias: string) => {
  const s = String(slugOrAlias || "").trim().toLowerCase();
  return REGISTRY.find(
    (e) => e.slug === s || (e.aliases && e.aliases.map((a) => a.toLowerCase()).includes(s))
  );
};

export const listByCategory = (category: string) =>
  REGISTRY.filter((e) => e.category.trim().toLowerCase() === category.trim().toLowerCase());

export const listByCategorySubcategory = (category: string, subcategory: string) =>
  REGISTRY.filter(
    (e) =>
      e.category.trim().toLowerCase() === category.trim().toLowerCase() &&
      e.subcategory.trim().toLowerCase() === subcategory.trim().toLowerCase()
  );