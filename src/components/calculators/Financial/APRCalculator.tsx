import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const APRCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [fees, setFees] = useState('');
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalCost: number;
    apr: number;
    totalFees: number;
  } | null>(null);

  const calculateAPR = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const payments = parseFloat(loanTerm) * 12;
    const totalFees = parseFloat(fees) || 0;

    if (principal > 0 && rate >= 0 && payments > 0) {
      // Monthly payment calculation
      let monthlyPayment = 0;
      if (rate > 0) {
        monthlyPayment = (principal * rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
      } else {
        monthlyPayment = principal / payments;
      }
      
      // Total cost including fees
      const totalCost = (monthlyPayment * payments) + totalFees;
      
      // APR calculation (simplified)
      const totalInterestAndFees = totalCost - principal;
      const apr = (totalInterestAndFees / principal / (payments / 12)) * 100;

      setResult({
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        apr: Math.round(apr * 100) / 100,
        totalFees
      });
    }
  };

  const handleReset = () => {
    setLoanAmount('');
    setInterestRate('');
    setLoanTerm('');
    setFees('');
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="APR Calculator"
      description="Calculate the Annual Percentage Rate (APR) including all loan fees and costs."
      formula="APR includes interest rate plus fees distributed over loan term"
      example="5% interest rate + $2,000 fees on $100,000 loan may result in 5.5% APR"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGroup
          label="Loan Amount"
          id="loanAmount"
          type="number"
          value={loanAmount}
          onChange={setLoanAmount}
          placeholder="100000"
          required
        />
        <InputGroup
          label="Annual Interest Rate (%)"
          id="interestRate"
          type="number"
          value={interestRate}
          onChange={setInterestRate}
          placeholder="5"
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
          required
        />
        <InputGroup
          label="Total Fees and Costs"
          id="fees"
          type="number"
          value={fees}
          onChange={setFees}
          placeholder="2000"
        />
      </div>

      <div className="flex gap-4">
        <Button onClick={calculateAPR} className="flex-1">
          Calculate APR
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
              title="Monthly Payment"
              value={result.monthlyPayment}
              prefix="$"
              colorClass="text-primary"
            />
            <ResultCard
              title="APR"
              value={result.apr}
              suffix="%"
              colorClass="text-red-600"
            />
            <ResultCard
              title="Total Cost"
              value={result.totalCost}
              prefix="$"
              colorClass="text-orange-600"
            />
            <ResultCard
              title="Total Fees"
              value={result.totalFees}
              prefix="$"
              colorClass="text-blue-600"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
};