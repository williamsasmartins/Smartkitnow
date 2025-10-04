import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [units, setUnits] = useState('metric');
  const [result, setResult] = useState<{
    bmi: number;
    category: string;
    categoryColor: string;
  } | null>(null);

  const calculateBMI = () => {
    let heightM = parseFloat(height);
    let weightKg = parseFloat(weight);

    if (units === 'imperial') {
      // Convert feet/inches to meters and pounds to kg
      const feet = Math.floor(heightM);
      const inches = (heightM - feet) * 12;
      heightM = (feet * 12 + inches) * 0.0254;
      weightKg = weightKg * 0.453592;
    } else {
      heightM = heightM / 100; // Convert cm to meters
    }

    if (heightM > 0 && weightKg > 0) {
      const bmi = weightKg / (heightM * heightM);
      let category = '';
      let categoryColor = '';

      if (bmi < 18.5) {
        category = 'Underweight';
        categoryColor = 'text-blue-600';
      } else if (bmi < 25) {
        category = 'Normal weight';
        categoryColor = 'text-green-600';
      } else if (bmi < 30) {
        category = 'Overweight';
        categoryColor = 'text-orange-600';
      } else {
        category = 'Obese';
        categoryColor = 'text-red-600';
      }

      setResult({
        bmi: Math.round(bmi * 10) / 10,
        category,
        categoryColor
      });
    }
  };

  const handleReset = () => {
    setHeight('');
    setWeight('');
    setUnits('metric');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>BMI Calculator</CardTitle>
          <CardDescription>
            Calculate your Body Mass Index (BMI) to assess your weight status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="units">Unit System</Label>
            <Select value={units} onValueChange={setUnits}>
              <SelectTrigger id="units" aria-label="Unit system">
                <SelectValue placeholder="Select units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (cm, kg)</SelectItem>
                <SelectItem value="imperial">Imperial (ft, lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">
                Height ({units === 'metric' ? 'cm' : 'ft'})
              </Label>
              <Input
                id="height"
                type="number"
                step={units === 'metric' ? '1' : '0.1'}
                placeholder={units === 'metric' ? '175' : '5.8'}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">
                Weight ({units === 'metric' ? 'kg' : 'lbs'})
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder={units === 'metric' ? '70' : '154'}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="calculate" onClick={calculateBMI} className="flex-1">
              Calculate BMI
            </Button>
            <Button variant="reset" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {result && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {result.bmi}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">BMI Score</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${result.categoryColor}`}>
                        {result.category}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Weight Category</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">BMI Categories:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="text-blue-600">• Underweight: &lt; 18.5</div>
                  <div className="text-green-600">• Normal: 18.5 - 24.9</div>
                  <div className="text-orange-600">• Overweight: 25 - 29.9</div>
                  <div className="text-red-600">• Obese: ≥ 30</div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};