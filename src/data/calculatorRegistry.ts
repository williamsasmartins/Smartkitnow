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
    slug: "dog-weight-loss-planner",
    title: "Dog Weight Loss Planner",
    category: "pets",
    subcategory: "dogs-nutrition-weight",
    description: "Plan a safe and effective weight loss program for your dog. Calculates target calories and timeline for goal weight achievement.",
    loader: () => import("@/components/calculators/Pets/DogWeightLossPlannerCalculator"),
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
