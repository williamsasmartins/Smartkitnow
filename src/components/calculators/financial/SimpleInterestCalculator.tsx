import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const SimpleInterestCalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [time, setTime] = useState('');
  const [timeUnit, setTimeUnit] = useState('years');
  const [result, setResult] = useState<{
    simpleInterest: number;
    totalAmount: number;
    effectiveRate: number;
  } | null>(null);

  const calculateSimpleInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100;
    let t = parseFloat(time);

    // Convert time to years if needed
    if (timeUnit === 'months') {
      t = t / 12;
    } else if (timeUnit === 'days') {
      t = t / 365;
    }

    if (p > 0 && r >= 0 && t > 0) {
      const interest = p * r * t;
      const total = p + interest;
      const effectiveRate = (interest / p) * 100;

      setResult({
        simpleInterest: Math.round(interest * 100) / 100,
        totalAmount: Math.round(total * 100) / 100,
        effectiveRate: Math.round(effectiveRate * 100) / 100
      });
    }
  };

  const handleReset = () => {
    setPrincipal('');
    setInterestRate('');
    setTime('');
    setTimeUnit('years');
    setResult(null);
  };

  const timeUnitOptions = [
    { value: 'years', label: 'Years' },
    { value: 'months', label: 'Months' },
    { value: 'days', label: 'Days' }
  ];

  return (
    <CalculatorLayout
      title="Simple Interest Calculator"
      description="Calculate simple interest earned on principal amount over time."
      formula="Simple Interest = Principal × Rate × Time"
      example="$1,000 × 5% × 2 years = $100 simple interest"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGroup
          label="Principal Amount"
          id="principal"
          type="number"
          value={principal}
          onChange={setPrincipal}
          placeholder="1000"
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
          label="Time Period"
          id="time"
          type="number"
          value={time}
          onChange={setTime}
          placeholder="2"
          step="0.1"
          required
        />
        <InputGroup
          label="Time Unit"
          id="timeUnit"
          type="select"
          value={timeUnit}
          onChange={setTimeUnit}
          options={timeUnitOptions}
        />
      </div>

      <div className="flex gap-4">
        <Button onClick={calculateSimpleInterest} className="flex-1">
          Calculate Interest
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
              title="Simple Interest"
              value={result.simpleInterest}
              prefix="$"
              colorClass="text-green-600"
            />
            <ResultCard
              title="Total Amount"
              value={result.totalAmount}
              prefix="$"
              colorClass="text-primary"
            />
            <ResultCard
              title="Effective Rate"
              value={result.effectiveRate}
              suffix="%"
              colorClass="text-blue-600"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
};
