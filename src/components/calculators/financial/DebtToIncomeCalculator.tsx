import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DebtToIncomeCalculator = () => {
  const [grossIncome, setGrossIncome] = useState('');
  const [mortgagePayment, setMortgagePayment] = useState('');
  const [creditCardPayments, setCreditCardPayments] = useState('');
  const [loanPayments, setLoanPayments] = useState('');
  const [otherDebt, setOtherDebt] = useState('');
  const [result, setResult] = useState<{
    totalDebt: number;
    dtiRatio: number;
    recommendation: string;
    status: 'excellent' | 'good' | 'fair' | 'poor';
  } | null>(null);

  const calculateDTI = () => {
    const income = parseFloat(grossIncome);
    const mortgage = parseFloat(mortgagePayment) || 0;
    const creditCards = parseFloat(creditCardPayments) || 0;
    const loans = parseFloat(loanPayments) || 0;
    const other = parseFloat(otherDebt) || 0;

    if (income > 0) {
      const totalDebt = mortgage + creditCards + loans + other;
      const dti = (totalDebt / income) * 100;

      let status: 'excellent' | 'good' | 'fair' | 'poor';
      let recommendation: string;

      if (dti <= 20) {
        status = 'excellent';
        recommendation = 'Excellent DTI ratio. You have good financial flexibility.';
      } else if (dti <= 36) {
        status = 'good';
        recommendation = 'Good DTI ratio. Most lenders will approve loans.';
      } else if (dti <= 43) {
        status = 'fair';
        recommendation = 'Fair DTI ratio. Some loan options may be limited.';
      } else {
        status = 'poor';
        recommendation = 'High DTI ratio. Consider reducing debt before applying for loans.';
      }

      setResult({
        totalDebt: Math.round(totalDebt * 100) / 100,
        dtiRatio: Math.round(dti * 100) / 100,
        recommendation,
        status
      });
    }
  };

  const handleReset = () => {
    setGrossIncome('');
    setMortgagePayment('');
    setCreditCardPayments('');
    setLoanPayments('');
    setOtherDebt('');
    setResult(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-primary';
    }
  };

  return (
    <CalculatorLayout
      title="Debt-to-Income Ratio Calculator"
      description="Calculate your debt-to-income ratio to assess your financial health and borrowing capacity."
      formula="DTI Ratio = (Total Monthly Debt Payments ÷ Gross Monthly Income) × 100"
      example="$2,000 debt payments ÷ $6,000 income × 100 = 33.3% DTI ratio"
    >
      <div className="space-y-4">
        <InputGroup
          label="Gross Monthly Income"
          id="grossIncome"
          type="number"
          value={grossIncome}
          onChange={setGrossIncome}
          placeholder="6000"
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup
            label="Mortgage/Rent Payment"
            id="mortgagePayment"
            type="number"
            value={mortgagePayment}
            onChange={setMortgagePayment}
            placeholder="1500"
          />
          <InputGroup
            label="Credit Card Payments"
            id="creditCardPayments"
            type="number"
            value={creditCardPayments}
            onChange={setCreditCardPayments}
            placeholder="300"
          />
          <InputGroup
            label="Loan Payments"
            id="loanPayments"
            type="number"
            value={loanPayments}
            onChange={setLoanPayments}
            placeholder="400"
          />
          <InputGroup
            label="Other Debt Payments"
            id="otherDebt"
            type="number"
            value={otherDebt}
            onChange={setOtherDebt}
            placeholder="200"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={calculateDTI} className="flex-1">
          Calculate DTI Ratio
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
              title="Total Monthly Debt"
              value={result.totalDebt}
              prefix="$"
              colorClass="text-primary"
            />
            <ResultCard
              title="Debt-to-Income Ratio"
              value={result.dtiRatio}
              suffix="%"
              colorClass={getStatusColor(result.status)}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{result.recommendation}</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Excellent (≤20%):</span>
                  <span className="text-green-600 font-medium">Great financial health</span>
                </div>
                <div className="flex justify-between">
                  <span>Good (21-36%):</span>
                  <span className="text-blue-600 font-medium">Manageable debt load</span>
                </div>
                <div className="flex justify-between">
                  <span>Fair (37-43%):</span>
                  <span className="text-yellow-600 font-medium">Higher debt burden</span>
                </div>
                <div className="flex justify-between">
                  <span>Poor (&gt;43%):</span>
                  <span className="text-red-600 font-medium">Consider debt reduction</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </CalculatorLayout>
  );
};