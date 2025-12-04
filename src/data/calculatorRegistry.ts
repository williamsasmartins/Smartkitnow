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
    {
    slug: "car-loan-affordability",
    title: "Car Loan Affordability Calculator",
    category: "financial",
    subcategory: "loans-mortgages-payments",
    description: "Find out how much car you can afford. Input your monthly budget and down payment to determine your maximum vehicle price.",
    loader: () => import("@/components/calculators/Financial/CarLoanAffordabilityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "balloon-payment",
    title: "Balloon Payment Calculator",
    category: "financial",
    subcategory: "loans-mortgages-payments",
    description: "Calculate monthly payments and the final balloon payment amount. Essential for loans with a large lump-sum payoff at the end of the term.",
    loader: () => import("@/components/calculators/Financial/BalloonPaymentCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "house-affordability",
    title: "How Much House Can I Afford? Calculator",
    category: "financial",
    subcategory: "loans-mortgages-payments",
    description: "Determine your home buying budget based on income, debt, and down payment using this comprehensive affordability calculator.",
    loader: () => import("@/components/calculators/Financial/HouseAffordabilityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "auto-loan",
    title: "Auto Loan Calculator",
    category: "financial",
    subcategory: "loans-mortgages-payments",
    description: "Calculate your auto loan payments accurately. Factor in trade-in value, sales tax, and fees to get a clear picture of your car purchase.",
    loader: () => import("@/components/calculators/Financial/AutoLoanCalculator"),
    urlStyle: "flat"
  },
    
    
    {
    slug: "student-loan-repayment",
    title: "Student Loan Repayment Calculator",
    category: "financial",
    subcategory: "loans-mortgages-payments",
    description: "Plan your student loan repayment strategy. Estimate monthly payments and total interest costs under different repayment plans.",
    loader: () => import("@/components/calculators/Financial/StudentLoanRepaymentCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "lease-vs-buy",
    title: "Lease vs Buy Calculator",
    category: "financial",
    subcategory: "loans-mortgages-payments",
    description: "Compare the costs of leasing versus buying a car. Analyze monthly payments and long-term value to make the smartest financial decision.",
    loader: () => import("@/components/calculators/Financial/LeaseVsBuyCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "compound-interest",
    title: "Compound Interest Calculator",
    category: "financial",
    subcategory: "investments-savings",
    description: "Calculate the power of compound interest. See how your investments grow over time with daily, monthly, or yearly compounding.",
    loader: () => import("@/components/calculators/Financial/CompoundInterestCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "future-value-investment",
    title: "Future Value of Investment Calculator",
    category: "financial",
    subcategory: "investments-savings",
    description: "Estimate the future value of your investments. Calculate growth based on initial principal, periodic contributions, and expected interest rate.",
    loader: () => import("@/components/calculators/Financial/FutureValueInvestmentCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "roi-return-on-investment",
    title: "Investment Return (ROI) Calculator",
    category: "financial",
    subcategory: "investments-savings",
    description: "Calculate your Return on Investment (ROI) percentage. Measure the profitability of your assets and portfolio performance easily.",
    loader: () => import("@/components/calculators/Financial/RoiReturnOnInvestmentCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "sip-monthly-investment-planner",
    title: "SIP/Monthly Investment Planner",
    category: "financial",
    subcategory: "investments-savings",
    description: "Plan your Systematic Investment Plan (SIP). Calculate the expected returns on your monthly mutual fund or stock market investments.",
    loader: () => import("@/components/calculators/Financial/SipMonthlyInvestmentPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "inflation-adjusted-value",
    title: "Inflation Adjusted Value Calculator",
    category: "financial",
    subcategory: "investments-savings",
    description: "Calculate the real value of money over time. Adjust for inflation to understand your future purchasing power accurately.",
    loader: () => import("@/components/calculators/Financial/InflationAdjustedValueCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "retirement-savings-goal",
    title: "Retirement Savings Goal Calculator",
    category: "financial",
    subcategory: "investments-savings",
    description: "Determine how much you need to save for retirement. Set clear goals based on your current age, income, and desired lifestyle.",
    loader: () => import("@/components/calculators/Financial/RetirementSavingsGoalCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "emergency-fund-goal",
    title: "Emergency Fund Goal Calculator",
    category: "financial",
    subcategory: "investments-savings",
    description: "Calculate the ideal size for your emergency fund. Plan for 3 to 6 months of expenses to ensure financial security against the unexpected.",
    loader: () => import("@/components/calculators/Financial/EmergencyFundGoalCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "401k-retirement-savings-growth",
    title: "401(k) / Retirement Savings Growth Calculator",
    category: "financial",
    subcategory: "investments-savings",
    description: "Estimate your 401(k) growth over time. Factor in employer matching and annual contributions to visualize your retirement nest egg.",
    loader: () => import("@/components/calculators/Financial/401kRetirementSavingsGrowthCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "social-security-benefit-estimator",
    title: "Social Security Benefit Estimator",
    category: "financial",
    subcategory: "investments-savings",
    description: "Estimate your future Social Security benefits. Calculate potential monthly payments based on your earnings history and retirement age.",
    loader: () => import("@/components/calculators/Financial/SocialSecurityBenefitEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "rule-of-72",
    title: "Rule of 72 Calculator",
    category: "financial",
    subcategory: "investments-savings",
    description: "Quickly estimate how long it will take to double your investment. Use the Rule of 72 formula for fast mental math on investment growth.",
    loader: () => import("@/components/calculators/Financial/RuleOf72Calculator"),
    urlStyle: "flat"
  },
    {
    slug: "bond-yield",
    title: "Bond Yield Calculator",
    category: "financial",
    subcategory: "investments-savings",
    description: "Calculate current yield and yield to maturity (YTM) for bonds. Assess the true performance of your fixed-income investments.",
    loader: () => import("@/components/calculators/Financial/BondYieldCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "roth-ira-conversion",
    title: "Roth IRA Conversion Calculator",
    category: "financial",
    subcategory: "investments-savings",
    description: "Analyze the tax implications of converting a traditional IRA to a Roth IRA. Determine if the tax cost now is worth the tax-free growth later.",
    loader: () => import("@/components/calculators/Financial/RothIraConversionCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dca-simulator",
    title: "Dollar Cost Averaging (DCA) Simulator",
    category: "financial",
    subcategory: "investments-savings",
    description: "Simulate Dollar Cost Averaging strategies. See how regular investing compares to lump-sum investing and beats market timing volatility.",
    loader: () => import("@/components/calculators/Financial/DcaSimulatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "crypto-dca-strategy",
    title: "Crypto DCA Strategy Calculator",
    category: "financial",
    subcategory: "investments-savings",
    description: "Calculate potential returns from a Crypto DCA strategy. Analyze historical performance of recurring buys in volatile markets.",
    loader: () => import("@/components/calculators/Financial/CryptoDcaStrategyCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "stock-dca-return-estimator",
    title: "Stock DCA Return Estimator",
    category: "financial",
    subcategory: "investments-savings",
    description: "Estimate returns for stock market dollar cost averaging. Visualize long-term portfolio growth by investing consistent amounts over time.",
    loader: () => import("@/components/calculators/Financial/StockDcaReturnEstimatorCalculator"),
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
