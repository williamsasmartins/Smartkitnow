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
  Dog,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogWeightLossPlannerCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    currentWeight: "",
    goalWeight: "",
    weeklyLossPercent: "2", // default safe weight loss % per week
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const currentWeightRaw = parseFloat(inputs.currentWeight);
    const goalWeightRaw = parseFloat(inputs.goalWeight);
    const weeklyLossPercentRaw = parseFloat(inputs.weeklyLossPercent);

    if (
      !currentWeightRaw ||
      currentWeightRaw <= 0 ||
      !goalWeightRaw ||
      goalWeightRaw <= 0 ||
      !weeklyLossPercentRaw ||
      weeklyLossPercentRaw <= 0
    )
      return {
        value: 0,
        label: "Enter valid details above to calculate.",
        subtext: "",
        warning: null,
      };

    // Convert weights to kg if imperial
    const currentWeightKg =
      unit === "imperial" ? currentWeightRaw / 2.20462 : currentWeightRaw;
    const goalWeightKg =
      unit === "imperial" ? goalWeightRaw / 2.20462 : goalWeightRaw;

    if (goalWeightKg >= currentWeightKg)
      return {
        value: 0,
        label: "Goal weight must be less than current weight.",
        subtext: "",
        warning:
          "Weight loss planner is designed for dogs needing to lose weight. For weight gain, consult a vet.",
      };

    // Calculate Resting Energy Requirement (RER) at goal weight
    // RER = 70 * (goalWeightKg)^0.75
    const RER = 70 * Math.pow(goalWeightKg, 0.75);

    // Calculate safe weekly weight loss in kg
    // Safe weight loss is typically 1-2% of current body weight per week
    const weeklyLossKg = (weeklyLossPercentRaw / 100) * currentWeightKg;

    // Calculate total weight to lose
    const totalLossKg = currentWeightKg - goalWeightKg;

    // Calculate estimated weeks to reach goal weight
    const weeksToGoal = totalLossKg / weeklyLossKg;

    // Calculate daily calorie intake for weight loss
    // Weight loss calorie intake = RER * factor (usually 0.8 for weight loss)
    // Factor 0.8 means feeding 80% of RER to induce weight loss safely
    const weightLossCalories = Math.round(RER * 0.8);

    // Format output values
    const caloriesLabel = `${weightLossCalories} kcal/day`;
    const timelineLabel = `${Math.ceil(weeksToGoal)} week${
      weeksToGoal > 1 ? "s" : ""
    }`;

    // Warnings for unrealistic inputs
    let warning = null;
    if (weeklyLossPercentRaw > 3) {
      warning =
        "Weekly weight loss above 3% is generally unsafe and not recommended without veterinary supervision.";
    }

    return {
      value: caloriesLabel,
      label: "Recommended daily calorie intake for weight loss",
      subtext: `Estimated time to reach goal weight: ${timelineLabel}`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "How much weight should my dog lose per week?",
      answer: "Most vets recommend 1-2% of body weight per week for safe weight loss. A 50-pound dog should lose 0.5-1 pound weekly, typically reaching goal weight in 4-6 months.",
    },
    {
      question: "What daily calorie reduction is needed for dog weight loss?",
      answer: "Create a 500-calorie daily deficit to lose about 1 pound per week. For example, a dog needing 1,500 calories should eat 1,000 calories daily.",
    },
    {
      question: "Does the calculator account for different dog breeds?",
      answer: "Yes, the planner adjusts for breed size and metabolism. Larger breeds like Labs have higher baseline calorie needs than small breeds like Chihuahuas.",
    },
    {
      question: "How often should I weigh my dog during the weight loss program?",
      answer: "Weigh your dog weekly at the same time of day on the same scale for accurate tracking. Monthly measurements also help track progress and adjust the plan.",
    },
    {
      question: "Can I use the calculator if my dog has a medical condition?",
      answer: "Consult your veterinarian first if your dog has thyroid issues, diabetes, or joint problems. The calculator provides estimates but shouldn't replace professional medical advice.",
    },
    {
      question: "What if my dog isn't losing weight as predicted?",
      answer: "Adjust calorie intake downward by 10% or increase exercise gradually. Hidden treats and table scraps often sabotage plans; track all food consumed.",
    },
    {
      question: "Is exercise factored into the weight loss calculations?",
      answer: "The calculator uses baseline metabolism; adding 20-30 minutes of daily walks increases calorie burn by 15-25%, speeding weight loss results.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // INPUT HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "weeklyLossPercent") {
      // Allow only numbers and decimal point, max 5 chars
      if (!/^\d*\.?\d*$/.test(value) || value.length > 5) return;
    }
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
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

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentWeight" className="text-slate-700 dark:text-slate-300">
              Current Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="currentWeight"
              name="currentWeight"
              type="number"
              min="0"
              step="any"
              value={inputs.currentWeight}
              onChange={handleInputChange}
              placeholder={`Enter current weight in ${unit === "imperial" ? "lbs" : "kg"}`}
              aria-describedby="currentWeightHelp"
            />
          </div>
          <div>
            <Label htmlFor="goalWeight" className="text-slate-700 dark:text-slate-300">
              Goal Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="goalWeight"
              name="goalWeight"
              type="number"
              min="0"
              step="any"
              value={inputs.goalWeight}
              onChange={handleInputChange}
              placeholder={`Enter goal weight in ${unit === "imperial" ? "lbs" : "kg"}`}
              aria-describedby="goalWeightHelp"
            />
          </div>
          <div>
            <Label htmlFor="weeklyLossPercent" className="text-slate-700 dark:text-slate-300">
              Weekly Weight Loss Target (% of current weight)
            </Label>
            <Input
              id="weeklyLossPercent"
              name="weeklyLossPercent"
              type="number"
              min="0.5"
              max="3"
              step="0.1"
              value={inputs.weeklyLossPercent}
              onChange={handleInputChange}
              placeholder="Recommended: 1-2%"
              aria-describedby="weeklyLossHelp"
            />
            <p id="weeklyLossHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Safe range is 1-2% per week; max 3% without vet supervision.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ currentWeight: "", goalWeight: "", weeklyLossPercent: "2" })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}

              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Weight Loss Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Dog Weight Loss Planner calculates a personalized calorie target and timeline for safe, sustainable weight loss. It helps pet owners create realistic goals based on their dog's current weight, target weight, and breed characteristics.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your dog's current weight, goal weight, age, activity level, and breed into the calculator. The tool uses veterinary guidelines to determine daily calorie needs and the recommended 1-2% weekly weight loss rate.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review your results to see daily calorie targets, estimated timeline to goal weight, and suggested exercise adjustments. Monitor weekly progress and adjust portions if your dog isn't losing weight as predicted.</p>
        </div>
      </section>

      {/* TABLE: Daily Calorie Needs by Dog Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calorie Needs by Dog Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to estimate baseline daily calorie requirements before weight loss adjustments.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maintenance Calories</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">75% Intake (Weight Loss)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Weight Loss Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">190-260</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1-0.2 lbs/week</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">450-650</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">340-490</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2-0.4 lbs/week</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40-60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900-1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">675-900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-0.8 lbs/week</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">70-90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,400-1,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,050-1,350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8-1.2 lbs/week</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2+ lbs/week</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values based on average adult dogs with moderate activity; adjust for age, metabolism, and health status.</p>
      </section>

      {/* TABLE: Weight Loss Timeline Projections */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Weight Loss Timeline Projections</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Expected timeframes to reach goal weight based on starting weight and daily calorie deficit.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Starting Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Goal Weight Loss</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">500 Cal Deficit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">750 Cal Deficit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">1000 Cal Deficit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 lbs (25%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-7 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 weeks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 lbs (25%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13-14 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 weeks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15 lbs (25%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15 weeks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">80 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 lbs (25%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 weeks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 lbs (25%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33-34 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 weeks</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Timelines assume consistent adherence and no metabolic adaptations; individual results vary.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a kitchen scale to measure food portions accurately; most pet owners overfeed by 20-30% without realizing it.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Incorporate low-calorie treats like carrots and green beans instead of high-fat commercial treats to stay within calorie limits.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Increase daily walks gradually to 30-45 minutes to boost calorie burn without shocking joints on overweight dogs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your dog at your vet's office monthly using their calibrated scale for consistency and professional oversight.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Treat Calories</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Treats should comprise no more than 10% of daily calories; many owners skip this when calculating totals, stalling weight loss.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Cutting Calories Too Drastically</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Reducing food by more than 25-30% can cause nutritional deficiencies and slow metabolism, actually hindering long-term weight loss.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for Age and Activity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Senior dogs have slower metabolisms and require 10-15% fewer calories than young adults; the calculator accounts for this difference.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Expecting Immediate Results</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Weight loss takes 4-6 months minimum; dogs losing faster than 2% weekly risk muscle loss and metabolic damage.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much weight should my dog lose per week?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most vets recommend 1-2% of body weight per week for safe weight loss. A 50-pound dog should lose 0.5-1 pound weekly, typically reaching goal weight in 4-6 months.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What daily calorie reduction is needed for dog weight loss?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Create a 500-calorie daily deficit to lose about 1 pound per week. For example, a dog needing 1,500 calories should eat 1,000 calories daily.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the calculator account for different dog breeds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the planner adjusts for breed size and metabolism. Larger breeds like Labs have higher baseline calorie needs than small breeds like Chihuahuas.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I weigh my dog during the weight loss program?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Weigh your dog weekly at the same time of day on the same scale for accurate tracking. Monthly measurements also help track progress and adjust the plan.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the calculator if my dog has a medical condition?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Consult your veterinarian first if your dog has thyroid issues, diabetes, or joint problems. The calculator provides estimates but shouldn't replace professional medical advice.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my dog isn't losing weight as predicted?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Adjust calorie intake downward by 10% or increase exercise gradually. Hidden treats and table scraps often sabotage plans; track all food consumed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is exercise factored into the weight loss calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses baseline metabolism; adding 20-30 minutes of daily walks increases calorie burn by 15-25%, speeding weight loss results.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Dog Food Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official nutritional guidelines for dog food formulation and calorie requirements by life stage.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners/petcare/obesity-and-dogs" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association - Pet Obesity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based information on canine obesity risks and weight management strategies.</p>
          </li>
          <li>
            <a href="https://www.purina.com/articles/dog/nutrition/weight-management" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Purina Nutrition Science</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed guidance on dog calorie needs and weight loss feeding plans.</p>
          </li>
          <li>
            <a href="https://www.vin.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network - Obesity in Companion Animals</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional veterinary resource on managing canine obesity and calculating appropriate calorie intake.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Weight Loss Planner"
      description="Plan a safe and effective weight loss program for your dog. Calculates target calories and timeline for goal weight achievement."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "RER = 70 × (Goal Weight in kg)^0.75; Daily Calories = RER × 0.8; Weeks to Goal = (Current Weight - Goal Weight) / (Weekly Loss % × Current Weight)",
        variables: [
          {
            symbol: "RER",
            description:
              "Resting Energy Requirement - baseline calories needed at rest for goal weight",
          },
          {
            symbol: "Goal Weight",
            description: "Target body weight in kilograms",
          },
          {
            symbol: "Daily Calories",
            description:
              "Recommended daily calorie intake to achieve weight loss safely",
          },
          {
            symbol: "Weekly Loss %",
            description:
              "Desired weekly weight loss percentage of current body weight (e.g., 0.02 for 2%)",
          },
          {
            symbol: "Weeks to Goal",
            description:
              "Estimated number of weeks to reach the goal weight at the specified weekly loss rate",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30 lb (13.6 kg) dog currently overweight aims to reach a healthy weight of 24 lb (10.9 kg) with a weekly weight loss target of 2%.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weights to kilograms: Current = 13.6 kg, Goal = 10.9 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate RER at goal weight: 70 × 10.9^0.75 ≈ 440 kcal/day.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate daily calories for weight loss: 440 × 0.8 = 352 kcal/day.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate weekly weight loss in kg: 2% × 13.6 = 0.272 kg/week.",
          },
          {
            label: "Step 5",
            explanation:
              "Calculate weeks to goal: (13.6 - 10.9) / 0.272 ≈ 10 weeks.",
          },
        ],
        result:
          "Feed approximately 352 kcal/day. Estimated time to reach goal weight is about 10 weeks with safe, gradual weight loss.",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "🍖",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
        {
          title: "Dog Daily Water Intake Checker",
          url: "/pets/dog-daily-water-intake-checker",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog Weight Loss Planner" },
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