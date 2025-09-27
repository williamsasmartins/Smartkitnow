import { Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/NotFound";

type LazyComp = React.LazyExoticComponent<React.ComponentType<any>>;
const preferDefault = <T extends Record<string, any>>(m: T, key?: string) =>
  ({ default: (key && m[key]) ? m[key] : (m as any).default }) as { default: React.ComponentType<any> };

const calculators: Record<string, LazyComp> = {
  "aquarium-volume-calculator": lazy(() =>
    import("@/components/calculators/pets/AquariumVolumeCalculator").then(m => preferDefault(m, "AquariumVolumeCalculator"))
  ),
  "aquarium-weight-calculator": lazy(() =>
    import("@/components/calculators/pets/AquariumWeightCalculator").then(m => preferDefault(m, "AquariumWeightCalculator"))
  ),
  "cat-age-calculator": lazy(() =>
    import("@/components/calculators/pets/CatAgeCalculator").then(m => preferDefault(m, "CatAgeCalculator"))
  ),
  "dog-age-calculator": lazy(() =>
    import("@/components/calculators/pets/DogAgeCalculator").then(m => preferDefault(m, "DogAgeCalculator"))
  ),
  "dog-calorie-calculator": lazy(() =>
    import("@/components/calculators/pets/DogCalorieCalculator").then(m => preferDefault(m, "DogCalorieCalculator"))
  ),
};

export default function PetsCalculatorPage() {
  const { calculator, subcategory } = useParams();
  const navigate = useNavigate();
  if (!calculator) return <NotFound />;

  const Comp = calculators[calculator];
  if (!Comp) return <NotFound />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="outline" onClick={() => (subcategory ? navigate(`/pets/${subcategory}`) : navigate("/pets"))}>
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
