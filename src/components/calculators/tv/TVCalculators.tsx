import React from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";

export const TVCalculators = () => {
  return (
    <CalculatorLayout
      title="TV Calculators"
      description="Complete collection of TV and display calculation tools"
      formula="Various TV formulas"
      example="Choose from multiple TV calculators"
    >
      <div className="text-center p-8">
        <p className="text-muted-foreground">TV calculators ready for implementation</p>
      </div>
    </CalculatorLayout>
  );
};