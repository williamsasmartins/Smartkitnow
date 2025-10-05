import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const MortgageCalculator = () => {
  const [homePrice, setHomePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [loanTerm, setLoanTerm] = useState('30');
  const [interestRate, setInterestRate] = useState('');
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    loanAmount: number;
  } | null>(null);

  const calculateMortgage = () => {
    const price = parseFloat(homePrice);
    const down = parseFloat(downPayment);
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const payments = parseFloat(loanTerm) * 12; // Total number of payments
    const loanAmount = price - down;

    if (price > 0 && down >= 0 && rate > 0 && payments > 0 && loanAmount > 0) {
      const monthlyPayment = (loanAmount * rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
      const totalPayment = monthlyPayment * payments;
      const totalInterest = totalPayment - loanAmount;

      setResult({
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalPayment: Math.round(totalPayment * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        loanAmount: Math.round(loanAmount * 100) / 100
      });
    }
  };

  const handleReset = () => {
    setHomePrice('');
    setDownPayment('');
    setLoanTerm('30');
    setInterestRate('');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mortgage Calculator</CardTitle>
          <CardDescription>
            Calculate your monthly mortgage payment based on home price, down payment, and loan terms.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="homePrice">Home Price ($)</Label>
              <Input
                id="homePrice"
                type="number"
                placeholder="400000"
                value={homePrice}
                onChange={(e) => setHomePrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="downPayment">Down Payment ($)</Label>
              <Input
                id="downPayment"
                type="number"
                placeholder="80000"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loanTerm">Loan Term (years)</Label>
              <Input
                id="loanTerm"
                type="number"
                placeholder="30"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                placeholder="6.5"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="calculate" onClick={calculateMortgage} className="flex-1">
              Calculate Mortgage
            </Button>
            <Button variant="reset" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {result && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        ${result.monthlyPayment.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Monthly Payment</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        ${result.loanAmount.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Loan Amount</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${result.totalPayment.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Total Payment</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        ${result.totalInterest.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Total Interest</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MortgageCalculator;