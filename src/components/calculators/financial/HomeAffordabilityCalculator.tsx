import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const HomeAffordabilityCalculator = () => {
  const [annualIncome, setAnnualIncome] = useState('');
  const [monthlyDebt, setMonthlyDebt] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('30');
  const [result, setResult] = useState<{
    maxHomePrice: number;
    maxLoanAmount: number;
    monthlyPayment: number;
    dtiRatio: number;
  } | null>(null);

  const calculateAffordability = () => {
    const income = parseFloat(annualIncome);
    const debt = parseFloat(monthlyDebt) || 0;
    const downPmt = parseFloat(downPayment);
    const rate = parseFloat(interestRate) / 100 / 12;
    const payments = parseFloat(loanTerm) * 12;

    if (income > 0 && downPmt >= 0 && rate > 0 && payments > 0) {
      const monthlyIncome = income / 12;
      const maxDebtPayment = monthlyIncome * 0.28; // 28% rule
      const availableForMortgage = maxDebtPayment - debt;
      
      if (availableForMortgage > 0) {
        // Calculate max loan amount based on payment capacity
        const maxLoanAmount = (availableForMortgage * (Math.pow(1 + rate, payments) - 1)) / (rate * Math.pow(1 + rate, payments));
        const maxHomePrice = maxLoanAmount + downPmt;
        const dti = ((debt + availableForMortgage) / monthlyIncome) * 100;

        setResult({
          maxHomePrice: Math.round(maxHomePrice * 100) / 100,
          maxLoanAmount: Math.round(maxLoanAmount * 100) / 100,
          monthlyPayment: Math.round(availableForMortgage * 100) / 100,
          dtiRatio: Math.round(dti * 100) / 100
        });
      }
    }
  };

  const handleReset = () => {
    setAnnualIncome('');
    setMonthlyDebt('');
    setDownPayment('');
    setInterestRate('');
    setLoanTerm('30');
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="Home Affordability Calculator"
      description="Determine how much house you can afford based on your income and debts."
      formula="Max Payment = Monthly Income × 28% - Monthly Debt Payments"
      example="$60,000 income with $500 debt = ~$900 available for mortgage"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGroup
          label="Annual Income"
          id="annualIncome"
          type="number"
          value={annualIncome}
          onChange={setAnnualIncome}
          placeholder="60000"
          required
        />
        <InputGroup
          label="Monthly Debt Payments"
          id="monthlyDebt"
          type="number"
          value={monthlyDebt}
          onChange={setMonthlyDebt}
          placeholder="500"
        />
        <InputGroup
          label="Down Payment"
          id="downPayment"
          type="number"
          value={downPayment}
          onChange={setDownPayment}
          placeholder="20000"
          required
        />
        <InputGroup
          label="Interest Rate (%)"
          id="interestRate"
          type="number"
          value={interestRate}
          onChange={setInterestRate}
          placeholder="6.5"
          step="0.01"
          required
        />
        <InputGroup
          label="Loan Term (years)"
          id="loanTerm"
          type="number"
          value={loanTerm}
          onChange={setLoanTerm}
          placeholder="30"
        />
      </div>

      <div className="flex gap-4">
        <Button onClick={calculateAffordability} className="flex-1">
          Calculate Affordability
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
              title="Max Home Price"
              value={result.maxHomePrice}
              prefix="$"
              colorClass="text-primary"
            />
            <ResultCard
              title="Max Loan Amount"
              value={result.maxLoanAmount}
              prefix="$"
              colorClass="text-green-600"
            />
            <ResultCard
              title="Monthly Payment"
              value={result.monthlyPayment}
              prefix="$"
              colorClass="text-blue-600"
            />
            <ResultCard
              title="DTI Ratio"
              value={result.dtiRatio}
              suffix="%"
              colorClass="text-purple-600"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
};