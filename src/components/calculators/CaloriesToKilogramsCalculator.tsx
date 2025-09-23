import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, AlertCircle, CheckCircle, Info } from "lucide-react";

interface CaloriesToKgProps {}

const CaloriesToKilogramsCalculator: React.FC<CaloriesToKgProps> = () => {
  const [calories, setCalories] = useState<number | "">("");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [result, setResult] = useState<{ kg: number; message: string } | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const activityFactors = {
    sedentary: { factor: 0.90, label: "Sedentary" },
    light: { factor: 0.95, label: "Lightly Active" },
    moderate: { factor: 1.00, label: "Moderately Active" },
    active: { factor: 1.05, label: "Active" },
    veryActive: { factor: 1.10, label: "Very Active" }
  };

  const calculateCaloriesToKg = () => {
    setLoading(true);
    setError("");
    setResult(null);

    if (!calories || Number(calories) <= 0) {
      setError("Please enter a valid amount of calories (greater than 0).");
      setLoading(false);
      return;
    }

    if (!activityLevel) {
      setError("Please select your activity level.");
      setLoading(false);
      return;
    }

    try {
      const calValue = Number(calories);
      const factor = activityFactors[activityLevel as keyof typeof activityFactors].factor;
      const kgEquivalent = (calValue / 7700) * factor;
      
      setResult({
        kg: kgEquivalent,
        message: `${calValue.toLocaleString()} calories are equivalent to approximately ${kgEquivalent.toFixed(3)} kg of body fat, considering your activity level "${activityFactors[activityLevel as keyof typeof activityFactors].label}".`
      });
    } catch (err) {
      setError("Error calculating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetCalculator = () => {
    setCalories("");
    setActivityLevel("");
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <Calculator className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle className="text-2xl">Convert Calories to Kilograms</CardTitle>
            <CardDescription>
              Transform calories into body weight equivalent to better understand your metabolism and fitness goals
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-6">
          {error && (
            <Alert variant="destructive" className="border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="calories" className="text-sm font-medium text-gray-700">
                Amount of Calories
              </label>
              <Input
                id="calories"
                type="number"
                placeholder="Ex: 3500"
                value={calories}
                onChange={(e) => setCalories(e.target.value === "" ? "" : Number(e.target.value))}
                min="0"
                step="1"
                className="w-full"
              />
              <p className="text-xs text-gray-500">Unit: kcal (kilocalories)</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="activityLevel" className="text-sm font-medium text-gray-700">
                Activity Level
              </label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your activity level..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="active">Active (intense exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="veryActive">Very active (very intense exercise & physical job)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={calculateCaloriesToKg} 
              disabled={!calories || !activityLevel || loading}
              className="flex-1"
            >
              {loading ? <>Calculating...</> : (<><Calculator className="h-4 w-4 mr-2" />Calculate</>)}
            </Button>
            {(calories || activityLevel) && (
              <Button variant="outline" onClick={resetCalculator} className="flex-0">
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-xl">Conversion Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-blue-600">
                <span className="text-gray-600">{Number(calories).toLocaleString()}</span>
                <span className="text-gray-400">kcal</span>
                <span className="text-gray-400">→</span>
                <span>{result.kg.toFixed(3)}</span>
                <span className="text-gray-400">kg</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{result.message}</p>
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>💡 Tip:</strong> To lose 1kg of fat, you need to create a deficit of about 7,700 calories through diet and exercise.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>How to Use the Calculator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: 1, title: "Enter Calories", desc: "Input the amount of calories you want to convert" },
              { step: 2, title: "Select Activity Level", desc: "Choose your current activity level" },
              { step: 3, title: "Get the Result", desc: "Click 'Calculate' to see the kg equivalent" }
            ].map((item) => (
              <div key={item.step} className="text-center space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 font-bold">{item.step}</span>
                </div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { CaloriesToKilogramsCalculator };
export default CaloriesToKilogramsCalculator;