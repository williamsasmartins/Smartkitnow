// Registry for category: financial
import type { CalculatorEntry } from "../../calculatorRegistry";

export const registry: CalculatorEntry[] = [
  {
    slug: "test-auto-loan-calculator",
    title: "Test Auto Loan Calculator",
    category: "financial",
    subcategory: "loans",
    description: "Calculate monthly auto loan payments based on car price, interest rate, and loan term.",
    loader: () => import("@/components/calculators/Financial/TeTAutoLoanCalculatorCalculator"),
    urlStyle: "flat"
  },
];