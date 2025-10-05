import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const MortgageRefinanceCalculator = () => {
  const [currentBalance, setCurrentBalance] = useState('');
  const [currentRate, setCurrentRate] = useState('');
  const [newRate, setNewRate] = useState('');
  const [newTerm, setNewTerm] = useState('');
  const [closingCosts, setClosingCosts] = useState('');
  const [result, setResult] = useState<{
    currentPayment: number;
    newPayment: number;
    monthlySavings: number;
    totalSavings: number;
    breakEvenMonths: number;
  } | null>(null);

  const calculateRefinance = () => {
    const balance = parseFloat(currentBalance);
    const oldRate = parseFloat(currentRate) / 100 / 12;
    const newRateMonthly = parseFloat(newRate) / 100 / 12;
    const payments = parseFloat(newTerm) * 12;
    const costs = parseFloat(closingCosts) || 0;

    if (balance > 0 && oldRate > 0 && newRateMonthly > 0 && payments > 0) {
      // Current payment calculation
      const currentPayment = (balance * oldRate * Math.pow(1 + oldRate, payments)) / (Math.pow(1 + oldRate, payments) - 1);
      
      // New payment calculation
      const newPayment = (balance * newRateMonthly * Math.pow(1 + newRateMonthly, payments)) / (Math.pow(1 + newRateMonthly, payments) - 1);
      
      const monthlySavings = currentPayment - newPayment;
      const totalSavings = monthlySavings * payments - costs;
      const breakEvenMonths = monthlySavings > 0 ? costs / monthlySavings : 0;

      setResult({
        currentPayment: Math.round(currentPayment * 100) / 100,
        newPayment: Math.round(newPayment * 100) / 100,
        monthlySavings: Math.round(monthlySavings * 100) / 100,
        totalSavings: Math.round(totalSavings * 100) / 100,
        breakEvenMonths: Math.round(breakEvenMonths * 100) / 100
      });
    }
  };

  const handleReset = () => {
    setCurrentBalance('');
    setCurrentRate('');
    setNewRate('');
    setNewTerm('');
    setClosingCosts('');
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="Mortgage Refinance Calculator"
      description="Calculate potential savings and break-even point when refinancing your mortgage."
      formula="Monthly Payment = P × [r(1+r)^n] / [(1+r)^n - 1]"
      example="Refinancing $200,000 from 6% to 4% could save $240/month"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGroup
          label="Current Loan Balance"
          id="currentBalance"
          type="number"
          value={currentBalance}
          onChange={setCurrentBalance}
          placeholder="200000"
          required
        />
        <InputGroup
          label="Current Interest Rate (%)"
          id="currentRate"
          type="number"
          value={currentRate}
          onChange={setCurrentRate}
          placeholder="6"
          step="0.01"
          required
        />
        <InputGroup
          label="New Interest Rate (%)"
          id="newRate"
          type="number"
          value={newRate}
          onChange={setNewRate}
          placeholder="4"
          step="0.01"
          required
        />
        <InputGroup
          label="New Loan Term (years)"
          id="newTerm"
          type="number"
          value={newTerm}
          onChange={setNewTerm}
          placeholder="30"
          required
        />
        <InputGroup
          label="Closing Costs"
          id="closingCosts"
          type="number"
          value={closingCosts}
          onChange={setClosingCosts}
          placeholder="5000"
        />
      </div>

      <div className="flex gap-4">
        <Button variant="calculate" onClick={calculateRefinance} className="flex-1">
          Calculate Refinance
        </Button>
        <Button variant="reset" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {result && (
        <>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <ResultCard
              title="Current Payment"
              value={result.currentPayment}
              prefix="$"
              colorClass="text-red-600"
            />
            <ResultCard
              title="New Payment"
              value={result.newPayment}
              prefix="$"
              colorClass="text-green-600"
            />
            <ResultCard
              title="Monthly Savings"
              value={result.monthlySavings}
              prefix="$"
              colorClass="text-primary"
            />
            <ResultCard
              title="Total Savings"
              value={result.totalSavings}
              prefix="$"
              colorClass="text-blue-600"
            />
            <ResultCard
              title="Break-even (months)"
              value={result.breakEvenMonths}
              colorClass="text-purple-600"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
};

export default MortgageRefinanceCalculator;