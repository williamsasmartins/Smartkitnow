import React, { lazy, Suspense } from "react";
import { CalculatorLayout } from "@/components/calculators/common/CalculatorLayout";

const RecipeScalingCalculator = lazy(() =>
  import("@/components/calculators/cooking/RecipeScalingCalculator")
);

export default function CookingCalculatorPage() {
  return (
    <CalculatorLayout
      title="Recipe Scaling Calculator"
      description="Scale your recipe ingredients based on desired servings"
      formula="Scaled Amount = (Original Amount * Desired Servings) / Original Servings"
      calculatorName="Recipe Scaling Calculator"
      sources={[]}
    >
      <Suspense fallback={<div>Loading Recipe Scaling Calculator...</div>}>
        <RecipeScalingCalculator />
      </Suspense>
    </CalculatorLayout>
  );
}
