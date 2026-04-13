import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CarbTargetLowCarbKetoCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "", // lbs or kg
    heightFeet: "", // feet (imperial only)
    heightInches: "", // inches (imperial only)
    heightCm: "", // cm (metric only)
    activityLevel: "sedentary", // sedentary, light, moderate, active, very-active
    goal: "maintenance", // maintenance, weight-loss, keto, low-carb
  });

  // Activity multipliers for carb needs estimation (approximate)
  const activityMultipliers: Record<string, number> = {
    sedentary: 0.8,
    light: 1.0,
    moderate: 1.2,
    active: 1.4,
    "very-active": 1.6,
  };

  // Carb ranges in grams per day for different goals
  // Keto: 20-50g, Low-Carb: 50-130g, Maintenance: 130-300g (varies)
  // We'll estimate based on weight and activity

  // 2. LOGIC
  const results = useMemo(() => {
    // Validate inputs
    let weightLbs: number;
    let heightInchesTotal: number | null = null;

    if (unit === "imperial") {
      weightLbs = parseFloat(inputs.weight);
      const feet = parseFloat(inputs.heightFeet);
      const inches = parseFloat(inputs.heightInches);
      if (
        isNaN(weightLbs) ||
        weightLbs <= 0 ||
        isNaN(feet) ||
        feet < 0 ||
        isNaN(inches) ||
        inches < 0
      ) {
        return { value: 0, label: "Please enter valid weight and height.", category: "" };
      }
      heightInchesTotal = feet * 12 + inches;
    } else {
      // metric
      const weightKg = parseFloat(inputs.weight);
      const heightCm = parseFloat(inputs.heightCm);
      if (
        isNaN(weightKg) ||
        weightKg <= 0 ||
        isNaN(heightCm) ||
        heightCm <= 0
      ) {
        return { value: 0, label: "Please enter valid weight and height.", category: "" };
      }
      weightLbs = weightKg * 2.20462;
      heightInchesTotal = heightCm / 2.54;
    }

    // Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor (approximate)
    // For carb target, BMR helps estimate energy needs.
    // Since gender not provided, use average: 10*weight(kg) + 6.25*height(cm) - 5*age + 5 (male) or -161 (female)
    // Without age/gender, approximate BMR = 24 * weight(kg)
    const weightKg = weightLbs / 2.20462;
    const heightCm = heightInchesTotal * 2.54;

    // Approximate BMR (kcal/day)
    const bmr = 24 * weightKg;

    // Activity factor
    const activityFactor = activityMultipliers[inputs.activityLevel] || 1.0;

    // Total Daily Energy Expenditure (TDEE)
    const tdee = bmr * activityFactor;

    // Carb target calculation based on goal
    // Carb grams = % of calories from carbs / 4 (calories per gram of carb)
    // Typical calorie % from carbs:
    // Keto: 5-10% (20-50g)
    // Low-Carb: 10-25% (50-130g)
    // Maintenance: 45-65% (130-300g)
    // Weight loss moderate carb: 20-40%

    let carbMin = 0;
    let carbMax = 0;
    let label = "";
    let category = "";

    switch (inputs.goal) {
      case "keto":
        // 5-10% calories from carbs
        carbMin = Math.round((tdee * 0.05) / 4);
        carbMax = Math.round((tdee * 0.10) / 4);
        label = `Ketogenic Range: ${carbMin}g - ${carbMax}g carbs/day`;
        category = "Keto";
        break;
      case "low-carb":
        // 10-25% calories from carbs
        carbMin = Math.round((tdee * 0.10) / 4);
        carbMax = Math.round((tdee * 0.25) / 4);
        label = `Low-Carb Range: ${carbMin}g - ${carbMax}g carbs/day`;
        category = "Low-Carb";
        break;
      case "weight-loss":
        // Moderate carb for weight loss: 20-40%
        carbMin = Math.round((tdee * 0.20) / 4);
        carbMax = Math.round((tdee * 0.40) / 4);
        label = `Weight Loss Range: ${carbMin}g - ${carbMax}g carbs/day`;
        category = "Weight Loss";
        break;
      case "maintenance":
      default:
        // Balanced diet: 45-65%
        carbMin = Math.round((tdee * 0.45) / 4);
        carbMax = Math.round((tdee * 0.65) / 4);
        label = `Maintenance Range: ${carbMin}g - ${carbMax}g carbs/day`;
        category = "Maintenance";
        break;
    }

    // Show range as "min - max"
    return {
      value: `${carbMin} - ${carbMax}`,
      label,
      category,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is a good daily carb target for weight loss?",
      answer: "A good daily carb target for weight loss typically ranges from 100–150g per day for moderate low-carb dieting, or 50–100g per day for stricter low-carb approaches. Most people see consistent results at 20–50% of total daily calories from carbs, which translates to roughly 100–200g depending on a 2,000 calorie diet. Your individual target depends on activity level, metabolic rate, and dietary preferences.",
    },
    {
      question: "What is the difference between low-carb and keto carb targets?",
      answer: "Low-carb diets typically allow 50–150g of carbs per day (5–25% of total calories), while ketogenic (keto) diets restrict carbs to 20–50g daily (typically &lt;5% of calories) to maintain ketosis. Keto aims to shift your body into fat-burning mode by depleting glycogen stores, whereas low-carb simply reduces carb intake while maintaining moderate protein and fat. Keto requires stricter tracking and may cause temporary side effects like 'keto flu,' while low-carb is often more sustainable for long-term adherence.",
    },
    {
      question: "How do I calculate my personal carb target based on my goals?",
      answer: "Start by determining your total daily calorie needs using your age, sex, weight, height, and activity level. Then decide your target carb percentage: 45–65% for standard diets, 25–45% for low-carb, or &lt;5% for keto. Multiply your daily calories by your target percentage and divide by 4 (since carbs contain 4 calories per gram). For example, a 2,000 calorie diet at 30% carbs = 2,000 × 0.30 ÷ 4 = 150g of carbs daily.",
    },
    {
      question: "Can I do keto if I exercise regularly?",
      answer: "Yes, but you may need to adjust your carb target or timing to support performance. Athletes often use cyclical keto (higher carbs on training days) or targeted keto (carbs around workouts), which allows 50–100g of carbs on exercise days while staying in ketosis on rest days. Standard strict keto (&lt;20g carbs) may reduce high-intensity performance, so monitoring your energy and recovery is important. Consult a sports nutritionist if pursuing competitive athletics on a ketogenic diet.",
    },
    {
      question: "What are net carbs versus total carbs on a keto diet?",
      answer: "Net carbs are calculated by subtracting fiber and sugar alcohols from total carbs, since these don't significantly impact blood sugar or ketosis. Most keto enthusiasts track net carbs and target 20–50g daily, while total carb intake may be slightly higher due to fiber content. For example, a food with 10g total carbs, 5g fiber, and 2g sugar alcohol would have 3g net carbs. Some people count total carbs instead for stricter adherence, especially when starting keto.",
    },
    {
      question: "How many carbs should I eat if I'm sedentary versus very active?",
      answer: "Sedentary individuals typically need fewer carbs—often 100–150g daily for weight loss or maintenance. Active or athletic individuals may require 150–300g+ daily to fuel workouts and support recovery, depending on exercise intensity and duration. A sedentary person on a 2,000 calorie diet at 40% carbs needs ~200g, while an athlete burning 3,000+ calories may need 225–375g at the same percentage. Your carb target should scale with your energy expenditure.",
    },
    {
      question: "Is 50g of carbs per day enough to stay in ketosis?",
      answer: "For most people, 50g of carbs per day is sufficient to maintain ketosis, though the exact threshold varies by individual metabolism, exercise, and insulin sensitivity. The standard keto guideline is to keep net carbs under 20–50g daily, with 50g being a more liberal upper limit. If you're not seeing results at 50g, dropping to 30–40g or even 20g may push you deeper into ketosis. Testing with blood or urine ketone meters can help confirm whether you're in ketosis at your current intake.",
    },
    {
      question: "How do macronutrient ratios differ between low-carb and keto diets?",
      answer: "Low-carb diets typically use a 40% protein / 30% fat / 30% carb ratio, allowing more flexibility in food choices. Keto diets aim for roughly 70–75% fat / 20–25% protein / 5% carbs (or &lt;50g net carbs) to maintain ketosis. The higher fat ratio in keto is essential for sustained energy and satiety when carbs are severely restricted. Both approaches emphasize whole foods, healthy fats, and adequate protein to preserve muscle mass.",
    },
    {
      question: "Should I adjust my carb target if I have insulin resistance or diabetes?",
      answer: "Yes—if you have insulin resistance or type 2 diabetes, a lower carb target (50–100g daily) or keto approach (&lt;50g daily) may improve blood sugar control and insulin sensitivity. Work with your doctor or a registered dietitian to determine a safe carb target and monitor blood glucose levels closely, especially if taking medication. Some individuals see dramatic improvements in HbA1c and medication requirements within weeks of reducing carbs, while others need gradual transitions. Never adjust medication doses without medical supervision.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={(value) => {
            setUnit(value);
            setInputs({
              weight: "",
              heightFeet: "",
              heightInches: "",
              heightCm: "",
              activityLevel: "sedentary",
              goal: "maintenance",
            });
          }}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (US/Canada)</SelectItem>
              <SelectItem value="metric">Metric (International)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 150" : "e.g. 68"}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>

        {/* Height Input */}
        {unit === "imperial" ? (
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="heightFeet" className="text-slate-700 dark:text-slate-300">
                Height - Feet
              </Label>
              <Input
                id="heightFeet"
                type="number"
                min={0}
                step="1"
                placeholder="e.g. 5"
                value={inputs.heightFeet}
                onChange={(e) => setInputs((prev) => ({ ...prev, heightFeet: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="heightInches" className="text-slate-700 dark:text-slate-300">
                Height - Inches
              </Label>
              <Input
                id="heightInches"
                type="number"
                min={0}
                max={11}
                step="1"
                placeholder="e.g. 8"
                value={inputs.heightInches}
                onChange={(e) => setInputs((prev) => ({ ...prev, heightInches: e.target.value }))}
              />
            </div>
          </div>
        ) : (
          <div>
            <Label htmlFor="heightCm" className="text-slate-700 dark:text-slate-300">
              Height (cm)
            </Label>
            <Input
              id="heightCm"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 173"
              value={inputs.heightCm}
              onChange={(e) => setInputs((prev) => ({ ...prev, heightCm: e.target.value }))}
            />
          </div>
        )}

        {/* Activity Level */}
        <div>
          <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300">
            Activity Level
          </Label>
          <Select
            id="activityLevel"
            value={inputs.activityLevel}
            onValueChange={(value) => setInputs((prev) => ({ ...prev, activityLevel: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
              <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
              <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
              <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
              <SelectItem value="very-active">Very active (very hard exercise & physical job)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Goal */}
        <div>
          <Label htmlFor="goal" className="text-slate-700 dark:text-slate-300">
            Dietary Goal
          </Label>
          <Select
            id="goal"
            value={inputs.goal}
            onValueChange={(value) => setInputs((prev) => ({ ...prev, goal: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maintenance">Maintenance (balanced carbs)</SelectItem>
              <SelectItem value="weight-loss">Weight Loss (moderate carb)</SelectItem>
              <SelectItem value="low-carb">Low-Carb</SelectItem>
              <SelectItem value="keto">Ketogenic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              heightFeet: "",
              heightInches: "",
              heightCm: "",
              activityLevel: "sedentary",
              goal: "maintenance",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.category && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 text-sm font-bold">
                  {results.category}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Carb Target (incl. low-carb/keto ranges) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine your optimal daily carbohydrate intake based on your dietary goals—whether you're aiming for a standard balanced diet, a low-carb approach, or a strict ketogenic protocol. Carb targets are essential for managing energy levels, supporting metabolic health, and achieving weight loss or fitness goals. By personalizing your carb intake, you can improve adherence, sustain long-term results, and avoid the common pitfall of generic one-size-fits-all recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your age, sex, current weight, height, and daily activity level (sedentary, lightly active, moderately active, or very active). Then select your primary goal—weight loss, maintenance, or muscle gain—and choose your preferred diet type (standard, low-carb, or keto). The calculator will estimate your total daily energy expenditure (TDEE) and compute your recommended carb range based on evidence-based percentages for each diet approach.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your results will show daily carb targets in grams, along with context for low-carb (25–45% of calories) and ketogenic (&lt;5% of calories) ranges. Use the lower end of your range if you're struggling to lose weight or want stricter ketosis, and the higher end if you're very active or prefer more food flexibility. Track your actual intake for 2–3 weeks, monitor your energy and hunger levels, and adjust up or down by 10–20g as needed to find your personal sweet spot.</p>
        </div>
      </section>

      {/* TABLE: Daily Carb Targets by Diet Type and Calorie Level */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Carb Targets by Diet Type and Calorie Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows recommended daily carb targets (in grams) across different diet approaches and total daily calorie intakes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Diet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2,000 Calories</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2,500 Calories</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">3,000 Calories</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard (45–65% carbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">225–325g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">281–406g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">338–488g</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Low-Carb (25–45% carbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125–225g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">156–281g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">188–338g</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Very Low-Carb (20–25% carbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100–125g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125–156g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150–188g</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ketogenic (&lt;5% carbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;25g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;31g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;38g</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Figures represent net carbs. Actual targets vary based on activity level, metabolism, and individual goals.</p>
      </section>

      {/* TABLE: Carb Content of Common Foods for Low-Carb and Keto Diets */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Carb Content of Common Foods for Low-Carb and Keto Diets</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this reference to understand net carb counts for foods typically included in low-carb and ketogenic meal plans.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Item</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Serving Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Net Carbs (g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chicken breast (cooked)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Protein</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Salmon fillet (cooked)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Protein</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Eggs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Protein</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Broccoli (cooked)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vegetable</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Spinach (raw)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.9g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vegetable</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cauliflower (cooked)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vegetable</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bell pepper (raw)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.9g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vegetable</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Blueberries</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">½ cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fruit</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Almonds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 oz (23 nuts)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.1g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Nut</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Olive oil</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 tbsp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fat</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cheddar cheese</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 oz</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dairy</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Whole wheat bread</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 slice</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Grain</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Net carbs calculated as total carbs minus fiber. Values are approximate and may vary by brand and preparation.</p>
      </section>

      {/* TABLE: Ketosis Targets and Blood/Urine Ketone Levels */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Ketosis Targets and Blood/Urine Ketone Levels</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the typical ketone ranges used to confirm nutritional ketosis and their corresponding blood glucose levels.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ketone Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Blood Ketones (mmol/L)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Urine Ketones</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Nutritional State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Trace ketosis</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5–1.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Small</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Early ketosis, mild carb restriction</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Light ketosis</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0–1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low-carb diet or light exercise fasting</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate ketosis</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5–3.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Typical ketogenic diet (20–50g carbs)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Deep ketosis</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;3.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Strict keto (&lt;20g carbs) or prolonged fasting</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ketoacidosis (dangerous)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excessive</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rare in healthy individuals; medical concern</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Blood ketone testing (via meter) is more accurate than urine strips. Nutritional ketosis (&lt;6.0 mmol/L) is distinct from dangerous diabetic ketoacidosis.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Track net carbs if you're on keto by subtracting grams of fiber and sugar alcohols from total carbs—this accounts for carbs your body can't easily digest and don't spike blood sugar.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Time your higher-carb meals around your workouts (within 30–60 minutes post-exercise) to replenish glycogen and support muscle recovery, even on a low-carb diet.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a food scale or app like MyFitnessPal for the first 2–3 weeks to build awareness of portion sizes and hidden carbs in sauces, dressings, and processed foods.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Stay hydrated and maintain electrolyte balance (sodium, potassium, magnesium) during the first 1–2 weeks of carb restriction, as lower insulin levels increase water and mineral excretion.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing total carbs with net carbs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people starting keto count total carbs instead of net carbs, severely underestimating their actual intake and stalling results. Always subtract fiber and sugar alcohols when tracking on a ketogenic diet to avoid this common miscalculation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Eating too little carbs if very active</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Athletes and highly active individuals who adopt strict keto (&lt;20g carbs daily) often experience fatigue, poor performance, and injury risk. Cyclical or targeted keto with 50–100g carbs on training days better supports athletic performance while maintaining ketosis on rest days.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not adjusting for hormonal cycles</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Women's carb tolerance and energy needs fluctuate throughout the menstrual cycle; many feel better with slightly higher carbs (110–130g) in the luteal phase. Ignoring these patterns can lead to excessive hunger, fatigue, and unnecessary dietary frustration.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating carb content of whole foods</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Whole vegetables like broccoli and cauliflower have far fewer net carbs than grains, yet people often avoid them unnecessarily on low-carb diets. Including non-starchy vegetables ensures you get fiber, micronutrients, and satiety without derailing your carb target.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a good daily carb target for weight loss?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A good daily carb target for weight loss typically ranges from 100–150g per day for moderate low-carb dieting, or 50–100g per day for stricter low-carb approaches. Most people see consistent results at 20–50% of total daily calories from carbs, which translates to roughly 100–200g depending on a 2,000 calorie diet. Your individual target depends on activity level, metabolic rate, and dietary preferences.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between low-carb and keto carb targets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Low-carb diets typically allow 50–150g of carbs per day (5–25% of total calories), while ketogenic (keto) diets restrict carbs to 20–50g daily (typically &lt;5% of calories) to maintain ketosis. Keto aims to shift your body into fat-burning mode by depleting glycogen stores, whereas low-carb simply reduces carb intake while maintaining moderate protein and fat. Keto requires stricter tracking and may cause temporary side effects like 'keto flu,' while low-carb is often more sustainable for long-term adherence.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my personal carb target based on my goals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Start by determining your total daily calorie needs using your age, sex, weight, height, and activity level. Then decide your target carb percentage: 45–65% for standard diets, 25–45% for low-carb, or &lt;5% for keto. Multiply your daily calories by your target percentage and divide by 4 (since carbs contain 4 calories per gram). For example, a 2,000 calorie diet at 30% carbs = 2,000 × 0.30 ÷ 4 = 150g of carbs daily.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I do keto if I exercise regularly?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, but you may need to adjust your carb target or timing to support performance. Athletes often use cyclical keto (higher carbs on training days) or targeted keto (carbs around workouts), which allows 50–100g of carbs on exercise days while staying in ketosis on rest days. Standard strict keto (&lt;20g carbs) may reduce high-intensity performance, so monitoring your energy and recovery is important. Consult a sports nutritionist if pursuing competitive athletics on a ketogenic diet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are net carbs versus total carbs on a keto diet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Net carbs are calculated by subtracting fiber and sugar alcohols from total carbs, since these don't significantly impact blood sugar or ketosis. Most keto enthusiasts track net carbs and target 20–50g daily, while total carb intake may be slightly higher due to fiber content. For example, a food with 10g total carbs, 5g fiber, and 2g sugar alcohol would have 3g net carbs. Some people count total carbs instead for stricter adherence, especially when starting keto.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many carbs should I eat if I'm sedentary versus very active?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Sedentary individuals typically need fewer carbs—often 100–150g daily for weight loss or maintenance. Active or athletic individuals may require 150–300g+ daily to fuel workouts and support recovery, depending on exercise intensity and duration. A sedentary person on a 2,000 calorie diet at 40% carbs needs ~200g, while an athlete burning 3,000+ calories may need 225–375g at the same percentage. Your carb target should scale with your energy expenditure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is 50g of carbs per day enough to stay in ketosis?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For most people, 50g of carbs per day is sufficient to maintain ketosis, though the exact threshold varies by individual metabolism, exercise, and insulin sensitivity. The standard keto guideline is to keep net carbs under 20–50g daily, with 50g being a more liberal upper limit. If you're not seeing results at 50g, dropping to 30–40g or even 20g may push you deeper into ketosis. Testing with blood or urine ketone meters can help confirm whether you're in ketosis at your current intake.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do macronutrient ratios differ between low-carb and keto diets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Low-carb diets typically use a 40% protein / 30% fat / 30% carb ratio, allowing more flexibility in food choices. Keto diets aim for roughly 70–75% fat / 20–25% protein / 5% carbs (or &lt;50g net carbs) to maintain ketosis. The higher fat ratio in keto is essential for sustained energy and satiety when carbs are severely restricted. Both approaches emphasize whole foods, healthy fats, and adequate protein to preserve muscle mass.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust my carb target if I have insulin resistance or diabetes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—if you have insulin resistance or type 2 diabetes, a lower carb target (50–100g daily) or keto approach (&lt;50g daily) may improve blood sugar control and insulin sensitivity. Work with your doctor or a registered dietitian to determine a safe carb target and monitor blood glucose levels closely, especially if taking medication. Some individuals see dramatic improvements in HbA1c and medication requirements within weeks of reducing carbs, while others need gradual transitions. Never adjust medication doses without medical supervision.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.dietaryguidelines.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Dietary Guidelines for Americans 2020–2025</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official U.S. government dietary recommendations including carbohydrate intake ranges for different age groups and activity levels.</p>
          </li>
          <li>
            <a href="https://www.nccih.nih.gov/health/ketogenic-diet" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Institutes of Health: Ketogenic Diet Overview</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based overview of ketogenic diets, their effects on metabolism, and considerations for medical safety and effectiveness.</p>
          </li>
          <li>
            <a href="https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/sugar/added-sugars" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Heart Association: Carbohydrates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative guidance on carbohydrate quality, fiber intake, and cardiovascular health in the context of low-carb and standard diets.</p>
          </li>
          <li>
            <a href="https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/low-carb-diet/art-20045831" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Mayo Clinic: Low-Carb Diet: Can It Help You Lose Weight?</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive medical perspective on low-carbohydrate diets, their safety, effectiveness, and individual considerations for implementation.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Carb Target (incl. low-carb/keto ranges)"
      description="Set your daily carbohydrate target. Perfect for planning Low-Carb, Keto, or balanced diets to fuel your energy needs effectively."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "Carb grams per day = (TDEE × % calories from carbs) ÷ 4",
        variables: [
          { symbol: "TDEE", description: "Total Daily Energy Expenditure (calories/day)" },
          { symbol: "% calories from carbs", description: "Desired percentage of daily calories from carbohydrates" },
          { symbol: "4", description: "Calories per gram of carbohydrate" },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "John weighs 180 lbs, is 5 ft 10 in tall, moderately active, and wants to follow a ketogenic diet.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate John's TDEE: Approximate BMR = 24 × (180 lbs ÷ 2.20462) ≈ 1960 kcal; TDEE = 1960 × 1.2 (moderate activity) = 2352 kcal.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate carb range for keto (5-10% calories): Min = (2352 × 0.05) ÷ 4 ≈ 29 g; Max = (2352 × 0.10) ÷ 4 ≈ 59 g carbs/day.",
          },
        ],
        result: "John's recommended ketogenic carb intake is approximately 29 to 59 grams per day.",
      }}
      relatedCalculators={[
        { title: "BMI — Body Mass Index Calculator", url: "/health/bmi-body-mass-index", icon: "⚖️" },
        { title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)", url: "/health/bmr-mifflin-st-jeor", icon: "🔥" },
        { title: "TDEE — Total Daily Energy Expenditure Calculator", url: "/health/tdee-daily-energy-expenditure", icon: "🔥" },
        { title: "Body Fat % (US Navy / 3-sites)", url: "/health/body-fat-us-navy-3-sites", icon: "💧" },
        { title: "Ideal Weight Range (Hamwi/Devine/Miller)", url: "/health/ideal-weight-range-hamwi-devine-miller", icon: "🥗" },
        { title: "Waist-to-Height Ratio Checker", url: "/health/waist-to-height-ratio", icon: "😴" },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is Carb Target (incl. low-carb/keto ranges)?" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Trusted References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}