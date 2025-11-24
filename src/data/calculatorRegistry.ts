import type React from "react";

export type UrlStyle = "nested" | "flat";

export interface CalculatorEntry {
  slug: string;
  title: string;
  category: string; // e.g., "financial", "health", "pets"
  subcategory?: string; // e.g., "dogs", "cats", "loans"
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
    loans: "Loans & Mortgages",
    investments: "Investments & Savings",
    retirement: "Retirement Planning",
    debt: "Debt Management",
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
  const FINANCIAL: Record<string, string> = {
    loans: "🏠",
    investments: "📈",
    retirement: "🏖️",
    debt: "💳",
    general: "💰",
  };
  const GENERIC: Record<string, string> = {
    general: "📦",
  };
  if (cat === "pets") return PETS[sub] ?? "🐾";
  if (cat === "financial") return FINANCIAL[sub] ?? "💰";
  return GENERIC[sub] ?? undefined;
}

// ====================================================================
// CALCULATOR REGISTRY
// ====================================================================
// The actual registry of calculators. Keep lightweight and focused.
// N8N workflow will auto-inject new entries before the closing bracket.
export const calculatorRegistry: CalculatorEntry[] = [
  {
    slug: "ethereum-gas-fee",
    title: "Ethereum Gas Fee Calculator",
    category: "financial",
    subcategory: "cryptocurrency",
    description: "Calculate the estimated gas fees for Ethereum transactions based on current Gwei prices.",
    loader: () => import("@/components/calculators/Financial/EthereumGaFeeCalculator"),
    urlStyle: "flat"
  },
  // ================================================================
  // FINANCIAL CALCULATORS (Priority: HIGH CPC)
  // ================================================================
  {
    slug: "loan-payment",
    category: "financial",
    subcategory: "loans",
    title: "Loan Payment Calculator (Principal, Rate, Term)",
    description: "Calculate monthly loan payments, total interest, and amortization schedule for any loan amount, interest rate, and term.",
    loader: () => import("@/components/calculators/Financial/LoanPaymentCalculator"),
    aliases: ["loan-calculator", "payment-calculator"],
    urlStyle: "flat",
  },
  {
    slug: "mortgage-amortization",
    category: "financial",
    subcategory: "loans",
    title: "Mortgage Payment & Amortization Calculator",
    description: "Calculate your monthly mortgage payments and view detailed amortization schedule with principal and interest breakdown.",
    loader: () => import("@/components/calculators/Financial/MortgageAmortizationCalculator"),
    aliases: ["mortgage-calculator", "mortgage-payment"],
    urlStyle: "flat",
  },
  {
    slug: "refinance-savings",
    category: "financial",
    subcategory: "loans",
    title: "Refinance Savings Calculator",
    description: "Calculate how much you can save by refinancing your mortgage with a lower interest rate, including break-even analysis.",
    loader: () => import("@/components/calculators/Financial/RefinanceSavingsCalculator"),
    aliases: ["refinance-calculator"],
    urlStyle: "flat",
  },
  {
    slug: "heloc-payment-estimator",
    category: "financial",
    subcategory: "loans",
    title: "HELOC Payment Estimator",
    description: "Estimate your Home Equity Line of Credit payments during draw and repayment periods, including interest-only calculations.",
    loader: () => import("@/components/calculators/Financial/HelocPaymentEstimator"),
    aliases: ["heloc-calculator"],
    urlStyle: "flat",
  },
  {
    slug: "house-affordability",
    category: "financial",
    subcategory: "loans",
    title: "How Much House Can I Afford Calculator",
    description: "Determine how much house you can afford based on your income, debts, down payment, and current mortgage rates.",
    loader: () => import("@/components/calculators/Financial/HouseAffordabilityCalculator"),
    aliases: ["home-affordability", "afford-house"],
    urlStyle: "flat",
  },
  {
    slug: "roi-return-on-investment",
    category: "financial",
    subcategory: "investments",
    title: "Investment Return (ROI) Calculator",
    description: "Calculate return on investment for any asset including stocks, real estate, or business investments with detailed ROI percentage.",
    loader: () => import("@/components/calculators/Financial/RoiReturnOnInvestmentCalculator"),
    aliases: ["roi-calculator", "investment-return"],
    urlStyle: "flat",
  },
  {
    slug: "retirement-savings-goal",
    category: "financial",
    subcategory: "retirement",
    title: "Retirement Savings Goal Calculator",
    description: "Calculate how much you need to save for retirement based on your desired lifestyle, expected expenses, and Social Security.",
    loader: () => import("@/components/calculators/Financial/RetirementSavingsGoalCalculator"),
    aliases: ["retirement-calculator", "retirement-planning"],
    urlStyle: "flat",
  },
  {
    slug: "401k-retirement-savings-growth",
    category: "financial",
    subcategory: "retirement",
    title: "401(k) Retirement Savings Growth Calculator",
    description: "Project your 401(k) balance at retirement with employer matching contributions, annual increases, and compound interest.",
    loader: () => import("@/components/calculators/Financial/FourZeroOneKRetirementSavingsGrowthCalculator"),
    aliases: ["401k-calculator", "401k-growth"],
    urlStyle: "flat",
  },
  {
    slug: "compound-interest",
    category: "financial",
    subcategory: "investments",
    title: "Compound Interest Calculator",
    description: "Calculate compound interest growth with regular contributions, showing how your money grows over time with different compounding frequencies.",
    loader: () => import("@/components/calculators/Financial/CompoundInterestCalculator"),
    aliases: ["compound-calculator", "interest-calculator"],
    urlStyle: "flat",
  },
  {
    slug: "credit-card-payoff",
    category: "financial",
    subcategory: "debt",
    title: "Credit Card Payoff Calculator",
    description: "Calculate how long it will take to pay off credit card debt with different payment amounts, including total interest paid.",
    loader: () => import("@/components/calculators/Financial/CreditCardPayoffCalculator"),
    aliases: ["credit-card-calculator", "payoff-calculator"],
    urlStyle: "flat",
  },
  {
    slug: "debt-consolidation",
    category: "financial",
    subcategory: "debt",
    title: "Debt Consolidation Calculator",
    description: "Compare your current debts with a consolidation loan to see potential savings in monthly payments and total interest.",
    loader: () => import("@/components/calculators/Financial/DebtConsolidationCalculator"),
    aliases: ["consolidation-calculator"],
    urlStyle: "flat",
  },

  // ================================================================
  // PETS CALCULATORS (Category: PETS)
  // ================================================================
  {
    slug: "dog-age-to-human-years",
    category: "pets",
    subcategory: "dogs",
    title: "Dog Age to Human Years Calculator",
    description: "Convert your dog's age to human years using the latest veterinary science formula that accounts for breed size.",
    loader: () => import("@/components/calculators/Pets/DogAgeCalculator"),
    aliases: ["dog-age-calculator", "dog-years"],
    urlStyle: "nested",
  },
  {
    slug: "cat-age-to-human-years",
    category: "pets",
    subcategory: "cats",
    title: "Cat Age to Human Years Calculator",
    description: "Convert your cat's age to human years using veterinary-approved calculations for accurate age equivalency.",
    loader: () => import("@/components/calculators/Pets/CatAgeCalculator"),
    aliases: ["cat-age-calculator", "cat-years"],
    urlStyle: "nested",
  },
  {
    slug: "cat-feeding-schedule-by-age",
    category: "pets",
    subcategory: "cats",
    title: "Cat Feeding Schedule by Age Calculator",
    description: "Determine optimal feeding schedule and portion sizes for cats based on age (kitten/adult/senior) and weight.",
    loader: () => import("@/components/calculators/Pets/CatFeedingScheduleByAge"),
    aliases: ["cat-feeding", "cat-meal-schedule"],
    urlStyle: "nested",
  },
  {
    slug: "cat-water-needs-per-day",
    category: "pets",
    subcategory: "cats",
    title: "Daily Cat Water Intake Calculator",
    description: "Calculate how much water your cat needs daily based on weight, diet type (dry/wet), and activity level.",
    loader: () => import("@/components/calculators/Pets/CatWaterNeedsPerDay"),
    aliases: ["cat-water-intake", "cat-hydration"],
    urlStyle: "nested",
  },
  {
    slug: "cat-calorie-needs-per-day",
    category: "pets",
    subcategory: "cats",
    title: "Cat Daily Calorie Needs Calculator",
    description: "Calculate your cat's daily calorie requirements based on weight, age, activity level, and health status.",
    loader: () => import("@/components/calculators/Pets/CatCalorieNeedsPerDay"),
    aliases: ["cat-calories", "cat-food-amount"],
    urlStyle: "nested",
  },
  {
    slug: "cat-litter-change-frequency",
    category: "pets",
    subcategory: "cats",
    title: "Litter Box Change Frequency Calculator",
    description: "Determine how often to change cat litter based on number of cats, litter type, and box size for optimal hygiene.",
    loader: () => import("@/components/calculators/Pets/CatLitterChangeFrequency"),
    aliases: ["litter-box-schedule", "cat-litter-cleaning"],
    urlStyle: "nested",
  },
  {
    slug: "cat-playtime-duration",
    category: "pets",
    subcategory: "cats",
    title: "Cat Daily Playtime Duration Calculator",
    description: "Calculate recommended daily playtime for your cat based on age, energy level, and whether they're indoor or outdoor.",
    loader: () => import("@/components/calculators/Pets/CatPlaytimeDuration"),
    aliases: ["cat-exercise", "cat-play-schedule"],
    urlStyle: "nested",
  },
  {
    slug: "cat-vaccination-schedule",
    category: "pets",
    subcategory: "cats",
    title: "Cat Vaccination Schedule Calculator",
    description: "Create a personalized vaccination schedule for your cat from kitten to senior, including core and non-core vaccines.",
    loader: () => import("@/components/calculators/Pets/CatVaccinationSchedule"),
    aliases: ["cat-vaccines", "cat-immunization"],
    urlStyle: "nested",
  },
  {
    slug: "cat-growth-predictor",
    category: "pets",
    subcategory: "cats",
    title: "Kitten Adult Weight Predictor",
    description: "Predict your kitten's adult weight based on current age, weight, and breed to plan for their full-grown size.",
    loader: () => import("@/components/calculators/Pets/CatGrowthPredictor"),
    aliases: ["kitten-weight-predictor", "cat-size-calculator"],
    urlStyle: "nested",
  },
  {
    slug: "cat-ideal-weight-calculator",
    category: "pets",
    subcategory: "cats",
    title: "Cat Ideal Weight Calculator (BCS)",
    description: "Calculate your cat's ideal weight using Body Condition Score (BCS) system to determine if they're underweight, ideal, or overweight.",
    loader: () => import("@/components/calculators/Pets/CatIdealWeightCalculator"),
    aliases: ["cat-weight-checker", "cat-bcs"],
    urlStyle: "nested",
  },
  {
    slug: "cat-medication-dosage",
    category: "pets",
    subcategory: "cats",
    title: "Cat Medication Dosage Calculator (by weight)",
    description: "Calculate proper medication dosage for cats based on weight (kg or lbs) and prescribed mg/kg dose from your veterinarian.",
    loader: () => import("@/components/calculators/Pets/CatMedicationDosage"),
    aliases: ["cat-medicine-dose", "cat-drug-calculator"],
    urlStyle: "nested",
  },
  {
    slug: "cat-pregnancy-due-date",
    category: "pets",
    subcategory: "cats",
    title: "Cat Pregnancy Due Date Calculator (63-65 days)",
    description: "Calculate your pregnant cat's due date based on mating date, with week-by-week pregnancy stages and preparation tips.",
    loader: () => import("@/components/calculators/Pets/CatPregnancyDueDate"),
    aliases: ["cat-gestation-calculator", "kitten-due-date"],
    urlStyle: "nested",
  },
  {
    slug: "cat-heat-cycle-predictor",
    category: "pets",
    subcategory: "cats",
    title: "Cat Heat Cycle Predictor",
    description: "Predict when your cat will go into heat based on breed, age, and last heat cycle date for better planning.",
    loader: () => import("@/components/calculators/Pets/CatHeatCyclePredictor"),
    aliases: ["cat-estrus-calculator", "cat-breeding-calendar"],
    urlStyle: "nested",
  },
  {
    slug: "cat-annual-expense-estimator",
    category: "pets",
    subcategory: "cats",
    title: "Annual Cat Care Cost Estimator",
    description: "Estimate yearly cat expenses including food, litter, vet care, toys, and supplies based on your cat's needs.",
    loader: () => import("@/components/calculators/Pets/CatAnnualExpenseEstimator"),
    aliases: ["cat-cost-calculator", "cat-budget-planner"],
    urlStyle: "nested",
  },
  {
    slug: "cat-travel-crate-size",
    category: "pets",
    subcategory: "cats",
    title: "Cat Carrier/Crate Size Calculator",
    description: "Find the right carrier or crate size for your cat based on their measurements for safe and comfortable travel.",
    loader: () => import("@/components/calculators/Pets/CatTravelCrateSize"),
    aliases: ["cat-carrier-size", "cat-crate-calculator"],
    urlStyle: "nested",
  },
  {
    slug: "cat-grooming-schedule-planner",
    category: "pets",
    subcategory: "cats",
    title: "Cat Grooming Schedule Planner (fur type based)",
    description: "Create a grooming schedule for brushing, bathing, and nail trimming based on your cat's fur type and length.",
    loader: () => import("@/components/calculators/Pets/CatGroomingSchedulePlanner"),
    aliases: ["cat-grooming-calendar", "cat-care-schedule"],
    urlStyle: "nested",
  },
  {
    slug: "cat-shedding-combing-planner",
    category: "pets",
    subcategory: "cats",
    title: "Cat Shedding & Combing Frequency Planner",
    description: "Plan combing frequency during shedding season based on fur length, breed, and seasonal factors.",
    loader: () => import("@/components/calculators/Pets/CatSheddingCombingPlanner"),
    aliases: ["cat-brushing-schedule", "cat-fur-care"],
    urlStyle: "nested",
  },
  {
    slug: "cat-nail-trim-interval",
    category: "pets",
    subcategory: "cats",
    title: "Nail Trim Interval Planner (activity/surface based)",
    description: "Plan nail trimming interval based on your cat's activity level and the surfaces they use (carpet, wood, scratchers).",
    loader: () => import("@/components/calculators/Pets/CatNailTrimInterval"),
    aliases: ["cat-nail-care", "cat-claw-trimming"],
    urlStyle: "nested",
  },
  {
    slug: "multi-cat-litterbox-count",
    category: "pets",
    subcategory: "cats",
    title: "Multi-Cat Litter Box Count Calculator",
    description: "Calculate recommended number of litter boxes based on number of cats and rooms using the N+1 rule.",
    loader: () => import("@/components/calculators/Pets/MultiCatLitterboxCount"),
    aliases: ["multi-cat-litterbox", "litter-box-calculator"],
    urlStyle: "nested",
  },
  {
    slug: "cat-enrichment-planner",
    category: "pets",
    subcategory: "cats",
    title: "Environmental Enrichment Planner (per room)",
    description: "Plan room-by-room enrichment for indoor cats including perches, scratchers, toys, and hiding spots.",
    loader: () => import("@/components/calculators/Pets/CatEnrichmentPlanner"),
    aliases: ["cat-environment-calculator", "indoor-cat-setup"],
    urlStyle: "nested",
  },
  {
    slug: "cat-stress-score-playtime-offset",
    category: "pets",
    subcategory: "cats",
    title: "Stress Score & Playtime Offset Planner",
    description: "Estimate your cat's stress score based on environment factors and calculate how much playtime can help reduce stress.",
    loader: () => import("@/components/calculators/Pets/CatStressScorePlaytimeOffset"),
    aliases: ["cat-stress-score", "cat-anxiety-calculator"],
    urlStyle: "nested",
  },

  // ================================================================
  // PLACEHOLDER FOR N8N AUTO-INJECTION
  // ================================================================
  // SKN-AUTO-REGISTER: do not remove this line
  // N8N workflow will inject new calculator entries above this comment
];

// ====================================================================
// HELPER FUNCTIONS
// ====================================================================

export const REGISTRY: CalculatorEntry[] = calculatorRegistry;

function allSlugs(entry: CalculatorEntry): string[] {
  return [entry.slug, ...(entry.aliases ?? [])];
}

export function getEntry(slugOrAlias?: string): CalculatorEntry | undefined {
  const s = (slugOrAlias || "").toLowerCase();
  return REGISTRY.find((e) => allSlugs(e).some((x) => (x || "").toLowerCase() === s));
}

export function listByCategory(category?: string): CalculatorEntry[] {
  const key = normalize(category);
  return REGISTRY.filter((e) => normalize(e.category) === key);
}

export function listByCategorySubcategory(category?: string, subcategory?: string): CalculatorEntry[] {
  const cat = normalize(category);
  const sub = normalize(subcategory);
  return REGISTRY.filter(
    (e) => normalize(e.category) === cat && normalize(e.subcategory) === sub
  );
}

export function listBy(subcategory: CalculatorEntry["subcategory"]) {
  return REGISTRY.filter((e) => e.subcategory === subcategory);
}

export function listSubcategoriesOfCategory(category?: string): Array<{ slug: string; title: string }> {
  const cat = normalize(category);
  const subs = new Set(
    REGISTRY
      .filter((e) => normalize(e.category) === cat)
      .map((e) => normalize(e.subcategory))
      .filter(Boolean)
  );
  const titles = SUBCATEGORY_TITLES[cat] ?? {};
  return Array.from(subs).map((slug) => ({
    slug,
    title: titles[slug] || slug,
  }));
}

export function getAllCategories(): string[] {
  const cats = new Set(REGISTRY.map((e) => normalize(e.category)).filter(Boolean));
  return Array.from(cats);
}

export function getTotalCalculatorCount(): number {
  return REGISTRY.length;
}

export function getCalculatorCountByCategory(category: string): number {
  return listByCategory(category).length;
}
