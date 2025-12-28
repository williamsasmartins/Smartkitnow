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
    {
    slug: "monthly-budget-planner",
    title: "Monthly Budget Planner",
    category: "financial",
    subcategory: "income-budget-expenses",
    description: "Manage your finances with this monthly budget planner. Track income and expenses to stay on target and reach your financial goals.",
    loader: () => import("@/components/calculators/Financial/MonthlyBudgetPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "net-income-after-tax",
    title: "Net Income after Tax Calculator",
    category: "financial",
    subcategory: "income-budget-expenses",
    description: "Calculate your net income after taxes. Estimate your actual take-home pay based on your gross salary and location.",
    loader: () => import("@/components/calculators/Financial/NetIncomeAfterTaxCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "hourly-to-annual-salary",
    title: "Hourly to Annual Salary Converter",
    category: "financial",
    subcategory: "income-budget-expenses",
    description: "Convert hourly wages to annual salary instantly. Calculate weekly, bi-weekly, monthly, and yearly earnings from your hourly rate.",
    loader: () => import("@/components/calculators/Financial/HourlyToAnnualSalaryCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "debt-to-income-ratio",
    title: "Debt-to-Income Ratio Calculator",
    category: "financial",
    subcategory: "income-budget-expenses",
    description: "Calculate your Debt-to-Income (DTI) ratio. Essential for assessing mortgage eligibility and understanding your overall financial health.",
    loader: () => import("@/components/calculators/Financial/DebtToIncomeRatioCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "savings-rate-tracker",
    title: "Savings Rate Tracker",
    category: "financial",
    subcategory: "income-budget-expenses",
    description: "Track your personal savings rate. Determine exactly what percentage of your income you are saving for the future versus spending.",
    loader: () => import("@/components/calculators/Financial/SavingsRateTrackerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "expense-splitter-shared-bills",
    title: "Expense Splitter (Shared Bills) Calculator",
    category: "financial",
    subcategory: "income-budget-expenses",
    description: "Split shared bills fairly among roommates or friends. Calculate exactly who owes what for rent, utilities, and groceries.",
    loader: () => import("@/components/calculators/Financial/ExpenseSplitterSharedBillsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "take-home-pay",
    title: "Take-Home Pay Calculator",
    category: "financial",
    subcategory: "income-budget-expenses",
    description: "Estimate your paycheck after tax withholdings and deductions. See exactly what amount hits your bank account every payday.",
    loader: () => import("@/components/calculators/Financial/TakeHomePayCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "paycheck-calculator",
    title: "Paycheck Calculator",
    category: "financial",
    subcategory: "income-budget-expenses",
    description: "Calculate your paycheck based on hours worked, pay rate, and overtime. Get an accurate salary estimation for your next pay period.",
    loader: () => import("@/components/calculators/Financial/PaycheckCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "absence-percentage-calculator",
    title: "Absence Percentage Calculator",
    category: "financial",
    subcategory: "income-budget-expenses",
    description: "Calculate employee absence percentage. Track attendance rates useful for HR metrics and workforce management analysis.",
    loader: () => import("@/components/calculators/Financial/AbsencePercentageCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "credit-card-payoff",
    title: "Credit Card Payoff Calculator",
    category: "financial",
    subcategory: "debt-management-credit",
    description: "Create a plan to pay off credit card debt. See how long it takes to become debt-free with different monthly payment amounts.",
    loader: () => import("@/components/calculators/Financial/CreditCardPayoffCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "debt-consolidation",
    title: "Debt Consolidation Calculator",
    category: "financial",
    subcategory: "debt-management-credit",
    description: "Determine if debt consolidation is right for you. Compare current payments versus a consolidated loan to see potential interest savings.",
    loader: () => import("@/components/calculators/Financial/DebtConsolidationCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "net-worth",
    title: "Net Worth Calculator",
    category: "financial",
    subcategory: "debt-management-credit",
    description: "Calculate your total net worth. Subtract liabilities from assets to understand your overall financial position and track wealth.",
    loader: () => import("@/components/calculators/Financial/NetWorthCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "currency-converter-live",
    title: "Currency Converter (Live Rates)",
    category: "financial",
    subcategory: "debt-management-credit",
    description: "Convert currencies with real-time exchange rates. Essential tool for travel planning and international business transactions.",
    loader: () => import("@/components/calculators/Financial/CurrencyConverterLiveCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "sales-tax",
    title: "Sales Tax Calculator",
    category: "financial",
    subcategory: "debt-management-credit",
    description: "Calculate sales tax and total purchase price. Add local tax rates to net prices instantly for accurate budgeting.",
    loader: () => import("@/components/calculators/Financial/SalesTaxCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "vat-gst",
    title: "VAT/GST Calculator",
    category: "financial",
    subcategory: "debt-management-credit",
    description: "Calculate VAT or GST for goods and services. Add or remove tax from the gross amount easily for international pricing.",
    loader: () => import("@/components/calculators/Financial/VatGstCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "debt-snowball",
    title: "Debt Snowball Calculator",
    category: "financial",
    subcategory: "debt-management-credit",
    description: "Use the debt snowball method to pay off debts faster. Organize debts from smallest to largest balance to build momentum.",
    loader: () => import("@/components/calculators/Financial/DebtSnowballCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "apr",
    title: "APR Calculator",
    category: "financial",
    subcategory: "debt-management-credit",
    description: "Calculate the Annual Percentage Rate (APR) for loans. Understand the true cost of borrowing including fees and interest.",
    loader: () => import("@/components/calculators/Financial/AprCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "credit-card-interest",
    title: "Credit Card Interest Calculator",
    category: "financial",
    subcategory: "debt-management-credit",
    description: "Estimate how much interest you will pay on your credit card balance over time. See the cost of carrying debt.",
    loader: () => import("@/components/calculators/Financial/CreditCardInterestCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "loan-comparison",
    title: "Loan Comparison Calculator",
    category: "financial",
    subcategory: "debt-management-credit",
    description: "Compare two different loans side-by-side. Analyze interest rates, terms, and total costs to choose the best financing option.",
    loader: () => import("@/components/calculators/Financial/LoanComparisonCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "college-savings",
    title: "College Savings Calculator",
    category: "financial",
    subcategory: "debt-management-credit",
    description: "Plan for college expenses. Estimate how much you need to save for tuition and education costs based on projected inflation.",
    loader: () => import("@/components/calculators/Financial/CollegeSavingsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "irr-npv",
    title: "IRR NPV Calculator",
    category: "financial",
    subcategory: "debt-management-credit",
    description: "Calculate Internal Rate of Return (IRR) and Net Present Value (NPV) for financial project analysis and investment decisions.",
    loader: () => import("@/components/calculators/Financial/IrrNpvCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "tax-bracket",
    title: "Tax Bracket Calculator",
    category: "financial",
    subcategory: "debt-management-credit",
    description: "Find your federal tax bracket. Estimate your effective tax rate based on taxable income and filing status to plan ahead.",
    loader: () => import("@/components/calculators/Financial/TaxBracketCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "crypto-to-fiat",
    title: "Crypto to Fiat Converter",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Convert cryptocurrency to fiat currency instantly. Get live exchange rates for BTC, ETH, and more to USD, EUR, and other currencies.",
    loader: () => import("@/components/calculators/Financial/CryptoToFiatCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "crypto-to-crypto-exchange-rate",
    title: "Crypto to Crypto Exchange Rate Calculator",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Calculate exchange rates between different cryptocurrencies. Determine swap ratios for altcoins and tokens quickly.",
    loader: () => import("@/components/calculators/Financial/CryptoToCryptoExchangeRateCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "live-price-checker",
    title: "Live Price Checker (Real-Time Rates)",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Check real-time cryptocurrency prices. Monitor market movements for top coins instantly to stay updated on market trends.",
    loader: () => import("@/components/calculators/Financial/LivePriceCheckerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "portfolio-value-tracker",
    title: "Portfolio Value Tracker",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Track the total value of your crypto portfolio. Monitor gains and losses across all your digital asset holdings in one place.",
    loader: () => import("@/components/calculators/Financial/PortfolioValueTrackerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "fiat-to-crypto-purchase",
    title: "Fiat to Crypto Purchase Calculator",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Calculate how much crypto you can buy with a specific amount of fiat currency. Plan your entry points accurately.",
    loader: () => import("@/components/calculators/Financial/FiatToCryptoPurchaseCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "multi-currency-crypto-converter",
    title: "Multi-Currency Crypto Converter",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Convert between multiple cryptocurrencies and fiat currencies simultaneously. A versatile tool for diverse portfolios.",
    loader: () => import("@/components/calculators/Financial/MultiCurrencyCryptoConverterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "crypto-profit-loss",
    title: "Crypto Profit/Loss Calculator",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Calculate profit or loss on your crypto trades. Input buy and sell prices to see your exact Return on Investment.",
    loader: () => import("@/components/calculators/Financial/CryptoProfitLossCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "crypto-roi",
    title: "ROI (Return on Investment) Calculator",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Calculate crypto Return on Investment. Measure the performance of your digital asset investments over specific timeframes.",
    loader: () => import("@/components/calculators/Financial/CryptoRoiCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "crypto-future-value-compound-growth",
    title: "Future Value & Compound Growth Estimator",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Estimate the future value of crypto assets with compound growth. Project long-term holding potential based on APY.",
    loader: () => import("@/components/calculators/Financial/CryptoFutureValueCompoundGrowthCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "yield-farming-apy",
    title: "Yield Farming APY Calculator",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Calculate Annual Percentage Yield (APY) for yield farming. Estimate daily and yearly returns on your liquidity provider positions.",
    loader: () => import("@/components/calculators/Financial/YieldFarmingApyCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "staking-rewards-estimator",
    title: "Staking Rewards Estimator",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Estimate staking rewards for Proof-of-Stake coins. Calculate earnings based on staked amount and lock-up duration.",
    loader: () => import("@/components/calculators/Financial/StakingRewardsEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "investment-break-even-point",
    title: "Investment Break-Even Point Calculator",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Find the break-even price for your crypto investments. Know exactly when your trade turns profitable after fees.",
    loader: () => import("@/components/calculators/Financial/InvestmentBreakEvenPointCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dca-strategy-analyzer-crypto",
    title: "DCA Strategy Analyzer (Crypto)",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Analyze your Crypto Dollar Cost Averaging strategy. Evaluate historical performance and risk reduction of recurring buys.",
    loader: () => import("@/components/calculators/Financial/DcaStrategyAnalyzerCryptoCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "mining-profitability",
    title: "Mining Profitability Calculator",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Calculate crypto mining profitability. Factor in hashrate, power consumption, and electricity costs to estimate net earnings.",
    loader: () => import("@/components/calculators/Financial/MiningProfitabilityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "hash-rate-to-earnings",
    title: "Hash Rate to Earnings Converter",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Convert mining hashrate to estimated earnings. See how much your hardware can generate per day in current market conditions.",
    loader: () => import("@/components/calculators/Financial/HashRateToEarningsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "electricity-cost-vs-mining-revenue",
    title: "Electricity Cost vs Mining Revenue",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Compare electricity costs against mining revenue. Ensure your mining operation remains profitable with this cost analysis tool.",
    loader: () => import("@/components/calculators/Financial/ElectricityCostVsMiningRevenueCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "gpu-asic-mining-roi",
    title: "GPU/ASIC Mining ROI Calculator",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Calculate ROI for mining hardware. Estimate how long it takes to pay off GPUs or ASICs based on current profitability.",
    loader: () => import("@/components/calculators/Financial/GpuAsicMiningRoiCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "pool-fee-impact",
    title: "Pool Fee Impact Estimator",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Estimate the impact of mining pool fees on your earnings. Compare different pools to maximize your mining profit.",
    loader: () => import("@/components/calculators/Financial/PoolFeeImpactCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "crypto-tax-liability",
    title: "Crypto Tax Liability Calculator",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Estimate your potential crypto tax liability. Prepare for tax season by calculating estimated gains and losses.",
    loader: () => import("@/components/calculators/Financial/CryptoTaxLiabilityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "capital-gains-tax-estimator",
    title: "Capital Gains Tax Estimator",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Calculate capital gains tax on crypto sales. Determine short-term vs long-term tax obligations based on holding period.",
    loader: () => import("@/components/calculators/Financial/CapitalGainsTaxEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "transaction-fee-deduction",
    title: "Transaction Fee Deduction Tool",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Calculate deductible transaction fees. Reduce your taxable gain by accounting for gas and exchange fees accurately.",
    loader: () => import("@/components/calculators/Financial/TransactionFeeDeductionCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cost-basis-fifo-lifo",
    title: "Cost Basis Calculator (FIFO/LIFO)",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Calculate cost basis using FIFO or LIFO methods. Essential for accurate crypto tax reporting and portfolio tracking.",
    loader: () => import("@/components/calculators/Financial/CostBasisFifoLifoCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "leverage-margin-profit",
    title: "Leverage & Margin Profit Calculator",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Calculate potential profits and losses with leverage. Assess risk and potential liquidation points for margin trading.",
    loader: () => import("@/components/calculators/Financial/LeverageMarginProfitCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "position-size-risk-management",
    title: "Position Size & Risk Management Tool",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Determine optimal position size. Manage risk by calculating stop-loss levels and appropriate trade amounts for your account.",
    loader: () => import("@/components/calculators/Financial/PositionSizeRiskManagementCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "volatility-risk-assessment",
    title: "Volatility & Risk Assessment Calculator",
    category: "financial",
    subcategory: "cryptocurrency-core-tools",
    description: "Assess crypto market volatility. Calculate risk metrics to inform your trading strategy and manage exposure.",
    loader: () => import("@/components/calculators/Financial/VolatilityRiskAssessmentCalculator"),
    urlStyle: "flat"
  },
    
  
 
    
    
   
    
   
  
   
    {
    slug: "dog-calorie-needs-rer-mer",
    title: "Dog Calorie Needs (RER/MER) Calculator",
    category: "pets",
    subcategory: "dogs-nutrition-weight",
    description: "Calculate your dog's **Resting Energy Requirement (RER)** and **Maintenance Energy Requirement (MER)** to determine daily calorie needs.",
    loader: () => import("@/components/calculators/Pets/DogCalorieNeedsRerMerCalculator"),
    urlStyle: "flat"
  },
    
  
    
    {
    slug: "qr-code-generator",
    title: "QR Code Generator",
    category: "everyday-life",
    subcategory: "utilities",
    description: "Gere QR Codes gratuitos para URLs e textos. Baixe em PNG ou SVG com tamanho, margem e correção de erro configuráveis.",
    loader: () => import("@/components/calculators/EverydayLife/QrCodeGeneratorCalculator"),
    urlStyle: "flat"
  },
    
    
  
    
 
   
   
 

    
   
   
   
   
   
   
    
   
  
  
   
    
   
  
    
   
   
   
 
   
    
   
   
   

   
    
 
    
   
   

   
 

  
  
   
   
  
  
  
    
   
  
   
   
   
  
   
  
  
    
    {
    slug: "tdee-daily-energy-expenditure",
    title: "TDEE — Total Daily Energy Expenditure Calculator",
    category: "health",
    subcategory: "body-metrics-weight-management",
    description: "Estimate your Total Daily Energy Expenditure (TDEE). Learn how many calories you need daily to maintain, lose, or gain weight.",
    loader: () => import("@/components/calculators/Health/TdeeDailyEnergyExpenditureCalculator"),
    urlStyle: "flat"
  },
   
   
   
    
 
    {
    slug: "bmi-body-mass-index",
    title: "BMI — Body Mass Index Calculator",
    category: "health",
    subcategory: "body-metrics-weight-management",
    description: "Calculate your Body Mass Index (BMI) instantly. Determine if you are in a healthy weight range based on your height and weight.",
    loader: () => import("@/components/calculators/Health/BmiBodyMassIndexCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bmr-mifflin-st-jeor",
    title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)",
    category: "health",
    subcategory: "body-metrics-weight-management",
    description: "Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation. Find out exactly how many calories your body burns at rest.",
    loader: () => import("@/components/calculators/Health/BmrMifflinStJeorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "body-fat-us-navy-3-sites",
    title: "Body Fat % (US Navy / 3-sites)",
    category: "health",
    subcategory: "body-metrics-weight-management",
    description: "Estimate your body fat percentage using the US Navy method. Track your body composition progress accurately without expensive equipment.",
    loader: () => import("@/components/calculators/Health/BodyFatUsNavy3SitesCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ideal-weight-range-hamwi-devine-miller",
    title: "Ideal Weight Range (Hamwi/Devine/Miller)",
    category: "health",
    subcategory: "body-metrics-weight-management",
    description: "Discover your ideal weight range. Compare results from Hamwi, Devine, and Miller formulas to set realistic and healthy weight goals.",
    loader: () => import("@/components/calculators/Health/IdealWeightRangeHamwiDevineMillerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "waist-to-height-ratio",
    title: "Waist-to-Height Ratio Checker",
    category: "health",
    subcategory: "body-metrics-weight-management",
    description: "Calculate your Waist-to-Height Ratio (WHtR). Use this simple yet effective metric to assess central obesity and cardiovascular health risks.",
    loader: () => import("@/components/calculators/Health/WaistToHeightRatioCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "body-surface-area-bsa",
    title: "Body Surface Area (BSA) Calculator",
    category: "health",
    subcategory: "body-metrics-weight-management",
    description: "Calculate Body Surface Area (BSA) accurately. Essential for determining medical dosages and assessing metabolic parameters.",
    loader: () => import("@/components/calculators/Health/BodySurfaceAreaBsaCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "daily-calorie-needs-goal",
    title: "Daily Calorie Needs (Goal-based)",
    category: "health",
    subcategory: "body-metrics-weight-management",
    description: "Determine daily calorie needs for your specific goal. Create a personalized nutrition plan for weight loss, maintenance, or muscle gain.",
    loader: () => import("@/components/calculators/Health/DailyCalorieNeedsGoalCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "weight-loss-date-deficit-planner",
    title: "Weight Loss Date & Deficit Planner",
    category: "health",
    subcategory: "body-metrics-weight-management",
    description: "Plan your weight loss journey timeline. Calculate the exact date you will reach your target weight based on your daily calorie deficit.",
    loader: () => import("@/components/calculators/Health/WeightLossDateDeficitPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "macro-split-planner",
    title: "Macro Split Planner (Protein/Carb/Fat)",
    category: "health",
    subcategory: "nutrition-macros",
    description: "Optimize your diet with a macro split planner. Calculate the perfect ratio of proteins, carbohydrates, and fats for your fitness goals.",
    loader: () => import("@/components/calculators/Health/MacroSplitPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "protein-intake-by-goal",
    title: "Protein Intake by Goal (cut/bulk/maintain)",
    category: "health",
    subcategory: "nutrition-macros",
    description: "Calculate your optimal daily protein intake. Find out exactly how many grams you need to build muscle or preserve mass while dieting.",
    loader: () => import("@/components/calculators/Health/ProteinIntakeByGoalCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "carb-target-low-carb-keto",
    title: "Carb Target (incl. low-carb/keto ranges)",
    category: "health",
    subcategory: "nutrition-macros",
    description: "Set your daily carbohydrate target. Perfect for planning Low-Carb, Keto, or balanced diets to fuel your energy needs effectively.",
    loader: () => import("@/components/calculators/Health/CarbTargetLowCarbKetoCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "fat-intake-range-amdr",
    title: "Fat Intake Range (AMDR)",
    category: "health",
    subcategory: "nutrition-macros",
    description: "Determine healthy fat intake ranges based on AMDR. Ensure hormonal health and satiety by consuming the right amount of dietary fats.",
    loader: () => import("@/components/calculators/Health/FatIntakeRangeAmdrCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "fiber-intake-target",
    title: "Fiber Intake Target (by kcal/sexo)",
    category: "health",
    subcategory: "nutrition-macros",
    description: "Calculate your recommended daily fiber intake. Improve digestion and gut health by hitting accurate fiber goals based on calorie intake.",
    loader: () => import("@/components/calculators/Health/FiberIntakeTargetCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "water-intake-per-day",
    title: "Water Intake per Day (by weight/activity/climate)",
    category: "health",
    subcategory: "nutrition-macros",
    description: "Calculate your daily water intake requirements. Stay hydrated by adjusting for body weight, activity level, and climate conditions.",
    loader: () => import("@/components/calculators/Health/WaterIntakePerDayCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "meal-calories-split",
    title: "Meal Calories Split (breakfast/lunch/dinner/snacks)",
    category: "health",
    subcategory: "nutrition-macros",
    description: "Split your daily calories across meals efficiently. Plan balanced portions for breakfast, lunch, dinner, and snacks to control hunger.",
    loader: () => import("@/components/calculators/Health/MealCaloriesSplitCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "running-pace-speed-splits",
    title: "Running Pace, Speed & Split Calculator",
    category: "health",
    subcategory: "training-performance",
    description: "Calculate running pace, speed, and splits. An essential tool for runners to plan race times and monitor training performance.",
    loader: () => import("@/components/calculators/Health/RunningPaceSpeedSplitsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "calories-burned-met",
    title: "Calories Burned by Activity (MET-based)",
    category: "health",
    subcategory: "training-performance",
    description: "Estimate calories burned during exercise. Use MET values to calculate energy expenditure for running, cycling, swimming, and more.",
    loader: () => import("@/components/calculators/Health/CaloriesBurnedMetCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "heart-rate-zones",
    title: "Heart Rate Zones (Karvonen/percentages)",
    category: "health",
    subcategory: "training-performance",
    description: "Calculate your training heart rate zones. Use the Karvonen method to find the optimal intensity for fat loss or cardio improvement.",
    loader: () => import("@/components/calculators/Health/HeartRateZonesCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "vo2max-estimator-cooper-rockport",
    title: "VO2max Estimator (Cooper/Rockport)",
    category: "health",
    subcategory: "training-performance",
    description: "Estimate your VO2max aerobic capacity. Use Cooper or Rockport test results to assess your cardiovascular fitness level.",
    loader: () => import("@/components/calculators/Health/Vo2maxEstimatorCooperRockportCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "one-rep-max-1rm-epley-brzycki",
    title: "1RM — One-Rep Max (Epley/Brzycki)",
    category: "health",
    subcategory: "training-performance",
    description: "Calculate your One-Rep Max (1RM) safely. Estimate your maximum lifting strength using proven Epley and Brzycki formulas.",
    loader: () => import("@/components/calculators/Health/OneRepMax1rmEpleyBrzyckiCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "steps-distance-calories-converter",
    title: "Steps ↔ Distance ↔ Calories Converter",
    category: "health",
    subcategory: "training-performance",
    description: "Convert steps into distance and calories burned. Track your daily walking activity and visualize its impact on your fitness goals.",
    loader: () => import("@/components/calculators/Health/StepsDistanceCaloriesConverterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ovulation-fertile-window",
    title: "Ovulation & Fertile Window Estimator",
    category: "health",
    subcategory: "women-s-health",
    description: "Predict your ovulation and fertile window accurately. Maximize your chances of conception by tracking your most fertile days.",
    loader: () => import("@/components/calculators/Health/OvulationFertileWindowCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "pregnancy-due-date-naegele",
    title: "Pregnancy Due-Date (Naegele)",
    category: "health",
    subcategory: "women-s-health",
    description: "Calculate your pregnancy due date using Naegele's rule. Estimate the arrival of your baby based on your last menstrual period.",
    loader: () => import("@/components/calculators/Health/PregnancyDueDateNaegeleCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "pregnancy-weight-gain-range-bmi-aware",
    title: "Pregnancy Weight-Gain Range (BMI-aware)",
    category: "health",
    subcategory: "women-s-health",
    description: "Monitor healthy pregnancy weight gain. Get recommended weight ranges based on your pre-pregnancy BMI for a healthy baby and mom.",
    loader: () => import("@/components/calculators/Health/PregnancyWeightGainRangeBmiAwareCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "tdee-gestation-adjusted",
    title: "Gestational TDEE (educational)",
    category: "health",
    subcategory: "women-s-health",
    description: "Estimate energy needs during pregnancy. Calculate adjusted TDEE to ensure adequate nutrition for fetal development and maternal health.",
    loader: () => import("@/components/calculators/Health/TdeeGestationAdjustedCalculator"),
    urlStyle: "flat"
  },


  
  
    
    {
    slug: "dog-weight-loss-planner",
    title: "Dog Weight Loss Planner",
    category: "pets",
    subcategory: "dogs-nutrition-weight",
    description: "Plan a safe and effective weight loss program for your dog. Calculates target calories and timeline for goal weight achievement.",
    loader: () => import("@/components/calculators/Pets/DogWeightLossPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-ideal-weight-target-calories",
    title: "Dog Ideal Weight & Target Calories Calculator",
    category: "pets",
    subcategory: "dogs-nutrition-weight",
    description: "Determine your dog's ideal healthy weight and the specific calorie intake needed to maintain it based on breed and size.",
    loader: () => import("@/components/calculators/Pets/DogIdealWeightTargetCaloriesCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-treat-calories-daily-allowance",
    title: "Dog Treat Calories & Daily Allowance Calculator",
    category: "pets",
    subcategory: "dogs-nutrition-weight",
    description: "Calculate the calorie content of treats and the maximum safe daily treat allowance to prevent weight gain.",
    loader: () => import("@/components/calculators/Pets/DogTreatCaloriesDailyAllowanceCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-chocolate-toxicity",
    title: "Dog Chocolate Toxicity Calculator",
    category: "pets",
    subcategory: "dogs-toxicology-hazard",
    description: "Calculate the risk and severity of **chocolate poisoning** in dogs based on weight, type of chocolate consumed, and amount.",
    loader: () => import("@/components/calculators/Pets/DogChocolateToxicityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-grape-raisin-exposure-risk",
    title: "Dog Grape/Raisin Exposure Risk Calculator",
    category: "pets",
    subcategory: "dogs-toxicology-hazard",
    description: "Assess the toxic risk following accidental ingestion of grapes or raisins. Provides immediate action guidelines.",
    loader: () => import("@/components/calculators/Pets/DogGrapeRaisinExposureRiskCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-onion-garlic-exposure-risk",
    title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator",
    category: "pets",
    subcategory: "dogs-toxicology-hazard",
    description: "Determine the potential toxicity risk from consuming onions, garlic, chives, or leeks (Allium species).",
    loader: () => import("@/components/calculators/Pets/DogOnionGarlicExposureRiskCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-xylitol-exposure-risk",
    title: "Dog Xylitol Exposure Risk Calculator",
    category: "pets",
    subcategory: "dogs-toxicology-hazard",
    description: "Calculate the severe toxic risk posed by the artificial sweetener **Xylitol** based on dog weight and ingested amount.",
    loader: () => import("@/components/calculators/Pets/DogXylitolExposureRiskCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-caffeine-toxicity",
    title: "Dog Caffeine Toxicity Calculator",
    category: "pets",
    subcategory: "dogs-toxicology-hazard",
    description: "Estimate the toxic level risk from accidental ingestion of coffee, tea, or caffeine-containing products.",
    loader: () => import("@/components/calculators/Pets/DogCaffeineToxicityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-macadamia-nut-toxicity",
    title: "Dog Macadamia Nut Toxicity Calculator",
    category: "pets",
    subcategory: "dogs-toxicology-hazard",
    description: "Assess the risk of macadamia nut poisoning, which causes severe weakness and elevated body temperature.",
    loader: () => import("@/components/calculators/Pets/DogMacadamiaNutToxicityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-alcohol-ethanol-exposure-risk",
    title: "Dog Alcohol/Ethanol Exposure Risk Calculator",
    category: "pets",
    subcategory: "dogs-toxicology-hazard",
    description: "Calculate the toxic risk of ethanol/alcohol exposure based on concentration and dog's body weight.",
    loader: () => import("@/components/calculators/Pets/DogAlcoholEthanolExposureRiskCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-human-medication-exposure-alert",
    title: "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)",
    category: "pets",
    subcategory: "dogs-toxicology-hazard",
    description: "Alert tool for accidental exposure to common human pain relievers like **Ibuprofen** or **Acetaminophen (Tylenol)**.",
    loader: () => import("@/components/calculators/Pets/DogHumanMedicationExposureAlertCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-benadryl-diphenhydramine-dose",
    title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs",
    category: "pets",
    subcategory: "dogs-medication-dosing",
    description: "Calculate the safe, appropriate dosage of **Benadryl (Diphenhydramine)** for dogs based on body weight.",
    loader: () => import("@/components/calculators/Pets/DogBenadrylDiphenhydramineDoseCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-cephalexin-dose",
    title: "Cephalexin Dose Calculator for Dogs",
    category: "pets",
    subcategory: "dogs-medication-dosing",
    description: "Calculate the veterinarian-recommended dosage for the antibiotic **Cephalexin** in dogs based on body weight.",
    loader: () => import("@/components/calculators/Pets/DogCephalexinDoseCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-meloxicam-metacam-dose",
    title: "Meloxicam/Metacam Dose Calculator for Dogs",
    category: "pets",
    subcategory: "dogs-medication-dosing",
    description: "Calculate the safe initial and maintenance dosages for the NSAID **Meloxicam (Metacam)** for pain relief in dogs.",
    loader: () => import("@/components/calculators/Pets/DogMeloxicamMetacamDoseCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-gabapentin-dose",
    title: "Gabapentin Dose Calculator for Dogs",
    category: "pets",
    subcategory: "dogs-medication-dosing",
    description: "Calculate the proper dosage for the nerve pain and anxiety medication **Gabapentin** in dogs by weight.",
    loader: () => import("@/components/calculators/Pets/DogGabapentinDoseCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-prednisone-prednisolone-dose",
    title: "Prednisone/Prednisolone Dose Calculator for Dogs",
    category: "pets",
    subcategory: "dogs-medication-dosing",
    description: "Calculate the correct dosage for the anti-inflammatory and immunosuppressant steroid **Prednisone/Prednisolone**.",
    loader: () => import("@/components/calculators/Pets/DogPrednisonePrednisoloneDoseCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-tramadol-dose",
    title: "Tramadol Dose Calculator for Dogs",
    category: "pets",
    subcategory: "dogs-medication-dosing",
    description: "Calculate the appropriate pain relief dosage for **Tramadol** in dogs, considering weight and pain severity.",
    loader: () => import("@/components/calculators/Pets/DogTramadolDoseCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-omega-3-epa-dha-supplement",
    title: "Omega-3 (EPA/DHA) Supplement Calculator for Dogs",
    category: "pets",
    subcategory: "dogs-medication-dosing",
    description: "Determine the correct daily supplement dosage of **Omega-3 fatty acids (EPA/DHA)** for joint and skin health.",
    loader: () => import("@/components/calculators/Pets/DogOmega3EpaDhaSupplementCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "puppy-adult-size-predictor-weight-curve",
    title: "Puppy Adult Size Predictor (Weight Curve)",
    category: "pets",
    subcategory: "dogs-growth-body-measures",
    description: "Predict your puppy's final adult weight and size based on current age, weight, and breed growth curves.",
    loader: () => import("@/components/calculators/Pets/PuppyAdultSizePredictorWeightCurveCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-body-condition-score-bcs-target",
    title: "Dog Body Condition Score Helper (BCS → Target Plan)",
    category: "pets",
    subcategory: "dogs-growth-body-measures",
    description: "Use the **Body Condition Score (BCS)** system to assess your dog's fat level and create a target weight plan.",
    loader: () => import("@/components/calculators/Pets/DogBodyConditionScoreBcsTargetCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-bmi-body-index-educational",
    title: "Dog BMI/Body Index (educational)",
    category: "pets",
    subcategory: "dogs-growth-body-measures",
    description: "Educational tool to understand the concept of a body mass index tailored for canine anatomy and health.",
    loader: () => import("@/components/calculators/Pets/DogBmiBodyIndexEducationalCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-crate-size-finder",
    title: "Dog Crate Size Finder",
    category: "pets",
    subcategory: "dogs-growth-body-measures",
    description: "Find the correct and comfortable crate size for your dog based on their standing height and length.",
    loader: () => import("@/components/calculators/Pets/DogCrateSizeFinderCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-harness-size-fit-guide",
    title: "Dog Harness Size & Fit Guide",
    category: "pets",
    subcategory: "dogs-growth-body-measures",
    description: "Guide to measure and select the correct harness size and style for comfort and escape prevention.",
    loader: () => import("@/components/calculators/Pets/DogHarnessSizeFitGuideCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-walking-calories-burned",
    title: "Dog Walking Calories Burned Calculator",
    category: "pets",
    subcategory: "dogs-activity-fitness",
    description: "Estimate the number of calories your dog burns during walks based on distance, pace, and body weight.",
    loader: () => import("@/components/calculators/Pets/DogWalkingCaloriesBurnedCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-step-goal-activity-time-planner",
    title: "Dog Step-Goal & Activity Time Planner",
    category: "pets",
    subcategory: "dogs-activity-fitness",
    description: "Plan and track daily step goals and active play time to ensure adequate exercise for your dog's needs.",
    loader: () => import("@/components/calculators/Pets/DogStepGoalActivityTimePlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-heat-risk-walk-safety-window",
    title: "Heat Risk/Walk Safety Window (Temp & Humidity)",
    category: "pets",
    subcategory: "dogs-activity-fitness",
    description: "Calculates the **Heat Index Risk** based on ambient temperature and humidity to determine safe windows for dog walks.",
    loader: () => import("@/components/calculators/Pets/DogHeatRiskWalkSafetyWindowCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-age-human-years-breed-aware",
    title: "Dog Age in Human Years (Breed-Aware)",
    category: "pets",
    subcategory: "dogs-age-longevity",
    description: "Convert your dog's age to human years using a formula that accounts for their specific breed size and longevity.",
    loader: () => import("@/components/calculators/Pets/DogAgeHumanYearsBreedAwareCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-life-expectancy-estimator",
    title: "Dog Life Expectancy Estimator (lifestyle factors)",
    category: "pets",
    subcategory: "dogs-age-longevity",
    description: "Estimate a dog's life expectancy based on breed, size, diet, exercise habits, and spay/neuter status.",
    loader: () => import("@/components/calculators/Pets/DogLifeExpectancyEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-pregnancy-gestation-due-date",
    title: "Dog Pregnancy (Gestation) Due-Date Calculator",
    category: "pets",
    subcategory: "dogs-reproduction",
    description: "Calculate the expected **due date** for a pregnant dog based on the date of first or last breeding.",
    loader: () => import("@/components/calculators/Pets/DogPregnancyGestationDueDateCalculator"),
    urlStyle: "flat"
  },
    
    {
    slug: "puppy-calorie-needs-age-breed-size",
    title: "Puppy Calorie Needs by Age/Breed Size Calculator",
    category: "pets",
    subcategory: "dogs-nutrition-weight",
    description: "Calculate the specific energy needs for puppies based on their current age and predicted adult breed size for optimal growth.",
    loader: () => import("@/components/calculators/Pets/PuppyCalorieNeedsAgeBreedSizeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-protein-fat-intake-guide",
    title: "Dog Protein/Fat Intake Guide (by Goal)",
    category: "pets",
    subcategory: "dogs-nutrition-weight",
    description: "Guide for setting optimal **protein and fat ratios** in your dog's diet, tailored for growth, maintenance, or athletic performance.",
    loader: () => import("@/components/calculators/Pets/DogProteinFatIntakeGuideCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-daily-water-intake-checker",
    title: "Dog Daily Water Intake Checker",
    category: "pets",
    subcategory: "dogs-hydration",
    description: "Check if your dog is drinking enough water daily. Calculates the minimum required intake based on weight and diet type.",
    loader: () => import("@/components/calculators/Pets/DogDailyWaterIntakeCheckerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-dehydration-risk-estimator",
    title: "Dehydration Risk Estimator (Weight & Symptoms Aware)",
    category: "pets",
    subcategory: "dogs-hydration",
    description: "Estimate the risk of dehydration by inputting weight changes and physical symptoms for veterinary attention.",
    loader: () => import("@/components/calculators/Pets/DogDehydrationRiskEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-whelping-countdown-stage-timeline",
    title: "Whelping Countdown & Stage Timeline",
    category: "pets",
    subcategory: "dogs-reproduction",
    description: "Track the countdown to whelping (birth) and estimate the timeline for each stage of labor.",
    loader: () => import("@/components/calculators/Pets/DogWhelpingCountdownStageTimelineCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-calorie-needs-rer-mer",
    title: "Cat Calorie Needs (RER/MER) Calculator",
    category: "pets",
    subcategory: "cats-nutrition-weight",
    description: "Calculate your cat's **Resting Energy Requirement (RER)** and **Maintenance Energy Requirement (MER)** for daily feeding.",
    loader: () => import("@/components/calculators/Pets/CatCalorieNeedsRerMerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-weight-loss-planner",
    title: "Cat Weight Loss Planner",
    category: "pets",
    subcategory: "cats-nutrition-weight",
    description: "Plan a tailored weight loss program for your cat, calculating target calories, weight reduction, and duration.",
    loader: () => import("@/components/calculators/Pets/CatWeightLossPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-ideal-weight-target-calories",
    title: "Ideal Weight & Target Calories for Cats",
    category: "pets",
    subcategory: "cats-nutrition-weight",
    description: "Determine your cat's optimal weight and the necessary daily calorie intake for maintenance.",
    loader: () => import("@/components/calculators/Pets/CatIdealWeightTargetCaloriesCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "kitten-calorie-needs-age-size",
    title: "Kitten Calorie Needs by Age/Size",
    category: "pets",
    subcategory: "cats-nutrition-weight",
    description: "Calculate the high energy requirements for growing kittens based on their age and projected adult size.",
    loader: () => import("@/components/calculators/Pets/KittenCalorieNeedsAgeSizeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "senior-cat-nutrition-calorie-adjuster",
    title: "Senior Cat Nutrition & Calorie Adjuster",
    category: "pets",
    subcategory: "cats-nutrition-weight",
    description: "Adjust feeding plans and calorie targets for older cats, accounting for changes in metabolism and activity.",
    loader: () => import("@/components/calculators/Pets/SeniorCatNutritionCalorieAdjusterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-treat-calories-daily-allowance",
    title: "Cat Treat Calories & Daily Allowance",
    category: "pets",
    subcategory: "cats-nutrition-weight",
    description: "Calculate the caloric contribution of cat treats and set a safe daily limit to prevent excess weight gain.",
    loader: () => import("@/components/calculators/Pets/CatTreatCaloriesDailyAllowanceCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-protein-fat-intake-guide",
    title: "Protein/Fat Intake Guide for Cats (by Goal)",
    category: "pets",
    subcategory: "cats-nutrition-weight",
    description: "Guide for ensuring your cat meets its high protein requirements, adjusting fat ratios for health goals.",
    loader: () => import("@/components/calculators/Pets/CatProteinFatIntakeGuideCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-daily-water-intake-checker",
    title: "Daily Water Intake Checker for Cats",
    category: "pets",
    subcategory: "cats-hydration",
    description: "Check if your cat is meeting its daily fluid requirement, crucial for kidney health, especially with dry food diets.",
    loader: () => import("@/components/calculators/Pets/CatDailyWaterIntakeCheckerCalculator"),
    urlStyle: "flat"
  },
    
   
    {
    slug: "cat-dehydration-risk-estimator",
    title: "Dehydration Risk Estimator (Symptoms + Intake)",
    category: "pets",
    subcategory: "cats-hydration",
    description: "Estimate the risk of dehydration using clinical signs and tracking fluid intake, particularly in sick cats.",
    loader: () => import("@/components/calculators/Pets/CatDehydrationRiskEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-chocolate-toxicity",
    title: "Cat Chocolate Toxicity Calculator",
    category: "pets",
    subcategory: "cats-toxicology-hazard",
    description: "Calculate the toxic dose of chocolate for cats (though less common than in dogs).",
    loader: () => import("@/components/calculators/Pets/CatChocolateToxicityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-onion-garlic-toxicity",
    title: "Cat Onion/Garlic Toxicity Calculator",
    category: "pets",
    subcategory: "cats-toxicology-hazard",
    description: "Determine the potential risk of red blood cell damage from ingesting Allium species (onions, garlic).",
    loader: () => import("@/components/calculators/Pets/CatOnionGarlicToxicityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-grape-raisin-exposure-risk",
    title: "Cat Grape/Raisin Exposure Risk (educational)",
    category: "pets",
    subcategory: "cats-toxicology-hazard",
    description: "Educational tool on the potential, though rare, kidney toxicity risk from grapes and raisins in cats.",
    loader: () => import("@/components/calculators/Pets/CatGrapeRaisinExposureRiskCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-xylitol-exposure-risk",
    title: "Xylitol Exposure Risk for Cats (rare but educational)",
    category: "pets",
    subcategory: "cats-toxicology-hazard",
    description: "Educational tool detailing the severe risk of Xylitol poisoning, even though cat exposure is less frequent.",
    loader: () => import("@/components/calculators/Pets/CatXylitolExposureRiskCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-caffeine-toxicity",
    title: "Caffeine Toxicity Risk for Cats",
    category: "pets",
    subcategory: "cats-toxicology-hazard",
    description: "Estimate the toxic exposure risk from caffeine in products like coffee grounds, tea, or energy drinks.",
    loader: () => import("@/components/calculators/Pets/CatCaffeineToxicityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-essential-oils-exposure-risk",
    title: "Essential Oils Exposure Risk (diffuser/dermal)",
    category: "pets",
    subcategory: "cats-toxicology-hazard",
    description: "Assess the toxic risk from exposure to essential oils (e.g., concentrated tea tree oil) via diffusers or skin contact.",
    loader: () => import("@/components/calculators/Pets/CatEssentialOilsExposureRiskCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-lilies-poisoning-risk-guide",
    title: "Lilies Poisoning Risk Guide (cats)",
    category: "pets",
    subcategory: "cats-toxicology-hazard",
    description: "Guide to the extreme and potentially fatal kidney toxicity risk posed by exposure to various types of lilies.",
    loader: () => import("@/components/calculators/Pets/CatLiliesPoisoningRiskGuideCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-acetaminophen-ibuprofen-exposure-risk",
    title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)",
    category: "pets",
    subcategory: "cats-toxicology-hazard",
    description: "Alert tool for accidental exposure to common human pain relievers, particularly dangerous **Acetaminophen (Tylenol)**.",
    loader: () => import("@/components/calculators/Pets/CatAcetaminophenIbuprofenExposureRiskCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-benadryl-diphenhydramine-dose",
    title: "Benadryl (Diphenhydramine) Dose Calculator for Cats",
    category: "pets",
    subcategory: "cats-medication-dosing",
    description: "Calculate the safe, appropriate dosage of **Benadryl (Diphenhydramine)** for cats based on body weight.",
    loader: () => import("@/components/calculators/Pets/CatBenadrylDiphenhydramineDoseCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-cephalexin-dose",
    title: "Cephalexin Dose Calculator for Cats",
    category: "pets",
    subcategory: "cats-medication-dosing",
    description: "Calculate the veterinarian-recommended dosage for the antibiotic **Cephalexin** in cats based on body weight.",
    loader: () => import("@/components/calculators/Pets/CatCephalexinDoseCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-meloxicam-dose",
    title: "Meloxicam Dose Calculator for Cats",
    category: "pets",
    subcategory: "cats-medication-dosing",
    description: "Calculate the short-term analgesic dose for the NSAID **Meloxicam** in cats.",
    loader: () => import("@/components/calculators/Pets/CatMeloxicamDoseCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-gabapentin-dose",
    title: "Gabapentin Dose Calculator for Cats",
    category: "pets",
    subcategory: "cats-medication-dosing",
    description: "Calculate the proper dosage for the nerve pain and sedation medication **Gabapentin** in cats by weight.",
    loader: () => import("@/components/calculators/Pets/CatGabapentinDoseCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-prednisolone-dose",
    title: "Prednisolone Dose Calculator for Cats",
    category: "pets",
    subcategory: "cats-medication-dosing",
    description: "Calculate the correct dosage for the anti-inflammatory steroid **Prednisolone** in cats.",
    loader: () => import("@/components/calculators/Pets/CatPrednisoloneDoseCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-omega-3-epa-dha-supplement",
    title: "Omega-3 (EPA/DHA) Supplement Calculator for Cats",
    category: "pets",
    subcategory: "cats-medication-dosing",
    description: "Determine the correct daily supplement dosage of **Omega-3 fatty acids (EPA/DHA)** for joint and skin health in cats.",
    loader: () => import("@/components/calculators/Pets/CatOmega3EpaDhaSupplementCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-insulin-starter-reference",
    title: "Insulin Starter Reference (info-only)",
    category: "pets",
    subcategory: "cats-medication-dosing",
    description: "Reference guide for starting and monitoring insulin therapy in diabetic cats (information-only, not a dose calculator).",
    loader: () => import("@/components/calculators/Pets/CatInsulinStarterReferenceCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "kitten-adult-weight-predictor",
    title: "Kitten Adult Weight Predictor",
    category: "pets",
    subcategory: "cats-growth-size-measures",
    description: "Predict your kitten's final adult weight and size based on current age, weight, and growth metrics.",
    loader: () => import("@/components/calculators/Pets/KittenAdultWeightPredictorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-body-condition-score-bcs-target",
    title: "Cat Body Condition Score Helper (BCS → Target Plan)",
    category: "pets",
    subcategory: "cats-growth-size-measures",
    description: "Use the **Body Condition Score (BCS)** system to assess your cat's fat level and formulate a target weight plan.",
    loader: () => import("@/components/calculators/Pets/CatBodyConditionScoreBcsTargetCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-bmi-body-index-educational",
    title: "Cat BMI/Body Index (educational)",
    category: "pets",
    subcategory: "cats-growth-size-measures",
    description: "Educational tool to understand the concept of a feline body mass index for health tracking.",
    loader: () => import("@/components/calculators/Pets/CatBmiBodyIndexEducationalCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-carrier-size-fit-guide",
    title: "Cat Carrier Size & Fit Guide",
    category: "pets",
    subcategory: "cats-growth-size-measures",
    description: "Guide to select the proper carrier size for your cat, ensuring comfort and safety during travel.",
    loader: () => import("@/components/calculators/Pets/CatCarrierSizeFitGuideCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-harness-size-fit-guide",
    title: "Cat Harness Size & Fit Guide",
    category: "pets",
    subcategory: "cats-growth-size-measures",
    description: "Guide to measure and select the correct harness size and fit for walking or outdoor time.",
    loader: () => import("@/components/calculators/Pets/CatHarnessSizeFitGuideCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-activity-calorie-adjuster",
    title: "Indoor/Outdoor Activity Calorie Adjuster",
    category: "pets",
    subcategory: "cats-activity-lifestyle",
    description: "Adjust daily calorie targets based on whether your cat is strictly indoor or has outdoor access.",
    loader: () => import("@/components/calculators/Pets/CatActivityCalorieAdjusterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-play-session-planner",
    title: "Play Session Planner (Feather/Chase Time Targets)",
    category: "pets",
    subcategory: "cats-activity-lifestyle",
    description: "Plan optimal daily playtime sessions (duration and intensity) to meet your cat's exercise and enrichment needs.",
    loader: () => import("@/components/calculators/Pets/CatPlaySessionPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-resting-active-hours-balance-tracker",
    title: "Resting vs. Active Hours Balance Tracker (owner input)",
    category: "pets",
    subcategory: "cats-activity-lifestyle",
    description: "Tool for owners to track and assess the balance between their cat's resting and active hours.",
    loader: () => import("@/components/calculators/Pets/CatRestingActiveHoursBalanceTrackerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-age-human-years-breed-size-aware",
    title: "Cat Age in Human Years (Breed/Size Aware)",
    category: "pets",
    subcategory: "cats-age-longevity",
    description: "Convert your cat's age to human years using a method that accounts for life stage and size.",
    loader: () => import("@/components/calculators/Pets/CatAgeHumanYearsBreedSizeAwareCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "senior-cat-care-readiness-checklist",
    title: "Senior Cat Care Readiness Checklist (scored helper)",
    category: "pets",
    subcategory: "cats-age-longevity",
    description: "Scored checklist to evaluate readiness for senior cat care, covering diet, environment, and health monitoring.",
    loader: () => import("@/components/calculators/Pets/SeniorCatCareReadinessChecklistCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-life-expectancy-estimator",
    title: "Life Expectancy Estimator (lifestyle factors; educational)",
    category: "pets",
    subcategory: "cats-age-longevity",
    description: "Educational tool to estimate a cat's life expectancy based on diet, activity, and preventative care.",
    loader: () => import("@/components/calculators/Pets/CatLifeExpectancyEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-litter-box-output-tracker",
    title: "Litter Box Output Tracker (Normal vs. Increased)",
    category: "pets",
    subcategory: "cats-urinary-kidney",
    description: "Tool to track and compare normal litter box output against potentially worrying increases or decreases in volume.",
    loader: () => import("@/components/calculators/Pets/CatLitterBoxOutputTrackerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-fluid-intake-urine-output-balance",
    title: "Fluid Intake vs. Urine Output Balance Checker",
    category: "pets",
    subcategory: "cats-urinary-kidney",
    description: "Check the balance between liquid consumed and liquid expelled, key for monitoring kidney function.",
    loader: () => import("@/components/calculators/Pets/CatFluidIntakeUrineOutputBalanceCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-phosphorus-per-meal-estimator",
    title: "Phosphorus per Meal Estimator (diet label helper)",
    category: "pets",
    subcategory: "cats-urinary-kidney",
    description: "Calculate the phosphorus content per meal from food labels, essential for cats with kidney disease.",
    loader: () => import("@/components/calculators/Pets/CatPhosphorusPerMealEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-pregnancy-gestation-due-date",
    title: "Cat Pregnancy (Gestation) Due-Date Calculator",
    category: "pets",
    subcategory: "cats-reproduction",
    description: "Calculate the expected **due date** for a pregnant cat (queen) based on the date of breeding.",
    loader: () => import("@/components/calculators/Pets/CatPregnancyGestationDueDateCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "kitten-weaning-timeline-feeding-amounts",
    title: "Kitten Weaning Timeline & Feeding Amounts",
    category: "pets",
    subcategory: "cats-reproduction",
    description: "Planner for the transition from mother's milk to solid food, calculating appropriate feeding amounts at each stage.",
    loader: () => import("@/components/calculators/Pets/KittenWeaningTimelineFeedingAmountsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-shedding-combing-time-planner",
    title: "Shedding & Combing Time Planner",
    category: "pets",
    subcategory: "cats-grooming-care",
    description: "Plan an optimal combing schedule to manage shedding based on coat type and season.",
    loader: () => import("@/components/calculators/Pets/CatSheddingCombingTimePlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-nail-trim-interval-planner",
    title: "Nail Trim Interval Planner (activity/surface based)",
    category: "pets",
    subcategory: "cats-grooming-care",
    description: "Determine the best frequency for nail trims based on the cat's activity level and available scratching surfaces.",
    loader: () => import("@/components/calculators/Pets/CatNailTrimIntervalPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "multi-cat-litter-box-count-calculator",
    title: "Multi-Cat Litter Box Count Calculator",
    category: "pets",
    subcategory: "cats-behavior-environment",
    description: "Calculate the correct number of litter boxes needed for a multi-cat household to minimize stress and accidents.",
    loader: () => import("@/components/calculators/Pets/MultiCatLitterBoxCountCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-environmental-enrichment-planner",
    title: "Environmental Enrichment Planner (per room)",
    category: "pets",
    subcategory: "cats-behavior-environment",
    description: "Plan specific enrichment items (scratch posts, perches, toys) for each room to improve feline well-being.",
    loader: () => import("@/components/calculators/Pets/CatEnvironmentalEnrichmentPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-stress-score-playtime-offset-planner",
    title: "Stress Score & Playtime Offset Planner (owner input)",
    category: "pets",
    subcategory: "cats-behavior-environment",
    description: "Tool to help owners assess their cat's stress levels and plan appropriate corrective playtime or environment changes.",
    loader: () => import("@/components/calculators/Pets/CatStressScorePlaytimeOffsetPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-calorie-energy-requirement-de-tdn",
    title: "Horse Calorie & Energy Requirement Calculator (DE / TDN)",
    category: "pets",
    subcategory: "horses-nutrition-weight",
    description: "Calculate a horse's daily **Digestible Energy (DE)** and **Total Digestible Nutrients (TDN)** requirements.",
    loader: () => import("@/components/calculators/Pets/HorseCalorieEnergyRequirementDeTdnCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-weight-estimator-girth-length",
    title: "Horse Weight Estimator (Heart Girth & Length)",
    category: "pets",
    subcategory: "horses-nutrition-weight",
    description: "Estimate your horse's body weight accurately using heart girth circumference and body length measurements.",
    loader: () => import("@/components/calculators/Pets/HorseWeightEstimatorGirthLengthCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bird-daily-calorie-needs-body-weight",
    title: "Daily Calorie Needs by Body Weight",
    category: "pets",
    subcategory: "birds-nutrition-weight",
    description: "Calculate the daily calorie and energy requirements for different species of birds based on body weight.",
    loader: () => import("@/components/calculators/Pets/BirdDailyCalorieNeedsBodyWeightCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bird-seed-to-pellet-conversion-planner",
    title: "Seed-to-Pellet Conversion Planner",
    category: "pets",
    subcategory: "birds-nutrition-weight",
    description: "Plan a gradual conversion schedule from a seed-based diet to a healthier, complete pellet diet.",
    loader: () => import("@/components/calculators/Pets/BirdSeedToPelletConversionPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "reptile-uvb-lighting-distance-duration",
    title: "UVB Lighting Distance & Duration Calculator",
    category: "pets",
    subcategory: "reptiles-nutrition-environment",
    description: "Calculate the correct distance and duration for **UVB lighting** to ensure proper Vitamin D3 synthesis.",
    loader: () => import("@/components/calculators/Pets/ReptileUvbLightingDistanceDurationCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "reptile-basking-temperature-gradient-planner",
    title: "Basking Temperature & Gradient Planner",
    category: "pets",
    subcategory: "reptiles-nutrition-environment",
    description: "Plan the ideal basking spot temperature and the necessary temperature gradient for a reptile enclosure.",
    loader: () => import("@/components/calculators/Pets/ReptileBaskingTemperatureGradientPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-feeding-rate-forage-concentrate",
    title: "Horse Feeding Rate Calculator (Forage + Concentrate)",
    category: "pets",
    subcategory: "horses-nutrition-weight",
    description: "Calculate the required daily feeding rate for both forage (hay/grass) and concentrated feeds.",
    loader: () => import("@/components/calculators/Pets/HorseFeedingRateForageConcentrateCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-hay-intake-bodyweight-percent",
    title: "Horse Hay Intake Calculator (per body weight %)",
    category: "pets",
    subcategory: "horses-nutrition-weight",
    description: "Determine the recommended minimum and maximum hay intake as a percentage of the horse's body weight.",
    loader: () => import("@/components/calculators/Pets/HorseHayIntakeBodyweightPercentCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-protein-lysine-requirement",
    title: "Horse Protein & Lysine Requirement Calculator",
    category: "pets",
    subcategory: "horses-nutrition-weight",
    description: "Calculate the daily requirements for crude protein and the essential amino acid **Lysine** for horses.",
    loader: () => import("@/components/calculators/Pets/HorseProteinLysineRequirementCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-electrolyte-need-estimator",
    title: "Horse Electrolyte Need Estimator (Exercise & Heat)",
    category: "pets",
    subcategory: "horses-nutrition-weight",
    description: "Estimate necessary electrolyte supplementation based on ambient heat and intensity of exercise/sweating.",
    loader: () => import("@/components/calculators/Pets/HorseElectrolyteNeedEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-body-condition-score-henneke",
    title: "Horse Body Condition Score Helper (Henneke 1–9)",
    category: "pets",
    subcategory: "horses-nutrition-weight",
    description: "Use the **Henneke 1-9 scale** to assess a horse's fat reserves and plan nutritional adjustments.",
    loader: () => import("@/components/calculators/Pets/HorseBodyConditionScoreHennekeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-water-intake-temperature-weight",
    title: "Horse Water Intake by Temperature & Weight",
    category: "pets",
    subcategory: "horses-hydration",
    description: "Estimate the minimum daily water intake required for a horse based on its weight and ambient air temperature.",
    loader: () => import("@/components/calculators/Pets/HorseWaterIntakeTemperatureWeightCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-dehydration-risk-estimator",
    title: "Dehydration Risk Estimator (Skin Turgor + Mucous Check)",
    category: "pets",
    subcategory: "horses-hydration",
    description: "Assess dehydration risk using the skin pinch (turgor) test and capillary refill time (mucous checks).",
    loader: () => import("@/components/calculators/Pets/HorseDehydrationRiskEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-colic-risk-assessment",
    title: "Horse Colic Risk Assessment (Feeding & Management)",
    category: "pets",
    subcategory: "horses-health-toxicology",
    description: "Assess the risk of colic (abdominal pain) based on feeding practices, management, and health history.",
    loader: () => import("@/components/calculators/Pets/HorseColicRiskAssessmentCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-laminitis-risk-index",
    title: "Laminitis Risk Index (BCS + NSC intake)",
    category: "pets",
    subcategory: "horses-health-toxicology",
    description: "Calculate the risk of **Laminitis (Founder)** based on Body Condition Score and non-structural carbohydrate (NSC) intake.",
    loader: () => import("@/components/calculators/Pets/HorseLaminitisRiskIndexCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-toxic-plant-exposure-risk",
    title: "Horse Toxic Plant Exposure Risk (Ragwort, Yew, etc.)",
    category: "pets",
    subcategory: "horses-health-toxicology",
    description: "Tool to evaluate the poisoning risk from common toxic pasture plants like **Ragwort** or **Yew**.",
    loader: () => import("@/components/calculators/Pets/HorseToxicPlantExposureRiskCalculator"),
    urlStyle: "flat"
  },
    
    {
    slug: "horse-nsaid-overdose-risk",
    title: "Horse NSAID Overdose Risk (Phenylbutazone)",
    category: "pets",
    subcategory: "horses-health-toxicology",
    description: "Assess the overdose and toxicity risk associated with common horse anti-inflammatories like **Phenylbutazone (Bute)**.",
    loader: () => import("@/components/calculators/Pets/HorseNsaidOverdoseRiskCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-selenium-toxicity-threshold",
    title: "Horse Selenium Toxicity Threshold (ppm)",
    category: "pets",
    subcategory: "horses-health-toxicology",
    description: "Calculate the safe upper limit and potential toxicity risk of **Selenium** intake in parts per million (ppm).",
    loader: () => import("@/components/calculators/Pets/HorseSeleniumToxicityThresholdCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-salt-mineral-balance-checker",
    title: "Horse Salt & Mineral Balance Checker",
    category: "pets",
    subcategory: "horses-health-toxicology",
    description: "Check the daily intake of salt and essential macro/micro-minerals against required nutritional levels.",
    loader: () => import("@/components/calculators/Pets/HorseSaltMineralBalanceCheckerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-dewormer-dose-calculator",
    title: "Dewormer Dose Calculator (by Drug Class & Weight)",
    category: "pets",
    subcategory: "horses-medication-supplement",
    description: "Calculate the correct dosage for various types of dewormers (anthelmintics) based on drug class and horse weight.",
    loader: () => import("@/components/calculators/Pets/HorseDewormerDoseCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-phenylbutazone-flunixin-dose",
    title: "Phenylbutazone / Flunixin Dose Calculator",
    category: "pets",
    subcategory: "horses-medication-supplement",
    description: "Calculate the safe dose for the NSAIDs **Phenylbutazone** and **Flunixin** for pain and fever management.",
    loader: () => import("@/components/calculators/Pets/HorsePhenylbutazoneFlunixinDoseCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-electrolyte-powder-mixing",
    title: "Electrolyte Powder Mixing Calculator",
    category: "pets",
    subcategory: "horses-medication-supplement",
    description: "Determine the correct ratio for mixing electrolyte powders into water or feed for performance horses.",
    loader: () => import("@/components/calculators/Pets/HorseElectrolytePowderMixingCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-omega-3-supplement-planner",
    title: "Omega-3 Supplement Planner (EPA/DHA per kg)",
    category: "pets",
    subcategory: "horses-medication-supplement",
    description: "Determine the required supplement dosage of Omega-3 fatty acids based on the horse's weight (kg).",
    loader: () => import("@/components/calculators/Pets/HorseOmega3SupplementPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-gestation-due-date",
    title: "Horse Gestation (Due Date) Calculator",
    category: "pets",
    subcategory: "horses-reproduction",
    description: "Calculate the expected **foaling (birth) date** for a pregnant mare.",
    loader: () => import("@/components/calculators/Pets/HorseGestationDueDateCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "horse-foaling-countdown-lactation-feed-planner",
    title: "Foaling Countdown & Lactation Feed Planner",
    category: "pets",
    subcategory: "horses-reproduction",
    description: "Track the final days before foaling and plan the increased feed/calorie requirements during the lactation period.",
    loader: () => import("@/components/calculators/Pets/HorseFoalingCountdownLactationFeedPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bird-hand-feeding-formula-amount-chicks",
    title: "Hand-Feeding Formula Amount (Chicks)",
    category: "pets",
    subcategory: "birds-nutrition-weight",
    description: "Calculate the correct volume and frequency for hand-feeding formula for baby chicks and fledglings.",
    loader: () => import("@/components/calculators/Pets/BirdHandFeedingFormulaAmountChicksCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bird-vitamin-a-requirement",
    title: "Vitamin A Requirement Calculator",
    category: "pets",
    subcategory: "birds-nutrition-weight",
    description: "Calculate the required daily intake of Vitamin A, deficiency of which is common in seed-fed birds.",
    loader: () => import("@/components/calculators/Pets/BirdVitaminARequirementCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bird-calcium-supplement-dosage-breeding-females",
    title: "Calcium Supplement Dosage (Breeding Females)",
    category: "pets",
    subcategory: "birds-nutrition-weight",
    description: "Determine the appropriate calcium supplement dose for egg-laying and breeding female birds.",
    loader: () => import("@/components/calculators/Pets/BirdCalciumSupplementDosageBreedingFemalesCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bird-weight-trend-tracker-weekly",
    title: "Weight Trend Tracker (Weekly Log)",
    category: "pets",
    subcategory: "birds-nutrition-weight",
    description: "Tool to log and track a bird's weight weekly to catch subtle signs of illness or nutritional imbalance.",
    loader: () => import("@/components/calculators/Pets/BirdWeightTrendTrackerWeeklyCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bird-toxic-foods-exposure-checker",
    title: "Toxic Foods Exposure Checker (Avocado, Chocolate, etc.)",
    category: "pets",
    subcategory: "birds-health-toxicology",
    description: "Check the toxicity of common human foods like **Avocado, Chocolate, and fruit seeds** for pet birds.",
    loader: () => import("@/components/calculators/Pets/BirdToxicFoodsExposureCheckerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bird-heavy-metal-exposure-risk",
    title: "Heavy Metal (Lead/Zinc) Exposure Risk",
    category: "pets",
    subcategory: "birds-health-toxicology",
    description: "Assess the risk of poisoning from exposure to heavy metals like **lead or zinc** (e.g., from cages or toys).",
    loader: () => import("@/components/calculators/Pets/BirdHeavyMetalExposureRiskCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bird-feather-plucking-stress-risk-index",
    title: "Feather Plucking & Stress Risk Index",
    category: "pets",
    subcategory: "birds-health-toxicology",
    description: "Index to assess the environmental and behavioral stress factors that may lead to feather plucking behavior.",
    loader: () => import("@/components/calculators/Pets/BirdFeatherPluckingStressRiskIndexCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bird-egg-binding-risk-estimator",
    title: "Egg Binding Risk Estimator",
    category: "pets",
    subcategory: "birds-health-toxicology",
    description: "Estimate the risk of a female bird suffering from **egg binding** based on nutrition and reproductive history.",
    loader: () => import("@/components/calculators/Pets/BirdEggBindingRiskEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bird-ambient-temperature-safe-zone",
    title: "Ambient Temperature Safe Zone Calculator",
    category: "pets",
    subcategory: "birds-health-toxicology",
    description: "Determine the ideal ambient temperature range for the bird's enclosure to prevent heat stress or chill.",
    loader: () => import("@/components/calculators/Pets/BirdAmbientTemperatureSafeZoneCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bird-daily-water-requirement-per-weight",
    title: "Daily Water Requirement per Weight",
    category: "pets",
    subcategory: "birds-hydration",
    description: "Calculate the minimum daily water volume needed for a bird based on its weight.",
    loader: () => import("@/components/calculators/Pets/BirdDailyWaterRequirementPerWeightCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bird-dehydration-signs-estimator",
    title: "Dehydration Signs Estimator",
    category: "pets",
    subcategory: "birds-hydration",
    description: "Tool to help owners identify early signs of dehydration in birds, which can be subtle.",
    loader: () => import("@/components/calculators/Pets/BirdDehydrationSignsEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bird-antibiotic-dose-reference",
    title: "Antibiotic Dose Reference (mg/kg)",
    category: "pets",
    subcategory: "birds-medication",
    description: "Reference guide for common antibiotic dosages in birds by body weight (mg/kg).",
    loader: () => import("@/components/calculators/Pets/BirdAntibioticDoseReferenceCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bird-omega-3-supplement-dose-parrots",
    title: "Omega-3 Supplement Dose (for parrots)",
    category: "pets",
    subcategory: "birds-medication",
    description: "Determine the correct daily supplement dosage of Omega-3s for parrots and other large pet birds.",
    loader: () => import("@/components/calculators/Pets/BirdOmega3SupplementDoseParrotsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bird-electrolyte-vitamin-c-water-mix",
    title: "Electrolyte & Vitamin C Water Mix Calculator",
    category: "pets",
    subcategory: "birds-medication",
    description: "Calculate the safe concentration for mixing electrolytes and Vitamin C into a bird's drinking water.",
    loader: () => import("@/components/calculators/Pets/BirdElectrolyteVitaminCWaterMixCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "reptile-daily-feeding-ratio-species-age",
    title: "Daily Feeding Ratio (by Species & Age)",
    category: "pets",
    subcategory: "reptiles-nutrition-environment",
    description: "Determine the optimal feeding frequency and ratio of prey/vegetables based on the reptile's species and age.",
    loader: () => import("@/components/calculators/Pets/ReptileDailyFeedingRatioSpeciesAgeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "reptile-calcium-to-phosphorus-ratio",
    title: "Calcium-to-Phosphorus Ratio Calculator",
    category: "pets",
    subcategory: "reptiles-nutrition-environment",
    description: "Calculate the vital **Calcium-to-Phosphorus ratio** of a reptile's diet, which should be maintained above 1:1.",
    loader: () => import("@/components/calculators/Pets/ReptileCalciumToPhosphorusRatioCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "reptile-vitamin-d3-requirement",
    title: "Vitamin D3 Requirement (Supplemental)",
    category: "pets",
    subcategory: "reptiles-nutrition-environment",
    description: "Determine the supplemental D3 dosage needed if UVB lighting is inadequate or unavailable.",
    loader: () => import("@/components/calculators/Pets/ReptileVitaminD3RequirementCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "reptile-feeder-insect-gut-loading-ratio",
    title: "Feeder Insect Gut-Loading Ratio",
    category: "pets",
    subcategory: "reptiles-nutrition-environment",
    description: "Calculate the necessary gut-loading time and nutritional ratio for feeder insects before feeding them to reptiles.",
    loader: () => import("@/components/calculators/Pets/ReptileFeederInsectGutLoadingRatioCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "reptile-dehydration-shedding-risk-index",
    title: "Dehydration & Shedding Risk Index",
    category: "pets",
    subcategory: "reptiles-health",
    description: "Assess the risk of dehydration-related issues, such as poor or stuck shedding.",
    loader: () => import("@/components/calculators/Pets/ReptileDehydrationSheddingRiskIndexCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "reptile-metabolic-bone-disease-risk",
    title: "Metabolic Bone Disease Risk Estimator",
    category: "pets",
    subcategory: "reptiles-health",
    description: "Estimate the risk of **Metabolic Bone Disease (MBD)** based on calcium/D3/UVB light availability.",
    loader: () => import("@/components/calculators/Pets/ReptileMetabolicBoneDiseaseRiskCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "reptile-ideal-humidity-range",
    title: "Ideal Humidity Range Calculator",
    category: "pets",
    subcategory: "reptiles-health",
    description: "Calculate and maintain the correct humidity percentage for a specific reptile species to ensure respiratory health.",
    loader: () => import("@/components/calculators/Pets/ReptileIdealHumidityRangeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "reptile-growth-curve-python-bearded-dragon-gecko",
    title: "Growth Curve by Species (Python, Bearded Dragon, Gecko)",
    category: "pets",
    subcategory: "reptiles-health",
    description: "Track and compare the reptile's growth against standard growth curves for species like Pythons, Bearded Dragons, and Geckos.",
    loader: () => import("@/components/calculators/Pets/ReptileGrowthCurvePythonBeardedDragonGeckoCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "reptile-thermal-gradient-maintenance-power",
    title: "Thermal Gradient Maintenance Power Estimator",
    category: "pets",
    subcategory: "reptiles-health",
    description: "Estimate the wattage (power) needed for heat lamps and heat mats to maintain the required thermal gradient.",
    loader: () => import("@/components/calculators/Pets/ReptileThermalGradientMaintenancePowerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "reptile-dewormer-antibiotic-dose-reference",
    title: "Dewormer & Antibiotic Dose Reference",
    category: "pets",
    subcategory: "reptiles-medication",
    description: "Reference guide for common dewormer and antibiotic dosages in reptiles by body weight.",
    loader: () => import("@/components/calculators/Pets/ReptileDewormerAntibioticDoseReferenceCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "reptile-calcium-d3-supplement",
    title: "Calcium + D3 Supplement Calculator",
    category: "pets",
    subcategory: "reptiles-medication",
    description: "Calculate the required dusting frequency and amount of Calcium and D3 supplement powder for feeders.",
    loader: () => import("@/components/calculators/Pets/ReptileCalciumD3SupplementCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "reptile-fluid-replacement-volume",
    title: "Fluid Replacement Volume Calculator",
    category: "pets",
    subcategory: "reptiles-medication",
    description: "Calculate the necessary volume of subcutaneous fluids for a dehydrated reptile based on its weight and severity.",
    loader: () => import("@/components/calculators/Pets/ReptileFluidReplacementVolumeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "aquarium-volume-rectangular-cylindrical-bowfront",
    title: "Aquarium Volume Calculator (Rectangular / Cylindrical / Bowfront)",
    category: "pets",
    subcategory: "fish-aquatic-volume-stocking",
    description: "Calculate the accurate volume (in Liters or Gallons) of rectangular, cylindrical, or bowfront aquariums.",
    loader: () => import("@/components/calculators/Pets/AquariumVolumeRectangularCylindricalBowfrontCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "aquarium-safe-stocking-density-fish-per-litre",
    title: "Safe Stocking Density (Fish/cm per Litre)",
    category: "pets",
    subcategory: "fish-aquatic-volume-stocking",
    description: "Determine the safe number or length of fish that can be kept in a tank, preventing overstocking and stress.",
    loader: () => import("@/components/calculators/Pets/AquariumSafeStockingDensityFishPerLitreCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "aquarium-filter-flow-rate",
    title: "Filter Flow Rate Calculator",
    category: "pets",
    subcategory: "fish-aquatic-volume-stocking",
    description: "Calculate the minimum required filter flow rate (LPH/GPH) to turn over the tank volume adequately.",
    loader: () => import("@/components/calculators/Pets/AquariumFilterFlowRateCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "aquarium-water-change-volume-planner",
    title: "Water Change Volume Planner",
    category: "pets",
    subcategory: "fish-aquatic-volume-stocking",
    description: "Plan the exact volume of water to be changed to achieve a target percentage reduction in nitrates or other parameters.",
    loader: () => import("@/components/calculators/Pets/AquariumWaterChangeVolumePlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "aquarium-heater-wattage-requirement",
    title: "Heater Wattage Requirement",
    category: "pets",
    subcategory: "fish-aquatic-volume-stocking",
    description: "Determine the correct wattage heater needed to maintain the desired water temperature based on tank volume and room temperature.",
    loader: () => import("@/components/calculators/Pets/AquariumHeaterWattageRequirementCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "aquarium-co2-injection-rate-planted-tank",
    title: "CO₂ Injection Rate Calculator (Planted Tank)",
    category: "pets",
    subcategory: "fish-aquatic-volume-stocking",
    description: "Calculate the target CO₂ bubble rate (BPS) and estimate the resulting CO₂ concentration (ppm) for planted aquariums.",
    loader: () => import("@/components/calculators/Pets/AquariumCo2InjectionRatePlantedTankCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "aquarium-ph-adjustment-buffer",
    title: "pH Adjustment (Acid/Base Buffer) Calculator",
    category: "pets",
    subcategory: "fish-aquatic-water-chemistry-nutrition",
    description: "Calculate the required amount of acid or base (buffer) needed to safely adjust the aquarium water's pH level.",
    loader: () => import("@/components/calculators/Pets/AquariumPhAdjustmentBufferCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "aquarium-ammonia-nitrite-cycle-time",
    title: "Ammonia-to-Nitrite Cycle Time Estimator",
    category: "pets",
    subcategory: "fish-aquatic-water-chemistry-nutrition",
    description: "Estimate the time needed for a new aquarium to complete its nitrogen cycle (converting ammonia to nitrite to nitrate).",
    loader: () => import("@/components/calculators/Pets/AquariumAmmoniaNitriteCycleTimeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "aquarium-salt-dosage-therapeutic",
    title: "Aquarium Salt Dosage Calculator (Therapeutic)",
    category: "pets",
    subcategory: "fish-aquatic-water-chemistry-nutrition",
    description: "Calculate the correct, safe dosage of aquarium salt for therapeutic treatment of fish diseases (e.g., Ich).",
    loader: () => import("@/components/calculators/Pets/AquariumSaltDosageTherapeuticCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "aquarium-nitrate-reduction-goal-planner",
    title: "Nitrate Reduction Goal Planner (ppm → water change %)",
    category: "pets",
    subcategory: "fish-aquatic-water-chemistry-nutrition",
    description: "Determine the necessary water change percentage to reduce nitrate levels from the current reading to a safe target level (ppm).",
    loader: () => import("@/components/calculators/Pets/AquariumNitrateReductionGoalPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "fish-food-feeding-rate",
    title: "Fish Food Feeding Rate Calculator",
    category: "pets",
    subcategory: "fish-aquatic-water-chemistry-nutrition",
    description: "Calculate the optimal daily feeding amount based on the total biomass of fish in the tank.",
    loader: () => import("@/components/calculators/Pets/FishFoodFeedingRateCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "oxygen-solubility-vs-temperature-table",
    title: "Oxygen Solubility vs. Temperature Table",
    category: "pets",
    subcategory: "fish-aquatic-water-chemistry-nutrition",
    description: "Reference table showing how the maximum solubility of dissolved oxygen changes with water temperature.",
    loader: () => import("@/components/calculators/Pets/OxygenSolubilityVsTemperatureTableCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "pond-volume-liner-size",
    title: "Pond Volume & Liner Size Calculator",
    category: "pets",
    subcategory: "fish-aquatic-pond-breeding",
    description: "Calculate the volume of water in a pond and the minimum required liner size based on length, width, and depth.",
    loader: () => import("@/components/calculators/Pets/PondVolumeLinerSizeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "koi-feed-planner-temp-weight",
    title: "Koi Feed Planner (Temp + Weight)",
    category: "pets",
    subcategory: "fish-aquatic-pond-breeding",
    description: "Plan the optimal feeding rate for Koi fish based on their body weight and the current water temperature.",
    loader: () => import("@/components/calculators/Pets/KoiFeedPlannerTempWeightCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "breeding-tank-volume-planner",
    title: "Breeding Tank Volume Planner",
    category: "pets",
    subcategory: "fish-aquatic-pond-breeding",
    description: "Calculate the ideal volume and dimensions for a dedicated fish breeding or fry grow-out tank.",
    loader: () => import("@/components/calculators/Pets/BreedingTankVolumePlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "small-mammal-daily-calorie-needs",
    title: "Daily Calorie Needs (Species Specific)",
    category: "pets",
    subcategory: "small-mammals-nutrition-weight",
    description: "Calculate the specific daily calorie and energy requirements for species like rabbits, guinea pigs, and hamsters.",
    loader: () => import("@/components/calculators/Pets/SmallMammalDailyCalorieNeedsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "small-mammal-weight-maintenance-gain-loss-planner",
    title: "Weight Maintenance vs. Gain/Loss Planner",
    category: "pets",
    subcategory: "small-mammals-nutrition-weight",
    description: "Plan calorie targets for weight maintenance, controlled weight gain, or safe weight loss for small mammals.",
    loader: () => import("@/components/calculators/Pets/SmallMammalWeightMaintenanceGainLossPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "small-mammal-hay-pellet-intake",
    title: "Hay & Pellet Intake Calculator",
    category: "pets",
    subcategory: "small-mammals-nutrition-weight",
    description: "Calculate the ideal daily ratio and total amount of hay vs. pellets for herbivores like rabbits and guinea pigs.",
    loader: () => import("@/components/calculators/Pets/SmallMammalHayPelletIntakeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "small-mammal-fiber-protein-ratio",
    title: "Fiber & Protein Ratio Calculator",
    category: "pets",
    subcategory: "small-mammals-nutrition-weight",
    description: "Determine the appropriate ratio of fiber and protein in the diet, crucial for gut health in species like rabbits.",
    loader: () => import("@/components/calculators/Pets/SmallMammalFiberProteinRatioCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "guinea-pig-vitamin-c-requirement",
    title: "Vitamin C Requirement (Guinea Pig)",
    category: "pets",
    subcategory: "small-mammals-nutrition-weight",
    description: "Calculate the daily supplemental Vitamin C requirement, which guinea pigs cannot synthesize themselves.",
    loader: () => import("@/components/calculators/Pets/GuineaPigVitaminCRequirementCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "small-mammal-calcium-intake-limit",
    title: "Calcium Intake Limit (Bladder Stone Prevention)",
    category: "pets",
    subcategory: "small-mammals-nutrition-weight",
    description: "Determine the safe daily limit for calcium intake to reduce the risk of bladder stones in susceptible species.",
    loader: () => import("@/components/calculators/Pets/SmallMammalCalciumIntakeLimitCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "rabbit-treat-calories-safe-portion",
    title: "Rabbit Treat Calories & Safe Portion",
    category: "pets",
    subcategory: "small-mammals-nutrition-weight",
    description: "Calculate the calorie content of treats and the safe maximum portion size for rabbits.",
    loader: () => import("@/components/calculators/Pets/RabbitTreatCaloriesSafePortionCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ferret-protein-fat-ratio-checker",
    title: "Ferret Protein/Fat Ratio Checker",
    category: "pets",
    subcategory: "small-mammals-nutrition-weight",
    description: "Check the diet to ensure it meets the high protein and fat requirements for obligate carnivores like ferrets.",
    loader: () => import("@/components/calculators/Pets/FerretProteinFatRatioCheckerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "rabbit-temperature-stress-risk-heatstroke",
    title: "Temperature Stress Risk (Rabbit Heatstroke)",
    category: "pets",
    subcategory: "small-mammals-health-toxicology",
    description: "Assess the risk of heatstroke in rabbits based on ambient temperature and humidity.",
    loader: () => import("@/components/calculators/Pets/RabbitTemperatureStressRiskHeatstrokeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "small-mammal-dehydration-risk-checker",
    title: "Dehydration Risk Checker",
    category: "pets",
    subcategory: "small-mammals-health-toxicology",
    description: "Tool to check for subtle signs of dehydration in small mammals, which can quickly become critical.",
    loader: () => import("@/components/calculators/Pets/SmallMammalDehydrationRiskCheckerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "small-mammal-common-toxic-foods-reference",
    title: "Common Toxic Foods Reference",
    category: "pets",
    subcategory: "small-mammals-health-toxicology",
    description: "Reference guide for common toxic or dangerous foods for small pets (e.g., certain seeds, nuts, or sugary items).",
    loader: () => import("@/components/calculators/Pets/SmallMammalCommonToxicFoodsReferenceCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "small-mammal-safe-vegetables-fruits-portion",
    title: "Safe Vegetables & Fruits Portion Calculator",
    category: "pets",
    subcategory: "small-mammals-health-toxicology",
    description: "Calculate the maximum safe daily portion of various vegetables and fruits to prevent digestive upset.",
    loader: () => import("@/components/calculators/Pets/SmallMammalSafeVegetablesFruitsPortionCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "small-mammal-parasite-treatment-dose-reference",
    title: "Parasite Treatment Dose Reference",
    category: "pets",
    subcategory: "small-mammals-health-toxicology",
    description: "Reference guide for common anti-parasitic medication dosages (e.g., for mites, fleas, or intestinal parasites).",
    loader: () => import("@/components/calculators/Pets/SmallMammalParasiteTreatmentDoseReferenceCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "small-mammal-cage-size-requirement",
    title: "Cage Size Requirement Calculator",
    category: "pets",
    subcategory: "small-mammals-behavior-care",
    description: "Calculate the minimum cage or enclosure size required for specific small mammal species (e.g., minimum cubic feet).",
    loader: () => import("@/components/calculators/Pets/SmallMammalCageSizeRequirementCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "small-mammal-exercise-time-planner",
    title: "Exercise Time Planner (Run Time per Day)",
    category: "pets",
    subcategory: "small-mammals-behavior-care",
    description: "Plan the necessary amount of daily free-roam or wheel/run time to ensure adequate exercise and enrichment.",
    loader: () => import("@/components/calculators/Pets/SmallMammalExerciseTimePlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "small-mammal-bedding-replacement-frequency",
    title: "Bedding Replacement Frequency Estimator",
    category: "pets",
    subcategory: "small-mammals-behavior-care",
    description: "Estimate how often bedding needs to be fully replaced to maintain hygiene and prevent ammonia buildup.",
    loader: () => import("@/components/calculators/Pets/SmallMammalBeddingReplacementFrequencyCalculator"),
    urlStyle: "flat"
  },
    
    {
    slug: "length-m-ft-in",
    title: "Length: m ↔ ft ↔ in",
    category: "conversion",
    subcategory: "core-units",
    description: "Convert length units instantly. Quickly transform meters to feet, inches to centimeters, and handle both metric and imperial measurements with precision.",
    loader: () => import("@/components/calculators/Conversion/LengthMFtInCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "area-m2-ft2",
    title: "Area: m² ↔ ft²",
    category: "conversion",
    subcategory: "core-units",
    description: "Calculate area conversions for real estate and land. Convert square meters to square feet (m² to sq ft) and other area units accurately.",
    loader: () => import("@/components/calculators/Conversion/AreaM2Ft2Calculator"),
    urlStyle: "flat"
  },
    {
    slug: "volume-l-ml-gal-oz",
    title: "Volume: L ↔ mL ↔ gal ↔ oz",
    category: "conversion",
    subcategory: "core-units",
    description: "Convert liquid volume units easily. Switch between liters, milliliters, gallons, and fluid ounces for cooking, science, or industrial needs.",
    loader: () => import("@/components/calculators/Conversion/VolumeLMlGalOzCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "mass-kg-lb-oz",
    title: "Mass: kg ↔ lb ↔ oz",
    category: "conversion",
    subcategory: "core-units",
    description: "Convert weight and mass units. Instantly calculate kilograms to pounds (kg to lbs), ounces to grams, and more for fitness or shipping.",
    loader: () => import("@/components/calculators/Conversion/MassKgLbOzCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "temperature-c-f-k",
    title: "Temperature: °C ↔ °F ↔ K",
    category: "conversion",
    subcategory: "core-units",
    description: "Convert temperature readings. Switch between Celsius (°C), Fahrenheit (°F), and Kelvin (K) for weather, science, and cooking applications.",
    loader: () => import("@/components/calculators/Conversion/TemperatureCFKCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "density-g-per-ml-kg-per-m3",
    title: "Density: g/mL ↔ kg/m³",
    category: "conversion",
    subcategory: "core-units",
    description: "Calculate density conversions. Transform grams per milliliter to kilograms per cubic meter for chemistry and physics calculations.",
    loader: () => import("@/components/calculators/Conversion/DensityGPerMlKgPerM3Calculator"),
    urlStyle: "flat"
  },
    {
    slug: "angle-deg-rad",
    title: "Angle: deg ↔ rad",
    category: "conversion",
    subcategory: "core-units",
    description: "Convert angles between degrees and radians. Essential tool for trigonometry, geometry, and engineering calculations.",
    loader: () => import("@/components/calculators/Conversion/AngleDegRadCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "speed-mps-kmph-mph",
    title: "Speed: m/s ↔ km/h ↔ mph",
    category: "conversion",
    subcategory: "core-units",
    description: "Convert speed and velocity units. Calculate meters per second, kilometers per hour, and miles per hour (mph) for travel and physics.",
    loader: () => import("@/components/calculators/Conversion/SpeedMpsKmphMphCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "force-n-lbf",
    title: "Force: N ↔ lbf",
    category: "conversion",
    subcategory: "mechanics-pressure",
    description: "Convert force units accurately. Transform Newtons (N) to pound-force (lbf) for engineering and mechanical physics problems.",
    loader: () => import("@/components/calculators/Conversion/ForceNLbfCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "energy-j-cal-kwh",
    title: "Energy: J ↔ cal ↔ kWh",
    category: "conversion",
    subcategory: "mechanics-pressure",
    description: "Convert energy units. Switch between Joules (J), calories (cal), and kilowatt-hours (kWh) for nutrition and electrical calculations.",
    loader: () => import("@/components/calculators/Conversion/EnergyJCalKwhCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "power-w-hp",
    title: "Power: W ↔ hp",
    category: "conversion",
    subcategory: "mechanics-pressure",
    description: "Convert power units instantly. Calculate Watts (W) to mechanical or metric Horsepower (hp) for engines and motors.",
    loader: () => import("@/components/calculators/Conversion/PowerWHpCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "pressure-pa-bar-psi",
    title: "Pressure: Pa ↔ bar ↔ psi",
    category: "conversion",
    subcategory: "mechanics-pressure",
    description: "Convert pressure units for tires and hydraulics. Transform Pascals (Pa), Bar, and PSI (pounds per square inch) accurately.",
    loader: () => import("@/components/calculators/Conversion/PressurePaBarPsiCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "torque-nm-lbfft",
    title: "Torque: N·m ↔ lbf·ft",
    category: "conversion",
    subcategory: "mechanics-pressure",
    description: "Convert torque settings. Switch between Newton-meters (Nm) and pound-feet (lb-ft) for automotive and machinery mechanics.",
    loader: () => import("@/components/calculators/Conversion/TorqueNmLbfftCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "work-potential-energy",
    title: "Work & Potential Energy",
    category: "conversion",
    subcategory: "mechanics-pressure",
    description: "Calculate work and gravitational potential energy. Convert between related mechanical units to solve physics equations.",
    loader: () => import("@/components/calculators/Conversion/WorkPotentialEnergyCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "time-ms-s-min-hr",
    title: "Time: ms ↔ s ↔ min ↔ hr",
    category: "conversion",
    subcategory: "time-frequency",
    description: "Convert time durations easily. Transform milliseconds, seconds, minutes, and hours for scientific timing or project planning.",
    loader: () => import("@/components/calculators/Conversion/TimeMsSMinHrCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "frequency-hz-khz-mhz",
    title: "Frequency: Hz ↔ kHz ↔ MHz",
    category: "conversion",
    subcategory: "time-frequency",
    description: "Convert frequency units. Switch between Hertz (Hz), Kilohertz (kHz), and Megahertz (MHz) for audio and electronics.",
    loader: () => import("@/components/calculators/Conversion/FrequencyHzKhzMhzCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "period-frequency",
    title: "Period ↔ Frequency",
    category: "conversion",
    subcategory: "time-frequency",
    description: "Calculate the relationship between period and frequency. Convert time cycles (T) to frequency (f) and vice-versa instantly.",
    loader: () => import("@/components/calculators/Conversion/PeriodFrequencyCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "frame-rate-fps-hz",
    title: "Frame Rate: fps ↔ Hz",
    category: "conversion",
    subcategory: "time-frequency",
    description: "Convert video frame rates to refresh rates. Match FPS (Frames Per Second) with monitor Hz for smooth video playback.",
    loader: () => import("@/components/calculators/Conversion/FrameRateFpsHzCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "clock-time-timezone-shift",
    title: "Clock Time & Timezone Shift",
    category: "conversion",
    subcategory: "time-frequency",
    description: "Calculate time differences. Shift clock times across different time zones to plan meetings and travel effectively.",
    loader: () => import("@/components/calculators/Conversion/ClockTimeTimezoneShiftCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bytes-b-kb-mb-gb-tb",
    title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB",
    category: "conversion",
    subcategory: "computing-data",
    description: "Convert digital storage sizes. Transform Bytes to Kilobytes, Megabytes (MB), Gigabytes (GB), and Terabytes (TB) for data management.",
    loader: () => import("@/components/calculators/Conversion/BytesBKbMbGbTbCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bits-b-kb-mb-gb",
    title: "Bits: b ↔ kb ↔ Mb ↔ Gb",
    category: "conversion",
    subcategory: "computing-data",
    description: "Convert network data units. Switch between bits, kilobits, megabits (Mb), and gigabits (Gb) to understand network speeds.",
    loader: () => import("@/components/calculators/Conversion/BitsBKbMbGbCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "binary-decimal-prefixes",
    title: "Binary ↔ Decimal prefixes (KiB ↔ KB)",
    category: "conversion",
    subcategory: "computing-data",
    description: "Understand storage definitions. Convert between binary prefixes (KiB, MiB - IEC) and decimal prefixes (KB, MB - SI).",
    loader: () => import("@/components/calculators/Conversion/BinaryDecimalPrefixesCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "transfer-speed-mbps-mbs",
    title: "Transfer Speed: Mbps ↔ MB/s",
    category: "conversion",
    subcategory: "computing-data",
    description: "Convert internet speed to file transfer rate. See how fast a file will download by converting Mbps (Megabits) to MB/s (Megabytes).",
    loader: () => import("@/components/calculators/Conversion/TransferSpeedMbpsMbsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "compression-ratio-size",
    title: "Compression Ratio & Size",
    category: "conversion",
    subcategory: "computing-data",
    description: "Estimate file size reduction. Calculate the final file size based on original size and compression ratio.",
    loader: () => import("@/components/calculators/Conversion/CompressionRatioSizeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "checksum-hash-quick-tools",
    title: "Checksum & Hash Quick Tools",
    category: "conversion",
    subcategory: "computing-data",
    description: "Verify data integrity. Quickly generate or compare checksums and hash values for files to ensure they are not corrupted.",
    loader: () => import("@/components/calculators/Conversion/ChecksumHashQuickToolsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cooking-tsp-tbsp-cup-ml",
    title: "Cooking: tsp/tbsp/cup ↔ mL",
    category: "conversion",
    subcategory: "everyday-mixed",
    description: "Convert kitchen measurements. Transform teaspoons, tablespoons, and cups into milliliters (mL) for precise baking and cooking.",
    loader: () => import("@/components/calculators/Conversion/CookingTspTbspCupMlCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "fuel-economy-l-per-100km-mpg",
    title: "Fuel Economy: L/100km ↔ mpg",
    category: "conversion",
    subcategory: "everyday-mixed",
    description: "Convert fuel consumption ratings. Switch between Liters per 100km (L/100km) and Miles Per Gallon (MPG) for vehicle efficiency.",
    loader: () => import("@/components/calculators/Conversion/FuelEconomyLPer100kmMpgCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "currency-fx-quick-convert",
    title: "Currency: FX quick convert",
    category: "conversion",
    subcategory: "everyday-mixed",
    description: "Quick currency converter. Estimate values between major currencies for travel budgets and international shopping.",
    loader: () => import("@/components/calculators/Conversion/CurrencyFxQuickConvertCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bmi-bsa-quick-estimators",
    title: "BMI & BSA quick estimators",
    category: "conversion",
    subcategory: "everyday-mixed",
    description: "Quickly estimate Body Mass Index (BMI) and Body Surface Area (BSA) using standard conversion formulas for health checks.",
    loader: () => import("@/components/calculators/Conversion/BmiBsaQuickEstimatorsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "paper-size-a-series-us",
    title: "Paper Size: A-series ↔ US",
    category: "conversion",
    subcategory: "everyday-mixed",
    description: "Compare international paper sizes. Convert between ISO A-series (A4, A3) and US Letter/Legal sizes for printing.",
    loader: () => import("@/components/calculators/Conversion/PaperSizeASeriesUsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "shoe-size-eu-us-uk",
    title: "Shoe Size: EU ↔ US ↔ UK",
    category: "conversion",
    subcategory: "everyday-mixed",
    description: "Convert international shoe sizes. Find the right fit by converting between European (EU), American (US), and British (UK) sizing charts.",
    loader: () => import("@/components/calculators/Conversion/ShoeSizeEuUsUkCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cups-grams-ounces-by-ingredient",
    title: "Cups ↔ Grams ↔ Ounces Converter",
    category: "cooking",
    subcategory: "ingredient-conversions-kitchen-math",
    description: "Convert cooking ingredients from volume to weight. Switch between cups, grams, and ounces for flour, sugar, and more with density adjustments.",
    loader: () => import("@/components/calculators/Cooking/CupsGramsOuncesByIngredientCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "volume-weight-food-density",
    title: "Volume ↔ Weight Converter",
    category: "cooking",
    subcategory: "ingredient-conversions-kitchen-math",
    description: "Calculate food density conversions. Translate volume measurements to weight for precise cooking using common ingredient densities.",
    loader: () => import("@/components/calculators/Cooking/VolumeWeightFoodDensityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "fahrenheit-celsius-oven-internal-temp",
    title: "Fahrenheit ↔ Celsius Converter",
    category: "cooking",
    subcategory: "ingredient-conversions-kitchen-math",
    description: "Convert oven temperatures instantly. Switch between Fahrenheit and Celsius for baking recipes and internal meat thermometers.",
    loader: () => import("@/components/calculators/Cooking/FahrenheitCelsiusOvenInternalTempCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "teaspoon-tablespoon-cup-ml-converter",
    title: "Teaspoon/Tablespoon/Cup ↔ mL Converter",
    category: "cooking",
    subcategory: "ingredient-conversions-kitchen-math",
    description: "Convert small kitchen measurements. Transform teaspoons, tablespoons, and cups into milliliters (mL) for liquid ingredients.",
    loader: () => import("@/components/calculators/Cooking/TeaspoonTablespoonCupMlConverterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "recipe-scaler",
    title: "Recipe Scaler (x0.5, x2, x3…)",
    category: "cooking",
    subcategory: "ingredient-conversions-kitchen-math",
    description: "Scale your recipes up or down. Multiply or divide ingredient quantities to adjust serving sizes for parties or single meals.",
    loader: () => import("@/components/calculators/Cooking/RecipeScalerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "serving-size-multiplier",
    title: "Serving Size Multiplier",
    category: "cooking",
    subcategory: "ingredient-conversions-kitchen-math",
    description: "Adjust recipes by serving size. Input your desired number of servings to automatically recalculate all ingredient amounts.",
    loader: () => import("@/components/calculators/Cooking/ServingSizeMultiplierCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "salt-percent-brining",
    title: "Salt % for Brining Calculator",
    category: "cooking",
    subcategory: "ingredient-conversions-kitchen-math",
    description: "Calculate the perfect brine ratio. Determine the exact amount of salt needed for wet brining meats to ensure flavor and moisture.",
    loader: () => import("@/components/calculators/Cooking/SaltPercentBriningCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "alcohol-abv-dilution",
    title: "Alcohol by Volume (ABV) Dilution",
    category: "cooking",
    subcategory: "ingredient-conversions-kitchen-math",
    description: "Calculate alcohol dilution for cooking. Estimate the remaining Alcohol by Volume (ABV) in your dishes after simmering or baking.",
    loader: () => import("@/components/calculators/Cooking/AlcoholAbvDilutionCalculator"),
    urlStyle: "flat"
  },
   
    {
    slug: "cake-pan-size-volume-converter",
    title: "Cake Pan Size & Volume Converter",
    category: "cooking",
    subcategory: "baking-essentials",
    description: "Convert cake pan sizes. Adjust recipes for different pan shapes and volumes (round vs square) without ruining your bake.",
    loader: () => import("@/components/calculators/Cooking/CakePanSizeVolumeConverterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bakers-percentage",
    title: "Baker’s Percentage Calculator",
    category: "cooking",
    subcategory: "baking-essentials",
    description: "Master Baker's Math. Calculate ingredient ratios based on flour weight to create consistent and scalable bread recipes.",
    loader: () => import("@/components/calculators/Cooking/BakersPercentageCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dough-hydration-percent",
    title: "Dough Hydration % Calculator",
    category: "cooking",
    subcategory: "baking-essentials",
    description: "Calculate dough hydration percentage. Essential for sourdough and artisanal bread to achieve the perfect crumb and texture.",
    loader: () => import("@/components/calculators/Cooking/DoughHydrationPercentCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "sourdough-starter-ratio-feed-planner",
    title: "Sourdough Starter Ratio & Feed Planner",
    category: "cooking",
    subcategory: "baking-essentials",
    description: "Plan your sourdough starter feedings. Calculate the perfect ratio of starter, flour, and water to keep your wild yeast active.",
    loader: () => import("@/components/calculators/Cooking/SourdoughStarterRatioFeedPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "yeast-conversion-instant-active-fresh",
    title: "Yeast Conversion Calculator",
    category: "cooking",
    subcategory: "baking-essentials",
    description: "Convert yeast types easily. Switch between instant, active dry, and fresh yeast quantities for any baking recipe.",
    loader: () => import("@/components/calculators/Cooking/YeastConversionInstantActiveFreshCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "flour-blend-substitution",
    title: "Flour Blend Substitution Helper",
    category: "cooking",
    subcategory: "baking-essentials",
    description: "Create gluten-free flour blends. Calculate ratios for substituting all-purpose flour with almond, coconut, or rice flour mixes.",
    loader: () => import("@/components/calculators/Cooking/FlourBlendSubstitutionCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "sugar-butter-flour-density-lookup",
    title: "Sugar/Butter/Flour Density Lookup",
    category: "cooking",
    subcategory: "baking-essentials",
    description: "Quickly look up ingredient densities. Convert cups of packed sugar, butter, or sifted flour to grams accurately.",
    loader: () => import("@/components/calculators/Cooking/SugarButterFlourDensityLookupCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "chocolate-butter-tempering-temperature",
    title: "Chocolate/Butter Tempering Temperature",
    category: "cooking",
    subcategory: "baking-essentials",
    description: "Guide to chocolate tempering temperatures. Find the precise melting, cooling, and working points for dark, milk, and white chocolate.",
    loader: () => import("@/components/calculators/Cooking/ChocolateButterTemperingTemperatureCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "turkey-thaw-cook-time",
    title: "Turkey Size, Thaw & Cook Time Calculator",
    category: "cooking",
    subcategory: "meat-poultry-food-safety-times",
    description: "Plan your Thanksgiving turkey. Calculate thawing time and cooking time based on bird weight for a safe and juicy roast.",
    loader: () => import("@/components/calculators/Cooking/TurkeyThawCookTimeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "whole-chicken-roast-cook-time",
    title: "Whole Chicken/Roast Cook Time Estimator",
    category: "cooking",
    subcategory: "meat-poultry-food-safety-times",
    description: "Estimate roasting time for whole chickens. Ensure perfectly cooked poultry by calculating oven time based on weight.",
    loader: () => import("@/components/calculators/Cooking/WholeChickenRoastCookTimeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "steak-doneness-time-resting",
    title: "Steak Doneness Time & Resting Window",
    category: "cooking",
    subcategory: "meat-poultry-food-safety-times",
    description: "Time your steak to perfection. Estimate cooking time for rare, medium, or well-done steaks and calculate the vital resting period.",
    loader: () => import("@/components/calculators/Cooking/SteakDonenessTimeRestingCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "pork-beef-smoking-time-per-lb",
    title: "Pork/Beef Smoking Time per lb",
    category: "cooking",
    subcategory: "meat-poultry-food-safety-times",
    description: "Plan your BBQ smoking session. Calculate cooking time per pound for pork shoulders or beef briskets at low temperatures.",
    loader: () => import("@/components/calculators/Cooking/PorkBeefSmokingTimePerLbCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "safe-internal-temperature-checker",
    title: "Safe Internal Temperature Checker",
    category: "cooking",
    subcategory: "meat-poultry-food-safety-times",
    description: "Check safe internal food temperatures. Reference USDA guidelines for meat, poultry, and fish to prevent foodborne illness.",
    loader: () => import("@/components/calculators/Cooking/SafeInternalTemperatureCheckerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "defrost-time-fridge-cold-water",
    title: "Defrost Time Estimator",
    category: "cooking",
    subcategory: "meat-poultry-food-safety-times",
    description: "Estimate defrosting times. Calculate how long meat needs to thaw in the fridge or cold water based on its weight.",
    loader: () => import("@/components/calculators/Cooking/DefrostTimeFridgeColdWaterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "rice-water-ratio-yield",
    title: "Rice:Water Ratio & Yield Calculator",
    category: "cooking",
    subcategory: "everyday-kitchen-ratios-yields",
    description: "Get the perfect rice-to-water ratio. Calculate yield and liquid needs for Basmati, Jasmine, Brown, or Sushi rice.",
    loader: () => import("@/components/calculators/Cooking/RiceWaterRatioYieldCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "pasta-dry-cooked-yield-portions",
    title: "Pasta Dry ↔ Cooked Yield & Portions",
    category: "cooking",
    subcategory: "everyday-kitchen-ratios-yields",
    description: "Convert dry pasta to cooked weight. Estimate how much pasta to boil to get the exact number of cooked servings you need.",
    loader: () => import("@/components/calculators/Cooking/PastaDryCookedYieldPortionsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "stock-broth-reduction-time-yield",
    title: "Stock/Broth Reduction Time & Yield",
    category: "cooking",
    subcategory: "everyday-kitchen-ratios-yields",
    description: "Estimate stock reduction yield. Calculate how much volume remains after reducing broth to a demi-glace or glaze.",
    loader: () => import("@/components/calculators/Cooking/StockBrothReductionTimeYieldCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "oil-for-frying-pan-depth-volume",
    title: "Oil for Frying Calculator",
    category: "cooking",
    subcategory: "everyday-kitchen-ratios-yields",
    description: "Calculate oil needed for deep frying. Determine the volume required to fill your pan or fryer to the safe depth level.",
    loader: () => import("@/components/calculators/Cooking/OilForFryingPanDepthVolumeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "icing-frosting-coverage-cake-size",
    title: "Icing/Frosting Coverage by Cake Size",
    category: "cooking",
    subcategory: "everyday-kitchen-ratios-yields",
    description: "Calculate icing and frosting amounts. Determine how much frosting you need to cover round or square cakes of various sizes.",
    loader: () => import("@/components/calculators/Cooking/IcingFrostingCoverageCakeSizeCalculator"),
    urlStyle: "flat"
  },
    
   
    {
    slug: "percent-of-total",
    title: "Percent of Total Calculator",
    category: "math",
    subcategory: "percent-ratio-fractions",
    description: "Calculate the percentage of a total value. Quickly determine what part of the whole a specific number represents.",
    loader: () => import("@/components/calculators/Math/PercentOfTotalCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "percent-increase-decrease",
    title: "Percent Increase/Decrease Calculator",
    category: "math",
    subcategory: "percent-ratio-fractions",
    description: "Calculate the percentage increase or decrease between two numbers. Essential for tracking growth, discounts, or price changes.",
    loader: () => import("@/components/calculators/Math/PercentIncreaseDecreaseCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "percent-change",
    title: "Percent Change Calculator",
    category: "math",
    subcategory: "percent-ratio-fractions",
    description: "Find the percent change between an old value and a new value. Useful for analyzing financial data, statistics, and performance metrics.",
    loader: () => import("@/components/calculators/Math/PercentChangeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "fraction-decimal-converter",
    title: "Fraction ⇄ Decimal Converter",
    category: "math",
    subcategory: "percent-ratio-fractions",
    description: "Convert fractions to decimals and vice versa. Instantly transform 1/4 to 0.25 or any decimal back into its simplest fraction form.",
    loader: () => import("@/components/calculators/Math/FractionDecimalConverterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "fraction-reducer-simplifier",
    title: "Fraction Reducer / Simplifier",
    category: "math",
    subcategory: "percent-ratio-fractions",
    description: "Simplify fractions instantly. Reduce complex fractions to their lowest terms for easier math and clearer answers.",
    loader: () => import("@/components/calculators/Math/FractionReducerSimplifierCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ratio-calculator",
    title: "Ratio Calculator (A:B = C:D)",
    category: "math",
    subcategory: "percent-ratio-fractions",
    description: "Solve ratio problems easily. Find the missing value in a proportion (A:B = C:D) to scale recipes, images, or designs.",
    loader: () => import("@/components/calculators/Math/RatioCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "percent-error-calculator",
    title: "Percent Error Calculator",
    category: "math",
    subcategory: "percent-ratio-fractions",
    description: "Calculate percent error in experimental measurements. Compare your observed value to the true theoretical value to check accuracy.",
    loader: () => import("@/components/calculators/Math/PercentErrorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "proportion-solver",
    title: "Proportion Solver (Cross-Multiplication)",
    category: "math",
    subcategory: "percent-ratio-fractions",
    description: "Solve proportions using cross-multiplication. Find the value of X in any proportional equation quickly and accurately.",
    loader: () => import("@/components/calculators/Math/ProportionSolverCalculator"),
    urlStyle: "flat"
  },
    
    
   
   
    {
    slug: "quadratic-equation-solver",
    title: "Quadratic Equation Solver (ax²+bx+c)",
    category: "math",
    subcategory: "algebra-equations",
    description: "Solve quadratic equations instantly. Find the roots (x-intercepts), discriminant, and vertex of any parabola using the quadratic formula.",
    loader: () => import("@/components/calculators/Math/QuadraticEquationSolverCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "linear-equation-solver-1-2-variables",
    title: "Linear Equation Solver (1–2 variables)",
    category: "math",
    subcategory: "algebra-equations",
    description: "Solve linear equations with one or two variables. Find the value of X (and Y) for simple algebraic problems and systems.",
    loader: () => import("@/components/calculators/Math/LinearEquationSolver12VariablesCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "system-of-equations-substitution-elimination",
    title: "System of Equations Solver (Substitution/Elimination)",
    category: "math",
    subcategory: "algebra-equations",
    description: "Solve systems of linear equations. Use substitution or elimination methods to find the intersection point of two lines.",
    loader: () => import("@/components/calculators/Math/SystemOfEquationsSubstitutionEliminationCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "exponent-power-calculator",
    title: "Exponent & Power Calculator",
    category: "math",
    subcategory: "algebra-equations",
    description: "Calculate exponents and powers. Raise any base number to a positive, negative, or fractional power instantly.",
    loader: () => import("@/components/calculators/Math/ExponentPowerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "log-antilog-base-10-e",
    title: "Log / Antilog (base 10/e) Calculator",
    category: "math",
    subcategory: "algebra-equations",
    description: "Calculate logarithms and antilogarithms. Solve for Log base 10 or Natural Log (ln) base e for advanced math and science.",
    loader: () => import("@/components/calculators/Math/LogAntilogBase10ECalculator"),
    urlStyle: "flat"
  },
    {
    slug: "scientific-notation-standard-form",
    title: "Scientific Notation ⇄ Standard Form",
    category: "math",
    subcategory: "algebra-equations",
    description: "Convert numbers to Scientific Notation. Transform very large or small numbers into standard exponential form (e.g., 1.5 x 10^6).",
    loader: () => import("@/components/calculators/Math/ScientificNotationStandardFormCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "polynomial-factorization-helper",
    title: "Polynomial Factorization Helper",
    category: "math",
    subcategory: "algebra-equations",
    description: "Factor polynomials efficiently. Break down algebraic expressions into their simplest factors to solve complex equations.",
    loader: () => import("@/components/calculators/Math/PolynomialFactorizationHelperCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "root-radical-simplifier",
    title: "Root/Radical Simplifier",
    category: "math",
    subcategory: "algebra-equations",
    description: "Simplify square roots and radicals. Convert unsimplified radicals into their simplest mixed radical form (e.g., √8 to 2√2).",
    loader: () => import("@/components/calculators/Math/RootRadicalSimplifierCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "gcf-gcd-calculator",
    title: "GCF / GCD Calculator",
    category: "math",
    subcategory: "number-theory-discrete",
    description: "Find the Greatest Common Factor (GCF) or Greatest Common Divisor (GCD). Identify the largest number that divides two or more integers.",
    loader: () => import("@/components/calculators/Math/GcfGcdCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "lcm-calculator",
    title: "LCM Calculator",
    category: "math",
    subcategory: "number-theory-discrete",
    description: "Calculate the Least Common Multiple (LCM). Find the smallest positive integer that is divisible by two or more numbers.",
    loader: () => import("@/components/calculators/Math/LcmCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "prime-factorization-tool",
    title: "Prime Factorization Tool",
    category: "math",
    subcategory: "number-theory-discrete",
    description: "Find the prime factorization of any number. Break down composite numbers into their prime components (e.g., 12 = 2² × 3).",
    loader: () => import("@/components/calculators/Math/PrimeFactorizationToolCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "modulo-remainder-calculator",
    title: "Modulo (Remainder) Calculator",
    category: "math",
    subcategory: "number-theory-discrete",
    description: "Calculate the modulo (remainder). Find the remainder of a division operation, essential for computer science and cryptography.",
    loader: () => import("@/components/calculators/Math/ModuloRemainderCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "permutations-combinations-npr-ncr",
    title: "Permutations & Combinations (nPr / nCr)",
    category: "math",
    subcategory: "number-theory-discrete",
    description: "Calculate permutations (nPr) and combinations (nCr). Determine the number of ways to arrange or select items from a set.",
    loader: () => import("@/components/calculators/Math/PermutationsCombinationsNprNcrCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "random-number-generator-ranges",
    title: "Random Number Generator (ranges)",
    category: "math",
    subcategory: "number-theory-discrete",
    description: "Generate random numbers within a specific range. Perfect for statistical sampling, games, or picking a random winner.",
    loader: () => import("@/components/calculators/Math/RandomNumberGeneratorRangesCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "triangle-solver-sss-sas-asa",
    title: "Triangle Solver (SSS/SAS/ASA)",
    category: "math",
    subcategory: "geometry-trig",
    description: "Solve triangles using SSS, SAS, or ASA methods. Calculate missing side lengths and angles using the Law of Sines and Cosines.",
    loader: () => import("@/components/calculators/Math/TriangleSolverSssSasAsaCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "circle-area-circumference",
    title: "Circle Area / Circumference Calculator",
    category: "math",
    subcategory: "geometry-trig",
    description: "Calculate circle metrics. Find the area, circumference, radius, and diameter of a circle instantly.",
    loader: () => import("@/components/calculators/Math/CircleAreaCircumferenceCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "rectangle-parallelogram-area",
    title: "Rectangle & Parallelogram Area Calculator",
    category: "math",
    subcategory: "geometry-trig",
    description: "Calculate the area of rectangles and parallelograms. Find the surface area and perimeter for construction or homework.",
    loader: () => import("@/components/calculators/Math/RectangleParallelogramAreaCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "pythagorean-theorem-solver",
    title: "Pythagorean Theorem Solver",
    category: "math",
    subcategory: "geometry-trig",
    description: "Solve for the hypotenuse or legs of a right triangle. Use a² + b² = c² to find missing distances easily.",
    loader: () => import("@/components/calculators/Math/PythagoreanTheoremSolverCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "trig-functions-angle-side-finder",
    title: "Trig Functions (sin/cos/tan) Angle/Side Finder",
    category: "math",
    subcategory: "geometry-trig",
    description: "Calculate Trigonometric functions. Find Sine, Cosine, and Tangent values to determine unknown angles and sides in right triangles.",
    loader: () => import("@/components/calculators/Math/TrigFunctionsAngleSideFinderCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "shapes-area-volume-pack",
    title: "2D/3D Shapes Area & Volume Pack",
    category: "math",
    subcategory: "geometry-trig",
    description: "Calculate area and volume for 2D and 3D shapes. Comprehensive tool for cubes, cylinders, spheres, cones, and more.",
    loader: () => import("@/components/calculators/Math/ShapesAreaVolumePackCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "angle-converter-deg-rad",
    title: "Angle Converter (deg ↔ rad)",
    category: "math",
    subcategory: "geometry-trig",
    description: "Convert angles between Degrees and Radians. Essential for calculus and trigonometry calculations.",
    loader: () => import("@/components/calculators/Math/AngleConverterDegRadCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "mean-median-mode",
    title: "Mean, Median, Mode Calculator",
    category: "math",
    subcategory: "statistics-probability",
    description: "Calculate Mean, Median, and Mode. Find the average, middle value, and most frequent number in any data set.",
    loader: () => import("@/components/calculators/Math/MeanMedianModeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "standard-deviation-variance-pop-sample",
    title: "Standard Deviation & Variance (pop/sample)",
    category: "math",
    subcategory: "statistics-probability",
    description: "Calculate Standard Deviation and Variance. Measure data dispersion and variability for population or sample datasets.",
    loader: () => import("@/components/calculators/Math/StandardDeviationVariancePopSampleCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "z-score-percentile-finder",
    title: "Z-Score & Percentile Finder",
    category: "math",
    subcategory: "statistics-probability",
    description: "Find Z-Scores and Percentiles. Standardize data points to understand their position relative to the mean in a normal distribution.",
    loader: () => import("@/components/calculators/Math/ZScorePercentileFinderCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "linear-interpolation-extrapolation",
    title: "Linear Interpolation / Extrapolation",
    category: "math",
    subcategory: "statistics-probability",
    description: "Perform Linear Interpolation. Estimate unknown values that fall between two known data points on a line.",
    loader: () => import("@/components/calculators/Math/LinearInterpolationExtrapolationCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "binomial-probability-calculator",
    title: "Binomial Probability Calculator",
    category: "math",
    subcategory: "statistics-probability",
    description: "Calculate Binomial Probability. Determine the likelihood of a specific number of successes in a series of independent experiments.",
    loader: () => import("@/components/calculators/Math/BinomialProbabilityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "normal-cdf-pdf-estimator",
    title: "Normal CDF / PDF Quick Estimator",
    category: "math",
    subcategory: "statistics-probability",
    description: "Estimate Normal Distribution values. Calculate Cumulative Distribution Function (CDF) and Probability Density Function (PDF) probabilities.",
    loader: () => import("@/components/calculators/Math/NormalCdfPdfEstimatorCalculator"),
    urlStyle: "flat"
  },
    
    
   
    {
    slug: "kinematics-suvat-solver",
    title: "Kinematics Equations Solver (SUVAT)",
    category: "science",
    subcategory: "physics-mechanics-motion",
    description: "Solve motion problems using SUVAT equations. Calculate displacement, initial/final velocity, acceleration, and time for uniform acceleration.",
    loader: () => import("@/components/calculators/Science/KinematicsSuvatSolverCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "projectile-motion-calculator",
    title: "Projectile Motion Calculator",
    category: "science",
    subcategory: "physics-mechanics-motion",
    description: "Analyze projectile motion. Calculate range, maximum height, and time of flight for objects launched at an angle under gravity.",
    loader: () => import("@/components/calculators/Science/ProjectileMotionCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "force-work-energy-calculator",
    title: "Force, Work & Energy Calculator",
    category: "science",
    subcategory: "physics-mechanics-motion",
    description: "Calculate Force, Work, and Energy. Solve physics problems involving Newton's laws, kinetic energy, and potential energy.",
    loader: () => import("@/components/calculators/Science/ForceWorkEnergyCalculator"),
    urlStyle: "flat"
  },
   
    {
    slug: "power-efficiency-calculator",
    title: "Power & Efficiency Calculator",
    category: "science",
    subcategory: "physics-mechanics-motion",
    description: "Determine Power and Efficiency. Calculate the rate of work done and the energy efficiency of mechanical systems or engines.",
    loader: () => import("@/components/calculators/Science/PowerEfficiencyCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "momentum-impulse-calculator",
    title: "Momentum & Impulse Calculator",
    category: "science",
    subcategory: "physics-mechanics-motion",
    description: "Calculate Momentum and Impulse. Analyze collisions and the change in motion of objects using mass and velocity.",
    loader: () => import("@/components/calculators/Science/MomentumImpulseCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "uniform-circular-motion-centripetal",
    title: "Uniform Circular Motion Calculator",
    category: "science",
    subcategory: "physics-mechanics-motion",
    description: "Solve for centripetal force and acceleration. Calculate the velocity and period of objects in uniform circular motion.",
    loader: () => import("@/components/calculators/Science/UniformCircularMotionCentripetalCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "free-fall-time-velocity-estimator",
    title: "Free-Fall Time/Velocity Estimator",
    category: "science",
    subcategory: "physics-mechanics-motion",
    description: "Estimate free-fall parameters. Calculate how long an object takes to fall and its impact velocity under gravity.",
    loader: () => import("@/components/calculators/Science/FreeFallTimeVelocityEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "wave-speed-frequency-wavelength",
    title: "Wave Speed / Frequency / Wavelength",
    category: "science",
    subcategory: "physics-waves-optics-thermo",
    description: "Calculate wave properties. Find the relationship between wave speed, frequency, and wavelength with the wave equation.",
    loader: () => import("@/components/calculators/Science/WaveSpeedFrequencyWavelengthCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "snells-law-critical-angle",
    title: "Snell’s Law & Critical Angle Calculator",
    category: "science",
    subcategory: "physics-waves-optics-thermo",
    description: "Solve optics problems using Snell's Law. Calculate the angle of refraction and the critical angle for total internal reflection.",
    loader: () => import("@/components/calculators/Science/SnellsLawCriticalAngleCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "thin-lens-solver",
    title: "Thin Lens Solver",
    category: "science",
    subcategory: "physics-waves-optics-thermo",
    description: "Solve Thin Lens equation problems. Calculate focal length, object distance, and image distance for convex and concave lenses.",
    loader: () => import("@/components/calculators/Science/ThinLensSolverCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "specific-heat-q-mc-delta-t",
    title: "Specific Heat Calculator",
    category: "science",
    subcategory: "physics-waves-optics-thermo",
    description: "Calculate heat energy (q=mcΔT). Determine the energy required to change the temperature of a substance based on specific heat capacity.",
    loader: () => import("@/components/calculators/Science/SpecificHeatQMcDeltaTCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "heat-transfer-conduction",
    title: "Heat Transfer (Conduction) Calculator",
    category: "science",
    subcategory: "physics-waves-optics-thermo",
    description: "Calculate rate of heat transfer by conduction. Solve thermal conductivity problems using Fourier's law for engineering and physics.",
    loader: () => import("@/components/calculators/Science/HeatTransferConductionCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "blackbody-peak-wien-law-estimator",
    title: "Blackbody Peak (Wien's Law) Estimator",
    category: "science",
    subcategory: "physics-waves-optics-thermo",
    description: "Estimate peak wavelength of blackbody radiation. Use Wien's Displacement Law to find the temperature of stars and hot objects.",
    loader: () => import("@/components/calculators/Science/BlackbodyPeakWienLawEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "photon-energy-e-hf",
    title: "Photon Energy Calculator",
    category: "science",
    subcategory: "physics-electricity-modern",
    description: "Calculate the energy of a photon. Use Planck's constant and frequency (E=hf) to solve quantum physics problems.",
    loader: () => import("@/components/calculators/Science/PhotonEnergyEHfCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "half-life-exponential-decay",
    title: "Half-Life / Exponential Decay Calculator",
    category: "science",
    subcategory: "physics-electricity-modern",
    description: "Calculate radioactive half-life. Solve exponential decay problems to determine remaining quantity or elapsed time.",
    loader: () => import("@/components/calculators/Science/HalfLifeExponentialDecayCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "radioactive-activity-a-lambda-n",
    title: "Radioactive Activity Calculator",
    category: "science",
    subcategory: "physics-electricity-modern",
    description: "Calculate radioactive activity (A = λN). Determine the decay rate of a sample based on its decay constant.",
    loader: () => import("@/components/calculators/Science/RadioactiveActivityALambdaNCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "reactance-capacitor-inductor-educational",
    title: "Capacitor/Inductor Reactance Calculator",
    category: "science",
    subcategory: "physics-electricity-modern",
    description: "Calculate reactance for AC circuits. Determine the opposition to current flow in capacitors and inductors at specific frequencies.",
    loader: () => import("@/components/calculators/Science/ReactanceCapacitorInductorEducationalCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "rc-time-constant-tau-rc",
    title: "RC Time Constant Calculator",
    category: "science",
    subcategory: "physics-electricity-modern",
    description: "Calculate the RC Time Constant (τ). Determine how fast a capacitor charges or discharges through a resistor in a circuit.",
    loader: () => import("@/components/calculators/Science/RcTimeConstantTauRcCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "molarity-moles-volume",
    title: "Molarity / Moles / Volume Calculator",
    category: "science",
    subcategory: "chemistry-solutions-stoichiometry",
    description: "Calculate Molarity, Moles, and Volume. The essential tool for preparing chemical solutions and performing lab calculations.",
    loader: () => import("@/components/calculators/Science/MolarityMolesVolumeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dilution-c1v1-c2v2",
    title: "Dilution Calculator (C₁V₁ = C₂V₂)",
    category: "science",
    subcategory: "chemistry-solutions-stoichiometry",
    description: "Solve dilution problems easily. Calculate the volume needed to dilute a stock solution to a desired concentration.",
    loader: () => import("@/components/calculators/Science/DilutionC1v1C2v2Calculator"),
    urlStyle: "flat"
  },
    {
    slug: "molality-normality-converter",
    title: "Molality & Normality Converter",
    category: "science",
    subcategory: "chemistry-solutions-stoichiometry",
    description: "Convert concentration units. Calculate Molality and Normality for precise chemical solutions and acid-base titrations.",
    loader: () => import("@/components/calculators/Science/MolalityNormalityConverterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ideal-gas-law-pv-nrt",
    title: "Ideal Gas Law Calculator",
    category: "science",
    subcategory: "chemistry-solutions-stoichiometry",
    description: "Solve Ideal Gas Law problems (PV = nRT). Calculate pressure, volume, temperature, or moles of a gas instantly.",
    loader: () => import("@/components/calculators/Science/IdealGasLawPvNrtCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "stoichiometry-limiting-reagent",
    title: "Stoichiometry & Limiting Reagent Solver",
    category: "science",
    subcategory: "chemistry-solutions-stoichiometry",
    description: "Solve stoichiometry problems. Calculate the amounts of reactants and products and identify the limiting reagent in reactions.",
    loader: () => import("@/components/calculators/Science/StoichiometryLimitingReagentCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "percent-yield-theoretical-yield",
    title: "Percent Yield & Theoretical Yield",
    category: "science",
    subcategory: "chemistry-solutions-stoichiometry",
    description: "Calculate Percent Yield. Compare actual yield to theoretical yield to measure the efficiency of a chemical reaction.",
    loader: () => import("@/components/calculators/Science/PercentYieldTheoreticalYieldCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ph-poh-h-oh-calculator",
    title: "pH / pOH / [H+] Calculator",
    category: "science",
    subcategory: "chemistry-solutions-stoichiometry",
    description: "Calculate pH, pOH, and ion concentration. Convert between acidity metrics easily for chemistry and biology applications.",
    loader: () => import("@/components/calculators/Science/PhPohHOhCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "buffer-henderson-hasselbalch-helper",
    title: "Buffer (Henderson–Hasselbalch) Helper",
    category: "science",
    subcategory: "chemistry-solutions-stoichiometry",
    description: "Design chemical buffers. Use the Henderson-Hasselbalch equation to calculate pH and ratio of conjugate base to acid.",
    loader: () => import("@/components/calculators/Science/BufferHendersonHasselbalchHelperCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "molar-mass-calculator",
    title: "Molar Mass Calculator",
    category: "science",
    subcategory: "chemistry-composition-units",
    description: "Calculate Molar Mass. Find the molecular weight of any chemical compound by summing atomic masses from the periodic table.",
    loader: () => import("@/components/calculators/Science/MolarMassCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "percent-composition-by-mass",
    title: "Percent Composition by Mass",
    category: "science",
    subcategory: "chemistry-composition-units",
    description: "Calculate Percent Composition by Mass. Determine the percentage of each element within a chemical compound.",
    loader: () => import("@/components/calculators/Science/PercentCompositionByMassCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ppm-ppb-concentration-converter",
    title: "ppm / ppb Concentration Converter",
    category: "science",
    subcategory: "chemistry-composition-units",
    description: "Convert concentration units. Switch between parts per million (ppm), parts per billion (ppb), and molarity for trace analysis.",
    loader: () => import("@/components/calculators/Science/PpmPpbConcentrationConverterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "density-specific-gravity-calculator",
    title: "Density / Specific Gravity Calculator",
    category: "science",
    subcategory: "chemistry-composition-units",
    description: "Calculate Density and Specific Gravity. Determine the mass-to-volume ratio of solids, liquids, and gases.",
    loader: () => import("@/components/calculators/Science/DensitySpecificGravityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "escape-velocity-calculator",
    title: "Escape Velocity Calculator",
    category: "science",
    subcategory: "astronomy-earth-science",
    description: "Calculate Escape Velocity. Determine the speed needed to break free from the gravitational pull of a planet or moon.",
    loader: () => import("@/components/calculators/Science/EscapeVelocityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "orbital-period-kepler-estimator",
    title: "Orbital Period (Kepler) Estimator",
    category: "science",
    subcategory: "astronomy-earth-science",
    description: "Estimate Orbital Period using Kepler's Laws. Calculate the time it takes for a planet or satellite to orbit a massive body.",
    loader: () => import("@/components/calculators/Science/OrbitalPeriodKeplerEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "gravity-on-other-planets-calculator",
    title: "Gravity on Other Planets Calculator",
    category: "science",
    subcategory: "astronomy-earth-science",
    description: "Calculate gravity on other planets. See how much you would weigh on Mars, Jupiter, or the Moon compared to Earth.",
    loader: () => import("@/components/calculators/Science/GravityOnOtherPlanetsCalculator"),
    urlStyle: "flat"
  },
    
   
   
  
    
   
    
    {
    slug: "cleaning-dilution-ratio",
    title: "Cleaning Dilution Ratio Calculator",
    category: "everyday",
    subcategory: "home-maintenance",
    description: "Calculate the perfect cleaning dilution ratio. Mix chemicals and water safely and effectively for household cleaning tasks.",
    loader: () => import("@/components/calculators/Misc/CleaningDilutionRatioCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "laundry-detergent-dosage",
    title: "Laundry Detergent Dosage by Load Size",
    category: "everyday",
    subcategory: "home-maintenance",
    description: "Determine the right laundry detergent dosage. Calculate the exact amount needed per load size to save money and protect clothes.",
    loader: () => import("@/components/calculators/Misc/LaundryDetergentDosageCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "home-paint-touch-up",
    title: "Home Paint Touch-Up Estimator",
    category: "everyday",
    subcategory: "home-maintenance",
    description: "Estimate paint needed for touch-ups. Calculate exactly how much paint covers scratches and small repairs on walls and trim.",
    loader: () => import("@/components/calculators/Misc/HomePaintTouchUpCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "room-air-changes-ach",
    title: "Room Air Changes per Hour (ACH) Calculator",
    category: "everyday",
    subcategory: "home-maintenance",
    description: "Calculate Air Changes per Hour (ACH). Measure ventilation efficiency and air quality turnover rates for any room size.",
    loader: () => import("@/components/calculators/Misc/RoomAirChangesAchCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "propane-tank-burn-time",
    title: "Propane Tank Burn Time Estimator",
    category: "everyday",
    subcategory: "home-maintenance",
    description: "Estimate propane tank burn time. Calculate how long your grill, heater, or generator will run based on tank size and BTU usage.",
    loader: () => import("@/components/calculators/Misc/PropaneTankBurnTimeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "refrigerator-freezer-safe-zone-time-window",
    title: "Refrigerator/Freezer Safe Zone Time Window",
    category: "everyday",
    subcategory: "home-maintenance",
    description: "Track food safety during power outages. Estimate how long food stays safe in your refrigerator or freezer without power.",
    loader: () => import("@/components/calculators/Misc/RefrigeratorFreezerSafeZoneTimeWindowCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "light-bulb-cost-per-year",
    title: "Light Bulb Cost per Year Calculator",
    category: "everyday",
    subcategory: "home-maintenance",
    description: "Calculate electricity costs for light bulbs. Compare LED vs. incandescent usage to see how much you save on your energy bill.",
    loader: () => import("@/components/calculators/Misc/LightBulbCostPerYearCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "water-heater-recovery-time",
    title: "Water Heater Recovery Time Estimator",
    category: "everyday",
    subcategory: "home-maintenance",
    description: "Estimate water heater recovery time. Calculate how long it takes for your tank to provide hot water again after depletion.",
    loader: () => import("@/components/calculators/Misc/WaterHeaterRecoveryTimeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "home-renovation-cost-estimator",
    title: "Home Renovation Cost Estimator",
    category: "everyday",
    subcategory: "home-maintenance",
    description: "Estimate home renovation costs. Create a budget for your remodeling project by calculating material and labor expenses.",
    loader: () => import("@/components/calculators/Misc/HomeRenovationCostEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "appliance-energy-consumption",
    title: "Appliance Energy Consumption Calculator",
    category: "everyday",
    subcategory: "home-maintenance",
    description: "Calculate appliance energy consumption. Track how much electricity your fridge, TV, and washer use to manage your utility bill.",
    loader: () => import("@/components/calculators/Misc/ApplianceEnergyConsumptionCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "life-expectancy",
    title: "Life Expectancy Calculator",
    category: "everyday",
    subcategory: "health-wellness-sleep",
    description: "Estimate your life expectancy. Analyze lifestyle factors like diet and exercise to see statistical projections for longevity.",
    loader: () => import("@/components/calculators/Misc/LifeExpectancyCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bmi-calculator",
    title: "Body Mass Index (BMI) Calculator",
    category: "everyday",
    subcategory: "health-wellness-sleep",
    description: "Calculate Body Mass Index (BMI) quickly. A simple everyday tool to check if your weight falls within a healthy range.",
    loader: () => import("@/components/calculators/Misc/BmiCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "sleep-debt-ideal-bedtime",
    title: "Sleep Debt & Ideal Bedtime Planner",
    category: "everyday",
    subcategory: "health-wellness-sleep",
    description: "Calculate your sleep debt and recovery plan. Find out how much sleep you owe your body and determine your ideal bedtime.",
    loader: () => import("@/components/calculators/Misc/SleepDebtIdealBedtimeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "caffeine-max-per-day",
    title: "Caffeine Max per Day Calculator",
    category: "everyday",
    subcategory: "health-wellness-sleep",
    description: "Monitor your caffeine intake. Calculate your daily limit based on body weight to enjoy coffee safely without the jitters.",
    loader: () => import("@/components/calculators/Misc/CaffeineMaxPerDayCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "screen-time-pomodoro-planner",
    title: "Screen Time Budget / Pomodoro Planner",
    category: "everyday",
    subcategory: "health-wellness-sleep",
    description: "Manage digital wellness with a screen time budget. Plan productive work intervals using the Pomodoro technique.",
    loader: () => import("@/components/calculators/Misc/ScreenTimePomodoroPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "steps-to-distance-converter",
    title: "Steps → Distance Converter",
    category: "everyday",
    subcategory: "health-wellness-sleep",
    description: "Convert daily steps to distance. See how many miles or kilometers you walked based on your step count and stride length.",
    loader: () => import("@/components/calculators/Misc/StepsToDistanceConverterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "hydration-reminder-interval",
    title: "Hydration Reminder Interval Planner",
    category: "everyday",
    subcategory: "health-wellness-sleep",
    description: "Set up a hydration schedule. Calculate the best intervals to drink water throughout the day to meet your daily intake goals.",
    loader: () => import("@/components/calculators/Misc/HydrationReminderIntervalCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "myplate-daily-calorie-nutrient",
    title: "MyPlate Daily Calorie/Nutrient Planner",
    category: "everyday",
    subcategory: "health-wellness-sleep",
    description: "Plan balanced meals with MyPlate guidelines. Calculate daily calorie and nutrient portions for a healthy lifestyle.",
    loader: () => import("@/components/calculators/Misc/MyplateDailyCalorieNutrientCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bmr-calculator",
    title: "Basal Metabolic Rate (BMR) Calculator",
    category: "everyday",
    subcategory: "health-wellness-sleep",
    description: "Calculate everyday BMR. Find out the minimum calories your body needs to function before adding any physical activity.",
    loader: () => import("@/components/calculators/Misc/BmrCalculator"),
    urlStyle: "flat"
  },
    
    {
    slug: "party-food-drinks-planner",
    title: "Party Food & Drinks Planner",
    category: "everyday",
    subcategory: "events-party-culinary",
    description: "Plan party food and drink quantities. Calculate exactly how many servings, pizzas, and beverages you need for your guest list.",
    loader: () => import("@/components/calculators/Misc/PartyFoodDrinksPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ice-quantity-beverages",
    title: "Ice Quantity for Beverages Calculator",
    category: "everyday",
    subcategory: "events-party-culinary",
    description: "Calculate ice needed for parties. Estimate bags of ice required for drinks and cooling based on guest count and duration.",
    loader: () => import("@/components/calculators/Misc/IceQuantityBeveragesCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "buffet-pan-capacity-count",
    title: "Buffet Serving Pan Capacity & Count",
    category: "everyday",
    subcategory: "events-party-culinary",
    description: "Plan buffet quantities. Calculate how much food fits in standard hotel pans to ensure you feed everyone without running out.",
    loader: () => import("@/components/calculators/Misc/BuffetPanCapacityCountCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "beverage-mix-estimator",
    title: "Wine/Beer/Soft Drink Mix Estimator",
    category: "everyday",
    subcategory: "events-party-culinary",
    description: "Estimate the beverage mix for events. Calculate the ratio of wine, beer, and soft drinks needed based on guest preferences.",
    loader: () => import("@/components/calculators/Misc/BeverageMixEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "coffee-urn-yield-strength",
    title: "Coffee Urn Yield & Strength Calculator",
    category: "everyday",
    subcategory: "events-party-culinary",
    description: "Brew coffee for a crowd. Calculate the coffee grounds-to-water ratio for large urns to ensure the perfect strength.",
    loader: () => import("@/components/calculators/Misc/CoffeeUrnYieldStrengthCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "leftovers-cooling-reheat-time",
    title: "Leftovers Cooling & Reheat Time",
    category: "everyday",
    subcategory: "events-party-culinary",
    description: "Handle leftovers safely. Estimate cooling times and safe reheating duration to prevent food spoilage after big meals.",
    loader: () => import("@/components/calculators/Misc/LeftoversCoolingReheatTimeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "event-budget-calculator",
    title: "Event Budget Calculator",
    category: "everyday",
    subcategory: "events-party-culinary",
    description: "Create a comprehensive event budget. Track expenses for venue, food, and entertainment to keep your party planning on track.",
    loader: () => import("@/components/calculators/Misc/EventBudgetCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "event-capacity-calculator",
    title: "Event Capacity Calculator",
    category: "everyday",
    subcategory: "events-party-culinary",
    description: "Calculate venue capacity. Determine how many guests can safely fit in a room based on square footage and seating layout.",
    loader: () => import("@/components/calculators/Misc/EventCapacityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "mulch-coverage-bag-count",
    title: "Mulch Coverage & Bag Count Calculator",
    category: "everyday",
    subcategory: "garden-exterior",
    description: "Calculate mulch coverage and bags needed. Determine the cubic yards or bags of mulch required for your garden beds.",
    loader: () => import("@/components/calculators/Misc/MulchCoverageBagCountCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "garden-soil-compost-volume",
    title: "Garden Soil/Compost Volume Calculator",
    category: "everyday",
    subcategory: "garden-exterior",
    description: "Calculate soil volume for raised beds. Find out exactly how much topsoil or compost you need to fill your garden planters.",
    loader: () => import("@/components/calculators/Misc/GardenSoilCompostVolumeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "lawn-mowing-time-fuel",
    title: "Lawn Mowing Time & Fuel Planner",
    category: "everyday",
    subcategory: "garden-exterior",
    description: "Estimate lawn mowing time. Calculate how long it takes to mow your yard and the fuel required based on mower size.",
    loader: () => import("@/components/calculators/Misc/LawnMowingTimeFuelCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "hose-runtime-flow-rate",
    title: "Hose Runtime vs Flow Rate Calculator",
    category: "everyday",
    subcategory: "garden-exterior",
    description: "Calculate hose runtime for watering. Determine how long to run your sprinkler to deliver a specific amount of water.",
    loader: () => import("@/components/calculators/Misc/HoseRuntimeFlowRateCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "rainwater-barrel-days-supply",
    title: "Rainwater Barrel Days of Supply",
    category: "everyday",
    subcategory: "garden-exterior",
    description: "Estimate rainwater supply duration. Calculate how long your rain barrel will last during dry spells based on garden usage.",
    loader: () => import("@/components/calculators/Misc/RainwaterBarrelDaysSupplyCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "grass-seed-quantity",
    title: "Grass Seed Quantity Calculator",
    category: "everyday",
    subcategory: "garden-exterior",
    description: "Calculate grass seed needed. Determine the pounds of seed required to overseed or plant a new lawn based on area.",
    loader: () => import("@/components/calculators/Misc/GrassSeedQuantityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "square-footage-calculator",
    title: "Square Footage Calculator",
    category: "everyday",
    subcategory: "garden-exterior",
    description: "Calculate square footage for lawns and gardens. Measure the total area of your outdoor space for landscaping projects.",
    loader: () => import("@/components/calculators/Misc/SquareFootageCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "planting-calendar-frost-date",
    title: "Planting Calendar & Frost Date Finder",
    category: "everyday",
    subcategory: "garden-exterior",
    description: "Find your planting dates. Determine the best time to sow seeds based on local frost dates and your hardiness zone.",
    loader: () => import("@/components/calculators/Misc/PlantingCalendarFrostDateCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "plant-spacing-calculator",
    title: "Plant Spacing Calculator",
    category: "everyday",
    subcategory: "garden-exterior",
    description: "Optimize your garden layout. Calculate the ideal spacing between plants to maximize yield and prevent overcrowding.",
    loader: () => import("@/components/calculators/Misc/PlantSpacingCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "fertilizer-application-calculator",
    title: "Fertilizer Application Calculator",
    category: "everyday",
    subcategory: "garden-exterior",
    description: "Calculate fertilizer application rates. Determine the correct amount of nitrogen, phosphorus, and potassium for your lawn area.",
    loader: () => import("@/components/calculators/Misc/FertilizerApplicationCalculator"),
    urlStyle: "flat"
  },
   
    {
    slug: "running-pace-split-finish-time",
    title: "Running Pace / Split / Finish Time Calculator",
    category: "sports",
    subcategory: "running-cycling-triathlon-performance",
    description: "Calculate your running pace and finish times. Determine the splits needed to achieve your marathon or 5K personal best.",
    loader: () => import("@/components/calculators/Sports/RunningPaceSplitFinishTimeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "race-time-predictor-riegel",
    title: "Race Time Predictor (Riegel Formula)",
    category: "sports",
    subcategory: "running-cycling-triathlon-performance",
    description: "Predict your race time for any distance. Use the Riegel formula to estimate performance based on a previous race result.",
    loader: () => import("@/components/calculators/Sports/RaceTimePredictorRiegelCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "heart-rate-zones-karvonen",
    title: "Heart-Rate Zones Calculator (Karvonen Method)",
    category: "sports",
    subcategory: "running-cycling-triathlon-performance",
    description: "Calculate accurate heart rate training zones. Use the Karvonen method to account for resting heart rate and optimize your cardio.",
    loader: () => import("@/components/calculators/Sports/HeartRateZonesKarvonenCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cycling-power-speed-estimator",
    title: "Cycling Power ↔ Speed Estimator (flat/wind)",
    category: "sports",
    subcategory: "running-cycling-triathlon-performance",
    description: "Estimate cycling power vs speed. Calculate how much wattage is required to maintain speed against wind resistance and flat terrain.",
    loader: () => import("@/components/calculators/Sports/CyclingPowerSpeedEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ftp-zones-planner",
    title: "FTP (Functional Threshold Power) Zones Planner",
    category: "sports",
    subcategory: "running-cycling-triathlon-performance",
    description: "Plan your cycling training zones. Calculate power zones based on your Functional Threshold Power (FTP) for structured workouts.",
    loader: () => import("@/components/calculators/Sports/FtpZonesPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "swim-pace-css-splits",
    title: "Swim Pace: CSS (Critical Swim Speed) & Splits",
    category: "sports",
    subcategory: "running-cycling-triathlon-performance",
    description: "Calculate your Critical Swim Speed (CSS). Determine optimal pacing for swim training and monitor aerobic threshold improvements.",
    loader: () => import("@/components/calculators/Sports/SwimPaceCssSplitsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "t1-t2-time-impact",
    title: "T1/T2 Transition Time Impact (Triathlon)",
    category: "sports",
    subcategory: "running-cycling-triathlon-performance",
    description: "Analyze triathlon transition times. See how T1 and T2 durations impact your overall race finish time and ranking.",
    loader: () => import("@/components/calculators/Sports/T1T2TimeImpactCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "hydration-sweat-rate",
    title: "Hydration / Sweat Rate Calculator",
    category: "sports",
    subcategory: "running-cycling-triathlon-performance",
    description: "Calculate your sweat rate. Determine exactly how much fluid you need to drink to stay hydrated during endurance events.",
    loader: () => import("@/components/calculators/Sports/HydrationSweatRateCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cycling-cadence",
    title: "Cycling Cadence Calculator",
    category: "sports",
    subcategory: "running-cycling-triathlon-performance",
    description: "Calculate cycling cadence. Measure your RPM (revolutions per minute) based on gear ratio and speed to improve pedaling efficiency.",
    loader: () => import("@/components/calculators/Sports/CyclingCadenceCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "negative-split",
    title: "Negative Split Race Planner",
    category: "sports",
    subcategory: "running-cycling-triathlon-performance",
    description: "Plan a negative split strategy. Calculate the pace required for the second half of your race to finish stronger than you started.",
    loader: () => import("@/components/calculators/Sports/NegativeSplitCalculator"),
    urlStyle: "flat"
  },
    
   
    {
    slug: "swimming-power-points",
    title: "Swimming Power Points Calculator",
    category: "sports",
    subcategory: "running-cycling-triathlon-performance",
    description: "Calculate swimming power points. Compare performances across different events and distances using standardized scoring tables.",
    loader: () => import("@/components/calculators/Sports/SwimmingPowerPointsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "pool-length-time-converter",
    title: "Pool Length Time Converter (SCY/SCM/LCM)",
    category: "sports",
    subcategory: "running-cycling-triathlon-performance",
    description: "Convert swim times between pool lengths. Switch between Short Course Yards, Short Course Meters, and Long Course Meters accurately.",
    loader: () => import("@/components/calculators/Sports/PoolLengthTimeConverterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "swim-interval-pace",
    title: "Swim Interval Pace Calculator",
    category: "sports",
    subcategory: "running-cycling-triathlon-performance",
    description: "Calculate swim interval pacing. Set target times for 100m or 50m repeats to improve speed and endurance in the pool.",
    loader: () => import("@/components/calculators/Sports/SwimIntervalPaceCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "one-rep-max-1rm",
    title: "One-Rep Max (1RM) Calculator",
    category: "sports",
    subcategory: "strength-lifting-conditioning",
    description: "Calculate your One-Rep Max (1RM). safely estimate your maximum lifting potential for bench press, squat, and deadlift.",
    loader: () => import("@/components/calculators/Sports/OneRepMax1rmCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "training-weight-percentage",
    title: "Training Weight Percentage Calculator",
    category: "sports",
    subcategory: "strength-lifting-conditioning",
    description: "Calculate training weights. Determine specific percentages of your 1RM to plan hypertrophy, strength, or power workouts.",
    loader: () => import("@/components/calculators/Sports/TrainingWeightPercentageCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "target-heart-rate-rpe-zones",
    title: "Target Heart Rate / RPE Zones",
    category: "sports",
    subcategory: "strength-lifting-conditioning",
    description: "Match heart rate to Perceived Exertion (RPE). Align subjective training intensity with objective heart rate data.",
    loader: () => import("@/components/calculators/Sports/TargetHeartRateRpeZonesCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "tdee-calculator",
    title: "TDEE Calculator (Sports)",
    category: "sports",
    subcategory: "strength-lifting-conditioning",
    description: "Calculate Total Daily Energy Expenditure for athletes. Estimate calorie needs based on high activity levels and training volume.",
    loader: () => import("@/components/calculators/Sports/TdeeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "plank-hold-progression",
    title: "Plank / Hold Time Progression",
    category: "sports",
    subcategory: "strength-lifting-conditioning",
    description: "Track core strength progression. Log and plan plank hold times to gradually build abdominal endurance and stability.",
    loader: () => import("@/components/calculators/Sports/PlankHoldProgressionCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "wilks-coefficient",
    title: "Wilks Coefficient Calculator",
    category: "sports",
    subcategory: "strength-lifting-conditioning",
    description: "Calculate your Wilks Score. Compare powerlifting strength across different body weight categories fairly.",
    loader: () => import("@/components/calculators/Sports/WilksCoefficientCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "body-fat-percentage",
    title: "Body Fat Percentage Calculator (Athletes)",
    category: "sports",
    subcategory: "strength-lifting-conditioning",
    description: "Estimate body fat percentage for athletes. Track body composition changes during cutting or bulking phases.",
    loader: () => import("@/components/calculators/Sports/BodyFatPercentageCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "plate-loading",
    title: "Plate Loading Calculator",
    category: "sports",
    subcategory: "strength-lifting-conditioning",
    description: "Calculate barbell plate loading. Find the exact combination of plates needed to reach a specific target weight on the bar.",
    loader: () => import("@/components/calculators/Sports/PlateLoadingCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "macronutrient-calculator",
    title: "Macronutrient Calculator (Sports)",
    category: "sports",
    subcategory: "strength-lifting-conditioning",
    description: "Calculate athlete macronutrient needs. Optimize protein, carb, and fat intake for performance recovery and muscle growth.",
    loader: () => import("@/components/calculators/Sports/MacronutrientCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "calorie-deficit-surplus",
    title: "Calorie Deficit / Surplus Calculator",
    category: "sports",
    subcategory: "strength-lifting-conditioning",
    description: "Plan calorie deficits or surpluses. Adjust energy intake precisely for weight cutting or mass gaining cycles.",
    loader: () => import("@/components/calculators/Sports/CalorieDeficitSurplusCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "fitness-age-calculator",
    title: "Fitness Age Calculator",
    category: "sports",
    subcategory: "strength-lifting-conditioning",
    description: "Estimate your fitness age. Compare your cardiovascular health and VO2max against age-related norms.",
    loader: () => import("@/components/calculators/Sports/FitnessAgeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "yoga-calories-burned",
    title: "Yoga Calories Burned Calculator",
    category: "sports",
    subcategory: "strength-lifting-conditioning",
    description: "Estimate calories burned during yoga. Calculate energy expenditure for Hatha, Vinyasa, or Bikram yoga sessions.",
    loader: () => import("@/components/calculators/Sports/YogaCaloriesBurnedCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "fantasy-team-points-projections",
    title: "Fantasy Team Points Projections Calculator",
    category: "sports",
    subcategory: "ball-sports-advanced-metrics",
    description: "Project fantasy sports points. Estimate team scores based on player stats for football, basketball, or soccer leagues.",
    loader: () => import("@/components/calculators/Sports/FantasyTeamPointsProjectionsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "betting-odds-payout-calculator",
    title: "Betting Odds & Payout Calculator",
    category: "sports",
    subcategory: "ball-sports-advanced-metrics",
    description: "Calculate potential betting payouts. Convert between Decimal, Fractional, and Moneyline odds to see your return.",
    loader: () => import("@/components/calculators/Sports/BettingOddsPayoutCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "soccer-league-table-points-gd",
    title: "Soccer League Table: Points & GD",
    category: "sports",
    subcategory: "ball-sports-advanced-metrics",
    description: "Calculate soccer league standings. Track points, goal differential, and ranking scenarios for your team.",
    loader: () => import("@/components/calculators/Sports/SoccerLeagueTablePointsGdCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "expected-goals-xg-helper",
    title: "xG (Expected Goals) Reading Helper",
    category: "sports",
    subcategory: "ball-sports-advanced-metrics",
    description: "Understand Expected Goals (xG). Interpret match statistics to analyze team performance beyond the final score.",
    loader: () => import("@/components/calculators/Sports/ExpectedGoalsXgHelperCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "basketball-efg-ts",
    title: "Basketball eFG% & TS% Calculator",
    category: "sports",
    subcategory: "ball-sports-advanced-metrics",
    description: "Calculate Effective Field Goal and True Shooting percentage. Measure basketball scoring efficiency accurately.",
    loader: () => import("@/components/calculators/Sports/BasketballEfgTsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "basketball-pace-ortg-drtg",
    title: "Basketball Pace & ORtg/DRtg",
    category: "sports",
    subcategory: "ball-sports-advanced-metrics",
    description: "Calculate Basketball Pace and Ratings. Analyze possessions per game and offensive/defensive efficiency metrics.",
    loader: () => import("@/components/calculators/Sports/BasketballPaceOrtgDrtgCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "baseball-ops-slg-obp",
    title: "Baseball OPS / SLG / OBP Calculator",
    category: "sports",
    subcategory: "ball-sports-advanced-metrics",
    description: "Calculate baseball sabermetrics. Find On-Base Plus Slugging (OPS), Slugging percentage, and On-Base Percentage instantly.",
    loader: () => import("@/components/calculators/Sports/BaseballOpsSlgObpCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "era-whip-calculator",
    title: "ERA & WHIP Calculator",
    category: "sports",
    subcategory: "ball-sports-advanced-metrics",
    description: "Calculate pitcher stats. Determine Earned Run Average (ERA) and Walks Plus Hits Per Inning Pitched (WHIP).",
    loader: () => import("@/components/calculators/Sports/EraWhipCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "win-probability-shift-wps",
    title: "Win Probability Shift (WPS) Estimator",
    category: "sports",
    subcategory: "ball-sports-advanced-metrics",
    description: "Estimate Win Probability Shift. Analyze how specific plays impact the likelihood of winning a game in real-time.",
    loader: () => import("@/components/calculators/Sports/WinProbabilityShiftWpsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "babip-calculator",
    title: "BABIP Calculator",
    category: "sports",
    subcategory: "ball-sports-advanced-metrics",
    description: "Calculate Batting Average on Balls in Play (BABIP). Assess whether a pitcher or hitter is lucky or skilled.",
    loader: () => import("@/components/calculators/Sports/BabipCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ground-ball-to-fly-ball-ratio-gb-fb",
    title: "Ground Ball to Fly Ball Ratio (GB/FB)",
    category: "sports",
    subcategory: "ball-sports-advanced-metrics",
    description: "Calculate GB/FB ratio. Analyze a pitcher's tendency to induce grounders versus fly balls.",
    loader: () => import("@/components/calculators/Sports/GroundBallToFlyBallRatioGbFbCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "golf-handicap-differential-index",
    title: "Golf Handicap Differential & Index",
    category: "sports",
    subcategory: "individual-game-management",
    description: "Calculate Golf Handicap Differential. Determine your index based on course rating and slope difficulty.",
    loader: () => import("@/components/calculators/Sports/GolfHandicapDifferentialIndexCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "golf-expected-putts-per-round",
    title: "Golf Expected Putts per Round",
    category: "sports",
    subcategory: "individual-game-management",
    description: "Estimate expected putts per round. Track putting performance against benchmarks to improve your short game.",
    loader: () => import("@/components/calculators/Sports/GolfExpectedPuttsPerRoundCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "tennis-serve-speed",
    title: "Tennis Serve Speed Calculator",
    category: "sports",
    subcategory: "individual-game-management",
    description: "Calculate tennis serve speed. Estimate velocity based on the distance and time between impact and bounce.",
    loader: () => import("@/components/calculators/Sports/TennisServeSpeedCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "tennis-elo-rating-progress",
    title: "Tennis ELO / Rating Progress",
    category: "sports",
    subcategory: "individual-game-management",
    description: "Track Tennis ELO rating progress. Understand how match wins and losses affect your player ranking.",
    loader: () => import("@/components/calculators/Sports/TennisEloRatingProgressCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "rowing-split-500m-pace",
    title: "Rowing Split (500m) ↔ Pace",
    category: "sports",
    subcategory: "individual-game-management",
    description: "Convert rowing splits to pace. Calculate 500m split times based on total distance and duration for ergometer training.",
    loader: () => import("@/components/calculators/Sports/RowingSplit500mPaceCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "climbing-grade-converter-yds-french-eu",
    title: "Climbing Grade Converter",
    category: "sports",
    subcategory: "individual-game-management",
    description: "Convert climbing grades. Switch between YDS, French, and European scales to understand route difficulty worldwide.",
    loader: () => import("@/components/calculators/Sports/ClimbingGradeConverterYdsFrenchEuCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "tournament-bracket-seeding-helper",
    title: "Tournament Bracket Seeding Helper",
    category: "sports",
    subcategory: "individual-game-management",
    description: "Organize tournament brackets. Seed players or teams correctly to ensure fair matchups in knockout rounds.",
    loader: () => import("@/components/calculators/Sports/TournamentBracketSeedingHelperCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "golf-handicap-calculator",
    title: "Golf Handicap Calculator",
    category: "sports",
    subcategory: "individual-game-management",
    description: "Calculate your official Golf Handicap. Enter your scores to track improvement and compete fairly with others.",
    loader: () => import("@/components/calculators/Sports/GolfHandicapCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bowling-score-calculator",
    title: "Bowling Score Calculator",
    category: "sports",
    subcategory: "individual-game-management",
    description: "Calculate bowling scores. Simulate frames, strikes, and spares to predict your final game score.",
    loader: () => import("@/components/calculators/Sports/BowlingScoreCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "fina-points-calculator",
    title: "FINA Points Calculator",
    category: "sports",
    subcategory: "individual-game-management",
    description: "Calculate FINA swimming points. Convert race times into official FINA points for ranking comparison.",
    loader: () => import("@/components/calculators/Sports/FinaPointsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "swim-performance-level-calculator",
    title: "Swim Performance Level Calculator",
    category: "sports",
    subcategory: "individual-game-management",
    description: "Assess swim performance level. Compare your times against age-group standards to see where you rank.",
    loader: () => import("@/components/calculators/Sports/SwimPerformanceLevelCalculator"),
    urlStyle: "flat"
  },
   
   
   
    
    {
    slug: "pizza-size-price-comparison",
    title: "Pizza Size/Price Comparison Calculator",
    category: "funny",
    subcategory: "food-social-life",
    description: "Solve the ultimate dinner dilemma. Calculate price per square inch to see if two medium pizzas are a better deal than one large.",
    loader: () => import("@/components/calculators/Funny/PizzaSizePriceComparisonCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "pizza-slices-per-person-regret-index",
    title: "Pizza Slices per Person & Regret Index",
    category: "funny",
    subcategory: "food-social-life",
    description: "Plan your pizza party perfectly. Estimate slices per person and calculate the potential 'regret index' for overeating.",
    loader: () => import("@/components/calculators/Funny/PizzaSlicesPerPersonRegretIndexCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "bbq-charcoal-splitter",
    title: "BBQ 'Who Brings the Charcoal?' Splitter",
    category: "funny",
    subcategory: "food-social-life",
    description: "Settle BBQ disputes fairly. A randomizer tool to decide who buys the charcoal, who brings the meat, and who just brings the vibes.",
    loader: () => import("@/components/calculators/Funny/BbqCharcoalSplitterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "coffee-strength-vs-productivity-meme",
    title: "Coffee Strength vs Productivity Score",
    category: "funny",
    subcategory: "food-social-life",
    description: "Chart your caffeine intake against work output. Find the sweet spot between 'peak productivity' and 'jittery chaos'.",
    loader: () => import("@/components/calculators/Funny/CoffeeStrengthVsProductivityMemeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "hot-dog-bun-mismatch-solver",
    title: "Hot-Dog to Bun Mismatch Solver",
    category: "funny",
    subcategory: "food-social-life",
    description: "Solve the supermarket conspiracy. Calculate exactly how many packs of hot dogs and buns you need to buy to have zero leftovers.",
    loader: () => import("@/components/calculators/Funny/HotDogBunMismatchSolverCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "sugar-in-my-tea-dramatic",
    title: "How Much Sugar Is in My Tea? (Dramatic)",
    category: "funny",
    subcategory: "food-social-life",
    description: "Visualize your sugar intake. See a dramatic representation of exactly how many sugar cubes you are drinking in your daily tea.",
    loader: () => import("@/components/calculators/Funny/SugarInMyTeaDramaticCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "first-date-awkwardness-meter",
    title: "First-Date Awkwardness Meter",
    category: "funny",
    subcategory: "food-social-life",
    description: "Rate your date's potential awkwardness. Input variables like 'talks about ex' or 'forgot wallet' to predict the night's outcome.",
    loader: () => import("@/components/calculators/Funny/FirstDateAwkwardnessMeterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "donut-calculator",
    title: "Donut Calculator",
    category: "funny",
    subcategory: "food-social-life",
    description: "Calculate the optimal number of donuts for the office. Adjust for team size, hunger levels, and the 'it is Friday' factor.",
    loader: () => import("@/components/calculators/Funny/DonutCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ideal-egg-boiling-calculator",
    title: "Ideal Egg Boiling Calculator",
    category: "funny",
    subcategory: "food-social-life",
    description: "Boil the perfect egg every time. Calculate the exact cooking time for soft, medium, or hard-boiled eggs based on altitude and size.",
    loader: () => import("@/components/calculators/Funny/IdealEggBoilingCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "coffee-addiction-meter",
    title: "Coffee Addiction Meter",
    category: "funny",
    subcategory: "food-social-life",
    description: "Assess your coffee dependency level. Answer fun questions to see if you run on caffeine or actual sleep.",
    loader: () => import("@/components/calculators/Funny/CoffeeAddictionMeterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "zombie-survival-calculator",
    title: "Zombie Survival Calculator",
    category: "funny",
    subcategory: "food-social-life",
    description: "Estimate your survival odds. Calculate how long you would last in a zombie apocalypse based on cardio, skills, and weapon choice.",
    loader: () => import("@/components/calculators/Funny/ZombieSurvivalCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "love-meter",
    title: "Love Meter (Name Compatibility)",
    category: "funny",
    subcategory: "food-social-life",
    description: "Test name compatibility. A classic fun algorithm to see if you and your crush are a 100% match or destined for doom.",
    loader: () => import("@/components/calculators/Funny/LoveMeterCalculator"),
    urlStyle: "flat"
  },
    
    {
    slug: "meetings-wasted-time-counter",
    title: "Meetings Wasted-Time Counter",
    category: "funny",
    subcategory: "tech-work-life",
    description: "Calculate the cost of useless meetings. Input attendees and average salary to see how much money is burning while you talk.",
    loader: () => import("@/components/calculators/Funny/MeetingsWastedTimeCounterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "email-cost-estimator-energy",
    title: "Cost to Send This Email (Energy/kWh)",
    category: "funny",
    subcategory: "tech-work-life",
    description: "Estimate the environmental cost of your emails. Calculate the energy usage and carbon footprint of sending that 'Reply All' message.",
    loader: () => import("@/components/calculators/Funny/EmailCostEstimatorEnergyCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "tab-overload-anxiety-score",
    title: "Tab Overload Anxiety Score",
    category: "funny",
    subcategory: "tech-work-life",
    description: "Measure your browser tab anxiety. Calculate a stress score based on the number of open tabs you are too afraid to close.",
    loader: () => import("@/components/calculators/Funny/TabOverloadAnxietyScoreCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "commit-message-quality-judge",
    title: "Commit Message Quality Judge",
    category: "funny",
    subcategory: "tech-work-life",
    description: "Rate your git commit messages. Are you writing useful descriptions or just 'wip' and 'fix'? Get a fun quality score.",
    loader: () => import("@/components/calculators/Funny/CommitMessageQualityJudgeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "keyboard-clicks-per-day",
    title: "Keyboard Clicks per Day Estimator",
    category: "funny",
    subcategory: "tech-work-life",
    description: "Estimate your daily typing volume. Calculate how many millions of times you click your keyboard over a lifetime of work.",
    loader: () => import("@/components/calculators/Funny/KeyboardClicksPerDayCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "meme-virality-calculator",
    title: "Meme Virality Calculator",
    category: "funny",
    subcategory: "tech-work-life",
    description: "Predict meme success. A tongue-in-cheek calculator to estimate the viral potential of your latest internet creation.",
    loader: () => import("@/components/calculators/Funny/MemeViralityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "calculator-word-generator-upside-down",
    title: "Calculator Word Generator (Upside-Down)",
    category: "funny",
    subcategory: "tech-work-life",
    description: "Write words on a calculator. Generate the numbers needed to spell 'HELLO', 'ZOMBIE', and other classics when turned upside down.",
    loader: () => import("@/components/calculators/Funny/CalculatorWordGeneratorUpsideDownCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "lost-socks-calculator",
    title: "Lost Socks Calculator",
    category: "funny",
    subcategory: "home-pets-pop-culture",
    description: "Solve the laundry mystery. Estimate the probability of losing a sock based on wash frequency and dryer portal theories.",
    loader: () => import("@/components/calculators/Funny/LostSocksCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dog-zoomies-energy-meter",
    title: "Dog Zoomies Energy Release Meter",
    category: "funny",
    subcategory: "home-pets-pop-culture",
    description: "Measure dog energy bursts. Calculate the kinetic energy of your dog's 3 AM zoomies based on speed and destruction level.",
    loader: () => import("@/components/calculators/Funny/DogZoomiesEnergyMeterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cat-ignore-o-meter",
    title: "Cat 'Ignore-o-Meter'",
    category: "funny",
    subcategory: "home-pets-pop-culture",
    description: "Predict cat acknowledgement. Calculate the extremely low probability that your cat will actually respond when you call its name.",
    loader: () => import("@/components/calculators/Funny/CatIgnoreOMeterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "plant-watering-procrastination-index",
    title: "Plant Watering Procrastination Index",
    category: "funny",
    subcategory: "home-pets-pop-culture",
    description: "Track plant neglect. Calculate how long you can 'procrastinate' watering your plants before they officially give up on you.",
    loader: () => import("@/components/calculators/Funny/PlantWateringProcrastinationIndexCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "netflix-one-more-episode-timer",
    title: "Netflix 'Just One More Episode' Timer",
    category: "funny",
    subcategory: "home-pets-pop-culture",
    description: "Manage binge-watching risks. Calculate how much of your life will be consumed if you watch 'just one more episode' tonight.",
    loader: () => import("@/components/calculators/Funny/NetflixOneMoreEpisodeTimerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "death-by-caffeine",
    title: "Death by Caffeine (Max Safe Intake)",
    category: "funny",
    subcategory: "home-pets-pop-culture",
    description: "Calculate your caffeine limit. Find out exactly how many cups of coffee would be lethal (so you can stop safely before that).",
    loader: () => import("@/components/calculators/Funny/DeathByCaffeineCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "social-media-time-alternatives",
    title: "Social Media Time Alternatives",
    category: "funny",
    subcategory: "home-pets-pop-culture",
    description: "Reclaim your time. See what new skills or hobbies you could have mastered in the time spent scrolling social media this year.",
    loader: () => import("@/components/calculators/Funny/SocialMediaTimeAlternativesCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "pokemon-go-weight-loss",
    title: "Pokémon GO Weight Loss Calculator",
    category: "funny",
    subcategory: "home-pets-pop-culture",
    description: "Gamify your fitness. Estimate how many calories you burn while walking to hatch eggs and catch Pokémon.",
    loader: () => import("@/components/calculators/Funny/PokemonGoWeightLossCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "life-value-in-tacos",
    title: "Life Value Estimator (Worth in Tacos)",
    category: "funny",
    subcategory: "home-pets-pop-culture",
    description: "Convert your net worth to tacos. See how rich you truly are by measuring your assets in units of delicious tacos.",
    loader: () => import("@/components/calculators/Funny/LifeValueInTacosCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "drake-equation-calculator",
    title: "Drake Equation Calculator",
    category: "funny",
    subcategory: "home-pets-pop-culture",
    description: "Estimate alien life. Use the famous Drake Equation to calculate the number of active, communicative extraterrestrial civilizations.",
    loader: () => import("@/components/calculators/Funny/DrakeEquationCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "vacation-budget-reality-check",
    title: "Vacation Budget Reality Check",
    category: "funny",
    subcategory: "absurd-travel-adventure",
    description: "Budget your dream trip vs reality. A fun tool to see how far your actual savings will get you (maybe just to the backyard?).",
    loader: () => import("@/components/calculators/Funny/VacationBudgetRealityCheckCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "loop-the-loop-speed-calculator",
    title: "Loop-the-Loop Speed Calculator",
    category: "funny",
    subcategory: "absurd-travel-adventure",
    description: "Physics for fun. Calculate the minimum speed a car needs to successfully drive through a vertical loop-the-loop without falling.",
    loader: () => import("@/components/calculators/Funny/LoopTheLoopSpeedCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "rocks-to-flood-country",
    title: "Rocks to Flood a Country Estimator",
    category: "funny",
    subcategory: "absurd-travel-adventure",
    description: "Absurd physics scenario. Calculate how many rocks you would need to throw into the ocean to theoretically flood a specific country.",
    loader: () => import("@/components/calculators/Funny/RocksToFloodCountryCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "penguin-slap-power",
    title: "Penguin Slap Power Calculator",
    category: "funny",
    subcategory: "absurd-travel-adventure",
    description: "Calculate slap physics. Estimate the thermodynamic energy converted if you theoretically slapped a penguin (strictly hypothetical).",
    loader: () => import("@/components/calculators/Funny/PenguinSlapPowerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "nickels-to-crush-calculator",
    title: "Nickels to Crush Calculator",
    category: "funny",
    subcategory: "absurd-travel-adventure",
    description: "Hydraulic press simulator. Calculate how many nickels stacked on top of an object would be heavy enough to crush it.",
    loader: () => import("@/components/calculators/Funny/NickelsToCrushCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "black-hole-sun-impact",
    title: "Black Hole Sun Impact Calculator",
    category: "funny",
    subcategory: "absurd-travel-adventure",
    description: "Apocalypse calculator. What would happen to Earth's orbit if the sun instantly turned into a black hole of the same mass?",
    loader: () => import("@/components/calculators/Funny/BlackHoleSunImpactCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "time-travel-energy-requirement",
    title: "Time Travel Energy Requirement",
    category: "funny",
    subcategory: "absurd-travel-adventure",
    description: "Sci-fi physics. Estimate the immense energy required to travel back in time based on theoretical warp drive metrics.",
    loader: () => import("@/components/calculators/Funny/TimeTravelEnergyRequirementCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "medical-tourism-cost-saver",
    title: "Medical Tourism Cost Saver",
    category: "funny",
    subcategory: "absurd-travel-adventure",
    description: "Calculate savings on medical procedures. Compare the cost of surgery abroad versus domestic prices (plus a recovery vacation).",
    loader: () => import("@/components/calculators/Funny/MedicalTourismCostSaverCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "crinkle-crankle-wall-brick-saver",
    title: "Crinkle Crankle Wall Brick Saver",
    category: "funny",
    subcategory: "absurd-travel-adventure",
    description: "Optimize brick usage. Calculate how many bricks you save by building a wavy 'crinkle crankle' wall instead of a straight one.",
    loader: () => import("@/components/calculators/Funny/CrinkleCrankleWallBrickSaverCalculator"),
    urlStyle: "flat"
  },
    
    
  
   
  
   
    {
    slug: "drywall-area-sheets",
    title: "Drywall Area & Sheets Calculator",
    category: "construction",
    subcategory: "interior-surfaces-finishes",
    description: "Calculate number of drywall sheets for walls/ceilings.",
    loader: () => import("@/components/calculators/Construction/DrywallAreaSheetsCalculator"),
    urlStyle: "flat"
  },
  
    {
    slug: "concrete-slab-volume",
    title: "Concrete Slab Volume Calculator",
    category: "construction",
    subcategory: "concrete-masonry-foundations",
    description: "Calculate the exact volume of concrete needed for slabs, patios, or driveways. Avoid over-ordering and minimize material waste.",
    loader: () => import("@/components/calculators/Construction/ConcreteSlabVolumeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "concrete-footing-foundation",
    title: "Concrete Footing & Foundation Calculator",
    category: "construction",
    subcategory: "concrete-masonry-foundations",
    description: "Estimate concrete volume for footings and foundations. Calculate the amount of rebar needed for structural reinforcement.",
    loader: () => import("@/components/calculators/Construction/ConcreteFootingFoundationCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "concrete-block-cmu-wall",
    title: "Concrete Block (CMU) Wall Calculator",
    category: "construction",
    subcategory: "concrete-masonry-foundations",
    description: "Determine the perfect concrete mix ratio (cement, sand, gravel). Essential for strong, durable, and professional-grade DIY concrete projects.",
    loader: () => import("@/components/calculators/Construction/ConcreteBlockCmuWallCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "rebar-spacing-quantity",
    title: "Rebar Spacing & Quantity Calculator",
    category: "construction",
    subcategory: "concrete-masonry-foundations",
    description: "Calculate the concrete volume required to fill fence post or deck support holes based on depth and diameter.",
    loader: () => import("@/components/calculators/Construction/RebarSpacingQuantityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "mortar-mix-ratio-bag",
    title: "Mortar Mix Ratio & Bag Calculator",
    category: "construction",
    subcategory: "concrete-masonry-foundations",
    description: "Estimate the concrete curing time. Determine how long your slab needs to set before it can be walked on or support heavy loads.",
    loader: () => import("@/components/calculators/Construction/MortarMixRatioBagCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cement-sand-aggregate-ratio",
    title: "Cement, Sand & Aggregate Ratio Calculator",
    category: "construction",
    subcategory: "concrete-masonry-foundations",
    description: "Calculate the number of concrete masonry units (CMU) or cinder blocks needed for walls and structures.",
    loader: () => import("@/components/calculators/Construction/CementSandAggregateRatioCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "concrete-weight-yield",
    title: "Concrete Weight & Yield Calculator",
    category: "construction",
    subcategory: "concrete-masonry-foundations",
    description: "Estimate the volume of mortar required for laying concrete block walls. Minimize waste and ensure enough material is on hand.",
    loader: () => import("@/components/calculators/Construction/ConcreteWeightYieldCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "concrete-curing-time",
    title: "Concrete Curing Time Estimator",
    category: "construction",
    subcategory: "concrete-masonry-foundations",
    description: "Concrete Curing Time Estimator Estimate the time required for concrete to reach its full strength. Factors in ambient temperature, mix type, and curing methods to ensure durability and safety before removing forms or applying loads.",
    loader: () => import("@/components/calculators/Construction/ConcreteCuringTimeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "brick-calculator",
    title: "Brick Calculator",
    category: "construction",
    subcategory: "concrete-masonry-foundations",
    description: "Brick Calculator Calculate the number of bricks and amount of mortar needed for your wall project. Enter wall dimensions and brick size to get precise material estimates and minimize waste.",
    loader: () => import("@/components/calculators/Construction/BrickCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "retaining-wall-calculator",
    title: "Retaining Wall Calculator",
    category: "construction",
    subcategory: "concrete-masonry-foundations",
    description: "Retaining Wall Calculator Plan your retaining wall project with precision. Calculate the number of retaining blocks, gravel backing, and drainage materials needed to build a stable and long-lasting structure.",
    loader: () => import("@/components/calculators/Construction/RetainingWallCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "deck-board-joist-spacing",
    title: "Deck Board & Joist Spacing Calculator",
    category: "construction",
    subcategory: "lumber-decking-fencing",
    description: "Calculate deck board quantity and joist spacing.",
    loader: () => import("@/components/calculators/Construction/DeckBoardJoistSpacingCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "stair-tread-riser-dimensions",
    title: "Stair Tread & Riser Dimensions Calculator",
    category: "construction",
    subcategory: "lumber-decking-fencing",
    description: "Calculate riser height, tread depth, and stringer length.",
    loader: () => import("@/components/calculators/Construction/StairTreadRiserDimensionsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "trim-baseboard-length-estimator",
    title: "Trim & Baseboard Length Estimator",
    category: "construction",
    subcategory: "lumber-decking-fencing",
    description: "Estimate total linear feet of trim or baseboard needed.",
    loader: () => import("@/components/calculators/Construction/TrimBaseboardLengthEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "hardwood-plank-quantity",
    title: "Hardwood Plank Quantity Calculator",
    category: "construction",
    subcategory: "lumber-decking-fencing",
    description: "Calculate number of hardwood planks for flooring.",
    loader: () => import("@/components/calculators/Construction/HardwoodPlankQuantityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "laminate-flooring-waste-allowance",
    title: "Laminate Flooring Waste Allowance Calculator",
    category: "construction",
    subcategory: "lumber-decking-fencing",
    description: "Estimate extra laminate flooring needed for cuts/waste.",
    loader: () => import("@/components/calculators/Construction/LaminateFlooringWasteAllowanceCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "carpet-roll-waste",
    title: "Carpet Roll & Waste Calculator",
    category: "construction",
    subcategory: "lumber-decking-fencing",
    description: "Calculate carpet rolls required including installation waste.",
    loader: () => import("@/components/calculators/Construction/CarpetRollWasteCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "board-foot",
    title: "Board Foot Calculator",
    category: "construction",
    subcategory: "lumber-decking-fencing",
    description: "Calculate lumber volume in board feet for pricing.",
    loader: () => import("@/components/calculators/Construction/BoardFootCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "fence-post-material-linear-feet",
    title: "Fence Post & Material Calculator",
    category: "construction",
    subcategory: "lumber-decking-fencing",
    description: "Estimate posts, rails, and pickets for fencing.",
    loader: () => import("@/components/calculators/Construction/FencePostMaterialLinearFeetCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "tile-area-grout",
    title: "Tile Area & Grout Calculator",
    category: "construction",
    subcategory: "lumber-decking-fencing",
    description: "Calculate tiles and grout needed for floor/wall areas.",
    loader: () => import("@/components/calculators/Construction/TileAreaGroutCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "flooring-material-cost",
    title: "Flooring Material Cost Estimator",
    category: "construction",
    subcategory: "lumber-decking-fencing",
    description: "Estimate total cost of flooring materials.",
    loader: () => import("@/components/calculators/Construction/FlooringMaterialCostCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "baluster-spacing-calculator",
    title: "Baluster Spacing Calculator",
    category: "construction",
    subcategory: "lumber-decking-fencing",
    description: "Calculate even spacing for railing balusters/spindles.",
    loader: () => import("@/components/calculators/Construction/BalusterSpacingCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "paint-coverage-gallons",
    title: "Paint Coverage & Gallons Needed Calculator",
    category: "construction",
    subcategory: "interior-surfaces-finishes",
    description: "Estimate gallons of paint required for room coverage.",
    loader: () => import("@/components/calculators/Construction/PaintCoverageGallonsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "wallpaper-roll-coverage",
    title: "Wallpaper Roll Coverage Calculator",
    category: "construction",
    subcategory: "interior-surfaces-finishes",
    description: "Calculate number of wallpaper rolls needed for a room.",
    loader: () => import("@/components/calculators/Construction/WallpaperRollCoverageCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ceiling-tile-quantity",
    title: "Ceiling Tile Quantity Calculator",
    category: "construction",
    subcategory: "interior-surfaces-finishes",
    description: "Estimate tiles needed for drop ceilings.",
    loader: () => import("@/components/calculators/Construction/CeilingTileQuantityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "plaster-volume-bag",
    title: "Plaster Volume & Bag Estimator",
    category: "construction",
    subcategory: "interior-surfaces-finishes",
    description: "Calculate plaster volume and bags for wall repairs.",
    loader: () => import("@/components/calculators/Construction/PlasterVolumeBagCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "acoustic-panel-area",
    title: "Acoustic Panel Area Planner",
    category: "construction",
    subcategory: "interior-surfaces-finishes",
    description: "Calculate acoustic panel coverage for soundproofing.",
    loader: () => import("@/components/calculators/Construction/AcousticPanelAreaCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "joint-compound-amount",
    title: "Joint Compound Amount Calculator",
    category: "construction",
    subcategory: "interior-surfaces-finishes",
    description: "Estimate joint compound needed for drywall finishing.",
    loader: () => import("@/components/calculators/Construction/JointCompoundAmountCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "plywood-calculator",
    title: "Plywood Calculator",
    category: "construction",
    subcategory: "interior-surfaces-finishes",
    description: "Calculate number of plywood sheets for subfloors/sheathing.",
    loader: () => import("@/components/calculators/Construction/PlywoodCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "roof-pitch-slope-angle",
    title: "Roof Pitch & Slope Angle Calculator",
    category: "construction",
    subcategory: "roofing-siding-site-prep",
    description: "Calculate roof pitch, slope angle, and rafter length.",
    loader: () => import("@/components/calculators/Construction/RoofPitchSlopeAngleCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "roof-shingle-bundle",
    title: "Roof Shingle & Bundle Calculator",
    category: "construction",
    subcategory: "roofing-siding-site-prep",
    description: "Estimate bundles of shingles for roof coverage.",
    loader: () => import("@/components/calculators/Construction/RoofShingleBundleCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "metal-roof-panel-coverage",
    title: "Metal Roofing Panel Coverage Calculator",
    category: "construction",
    subcategory: "roofing-siding-site-prep",
    description: "Calculate metal panels needed for roofing projects.",
    loader: () => import("@/components/calculators/Construction/MetalRoofPanelCoverageCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "roof-underlayment-roll",
    title: "Roof Underlayment Roll Estimator",
    category: "construction",
    subcategory: "roofing-siding-site-prep",
    description: "Estimate rolls of underlayment for roof protection.",
    loader: () => import("@/components/calculators/Construction/RoofUnderlaymentRollCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "siding-panel-coverage",
    title: "Siding Panel Coverage Calculator",
    category: "construction",
    subcategory: "roofing-siding-site-prep",
    description: "Calculate siding panels required for exterior walls.",
    loader: () => import("@/components/calculators/Construction/SidingPanelCoverageCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "gutter-size",
    title: "Roof Drainage (Gutter Size) Calculator",
    category: "construction",
    subcategory: "roofing-siding-site-prep",
    description: "Determine appropriate gutter size based on roof area.",
    loader: () => import("@/components/calculators/Construction/GutterSizeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "hip-roof-calculator",
    title: "Hip Roof Calculator",
    category: "construction",
    subcategory: "roofing-siding-site-prep",
    description: "Calculate area and materials for hip roof designs.",
    loader: () => import("@/components/calculators/Construction/HipRoofCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "gable-roof-calculator",
    title: "Gable Roof Calculator",
    category: "construction",
    subcategory: "roofing-siding-site-prep",
    description: "Calculate area and materials for gable roof designs.",
    loader: () => import("@/components/calculators/Construction/GableRoofCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "excavation-calculator",
    title: "Excavation Calculator",
    category: "construction",
    subcategory: "roofing-siding-site-prep",
    description: "Estimate soil volume to be removed for excavation.",
    loader: () => import("@/components/calculators/Construction/ExcavationCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "insulation-r-value-requirement",
    title: "Insulation R-Value Requirement Calculator",
    category: "construction",
    subcategory: "insulation-hvac-energy",
    description: "Determine recommended insulation R-values by zone.",
    loader: () => import("@/components/calculators/Construction/InsulationRValueRequirementCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "hvac-btu-requirement",
    title: "HVAC BTU Requirement Calculator",
    category: "construction",
    subcategory: "insulation-hvac-energy",
    description: "Calculate BTU output needed for heating/cooling.",
    loader: () => import("@/components/calculators/Construction/HvacBtuRequirementCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "duct-size-airflow",
    title: "Duct Size & Airflow Calculator",
    category: "construction",
    subcategory: "insulation-hvac-energy",
    description: "Estimate duct size for efficient airflow.",
    loader: () => import("@/components/calculators/Construction/DuctSizeAirflowCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "heating-cost-per-square-foot",
    title: "Heating Cost per Square Foot Estimator",
    category: "construction",
    subcategory: "insulation-hvac-energy",
    description: "Estimate heating costs based on area and fuel type.",
    loader: () => import("@/components/calculators/Construction/HeatingCostPerSquareFootCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "energy-efficiency-savings",
    title: "Energy Efficiency Savings Estimator",
    category: "construction",
    subcategory: "insulation-hvac-energy",
    description: "Calculate potential savings from energy upgrades.",
    loader: () => import("@/components/calculators/Construction/EnergyEfficiencySavingsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cfm-calculator",
    title: "CFM Calculator",
    category: "construction",
    subcategory: "insulation-hvac-energy",
    description: "Calculate Cubic Feet per Minute (CFM) for ventilation.",
    loader: () => import("@/components/calculators/Construction/CfmCalculator"),
    urlStyle: "flat"
  },
// --- AUTOMOTIVE CALCULATORS ---

  
   
   
    {
    slug: "trip-fuel-cost",
    title: "Trip Fuel Cost Calculator",
    category: "automotive",
    subcategory: "consumption-costs-travel",
    description: "Calculate trip cost based on distance, fuel efficiency, and price.",
    loader: () => import("@/components/calculators/Automotive/TripFuelCostCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "fuel-economy-converter",
    title: "Fuel Economy Converter",
    category: "automotive",
    subcategory: "consumption-costs-travel",
    description: "Convert fuel economy between MPG and L/100km.",
    loader: () => import("@/components/calculators/Automotive/FuelEconomyConverterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "annual-fuel-cost-break-even",
    title: "Annual Fuel Cost & Break-Even",
    category: "automotive",
    subcategory: "consumption-costs-travel",
    description: "Compare annual fuel costs for gas, electric, and E85 vehicles.",
    loader: () => import("@/components/calculators/Automotive/AnnualFuelCostBreakEvenCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-kwh-per-100mi-cost-per-mile",
    title: "EV kWh per 100 mi ↔ Cost per Mile",
    category: "automotive",
    subcategory: "consumption-costs-travel",
    description: "Convert EV efficiency to cost per mile driven.",
    loader: () => import("@/components/calculators/Automotive/EvKwhCostPerMileCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-charging-cost-time",
    title: "EV Charging Cost & Time Estimator",
    category: "automotive",
    subcategory: "consumption-costs-travel",
    description: "Estimate time and cost to charge an EV at home or public stations.",
    loader: () => import("@/components/calculators/Automotive/EvChargingCostTimeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ice-vs-ev-ownership-cost-5y",
    title: "ICE vs EV Ownership Cost (5 years)",
    category: "automotive",
    subcategory: "consumption-costs-travel",
    description: "Compare total ownership costs of gas vs. electric cars over 5 years.",
    loader: () => import("@/components/calculators/Automotive/IceVsEvOwnershipCostCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "carbon-emissions-per-trip",
    title: "Carbon Emissions per Trip",
    category: "automotive",
    subcategory: "consumption-costs-travel",
    description: "Estimate CO2 emissions for a specific trip.",
    loader: () => import("@/components/calculators/Automotive/CarbonEmissionsPerTripCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "tco-total-cost-ownership",
    title: "Total Cost of Ownership (TCO) Calculator",
    category: "automotive",
    subcategory: "consumption-costs-travel",
    description: "Calculate the true long-term cost of owning a vehicle.",
    loader: () => import("@/components/calculators/Automotive/TcoCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "cost-per-mile-km",
    title: "Cost Per Mile (Per Kilometer) Calculator",
    category: "automotive",
    subcategory: "consumption-costs-travel",
    description: "Determine the exact cost per mile or km to drive your car.",
    loader: () => import("@/components/calculators/Automotive/CostPerMileCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "tire-size-comparison",
    title: "Tire Size Comparison",
    category: "automotive",
    subcategory: "tires-wheels-speedometer",
    description: "Compare dimensions and differences between two tire sizes.",
    loader: () => import("@/components/calculators/Automotive/TireSizeComparisonCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "speedometer-error",
    title: "Speedometer Error",
    category: "automotive",
    subcategory: "tires-wheels-speedometer",
    description: "Calculate speedometer reading error due to tire size changes.",
    loader: () => import("@/components/calculators/Automotive/SpeedometerErrorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "wheel-offset-backspacing",
    title: "Wheel Offset/Backspacing Calculator",
    category: "automotive",
    subcategory: "tires-wheels-speedometer",
    description: "Calculate wheel position changes with different offsets.",
    loader: () => import("@/components/calculators/Automotive/WheelOffsetBackspacingCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "tire-revs-per-mile-rpm-speed",
    title: "Tire Revolutions per Mile & RPM @ Speed",
    category: "automotive",
    subcategory: "tires-wheels-speedometer",
    description: "Estimate engine RPM at specific speeds based on tire size.",
    loader: () => import("@/components/calculators/Automotive/TireRevsPerMileRpmCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "final-drive-gear-ratio-speed",
    title: "Final Drive & Gear Ratio Speed Calculator",
    category: "automotive",
    subcategory: "tires-wheels-speedometer",
    description: "Calculate vehicle speed based on gear ratios and tire size.",
    loader: () => import("@/components/calculators/Automotive/FinalDriveGearRatioSpeedCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "shift-point-rpm-drop",
    title: "Shift Point RPM Drop Estimator",
    category: "automotive",
    subcategory: "tires-wheels-speedometer",
    description: "Estimate RPM drop when shifting gears.",
    loader: () => import("@/components/calculators/Automotive/ShiftPointRpmDropCalculator"),
    urlStyle: "flat"
  },
   
    
    {
    slug: "down-payment-impact-payoff-time",
    title: "Down Payment Impact & Payoff Time",
    category: "automotive",
    subcategory: "financing-leasing-value",
    description: "See how down payments affect monthly costs and payoff time.",
    loader: () => import("@/components/calculators/Automotive/DownPaymentImpactPayoffCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "depreciation-curve-estimator",
    title: "Depreciation Curve Estimator",
    category: "automotive",
    subcategory: "financing-leasing-value",
    description: "Estimate vehicle value loss over time by segment.",
    loader: () => import("@/components/calculators/Automotive/DepreciationCurveEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "insurance-cost-per-year",
    title: "Insurance Cost per Year",
    category: "automotive",
    subcategory: "financing-leasing-value",
    description: "Estimate annual insurance premiums based on simple factors.",
    loader: () => import("@/components/calculators/Automotive/InsuranceCostPerYearCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "out-the-door-tax-title-fees",
    title: "Sales Tax, Title & Fees Out-the-Door Estimator",
    category: "automotive",
    subcategory: "financing-leasing-value",
    description: "Estimate total \"out-the-door\" price including all fees.",
    loader: () => import("@/components/calculators/Automotive/OutTheDoorEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "used-car-value-estimator",
    title: "Used Car Value Estimator",
    category: "automotive",
    subcategory: "financing-leasing-value",
    description: "Estimate trade-in and private party value of used cars.",
    loader: () => import("@/components/calculators/Automotive/UsedCarValueEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "low-apr-vs-cashback-incentive",
    title: "Low APR vs. Cash Back Incentive Calculator",
    category: "automotive",
    subcategory: "financing-leasing-value",
    description: "Decide between low interest rates or cash rebates.",
    loader: () => import("@/components/calculators/Automotive/LowAprVsCashBackCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "oil-change-interval-planner",
    title: "Oil Change Interval Planner",
    category: "automotive",
    subcategory: "maintenance-capacity",
    description: "Plan optimal oil change schedules based on driving habits.",
    loader: () => import("@/components/calculators/Automotive/OilChangeIntervalPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "car-loan-payment-amortization",
    title: "Car Loan Payment & Amortization Calculator",
    category: "automotive",
    subcategory: "financing-leasing-value",
    description: "Calculate monthly car loan payments and interest.",
    loader: () => import("@/components/calculators/Automotive/CarLoanPaymentAmortizationCalculator"),
    urlStyle: "flat"
  },
   
    {
    slug: "brake-wear-estimator",
    title: "Brake Pad/Rotors Wear Estimator",
    category: "automotive",
    subcategory: "maintenance-capacity",
    description: "Estimate remaining life of brake pads and rotors.",
    loader: () => import("@/components/calculators/Automotive/BrakePadWearEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "towing-capacity-safety-margin",
    title: "Towing Capacity Safety Margin Checker",
    category: "automotive",
    subcategory: "maintenance-capacity",
    description: "Check if your load is within safe towing limits.",
    loader: () => import("@/components/calculators/Automotive/TowingCapacitySafetyMarginCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "payload-gvwr-utilization",
    title: "Payload & GVWR Utilization Helper",
    category: "automotive",
    subcategory: "maintenance-capacity",
    description: "Calculate available payload capacity to avoid overloading.",
    loader: () => import("@/components/calculators/Automotive/PayloadGvwrUtilizationCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-home-public-charging-cost-time",
    title: "EV Home vs Public Charging Cost & Time Calculator",
    category: "automotive",
    subcategory: "electric-vehicles-comparisons",
    description: "Estimate charging time and cost at home (Level 2) versus public stations, including electricity rates and charger power.",
    loader: () => import("@/components/calculators/Automotive/EvHomePublicChargingCostTimeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-cost-per-mile",
    title: "EV Cost Per Mile Calculator",
    category: "automotive",
    subcategory: "electric-vehicles-comparisons",
    description: "Calculate the exact cost per mile or km for an EV based on efficiency (kWh/100mi) and local electricity prices.",
    loader: () => import("@/components/calculators/Automotive/EvCostPerMileCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-real-world-range",
    title: "EV Real-World Range Estimator",
    category: "automotive",
    subcategory: "electric-vehicles-comparisons",
    description: "Adjust official EV range for real-world factors like temperature, speed, AC use, and driving style.",
    loader: () => import("@/components/calculators/Automotive/EvRealWorldRangeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-hybrid-gas-tco",
    title: "EV vs Hybrid vs Gas TCO Calculator",
    category: "automotive",
    subcategory: "electric-vehicles-comparisons",
    description: "Compare total cost of ownership over 5-10 years, including purchase price, fuel/electricity, maintenance, incentives, and depreciation.",
    loader: () => import("@/components/calculators/Automotive/EvHybridGasTcoCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-hybrid-break-even",
    title: "EV vs Hybrid Break-Even Point Calculator",
    category: "automotive",
    subcategory: "electric-vehicles-comparisons",
    description: "Determine how many miles or years needed for an EV to become cheaper than a hybrid or gas car.",
    loader: () => import("@/components/calculators/Automotive/EvHybridBreakEvenCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "annual-ev-hybrid-cost",
    title: "Annual Fuel/Electricity Cost: EV vs Hybrid",
    category: "automotive",
    subcategory: "electric-vehicles-comparisons",
    description: "Compare yearly operating costs for EV, hybrid, and gas vehicles based on annual mileage and local rates.",
    loader: () => import("@/components/calculators/Automotive/AnnualEvHybridCostCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-trip-cost-planner",
    title: "EV Trip Cost & Charging Planner",
    category: "automotive",
    subcategory: "electric-vehicles-comparisons",
    description: "Calculate total cost and required charging stops for a specific road trip in an EV.",
    loader: () => import("@/components/calculators/Automotive/EvTripCostPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-hybrid-co2-savings",
    title: "CO2 Emissions Savings: EV vs Hybrid",
    category: "automotive",
    subcategory: "electric-vehicles-comparisons",
    description: "Estimate carbon emissions reduction when switching from hybrid/gas to EV, based on mileage and grid cleanliness.",
    loader: () => import("@/components/calculators/Automotive/EvHybridCo2SavingsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-battery-degradation",
    title: "EV Battery Degradation & Long-Term Range Estimator",
    category: "automotive",
    subcategory: "electric-vehicles-comparisons",
    description: "Predict battery capacity loss over years and impact on range, based on usage and charging habits.",
    loader: () => import("@/components/calculators/Automotive/EvBatteryDegradationCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-home-charger-payback",
    title: "Home Charger Installation Cost & Payback Calculator",
    category: "automotive",
    subcategory: "electric-vehicles-comparisons",
    description: "Estimate installation cost for a Level 2 charger and payback period through savings vs public charging.",
    loader: () => import("@/components/calculators/Automotive/EvHomeChargerPaybackCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-incentives-estimator",
    title: "EV Incentives & Tax Credits Estimator",
    category: "automotive",
    subcategory: "electric-vehicles-comparisons",
    description: "Calculate available federal/state rebates, tax credits, and net purchase price for specific EV models.",
    loader: () => import("@/components/calculators/Automotive/EvIncentivesEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-hybrid-maintenance-savings",
    title: "EV Maintenance Savings vs Hybrid Calculator",
    category: "automotive",
    subcategory: "electric-vehicles-comparisons",
    description: "Compare long-term maintenance and repair costs between EVs and hybrids, factoring in fewer moving parts, brake regeneration, and no oil changes.",
    loader: () => import("@/components/calculators/Automotive/EvHybridMaintenanceSavingsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-fast-charging-degradation",
    title: "EV Fast Charging Impact on Battery Life Calculator",
    category: "automotive",
    subcategory: "electric-vehicles-comparisons",
    description: "Estimate battery degradation acceleration from frequent DC fast charging vs slower AC charging, based on usage patterns and temperature.",
    loader: () => import("@/components/calculators/Automotive/EvFastChargingDegradationCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-solar-charging-savings",
    title: "EV Solar Charging Savings Calculator",
    category: "automotive",
    subcategory: "electric-vehicles-comparisons",
    description: "Calculate cost savings and payback when charging an EV with home solar panels, including excess energy credits and reduced grid reliance.",
    loader: () => import("@/components/calculators/Automotive/EvSolarChargingSavingsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "phev-electric-gas-mode-cost",
    title: "PHEV Electric vs Gas Mode Cost Calculator",
    category: "automotive",
    subcategory: "electric-vehicles-comparisons",
    description: "For plug-in hybrids: Compare costs of driving in electric-only mode vs gas mode for daily commutes or trips.",
    loader: () => import("@/components/calculators/Automotive/PhevElectricGasModeCostCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-preconditioning-cost",
    title: "EV Preconditioning Energy & Cost Estimator",
    category: "automotive",
    subcategory: "electric-vehicles-comparisons",
    description: "Estimate battery energy used and cost for preconditioning (heating/cooling) the cabin while plugged in, vs doing it while driving.",
    loader: () => import("@/components/calculators/Automotive/EvPreconditioningCostCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "hp-from-quarter-mile-et",
    title: "Horsepower from Quarter Mile ET Calculator",
    category: "automotive",
    subcategory: "performance-tuning",
    description: "Estimate engine horsepower based on vehicle weight and quarter-mile elapsed time (ET).",
    loader: () => import("@/components/calculators/Automotive/HpFromQuarterMileEtCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "quarter-mile-et-mph-from-hp",
    title: "Quarter Mile ET & MPH from HP Calculator",
    category: "automotive",
    subcategory: "performance-tuning",
    description: "Predict quarter-mile elapsed time (ET) and trap speed (MPH) from horsepower and vehicle weight.",
    loader: () => import("@/components/calculators/Automotive/QuarterMileEtMphFromHpCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "zero-to-sixty-time",
    title: "0-60 mph Acceleration Time Estimator",
    category: "automotive",
    subcategory: "performance-tuning",
    description: "Calculate 0-60 mph time based on horsepower, torque, weight, and drivetrain type.",
    loader: () => import("@/components/calculators/Automotive/ZeroToSixtyTimeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "hp-to-torque-converter",
    title: "Horsepower to Torque Converter",
    category: "automotive",
    subcategory: "performance-tuning",
    description: "Convert between horsepower and torque at a given RPM (using the standard formula).",
    loader: () => import("@/components/calculators/Automotive/HpToTorqueConverterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "engine-displacement",
    title: "Engine Displacement Calculator",
    category: "automotive",
    subcategory: "performance-tuning",
    description: "Calculate engine size (cc or cubic inches) from bore, stroke, and number of cylinders.",
    loader: () => import("@/components/calculators/Automotive/EngineDisplacementCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "compression-ratio",
    title: "Compression Ratio Calculator",
    category: "automotive",
    subcategory: "performance-tuning",
    description: "Determine engine compression ratio based on chamber volume, piston dome/dish, and deck height.",
    loader: () => import("@/components/calculators/Automotive/CompressionRatioCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "carb-cfm-sizing",
    title: "Carburetor CFM Sizing Calculator",
    category: "automotive",
    subcategory: "performance-tuning",
    description: "Estimate required carburetor airflow (CFM) for your engine based on RPM and volumetric efficiency.",
    loader: () => import("@/components/calculators/Automotive/CarbCfmSizingCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "camshaft-duration-overlap",
    title: "Camshaft Duration & Overlap Calculator",
    category: "automotive",
    subcategory: "performance-tuning",
    description: "Calculate intake/exhaust duration, overlap, and lobe separation angle for cam selection.",
    loader: () => import("@/components/calculators/Automotive/CamshaftDurationOverlapCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "header-tube-length-diameter",
    title: "Header Primary Tube Length & Diameter Calculator",
    category: "automotive",
    subcategory: "performance-tuning",
    description: "Optimize exhaust header dimensions for peak torque RPM and engine specs.",
    loader: () => import("@/components/calculators/Automotive/HeaderTubeLengthDiameterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "mod-power-gains-estimator",
    title: "Power Gains from Modifications Estimator",
    category: "automotive",
    subcategory: "performance-tuning",
    description: "Estimate horsepower and torque gains from common mods like intake, exhaust, cam, or turbo.",
    loader: () => import("@/components/calculators/Automotive/ModPowerGainsEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-acceleration-torque",
    title: "EV Acceleration & Torque Delivery Estimator",
    category: "automotive",
    subcategory: "performance-tuning",
    description: "Calculate 0-60 time and effective torque for electric vehicles based on motor power, battery output, and weight.",
    loader: () => import("@/components/calculators/Automotive/EvAccelerationTorqueCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "dyno-correction-factor",
    title: "Dyno Correction Factor Calculator",
    category: "automotive",
    subcategory: "performance-tuning",
    description: "Adjust dyno-measured horsepower and torque for standard atmospheric conditions (SAE, DIN, etc.).",
    loader: () => import("@/components/calculators/Automotive/DynoCorrectionFactorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "zero-to-sixty-gear-rpm",
    title: "0–60 Speed vs Gear/RPM",
    category: "automotive",
    subcategory: "tires-wheels-speedometer",
    description: "Educational tool to estimate 0-60 times based on power/weight.",
    loader: () => import("@/components/calculators/Automotive/060SpeedVsGearRpmCalculator"),
    urlStyle: "flat"
  },
   
   
    {
    slug: "ohms-law",
    title: "Ohm's Law Calculator (V, I, R, P)",
    category: "electrical",
    subcategory: "basic-electrical-circuit-calculations",
    description: "Calculate Voltage, Current, Resistance, or Power using Ohm's Law.",
    loader: () => import("@/components/calculators/Electrical/OhmsLawCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "voltage-drop-wire-length",
    title: "Voltage Drop Calculator (Wire Gauge & Length)",
    category: "electrical",
    subcategory: "basic-electrical-circuit-calculations",
    description: "Calculate voltage drop based on wire gauge, length, and current.",
    loader: () => import("@/components/calculators/Electrical/VoltageDropWireLengthCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "current-amperage",
    title: "Current (Amperage) Calculator",
    category: "electrical",
    subcategory: "basic-electrical-circuit-calculations",
    description: "Calculate electrical current in a circuit.",
    loader: () => import("@/components/calculators/Electrical/CurrentAmperageCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "power-watts",
    title: "Power (Watts) Calculator",
    category: "electrical",
    subcategory: "basic-electrical-circuit-calculations",
    description: "Calculate electrical power in Watts.",
    loader: () => import("@/components/calculators/Electrical/PowerWattsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "electrical-resistance",
    title: "Electrical Resistance Calculator",
    category: "electrical",
    subcategory: "basic-electrical-circuit-calculations",
    description: "Calculate resistance in a circuit.",
    loader: () => import("@/components/calculators/Electrical/ElectricalResistanceCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "parallel-series-circuit",
    title: "Parallel & Series Circuit Calculator",
    category: "electrical",
    subcategory: "basic-electrical-circuit-calculations",
    description: "Calculate equivalent resistance for parallel and series circuits.",
    loader: () => import("@/components/calculators/Electrical/ParallelSeriesCircuitCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "resistor-color-code",
    title: "Resistor Color Code Decoder",
    category: "electrical",
    subcategory: "basic-electrical-circuit-calculations",
    description: "Decode resistor color bands to find resistance value.",
    loader: () => import("@/components/calculators/Electrical/ResistorColorCodeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "electrical-load-capacity",
    title: "Electrical Load Capacity (Breaker/Panel) Calculator",
    category: "electrical",
    subcategory: "basic-electrical-circuit-calculations",
    description: "Estimate load capacity for breakers and electrical panels.",
    loader: () => import("@/components/calculators/Electrical/ElectricalLoadCapacityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "wire-size-awg-kcmil",
    title: "Wire Size (AWG/KCMIL) Calculator",
    category: "electrical",
    subcategory: "wiring-conductors-breakers",
    description: "Determine appropriate wire size (AWG/KCMIL) for a given load.",
    loader: () => import("@/components/calculators/Electrical/WireSizeAwgKcmilCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "breaker-size",
    title: "Breaker Size Calculator",
    category: "electrical",
    subcategory: "wiring-conductors-breakers",
    description: "Calculate the correct circuit breaker size for a specific load.",
    loader: () => import("@/components/calculators/Electrical/BreakerSizeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "conduit-fill",
    title: "Conduit Fill Calculator",
    category: "electrical",
    subcategory: "wiring-conductors-breakers",
    description: "Calculate the maximum number of wires allowed in a conduit.",
    loader: () => import("@/components/calculators/Electrical/ConduitFillCalculator"),
    urlStyle: "flat"
  },
    
    {
    slug: "cable-ampacity-by-distance",
    title: "Cable Ampacity by Distance Calculator",
    category: "electrical",
    subcategory: "wiring-conductors-breakers",
    description: "Calculate cable ampacity accounting for distance and voltage drop.",
    loader: () => import("@/components/calculators/Electrical/CableAmpacityByDistanceCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "three-phase-power",
    title: "3-Phase Power Calculator",
    category: "electrical",
    subcategory: "wiring-conductors-breakers",
    description: "Calculate power, voltage, and current in 3-phase systems.",
    loader: () => import("@/components/calculators/Electrical/ThreePhasePowerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "transformer-kva",
    title: "Transformer kVA Calculator",
    category: "electrical",
    subcategory: "wiring-conductors-breakers",
    description: "Calculate Transformer capacity in kVA.",
    loader: () => import("@/components/calculators/Electrical/TransformerKvaCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "motor-fla",
    title: "Motor FLA (Full Load Amps) Calculator",
    category: "electrical",
    subcategory: "wiring-conductors-breakers",
    description: "Calculate Full Load Amps for electric motors.",
    loader: () => import("@/components/calculators/Electrical/MotorFlaCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "conduit-bending",
    title: "Conduit Bending Calculator",
    category: "electrical",
    subcategory: "wiring-conductors-breakers",
    description: "Calculate bend deduction and other values for conduit bending.",
    loader: () => import("@/components/calculators/Electrical/ConduitBendingCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "led-power-consumption",
    title: "LED Lighting Power Consumption Calculator",
    category: "electrical",
    subcategory: "lighting-energy-cost-home-electrical",
    description: "Estimate power consumption and savings with LED lighting.",
    loader: () => import("@/components/calculators/Electrical/LedPowerConsumptionCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "lumens-to-watts",
    title: "Lighting Lumens-to-Watts Converter",
    category: "electrical",
    subcategory: "lighting-energy-cost-home-electrical",
    description: "Convert between Lumens and Watts for different light sources.",
    loader: () => import("@/components/calculators/Electrical/LumensToWattsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "electricity-cost-per-hour-month",
    title: "Electricity Cost per Hour/Month Calculator",
    category: "electrical",
    subcategory: "lighting-energy-cost-home-electrical",
    description: "Calculate electricity cost based on usage and rate.",
    loader: () => import("@/components/calculators/Electrical/ElectricityCostPerHourMonthCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "lighting-circuit-load-planner",
    title: "Lighting Circuit Load Planner",
    category: "electrical",
    subcategory: "lighting-energy-cost-home-electrical",
    description: "Plan electrical load for lighting circuits.",
    loader: () => import("@/components/calculators/Electrical/LightingCircuitLoadPlannerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "generator-sizing",
    title: "Generator Sizing Calculator",
    category: "electrical",
    subcategory: "lighting-energy-cost-home-electrical",
    description: "Estimate the size of generator needed for your home or equipment.",
    loader: () => import("@/components/calculators/Electrical/GeneratorSizingCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "power-factor",
    title: "Power Factor Calculator",
    category: "electrical",
    subcategory: "lighting-energy-cost-home-electrical",
    description: "Calculate power factor and correction capacitor size.",
    loader: () => import("@/components/calculators/Electrical/PowerFactorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "pv-system-production-estimator",
    title: "PV System Production Estimator (e.g., PVWatts)",
    category: "electrical",
    subcategory: "renewable-energy-battery-systems",
    description: "Estimate energy production for solar PV systems.",
    loader: () => import("@/components/calculators/Electrical/PvSystemProductionEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "off-grid-system-sizing",
    title: "Off-Grid System Sizing Calculator",
    category: "electrical",
    subcategory: "renewable-energy-battery-systems",
    description: "Size solar and battery systems for off-grid applications.",
    loader: () => import("@/components/calculators/Electrical/OffGridSystemSizingCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "solar-panel-output-array-sizing",
    title: "Solar Panel Output & Array Sizing Calculator",
    category: "electrical",
    subcategory: "renewable-energy-battery-systems",
    description: "Calculate solar panel output and size your array.",
    loader: () => import("@/components/calculators/Electrical/SolarPanelOutputArraySizingCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "solar-battery-bank-sizing",
    title: "Solar Battery Bank Sizing Calculator",
    category: "electrical",
    subcategory: "renewable-energy-battery-systems",
    description: "Size battery banks for solar energy storage.",
    loader: () => import("@/components/calculators/Electrical/SolarBatteryBankSizingCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "inverter-load-capacity",
    title: "Inverter Load Capacity Calculator",
    category: "electrical",
    subcategory: "renewable-energy-battery-systems",
    description: "Calculate required inverter size for your loads.",
    loader: () => import("@/components/calculators/Electrical/InverterLoadCapacityCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "ev-charging-time",
    title: "EV Charging Time Calculator",
    category: "electrical",
    subcategory: "renewable-energy-battery-systems",
    description: "Estimate time required to charge an electric vehicle.",
    loader: () => import("@/components/calculators/Electrical/EvChargingTimeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "battery-runtime-estimator",
    title: "Battery Runtime Estimator",
    category: "electrical",
    subcategory: "renewable-energy-battery-systems",
    description: "Estimate how long a battery will last under a specific load.",
    loader: () => import("@/components/calculators/Electrical/BatteryRuntimeEstimatorCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "system-payback-period-roi",
    title: "System Payback Period (ROI) Calculator",
    category: "electrical",
    subcategory: "renewable-energy-battery-systems",
    description: "Calculate ROI and payback period for renewable energy systems.",
    loader: () => import("@/components/calculators/Electrical/SystemPaybackPeriodRoiCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "days-between-dates",
    title: "Days Between Dates (date duration)",
    category: "time",
    subcategory: "dates-durations",
    description: "Calculate the number of days, months, or years between two specific dates. Essential for planning projects, calculating age, or tracking duration.",
    loader: () => import("@/components/calculators/Time/DaysBetweenDatesCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "add-subtract-date",
    title: "Add/Subtract Date (days/months/years)",
    category: "time",
    subcategory: "dates-durations",
    description: "Add or subtract a specific number of days, months, or years from a given starting date. Perfect for deadline tracking.",
    loader: () => import("@/components/calculators/Time/AddSubtractDateCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "add-subtract-time",
    title: "Add/Subtract Time (h/min/s)",
    category: "time",
    subcategory: "dates-durations",
    description: "Add or subtract hours, minutes, or seconds from a starting time. Useful for scheduling and time management.",
    loader: () => import("@/components/calculators/Time/AddSubtractTimeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "business-days",
    title: "Business Days Calculator (exclude weekends/holidays)",
    category: "time",
    subcategory: "dates-durations",
    description: "Calculate the number of working days between two dates, automatically excluding weekends and customizable holidays.",
    loader: () => import("@/components/calculators/Time/BusinessDaysCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "iso-week-number",
    title: "Week Number & ISO Week Finder",
    category: "time",
    subcategory: "dates-durations",
    description: "Find the ISO week number for any given date. Standardized for business and international scheduling.",
    loader: () => import("@/components/calculators/Time/IsoWeekNumberCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "age-calculator",
    title: "Age Calculator (years/months/days)",
    category: "time",
    subcategory: "dates-durations",
    description: "Calculate a person's age precisely in years, months, and days.",
    loader: () => import("@/components/calculators/Time/AgeCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "date-difference-hms",
    title: "Date Difference in Hours/Minutes/Seconds",
    category: "time",
    subcategory: "dates-durations",
    description: "Determine the exact difference between two dates in total hours, minutes, and seconds.",
    loader: () => import("@/components/calculators/Time/DateDifferenceHmsCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "julian-date-day-number",
    title: "Julian Date/Day Calculator",
    category: "time",
    subcategory: "dates-durations",
    description: "Convert any date into its Julian Date or Day Number (1-366). Used in science, astronomy, and military applications.",
    loader: () => import("@/components/calculators/Time/JulianDateDayNumberCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "leap-year-checker",
    title: "Leap Year Checker",
    category: "time",
    subcategory: "dates-durations",
    description: "Check quickly whether a given year is a leap year.",
    loader: () => import("@/components/calculators/Time/LeapYearCheckerCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "time-zone-converter",
    title: "Time Zone Converter (between cities)",
    category: "time",
    subcategory: "time-zones-clocks",
    description: "Convert time instantly between different global cities and time zones. Ideal for international communication.",
    loader: () => import("@/components/calculators/Time/TimeZoneConverterCalculator"),
    urlStyle: "flat"
  },
    {
    slug: "world-clock",
    title: "World Clock (list of cities)",
    category: "time",
    subcategory: "time-zones-clocks",
    description: "Display the current time for a list of major global cities. Quick reference for time differences.",
    loader: () => import("@/components/calculators/Time/WorldClockCalculator"),
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
