import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export const BMRCalculator = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [units, setUnits] = useState('metric');
  const [result, setResult] = useState<{
    bmr: number;
    activityLevels: { level: string; calories: number; description: string }[];
  } | null>(null);

  const calculateBMR = () => {
    const ageValue = parseInt(age);
    let heightCm = parseFloat(height);
    let weightKg = parseFloat(weight);

    if (units === 'imperial') {
      // Convert feet to cm and pounds to kg
      heightCm = heightCm * 30.48; // feet to cm
      weightKg = weightKg * 0.453592; // pounds to kg
    }

    if (ageValue > 0 && heightCm > 0 && weightKg > 0 && gender) {
      let bmr = 0;
      
      // Mifflin-St Jeor Equation
      if (gender === 'male') {
        bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageValue);
      } else {
        bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageValue);
      }

      const activityLevels = [
        { level: 'Sedentary', calories: Math.round(bmr * 1.2), description: 'Little to no exercise' },
        { level: 'Light', calories: Math.round(bmr * 1.375), description: 'Light exercise 1-3 days/week' },
        { level: 'Moderate', calories: Math.round(bmr * 1.55), description: 'Moderate exercise 3-5 days/week' },
        { level: 'High', calories: Math.round(bmr * 1.725), description: 'Heavy exercise 6-7 days/week' },
        { level: 'Very High', calories: Math.round(bmr * 1.9), description: 'Very heavy exercise, physical job' }
      ];

      setResult({
        bmr: Math.round(bmr),
        activityLevels
      });
    }
  };

  const handleReset = () => {
    setAge('');
    setGender('');
    setHeight('');
    setWeight('');
    setUnits('metric');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>BMR Calculator</CardTitle>
          <CardDescription>
            Calculate your Basal Metabolic Rate (BMR) - the number of calories your body needs at rest.
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
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                placeholder="30"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender" aria-label="Gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <Button variant="calculate" onClick={calculateBMR} className="flex-1">
              Calculate BMR
            </Button>
            <Button variant="reset" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {result && (
            <>
              <Separator />
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {result.bmr} calories/day
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Basal Metabolic Rate</p>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h4 className="font-semibold mb-3">Daily Calorie Needs (Including Activity):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {result.activityLevels.map((level, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              {level.calories} cal/day
                            </div>
                            <p className="text-sm font-medium">{level.level}</p>
                            <p className="text-xs text-muted-foreground">{level.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};