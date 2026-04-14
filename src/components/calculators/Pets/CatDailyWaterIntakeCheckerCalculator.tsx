import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatDailyWaterIntakeCheckerCalculator() {
  // 1. STATE
  // Weight and volume involved => keep unit switcher
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");

  // Inputs: weight only (kg or lbs)
  const [inputs, setInputs] = useState<{ weight?: string }>({ weight: "" });

  // 2. LOGIC ENGINE
  // Formula source:
  // Cats require approximately 50 ml of water per kg of body weight daily.
  // This includes water from food and drinking water.
  // For dry food fed cats, water intake should be closely monitored.
  // Reference: National Research Council, 2006; WSAVA Nutrition Guidelines

  // Conversion helpers
  const lbsToKg = (lbs: number) => lbs * 0.45359237;
  const mlToOz = (ml: number) => ml * 0.033814;

  const results = useMemo(() => {
    if (!inputs.weight) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    let weightKg: number;
    if (unit === "imperial") {
      const weightLbs = parseFloat(inputs.weight);
      if (isNaN(weightLbs) || weightLbs <= 0) {
        return {
          value: 0,
          label: "",
          subtext: "",
          warning: "Please enter a valid positive weight.",
        };
      }
      weightKg = lbsToKg(weightLbs);
    } else {
      const weightMetric = parseFloat(inputs.weight);
      if (isNaN(weightMetric) || weightMetric <= 0) {
        return {
          value: 0,
          label: "",
          subtext: "",
          warning: "Please enter a valid positive weight.",
        };
      }
      weightKg = weightMetric;
    }

    // Calculate daily water intake in ml
    // Typical recommendation: 50 ml/kg/day
    const waterMl = weightKg * 50;

    // Convert result to user preferred volume unit
    let displayValue: number;
    let displayLabel: string;
    if (unit === "imperial") {
      // Convert ml to fluid ounces (oz)
      displayValue = parseFloat((mlToOz(waterMl)).toFixed(2));
      displayLabel = "fl oz per day";
    } else {
      displayValue = parseFloat(waterMl.toFixed(0));
      displayLabel = "ml per day";
    }

    // Warning if weight is unusually low or high for typical cats
    let warning: string | null = null;
    if (weightKg < 2) {
      warning = "Weight entered is very low; ensure this is accurate for your cat.";
    } else if (weightKg > 10) {
      warning = "Weight entered is high; consult your vet for personalized water needs.";
    }

    return {
      value: displayValue,
      label: displayLabel,
      subtext: `Based on a daily water requirement of 50 ml per kg of body weight.`,
      warning,
    };
  }, [inputs.weight, unit]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "How much water should my cat drink daily?",
      answer: "Most cats need 40-60 mL of water per kilogram of body weight daily, or roughly 8-10 ounces per 5 pounds. This varies based on diet, activity level, and health status.",
    },
    {
      question: "Does wet food count toward my cat's daily water intake?",
      answer: "Yes, wet food contains 70-80% moisture and contributes significantly to hydration. A cat eating mostly wet food may need less additional water than one on dry kibble.",
    },
    {
      question: "What factors affect how much water a cat needs?",
      answer: "Age, weight, activity level, diet type, climate, and health conditions like kidney disease or diabetes all impact water requirements. Indoor cats typically need less than outdoor cats.",
    },
    {
      question: "How do I know if my cat is drinking enough water?",
      answer: "Signs of proper hydration include normal energy levels, moist gums, and pale pink mucous membranes. Dehydration signs include lethargy, dry mouth, and dark urine.",
    },
    {
      question: "Should I use this calculator if my cat has kidney disease?",
      answer: "Cats with kidney disease often need more water intake; consult your veterinarian for personalized hydration goals rather than relying solely on this calculator.",
    },
    {
      question: "Why does my cat drink more water in summer?",
      answer: "Higher temperatures increase evaporation and metabolic demands, causing cats to drink 10-20% more water during warm months to maintain hydration.",
    },
    {
      question: "Can I use this calculator for kittens and senior cats?",
      answer: "Kittens have higher water needs per pound of body weight, while senior cats may need more due to declining kidney function; adjust results accordingly or consult a vet.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. JSX WIDGET
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

      {/* WEIGHT INPUT */}
      <div className="space-y-1">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min={0}
          step="any"
          placeholder={unit === "imperial" ? "e.g. 10" : "e.g. 4.5"}
          value={inputs.weight ?? ""}
          onChange={(e) => setInputs({ weight: e.target.value })}
          aria-describedby="weight-desc"
        />
        <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400">
          Enter your cat’s current body weight.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "" })}
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

  // 5. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Daily Water Intake Checker for Cats</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates your cat's optimal daily water intake based on body weight, diet type, and lifestyle factors. It helps you monitor hydration and identify potential dehydration risks.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your cat's weight in pounds, select their primary diet (dry, wet, or mixed), and note their activity level and any health conditions. The tool accounts for moisture content in food to provide a realistic water target.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Compare your cat's actual drinking to the recommended amount and adjust water availability accordingly. If results suggest concerning hydration issues, consult your veterinarian, especially for cats with kidney disease or other conditions.</p>
        </div>
      </section>

      {/* TABLE: Daily Water Intake Guidelines by Cat Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Water Intake Guidelines by Cat Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to estimate baseline daily water needs based on your cat's weight in pounds.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Water Need (mL)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Water Need (oz)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.4-5.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Small/young cats</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160-240</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.4-8.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Average adult cat</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.8-10.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium-large cat</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240-360</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.1-12.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large/senior cat</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.1-15.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extra-large cat</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are baseline estimates; individual needs vary by diet, activity, and health status.</p>
      </section>

      {/* TABLE: Water Content in Common Cat Foods */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Water Content in Common Cat Foods</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different diets contribute varying amounts of water to your cat's daily intake.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Water Content (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Serving (oz)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Water per Serving (oz)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dry Kibble</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.05-0.06</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wet Food (Pâté)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.25-2.4</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Raw Diet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70-75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.1-2.25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Semi-moist</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-0.7</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Broths/Toppers</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90-95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.9-0.95</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Cats on high-moisture diets require significantly less additional water from drinking.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Place multiple water bowls throughout your home to encourage your cat to drink more frequently and stay hydrated.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a cat water fountain; many cats prefer running water and drink 20-30% more from fountains than bowls.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your cat's urine color—pale yellow indicates good hydration, while dark yellow suggests dehydration.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Offer water at different temperatures; some cats prefer cool water while others drink more from room-temperature or slightly warm water.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Diet Composition</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming a cat needs the same water amount regardless of diet ignores that wet food provides 75-80% of daily hydration needs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Individual Variation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using calculator results as absolute requirements instead of guidelines fails to account for breed differences, metabolism, and personal preferences.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Health Conditions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying standard guidelines to cats with diabetes, hyperthyroidism, or kidney disease can lead to inadequate or excessive water intake targets.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Seasonal Adjustments</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Not increasing water recommendations during hot months or in heated indoor environments results in preventable dehydration.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much water should my cat drink daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most cats need 40-60 mL of water per kilogram of body weight daily, or roughly 8-10 ounces per 5 pounds. This varies based on diet, activity level, and health status.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does wet food count toward my cat's daily water intake?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, wet food contains 70-80% moisture and contributes significantly to hydration. A cat eating mostly wet food may need less additional water than one on dry kibble.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect how much water a cat needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Age, weight, activity level, diet type, climate, and health conditions like kidney disease or diabetes all impact water requirements. Indoor cats typically need less than outdoor cats.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know if my cat is drinking enough water?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Signs of proper hydration include normal energy levels, moist gums, and pale pink mucous membranes. Dehydration signs include lethargy, dry mouth, and dark urine.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I use this calculator if my cat has kidney disease?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cats with kidney disease often need more water intake; consult your veterinarian for personalized hydration goals rather than relying solely on this calculator.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does my cat drink more water in summer?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Higher temperatures increase evaporation and metabolic demands, causing cats to drink 10-20% more water during warm months to maintain hydration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for kittens and senior cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Kittens have higher water needs per pound of body weight, while senior cats may need more due to declining kidney function; adjust results accordingly or consult a vet.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Nutritional Requirements for Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidelines for feline nutritional standards including water and moisture requirements for different life stages.</p>
          </li>
          <li>
            <a href="https://www.icatcare.org/advice/hydration" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Cat Care: Hydration in Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based information on feline water needs and the benefits of wet food and water fountains.</p>
          </li>
          <li>
            <a href="https://www.avma.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional veterinary organization providing guidelines on feline nutrition, hydration, and health management.</p>
          </li>
          <li>
            <a href="https://journals.sagepub.com/home/jfm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of Feline Medicine and Surgery: Water Intake Studies</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on cat hydration, dietary water content, and health outcomes related to dehydration.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Daily Water Intake Checker for Cats"
      description="Check if your cat is meeting its daily fluid requirement, crucial for kidney health, especially with dry food diets."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Daily Water Intake (ml) = 50 × Body Weight (kg)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Your cat's weight in kilograms" },
          { symbol: "50 (ml/kg)", description: "Recommended daily water intake per kilogram of body weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb (4.54 kg) domestic cat primarily fed dry food needs adequate hydration to prevent urinary issues.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed: 10 lb × 0.4536 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate water intake: 50 ml × 4.54 kg = 227 ml per day.",
          },
          {
            label: "3",
            explanation:
              "Convert to fluid ounces if preferred: 227 ml × 0.0338 = 7.67 fl oz per day.",
          },
        ],
        result: "The cat should consume approximately 227 ml (7.67 fl oz) of water daily.",
      }}
      relatedCalculators={[
        { title: "Common Toxic Foods Reference", url: "/pets/small-mammal-common-toxic-foods-reference", icon: "🐾" },
        { title: "Calcium + D3 Supplement Calculator", url: "/pets/reptile-calcium-d3-supplement", icon: "🐶" },
        { title: "Temperature Stress Risk (Rabbit Heatstroke)", url: "/pets/rabbit-temperature-stress-risk-heatstroke", icon: "🐱" },
        { title: "Horse Gestation (Due Date) Calculator", url: "/pets/horse-gestation-due-date", icon: "🐎" },
        { title: "Dehydration Risk Estimator (Skin Turgor + Mucous Check)", url: "/pets/horse-dehydration-risk-estimator", icon: "💉" },
        { title: "Ambient Temperature Safe Zone Calculator", url: "/pets/bird-ambient-temperature-safe-zone", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Daily Water Intake Checker for Cats" },
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