import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/calculators/common/CalculatorLayout";
import { InputGroup } from "@/components/calculators/common/InputGroup";
import { ResultCard } from "@/components/calculators/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<number | null>(null);

  const calculateAge = () => {
    const birth = new Date(birthDate);
    const today = new Date();
    let ageValue = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      ageValue--;
    }
    setAge(ageValue);
  };

  const handleReset = () => {
    setBirthDate('');
    setAge(null);
  };

  return (
    <CalculatorLayout
      title="Age Calculator"
      description="Calculate your age based on birth date."
      formula="Age = Current Year - Birth Year (adjust for month/day)"
      example="Born on 1990-01-01, today is 2025-09-25 = 35 years old"
    >
      <div className="space-y-4">
        <InputGroup
          label="Birth Date"
          id="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
        <div className="flex gap-4">
          <Button onClick={calculateAge} className="flex-1">Calculate</Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>
        {age !== null && (
          <>
            <Separator />
            <ResultCard
              title="Age"
              value={age}
              suffix="years"
              colorClass="text-primary"
            />
          </>
        )}
      </div>
    </CalculatorLayout>
  );
};