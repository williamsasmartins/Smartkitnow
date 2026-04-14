import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Dog } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogTreatCaloriesDailyAllowanceCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    treatCalories: "",
  });

  // 2. LOGIC ENGINE
  // RER = 70 * (weightKg ^ 0.75)
  // Max daily treat calories = 10% of RER (recommended max treat calories to avoid weight gain)
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const treatCaloriesRaw = parseFloat(inputs.treatCalories);

    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid dog weight.",
        subtext: null,
        warning: null,
      };
    }
    if (!treatCaloriesRaw || treatCaloriesRaw <= 0) {
      return {
        value: 0,
        label: "Please enter the calorie content of the treat.",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Calculate Resting Energy Requirement (RER)
    // RER = 70 * weightKg^0.75
    const RER = 70 * Math.pow(weightKg, 0.75);

    // Maximum daily treat calories recommended = 10% of RER
    const maxTreatCalories = RER * 0.10;

    // Calculate how many treats can be given daily without exceeding max treat calories
    const maxTreats = Math.floor(maxTreatCalories / treatCaloriesRaw);

    // Warning if treat calories exceed max daily allowance
    let warning = null;
    if (treatCaloriesRaw > maxTreatCalories) {
      warning =
        "The calorie content of a single treat exceeds the recommended maximum daily treat calories. Consider choosing lower-calorie treats to avoid weight gain.";
    }

    return {
      value: maxTreats > 0 ? maxTreats : 0,
      label:
        maxTreats > 0
          ? `Maximum treats per day without exceeding 10% of daily calorie needs (${maxTreatCalories.toFixed(
              1
            )} kcal).`
          : "Treat calorie content too high for safe daily allowance.",
      subtext: `Based on RER: ${RER.toFixed(1)} kcal/day. Treat calorie content: ${treatCaloriesRaw} kcal.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What percentage of my dog's daily calories should come from treats?",
      answer: "Treats should not exceed 10% of your dog's total daily caloric intake to maintain proper nutrition and prevent obesity. The remaining 90% should come from balanced commercial or home-prepared meals.",
    },
    {
      question: "How do I find the calorie content of my dog's treats?",
      answer: "Check the nutrition label on treat packaging for calories per piece or serving. If unavailable, consult your veterinarian or use USDA FoodData Central for homemade treat ingredients.",
    },
    {
      question: "Does a dog's activity level affect daily treat allowance?",
      answer: "Yes, highly active dogs can tolerate slightly more treats while maintaining weight, whereas sedentary dogs require fewer calories and should receive limited treats to prevent weight gain.",
    },
    {
      question: "How often should I recalculate my dog's treat allowance?",
      answer: "Recalculate every 3-6 months as your dog ages, gains/loses weight, or experiences changes in activity level or health status.",
    },
    {
      question: "Can puppies and senior dogs have the same treat allowance?",
      answer: "No; puppies need more calories for growth and seniors often need fewer calories, so adjust treat amounts based on life stage and your vet's recommendations.",
    },
    {
      question: "What treats are best for dogs on restricted calorie diets?",
      answer: "Low-calorie options include air-popped popcorn, carrot sticks, green beans, and freeze-dried chicken; these satisfy dogs while keeping calorie counts minimal.",
    },
    {
      question: "Should I count training treats differently from regular treats?",
      answer: "No; all treats count toward the 10% daily caloric limit, including training rewards, so subtract training treat calories from your dog's total allowance.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // INPUT HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
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
            Dog Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={handleInputChange}
          />
        </div>

        {/* Treat Calories Input */}
        <div>
          <Label htmlFor="treatCalories" className="text-slate-700 dark:text-slate-300">
            Calories per Treat (kcal)
          </Label>
          <Input
            id="treatCalories"
            name="treatCalories"
            type="number"
            min="0"
            step="any"
            placeholder="Enter calories per treat"
            value={inputs.treatCalories}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo on inputs change
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", treatCalories: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Treat Calories & Daily Allowance Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine the maximum daily treat allowance for your dog based on weight, activity level, and the 10% rule—treats should not exceed 10% of total daily calories. By using this tool, you ensure treats complement rather than compromise your dog's balanced diet.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by inputting your dog's weight, selecting their activity level (sedentary, moderate, or high), and entering the calorie count of treats you plan to give. The calculator will estimate daily caloric needs and show how many treats fit within the healthy 10% guideline.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the results to understand your dog's daily treat budget in both calories and quantity. Adjust treat choices or portion sizes as needed, and recalculate whenever your dog's weight, age, or activity changes to maintain optimal health.</p>
        </div>
      </section>

      {/* TABLE: Daily Caloric Needs by Dog Weight and Activity Level */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Caloric Needs by Dog Weight and Activity Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to estimate your dog's baseline daily caloric requirement before calculating treat allowance.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sedentary Dog (kcal/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Activity (kcal/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Activity (kcal/day)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">290</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">360</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">430</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">540</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">675</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">810</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1350</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1215</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1520</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1825</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1875</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2250</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Based on the Resting Energy Expenditure (REE) formula and activity multipliers recognized by veterinary nutritionists.</p>
      </section>

      {/* TABLE: Common Dog Treat Calories & Maximum Daily Allowance */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Dog Treat Calories & Maximum Daily Allowance</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference standard treat calorie values and maximum daily amounts for a 50-lb dog consuming 900 kcal/day.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Treat Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calories per Unit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Max Daily Allowance (10% rule)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Peanut Butter Biscuit (1 small)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 treats</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chicken Training Treat (1 piece)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11 treats</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sweet Potato Chew (1 stick)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 chews</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rawhide Chew (1 regular)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 chews</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Carrot Stick (1 medium)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.6 sticks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Peanut Butter Cup (1 small)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 treat</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dental Chew (1 regular)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.3 chews</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calorie values are approximate; always verify actual product labels for accuracy.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh treats and log them daily to stay within calculated allowance and prevent accidental overfeeding.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use low-calorie vegetables like green beans and carrots as affordable, nutritious treat alternatives.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Split higher-calorie treats into smaller pieces to give more reward moments within the same caloric budget.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your dog's weight monthly and adjust treat allowance downward if weight gain occurs despite proper portion control.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Include Training Treats</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Training rewards count toward daily limits; exclude them from your total and you risk exceeding the 10% threshold unknowingly.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Outdated or No Calorie Labels</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Relying on old packaging or estimated calories leads to inaccurate calculations; always verify current product labels.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Life Stage Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Puppies and seniors have different caloric needs than adult dogs, so recalculate allowances when transitioning between life stages.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting Activity Level Updates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A dog recovering from surgery or aging into reduced activity needs fewer calories; recalculate to prevent weight gain.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What percentage of my dog's daily calories should come from treats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Treats should not exceed 10% of your dog's total daily caloric intake to maintain proper nutrition and prevent obesity. The remaining 90% should come from balanced commercial or home-prepared meals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I find the calorie content of my dog's treats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Check the nutrition label on treat packaging for calories per piece or serving. If unavailable, consult your veterinarian or use USDA FoodData Central for homemade treat ingredients.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does a dog's activity level affect daily treat allowance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, highly active dogs can tolerate slightly more treats while maintaining weight, whereas sedentary dogs require fewer calories and should receive limited treats to prevent weight gain.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my dog's treat allowance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate every 3-6 months as your dog ages, gains/loses weight, or experiences changes in activity level or health status.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can puppies and senior dogs have the same treat allowance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No; puppies need more calories for growth and seniors often need fewer calories, so adjust treat amounts based on life stage and your vet's recommendations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What treats are best for dogs on restricted calorie diets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Low-calorie options include air-popped popcorn, carrot sticks, green beans, and freeze-dried chicken; these satisfy dogs while keeping calorie counts minimal.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I count training treats differently from regular treats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No; all treats count toward the 10% daily caloric limit, including training rewards, so subtract training treat calories from your dog's total allowance.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Dog Food Nutrient Profiles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official standards for pet food nutrition, including caloric guidelines for different dog life stages.</p>
          </li>
          <li>
            <a href="https://fdc.nal.usda.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA FoodData Central</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive database of food composition data useful for calculating calories in homemade dog treats.</p>
          </li>
          <li>
            <a href="https://www.akc.org/dog-breeds/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Kennel Club: Dog Nutrition Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based feeding recommendations and weight management guidelines for dogs of all breeds and sizes.</p>
          </li>
          <li>
            <a href="https://wsava.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">World Small Animal Veterinary Association: Nutritional Assessment</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional resource on evidence-based nutritional management and caloric requirements for companion animals.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Treat Calories & Daily Allowance Calculator"
      description="Calculate the calorie content of treats and the maximum safe daily treat allowance to prevent weight gain."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula: "RER = 70 × (weight in kg)^0.75; Max Treat Calories = 0.10 × RER; Max Treats = floor(Max Treat Calories / Treat Calories)",
        variables: [
          { symbol: "RER", description: "Resting Energy Requirement (kcal/day)" },
          { symbol: "weight", description: "Dog's weight in kilograms (kg)" },
          { symbol: "Max Treat Calories", description: "Maximum daily calories from treats (10% of RER)" },
          { symbol: "Treat Calories", description: "Calories per individual treat (kcal)" },
          { symbol: "Max Treats", description: "Maximum number of treats per day" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 22 lb (10 kg) dog receives treats that contain 15 kcal each. The owner wants to know how many treats can be given daily without risking weight gain.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kilograms if necessary (22 lb ÷ 2.20462 = 10 kg). Calculate RER: 70 × 10^0.75 ≈ 394 kcal/day.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate max treat calories: 10% of 394 = 39.4 kcal. Divide max treat calories by treat calories: 39.4 ÷ 15 ≈ 2.6 treats.",
          },
        ],
        result: "The dog can safely have 2 treats per day without exceeding the recommended treat calorie allowance.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "🍖" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog Treat Calories & Daily Allowance Calculator" },
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