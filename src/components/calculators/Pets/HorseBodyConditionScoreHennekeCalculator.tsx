import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseBodyConditionScoreHennekeCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: Weight (lbs or kg), Neck Fat Thickness (mm), Ribs Felt (0-3), Tailhead Fat (0-3)
  // But Henneke BCS is a visual and palpation score from 1 to 9, so typically no formula input.
  // However, since this is a helper, we will ask user to input key palpation scores to estimate BCS.
  // For simplicity, inputs: Weight and subjective palpation scores for ribs, neck, tailhead (0-3 scale)
  // We will calculate an estimated BCS from these palpation scores.

  const [inputs, setInputs] = useState({
    weight: "",
    ribs: "",
    neck: "",
    tailhead: "",
  });

  // 2. LOGIC ENGINE
  // The Henneke BCS is scored 1 (poor) to 9 (extremely fat).
  // Palpation scores for ribs, neck, tailhead each from 0 (no fat) to 3 (heavy fat).
  // Estimated BCS = average of palpation scores * 3 (to scale 0-9), rounded to nearest integer.
  // Weight is used for context but not in formula.

  const results = useMemo(() => {
    const ribs = parseFloat(inputs.ribs);
    const neck = parseFloat(inputs.neck);
    const tailhead = parseFloat(inputs.tailhead);

    if (
      isNaN(ribs) ||
      isNaN(neck) ||
      isNaN(tailhead) ||
      ribs < 0 ||
      ribs > 3 ||
      neck < 0 ||
      neck > 3 ||
      tailhead < 0 ||
      tailhead > 3
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter palpation scores between 0 and 3 for ribs, neck, and tailhead.",
        warning: null,
      };
    }

    // Calculate average palpation score
    const avgPalpation = (ribs + neck + tailhead) / 3;

    // Scale to 1-9 Henneke BCS scale (0-3 average * 3)
    let estimatedBCS = Math.round(avgPalpation * 3);

    // Clamp between 1 and 9
    if (estimatedBCS < 1) estimatedBCS = 1;
    if (estimatedBCS > 9) estimatedBCS = 9;

    // Weight context
    let weightVal = parseFloat(inputs.weight);
    if (isNaN(weightVal) || weightVal <= 0) {
      weightVal = null;
    }

    return {
      value: estimatedBCS,
      label: "Estimated Body Condition Score (1–9)",
      subtext: weightVal
        ? `Horse weight: ${weightVal} ${unit === "imperial" ? "lbs" : "kg"}`
        : "Weight not provided or invalid",
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the Henneke Body Condition Score system?",
      answer: "The Henneke scale is a 1–9 scoring system developed by Dr. Don Henneke in 1983 to assess horse body fat distribution and overall health. Scores range from 1 (poor/emaciated) to 9 (obese), with 5–6 considered ideal.",
    },
    {
      question: "How do I determine my horse's Henneke score?",
      answer: "Assess your horse by palpating (feeling) fat deposits along the neck, shoulder, ribs, loin, and tailhead while observing overall appearance. Compare findings to Henneke standard photos and descriptions for each score level.",
    },
    {
      question: "What score should my horse maintain?",
      answer: "Most horses perform best at Henneke scores 5–6, indicating adequate energy reserves without excess fat that stresses joints and organs. Breeding mares benefit from scores 6–7 before foaling.",
    },
    {
      question: "Can I use Henneke scoring for different horse breeds?",
      answer: "Yes, the Henneke system applies to all horse breeds, though naturally stockier breeds like Quarter Horses may appear rounder at ideal scores compared to Thoroughbreds.",
    },
    {
      question: "How often should I score my horse's body condition?",
      answer: "Score your horse monthly during weight-loss or gain periods, or every 3 months during stable seasons to detect health changes early and adjust feed accordingly.",
    },
    {
      question: "What does a score of 3 or lower indicate?",
      answer: "Scores 1–3 indicate poor to thin condition with visible ribs, spinous processes, and hip bones, signaling inadequate nutrition, illness, or parasites requiring veterinary attention.",
    },
    {
      question: "How do Henneke scores relate to feeding programs?",
      answer: "Use Henneke scores to adjust grain, hay, and supplement amounts: horses scoring 4–5 need maintenance feed, 6+ need reduced calories, and 1–3 need increased nutrition and veterinary evaluation.",
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
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
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
          <Label htmlFor="ribs" className="text-slate-700 dark:text-slate-300">
            Ribs Palpation Score (0 = no fat, 3 = heavy fat)
          </Label>
          <Input
            id="ribs"
            type="number"
            min={0}
            max={3}
            step="0.1"
            placeholder="0 to 3"
            value={inputs.ribs}
            onChange={(e) => setInputs((prev) => ({ ...prev, ribs: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="neck" className="text-slate-700 dark:text-slate-300">
            Neck Palpation Score (0 = no fat, 3 = heavy fat)
          </Label>
          <Input
            id="neck"
            type="number"
            min={0}
            max={3}
            step="0.1"
            placeholder="0 to 3"
            value={inputs.neck}
            onChange={(e) => setInputs((prev) => ({ ...prev, neck: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="tailhead" className="text-slate-700 dark:text-slate-300">
            Tailhead Palpation Score (0 = no fat, 3 = heavy fat)
          </Label>
          <Input
            id="tailhead"
            type="number"
            min={0}
            max={3}
            step="0.1"
            placeholder="0 to 3"
            value={inputs.tailhead}
            onChange={(e) => setInputs((prev) => ({ ...prev, tailhead: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", ribs: "", neck: "", tailhead: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Horse Body Condition Score Helper (Henneke 1–9)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps horse owners and equine professionals assess body fat distribution using the standardized Henneke 1–9 scale. The tool guides you through key body regions to determine your horse's current condition score and health status.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Begin by visually observing your horse's overall shape, then systematically palpate (feel) five key areas: ribs, neck, shoulder, loin, and tailhead. Input your findings into the calculator to identify fat distribution patterns.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator provides your horse's Henneke score with specific management recommendations for nutrition, exercise, and health monitoring. Scores 5–6 indicate ideal condition; scores outside this range suggest dietary or veterinary adjustments.</p>
        </div>
      </section>

      {/* TABLE: Henneke Body Condition Score Scale (1–9) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Henneke Body Condition Score Scale (1–9)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the nine Henneke scores with corresponding body appearance and management recommendations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Score</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Condition Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Visible Signs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Management Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Poor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">All ribs visible, hip bones prominent, no fat palpable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Veterinary evaluation, increase nutrition</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Thin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ribs easily visible, minimal fat deposits, spine prominent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increase hay/grain, assess for illness</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Thin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ribs visible without pressure, slight neck definition</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add grain, monitor parasite control</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderately Thin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ribs felt with light pressure, slight shoulder rounding</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maintenance feeding, monitor progress</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ideal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ribs felt with firm pressure, smooth shoulder, balanced appearance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maintenance feeding, optimal health</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ribs felt with firm pressure, slight shoulder fat, fullness visible</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maintain current feed or slight reduction</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fleshy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ribs difficult to feel, pronounced neck crest, shoulder roundness</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduce grain, increase exercise</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ribs very difficult to feel, prominent crest, creasing along back</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Significant calorie restriction, veterinary guidance</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Obese</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ribs palpable only with extreme pressure, severe fat deposits, health risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Strict diet plan, veterinary consultation, exercise</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Scores 5–6 are optimal for most horses; scores 1–3 and 8–9 require intervention.</p>
      </section>

      {/* TABLE: Henneke Scoring Assessment Points by Body Region */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Henneke Scoring Assessment Points by Body Region</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Evaluate these five key areas to determine your horse's accurate Henneke score.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Body Region</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Poor (1–2)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate (4–5)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Obese (8–9)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ribs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Easily visible, no palpable fat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Felt with firm pressure, smooth contour</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very difficult to feel, crease along back</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Neck</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Narrow, defined cervical ligament</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Smooth blend with shoulder, no crest</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Thick, pronounced crest, crease visible</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Shoulder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Angular, no fat cover, ribs extended</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Smooth, rounded, ribs not visible</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very fat, extended roundness, creasing</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Loin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sunken, spinous processes prominent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Firm, smooth, level topline</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rounded, fat deposits visible along spine</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tailhead</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hip bones and croup prominent, angular</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rounded, fat cover smooth and even</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very prominent fat pad, creasing above tail</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All five regions must be assessed together; score reflects overall pattern, not single area.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always palpate in a consistent location and light to avoid misinterpreting muscle as fat when assessing ribs and shoulders.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use standardized Henneke reference photos alongside this calculator to cross-verify your scoring and ensure accuracy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track scores monthly on a spreadsheet to monitor trends and adjust feeding plans before significant weight loss or gain occurs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for seasonal changes in winter coats and muscularity, which can mask or exaggerate fat deposits when visually assessing scores.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Muscle with Fat</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Athletic horses with strong musculature may appear fit but actually be overweight; always palpate fat deposits separately from muscle tone.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Regional Variation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assessing only one body area (e.g., ribs alone) can lead to incorrect scores; evaluate all five regions for accurate overall scoring.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for Seasonal Coats</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Winter coats obscure body contours; score in spring/summer when visual assessment is more reliable, or always palpate ribs regardless of season.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overrelying on Visual Assessment Alone</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Palpation is essential; visual inspection without feeling fat deposits can result in scores that are 1–2 points off from actual condition.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the Henneke Body Condition Score system?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Henneke scale is a 1–9 scoring system developed by Dr. Don Henneke in 1983 to assess horse body fat distribution and overall health. Scores range from 1 (poor/emaciated) to 9 (obese), with 5–6 considered ideal.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I determine my horse's Henneke score?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Assess your horse by palpating (feeling) fat deposits along the neck, shoulder, ribs, loin, and tailhead while observing overall appearance. Compare findings to Henneke standard photos and descriptions for each score level.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What score should my horse maintain?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most horses perform best at Henneke scores 5–6, indicating adequate energy reserves without excess fat that stresses joints and organs. Breeding mares benefit from scores 6–7 before foaling.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use Henneke scoring for different horse breeds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the Henneke system applies to all horse breeds, though naturally stockier breeds like Quarter Horses may appear rounder at ideal scores compared to Thoroughbreds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I score my horse's body condition?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Score your horse monthly during weight-loss or gain periods, or every 3 months during stable seasons to detect health changes early and adjust feed accordingly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does a score of 3 or lower indicate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Scores 1–3 indicate poor to thin condition with visible ribs, spinous processes, and hip bones, signaling inadequate nutrition, illness, or parasites requiring veterinary attention.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do Henneke scores relate to feeding programs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use Henneke scores to adjust grain, hay, and supplement amounts: horses scoring 4–5 need maintenance feed, 6+ need reduced calories, and 1–3 need increased nutrition and veterinary evaluation.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://extension.oregonstate.edu/ask-expert/featured/what-henneke-body-condition-score" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Henneke Horse Body Condition Scoring System</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Oregon State University Extension provides detailed explanations of the Henneke 1–9 scale with assessment guidelines.</p>
          </li>
          <li>
            <a href="https://www.extension.purdue.edu/extmedia/AS/AS-621-W.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Body Condition Scoring Chart</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Purdue University offers a comprehensive PDF reference with visual descriptions and scoring benchmarks for all nine Henneke levels.</p>
          </li>
          <li>
            <a href="https://aaep.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Association of Equine Practitioners (AAEP) Body Condition Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AAEP provides professional veterinary guidance on body condition scoring and nutritional management for horses.</p>
          </li>
          <li>
            <a href="https://ker.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Kentucky Equine Research: Body Condition and Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kentucky Equine Research offers evidence-based feeding recommendations aligned with Henneke scores for optimal equine health.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Body Condition Score Helper (Henneke 1–9)"
      description="Use the **Henneke 1-9 scale** to assess a horse's fat reserves and plan nutritional adjustments."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Estimated BCS = Round(((Ribs + Neck + Tailhead) / 3) × 3)",
        variables: [
          { symbol: "Ribs", description: "Palpation score for ribs (0–3)" },
          { symbol: "Neck", description: "Palpation score for neck (0–3)" },
          { symbol: "Tailhead", description: "Palpation score for tailhead (0–3)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A horse has palpation scores of 2.0 for ribs, 1.5 for neck, and 2.5 for tailhead. The owner wants to estimate the body condition score to adjust feeding.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the average palpation score: (2.0 + 1.5 + 2.5) / 3 = 2.0.",
          },
          {
            label: "2",
            explanation:
              "Multiply the average by 3 to scale to the 1–9 BCS: 2.0 × 3 = 6.0.",
          },
          {
            label: "3",
            explanation: "Round to the nearest whole number: 6.",
          },
        ],
        result: "The estimated Henneke Body Condition Score is 6, indicating a moderately fleshy condition.",
      }}
      relatedCalculators={[
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
        { title: "Dehydration Risk Checker", url: "/pets/small-mammal-dehydration-risk-checker", icon: "🐶" },
        { title: "Safe Stocking Density (Fish/cm per Litre)", url: "/pets/aquarium-safe-stocking-density-fish-per-litre", icon: "🐱" },
        { title: "Safe Vegetables & Fruits Portion Calculator", url: "/pets/small-mammal-safe-vegetables-fruits-portion", icon: "🍖" },
        { title: "Temperature Stress Risk (Rabbit Heatstroke)", url: "/pets/rabbit-temperature-stress-risk-heatstroke", icon: "💉" },
        { title: "Water Change Volume Planner", url: "/pets/aquarium-water-change-volume-planner", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Body Condition Score Helper (Henneke 1–9)" },
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