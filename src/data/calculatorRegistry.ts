import type React from "react";

export type UrlStyle = "nested" | "flat";

export interface CalculatorEntry {
  slug: string;
  title: string;
  category: string;
  subcategory?: string;
  description?: string;
  aliases?: string[];
  loader: () => Promise<{ default: React.ComponentType<any> }>;
  namedExport?: string;
  urlStyle?: UrlStyle;
}

// Friendly category titles
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
    .replace(/[^\w-]/g, "");
}

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
export const calculatorRegistry: CalculatorEntry[] = [
  // ================================================================
  // FINANCIAL CALCULATORS
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

  // ================================================================
  // PETS CALCULATORS
  // ================================================================
  {
    slug: "dog-age-to-human-years",
    category: "pets",
    subcategory: "dogs",
    title: "Dog Age to Human Years Calculator",
    description: "Convert your dog's age to human years using the latest veterinary science formula that accounts for breed size.",
    loader: () =>
      import("@/components/calculators/DogAgeCalculator").then((m) => ({
        default: m.DogAgeCalculator as React.ComponentType<any>,
      })),
    aliases: ["dog-age-calculator", "dog-years"],
    urlStyle: "nested",
  },
  {
    slug: "cat-age-to-human-years",
    category: "pets",
    subcategory: "cats",
    title: "Cat Age to Human Years Calculator",
    description: "Convert your cat's age to human years using veterinary-approved calculations for accurate age equivalency.",
    loader: () =>
      import("@/components/calculators/CatAgeCalculator").then((m) => ({
        default: m.CatAgeCalculator as React.ComponentType<any>,
      })),
    aliases: ["cat-age-calculator", "cat-years"],
    urlStyle: "nested",
  },

  // SKN-AUTO-REGISTER: do not remove this line
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

// ====================================================================
// CALC LINK FUNCTION (CRITICAL!)
// ====================================================================
export function calcLink(entry: CalculatorEntry): string {
  const cat = normalize(entry.category);
  const slug = normalize(entry.slug);
  const sub = normalize(entry.subcategory);

  // Flat style: /category/slug
  if (entry.urlStyle === "flat") {
    return `/${cat}/${slug}`;
  }

  // Nested style: /category/subcategory/slug
  if (sub && sub !== "general") {
    return `/${cat}/${sub}/${slug}`;
  }

  // Default: /category/slug
  return `/${cat}/${slug}`;
}
