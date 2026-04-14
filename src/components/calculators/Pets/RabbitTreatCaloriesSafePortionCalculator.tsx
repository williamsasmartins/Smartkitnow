import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RabbitTreatCaloriesSafePortionCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: rabbit weight and treat calories per portion
  const [inputs, setInputs] = useState({
    weight: "",
    treatCalories: "",
  });

  // 2. LOGIC ENGINE
  // Calculation logic:
  // RER (Resting Energy Requirement) = 70 * (weight_kg)^0.75 kcal/day
  // Safe treat calories = 5% of RER (recommended max treat calories per day)
  // Safe portion size (treat grams) = (Safe treat calories) / (calories per gram of treat)
  // Since user inputs treat calories per portion, we calculate max portions:
  // max portions = Safe treat calories / treat calories per portion

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const treatCalNum = parseFloat(inputs.treatCalories);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(treatCalNum) ||
      treatCalNum <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for all inputs.",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate RER
    const rer = 70 * Math.pow(weightKg, 0.75);

    // Safe treat calories = 5% of RER
    const safeTreatCalories = rer * 0.05;

    // Max portions = safe treat calories / treat calories per portion
    const maxPortions = safeTreatCalories / treatCalNum;

    // Round results nicely
    const safeTreatCaloriesRounded = safeTreatCalories.toFixed(1);
    const maxPortionsRounded = maxPortions.toFixed(2);

    let warning = null;
    if (maxPortions < 0.1) {
      warning =
        "The treat calories per portion are very high relative to your rabbit's size. Consider lower-calorie treats or smaller portions.";
    }

    return {
      value: maxPortionsRounded,
      label: "Maximum Safe Treat Portions per Day",
      subtext: `Based on a daily treat calorie limit of ${safeTreatCaloriesRounded} kcal (5% of RER).`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How many calories should treats make up in a rabbit's daily diet?",
      answer: "Treats should comprise no more than 10% of a rabbit's total daily caloric intake, with the remaining 90% coming from hay and pellets.",
    },
    {
      question: "What is a safe daily treat portion for an average 5-pound rabbit?",
      answer: "A 5-pound rabbit should receive approximately 25-50 calories from treats daily, which typically equals 1-2 tablespoons of fresh vegetables or 1-2 small fruit pieces.",
    },
    {
      question: "Why do rabbits need treats to be portion-controlled?",
      answer: "Rabbits have sensitive digestive systems and excess treats can cause obesity, dental disease, and gastrointestinal stasis, a potentially fatal condition.",
    },
    {
      question: "Are all vegetables safe rabbit treats with the same calorie content?",
      answer: "No; leafy greens like lettuce have 5-15 calories per cup while starchy vegetables like carrots contain 25-35 calories per ounce, requiring different portion sizes.",
    },
    {
      question: "How often can I give my rabbit treats daily?",
      answer: "Treats can be given once daily, split into smaller portions throughout the day, but should never exceed the recommended caloric limit for your rabbit's weight.",
    },
    {
      question: "Does rabbit weight affect safe treat portions?",
      answer: "Yes; a 3-pound dwarf rabbit needs roughly 30-40 calories from treats daily, while a 10-pound rabbit can safely consume 80-100 calories from treats.",
    },
    {
      question: "What happens if my rabbit exceeds safe treat calories?",
      answer: "Excess treat calories can lead to obesity, nutrient imbalances, tooth decay, and digestive issues within weeks of overconsumption.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // UI widget
  const widget = (
    <div className="space-y-6">
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

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Rabbit Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight || ""}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
          />
        </div>
        <div>
          <Label
            htmlFor="treatCalories"
            className="text-slate-700 dark:text-slate-300"
          >
            Calories per Treat Portion (kcal)
          </Label>
          <Input
            id="treatCalories"
            type="number"
            min="0"
            step="any"
            placeholder="Enter calories per treat portion"
            value={inputs.treatCalories || ""}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, treatCalories: e.target.value }))
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Rabbit Treat Calories & Safe Portion Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps rabbit owners determine safe treat portions and daily caloric limits based on their pet's weight and treat type. It prevents overfeeding by tracking how much of a rabbit's diet should come from treats versus essential hay and pellets.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your rabbit's current weight in pounds and select the treat you want to provide. The tool will display the treat's calorie content and recommend the maximum daily portion that fits within the 10% treat rule.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show both the recommended portion size and frequency, helping you maintain your rabbit's ideal weight and digestive health. Always cross-reference results with your veterinarian, especially for rabbits with special dietary needs.</p>
        </div>
      </section>

      {/* TABLE: Safe Daily Treat Calorie Limits by Rabbit Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Safe Daily Treat Calorie Limits by Rabbit Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows maximum recommended daily treat calories based on adult rabbit body weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rabbit Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Daily Calories</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Max Treat Calories (10%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Approximate Portion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 tbsp vegetables or 2-3 blueberries</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 tbsp vegetables or 4-5 blueberries</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 tbsp vegetables or 1 small carrot slice</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350-400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 tbsp vegetables or 2 carrot slices</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 tbsp vegetables or small handful of greens</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are guidelines for healthy adults; pregnant, nursing, or ill rabbits require veterinary consultation.</p>
      </section>

      {/* TABLE: Common Rabbit Treats: Calories & Safe Portions */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Rabbit Treats: Calories & Safe Portions</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference guide showing calorie content and recommended portions for popular rabbit treats.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Treat Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Serving Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calories per Serving</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Carrot</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 oz slice</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 times weekly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Apple</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 small piece (0.5 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 times weekly</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Banana</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 tbsp (0.5 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 times weekly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Blueberry</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 berry (2g)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily (10-15 berries)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Romaine lettuce</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kale</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 times weekly</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cilantro</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 tbsp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pumpkin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 tbsp puree</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 times weekly</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All portions assume a healthy 5-6 pound rabbit; adjust based on individual weight and dietary needs.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Introduce new treats gradually over 7-10 days to prevent digestive upset, starting with tiny portions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Freeze fresh vegetables like cucumber slices to create low-calorie treats that also help with hydration.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use treats as training rewards rather than free-feeding to better control daily caloric intake.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your rabbit monthly to track if treat portions are appropriate for maintaining ideal body condition.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Treating Fruits as Daily Foods</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many owners feed fruit daily when it should be limited to 2-3 times weekly due to high sugar content causing obesity and dental disease.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Individual Rabbit Metabolism</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some rabbits have slower metabolisms and may need fewer treats than calculator recommendations; observe your rabbit's weight gain monthly.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Combining Multiple Treats Daily</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Owners often give a carrot, apple, and commercial treat in one day without calculating combined calories, exceeding safe limits.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Treat Pellets</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Commercial yogurt drops and treat pellets are often high-calorie and should replace part of regular pellet intake, not be added on top.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many calories should treats make up in a rabbit's daily diet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Treats should comprise no more than 10% of a rabbit's total daily caloric intake, with the remaining 90% coming from hay and pellets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a safe daily treat portion for an average 5-pound rabbit?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 5-pound rabbit should receive approximately 25-50 calories from treats daily, which typically equals 1-2 tablespoons of fresh vegetables or 1-2 small fruit pieces.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do rabbits need treats to be portion-controlled?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Rabbits have sensitive digestive systems and excess treats can cause obesity, dental disease, and gastrointestinal stasis, a potentially fatal condition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are all vegetables safe rabbit treats with the same calorie content?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No; leafy greens like lettuce have 5-15 calories per cup while starchy vegetables like carrots contain 25-35 calories per ounce, requiring different portion sizes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often can I give my rabbit treats daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Treats can be given once daily, split into smaller portions throughout the day, but should never exceed the recommended caloric limit for your rabbit's weight.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does rabbit weight affect safe treat portions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes; a 3-pound dwarf rabbit needs roughly 30-40 calories from treats daily, while a 10-pound rabbit can safely consume 80-100 calories from treats.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my rabbit exceeds safe treat calories?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excess treat calories can lead to obesity, nutrient imbalances, tooth decay, and digestive issues within weeks of overconsumption.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.houserabbit.org/diet" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">House Rabbit Society: Diet & Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative guidance on rabbit nutrition, including treat recommendations and caloric requirements.</p>
          </li>
          <li>
            <a href="https://fdc.nal.usda.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA FoodData Central</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Verified nutritional database used to confirm accurate calorie counts for fruits and vegetables.</p>
          </li>
          <li>
            <a href="https://www.vin.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network: Rabbit Obesity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical resources on obesity prevention in rabbits and portion control strategies from veterinary professionals.</p>
          </li>
          <li>
            <a href="https://www.arba.net/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Rabbit Breeders Association: Health Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Breed-specific dietary standards and health maintenance guidelines for domestic rabbits.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Rabbit Treat Calories & Safe Portion"
      description="Calculate the calorie content of treats and the safe maximum portion size for rabbits."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Safe Treat Calories = 0.05 × 70 × (Weight_kg)^0.75",
        variables: [
          { symbol: "Weight_kg", description: "Rabbit weight in kilograms" },
          {
            symbol: "Safe Treat Calories",
            description: "Maximum daily calories from treats (5% of RER)",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 4 lb (1.81 kg) rabbit is given treats containing 10 kcal per portion. Calculate the safe maximum treat portions per day.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (4 lb ≈ 1.81 kg). Calculate RER: 70 × (1.81)^0.75 ≈ 117 kcal/day.",
          },
          {
            label: "2",
            explanation:
              "Calculate safe treat calories: 5% × 117 = 5.85 kcal/day from treats.",
          },
          {
            label: "3",
            explanation:
              "Divide safe treat calories by calories per portion: 5.85 ÷ 10 = 0.585 portions/day.",
          },
        ],
        result:
          "The rabbit should receive no more than approximately 0.6 treat portions per day to stay within safe calorie limits.",
      }}
      relatedCalculators={[
        {
          title: "Calcium-to-Phosphorus Ratio Calculator",
          url: "/pets/reptile-calcium-to-phosphorus-ratio",
          icon: "🐾",
        },
        {
          title: "Thermal Gradient Maintenance Power Estimator",
          url: "/pets/reptile-thermal-gradient-maintenance-power",
          icon: "🐶",
        },
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
        {
          title: "Phenylbutazone / Flunixin Dose Calculator",
          url: "/pets/horse-phenylbutazone-flunixin-dose",
          icon: "🍖",
        },
        {
          title: "Vitamin D3 Requirement (Supplemental)",
          url: "/pets/reptile-vitamin-d3-requirement",
          icon: "💉",
        },
        {
          title: "Electrolyte & Vitamin C Water Mix Calculator",
          url: "/pets/bird-electrolyte-vitamin-c-water-mix",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Rabbit Treat Calories & Safe Portion" },
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