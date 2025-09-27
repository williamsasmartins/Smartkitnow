// src/data/calculatorRegistry.ts
import React from "react";

/**
 * Estrutura de cada calculadora registrada
 */
export type CalcEntry = {
  /** slug final da calculadora (usado na URL) */
  slug: string;
  /** Nome que aparece no card/detalhe */
  name: string;
  /** Categoria raiz (ex.: construction, cooking, health, financial...) */
  category: string;
  /** Subcategoria (ex.: wall-ceiling-calculators) */
  subcategory?: string;
  /** Descrição curta opcional para listas */
  description?: string;
  /** Import assíncrono da calculadora */
  loader: () => Promise<any>;
  /** Se o módulo não exporta default, informe o nome da exportação */
  namedExport?: string;
  /** URLs alternativas aceitas para a mesma calculadora */
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
  "wall-ceiling-calculators": "Wall & Ceiling Calculators",

  // (mantém os antigos se ainda existirem em algum lugar do site)
  "drywall-paint-calculators": "Wall & Ceiling Calculators",

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
 * IMPORTANTE: mantenha os caminhos condizentes com seus arquivos em src/components/calculators
 */

// Construction
const loadConcreteSlab = () => import("@/components/calculators/ConcreteSlab");
const loadDrywallAreaSheets = () => import("@/components/calculators/DrywallAreaSheets");
const loadDrywallEstimator = () => import("@/components/calculators/DrywallEstimator");
const loadPaint = () => import("@/components/calculators/PaintCalculator");
const loadWallpaper = () => import("@/components/calculators/WallpaperCalculator");

// Cooking
const loadCake = () => import("@/components/calculators/CakeCalculator");
const loadCookingConversion = () => import("@/components/calculators/CookingConversionCalculator");
const loadCookingTimer = () => import("@/components/calculators/CookingTimer");
const loadRecipeScaling = () => import("@/components/calculators/cooking/RecipeScalingCalculator");

// Health
const loadCaloriesToKg = () => import("@/components/calculators/CaloriesToKilogramsCalculator");
const loadBMI = () => import("@/components/calculators/BMICalculator");
const loadBMR = () => import("@/components/calculators/BMRCalculator");
const loadTDEE = () => import("@/components/calculators/TDEECalculator");
const loadCalorieIntake = () => import("@/components/calculators/CalorieCalculator");

// Financial
const loadMortgage = () => import("@/components/calculators/MortgageCalculator");
const loadMortgageRefi = () => import("@/components/calculators/financial/MortgageRefinanceCalculator");
const loadLoan = () => import("@/components/calculators/LoanCalculator");
const loadROI = () => import("@/components/calculators/financial/ROICalculator");
const loadCompoundInterest = () => import("@/components/calculators/CompoundInterestCalculator");

/**
 * REGISTRY – liste aqui todas as calculadoras com categoria/subcategoria/slug
 * A hierarquia da rota fica: /:category/:subcategory/:slug
 */
export const REGISTRY: CalcEntry[] = [
  /**
   * =========================
   * CONSTRUCTION
   * =========================
   */
  {
    slug: "concrete-slab-volume-bags",
    aliases: ["concrete-slab"],
    name: "Concrete Slab — Volume & Bags",
    category: "construction",
    subcategory: "concrete-masonry-calculators",
    description: "Estimate concrete volume and bag counts for slabs.",
    loader: loadConcreteSlab,
  },

  // 🔹 Slug canônico “drywall-area-sheets” usando o DrywallEstimator
  {
    slug: "drywall-area-sheets",
    aliases: [
      "drywall-estimator",
      "drywall-area-and-sheets",
      "drywall-sheets",
      "drywall-calculator"
    ],
    name: "Drywall — Area & Sheets",
    category: "construction",
    subcategory: "wall-ceiling-calculators",
    description: "Drywall estimator with rooms, openings, boards and costs.",
    loader: loadDrywallEstimator,
  },

  // (opcional) manter o componente antigo acessível por um slug próprio
  {
    slug: "drywall-area-sheets-legacy",
    aliases: ["drywall-legacy"],
    name: "Drywall — Area & Sheets (Legacy)",
    category: "construction",
    subcategory: "wall-ceiling-calculators",
    description: "Legacy drywall area & sheets calculator.",
    loader: loadDrywallAreaSheets,
  },

  // ✅ Novas calculadoras da subcategoria Wall & Ceiling
  {
    slug: "paint-calculator",
    aliases: ["paint", "painting-calculator"],
    name: "Paint Calculator",
    category: "construction",
    subcategory: "wall-ceiling-calculators",
    description: "Estimate paint needed by area, number of coats and coverage.",
    loader: loadPaint,
  },
  {
    slug: "wallpaper-calculator",
    aliases: ["wallpaper"],
    name: "Wallpaper Calculator",
    category: "construction",
    subcategory: "wall-ceiling-calculators",
    description: "Estimate rolls needed based on room size and pattern repeat.",
    loader: loadWallpaper,
  },

  /**
   * =========================
   * COOKING
   * =========================
   */
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

  /**
   * =========================
   * HEALTH
   * =========================
   */
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

  /**
   * =========================
   * FINANCIAL
   * =========================
   */
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
 * ================
 * Helpers públicos
 * ================
 */

/** Localiza uma calculadora pelo slug OU pelos seus aliases */
export function getEntry(slug?: string) {
  if (!slug) return undefined;
  return REGISTRY.find(
    (e) => e.slug === slug || (e.aliases && e.aliases.includes(slug))
  );
}

/** Lista todas as calculadoras de uma categoria */
export function listByCategory(category: string) {
  return REGISTRY.filter((e) => e.category === category);
}

/** Lista todas as calculadoras de uma categoria + (opcional) subcategoria */
export function listByCategorySubcategory(category: string, subcategory?: string) {
  return REGISTRY.filter(
    (e) => e.category === category && (subcategory ? e.subcategory === subcategory : true)
  );
}

/**
 * Retorna as subcategorias existentes dentro de uma categoria,
 * junto com a contagem de calculadoras em cada uma — útil para montar a página intermediária.
 */
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
