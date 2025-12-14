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
