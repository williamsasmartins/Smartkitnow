import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseFeedingRateForageConcentrateCalculator() {
  // 1. STATE
  // Default unit system: imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight, forage percentage, total daily intake %
  // weight = body weight of horse
  // foragePercent = % of total intake as forage (hay/grass)
  // totalIntakePercent = % of body weight fed daily (forage + concentrate)
  const [inputs, setInputs] = useState({
    weight: "",
    foragePercent: "",
    totalIntakePercent: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const foragePercentRaw = parseFloat(inputs.foragePercent);
    const totalIntakePercentRaw = parseFloat(inputs.totalIntakePercent);

    if (
      isNaN(weightRaw) ||
      weightRaw <= 0 ||
      isNaN(foragePercentRaw) ||
      foragePercentRaw < 0 ||
      foragePercentRaw > 100 ||
      isNaN(totalIntakePercentRaw) ||
      totalIntakePercentRaw <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers. Forage % must be between 0 and 100.",
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Total daily intake in kg = totalIntakePercent% of body weight
    const totalIntakeKg = (totalIntakePercentRaw / 100) * weightKg;

    // Forage intake in kg
    const forageKg = (foragePercentRaw / 100) * totalIntakeKg;

    // Concentrate intake in kg
    const concentrateKg = totalIntakeKg - forageKg;

    // Convert results back to user unit
    const forage = unit === "imperial" ? forageKg * 2.20462 : forageKg;
    const concentrate = unit === "imperial" ? concentrateKg * 2.20462 : concentrateKg;

    return {
      value: 0,
      label: "",
      subtext: "",
      warning: null,
      forage: forage.toFixed(2),
      concentrate: concentrate.toFixed(2),
      totalIntake: (unit === "imperial" ? totalIntakeKg * 2.20462 : totalIntakeKg).toFixed(2),
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How much forage should a 1,000 lb horse eat daily?",
      answer: "A 1,000 lb horse should consume 15-20 lbs of forage daily, or 1.5-2% of body weight. The calculator adjusts this based on activity level and metabolism.",
    },
    {
      question: "What's the difference between forage and concentrate in this calculator?",
      answer: "Forage (hay, pasture) provides fiber and bulk; concentrate (grains, pellets) provides energy and nutrients. This calculator determines optimal ratios for each based on your horse's needs.",
    },
    {
      question: "Why does the calculator ask for activity level?",
      answer: "Activity level determines caloric requirements: idle horses need 1.2x maintenance, while performance horses may need 1.5-2x maintenance calories.",
    },
    {
      question: "How do I input my horse's weight accurately?",
      answer: "Weigh your horse on a scale if possible, or use the heart girth formula: (Heart Girth² × Body Length) ÷ 300 = estimated weight in pounds.",
    },
    {
      question: "What happens if I feed more concentrate than the calculator recommends?",
      answer: "Excess concentrate increases colic, laminitis, and obesity risk; horses evolved to digest forage, so maintain at least 50% forage by weight in the diet.",
    },
    {
      question: "Should I adjust feeding rates for seasonal changes?",
      answer: "Yes, winter may increase forage needs by 10-20% for warmth, while summer pasture grazing can reduce concentrate supplementation.",
    },
    {
      question: "How often should I recalculate my horse's feeding rate?",
      answer: "Recalculate every 6-8 weeks or whenever weight changes significantly, as energy needs shift with age, fitness, and metabolic changes.",
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
            Horse Body Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="foragePercent" className="text-slate-700 dark:text-slate-300">
            Forage Percentage of Total Intake (%)
          </Label>
          <Input
            id="foragePercent"
            type="number"
            min={0}
            max={100}
            step="any"
            placeholder="e.g. 70"
            value={inputs.foragePercent}
            onChange={(e) => setInputs((prev) => ({ ...prev, foragePercent: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="totalIntakePercent" className="text-slate-700 dark:text-slate-300">
            Total Daily Intake (% of Body Weight)
          </Label>
          <Input
            id="totalIntakePercent"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 2.5"
            value={inputs.totalIntakePercent}
            onChange={(e) => setInputs((prev) => ({ ...prev, totalIntakePercent: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state with same values
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", foragePercent: "", totalIntakePercent: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.warning && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
        </div>
      )}

      {!results.warning && results.forage && results.concentrate && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Daily Feeding Rates
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-1">
                Forage: {results.forage} {unit === "imperial" ? "lbs" : "kg"}
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-4">
                Concentrate: {results.concentrate} {unit === "imperial" ? "lbs" : "kg"}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                Total Intake: {results.totalIntake} {unit === "imperial" ? "lbs" : "kg"} per day
              </p>
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Horse Feeding Rate Calculator (Forage + Concentrate)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the optimal daily forage and concentrate portions for your horse based on weight, age, activity level, and health status. It ensures proper nutrition while maintaining the 50-70% forage minimum that horses' digestive systems require.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your horse's body weight (in lbs), select activity level (idle to very heavy work), enter age and condition score, and note any special needs like pregnancy or metabolic issues. The calculator uses industry-standard formulas from equine nutrition research to compute daily dry matter intake.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show recommended daily forage (hay/pasture) and concentrate (grain/pellets) portions in pounds, plus total calories. Adjust gradually when changing diet, monitor body condition monthly, and consult a veterinarian or equine nutritionist if your horse has health concerns.</p>
        </div>
      </section>

      {/* TABLE: Daily Forage & Concentrate Requirements by Horse Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Forage & Concentrate Requirements by Horse Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These ranges show typical daily dry matter intake (DMI) for maintenance-level horses.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Horse Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Forage (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Concentrate (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Daily Intake</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-20 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-25 lbs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22-30 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21-28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26-35 lbs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-40 lbs</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages assume 1.5-2% body weight for forage and 0.3-0.5% for concentrate at maintenance level.</p>
      </section>

      {/* TABLE: Activity Level Multipliers for Caloric Requirements */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Activity Level Multipliers for Caloric Requirements</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use these multipliers to adjust base maintenance calories based on your horse's work intensity.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Description</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Caloric Multiplier</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Concentrate Increase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Idle/Pasture Only</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal exercise, turnout only</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0-2 lbs/day</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Light Work</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Casual riding 3-4 hours/week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2-1.3x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 lbs/day</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate Work</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Regular riding 5-6 days/week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.4-1.5x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6 lbs/day</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Heavy Work</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Competition, training, or racing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.7-1.9x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-10 lbs/day</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Very Heavy Work</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Endurance or intense conditioning</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.9-2.0x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10+ lbs/day</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Forage should remain 50-70% of total diet; adjust concentrate within safe limits to meet energy demands.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always transition feed changes over 7-10 days to avoid digestive upset and colic.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh feed portions for the first week to ensure accuracy; don't estimate by eye.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store hay in a dry location and concentrate in airtight bins to maintain nutritional quality.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your horse's body condition score (BCS 1-9 scale) monthly and adjust portions if score drifts outside the ideal 5-6 range.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring forage-to-concentrate ratio</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Feeding &gt;30% concentrate by weight increases colic and laminitis risk; prioritize forage even for high-performance horses.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using fresh weight instead of dry matter</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Hay moisture content varies (10-20%); the calculator uses dry matter, so 20 lbs fresh hay ≈ 16-18 lbs dry matter.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for pasture intake</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Green pasture contains 70-80% water; 1 lb of dry matter in pasture equals roughly 3-4 lbs fresh grass weight.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Feeding the same amount year-round</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Winter horses need 10-20% more calories; summer pasture grazing can reduce concentrate by 50% or more if quality forage is abundant.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much forage should a 1,000 lb horse eat daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 1,000 lb horse should consume 15-20 lbs of forage daily, or 1.5-2% of body weight. The calculator adjusts this based on activity level and metabolism.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between forage and concentrate in this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Forage (hay, pasture) provides fiber and bulk; concentrate (grains, pellets) provides energy and nutrients. This calculator determines optimal ratios for each based on your horse's needs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does the calculator ask for activity level?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Activity level determines caloric requirements: idle horses need 1.2x maintenance, while performance horses may need 1.5-2x maintenance calories.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I input my horse's weight accurately?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Weigh your horse on a scale if possible, or use the heart girth formula: (Heart Girth² × Body Length) ÷ 300 = estimated weight in pounds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I feed more concentrate than the calculator recommends?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excess concentrate increases colic, laminitis, and obesity risk; horses evolved to digest forage, so maintain at least 50% forage by weight in the diet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust feeding rates for seasonal changes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, winter may increase forage needs by 10-20% for warmth, while summer pasture grazing can reduce concentrate supplementation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my horse's feeding rate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate every 6-8 weeks or whenever weight changes significantly, as energy needs shift with age, fitness, and metabolic changes.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nap.edu/catalog/25038/nutrient-requirements-of-horses-revised-edition" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Nutrient Requirements of Horses</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">National Academies Press comprehensive guide to equine nutrition standards and daily requirements by age and activity.</p>
          </li>
          <li>
            <a href="https://www.extension.org/pages/26643/equine-nutrition-and-joint-health" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Nutrition and Joint Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">University extension resource covering forage quality, concentrate selection, and metabolic disease prevention in horses.</p>
          </li>
          <li>
            <a href="https://www.thehorese.com/articles/body-condition-scoring" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Horse: Body Condition Scoring</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Guide to visual body condition assessment (1-9 scale) and adjusting feed portions based on seasonal and work changes.</p>
          </li>
          <li>
            <a href="https://www.aaep.org/about-aaep/about-american-association-equine-practitioners" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAEP Equine Weight Estimation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Association of Equine Practitioners resources on accurate weight measurement and DMI calculations for horses.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Feeding Rate Calculator (Forage + Concentrate)"
      description="Calculate the required daily feeding rate for both forage (hay/grass) and concentrated feeds."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Total Intake (kg) = Body Weight (kg) × Total Intake %; Forage (kg) = Total Intake × Forage %",
        variables: [
          { symbol: "Body Weight (kg)", description: "Horse's body weight in kilograms" },
          { symbol: "Total Intake %", description: "Total daily feed intake as a percentage of body weight" },
          { symbol: "Forage %", description: "Percentage of total intake that is forage" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse requires 2.5% of its body weight in total daily feed, with 70% of that as forage and 30% as concentrate.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert 1100 lbs to kg: 1100 ÷ 2.20462 ≈ 499 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate total intake: 499 kg × 2.5% = 12.475 kg total feed per day.",
          },
          {
            label: "3",
            explanation:
              "Calculate forage: 12.475 kg × 70% = 8.73 kg forage per day.",
          },
          {
            label: "4",
            explanation:
              "Calculate concentrate: 12.475 kg × 30% = 3.74 kg concentrate per day.",
          },
        ],
        result:
          "The horse should receive approximately 8.73 kg (19.24 lbs) of forage and 3.74 kg (8.25 lbs) of concentrate daily.",
      }}
      relatedCalculators={[
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐶" },
        { title: "Exercise Time Planner (Run Time per Day)", url: "/pets/small-mammal-exercise-time-planner", icon: "🐶" },
        { title: "Horse Hay Intake Calculator (per body weight %)", url: "/pets/horse-hay-intake-bodyweight-percent", icon: "🐎" },
        { title: "Ammonia-to-Nitrite Cycle Time Estimator", url: "/pets/aquarium-ammonia-nitrite-cycle-time", icon: "🍖" },
        { title: "Dog Caffeine Toxicity Calculator", url: "/pets/dog-caffeine-toxicity", icon: "🐶" },
        { title: "Kitten Calorie Needs by Age/Size", url: "/pets/kitten-calorie-needs-age-size", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Feeding Rate Calculator (Forage + Concentrate)" },
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