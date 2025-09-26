import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function DogCalorieCalculator() {
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [age, setAge] = useState("");
  const [spayedNeutered, setSpayedNeutered] = useState("");
  const [result, setResult] = useState<{
    dailyCalories: number;
    cupsPerDay: number;
    treatCalories: number;
  } | null>(null);

  const calculateCalories = () => {
    const weightNum = parseFloat(weight);
    const ageNum = parseFloat(age);
    
    if (isNaN(weightNum) || weightNum <= 0 || !activityLevel || isNaN(ageNum) || !spayedNeutered) {
      return;
    }

    // Calculate Resting Energy Requirement (RER)
    const rer = 70 * Math.pow(weightNum, 0.75);
    
    // Activity multipliers
    let multiplier = 1;
    switch (activityLevel) {
      case "sedentary":
        multiplier = spayedNeutered === "yes" ? 1.2 : 1.4;
        break;
      case "low":
        multiplier = spayedNeutered === "yes" ? 1.4 : 1.6;
        break;
      case "moderate":
        multiplier = spayedNeutered === "yes" ? 1.6 : 1.8;
        break;
      case "high":
        multiplier = spayedNeutered === "yes" ? 2.0 : 2.2;
        break;
      case "extreme":
        multiplier = spayedNeutered === "yes" ? 2.5 : 3.0;
        break;
    }

    // Age adjustments
    if (ageNum < 1) {
      multiplier *= 2; // Puppies need more calories
    } else if (ageNum > 7) {
      multiplier *= 0.9; // Senior dogs need fewer calories
    }

    const dailyCalories = Math.round(rer * multiplier);
    
    // Estimate cups per day (assuming 350-400 calories per cup of dry food)
    const cupsPerDay = Number((dailyCalories / 375).toFixed(1));
    
    // 10% of calories can come from treats
    const treatCalories = Math.round(dailyCalories * 0.1);

    setResult({ dailyCalories, cupsPerDay, treatCalories });
  };

  const clearAll = () => {
    setWeight("");
    setActivityLevel("");
    setAge("");
    setSpayedNeutered("");
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Dog Calorie Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate your dog's daily calorie needs based on weight, age, activity level, and spay/neuter status.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Daily Calorie Needs</CardTitle>
          <CardDescription>
            Enter your dog's information to determine proper daily calorie intake
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="1"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="0.1"
                step="0.1"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="activity">Activity Level</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                  <SelectItem value="low">Low (light walks, indoor play)</SelectItem>
                  <SelectItem value="moderate">Moderate (1-2 hours daily exercise)</SelectItem>
                  <SelectItem value="high">High (very active, working dog)</SelectItem>
                  <SelectItem value="extreme">Extreme (athletic, racing, heavy work)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="spayed">Spayed/Neutered?</Label>
              <Select value={spayedNeutered} onValueChange={setSpayedNeutered}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes (spayed/neutered)</SelectItem>
                  <SelectItem value="no">No (intact)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateCalories}>
              Calculate Calories
            </Button>
            <Button onClick={clearAll} variant="secondary">
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Daily Calorie Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {result.dailyCalories}
                </div>
                <p className="text-muted-foreground">Calories per day</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {result.cupsPerDay}
                </div>
                <p className="text-muted-foreground">Cups of dry food</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {result.treatCalories}
                </div>
                <p className="text-muted-foreground">Max treat calories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Feeding Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Activity Level Guide</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Sedentary:</strong> Mostly indoor, minimal exercise</li>
              <li>• <strong>Low:</strong> Short walks, light indoor play</li>
              <li>• <strong>Moderate:</strong> 1-2 hours of exercise daily</li>
              <li>• <strong>High:</strong> Very active dogs, working breeds</li>
              <li>• <strong>Extreme:</strong> Athletic dogs, heavy work, racing</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Important Notes</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• These are estimates - monitor your dog's weight and adjust as needed</li>
              <li>• Pregnant and nursing dogs need 2-4x normal calories</li>
              <li>• Senior dogs may need fewer calories due to reduced activity</li>
              <li>• Treats should not exceed 10% of daily calories</li>
              <li>• Consult your veterinarian for specific dietary needs</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}