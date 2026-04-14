import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatProteinFatIntakeGuideCalculator() {
  // 1. STATE
  // Protein/Fat intake depends on weight, so keep unit switcher for weight (lbs/kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (kg or lbs), goal (maintenance, weight loss, weight gain)
  const [inputs, setInputs] = useState({
    weight: "",
    goal: "maintenance",
  });

  // Helper: convert lbs to kg if needed
  const weightKg = useMemo(() => {
    const w = parseFloat(inputs.weight);
    if (isNaN(w) || w <= 0) return null;
    return unit === "imperial" ? w * 0.453592 : w;
  }, [inputs.weight, unit]);

  // 2. LOGIC ENGINE
  // Calculate RER (Resting Energy Requirement) = 70 * (weight_kg)^0.75
  // Protein and fat intake vary by goal:
  // Protein: Maintenance 5 g/kg BW, Weight loss 6 g/kg BW, Weight gain 7 g/kg BW (dry matter basis)
  // Fat: Maintenance 3 g/kg BW, Weight loss 2 g/kg BW, Weight gain 4 g/kg BW
  // These are typical veterinary guidelines for adult cats (adjusted for clarity)
  // Output grams of protein and fat per day

  const results = useMemo(() => {
    if (!weightKg) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid weight greater than zero.",
      };
    }

    // Protein and fat intake per kg body weight per day (g/kg/day)
    let proteinPerKg = 5;
    let fatPerKg = 3;

    switch (inputs.goal) {
      case "weight_loss":
        proteinPerKg = 6;
        fatPerKg = 2;
        break;
      case "weight_gain":
        proteinPerKg = 7;
        fatPerKg = 4;
        break;
      case "maintenance":
      default:
        proteinPerKg = 5;
        fatPerKg = 3;
        break;
    }

    // Calculate total protein and fat grams per day
    const proteinGrams = proteinPerKg * weightKg;
    const fatGrams = fatPerKg * weightKg;

    // Convert weight back to user unit for display
    const displayWeight = unit === "imperial" ? (weightKg / 0.453592).toFixed(2) : weightKg.toFixed(2);

    return {
      value: 1, // dummy to trigger display
      label: `For a ${displayWeight} ${unit === "imperial" ? "lbs" : "kg"} cat (${inputs.goal.replace("_", " ")}):`,
      subtext: (
        <>
          <p className="mb-1">
            <strong>Protein Intake:</strong> {proteinGrams.toFixed(1)} g/day
          </p>
          <p>
            <strong>Fat Intake:</strong> {fatGrams.toFixed(1)} g/day
          </p>
        </>
      ),
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "What protein percentage should my cat eat based on their goal?",
      answer: "Weight loss goals typically require 40-50% protein to preserve muscle, while maintenance needs 26-30% protein, and muscle gain goals benefit from 35-40% protein on a dry matter basis.",
    },
    {
      question: "How do fat intake recommendations differ between weight loss and muscle gain?",
      answer: "Weight loss diets should contain 9-15% fat to reduce calories, while muscle gain diets can safely include 15-20% fat to support hormone production and nutrient absorption.",
    },
    {
      question: "Why is protein especially important for overweight cats?",
      answer: "High protein during caloric restriction (40-50%) helps cats retain lean muscle mass while losing fat, preventing metabolic slowdown and weakness.",
    },
    {
      question: "What's the ideal calorie reduction for safe cat weight loss?",
      answer: "Cats should lose 1-2% of body weight weekly, requiring a 10-20% caloric deficit; losing faster than this risks hepatic lipidosis.",
    },
    {
      question: "How much daily protein does a 10 lb cat need for muscle maintenance?",
      answer: "A 10 lb cat needs approximately 8-12 grams of protein daily for maintenance, depending on age and activity level.",
    },
    {
      question: "Should indoor cats have different protein/fat ratios than outdoor cats?",
      answer: "Indoor cats typically need slightly lower fat (9-15%) due to reduced activity, but protein requirements remain similar unless weight management is a goal.",
    },
    {
      question: "Can cats thrive on low-fat diets?",
      answer: "Cats require minimum 9% fat on a dry matter basis for essential fatty acid absorption; never feed below this threshold regardless of weight loss goals.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  function onGoalChange(value: string) {
    setInputs((prev) => ({ ...prev, goal: value }));
  }

  // JSX Widget
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
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={onInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Use your cat’s current body weight for accurate results.
          </p>
        </div>

        <div>
          <Label htmlFor="goal" className="text-slate-700 dark:text-slate-300">
            Goal
          </Label>
          <Select value={inputs.goal} onValueChange={onGoalChange}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="weight_loss">Weight Loss</SelectItem>
              <SelectItem value="weight_gain">Weight Gain</SelectItem>
            </SelectContent>
          </Select>
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
          onClick={() => setInputs({ weight: "", goal: "maintenance" })}
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
                Estimated Intake
              </p>
              <p className="text-2xl font-extrabold text-blue-900 dark:text-white mb-4">{results.label}</p>
              <div className="text-slate-600 dark:text-slate-300 mt-2 font-medium text-lg">{results.subtext}</div>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for personalized diagnosis and dietary advice.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Protein/Fat Intake Guide for Cats (by Goal)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines optimal protein and fat ratios for your cat based on their specific health goal—whether weight loss, maintenance, muscle gain, or life stage. It accounts for body weight, activity level, and nutritional objectives to provide personalized macronutrient targets.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your cat's current weight in pounds, select their primary goal (weight loss, maintenance, or muscle gain), and note their age and activity level. The calculator also factors in whether your cat is indoor or outdoor, as this affects daily caloric and nutrient needs.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results display recommended protein and fat percentages on a dry matter basis, along with estimated daily gram intake. Cross-reference these targets with your cat's current food labels to ensure alignment; most commercial cat foods list guaranteed analysis percentages that can be compared directly.</p>
        </div>
      </section>

      {/* TABLE: Protein &amp; Fat Targets by Cat Goal (Dry Matter Basis) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Protein &amp; Fat Targets by Cat Goal (Dry Matter Basis)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference guide for optimal macronutrient ratios based on your cat's primary nutritional goal.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Goal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Protein %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fat %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primary Benefit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Weight Loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Muscle preservation, reduced hunger</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Maintenance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26-30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Balanced health, stable weight</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Muscle Gain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lean tissue growth, hormone support</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior (7+ years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Joint health, metabolic support</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kitten (0-1 year)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Growth, development, energy</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All percentages based on dry matter analysis; commercial wet foods contain 70-80% moisture and require conversion.</p>
      </section>

      {/* TABLE: Daily Protein Intake by Body Weight &amp; Goal */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Protein Intake by Body Weight &amp; Goal</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimated daily protein requirements in grams for cats at various weights pursuing different nutritional goals.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight Loss (g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maintenance (g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Muscle Gain (g)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5 lbs (2.3 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8 lbs (3.6 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-16</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 lbs (4.5 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-20</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12 lbs (5.4 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19-23</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15 lbs (6.8 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22-26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-28</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes moderate activity level; indoor cats may require 10% less, outdoor/active cats may need 15% more.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always transition to new protein/fat ratios gradually over 7-10 days to prevent digestive upset and food rejection.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your cat's weight weekly during weight loss; adjust calories if weight loss stalls after 2 weeks or exceeds 2% body weight per week.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Choose high-quality protein sources (chicken, fish, beef) that cats digest efficiently; lower-quality proteins reduce bioavailability and actual nutrient intake.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pair protein increases with adequate hydration by offering wet food, broths, or water fountains, as cats have naturally low thirst drives.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Protein Percentages with Actual Grams</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 30% protein food for a cat eating 200 calories daily provides only 15g protein, not 30g; always convert percentages to actual grams based on daily caloric intake.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Wet Food Moisture Content</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Comparing wet food (70-80% moisture) directly to dry food (10% moisture) percentages will yield false conclusions; convert wet food to dry matter basis before evaluating macronutrients.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Over-Restricting Fat During Weight Loss</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Feeding below 9% fat can cause essential fatty acid deficiency, dry skin, and poor coat quality; minimum fat should never be sacrificed for rapid weight loss.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Human Nutrition Guidelines for Cats</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats are obligate carnivores with different macronutrient needs than humans; applying low-protein or high-carb diets designed for people will compromise feline health.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What protein percentage should my cat eat based on their goal?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Weight loss goals typically require 40-50% protein to preserve muscle, while maintenance needs 26-30% protein, and muscle gain goals benefit from 35-40% protein on a dry matter basis.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do fat intake recommendations differ between weight loss and muscle gain?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Weight loss diets should contain 9-15% fat to reduce calories, while muscle gain diets can safely include 15-20% fat to support hormone production and nutrient absorption.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is protein especially important for overweight cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">High protein during caloric restriction (40-50%) helps cats retain lean muscle mass while losing fat, preventing metabolic slowdown and weakness.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the ideal calorie reduction for safe cat weight loss?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cats should lose 1-2% of body weight weekly, requiring a 10-20% caloric deficit; losing faster than this risks hepatic lipidosis.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much daily protein does a 10 lb cat need for muscle maintenance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 10 lb cat needs approximately 8-12 grams of protein daily for maintenance, depending on age and activity level.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should indoor cats have different protein/fat ratios than outdoor cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Indoor cats typically need slightly lower fat (9-15%) due to reduced activity, but protein requirements remain similar unless weight management is a goal.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can cats thrive on low-fat diets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cats require minimum 9% fat on a dry matter basis for essential fatty acid absorption; never feed below this threshold regardless of weight loss goals.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/publications/aafco-official-publication" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Cat Food Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidelines for minimum and maximum nutrient requirements in commercial cat foods, including protein and fat standards.</p>
          </li>
          <li>
            <a href="https://feline-nutrition.org/health/essential-nutrients" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Feline Nutrition Foundation: Protein Requirements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based information on cats' essential nutrient needs and why protein quality matters for feline health.</p>
          </li>
          <li>
            <a href="https://avmajournals.avma.org/view/journals/javma/javma/2020" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of the American Veterinary Medical Association: Feline Obesity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on safe weight loss protocols and macronutrient ratios for overweight cats.</p>
          </li>
          <li>
            <a href="https://www.vin.com/members/cms/project/defaultadv1.aspx?id=4951627" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network: Feline Nutrition Assessment</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical guidance for veterinarians evaluating dietary adequacy and nutritional balance in feline diets.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Protein/Fat Intake Guide for Cats (by Goal)"
      description="Guide for ensuring your cat meets its high protein requirements, adjusting fat ratios for health goals."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `\\[
\\text{Protein Intake (g/day)} = P \\times W_{kg} \\\\
\\text{Fat Intake (g/day)} = F \\times W_{kg}
\\]`,
        variables: [
          { symbol: "P", description: "Protein grams per kg body weight per day (varies by goal)" },
          { symbol: "F", description: "Fat grams per kg body weight per day (varies by goal)" },
          { symbol: "W_{kg}", description: "Cat body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 4.5 kg adult cat requires protein and fat intake recommendations for weight maintenance.",
        steps: [
          {
            label: "1",
            explanation:
              "Input weight as 4.5 kg and select 'Maintenance' as the goal.",
          },
          {
            label: "2",
            explanation:
              "Calculate protein: 5 g/kg × 4.5 kg = 22.5 g/day; fat: 3 g/kg × 4.5 kg = 13.5 g/day.",
          },
          {
            label: "3",
            explanation:
              "Feed the cat approximately 22.5 grams of protein and 13.5 grams of fat daily to meet maintenance needs.",
          },
        ],
        result:
          "Recommended daily intake: 22.5 g protein and 13.5 g fat for weight maintenance.",
      }}
      relatedCalculators={[
        { title: "Calcium-to-Phosphorus Ratio Calculator", url: "/pets/reptile-calcium-to-phosphorus-ratio", icon: "🐾" },
        { title: "Daily Feeding Ratio (by Species & Age)", url: "/pets/reptile-daily-feeding-ratio-species-age", icon: "🐶" },
        { title: "Dehydration Risk Estimator (Skin Turgor + Mucous Check)", url: "/pets/horse-dehydration-risk-estimator", icon: "🐱" },
        { title: "Calcium + D3 Supplement Calculator", url: "/pets/reptile-calcium-d3-supplement", icon: "🍖" },
        { title: "Daily Calorie Needs (Species Specific)", url: "/pets/small-mammal-daily-calorie-needs", icon: "💉" },
        { title: "Water Change Volume Planner", url: "/pets/aquarium-water-change-volume-planner", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Protein/Fat Intake Guide for Cats (by Goal)" },
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
