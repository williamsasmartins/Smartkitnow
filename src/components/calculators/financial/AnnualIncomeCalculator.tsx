import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const AnnualIncomeCalculator = () => {
  const [payAmount, setPayAmount] = useState('');
  const [payPeriod, setPayPeriod] = useState('hourly');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [result, setResult] = useState<{
    annualIncome: number;
    monthlyIncome: number;
    weeklyIncome: number;
  } | null>(null);

  const calculateIncome = () => {
    const amount = parseFloat(payAmount);
    const hours = parseFloat(hoursPerWeek);

    if (amount > 0) {
      let annual = 0;
      
      switch (payPeriod) {
        case 'hourly':
          annual = amount * hours * 52;
          break;
        case 'daily':
          annual = amount * 5 * 52;
          break;
        case 'weekly':
          annual = amount * 52;
          break;
        case 'biweekly':
          annual = amount * 26;
          break;
        case 'monthly':
          annual = amount * 12;
          break;
        case 'annual':
          annual = amount;
          break;
      }

      setResult({
        annualIncome: Math.round(annual * 100) / 100,
        monthlyIncome: Math.round((annual / 12) * 100) / 100,
        weeklyIncome: Math.round((annual / 52) * 100) / 100
      });
    }
  };

  const handleReset = () => {
    setPayAmount('');
    setPayPeriod('hourly');
    setHoursPerWeek('40');
    setResult(null);
  };

  const payPeriodOptions = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'annual', label: 'Annual' }
  ];

  return (
    <CalculatorLayout
      title="Annual Income Calculator"
      description="Convert your hourly, daily, weekly, or monthly pay into annual income."
      formula="Annual Income = Pay Amount × Pay Periods per Year"
      example="$25/hour × 40 hours/week × 52 weeks = $52,000 annual income"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputGroup
          label="Pay Amount"
          id="payAmount"
          type="number"
          value={payAmount}
          onChange={setPayAmount}
          placeholder="25"
          step="0.01"
          required
        />
        <InputGroup
          label="Pay Period"
          id="payPeriod"
          type="select"
          value={payPeriod}
          onChange={setPayPeriod}
          options={payPeriodOptions}
        />
        {payPeriod === 'hourly' && (
          <InputGroup
            label="Hours per Week"
            id="hoursPerWeek"
            type="number"
            value={hoursPerWeek}
            onChange={setHoursPerWeek}
            placeholder="40"
          />
        )}
      </div>

      <div className="flex gap-4">
        <Button onClick={calculateIncome} className="flex-1">
          Calculate Income
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
              title="Annual Income"
              value={result.annualIncome}
              prefix="$"
              colorClass="text-primary"
            />
            <ResultCard
              title="Monthly Income"
              value={result.monthlyIncome}
              prefix="$"
              colorClass="text-green-600"
            />
            <ResultCard
              title="Weekly Income"
              value={result.weeklyIncome}
              prefix="$"
              colorClass="text-blue-600"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
};