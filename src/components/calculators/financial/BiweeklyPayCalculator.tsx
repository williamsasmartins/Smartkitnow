import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const BiweeklyPayCalculator = () => {
  const [inputType, setInputType] = useState('annual');
  const [salary, setSalary] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [result, setResult] = useState<{
    biweeklyPay: number;
    annualSalary: number;
    monthlyPay: number;
    weeklyPay: number;
  } | null>(null);

  const calculatePay = () => {
    let annual = 0;

    if (inputType === 'annual') {
      annual = parseFloat(salary);
    } else if (inputType === 'hourly') {
      const rate = parseFloat(hourlyRate);
      const hours = parseFloat(hoursPerWeek);
      if (rate > 0 && hours > 0) {
        annual = rate * hours * 52;
      }
    }

    if (annual > 0) {
      const biweekly = annual / 26;
      const monthly = annual / 12;
      const weekly = annual / 52;

      setResult({
        biweeklyPay: Math.round(biweekly * 100) / 100,
        annualSalary: Math.round(annual * 100) / 100,
        monthlyPay: Math.round(monthly * 100) / 100,
        weeklyPay: Math.round(weekly * 100) / 100
      });
    }
  };

  const handleReset = () => {
    setSalary('');
    setHourlyRate('');
    setHoursPerWeek('40');
    setResult(null);
  };

  const inputTypeOptions = [
    { value: 'annual', label: 'Annual Salary' },
    { value: 'hourly', label: 'Hourly Rate' }
  ];

  return (
    <CalculatorLayout
      title="Biweekly Pay Calculator"
      description="Calculate your biweekly pay from annual salary or hourly rate."
      formula="Biweekly Pay = Annual Salary ÷ 26 pay periods"
      example="$52,000 annual salary ÷ 26 = $2,000 biweekly pay"
    >
      <InputGroup
        label="Input Type"
        id="inputType"
        type="select"
        value={inputType}
        onChange={setInputType}
        options={inputTypeOptions}
      />

      {inputType === 'annual' ? (
        <InputGroup
          label="Annual Salary"
          id="salary"
          type="number"
          value={salary}
          onChange={setSalary}
          placeholder="52000"
          required
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup
            label="Hourly Rate"
            id="hourlyRate"
            type="number"
            value={hourlyRate}
            onChange={setHourlyRate}
            placeholder="25"
            step="0.01"
            required
          />
          <InputGroup
            label="Hours per Week"
            id="hoursPerWeek"
            type="number"
            value={hoursPerWeek}
            onChange={setHoursPerWeek}
            placeholder="40"
          />
        </div>
      )}

      <div className="flex gap-4">
        <Button onClick={calculatePay} className="flex-1">
          Calculate Pay
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
              title="Biweekly Pay"
              value={result.biweeklyPay}
              prefix="$"
              colorClass="text-primary"
            />
            <ResultCard
              title="Annual Salary"
              value={result.annualSalary}
              prefix="$"
              colorClass="text-green-600"
            />
            <ResultCard
              title="Monthly Pay"
              value={result.monthlyPay}
              prefix="$"
              colorClass="text-blue-600"
            />
            <ResultCard
              title="Weekly Pay"
              value={result.weeklyPay}
              prefix="$"
              colorClass="text-purple-600"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
};