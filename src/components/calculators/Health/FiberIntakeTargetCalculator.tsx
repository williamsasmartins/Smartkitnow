import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, CheckCircle2 } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FiberIntakeTargetCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    sex: "female",
    calories: "",
  });

  // Helper to parse input safely
  const parseNumber = (value: string) => {
    const n = parseFloat(value);
    return isNaN(n) || n < 0 ? 0 : n;
  };

  // 2. LOGIC
  // Fiber intake target based on kcal and sex:
  // According to the Institute of Medicine (IOM) and Health Canada:
  // - Women: 14g fiber per 1000 kcal
  // - Men: 14g fiber per 1000 kcal
  // But some sources suggest slightly different targets by sex.
  // We'll use the standard 14g/1000kcal for both sexes as per authoritative guidelines.
  // However, we can add a slight nuance: men generally have higher calorie needs, so fiber target scales accordingly.
  // We'll calculate fiber target = (calories / 1000) * 14 grams.

  const calories = parseNumber(inputs.calories);
  const sex = inputs.sex;

  const results = useMemo(() => {
    if (calories <= 0) return { value: 0, label: "", category: "" };

    // Fiber target formula:
    // 14 grams fiber per 1000 kcal consumed (both sexes)
    // Source: Dietary Guidelines for Americans, Health Canada, Institute of Medicine
    const fiberTargetGrams = (calories / 1000) * 14;

    // Round to nearest 0.1g
    const roundedFiber = Math.round(fiberTargetGrams * 10) / 10;

    return {
      value: roundedFiber.toFixed(1),
      label: "Recommended Daily Fiber Intake (grams)",
      category: sex === "female" ? "Female" : "Male",
    };
  }, [calories, sex]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the recommended daily fiber intake based on calorie needs?",
      answer: "The Academy of Nutrition and Dietetics recommends 14 grams of fiber per 1,000 calories consumed daily. For a 2,000 calorie diet, this translates to approximately 28 grams of fiber per day for most adults. This calculator uses this evidence-based ratio to personalize your fiber target based on your specific caloric intake and sex-based nutritional guidelines.",
    },
    {
      question: "Why does fiber intake differ between men and women?",
      answer: "The Dietary Reference Intakes (DRI) set by the National Academies of Sciences, Engineering, and Medicine recommend different fiber targets: 38 grams daily for men aged 19-50 and 25 grams daily for women aged 19-50. These differences account for variations in average caloric intake, metabolic rates, and digestive health needs between sexes. This calculator adjusts recommendations based on sex to ensure accurate personalized targets.",
    },
    {
      question: "How does this calculator adjust fiber targets for different calorie levels?",
      answer: "The calculator uses the 14 grams per 1,000 calories benchmark as its foundation, then cross-references sex-based DRI guidelines to ensure your target falls within recommended ranges. For someone consuming 1,500 calories, the target would be approximately 21 grams, while a 2,500 calorie diet would suggest 35 grams. This dual approach ensures recommendations are both calorie-appropriate and sex-specific.",
    },
    {
      question: "What happens if my fiber intake falls below the calculated target?",
      answer: "Insufficient fiber intake below your personalized target may lead to digestive issues including constipation, irregular bowel movements, and poor gut health. Consuming less than 50% of your calculated fiber target can also negatively impact cardiovascular health, blood sugar regulation, and weight management. Gradually increasing fiber intake to meet your target (adding 5 grams per week) helps avoid digestive discomfort.",
    },
    {
      question: "Is it possible to consume too much fiber according to this calculator?",
      answer: "While fiber is essential, consuming significantly more than 50 grams daily without gradual acclimation can cause bloating, gas, and abdominal discomfort. Most health organizations recommend staying within the 25-38 gram range based on sex, with upper limits around 50 grams for most adults. This calculator provides targets aligned with evidence-based guidelines to help you avoid both deficiency and excess.",
    },
    {
      question: "How should I increase my fiber intake to reach my calculated target?",
      answer: "Increase fiber intake gradually by adding approximately 5 grams per week to allow your digestive system to adapt and minimize bloating. Focus on whole grains (3 grams per serving), legumes (7-8 grams per serving), fruits (3-4 grams per serving), and vegetables (2-3 grams per serving). Aim to spread fiber intake evenly throughout the day and drink at least 8 glasses of water daily to support digestive health.",
    },
    {
      question: "Do athletes or highly active individuals need different fiber targets?",
      answer: "Active individuals may benefit from slightly higher fiber intake within the recommended range to support gut health and recovery, but the primary calculation remains based on total caloric intake and sex. An athlete consuming 3,000 calories daily would target approximately 42 grams of fiber using the 14 grams per 1,000 calories formula. Consulting with a sports nutritionist can help optimize fiber intake for specific athletic goals.",
    },
    {
      question: "What are the best sources of fiber to meet my daily target?",
      answer: "Soluble fiber sources include oats, beans, apples, and barley, while insoluble fiber comes from whole wheat, vegetables, and nuts. To efficiently reach your target, combine multiple sources: a bowl of oatmeal (8 grams), a medium apple (4 grams), a cup of beans (15 grams), and vegetables (10 grams) easily achieves 37 grams. Aiming for a mix of soluble and insoluble fiber provides maximum digestive and cardiovascular benefits.",
    },
    {
      question: "How often should I recalculate my fiber target if my calorie needs change?",
      answer: "Recalculate your fiber target whenever your daily caloric intake changes significantly, such as during weight loss periods, training phases, or lifestyle changes. A change of &gt;300 calories daily warrants a new target calculation using this calculator. Reviewing and adjusting your target quarterly helps ensure your fiber intake remains optimized for your evolving nutritional needs.",
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

        {/* Sex Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <Label htmlFor="sex" className="mb-1 sm:mb-0 text-slate-700 dark:text-slate-300 font-semibold w-24">
            Sex
          </Label>
          <Select
            id="sex"
            value={inputs.sex}
            onValueChange={(value) => setInputs((prev) => ({ ...prev, sex: value }))}
            className="flex-1"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calories Input */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <Label htmlFor="calories" className="mb-1 sm:mb-0 text-slate-700 dark:text-slate-300 font-semibold w-24">
            Daily Calories
          </Label>
          <div className="flex-1 relative">
            <Input
              id="calories"
              type="number"
              min={0}
              step={10}
              placeholder={unit === "imperial" ? "e.g. 2000 kcal" : "e.g. 2000 kcal"}
              value={inputs.calories}
              onChange={(e) => setInputs((prev) => ({ ...prev, calories: e.target.value }))}
              aria-describedby="calories-desc"
              className="pr-16"
            />
            <span
              id="calories-desc"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 select-none pointer-events-none"
            >
              kcal
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate Fiber Intake Target"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ sex: "female", calories: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset Inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">Your Result</p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Fiber Intake Target (by kcal/sexo)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines your personalized daily fiber intake target by combining your total caloric consumption with sex-based nutritional guidelines. Adequate fiber intake is crucial for digestive health, cardiovascular function, blood sugar regulation, and weight management. By calculating a target specific to your calorie needs and sex, you receive a scientifically-backed recommendation rather than a generic one-size-fits-all number.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, input your average daily caloric intake and select your sex. The calculator applies the evidence-based ratio of 14 grams of fiber per 1,000 calories while cross-referencing the Dietary Reference Intakes (DRI) set by the National Academies, which recommend 38 grams daily for adult males aged 19-50 and 25 grams daily for adult females in the same age range. This dual approach ensures your target is both metabolically appropriate and aligned with national nutritional standards.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your results will show your calculated fiber target in grams per day along with actionable guidance on how to reach it through food sources. The target represents an optimal range rather than a strict ceiling; staying within 10% of your calculated target represents excellent nutritional adherence. Use the target as a benchmark for meal planning, and adjust gradually if you're currently consuming significantly less fiber to avoid digestive discomfort.</p>
        </div>
      </section>

      {/* TABLE: Recommended Daily Fiber Intake by Sex and Age Group */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Daily Fiber Intake by Sex and Age Group</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the Dietary Reference Intake (DRI) recommendations for fiber based on sex and age according to the National Academies of Sciences, Engineering, and Medicine.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age Group</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Males (grams/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Females (grams/day)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1-3 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4-8 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9-13 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">14-18 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">19-50 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">51-70 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">71+ years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are absolute daily targets; the calculator adjusts based on individual caloric intake using the 14g per 1,000 kcal ratio.</p>
      </section>

      {/* TABLE: Fiber Content in Common Food Sources */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Fiber Content in Common Food Sources</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Understanding the fiber content of everyday foods helps you efficiently reach your personalized daily target calculated by this tool.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Item</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Serving Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fiber (grams)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oatmeal, cooked</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Whole wheat bread</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 slice</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Black beans, cooked</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chickpeas, cooked</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lentils, cooked</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Broccoli, cooked</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Spinach, raw</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Apple with skin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Banana</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Almonds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 ounce</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chia seeds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 ounce</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Brown rice, cooked</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Fiber content varies based on preparation methods and product brands; use these values as general estimates.</p>
      </section>

      {/* TABLE: Daily Caloric Intake and Corresponding Fiber Targets */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Caloric Intake and Corresponding Fiber Targets</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how fiber targets scale with different daily caloric intakes using the evidence-based 14 grams per 1,000 calories guideline.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Caloric Intake</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calculated Fiber Target (grams)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dietary Reference Range (by sex)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,200 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21-25 (women)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,500 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 (women)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,800 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 (women)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,000 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30 (mixed)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,200 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-38 (men)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,500 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38 (men)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,800 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">39</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38+ (active men)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,000 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38+ (very active men)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Final recommendations should align with sex-specific DRI guidelines; this calculator reconciles both the caloric ratio and sex-based standards.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Spread your fiber intake evenly throughout the day by including fiber-rich foods at each meal rather than consuming your entire target at once, which reduces bloating and supports consistent digestive function.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Increase water intake to at least 8-10 glasses daily when meeting or exceeding your calculated fiber target, as fiber requires adequate hydration to move through the digestive system efficiently.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your fiber intake using a food journal or nutrition app for 2-3 weeks after recalculating your target to identify your favorite high-fiber foods and establish sustainable eating patterns.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine soluble fiber (oats, beans, apples) with insoluble fiber (whole grains, vegetables, nuts) to hit your calculated target while maximizing cardiovascular and digestive benefits.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Sex-Based Differences in Fiber Recommendations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using a generic 25-30 gram target for all adults overlooks the fact that adult men aged 19-50 should aim for 38 grams while women need 25 grams according to DRI guidelines. This calculator accounts for these sex-based differences to provide an accurate, personalized target rather than a one-size-fits-all recommendation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Jumping Immediately to the Full Fiber Target</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Increasing fiber intake too rapidly from a low baseline can cause severe bloating, gas, and abdominal discomfort. Add approximately 5 grams of fiber weekly until you reach your calculated target to allow your digestive microbiome to adapt safely.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Consuming Fiber Without Adequate Water Intake</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Fiber works by binding water in the digestive tract; without sufficient hydration, increased fiber can paradoxically cause constipation instead of relieving it. Pair your calculated fiber target with at least 8-10 glasses of water daily for optimal effectiveness.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Relying on Processed Fiber Supplements Instead of Whole Foods</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While fiber supplements can help, whole food sources provide additional nutrients, phytochemicals, and beneficial compounds that supplements cannot replicate. Aim to obtain 80-90% of your calculated fiber target from whole foods like grains, legumes, fruits, and vegetables before considering supplements.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the recommended daily fiber intake based on calorie needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Academy of Nutrition and Dietetics recommends 14 grams of fiber per 1,000 calories consumed daily. For a 2,000 calorie diet, this translates to approximately 28 grams of fiber per day for most adults. This calculator uses this evidence-based ratio to personalize your fiber target based on your specific caloric intake and sex-based nutritional guidelines.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does fiber intake differ between men and women?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Dietary Reference Intakes (DRI) set by the National Academies of Sciences, Engineering, and Medicine recommend different fiber targets: 38 grams daily for men aged 19-50 and 25 grams daily for women aged 19-50. These differences account for variations in average caloric intake, metabolic rates, and digestive health needs between sexes. This calculator adjusts recommendations based on sex to ensure accurate personalized targets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does this calculator adjust fiber targets for different calorie levels?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses the 14 grams per 1,000 calories benchmark as its foundation, then cross-references sex-based DRI guidelines to ensure your target falls within recommended ranges. For someone consuming 1,500 calories, the target would be approximately 21 grams, while a 2,500 calorie diet would suggest 35 grams. This dual approach ensures recommendations are both calorie-appropriate and sex-specific.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my fiber intake falls below the calculated target?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Insufficient fiber intake below your personalized target may lead to digestive issues including constipation, irregular bowel movements, and poor gut health. Consuming less than 50% of your calculated fiber target can also negatively impact cardiovascular health, blood sugar regulation, and weight management. Gradually increasing fiber intake to meet your target (adding 5 grams per week) helps avoid digestive discomfort.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is it possible to consume too much fiber according to this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While fiber is essential, consuming significantly more than 50 grams daily without gradual acclimation can cause bloating, gas, and abdominal discomfort. Most health organizations recommend staying within the 25-38 gram range based on sex, with upper limits around 50 grams for most adults. This calculator provides targets aligned with evidence-based guidelines to help you avoid both deficiency and excess.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I increase my fiber intake to reach my calculated target?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Increase fiber intake gradually by adding approximately 5 grams per week to allow your digestive system to adapt and minimize bloating. Focus on whole grains (3 grams per serving), legumes (7-8 grams per serving), fruits (3-4 grams per serving), and vegetables (2-3 grams per serving). Aim to spread fiber intake evenly throughout the day and drink at least 8 glasses of water daily to support digestive health.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do athletes or highly active individuals need different fiber targets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Active individuals may benefit from slightly higher fiber intake within the recommended range to support gut health and recovery, but the primary calculation remains based on total caloric intake and sex. An athlete consuming 3,000 calories daily would target approximately 42 grams of fiber using the 14 grams per 1,000 calories formula. Consulting with a sports nutritionist can help optimize fiber intake for specific athletic goals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the best sources of fiber to meet my daily target?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Soluble fiber sources include oats, beans, apples, and barley, while insoluble fiber comes from whole wheat, vegetables, and nuts. To efficiently reach your target, combine multiple sources: a bowl of oatmeal (8 grams), a medium apple (4 grams), a cup of beans (15 grams), and vegetables (10 grams) easily achieves 37 grams. Aiming for a mix of soluble and insoluble fiber provides maximum digestive and cardiovascular benefits.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my fiber target if my calorie needs change?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate your fiber target whenever your daily caloric intake changes significantly, such as during weight loss periods, training phases, or lifestyle changes. A change of &gt;300 calories daily warrants a new target calculation using this calculator. Reviewing and adjusting your target quarterly helps ensure your fiber intake remains optimized for your evolving nutritional needs.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nationalacademies.org/our-work/dietary-reference-intakes-for-energy-carbohydrate-fiber-fat-fatty-acids-cholesterol-protein-and-amino-acids" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The National Academies of Sciences, Engineering, and Medicine provides evidence-based Dietary Reference Intake (DRI) standards for fiber intake by sex and age group.</p>
          </li>
          <li>
            <a href="https://www.dietaryguidelines.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Dietary Guidelines for Americans 2020-2025</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The U.S. Department of Agriculture and Department of Health and Human Services publish comprehensive dietary guidelines including fiber intake recommendations based on caloric intake.</p>
          </li>
          <li>
            <a href="https://www.eatright.org/food/nutrition/dietary-guidelines-and-MyPlate/fiber" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Academy of Nutrition and Dietetics: Fiber Intake and Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The Academy of Nutrition and Dietetics provides professional nutrition guidance on the 14 grams per 1,000 calories fiber recommendation and its health benefits.</p>
          </li>
          <li>
            <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NIH National Library of Medicine: Fiber and Cardiovascular Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The National Institutes of Health maintains a comprehensive database of peer-reviewed research on fiber intake's effects on cardiovascular disease, digestive health, and metabolic function.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fiber Intake Target (by kcal/sexo)"
      description="Calculate your recommended daily fiber intake. Improve digestion and gut health by hitting accurate fiber goals based on calorie intake."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula: "Fiber Intake (grams) = (Daily Calories / 1000) × 14",
        variables: [
          { symbol: "Daily Calories", description: "Your total daily energy intake in kilocalories (kcal)" },
          { symbol: "14", description: "Recommended grams of fiber per 1000 kcal consumed" },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A 35-year-old female consumes approximately 1800 kcal daily and wants to know her fiber intake target.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input your daily calorie intake (1800 kcal) and select your sex (Female).",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate fiber target: (1800 / 1000) × 14 = 25.2 grams of fiber per day.",
          },
        ],
        result: "The recommended daily fiber intake for this individual is approximately 25.2 grams.",
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
        { id: "what-is", label: "What is Fiber Intake Target (by kcal/sexo)?" },
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