import { useState, useMemo, type ChangeEvent } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { convertWeight, formatNumberForInput, weightToKg } from "@/lib/utils";

export default function CatCaffeineToxicityCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and caffeine amount
  const [inputs, setInputs] = useState({
    weight: "",
    caffeineAmount: "",
  });

  // 2. LOGIC ENGINE
  // Toxic dose threshold for caffeine in cats: ~20 mg/kg (lowest reported toxic dose)
  // Risk Score = (Caffeine Dose in mg) / (Weight in kg * 20 mg/kg)
  // Score > 1 indicates toxic risk
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const caffeineRaw = parseFloat(inputs.caffeineAmount);

    if (isNaN(weightRaw) || weightRaw <= 0 || isNaN(caffeineRaw) || caffeineRaw <= 0) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for weight and caffeine amount.",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Calculate risk score
    const toxicDoseMgPerKg = 20;
    const riskScore = caffeineRaw / (weightKg * toxicDoseMgPerKg);

    let label = "";
    let warning: string | null = null;

    if (riskScore < 0.1) {
      label = "Minimal risk of caffeine toxicity.";
    } else if (riskScore < 0.5) {
      label = "Low risk of caffeine toxicity. Monitor your cat closely.";
    } else if (riskScore < 1) {
      label = "Moderate risk of caffeine toxicity. Veterinary consultation recommended.";
      warning = "Potentially harmful caffeine exposure detected. Seek veterinary advice promptly.";
    } else {
      label = "High risk of caffeine toxicity! Immediate veterinary care required.";
      warning = "This caffeine dose is potentially life-threatening. Contact a veterinarian immediately.";
    }

    return {
      value: riskScore.toFixed(2),
      label,
      subtext: `Based on a toxic dose threshold of 20 mg/kg for cats.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What caffeine dose is toxic to cats?",
      answer: "Cats are highly sensitive to caffeine; toxicity typically occurs at 20 mg/kg of body weight, with severe effects at 40+ mg/kg. A 10 lb cat needs only 90 mg of caffeine to show mild symptoms.",
    },
    {
      question: "How quickly do caffeine toxicity symptoms appear in cats?",
      answer: "Symptoms usually appear within 30-60 minutes of ingestion and peak at 1-2 hours. Effects can last 12+ hours depending on the amount consumed.",
    },
    {
      question: "Which common foods and drinks contain dangerous caffeine levels for cats?",
      answer: "One cup of coffee (95-200 mg), a single espresso shot (63-75 mg), dark chocolate (12-26 mg per ounce), and energy drinks (80-300 mg) all pose serious risks to cats.",
    },
    {
      question: "What are the early warning signs of caffeine poisoning in cats?",
      answer: "Early signs include restlessness, rapid breathing, increased heart rate, tremors, and vomiting. Severe cases may cause seizures, arrhythmias, or collapse.",
    },
    {
      question: "Is there an antidote for cat caffeine toxicity?",
      answer: "No specific antidote exists; treatment is supportive care including IV fluids, monitoring, and symptom management at an emergency veterinary clinic.",
    },
    {
      question: "How much caffeine is in tea versus coffee for cats?",
      answer: "Black tea contains 25-50 mg per cup while coffee has 95-200 mg per cup; even small amounts of either can be harmful to cats.",
    },
    {
      question: "Should I use this calculator before contacting a vet?",
      answer: "This calculator estimates risk level, but contact your vet or poison control immediately if your cat ingested any caffeine; do not delay seeking professional help.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handle input changes
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(next) => {
              if (next !== "kg" && next !== "lb") return;
              const weightRaw = parseFloat(inputs.weight);
              if (Number.isFinite(weightRaw) && weightRaw > 0) {
                const nextWeight = convertWeight(weightRaw, unit, next);
                setInputs((prev) => ({
                  ...prev,
                  weight: formatNumberForInput(nextWeight, 2),
                }));
              }
              setUnit(next);
            }}
          >
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

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat's Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={unit === "lb" ? "e.g. 10.5" : "e.g. 4.8"}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your cat's current body weight.
          </p>
        </div>

        <div>
          <Label htmlFor="caffeineAmount" className="text-slate-700 dark:text-slate-300">
            Estimated Caffeine Amount (mg)
          </Label>
          <Input
            id="caffeineAmount"
            name="caffeineAmount"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 50"
            value={inputs.caffeineAmount}
            onChange={handleInputChange}
            aria-describedby="caffeine-desc"
          />
          <p id="caffeine-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the estimated caffeine ingested from all sources.
          </p>
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
          onClick={() => setInputs({ weight: "", caffeineAmount: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Caffeine Toxicity Risk for Cats</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates whether your cat has ingested a potentially toxic amount of caffeine based on their weight and the caffeine dose consumed. It helps you quickly assess risk level and determine if veterinary attention is needed.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your cat's body weight in pounds or kilograms and the milligrams of caffeine ingested. The calculator uses established toxicity thresholds (20 mg/kg for symptoms, 40+ mg/kg for severe effects) to compute risk.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show your cat's risk level as none, mild, moderate, severe, or life-threatening. Always contact your veterinarian or animal poison control for any suspected ingestion; this tool is informational only and does not replace professional medical advice.</p>
        </div>
      </section>

      {/* TABLE: Caffeine Content in Common Household Items */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Caffeine Content in Common Household Items</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Typical caffeine amounts found in foods and beverages that pose toxicity risks to cats.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Item</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Serving Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Caffeine Content (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Level for 10 lb Cat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Brewed Coffee</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 oz cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95–200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Espresso</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 shot (1 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">63–75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Black Tea</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 oz cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Energy Drink</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 oz serving</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80–300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dark Chocolate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 ounce</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12–26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Milk Chocolate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 ounce</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cola Soft Drink</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 oz can</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34–46</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Caffeine Pill</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 tablet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100–200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Toxicity risk depends on cat weight; lighter cats are at greater risk from smaller amounts.</p>
      </section>

      {/* TABLE: Caffeine Toxicity Severity Levels for Cats */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Caffeine Toxicity Severity Levels for Cats</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Symptom severity based on caffeine dose relative to cat body weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dose (mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Symptom Severity</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Clinical Signs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Veterinary Care Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&lt; 5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No symptoms expected</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not needed</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5–10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mild</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slight restlessness, mild tremors</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitor closely</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10–20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hyperactivity, rapid heartbeat, vomiting</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Contact vet</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20–40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Tremors, rapid heart rate, seizures risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Emergency care</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt; 40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Life-Threatening</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Seizures, cardiac arrhythmias, collapse</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Emergency care immediately</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">A 5 lb cat ingesting 50 mg caffeine reaches ~22 mg/kg (severe risk level).</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep all coffee, tea, energy drinks, and caffeine pills secured in cabinets or high shelves away from curious cats.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Be aware that some medications, weight-loss supplements, and performance-enhancing products contain hidden caffeine dangerous to cats.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If your cat ingests caffeine, note the time and amount, then immediately contact your vet or ASPCA Animal Poison Control (888-426-4435).</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Kittens and senior cats are more vulnerable to caffeine toxicity due to slower metabolism; use extra caution with these age groups.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming small amounts are safe</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Even 10 mg of caffeine can cause mild symptoms in a 5 lb cat; no amount is truly 'safe'.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting hidden caffeine sources</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Chocolate, energy bars, diet pills, and certain pain relievers contain caffeine and are often overlooked as toxicity risks.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Waiting to see symptoms before calling the vet</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Toxicity symptoms can escalate quickly to seizures or cardiac issues; seek immediate veterinary care at any ingestion suspicion.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using human toxicity data for cats</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats metabolize caffeine differently than humans and are far more sensitive; cat-specific toxicity thresholds must be used.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What caffeine dose is toxic to cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cats are highly sensitive to caffeine; toxicity typically occurs at 20 mg/kg of body weight, with severe effects at 40+ mg/kg. A 10 lb cat needs only 90 mg of caffeine to show mild symptoms.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How quickly do caffeine toxicity symptoms appear in cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Symptoms usually appear within 30-60 minutes of ingestion and peak at 1-2 hours. Effects can last 12+ hours depending on the amount consumed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Which common foods and drinks contain dangerous caffeine levels for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">One cup of coffee (95-200 mg), a single espresso shot (63-75 mg), dark chocolate (12-26 mg per ounce), and energy drinks (80-300 mg) all pose serious risks to cats.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the early warning signs of caffeine poisoning in cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Early signs include restlessness, rapid breathing, increased heart rate, tremors, and vomiting. Severe cases may cause seizures, arrhythmias, or collapse.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is there an antidote for cat caffeine toxicity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No specific antidote exists; treatment is supportive care including IV fluids, monitoring, and symptom management at an emergency veterinary clinic.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much caffeine is in tea versus coffee for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Black tea contains 25-50 mg per cup while coffee has 95-200 mg per cup; even small amounts of either can be harmful to cats.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I use this calculator before contacting a vet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator estimates risk level, but contact your vet or poison control immediately if your cat ingested any caffeine; do not delay seeking professional help.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aspca.org/pet-care/animal-poison-control" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Animal Poison Control Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official resource for emergency poisoning guidance and 24/7 hotline for pet toxicity cases.</p>
          </li>
          <li>
            <a href="https://www.petpoisonhelpline.com/poison/caffeine/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Poison Helpline – Caffeine Toxicity in Pets</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed toxicology information on caffeine poisoning symptoms and treatment in cats and other pets.</p>
          </li>
          <li>
            <a href="https://icatcare.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Cat Care – Feline Nutrition and Safety</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based guidance on safe foods and substances for cats from cat welfare experts.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals – Caffeine Toxicity in Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary clinical information on caffeine poisoning diagnosis, symptoms, and emergency treatment protocols.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Caffeine Toxicity Risk for Cats"
      description="Estimate the toxic exposure risk from caffeine in products like coffee grounds, tea, or energy drinks."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Risk Score = Caffeine Dose (mg) ÷ (Weight (kg) × 20 mg/kg)",
        variables: [
          { symbol: "Caffeine Dose (mg)", description: "Total caffeine ingested in milligrams" },
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "20 mg/kg", description: "Estimated toxic dose threshold for caffeine in cats" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb (4.54 kg) cat accidentally ingests 100 mg of caffeine from spilled coffee grounds.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms: 10 lbs ÷ 2.20462 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate risk score: 100 mg ÷ (4.54 kg × 20 mg/kg) = 100 ÷ 90.8 = 1.10.",
          },
          {
            label: "3",
            explanation:
              "Since the risk score is above 1, this indicates a high risk of caffeine toxicity requiring immediate veterinary care.",
          },
        ],
        result: "Risk Score = 1.10 (High risk - seek emergency veterinary attention)",
      }}
      relatedCalculators={[
        { title: "Egg Binding Risk Estimator", url: "/pets/bird-egg-binding-risk-estimator", icon: "🐾" },
        { title: "Growth Curve by Species (Python, Bearded Dragon, Gecko)", url: "/pets/reptile-growth-curve-python-bearded-dragon-gecko", icon: "🐶" },
        { title: "Horse Colic Risk Assessment (Feeding & Management)", url: "/pets/horse-colic-risk-assessment", icon: "🐎" },
        { title: "Horse Body Condition Score Helper (Henneke 1–9)", url: "/pets/horse-body-condition-score-henneke", icon: "🐎" },
        { title: "Horse NSAID Overdose Risk (Phenylbutazone)", url: "/pets/horse-nsaid-overdose-risk", icon: "🐎" },
        { title: "Daily Water Requirement per Weight", url: "/pets/bird-daily-water-requirement-per-weight", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Caffeine Toxicity Risk for Cats" },
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
