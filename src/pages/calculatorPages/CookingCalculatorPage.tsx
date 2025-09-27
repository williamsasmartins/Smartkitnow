import { Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/NotFound";

type LazyComp = React.LazyExoticComponent<React.ComponentType<any>>;
const preferDefault = <T extends Record<string, any>>(m: T, key?: string) =>
  ({ default: (key && m[key]) ? m[key] : (m as any).default }) as { default: React.ComponentType<any> };

const calculators: Record<string, LazyComp> = {
  "cake-calculator": lazy(() =>
    import("@/components/calculators/cooking/CakeCalculator").then(m => preferDefault(m, "CakeCalculator"))
  ),
  "cooking-conversion-calculator": lazy(() =>
    import("@/components/calculators/cooking/CookingConversionCalculator").then(m => preferDefault(m, "CookingConversionCalculator"))
  ),
  "cooking-timer": lazy(() =>
    import("@/components/calculators/cooking/CookingTimer").then(m => preferDefault(m, "CookingTimer"))
  ),
  "oven-temperature-conversion": lazy(() =>
    import("@/components/calculators/cooking/OvenTemperatureConverter").then(m => preferDefault(m, "OvenTemperatureConverter"))
  ),
  "pizza-calculator": lazy(() =>
    import("@/components/calculators/cooking/PizzaCalculator").then(m => preferDefault(m, "PizzaCalculator"))
  ),
  "recipe-scale-conversion": lazy(() =>
    import("@/components/calculators/cooking/RecipeScalingCalculator").then(m => preferDefault(m, "RecipeScalingCalculator"))
  ),
};

export default function CookingCalculatorPage() {
  const { calculator, subcategory } = useParams();
  const navigate = useNavigate();
  if (!calculator) return <NotFound />;

  const Comp = calculators[calculator];
  if (!Comp) return <NotFound />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="outline" onClick={() => (subcategory ? navigate(`/cooking/${subcategory}`) : navigate("/cooking"))}>
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
