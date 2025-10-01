import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const AdjustedGrossIncomeCalculator = () => {
  const [grossIncome, setGrossIncome] = useState('');
  const [deductions, setDeductions] = useState('');
  const [result, setResult] = useState<{
    agi: number;
    taxSavings: number;
  } | null>(null);

  const calculateAGI = () => {
    const income = parseFloat(grossIncome);
    const totalDeductions = parseFloat(deductions);

    if (income > 0 && totalDeductions >= 0) {
      const agi = income - totalDeductions;
      const taxSavings = totalDeductions * 0.22; // Estimated 22% tax bracket

      setResult({
        agi: Math.round(agi * 100) / 100,
        taxSavings: Math.round(taxSavings * 100) / 100
      });
    }
  };

  const handleReset = () => {
    setGrossIncome('');
    setDeductions('');
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="Adjusted Gross Income Calculator"
      description="Calculate your adjusted gross income (AGI) by subtracting eligible deductions from your gross income."
      formula="AGI = Gross Income - Above-the-line Deductions"
      example="If you have $75,000 gross income and $5,000 in deductions, your AGI is $70,000."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGroup
          label="Gross Income"
          id="grossIncome"
          type="number"
          value={grossIncome}
          onChange={setGrossIncome}
          placeholder="75000"
          required
        />
        <InputGroup
          label="Total Above-the-line Deductions"
          id="deductions"
          type="number"
          value={deductions}
          onChange={setDeductions}
          placeholder="5000"
        />
      </div>

      <div className="flex gap-4">
        <Button onClick={calculateAGI} className="flex-1">
          Calculate AGI
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {result && (
        <>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              title="Adjusted Gross Income"
              value={result.agi}
              prefix="$"
              colorClass="text-primary"
            />
            <ResultCard
              title="Estimated Tax Savings"
              value={result.taxSavings}
              prefix="$"
              colorClass="text-green-600"
              subtitle="Based on 22% tax bracket"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
};