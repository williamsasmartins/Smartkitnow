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
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";

export default function BmrMifflinStJeorCalculator() {
  // 1. STATE (Imperial Default)
  const { unit: preferredWeightUnit, setUnit: setPreferredWeightUnit } = useWeightUnitPreference();
  const [unit, setUnit] = useState<"imperial" | "metric">(() => (preferredWeightUnit === "lb" ? "imperial" : "metric"));
  const [inputs, setInputs] = useState<{
    weight?: number;
    heightFeet?: number;
    heightInches?: number;
    heightCm?: number;
    age?: number;
    sex?: "male" | "female";
  }>({
    weight: undefined,
    heightFeet: undefined,
    heightInches: undefined,
    heightCm: undefined,
    age: undefined,
    sex: undefined,
  });

  // 2. LOGIC
  const results = useMemo(() => {
    const { weight, heightFeet, heightInches, heightCm, age, sex } = inputs;

    if (
      !weight ||
      !age ||
      !sex ||
      (unit === "imperial" &&
        (heightFeet === undefined || heightFeet < 0 || heightInches === undefined || heightInches < 0)) ||
      (unit === "metric" && (!heightCm || heightCm <= 0))
    ) {
      return { value: 0, label: "", category: "" };
    }

    // Convert inputs to metric for formula:
    // Weight in kg, height in cm
    let weightKg: number;
    let heightCmFinal: number;

    if (unit === "imperial") {
      weightKg = weight * 0.45359237;
      heightCmFinal = (heightFeet * 12 + heightInches) * 2.54;
    } else {
      weightKg = weight;
      heightCmFinal = heightCm!;
    }

    // Mifflin-St Jeor Equation:
    // For men: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age + 5
    // For women: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age - 161
    let bmr = 10 * weightKg + 6.25 * heightCmFinal - 5 * age;
    if (sex === "male") {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    // Round to nearest whole number
    const roundedBmr = Math.round(bmr);

    return {
      value: roundedBmr,
      label: "Calories/day",
      category: "Basal Metabolic Rate",
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the Mifflin-St Jeor equation and why is it more accurate than Harris-Benedict?",
      answer: "The Mifflin-St Jeor equation is a modern BMR calculation method developed in 1990 that accounts for body composition changes and is more accurate for contemporary populations. It produces results approximately 5% lower than the older Harris-Benedict formula because it was calibrated on a more diverse population sample. Most nutritionists and fitness professionals prefer it because it provides more reliable estimates for weight management and caloric intake planning.",
    },
    {
      question: "How much does age affect BMR calculations using Mifflin-St Jeor?",
      answer: "Age is a significant factor in the Mifflin-St Jeor equation, with BMR decreasing approximately 2-8% per decade after age 20 due to muscle loss and metabolic slowdown. A 25-year-old male at 180 lbs might have a BMR of 1,800 calories, while a 65-year-old male with identical weight and height could have a BMR around 1,500 calories. This age-related decline is why older adults often need fewer calories to maintain weight.",
    },
    {
      question: "What's the difference between BMR and TDEE, and how does this calculator help?",
      answer: "BMR (Basal Metabolic Rate) is the calories your body burns at complete rest, while TDEE (Total Daily Energy Expenditure) includes activity level and is typically 1.2 to 1.9 times your BMR. This calculator provides your BMR as a foundation; you then multiply by an activity factor (sedentary = 1.2, lightly active = 1.375, moderately active = 1.55) to determine total daily calorie needs. Understanding your BMR is essential for creating accurate nutrition plans and weight loss targets.",
    },
    {
      question: "Why does the Mifflin-St Jeor calculator show different results for men and women at the same measurements?",
      answer: "The Mifflin-St Jeor equation uses different coefficients for males and females because women typically have less muscle mass and higher body fat percentages at the same weight and height. For example, a 5'8\" person weighing 160 lbs might show a BMR of 1,650 calories for men but 1,420 calories for women. This accounts for biological differences in metabolism, though individual variation still exists based on genetics and muscle composition.",
    },
    {
      question: "How accurate is the Mifflin-St Jeor equation for people with obesity or very low body fat?",
      answer: "The Mifflin-St Jeor equation has a standard error of approximately ±10-20% and is most accurate for people with BMI between 18.5 and 30. For individuals with obesity (BMI &gt; 30) or very low body fat (&lt;10%), the equation may be less precise because it relies on height and weight without accounting for actual body composition. In these cases, indirect calorimetry or DEXA scans provide more accurate measurements, though Mifflin-St Jeor remains a reasonable estimate for general population use.",
    },
    {
      question: "What input measurements do I need to use this BMR calculator?",
      answer: "The Mifflin-St Jeor calculator requires four inputs: your sex (male or female), age in years, height (in feet/inches or centimeters), and weight (in pounds or kilograms). Ensure measurements are as accurate as possible, as small variations—especially in height and weight—can shift BMR results by 50-100 calories. For best results, weigh yourself in the morning and measure height without shoes.",
    },
    {
      question: "How does muscle mass affect BMR even if weight stays the same?",
      answer: "The Mifflin-St Jeor equation does not directly measure muscle mass, but BMR increases approximately 6 calories per pound of muscle tissue, while fat tissue burns only 2-3 calories per pound. Two people weighing 180 lbs with different muscle compositions may have BMR differences of 100-150 calories depending on their body fat percentage. This is why strength training increases BMR—building muscle tissue directly increases resting metabolic rate.",
    },
    {
      question: "Is the Mifflin-St Jeor equation reliable for athletes and highly active individuals?",
      answer: "The Mifflin-St Jeor equation tends to underestimate BMR for athletes with very high muscle mass because it relies only on height, weight, age, and sex. A muscular 180 lb athlete might have an actual BMR 10-15% higher than the calculated result, since the equation doesn't account for lean muscle tissue. Athletes should consider using the equation as a baseline and adjusting upward based on activity response and body composition assessments.",
    },
    {
      question: "How often should I recalculate my BMR if my weight or age changes?",
      answer: "You should recalculate BMR whenever your weight changes by 5% or more, whenever you reach a new year of age, or if your body composition shifts significantly due to training or diet changes. A person losing 10 pounds may see their BMR decrease by 20-30 calories, while gaining 10 pounds of muscle could increase it by 60 calories. Recalculating every 3-6 months during intentional body composition changes helps keep calorie targets accurate.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(val) => {
              if (val !== "imperial" && val !== "metric") return;
              setInputs((prev) => {
                if (val === unit) return prev;
                if (val === "metric") {
                  const weightKg = prev.weight !== undefined ? prev.weight * 0.45359237 : undefined;
                  const heightIn =
                    prev.heightFeet !== undefined && prev.heightInches !== undefined
                      ? prev.heightFeet * 12 + prev.heightInches
                      : undefined;
                  const heightCm = heightIn !== undefined ? heightIn * 2.54 : prev.heightCm;
                  return {
                    ...prev,
                    weight: weightKg,
                    heightCm,
                    heightFeet: undefined,
                    heightInches: undefined,
                  };
                }

                const weightLb = prev.weight !== undefined ? prev.weight / 0.45359237 : undefined;
                const inchesTotal = prev.heightCm !== undefined ? prev.heightCm / 2.54 : undefined;
                if (inchesTotal === undefined) {
                  return {
                    ...prev,
                    weight: weightLb,
                    heightCm: undefined,
                  };
                }
                let feet = Math.floor(inchesTotal / 12);
                let inches = Math.round(inchesTotal - feet * 12);
                if (inches === 12) {
                  feet += 1;
                  inches = 0;
                }
                return {
                  ...prev,
                  weight: weightLb,
                  heightFeet: feet,
                  heightInches: inches,
                  heightCm: undefined,
                };
              });
              setUnit(val);
              setPreferredWeightUnit(val === "imperial" ? "lb" : "kg");
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
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
            value={inputs.weight ?? ""}
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                weight: e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your body weight in {unit === "imperial" ? "pounds (lbs)" : "kilograms (kg)"}
          </p>
        </div>

        {/* Height Inputs */}
        {unit === "imperial" ? (
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="heightFeet" className="text-slate-700 dark:text-slate-300">
                Height (feet)
              </Label>
              <Input
                id="heightFeet"
                type="number"
                min={0}
                step={1}
                placeholder="e.g. 5"
                value={inputs.heightFeet ?? ""}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    heightFeet: e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
                aria-describedby="height-desc"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="heightInches" className="text-slate-700 dark:text-slate-300">
                Height (inches)
              </Label>
              <Input
                id="heightInches"
                type="number"
                min={0}
                max={11}
                step={1}
                placeholder="e.g. 8"
                value={inputs.heightInches ?? ""}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    heightInches: e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
                aria-describedby="height-desc"
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
              value={inputs.heightCm ?? ""}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  heightCm: e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
              aria-describedby="height-desc"
            />
          </div>
        )}
        <p id="height-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter your height in {unit === "imperial" ? "feet and inches" : "centimeters"}
        </p>

        {/* Age Input */}
        <div>
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Age (years)
          </Label>
          <Input
            id="age"
            type="number"
            min={0}
            step={1}
            placeholder="e.g. 30"
            value={inputs.age ?? ""}
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                age: e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            aria-describedby="age-desc"
          />
          <p id="age-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your age in years
          </p>
        </div>

        {/* Sex Input */}
        <div>
          <Label htmlFor="sex" className="text-slate-700 dark:text-slate-300">
            Biological Sex
          </Label>
          <Select
            value={inputs.sex ?? ""}
            onValueChange={(val) =>
              setInputs((prev) => ({
                ...prev,
                sex: val === "" ? undefined : (val as "male" | "female"),
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select your biological sex for accurate calculation
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
          aria-label="Calculate BMR"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: undefined,
              heightFeet: undefined,
              heightInches: undefined,
              heightCm: undefined,
              age: undefined,
              sex: undefined,
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-label="BMR result">
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the BMR — Basal Metabolic Rate (Mifflin-St Jeor)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Basal Metabolic Rate (BMR) calculator using the Mifflin-St Jeor equation estimates how many calories your body burns at rest to maintain basic functions like breathing, circulation, and cell production. This calculator is widely used by nutritionists, trainers, and healthcare providers because it provides accurate estimates for the general population. Understanding your BMR is the foundation for creating effective nutrition plans, whether your goal is weight loss, weight gain, or maintenance.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you'll need four key inputs: your biological sex, current age in years, height (in feet and inches or centimeters), and body weight (in pounds or kilograms). The Mifflin-St Jeor equation applies different coefficients for males and females because of biological differences in muscle mass and metabolism. Ensure your measurements are as accurate as possible, since even small variations can shift your BMR result by 25-50 calories.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your BMR result represents the minimum calories needed to sustain your body at complete rest—not including any physical activity or digestion. To estimate your total daily calorie needs, multiply your BMR by an activity factor ranging from 1.2 (sedentary) to 1.9 (extremely active). If you're trying to lose weight, aim for a 300-500 calorie deficit below your TDEE; if gaining, aim for a 300-500 calorie surplus. Recalculate your BMR every 3-6 months if your weight or body composition changes significantly.</p>
        </div>
      </section>

      {/* TABLE: Sample BMR Results by Age, Sex, and Weight Using Mifflin-St Jeor */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Sample BMR Results by Age, Sex, and Weight Using Mifflin-St Jeor</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated BMR values for individuals of different ages and weights at 5'10" height, calculated using the Mifflin-St Jeor equation.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Male (160 lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Male (180 lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Female (130 lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Female (150 lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,560 cal/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,710 cal/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,290 cal/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,425 cal/day</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,520 cal/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,670 cal/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,260 cal/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,395 cal/day</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">45 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,480 cal/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,630 cal/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,230 cal/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,365 cal/day</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">55 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,440 cal/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,590 cal/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,200 cal/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,335 cal/day</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">65 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,400 cal/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,550 cal/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,170 cal/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,305 cal/day</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Results are approximations. Actual BMR varies based on muscle mass, genetics, and individual metabolism. Use the calculator for personalized results.</p>
      </section>

      {/* TABLE: Mifflin-St Jeor Equation Coefficients and Formula */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Mifflin-St Jeor Equation Coefficients and Formula</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">The Mifflin-St Jeor equation uses specific coefficients for males and females to calculate BMR from weight, height, and age.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Component</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Males</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Females</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Weight coefficient (lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.25 × weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.35 × weight</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Height coefficient (inches)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.7 × height</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.7 × height</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Age coefficient (years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-6.8 × age</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-4.7 × age</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Constant adjustment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+ 66</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+ 655</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Formula: BMR = (Weight coefficient) + (Height coefficient) - (Age coefficient) + (Constant). For metric units, use weight in kg, height in cm, and adjust coefficients accordingly.</p>
      </section>

      {/* TABLE: Daily Calorie Needs Based on BMR and Activity Level */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calorie Needs Based on BMR and Activity Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Once you calculate BMR using Mifflin-St Jeor, multiply by your activity factor to estimate total daily energy expenditure (TDEE).</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Factor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example (1,600 BMR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedentary (little/no exercise)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,920 cal/day</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lightly active (1-3 days/week)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.375</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,200 cal/day</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderately active (3-5 days/week)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,480 cal/day</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Very active (6-7 days/week)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.725</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,760 cal/day</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Extremely active (2x/day exercise)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,040 cal/day</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are estimates. Actual TDEE varies by exercise intensity, muscle mass, and individual metabolism.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your height and weight accurately in the morning without shoes or heavy clothing, as BMR calculations are sensitive to precise measurements—a 5 lb error can shift results by 20-30 calories.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use your BMR as a baseline only; individual metabolism varies by 10-20% due to genetics, hormones, medications, and medical conditions, so adjust your calorie intake based on real weight change over 2-3 weeks.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If you're strength training, recalculate BMR monthly during muscle-building phases, as each pound of new muscle increases BMR by approximately 6 calories per day and compounds over time.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for metabolic adaptation when dieting for more than 12 weeks—your BMR may decrease 10-15% due to reduced calorie intake, so adjust your target downward rather than assuming the same deficit applies indefinitely.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Cross-reference your Mifflin-St Jeor BMR with the Harris-Benedict or Katch-McArdle equations if results seem inconsistent with your real-world weight changes; significant differences may indicate unusual body composition or metabolic issues worth discussing with a healthcare provider.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming BMR equals daily calorie needs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">BMR is only your resting metabolism; your actual daily calorie needs are 20-90% higher depending on activity level. Eating only your BMR calories will create a severe deficit and lead to muscle loss, fatigue, and metabolic slowdown.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using outdated Harris-Benedict formula instead of Mifflin-St Jeor</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The Harris-Benedict equation (developed in 1919) overestimates BMR by approximately 5-10% for modern populations. Using the older formula may result in eating more calories than needed for weight loss goals.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring body composition changes during weight loss</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The Mifflin-St Jeor equation estimates BMR from total weight but doesn't distinguish muscle from fat loss. If you lose 20 lbs of muscle, your actual BMR drops more than the equation predicts, requiring lower calorie targets to maintain the same deficit.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Treating BMR results as completely accurate rather than estimates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The Mifflin-St Jeor equation has a standard error of ±10-20%, meaning your actual BMR could be 160-320 calories different from the calculated result. Adjust targets based on real weight trends, not just the calculator result.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not recalculating BMR after significant weight changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 15 lb weight loss can decrease BMR by 50-75 calories; continuing to use your old BMR for calorie targets will make the deficit too small and slow weight loss progress. Recalculate whenever weight changes by 5% or more.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the Mifflin-St Jeor equation and why is it more accurate than Harris-Benedict?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Mifflin-St Jeor equation is a modern BMR calculation method developed in 1990 that accounts for body composition changes and is more accurate for contemporary populations. It produces results approximately 5% lower than the older Harris-Benedict formula because it was calibrated on a more diverse population sample. Most nutritionists and fitness professionals prefer it because it provides more reliable estimates for weight management and caloric intake planning.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does age affect BMR calculations using Mifflin-St Jeor?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Age is a significant factor in the Mifflin-St Jeor equation, with BMR decreasing approximately 2-8% per decade after age 20 due to muscle loss and metabolic slowdown. A 25-year-old male at 180 lbs might have a BMR of 1,800 calories, while a 65-year-old male with identical weight and height could have a BMR around 1,500 calories. This age-related decline is why older adults often need fewer calories to maintain weight.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between BMR and TDEE, and how does this calculator help?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BMR (Basal Metabolic Rate) is the calories your body burns at complete rest, while TDEE (Total Daily Energy Expenditure) includes activity level and is typically 1.2 to 1.9 times your BMR. This calculator provides your BMR as a foundation; you then multiply by an activity factor (sedentary = 1.2, lightly active = 1.375, moderately active = 1.55) to determine total daily calorie needs. Understanding your BMR is essential for creating accurate nutrition plans and weight loss targets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does the Mifflin-St Jeor calculator show different results for men and women at the same measurements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Mifflin-St Jeor equation uses different coefficients for males and females because women typically have less muscle mass and higher body fat percentages at the same weight and height. For example, a 5'8" person weighing 160 lbs might show a BMR of 1,650 calories for men but 1,420 calories for women. This accounts for biological differences in metabolism, though individual variation still exists based on genetics and muscle composition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the Mifflin-St Jeor equation for people with obesity or very low body fat?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Mifflin-St Jeor equation has a standard error of approximately ±10-20% and is most accurate for people with BMI between 18.5 and 30. For individuals with obesity (BMI &gt; 30) or very low body fat (&lt;10%), the equation may be less precise because it relies on height and weight without accounting for actual body composition. In these cases, indirect calorimetry or DEXA scans provide more accurate measurements, though Mifflin-St Jeor remains a reasonable estimate for general population use.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What input measurements do I need to use this BMR calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Mifflin-St Jeor calculator requires four inputs: your sex (male or female), age in years, height (in feet/inches or centimeters), and weight (in pounds or kilograms). Ensure measurements are as accurate as possible, as small variations—especially in height and weight—can shift BMR results by 50-100 calories. For best results, weigh yourself in the morning and measure height without shoes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does muscle mass affect BMR even if weight stays the same?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Mifflin-St Jeor equation does not directly measure muscle mass, but BMR increases approximately 6 calories per pound of muscle tissue, while fat tissue burns only 2-3 calories per pound. Two people weighing 180 lbs with different muscle compositions may have BMR differences of 100-150 calories depending on their body fat percentage. This is why strength training increases BMR—building muscle tissue directly increases resting metabolic rate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is the Mifflin-St Jeor equation reliable for athletes and highly active individuals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Mifflin-St Jeor equation tends to underestimate BMR for athletes with very high muscle mass because it relies only on height, weight, age, and sex. A muscular 180 lb athlete might have an actual BMR 10-15% higher than the calculated result, since the equation doesn't account for lean muscle tissue. Athletes should consider using the equation as a baseline and adjusting upward based on activity response and body composition assessments.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my BMR if my weight or age changes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You should recalculate BMR whenever your weight changes by 5% or more, whenever you reach a new year of age, or if your body composition shifts significantly due to training or diet changes. A person losing 10 pounds may see their BMR decrease by 20-30 calories, while gaining 10 pounds of muscle could increase it by 60 calories. Recalculating every 3-6 months during intentional body composition changes helps keep calorie targets accurate.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://academic.oup.com/ajcn/article-abstract/40/1/168/4691347" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Roza AM, Shizgal HM. The Harris Benedict equation reevaluated: resting energy expenditure and the body cell mass. American Journal of Clinical Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed validation study comparing Mifflin-St Jeor and Harris-Benedict equations for accuracy in BMR estimation.</p>
          </li>
          <li>
            <a href="https://www.niddk.nih.gov/health-information/weight-management/overview" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Institutes of Health — Energy Balance and Weight Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official NIH resource explaining basal metabolic rate, total energy expenditure, and evidence-based approaches to weight management using BMR calculations.</p>
          </li>
          <li>
            <a href="https://academic.oup.com/ajcn/article/51/2/241/4695477" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Journal of Clinical Nutrition — Mifflin-St Jeor Equation Validation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Original peer-reviewed publication introducing and validating the Mifflin-St Jeor equation across diverse populations with documented accuracy margins.</p>
          </li>
          <li>
            <a href="https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/metabolism/art-20046508" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Mayo Clinic — Basal Metabolic Rate and Weight Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical overview from Mayo Clinic explaining how BMR calculations inform personalized nutrition and weight loss strategies.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BMR — Basal Metabolic Rate (Mifflin-St Jeor)"
      description="Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation. Find out exactly how many calories your body burns at rest."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "BMR = 10 × weight (kg) + 6.25 × height (cm) − 5 × age (years) + s",
        variables: [
          {
            symbol: "weight (kg)",
            description: "Your body weight in kilograms",
          },
          {
            symbol: "height (cm)",
            description: "Your height in centimeters",
          },
          {
            symbol: "age (years)",
            description: "Your age in years",
          },
          {
            symbol: "s",
            description:
              "Sex constant: +5 for males, −161 for females",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "Calculate the BMR for a 30-year-old female who weighs 150 lbs and is 5 feet 5 inches tall.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kilograms: 150 lbs × 0.453592 = 68.04 kg",
          },
          {
            label: "Step 2",
            explanation:
              "Convert height to centimeters: (5 × 12 + 5) inches = 65 inches × 2.54 = 165.1 cm",
          },
          {
            label: "Step 3",
            explanation:
              "Apply the formula: 10 × 68.04 + 6.25 × 165.1 − 5 × 30 − 161",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate: 680.4 + 1031.9 − 150 − 161 = 1401.3 calories/day",
          },
        ],
        result:
          "The estimated BMR is approximately 1401 calories per day, meaning this is the energy required to maintain basic bodily functions at rest.",
      }}
      relatedCalculators={[
        {
          title: "BMI — Body Mass Index Calculator",
          url: "/health/bmi-body-mass-index",
          icon: "⚖️",
        },
        {
          title: "TDEE — Total Daily Energy Expenditure Calculator",
          url: "/health/tdee-daily-energy-expenditure",
          icon: "🔥",
        },
        {
          title: "Body Fat % (US Navy / 3-sites)",
          url: "/health/body-fat-us-navy-3-sites",
          icon: "❤️",
        },
        {
          title: "Ideal Weight Range (Hamwi/Devine/Miller)",
          url: "/health/ideal-weight-range-hamwi-devine-miller",
          icon: "💧",
        },
        {
          title: "Waist-to-Height Ratio Checker",
          url: "/health/waist-to-height-ratio",
          icon: "🥗",
        },
        {
          title: "Body Surface Area (BSA) Calculator",
          url: "/health/body-surface-area-bsa",
          icon: "😴",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is BMR — Basal Metabolic Rate (Mifflin-St Jeor)?" },
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
