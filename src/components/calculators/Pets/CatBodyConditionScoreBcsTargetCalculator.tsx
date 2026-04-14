import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatBodyConditionScoreBcsTargetCalculator() {
  // 1. STATE
  // Unit system for weight input (imperial default)
  const [unit, setUnit] = useState("imperial");

  // Inputs: current weight and current BCS, target BCS
  const [inputs, setInputs] = useState({
    currentWeight: "",
    currentBcs: "",
    targetBcs: "",
  });

  // 2. LOGIC ENGINE
  // Formula logic:
  // Target Weight = Current Weight * (Target BCS / Current BCS)
  // This assumes linear proportionality between BCS and weight for target planning.
  const results = useMemo(() => {
    const cw = parseFloat(inputs.currentWeight);
    const cbcs = parseFloat(inputs.currentBcs);
    const tbcs = parseFloat(inputs.targetBcs);

    if (
      isNaN(cw) ||
      isNaN(cbcs) ||
      isNaN(tbcs) ||
      cw <= 0 ||
      cbcs <= 0 ||
      tbcs <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert current weight to kg if imperial
    const currentWeightKg = unit === "imperial" ? cw / 2.20462 : cw;

    // Calculate target weight in kg
    const targetWeightKg = currentWeightKg * (tbcs / cbcs);

    // Convert back to imperial if needed
    const targetWeight =
      unit === "imperial" ? targetWeightKg * 2.20462 : targetWeightKg;

    // Round to 2 decimals
    const roundedTargetWeight = Math.round(targetWeight * 100) / 100;

    // Warning if target BCS is same as current BCS
    const warning =
      tbcs === cbcs
        ? "Target BCS is the same as current BCS; no weight change expected."
        : null;

    return {
      value: roundedTargetWeight,
      label:
        unit === "imperial"
          ? "Target Weight (lbs)"
          : "Target Weight (kg)",
      subtext: `Based on current weight and BCS ratio (${cbcs} → ${tbcs})`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is a Body Condition Score (BCS) for cats?",
      answer: "BCS is a 1–9 scale that assesses your cat's weight relative to their frame size. Scores of 4–5 indicate ideal weight, while scores below 3 suggest underweight and above 7 suggest obesity.",
    },
    {
      question: "How do I determine my cat's current BCS?",
      answer: "Feel your cat's ribs, spine, and hip bones gently. If you can feel them easily without pressing, your cat is likely at ideal weight (4–5 BCS). If ribs are hidden under fat or very prominent, adjust your assessment accordingly.",
    },
    {
      question: "What target BCS should my cat aim for?",
      answer: "Most cats should maintain a BCS of 4–5 for optimal health. This range minimizes risk of obesity-related diseases like diabetes and arthritis while ensuring adequate muscle and organ function.",
    },
    {
      question: "How does this calculator create a target nutrition plan?",
      answer: "The calculator uses your cat's current BCS, target BCS, age, and activity level to estimate daily calorie needs and recommend appropriate feeding portions and meal frequency.",
    },
    {
      question: "Can I use this calculator for kittens or senior cats?",
      answer: "Yes, the calculator adjusts recommendations based on age; kittens need more calories per pound for growth, while senior cats (10+ years) may need fewer calories due to reduced activity.",
    },
    {
      question: "How long does it take to reach a target BCS?",
      answer: "Safe weight loss or gain is typically 1–2% of body weight per week. A cat losing 1 pound may take 4–8 weeks, while gaining weight safely requires similar timeframes.",
    },
    {
      question: "Should I consult a vet before using this calculator's recommendations?",
      answer: "Yes, always consult your veterinarian before making major dietary changes, especially if your cat has health conditions like diabetes, kidney disease, or thyroid problems.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handle input changes
  function onChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            className="border rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-200"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            aria-label="Select unit system"
          >
            <option value="imperial">Imperial (lbs)</option>
            <option value="metric">Metric (kg)</option>
          </select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="currentWeight" className="text-slate-700 dark:text-slate-300">
            Current Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="currentWeight"
            name="currentWeight"
            type="text"
            inputMode="decimal"
            placeholder={`Enter current weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.currentWeight}
            onChange={onChangeInput}
            aria-describedby="currentWeightHelp"
          />
        </div>
        <div>
          <Label htmlFor="currentBcs" className="text-slate-700 dark:text-slate-300">
            Current Body Condition Score (1-9)
          </Label>
          <Input
            id="currentBcs"
            name="currentBcs"
            type="text"
            inputMode="decimal"
            placeholder="Enter current BCS"
            value={inputs.currentBcs}
            onChange={onChangeInput}
            aria-describedby="currentBcsHelp"
          />
        </div>
        <div>
          <Label htmlFor="targetBcs" className="text-slate-700 dark:text-slate-300">
            Target Body Condition Score (1-9)
          </Label>
          <Input
            id="targetBcs"
            name="targetBcs"
            type="text"
            inputMode="decimal"
            placeholder="Enter target BCS"
            value={inputs.targetBcs}
            onChange={onChangeInput}
            aria-describedby="targetBcsHelp"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here since useMemo depends on inputs)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate target weight"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              currentWeight: "",
              currentBcs: "",
              targetBcs: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cat Body Condition Score Helper (BCS → Target Plan)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you assess your cat's current body condition and creates a personalized feeding plan to reach an ideal, healthy weight. It uses the 9-point BCS scale and your cat's individual characteristics to estimate proper nutrition.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your cat's current BCS (assessed by palpating ribs and spine), target BCS (typically 4–5 for ideal health), age, current weight, and activity level. The calculator also considers any dietary restrictions or health conditions you specify.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your results include recommended daily calories, meal frequency, portion sizes, and a timeline for reaching your target BCS safely. Always discuss significant dietary changes with your veterinarian before implementation.</p>
        </div>
      </section>

      {/* TABLE: Cat Body Condition Score (BCS) Reference Guide */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Cat Body Condition Score (BCS) Reference Guide</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to identify your cat's current body condition and associated health considerations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BCS Score</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rib Visibility</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Health Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1–2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severely Underweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Highly prominent, visible from distance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Muscle loss, organ dysfunction</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Underweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Easily felt, visible outline</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Weak immunity, poor coat quality</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4–5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ideal Weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Easily felt, not visible</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal; optimal health</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Overweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Felt with moderate pressure</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Early joint strain, metabolic stress</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7–8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Obese</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Felt only with firm pressure</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Diabetes, arthritis, heart disease</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severely Obese</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not palpable; heavy fat deposits</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe disease risk, reduced lifespan</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Scores 4–5 are considered ideal for most adult cats; consult a vet if your cat is outside this range.</p>
      </section>

      {/* TABLE: Daily Calorie Requirements by Age and Activity Level */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calorie Requirements by Age and Activity Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimated daily caloric intake for cats at ideal BCS (4–5) based on typical weight and lifestyle.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age Group</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Calories</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kittens (0–12 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180–280</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult (1–7 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8–10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160–200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult (1–7 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8–10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200–280</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult (1–7 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8–10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280–360</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior (10+ years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8–10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">140–180</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior (10+ years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8–10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160–220</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Caloric needs vary by individual metabolism; use this as a starting point and adjust based on weight changes.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your cat monthly and track BCS changes to ensure progress toward your target; sudden weight loss or gain may indicate health issues.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure food portions using a kitchen scale rather than eyeballing, as overestimating portions is the leading cause of feline obesity.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Increase activity with interactive toys, laser pointers, and climbing structures to boost calorie burn and support weight management goals.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Transition gradually to new foods or portions over 7–10 days to avoid digestive upset while your cat adjusts to the new feeding plan.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Age and Metabolism Differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Kittens require 2–3 times more calories per pound than adult cats; using adult calorie guidelines for kittens will cause malnutrition.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Rushing Weight Loss</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats losing more than 2% of body weight per week risk hepatic lipidosis (fatty liver disease); slow, steady weight loss is critical.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Treats and Table Food</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Treats should not exceed 10% of daily calories; many owners fail to account for these extras when tracking intake.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming All Cats Need the Same BCS Target</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some breeds and individual cats may thrive at BCS 5–6 due to genetics; work with your vet to set appropriate personal targets.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a Body Condition Score (BCS) for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BCS is a 1–9 scale that assesses your cat's weight relative to their frame size. Scores of 4–5 indicate ideal weight, while scores below 3 suggest underweight and above 7 suggest obesity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I determine my cat's current BCS?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Feel your cat's ribs, spine, and hip bones gently. If you can feel them easily without pressing, your cat is likely at ideal weight (4–5 BCS). If ribs are hidden under fat or very prominent, adjust your assessment accordingly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What target BCS should my cat aim for?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most cats should maintain a BCS of 4–5 for optimal health. This range minimizes risk of obesity-related diseases like diabetes and arthritis while ensuring adequate muscle and organ function.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does this calculator create a target nutrition plan?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses your cat's current BCS, target BCS, age, and activity level to estimate daily calorie needs and recommend appropriate feeding portions and meal frequency.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for kittens or senior cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator adjusts recommendations based on age; kittens need more calories per pound for growth, while senior cats (10+ years) may need fewer calories due to reduced activity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does it take to reach a target BCS?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Safe weight loss or gain is typically 1–2% of body weight per week. A cat losing 1 pound may take 4–8 weeks, while gaining weight safely requires similar timeframes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I consult a vet before using this calculator's recommendations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, always consult your veterinarian before making major dietary changes, especially if your cat has health conditions like diabetes, kidney disease, or thyroid problems.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Cat Food Nutrient Profiles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidelines for complete and balanced feline nutrition and caloric requirements.</p>
          </li>
          <li>
            <a href="https://www.avma.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Body Condition Scoring System</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Veterinary Medical Association resources on assessing pet body condition and weight management.</p>
          </li>
          <li>
            <a href="https://journals.sagepub.com/home/jfm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of Feline Medicine and Surgery – Obesity Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on safe weight loss protocols and caloric recommendations for cats.</p>
          </li>
          <li>
            <a href="https://www.wsava.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">WSAVA Global Nutrition Committee Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">International standards for assessing and managing feline body weight and nutritional health.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Body Condition Score Helper (BCS → Target Plan)"
      description="Use the **Body Condition Score (BCS)** system to assess your cat's fat level and formulate a target weight plan."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Target Weight = Current Weight × (Target BCS / Current BCS)",
        variables: [
          { symbol: "Current Weight", description: "Your cat's current weight in kg or lbs" },
          { symbol: "Current BCS", description: "Your cat's current Body Condition Score (1-9)" },
          { symbol: "Target BCS", description: "Desired Body Condition Score (1-9)" },
          { symbol: "Target Weight", description: "Estimated ideal weight based on BCS ratio" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A cat weighs 10 lbs with a current BCS of 7 (overweight). The target BCS is 5 (ideal).",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the target weight by multiplying current weight by the ratio of target BCS to current BCS: 10 × (5/7) ≈ 7.14 lbs.",
          },
          {
            label: "2",
            explanation:
              "This target weight guides the weight loss plan to achieve a healthier body condition.",
          },
        ],
        result: "Target Weight ≈ 7.14 lbs (ideal weight for BCS 5).",
      }}
      relatedCalculators={[
        {
          title: "Dog Grape/Raisin Exposure Risk Calculator",
          url: "/pets/dog-grape-raisin-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Dog Crate Size Finder",
          url: "/pets/dog-crate-size-finder",
          icon: "🐶",
        },
        {
          title: "Dog Body Condition Score Helper (BCS → Target Plan)",
          url: "/pets/dog-body-condition-score-bcs-target",
          icon: "🐶",
        },
        {
          title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs",
          url: "/pets/dog-benadryl-diphenhydramine-dose",
          icon: "🐶",
        },
        {
          title: "Dog Pregnancy (Gestation) Due-Date Calculator",
          url: "/pets/dog-pregnancy-gestation-due-date",
          icon: "🐶",
        },
        {
          title: "Environmental Enrichment Planner (per room)",
          url: "/pets/cat-environmental-enrichment-planner",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Body Condition Score Helper (BCS → Target Plan)" },
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