import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export const CalorieCalculator = () => {
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [weight, setWeight] = useState('');
  const [units, setUnits] = useState('metric');
  const [result, setResult] = useState<{
    caloriesBurned: number;
    caloriesPerHour: number;
  } | null>(null);

  const activities = [
    { value: 'walking', name: 'Walking (3.5 mph)', met: 4.3 },
    { value: 'running', name: 'Running (6 mph)', met: 10.0 },
    { value: 'cycling', name: 'Cycling (12-14 mph)', met: 8.0 },
    { value: 'swimming', name: 'Swimming (moderate)', met: 6.0 },
    { value: 'weightlifting', name: 'Weight Lifting', met: 3.0 },
    { value: 'yoga', name: 'Yoga', met: 2.5 },
    { value: 'dancing', name: 'Dancing', met: 4.8 },
    { value: 'hiking', name: 'Hiking', met: 6.0 },
    { value: 'basketball', name: 'Basketball', met: 6.5 },
    { value: 'tennis', name: 'Tennis', met: 7.3 }
  ];

  const calculateCalories = () => {
    const selectedActivity = activities.find(a => a.value === activity);
    let weightKg = parseFloat(weight);
    const durationHours = parseFloat(duration) / 60;

    if (units === 'imperial') {
      weightKg = weightKg * 0.453592; // Convert pounds to kg
    }

    if (selectedActivity && weightKg > 0 && durationHours > 0) {
      // Calories burned = MET × weight in kg × time in hours
      const caloriesBurned = selectedActivity.met * weightKg * durationHours;
      const caloriesPerHour = selectedActivity.met * weightKg;

      setResult({
        caloriesBurned: Math.round(caloriesBurned),
        caloriesPerHour: Math.round(caloriesPerHour)
      });
    }
  };

  const handleReset = () => {
    setActivity('');
    setDuration('');
    setWeight('');
    setUnits('metric');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calories Burned Calculator</CardTitle>
          <CardDescription>
            Calculate how many calories you burn during different physical activities.
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
                <SelectItem value="metric">Metric (kg)</SelectItem>
                <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activity">Activity</Label>
              <Select value={activity} onValueChange={setActivity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  {activities.map((act) => (
                    <SelectItem key={act.value} value={act.value}>
                      {act.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
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
            <Button variant="calculate" onClick={calculateCalories} className="flex-1">
              Calculate Calories
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
                        {result.caloriesBurned}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Calories Burned</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {result.caloriesPerHour}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Calories Per Hour</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">How it's calculated:</h4>
                <p className="text-sm text-muted-foreground">
                  Calories = MET value × weight in kg × time in hours
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  MET (Metabolic Equivalent) represents the energy cost of physical activities.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};