import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const RefinanceBreakevenCalculator = () => {
  const [currentPayment, setCurrentPayment] = useState('');
  const [newPayment, setNewPayment] = useState('');
  const [closingCosts, setClosingCosts] = useState('');
  const [result, setResult] = useState<{
    monthlySavings: number;
    breakEvenMonths: number;
    breakEvenYears: number;
    annualSavings: number;
  } | null>(null);

  const calculateBreakeven = () => {
    const current = parseFloat(currentPayment);
    const newPmt = parseFloat(newPayment);
    const costs = parseFloat(closingCosts);

    if (current > 0 && newPmt > 0 && costs > 0) {
      const monthlySavings = current - newPmt;
      
      if (monthlySavings > 0) {
        const breakEvenMonths = costs / monthlySavings;
        const breakEvenYears = breakEvenMonths / 12;
        const annualSavings = monthlySavings * 12;

        setResult({
          monthlySavings: Math.round(monthlySavings * 100) / 100,
          breakEvenMonths: Math.round(breakEvenMonths * 100) / 100,
          breakEvenYears: Math.round(breakEvenYears * 100) / 100,
          annualSavings: Math.round(annualSavings * 100) / 100
        });
      }
    }
  };

  const handleReset = () => {
    setCurrentPayment('');
    setNewPayment('');
    setClosingCosts('');
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="Refinance Breakeven Calculator"
      description="Calculate how long it will take to break even on refinancing costs."
      formula="Breakeven Time = Closing Costs ÷ Monthly Savings"
      example="$3,000 costs ÷ $200 savings = 15 months to break even"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputGroup
          label="Current Monthly Payment"
          id="currentPayment"
          type="number"
          value={currentPayment}
          onChange={setCurrentPayment}
          placeholder="1500"
          required
        />
        <InputGroup
          label="New Monthly Payment"
          id="newPayment"
          type="number"
          value={newPayment}
          onChange={setNewPayment}
          placeholder="1300"
          required
        />
        <InputGroup
          label="Closing Costs"
          id="closingCosts"
          type="number"
          value={closingCosts}
          onChange={setClosingCosts}
          placeholder="3000"
          required
        />
      </div>

      <div className="flex gap-4">
        <Button onClick={calculateBreakeven} className="flex-1">
          Calculate Breakeven
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {result && (
        <>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              title="Monthly Savings"
              value={result.monthlySavings}
              prefix="$"
              colorClass="text-green-600"
            />
            <ResultCard
              title="Breakeven (months)"
              value={result.breakEvenMonths}
              colorClass="text-primary"
            />
            <ResultCard
              title="Breakeven (years)"
              value={result.breakEvenYears}
              colorClass="text-blue-600"
            />
            <ResultCard
              title="Annual Savings"
              value={result.annualSavings}
              prefix="$"
              colorClass="text-purple-600"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
};
