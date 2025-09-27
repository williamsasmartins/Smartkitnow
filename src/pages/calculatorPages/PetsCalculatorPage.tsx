import React, { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { CalculatorLayout } from "../../components/calculators/common/CalculatorLayout";

const componentMap: Record<string, () => Promise<{ default: React.FC<any> }>> = {
  CatAgeCalculator: () =>
    import("../../components/calculators/pets/CatAgeCalculator").then(mod => ({ default: mod.CatAgeCalculator })),
  DogAgeCalculator: () =>
    import("../../components/calculators/pets/DogAgeCalculator").then(mod => ({ default: mod.DogAgeCalculator })),
  DogCalorieCalculator: () =>
    import("../../components/calculators/pets/DogCalorieCalculator").then(mod => ({ default: mod.DogCalorieCalculator })),
  AquariumVolumeCalculator: () =>
    import("../../components/calculators/pets/AquariumVolumeCalculator").then(mod => ({ default: mod.AquariumVolumeCalculator })),
  AquariumWeightCalculator: () =>
    import("../../components/calculators/pets/AquariumWeightCalculator").then(mod => ({ default: mod.AquariumWeightCalculator })),
};

const PetsCalculatorPage: React.FC = () => {
  const { calculator } = useParams<{ calculator: string }>();

  if (!calculator || !componentMap[calculator]) {
    return <div className="mx-auto max-w-3xl px-4 py-10">Calculadora não encontrada.</div>;
  }

  const LazyComponent = lazy(componentMap[calculator]);

  return (
    <CalculatorLayout
      title={`${calculator} | Smart Kit Now`}
      description={`Use our ${calculator} calculator for pets. Accurate and easy to use.`}
      keywords={`pets calculators, ${calculator}, online calculator`}
      calculatorName={calculator}
      formula=""
      sources={[]}
    >
      <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-10">Carregando calculadora...</div>}>
        <LazyComponent />
      </Suspense>
    </CalculatorLayout>
  );
};

export default PetsCalculatorPage;
