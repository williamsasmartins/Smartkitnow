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
