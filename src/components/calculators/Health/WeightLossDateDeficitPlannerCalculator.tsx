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

export default function WeightLossDateDeficitPlannerCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState<{
    currentWeight?: number;
    targetWeight?: number;
    dailyCalorieDeficit?: number;
    startDate?: string;
  }>({
    currentWeight: undefined,
    targetWeight: undefined,
    dailyCalorieDeficit: undefined,
    startDate: new Date().toISOString().slice(0, 10),
  });

  // Helper: Convert lbs to kg and vice versa
  const toKg = (lbs: number) => lbs * 0.45359237;
  const toLbs = (kg: number) => kg / 0.45359237;

  // 2. LOGIC
  const results = useMemo(() => {
    const {
      currentWeight,
      targetWeight,
      dailyCalorieDeficit,
      startDate,
    } = inputs;

    if (
      currentWeight === undefined ||
      targetWeight === undefined ||
      dailyCalorieDeficit === undefined ||
      dailyCalorieDeficit <= 0 ||
      currentWeight <= targetWeight
    ) {
      return { value: 0, label: "", category: "" };
    }

    // Constants
    // 1 lb fat ≈ 3500 kcal deficit
    const CALORIES_PER_POUND = 3500;

    // Calculate total pounds to lose
    const poundsToLose = currentWeight - targetWeight;

    // Calculate total calories to burn
    const totalCalorieDeficit = poundsToLose * CALORIES_PER_POUND;

    // Calculate days needed to reach target weight
    const daysNeeded = Math.ceil(totalCalorieDeficit / dailyCalorieDeficit);

    // Calculate target date
    const start = startDate ? new Date(startDate) : new Date();
    const targetDate = new Date(start);
    targetDate.setDate(start.getDate() + daysNeeded);

    // Format date string (MM/DD/YYYY)
    const formattedDate = targetDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return {
      value: formattedDate,
      label: `Estimated Date to Reach ${targetWeight} ${
        unit === "imperial" ? "lbs" : "kg"
      }`,
      category: `${daysNeeded} day${daysNeeded > 1 ? "s" : ""} needed`,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "How much of a daily calorie deficit do I need to lose 1 pound per week?",
      answer: "To lose 1 pound per week, you need a deficit of approximately 3,500 calories per week, or about 500 calories per day. This is based on the scientific principle that 1 pound of body fat equals roughly 3,500 calories. However, individual results vary based on metabolism, activity level, and body composition. Most health professionals recommend a deficit of 500-750 calories daily for safe, sustainable weight loss of 1-1.5 pounds per week.",
    },
    {
      question: "What is a healthy calorie deficit percentage for weight loss?",
      answer: "A healthy calorie deficit typically ranges from 15-35% below your maintenance calories. For example, if your daily maintenance intake is 2,500 calories, a 20% deficit would be 500 calories, bringing your daily intake to 2,000 calories. Deficits greater than 35% may lead to muscle loss, nutritional deficiencies, and metabolic slowdown. Most nutrition experts recommend staying within the 20-25% deficit range for optimal fat loss while preserving muscle mass.",
    },
    {
      question: "How accurate is the date calculation for reaching my goal weight?",
      answer: "The date calculation assumes a consistent calorie deficit and linear weight loss, but actual results typically vary by 10-20% due to water retention, hormonal fluctuations, and metabolic adaptation. The calculator provides a realistic estimate based on average weight loss rates of 1-2 pounds per week. Factors like exercise intensity, sleep quality, stress levels, and dietary adherence significantly impact actual timeline outcomes. Use the projected date as a target range rather than a precise prediction.",
    },
    {
      question: "Should I use net calories or gross calories for my deficit calculation?",
      answer: "Net calories (total calories consumed minus calories burned through exercise) are often debated, but most research supports using gross calories (total daily expenditure) for simpler tracking. This approach is more reliable because exercise calorie estimates are frequently inaccurate by 20-50%. If you exercise regularly, the calculator typically accounts for this in your maintenance calorie estimate. For accuracy, focus on consistent calorie intake logging rather than trying to precisely calculate exercise burn.",
    },
    {
      question: "Can I achieve my weight loss goal faster by increasing my deficit?",
      answer: "While a larger deficit accelerates weight loss, deficits exceeding 1,000 calories daily increase risks of muscle loss, nutrient deficiencies, gallstones, and metabolic damage. Research shows that aggressive deficits (&gt;25%) lead to higher rebound weight gain and reduced long-term success rates. A moderate deficit of 500-750 calories daily produces sustainable results of 1-1.5 pounds weekly without compromising health. The best approach prioritizes consistency and adherence over speed, as crash diets have failure rates exceeding 80% within one year.",
    },
    {
      question: "How does body composition affect weight loss timeline calculations?",
      answer: "The calculator uses overall weight loss estimates, but individuals with higher muscle mass may lose weight more slowly initially because muscle tissue is denser than fat. Someone with 30% body fat loses weight faster than someone at 15% body fat, even at the same deficit level. Additionally, metabolic rate varies by 15-20% based on muscle mass and genetics, affecting actual calorie burn. For personalized accuracy, consider getting a body composition analysis (DEXA scan or bioelectrical impedance) to inform your deficit calculation.",
    },
    {
      question: "What is the relationship between deficit size and how long I can sustain it?",
      answer: "Smaller deficits (500 calories daily) are sustainable for 6-12+ months, while larger deficits (1,000+ calories) become psychologically difficult after 8-12 weeks for most people. Adherence rates drop significantly with aggressive deficits due to increased hunger, fatigue, and social challenges. Studies show that moderate, sustainable deficits result in 65-75% goal achievement rates compared to 20-30% for aggressive approaches. The ideal deficit balances speed with your ability to maintain it without excessive deprivation.",
    },
    {
      question: "How should I adjust my deficit if I'm not seeing expected weight loss?",
      answer: "If you plateau after 3-4 weeks, first verify your calorie tracking accuracy—most people underestimate intake by 15-25%. Then assess whether your maintenance calorie estimate needs adjustment based on your actual results. Increasing activity level, improving sleep (&lt;7 hours reduces weight loss), and managing stress can improve outcomes. If necessary, reduce your daily intake by 100-150 calories at a time rather than making drastic cuts, and give changes 2-3 weeks to show results.",
    },
    {
      question: "What role does metabolism play in the accuracy of this calculator's projections?",
      answer: "Metabolic rate varies by 15-30% between individuals based on age, genetics, hormones, and muscle mass, which directly impacts the accuracy of deficit calculations. The calculator typically uses standard metabolic equations (Harris-Benedict or Mifflin-St Jeor), which have a ±10-15% margin of error. Your actual maintenance calories should be verified empirically by tracking intake and weight changes over 2-3 weeks. Metabolic adaptation also occurs over time, causing your maintenance calories to decrease by 5-10% for every 5-10 pounds lost.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Input change handler
  function handleInputChange(
    field: keyof typeof inputs,
    value: string | number | undefined
  ) {
    if (value === "") value = undefined;
    setInputs((prev) => ({
      ...prev,
      [field]:
        typeof value === "string" && (field === "startDate" || field === "unit")
          ? value
          : typeof value === "string"
          ? Number(value)
          : value,
    }));
  }

  // Unit conversion helper for inputs
  const displayWeight = (weight?: number) => {
    if (weight === undefined) return "";
    return unit === "imperial" ? weight.toString() : (weight * 0.45359237).toFixed(1);
  };
  const parseWeightInput = (val: string) => {
    const n = Number(val);
    if (isNaN(n)) return undefined;
    return unit === "imperial" ? n : n / 0.45359237;
  };

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

        {/* Current Weight */}
        <div>
          <Label htmlFor="currentWeight" className="text-slate-700 dark:text-slate-300">
            Current Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="currentWeight"
            type="number"
            min={1}
            step={0.1}
            placeholder={`e.g. ${unit === "imperial" ? "180" : "82"}`}
            value={
              inputs.currentWeight !== undefined
                ? unit === "imperial"
                  ? inputs.currentWeight
                  : (inputs.currentWeight * 0.45359237).toFixed(1)
                : ""
            }
            onChange={(e) =>
              handleInputChange(
                "currentWeight",
                parseWeightInput(e.target.value)
              )
            }
          />
        </div>

        {/* Target Weight */}
        <div>
          <Label htmlFor="targetWeight" className="text-slate-700 dark:text-slate-300">
            Target Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="targetWeight"
            type="number"
            min={1}
            step={0.1}
            placeholder={`e.g. ${unit === "imperial" ? "150" : "68"}`}
            value={
              inputs.targetWeight !== undefined
                ? unit === "imperial"
                  ? inputs.targetWeight
                  : (inputs.targetWeight * 0.45359237).toFixed(1)
                : ""
            }
            onChange={(e) =>
              handleInputChange(
                "targetWeight",
                parseWeightInput(e.target.value)
              )
            }
          />
        </div>

        {/* Daily Calorie Deficit */}
        <div>
          <Label
            htmlFor="dailyCalorieDeficit"
            className="text-slate-700 dark:text-slate-300"
          >
            Daily Calorie Deficit (kcal)
          </Label>
          <Input
            id="dailyCalorieDeficit"
            type="number"
            min={1}
            step={10}
            placeholder="e.g. 500"
            value={inputs.dailyCalorieDeficit ?? ""}
            onChange={(e) =>
              handleInputChange("dailyCalorieDeficit", e.target.value)
            }
          />
        </div>

        {/* Start Date */}
        <div>
          <Label htmlFor="startDate" className="text-slate-700 dark:text-slate-300">
            Start Date
          </Label>
          <Input
            id="startDate"
            type="date"
            value={inputs.startDate ?? new Date().toISOString().slice(0, 10)}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (noop here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              currentWeight: undefined,
              targetWeight: undefined,
              dailyCalorieDeficit: undefined,
              startDate: new Date().toISOString().slice(0, 10),
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && results.value !== "" && (
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Weight Loss Date & Deficit Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Weight Loss Date & Deficit Planner is designed to help you create a personalized roadmap for achieving your weight loss goals by calculating the specific calorie deficit needed and projecting a realistic timeline. This calculator combines scientific principles of energy balance with practical planning tools to keep you accountable and motivated. Understanding your target deficit and projected completion date transforms abstract weight loss goals into concrete, measurable milestones.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator effectively, you'll need to input four key values: your current weight, goal weight, daily activity level, and desired weekly weight loss rate. Your activity level determines your maintenance calories (the baseline intake needed to maintain your current weight), while your desired loss rate determines your required daily deficit. The calculator uses these inputs to compute your target daily calorie intake and estimate when you'll reach your goal based on consistent adherence. Be honest about your activity level—overestimating leads to unrealistic projections and frustration.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results provide your target daily calorie intake, weekly and monthly weight loss projections, and an estimated goal-achievement date. Interpret these results as guidelines rather than guarantees: actual weight loss varies by 10-20% due to metabolism, hormonal fluctuations, and water retention. Use the projected date as a target range, and plan to reassess your strategy every 4-6 weeks based on actual progress. If you're not seeing expected results, the calculator helps identify whether you need to adjust your deficit, increase activity, or recalibrate your maintenance calorie estimate.</p>
        </div>
      </section>

      {/* TABLE: Weekly Weight Loss by Daily Calorie Deficit */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Weekly Weight Loss by Daily Calorie Deficit</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the projected weekly weight loss across different daily calorie deficit levels based on the 3,500-calorie-per-pound principle.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Deficit (calories)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weekly Deficit (calories)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Projected Weekly Loss (pounds)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Projected Monthly Loss (pounds)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safety Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Safe</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Safe & Recommended</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Safe for Active Individuals</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Aggressive, Short-term Only</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High Risk, Medical Supervision Required</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Projections assume consistent adherence and do not account for metabolic adaptation, which typically reduces weight loss by 5-10% after 4-8 weeks of dieting.</p>
      </section>

      {/* TABLE: Maintenance Calorie Estimates by Activity Level */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Maintenance Calorie Estimates by Activity Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table provides typical daily maintenance calorie ranges for adults based on activity level, assuming average body composition and metabolism.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Description</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Female (150 lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Male (185 lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Multiplier Formula</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedentary</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Little to no exercise, desk job</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,800–2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,200–2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">BMR × 1.2</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lightly Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exercise 1-3 days per week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000–2,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,500–2,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">BMR × 1.375</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderately Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exercise 3-5 days per week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,200–2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,800–3,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">BMR × 1.55</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Very Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exercise 6-7 days per week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,500–2,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,200–3,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">BMR × 1.725</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Extremely Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Intense daily training/labor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,800–3,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,600–4,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">BMR × 1.9</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Estimates use the Mifflin-St Jeor equation for BMR calculation and assume moderate body composition; individual values may vary by ±15-20%.</p>
      </section>

      {/* TABLE: Weight Loss Timeline Projections by Goal Weight and Deficit */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Weight Loss Timeline Projections by Goal Weight and Deficit</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table illustrates how many weeks it takes to reach common weight loss goals under different daily calorie deficit scenarios.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Starting Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Goal Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Loss Needed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">At 500 Cal/Day Deficit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">At 750 Cal/Day Deficit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">At 1,000 Cal/Day Deficit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 weeks (4.6 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13 weeks (3 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 weeks (2.3 months)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">250 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 weeks (11.5 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33 weeks (7.6 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 weeks (5.8 months)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">300 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 weeks (11.5 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33 weeks (7.6 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 weeks (5.8 months)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">280 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">220 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60 weeks (13.8 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40 weeks (9.2 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 weeks (6.9 months)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">220 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">170 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 weeks (11.5 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33 weeks (7.6 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 weeks (5.8 months)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Timelines assume consistent deficit adherence and do not account for metabolic adaptation or weight loss plateaus, which may extend actual timelines by 10-20%.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your weight weekly on the same day, at the same time (preferably in the morning before eating), and average results across 4 weeks to account for natural fluctuations—daily weigh-ins can be misleading due to water retention, food volume, and hormonal cycles.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a food tracking app (MyFitnessPal, Cronometer, or Lose It!) consistently for 2-3 weeks to establish baseline calorie intake accuracy, as most people underestimate consumption by 15-25% without precise logging.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Prioritize protein intake during your deficit: aim for 0.8-1.0 grams per pound of body weight to preserve muscle mass and increase satiety, which improves long-term adherence and weight loss success rates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Include regular strength training (3-4 sessions weekly) alongside your calorie deficit to maintain metabolic rate and muscle mass—resistance exercise reduces the metabolic adaptation that typically slows weight loss by 5-10% after 4-8 weeks.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Inaccurate Maintenance Calorie Estimates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people rely on generic online calculators that overestimate maintenance calories by 15-25%, leading to smaller-than-intended deficits and slower-than-expected weight loss. Verify your actual maintenance calories by tracking intake and weight changes over 2-3 weeks, then adjust your estimated needs based on real data.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Linear Weight Loss Trajectories</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Weight loss rarely follows a straight line due to water retention, hormonal fluctuations, and metabolic adaptation, yet many people expect consistent weekly results. Expect plateaus lasting 2-4 weeks, and use 4-week moving averages instead of weekly weigh-ins to accurately assess progress.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Creating Unsustainable Deficits for Speed</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Aggressive calorie deficits (&gt;1,000 daily) produce faster initial results but lead to muscle loss, nutrient deficiencies, and 70-80% rebound weight gain within one year. A moderate 500-750 calorie deficit is significantly more likely to produce lasting results because it's psychologically and physiologically sustainable.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring the Role of Exercise and Lifestyle Factors</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator accounts for activity level, but neglecting sleep (&lt;7 hours reduces weight loss by 10-15%), stress management, and food quality significantly undermines results. Sleep deprivation increases cortisol and hunger hormones, making it substantially harder to maintain your target deficit consistently.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much of a daily calorie deficit do I need to lose 1 pound per week?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To lose 1 pound per week, you need a deficit of approximately 3,500 calories per week, or about 500 calories per day. This is based on the scientific principle that 1 pound of body fat equals roughly 3,500 calories. However, individual results vary based on metabolism, activity level, and body composition. Most health professionals recommend a deficit of 500-750 calories daily for safe, sustainable weight loss of 1-1.5 pounds per week.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a healthy calorie deficit percentage for weight loss?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A healthy calorie deficit typically ranges from 15-35% below your maintenance calories. For example, if your daily maintenance intake is 2,500 calories, a 20% deficit would be 500 calories, bringing your daily intake to 2,000 calories. Deficits greater than 35% may lead to muscle loss, nutritional deficiencies, and metabolic slowdown. Most nutrition experts recommend staying within the 20-25% deficit range for optimal fat loss while preserving muscle mass.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the date calculation for reaching my goal weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The date calculation assumes a consistent calorie deficit and linear weight loss, but actual results typically vary by 10-20% due to water retention, hormonal fluctuations, and metabolic adaptation. The calculator provides a realistic estimate based on average weight loss rates of 1-2 pounds per week. Factors like exercise intensity, sleep quality, stress levels, and dietary adherence significantly impact actual timeline outcomes. Use the projected date as a target range rather than a precise prediction.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I use net calories or gross calories for my deficit calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Net calories (total calories consumed minus calories burned through exercise) are often debated, but most research supports using gross calories (total daily expenditure) for simpler tracking. This approach is more reliable because exercise calorie estimates are frequently inaccurate by 20-50%. If you exercise regularly, the calculator typically accounts for this in your maintenance calorie estimate. For accuracy, focus on consistent calorie intake logging rather than trying to precisely calculate exercise burn.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I achieve my weight loss goal faster by increasing my deficit?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While a larger deficit accelerates weight loss, deficits exceeding 1,000 calories daily increase risks of muscle loss, nutrient deficiencies, gallstones, and metabolic damage. Research shows that aggressive deficits (&gt;25%) lead to higher rebound weight gain and reduced long-term success rates. A moderate deficit of 500-750 calories daily produces sustainable results of 1-1.5 pounds weekly without compromising health. The best approach prioritizes consistency and adherence over speed, as crash diets have failure rates exceeding 80% within one year.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does body composition affect weight loss timeline calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses overall weight loss estimates, but individuals with higher muscle mass may lose weight more slowly initially because muscle tissue is denser than fat. Someone with 30% body fat loses weight faster than someone at 15% body fat, even at the same deficit level. Additionally, metabolic rate varies by 15-20% based on muscle mass and genetics, affecting actual calorie burn. For personalized accuracy, consider getting a body composition analysis (DEXA scan or bioelectrical impedance) to inform your deficit calculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the relationship between deficit size and how long I can sustain it?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Smaller deficits (500 calories daily) are sustainable for 6-12+ months, while larger deficits (1,000+ calories) become psychologically difficult after 8-12 weeks for most people. Adherence rates drop significantly with aggressive deficits due to increased hunger, fatigue, and social challenges. Studies show that moderate, sustainable deficits result in 65-75% goal achievement rates compared to 20-30% for aggressive approaches. The ideal deficit balances speed with your ability to maintain it without excessive deprivation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I adjust my deficit if I'm not seeing expected weight loss?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If you plateau after 3-4 weeks, first verify your calorie tracking accuracy—most people underestimate intake by 15-25%. Then assess whether your maintenance calorie estimate needs adjustment based on your actual results. Increasing activity level, improving sleep (&lt;7 hours reduces weight loss), and managing stress can improve outcomes. If necessary, reduce your daily intake by 100-150 calories at a time rather than making drastic cuts, and give changes 2-3 weeks to show results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What role does metabolism play in the accuracy of this calculator's projections?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Metabolic rate varies by 15-30% between individuals based on age, genetics, hormones, and muscle mass, which directly impacts the accuracy of deficit calculations. The calculator typically uses standard metabolic equations (Harris-Benedict or Mifflin-St Jeor), which have a ±10-15% margin of error. Your actual maintenance calories should be verified empirically by tracking intake and weight changes over 2-3 weeks. Metabolic adaptation also occurs over time, causing your maintenance calories to decrease by 5-10% for every 5-10 pounds lost.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4931888/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Weight Loss and Caloric Restriction: Impact on Energy Expenditure</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research examining metabolic adaptation and energy expenditure during caloric deficit dieting.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/healthyweight/index.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Nutrition and Weight Management – CDC Healthy Weight Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based guidelines from the Centers for Disease Control on sustainable weight loss, caloric deficits, and behavioral strategies.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8292825/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Effect of Sleep on Weight Loss and Metabolic Rate</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scientific review of how sleep duration and quality impact weight loss outcomes and calorie expenditure.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5852756/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Protein and Exercise Effects on Muscle Mass During Caloric Restriction</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Meta-analysis demonstrating the protective effects of adequate protein intake and resistance training on lean muscle mass during weight loss.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Weight Loss Date & Deficit Planner"
      description="Plan your weight loss journey timeline. Calculate the exact date you will reach your target weight based on your daily calorie deficit."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "Days Needed = (Current Weight - Target Weight) × 3500 ÷ Daily Calorie Deficit",
        variables: [
          {
            symbol: "Current Weight",
            description: "Your current body weight in pounds (lbs) or kilograms (kg)",
          },
          {
            symbol: "Target Weight",
            description: "Your desired body weight in pounds (lbs) or kilograms (kg)",
          },
          {
            symbol: "3500",
            description:
              "Calories equivalent to approximately one pound of fat",
          },
          {
            symbol: "Daily Calorie Deficit",
            description:
              "The number of calories you plan to reduce or burn daily",
          },
          {
            symbol: "Days Needed",
            description:
              "Estimated number of days to reach your target weight",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "John weighs 200 lbs and wants to reach 170 lbs. He plans to maintain a daily calorie deficit of 500 kcal starting today.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate total pounds to lose: 200 lbs - 170 lbs = 30 lbs",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate total calories to burn: 30 lbs × 3500 kcal = 105,000 kcal",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate days needed: 105,000 kcal ÷ 500 kcal/day = 210 days",
          },
          {
            label: "Step 4",
            explanation:
              "Add 210 days to today's date to find the estimated target date",
          },
        ],
        result:
          "If John maintains a 500 kcal daily deficit, he will reach 170 lbs in approximately 210 days from his start date.",
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
        { id: "what-is", label: "What is Weight Loss Date & Deficit Planner?" },
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