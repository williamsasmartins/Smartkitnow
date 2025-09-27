import React from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";

export const HealthCalculators = () => {
  return (
    <CalculatorLayout
      title="Health Calculators"
      description="Complete collection of health and fitness calculation tools"
      formula="Various health formulas"
      example="Choose from multiple health calculators"
    >
      <div className="text-center p-8">
        <p className="text-muted-foreground">Health calculators ready for implementation</p>
      </div>
    </CalculatorLayout>
  );
};
