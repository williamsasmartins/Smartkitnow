import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/calculators/common/CalculatorLayout";
import { InputGroup } from "@/components/calculators/common/InputGroup";
import { ResultCard } from "@/components/calculators/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const AdjustedGrossIncomeCalculator = () => {
  const [grossIncome, setGrossIncome] = useState('');
  const [adjustments, setAdjustments] = useState('');
  const [agi, setAGI] = useState<number | null>(null);

  const calculateAGI = () => {
    const income = parseFloat(grossIncome);
    const adj = parseFloat(adjustments);
    if (income >= 0 && adj >= 0) {
      setAGI(income - adj);
    }
  };

  const handleReset = () => {
    setGrossIncome('');
    setAdjustments('');
    setAGI(null);
  };

  return (
    <CalculatorLayout
      title="Adjusted Gross Income Calculator"
      description="Calculate your adjusted gross income (AGI) by subtracting adjustments from gross income."
      formula="AGI = Gross Income - Adjustments"
      example="Gross $80,000, adjustments $5,000 = AGI $75,000"
    >
      <div className="space-y-4">
        <InputGroup
          label="Gross Income ($)"
          id="grossIncome"
          type="number"
          value={grossIncome}
          onChange={(e) => setGrossIncome(e.target.value)}
          placeholder="80000"
          required
        />
        <InputGroup
          label="Adjustments ($)"
          id="adjustments"
          type="number"
          value={adjustments}
          onChange={(e) => setAdjustments(e.target.value)}
          placeholder="5000"
          required
        />
        <div className="flex gap-4">
          <Button onClick={calculateAGI} className="flex-1">Calculate</Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>
        {agi !== null && (
          <>
            <Separator />
            <ResultCard
              title="Adjusted Gross Income (AGI)"
              value={agi.toFixed(2)}
              suffix="$"
              colorClass="text-primary"
            />
          </>
        )}
      </div>
    </CalculatorLayout>
  );
};