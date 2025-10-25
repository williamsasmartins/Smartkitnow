import React from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "@/components/ads/AdBannerTop";
import AdSidebarRight from "@/components/ads/AdSidebarRight";
import EmojiIcon from "@/components/ui/EmojiIcon";
import ShareBox from "@/components/share/ShareBox";
import SuggestBoxInline from "@/components/contact/SuggestBoxInline";

type Item = { name: string; slug: string };

// ===== LISTA OFICIAL (26) =====
const loansMortgages: Item[] = [
  { name: "Loan Payment Calculator (Principal, Rate, Term)", slug: "loan-payment" },
  { name: "Mortgage Payment & Amortization Calculator", slug: "mortgage-amortization" },
  { name: "Extra Payments & Payoff Time Calculator", slug: "extra-payments-payoff" },
  { name: "Interest-Only Loan Calculator", slug: "interest-only-loan" },
  { name: "Refinance Savings Calculator", slug: "refinance-savings" },
  { name: "HELOC Payment Estimator", slug: "heloc-payment-estimator" },
  { name: "Car Loan Affordability Calculator", slug: "car-loan-affordability" },
  { name: "Balloon Payment Calculator", slug: "balloon-payment" },
];

const investmentsSavings: Item[] = [
  { name: "Compound Interest Calculator", slug: "compound-interest" },
  { name: "Future Value of Investment Calculator", slug: "future-value-investment" },
  { name: "Investment Return (ROI) Calculator", slug: "roi-return-on-investment" },
  { name: "SIP/Monthly Investment Planner", slug: "sip-monthly-investment-planner" },
  { name: "Inflation Adjusted Value Calculator", slug: "inflation-adjusted-value" },
  { name: "Retirement Savings Goal Calculator", slug: "retirement-savings-goal" },
  { name: "Emergency Fund Goal Calculator", slug: "emergency-fund-goal" },
];

const incomeBudgetExpenses: Item[] = [
  { name: "Monthly Budget Planner", slug: "monthly-budget-planner" },
  { name: "Net Income after Tax Calculator", slug: "net-income-after-tax" },
  { name: "Hourly to Annual Salary Converter", slug: "hourly-to-annual-salary" },
  { name: "Debt-to-Income Ratio Calculator", slug: "debt-to-income-ratio" },
  { name: "Savings Rate Tracker", slug: "savings-rate-tracker" },
  { name: "Expense Splitter (Shared Bills) Calculator", slug: "expense-splitter-shared-bills" },
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
  currencyTax.length; // 26

export default function FinancialCategory() {
  return (
    <div className="min-h-screen">
      {/* empurra tudo abaixo do header fixo */}
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto max-w-7xl px-4 pb-16">
        {/* HERO */}
        <header className="py-6 mb-8">
          <div className="flex items-center gap-3">
            <EmojiIcon symbol="💰" size={38} className="text-primary" label="Financial" />
            <h1 className="text-3xl md:text-4xl font-semibold text-primary">Financial Calculators</h1>
            <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
              {TOTAL} tools
            </span>
          </div>
          <p className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground">
            Make confident money decisions with {TOTAL} expert-built finance calculators. Compare
            <strong> loan and mortgage payments</strong>, accelerate payoff with
            <strong> extra contributions</strong>, explore <strong>interest-only</strong> and
            <strong> balloon</strong> scenarios, and estimate <strong>refinance savings</strong>.
            Project wealth with <strong>compound interest</strong>, <strong>future value</strong>, and
            <strong> ROI</strong>, while accounting for <strong>inflation</strong>. Build a realistic
            <strong> monthly budget</strong>, estimate <strong>after-tax income</strong>, convert
            <strong> hourly ↔ annual salary</strong>, track your <strong>savings rate</strong>, and split
            <strong> shared bills</strong> fairly. Handle <strong>currency conversion</strong>,
            <strong> sales/VAT/GST</strong>, <strong>tips</strong>, and <strong>discount vs. final price</strong> with
            clear formulas and worked examples.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* coluna principal */}
          <section className="lg:col-span-9">
            <Section
              emoji="🏦"
              title={`Loans, Mortgages & Payments (${loansMortgages.length})`}
              description="Compute payment amount and amortization, simulate extra payments to shorten payoff time, evaluate interest-only and balloon structures, estimate refinance savings, and plan HELOC payments."
              items={loansMortgages}
              base="/financial"
            />

            <Section
              emoji="📈"
              title={`Investments & Savings (${investmentsSavings.length})`}
              description="Model compound growth, future value, and ROI; adjust results for inflation; and set long-term targets such as retirement and emergency funds."
              items={investmentsSavings}
              base="/financial"
            />

            <Section
              emoji="👛"
              title={`Income, Budget & Expenses (${incomeBudgetExpenses.length})`}
              description="Build a monthly budget, estimate take-home pay after taxes, convert wages (hourly ↔ annual), track your savings rate, and split shared expenses fairly."
              items={incomeBudgetExpenses}
              base="/financial"
            />

            <Section
              emoji="💱"
              title={`Currency & Tax (${currencyTax.length})`}
              description="Convert currencies with live rates, compute sales tax and VAT/GST, split tips and bills, and compare discount vs. final price."
              items={currencyTax}
              base="/financial"
            />

            {/* Boxes inferiores: Share + Suggest embutido */}
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <ShareBox />
              <SuggestBoxInline />
            </div>
          </section>

          {/* Coluna do right rail */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-[140px] 2xl:top-[148px] transform-gpu -translate-x-2">
              <AdSidebarRight topOffset={0} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

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