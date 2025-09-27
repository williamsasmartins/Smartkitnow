import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const BodyFatCalculator = () => {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [result, setResult] = useState<{
    bodyFatPercentage: number;
    fatMass: number;
    leanMass: number;
    category: string;
  } | null>(null);

  const calculateBodyFat = () => {
    const h = parseFloat(height);
    const n = parseFloat(neck);
    const w = parseFloat(waist);
    const hi = parseFloat(hips);
    const bodyWeight = parseFloat(weight);

    if (h > 0 && n > 0 && w > 0 && bodyWeight > 0) {
      let bodyFatPercentage: number;

      // US Navy Method
      if (gender === 'male') {
        bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
      } else {
        if (hi > 0) {
          bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(w + hi - n) + 0.22100 * Math.log10(h)) - 450;
        } else {
          return; // Hips required for females
        }
      }

      const fatMass = (bodyFatPercentage / 100) * bodyWeight;
      const leanMass = bodyWeight - fatMass;

      // Determine category based on gender and body fat percentage
      let category: string;
      if (gender === 'male') {
        if (bodyFatPercentage < 6) category = 'Essential Fat';
        else if (bodyFatPercentage < 14) category = 'Athletes';
        else if (bodyFatPercentage < 18) category = 'Fitness';
        else if (bodyFatPercentage < 25) category = 'Average';
        else category = 'Obese';
      } else {
        if (bodyFatPercentage < 14) category = 'Essential Fat';
        else if (bodyFatPercentage < 21) category = 'Athletes';
        else if (bodyFatPercentage < 25) category = 'Fitness';
        else if (bodyFatPercentage < 32) category = 'Average';
        else category = 'Obese';
      }

      setResult({
        bodyFatPercentage: Math.round(bodyFatPercentage * 100) / 100,
        fatMass: Math.round(fatMass * 100) / 100,
        leanMass: Math.round(leanMass * 100) / 100,
        category
      });
    }
  };

  const handleReset = () => {
    setAge('');
    setWeight('');
    setHeight('');
    setNeck('');
    setWaist('');
    setHips('');
    setResult(null);
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];

  return (
    <CalculatorLayout
      title="Body Fat Calculator"
      description="Calculate body fat percentage using US Navy method with body measurements."
      formula="Uses US Navy circumference-based formula for accuracy"
      example="Male: 180cm, 32cm neck, 85cm waist = ~12% body fat"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup
            label="Gender"
            id="gender"
            type="select"
            value={gender}
            onChange={setGender}
            options={genderOptions}
          />
          <InputGroup
            label="Age"
            id="age"
            type="number"
            value={age}
            onChange={setAge}
            placeholder="30"
          />
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputGroup
            label="Neck Circumference (cm)"
            id="neck"
            type="number"
            value={neck}
            onChange={setNeck}
            placeholder="40"
            step="0.1"
            required
          />
          <InputGroup
            label="Waist Circumference (cm)"
            id="waist"
            type="number"
            value={waist}
            onChange={setWaist}
            placeholder="85"
            step="0.1"
            required
          />
          {gender === 'female' && (
            <InputGroup
              label="Hip Circumference (cm)"
              id="hips"
              type="number"
              value={hips}
              onChange={setHips}
              placeholder="95"
              step="0.1"
              required
            />
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={calculateBodyFat} className="flex-1">
          Calculate Body Fat
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
              title="Body Fat %"
              value={result.bodyFatPercentage}
              suffix="%"
              colorClass="text-primary"
            />
            <ResultCard
              title="Fat Mass"
              value={result.fatMass}
              suffix=" kg"
              colorClass="text-red-600"
            />
            <ResultCard
              title="Lean Mass"
              value={result.leanMass}
              suffix=" kg"
              colorClass="text-green-600"
            />
            <ResultCard
              title="Category"
              value={result.category}
              colorClass="text-blue-600"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Body Fat Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Men</h4>
                  <div className="space-y-1">
                    <div>Essential Fat: 2-5%</div>
                    <div>Athletes: 6-13%</div>
                    <div>Fitness: 14-17%</div>
                    <div>Average: 18-24%</div>
                    <div>Obese: 25%+</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Women</h4>
                  <div className="space-y-1">
                    <div>Essential Fat: 10-13%</div>
                    <div>Athletes: 14-20%</div>
                    <div>Fitness: 21-24%</div>
                    <div>Average: 25-31%</div>
                    <div>Obese: 32%+</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </CalculatorLayout>
  );
};