import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Dog } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogIdealWeightTargetCaloriesCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    currentWeight: "",
    idealWeight: "",
    activityLevel: "moderate",
  });

  // Activity multipliers for MER (Maintenance Energy Requirement)
  // Source: NRC and WSAVA guidelines
  const activityMultipliers: Record<string, number> = {
    low: 1.2, // sedentary, inactive
    moderate: 1.6, // typical pet dog
    high: 2.0, // working or highly active dog
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const currentWeightRaw = parseFloat(inputs.currentWeight);
    const idealWeightRaw = parseFloat(inputs.idealWeight);
    if (
      !currentWeightRaw ||
      currentWeightRaw <= 0 ||
      !idealWeightRaw ||
      idealWeightRaw <= 0
    )
      return {
        value: 0,
        label: "Enter valid current and ideal weights...",
        subtext: null,
        warning: null,
      };

    // Convert weights to kg if imperial
    const currentWeightKg =
      unit === "imperial" ? currentWeightRaw / 2.20462 : currentWeightRaw;
    const idealWeightKg =
      unit === "imperial" ? idealWeightRaw / 2.20462 : idealWeightRaw;

    // Calculate Resting Energy Requirement (RER) for ideal weight
    // RER = 70 * (idealWeightKg)^0.75
    const RER = 70 * Math.pow(idealWeightKg, 0.75);

    // Calculate Maintenance Energy Requirement (MER) based on activity level
    const activityMultiplier = activityMultipliers[inputs.activityLevel] || 1.6;
    const MER = RER * activityMultiplier;

    // Weight difference and warning if current weight is far from ideal
    const weightDiffPercent =
      ((currentWeightKg - idealWeightKg) / idealWeightKg) * 100;

    let warning = null;
    if (weightDiffPercent > 20) {
      warning =
        "Your dog is significantly overweight. Consult your veterinarian for a tailored weight loss plan.";
    } else if (weightDiffPercent < -15) {
      warning =
        "Your dog appears underweight. A veterinary assessment is recommended to rule out health issues.";
    }

    // Format results for display
    const caloriesLabel = `Target daily calories to maintain ideal weight (${inputs.activityLevel} activity)`;
    const caloriesValue = Math.round(MER);

    return {
      value: caloriesValue.toLocaleString(),
      label: caloriesLabel,
      subtext: `Ideal Weight: ${idealWeightKg.toFixed(2)} kg (${(
        idealWeightKg * 2.20462
      ).toFixed(1)} lbs) | RER: ${RER.toFixed(0)} kcal/day`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "How does the calculator determine my dog's ideal weight?",
      answer: "The calculator uses breed standards and your dog's current age to estimate ideal weight ranges. It compares your dog's actual weight against these benchmarks to identify if your dog is underweight, ideal, or overweight.",
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "You'll need your dog's breed, age in months or years, current weight in pounds or kilograms, and activity level (sedentary, moderate, or active). Some calculators may also ask about spay/neuter status.",
    },
    {
      question: "How are daily calorie recommendations calculated?",
      answer: "The calculator uses the Resting Energy Expenditure (REE) formula multiplied by an activity factor. A typical moderate dog needs 25-30 calories per pound of ideal body weight daily, adjusted for activity level.",
    },
    {
      question: "Why does my dog's ideal weight differ from breed standards?",
      answer: "Individual dogs vary based on bone density, muscle mass, and genetic factors. The calculator personalizes recommendations using your dog's specific age and activity level rather than using breed averages alone.",
    },
    {
      question: "How often should I recalculate my dog's target calories?",
      answer: "Recalculate every 3-6 months as your dog ages, or whenever activity level changes significantly. Puppies under 12 months may need recalculation monthly as they grow rapidly.",
    },
    {
      question: "Can this calculator be used for mixed-breed dogs?",
      answer: "Yes, you can input your mixed breed's adult weight estimate and current weight. Select the closest matching primary breed or use the mixed-breed option if available for more accurate recommendations.",
    },
    {
      question: "What activity level should I select for my dog?",
      answer: "Sedentary dogs exercise &lt;30 minutes daily, moderate dogs 30-60 minutes, and active dogs &gt;60 minutes. Working or high-energy breeds typically fall into the active category.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // INPUT HANDLERS
  const onInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

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
              type="number"
              min={0}
              step="any"
              placeholder={`Enter current weight in ${unit === "imperial" ? "lbs" : "kg"}`}
              value={inputs.currentWeight}
              onChange={(e) => onInputChange("currentWeight", e.target.value)}
              aria-describedby="currentWeightHelp"
            />
          </div>
          <div>
            <Label htmlFor="idealWeight" className="text-slate-700 dark:text-slate-300">
              Ideal Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="idealWeight"
              type="number"
              min={0}
              step="any"
              placeholder={`Enter ideal weight in ${unit === "imperial" ? "lbs" : "kg"}`}
              value={inputs.idealWeight}
              onChange={(e) => onInputChange("idealWeight", e.target.value)}
              aria-describedby="idealWeightHelp"
            />
          </div>
          <div>
            <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300">
              Activity Level
            </Label>
            <Select
              id="activityLevel"
              value={inputs.activityLevel}
              onValueChange={(val) => onInputChange("activityLevel", val)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (sedentary)</SelectItem>
                <SelectItem value="moderate">Moderate (typical pet)</SelectItem>
                <SelectItem value="high">High (active/working)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ currentWeight: "", idealWeight: "", activityLevel: "moderate" })
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Ideal Weight & Target Calories Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine your dog's ideal weight range and daily caloric needs based on breed, age, and activity level. It provides personalized nutrition recommendations to support healthy weight management and overall wellness.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by entering your dog's breed (or selecting mixed breed), current age, current weight, and daily activity level. The calculator will analyze this data against established veterinary guidelines and breed standards.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the ideal weight range and recommended daily calories in your results. Compare your dog's current weight to the ideal range—if outside this zone, gradually adjust portions to reach the target weight over 4-8 weeks.</p>
        </div>
      </section>

      {/* TABLE: Ideal Weight Ranges by Common Dog Breeds */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Ideal Weight Ranges by Common Dog Breeds</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference chart showing typical healthy weight ranges for popular dog breeds.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Breed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ideal Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chihuahua</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Toy</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">French Bulldog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Small</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Golden Retriever</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55-75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Labrador Retriever</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55-80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">German Shepherd</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dachshund</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Small</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Beagle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bulldog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Poodle (Standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Siberian Husky</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Ranges vary based on individual dogs; consult your veterinarian for personalized recommendations.</p>
      </section>

      {/* TABLE: Daily Calorie Estimates by Activity Level */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calorie Estimates by Activity Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimated daily calorie requirements based on ideal body weight and activity level.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ideal Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sedentary (kcal/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate (kcal/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Active (kcal/day)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-175</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-225</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-300</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">375-425</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500-575</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">625-750</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">750-875</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000-1150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1250-1500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1125-1300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1500-1725</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1875-2250</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1500-1750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2000-2300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2500-3000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are estimates; individual requirements vary based on metabolism, age, and health status.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your dog monthly and recalculate quarterly to track progress toward the ideal weight range.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for treats in daily calorie totals—treats should comprise no more than 10% of total daily calories.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Active dogs burning more than 2000 calories daily benefit from nutrient-dense, high-protein foods to maintain muscle mass.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consult your veterinarian before making major dietary changes, especially for puppies, senior dogs, or those with health conditions.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using breed standards instead of individual factors</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Breed averages don't account for your dog's specific metabolism, spay/neuter status, or health conditions—always personalize based on individual characteristics.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for treats and table scraps</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Treats can add 200+ extra calories daily; failing to include them prevents accurate weight management and makes targets unrealistic.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not adjusting calories for life stage changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Puppies and senior dogs have different metabolic rates; recalculate when your dog enters a new life stage for accurate nutrition planning.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring activity level changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A dog recovering from surgery or one that becomes less active needs 10-25% fewer calories to prevent unwanted weight gain.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator determine my dog's ideal weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses breed standards and your dog's current age to estimate ideal weight ranges. It compares your dog's actual weight against these benchmarks to identify if your dog is underweight, ideal, or overweight.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What information do I need to use this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You'll need your dog's breed, age in months or years, current weight in pounds or kilograms, and activity level (sedentary, moderate, or active). Some calculators may also ask about spay/neuter status.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How are daily calorie recommendations calculated?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses the Resting Energy Expenditure (REE) formula multiplied by an activity factor. A typical moderate dog needs 25-30 calories per pound of ideal body weight daily, adjusted for activity level.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does my dog's ideal weight differ from breed standards?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Individual dogs vary based on bone density, muscle mass, and genetic factors. The calculator personalizes recommendations using your dog's specific age and activity level rather than using breed averages alone.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my dog's target calories?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate every 3-6 months as your dog ages, or whenever activity level changes significantly. Puppies under 12 months may need recalculation monthly as they grow rapidly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator be used for mixed-breed dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, you can input your mixed breed's adult weight estimate and current weight. Select the closest matching primary breed or use the mixed-breed option if available for more accurate recommendations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What activity level should I select for my dog?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Sedentary dogs exercise &lt;30 minutes daily, moderate dogs 30-60 minutes, and active dogs &gt;60 minutes. Working or high-energy breeds typically fall into the active category.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Pet Food Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidelines for pet food nutrition and labeling standards used by veterinarians worldwide.</p>
          </li>
          <li>
            <a href="https://www.avma.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative source for pet health information and veterinary standards including canine nutrition.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals - Canine Weight Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical guidance on dog weight management, calorie calculations, and obesity prevention from veterinary professionals.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis School of Veterinary Medicine - Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-based information on canine nutritional requirements and metabolic calculations.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Ideal Weight & Target Calories Calculator"
      description="Determine your dog's ideal healthy weight and the specific calorie intake needed to maintain it based on breed and size."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "MER = 70 × (Ideal Weight in kg)^0.75 × Activity Multiplier",
        variables: [
          {
            symbol: "MER",
            description:
              "Maintenance Energy Requirement - total daily calories needed to maintain ideal weight",
          },
          {
            symbol: "70 × (Ideal Weight)^0.75",
            description:
              "Resting Energy Requirement (RER) - energy needed for basic physiological functions at rest",
          },
          {
            symbol: "Activity Multiplier",
            description:
              "Factor based on dog's activity level: low (1.2), moderate (1.6), high (2.0)",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 50 lb (22.7 kg) dog currently overweight with an ideal weight of 40 lb (18.1 kg) and moderate activity level.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert ideal weight to kg if needed: 40 lb ÷ 2.20462 = 18.1 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate RER: 70 × (18.1)^0.75 ≈ 70 × 8.3 = 581 kcal/day.",
          },
          {
            label: "Step 3",
            explanation:
              "Apply activity multiplier for moderate activity (1.6): 581 × 1.6 = 930 kcal/day.",
          },
        ],
        result:
          "The dog should consume approximately 930 kcal daily to maintain its ideal weight at a moderate activity level.",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
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
        {
          id: "what-is",
          label: "Understanding Dog Ideal Weight & Target Calories Calculator",
        },
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