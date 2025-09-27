import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const HourlyToSalaryCalculator = () => {
  const [hourlyRate, setHourlyRate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [weeksPerYear, setWeeksPerYear] = useState('52');
  const [result, setResult] = useState<{
    annualSalary: number;
    monthlySalary: number;
    weeklySalary: number;
    dailySalary: number;
  } | null>(null);

  const calculateSalary = () => {
    const rate = parseFloat(hourlyRate);
    const hours = parseFloat(hoursPerWeek);
    const weeks = parseFloat(weeksPerYear);

    if (rate > 0 && hours > 0 && weeks > 0) {
      const annual = rate * hours * weeks;
      const monthly = annual / 12;
      const weekly = rate * hours;
      const daily = weekly / 5;

      setResult({
        annualSalary: Math.round(annual * 100) / 100,
        monthlySalary: Math.round(monthly * 100) / 100,
        weeklySalary: Math.round(weekly * 100) / 100,
        dailySalary: Math.round(daily * 100) / 100
      });
    }
  };

  const handleReset = () => {
    setHourlyRate('');
    setHoursPerWeek('40');
    setWeeksPerYear('52');
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="Hourly to Salary Calculator"
      description="Convert your hourly wage to annual salary and other pay periods."
      formula="Annual Salary = Hourly Rate × Hours per Week × Weeks per Year"
      example="$25/hour × 40 hours/week × 52 weeks = $52,000 annual salary"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <InputGroup
          label="Weeks per Year"
          id="weeksPerYear"
          type="number"
          value={weeksPerYear}
          onChange={setWeeksPerYear}
          placeholder="52"
        />
      </div>

      <div className="flex gap-4">
        <Button onClick={calculateSalary} className="flex-1">
          Calculate Salary
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
              title="Annual Salary"
              value={result.annualSalary}
              prefix="$"
              colorClass="text-primary"
            />
            <ResultCard
              title="Monthly Salary"
              value={result.monthlySalary}
              prefix="$"
              colorClass="text-green-600"
            />
            <ResultCard
              title="Weekly Salary"
              value={result.weeklySalary}
              prefix="$"
              colorClass="text-blue-600"
            />
            <ResultCard
              title="Daily Salary"
              value={result.dailySalary}
              prefix="$"
              colorClass="text-purple-600"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
};