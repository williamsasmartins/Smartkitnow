import { Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/NotFound";

type LazyComp = React.LazyExoticComponent<React.ComponentType<any>>;
const preferDefault = <T extends Record<string, any>>(m: T, key?: string) =>
  ({ default: (key && m[key]) ? m[key] : (m as any).default }) as { default: React.ComponentType<any> };

const calculators: Record<string, LazyComp> = {
  "area-calculator": lazy(() =>
    import("@/components/calculators/math/AreaCalculator").then(m => preferDefault(m, "AreaCalculator"))
  ),
  "fraction-calculator": lazy(() =>
    import("@/components/calculators/math/FractionCalculator").then(m => preferDefault(m, "FractionCalculator"))
  ),
  "gpa-calculator": lazy(() =>
    import("@/components/calculators/math/GPACalculator").then(m => preferDefault(m, "GPACalculator"))
  ),
  "percentage-calculator": lazy(() =>
    import("@/components/calculators/math/PercentageCalculator").then(m => preferDefault(m, "PercentageCalculator"))
  ),
  "slope-calculator": lazy(() =>
    import("@/components/calculators/math/SlopeCalculator").then(m => preferDefault(m, "SlopeCalculator"))
  ),
};

export default function MathCalculatorPage() {
  const { calculator, subcategory } = useParams();
  const navigate = useNavigate();
  if (!calculator) return <NotFound />;

  const Comp = calculators[calculator];
  if (!Comp) return <NotFound />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="outline" onClick={() => (subcategory ? navigate(`/math/${subcategory}`) : navigate("/math"))}>
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
