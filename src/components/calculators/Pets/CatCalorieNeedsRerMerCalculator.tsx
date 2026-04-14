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

export default function CatCalorieNeedsRerMerCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight only (kg or lbs)
  const [inputs, setInputs] = useState<{ weight?: string }>({ weight: "" });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = inputs.weight?.trim();
    if (!weightRaw) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Parse weight input
    const weightNum = Number(weightRaw);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive number for weight.",
      };
    }

    const weightKg = weightToKg(weightNum, unit);

    // RER formula: RER = 70 * (weight in kg)^0.75
    const rer = 70 * Math.pow(weightKg, 0.75);

    // MER depends on activity/lifestyle, typical multipliers for cats:
    // Neutered adult indoor cat: 1.2 * RER
    // Intact adult cat: 1.4 * RER
    // Active/Outdoor cat: 1.6 * RER
    // Growth, pregnancy, lactation require higher multipliers but not included here for simplicity

    // For this calculator, show all three common MER values for user info

    // Round to nearest whole number kcal
    const rerRounded = Math.round(rer);
    const merNeutered = Math.round(rer * 1.2);
    const merIntact = Math.round(rer * 1.4);
    const merActive = Math.round(rer * 1.6);

    return {
      value: rerRounded,
      label: "Resting Energy Requirement (RER) kcal/day",
      subtext: `Maintenance Energy Requirement (MER) estimates:
- Neutered adult indoor cat: ${merNeutered} kcal/day
- Intact adult cat: ${merIntact} kcal/day
- Active/outdoor cat: ${merActive} kcal/day`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "What is RER and how does it differ from MER for cats?",
      answer: "RER (Resting Energy Requirement) is the baseline calories a cat needs at rest, calculated as 70 × (body weight in kg)^0.75. MER (Maintenance Energy Requirement) multiplies RER by an activity factor (typically 1.2–1.8) to account for lifestyle and health status.",
    },
    {
      question: "How do I measure my cat's weight accurately for this calculator?",
      answer: "Weigh your cat at your veterinary clinic using a calibrated scale, or use a pet scale at home for consistency. Measure in kilograms for this calculator, as the RER formula requires metric units.",
    },
    {
      question: "What activity factor should I use for my indoor cat?",
      answer: "Indoor cats typically use an activity factor of 1.2–1.4 due to limited movement, while outdoor or highly active cats may need 1.5–1.8 to account for increased energy expenditure.",
    },
    {
      question: "Can this calculator help with weight loss for overweight cats?",
      answer: "Yes, this calculator establishes baseline needs; for weight loss, reduce daily calories to 80–90% of MER under veterinary supervision to safely target 1–2% body weight loss per week.",
    },
    {
      question: "How often should I recalculate my cat's calorie needs?",
      answer: "Recalculate every 6–12 months or whenever your cat's weight, age, health status, or activity level changes significantly.",
    },
    {
      question: "Does age affect calorie requirements in cats?",
      answer: "Yes, kittens and senior cats may have different metabolic rates; kittens require 2–3× adult calories for growth, while seniors may need slightly fewer calories but consistent protein intake.",
    },
    {
      question: "What health conditions require adjusted calorie calculations?",
      answer: "Diabetes, hyperthyroidism, kidney disease, and post-surgical recovery often require modified calorie targets; always consult your veterinarian for personalized adjustments.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputs({ weight: e.target.value });
  }

  const widget = (
    <div className="space-y-6">
      {/* UNIT SELECTOR */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={(value) => setUnit(value as "kg" | "lb")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lb">Imperial (lbs)</SelectItem>
              <SelectItem value="kg">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* INPUT */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
          value={inputs.weight ?? ""}
          onChange={onInputChange}
          aria-describedby="weight-desc"
        />
        <p id="weight-desc" className="text-sm text-slate-500 dark:text-slate-400">
          Use your cat's current body weight for accurate calorie needs.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger re-render, no extra action needed
            setInputs((i) => ({ ...i }));
          }}
          aria-label="Calculate cat calorie needs"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center whitespace-pre-line">
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for personalized diagnosis and feeding plans.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cat Calorie Needs (RER/MER) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines your cat's daily calorie requirements using the scientific RER (Resting Energy Requirement) formula and adjusts for lifestyle factors to calculate MER (Maintenance Energy Requirement). It helps you establish appropriate portions and feeding schedules to maintain optimal body condition.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your cat's current weight in kilograms and select an activity level that best matches their lifestyle—from sedentary indoor cats to very active outdoor cats. The calculator also factors in health status, age category, and any special conditions like post-surgery or weight management.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show both RER and MER values in kilocalories per day, giving you a target range to adjust food portions and monitor weight. Compare these numbers against your cat food's caloric content (found on packaging) to determine appropriate daily serving sizes, and consult your veterinarian if results seem inconsistent with your cat's body condition.</p>
        </div>
      </section>

      {/* TABLE: RER Estimates by Cat Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">RER Estimates by Cat Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Approximate Resting Energy Requirements for adult cats at various body weights.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Body Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Body Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated RER (kcal/day)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">235</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">270</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">305</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">338</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">RER calculated using formula: 70 × (weight in kg)^0.75. Actual needs vary by metabolism and health.</p>
      </section>

      {/* TABLE: MER Multipliers by Lifestyle and Health Status */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">MER Multipliers by Lifestyle and Health Status</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Activity factors to multiply RER for total daily maintenance energy requirements.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Factor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Calorie Range Example (4kg cat)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Indoor, sedentary</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240–270 kcal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Indoor, normal activity</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">260–290 kcal</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mixed indoor/outdoor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300–330 kcal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Outdoor, very active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.6–1.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320–380 kcal</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Post-surgical recovery</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250–280 kcal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Weight loss program</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8–0.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160–190 kcal</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are guidelines; individual cats vary. Pregnant/lactating cats may require up to 2.0× RER.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a kitchen scale to measure dry food portions accurately, as eyeballing can lead to 20–30% overfeeding in cats.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Split daily calories into 2–3 meals to better match cats' natural hunting patterns and improve satiety.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor body condition score monthly using a 1–9 scale (ideal is 4–5) rather than relying solely on weight.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for treat calories—treats should not exceed 10% of total daily energy intake to maintain nutritional balance.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using human formulas for cat calorie needs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats have different metabolic rates than humans; always use the veterinary RER formula (70 × weight^0.75) rather than human-based estimates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to include treat calories</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ignoring calories from treats, supplements, and table scraps can result in 15–25% excess calorie intake and weight gain.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Applying the same activity factor to all indoor cats</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Indoor cats vary widely in activity; a playful cat may need factor 1.4, while a sedentary cat requires only 1.2.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not adjusting for weight changes over time</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Recalculating only once prevents proper calorie adjustment as your cat ages, gains, or loses weight.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is RER and how does it differ from MER for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">RER (Resting Energy Requirement) is the baseline calories a cat needs at rest, calculated as 70 × (body weight in kg)^0.75. MER (Maintenance Energy Requirement) multiplies RER by an activity factor (typically 1.2–1.8) to account for lifestyle and health status.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure my cat's weight accurately for this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Weigh your cat at your veterinary clinic using a calibrated scale, or use a pet scale at home for consistency. Measure in kilograms for this calculator, as the RER formula requires metric units.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What activity factor should I use for my indoor cat?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Indoor cats typically use an activity factor of 1.2–1.4 due to limited movement, while outdoor or highly active cats may need 1.5–1.8 to account for increased energy expenditure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator help with weight loss for overweight cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator establishes baseline needs; for weight loss, reduce daily calories to 80–90% of MER under veterinary supervision to safely target 1–2% body weight loss per week.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my cat's calorie needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate every 6–12 months or whenever your cat's weight, age, health status, or activity level changes significantly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does age affect calorie requirements in cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, kittens and senior cats may have different metabolic rates; kittens require 2–3× adult calories for growth, while seniors may need slightly fewer calories but consistent protein intake.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What health conditions require adjusted calorie calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Diabetes, hyperthyroidism, kidney disease, and post-surgical recovery often require modified calorie targets; always consult your veterinarian for personalized adjustments.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/consumers/what-aafco-does" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Cat Food Nutrient Profiles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidelines for feline nutritional requirements and calorie standards in commercial pet foods.</p>
          </li>
          <li>
            <a href="https://www.vin.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network (VIN) — Feline Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed veterinary nutrition information including RER calculations and dietary management for cats.</p>
          </li>
          <li>
            <a href="https://www.icatcare.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Society of Feline Medicine (ISFM) — Weight Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based guidance on feline obesity prevention, calorie requirements, and weight loss protocols.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/hospitals/william-r-pritchett-veterinary-medical-teaching-hospital" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis School of Veterinary Medicine — Nutrition Service</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Academic resources on feline nutrition, energy requirements, and dietary disease management.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Calorie Needs (RER/MER) Calculator"
      description="Calculate your cat's **Resting Energy Requirement (RER)** and **Maintenance Energy Requirement (MER)** for daily feeding."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `\\[
\\text{RER} = 70 \\times (\\text{Body Weight in kg})^{0.75}
\\]

\\[
\\text{MER} = \\text{RER} \\times \\text{Activity Factor}
\\]

Where activity factors commonly are:
- Neutered adult indoor cat: 1.2
- Intact adult cat: 1.4
- Active/outdoor cat: 1.6`,
        variables: [
          { symbol: "RER", description: "Resting Energy Requirement (kcal/day)" },
          { symbol: "MER", description: "Maintenance Energy Requirement (kcal/day)" },
          { symbol: "Body Weight in kg", description: "Cat's body weight in kilograms" },
          { symbol: "Activity Factor", description: "Multiplier based on lifestyle and physiological state" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A neutered indoor cat weighs 4.5 kg. Calculate the RER and MER for this cat to determine daily calorie needs.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate RER: 70 × (4.5)^0.75 ≈ 70 × 2.83 = 198 kcal/day.",
          },
          {
            label: "2",
            explanation:
              "Calculate MER for neutered indoor cat: 198 × 1.2 = 238 kcal/day.",
          },
        ],
        result:
          "The cat requires approximately 198 kcal/day at rest and about 238 kcal/day to maintain its weight considering its lifestyle.",
      }}
      relatedCalculators={[
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "🐾" },
        { title: "Dog Macadamia Nut Toxicity Calculator", url: "/pets/dog-macadamia-nut-toxicity", icon: "🐶" },
        { title: "Cat Weight Loss Planner", url: "/pets/cat-weight-loss-planner", icon: "🐱" },
        { title: "Heat Risk/Walk Safety Window (Temp & Humidity)", url: "/pets/dog-heat-risk-walk-safety-window", icon: "🍖" },
        { title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator", url: "/pets/dog-onion-garlic-exposure-risk", icon: "🐶" },
        { title: "Fluid Intake vs. Urine Output Balance Checker", url: "/pets/cat-fluid-intake-urine-output-balance", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Calorie Needs (RER/MER) Calculator" },
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
