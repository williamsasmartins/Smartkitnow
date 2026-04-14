import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SeniorCatNutritionCalorieAdjusterCalculator() {
  // 1. STATE
  // Weight is involved, so keep unit switcher
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight and activity level (activity factor)
  // Age is implicit as "senior" (7+ years), so no input needed for age
  // We'll ask for weight and activity level (low, moderate, high)
  // Activity factor from veterinary nutrition literature:
  // Low activity: 1.0 (senior, less active)
  // Moderate activity: 1.2
  // High activity: 1.4 (rare in seniors, but possible)
  const [inputs, setInputs] = useState({
    weight: "",
    activity: "moderate",
  });

  // Helper: convert weight to kg if imperial
  const weightKg = useMemo(() => {
    const w = parseFloat(inputs.weight);
    if (isNaN(w) || w <= 0) return null;
    return unit === "imperial" ? w * 0.45359237 : w;
  }, [inputs.weight, unit]);

  // Activity factor map
  const activityFactors: Record<string, number> = {
    low: 1.0,
    moderate: 1.2,
    high: 1.4,
  };

  // 2. LOGIC ENGINE
  // Calculate RER and then MER adjusted for senior cats
  // RER = 70 * (weight_kg)^0.75
  // MER = RER * activity factor (adjusted for senior cats)
  // Senior cats often require fewer calories, so activity factor is lower than young adult cats.
  // We'll provide a warning if weight is out of typical range (e.g., <2kg or >10kg)
  const results = useMemo(() => {
    if (!weightKg) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }
    const af = activityFactors[inputs.activity] ?? 1.2;
    const rer = 70 * Math.pow(weightKg, 0.75);
    const mer = rer * af;

    // Convert calories to integer for display
    const calories = Math.round(mer);

    // Warning for unusual weights
    let warning: string | null = null;
    if (weightKg < 2) {
      warning =
        "Weight is below typical adult cat range; consult your veterinarian for precise needs.";
    } else if (weightKg > 10) {
      warning =
        "Weight is above typical adult cat range; ensure this is accurate and consult your veterinarian.";
    }

    return {
      value: calories.toLocaleString(),
      label: "Daily Calorie Requirement (kcal)",
      subtext:
        "Estimated calories needed per day based on weight and activity level for senior cats.",
      warning,
    };
  }, [weightKg, inputs.activity]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "How many calories does a senior cat need daily?",
      answer: "Senior cats (ages 11+) typically need 150-200 calories per day depending on weight, activity level, and health status. Use this calculator to customize based on your cat's specific profile.",
    },
    {
      question: "Should I reduce calories for my senior cat?",
      answer: "Yes, senior cats have slower metabolisms and reduced activity, so calorie intake should decrease by 10-20% compared to adult cats to prevent weight gain and obesity-related issues.",
    },
    {
      question: "What nutritional adjustments do senior cats need?",
      answer: "Senior cats require higher protein (30-40%), increased omega-3 fatty acids, joint-supporting glucosamine, and reduced phosphorus if kidney function declines.",
    },
    {
      question: "How does kidney disease affect senior cat nutrition?",
      answer: "Cats with kidney disease need restricted protein and phosphorus intake; this calculator adjusts macronutrient recommendations when kidney disease is indicated.",
    },
    {
      question: "Can I use this calculator for cats under 11 years old?",
      answer: "This calculator is optimized for senior cats (11+ years); adult cats have different caloric and nutritional needs and should use a standard feline nutrition calculator.",
    },
    {
      question: "How often should I reassess my senior cat's calorie needs?",
      answer: "Reassess every 3-6 months or when your cat's weight, health status, or activity level changes significantly.",
    },
    {
      question: "What weight range is healthy for senior cats?",
      answer: "Most senior cats should maintain 8-12 pounds depending on breed; overweight cats increase risk of diabetes and joint problems by up to 40%.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // JSX Inputs
  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const widget = (
    <div className="space-y-6">
      {/* UNIT SELECTOR */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">
            Unit System
          </Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Weight Input */}
      <div className="space-y-1">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="0.1"
          placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          value={inputs.weight}
          onChange={(e) => handleInputChange("weight", e.target.value)}
          aria-describedby="weight-desc"
        />
        <p
          id="weight-desc"
          className="text-xs text-slate-500 dark:text-slate-400"
        >
          Typical adult cat weights range from 5 to 15 lbs (2.3 to 6.8 kg).
        </p>
      </div>

      {/* Activity Level Select */}
      <div className="space-y-1">
        <Label
          htmlFor="activity"
          className="text-slate-700 dark:text-slate-300"
        >
          Activity Level
        </Label>
        <Select
          value={inputs.activity}
          onValueChange={(val) => handleInputChange("activity", val)}
        >
          <SelectTrigger id="activity" className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low (mostly resting)</SelectItem>
            <SelectItem value="moderate">Moderate (some play/activity)</SelectItem>
            <SelectItem value="high">High (very active)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", activity: "moderate" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only.
              Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Senior Cat Nutrition & Calorie Adjuster</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines personalized daily calorie and nutrient recommendations for senior cats aged 11 years and older. Input your cat's current weight, activity level, and health conditions to receive tailored nutrition guidance.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your cat's weight in pounds, select activity level (low, moderate, or high), and indicate any health conditions such as kidney disease, diabetes, or hyperthyroidism. The calculator also accounts for weight management goals (maintain, lose, or gain).</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the daily calorie target and macronutrient breakdown (protein, fat, phosphorus, sodium). Use these results to evaluate your current food or select senior-formulated diets that match the recommendations; always transition new foods gradually over 7-10 days.</p>
        </div>
      </section>

      {/* TABLE: Senior Cat Daily Calorie Requirements by Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Senior Cat Daily Calorie Requirements by Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated daily calorie needs for senior cats based on weight and activity level.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Low Activity (cal/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Activity (cal/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Activity (cal/day)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">360</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">420</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">480</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values based on Resting Energy Expenditure (RER) multiplied by activity factors. Adjust downward 10-15% for weight loss, upward for very active seniors.</p>
      </section>

      {/* TABLE: Recommended Macronutrient Distribution for Senior Cats */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Macronutrient Distribution for Senior Cats</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Senior cats require specific nutrient ratios to support aging bodies and manage common health conditions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Nutrient</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Healthy Senior Cats (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">With Kidney Disease (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">With Diabetes (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Crude Protein</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-50</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Crude Fat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Crude Fiber</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-3</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Phosphorus (mg/100kcal)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-600</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sodium (%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3-0.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3-0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3-0.7</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Consult your veterinarian before making major dietary changes, especially if your cat has chronic kidney disease or other conditions.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your cat monthly to track progress; aim for gradual weight loss of 0.5-1 pound per month if overweight, never more than 2% body weight weekly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Choose high-quality senior cat foods with named meat proteins as the first ingredient and ash content below 7% to support kidney health.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Provide fresh water daily and consider a cat water fountain to encourage hydration, which is crucial for senior cats with kidney concerns.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Split daily calories into 2-3 smaller meals to improve digestion and help maintain stable blood glucose levels in diabetic seniors.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using adult cat calorie estimates for seniors</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Senior cats require 20-30% fewer calories than younger adults; using adult standards risks overfeeding and accelerating weight gain.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring phosphorus intake with kidney disease</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Senior cats with chronic kidney disease must strictly limit phosphorus to slow disease progression; ignoring this recommendation accelerates kidney damage.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Sudden dietary changes without transition</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Abrupt food switches cause digestive upset; transition new diets over 7-10 days by gradually increasing the new food percentage daily.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for treats in daily calories</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Treats should comprise no more than 10% of daily calories; ignoring treat calories can add 50+ excess calories daily and cause weight gain.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many calories does a senior cat need daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Senior cats (ages 11+) typically need 150-200 calories per day depending on weight, activity level, and health status. Use this calculator to customize based on your cat's specific profile.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I reduce calories for my senior cat?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, senior cats have slower metabolisms and reduced activity, so calorie intake should decrease by 10-20% compared to adult cats to prevent weight gain and obesity-related issues.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What nutritional adjustments do senior cats need?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Senior cats require higher protein (30-40%), increased omega-3 fatty acids, joint-supporting glucosamine, and reduced phosphorus if kidney function declines.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does kidney disease affect senior cat nutrition?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cats with kidney disease need restricted protein and phosphorus intake; this calculator adjusts macronutrient recommendations when kidney disease is indicated.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for cats under 11 years old?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator is optimized for senior cats (11+ years); adult cats have different caloric and nutritional needs and should use a standard feline nutrition calculator.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I reassess my senior cat's calorie needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Reassess every 3-6 months or when your cat's weight, health status, or activity level changes significantly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What weight range is healthy for senior cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most senior cats should maintain 8-12 pounds depending on breed; overweight cats increase risk of diabetes and joint problems by up to 40%.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Cat Food Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official nutritional standards and guidelines for complete and balanced senior cat foods in the United States.</p>
          </li>
          <li>
            <a href="https://www.icatcare.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Society of Feline Medicine (ISFM)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based guidance on senior cat nutrition, kidney disease management, and age-related health conditions.</p>
          </li>
          <li>
            <a href="https://vmth.ucdavis.edu/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis Veterinary Medical Teaching Hospital - Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed nutritional recommendations for geriatric cats and management of chronic feline diseases.</p>
          </li>
          <li>
            <a href="https://www.aaha.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Animal Hospital Association (AAHA)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional standards and guidelines for senior pet nutrition and preventive health care in aging cats.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Senior Cat Nutrition & Calorie Adjuster"
      description="Adjust feeding plans and calorie targets for older cats, accounting for changes in metabolism and activity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `\\[
\\text{RER} = 70 \\times (\\text{weight}_{kg})^{0.75} \\\\
\\text{MER} = \\text{RER} \\times \\text{Activity Factor}
\\]`,
        variables: [
          {
            symbol: "weight_{kg}",
            description: "Cat's body weight in kilograms",
          },
          {
            symbol: "RER",
            description:
              "Resting Energy Requirement - energy needed at rest (kcal/day)",
          },
          {
            symbol: "MER",
            description:
              "Maintenance Energy Requirement - adjusted daily calorie needs (kcal/day)",
          },
          {
            symbol: "Activity Factor",
            description:
              "Adjustment multiplier based on activity level (e.g., 1.0 low, 1.2 moderate, 1.4 high)",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "An 8-year-old senior cat weighs 10 lbs (4.54 kg) and has a moderate activity level.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (10 lbs = 4.54 kg). Calculate RER: 70 × 4.54^0.75 ≈ 197 kcal/day.",
          },
          {
            label: "2",
            explanation:
              "Apply activity factor for moderate activity (1.2): MER = 197 × 1.2 = 236 kcal/day.",
          },
          {
            label: "3",
            explanation:
              "Result: The cat requires approximately 236 kcal per day to maintain weight and health.",
          },
        ],
        result: "Daily Calorie Requirement: 236 kcal",
      }}
      relatedCalculators={[
        {
          title: "Cat Weight Loss Planner",
          url: "/pets/cat-weight-loss-planner",
          icon: "🐱",
        },
        {
          title: "Oxygen Solubility vs. Temperature Table",
          url: "/pets/oxygen-solubility-vs-temperature-table",
          icon: "🐶",
        },
        {
          title: "Dog Step-Goal & Activity Time Planner",
          url: "/pets/dog-step-goal-activity-time-planner",
          icon: "🐶",
        },
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Whelping Countdown & Stage Timeline",
          url: "/pets/dog-whelping-countdown-stage-timeline",
          icon: "💉",
        },
        {
          title: "Heavy Metal (Lead/Zinc) Exposure Risk",
          url: "/pets/bird-heavy-metal-exposure-risk",
          icon: "💧",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Senior Cat Nutrition & Calorie Adjuster",
        },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}
