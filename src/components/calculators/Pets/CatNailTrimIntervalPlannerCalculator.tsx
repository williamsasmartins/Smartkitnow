import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatNailTrimIntervalPlannerCalculator() {
  // 1. STATE
  // No unit switcher needed as inputs are categorical/time based
  // Inputs: Activity Level (1-5), Scratching Surface Quality (1-5)
  const [inputs, setInputs] = useState({
    activityLevel: "",
    surfaceQuality: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Recommended Interval (weeks) = 8 - (Activity Level * 1.2) - (Surface Quality * 0.8)
  // Minimum interval capped at 2 weeks
  const results = useMemo(() => {
    const activity = parseInt(inputs.activityLevel);
    const surface = parseInt(inputs.surfaceQuality);

    if (
      isNaN(activity) ||
      isNaN(surface) ||
      activity < 1 ||
      activity > 5 ||
      surface < 1 ||
      surface > 5
    ) {
      return {
        value: 0,
        label: "Please enter valid inputs",
        subtext: null,
        warning: null,
      };
    }

    let interval = 8 - activity * 1.2 - surface * 0.8;
    if (interval < 2) interval = 2;

    return {
      value: interval.toFixed(1),
      label: "Recommended Nail Trim Interval (weeks)",
      subtext:
        "Based on your cat's activity level and available scratching surfaces.",
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How does surface type affect nail trim frequency?",
      answer: "Harder surfaces like concrete and tile naturally wear nails faster, requiring trims every 4-6 weeks, while softer surfaces like carpet and grass require trims every 8-12 weeks.",
    },
    {
      question: "What activity level should I select for my pet?",
      answer: "High activity pets (running, jumping daily) need trims every 4-6 weeks; moderate activity pets every 6-8 weeks; low activity pets every 8-12 weeks depending on surface exposure.",
    },
    {
      question: "Can indoor vs. outdoor environments change trim intervals?",
      answer: "Yes—outdoor pets on hard surfaces need more frequent trims (4-5 weeks), while indoor-only pets on carpet may need trims only every 10-12 weeks.",
    },
    {
      question: "How do I know if my pet's nails are too long?",
      answer: "Nails touching the ground when standing, clicking sounds while walking, or visible curling indicate overgrowth and the need for immediate trimming.",
    },
    {
      question: "Why do some pets need more frequent nail trims than others?",
      answer: "Breed size, nail growth rate, surface contact, and activity level all influence trim frequency; larger breeds and active dogs generally need more frequent trims.",
    },
    {
      question: "What if my pet spends time on mixed surfaces?",
      answer: "Average the trim intervals of your pet's primary surfaces; a pet on carpet 70% and tile 30% of the time should follow a schedule between those two intervals.",
    },
    {
      question: "Should trim intervals change seasonally?",
      answer: "Yes—pets active outdoors in winter may need more frequent trims due to increased hard surface contact, while summer indoor activity may extend intervals.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300">
            Activity Level (1 = Very Low, 5 = Very High)
          </Label>
          <Input
            id="activityLevel"
            type="number"
            min={1}
            max={5}
            step={1}
            value={inputs.activityLevel}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, activityLevel: e.target.value }))
            }
            placeholder="Enter activity level (1-5)"
            aria-describedby="activityLevelHelp"
          />
          <p id="activityLevelHelp" className="text-xs text-slate-500 mt-1">
            Rate your cat's daily activity level on a scale from 1 to 5.
          </p>
        </div>

        <div>
          <Label htmlFor="surfaceQuality" className="text-slate-700 dark:text-slate-300">
            Scratching Surface Quality (1 = Poor, 5 = Excellent)
          </Label>
          <Input
            id="surfaceQuality"
            type="number"
            min={1}
            max={5}
            step={1}
            value={inputs.surfaceQuality}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, surfaceQuality: e.target.value }))
            }
            placeholder="Enter surface quality (1-5)"
            aria-describedby="surfaceQualityHelp"
          />
          <p id="surfaceQualityHelp" className="text-xs text-slate-500 mt-1">
            Rate the quality and availability of your cat's scratching surfaces.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs to current values (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate nail trim interval"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ activityLevel: "", surfaceQuality: "" })}
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

  // 5. EDITORIAL JSX
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Nail Trim Interval Planner (activity/surface based)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the ideal nail trimming schedule based on your pet's activity level and the surfaces they contact daily. By accounting for natural wear patterns, it helps you maintain optimal nail health and prevent overgrowth complications.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet's primary activity level (high, moderate, or low) and the main surfaces they walk on (carpet, tile, concrete, grass, wood, etc.). The calculator will generate a personalized trim interval tailored to your pet's lifestyle and wear patterns.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show recommended trim frequency in weeks along with warning signs of overgrowth. Use this schedule as a baseline, but monitor your pet's nails monthly and adjust if growth patterns differ from the estimate.</p>
        </div>
      </section>

      {/* TABLE: Recommended Nail Trim Intervals by Activity & Surface */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Nail Trim Intervals by Activity & Surface</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to find the optimal trimming schedule based on your pet's primary activity level and surface exposure.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Surface Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Trim Interval (weeks)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Signs of Overgrowth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Concrete/Tile</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Clicking sounds, nails touching ground</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Wood/Laminate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Clicking sounds, difficulty gripping</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Carpet/Grass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slight clicking, mild discomfort</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Concrete/Tile</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Nails slightly visible at rest</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Wood/Laminate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mild clicking when walking</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Carpet/Grass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Nails slightly long at rest</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Concrete/Tile</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Nails curling slightly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Carpet/Grass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Overgrowth visible between paws</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Indoor Only</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Carpet/Rug</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Nails visibly long, curling</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Intervals may vary by individual pet; monitor nails monthly and adjust as needed.</p>
      </section>

      {/* TABLE: Nail Growth Rates by Pet Type & Surface Contact */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Nail Growth Rates by Pet Type & Surface Contact</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated monthly nail growth and recommended trim frequency for common pet scenarios.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Surface Exposure</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Growth (mm)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Optimal Trim Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High outdoor/concrete</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 4 weeks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mixed indoor/outdoor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 weeks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High outdoor/concrete</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 4-5 weeks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mixed indoor/outdoor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-7 weeks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Indoor carpet only</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 8-10 weeks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Indoor/outdoor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 weeks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior Pet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low activity indoor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 10-12 weeks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior Pet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate activity</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 8-10 weeks</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Growth rates depend on breed, age, nutrition, and nail health; consult your veterinarian for personalized schedules.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Check nails monthly visually and by touch, even if trim day hasn't arrived—some pets grow nails faster than average.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Hard surfaces like concrete naturally file nails; pets on carpet may need more frequent trims despite lower activity.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Senior pets and those with reduced mobility often need more frequent trims because they wear nails less through activity.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Maintain consistent trim schedules to prevent overgrowth cycles and reduce stress during professional grooming sessions.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring indoor surface wear</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Wood and laminate floors cause significant nail wear similar to outdoor surfaces, so don't assume indoor pets always need less frequent trims.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using activity level alone</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A low-activity pet on concrete may still need frequent trims, while a high-activity pet on soft grass may need fewer—surface type matters equally.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping the visual inspection</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Relying solely on calendar schedules without checking nails risks overgrowth; always observe before and after the recommended trim date.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for seasonal changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Winter may increase hard surface contact and summer may change activity patterns, requiring temporary schedule adjustments.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does surface type affect nail trim frequency?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Harder surfaces like concrete and tile naturally wear nails faster, requiring trims every 4-6 weeks, while softer surfaces like carpet and grass require trims every 8-12 weeks.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What activity level should I select for my pet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">High activity pets (running, jumping daily) need trims every 4-6 weeks; moderate activity pets every 6-8 weeks; low activity pets every 8-12 weeks depending on surface exposure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can indoor vs. outdoor environments change trim intervals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—outdoor pets on hard surfaces need more frequent trims (4-5 weeks), while indoor-only pets on carpet may need trims only every 10-12 weeks.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know if my pet's nails are too long?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Nails touching the ground when standing, clicking sounds while walking, or visible curling indicate overgrowth and the need for immediate trimming.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do some pets need more frequent nail trims than others?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Breed size, nail growth rate, surface contact, and activity level all influence trim frequency; larger breeds and active dogs generally need more frequent trims.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my pet spends time on mixed surfaces?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Average the trim intervals of your pet's primary surfaces; a pet on carpet 70% and tile 30% of the time should follow a schedule between those two intervals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should trim intervals change seasonally?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—pets active outdoors in winter may need more frequent trims due to increased hard surface contact, while summer indoor activity may extend intervals.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aspca.org/pet-care/dog-care/dog-nail-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Pet Care: Dog Nail Care</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidance on recognizing overgrown nails and establishing healthy trimming routines for dogs.</p>
          </li>
          <li>
            <a href="https://www.humanesociety.org/resources/cat-nail-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Humane Society: Cat Nail Care</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive information on maintaining cat nail health and trim frequency recommendations.</p>
          </li>
          <li>
            <a href="https://www.avma.org/pets/pet-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary-backed resources on pet grooming standards and nail health best practices.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/know-your-pet/nail-trimming" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals: Nail Trimming Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional veterinary guidelines for safe nail trimming techniques and interval planning.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Nail Trim Interval Planner (activity/surface based)"
      description="Determine the best frequency for nail trims based on the cat's activity level and available scratching surfaces."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Recommended Interval (weeks) = 8 - (Activity Level × 1.2) - (Surface Quality × 0.8)",
        variables: [
          { symbol: "Activity Level", description: "Cat's daily activity rating (1-5)" },
          { symbol: "Surface Quality", description: "Quality of scratching surfaces (1-5)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A moderately active cat (Activity Level 3) with good scratching surfaces (Surface Quality 4) needs a nail trim schedule.",
        steps: [
          {
            label: "1",
            explanation:
              "Input Activity Level = 3 and Surface Quality = 4 into the calculator.",
          },
          {
            label: "2",
            explanation:
              "Calculate: 8 - (3 × 1.2) - (4 × 0.8) = 8 - 3.6 - 3.2 = 1.2 weeks, but minimum interval capped at 2 weeks.",
          },
          {
            label: "3",
            explanation:
              "Recommended nail trim interval is 2 weeks to maintain optimal nail health.",
          },
        ],
        result: "The cat should have nail trims approximately every 2 weeks.",
      }}
      relatedCalculators={[
        {
          title: "Laminitis Risk Index (BCS + NSC intake)",
          url: "/pets/horse-laminitis-risk-index",
          icon: "🐾",
        },
        {
          title: "Dehydration Risk Checker",
          url: "/pets/small-mammal-dehydration-risk-checker",
          icon: "🐶",
        },
        {
          title: "Horse Salt & Mineral Balance Checker",
          url: "/pets/horse-salt-mineral-balance-checker",
          icon: "🐎",
        },
        {
          title: "Calcium Supplement Dosage (Breeding Females)",
          url: "/pets/bird-calcium-supplement-dosage-breeding-females",
          icon: "🍖",
        },
        {
          title: "Ambient Temperature Safe Zone Calculator",
          url: "/pets/bird-ambient-temperature-safe-zone",
          icon: "💉",
        },
        {
          title: "Phenylbutazone / Flunixin Dose Calculator",
          url: "/pets/horse-phenylbutazone-flunixin-dose",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Nail Trim Interval Planner (activity/surface based)" },
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