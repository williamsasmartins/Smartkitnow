/**
 * Registro ÚNICO de calculadoras do site
 * ------------------------------------------------------
 * - Mantém UM tipo (CalcEntry) para evitar duplicidade.
 * - Inclui tags/keywords opcionais para melhorar a busca.
 * - Slugs/paths precisam bater com suas rotas reais.
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
  /** Palavras-chave para busca (opcional) */
  keywords?: string[];
  /** Etiquetas curtas para busca (opcional) */
  tags?: string[];
};

/** Títulos “bonitos” por categoria (opcional, usado em páginas de listagem) */
export const FRIENDLY_TITLES: Record<string, string> = {
  construction: "Construction Calculators",
  cooking: "Cooking Calculators",
  health: "Health & Fitness Calculators",
  financial: "Financial Calculators",
  electrical: "Electrical Calculators",
  math: "Math & Algebra Calculators",
  pets: "Pet Care Calculators",
  science: "Science Calculators",
  time: "Time & Date Calculators",
  tv: "TV & Home Theater Calculators",
  conversion: "Conversion Calculators",
};

/** Títulos de subcategoria (slug -> título) */
export const SUBCATEGORY_TITLES: Record<string, string> = {
  // Construction
  "concrete-masonry-calculators": "Concrete & Masonry Calculators",
  "carpentry-trim-calculators": "Carpentry & Trim Calculators",
  "wall-ceiling-calculators": "Wall & Ceiling Calculators",
  // compat antigo
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
  "percentage-calculators": "Percentage Calculators",
  "fractions-calculators": "Fraction Calculators",

  // Compat (aceita rotas antigas)
  "percent-calculators": "Percentage Calculators",
  "fraction-calculators": "Fraction Calculators",
};

/* =========================
 * LOADERS (lazy imports)
 * ========================= */
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

// Math — Percentage
const loadPercentOf = () =>
  import("@/components/calculators/math/PercentOfCalculator");
const loadPercentIncrease = () =>
  import("@/components/calculators/math/PercentIncreaseCalculator");
const loadPercentDecrease = () =>
  import("@/components/calculators/math/PercentDecreaseCalculator");
const loadPercentChange = () =>
  import("@/components/calculators/math/PercentChangeCalculator");

// Math — Fractions
const loadFractionReducer = () =>
  import("@/components/calculators/math/FractionReducerCalculator");
const loadFractionToDecimal = () =>
  import("@/components/calculators/math/FractionToDecimalCalculator");
const loadDecimalToFraction = () =>
  import("@/components/calculators/math/DecimalToFractionCalculator");
const loadPercentToFraction = () =>
  import("@/components/calculators/math/PercentToFractionCalculator");

// Math — Everyday
const loadAverage = () =>
  import("@/components/calculators/math/AverageCalculator");
const loadProportion = () =>
  import("@/components/calculators/math/ProportionCalculator");


/**
 * ============================================
 * REGISTRY – TODAS AS CALCULADORAS
 * (Rota padrão: /:category/:subcategory/:slug)
 * ============================================
 */
export const REGISTRY: CalcEntry[] = [
  // ========= CONSTRUCTION =========
  {
    slug: "concrete-slab-volume-bags",
    aliases: ["concrete-slab"],
    name: "Concrete Slab — Volume & Bags",
    category: "construction",
    subcategory: "concrete-masonry-calculators",
    description: "Estimate concrete volume and bag counts for slabs.",
    loader: loadConcreteSlab,
    keywords: ["concrete", "slab", "volume", "bags"],
    tags: ["concrete"],
  },
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
    description: "Drywall estimator with rooms, openings, boards and costs.",
    loader: loadDrywallEstimator,
    keywords: ["drywall", "sheetrock", "plasterboard", "board", "wall", "ceiling"],
    tags: ["drywall", "construction"],
  },
  {
    slug: "paint-calculator",
    aliases: ["paint", "painting-calculator"],
    name: "Paint Calculator",
    category: "construction",
    subcategory: "wall-ceiling-calculators",
    description: "Estimate paint needed by area, number of coats and coverage.",
    loader: loadPaint,
    keywords: ["paint", "coats", "coverage"],
    tags: ["paint"],
  },
  {
    slug: "wallpaper-calculator",
    aliases: ["wallpaper"],
    name: "Wallpaper Calculator",
    category: "construction",
    subcategory: "wall-ceiling-calculators",
    description: "Estimate rolls needed based on room size and pattern repeat.",
    loader: loadWallpaper,
    keywords: ["wallpaper", "rolls", "pattern"],
    tags: ["wallpaper"],
  },

  // ========= COOKING =========
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
    keywords: ["cups", "grams", "tablespoons", "ml"],
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

  // ========= HEALTH =========
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

  // ========= FINANCIAL =========
  {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    category: "financial",
    subcategory: "mortgage-and-home-loan-calculators",
    description: "Estimate monthly mortgage payments.",
    loader: loadMortgage,
    keywords: ["mortgage", "home loan", "payment"],
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

  // ========= MATH — PERCENTAGE =========
  {
    slug: "percent-of",
    aliases: ["percent-of-total", "percentage-of-total", "percent-of-number"],
    name: "Percent Of",
    category: "math",
    subcategory: "percentage-calculators",
    description: "Find X% of a number (e.g., 15% of 240).",
    loader: loadPercentOf,
  },
  {
    slug: "percent-increase",
    name: "Percent Increase",
    category: "math",
    subcategory: "percentage-calculators",
    loader: loadPercentIncrease,
    description: "Compute the percentage increase from an old value to a new value.",
  },
  {
    slug: "percent-decrease",
    name: "Percent Decrease",
    category: "math",
    subcategory: "percentage-calculators",
    loader: loadPercentDecrease,
    description: "Compute the percentage decrease from an old value to a new value.",
  },
  {
    slug: "percent-change",
    name: "Percent Change",
    category: "math",
    subcategory: "percentage-calculators",
    loader: loadPercentChange,
    description: "Signed percent change: positive for increase, negative for decrease.",
  },

  // ========= MATH — FRACTIONS =========
  {
    slug: "fraction-reducer",
    name: "Fraction Reducer",
    category: "math",
    subcategory: "fractions-calculators",
    loader: loadFractionReducer,
    description:
      "Simplify any fraction or mixed/decimal input to lowest terms. Examples: 42/56, 3 6/8, 1.25.",
  },
  {
    slug: "fraction-to-decimal",
    name: "Fraction to Decimal",
    category: "math",
    subcategory: "fractions-calculators",
    loader: loadFractionToDecimal,
    description:
      "Convert any fraction (including mixed numbers) to a decimal with a chosen precision.",
  },
  {
    slug: "decimal-to-fraction",
    name: "Decimal to Fraction",
    category: "math",
    subcategory: "fractions-calculators",
    loader: loadDecimalToFraction,
    description:
      "Convert any decimal to an exact or approximate fraction, including mixed numbers.",
  },
  {
    slug: "percent-to-fraction",
    name: "Percent to Fraction",
    category: "math",
    subcategory: "fractions-calculators",
    loader: loadPercentToFraction,
    description:
      "Convert a percentage into a reduced fraction and mixed-number form when applicable.",
  },

  // ========= MATH — EVERYDAY =========
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
];

/* =========================
 * HELPERS
 * ========================= */

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
    (e) =>
      e.category === category &&
      (subcategory ? e.subcategory === subcategory : true)
  );
}

/** Subcategorias existentes dentro de uma categoria, com contagem */
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
