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
import { convertWeight, formatNumberForInput } from "@/lib/utils";

export default function DailyCalorieNeedsGoalCalculator() {
  // 1. STATE (Imperial Default)
  const { unit: preferredWeightUnit, setUnit: setPreferredWeightUnit } = useWeightUnitPreference();
  const [unit, setUnit] = useState<"imperial" | "metric">(() => (preferredWeightUnit === "lb" ? "imperial" : "metric"));
  const [inputs, setInputs] = useState({
    age: "",
    sex: "male",
    weight: "",
    heightFeet: "",
    heightInches: "",
    heightCm: "",
    activityLevel: "sedentary",
    goal: "maintain",
  });

  // Helper: Convert height to cm
  const heightCm = useMemo(() => {
    if (unit === "imperial") {
      const feet = parseFloat(inputs.heightFeet) || 0;
      const inches = parseFloat(inputs.heightInches) || 0;
      return feet * 30.48 + inches * 2.54;
    } else {
      return parseFloat(inputs.heightCm) || 0;
    }
  }, [inputs.heightFeet, inputs.heightInches, inputs.heightCm, unit]);

  // Helper: Convert weight to kg
  const weightKg = useMemo(() => {
    if (unit === "imperial") {
      return (parseFloat(inputs.weight) || 0) * 0.45359237;
    } else {
      return parseFloat(inputs.weight) || 0;
    }
  }, [inputs.weight, unit]);

  // 2. LOGIC
  // Calculate BMR using Mifflin-St Jeor Equation (most accurate for US/Canada)
  // BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + s
  // s = +5 for males, -161 for females
  // Then multiply by activity factor
  // Adjust calories based on goal:
  // - Weight loss: subtract 15-20% calories
  // - Maintenance: no change
  // - Muscle gain: add 10-15% calories

  const activityFactors: Record<string, number> = {
    sedentary: 1.2, // little or no exercise
    light: 1.375, // light exercise/sports 1-3 days/week
    moderate: 1.55, // moderate exercise/sports 3-5 days/week
    active: 1.725, // hard exercise/sports 6-7 days a week
    veryActive: 1.9, // very hard exercise/sports & physical job or 2x training
  };

  const results = useMemo(() => {
    const age = parseInt(inputs.age);
    if (
      !age ||
      age < 10 ||
      age > 120 ||
      !weightKg ||
      weightKg < 20 ||
      !heightCm ||
      heightCm < 50
    ) {
      return { value: 0, label: "", category: "" };
    }

    const s = inputs.sex === "male" ? 5 : -161;
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + s;

    const activityFactor = activityFactors[inputs.activityLevel] || 1.2;
    const tdee = bmr * activityFactor;

    let calorieGoal = tdee;
    let category = "";

    switch (inputs.goal) {
      case "lose":
        calorieGoal = tdee * 0.8; // 20% deficit
        category = "Weight Loss";
        break;
      case "mildLose":
        calorieGoal = tdee * 0.85; // 15% deficit
        category = "Mild Weight Loss";
        break;
      case "maintain":
        calorieGoal = tdee;
        category = "Maintenance";
        break;
      case "mildGain":
        calorieGoal = tdee * 1.10; // 10% surplus
        category = "Mild Muscle Gain";
        break;
      case "gain":
        calorieGoal = tdee * 1.15; // 15% surplus
        category = "Muscle Gain";
        break;
      default:
        calorieGoal = tdee;
        category = "Maintenance";
    }

    return {
      value: Math.round(calorieGoal),
      label: "Calories per day",
      category,
    };
  }, [inputs, weightKg, heightCm]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between BMR and TDEE in this calculator?",
      answer: "BMR (Basal Metabolic Rate) represents the calories your body burns at rest to maintain basic functions like breathing and circulation, typically ranging from 1,200-1,800 calories daily depending on age, sex, and weight. TDEE (Total Daily Energy Expenditure) multiplies your BMR by an activity factor to account for exercise and daily movement, resulting in a higher number that represents total calorie burn. This calculator uses TDEE as the foundation for goal-based adjustments, ensuring your calorie target aligns with your actual lifestyle.",
    },
    {
      question: "How many calories should I subtract for weight loss goals?",
      answer: "A safe and sustainable weight loss rate is 1-2 pounds per week, which requires a calorie deficit of 500-1,000 calories daily (since 1 pound of fat equals approximately 3,500 calories). For example, if your TDEE is 2,500 calories, a 500-calorie deficit means consuming 2,000 calories daily to lose about 1 pound weekly. Most health professionals recommend starting with a 300-500 calorie deficit to preserve muscle mass while losing fat, especially for beginners.",
    },
    {
      question: "What activity multiplier should I use if I exercise 4-5 times per week?",
      answer: "For moderate exercise 4-5 times weekly (30-60 minutes of cardio or strength training), use an activity multiplier of 1.55, which corresponds to 'moderate activity' levels. If your workouts are intense and include heavy resistance training or high-intensity interval training (HIIT), increase to 1.725 (very active). For example, a person with a 1,500 BMR exercising moderately would have a TDEE of approximately 2,325 calories (1,500 × 1.55).",
    },
    {
      question: "How do I account for strength training versus cardio in calorie calculations?",
      answer: "Both strength training and cardio increase your TDEE, but cardio typically burns more calories per session (400-600 calories in 45 minutes), while strength training burns 200-400 calories but increases resting metabolic rate over time. This calculator uses overall activity frequency rather than type; if you do 4 sessions weekly regardless of mix, select the '4-5 days per week' option. For precision, some users track mixed routines by averaging their weekly calorie burn and adjusting their TDEE multiplier slightly upward (1.625-1.725 for balanced training).",
    },
    {
      question: "What calorie surplus is appropriate for muscle-building goals?",
      answer: "For lean muscle gain, a calorie surplus of 300-500 calories daily is recommended, which supports roughly 0.5-1 pound of weekly weight gain with minimal fat accumulation. If your TDEE is 2,200 calories, eating 2,500-2,700 calories combined with strength training 4-5 times weekly optimizes muscle protein synthesis. Exceeding a 500-calorie surplus increases fat gain without additional muscle benefit, making it an inefficient approach.",
    },
    {
      question: "How often should I recalculate my daily calorie needs?",
      answer: "Recalculate your calorie needs every 4-6 weeks or whenever your weight changes by 10+ pounds, as your BMR shifts with body composition changes. For example, a 20-pound weight loss reduces your BMR by approximately 100-150 calories, requiring a downward adjustment to maintain your deficit. Additionally, recalculate if your exercise routine changes significantly or your goal shifts from maintenance to cutting or bulking.",
    },
    {
      question: "Why is my calculated calorie need lower than online sources suggest?",
      answer: "Different calculators use varying BMR formulas (Mifflin-St Jeor, Harris-Benedict, or Katch-McArdle), which can produce results differing by 100-300 calories. This calculator typically uses the Mifflin-St Jeor equation, which is considered most accurate for average populations but may overestimate for very obese individuals or underestimate for very muscular people. If you consistently find calculated needs misaligned with real results after 2-3 weeks of tracking, adjust your calorie intake by ±100-150 calories based on actual weight trends.",
    },
    {
      question: "Is a 1,200 calorie diet safe for everyone?",
      answer: "A 1,200 calorie diet is generally not recommended for most adults, as it falls below the minimum suggested intake and can cause nutrient deficiencies, muscle loss, and metabolic slowdown. This minimum is appropriate only for sedentary adult women in specific medical situations under professional supervision; most women require 1,600-2,000 calories, and men require 2,000-2,800 calories. If your calculated goal-based needs are near or below 1,200 calories, consult a dietitian before proceeding, as extremely low intakes often indicate unrealistic goals or miscalculated activity levels.",
    },
    {
      question: "How do age, sex, and body composition affect my calorie needs?",
      answer: "Men typically have 5-10% higher BMR than women due to greater muscle mass, so a 180-pound man and 180-pound woman may have BMRs differing by 150-200 calories. Age reduces BMR by approximately 2-8% per decade after age 30, meaning a 50-year-old requires 200-300 fewer calories than a 25-year-old of identical weight and activity. Muscular individuals have higher BMRs than those with high body fat at the same weight; someone with 20% body fat burns 200-400 more calories daily than someone with 35% body fat at identical weight and activity levels.",
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
            onValueChange={(next) => {
              if (next !== "imperial" && next !== "metric") return;
              setInputs((prev) => {
                if (next === unit) return prev;

                const weightNum = parseFloat(prev.weight);
                const nextWeight =
                  prev.weight !== "" && !Number.isNaN(weightNum) && weightNum > 0
                    ? formatNumberForInput(
                        convertWeight(weightNum, unit === "imperial" ? "lb" : "kg", next === "imperial" ? "lb" : "kg"),
                        2,
                      )
                    : prev.weight;

                if (next === "metric") {
                  const feetNum = parseFloat(prev.heightFeet);
                  const inchesNum = parseFloat(prev.heightInches);
                  const canConvertHeight = prev.heightFeet !== "" && prev.heightInches !== "" && !Number.isNaN(feetNum) && !Number.isNaN(inchesNum);
                  const heightCm = canConvertHeight ? (feetNum * 12 + inchesNum) * 2.54 : prev.heightCm;
                  return {
                    ...prev,
                    weight: nextWeight,
                    heightCm: canConvertHeight ? formatNumberForInput(heightCm, 1) : prev.heightCm,
                    heightFeet: "",
                    heightInches: "",
                  };
                }

                const cmNum = parseFloat(prev.heightCm);
                const canConvertHeight = prev.heightCm !== "" && !Number.isNaN(cmNum) && cmNum > 0;
                if (!canConvertHeight) {
                  return {
                    ...prev,
                    weight: nextWeight,
                    heightCm: "",
                  };
                }
                const totalInches = cmNum / 2.54;
                let feet = Math.floor(totalInches / 12);
                let inches = Math.round(totalInches - feet * 12);
                if (inches === 12) {
                  feet += 1;
                  inches = 0;
                }
                return {
                  ...prev,
                  weight: nextWeight,
                  heightFeet: String(feet),
                  heightInches: String(inches),
                  heightCm: "",
                };
              });
              setUnit(next);
              setPreferredWeightUnit(next === "imperial" ? "lb" : "kg");
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

        {/* Age */}
        <div>
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Age (years)
          </Label>
          <Input
            id="age"
            type="number"
            min={10}
            max={120}
            placeholder="e.g. 30"
            value={inputs.age}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, age: e.target.value }))
            }
          />
        </div>

        {/* Sex */}
        <div>
          <Label htmlFor="sex" className="text-slate-700 dark:text-slate-300">
            Sex
          </Label>
          <Select
            id="sex"
            value={inputs.sex}
            onValueChange={(value) =>
              setInputs((prev) => ({ ...prev, sex: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weight */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={20}
            max={1000}
            placeholder={unit === "imperial" ? "e.g. 150" : "e.g. 68"}
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
          />
        </div>

        {/* Height */}
        {unit === "imperial" ? (
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label
                htmlFor="heightFeet"
                className="text-slate-700 dark:text-slate-300"
              >
                Height (feet)
              </Label>
              <Input
                id="heightFeet"
                type="number"
                min={1}
                max={8}
                placeholder="e.g. 5"
                value={inputs.heightFeet}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, heightFeet: e.target.value }))
                }
              />
            </div>
            <div className="flex-1">
              <Label
                htmlFor="heightInches"
                className="text-slate-700 dark:text-slate-300"
              >
                Height (inches)
              </Label>
              <Input
                id="heightInches"
                type="number"
                min={0}
                max={11}
                placeholder="e.g. 10"
                value={inputs.heightInches}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    heightInches: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        ) : (
          <div>
            <Label
              htmlFor="heightCm"
              className="text-slate-700 dark:text-slate-300"
            >
              Height (cm)
            </Label>
            <Input
              id="heightCm"
              type="number"
              min={50}
              max={250}
              placeholder="e.g. 178"
              value={inputs.heightCm}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, heightCm: e.target.value }))
              }
            />
          </div>
        )}

        {/* Activity Level */}
        <div>
          <Label
            htmlFor="activityLevel"
            className="text-slate-700 dark:text-slate-300"
          >
            Activity Level
          </Label>
          <Select
            id="activityLevel"
            value={inputs.activityLevel}
            onValueChange={(value) =>
              setInputs((prev) => ({ ...prev, activityLevel: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">
                Sedentary (little or no exercise)
              </SelectItem>
              <SelectItem value="light">
                Light (1-3 days/week exercise)
              </SelectItem>
              <SelectItem value="moderate">
                Moderate (3-5 days/week exercise)
              </SelectItem>
              <SelectItem value="active">
                Active (6-7 days/week exercise)
              </SelectItem>
              <SelectItem value="veryActive">
                Very Active (hard exercise or physical job)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Goal */}
        <div>
          <Label htmlFor="goal" className="text-slate-700 dark:text-slate-300">
            Goal
          </Label>
          <Select
            id="goal"
            value={inputs.goal}
            onValueChange={(value) =>
              setInputs((prev) => ({ ...prev, goal: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lose">Weight Loss (20% deficit)</SelectItem>
              <SelectItem value="mildLose">Mild Weight Loss (15% deficit)</SelectItem>
              <SelectItem value="maintain">Maintenance</SelectItem>
              <SelectItem value="mildGain">Mild Muscle Gain (10% surplus)</SelectItem>
              <SelectItem value="gain">Muscle Gain (15% surplus)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed; calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              age: "",
              sex: "male",
              weight: "",
              heightFeet: "",
              heightInches: "",
              heightCm: "",
              activityLevel: "sedentary",
              goal: "maintain",
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
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Daily Calorie Needs (Goal-based) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Daily Calorie Needs (Goal-based) calculator determines your personalized daily calorie target by combining your baseline metabolic rate with your activity level and fitness objective. Whether you're aiming to lose weight, build muscle, or maintain your current physique, this calculator translates your goal into a specific calorie number, eliminating guesswork and providing a science-backed foundation for nutrition planning. Understanding your target calorie intake is essential because sustainable progress in any fitness goal depends on consistent, intentional eating rather than restrictive dieting or excessive consumption.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, input your age, sex, current weight, and height to establish your BMR—the calories your body burns at rest. Then select your typical weekly exercise frequency and type to determine your activity multiplier, which accounts for calories burned through movement and exercise. Finally, choose your fitness goal (weight loss, maintenance, or muscle gain) and the aggressiveness level, which automatically adjusts your target calorie intake to support that objective.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your result is a daily calorie target that you should aim to hit consistently, within a range of ±100-150 calories for flexibility. After 2-4 weeks of tracking food intake and monitoring your weight trend, compare real-world results to your target—if you're not progressing as expected, adjust by 100-200 calories and reassess. Remember that this calculator provides an estimate; individual metabolism, stress levels, sleep quality, and hormonal factors influence actual calorie needs, so tracking and adjusting based on real results ensures long-term success.</p>
        </div>
      </section>

      {/* TABLE: BMR Estimates by Age, Sex, and Weight (Mifflin-St Jeor Formula) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">BMR Estimates by Age, Sex, and Weight (Mifflin-St Jeor Formula)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows approximate basal metabolic rates for sedentary adults at various ages and weights.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Female (150 lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Female (180 lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Male (150 lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Male (180 lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,410</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,530</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,590</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,740</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,470</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,530</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,680</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,290</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,410</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,470</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,620</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,230</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,410</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,560</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,170</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,290</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Estimates assume sedentary lifestyle; actual BMR varies by body composition, metabolism, and health conditions.</p>
      </section>

      {/* TABLE: TDEE by Activity Level (2,000 BMR baseline) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">TDEE by Activity Level (2,000 BMR baseline)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how activity multipliers affect total daily energy expenditure for someone with a 2,000 calorie BMR.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Description</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Multiplier</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated TDEE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedentary</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Little or no exercise</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lightly active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-3 days exercise/week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.375</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,750</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderately active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5 days exercise/week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,100</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Very active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-7 days intense exercise/week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.725</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,450</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Extremely active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily intense exercise + physical job</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,800</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Multipliers based on standard Harris-Benedict activity factors; individual variation is common.</p>
      </section>

      {/* TABLE: Calorie Adjustments for Common Goals */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Calorie Adjustments for Common Goals</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows recommended daily calorie adjustments from TDEE based on fitness objectives.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Goal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calorie Adjustment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weekly Weight Change</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example (2,500 TDEE)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Aggressive weight loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-750 to -1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-1.5 to -2 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500-1,750 calories</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate weight loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-500 to -750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-1 to -1.5 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,750-2,000 calories</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Conservative weight loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-250 to -500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-0.5 to -1 lb</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000-2,250 calories</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Maintenance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,500 calories</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lean muscle gain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+300 to +500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+0.5 to +1 lb</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,800-3,000 calories</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Aggressive muscle gain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+500 to +750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+1 to +1.5 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000-3,250 calories</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Weight changes assume calorie targets are consistently met; actual results depend on diet quality, hydration, and training.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Log your food intake for at least 2-3 weeks using a nutrition app like MyFitnessPal or Cronometer to verify your calculated calorie target matches your actual consumption and weight trends—adjustments of ±100-150 calories are common after real-world testing.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Include adequate protein in your calorie target (0.7-1 gram per pound of body weight) regardless of your goal, as protein preserves muscle during weight loss and optimizes muscle growth during surplus phases while increasing satiety.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If your calculated needs seem unusually high or low compared to your real-world experience, consider that body composition matters—someone with 20% body fat burns significantly more calories than someone with 40% body fat at the same weight and activity level.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Recalculate your calorie needs every 4-6 weeks during active weight loss or muscle gain phases, as your BMR shifts with body weight changes, requiring downward adjustment during cuts and upward adjustment during bulk phases to maintain your desired progression rate.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using BMR Instead of TDEE</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Eating only your BMR (typically 1,200-1,800 calories) ignores calories burned through daily activity and exercise, creating an excessive deficit that causes muscle loss and metabolic adaptation. Always use your TDEE as the baseline, then adjust from there based on your goal.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating Activity Level</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people select 'very active' or 'extremely active' when their exercise is inconsistent or lower-intensity, inflating their TDEE by 300-500 calories and preventing weight loss progress. Be honest about weekly exercise frequency and intensity; walking 10,000 steps daily counts as 'lightly active,' not 'moderately active.'</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Food Scale Measurements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Estimating portion sizes by eye leads to consuming 20-40% more calories than logged, sabotaging a calorie deficit despite accurate calculations. Weigh solid foods in grams and measure liquids in milliliters for the first 3-4 weeks until portion intuition improves.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Setting Unrealistic Deficit or Surplus Goals</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Creating a deficit &gt;1,000 calories daily or surplus &gt;750 calories daily causes rapid muscle loss (during cuts) or excessive fat gain (during bulks), reducing sustainability and results. Stick to 300-750 calorie adjustments from your TDEE for best results.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between BMR and TDEE in this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BMR (Basal Metabolic Rate) represents the calories your body burns at rest to maintain basic functions like breathing and circulation, typically ranging from 1,200-1,800 calories daily depending on age, sex, and weight. TDEE (Total Daily Energy Expenditure) multiplies your BMR by an activity factor to account for exercise and daily movement, resulting in a higher number that represents total calorie burn. This calculator uses TDEE as the foundation for goal-based adjustments, ensuring your calorie target aligns with your actual lifestyle.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many calories should I subtract for weight loss goals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A safe and sustainable weight loss rate is 1-2 pounds per week, which requires a calorie deficit of 500-1,000 calories daily (since 1 pound of fat equals approximately 3,500 calories). For example, if your TDEE is 2,500 calories, a 500-calorie deficit means consuming 2,000 calories daily to lose about 1 pound weekly. Most health professionals recommend starting with a 300-500 calorie deficit to preserve muscle mass while losing fat, especially for beginners.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What activity multiplier should I use if I exercise 4-5 times per week?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For moderate exercise 4-5 times weekly (30-60 minutes of cardio or strength training), use an activity multiplier of 1.55, which corresponds to 'moderate activity' levels. If your workouts are intense and include heavy resistance training or high-intensity interval training (HIIT), increase to 1.725 (very active). For example, a person with a 1,500 BMR exercising moderately would have a TDEE of approximately 2,325 calories (1,500 × 1.55).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for strength training versus cardio in calorie calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Both strength training and cardio increase your TDEE, but cardio typically burns more calories per session (400-600 calories in 45 minutes), while strength training burns 200-400 calories but increases resting metabolic rate over time. This calculator uses overall activity frequency rather than type; if you do 4 sessions weekly regardless of mix, select the '4-5 days per week' option. For precision, some users track mixed routines by averaging their weekly calorie burn and adjusting their TDEE multiplier slightly upward (1.625-1.725 for balanced training).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What calorie surplus is appropriate for muscle-building goals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For lean muscle gain, a calorie surplus of 300-500 calories daily is recommended, which supports roughly 0.5-1 pound of weekly weight gain with minimal fat accumulation. If your TDEE is 2,200 calories, eating 2,500-2,700 calories combined with strength training 4-5 times weekly optimizes muscle protein synthesis. Exceeding a 500-calorie surplus increases fat gain without additional muscle benefit, making it an inefficient approach.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my daily calorie needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate your calorie needs every 4-6 weeks or whenever your weight changes by 10+ pounds, as your BMR shifts with body composition changes. For example, a 20-pound weight loss reduces your BMR by approximately 100-150 calories, requiring a downward adjustment to maintain your deficit. Additionally, recalculate if your exercise routine changes significantly or your goal shifts from maintenance to cutting or bulking.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is my calculated calorie need lower than online sources suggest?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Different calculators use varying BMR formulas (Mifflin-St Jeor, Harris-Benedict, or Katch-McArdle), which can produce results differing by 100-300 calories. This calculator typically uses the Mifflin-St Jeor equation, which is considered most accurate for average populations but may overestimate for very obese individuals or underestimate for very muscular people. If you consistently find calculated needs misaligned with real results after 2-3 weeks of tracking, adjust your calorie intake by ±100-150 calories based on actual weight trends.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is a 1,200 calorie diet safe for everyone?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 1,200 calorie diet is generally not recommended for most adults, as it falls below the minimum suggested intake and can cause nutrient deficiencies, muscle loss, and metabolic slowdown. This minimum is appropriate only for sedentary adult women in specific medical situations under professional supervision; most women require 1,600-2,000 calories, and men require 2,000-2,800 calories. If your calculated goal-based needs are near or below 1,200 calories, consult a dietitian before proceeding, as extremely low intakes often indicate unrealistic goals or miscalculated activity levels.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do age, sex, and body composition affect my calorie needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Men typically have 5-10% higher BMR than women due to greater muscle mass, so a 180-pound man and 180-pound woman may have BMRs differing by 150-200 calories. Age reduces BMR by approximately 2-8% per decade after age 30, meaning a 50-year-old requires 200-300 fewer calories than a 25-year-old of identical weight and activity. Muscular individuals have higher BMRs than those with high body fat at the same weight; someone with 20% body fat burns 200-400 more calories daily than someone with 35% body fat at identical weight and activity levels.</p>
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official USDA and HHS guidelines on daily calorie and nutrient recommendations by age, sex, and activity level.</p>
          </li>
          <li>
            <a href="https://www.niddk.nih.gov/health-information/weight-management/calories" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NIH National Institute of Diabetes and Digestive and Kidney Diseases: Calorie Needs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based overview of calorie needs, BMR calculations, and factors affecting daily energy expenditure.</p>
          </li>
          <li>
            <a href="https://www.acefitness.org/fitness-certifications/nutrition-specialty/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Council on Exercise: Nutrition and Weight Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional certification and resource guide covering calorie calculations, macronutrient needs, and evidence-based nutritional strategies.</p>
          </li>
          <li>
            <a href="https://www.jandonline.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of the Academy of Nutrition and Dietetics: Macronutrient Distribution</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on calorie distribution, macronutrient ratios, and optimal nutrition strategies for weight management and body composition goals.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Daily Calorie Needs (Goal-based)"
      description="Determine daily calorie needs for your specific goal. Create a personalized nutrition plan for weight loss, maintenance, or muscle gain."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "TDEE = BMR × Activity Factor; BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) + s; s = +5 (male), −161 (female); Adjusted Calories = TDEE × Goal Factor",
        variables: [
          {
            symbol: "weight_kg",
            description: "Your weight in kilograms",
          },
          {
            symbol: "height_cm",
            description: "Your height in centimeters",
          },
          {
            symbol: "age",
            description: "Your age in years",
          },
          {
            symbol: "s",
            description: "+5 for males, −161 for females",
          },
          {
            symbol: "Activity Factor",
            description:
              "Multiplier based on your physical activity level (1.2 to 1.9)",
          },
          {
            symbol: "Goal Factor",
            description:
              "Calorie adjustment based on goal (e.g., 0.8 for weight loss, 1.15 for muscle gain)",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A 30-year-old female, 5 feet 6 inches tall, weighing 150 lbs, moderately active, wants to lose weight.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kg: 150 lbs × 0.4536 = 68.04 kg; Convert height to cm: 5 ft × 30.48 + 6 in × 2.54 = 167.64 cm.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate BMR: (10 × 68.04) + (6.25 × 167.64) − (5 × 30) − 161 = 1423 kcal/day.",
          },
          {
            label: "Step 3",
            explanation:
              "Multiply by activity factor (moderate = 1.55): 1423 × 1.55 = 2206 kcal/day (TDEE).",
          },
          {
            label: "Step 4",
            explanation:
              "Apply goal factor for weight loss (20% deficit): 2206 × 0.8 = 1765 kcal/day.",
          },
        ],
        result:
          "The recommended daily calorie intake for this individual to lose weight is approximately 1765 calories.",
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
        { id: "what-is", label: "What is Daily Calorie Needs (Goal-based)?" },
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
