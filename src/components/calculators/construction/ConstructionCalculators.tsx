import React from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";

export const ConstructionCalculators = () => {
  return (
    <CalculatorLayout
      title="Construction Calculators"
      description="Complete collection of construction calculation tools"
      formula="Various construction formulas"
      example="Choose from multiple construction calculators"
    >
      <div className="text-center p-8">
        <p className="text-muted-foreground">Construction calculators ready for implementation</p>
      </div>
    </CalculatorLayout>
  );
};