import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export const TDEECalculator = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [units, setUnits] = useState('metric');
  const [result, setResult] = useState<{
    bmr: number;
    tdee: number;
    weightGoals: { goal: string; calories: number; description: string }[];
  } | null>(null);

  const activityLevels = [
    { value: '1.2', name: 'Sedentary', description: 'Little to no exercise' },
    { value: '1.375', name: 'Light', description: 'Light exercise 1-3 days/week' },
    { value: '1.55', name: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
    { value: '1.725', name: 'High', description: 'Heavy exercise 6-7 days/week' },
    { value: '1.9', name: 'Very High', description: 'Very heavy exercise, physical job' }
  ];

  const calculateTDEE = () => {
    const ageValue = parseInt(age);
    let heightCm = parseFloat(height);
    let weightKg = parseFloat(weight);
    const activity = parseFloat(activityLevel);

    if (units === 'imperial') {
      // Convert feet to cm and pounds to kg
      heightCm = heightCm * 30.48; // feet to cm
      weightKg = weightKg * 0.453592; // pounds to kg
    }

    if (ageValue > 0 && heightCm > 0 && weightKg > 0 && gender && activity) {
      let bmr = 0;
      
      // Mifflin-St Jeor Equation
      if (gender === 'male') {
        bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageValue);
      } else {
        bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageValue);
      }

      const tdee = bmr * activity;

      const weightGoals = [
        { 
          goal: 'Lose 2 lbs/week', 
          calories: Math.round(tdee - 1000), 
          description: 'Aggressive weight loss' 
        },
        { 
          goal: 'Lose 1 lb/week', 
          calories: Math.round(tdee - 500), 
          description: 'Moderate weight loss' 
        },
        { 
          goal: 'Lose 0.5 lbs/week', 
          calories: Math.round(tdee - 250), 
          description: 'Slow weight loss' 
        },
        { 
          goal: 'Maintain weight', 
          calories: Math.round(tdee), 
          description: 'Weight maintenance' 
        },
        { 
          goal: 'Gain 0.5 lbs/week', 
          calories: Math.round(tdee + 250), 
          description: 'Slow weight gain' 
        },
        { 
          goal: 'Gain 1 lb/week', 
          calories: Math.round(tdee + 500), 
          description: 'Moderate weight gain' 
        }
      ];

      setResult({
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        weightGoals
      });
    }
  };

  const handleReset = () => {
    setAge('');
    setGender('');
    setHeight('');
    setWeight('');
    setActivityLevel('');
    setUnits('metric');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>TDEE Calculator</CardTitle>
          <CardDescription>
            Calculate your Total Daily Energy Expenditure (TDEE) - the total calories you burn in a day.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="units">Unit System</Label>
            <Select value={units} onValueChange={setUnits}>
              <SelectTrigger>
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
                <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="activityLevel">Activity Level</Label>
            <Select value={activityLevel} onValueChange={setActivityLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                {activityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.name} - {level.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button onClick={calculateTDEE} className="flex-1">
              Calculate TDEE
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {result && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.bmr} cal/day
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">BMR (Basal Metabolic Rate)</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {result.tdee} cal/day
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">TDEE (Total Daily Energy)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Calorie Goals by Weight Target:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {result.weightGoals.map((goal, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {goal.calories} cal/day
                          </div>
                          <p className="text-sm font-medium">{goal.goal}</p>
                          <p className="text-xs text-muted-foreground">{goal.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};