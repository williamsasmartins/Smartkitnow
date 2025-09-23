import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, AlertCircle, CheckCircle, Info, ExternalLink, Facebook, Twitter, Share2 } from "lucide-react";
import { Header } from "@/components/Header";

interface CaloriesToKgProps {}

const CaloriesToKilogramsCalculator: React.FC<CaloriesToKgProps> = () => {
  const [calories, setCalories] = useState<number | "">("");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [result, setResult] = useState<{ kg: number; message: string } | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState({ name: "", email: "", suggestions: "" });

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

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Feedback submitted:", feedback);
    alert("Thank you for your feedback! We'll review your suggestions.");
    setFeedback({ name: "", email: "", suggestions: "" });
  };

  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <Header />

      {/* Ad Space - Top Center (Below Header) */}
      <div className="max-w-3xl mx-auto mt-16 p-4 bg-gray-800 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-300 text-center">Ad Space - Top Center (Google AdSense)</p>
      </div>

      {/* Calculator Header */}
      <section className="max-w-3xl mx-auto mt-4 text-center">
        <h1 className="text-3xl font-bold mb-2 dark:text-white text-gray-900">Convert Calories to Kilograms</h1>
        <p className="dark:text-gray-400 text-gray-600">Category: Calories Conversion</p>
      </section>

      {/* Ad Space - Left Side (Sticky) */}
      <div className="fixed top-1/2 transform -translate-y-1/2 left-4 w-1/6 dark:bg-gray-800 bg-gray-200 p-4 rounded-lg z-0 hidden md:block">
        <p className="text-sm dark:text-gray-300 text-gray-700">Ad Space - Left Side (Google AdSense)</p>
      </div>

      {/* Ad Space - Right Side (Sticky) */}
      <div className="fixed top-1/2 transform -translate-y-1/2 right-4 w-1/6 dark:bg-gray-800 bg-gray-200 p-4 rounded-lg z-0 hidden md:block">
        <p className="text-sm dark:text-gray-300 text-gray-700">Ad Space - Right Side (Google AdSense)</p>
      </div>

      {/* Calculator Section */}
      <Card className="max-w-3xl mx-auto dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200">
        <CardHeader className="flex flex-row items-center space-x-2">
          <Calculator className="h-6 w-6 dark:text-blue-400 text-blue-600" />
          <div>
            <CardTitle className="text-2xl dark:text-white text-gray-900">Calories to Kilograms Calculator</CardTitle>
            <CardDescription className="dark:text-gray-400 text-gray-600">
              Transform calories into body weight equivalent to better understand your metabolism and fitness goals
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {error && (
            <Alert variant="destructive" className="dark:border-red-800 border-red-200 dark:bg-red-900/50 bg-red-100">
              <AlertCircle className="h-4 w-4 dark:text-red-400 text-red-600" />
              <AlertDescription className="dark:text-gray-200 text-gray-800">{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="calories" className="text-sm font-medium dark:text-gray-300 text-gray-700">
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
                className="w-full dark:bg-gray-700 bg-white dark:border-gray-600 border-gray-300 dark:text-white text-gray-900 dark:placeholder-gray-500 placeholder-gray-400"
              />
              <p className="text-xs dark:text-gray-500 text-gray-600">Unit: kcal (kilocalories)</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="activityLevel" className="text-sm font-medium dark:text-gray-300 text-gray-700">
                Activity Level
              </label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger className="w-full dark:bg-gray-700 bg-white dark:border-gray-600 border-gray-300 dark:text-white text-gray-900">
                  <SelectValue placeholder="Select your activity level..." />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 bg-white dark:border-gray-600 border-gray-300 dark:text-white text-gray-900">
                  <SelectItem value="sedentary" className="dark:hover:bg-gray-700 hover:bg-gray-100">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="light" className="dark:hover:bg-gray-700 hover:bg-gray-100">Lightly active (light exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderate" className="dark:hover:bg-gray-700 hover:bg-gray-100">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="active" className="dark:hover:bg-gray-700 hover:bg-gray-100">Active (intense exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="veryActive" className="dark:hover:bg-gray-700 hover:bg-gray-100">Very active (very intense exercise & physical job)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={calculateCaloriesToKg} 
              disabled={!calories || !activityLevel || loading}
              className="flex-1 dark:bg-blue-600 bg-blue-500 dark:text-white text-white dark:hover:bg-blue-700 hover:bg-blue-600"
            >
              {loading ? <>Calculating...</> : (<><Calculator className="h-4 w-4 mr-2 dark:text-blue-400 text-blue-600" />Calculate</>)}
            </Button>
            {(calories || activityLevel) && (
              <Button variant="outline" onClick={resetCalculator} className="flex-0 dark:text-white text-gray-900 dark:border-gray-600 border-gray-300 dark:hover:bg-gray-700 hover:bg-gray-100">
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="max-w-3xl mx-auto dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200">
          <CardHeader className="flex flex-row items-center space-x-2">
            <CheckCircle className="h-5 w-5 dark:text-green-500 text-green-700" />
            <CardTitle className="text-xl dark:text-white text-gray-900">Conversion Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-2xl font-bold dark:text-blue-400 text-blue-600">
                <span className="dark:text-gray-300 text-gray-700">{Number(calories).toLocaleString()}</span>
                <span className="dark:text-gray-500 text-gray-500">kcal</span>
                <span className="dark:text-gray-500 text-gray-500">→</span>
                <span>{result.kg.toFixed(3)}</span>
                <span className="dark:text-gray-500 text-gray-500">kg</span>
              </div>
            </div>
            <p className="text-sm dark:text-gray-300 text-gray-700 leading-relaxed">{result.message}</p>
            <Alert className="dark:border-green-800 border-green-200 dark:bg-green-900/50 bg-green-100">
              <Info className="h-4 w-4 dark:text-green-400 text-green-700" />
              <AlertDescription className="dark:text-gray-200 text-gray-800">
                <strong>💡 Tip:</strong> To lose 1kg of fat, you need to create a deficit of about 7,700 calories through diet and exercise. This is an estimate based on average metabolic efficiency.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* How to Use the Calculator */}
      <Card className="max-w-3xl mx-auto dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-white text-gray-900">
            <Info className="h-5 w-5 dark:text-blue-400 text-blue-600" />
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
              <div key={item.step} className="text-center space-y-2 p-4 dark:bg-gray-700 bg-gray-100 rounded-lg">
                <div className="w-8 h-8 dark:bg-blue-900 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="dark:text-blue-400 text-blue-600 font-bold">{item.step}</span>
                </div>
                <h4 className="font-medium dark:text-white text-gray-900">{item.title}</h4>
                <p className="text-sm dark:text-gray-400 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ad Space - Mid Page 1 */}
      <div className="dark:bg-gray-700 bg-gray-200 p-4 text-center rounded-lg mt-8">
        <p className="text-sm dark:text-gray-300 text-gray-700">Ad Space - Mid Page 1 (Google AdSense)</p>
      </div>

      {/* How to Convert Calories to Kilograms */}
      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900">
        <h2 className="text-2xl font-semibold">How to Convert Calories to Kilograms</h2>
        <p>To convert calories to kilograms of body fat, divide the number of calories by 7,700 (the approximate calories in 1 kg of fat) and multiply by an activity factor. The formula is:</p>
        <code className="block dark:bg-gray-700 bg-gray-200 p-2 rounded mb-4 dark:text-gray-300 text-gray-900">kilograms = (calories ÷ 7700) × activity_factor</code>
        <p>The activity factor adjusts for metabolic efficiency:</p>
        <ul className="list-disc pl-5 dark:text-gray-400 text-gray-700">
          <li>Sedentary: 0.90</li>
          <li>Lightly Active: 0.95</li>
          <li>Moderately Active: 1.00</li>
          <li>Active: 1.05</li>
          <li>Very Active: 1.10</li>
        </ul>
        <p>This conversion helps estimate how caloric deficits translate to weight loss or surpluses to gain. Note: Actual results vary due to individual metabolism, muscle mass, and water weight.</p>
      </section>

      {/* Ad Space - Mid Page 2 */}
      <div className="dark:bg-gray-700 bg-gray-200 p-4 text-center rounded-lg mt-8">
        <p className="text-sm dark:text-gray-300 text-gray-700">Ad Space - Mid Page 2 (Google AdSense)</p>
      </div>

      {/* What is a Calorie? */}
      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900">
        <h2 className="text-2xl font-semibold">What is a Calorie?</h2>
        <p>A calorie is a unit of energy, specifically the amount needed to raise 1 gram of water by 1°C. In nutrition, we use kilocalories (kcal), often just called "calories."</p>
        <p>Calories come from food and are used for bodily functions, movement, and growth. Excess calories are stored as fat, while a deficit causes the body to burn stored energy. Understanding calories is key to weight management, fitness, and health.</p>
        <p>One large calorie (kcal) equals 1,000 small calories. Typical daily intake is 2,000-2,500 kcal for adults, varying by age, sex, and activity.</p>
        <p>Learn more: <a href="https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/calories/art-20048065" target="_blank" rel="nofollow noreferrer" className="dark:text-blue-400 text-blue-600 hover:underline">Mayo Clinic Calories Guide <ExternalLink className="h-4 w-4 inline dark:text-blue-400 text-blue-600" /></a></p>
      </section>

      {/* What is a Kilogram? */}
      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900">
        <h2 className="text-2xl font-semibold">What is a Kilogram?</h2>
        <p>A kilogram (kg) is the base unit of mass in the metric system, equal to 1,000 grams or about 2.2 pounds. It's defined by the Planck constant since 2019.</p>
        <p>In fitness, a kilogram of body fat stores about 7,700 kcal due to fat's energy density (9 kcal/g). This conversion assumes 85-95% efficiency in metabolism. Kilograms measure body weight changes from caloric balance.</p>
        <p>Learn more: <a href="https://www.nist.gov/si-redefinition/kilogram" target="_blank" rel="nofollow noreferrer" className="dark:text-blue-400 text-blue-600 hover:underline">NIST Kilogram Definition <ExternalLink className="h-4 w-4 inline dark:text-blue-400 text-blue-600" /></a></p>
      </section>

      {/* Calorie to Kilogram Conversion Table */}
      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900">
        <h2 className="text-2xl font-semibold">Calorie to Kilogram Conversion Table</h2>
        <p>Quick reference for common values (moderate activity level, factor 1.00).</p>
        <Table className="dark:bg-gray-700 bg-gray-100 dark:border-gray-600 border-gray-300">
          <TableHeader>
            <TableRow>
              <TableHead className="dark:text-white text-gray-900">Calories (kcal)</TableHead>
              <TableHead className="dark:text-white text-gray-900">Kilograms (kg)</TableHead>
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
                <TableCell className="dark:text-gray-300 text-gray-700">{item.cal.toLocaleString()}</TableCell>
                <TableCell className="dark:text-gray-300 text-gray-700">{item.kg.toFixed(3)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-xs dark:text-gray-500 text-gray-600 mt-2">Table assumes moderate activity; adjust for your level using the calculator.</p>
      </section>

      {/* Practical Examples */}
      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900">
        <h2 className="text-2xl font-semibold">Practical Examples</h2>
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
            <Card key={index} className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white text-gray-900">{example.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2 dark:text-gray-300 text-gray-700"><strong>Input:</strong> {example.input}</p>
                <p className="text-sm mb-2 dark:text-gray-300 text-gray-700"><strong>Result:</strong> {example.result}</p>
                <p className="text-xs dark:text-gray-500 text-gray-600">{example.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Share Buttons */}
      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900 text-center">
        <h2 className="text-2xl font-semibold mb-4">Share This Calculator</h2>
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className="dark:text-gray-300 text-gray-900">
              <Facebook className="h-4 w-4 mr-2 dark:text-blue-400 text-blue-600" /> Facebook
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=Check out this Calories to Kilograms Calculator!`} target="_blank" rel="noopener noreferrer" className="dark:text-gray-300 text-gray-900">
              <Twitter className="h-4 w-4 mr-2 dark:text-blue-400 text-blue-600" /> Twitter/X
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`whatsapp://send?text=Check out this Calories to Kilograms Calculator! ${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" data-action="share/whatsapp/share" className="dark:text-gray-300 text-gray-900">
              <Share2 className="h-4 w-4 mr-2 dark:text-blue-400 text-blue-600" /> WhatsApp
            </a>
          </Button>
        </div>
      </section>

      {/* References */}
      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900">
        <h2 className="text-2xl font-semibold">References</h2>
        <ul>
          <li><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4035446/" target="_blank" rel="nofollow noreferrer" className="dark:text-blue-400 text-blue-600 hover:underline">National Institutes of Health - Energy Balance <ExternalLink className="h-4 w-4 inline dark:text-blue-400 text-blue-600" /></a></li>
          <li><a href="https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/calories/art-20048065" target="_blank" rel="nofollow noreferrer" className="dark:text-blue-400 text-blue-600 hover:underline">Mayo Clinic - Calories and Weight Loss <ExternalLink className="h-4 w-4 inline dark:text-blue-400 text-blue-600" /></a></li>
          <li><a href="https://www.acsm.org/" target="_blank" rel="nofollow noreferrer" className="dark:text-blue-400 text-blue-600 hover:underline">American College of Sports Medicine - Nutrition Guidelines <ExternalLink className="h-4 w-4 inline dark:text-blue-400 text-blue-600" /></a></li>
          <li><a href="https://jamanetwork.com/journals/jama/fullarticle/2800195" target="_blank" rel="nofollow noreferrer" className="dark:text-blue-400 text-blue-600 hover:underline">JAMA - Calorie Deficit and Weight Loss <ExternalLink className="h-4 w-4 inline dark:text-blue-400 text-blue-600" /></a></li>
        </ul>
      </section>

      {/* Affiliate Links */}
      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900">
        <h2 className="text-2xl font-semibold">Recommended Fitness Tools</h2>
        <p>Enhance your calorie tracking with these tools. (Affiliate links - commission may be earned at no cost to you)</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white text-gray-900">Fitness Trackers on Amazon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2 dark:text-gray-300 text-gray-700">Track your daily activity with Fitbit or Garmin devices.</p>
              <Button variant="outline" asChild className="dark:text-white text-gray-900 dark:border-gray-600 border-gray-300 dark:hover:bg-gray-700 hover:bg-gray-100">
                <a href="https://www.amazon.com/s?k=fitness+tracker&tag=youraffiliateid-20" target="_blank" rel="nofollow noreferrer">
                  Shop Now <ExternalLink className="h-4 w-4 ml-2 dark:text-blue-400 text-blue-600" />
                </a>
              </Button>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white text-gray-900">MyFitnessPal Premium</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2 dark:text-gray-300 text-gray-700">Log meals and track calories with advanced features.</p>
              <Button variant="outline" asChild className="dark:text-white text-gray-900 dark:border-gray-600 border-gray-300 dark:hover:bg-gray-700 hover:bg-gray-100">
                <a href="https://www.myfitnesspal.com/premium?affiliate=yourid" target="_blank" rel="nofollow noreferrer">
                  Get Premium <ExternalLink className="h-4 w-4 ml-2 dark:text-blue-400 text-blue-600" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feedback Form */}
      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900">
        <h2 className="text-2xl font-semibold mb-4">Send Us Your Feedback</h2>
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium dark:text-gray-300 text-gray-700">Name (Optional)</label>
            <Input
              id="name"
              value={feedback.name}
              onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
              className="mt-1 dark:bg-gray-700 bg-white dark:border-gray-600 border-gray-300 dark:text-white text-gray-900 dark:placeholder-gray-500 placeholder-gray-400"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium dark:text-gray-300 text-gray-700">Email (Optional)</label>
            <Input
              id="email"
              type="email"
              value={feedback.email}
              onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
              className="mt-1 dark:bg-gray-700 bg-white dark:border-gray-600 border-gray-300 dark:text-white text-gray-900 dark:placeholder-gray-500 placeholder-gray-400"
            />
          </div>
          <div>
            <label htmlFor="suggestions" className="text-sm font-medium dark:text-gray-300 text-gray-700">Suggestions</label>
            <Input
              id="suggestions"
              value={feedback.suggestions}
              onChange={(e) => setFeedback({ ...feedback, suggestions: e.target.value })}
              className="mt-1 dark:bg-gray-700 bg-white dark:border-gray-600 border-gray-300 dark:text-white text-gray-900 dark:placeholder-gray-500 placeholder-gray-400"
            />
          </div>
          <Button type="submit" className="dark:bg-blue-600 bg-blue-500 dark:text-white text-white dark:hover:bg-blue-700 hover:bg-blue-600">Submit Feedback</Button>
        </form>
      </section>

      {/* Professional Disclaimer and Review Note */}
      <section className="max-w-3xl mx-auto mt-8 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-soft dark:text-gray-300 text-gray-900 text-center">
        <p className="text-sm">
          <strong>Note:</strong> This calculator is reviewed by the Smart Kit Now Team for accuracy. For health-related decisions, consult a professional healthcare provider.
        </p>
      </section>
    </div>
  );
};

export { CaloriesToKilogramsCalculator };
export default CaloriesToKilogramsCalculator;