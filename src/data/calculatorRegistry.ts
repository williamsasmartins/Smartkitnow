// Registry for category: financial
import type { CalculatorEntry } from "../../calculatorRegistry";

export const registry: CalculatorEntry[] = [
  {
    slug: "bitcoin-investment-return",
    title: "Bitcoin Investment Return Calculator",
    category: "financial",
    subcategory: "cryptocurrency",
    description: "Calculate your potential profit or loss from Bitcoin investments based on buy price, sell price, and investment fees.",
    loader: () => import("@/components/calculators/Financial/BitcoinInveTmentReturnCalculator"),
    urlStyle: "flat"
  },
];