import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/calculators/common/CalculatorLayout";
import { InputGroup } from "@/components/calculators/common/InputGroup";
import { ResultCard } from "@/components/calculators/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const DebtToIncomeCalculator = () => {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyDebt, setMonthlyDebt] = useState('');
  const [dti, setDTI] = useState<number | null>(null);

  const calculateDTI = () => {
    const income = parseFloat(monthlyIncome);
    const debt = parseFloat(monthlyDebt);
    if (income > 0) {
      const dtiValue = (debt / income) * 100;
      setDTI(Math.round(dtiValue * 10) / 10);
    }
  };

  const handleReset = () => {
    setMonthlyIncome('');
    setMonthlyDebt('');
    setDTI(null);
  };

  return (
    <CalculatorLayout
      title="Debt-to-Income Ratio Calculator"
      description="Calculate your debt-to-income (DTI) ratio based on monthly income and debt payments."
      formula="DTI = (Monthly Debt Payments / Monthly Income) × 100%"
      example="Monthly debt $1500, income $5000 = 30% DTI"
    >
      <div className="space-y-4">
        <InputGroup
          label="Monthly Income ($)"
          id="monthlyIncome"
          type="number"
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(e.target.value)}
          placeholder="5000"
          required
        />
        <InputGroup
          label="Monthly Debt Payments ($)"
          id="monthlyDebt"
          type="number"
          value={monthlyDebt}
          onChange={(e) => setMonthlyDebt(e.target.value)}
          placeholder="1500"
          required
        />
        <div className="flex gap-4">
          <Button onClick={calculateDTI} className="flex-1">Calculate</Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>
        {dti !== null && (
          <>
            <Separator />
            <ResultCard
              title="Debt-to-Income Ratio"
              value={dti}
              suffix="%"
              colorClass="text-primary"
            />
          </>
        )}
      </div>
    </CalculatorLayout>
  );
};
