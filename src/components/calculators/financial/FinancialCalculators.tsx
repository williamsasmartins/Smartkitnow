import React from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";

export const FinancialCalculators = () => {
  return (
    <CalculatorLayout
      title="Financial Calculators"
      description="Complete collection of financial calculation tools"
      formula="Various financial formulas"
      example="Choose from multiple financial calculators"
    >
      <div className="text-center p-8">
        <p className="text-muted-foreground">Financial calculators ready for implementation</p>
      </div>
    </CalculatorLayout>
  );
};