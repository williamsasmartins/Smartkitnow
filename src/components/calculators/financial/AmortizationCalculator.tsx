import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AmortizationEntry {
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export const AmortizationCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalInterest: number;
    totalPayment: number;
    schedule: AmortizationEntry[];
  } | null>(null);

  const calculateAmortization = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const payments = parseFloat(loanTerm) * 12;

    if (principal > 0 && rate > 0 && payments > 0) {
      const monthlyPayment = (principal * rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
      
      let balance = principal;
      const schedule: AmortizationEntry[] = [];
      
      for (let i = 1; i <= Math.min(payments, 12); i++) { // Show first year only
        const interestPayment = balance * rate;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;
        
        schedule.push({
          payment: i,
          principal: Math.round(principalPayment * 100) / 100,
          interest: Math.round(interestPayment * 100) / 100,
          balance: Math.round(balance * 100) / 100
        });
      }

      const totalPayment = monthlyPayment * payments;
      const totalInterest = totalPayment - principal;

      setResult({
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        totalPayment: Math.round(totalPayment * 100) / 100,
        schedule
      });
    }
  };

  const handleReset = () => {
    setLoanAmount('');
    setInterestRate('');
    setLoanTerm('');
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="Amortization Calculator"
      description="Calculate loan amortization schedule with detailed payment breakdown."
      formula="Monthly Payment = P × [r(1+r)^n] / [(1+r)^n - 1]"
      example="$200,000 loan at 5% for 30 years = $1,073.64 monthly payment"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputGroup
          label="Loan Amount"
          id="loanAmount"
          type="number"
          value={loanAmount}
          onChange={setLoanAmount}
          placeholder="200000"
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
      </div>

      <div className="flex gap-4">
        <Button onClick={calculateAmortization} className="flex-1">
          Calculate Amortization
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {result && (
        <>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              title="Monthly Payment"
              value={result.monthlyPayment}
              prefix="$"
              colorClass="text-primary"
            />
            <ResultCard
              title="Total Interest"
              value={result.totalInterest}
              prefix="$"
              colorClass="text-red-600"
            />
            <ResultCard
              title="Total Payment"
              value={result.totalPayment}
              prefix="$"
              colorClass="text-green-600"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Amortization Schedule (First Year)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Payment #</th>
                      <th className="text-right p-2">Principal</th>
                      <th className="text-right p-2">Interest</th>
                      <th className="text-right p-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((entry) => (
                      <tr key={entry.payment} className="border-b">
                        <td className="p-2">{entry.payment}</td>
                        <td className="text-right p-2">${entry.principal.toLocaleString()}</td>
                        <td className="text-right p-2">${entry.interest.toLocaleString()}</td>
                        <td className="text-right p-2">${entry.balance.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </CalculatorLayout>
  );
};
