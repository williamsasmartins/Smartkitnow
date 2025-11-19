// src/components/calculators/Financial/LoanPaymentCalculator.tsx

import React, { useState } from "react";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import ShareBox from "@/components/share/ShareBox";
import SuggestBoxInline from "@/components/contact/SuggestBoxInline";

interface LoanInputs {
  principal: number;
  annualRate: number;
  years: number;
}

interface LoanResults {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export default function LoanPaymentCalculator() {
  const [inputs, setInputs] = useState<LoanInputs>({
    principal: 200000,
    annualRate: 5,
    years: 30,
  });

  const [results, setResults] = useState<LoanResults | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!inputs.principal || inputs.principal <= 0) {
      nextErrors.principal = "Loan amount must be greater than 0.";
    }

    if (inputs.annualRate <= 0 || inputs.annualRate > 100) {
      nextErrors.annualRate = "Annual rate must be between 0 and 100%.";
    }

    if (!inputs.years || inputs.years <= 0 || inputs.years > 50) {
      nextErrors.years = "Loan term must be between 1 and 50 years.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;

    const P = inputs.principal;
    const r = inputs.annualRate / 100 / 12; // monthly rate
    const n = inputs.years * 12; // total number of payments

    let monthlyPayment: number;

    if (r === 0) {
      // no interest case
      monthlyPayment = P / n;
    } else {
      const pow = Math.pow(1 + r, n);
      monthlyPayment = (P * r * pow) / (pow - 1);
    }

    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - P;

    setResults({
      monthlyPayment,
      totalPayment,
      totalInterest,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:grid lg:grid-cols-12 lg:gap-8">
      {/* LEFT: editorial content */}
      <article className="lg:col-span-7 prose prose-neutral dark:prose-invert">
        <h1 className="mb-2">Loan Payment Calculator (Principal, Rate, Term)</h1>
        <p className="text-sm opacity-80">
          Category: financial · Subcategory: loans-mortgages-payments
        </p>

        <h2>Overview</h2>
        <p>
          This loan payment calculator helps you estimate the monthly payment for a fixed-rate
          loan based on the principal amount, annual interest rate, and repayment term. It uses
          the standard amortization formula that banks and lenders apply to mortgages, car loans,
          and personal loans.
        </p>

        <h2>How to Use</h2>
        <ol>
          <li>Enter the total amount you plan to borrow under <strong>Loan Amount</strong>.</li>
          <li>
            Provide the <strong>Annual Interest Rate</strong> as a percentage (for example,
            enter 5 for 5%).
          </li>
          <li>
            Set the <strong>Loan Term</strong> in years (for example, 30 for a 30-year mortgage).
          </li>
          <li>Click <strong>Calculate Payment</strong> to see your estimated monthly payment.</li>
          <li>
            Review the total amount paid over the life of the loan and the total interest cost.
          </li>
        </ol>

        <h2>Understanding the Formula</h2>
        <p>
          For a fixed-rate amortizing loan, the monthly payment <code>M</code> is calculated using:
        </p>
        <p className="bg-gray-100 dark:bg-gray-800 p-4 rounded font-mono text-sm">
          M = P × [ r(1 + r)<sup>n</sup> ] / [ (1 + r)<sup>n</sup> − 1 ]
        </p>
        <p>Where:</p>
        <ul>
          <li>
            <strong>P</strong> = Principal (loan amount)
          </li>
          <li>
            <strong>r</strong> = Monthly interest rate (annual rate ÷ 12 ÷ 100)
          </li>
          <li>
            <strong>n</strong> = Total number of payments (years × 12)
          </li>
          <li>
            <strong>M</strong> = Monthly payment
          </li>
        </ul>

        <h2>Example Calculation</h2>
        <p>Imagine the following scenario:</p>
        <ul>
          <li>Loan amount: $200,000</li>
          <li>Annual interest rate: 5%</li>
          <li>Term: 30 years</li>
        </ul>
        <p>This results in approximately:</p>
        <ul>
          <li>Monthly payment: about $1,073.64</li>
          <li>Total paid over 30 years: about $386,511.57</li>
          <li>Total interest cost: about $186,511.57</li>
        </ul>
        <p>
          These numbers illustrate how even a relatively small change in interest rate or term can
          significantly affect the long-term cost of a loan.
        </p>

        <h2>Key Concepts</h2>
        <ul>
          <li>
            <strong>Principal:</strong> the amount you borrow.
          </li>
          <li>
            <strong>Interest rate:</strong> the cost of borrowing money, expressed as a yearly
            percentage.
          </li>
          <li>
            <strong>Term:</strong> how long you will take to repay the loan.
          </li>
          <li>
            <strong>Amortization:</strong> paying off a loan over time with regular, fixed payments.
          </li>
        </ul>

        {/* Disclaimer always at the end of editorial column */}
        <LegalDisclaimer
          kind="financial"
          locale="en"
          note="This calculator is for educational purposes only and does not replace personalized financial advice. Always review loan terms with your lender."
          className="mt-10"
        />
        {/* Share + Suggestion boxes — alinhados com a coluna esquerda, como em /financial */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <ShareBox />
          <SuggestBoxInline />
        </div>
      </article>

      {/* RIGHT: sticky calculator widget */}
      <aside className="mt-8 lg:mt-0 lg:col-span-5">
        <div className="sticky top-24">
          <div className="p-4 border rounded-xl bg-background/60 backdrop-blur">
            <h2 className="text-xl font-semibold mb-4">Loan Payment Calculator</h2>

            <div className="space-y-4">
              {/* Loan Amount */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Loan Amount
                </label>
                <input
                  type="number"
                  className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                    errors.principal ? "border-red-500" : "border-gray-300"
                  }`}
                  value={inputs.principal}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      principal: Number(e.target.value),
                    }))
                  }
                  min={0}
                  step={100}
                  placeholder="e.g. 200000"
                />
                {errors.principal && (
                  <p className="mt-1 text-xs text-red-600">{errors.principal}</p>
                )}
              </div>

              {/* Annual Interest Rate */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                    errors.annualRate ? "border-red-500" : "border-gray-300"
                  }`}
                  value={inputs.annualRate}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      annualRate: Number(e.target.value),
                    }))
                  }
                  min={0}
                  max={100}
                  step={0.1}
                  placeholder="e.g. 5"
                />
                {errors.annualRate && (
                  <p className="mt-1 text-xs text-red-600">{errors.annualRate}</p>
                )}
              </div>

              {/* Loan Term (Years) */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Loan Term (Years)
                </label>
                <input
                  type="number"
                  className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                    errors.years ? "border-red-500" : "border-gray-300"
                  }`}
                  value={inputs.years}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      years: Number(e.target.value),
                    }))
                  }
                  min={1}
                  max={50}
                  step={1}
                  placeholder="e.g. 30"
                />
                {errors.years && (
                  <p className="mt-1 text-xs text-red-600">{errors.years}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleCalculate}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Calculate Payment
              </button>

              {results && (
                <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm dark:bg-slate-900/70">
                  <h3 className="mb-2 font-semibold">Results</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Monthly payment</span>
                      <span className="font-bold text-blue-700">
                        {formatCurrency(results.monthlyPayment)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total paid</span>
                      <span>{formatCurrency(results.totalPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total interest</span>
                      <span className="text-red-600 font-semibold">
                        {formatCurrency(results.totalInterest)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      
    </div>
  );
}
