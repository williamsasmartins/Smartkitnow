import { Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/NotFound";

type LazyComp = React.LazyExoticComponent<React.ComponentType<any>>;

// Helper: resolve default OU named export com o mesmo nome do arquivo
const preferDefault =
  <T extends Record<string, any>>(mod: T, key?: string) =>
    ({ default: (key && mod[key]) ? mod[key] : (mod as any).default }) as { default: React.ComponentType<any> };

// 🔧 Mapa slug -> componente (aceita named ou default export)
const calculators: Record<string, LazyComp> = {
  "adjusted-gross-income-calculator": lazy(() =>
    import("@/components/calculators/financial/AdjustedGrossIncomeCalculator")
      .then((m) => preferDefault(m, "AdjustedGrossIncomeCalculator"))
  ),
  "annual-income-calculator": lazy(() =>
    import("@/components/calculators/financial/AnnualIncomeCalculator")
      .then((m) => preferDefault(m, "AnnualIncomeCalculator"))
  ),
  "biweekly-pay-calculator": lazy(() =>
    import("@/components/calculators/financial/BiweeklyPayCalculator")
      .then((m) => preferDefault(m, "BiweeklyPayCalculator"))
  ),
  "compound-interest-calculator": lazy(() =>
    import("@/components/calculators/financial/CompoundInterestCalculator")
      .then((m) => preferDefault(m, "CompoundInterestCalculator"))
  ),
  "debt-to-income-calculator": lazy(() =>
    import("@/components/calculators/financial/DebtToIncomeCalculator")
      .then((m) => preferDefault(m, "DebtToIncomeCalculator"))
  ),
  "discount-calculator": lazy(() =>
    import("@/components/calculators/financial/DiscountCalculator")
      .then((m) => preferDefault(m, "DiscountCalculator"))
  ),
  "home-affordability-calculator": lazy(() =>
    import("@/components/calculators/financial/HomeAffordabilityCalculator")
      .then((m) => preferDefault(m, "HomeAffordabilityCalculator"))
  ),
  "hourly-to-salary-calculator": lazy(() =>
    import("@/components/calculators/financial/HourlyToSalaryCalculator")
      .then((m) => preferDefault(m, "HourlyToSalaryCalculator"))
  ),
  "investment-return-calculator": lazy(() =>
    import("@/components/calculators/financial/InvestmentReturnCalculator")
      .then((m) => preferDefault(m, "InvestmentReturnCalculator"))
  ),
  "loan-calculator": lazy(() =>
    import("@/components/calculators/financial/LoanCalculator")
      .then((m) => preferDefault(m, "LoanCalculator"))
  ),
  "mortgage-calculator": lazy(() =>
    import("@/components/calculators/financial/MortgageCalculator")
      .then((m) => preferDefault(m, "MortgageCalculator"))
  ),
  "mortgage-refinance-calculator": lazy(() =>
    import("@/components/calculators/financial/MortgageRefinanceCalculator")
      .then((m) => preferDefault(m, "MortgageRefinanceCalculator"))
  ),
  "refinance-breakeven-calculator": lazy(() =>
    import("@/components/calculators/financial/RefinanceBreakevenCalculator")
      .then((m) => preferDefault(m, "RefinanceBreakevenCalculator"))
  ),
  "roi-calculator": lazy(() =>
    import("@/components/calculators/financial/ROICalculator")
      .then((m) => preferDefault(m, "ROICalculator"))
  ),
  "simple-interest-calculator": lazy(() =>
    import("@/components/calculators/financial/SimpleInterestCalculator")
      .then((m) => preferDefault(m, "SimpleInterestCalculator"))
  ),
  "tip-calculator": lazy(() =>
    import("@/components/calculators/financial/TipCalculator")
      .then((m) => preferDefault(m, "TipCalculator"))
  ),
  "apr-calculator": lazy(() =>
    import("@/components/calculators/financial/APRCalculator")
      .then((m) => preferDefault(m, "APRCalculator"))
  ),
};

export default function FinancialCalculatorPage() {
  const { calculator, subcategory } = useParams();
  const navigate = useNavigate();

  if (!calculator) return <NotFound />;

  const CalculatorComp = calculators[calculator];

  if (!CalculatorComp) {
    console.warn("Unknown financial calculator slug:", calculator);
    return <NotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() =>
            subcategory ? navigate(`/financial/${subcategory}`) : navigate("/financial")
          }
        >
          ← Voltar
        </Button>
        <h1 className="text-2xl font-bold">
          {calculator
            .split("-")
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(" ")}
        </h1>
      </div>

      <Suspense fallback={<div className="mx-auto max-w-2xl py-10">Carregando calculadora…</div>}>
        <CalculatorComp />
      </Suspense>
    </div>
  );
}
