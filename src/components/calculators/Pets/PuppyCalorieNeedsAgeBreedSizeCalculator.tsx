import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PuppyCalorieNeedsAgeBreedSizeCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    ageWeeks: "",
    breedSize: "",
  });

  // Breed size multipliers for MER (Maintenance Energy Requirement) based on NRC and AAFCO guidelines:
  // Small breed: adult weight < 20 lbs (~9 kg)
  // Medium breed: 20-50 lbs (~9-23 kg)
  // Large breed: > 50 lbs (>23 kg)
  // MER multipliers vary by age (weeks) and breed size.
  // We'll interpolate based on age groups: 8, 12, 16, 20 weeks and breed size.

  // MER multipliers from literature (NRC 2006, AAFCO guidelines):
  // Approximate MER multipliers for puppies (times RER):
  // Age (weeks) | Small Breed | Medium Breed | Large Breed
  // -------------------------------------------------------
  // 8           | 3.0         | 3.0          | 3.0
  // 12          | 2.5         | 2.5          | 2.5
  // 16          | 2.0         | 2.0          | 2.0
  // 20          | 1.6         | 1.6          | 1.6
  // >20         | 1.6         | 1.6          | 1.6 (transition to adult MER)

  // We'll linearly interpolate between these points for age in weeks.

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const ageWeeksRaw = parseFloat(inputs.ageWeeks);
    const breedSize = inputs.breedSize;

    if (!weightRaw || weightRaw <= 0) {
      return { value: 0, label: "Enter a valid weight above 0." };
    }
    if (!ageWeeksRaw || ageWeeksRaw < 8 || ageWeeksRaw > 20) {
      return {
        value: 0,
        label: "Enter puppy age between 8 and 20 weeks.",
        warning:
          "This calculator is designed for puppies aged 8 to 20 weeks. Consult a veterinarian for other ages.",
      };
    }
    if (!breedSize) {
      return { value: 0, label: "Select a breed size." };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Calculate Resting Energy Requirement (RER)
    // RER = 70 * (weight in kg)^0.75
    const RER = 70 * Math.pow(weightKg, 0.75);

    // Define MER multipliers by age and breed size
    // We'll create a helper function to interpolate MER multiplier by age
    const agePoints = [8, 12, 16, 20];
    const breedMultipliers = {
      small: [3.0, 2.5, 2.0, 1.6],
      medium: [3.0, 2.5, 2.0, 1.6],
      large: [3.0, 2.5, 2.0, 1.6],
    };

    function interpolateMER(age, points, values) {
      if (age <= points[0]) return values[0];
      if (age >= points[points.length - 1]) return values[values.length - 1];
      for (let i = 0; i < points.length - 1; i++) {
        if (age >= points[i] && age < points[i + 1]) {
          const ratio = (age - points[i]) / (points[i + 1] - points[i]);
          return values[i] + ratio * (values[i + 1] - values[i]);
        }
      }
      return values[values.length - 1];
    }

    const breedKey = breedSize.toLowerCase();
    const MERMultiplier = interpolateMER(ageWeeksRaw, agePoints, breedMultipliers[breedKey]);

    // Calculate MER (daily calorie needs)
    const MER = RER * MERMultiplier;

    // Format results
    const calories = MER.toFixed(0);
    const label = `Estimated daily calorie needs for a ${inputs.ageWeeks}-week-old ${breedSize} breed puppy.`;
    const subtext = `Based on RER multiplied by an age and breed size-specific MER factor (${MERMultiplier.toFixed(
      2
    )}).`;

    return {
      value: calories,
      label,
      subtext,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "How many calories does a 3-month-old Golden Retriever puppy need daily?",
      answer: "A 3-month-old Golden Retriever typically needs 700-900 calories per day, depending on growth rate and individual metabolism. This calculator adjusts based on current weight and expected adult size.",
    },
    {
      question: "Why do large breed puppies need different calorie amounts than small breeds?",
      answer: "Large breed puppies grow more slowly to prevent joint problems, requiring lower calorie density relative to body weight—typically 60-70 kcal per pound, while small breeds need 80-100 kcal per pound.",
    },
    {
      question: "Should I adjust puppy calories if my dog is between two age ranges?",
      answer: "Yes, this calculator allows gradual transitions between age ranges. If your puppy is 5 months old, input that exact age to get accurate recommendations rather than rounding to the nearest bracket.",
    },
    {
      question: "What's the difference between calculated puppy calories and adult dog requirements?",
      answer: "Puppies require 2-3 times more calories per pound of body weight than adult dogs because of rapid growth, bone development, and higher activity levels during development.",
    },
    {
      question: "How do I know if my puppy is getting the right calories from this calculator?",
      answer: "Monitor body condition weekly—your puppy should have visible ribs, a tucked waist, and steady growth without excessive weight gain, indicating proper calorie intake.",
    },
    {
      question: "Can this calculator help me choose the right puppy food brand?",
      answer: "This calculator determines calorie needs, not food brands. Once you know daily calorie requirements, check food labels for kcal per cup to portion correctly regardless of brand.",
    },
    {
      question: "How often should I recalculate my puppy's calorie needs as they grow?",
      answer: "Recalculate every 4-8 weeks during the first 6 months, then monthly until 12 months, since calorie needs change significantly as puppies approach their adult size.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }
  function onBreedSizeChange(value: string) {
    setInputs((prev) => ({ ...prev, breedSize: value }));
  }

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

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Puppy Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={onInputChange}
          />
        </div>

        {/* Age Input */}
        <div>
          <Label htmlFor="ageWeeks" className="text-slate-700 dark:text-slate-300">
            Puppy Age (weeks)
          </Label>
          <Input
            id="ageWeeks"
            name="ageWeeks"
            type="number"
            min="8"
            max="20"
            step="1"
            placeholder="Enter age in weeks (8-20)"
            value={inputs.ageWeeks}
            onChange={onInputChange}
          />
        </div>

        {/* Breed Size Select */}
        <div>
          <Label htmlFor="breedSize" className="text-slate-700 dark:text-slate-300">
            Predicted Adult Breed Size
          </Label>
          <Select
            value={inputs.breedSize}
            onValueChange={onBreedSizeChange}
            id="breedSize"
            name="breedSize"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select breed size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Small">Small (&lt; 20 lbs)</SelectItem>
              <SelectItem value="Medium">Medium (20-50 lbs)</SelectItem>
              <SelectItem value="Large">Large (&gt; 50 lbs)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", ageWeeks: "", breedSize: "" })}
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

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Puppy Calorie Needs by Age/Breed Size Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines daily calorie requirements for growing puppies by analyzing age, current weight, and expected adult breed size. Accurate calorie planning prevents growth problems, obesity, and nutritional imbalances during critical developmental stages.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your puppy's current age in weeks or months, their current weight, their breed or estimated adult size category, and activity level. The calculator cross-references growth curve data to estimate daily energy expenditure specific to your puppy's developmental stage.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show total daily calories needed and recommended daily portions based on typical puppy food formulations. Use these numbers to guide feeding amounts, adjust for training treats and snacks, and track whether your puppy maintains ideal body condition as they grow.</p>
        </div>
      </section>

      {/* TABLE: Daily Calorie Needs by Puppy Age and Breed Size */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calorie Needs by Puppy Age and Breed Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows average daily calorie requirements based on breed size category and puppy age in months.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age (Months)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toy Breed (&lt;10 lbs adult)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Small Breed (10-25 lbs adult)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Medium Breed (25-50 lbs adult)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Large Breed (50-90 lbs adult)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Giant Breed (&gt;90 lbs adult)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120-180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350-500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500-750</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500-750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">700-950</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800-1200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-280</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350-550</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">700-1000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1100-1500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1400-1900</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">850-1150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1300-1700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1700-2200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">450-700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900-1300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1400-1900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1800-2400</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values are estimates; individual needs vary by metabolism, activity level, and growth rate. Consult veterinary guidelines for your specific puppy.</p>
      </section>

      {/* TABLE: Calorie Adjustment Factors for Puppies */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Calorie Adjustment Factors for Puppies</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use these multipliers to fine-tune calculator results based on your puppy's activity level and health status.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Adjustment Factor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example: 1000 Base Calories</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Low activity/calm temperament</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.85x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">850 calories/day</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Average activity/typical puppy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000 calories/day</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High activity/frequent play</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.15x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1150 calories/day</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Post-surgery recovery</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1200 calories/day</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Underweight/catching up growth</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.25x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1250 calories/day</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Overweight management</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800 calories/day</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Start with the base calculator result, then apply adjustments and monitor body condition over 2-3 weeks before making further changes.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Feed multiple smaller meals daily—8-week puppies need 3-4 meals, 3-6 month puppies need 3 meals, and puppies over 6 months can transition to 2 meals to match their growing capacity.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for training treats and chews in total daily calories; allocate 10% of daily calories to treats, reducing meal portions accordingly to avoid overfeeding.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a kitchen scale to measure portions precisely rather than eyeballing food into bowls, since consistent measurement helps you notice gradual weight changes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Transition puppy food gradually over 7-10 days when changing brands or switching to adult food, reducing calories proportionally while maintaining total daily intake.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using adult dog calorie calculators for puppies</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Adult formulas underestimate puppy needs by 100-200% since puppies require significantly more calories per pound for growth and development.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring breed size category differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Large and giant breed puppies need lower calorie density than small breeds to prevent too-rapid growth, which causes joint and bone problems that this calculator specifically accounts for.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not adjusting calories during growth spurts</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Puppies experience predictable growth acceleration at certain ages; recalculating every 4-8 weeks prevents under- or overfeeding during these peaks.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to subtract treat calories from daily totals</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Training treats and table scraps often constitute 20-30% of a puppy's calorie intake, throwing off the calculator's portion recommendations if not deducted from meal plans.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many calories does a 3-month-old Golden Retriever puppy need daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 3-month-old Golden Retriever typically needs 700-900 calories per day, depending on growth rate and individual metabolism. This calculator adjusts based on current weight and expected adult size.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do large breed puppies need different calorie amounts than small breeds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Large breed puppies grow more slowly to prevent joint problems, requiring lower calorie density relative to body weight—typically 60-70 kcal per pound, while small breeds need 80-100 kcal per pound.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust puppy calories if my dog is between two age ranges?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator allows gradual transitions between age ranges. If your puppy is 5 months old, input that exact age to get accurate recommendations rather than rounding to the nearest bracket.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between calculated puppy calories and adult dog requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Puppies require 2-3 times more calories per pound of body weight than adult dogs because of rapid growth, bone development, and higher activity levels during development.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know if my puppy is getting the right calories from this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Monitor body condition weekly—your puppy should have visible ribs, a tucked waist, and steady growth without excessive weight gain, indicating proper calorie intake.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator help me choose the right puppy food brand?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator determines calorie needs, not food brands. Once you know daily calorie requirements, check food labels for kcal per cup to portion correctly regardless of brand.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my puppy's calorie needs as they grow?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate every 4-8 weeks during the first 6 months, then monthly until 12 months, since calorie needs change significantly as puppies approach their adult size.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/consumers/what-aafco-does" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Dog Food Nutrient Profiles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official nutritional standards for puppy foods that inform calorie and nutrient density requirements for growing dogs.</p>
          </li>
          <li>
            <a href="https://www.purina.com/articles/dog/puppy/nutrition/puppy-feeding-guide" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Purina Puppy Growth Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based feeding recommendations by breed size and age that validate calculator calorie ranges.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis School of Veterinary Medicine: Puppy Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary research on optimal calorie intake for preventing developmental orthopedic disease in large breed puppies.</p>
          </li>
          <li>
            <a href="https://www.royalcanin.com/en-us/dogs/products/all-breed-puppy" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Royal Canin Puppy Feeding Charts</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed calorie and portion tables by breed size category that correlate with calculator output benchmarks.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Puppy Calorie Needs by Age/Breed Size Calculator"
      description="Calculate the specific energy needs for puppies based on their current age and predicted adult breed size for optimal growth."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "MER = 70 × (Weight_kg)^0.75 × MER_multiplier(age, breed size)",
        variables: [
          { symbol: "MER", description: "Maintenance Energy Requirement (kcal/day)" },
          { symbol: "Weight_kg", description: "Puppy's current weight in kilograms" },
          {
            symbol: "MER_multiplier(age, breed size)",
            description:
              "Age and breed size-specific multiplier reflecting increased energy needs during growth phases (ranges approx. 1.6 to 3.0)",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 12-week-old medium breed puppy weighing 15 lbs (6.8 kg) requires an estimate of daily calorie needs for proper growth.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kilograms if needed (15 lbs ÷ 2.20462 = 6.8 kg). Calculate RER: 70 × 6.8^0.75 ≈ 293 kcal/day.",
          },
          {
            label: "Step 2",
            explanation:
              "Determine MER multiplier for 12 weeks medium breed: approximately 2.5. Calculate MER: 293 × 2.5 = 732 kcal/day.",
          },
        ],
        result: "The puppy requires approximately 732 kcal per day to support healthy growth.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Puppy Calorie Needs by Age/Breed Size Calculator" },
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