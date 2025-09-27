import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/calculators/common/CalculatorLayout";
import { InputGroup } from "@/components/calculators/common/InputGroup";
import { ResultCard } from "@/components/calculators/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const AdjustedBodyWeightCalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('male');
  const [adjustedWeight, setAdjustedWeight] = useState<number | null>(null);

  const calculateAdjustedWeight = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (w > 0 && h > 0) {
      // Ideal Body Weight (IBW) in kg
      let ibw = gender === 'male' ? 50 + 0.91 * (h - 152.4) : 45.5 + 0.91 * (h - 152.4);
      // Adjusted Body Weight (ABW) = IBW + 0.4 * (Actual Weight - IBW)
      const abw = ibw + 0.4 * (w - ibw);
      setAdjustedWeight(Math.round(abw * 10) / 10);
    }
  };

  const handleReset = () => {
    setWeight('');
    setHeight('');
    setGender('male');
    setAdjustedWeight(null);
  };

  return (
    <CalculatorLayout
      title="Adjusted Body Weight Calculator"
      description="Calculate adjusted body weight for obese individuals, often used for drug dosing."
      formula="ABW = IBW + 0.4 × (Actual Weight - IBW)"
      example="Male, 180 cm tall, 120 kg actual weight: IBW ~78 kg, ABW ~97 kg"
    >
      <div className="space-y-4">
        <InputGroup
          label="Actual Weight (kg)"
          id="weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="120"
          required
        />
        <InputGroup
          label="Height (cm)"
          id="height"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="180"
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
          <Button onClick={calculateAdjustedWeight} className="flex-1">Calculate</Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>
        {adjustedWeight !== null && (
          <>
            <Separator />
            <ResultCard
              title="Adjusted Body Weight"
              value={adjustedWeight}
              suffix="kg"
              colorClass="text-primary"
            />
          </>
        )}
      </div>
    </CalculatorLayout>
  );
};
