// Registry for category: financial
import type { CalculatorEntry } from "../../calculatorRegistry";

export const registry: CalculatorEntry[] = [
  {
    slug: "ethereum-gas-fee",
    title: "Ethereum Gas Fee Calculator",
    category: "financial",
    subcategory: "cryptocurrency",
    description: "Calculate the estimated gas fees for Ethereum transactions based on current Gwei prices.",
    loader: () => import("@/components/calculators/Financial/EthereumGaFeeCalculator"),
    urlStyle: "flat"
  },
];