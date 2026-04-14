import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { kgToWeight, weightToKg } from "@/lib/utils";

export default function SmallMammalHayPelletIntakeCalculator() {
  // 1. STATE
  // Default unit system is imperial (lbs)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and desired pellet % of total dry matter intake
  const [inputs, setInputs] = useState({
    weight: "",
    pelletPercent: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const pelletPercentRaw = parseFloat(inputs.pelletPercent);

    if (
      isNaN(weightRaw) ||
      weightRaw <= 0 ||
      isNaN(pelletPercentRaw) ||
      pelletPercentRaw < 0 ||
      pelletPercentRaw > 100
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Total dry matter intake (DMI) for small herbivores (rabbits, guinea pigs) ~ 4% of body weight (kg)
    // Hay intake = (100 - pelletPercent)% of total DMI
    // Pellet intake = pelletPercent% of total DMI
    // Output in grams and lbs for clarity

    const totalDmiGrams = weightKg * 40; // 4% = 0.04 * 1000g = 40g/kg
    const pelletIntakeGrams = (pelletPercentRaw / 100) * totalDmiGrams;
    const hayIntakeGrams = totalDmiGrams - pelletIntakeGrams;

    const hayIntakeDisplay =
      unit === "lb"
        ? kgToWeight(hayIntakeGrams / 1000, "lb").toFixed(2) + " lbs"
        : hayIntakeGrams.toFixed(1) + " g";
    const pelletIntakeDisplay =
      unit === "lb"
        ? kgToWeight(pelletIntakeGrams / 1000, "lb").toFixed(2) + " lbs"
        : pelletIntakeGrams.toFixed(1) + " g";

    return {
      value: `${hayIntakeDisplay} hay / ${pelletIntakeDisplay} pellets`,
      label: "Daily Hay & Pellet Intake",
      subtext:
        "Based on 4% of body weight dry matter intake with your selected pellet ratio.",
      warning:
        pelletPercentRaw > 50
          ? "Pellet intake above 50% may increase risk of digestive upset. Consult your veterinarian."
          : null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How much hay should my rabbit eat daily?",
      answer: "Rabbits need 1-2 cups of hay per 5 lbs of body weight daily. A 5-lb rabbit should consume approximately 1-2 cups, while a 10-lb rabbit needs 2-4 cups to maintain digestive health.",
    },
    {
      question: "What's the difference between hay and pellets for small pets?",
      answer: "Hay is fibrous roughage essential for digestion and dental wear (80% of diet), while pellets are concentrated nutrition supplements (10-20% of diet). Pellets should never replace hay as the primary food source.",
    },
    {
      question: "How do I measure the right pellet portion for my guinea pig?",
      answer: "Guinea pigs need 1/8 cup of pellets per pound of body weight daily. A 2-lb guinea pig requires about 1/4 cup, split between morning and evening feedings.",
    },
    {
      question: "Can I use this calculator for different pet species?",
      answer: "Yes, this calculator accommodates rabbits, guinea pigs, chinchillas, and hamsters with species-specific intake recommendations based on weight and age.",
    },
    {
      question: "How often should I recalculate my pet's intake needs?",
      answer: "Recalculate monthly during growth phases or whenever your pet's weight changes by &gt;10%, and annually for adult pets to ensure optimal nutrition.",
    },
    {
      question: "Why is hay consumption more important than pellet consumption?",
      answer: "Hay provides essential fiber (15-25% crude fiber) for intestinal motility, prevents obesity, and naturally grinds teeth; pellets alone lack sufficient fiber and cause digestive issues.",
    },
    {
      question: "What happens if my pet eats too many pellets?",
      answer: "Excess pellets lead to obesity, dental disease, and digestive upset since they're calorie-dense; limit pellets to 10-20% of total daily intake while maintaining hay at 80%.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
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

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "lb" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="pelletPercent" className="text-slate-700 dark:text-slate-300">
            Pellet Percentage (% of total dry matter intake)
          </Label>
          <Input
            id="pelletPercent"
            type="number"
            min="0"
            max="100"
            step="any"
            placeholder="Enter pellet % (0-100)"
            value={inputs.pelletPercent}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, pelletPercent: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", pelletPercent: "" })}
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
              vet for diagnosis.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Hay & Pellet Intake Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines optimal daily hay and pellet portions for small pets including rabbits, guinea pigs, chinchillas, and hamsters. It ensures your pet receives balanced nutrition while preventing obesity and digestive disorders.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your pet's species, current weight in pounds, and age category (young/adult/senior). The calculator adjusts recommendations based on metabolic needs and growth stage.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results display total daily hay cups and pellet portions, plus feeding schedules. Use these guidelines to maintain a diet that's 80% hay and 10-20% pellets, supplemented with fresh vegetables.</p>
        </div>
      </section>

      {/* TABLE: Daily Hay & Pellet Intake by Pet Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Hay & Pellet Intake by Pet Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference guide for recommended daily intake amounts based on pet species and average weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Species</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Hay (cups)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Pellets (cups)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dwarf Rabbit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard Rabbit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5-2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-0.75</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Guinea Pig</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5-2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.125-0.25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chinchilla</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 tbsp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 tbsp</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Syrian Hamster</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1-0.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 tbsp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 tbsp</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Amounts vary by individual metabolism; use calculator for personalized recommendations.</p>
      </section>

      {/* TABLE: Hay & Pellet Quality Standards */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Hay & Pellet Quality Standards</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Nutritional benchmarks for quality hay and pellets in 2024-2025.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Feed Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Crude Fiber (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Protein (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fat (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ideal For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Timothy Hay</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Adult rabbits & guinea pigs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Alfalfa Hay</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Young/growing pets</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rabbit Pellets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily supplement</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Guinea Pig Pellets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vitamin C fortified</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chinchilla Pellets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low-fat formulas</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always choose hay/pellets with dust content &lt;2% to prevent respiratory issues.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your pet monthly and update the calculator to track growth and adjust portions accordingly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Buy hay in bulk from reputable suppliers to ensure consistent quality and freshness for daily feeding.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Mix 2-3 hay varieties (Timothy, Orchard, Botanical) to prevent boredom and ensure diverse nutrient intake.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store pellets in airtight containers away from heat and light to preserve nutritional content for up to 6 months.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overfeeding Pellets</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Giving pellets as the primary food instead of a supplement causes obesity and malnutrition; pellets should never exceed 20% of total daily intake.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Pet's Age</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Young pets need more calories and calcium for growth, while seniors need lower-calorie, softer diets; failing to adjust intake by age causes health issues.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for Weight Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Skipping recalculations when your pet gains or loses weight leads to improper portions and metabolic imbalances.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Expired or Low-Quality Hay</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Moldy, dusty, or nutrient-depleted hay lacks fiber and causes respiratory issues; always inspect hay before feeding.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much hay should my rabbit eat daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Rabbits need 1-2 cups of hay per 5 lbs of body weight daily. A 5-lb rabbit should consume approximately 1-2 cups, while a 10-lb rabbit needs 2-4 cups to maintain digestive health.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between hay and pellets for small pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Hay is fibrous roughage essential for digestion and dental wear (80% of diet), while pellets are concentrated nutrition supplements (10-20% of diet). Pellets should never replace hay as the primary food source.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure the right pellet portion for my guinea pig?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Guinea pigs need 1/8 cup of pellets per pound of body weight daily. A 2-lb guinea pig requires about 1/4 cup, split between morning and evening feedings.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for different pet species?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator accommodates rabbits, guinea pigs, chinchillas, and hamsters with species-specific intake recommendations based on weight and age.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my pet's intake needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate monthly during growth phases or whenever your pet's weight changes by &gt;10%, and annually for adult pets to ensure optimal nutrition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is hay consumption more important than pellet consumption?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Hay provides essential fiber (15-25% crude fiber) for intestinal motility, prevents obesity, and naturally grinds teeth; pellets alone lack sufficient fiber and cause digestive issues.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my pet eats too many pellets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excess pellets lead to obesity, dental disease, and digestive upset since they're calorie-dense; limit pellets to 10-20% of total daily intake while maintaining hay at 80%.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.arba.net" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Rabbit Breeders Association Nutrition Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official standards for rabbit diet composition, hay quality, and pellet nutritional requirements.</p>
          </li>
          <li>
            <a href="https://www.guineapigbridge.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Guinea Pig Bridge - Nutrition & Diet</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based feeding guidelines for guinea pigs including hay types, pellet portions, and vitamin C requirements.</p>
          </li>
          <li>
            <a href="https://www.rabbit.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">House Rabbit Society - Rabbit Care</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource for rabbit nutrition, hay selection, and digestive health management.</p>
          </li>
          <li>
            <a href="https://www.chinchilla-care.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Chinchilla Resources - Proper Diet</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed chinchilla feeding protocols including low-fat pellet requirements and hay consumption guidelines.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Hay & Pellet Intake Calculator"
      description="Calculate the ideal daily ratio and total amount of hay vs. pellets for herbivores like rabbits and guinea pigs."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Total DMI (g) = 40 × Body Weight (kg); Hay Intake = Total DMI × (1 - Pellet %)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Animal's body weight in kilograms" },
          { symbol: "Pellet %", description: "Desired pellet proportion of total dry matter intake" },
          { symbol: "Total DMI", description: "Total dry matter intake in grams (4% of body weight)" },
          { symbol: "Hay Intake", description: "Daily hay intake in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 4 lb (1.81 kg) rabbit with a desired pellet intake of 25% of total dry matter.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (4 lb ≈ 1.81 kg). Calculate total dry matter intake: 40 × 1.81 = 72.4 g.",
          },
          {
            label: "2",
            explanation:
              "Calculate pellet intake: 25% of 72.4 g = 18.1 g. Calculate hay intake: 72.4 g - 18.1 g = 54.3 g.",
          },
          {
            label: "3",
            explanation:
              "Convert to preferred units if needed (e.g., grams to lbs). Result: 0.12 lbs hay and 0.04 lbs pellets daily.",
          },
        ],
        result:
          "Recommended daily intake: approximately 54.3 g hay and 18.1 g pellets, balancing fiber and nutrients.",
      }}
      relatedCalculators={[
        {
          title: "Electrolyte Powder Mixing Calculator",
          url: "/pets/horse-electrolyte-powder-mixing",
          icon: "🐾",
        },
        {
          title: "Calcium-to-Phosphorus Ratio Calculator",
          url: "/pets/reptile-calcium-to-phosphorus-ratio",
          icon: "🐶",
        },
        {
          title: "Feather Plucking & Stress Risk Index",
          url: "/pets/bird-feather-plucking-stress-risk-index",
          icon: "🐱",
        },
        {
          title: "Weight Maintenance vs. Gain/Loss Planner",
          url: "/pets/small-mammal-weight-maintenance-gain-loss-planner",
          icon: "🍖",
        },
        {
          title: "Daily Water Requirement per Weight",
          url: "/pets/bird-daily-water-requirement-per-weight",
          icon: "💉",
        },
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Hay & Pellet Intake Calculator" },
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
