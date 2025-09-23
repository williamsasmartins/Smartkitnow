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
            {/* How to Convert Calories to Kilograms */}
      <section className="prose dark:prose-invert mt-8">
        <h2>How to Convert Calories to Kilograms</h2>
        <p>To convert calories to kilograms of body fat, divide the number of calories by 7,700 (the approximate calories in 1 kg of fat) and multiply by an activity factor. The formula is:</p>
        <code className="block bg-muted p-2 rounded mb-4">kilograms = (calories ÷ 7700) × activity_factor</code>
        <p>The activity factor adjusts for metabolic efficiency:</p>
        <ul>
          <li>Sedentary: 0.90</li>
          <li>Lightly Active: 0.95</li>
          <li>Moderately Active: 1.00</li>
          <li>Active: 1.05</li>
          <li>Very Active: 1.10</li>
        </ul>
        <p>This conversion helps estimate how caloric deficits translate to weight loss or surpluses to gain. Note: Actual results vary due to individual metabolism, muscle mass, and water weight.</p>
      </section>

      {/* What is a Calorie? */}
      <section className="prose dark:prose-invert mt-8">
        <h2>What is a Calorie?</h2>
        <p>A calorie is a unit of energy, specifically the amount needed to raise 1 gram of water by 1°C. In nutrition, we use kilocalories (kcal), often just called "calories."</p>
        <p>Calories come from food and are used for bodily functions, movement, and growth. Excess calories are stored as fat, while a deficit causes the body to burn stored energy. Understanding calories is key to weight management, fitness, and health.</p>
        <p>One large calorie (kcal) equals 1,000 small calories. Typical daily intake is 2,000-2,500 kcal for adults, varying by age, sex, and activity.</p>
        <p>Learn more about calories: <a href="https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/calories/art-20048065" target="_blank" rel="nofollow noreferrer">Mayo Clinic Calories Guide <ExternalLink className="h-4 w-4 inline" /></a></p>
      </section>

      {/* What is a Kilogram? */}
      <section className="prose dark:prose-invert mt-8">
        <h2>What is a Kilogram?</h2>
        <p>A kilogram (kg) is the base unit of mass in the metric system, equal to 1,000 grams or about 2.2 pounds. It's defined by the Planck constant since 2019.</p>
        <p>In fitness, a kilogram of body fat stores about 7,700 kcal due to fat's energy density (9 kcal/g). This conversion assumes 85-95% efficiency in metabolism. Kilograms measure body weight changes from caloric balance.</p>
        <p>Learn more about kilograms: <a href="https://www.nist.gov/si-redefinition/kilogram" target="_blank" rel="nofollow noreferrer">NIST Kilogram Definition <ExternalLink className="h-4 w-4 inline" /></a></p>
      </section>

      {/* Calorie to Kilogram Conversion Table */}
      <section className="prose dark:prose-invert mt-8">
        <h2>Calorie to Kilogram Conversion Table</h2>
        <p>Quick reference for common values (moderate activity level, factor 1.00).</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Calories (kcal)</TableHead>
              <TableHead>Kilograms (kg)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { cal: 1, kg: 0.00013 },
              { cal: 100, kg: 0.013 },
              { cal: 500, kg: 0.065 },
              { cal: 1000, kg: 0.130 },
              { cal: 3500, kg: 0.454 },
              { cal: 5000, kg: 0.649 },
              { cal: 7700, kg: 1.000 },
              { cal: 10000, kg: 1.299 },
              { cal: 21000, kg: 2.727 },
              { cal: 50000, kg: 6.494 },
            ].map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.cal.toLocaleString()}</TableCell>
                <TableCell>{item.kg.toFixed(3)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-xs text-muted-foreground mt-2">Table assumes moderate activity; adjust for your level using the calculator.</p>
      </section>

      {/* Practical Examples */}
      <section className="prose dark:prose-invert mt-8">
        <h2>Practical Examples</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Weekly Deficit",
              input: "3,500 calories, moderately active",
              result: "≈ 0.454 kg",
              desc: "A 500 kcal daily deficit (3,500/week) can lead to 0.45 kg fat loss per week."
            },
            {
              title: "Workout Session",
              input: "500 calories, very active",
              result: "≈ 0.071 kg",
              desc: "Burning 500 calories in a workout equates to about 71g of fat loss."
            },
            {
              title: "Monthly Goal",
              input: "21,000 calories, sedentary",
              result: "≈ 2.454 kg",
              desc: "A 700 kcal daily deficit over 30 days can result in ~2.5 kg fat loss."
            },
          ].map((example, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{example.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2"><strong>Input:</strong> {example.input}</p>
                <p className="text-sm mb-2"><strong>Result:</strong> {example.result}</p>
                <p className="text-xs text-muted-foreground">{example.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* References */}
      <section className="prose dark:prose-invert mt-8">
        <h2>References</h2>
        <ul>
          <li><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4035446/" target="_blank" rel="nofollow noreferrer">National Institutes of Health - Energy Balance <ExternalLink className="h-4 w-4 inline" /></a></li>
          <li><a href="https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/calories/art-20048065" target="_blank" rel="nofollow noreferrer">Mayo Clinic - Calories and Weight Loss <ExternalLink className="h-4 w-4 inline" /></a></li>
          <li><a href="https://www.acsm.org/" target="_blank" rel="nofollow noreferrer">American College of Sports Medicine - Nutrition Guidelines <ExternalLink className="h-4 w-4 inline" /></a></li>
          <li><a href="https://jamanetwork.com/journals/jama/fullarticle/2800195" target="_blank" rel="nofollow noreferrer">JAMA - Calorie Deficit and Weight Loss <ExternalLink className="h-4 w-4 inline" /></a></li>
        </ul>
      </section>

      {/* Affiliate Links */}
      <section className="prose dark:prose-invert mt-8">
        <h2>Recommended Fitness Tools</h2>
        <p>Enhance your calorie tracking with these tools. (Affiliate links - commission may be earned at no cost to you)</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Fitness Trackers on Amazon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">Track your daily activity with Fitbit or Garmin devices.</p>
              <Button variant="outline" asChild>
                <a href="https://www.amazon.com/s?k=fitness+tracker&tag=youraffiliateid-20" target="_blank" rel="nofollow noreferrer">
                  Shop Now <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>MyFitnessPal Premium</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">Log meals and track calories with advanced features.</p>
              <Button variant="outline" asChild>
                <a href="https://www.myfitnesspal.com/premium?affiliate=yourid" target="_blank" rel="nofollow noreferrer">
                  Get Premium <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AdSense Placeholder */}
      <div className="bg-muted p-4 text-center rounded-lg mt-8">
        <p className="text-sm text-muted-foreground">Ad Placement - Google AdSense</p>
      </div>
    </div>
  );
};

export { CaloriesToKilogramsCalculator };
export default CaloriesToKilogramsCalculator;