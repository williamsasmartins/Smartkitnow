// src/data/calculatorRegistry.ts
// REGISTRO LIMPO - PRONTO PARA AUTOMAÇÃO

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

// Títulos amigáveis para categorias
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

// Títulos amigáveis para subcategorias
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
// CALCULATOR REGISTRY (VAZIO E LIMPO)
// ====================================================================
export const calculatorRegistry: CalculatorEntry[] = [
   
   
   
  
   
    {
    slug: "loan-payment",
    title: "Loan Payment Calculator (Principal, Rate, Term)",
    category: "financial",
    subcategory: "loans",
    description: "Calculate your monthly loan payments instantly. Enter principal, interest rate, and term to see your exact payment schedule.",
    loader: () => import("@/components/calculators/Financial/LoanPaymentCalculator"),
    urlStyle: "flat"
  },
    
    {
    slug: "mortgage-amortization",
    title: "Mortgage Payment & Amortization Calculator",
    category: "financial",
    subcategory: "loans-mortgages-payments",
    description: "Estimate your monthly mortgage payments including interest. View the full amortization schedule to track your home equity growth over time.",
    loader: () => import("@/components/calculators/Financial/MortgageAmortizationCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "extra-payments-payoff",
    title: "Extra Payments & Payoff Time Calculator",
    category: "financial",
    subcategory: "loans-mortgages-payments",
    description: "See how extra payments affect your loan payoff date. Save on interest by paying down your debt faster with this simple calculator.",
    loader: () => import("@/components/calculators/Financial/ExtraPaymentsPayoffCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "interest-only-loan",
    title: "Interest-Only Loan Calculator",
    category: "financial",
    subcategory: "loans-mortgages-payments",
    description: "Calculate payments for interest-only loans. Compare the interest-only period versus the full amortization phase to plan your budget.",
    loader: () => import("@/components/calculators/Financial/InterestOnlyLoanCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "refinance-savings",
    title: "Refinance Savings Calculator",
    category: "financial",
    subcategory: "loans-mortgages-payments",
    description: "Determine if refinancing is right for you. Compare current loan terms with new offers to calculate potential monthly and lifetime savings.",
    loader: () => import("@/components/calculators/Financial/RefinanceSavingsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "heloc-payment-estimator",
    title: "HELOC Payment Estimator",
    category: "financial",
    subcategory: "loans-mortgages-payments",
    description: "Estimate monthly payments for a Home Equity Line of Credit (HELOC). Calculate costs during both the draw period and the repayment period.",
    loader: () => import("@/components/calculators/Financial/HelocPaymentEstimatorCalculator"),
    urlStyle: "flat"
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
// CALC LINK FUNCTION
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
