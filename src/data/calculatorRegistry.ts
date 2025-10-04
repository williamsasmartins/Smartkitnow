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
  /** Categoria raiz (ex.: construction, cooking, health, financial, math...) */
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
};

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
  // Drywall estimator (canônico)
  {
    slug: "drywall-area-sheets",
    aliases: [
      "drywall-estimator",
      "drywall-area-and-sheets",
      "drywall-sheets",
      "drywall-calculator",
    ],
    name: "Drywall — Area & Sheets",
    category: "construction",
    subcategory: "wall-ceiling-calculators",
    description:
      "Drywall estimator with rooms, openings, boards and costs.",
    loader: loadDrywallEstimator,
  },
  {
    slug: "paint-calculator",
    aliases: ["paint", "painting-calculator"],
    name: "Paint Calculator",
    category: "construction",
    subcategory: "wall-ceiling-calculators",
    description:
      "Estimate paint needed by area, number of coats and coverage.",
    loader: loadPaint,
  },
  {
    slug: "wallpaper-calculator",
    aliases: ["wallpaper"],
    name: "Wallpaper Calculator",
    category: "construction",
    subcategory: "wall-ceiling-calculators",
    description:
      "Estimate rolls needed based on room size and pattern repeat.",
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
    aliases: [
      "calories-to-kg",
      "convert-calories-to-kilograms",
      "calories-to-kilograms",
      "convert-calories-to-kg"
    ],
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
   
   /**
 * =========================
 * MATH — Fractions & Percent
 * =========================
 */
{
  slug: "fraction-reducer",
  name: "Fraction Reducer",
  category: "math",
  subcategory: "fraction-calculators",
  loader: loadFractionReducer,
  description: "Simplify any fraction or mixed/decimal input to lowest terms. Examples: 42/56, 3 6/8, 1.25.",
},
{
  slug: "fraction-to-decimal",
  name: "Fraction to Decimal",
  category: "math",
  subcategory: "fraction-calculators",
  loader: loadFractionToDecimal,
  description: "Convert any fraction (including mixed numbers) to a decimal with a chosen precision.",
},
{
  slug: "decimal-to-fraction",
  name: "Decimal to Fraction",
  category: "math",
  subcategory: "fraction-calculators",
  loader: loadDecimalToFraction,
  description: "Convert any decimal to an exact or approximate fraction, including mixed numbers.",
},
{
  slug: "percent-to-fraction",
  name: "Percent to Fraction",
  category: "math",
  subcategory: "fraction-calculators",
  loader: loadPercentToFraction,
  description: "Convert a percentage into a reduced fraction and mixed-number form when applicable.",
},

    /**
   * =========================
   * MATH (novo bloco)
   * =========================
   */
  {
    slug: "percent-of-total",
    aliases: ["percent-of", "percentage-of-total"],
    name: "Percent of Total",
    category: "math",
    subcategory: "everyday-math",
    description: "Find X% of a number (e.g., 15% of 240).",
    loader: loadPercentOf,
  },
  {
    slug: "percent-increase",
    name: "Percent Increase",
    category: "math",
    subcategory: "percent-calculators",
    loader: loadPercentIncrease,
    description: "Compute the percentage increase from an old value to a new value.",
  },
  {
    slug: "percent-decrease",
    name: "Percent Decrease",
    category: "math",
    subcategory: "percent-calculators",
    loader: loadPercentDecrease,
    description: "Compute the percentage decrease from an old value to a new value.",
  },
  {
    slug: "percent-change",
    name: "Percent Change",
    category: "math",
    subcategory: "percent-calculators",
    loader: loadPercentChange,
    description: "Signed percent change: positive for increase, negative for decrease.",
  },
  {
  slug: "fraction-reducer",
  name: "Fraction Reducer",
  category: "math",
  subcategory: "fraction-calculators",
  loader: loadFractionReducer,
  description: "Simplify any fraction to lowest terms.",
},
{
  slug: "fraction-to-decimal",
  name: "Fraction to Decimal",
  category: "math",
  subcategory: "fraction-calculators",
  loader: loadFractionToDecimal,
  description: "Convert a fraction (or mixed number) into decimal.",
},
{
  slug: "decimal-to-fraction",
  name: "Decimal to Fraction",
  category: "math",
  subcategory: "fraction-calculators",
  loader: loadDecimalToFraction,
  description: "Convert a decimal number into an exact/approximate fraction.",
},
{
  slug: "percent-to-fraction",
  name: "Percent to Fraction",
  category: "math",
  subcategory: "fraction-calculators",
  loader: loadPercentToFraction,
  description: "Convert percent values to reduced fractions.",
},
{
  slug: "average-calculator",
  aliases: ["mean-calculator", "average"],
  name: "Average (Mean) Calculator",
  category: "math",
  subcategory: "everyday-math",
  description: "Compute the arithmetic mean of a list of numbers.",
  loader: loadAverage,
},
{
  slug: "proportion-solver",
  aliases: ["proportion-calculator", "rule-of-three", "ratio-solver"],
  name: "Proportion Solver",
  category: "math",
  subcategory: "everyday-math",
  description: "Solve a/b = c/d leaving one value blank and compute it.",
  loader: loadProportion,
},

  // --- Placeholders (Health) ---
  {
    slug: "daily-calorie-deficit-planner",
    name: "Daily Calorie Deficit Planner (Coming Soon)",
    category: "health",
    subcategory: "diet-nutrition-calculators",
    description: "Página placeholder para planejamento de déficit calórico diário.",
    loader: loadPlaceholder,
  },
  {
    slug: "macros-calculator",
    name: "Macros Calculator (Coming Soon)",
    category: "health",
    subcategory: "diet-nutrition-calculators",
    description: "Página placeholder para cálculo de macronutrientes.",
    loader: loadPlaceholder,
  },
  {
    slug: "ideal-body-weight-calculator",
    name: "Ideal Body Weight (Coming Soon)",
    category: "health",
    subcategory: "body-measurement-calculators",
    description: "Página placeholder para peso corporal ideal.",
    loader: loadPlaceholder,
  },
  {
    slug: "body-fat-percentage-calculator",
    name: "Body Fat Percentage (Coming Soon)",
    category: "health",
    subcategory: "body-measurement-calculators",
    description: "Página placeholder para percentual de gordura corporal.",
    loader: loadPlaceholder,
  },
  {
    slug: "waist-to-hip-ratio",
    name: "Waist-to-Hip Ratio (Coming Soon)",
    category: "health",
    subcategory: "body-measurement-calculators",
    description: "Página placeholder para razão cintura-quadril.",
    loader: loadPlaceholder,
  },
  {
    slug: "protein-intake-calculator",
    name: "Protein Intake Calculator (Coming Soon)",
    category: "health",
    subcategory: "diet-nutrition-calculators",
    description: "Página placeholder para ingestão de proteínas.",
    loader: loadPlaceholder,
  },
  {
    slug: "water-intake-calculator",
    name: "Water Intake Calculator (Coming Soon)",
    category: "health",
    subcategory: "diet-nutrition-calculators",
    description: "Página placeholder para ingestão diária de água.",
    loader: loadPlaceholder,
  },
  {
    slug: "calories-burned-walking",
    name: "Calories Burned Walking (Coming Soon)",
    category: "health",
    subcategory: "fitness-calculators",
    description: "Página placeholder para calorias queimadas caminhando.",
    loader: loadPlaceholder,
  },
  {
    slug: "calories-burned-running",
    name: "Calories Burned Running (Coming Soon)",
    category: "health",
    subcategory: "fitness-calculators",
    description: "Página placeholder para calorias queimadas correndo.",
    loader: loadPlaceholder,
  },
  {
    slug: "calories-burned-cycling",
    name: "Calories Burned Cycling (Coming Soon)",
    category: "health",
    subcategory: "fitness-calculators",
    description: "Página placeholder para calorias queimadas pedalando.",
    loader: loadPlaceholder,
  },
  {
    slug: "calories-burned-swimming",
    name: "Calories Burned Swimming (Coming Soon)",
    category: "health",
    subcategory: "fitness-calculators",
    description: "Página placeholder para calorias queimadas nadando.",
    loader: loadPlaceholder,
  },
  {
    slug: "keto-macro-calculator",
    name: "Keto Macro Calculator (Coming Soon)",
    category: "health",
    subcategory: "diet-nutrition-calculators",
    description: "Página placeholder para macros na dieta cetogênica.",
    loader: loadPlaceholder,
  },
  {
    slug: "intermittent-fasting-planner",
    name: "Intermittent Fasting Planner (Coming Soon)",
    category: "health",
    subcategory: "diet-nutrition-calculators",
    description: "Página placeholder para planejamento de jejum intermitente.",
    loader: loadPlaceholder,
  },
  {
    slug: "pregnancy-weight-gain-calculator",
    name: "Pregnancy Weight Gain (Coming Soon)",
    category: "health",
    subcategory: "body-measurement-calculators",
    description: "Página placeholder para ganho de peso na gravidez.",
    loader: loadPlaceholder,
  },
  {
    slug: "bmr-vs-tdee-explainer",
    name: "BMR vs. TDEE (Coming Soon)",
    category: "health",
    subcategory: "fitness-calculators",
    description: "Página placeholder explicando BMR e TDEE.",
    loader: loadPlaceholder,
  },
  {
    slug: "resting-heart-rate-zones",
    name: "Resting Heart Rate & Zones (Coming Soon)",
    category: "health",
    subcategory: "fitness-calculators",
    description: "Página placeholder para FC de repouso e zonas de treino.",
    loader: loadPlaceholder,
  },

  // --- Placeholders (Pets) ---
  {
    slug: "dog-calorie-needs",
    name: "Dog Calorie Needs (Coming Soon)",
    category: "pets",
    subcategory: "pet-care-calculators",
    description: "Página placeholder para necessidades calóricas de cães.",
    loader: loadPlaceholder,
  },
  {
    slug: "cat-calorie-needs",
    name: "Cat Calorie Needs (Coming Soon)",
    category: "pets",
    subcategory: "pet-care-calculators",
    description: "Página placeholder para necessidades calóricas de gatos.",
    loader: loadPlaceholder,
  },
  {
    slug: "pet-bmi",
    name: "Pet BMI (Coming Soon)",
    category: "pets",
    subcategory: "pet-care-calculators",
    description: "Página placeholder para índice de massa de pets.",
    loader: loadPlaceholder,
  },
  {
    slug: "ideal-pet-weight",
    name: "Ideal Pet Weight (Coming Soon)",
    category: "pets",
    subcategory: "pet-care-calculators",
    description: "Página placeholder para peso ideal de pets.",
    loader: loadPlaceholder,
  },
  {
    slug: "pet-age-converter-human-years",
    name: "Pet Age to Human Years (Coming Soon)",
    category: "pets",
    subcategory: "pet-care-calculators",
    description: "Página placeholder para conversão idade pet ⇄ anos humanos.",
    loader: loadPlaceholder,
  },
  {
    slug: "dog-walking-calorie-burn",
    name: "Dog Walking Calorie Burn (Coming Soon)",
    category: "pets",
    subcategory: "pet-care-calculators",
    description: "Página placeholder para calorias queimadas em passeios com cães.",
    loader: loadPlaceholder,
  },
  {
    slug: "pet-food-portion-calculator",
    name: "Pet Food Portion (Coming Soon)",
    category: "pets",
    subcategory: "pet-care-calculators",
    description: "Página placeholder para porção de ração de pets.",
    loader: loadPlaceholder,
  },
  {
    slug: "aquarium-volume-calculator",
    name: "Aquarium Volume (Coming Soon)",
    category: "pets",
    subcategory: "pet-care-calculators",
    description: "Página placeholder para volume de aquário.",
    loader: loadPlaceholder,
  },
  {
    slug: "reptile-terrarium-size",
    name: "Reptile Terrarium Size (Coming Soon)",
    category: "pets",
    subcategory: "pet-care-calculators",
    description: "Página placeholder para tamanho de terrário de répteis.",
    loader: loadPlaceholder,
  },
  {
    slug: "bird-cage-size",
    name: "Bird Cage Size (Coming Soon)",
    category: "pets",
    subcategory: "pet-care-calculators",
    description: "Página placeholder para tamanho de gaiola de pássaros.",
    loader: loadPlaceholder,
  },
  {
    slug: "pet-vaccination-schedule",
    name: "Pet Vaccination Schedule (Coming Soon)",
    category: "pets",
    subcategory: "pet-care-calculators",
    description: "Página placeholder para cronograma de vacinas de pets.",
    loader: loadPlaceholder,
  },
  {
    slug: "pet-cost-planner",
    name: "Pet Cost Planner (Coming Soon)",
    category: "pets",
    subcategory: "pet-care-calculators",
    description: "Página placeholder para planejamento de custos de pets.",
    loader: loadPlaceholder,
  },

  // --- Placeholders (Financial) ---
  {
    slug: "savings-goal-planner",
    name: "Savings Goal Planner (Coming Soon)",
    category: "financial",
    subcategory: "personal-finance-calculators",
    description: "Página placeholder para metas de poupança.",
    loader: loadPlaceholder,
  },
  {
    slug: "budget-percentage-calculator",
    name: "Budget Percentage Calculator (Coming Soon)",
    category: "financial",
    subcategory: "personal-finance-calculators",
    description: "Página placeholder para orçamento por percentuais.",
    loader: loadPlaceholder,
  },
  {
    slug: "retirement-savings-estimator",
    name: "Retirement Savings Estimator (Coming Soon)",
    category: "financial",
    subcategory: "personal-finance-calculators",
    description: "Página placeholder para estimativa de poupança para aposentadoria.",
    loader: loadPlaceholder,
  },
  {
    slug: "credit-card-payoff-planner",
    name: "Credit Card Payoff Planner (Coming Soon)",
    category: "financial",
    subcategory: "interest-and-loan-calculators",
    description: "Página placeholder para quitação de cartão de crédito.",
    loader: loadPlaceholder,
  },
  {
    slug: "emergency-fund-calculator",
    name: "Emergency Fund Calculator (Coming Soon)",
    category: "financial",
    subcategory: "personal-finance-calculators",
    description: "Página placeholder para fundo de emergência.",
    loader: loadPlaceholder,
  },
  {
    slug: "investment-fees-calculator",
    name: "Investment Fees Calculator (Coming Soon)",
    category: "financial",
    subcategory: "personal-finance-calculators",
    description: "Página placeholder para taxas de investimento.",
    loader: loadPlaceholder,
  },

  // --- Placeholders (Cooking) ---
  {
    slug: "meat-cooking-time-calculator",
    name: "Meat Cooking Time (Coming Soon)",
    category: "cooking",
    subcategory: "cooking-baking-calculators",
    description: "Página placeholder para tempo de cozimento de carnes.",
    loader: loadPlaceholder,
  },
  {
    slug: "oven-temperature-converter",
    name: "Oven Temperature Converter (Coming Soon)",
    category: "cooking",
    subcategory: "cooking-measurements",
    description: "Página placeholder para conversão de temperatura de forno.",
    loader: loadPlaceholder,
  },
  {
    slug: "ingredient-substitution-guide",
    name: "Ingredient Substitution Guide (Coming Soon)",
    category: "cooking",
    subcategory: "cooking-baking-calculators",
    description: "Página placeholder para substituições de ingredientes.",
    loader: loadPlaceholder,
  },
  {
    slug: "sourdough-hydration-calculator",
    name: "Sourdough Hydration Calculator (Coming Soon)",
    category: "cooking",
    subcategory: "cooking-baking-calculators",
    description: "Página placeholder para hidratação de massa madre.",
    loader: loadPlaceholder,
  },
  {
    slug: "meal-planner",
    name: "Meal Planner (Coming Soon)",
    category: "cooking",
    subcategory: "cooking-baking-calculators",
    description: "Página placeholder para planejamento de refeições.",
    loader: loadPlaceholder,
  },

  // --- Placeholders (Construction) ---
  {
    slug: "tile-calculator",
    name: "Tile Calculator (Coming Soon)",
    category: "construction",
    subcategory: "wall-ceiling-calculators",
    description: "Página placeholder para calculadora de pisos/azulejos.",
    loader: loadPlaceholder,
  },
  {
    slug: "lumber-board-feet",
    name: "Lumber Board Feet (Coming Soon)",
    category: "construction",
    subcategory: "carpentry-trim-calculators",
    description: "Página placeholder para board feet de madeira.",
    loader: loadPlaceholder,
  },
  {
    slug: "deck-materials-estimator",
    name: "Deck Materials Estimator (Coming Soon)",
    category: "construction",
    subcategory: "carpentry-trim-calculators",
    description: "Página placeholder para materiais de deck.",
    loader: loadPlaceholder,
  },
  {
    slug: "roofing-shingles-calculator",
    name: "Roofing Shingles Calculator (Coming Soon)",
    category: "construction",
    subcategory: "wall-ceiling-calculators",
    description: "Página placeholder para estimar telhas/roofing.",
    loader: loadPlaceholder,
  },
  {
    slug: "insulation-r-value-estimator",
    name: "Insulation R-Value Estimator (Coming Soon)",
    category: "construction",
    subcategory: "drywall-paint-calculators",
    description: "Página placeholder para R-Value de isolamento.",
    loader: loadPlaceholder,
  },

  // --- Placeholders (Math) ---
  {
    slug: "rule-of-three",
    name: "Rule of Three (Coming Soon)",
    category: "math",
    subcategory: "everyday-math",
    description: "Página placeholder para regra de três.",
    loader: loadPlaceholder,
  },
  {
    slug: "mean-median-mode-calculator",
    name: "Mean, Median & Mode (Coming Soon)",
    category: "math",
    subcategory: "everyday-math",
    description: "Página placeholder para média/mediana/moda.",
    loader: loadPlaceholder,
  },
  {
    slug: "simple-interest-math",
    name: "Simple Interest (Math) (Coming Soon)",
    category: "math",
    subcategory: "everyday-math",
    description: "Página placeholder para juros simples (matemática).",
    loader: loadPlaceholder,
  },
  {
    slug: "prime-number-checker",
    name: "Prime Number Checker (Coming Soon)",
    category: "math",
    subcategory: "everyday-math",
    description: "Página placeholder para verificação de números primos.",
    loader: loadPlaceholder,
  },

  // --- Placeholders (Science) ---
  {
    slug: "density-calculator",
    name: "Density Calculator (Coming Soon)",
    category: "science",
    subcategory: "general-science",
    description: "Página placeholder para cálculo de densidade.",
    loader: loadPlaceholder,
  },
  {
    slug: "half-life-calculator",
    name: "Half-life Calculator (Coming Soon)",
    category: "science",
    subcategory: "general-science",
    description: "Página placeholder para cálculo de meia-vida.",
    loader: loadPlaceholder,
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
