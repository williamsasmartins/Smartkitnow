import React from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";

export const TimeCalculators = () => {
  return (
    <CalculatorLayout
      title="Time Calculators"
      description="Complete collection of time and date calculation tools"
      formula="Various time formulas"
      example="Choose from multiple time calculators"
    >
      <div className="text-center p-8">
        <p className="text-muted-foreground">Time calculators ready for implementation</p>
      </div>
    </CalculatorLayout>
  );
};
