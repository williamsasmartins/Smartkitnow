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
import { convertWeight, formatNumberForInput, LB_PER_KG } from "@/lib/utils";

export default function HorseHayIntakeBodyweightPercentCalculator() {
  // 1. STATE
  const { unit: preferredWeightUnit, setUnit: setPreferredWeightUnit } = useWeightUnitPreference();
  const [unit, setUnit] = useState<"imperial" | "metric">(() => (preferredWeightUnit === "lb" ? "imperial" : "metric"));

  // Inputs: weight only, since hay intake is % of body weight
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Hay intake recommended range: 1.5% to 2.5% of body weight daily (dry matter basis)
  // Convert input weight to kg internally for veterinary standard, but display results in same unit as input
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / LB_PER_KG : weightRaw;

    // Calculate hay intake range in kg
    const minHayKg = weightKg * 0.015; // 1.5%
    const maxHayKg = weightKg * 0.025; // 2.5%

    // Convert back to lbs if imperial
    const minHay = unit === "imperial" ? minHayKg * LB_PER_KG : minHayKg;
    const maxHay = unit === "imperial" ? maxHayKg * LB_PER_KG : maxHayKg;

    // Format to 2 decimals
    const minHayFormatted = minHay.toFixed(2);
    const maxHayFormatted = maxHay.toFixed(2);

    return {
      value: `${minHayFormatted} - ${maxHayFormatted}`,
      label: `Recommended Daily Hay Intake (${unit === "imperial" ? "lbs" : "kg"})`,
      subtext:
        "This range represents 1.5% to 2.5% of your horse's body weight, which is the typical daily hay intake recommended by veterinary nutritionists.",
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What percentage of body weight should horses eat in hay daily?",
      answer: "Most horses require 1.5–2% of their body weight in hay daily, though idle horses may need only 1–1.5% while working horses require up to 2–2.5%.",
    },
    {
      question: "How do I calculate hay intake for a 1,000-pound horse?",
      answer: "A 1,000-pound horse eating 2% of body weight requires 20 pounds of hay per day; at 1.5% intake, that's 15 pounds daily.",
    },
    {
      question: "Does hay intake percentage change based on activity level?",
      answer: "Yes—sedentary horses need 1–1.5% body weight in hay, while moderately active horses require 1.5–2% and performance horses may need 2–2.5%.",
    },
    {
      question: "How does hay quality affect intake recommendations?",
      answer: "Higher-quality hay (more protein and digestible energy) requires lower intake percentages, while lower-quality hay may require 2–2.5% body weight to meet nutritional needs.",
    },
    {
      question: "Can I use this calculator for young horses and foals?",
      answer: "This calculator is designed for adult horses; growing foals and young horses have different caloric and protein requirements and should be assessed by an equine nutritionist.",
    },
    {
      question: "What's the difference between percentage-based and pound-based hay calculations?",
      answer: "Percentage-based calculations use body weight (e.g., 2% of 1,000 lbs = 20 lbs), ensuring consistent intake regardless of horse size, while pound-based amounts don't account for individual weight variations.",
    },
    {
      question: "How often should I recalculate hay intake for my horse?",
      answer: "Recalculate hay intake whenever your horse's weight changes significantly or activity level shifts, typically every 2–3 months during seasonal transitions.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(next) => {
              if (next !== "imperial" && next !== "metric") return;
              setInputs((prev) => {
                const num = parseFloat(prev.weight);
                if (!prev.weight || Number.isNaN(num) || num <= 0) return prev;
                const fromUnit = unit === "imperial" ? "lb" : "kg";
                const toUnit = next === "imperial" ? "lb" : "kg";
                const converted = convertWeight(num, fromUnit, toUnit);
                return { ...prev, weight: formatNumberForInput(converted, 2) };
              });
              setUnit(next);
              setPreferredWeightUnit(next === "imperial" ? "lb" : "kg");
            }}
          >
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

      {/* Weight Input */}
      <div className="space-y-2">
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
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          aria-describedby="weightHelp"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating inputs state (already done onChange)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Horse Hay Intake Calculator (per body weight %)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the optimal daily hay intake for your horse based on body weight and activity level, using industry-standard percentages (1–2.5% of body weight). It helps ensure proper nutrition, prevent obesity, and manage feed costs effectively.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your horse's current body weight in pounds and select its activity level (sedentary, moderate, or high). The calculator uses these factors to determine the recommended daily hay intake range in pounds.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show a range of daily hay requirements; adjust within this range based on your horse's body condition score, metabolism, hay quality, and individual response. Consult an equine veterinarian or nutritionist for horses with special dietary needs.</p>
        </div>
      </section>

      {/* TABLE: Daily Hay Intake by Horse Weight and Activity Level */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Hay Intake by Horse Weight and Activity Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to estimate daily hay requirements based on body weight and activity level.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Horse Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sedentary (1–1.5%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Activity (1.5–2%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Activity (2–2.5%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8–12 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12–16 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16–20 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–15 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–20 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–25 lbs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12–18 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18–24 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24–30 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14–21 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21–28 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28–35 lbs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16–24 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24–32 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32–40 lbs</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values represent daily dry hay intake; adjust based on individual metabolism and hay quality.</p>
      </section>

      {/* TABLE: Hay Intake Adjustments by Type and Quality */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Hay Intake Adjustments by Type and Quality</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different hay types and quality levels may require intake percentage adjustments.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hay Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Quality Grade</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Intake %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Alfalfa</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–1.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Higher protein and energy; less volume needed</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Timothy Grass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5–2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good digestibility; standard maintenance hay</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Orchard Grass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5–2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate protein; common pasture alternative</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mixed Legume</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–1.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rich in nutrients; may reduce grain supplementation</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Poor Quality Hay</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–2.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lower nutrition requires higher volume for adequacy</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages apply to total forage intake; grain supplements should be factored separately.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh or estimate your horse's body weight accurately—even 50-pound differences affect hay calculations significantly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use dry hay weight, not fresh or as-fed weight, since fresh-cut hay contains moisture that affects actual intake.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor body condition score monthly and adjust hay intake if your horse becomes overweight or underweight.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for pasture grass in spring and summer—reduce hay intake by 0.5–1% body weight for each pound of fresh forage available.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Fresh Hay Weight Instead of Dry Weight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Fresh hay contains 20–40% moisture; using actual intake weight instead of dry matter basis leads to underfeeding.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for Hay Quality Variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Poor-quality hay requires higher intake percentages than premium hay to meet nutritional needs, which this calculator assumes are average.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Pasture Intake</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Horses grazing spring pasture consume significant forage beyond hay; calculating hay at 2% without subtracting pasture leads to overfeeding.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Individual Metabolic Differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some horses are easy keepers (needing less hay) while hard keepers need more; percentage-based calculations are starting points, not absolutes.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What percentage of body weight should horses eat in hay daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most horses require 1.5–2% of their body weight in hay daily, though idle horses may need only 1–1.5% while working horses require up to 2–2.5%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate hay intake for a 1,000-pound horse?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 1,000-pound horse eating 2% of body weight requires 20 pounds of hay per day; at 1.5% intake, that's 15 pounds daily.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does hay intake percentage change based on activity level?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—sedentary horses need 1–1.5% body weight in hay, while moderately active horses require 1.5–2% and performance horses may need 2–2.5%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does hay quality affect intake recommendations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Higher-quality hay (more protein and digestible energy) requires lower intake percentages, while lower-quality hay may require 2–2.5% body weight to meet nutritional needs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for young horses and foals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator is designed for adult horses; growing foals and young horses have different caloric and protein requirements and should be assessed by an equine nutritionist.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between percentage-based and pound-based hay calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Percentage-based calculations use body weight (e.g., 2% of 1,000 lbs = 20 lbs), ensuring consistent intake regardless of horse size, while pound-based amounts don't account for individual weight variations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate hay intake for my horse?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate hay intake whenever your horse's weight changes significantly or activity level shifts, typically every 2–3 months during seasonal transitions.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.elsevier.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Nutrition, Fifth Edition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive reference on horse nutrition including hay intake requirements by weight and activity level.</p>
          </li>
          <li>
            <a href="https://www.aaep.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Association of Equine Practitioners (AAEP) Nutrition Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional standards and recommendations for equine dietary management and forage intake.</p>
          </li>
          <li>
            <a href="https://www.uky.edu/ag/horses" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">University of Kentucky Equine Research Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-based hay intake recommendations and digestibility data for various horse types.</p>
          </li>
          <li>
            <a href="https://www.nap.edu" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Research Council (NRC) Nutrient Requirements of Horses</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative guide on daily nutrient needs and forage intake percentages for all classes of horses.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Hay Intake Calculator (per body weight %)"
      description="Determine the recommended minimum and maximum hay intake as a percentage of the horse's body weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Hay Intake (kg) = Body Weight (kg) × Intake Percentage (0.015 to 0.025)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Horse's body weight in kilograms" },
          { symbol: "Intake Percentage", description: "Recommended hay intake as a decimal percentage of body weight (1.5% to 2.5%)" },
          { symbol: "Hay Intake (kg)", description: "Daily hay intake in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb (500 kg) horse requires daily hay intake estimation to maintain optimal health and energy balance.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert body weight to kilograms if needed (1100 lb ÷ 2.20462 = 499 kg).",
          },
          {
            label: "2",
            explanation:
              "Calculate minimum hay intake: 499 kg × 0.015 = 7.49 kg.",
          },
          {
            label: "3",
            explanation:
              "Calculate maximum hay intake: 499 kg × 0.025 = 12.48 kg.",
          },
          {
            label: "4",
            explanation:
              "Convert hay intake back to pounds if desired (7.49 kg × 2.20462 = 16.5 lb to 12.48 kg × 2.20462 = 27.5 lb).",
          },
        ],
        result:
          "The horse should consume between 16.5 and 27.5 pounds (7.5 to 12.5 kg) of hay daily to meet its nutritional needs.",
      }}
      relatedCalculators={[
        { title: "Calcium Intake Limit (Bladder Stone Prevention)", url: "/pets/small-mammal-calcium-intake-limit", icon: "🐾" },
        { title: "Omega-3 (EPA/DHA) Supplement Calculator for Dogs", url: "/pets/dog-omega-3-epa-dha-supplement", icon: "🐶" },
        { title: "Cat Pregnancy (Gestation) Due-Date Calculator", url: "/pets/cat-pregnancy-gestation-due-date", icon: "🐱" },
        { title: "Omega-3 (EPA/DHA) Supplement Calculator for Cats", url: "/pets/cat-omega-3-epa-dha-supplement", icon: "🐱" },
        { title: "Multi-Cat Litter Box Count Calculator", url: "/pets/multi-cat-litter-box-count-calculator", icon: "🐱" },
        { title: "Protein/Fat Intake Guide for Cats (by Goal)", url: "/pets/cat-protein-fat-intake-guide", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Hay Intake Calculator (per body weight %)" },
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
