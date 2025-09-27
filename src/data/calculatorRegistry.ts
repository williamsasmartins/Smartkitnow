import React from "react"

export type CalcEntry = {
  slug: string
  name: string
  category: string
  subcategory?: string
  description?: string
  loader: () => Promise<any>
  namedExport?: string
  aliases?: string[]
}

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
}

export const SUBCATEGORY_TITLES: Record<string, string> = {
  // Construction
  "concrete-masonry-calculators": "Concrete & Masonry Calculators",
  "carpentry-trim-calculators": "Carpentry & Trim Calculators",
  "wall-ceiling-calculators": "Wall & Ceiling Calculators",

  // (demais subcategorias que você usa em outras áreas – mantenha se precisar)
  "cooking-baking-calculators": "Cooking & Baking Calculators",
  "cooking-measurements": "Cooking Measurements",
  "cooking-unit-conversions": "Unit Conversion Calculators",
  "body-measurement-calculators": "Body Measurement Calculators",
  "calories-conversion": "Calories Conversion",
  "diet-nutrition-calculators": "Dietary & Nutrition Calculators",
  "fitness-calculators": "Fitness Calculators",
  "personal-finance-calculators": "Personal Finance Calculators",
  "interest-and-loan-calculators": "Interest and Loan Calculators",
  "mortgage-and-home-loan-calculators": "Mortgage & Home Loan Calculators",
}

/** LOADERS */
const loadConcreteSlab = () => import("@/components/calculators/ConcreteSlab")
const loadDrywallEstimator = () => import("@/components/calculators/DrywallEstimator")
// (outros loaders que você já tinha…)
const loadMortgage = () => import("@/components/calculators/MortgageCalculator")
const loadLoan = () => import("@/components/calculators/LoanCalculator")
const loadROI = () => import("@/components/calculators/financial/ROICalculator")
const loadCompoundInterest = () => import("@/components/calculators/CompoundInterestCalculator")

/** REGISTRY
 * Hierarquia de rota: /:category/:subcategory/:slug
 */
export const REGISTRY: CalcEntry[] = [
  // ===== CONSTRUCTION =====
  {
    slug: "concrete-slab-volume-bags",
    aliases: ["concrete-slab"],
    name: "Concrete Slab — Volume & Bags",
    category: "construction",
    subcategory: "concrete-masonry-calculators",
    description: "Estimate concrete volume and bag counts for slabs.",
    loader: loadConcreteSlab,
  },

  /** 👉 SUA CALCULADORA NESTA URL:
   *  /construction/wall-ceiling-calculators/drywall-area-sheets
   *  Mantemos o slug exatamente "drywall-area-sheets"
   *  e apontamos o loader para DrywallEstimator (o componente avançado).
   */
  {
  slug: "drywall-area-sheets",            // mantém a URL
  name: "Drywall Estimator",              // muda o título exibido
  category: "construction",
  subcategory: "wall-ceiling-calculators",
  description: "Drywall estimator with rooms, openings, boards and costs.",
  loader: loadDrywallEstimator,           // continua usando seu componente grande
  // (opcional) aliases para aceitar URLs alternativas
  aliases: ["drywall-estimator", "drywall-area-and-sheets"]
},


  // (exemplos financeiros – mantenha os seus reais)
  {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    category: "financial",
    subcategory: "mortgage-and-home-loan-calculators",
    description: "Estimate monthly mortgage payments.",
    loader: loadMortgage,
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
]

/** Helpers */
export function getEntry(slug?: string) {
  if (!slug) return undefined
  return REGISTRY.find(e => e.slug === slug || (e.aliases && e.aliases.includes(slug)))
}
export function listByCategory(category: string) {
  return REGISTRY.filter(e => e.category === category)
}
export function listByCategorySubcategory(category: string, subcategory?: string) {
  return REGISTRY.filter(
    e => e.category === category && (subcategory ? e.subcategory === subcategory : true)
  )
}
export function listSubcategoriesOfCategory(category: string) {
  const items = listByCategory(category)
  const map = new Map<string, number>()
  for (const it of items) {
    const sub = it.subcategory ?? "_uncategorized"
    map.set(sub, (map.get(sub) ?? 0) + 1)
  }
  return Array.from(map.entries()).map(([slug, count]) => ({
    slug,
    title:
      SUBCATEGORY_TITLES[slug] ??
      slug.replace(/-/g, " ").replace(/\b\w/g, m => m.toUpperCase()),
    count,
  }))
}
