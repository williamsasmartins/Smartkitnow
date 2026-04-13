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
  CheckCircle2,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MealCaloriesSplitCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    totalCalories: "",
    breakfastPercent: "25",
    lunchPercent: "35",
    dinnerPercent: "30",
    snacksPercent: "10",
  });

  // Helper to parse and clamp percentages
  const parsePercent = (val: string) => {
    const n = Number(val);
    if (isNaN(n) || n < 0) return 0;
    if (n > 100) return 100;
    return n;
  };

  // 2. LOGIC
  const results = useMemo(() => {
    const totalCalories = Number(inputs.totalCalories);
    if (!totalCalories || totalCalories <= 0) {
      return { value: 0, label: "", category: "" };
    }

    // Parse and clamp percentages
    const breakfastPercent = parsePercent(inputs.breakfastPercent);
    const lunchPercent = parsePercent(inputs.lunchPercent);
    const dinnerPercent = parsePercent(inputs.dinnerPercent);
    const snacksPercent = parsePercent(inputs.snacksPercent);

    // Sum of percentages
    const totalPercent =
      breakfastPercent + lunchPercent + dinnerPercent + snacksPercent;

    // Normalize if totalPercent != 100
    const normalizeFactor = totalPercent === 0 ? 0 : 100 / totalPercent;

    const bCal = Math.round(breakfastPercent * normalizeFactor * totalCalories / 100);
    const lCal = Math.round(lunchPercent * normalizeFactor * totalCalories / 100);
    const dCal = Math.round(dinnerPercent * normalizeFactor * totalCalories / 100);
    const sCal = Math.round(snacksPercent * normalizeFactor * totalCalories / 100);

    return {
      value: totalCalories,
      label: (
        <>
          <div className="mb-2 font-semibold text-lg">Calories Distribution</div>
          <ul className="text-left text-blue-900 dark:text-white space-y-1 text-xl font-semibold">
            <li>
              Breakfast: <span className="font-extrabold">{bCal} kcal</span> (
              {Math.round(breakfastPercent * normalizeFactor)}%)
            </li>
            <li>
              Lunch: <span className="font-extrabold">{lCal} kcal</span> (
              {Math.round(lunchPercent * normalizeFactor)}%)
            </li>
            <li>
              Dinner: <span className="font-extrabold">{dCal} kcal</span> (
              {Math.round(dinnerPercent * normalizeFactor)}%)
            </li>
            <li>
              Snacks: <span className="font-extrabold">{sCal} kcal</span> (
              {Math.round(snacksPercent * normalizeFactor)}%)
            </li>
          </ul>
        </>
      ),
      category: "",
    };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the recommended calorie distribution across meals?",
      answer: "The standard recommendation is 30% for breakfast, 35% for lunch, 25% for dinner, and 10% for snacks out of your total daily calorie intake. For example, on a 2,000-calorie diet, this breaks down to 600 calories for breakfast, 700 for lunch, 500 for dinner, and 200 for snacks. However, individual needs vary based on activity level, metabolism, and personal preferences.",
    },
    {
      question: "How do I determine my total daily calorie needs?",
      answer: "Your daily calorie needs depend on factors like age, sex, weight, height, and activity level. The USDA estimates that sedentary adult women need 1,800-2,000 calories daily, while sedentary adult men need 2,200-2,600 calories. More active individuals require 300-500 additional calories per day. Using a BMR (Basal Metabolic Rate) calculator multiplied by your activity factor provides a personalized estimate.",
    },
    {
      question: "Can I adjust the meal split percentages based on my schedule?",
      answer: "Yes, absolutely. If you work evening shifts or exercise at specific times, you can customize your calorie distribution. For instance, athletes might allocate 25% to breakfast, 25% to lunch, 35% to dinner, and 15% to snacks if they train in the evening. The key is ensuring adequate fuel before intense activity and balanced nutrition throughout the day.",
    },
    {
      question: "What are typical breakfast calorie targets for different diets?",
      answer: "On a 1,500-calorie diet, breakfast should be around 400-450 calories; on a 2,000-calorie diet, 500-600 calories; and on a 2,500-calorie diet, 600-750 calories. High-protein breakfasts (25-35g protein) help maintain satiety and stabilize blood sugar. Examples include eggs with toast (350-400 calories), oatmeal with berries and nuts (350-450 calories), or yogurt parfaits (300-400 calories).",
    },
    {
      question: "How should I account for snacks in my daily calorie budget?",
      answer: "Snacks typically represent 10-15% of daily calories—approximately 150-300 calories on a 2,000-calorie diet. Smart snack options include Greek yogurt (100-150 calories), almonds (170 calories per ounce), apple with peanut butter (200 calories), or protein bars (150-200 calories). Avoid mindless snacking by pre-portioning and spacing snacks 2-3 hours apart from main meals.",
    },
    {
      question: "Why is lunch typically the largest meal?",
      answer: "Lunch (35% of daily calories, or 700 calories on a 2,000-calorie diet) is positioned as the largest meal because it fuels afternoon productivity and activity. Eating your largest meal mid-day provides sustained energy, reduces evening hunger, and aligns with circadian rhythm research showing better digestion and metabolism during daytime hours. This approach also helps prevent late-night overeating.",
    },
    {
      question: "What's the ideal calorie range for dinner to support weight management?",
      answer: "Dinner should represent 20-30% of daily calories—typically 400-600 calories on a 2,000-calorie diet. Lighter dinners consumed 2-3 hours before bedtime optimize sleep quality and weight management. Focus on lean proteins (150-200g), vegetables (2+ cups), and whole grains (½-1 cup cooked). Avoid heavy, high-fat meals that can disrupt sleep and digestion.",
    },
    {
      question: "How do I adjust meal splits for intermittent fasting?",
      answer: "With intermittent fasting, you compress calories into fewer eating windows. A 16:8 protocol (16-hour fast, 8-hour eating window) might allocate 40% to lunch, 45% to dinner, and 15% to a mid-afternoon snack. A 14:10 protocol allows more flexible distribution: 25% breakfast, 35% lunch, 30% dinner, 10% snacks. Always prioritize nutrient density over meal timing.",
    },
    {
      question: "What happens if my meal split doesn't follow the standard percentages?",
      answer: "Individual flexibility is acceptable if total daily calories and macro nutrients remain balanced. Research shows that eating patterns matter less than overall calorie intake, protein consumption (0.7-1g per pound of body weight), and food quality. Some people thrive with a 40-35-20-5 split, while others prefer 30-30-30-10; the best approach is one you can sustain long-term.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (US/Canada)</SelectItem>
              <SelectItem value="metric">Metric (International)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Total Calories Input */}
        <div>
          <Label htmlFor="totalCalories" className="text-slate-700 dark:text-slate-300">
            Total Daily Calories Intake (kcal)
          </Label>
          <Input
            id="totalCalories"
            type="number"
            min={0}
            placeholder="e.g., 2000"
            value={inputs.totalCalories}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, totalCalories: e.target.value }))
            }
            className="mt-1"
          />
        </div>

        {/* Percentage Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="breakfastPercent" className="text-slate-700 dark:text-slate-300">
              Breakfast (%)
            </Label>
            <Input
              id="breakfastPercent"
              type="number"
              min={0}
              max={100}
              value={inputs.breakfastPercent}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, breakfastPercent: e.target.value }))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lunchPercent" className="text-slate-700 dark:text-slate-300">
              Lunch (%)
            </Label>
            <Input
              id="lunchPercent"
              type="number"
              min={0}
              max={100}
              value={inputs.lunchPercent}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, lunchPercent: e.target.value }))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="dinnerPercent" className="text-slate-700 dark:text-slate-300">
              Dinner (%)
            </Label>
            <Input
              id="dinnerPercent"
              type="number"
              min={0}
              max={100}
              value={inputs.dinnerPercent}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, dinnerPercent: e.target.value }))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="snacksPercent" className="text-slate-700 dark:text-slate-300">
              Snacks (%)
            </Label>
            <Input
              id="snacksPercent"
              type="number"
              min={0}
              max={100}
              value={inputs.snacksPercent}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, snacksPercent: e.target.value }))
              }
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              totalCalories: "",
              breakfastPercent: "25",
              lunchPercent: "35",
              dinnerPercent: "30",
              snacksPercent: "10",
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value} kcal/day
              </p>
              <div className="mt-6">{results.label}</div>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Meal Calories Split (breakfast/lunch/dinner/snacks)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Meal Calories Split calculator helps you distribute your daily calorie intake across four meal categories to optimize nutrition, energy levels, and weight management goals. Understanding how to properly split calories throughout the day is essential for maintaining consistent energy, preventing overeating, and supporting metabolic health. This tool takes the guesswork out of meal planning by showing exactly how many calories to allocate to each meal based on your total daily needs.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, begin by determining your total daily calorie target based on your age, sex, weight, height, and activity level. Input this number into the calculator along with your preferred meal distribution percentages (standard recommendations are 30% breakfast, 35% lunch, 25% dinner, and 10% snacks). You can customize these percentages if your schedule, activity timing, or personal preferences require a different split.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator will display precise calorie targets for each meal category, making it simple to plan and track your intake. Use these numbers as guidelines when selecting foods and portion sizes throughout your day. Monitor your energy levels, hunger cues, and progress toward your health goals, then adjust the splits slightly if needed—remember that consistency and sustainability matter more than perfect adherence to standard percentages.</p>
        </div>
      </section>

      {/* TABLE: Daily Calorie Distribution by Diet Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calorie Distribution by Diet Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows recommended calorie splits across meals for popular daily calorie targets.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Daily Calories</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Breakfast (30%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lunch (35%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dinner (25%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Snacks (10%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">360</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">420</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">525</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">375</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">540</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">630</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">660</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">770</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">550</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">220</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">875</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">625</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,050</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages are approximate; individual needs vary based on activity level, age, and metabolism.</p>
      </section>

      {/* TABLE: Common Meal Calorie Ranges by Category */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Meal Calorie Ranges by Category</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference guide for typical calorie content of popular breakfast, lunch, dinner, and snack options.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Meal Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example Foods</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Low-Calorie Option</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Medium-Calorie Option</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High-Calorie Option</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Breakfast</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Eggs, Toast, Oatmeal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-300 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-500 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600-750 cal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lunch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sandwich, Salad, Bowl</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-500 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600-700 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800-900 cal</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dinner</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Protein + Sides</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350-450 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500-600 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">700-850 cal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Snacks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fruit, Nuts, Dairy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-250 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-350 cal</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calorie ranges assume standard serving sizes; actual values depend on portion size and preparation method.</p>
      </section>

      {/* TABLE: Macronutrient Targets by Meal */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Macronutrient Targets by Meal</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended protein, carbohydrate, and fat distribution across daily meals.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Meal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Protein (g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Carbohydrates (g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fat (g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fiber (g)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Breakfast (2,000 cal diet)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lunch (2,000 cal diet)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dinner (2,000 cal diet)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-10</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Snacks (2,000 cal diet)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Targets assume a balanced diet of 30% protein, 40% carbohydrates, 30% fat; adjust based on personal dietary goals.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Eat your largest meal at lunch when digestion is most efficient and energy demand is highest—allocating 35% of daily calories to this meal fuels afternoon productivity and reduces evening hunger.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Plan snacks in advance by pre-portioning them into 150-200 calorie portions to prevent mindless eating and stay within your 10% snack calorie budget; examples include measured almonds, Greek yogurt cups, or protein bars.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consume protein with every meal to enhance satiety and stabilize blood sugar; aim for 20-35g per meal and 5-10g per snack to maximize the thermic effect of food and support lean muscle maintenance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Schedule meals 4-5 hours apart to optimize digestion and maintain stable energy levels; this spacing naturally supports the recommended calorie distribution by preventing excessive hunger between main meals.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Adjust your split based on workout timing—increase pre-workout meal calories by 10-15% if training mid-afternoon, and post-workout meals by similar amounts to support recovery and replenish glycogen stores.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping Breakfast and Over-Eating Later</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Skipping breakfast (which should be 30% of calories, ~600 on a 2,000-calorie diet) leads to excessive hunger at lunch and dinner, causing overeating and poor food choices. Research shows breakfast eaters consume 300-400 fewer calories daily and make healthier snack selections.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Making Dinner Your Largest Meal</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Consuming 40-50% of daily calories at dinner disrupts sleep quality, impairs digestion, and increases fat storage risk since metabolic rate drops in evening hours. Dinner should represent only 20-25% of calories, eaten 2-3 hours before bedtime.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Liquid Calories in Snacks</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Beverages like sugary coffee drinks (300-400 calories), smoothies (400-600 calories), and juices (150-200 calories) are easily overlooked but quickly consume your 200-calorie snack allowance without providing satiety. Account for all beverages in your daily calorie total.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Inaccurate Daily Calorie Estimates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using generic calorie recommendations without accounting for personal factors (age, metabolism, exercise intensity) leads to miscalculations across all meals. Take time to calculate your specific BMR and activity multiplier for accurate meal splits.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the recommended calorie distribution across meals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The standard recommendation is 30% for breakfast, 35% for lunch, 25% for dinner, and 10% for snacks out of your total daily calorie intake. For example, on a 2,000-calorie diet, this breaks down to 600 calories for breakfast, 700 for lunch, 500 for dinner, and 200 for snacks. However, individual needs vary based on activity level, metabolism, and personal preferences.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I determine my total daily calorie needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your daily calorie needs depend on factors like age, sex, weight, height, and activity level. The USDA estimates that sedentary adult women need 1,800-2,000 calories daily, while sedentary adult men need 2,200-2,600 calories. More active individuals require 300-500 additional calories per day. Using a BMR (Basal Metabolic Rate) calculator multiplied by your activity factor provides a personalized estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I adjust the meal split percentages based on my schedule?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, absolutely. If you work evening shifts or exercise at specific times, you can customize your calorie distribution. For instance, athletes might allocate 25% to breakfast, 25% to lunch, 35% to dinner, and 15% to snacks if they train in the evening. The key is ensuring adequate fuel before intense activity and balanced nutrition throughout the day.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are typical breakfast calorie targets for different diets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">On a 1,500-calorie diet, breakfast should be around 400-450 calories; on a 2,000-calorie diet, 500-600 calories; and on a 2,500-calorie diet, 600-750 calories. High-protein breakfasts (25-35g protein) help maintain satiety and stabilize blood sugar. Examples include eggs with toast (350-400 calories), oatmeal with berries and nuts (350-450 calories), or yogurt parfaits (300-400 calories).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I account for snacks in my daily calorie budget?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Snacks typically represent 10-15% of daily calories—approximately 150-300 calories on a 2,000-calorie diet. Smart snack options include Greek yogurt (100-150 calories), almonds (170 calories per ounce), apple with peanut butter (200 calories), or protein bars (150-200 calories). Avoid mindless snacking by pre-portioning and spacing snacks 2-3 hours apart from main meals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is lunch typically the largest meal?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Lunch (35% of daily calories, or 700 calories on a 2,000-calorie diet) is positioned as the largest meal because it fuels afternoon productivity and activity. Eating your largest meal mid-day provides sustained energy, reduces evening hunger, and aligns with circadian rhythm research showing better digestion and metabolism during daytime hours. This approach also helps prevent late-night overeating.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the ideal calorie range for dinner to support weight management?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dinner should represent 20-30% of daily calories—typically 400-600 calories on a 2,000-calorie diet. Lighter dinners consumed 2-3 hours before bedtime optimize sleep quality and weight management. Focus on lean proteins (150-200g), vegetables (2+ cups), and whole grains (½-1 cup cooked). Avoid heavy, high-fat meals that can disrupt sleep and digestion.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I adjust meal splits for intermittent fasting?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">With intermittent fasting, you compress calories into fewer eating windows. A 16:8 protocol (16-hour fast, 8-hour eating window) might allocate 40% to lunch, 45% to dinner, and 15% to a mid-afternoon snack. A 14:10 protocol allows more flexible distribution: 25% breakfast, 35% lunch, 30% dinner, 10% snacks. Always prioritize nutrient density over meal timing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my meal split doesn't follow the standard percentages?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Individual flexibility is acceptable if total daily calories and macro nutrients remain balanced. Research shows that eating patterns matter less than overall calorie intake, protein consumption (0.7-1g per pound of body weight), and food quality. Some people thrive with a 40-35-20-5 split, while others prefer 30-30-30-10; the best approach is one you can sustain long-term.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.dietaryguidelines.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Dietary Guidelines for Americans 2020-2025</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official USDA and HHS guidance on daily calorie recommendations and meal composition for maintaining health.</p>
          </li>
          <li>
            <a href="https://www.nhlbi.nih.gov/health/educational/lose_wt/index.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Heart, Lung, and Blood Institute Portion Size Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based information on portion control and calorie distribution across meals for weight management.</p>
          </li>
          <li>
            <a href="https://www.eatright.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Academy of Nutrition and Dietetics: Meal Timing and Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional dietetics organization resources on optimizing calorie timing and meal frequency for metabolic health.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pubmed" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NIH National Center for Biotechnology Information: Breakfast and Metabolic Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on how breakfast timing and calorie allocation affect daily energy expenditure and appetite regulation.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Meal Calories Split (breakfast/lunch/dinner/snacks)"
      description="Split your daily calories across meals efficiently. Plan balanced portions for breakfast, lunch, dinner, and snacks to control hunger."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "Meal Calories = (Meal Percentage / Total Percentage) × Total Daily Calories",
        variables: [
          {
            symbol: "Meal Calories",
            description:
              "Calories allocated to a specific meal (breakfast, lunch, dinner, or snacks)",
          },
          {
            symbol: "Meal Percentage",
            description:
              "User-defined percentage of total calories for the meal",
          },
          {
            symbol: "Total Percentage",
            description:
              "Sum of all meal percentages input by the user (normalized to 100%)",
          },
          {
            symbol: "Total Daily Calories",
            description: "Total calories consumed in a day",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A person consumes 2,000 kcal daily and wants to split calories as 25% breakfast, 35% lunch, 30% dinner, and 10% snacks.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input total daily calories as 2000 kcal and set meal percentages accordingly.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculator normalizes percentages (they sum to 100%) and calculates calories per meal.",
          },
        ],
        result:
          "Breakfast: 500 kcal, Lunch: 700 kcal, Dinner: 600 kcal, Snacks: 200 kcal.",
      }}
      relatedCalculators={[
        {
          title: "BMI — Body Mass Index Calculator",
          url: "/health/bmi-body-mass-index",
          icon: "⚖️",
        },
        {
          title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)",
          url: "/health/bmr-mifflin-st-jeor",
          icon: "🔥",
        },
        {
          title: "TDEE — Total Daily Energy Expenditure Calculator",
          url: "/health/tdee-daily-energy-expenditure",
          icon: "🔥",
        },
        {
          title: "Body Fat % (US Navy / 3-sites)",
          url: "/health/body-fat-us-navy-3-sites",
          icon: "💧",
        },
        {
          title: "Ideal Weight Range (Hamwi/Devine/Miller)",
          url: "/health/ideal-weight-range-hamwi-devine-miller",
          icon: "🥗",
        },
        {
          title: "Waist-to-Height Ratio Checker",
          url: "/health/waist-to-height-ratio",
          icon: "😴",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "What is Meal Calories Split (breakfast/lunch/dinner/snacks)?",
        },
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