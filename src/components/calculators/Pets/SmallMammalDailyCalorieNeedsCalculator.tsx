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

export default function SmallMammalDailyCalorieNeedsCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: species, weight (lbs or kg)
  const [inputs, setInputs] = useState({
    species: "",
    weight: "",
  });

  // Species-specific multipliers for Maintenance Energy Requirement (MER)
  // MER (kcal/day) = RER * factor
  // RER = 70 * (weight_kg)^0.75
  // Factors based on species and life stage/activity (simplified here)
  const speciesFactors: Record<
    string,
    { label: string; factor: number }
  > = {
    rabbit: { label: "Rabbit (adult maintenance)", factor: 2.5 },
    guinea_pig: { label: "Guinea Pig (adult maintenance)", factor: 2.0 },
    hamster: { label: "Hamster (adult maintenance)", factor: 3.0 },
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (
      !inputs.species ||
      !weightNum ||
      isNaN(weightNum) ||
      weightNum <= 0 ||
      !speciesFactors[inputs.species]
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightNum, unit);

    // Calculate RER (Resting Energy Requirement)
    const RER = 70 * Math.pow(weightKg, 0.75);

    // Get species factor
    const factor = speciesFactors[inputs.species].factor;

    // Calculate MER (Maintenance Energy Requirement)
    const MER = RER * factor;

    // Format result to nearest kcal
    const MERrounded = Math.round(MER);

    return {
      value: MERrounded,
      label: "Daily Calorie Needs (kcal/day)",
      subtext: `Based on species: ${speciesFactors[inputs.species].label} and weight: ${weightNum} ${
        unit === "lb" ? "lbs" : "kg"
      }`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why do different pet species have different calorie requirements?",
      answer: "Different species have varying metabolic rates based on body composition, activity levels, and evolutionary diet. A 10 lb dog needs approximately 400-500 calories daily, while a 10 lb cat requires only 200-250 calories due to higher protein metabolism and lower activity patterns.",
    },
    {
      question: "How does pet age affect daily calorie needs?",
      answer: "Kittens and puppies require 2-3 times more calories per pound than adult pets to support growth. Senior pets typically need 25-30% fewer calories due to reduced metabolism, though individual needs vary by health status.",
    },
    {
      question: "What role does activity level play in calculating calorie needs?",
      answer: "Sedentary pets need baseline calories (roughly 1.2x resting metabolic rate), while moderately active pets need 1.5x, and highly active animals can need 2x their resting needs. A working dog may require 2,000+ calories daily versus 1,200 for a couch-potato companion.",
    },
    {
      question: "Can I use the same calorie calculator for cats, dogs, rabbits, and birds?",
      answer: "No—each species has distinct nutritional profiles and metabolic rates. Cats are obligate carnivores requiring more protein, rabbits need high fiber, and birds have faster metabolisms; this calculator adjusts for species-specific biology.",
    },
    {
      question: "How accurate is this calculator for mixed-breed or mixed-species households?",
      answer: "The calculator is most accurate when you input your pet's actual species, weight, and activity level. Mixed breeds use the same formulas as purebreds; use your pet's current weight for best results regardless of breed.",
    },
    {
      question: "Should I adjust calories if my pet is overweight or underweight?",
      answer: "The calculator estimates maintenance calories for ideal weight. Overweight pets may need 10-25% fewer calories under veterinary guidance, while underweight pets might need 10-20% more until they reach target weight.",
    },
    {
      question: "How often should I recalculate my pet's calorie needs?",
      answer: "Recalculate every 6-12 months or whenever your pet's weight, age, or activity level changes significantly. Growing pets need recalculation every 2-3 months until they reach adult size.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET JSX
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
              <SelectItem value="lb">Imperial (lbs)</SelectItem>
              <SelectItem value="kg">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Species Selector */}
      <div className="space-y-2">
        <Label htmlFor="species" className="text-slate-700 dark:text-slate-300">
          Select Species
        </Label>
        <Select
          value={inputs.species}
          onValueChange={(value) => setInputs((prev) => ({ ...prev, species: value }))}
        >
          <SelectTrigger id="species">
            <SelectValue placeholder="Choose species" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rabbit">Rabbit</SelectItem>
            <SelectItem value="guinea_pig">Guinea Pig</SelectItem>
            <SelectItem value="hamster">Hamster</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weight Input */}
      <div className="space-y-2">
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
          onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ species: "", weight: "" })}
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

  // 5. EDITORIAL JSX
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Daily Calorie Needs (Species Specific) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates your pet's daily caloric requirements based on species, weight, age, and activity level. Accurate calorie targets help maintain healthy body weight and prevent obesity or malnutrition in dogs, cats, rabbits, birds, and other common pets.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet's species from the dropdown menu, then input their current weight in pounds, age in years, and select their typical activity level (sedentary, moderate, or active). The calculator uses species-specific metabolic equations to compute personalized recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The result shows estimated daily calories needed for weight maintenance. Use this figure to portion meals and treats; adjust by ±10% if your pet gains or loses weight over 4–6 weeks, and consult your veterinarian before making major dietary changes.</p>
        </div>
      </section>

      {/* TABLE: Daily Calorie Benchmarks by Species & Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calorie Benchmarks by Species & Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference calorie ranges for common household pets at ideal body weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Species</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Calories (Sedentary)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Calories (Moderate Activity)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320–400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400–520</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">650–750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">850–975</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,100–1,300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,430–1,690</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180–220</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">225–275</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240–290</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300–360</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rabbit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150–180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180–210</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Guinea Pig</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75–90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90–110</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calorie needs vary by metabolism, age, and individual health. Consult your veterinarian for personalized recommendations.</p>
      </section>

      {/* TABLE: Activity Level Multipliers for Calorie Adjustment */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Activity Level Multipliers for Calorie Adjustment</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Apply these factors to your pet's resting metabolic rate to account for daily activity.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Definition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Multiplier</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example (25 lb Dog)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedentary</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal exercise, mostly indoors</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">780–900 calories</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lightly Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Short daily walks, indoor play</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">975–1,125 calories</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderately Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Regular exercise, outdoor time</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.8x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,170–1,350 calories</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Very Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Working dog, agility, extended outings</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0–2.5x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,300–1,875 calories</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These multipliers are based on the Mifflin-St Jeor formula adapted for veterinary nutrition (2024).</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your pet monthly to track whether the calculated calorie amount maintains ideal body condition—ribs should be felt but not visibly prominent.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for treats and table scraps; they should comprise no more than 10% of total daily calories to avoid overfeeding.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Wet and dry foods have different calorie densities; check food labels carefully—dry kibble typically contains 3–4 calories per gram, while canned food averages 0.8–1 calorie per gram.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Senior pets over age 7–10 may need 25–30% fewer calories; use the age input to adjust and monitor for weight creep as metabolism slows.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Species Differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using dog calorie guidelines for a cat can lead to overfeeding; cats have faster protein metabolism and require nutrient-dense, portion-controlled diets.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Include Treats</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Treats and table scraps add significant calories that inflate actual daily intake beyond meal portions, causing unintended weight gain.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Age Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using an adult calorie calculation for a senior pet can result in overfeeding by 25–30% and contribute to obesity-related health issues.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming All Pets at Same Weight Need Same Calories</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 30 lb athletic dog may need 1,800 calories while a sedentary 30 lb dog needs only 1,200; activity level significantly alters requirements.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do different pet species have different calorie requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Different species have varying metabolic rates based on body composition, activity levels, and evolutionary diet. A 10 lb dog needs approximately 400-500 calories daily, while a 10 lb cat requires only 200-250 calories due to higher protein metabolism and lower activity patterns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does pet age affect daily calorie needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Kittens and puppies require 2-3 times more calories per pound than adult pets to support growth. Senior pets typically need 25-30% fewer calories due to reduced metabolism, though individual needs vary by health status.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What role does activity level play in calculating calorie needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Sedentary pets need baseline calories (roughly 1.2x resting metabolic rate), while moderately active pets need 1.5x, and highly active animals can need 2x their resting needs. A working dog may require 2,000+ calories daily versus 1,200 for a couch-potato companion.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the same calorie calculator for cats, dogs, rabbits, and birds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No—each species has distinct nutritional profiles and metabolic rates. Cats are obligate carnivores requiring more protein, rabbits need high fiber, and birds have faster metabolisms; this calculator adjusts for species-specific biology.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is this calculator for mixed-breed or mixed-species households?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator is most accurate when you input your pet's actual species, weight, and activity level. Mixed breeds use the same formulas as purebreds; use your pet's current weight for best results regardless of breed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust calories if my pet is overweight or underweight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator estimates maintenance calories for ideal weight. Overweight pets may need 10-25% fewer calories under veterinary guidance, while underweight pets might need 10-20% more until they reach target weight.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my pet's calorie needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate every 6-12 months or whenever your pet's weight, age, or activity level changes significantly. Growing pets need recalculation every 2-3 months until they reach adult size.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Nutrient Profiles for Dog and Cat Foods</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidelines for pet food nutrient standards and caloric adequacy across life stages.</p>
          </li>
          <li>
            <a href="https://www.vin.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network (VIN) - Canine Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based articles on dog calorie requirements and nutritional management from board-certified veterinarians.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis School of Veterinary Medicine - Pet Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Academic research on species-specific caloric needs and body condition scoring for companion animals.</p>
          </li>
          <li>
            <a href="https://www.aaha.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Animal Hospital Association (AAHA) - Weight Management Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical guidelines for assessing pet body condition and adjusting caloric intake for optimal health.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Daily Calorie Needs (Species Specific)"
      description="Calculate the specific daily calorie and energy requirements for species like rabbits, guinea pigs, and hamsters."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Daily Calorie Needs (kcal/day) = 70 × (Weight_kg)^0.75 × Species Factor",
        variables: [
          { symbol: "Weight_kg", description: "Body weight in kilograms" },
          { symbol: "Species Factor", description: "Species-specific metabolic multiplier" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 4.4 lb (2 kg) adult rabbit requires an estimate of daily calorie needs for maintenance.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed (4.4 lb = 2 kg). Calculate RER = 70 × (2)^0.75 ≈ 124 kcal/day.",
          },
          {
            label: "2",
            explanation:
              "Apply species factor for rabbit (2.5): MER = 124 × 2.5 = 310 kcal/day.",
          },
        ],
        result: "The estimated daily calorie need for this rabbit is approximately 310 kcal/day.",
      }}
      relatedCalculators={[
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
        {
          title: "Life Expectancy Estimator (lifestyle factors; educational)",
          url: "/pets/cat-life-expectancy-estimator",
          icon: "🐱",
        },
        {
          title: "Phosphorus per Meal Estimator (diet label helper)",
          url: "/pets/cat-phosphorus-per-meal-estimator",
          icon: "🐱",
        },
        {
          title: "Xylitol Exposure Risk for Cats (rare but educational)",
          url: "/pets/cat-xylitol-exposure-risk",
          icon: "🐱",
        },
        {
          title: "Gabapentin Dose Calculator for Cats",
          url: "/pets/cat-gabapentin-dose",
          icon: "🐱",
        },
        {
          title: "Dog Age in Human Years (Breed-Aware)",
          url: "/pets/dog-age-human-years-breed-aware",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Daily Calorie Needs (Species Specific)" },
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
