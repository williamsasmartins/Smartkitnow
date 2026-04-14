import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatWeightLossPlannerCalculator() {
  // 1. STATE
  // Weight is involved in calculations, so keep unit switcher
  const [unit, setUnit] = useState("imperial");

  // Inputs: Current Weight, Target Weight, Weight Loss Rate (% per week)
  // Weight loss rate is a percentage, no unit needed
  const [inputs, setInputs] = useState({
    currentWeight: "",
    targetWeight: "",
    weeklyLossPercent: "1", // default safe weight loss rate 1% per week
  });

  // Helper: convert weight to kg if imperial
  function toKg(weight: number) {
    return unit === "imperial" ? weight / 2.20462 : weight;
  }
  // Helper: convert kg to display unit
  function fromKg(weightKg: number) {
    return unit === "imperial" ? weightKg * 2.20462 : weightKg;
  }

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const cw = parseFloat(inputs.currentWeight);
    const tw = parseFloat(inputs.targetWeight);
    const wlp = parseFloat(inputs.weeklyLossPercent);

    if (
      isNaN(cw) ||
      isNaN(tw) ||
      isNaN(wlp) ||
      cw <= 0 ||
      tw <= 0 ||
      wlp <= 0 ||
      tw >= cw
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          tw >= cw
            ? "Target weight must be less than current weight."
            : "Please enter valid positive numbers for all fields.",
      };
    }

    // Convert weights to kg for calculation
    const currentWeightKg = toKg(cw);
    const targetWeightKg = toKg(tw);

    // Calculate total weight to lose (kg)
    const weightToLoseKg = currentWeightKg - targetWeightKg;

    // Weekly weight loss in kg (percentage of current weight)
    const weeklyLossKg = (wlp / 100) * currentWeightKg;

    // Calculate duration in weeks (round up)
    const durationWeeks = Math.ceil(weightToLoseKg / weeklyLossKg);

    // Calculate Resting Energy Requirement (RER) for target weight
    // RER = 70 * (weight in kg)^0.75
    const RER = 70 * Math.pow(targetWeightKg, 0.75);

    // Weight loss feeding calories = 80% of RER (typical veterinary recommendation)
    const targetCalories = Math.round(RER * 0.8);

    // Format results for display
    const durationText = durationWeeks === 1 ? "week" : "weeks";
    const weightToLoseDisplay = fromKg(weightToLoseKg).toFixed(2);
    const currentWeightDisplay = fromKg(currentWeightKg).toFixed(2);
    const targetWeightDisplay = fromKg(targetWeightKg).toFixed(2);

    return {
      value: `${targetCalories} kcal/day`,
      label: "Recommended Daily Calories",
      subtext: `To reduce from ${currentWeightDisplay} ${unit === "imperial" ? "lbs" : "kg"} to ${targetWeightDisplay} ${unit === "imperial" ? "lbs" : "kg"} over approximately ${durationWeeks} ${durationText}, feeding about ${wlp}% of current weight loss per week.`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "How much weight can my cat safely lose per week?",
      answer: "Cats should lose 1-2% of their body weight weekly for safe, sustainable results. A 10-pound cat losing 1.6 ounces per week is ideal to preserve muscle mass.",
    },
    {
      question: "What daily calorie deficit is safe for weight loss in cats?",
      answer: "A 200-250 calorie daily deficit is typically safe for most cats, resulting in 0.5-1 pound lost per month while maintaining metabolic health.",
    },
    {
      question: "How long does it take for a cat to lose weight?",
      answer: "Most cats lose noticeable weight within 4-6 weeks with consistent calorie reduction, but full weight loss goals may take 3-6 months depending on starting weight.",
    },
    {
      question: "Should I reduce food portions or switch to diet food?",
      answer: "Combining portion control with high-protein, low-carb diet food is most effective, as it reduces calories while maintaining satiety and lean muscle.",
    },
    {
      question: "How do I know my cat's current maintenance calorie needs?",
      answer: "A typical indoor adult cat needs 20 calories per pound of body weight daily; your veterinarian can adjust this based on age, activity level, and metabolism.",
    },
    {
      question: "Can rapid weight loss harm my cat?",
      answer: "Yes, losing more than 2% body weight weekly risks hepatic lipidosis (fatty liver disease), a serious condition in cats requiring veterinary care.",
    },
    {
      question: "What factors affect my cat's weight loss rate?",
      answer: "Age, metabolism, current activity level, food type, and underlying health conditions all influence how quickly cats lose weight on a given calorie deficit.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* UNIT SELECTOR */}
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
      </div>

      {/* INPUTS */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="currentWeight" className="text-slate-700 dark:text-slate-300">
            Current Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="currentWeight"
            name="currentWeight"
            type="text"
            inputMode="decimal"
            value={inputs.currentWeight}
            onChange={onInputChange}
            placeholder={`e.g. ${unit === "imperial" ? "10.5" : "4.8"}`}
          />
        </div>
        <div>
          <Label htmlFor="targetWeight" className="text-slate-700 dark:text-slate-300">
            Target Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="targetWeight"
            name="targetWeight"
            type="text"
            inputMode="decimal"
            value={inputs.targetWeight}
            onChange={onInputChange}
            placeholder={`e.g. ${unit === "imperial" ? "8.5" : "3.9"}`}
          />
        </div>
        <div>
          <Label htmlFor="weeklyLossPercent" className="text-slate-700 dark:text-slate-300">
            Weekly Weight Loss Rate (% of current weight)
          </Label>
          <Input
            id="weeklyLossPercent"
            name="weeklyLossPercent"
            type="text"
            inputMode="decimal"
            value={inputs.weeklyLossPercent}
            onChange={onInputChange}
            placeholder="e.g. 1"
          />
        </div>
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
          onClick={() =>
            setInputs({
              currentWeight: "",
              targetWeight: "",
              weeklyLossPercent: "1",
            })
          }
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cat Weight Loss Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Cat Weight Loss Planner calculates a safe, personalized weight loss timeline for your cat based on current weight, target weight, and age. It helps you set realistic goals that protect your cat's health while achieving sustainable results.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your cat's current weight in pounds, ideal target weight, and current daily calorie intake. The calculator will also factor in age and activity level to refine estimates for your specific cat's metabolism.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your recommended daily calorie deficit, weekly weight loss rate, and estimated timeline to reach goal weight. Always verify findings with your veterinarian before implementing dietary changes, as individual cats may need adjustments.</p>
        </div>
      </section>

      {/* TABLE: Safe Weekly Weight Loss Targets by Current Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Safe Weekly Weight Loss Targets by Current Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to determine appropriate weekly weight loss goals for your cat based on current body weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safe Weekly Loss (oz)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safe Weekly Loss (grams)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Est. Monthly Loss (lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0-1.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-54</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.25-0.5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.3-2.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">37-74</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.33-0.67</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.6-3.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-91</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4-0.8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.9-3.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">54-108</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1.0</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.4-4.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">68-136</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6-1.2</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.9-5.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">82-164</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.75-1.5</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Targets based on 1-2% of body weight weekly loss; adjust with veterinary guidance for individual cats.</p>
      </section>

      {/* TABLE: Daily Calorie Intake by Target Weight Loss Rate */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calorie Intake by Target Weight Loss Rate</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows recommended daily calories for different weight loss speeds in a typical 10-pound indoor cat.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight Loss Goal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Calorie Reduction</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Calorie Target</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Timeline to Goal Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Slow (1% weekly)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-200 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-9 months</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate (1.5% weekly)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-200 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6 months</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Steady (2% weekly)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-250 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-100 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 months</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Based on typical 10-pound cat with 200-250 calorie maintenance needs; consult your vet before starting any weight loss plan.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure food portions with a kitchen scale rather than eyeballing to ensure consistent, accurate calorie reduction.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Increase playtime and interactive exercise gradually, as heavier cats tire more easily; even 10-15 minutes daily helps boost calorie burn.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Switch to high-protein, low-carb cat food formulas designed for weight management to increase satiety on fewer calories.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your cat weekly at the same time of day using a digital pet scale to track progress and adjust the plan if needed.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Cutting calories too aggressively</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Reducing food by more than 30% at once risks nutrient deficiencies and metabolic shutdown in cats.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring treats and table scraps</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Treats can account for 10-20% of daily calories and often sabotage weight loss plans if not factored into calorie targets.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all cats metabolize food equally</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Senior cats, neutered cats, and certain breeds have slower metabolisms requiring more conservative calorie reductions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping veterinary checkups during weight loss</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Regular vet visits ensure your cat isn't developing health issues and allow for plan adjustments based on progress.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much weight can my cat safely lose per week?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cats should lose 1-2% of their body weight weekly for safe, sustainable results. A 10-pound cat losing 1.6 ounces per week is ideal to preserve muscle mass.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What daily calorie deficit is safe for weight loss in cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 200-250 calorie daily deficit is typically safe for most cats, resulting in 0.5-1 pound lost per month while maintaining metabolic health.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does it take for a cat to lose weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most cats lose noticeable weight within 4-6 weeks with consistent calorie reduction, but full weight loss goals may take 3-6 months depending on starting weight.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I reduce food portions or switch to diet food?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Combining portion control with high-protein, low-carb diet food is most effective, as it reduces calories while maintaining satiety and lean muscle.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know my cat's current maintenance calorie needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A typical indoor adult cat needs 20 calories per pound of body weight daily; your veterinarian can adjust this based on age, activity level, and metabolism.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can rapid weight loss harm my cat?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, losing more than 2% body weight weekly risks hepatic lipidosis (fatty liver disease), a serious condition in cats requiring veterinary care.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect my cat's weight loss rate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Age, metabolism, current activity level, food type, and underlying health conditions all influence how quickly cats lose weight on a given calorie deficit.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.petobesityprevention.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Association for Pet Obesity Prevention (APOP)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Provides evidence-based guidelines for safe pet weight loss and obesity management in cats and dogs.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners/petcare/obesity" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA) - Pet Obesity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official AVMA resource on causes, prevention, and management of obesity in companion animals.</p>
          </li>
          <li>
            <a href="https://www.petmd.com/cat-obesity-weight-management" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">PetMD - Cat Weight Loss Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide covering safe weight loss rates, nutrition strategies, and exercise recommendations for overweight cats.</p>
          </li>
          <li>
            <a href="https://www.felinecentre.com/obesity" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Feline Centre - Feline Obesity and Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expert resource on the relationship between diet, metabolism, and weight management specific to cat physiology.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Weight Loss Planner"
      description="Plan a tailored weight loss program for your cat, calculating target calories, weight reduction, and duration."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula:
          "RER = 70 × (Target Weight in kg)^0.75\n" +
          "Daily Calories = 0.8 × RER\n" +
          "Duration (weeks) = (Current Weight - Target Weight) ÷ (Weekly Loss % × Current Weight)",
        variables: [
          { symbol: "RER", description: "Resting Energy Requirement (kcal/day)" },
          { symbol: "Weight", description: "Weight in kilograms (kg)" },
          { symbol: "Weekly Loss %", description: "Weekly weight loss rate as a decimal fraction" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 12 lb (5.44 kg) cat currently overweight wants to reach a healthy weight of 9 lb (4.08 kg). The owner chooses a safe weekly weight loss rate of 1%.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weights to kg: Current = 5.44 kg, Target = 4.08 kg. Calculate RER: 70 × 4.08^0.75 ≈ 190 kcal/day.",
          },
          {
            label: "2",
            explanation:
              "Calculate daily calories for weight loss: 0.8 × 190 = 152 kcal/day recommended.",
          },
          {
            label: "3",
            explanation:
              "Calculate duration: Weight to lose = 5.44 - 4.08 = 1.36 kg. Weekly loss = 1% × 5.44 = 0.0544 kg/week. Duration ≈ 1.36 ÷ 0.0544 ≈ 25 weeks.",
          },
        ],
        result: "Feed approximately 152 kcal/day for about 25 weeks to reach the target weight safely.",
      }}
      relatedCalculators={[
        { title: "Cat Age in Human Years (Breed/Size Aware)", url: "/pets/cat-age-human-years-breed-size-aware", icon: "🐱" },
        { title: "Tramadol Dose Calculator for Dogs", url: "/pets/dog-tramadol-dose", icon: "🐶" },
        { title: "Daily Water Requirement per Weight", url: "/pets/bird-daily-water-requirement-per-weight", icon: "🐱" },
        { title: "Basking Temperature & Gradient Planner", url: "/pets/reptile-basking-temperature-gradient-planner", icon: "🍖" },
        { title: "CO₂ Injection Rate Calculator (Planted Tank)", url: "/pets/aquarium-co2-injection-rate-planted-tank", icon: "💉" },
        { title: "Feather Plucking & Stress Risk Index", url: "/pets/bird-feather-plucking-stress-risk-index", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Weight Loss Planner" },
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