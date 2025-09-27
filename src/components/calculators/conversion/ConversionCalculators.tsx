import React from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";

export const ConversionCalculators = () => {
  return (
    <CalculatorLayout
      title="Conversion Calculators"
      description="Complete collection of unit conversion tools"
      formula="Various conversion formulas"
      example="Choose from multiple conversion calculators"
    >
      <div className="text-center p-8">
        <p className="text-muted-foreground">Conversion calculators ready for implementation</p>
      </div>
    </CalculatorLayout>
  );
};