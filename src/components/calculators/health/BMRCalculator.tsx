import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const BMRCalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [result, setResult] = useState<{
    bmr: number;
    tdee: number;
    weightLoss: number;
    weightGain: number;
  } | null>(null);

  const calculateBMR = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (w > 0 && h > 0 && a > 0) {
      let bmr: number;
      
      // Mifflin-St Jeor Equation
      if (gender === 'male') {
        bmr = 10 * w + 6.25 * h - 5 * a + 5;
      } else {
        bmr = 10 * w + 6.25 * h - 5 * a - 161;
      }

      // Activity multipliers
      const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        extra: 1.9
      };

      const tdee = bmr * multipliers[activityLevel as keyof typeof multipliers];
      const weightLoss = tdee - 500; // 500 calorie deficit for 1 lb/week loss
      const weightGain = tdee + 500; // 500 calorie surplus for 1 lb/week gain

      setResult({
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        weightLoss: Math.round(weightLoss),
        weightGain: Math.round(weightGain)
      });
    }
  };

  const handleReset = () => {
    setWeight('');
    setHeight('');
    setAge('');
    setGender('male');
    setActivityLevel('sedentary');
    setResult(null);
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];

  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary (little/no exercise)' },
    { value: 'light', label: 'Light (light exercise 1-3 days/week)' },
    { value: 'moderate', label: 'Moderate (moderate exercise 3-5 days/week)' },
    { value: 'active', label: 'Active (hard exercise 6-7 days/week)' },
    { value: 'extra', label: 'Extra Active (very hard exercise, physical job)' }
  ];

  return (
    <CalculatorLayout
      title="BMR Calculator"
      description="Calculate your Basal Metabolic Rate and daily calorie needs."
      formula="BMR (Male) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5"
      example="Male, 70kg, 175cm, 30 years = 1,663 calories BMR"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGroup
          label="Weight (kg)"
          id="weight"
          type="number"
          value={weight}
          onChange={setWeight}
          placeholder="70"
          required
        />
        <InputGroup
          label="Height (cm)"
          id="height"
          type="number"
          value={height}
          onChange={setHeight}
          placeholder="175"
          required
        />
        <InputGroup
          label="Age"
          id="age"
          type="number"
          value={age}
          onChange={setAge}
          placeholder="30"
          required
        />
        <InputGroup
          label="Gender"
          id="gender"
          type="select"
          value={gender}
          onChange={setGender}
          options={genderOptions}
        />
        <div className="md:col-span-2">
          <InputGroup
            label="Activity Level"
            id="activityLevel"
            type="select"
            value={activityLevel}
            onChange={setActivityLevel}
            options={activityOptions}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={calculateBMR} className="flex-1">
          Calculate BMR
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
              title="BMR"
              value={result.bmr}
              suffix=" cal/day"
              colorClass="text-primary"
            />
            <ResultCard
              title="TDEE"
              value={result.tdee}
              suffix=" cal/day"
              colorClass="text-blue-600"
            />
            <ResultCard
              title="Weight Loss"
              value={result.weightLoss}
              suffix=" cal/day"
              colorClass="text-red-600"
            />
            <ResultCard
              title="Weight Gain"
              value={result.weightGain}
              suffix=" cal/day"
              colorClass="text-green-600"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
};