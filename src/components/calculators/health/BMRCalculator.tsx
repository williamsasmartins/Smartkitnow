import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/calculators/common/CalculatorLayout";
import { InputGroup } from "@/components/calculators/common/InputGroup";
import { ResultCard } from "@/components/calculators/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const BMRCalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [bmr, setBMR] = useState<number | null>(null);

  const calculateBMR = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // Converter cm para m
    const a = parseInt(age);
    if (w > 0 && h > 0 && a > 0) {
      // Fórmula de Harris-Benedict
      const bmrValue = gender === 'male'
        ? 88.362 + (13.397 * w) + (4.799 * (h * 100)) - (5.677 * a)
        : 447.593 + (9.247 * w) + (3.098 * (h * 100)) - (4.330 * a);
      setBMR(Math.round(bmrValue));
    }
  };

  const handleReset = () => {
    setWeight('');
    setHeight('');
    setAge('');
    setGender('male');
    setBMR(null);
  };

  return (
    <CalculatorLayout
      title="BMR Calculator"
      description="Calculate your Basal Metabolic Rate (BMR) based on weight, height, age, and gender."
      formula="BMR (Male) = 88.362 + (13.397 × weight) + (4.799 × height) - (5.677 × age)"
      example="A 30-year-old male, 70kg, 175cm has a BMR of ~1664 kcal/day."
    >
      <div className="space-y-4">
        <InputGroup
          label="Weight (kg)"
          id="weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="70"
          required
        />
        <InputGroup
          label="Height (cm)"
          id="height"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="175"
          required
        />
        <InputGroup
          label="Age"
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="30"
          required
        />
        <div className="space-y-2">
          <label className="text-sm font-medium">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateBMR} className="flex-1">Calculate</Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>
        {bmr !== null && (
          <>
            <Separator />
            <ResultCard
              title="Basal Metabolic Rate (BMR)"
              value={bmr}
              suffix="kcal/day"
              colorClass="text-primary"
            />
          </>
        )}
      </div>
    </CalculatorLayout>
  );
};