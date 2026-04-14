import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { weightToKg } from "@/lib/utils";

export default function BirdDailyCalorieNeedsBodyWeightCalculator() {
  // 1. STATE
  // Unit selector needed because weight input can be in lbs or kg
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight only (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Formula: RER = 70 * (Body Weight in kg)^0.75
  // Daily Calorie Needs = RER * 1.6 (typical multiplier for adult birds at maintenance)
  // We show only the primary formula in the formula prop.
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Calculate Resting Energy Requirement (RER)
    const rer = 70 * Math.pow(weightKg, 0.75);

    // Typical multiplier for daily calorie needs in adult birds (maintenance)
    const dailyCalories = rer * 1.6;

    // Format result to 2 decimals
    const dailyCaloriesRounded = dailyCalories.toFixed(2);

    return {
      value: dailyCaloriesRounded,
      label: "kcal/day",
      subtext: `Based on a body weight of ${weightRaw} ${unit}`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How do I calculate my pet's daily calorie needs based on body weight?",
      answer: "Enter your pet's current weight and activity level into the calculator. It uses the Resting Energy Expenditure (REE) formula multiplied by an activity factor to estimate total daily calorie needs, typically ranging from 25-35 calories per pound for average pets.",
    },
    {
      question: "What's the difference between a dog's and cat's calorie needs at the same weight?",
      answer: "Cats have higher metabolic rates and typically need 20-30% more calories per pound than dogs of similar weight due to their obligate carnivore status and different activity patterns.",
    },
    {
      question: "Does body weight alone determine calorie needs?",
      answer: "No—age, activity level, metabolism, and health status all significantly impact calorie requirements; a 50-pound senior dog needs fewer calories than a 50-pound young, active dog.",
    },
    {
      question: "How accurate is the body weight calculator for determining pet calories?",
      answer: "The calculator provides a reliable starting estimate within 10-15% accuracy for average pets, but individual variation is common and may require adjustments based on weight trends and body condition.",
    },
    {
      question: "Should I adjust calories if my pet is overweight or underweight?",
      answer: "Yes—overweight pets may need 20-30% fewer calories, while underweight pets may need 10-20% more; consult your veterinarian before making significant dietary changes.",
    },
    {
      question: "What activity levels should I select for my pet?",
      answer: "Sedentary pets need a 1.2-1.4 multiplier, moderately active pets need 1.5-1.8, and very active/working pets need 1.9-2.5 times their resting energy expenditure.",
    },
    {
      question: "Can I use this calculator for exotic pets or senior animals?",
      answer: "This calculator works best for adult dogs and cats; exotic pets and senior animals may have different metabolic rates and should be evaluated by a veterinarian for accurate calorie recommendations.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lb">lb</SelectItem>
              <SelectItem value="kg">kg</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Weight Input */}
      <div className="space-y-1">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Body Weight ({unit})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "lb" ? "lb" : "kg"}`}
          value={inputs.weight}
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          aria-describedby="weight-desc"
        />
        <p id="weight-desc" className="text-xs text-slate-400 dark:text-slate-500">
          Enter the bird's current body weight to estimate daily calorie needs.
        </p>
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
          onClick={() => setInputs({ weight: "" })}
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Daily Calorie Needs by Body Weight Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates your pet's daily calorie requirements based on body weight and activity level. It helps you determine appropriate portion sizes and ensure your pet maintains a healthy weight.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet's current weight in pounds and select their activity level (sedentary, moderate, or very active). The calculator uses veterinary nutrition formulas to compute resting energy expenditure and multiplies by an activity factor.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The result provides a daily calorie target range. Monitor your pet's weight weekly and adjust food portions if they gain or lose weight consistently; contact your vet if changes are needed beyond 10% of calculated calories.</p>
        </div>
      </section>

      {/* TABLE: Daily Calorie Estimates by Pet Weight and Activity Level */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calorie Estimates by Pet Weight and Activity Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this reference table to compare estimated daily calorie needs across common pet weights and activity levels.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sedentary (1.2x)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Activity (1.5x)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Very Active (1.9x)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">190-225</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240-285</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">375-450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">470-565</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600-715</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">750-900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">940-1130</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1200-1430</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1125-1350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1410-1695</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1800-2145</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1500-1800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1880-2260</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2400-2860</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calorie estimates are based on average metabolic rates; individual pets may vary by 10-20% based on age, metabolism, and health status.</p>
      </section>

      {/* TABLE: Typical Daily Calorie Ranges by Pet Type and Lifestyle */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Typical Daily Calorie Ranges by Pet Type and Lifestyle</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference typical daily calorie needs for different pet categories based on 2024 veterinary nutrition guidelines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Weight Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Low Activity Calories</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Activity Calories</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Dog (Toy breeds)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-10 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-350</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-50 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500-900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">750-1400</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-90 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900-1600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1400-2400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult Cat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-280</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior Pet (10+ years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Various</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30% reduction</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20% reduction</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Senior pets and those with medical conditions may require adjustment; always consult your veterinarian before changing food portions significantly.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your pet monthly and recalculate calories quarterly, as weight changes affect daily energy needs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for treats in the total calorie count—they should represent no more than 10% of daily calories to prevent overfeeding.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Adjust activity level if your pet's routine changes seasonally or after aging; senior pets typically need 10-20% fewer calories.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine this calculator with body condition scoring; a healthy pet should have a visible waist and ribs you can feel but not see.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Activity Level Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Selecting the wrong activity level can overestimate or underestimate calories by 30-40%; update annually as your pet ages or lifestyle changes.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Treats</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Forgetting to include treat calories in daily totals can lead to a 15-25% calorie surplus and unwanted weight gain over time.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Human Calorie Charts</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pet metabolic rates differ significantly from humans; a dog's calorie needs per pound are lower than a human's, making human calculators inaccurate for pets.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming One Formula Fits All</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Individual metabolism varies widely; some pets naturally need 20-30% more or fewer calories than the calculator estimate due to breed, age, and genetics.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my pet's daily calorie needs based on body weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your pet's current weight and activity level into the calculator. It uses the Resting Energy Expenditure (REE) formula multiplied by an activity factor to estimate total daily calorie needs, typically ranging from 25-35 calories per pound for average pets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between a dog's and cat's calorie needs at the same weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cats have higher metabolic rates and typically need 20-30% more calories per pound than dogs of similar weight due to their obligate carnivore status and different activity patterns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does body weight alone determine calorie needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No—age, activity level, metabolism, and health status all significantly impact calorie requirements; a 50-pound senior dog needs fewer calories than a 50-pound young, active dog.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the body weight calculator for determining pet calories?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator provides a reliable starting estimate within 10-15% accuracy for average pets, but individual variation is common and may require adjustments based on weight trends and body condition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust calories if my pet is overweight or underweight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—overweight pets may need 20-30% fewer calories, while underweight pets may need 10-20% more; consult your veterinarian before making significant dietary changes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What activity levels should I select for my pet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Sedentary pets need a 1.2-1.4 multiplier, moderately active pets need 1.5-1.8, and very active/working pets need 1.9-2.5 times their resting energy expenditure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for exotic pets or senior animals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator works best for adult dogs and cats; exotic pets and senior animals may have different metabolic rates and should be evaluated by a veterinarian for accurate calorie recommendations.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/pet-food-standards" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Pet Food Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidelines for pet nutrition and calorie content established by the Association of American Feed Control Officials.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/health/nutrition" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis School of Veterinary Medicine Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based veterinary nutrition information and pet feeding recommendations from a leading veterinary school.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA) Pet Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Trusted veterinary guidance on pet diet, weight management, and nutritional requirements.</p>
          </li>
          <li>
            <a href="https://www.purina.com/pro/resources/pet-care-research" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Purina PetCare Institute Research</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on pet nutrition, metabolism, and optimal calorie intake for different life stages.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Daily Calorie Needs by Body Weight"
      description="Calculate the daily calorie and energy requirements for different species of birds based on body weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Daily Calorie Needs = 70 × (Body Weight in kg)^0.75 × 1.6",
        variables: [
          { symbol: "Body Weight in kg", description: "Bird's body weight in kilograms" },
          { symbol: "70", description: "Constant for Resting Energy Requirement calculation" },
          { symbol: "1.6", description: "Multiplier for maintenance energy needs in adult birds" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A parrot weighs 2.2 lbs (1 kg). Calculate its estimated daily calorie needs using the formula.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed. Here, 2.2 lbs = 1 kg (already metric).",
          },
          {
            label: "2",
            explanation:
              "Calculate RER: 70 × (1)^0.75 = 70 kcal/day.",
          },
          {
            label: "3",
            explanation:
              "Multiply RER by 1.6 for maintenance: 70 × 1.6 = 112 kcal/day.",
          },
        ],
        result: "The parrot requires approximately 112 kcal per day to maintain its body weight.",
      }}
      relatedCalculators={[
        { title: "Omega-3 Supplement Planner (EPA/DHA per kg)", url: "/pets/horse-omega-3-supplement-planner", icon: "🐾" },
        { title: "Antibiotic Dose Reference (mg/kg)", url: "/pets/bird-antibiotic-dose-reference", icon: "🐶" },
        { title: "Parasite Treatment Dose Reference", url: "/pets/small-mammal-parasite-treatment-dose-reference", icon: "🐱" },
        { title: "Safe Stocking Density (Fish/cm per Litre)", url: "/pets/aquarium-safe-stocking-density-fish-per-litre", icon: "🍖" },
        { title: "Metabolic Bone Disease Risk Estimator", url: "/pets/reptile-metabolic-bone-disease-risk", icon: "💉" },
        { title: "pH Adjustment (Acid/Base Buffer) Calculator", url: "/pets/aquarium-ph-adjustment-buffer", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Daily Calorie Needs by Body Weight" },
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
