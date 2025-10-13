// src/data/calculatorRegistry.ts
import React from "react";

/**
 * Structure of each registered calculator
 */
export interface CalculatorEntry {
  /** final calculator slug (used in URL) */
  slug: string;
  /** category (e.g., "math", "health") */
  category: string;
  /** subcategory (e.g., "percentage", "bmi") */
  subcategory: string;
  /** calculator title */
  title: string;
  /** optional short description for lists */
  description?: string;
  /** async import of the calculator */
  loader: () => Promise<{ default: React.ComponentType<any> }>;
  /** alternative URLs accepted for the same calculator */
  aliases?: string[];
}

/**
 * Títulos “bonitos” por categoria (usados nos headers das páginas)
 */
export const FRIENDLY_TITLES: Record<string, string> = {
  construction: "Construction Calculators",
  cooking: "Cooking Calculators",
  health: "Health & Fitness Calculators",
  financial: "Financial Calculators",
  electrical: "Electrical Calculators",
  math: "Math & Algebra Calculators",
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
  // Compat antigo
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

  // Math
  "everyday-math": "Everyday Math",
  "percent-calculators": "Percentage Calculators",

  // Pets
  "pet-care-calculators": "Dog Care Calculators",
  "general": "General Pet Calculators",
};

// Centralized icons for categories and subcategories
export function categoryIcon(category: string): string {
  const byCategory: Record<string, string> = {
    health: "🩺",
    cooking: "🍳",
    construction: "🏗️",
    financial: "💰",
    pets: "🐶",
    math: "🧮",
    science: "🔬",
    time: "⏱️",
    tv: "📺",
    conversion: "🔁",
    electrical: "⚡",
    // Additional categories used in Header More menu
    "smart-tips": "💡",
    automotive: "🚗",
    sports: "🏅",
    funny: "😄",
    "daily-quotes": "💬",
    "everyday-life": "🏡",
    recipes: "📚",
  };
  return byCategory[category] ?? "📚";
}

export function subcategoryIcon(slug: string, fallbackCategory?: string): string {
  const bySlug: Record<string, string> = {
    // Health
    "body-measurement-calculators": "📏",
    "fitness-calculators": "🏋️",
    "metabolism-calculators": "🔥",
    "diet-nutrition-calculators": "🥗",
    "calories-conversion": "🍎",
    "weight-loss-calculators": "⚖️",
    // Cooking
    "cooking-baking-calculators": "🍰",
    "cooking-measurements": "🥄",
    "cooking-unit-conversions": "🔁",
    // Construction
    "wall-ceiling-calculators": "🧱",
    "carpentry-trim-calculators": "🪚",
    "concrete-masonry-calculators": "🧱",
    // Financial
    "personal-finance-calculators": "💼",
    "interest-and-loan-calculators": "💳",
    "loan-calculators": "💳",
    "mortgage-and-home-loan-calculators": "🏠",
    "investment-calculators": "📈",
    // Math
    "percent-calculators": "🔢",
    "everyday-math": "🧮",
    // Pets
    "pet-care-calculators": "🐾",
    // Fallback for generic groups
    "general": "🐾",
  };
  if (bySlug[slug]) return bySlug[slug];
  return categoryIcon(fallbackCategory ?? "");
}

/* =========================
 *  Loaders (lazy imports)
 * =========================
 * IMPORTANTE: caminhos devem bater com src/components/calculators
 */

// Construction
const loadConcreteSlab = () => import("@/components/calculators/ConcreteSlab");
const loadDrywallEstimator = () =>
  import("@/components/calculators/DrywallEstimator");
const loadPaint = () => import("@/components/calculators/PaintCalculator");
const loadWallpaper = () =>
  import("@/components/calculators/WallpaperCalculator");

// Cooking
const loadCake = () => import("@/components/calculators/CakeCalculator");
const loadCookingConversion = () =>
  import("@/components/calculators/CookingConversionCalculator");
const loadCookingTimer = () =>
  import("@/components/calculators/CookingTimer");
const loadRecipeScaling = () =>
  import("@/components/calculators/cooking/RecipeScalingCalculator");

// Health
const loadCaloriesToKg = () =>
  import("@/components/calculators/CaloriesToKilogramsCalculator");
const loadBMI = () => import("@/components/calculators/BMICalculator");
const loadBMR = () => import("@/components/calculators/BMRCalculator");
const loadTDEE = () => import("@/components/calculators/TDEECalculator");
const loadCalorieIntake = () =>
  import("@/components/calculators/CalorieCalculator");

// Financial
const loadMortgage = () =>
  import("@/components/calculators/MortgageCalculator");
const loadMortgageRefi = () =>
  import("@/components/calculators/financial/MortgageRefinanceCalculator");
const loadLoan = () => import("@/components/calculators/LoanCalculator");
const loadROI = () => import("@/components/calculators/financial/ROICalculator");
const loadCompoundInterest = () =>
  import("@/components/calculators/CompoundInterestCalculator");

// Math (percent) loaders
const loadPercentOf = () =>
  import("@/components/calculators/math/PercentOfCalculator");
const loadPercentIncrease = () =>
  import("@/components/calculators/math/PercentIncreaseCalculator");
const loadPercentDecrease = () =>
  import("@/components/calculators/math/PercentDecreaseCalculator");
const loadPercentChange = () =>
  import("@/components/calculators/math/PercentChangeCalculator");

// Math — Fractions (LOADERS)
const loadFractionReducer = () =>
  import("@/components/calculators/math/FractionReducerCalculator");
const loadFractionToDecimal = () =>
  import("@/components/calculators/math/FractionToDecimalCalculator");
const loadDecimalToFraction = () =>
  import("@/components/calculators/math/DecimalToFractionCalculator");
const loadPercentToFraction = () =>
  import("@/components/calculators/math/PercentToFractionCalculator");

// Math (everyday) loaders
const loadAverage = () =>
  import("@/components/calculators/math/AverageCalculator");
const loadProportion = () =>
  import("@/components/calculators/math/ProportionCalculator");
// Add placeholder loader for batch creation of calculators without content
const loadPlaceholder = () =>
  import("@/components/calculators/PlaceholderCalculator");

// Pets — Loaders
const loadPetAge = () => import("@/components/calculators/PetAgeCalculator");
const loadQualityOfLifeScale = () => import("@/components/calculators/QualityOfLifeScale");
const loadPetQualityOfLife = () => import("@/components/calculators/PetQualityOfLifeCalculator");
// New pet calculators
const loadPetCaloriePNA = () => import("@/components/calculators/PetCaloriePNACalculator");
const loadPetCalorieVet = () => import("@/components/calculators/PetCalorieVetCalculator");
const loadPetFeedingDecisions = () => import("@/components/calculators/PetFeedingDecisionsCalculator");
// General pets calculators (new)
const loadPetLife = () => import("@/components/calculators/PetLifeCalculator");
const loadPetEmergencyDrug = () => import("@/components/calculators/PetEmergencyDrugCalculator");
const loadPetCosts = () => import("@/components/calculators/PetCostsCalculator");





  

/**
 * REGISTRY – list here all calculators with category/subcategory/slug
 * A hierarquia da rota fica: /:category/:subcategory/:slug
 */
export const REGISTRY: CalculatorEntry[] = [
  /**
   * =========================
   * CONSTRUCTION
   * =========================
   */
  {
    slug: "concrete-slab-volume-bags",
    aliases: ["concrete-slab"],
    category: "construction",
    subcategory: "concrete-masonry-calculators",
    title: "Concrete Slab — Volume & Bags",
    description: "Calculate concrete volume and bags needed for slabs",
    loader: () => import("@/components/calculators/ConcreteSlab"),
  },
  {
    slug: "drywall-area-sheets",
    aliases: ["drywall"],
    category: "construction",
    subcategory: "wall-ceiling-calculators",
    title: "Drywall — Area & Sheets",
    description: "Calculate drywall area and number of sheets needed",
    loader: () => import("@/components/calculators/DrywallEstimator"),
  },
  {
    slug: "paint-calculator",
    category: "construction",
    subcategory: "wall-ceiling-calculators",
    title: "Paint Calculator",
    description: "Calculate paint needed for walls and ceilings",
    loader: () => import("@/components/calculators/PaintCalculator"),
  },
  {
    slug: "wallpaper-calculator",
    category: "construction",
    subcategory: "wall-ceiling-calculators",
    title: "Wallpaper Calculator",
    description: "Calculate wallpaper rolls needed",
    loader: () => import("@/components/calculators/WallpaperCalculator"),
  },

  /**
   * =========================
   * COOKING
   * =========================
   */
  {
    slug: "cake-calculator",
    category: "cooking",
    subcategory: "baking-calculators",
    title: "Cake Calculator",
    description: "Calculate cake ingredients and portions",
    loader: () => import("@/components/calculators/CakeCalculator"),
  },
  {
    slug: "cooking-conversion-calculator",
    category: "cooking",
    subcategory: "conversion-calculators",
    title: "Cooking Conversion Calculator",
    description: "Convert cooking measurements and units",
    loader: () => import("@/components/calculators/CookingConversionCalculator"),
  },
  {
    slug: "timer",
    category: "cooking",
    subcategory: "cooking-tools",
    title: "Timer",
    description: "Kitchen timer for cooking",
    loader: () => import("@/components/calculators/CookingTimer"),
  },
  {
    slug: 'recipe-scale-conversion',
    category: 'cooking',
    subcategory: 'scaling',
    title: 'Recipe Scale Conversion',
    description: 'Adjust your recipe quantities for any number of servings.',
    loader: () => import('../components/calculators/RecipeScaleCalculator'),
  },
  {
    slug: "recipe-scale-conversion-calculator",
    aliases: ["recipe-scaling"],
    category: "cooking",
    subcategory: "conversion-calculators",
    title: "Recipe Scale Conversion Calculator",
    description: "Scale recipe ingredients up or down",
    loader: () => import("../components/calculators/cooking/RecipeScalingCalculator"),
  },

  /**
   * =========================
   * HEALTH
   * =========================
   */
  {
    slug: "calories-to-kilograms",
    aliases: ["calories-to-kg", "calorie-weight-conversion"],
    category: "health",
    subcategory: "weight-loss-calculators",
    title: "Convert Calories to Kilograms",
    description: "Convert calories to weight loss/gain in kilograms",
    loader: () => import("@/components/calculators/CaloriesToKilogramsCalculator"),
  },
  {
    slug: "bmi-calculator",
    aliases: ["bmi", "body-mass-index"],
    category: "health",
    subcategory: "body-composition-calculators",
    title: "BMI Calculator",
    description: "Calculate Body Mass Index",
    loader: () => import("@/components/calculators/BMICalculator"),
  },
  {
    slug: "bmr-calculator",
    aliases: ["bmr", "basal-metabolic-rate"],
    category: "health",
    subcategory: "metabolism-calculators",
    title: "BMR Calculator",
    description: "Calculate Basal Metabolic Rate",
    loader: () => import("@/components/calculators/BMRCalculator"),
  },
  {
    slug: "tdee-calculator",
    aliases: ["tdee", "total-daily-energy-expenditure"],
    category: "health",
    subcategory: "metabolism-calculators",
    title: "TDEE Calculator",
    description: "Calculate Total Daily Energy Expenditure",
    loader: () => import("@/components/calculators/TDEECalculator"),
  },
  {
    slug: "calorie-intake-calculator",
    aliases: ["calorie-calculator", "daily-calories"],
    category: "health",
    subcategory: "nutrition-calculators",
    title: "Calorie Intake Calculator",
    description: "Calculate daily calorie needs",
    loader: () => import("@/components/calculators/CalorieCalculator"),
  },

  /**
   * =========================
   * FINANCIAL
   * =========================
   */
  {
    slug: "mortgage-calculator",
    aliases: ["mortgage", "home-loan"],
    category: "financial",
    subcategory: "loan-calculators",
    title: "Mortgage Calculator",
    description: "Calculate mortgage payments and amortization",
    loader: () => import("@/components/calculators/MortgageCalculator"),
  },
  {
    slug: "mortgage-refinance-calculator",
    category: "financial",
    subcategory: "loan-calculators",
    title: "Mortgage Refinance Calculator",
    description: "Calculate refinancing benefits and costs",
    loader: () => import("@/components/calculators/financial/MortgageRefinanceCalculator"),
  },
  {
    slug: "loan-calculator",
    aliases: ["loan", "personal-loan"],
    category: "financial",
    subcategory: "loan-calculators",
    title: "Loan Calculator",
    description: "Calculate loan payments and interest",
    loader: () => import("@/components/calculators/LoanCalculator"),
  },
  {
    slug: "roi-calculator",
    aliases: ["roi", "return-on-investment"],
    category: "financial",
    subcategory: "investment-calculators",
    title: "ROI Calculator",
    description: "Calculate return on investment",
    loader: () => import("@/components/calculators/financial/ROICalculator"),
  },
  {
    slug: "compound-interest-calculator",
    aliases: ["compound-interest", "investment-growth"],
    category: "financial",
    subcategory: "investment-calculators",
    title: "Compound Interest Calculator",
    description: "Calculate compound interest and investment growth",
    loader: () => import("@/components/calculators/CompoundInterestCalculator"),
  },
   
  /**
   * =========================
   * MATH
   * =========================
   */
  {
    slug: "fraction-reducer",
    category: "math",
    subcategory: "fraction-calculators",
    title: "Fraction Reducer",
    description: "Reduce fractions to lowest terms",
    loader: () => import("@/components/calculators/math/FractionReducerCalculator"),
  },
  {
    slug: "fraction-to-decimal",
    category: "math",
    subcategory: "fraction-calculators",
    title: "Fraction to Decimal",
    description: "Convert fractions to decimal numbers",
    loader: () => import("@/components/calculators/math/FractionToDecimalCalculator"),
  },
  {
    slug: "decimal-to-fraction",
    category: "math",
    subcategory: "fraction-calculators",
    title: "Decimal to Fraction",
    description: "Convert decimal numbers to fractions",
    loader: () => import("@/components/calculators/math/DecimalToFractionCalculator"),
  },
  {
    slug: "percent-to-fraction",
    category: "math",
    subcategory: "fraction-calculators",
    title: "Percent to Fraction",
    description: "Convert percentages to fractions",
    loader: () => import("@/components/calculators/math/PercentToFractionCalculator"),
  },

  /**
   * =========================
   * PERCENTAGE
   * =========================
   */
  {
    slug: "percent-of-total",
    aliases: ["percentage-of-total"],
    category: "math",
    subcategory: "percentage-calculators",
    title: "Percent of Total",
    description: "Calculate what percent one number is of another",
    loader: () => import("@/components/calculators/math/PercentOfCalculator"),
  },
  {
    slug: "percent-increase",
    aliases: ["percentage-increase"],
    category: "math",
    subcategory: "percentage-calculators",
    title: "Percent Increase",
    description: "Calculate percentage increase between two values",
    loader: () => import("@/components/calculators/math/PercentIncreaseCalculator"),
  },
  {
    slug: "percent-decrease",
    aliases: ["percentage-decrease"],
    category: "math",
    subcategory: "percentage-calculators",
    title: "Percent Decrease",
    description: "Calculate percentage decrease between two values",
    loader: () => import("@/components/calculators/math/PercentDecreaseCalculator"),
  },
  {
    slug: "percent-change",
    aliases: ["percentage-change"],
    category: "math",
    subcategory: "percentage-calculators",
    title: "Percent Change",
    description: "Calculate percentage change between two values",
    loader: () => import("@/components/calculators/math/PercentChangeCalculator"),
  },

  {
    slug: "average-calculator",
    aliases: ["mean-calculator"],
    category: "math",
    subcategory: "statistics-calculators",
    title: "Average (Mean) Calculator",
    description: "Calculate the average (mean) of a set of numbers",
    loader: () => import("@/components/calculators/math/AverageCalculator"),
  },
  {
    slug: "proportion-solver",
    category: "math",
    subcategory: "algebra-calculators",
    title: "Proportion Solver",
    description: "Solve proportions and ratios",
    loader: () => import("@/components/calculators/math/ProportionCalculator"),
  },

  // --- Placeholders (Health) ---
  {
    slug: "daily-calorie-deficit-planner",
    category: "health",
    subcategory: "diet-nutrition-calculators",
    title: "Daily Calorie Deficit Planner (Coming Soon)",
    description: "Placeholder page for daily caloric deficit planning.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "macros-calculator",
    category: "health",
    subcategory: "diet-nutrition-calculators",
    title: "Macros Calculator (Coming Soon)",
    description: "Placeholder page for macronutrient calculation.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "ideal-body-weight-calculator",
    category: "health",
    subcategory: "body-measurement-calculators",
    title: "Ideal Body Weight (Coming Soon)",
    description: "Placeholder page for ideal body weight.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "body-fat-percentage-calculator",
    category: "health",
    subcategory: "body-measurement-calculators",
    title: "Body Fat Percentage (Coming Soon)",
    description: "Placeholder page for body fat percentage.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "waist-to-hip-ratio",
    category: "health",
    subcategory: "body-measurement-calculators",
    title: "Waist-to-Hip Ratio (Coming Soon)",
    description: "Placeholder page for waist-to-hip ratio.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "protein-intake-calculator",
    category: "health",
    subcategory: "diet-nutrition-calculators",
    title: "Protein Intake Calculator (Coming Soon)",
    description: "Placeholder page for protein intake.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "water-intake-calculator",
    category: "health",
    subcategory: "diet-nutrition-calculators",
    title: "Water Intake Calculator (Coming Soon)",
    description: "Placeholder page for daily water intake.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "calories-burned-walking",
    category: "health",
    subcategory: "fitness-calculators",
    title: "Calories Burned Walking (Coming Soon)",
    description: "Placeholder page for calories burned walking.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "calories-burned-running",
    category: "health",
    subcategory: "fitness-calculators",
    title: "Calories Burned Running (Coming Soon)",
    description: "Placeholder page for calories burned running.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "calories-burned-cycling",
    category: "health",
    subcategory: "fitness-calculators",
    title: "Calories Burned Cycling (Coming Soon)",
    description: "Placeholder page for calories burned cycling.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "calories-burned-swimming",
    category: "health",
    subcategory: "fitness-calculators",
    title: "Calories Burned Swimming (Coming Soon)",
    description: "Placeholder page for calories burned swimming.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "keto-macro-calculator",
    category: "health",
    subcategory: "diet-nutrition-calculators",
    title: "Keto Macro Calculator (Coming Soon)",
    description: "Placeholder page for ketogenic diet macros.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "intermittent-fasting-planner",
    category: "health",
    subcategory: "diet-nutrition-calculators",
    title: "Intermittent Fasting Planner (Coming Soon)",
    description: "Placeholder page for intermittent fasting planning.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "pregnancy-weight-gain-calculator",
    category: "health",
    subcategory: "body-measurement-calculators",
    title: "Pregnancy Weight Gain (Coming Soon)",
    description: "Placeholder page for pregnancy weight gain.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "bmr-vs-tdee-explainer",
    category: "health",
    subcategory: "fitness-calculators",
    title: "BMR vs. TDEE (Coming Soon)",
    description: "Placeholder page explaining BMR and TDEE.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "resting-heart-rate-zones",
    category: "health",
    subcategory: "fitness-calculators",
    title: "Resting Heart Rate & Zones (Coming Soon)",
    description: "Placeholder page for resting HR and training zones.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },

  // --- Placeholders (Pets) ---
  {
    slug: "dog-calorie-needs",
    category: "pets",
    subcategory: "pet-care-calculators",
    title: "Dog Calorie Needs (Coming Soon)",
    description: "Placeholder page for dog caloric needs.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "cat-calorie-needs",
    category: "pets",
    subcategory: "pet-care-calculators",
    title: "Cat Calorie Needs (Coming Soon)",
    description: "Placeholder page for cat caloric needs.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "pet-bmi",
    category: "pets",
    subcategory: "pet-care-calculators",
    title: "Pet BMI (Coming Soon)",
    description: "Placeholder page for pet body mass index.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "ideal-pet-weight",
    category: "pets",
    subcategory: "pet-care-calculators",
    title: "Ideal Pet Weight (Coming Soon)",
    description: "Placeholder page for ideal pet weight.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "pet-age-converter-human-years",
    category: "pets",
    subcategory: "pet-care-calculators",
    title: "Pet Age to Human Years",
    description: "Convert pet age to human years (cats & dogs).",
    loader: () => import("@/components/calculators/PetAgeCalculator"),
  },
  {
    slug: "pet-quality-of-life-scale",
    category: "pets",
    subcategory: "pet-care-calculators",
    title: "Pet Quality of Life — HHHHHMM Scale",
    description: "Rate Hurt, Hunger, Hydration, Hygiene, Happiness, Mobility, and More Good Days than Bad to assess overall quality.",
    loader: () => import("@/components/calculators/QualityOfLifeScale"),
  },
  {
    slug: "pet-quality-of-life-planner",
    category: "pets",
    subcategory: "pet-care-calculators",
    title: "Pet Quality of Life Planner",
    description: "Use the HHHHHMM scale with tips to plan supportive care for your pet.",
    loader: () => import("@/components/calculators/PetQualityOfLifeCalculator"),
  },
  {
    slug: "dog-walking-calorie-burn",
    category: "pets",
    subcategory: "pet-care-calculators",
    title: "Dog Walking Calorie Burn (Coming Soon)",
    description: "Placeholder page for calories burned walking dogs.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "pet-food-portion-calculator",
    category: "pets",
    subcategory: "pet-care-calculators",
    title: "Pet Food Portion (Coming Soon)",
    description: "Placeholder page for pet food portions.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "aquarium-volume-calculator",
    category: "pets",
    subcategory: "pet-care-calculators",
    title: "Aquarium Volume Calculator",
    description: "Calculate aquarium volume in gallons/liters for common shapes.",
    loader: () => import("@/components/calculators/AquariumVolumeCalculator"),
  },
  {
    slug: "aquarium-weight-calculator",
    category: "pets",
    subcategory: "pet-care-calculators",
    title: "Aquarium Weight Calculator",
    description: "Estimate total aquarium weight including water and decorations.",
    loader: () => import("@/components/calculators/AquariumWeightCalculator"),
  },
  {
    slug: "reptile-terrarium-size",
    category: "pets",
    subcategory: "pet-care-calculators",
    title: "Reptile Terrarium Size (Coming Soon)",
    description: "Placeholder page for reptile terrarium size.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "bird-cage-size",
    category: "pets",
    subcategory: "pet-care-calculators",
    title: "Bird Cage Size (Coming Soon)",
    description: "Placeholder page for bird cage size.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "pet-vaccination-schedule",
    category: "pets",
    subcategory: "pet-care-calculators",
    title: "Pet Vaccination Schedule (Coming Soon)",
    description: "Placeholder page for pet vaccination schedule.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "pet-cost-planner",
    category: "pets",
    subcategory: "pet-care-calculators",
    title: "Pet Cost Planner (Coming Soon)",
    description: "Placeholder page for pet cost planning.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },

  // New general pet calculators
  {
    slug: "pet-calorie-calculator",
    category: "pets",
    subcategory: "general",
    title: "Pet Calorie Calculator - Daily Nutritional Needs for Dogs and Cats",
    description: "Estimate your pet's daily calorie requirements for weight maintenance or loss, using veterinary-approved formulas for optimal pet nutrition SEO.",
    loader: () => import("@/components/calculators/PetCaloriePNACalculator"),
  },
  {
    slug: "calorie-requirements-calculator",
    category: "pets",
    subcategory: "general",
    title: "Vet-Approved Calorie Requirements Calculator for Pets",
    description: "Calculate precise calorie needs based on body condition and criteria, ideal for veterinary nutrition planning and SEO-targeted pet diet tools.",
    loader: () => import("@/components/calculators/PetCalorieVetCalculator"),
  },
  {
    slug: "pet-food-feeding-decisions",
    category: "pets",
    subcategory: "general",
    title: "Pet Food and Feeding Decisions Calculator - Cost and Portion Estimator",
    description: "Tools to calculate commercial pet food costs, portions, and feeding decisions, optimized for pet owners seeking budget-friendly nutrition advice.",
    loader: () => import("@/components/calculators/PetFeedingDecisionsCalculator"),
  },
  {
    slug: "pet-life-calculator",
    category: "pets",
    subcategory: "general",
    title: "Pet Life Stage & Lifespan Estimator",
    description: "Estimate pet life stage, lifespan range, and compare to human years for dogs, cats and birds.",
    loader: () => import("@/components/calculators/PetLifeCalculator"),
  },
  {
    slug: "veterinary-emergency-drug-dose",
    category: "pets",
    subcategory: "general",
    title: "Veterinary Emergency Drug Dose Calculator",
    description: "Compute bolus and CRI doses for common emergency drugs (epinephrine, atropine, naloxone, diazepam, lidocaine) with species-specific guidance.",
    loader: () => import("@/components/calculators/PetEmergencyDrugCalculator"),
  },
  {
    slug: "pet-ownership-costs",
    category: "pets",
    subcategory: "general",
    title: "Pet Ownership Costs Calculator",
    description: "Estimate annual and lifetime costs of pet ownership with a category breakdown chart.",
    loader: () => import("@/components/calculators/PetCostsCalculator"),
  },
  {
    slug: "dog-chocolate-toxicity-calculator",
    aliases: ["dog-chocolate-toxicity"],
    category: "pets",
    subcategory: "dogs",
    title: "Dog Chocolate Toxicity Calculator",
    description: "Estimate risk based on dog weight, chocolate type, and amount ingested (educational purposes only).",
    loader: () => import("@/components/calculators/DogChocolateToxicityCalculator"),
  },

  // --- Placeholders (Financial) ---
  {
    slug: "savings-goal-planner",
    category: "financial",
    subcategory: "personal-finance-calculators",
    title: "Savings Goal Planner (Coming Soon)",
    description: "Placeholder page for savings goals.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "budget-percentage-calculator",
    category: "financial",
    subcategory: "personal-finance-calculators",
    title: "Budget Percentage Calculator (Coming Soon)",
    description: "Placeholder page for budget percentages.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "retirement-savings-estimator",
    category: "financial",
    subcategory: "personal-finance-calculators",
    title: "Retirement Savings Estimator (Coming Soon)",
    description: "Placeholder page for retirement savings estimation.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "credit-card-payoff-planner",
    category: "financial",
    subcategory: "interest-and-loan-calculators",
    title: "Credit Card Payoff Planner (Coming Soon)",
    description: "Placeholder page for credit card payoff.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "emergency-fund-calculator",
    category: "financial",
    subcategory: "personal-finance-calculators",
    title: "Emergency Fund Calculator (Coming Soon)",
    description: "Placeholder page for emergency fund.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "investment-fees-calculator",
    category: "financial",
    subcategory: "personal-finance-calculators",
    title: "Investment Fees Calculator (Coming Soon)",
    description: "Placeholder page for investment fees.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },

  // --- Placeholders (Cooking) ---
  {
    slug: "meat-cooking-time-calculator",
    category: "cooking",
    subcategory: "cooking-baking-calculators",
    title: "Meat Cooking Time (Coming Soon)",
    description: "Placeholder page for meat cooking time.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "oven-temperature-converter",
    category: "cooking",
    subcategory: "cooking-measurements",
    title: "Oven Temperature Converter (Coming Soon)",
    description: "Placeholder page for oven temperature conversion.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "ingredient-substitution-guide",
    category: "cooking",
    subcategory: "cooking-baking-calculators",
    title: "Ingredient Substitution Guide (Coming Soon)",
    description: "Placeholder page for ingredient substitutions.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "sourdough-hydration-calculator",
    category: "cooking",
    subcategory: "cooking-baking-calculators",
    title: "Sourdough Hydration Calculator (Coming Soon)",
    description: "Placeholder page for sourdough hydration.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "meal-planner",
    category: "cooking",
    subcategory: "cooking-baking-calculators",
    title: "Meal Planner (Coming Soon)",
    description: "Placeholder page for meal planning.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },

  // --- Placeholders (Construction) ---
  {
    slug: "tile-calculator",
    category: "construction",
    subcategory: "wall-ceiling-calculators",
    title: "Tile Calculator (Coming Soon)",
    description: "Placeholder page for tile/flooring calculator.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "lumber-board-feet",
    category: "construction",
    subcategory: "carpentry-trim-calculators",
    title: "Lumber Board Feet (Coming Soon)",
    description: "Placeholder page for lumber board feet.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "deck-materials-estimator",
    category: "construction",
    subcategory: "carpentry-trim-calculators",
    title: "Deck Materials Estimator (Coming Soon)",
    description: "Placeholder page for deck materials.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "roofing-shingles-calculator",
    category: "construction",
    subcategory: "wall-ceiling-calculators",
    title: "Roofing Shingles Calculator (Coming Soon)",
    description: "Placeholder page for roofing/shingles estimation.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "insulation-r-value-estimator",
    category: "construction",
    subcategory: "drywall-paint-calculators",
    title: "Insulation R-Value Estimator (Coming Soon)",
    description: "Placeholder page for insulation R-Value.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },

  // --- Placeholders (Math) ---
  {
    slug: "rule-of-three",
    category: "math",
    subcategory: "everyday-math",
    title: "Rule of Three (Coming Soon)",
    description: "Placeholder page for rule of three.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "mean-median-mode-calculator",
    category: "math",
    subcategory: "everyday-math",
    title: "Mean, Median & Mode (Coming Soon)",
    description: "Placeholder page for mean/median/mode.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "simple-interest-math",
    category: "math",
    subcategory: "everyday-math",
    title: "Simple Interest (Math) (Coming Soon)",
    description: "Placeholder page for simple interest (math).",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "prime-number-checker",
    category: "math",
    subcategory: "everyday-math",
    title: "Prime Number Checker (Coming Soon)",
    description: "Placeholder page for prime number checking.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },

  // --- Placeholders (Science) ---
  {
    slug: "density-calculator",
    category: "science",
    subcategory: "general-science",
    title: "Density Calculator (Coming Soon)",
    description: "Placeholder page for density calculation.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },
  {
    slug: "half-life-calculator",
    category: "science",
    subcategory: "general-science",
    title: "Half-life Calculator (Coming Soon)",
    description: "Placeholder page for half-life calculation.",
    loader: () => import("@/components/calculators/PlaceholderCalculator"),
  },

];

/**
 * ================
 * Helpers públicos
 * ================
 */

/** Localiza uma calculadora pelo slug OU pelos seus aliases (case-insensitive) */
export function getEntry(slugOrAlias: string) {
  const key = (slugOrAlias ?? "").toLowerCase();
  if (!key) return null;
  return (
    REGISTRY.find(
      (e) =>
        e.slug?.toLowerCase() === key ||
        (Array.isArray(e.aliases) && e.aliases.some((a) => a.toLowerCase() === key))
    ) || null
  );
}

/** Lista todas as calculadoras de uma categoria */
export function listByCategory(category: string) {
  return REGISTRY.filter((e) => e.category === category);
}

/** Lista todas as calculadoras de uma categoria + (opcional) subcategoria */
export function listByCategorySubcategory(
  category: string,
  subcategory?: string
) {
  return REGISTRY.filter(
    (e) =>
      e.category === category &&
      (subcategory ? e.subcategory === subcategory : true)
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

// Alias público para uso em categorySections.ts
export const calculatorRegistry = REGISTRY;
