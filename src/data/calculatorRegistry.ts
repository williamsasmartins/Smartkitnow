// src/data/calculatorRegistry.ts
import React from "react";

/**
 * Estrutura de cada calculadora registrada
 */
export type CalcEntry = {
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  description?: string;
  loader: () => Promise<any>;
  namedExport?: string;
  aliases?: string[];
};

/**
 * Títulos “bonitos” por categoria (usados nos headers das páginas)
 */
export const FRIENDLY_TITLES: Record<string, string> = {
  construction: "Construction Calculators",
  cooking: "Cooking Calculators",
  health: "Health & Fitness Calculators",
  financial: "Financial Calculators",
  electrical: "Electrical Calculators",
  math: "Math Calculators",
  pets: "Pets Calculators",
  science: "Science Calculators",
  time: "Time & Date Calculators",
  tv: "TV & Home Theater Calculators",
  conversion: "Conversion Calculators",
};

/**
 * Títulos “bonitos” por subcategoria (aparecem nas páginas intermediárias)
 * — mantenha os slugs exatamente como na rota.
 */
export const SUBCATEGORY_TITLES: Record<string, string> = {
  // Construction
  "concrete-masonry-calculators": "Concrete & Masonry Calculators",
  "carpentry-trim-calculators": "Carpentry & Trim Calculators",
  // 🔁 padronizamos esta subcategoria para casar com a URL
  "wall-ceiling-calculators": "Wall & Ceiling Calculators",

  // Cooking
  "cooking-baking-calculators": "Cooking & Baking Calculators",
  "cooking-measurements": "Cooking Measurements",
  "cooking-unit-conversions": "Unit Conversion Calculators",

  // Health
  "body-measurement-calculators": "Body Measurement Calculators",
  "calories-conversion": "Calories Conversion",
  "diet-nutrition-calculators": "Dietary & Nutrition Calculators",
  "fitness-calculators": "Fitness Calculators",

  // Financial
  "personal-finance-calculators": "Personal Finance Calculators",
  "interest-and-loan-calculators": "Interest and Loan Calculators",
  "mortgage-and-home-loan-calculators": "Mortgage & Home Loan Calculators",
};

/**
 * Carregadores (lazy)
 */
const loadConcreteSlab = () => import("@/components/calculators/ConcreteSlab");
const loadDrywallAreaSheets = () => import("@/components/calculators/DrywallAreaSheets");
const loadDrywallEstimator = () => import("@/components/calculators/DrywallEstimator");

const loadCake = () => import("@/components/calculators/CakeCalculator");
const loadCookingConversion = () => import("@/components/calculators/CookingConversionCalculator");
const loadCookingTimer = () => import("@/components/calculators/CookingTimer");
const loadRecipeScaling = () => import("@/components/calculators/cooking/RecipeScalingCalculator");

const loadCaloriesToKg = () => import("@/components/calculators/CaloriesToKilogramsCalculator");
const loadBMI = () => import("@/components/calculators/BMICalculator");
const loadBMR = () => import("@/components/calculators/BMRCalculator");
const loadTDEE = () => import("@/components/calculators/TDEECalculator");
const loadCalorieIntake = () => import("@/components/calculators/CalorieCalculator");

const loadMortgage = () => import("@/components/calculators/MortgageCalculator");
const loadMortgageRefi = () => import("@/components/calculators/financial/MortgageRefinanceCalculator");
const loadLoan = () => import("@/components/calculators/LoanCalculator");
const loadROI = () => import("@/components/calculators/financial/ROICalculator");
const loadCompoundInterest = () => import("@/components/calculators/CompoundInterestCalculator");

/**
 * REGISTRY – lista todas as calculadoras com categoria/subcategoria/slug
 * Hierarquia de rota: /:category/:subcategory/:slug
 */
export const REGISTRY: CalcEntry[] = [
  // =========================
  // CONSTRUCTION
  // =========================
  {
    slug: "concrete-slab-volume-bags",
    aliases: ["concrete-slab"],
    name: "Concrete Slab — Volume & Bags",
    category: "construction",
    subcategory: "concrete-masonry-calculators",
    description: "Estimate concrete volume and bag counts for slabs.",
    loader: loadConcreteSlab,
  },
  {
    slug: "drywall-area-and-sheets",
    aliases: ["drywall-area-sheets"], // ← sua URL usa esse alias
    name: "Drywall — Area & Sheets",
    category: "construction",
    subcategory: "wall-ceiling-calculators", // ← padronizado com a URL
    description: "Calculate drywall area and number of sheets needed.",
    loader: loadDrywallAreaSheets,
  },
  {
    slug: "drywall-estimator",
    name: "Drywall Estimator",
    category: "construction",
    subcategory: "wall-ceiling-calculators", // ← padronizado com a URL
    description: "Material & cost estimator for drywall projects.",
    loader: loadDrywallEstimator,
  },

  // =========================
  // COOKING
  // =========================
  {
    slug: "cake",
    name: "Cake Calculator",
    category: "cooking",
    subcategory: "cooking-baking-calculators",
    description: "Serving sizes and ingredient amounts for cakes.",
    loader: loadCake,
  },
  {
    slug: "cooking-conversion",
    name: "Cooking Conversion Calculator",
    category: "cooking",
    subcategory: "cooking-unit-conversions",
    description: "Convert between cups, grams, tablespoons, etc.",
    loader: loadCookingConversion,
  },
  {
    slug: "timer",
    name: "Timer",
    category: "cooking",
    subcategory: "cooking-baking-calculators",
    description: "Simple cooking timer for perfect timing.",
    loader: loadCookingTimer,
  },
  {
    slug: "recipe-scale",
    aliases: ["recipe-scaling"],
    name: "Recipe Scale Conversion Calculator",
    category: "cooking",
    subcategory: "cooking-baking-calculators",
    description: "Scale recipes up or down easily.",
    loader: loadRecipeScaling,
  },

  // =========================
  // HEALTH
  // =========================
  {
    slug: "calories-to-kilograms-calculator",
    aliases: ["calories-to-kg", "convert-calories-to-kilograms"],
    name: "Convert Calories to Kilograms",
    category: "health",
    subcategory: "calories-conversion",
    description: "Convert calories to kilograms of body fat equivalent.",
    loader: loadCaloriesToKg,
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "health",
    subcategory: "body-measurement-calculators",
    description: "Body Mass Index calculator.",
    loader: loadBMI,
  },
  {
    slug: "bmr-calculator",
    name: "BMR Calculator",
    category: "health",
    subcategory: "diet-nutrition-calculators",
    description: "Basal Metabolic Rate calculator.",
    loader: loadBMR,
  },
  {
    slug: "tdee-calculator",
    name: "TDEE Calculator",
    category: "health",
    subcategory: "diet-nutrition-calculators",
    description: "Total Daily Energy Expenditure.",
    loader: loadTDEE,
  },
  {
    slug: "calorie-intake-calculator",
    aliases: ["calorie-calculator"],
    name: "Calorie Intake Calculator",
    category: "health",
    subcategory: "diet-nutrition-calculators",
    description: "Daily calorie needs estimator.",
    loader: loadCalorieIntake,
  },

  // =========================
  // FINANCIAL
  // =========================
  {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    category: "financial",
    subcategory: "mortgage-and-home-loan-calculators",
    description: "Estimate monthly mortgage payments.",
    loader: loadMortgage,
  },
  {
    slug: "mortgage-refinance-calculator",
    name: "Mortgage Refinance Calculator",
    category: "financial",
    subcategory: "mortgage-and-home-loan-calculators",
    description: "Evaluate a potential mortgage refinance.",
    loader: loadMortgageRefi,
  },
  {
    slug: "loan-calculator",
    name: "Loan Calculator",
    category: "financial",
    subcategory: "interest-and-loan-calculators",
    description: "Payments, interest and amortization.",
    loader: loadLoan,
  },
  {
    slug: "roi-calculator",
    name: "ROI Calculator",
    category: "financial",
    subcategory: "personal-finance-calculators",
    description: "Return on Investment calculator.",
    loader: loadROI,
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "financial",
    subcategory: "interest-and-loan-calculators",
    description: "Growth with compounding interest.",
    loader: loadCompoundInterest,
  },
];

/**
 * Helpers públicos
 */
export function getEntry(slug?: string) {
  if (!slug) return undefined;
  return REGISTRY.find(
    (e) => e.slug === slug || (e.aliases && e.aliases.includes(slug))
  );
}

export function listByCategory(category: string) {
  return REGISTRY.filter((e) => e.category === category);
}

export function listByCategorySubcategory(category: string, subcategory?: string) {
  return REGISTRY.filter(
    (e) => e.category === category && (subcategory ? e.subcategory === subcategory : true)
  );
}

export function listSubcategoriesOfCategory(category: string) {
  const items = listByCategory(category);
  const map = new Map<string, number>();
  for (const it of items) {
    const sub = it.subcategory ?? "_uncategorized";
    map.set(sub, (map.get(sub) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([slug, count]) => ({
    slug,
    title:
      SUBCATEGORY_TITLES[slug] ??
      slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()),
    count,
  }));
}
