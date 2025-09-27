import { Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/NotFound";

type LazyComp = React.LazyExoticComponent<React.ComponentType<any>>;
const preferDefault = <T extends Record<string, any>>(m: T, key?: string) =>
  ({ default: (key && m[key]) ? m[key] : (m as any).default }) as { default: React.ComponentType<any> };

const calculators: Record<string, LazyComp> = {
  "adjusted-body-weight-calculator": lazy(() =>
    import("@/components/calculators/health/AdjustedBodyWeightCalculator").then(m => preferDefault(m, "AdjustedBodyWeightCalculator"))
  ),
  "bmi-calculator": lazy(() =>
    import("@/components/calculators/health/BMICalculator").then(m => preferDefault(m, "BMICalculator"))
  ),
  "bmr-calculator": lazy(() =>
    import("@/components/calculators/health/BMRCalculator").then(m => preferDefault(m, "BMRCalculator"))
  ),
  "body-fat-calculator": lazy(() =>
    import("@/components/calculators/health/BodyFatCalculator").then(m => preferDefault(m, "BodyFatCalculator"))
  ),
  "calorie-calculator": lazy(() =>
    import("@/components/calculators/health/CalorieCalculator").then(m => preferDefault(m, "CalorieCalculator"))
  ),
  "calories-to-kilograms-calculator": lazy(() =>
    import("@/components/calculators/health/CaloriesToKilogramsCalculator").then(m => preferDefault(m, "CaloriesToKilogramsCalculator"))
  ),
  "imc-calculator": lazy(() =>
    import("@/components/calculators/health/IMCCalculator").then(m => preferDefault(m, "IMCCalculator"))
  ),
  "tdee-calculator": lazy(() =>
    import("@/components/calculators/health/TDEECalculator").then(m => preferDefault(m, "TDEECalculator"))
  ),
};

export default function HealthCalculatorPage() {
  const { calculator, subcategory } = useParams();
  const navigate = useNavigate();
  if (!calculator) return <NotFound />;

  const Comp = calculators[calculator];
  if (!Comp) return <NotFound />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="outline" onClick={() => (subcategory ? navigate(`/health/${subcategory}`) : navigate("/health"))}>
          ← Voltar
        </Button>
        <h1 className="text-2xl font-bold">
          {calculator.split("-").map(s => s[0]?.toUpperCase() + s.slice(1)).join(" ")}
        </h1>
      </div>
      <Suspense fallback={<div className="mx-auto max-w-2xl py-10">Carregando calculadora…</div>}>
        <Comp />
      </Suspense>
    </div>
  );
}
