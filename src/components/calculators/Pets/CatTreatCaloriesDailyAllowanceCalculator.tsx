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
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatTreatCaloriesDailyAllowanceCalculator() {
  // 1. STATE
  // Weight and volume involved, so keep unit switcher
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");

  // Inputs: weight (lbs or kg), treat calories per treat (kcal), daily calorie allowance (kcal)
  // We only need weight and treat calories per treat as inputs; daily allowance is calculated.
  const [inputs, setInputs] = useState<{
    weight: string;
    treatCalories: string;
  }>({
    weight: "",
    treatCalories: "",
  });

  // 2. LOGIC ENGINE
  // Calculate:
  // 1. RER = 70 * (weight_kg)^0.75
  // 2. Daily Calorie Allowance = RER * 1.2 (average maintenance factor for indoor cats)
  // 3. Max treats per day = (Daily Calorie Allowance * 0.10) / treatCalories
  //  - Treat calories per treat must be > 0
  //  - Weight must be > 0
  //  - Show warnings if inputs invalid or unrealistic

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const treatCalNum = parseFloat(inputs.treatCalories);

    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive weight.",
      };
    }
    if (isNaN(treatCalNum) || treatCalNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive treat calorie value.",
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate RER
    const rer = 70 * Math.pow(weightKg, 0.75);

    // Maintenance Energy Requirement (MER) for indoor cats ~1.2 * RER
    const mer = rer * 1.2;

    // Max calories from treats = 10% of MER
    const maxTreatCalories = mer * 0.1;

    // Max treats per day
    const maxTreats = maxTreatCalories / treatCalNum;

    // Round results nicely
    const rerRounded = Math.round(rer);
    const merRounded = Math.round(mer);
    const maxTreatCaloriesRounded = Math.round(maxTreatCalories);
    const maxTreatsRounded = Math.floor(maxTreats);

    let warning: string | null = null;
    if (maxTreatsRounded < 1) {
      warning =
        "Treat calories are high relative to your cat's needs. Limit treats accordingly.";
    }

    return {
      value: maxTreatsRounded > 0 ? maxTreatsRounded : 0,
      label: "Maximum Treats Per Day",
      subtext: `Based on a daily calorie allowance of ~${merRounded} kcal (RER: ${rerRounded} kcal). Treat calories capped at 10% of daily intake (~${maxTreatCaloriesRounded} kcal).`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "What percentage of my cat's daily calories should come from treats?",
      answer: "Treats should not exceed 10% of your cat's total daily caloric intake. The remaining 90% should come from balanced, complete cat food to ensure proper nutrition.",
    },
    {
      question: "How do I know my cat's daily calorie requirement?",
      answer: "Most adult cats need 200–250 calories per day, but this varies by weight, age, and activity level. Your veterinarian can provide a personalized calorie recommendation based on your cat's health profile.",
    },
    {
      question: "Are all commercial cat treats equal in calories?",
      answer: "No, calorie content varies significantly by brand and type. Freeze-dried treats contain more calories per gram than soft treats, so always check the nutrition label.",
    },
    {
      question: "Can I use this calculator for kittens and senior cats?",
      answer: "Kittens have higher caloric needs (up to 300 calories daily), and senior cats may need fewer calories. Adjust inputs based on your vet's recommendations for age-specific needs.",
    },
    {
      question: "What happens if my cat exceeds the 10% treat allowance daily?",
      answer: "Consistent overfeeding of treats can lead to weight gain, nutritional imbalances, and obesity-related health issues like diabetes and joint problems.",
    },
    {
      question: "How do I account for training treats used throughout the day?",
      answer: "Log all treats consumed, including training rewards and dental chews, in your daily total to stay within the 10% threshold and prevent overfeeding.",
    },
    {
      question: "Should I adjust treats if my cat is overweight or underweight?",
      answer: "Yes, overweight cats need reduced treat allowances, while underweight cats may tolerate slightly higher treat intake. Always consult your vet before adjusting your cat's diet.",
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
          <Select value={unit} onValueChange={(v) => setUnit(v as "imperial" | "metric")}>
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
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Accurate weight is essential for precise calorie calculations.
          </p>
        </div>

        <div>
          <Label htmlFor="treatCalories" className="text-slate-700 dark:text-slate-300">
            Calories per Treat (kcal)
          </Label>
          <Input
            id="treatCalories"
            type="number"
            min={0}
            step="any"
            placeholder="Enter calories per single treat"
            value={inputs.treatCalories}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, treatCalories: e.target.value }))
            }
            aria-describedby="treat-cal-desc"
          />
          <p id="treat-cal-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Find this on the treat packaging or manufacturer's website.
          </p>
        </div>
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
          onClick={() => setInputs({ weight: "", treatCalories: "" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a
              veterinarian for personalized diagnosis and feeding advice.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cat Treat Calories & Daily Allowance Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine safe daily treat portions for your cat by tracking calories and ensuring treats don't exceed 10% of total daily intake. It supports healthy weight management and prevents overfeeding.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your cat's weight, age, activity level, and current diet to establish baseline calorie needs. Then select treat types and quantities to see real-time calorie tracking and remaining allowance.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your cat's daily calorie limit, recommended treat allowance, and how much room remains for additional treats. Use this data to plan treat portions and maintain nutritional balance throughout the day.</p>
        </div>
      </section>

      {/* TABLE: Typical Cat Treat Calories by Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Typical Cat Treat Calories by Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference calories for common cat treats to help track daily intake.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Treat Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Serving Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calories per Serving</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calories per 100g</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Crunchy kibble treats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10 pieces</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350-380</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Soft/wet treats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 tablespoon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Freeze-dried meat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 pieces</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-450</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dental chew sticks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 stick</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-300</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tuna/salmon flakes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 teaspoon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-250</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lickable treats (tubes)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">½ tube</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120-180</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calorie values are averages; check product labels for exact nutritional data specific to your brand.</p>
      </section>

      {/* TABLE: Daily Calorie Allowance by Cat Weight */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calorie Allowance by Cat Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this reference to determine total daily calorie needs and appropriate treat limits.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Calorie Needs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">10% Treat Allowance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">90% Food Allowance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6-8 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-200 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-20 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">162-180 cal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8-10 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-250 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-225 cal</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10-12 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-280 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-28 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">225-252 cal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12-14 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280-320 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-32 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">252-288 cal</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">14+ lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320+ cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32+ cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">288+ cal</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are estimates for average indoor adult cats; consult your veterinarian for personalized recommendations.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure treats with a kitchen scale for accuracy instead of estimating portions by eye.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Choose lower-calorie treats like freeze-dried meat or small kibble pieces to extend your treat budget.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track training treats and dental chews in your daily total to avoid hidden calorie overages.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Rotate treat types to provide variety and prevent nutritional gaps in your cat's diet.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring treat calories entirely</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many owners underestimate treat impact; they add up quickly and can double daily calorie intake if unchecked.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using human food as treats</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Foods like tuna, cheese, and chicken are calorie-dense and often unsafe, disrupting nutritional balance and causing digestive upset.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not adjusting for activity level</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Indoor cats need fewer calories than outdoor or highly active cats; failing to adjust treat allowance can lead to obesity.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all wet treats are low-calorie</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some soft and lickable treats contain added oils and sugar, making them as calorie-dense as crunchy treats per serving.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What percentage of my cat's daily calories should come from treats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Treats should not exceed 10% of your cat's total daily caloric intake. The remaining 90% should come from balanced, complete cat food to ensure proper nutrition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know my cat's daily calorie requirement?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most adult cats need 200–250 calories per day, but this varies by weight, age, and activity level. Your veterinarian can provide a personalized calorie recommendation based on your cat's health profile.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are all commercial cat treats equal in calories?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, calorie content varies significantly by brand and type. Freeze-dried treats contain more calories per gram than soft treats, so always check the nutrition label.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for kittens and senior cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Kittens have higher caloric needs (up to 300 calories daily), and senior cats may need fewer calories. Adjust inputs based on your vet's recommendations for age-specific needs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my cat exceeds the 10% treat allowance daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Consistent overfeeding of treats can lead to weight gain, nutritional imbalances, and obesity-related health issues like diabetes and joint problems.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for training treats used throughout the day?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Log all treats consumed, including training rewards and dental chews, in your daily total to stay within the 10% threshold and prevent overfeeding.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust treats if my cat is overweight or underweight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, overweight cats need reduced treat allowances, while underweight cats may tolerate slightly higher treat intake. Always consult your vet before adjusting your cat's diet.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO (Association of American Feed Control Officials)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official standards for pet food nutrition and labeling requirements in the United States.</p>
          </li>
          <li>
            <a href="https://www.cats.org.uk/help-and-advice/health/nutrition" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Cats Protection Charity — Cat Nutrition Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based guidance on feline caloric needs, weight management, and treat recommendations.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care/cat-care/nutrition-and-diet" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA — Cat Food and Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource on balanced cat diets and safe treat practices from a veterinary perspective.</p>
          </li>
          <li>
            <a href="https://icatcare.org/advice/feline-nutrition/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Cat Care — Feline Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expert advice on meeting cats' unique nutritional requirements and preventing diet-related health issues.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // 6. FORMULA & EXAMPLE

  const formula = {
    title: "Scientific Formula",
    formula:
      "RER = 70 × (Weight_kg)^0.75\nDaily Calorie Allowance = RER × 1.2\nMax Treat Calories = Daily Calorie Allowance × 0.10\nMax Treats = Max Treat Calories ÷ Calories per Treat",
    variables: [
      { symbol: "Weight_kg", description: "Cat's weight in kilograms" },
      { symbol: "RER", description: "Resting Energy Requirement (kcal/day)" },
      { symbol: "Daily Calorie Allowance", description: "Estimated daily calories needed (kcal/day)" },
      { symbol: "Max Treat Calories", description: "Maximum calories from treats per day (kcal)" },
      { symbol: "Max Treats", description: "Maximum number of treats per day" },
    ],
  };

  const example = {
    title: "Case Study",
    scenario:
      "A 10 lb (4.54 kg) indoor cat is given treats that contain 5 kcal each. Calculate the maximum number of treats allowed per day.",
    steps: [
      {
        label: "1",
        explanation:
          "Convert weight to kg: 10 lbs ÷ 2.20462 = 4.54 kg",
      },
      {
        label: "2",
        explanation:
          "Calculate RER: 70 × (4.54)^0.75 ≈ 197 kcal/day",
      },
      {
        label: "3",
        explanation:
          "Calculate daily allowance: 197 × 1.2 = 236 kcal/day",
      },
      {
        label: "4",
        explanation:
          "Calculate max treat calories: 236 × 0.10 = 23.6 kcal/day",
      },
      {
        label: "5",
        explanation:
          "Calculate max treats: 23.6 ÷ 5 = 4.7 treats/day (rounded down to 4)",
      },
    ],
    result: "The cat can safely have up to 4 treats per day without exceeding 10% of its daily calorie allowance.",
  };

  return (
    <CalculatorVerticalLayout
      title="Cat Treat Calories & Daily Allowance"
      description="Calculate the caloric contribution of cat treats and set a safe daily limit to prevent excess weight gain."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[
        {
          title: "Horse Weight Estimator (Heart Girth & Length)",
          url: "/pets/horse-weight-estimator-girth-length",
          icon: "🐎",
        },
        {
          title: "Basking Temperature & Gradient Planner",
          url: "/pets/reptile-basking-temperature-gradient-planner",
          icon: "🐶",
        },
        {
          title: "Dog Crate Size Finder",
          url: "/pets/dog-crate-size-finder",
          icon: "🐶",
        },
        {
          title: "Dog Caffeine Toxicity Calculator",
          url: "/pets/dog-caffeine-toxicity",
          icon: "🐶",
        },
        {
          title: "Dog BMI/Body Index (educational)",
          url: "/pets/dog-bmi-body-index-educational",
          icon: "🐶",
        },
        {
          title: "Omega-3 (EPA/DHA) Supplement Calculator for Dogs",
          url: "/pets/dog-omega-3-epa-dha-supplement",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Treat Calories & Daily Allowance" },
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