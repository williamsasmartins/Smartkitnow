import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/calculators/common/CalculatorLayout";
import { InputGroup } from "@/components/calculators/common/InputGroup";
import { ResultCard } from "@/components/calculators/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const BodyFatCalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [bodyFat, setBodyFat] = useState<number | null>(null);

  const calculateBodyFat = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    if (w > 0 && h > 0 && a > 0) {
      // Simplificada fórmula de estimativa (U.S. Navy Method aproximada)
      const avg = (w / (h * h)) * 703; // BMI aproximado em kg/m²
      const bf = gender === 'male' ? (1.20 * avg) + (0.23 * a) - 16.2 : (1.20 * avg) + (0.23 * a) - 5.4;
      setBodyFat(Math.round(bf * 10) / 10);
    }
  };

  const handleReset = () => {
    setWeight('');
    setHeight('');
    setAge('');
    setGender('male');
    setBodyFat(null);
  };

  return (
    <CalculatorLayout
      title="Body Fat Calculator"
      description="Estimate your body fat percentage based on weight, height, age, and gender."
      formula="Body Fat % = 1.20 × BMI + 0.23 × Age - K (K varies by gender)"
      example="A 30-year-old male, 70kg, 175cm has ~18% body fat."
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
          <Button onClick={calculateBodyFat} className="flex-1">Calculate</Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>
        {bodyFat !== null && (
          <>
            <Separator />
            <ResultCard
              title="Body Fat Percentage"
              value={bodyFat}
              suffix="%"
              colorClass="text-primary"
            />
          </>
        )}
      </div>
    </CalculatorLayout>
  );
};