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

const speciesOptions = [
  { label: "Bearded Dragon", value: "bearded_dragon" },
  { label: "Leopard Gecko", value: "leopard_gecko" },
  { label: "Corn Snake", value: "corn_snake" },
  { label: "Ball Python", value: "ball_python" },
];

const ageGroups = [
  { label: "Juvenile (<1 year)", value: "juvenile" },
  { label: "Adult (1-5 years)", value: "adult" },
  { label: "Senior (>5 years)", value: "senior" },
];

// Feeding ratio data (percentage of body weight per day) by species and age group
// Values are typical veterinary guidelines for daily feeding ratio (as % of body weight)
const feedingRatios = {
  bearded_dragon: {
    juvenile: 0.05, // 5%
    adult: 0.03, // 3%
    senior: 0.02, // 2%
  },
  leopard_gecko: {
    juvenile: 0.06,
    adult: 0.04,
    senior: 0.03,
  },
  corn_snake: {
    juvenile: 0.07,
    adult: 0.05,
    senior: 0.03,
  },
  ball_python: {
    juvenile: 0.06,
    adult: 0.04,
    senior: 0.03,
  },
};

export default function ReptileDailyFeedingRatioSpeciesAgeCalculator() {
  // 1. STATE
  // Unit system for weight input (imperial default)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: species, age group, weight
  const [inputs, setInputs] = useState({
    species: "",
    ageGroup: "",
    weight: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const { species, ageGroup, weight } = inputs;
    if (!species || !ageGroup || !weight) {
      return {
        value: 0,
        label: "Please fill all inputs",
        subtext: "",
        warning: null,
      };
    }
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "Invalid weight entered",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightNum, unit);

    // Get feeding ratio (as fraction)
    const ratio = feedingRatios[species]?.[ageGroup];
    if (ratio === undefined) {
      return {
        value: 0,
        label: "Feeding ratio data unavailable",
        subtext: "",
        warning: null,
      };
    }

    // Calculate daily food amount in grams
    // weightKg * 1000 (g/kg) * ratio
    const dailyFoodGrams = weightKg * 1000 * ratio;

    // Convert result to preferred unit for display
    // Display in grams if metric, ounces if imperial
    const displayValue =
      unit === "lb"
        ? (dailyFoodGrams / 28.3495).toFixed(2) + " oz"
        : dailyFoodGrams.toFixed(1) + " g";

    return {
      value: displayValue,
      label: `Daily Feeding Amount (${unit === "lb" ? "ounces" : "grams"})`,
      subtext: `Based on species: ${speciesOptions.find((s) => s.value === species)?.label}, age group: ${
        ageGroups.find((a) => a.value === ageGroup)?.label
      }, and weight: ${weightNum} ${unit === "lb" ? "lbs" : "kg"}.`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What percentage of body weight should my puppy eat daily?",
      answer: "Puppies typically need 5-10% of their body weight daily, split into 3-4 meals. As they grow, this percentage decreases to 2-3% by adulthood.",
    },
    {
      question: "How does feeding ratio differ between kittens and adult cats?",
      answer: "Kittens require 5-7% of body weight daily across multiple meals, while adult cats need only 2-3% in one or two meals depending on activity level.",
    },
    {
      question: "What's the daily feeding ratio for senior dogs?",
      answer: "Senior dogs (7+ years) typically need 2-2.5% of body weight daily, adjusted downward due to lower metabolism and reduced activity compared to adults.",
    },
    {
      question: "How do I calculate daily portions for a rabbit by age?",
      answer: "Young rabbits need approximately 5% of body weight in hay plus 1-2 oz vegetables daily, while adults require 2-3% body weight with unlimited hay.",
    },
    {
      question: "Should I adjust feeding ratios for indoor versus outdoor pets?",
      answer: "Yes; outdoor and active pets may need 10-15% more calories than indoor pets of the same species and age due to higher energy expenditure.",
    },
    {
      question: "How does body condition score affect the feeding ratio?",
      answer: "Overweight pets should be fed 10-20% less than the standard ratio, while underweight pets may need 10-15% more to reach ideal condition.",
    },
    {
      question: "What's the recommended daily feeding ratio for ferrets?",
      answer: "Ferrets have fast metabolisms and require 5-7% of body weight daily, divided into multiple small meals, with specialized ferret kibble or raw diets.",
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

      {/* Species selector */}
      <div className="space-y-1">
        <Label htmlFor="species" className="text-slate-700 dark:text-slate-300">
          Species
        </Label>
        <Select
          id="species"
          value={inputs.species}
          onValueChange={(value) => setInputs((prev) => ({ ...prev, species: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select species" />
          </SelectTrigger>
          <SelectContent>
            {speciesOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Age group selector */}
      <div className="space-y-1">
        <Label htmlFor="ageGroup" className="text-slate-700 dark:text-slate-300">
          Age Group
        </Label>
        <Select
          id="ageGroup"
          value={inputs.ageGroup}
          onValueChange={(value) => setInputs((prev) => ({ ...prev, ageGroup: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select age group" />
          </SelectTrigger>
          <SelectContent>
            {ageGroups.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Weight input */}
      <div className="space-y-1">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
          onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
        />
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
          onClick={() => setInputs({ species: "", ageGroup: "", weight: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Daily Feeding Ratio (by Species &amp; Age)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the optimal daily food amount for your pet based on species, age, current weight, and lifestyle. It accounts for the fact that younger and more active animals require higher caloric intake per pound of body weight than sedentary adults.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your pet's species, age in months, current lean body weight, and activity level (sedentary, moderate, or active). The calculator will generate a personalized feeding ratio range and suggested daily portion size in grams or ounces.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Use the result as a starting point and monitor your pet's weight and energy levels weekly. Adjust portions up or down by 10-15% if your pet gains or loses weight unexpectedly, and consult your veterinarian for breed-specific or health-related modifications.</p>
        </div>
      </section>

      {/* TABLE: Daily Feeding Ratios by Pet Species and Life Stage */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Feeding Ratios by Pet Species and Life Stage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows recommended daily feeding percentages based on body weight for common pet species across different ages.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Species</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Puppies/Kittens (0-6 months)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Young Adults (6-24 months)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Adults (2-7 years)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Seniors (7+ years)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-2.5%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-2.5%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rabbits</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-2.5%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ferrets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Guinea Pigs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hamsters</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages represent daily caloric intake as a proportion of lean body weight. Adjust based on activity level, metabolism, and individual health status.</p>
      </section>

      {/* TABLE: Caloric Needs Adjustment Factors by Lifestyle and Health Status */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Caloric Needs Adjustment Factors by Lifestyle and Health Status</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use these multipliers to adjust baseline feeding ratios based on your pet's activity level, metabolism, and condition.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Factor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Adjustment Multiplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Activity Level</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sedentary/Indoor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8–0.9x</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Activity Level</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate/Mixed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0x (baseline)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Activity Level</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High/Very Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.1–1.3x</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Body Condition</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Overweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.75–0.85x</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Body Condition</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ideal Weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0x (baseline)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Body Condition</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Underweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.1–1.2x</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Health Status</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Post-surgery/Recovery</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.1–1.25x</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Health Status</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal/Healthy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0x (baseline)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Multiply the baseline ratio by the appropriate factor. For example, a very active dog normally at 3% might need 3.3% (3 × 1.1).</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your pet monthly to ensure portions remain appropriate as they age and their metabolism changes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Split daily portions into multiple meals for puppies, kittens, and senior pets to improve digestion and prevent bloating.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for treats, which should comprise no more than 10% of total daily calories, and subtract from the main meal portion accordingly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Gradually transition to new food over 7-10 days while reducing old food portions to avoid digestive upset and maintain consistent calorie intake.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the Same Ratio for All Ages</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Feeding an adult-sized ratio to a puppy results in malnutrition and stunted growth; always adjust ratios downward as pets mature.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Activity Level Differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Indoor and outdoor pets have vastly different energy needs; failing to account for this leads to overfeeding or underfeeding.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Miscalculating Lean Body Weight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using total weight on an overweight pet inflates the recommended portion; use assessed lean body weight instead.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for Health Conditions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pets recovering from surgery, on medications, or with metabolic disorders require personalized ratios beyond standard age-based guidelines.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What percentage of body weight should my puppy eat daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Puppies typically need 5-10% of their body weight daily, split into 3-4 meals. As they grow, this percentage decreases to 2-3% by adulthood.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does feeding ratio differ between kittens and adult cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Kittens require 5-7% of body weight daily across multiple meals, while adult cats need only 2-3% in one or two meals depending on activity level.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the daily feeding ratio for senior dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Senior dogs (7+ years) typically need 2-2.5% of body weight daily, adjusted downward due to lower metabolism and reduced activity compared to adults.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate daily portions for a rabbit by age?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Young rabbits need approximately 5% of body weight in hay plus 1-2 oz vegetables daily, while adults require 2-3% body weight with unlimited hay.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust feeding ratios for indoor versus outdoor pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes; outdoor and active pets may need 10-15% more calories than indoor pets of the same species and age due to higher energy expenditure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does body condition score affect the feeding ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Overweight pets should be fed 10-20% less than the standard ratio, while underweight pets may need 10-15% more to reach ideal condition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the recommended daily feeding ratio for ferrets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Ferrets have fast metabolisms and require 5-7% of body weight daily, divided into multiple small meals, with specialized ferret kibble or raw diets.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Association of American Feed Control Officials (AAFCO) Pet Food Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official standards and nutrient profiles for pet food formulations across all life stages.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners/petcare/nutrition" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA) Nutrition Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based feeding guidelines and caloric requirements for dogs, cats, and other pets.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/academic-programs/veterinary-medical-teaching-hospital/nutrition-service" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis School of Veterinary Medicine Nutrition Service</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expert consultations and research on species-specific and condition-specific pet nutrition.</p>
          </li>
          <li>
            <a href="https://www.petmd.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">PetMD Feeding Guide and Calorie Calculator</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Practical feeding recommendations and caloric calculations for different pet species and life stages.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Daily Feeding Ratio (by Species & Age)"
      description="Determine the optimal feeding frequency and ratio of prey/vegetables based on the reptile's species and age."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Daily Feeding Amount (g) = Body Weight (kg) × Feeding Ratio (%) × 1000",
        variables: [
          { symbol: "Body Weight (kg)", description: "Reptile's body weight in kilograms" },
          { symbol: "Feeding Ratio (%)", description: "Species and age-specific daily feeding percentage of body weight" },
          { symbol: "Daily Feeding Amount (g)", description: "Recommended daily food amount in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1.5 kg adult bearded dragon requires a daily feeding amount based on its species and age-specific feeding ratio.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the feeding ratio for an adult bearded dragon: 3% (0.03) of body weight per day.",
          },
          {
            label: "2",
            explanation:
              "Multiply the body weight by the feeding ratio and convert to grams: 1.5 kg × 0.03 × 1000 = 45 grams.",
          },
          {
            label: "3",
            explanation:
              "The recommended daily feeding amount is 45 grams of appropriate food items.",
          },
        ],
        result: "Daily Feeding Amount = 45 grams",
      }}
      relatedCalculators={[
        { title: "Cat Chocolate Toxicity Calculator", url: "/pets/cat-chocolate-toxicity", icon: "🐱" },
        { title: "Fish Food Feeding Rate Calculator", url: "/pets/fish-food-feeding-rate", icon: "🐶" },
        { title: "Antibiotic Dose Reference (mg/kg)", url: "/pets/bird-antibiotic-dose-reference", icon: "🐱" },
        { title: "Horse Colic Risk Assessment (Feeding & Management)", url: "/pets/horse-colic-risk-assessment", icon: "🐎" },
        { title: "Vitamin A Requirement Calculator", url: "/pets/bird-vitamin-a-requirement", icon: "💉" },
        { title: "Foaling Countdown & Lactation Feed Planner", url: "/pets/horse-foaling-countdown-lactation-feed-planner", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Daily Feeding Ratio (by Species & Age)" },
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
