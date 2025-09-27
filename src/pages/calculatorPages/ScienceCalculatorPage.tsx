import { Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/NotFound";

type LazyComp = React.LazyExoticComponent<React.ComponentType<any>>;
const preferDefault = <T extends Record<string, any>>(m: T, key?: string) =>
  ({ default: (key && m[key]) ? m[key] : (m as any).default }) as { default: React.ComponentType<any> };

const calculators: Record<string, LazyComp> = {
  "density-calculator": lazy(() =>
    import("@/components/calculators/science/DensityCalculator").then(m => preferDefault(m, "DensityCalculator"))
  ),
  "force-calculator": lazy(() =>
    import("@/components/calculators/science/ForceCalculator").then(m => preferDefault(m, "ForceCalculator"))
  ),
  "molarity-calculator": lazy(() =>
    import("@/components/calculators/science/MolarityCalculator").then(m => preferDefault(m, "MolarityCalculator"))
  ),
  "molar-mass-calculator": lazy(() =>
    import("@/components/calculators/science/MolarMassCalculator").then(m => preferDefault(m, "MolarMassCalculator"))
  ),
  "physics-calculator": lazy(() =>
    import("@/components/calculators/science/PhysicsCalculator").then(m => preferDefault(m, "PhysicsCalculator"))
  ),
  "velocity-calculator": lazy(() =>
    import("@/components/calculators/science/VelocityCalculator").then(m => preferDefault(m, "VelocityCalculator"))
  ),
};

export default function ScienceCalculatorPage() {
  const { calculator, subcategory } = useParams();
  const navigate = useNavigate();
  if (!calculator) return <NotFound />;

  const Comp = calculators[calculator];
  if (!Comp) return <NotFound />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="outline" onClick={() => (subcategory ? navigate(`/science/${subcategory}`) : navigate("/science"))}>
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
