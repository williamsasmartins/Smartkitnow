import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const ConcreteCalculator = () => {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [thickness, setThickness] = useState('');
  const [unit, setUnit] = useState('feet');
  const [result, setResult] = useState<{
    volume: number;
    cubicYards: number;
    bags: number;
    cost: number;
  } | null>(null);

  const calculateConcrete = () => {
    let l = parseFloat(length);
    let w = parseFloat(width);
    let t = parseFloat(thickness);

    if (l > 0 && w > 0 && t > 0) {
      // Convert to feet if needed
      if (unit === 'inches') {
        t = t / 12; // thickness in inches to feet
      } else if (unit === 'meters') {
        l = l * 3.28084;
        w = w * 3.28084;
        t = t * 3.28084;
      }

      const volumeCubicFeet = l * w * t;
      const volumeCubicYards = volumeCubicFeet / 27;
      const bags = Math.ceil(volumeCubicYards * 45); // 45 bags per cubic yard
      const estimatedCost = bags * 4.5; // $4.50 per bag estimate

      setResult({
        volume: Math.round(volumeCubicFeet * 100) / 100,
        cubicYards: Math.round(volumeCubicYards * 100) / 100,
        bags,
        cost: Math.round(estimatedCost * 100) / 100
      });
    }
  };

  const handleReset = () => {
    setLength('');
    setWidth('');
    setThickness('');
    setUnit('feet');
    setResult(null);
  };

  const unitOptions = [
    { value: 'feet', label: 'Feet' },
    { value: 'inches', label: 'Inches (thickness only)' },
    { value: 'meters', label: 'Meters' }
  ];

  return (
    <CalculatorLayout
      title="Concrete Calculator"
      description="Calculate concrete volume, bags needed, and estimated cost for your project."
      formula="Volume = Length × Width × Thickness"
      example="10ft × 12ft × 4in slab = 1.48 cubic yards"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGroup
          label="Length"
          id="length"
          type="number"
          value={length}
          onChange={setLength}
          placeholder="10"
          step="0.1"
          required
        />
        <InputGroup
          label="Width"
          id="width"
          type="number"
          value={width}
          onChange={setWidth}
          placeholder="12"
          step="0.1"
          required
        />
        <InputGroup
          label={unit === 'inches' ? 'Thickness (inches)' : 'Thickness'}
          id="thickness"
          type="number"
          value={thickness}
          onChange={setThickness}
          placeholder={unit === 'inches' ? '4' : '0.33'}
          step="0.1"
          required
        />
        <InputGroup
          label="Unit"
          id="unit"
          type="select"
          value={unit}
          onChange={setUnit}
          options={unitOptions}
        />
      </div>

      <div className="flex gap-4">
        <Button onClick={calculateConcrete} className="flex-1">
          Calculate Concrete
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
              title="Volume (ft³)"
              value={result.volume}
              suffix=" ft³"
              colorClass="text-primary"
            />
            <ResultCard
              title="Cubic Yards"
              value={result.cubicYards}
              suffix=" yd³"
              colorClass="text-green-600"
            />
            <ResultCard
              title="80lb Bags"
              value={result.bags}
              suffix=" bags"
              colorClass="text-blue-600"
            />
            <ResultCard
              title="Estimated Cost"
              value={result.cost}
              prefix="$"
              colorClass="text-purple-600"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
};
