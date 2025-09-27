import React from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";

export const PetsCalculators = () => {
  return (
    <CalculatorLayout
      title="Pet Calculators"
      description="Complete collection of pet care calculation tools"
      formula="Various pet care formulas"
      example="Choose from multiple pet calculators"
    >
      <div className="text-center p-8">
        <p className="text-muted-foreground">Pet calculators ready for implementation</p>
      </div>
    </CalculatorLayout>
  );
};