import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalWeeks: number;
    totalHours: number;
  } | null>(null);

  const calculateAge = () => {
    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (birth && target && birth <= target) {
      const totalMs = target.getTime() - birth.getTime();
      const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
      const totalWeeks = Math.floor(totalDays / 7);
      const totalHours = totalDays * 24;

      // Calculate years, months, days
      let years = target.getFullYear() - birth.getFullYear();
      let months = target.getMonth() - birth.getMonth();
      let days = target.getDate() - birth.getDate();

      if (days < 0) {
        months--;
        const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
        days += lastMonth.getDate();
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      setResult({
        years,
        months,
        days,
        totalDays,
        totalWeeks,
        totalHours
      });
    }
  };

  const handleReset = () => {
    setBirthDate('');
    setTargetDate(new Date().toISOString().split('T')[0]);
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="Age Calculator"
      description="Calculate exact age in years, months, days, and other time units."
      formula="Age = Target Date - Birth Date"
      example="Born Jan 1, 2000, today = 24 years, 0 months, X days"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGroup
          label="Birth Date"
          id="birthDate"
          type="date"
          value={birthDate}
          onChange={setBirthDate}
          required
        />
        <InputGroup
          label="Target Date"
          id="targetDate"
          type="date"
          value={targetDate}
          onChange={setTargetDate}
          required
        />
      </div>

      <div className="flex gap-4">
        <Button onClick={calculateAge} className="flex-1">
          Calculate Age
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {result && (
        <>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <ResultCard
              title="Years"
              value={result.years}
              colorClass="text-primary"
            />
            <ResultCard
              title="Months"
              value={result.months}
              colorClass="text-green-600"
            />
            <ResultCard
              title="Days"
              value={result.days}
              colorClass="text-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              title="Total Days"
              value={result.totalDays.toLocaleString()}
              colorClass="text-purple-600"
            />
            <ResultCard
              title="Total Weeks"
              value={result.totalWeeks.toLocaleString()}
              colorClass="text-orange-600"
            />
            <ResultCard
              title="Total Hours"
              value={result.totalHours.toLocaleString()}
              colorClass="text-red-600"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
};