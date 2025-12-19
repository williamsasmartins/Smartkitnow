import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";
import SEOHead from "@/components/SEOHead";

type Item = { name: string; slug: string };

// ===== LISTA OFICIAL (73) =====
const loansMortgages: Item[] = [
  { name: "Loan Payment Calculator (Principal, Rate, Term)", slug: "loan-payment" },
  { name: "Mortgage Payment & Amortization Calculator", slug: "mortgage-amortization" },
  { name: "Extra Payments & Payoff Time Calculator", slug: "extra-payments-payoff" },
  { name: "Interest-Only Loan Calculator", slug: "interest-only-loan" },
  { name: "Refinance Savings Calculator", slug: "refinance-savings" },
  { name: "HELOC Payment Estimator", slug: "heloc-payment-estimator" },
  { name: "Car Loan Affordability Calculator", slug: "car-loan-affordability" },
  { name: "Balloon Payment Calculator", slug: "balloon-payment" },
  { name: "How Much House Can I Afford? Calculator", slug: "house-affordability" },
  { name: "Auto Loan Calculator", slug: "auto-loan" },
  { name: "Student Loan Repayment Calculator", slug: "student-loan-repayment" },
  { name: "Lease vs Buy Calculator", slug: "lease-vs-buy" },
];

const investmentsSavings: Item[] = [
  { name: "Compound Interest Calculator", slug: "compound-interest" },
  { name: "Future Value of Investment Calculator", slug: "future-value-investment" },
  { name: "Investment Return (ROI) Calculator", slug: "roi-return-on-investment" },
  { name: "SIP/Monthly Investment Planner", slug: "sip-monthly-investment-planner" },
  { name: "Inflation Adjusted Value Calculator", slug: "inflation-adjusted-value" },
  { name: "Retirement Savings Goal Calculator", slug: "retirement-savings-goal" },
  { name: "Emergency Fund Goal Calculator", slug: "emergency-fund-goal" },
  { name: "401(k) / Retirement Savings Growth Calculator", slug: "401k-retirement-savings-growth" },
  { name: "Social Security Benefit Estimator", slug: "social-security-benefit-estimator" },
  { name: "Rule of 72 Calculator", slug: "rule-of-72" },
  { name: "Bond Yield Calculator", slug: "bond-yield" },
  { name: "Roth IRA Conversion Calculator", slug: "roth-ira-conversion" },
  { name: "Dollar Cost Averaging (DCA) Simulator", slug: "dca-simulator" },
  { name: "Crypto DCA Strategy Calculator", slug: "crypto-dca-strategy" },
  { name: "Stock DCA Return Estimator", slug: "stock-dca-return-estimator" },
];

const incomeBudgetExpenses: Item[] = [
  { name: "Monthly Budget Planner", slug: "monthly-budget-planner" },
  { name: "Net Income after Tax Calculator", slug: "net-income-after-tax" },
  { name: "Hourly to Annual Salary Converter", slug: "hourly-to-annual-salary" },
  { name: "Debt-to-Income Ratio Calculator", slug: "debt-to-income-ratio" },
  { name: "Savings Rate Tracker", slug: "savings-rate-tracker" },
  { name: "Expense Splitter (Shared Bills) Calculator", slug: "expense-splitter-shared-bills" },
  { name: "Take-Home Pay Calculator", slug: "take-home-pay" },
  { name: "Paycheck Calculator", slug: "paycheck-calculator" },
  { name: "Absence Percentage Calculator", slug: "absence-percentage-calculator" },
];

const debtManagementCredit: Item[] = [
  { name: "Credit Card Payoff Calculator", slug: "credit-card-payoff" },
  { name: "Debt Consolidation Calculator", slug: "debt-consolidation" },
  { name: "Net Worth Calculator", slug: "net-worth" },
  { name: "Currency Converter (Live Rates)", slug: "currency-converter-live" },
  { name: "Sales Tax Calculator", slug: "sales-tax" },
  { name: "VAT/GST Calculator", slug: "vat-gst" },
  { name: "Debt Snowball Calculator", slug: "debt-snowball" },
  { name: "APR Calculator", slug: "apr" },
  { name: "Credit Card Interest Calculator", slug: "credit-card-interest" },
  { name: "Loan Comparison Calculator", slug: "loan-comparison" },
  { name: "College Savings Calculator", slug: "college-savings" },
  { name: "IRR NPV Calculator", slug: "irr-npv" },
  { name: "Tax Bracket Calculator", slug: "tax-bracket" },
];

const cryptoCoreTools: Item[] = [
  // Basic Conversions & Pricing (6)
  { name: "Crypto to Fiat Converter", slug: "crypto-to-fiat" },
  { name: "Crypto to Crypto Exchange Rate Calculator", slug: "crypto-to-crypto-exchange-rate" },
  { name: "Live Price Checker (Real-Time Rates)", slug: "live-price-checker" },
  { name: "Portfolio Value Tracker", slug: "portfolio-value-tracker" },
  { name: "Fiat to Crypto Purchase Calculator", slug: "fiat-to-crypto-purchase" },
  { name: "Multi-Currency Crypto Converter", slug: "multi-currency-crypto-converter" },
  // Profit & Investment Analysis (7)
  { name: "Crypto Profit/Loss Calculator", slug: "crypto-profit-loss" },
  { name: "ROI (Return on Investment) Calculator", slug: "crypto-roi" },
  { name: "Future Value & Compound Growth Estimator", slug: "crypto-future-value-compound-growth" },
  { name: "Yield Farming APY Calculator", slug: "yield-farming-apy" },
  { name: "Staking Rewards Estimator", slug: "staking-rewards-estimator" },
  { name: "Investment Break-Even Point Calculator", slug: "investment-break-even-point" },
  { name: "DCA Strategy Analyzer (Crypto)", slug: "dca-strategy-analyzer-crypto" },
  // Mining & Hardware (5)
  { name: "Mining Profitability Calculator", slug: "mining-profitability" },
  { name: "Hash Rate to Earnings Converter", slug: "hash-rate-to-earnings" },
  { name: "Electricity Cost vs Mining Revenue", slug: "electricity-cost-vs-mining-revenue" },
  { name: "GPU/ASIC Mining ROI Calculator", slug: "gpu-asic-mining-roi" },
  { name: "Pool Fee Impact Estimator", slug: "pool-fee-impact" },
  // Taxes & Compliance (4)
  { name: "Crypto Tax Liability Calculator", slug: "crypto-tax-liability" },
  { name: "Capital Gains Tax Estimator", slug: "capital-gains-tax-estimator" },
  { name: "Transaction Fee Deduction Tool", slug: "transaction-fee-deduction" },
  { name: "Cost Basis Calculator (FIFO/LIFO)", slug: "cost-basis-fifo-lifo" },
  // Advanced Trading (3)
  { name: "Leverage & Margin Profit Calculator", slug: "leverage-margin-profit" },
  { name: "Position Size & Risk Management Tool", slug: "position-size-risk-management" },
  { name: "Volatility & Risk Assessment Calculator", slug: "volatility-risk-assessment" },
];

const currencyTax: Item[] = [
  { name: "Currency Converter (Live Rates)", slug: "currency-converter-live" },
  { name: "Sales Tax Calculator", slug: "sales-tax" },
  { name: "VAT/GST Calculator", slug: "vat-gst" },
  { name: "Tip & Split Bill Calculator", slug: "tip-split-bill" },
  { name: "Discount & Final Price Calculator", slug: "discount-final-price" },
];

const TOTAL =
  loansMortgages.length +
  investmentsSavings.length +
  incomeBudgetExpenses.length +
  debtManagementCredit.length +
  cryptoCoreTools.length; // 73

export default function FinancialCategory() {
  const [descExpanded, setDescExpanded] = useState(false);
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Financial & Cryptocurrency Calculators"
        description="Explore 73 calculators spanning loans and mortgages, investments and savings, income and budgeting, debt management and credit, plus comprehensive crypto tools for pricing, profit, mining, taxes, and trading."
        canonical="https://www.smartkitnow.com/financial"
        robots="index,follow"
        og={{ type: "website", url: "https://www.smartkitnow.com/financial", siteName: "Smart Kit Now" }}
        twitter={{ card: "summary_large_image" }}
        extra={[{ name: "keywords", content: "financial calculators, loan calculator, mortgage amortization, extra payments, refinance savings, HELOC, affordability, student loans, lease vs buy, compound interest, future value, ROI, inflation, retirement savings, emergency fund, 401k growth, social security benefit, rule of 72, bond yield, Roth IRA conversion, DCA simulator, crypto DCA, stock DCA, monthly budget, net income after tax, hourly to annual salary, debt-to-income ratio, savings rate, expense splitter, take-home pay, paycheck calculator, credit card payoff, debt consolidation, net worth, currency converter, sales tax, VAT GST, debt snowball, APR, credit card interest, loan comparison, college savings, IRR NPV, tax bracket, crypto to fiat, crypto exchange rate, live price checker, portfolio tracker, fiat to crypto, multi-currency converter, crypto profit loss, crypto ROI, compound growth, yield farming APY, staking rewards, break-even, mining profitability, hash rate earnings, electricity cost revenue, GPU ASIC ROI, pool fee impact, crypto tax liability, capital gains tax, transaction fee deduction, cost basis FIFO LIFO, leverage margin profit, position size risk management, volatility risk assessment" }]}
      />
      {/* empurra tudo abaixo do header fixo */}
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto pb-16" style={{ maxWidth: 1200 }}>
        <div className="relative xl:flex xl:justify-center xl:gap-12">
          <div className="w-full max-w-3xl mx-auto xl:mx-0 px-4 sm:px-6 min-w-0">
            {/* HERO */}
            <header className="py-6 mb-8">
              <div className="flex items-center gap-3">
                <EmojiIcon symbol="💰" size={38} className="text-primary" label="Financial" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Financial & Cryptocurrency Calculators</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} tools
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <>
                    <p>
                      Make confident money decisions with {TOTAL} expert-built calculators across finance and crypto.
                    </p>
                    <p>
                      Compare <strong>loan and mortgage payments</strong>, accelerate payoff with <strong>extra contributions</strong>, explore <strong>interest-only</strong> and <strong>balloon</strong> scenarios, estimate <strong>refinance savings</strong>, plan <strong>HELOC</strong>, evaluate <strong>house affordability</strong>, <strong>auto loans</strong>, <strong>student loans</strong>, and <strong>lease vs buy</strong>.
                    </p>
                    <p>
                      Model wealth with <strong>compound interest</strong>, <strong>future value</strong>, and <strong>ROI</strong>; adjust for <strong>inflation</strong>; set <strong>retirement</strong> and <strong>emergency fund</strong> targets; project <strong>401(k)</strong> growth, estimate <strong>Social Security</strong>, apply the <strong>Rule of 72</strong>, compute <strong>bond yields</strong>, and plan <strong>Roth IRA conversion</strong> and <strong>DCA</strong> strategies.
                    </p>
                    <p>
                      Organize finances: build a <strong>monthly budget</strong>, estimate <strong>after-tax income</strong>, convert <strong>hourly ↔ annual salary</strong>, track <strong>savings rate</strong>, split <strong>shared expenses</strong>, and review <strong>take-home pay</strong> and <strong>paychecks</strong>.
                    </p>
                    <p>
                      Manage debt & credit: <strong>credit card payoff</strong>, <strong>consolidation</strong>, <strong>snowball</strong>, <strong>APR</strong>, <strong>credit card interest</strong>, <strong>loan comparison</strong>, <strong>net worth</strong>, <strong>currency conversion</strong>, <strong>sales tax</strong>, <strong>VAT/GST</strong>, <strong>college savings</strong>, <strong>IRR/NPV</strong>, and <strong>tax brackets</strong>.
                    </p>
                    <p>
                      Crypto tools: conversions & pricing, <strong>profit/loss</strong>, <strong>APY</strong> & <strong>staking rewards</strong>, <strong>DCA</strong> & break‑even, <strong>mining profitability</strong>, hardware <strong>ROI</strong>, <strong>electricity costs</strong>, <strong>pool fees</strong>, <strong>tax liability</strong>, <strong>cost basis</strong>, and <strong>advanced trading</strong> (leverage, margin, position size, volatility).
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    Make confident money decisions with {TOTAL} expert-built calculators across finance and crypto: loans & mortgages, investments & savings, income & budgeting, debt & credit, and comprehensive crypto tools for pricing, profit, mining, taxes, and trading.
                  </p>
                )}
                {!descExpanded && (
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center rounded-md border px-3 py-1 text-sm text-primary hover:underline"
                    onClick={() => setDescExpanded(true)}
                    aria-expanded={descExpanded}
                  >
                    Read More
                  </button>
                )}
              </div>
            </header>

            <Section
              emoji="🏦"
              title={`Loans, Mortgages & Payments (${loansMortgages.length})`}
              description="Compute payments and amortization, simulate extra payments, evaluate interest-only and balloon structures, estimate refinance savings, plan HELOC, and assess house affordability, auto loans, student loans, and lease vs buy."
              items={loansMortgages}
              base="/financial"
            />

            <Section
              emoji="📈"
              title={`Investments & Savings (${investmentsSavings.length})`}
              description="Model compound growth, future value, and ROI; adjust for inflation; set retirement and emergency targets; 401(k) growth, Social Security, Rule of 72, bond yields, Roth conversion, and DCA strategies (crypto & stocks)."
              items={investmentsSavings}
              base="/financial"
            />

            <Section
              emoji="👛"
              title={`Income, Budget & Expenses (${incomeBudgetExpenses.length})`}
              description="Build a monthly budget, estimate take-home pay after taxes, convert wages (hourly ↔ annual), track savings rate, split shared expenses, and review paycheck details."
              items={incomeBudgetExpenses}
              base="/financial"
            />

            <Section
              emoji="💳"
              title={`Debt Management & Credit (${debtManagementCredit.length})`}
              description="Credit card payoff, consolidation, snowball, APR, credit interest, loan comparisons, net worth, currency conversion, sales/VAT/GST taxes, college savings, IRR/NPV, and tax brackets."
              items={debtManagementCredit}
              base="/financial"
            />

            <Section
              emoji="🪙"
              title={`Cryptocurrency Core Tools (${cryptoCoreTools.length})`}
              description="Conversions & pricing, profit/loss, APY & staking, DCA & break‑even, mining profitability & hardware ROI, electricity costs & pool fees, tax liability & cost basis, and advanced trading (leverage, margin, position size, volatility)."
              items={cryptoCoreTools}
              base="/financial"
            />

            <div className="mt-14 space-y-6">
              <ShareThisPageBox />
              <SuggestionBox />
            </div>
          </div>

          <aside className="hidden xl:block w-[300px] flex-shrink-0">
            <div className="sticky" style={{ top: "var(--skn-rail-top)" }}>
              <AdSidebarRight topOffset={0} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
} // End of FinancialCategory

/* ---------- helpers ---------- */

function splitTwoColumns<T>(arr: T[]) {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

function Section({
  emoji,
  title,
  description,
  items,
  base,
}: {
  emoji: string; // emoji colorido no título da seção
  title: string;
  description: string;
  items: Item[];
  base: string;
}) {
  const [left, right] = splitTwoColumns(items);

  return (
    <section className="mb-12">
      {/* título da seção com emoji colorido */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-grid place-items-center h-8 w-8 rounded-lg border bg-card">
          <EmojiIcon symbol={emoji} size={20} />
        </span>
        <h2 className="text-2xl font-semibold text-primary">{title}</h2>
      </div>

      <p className="text-sm md:text-base text-muted-foreground mb-5 leading-relaxed">{description}</p>

      {/* LISTA EM DUAS COLUNAS */}
      <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
        <ul className="list-disc ml-6 space-y-2.5">
          {left.map((it) => (
            <li key={it.slug} className="leading-relaxed">
              <Link
                to={`${base}/${it.slug}`}
                className="text-primary hover:underline text-base md:text-[1.05rem] font-medium"
              >
                {it.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="list-disc ml-6 space-y-2.5">
          {right.map((it) => (
            <li key={it.slug} className="leading-relaxed">
              <Link
                to={`${base}/${it.slug}`}
                className="text-primary hover:underline text-base md:text-[1.05rem] font-medium"
              >
                {it.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Boxes inferiores ---------- */
