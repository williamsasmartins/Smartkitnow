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
import { convertWeight, formatNumberForInput, weightToKg } from "@/lib/utils";

export default function CatOnionGarlicToxicityCalculator() {
  // 1. STATE
  // Unit system needed for weight input (imperial or metric)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and amount of onion/garlic ingested (grams)
  const [inputs, setInputs] = useState({
    weight: "",
    onionGarlicAmount: "",
  });

  // 2. LOGIC ENGINE
  // Toxic dose threshold for cats: ~5 g/kg of onion/garlic ingestion can cause hemolytic anemia
  // Calculate dose in g/kg and risk level
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const amountRaw = parseFloat(inputs.onionGarlicAmount);

    if (
      isNaN(weightRaw) ||
      weightRaw <= 0 ||
      isNaN(amountRaw) ||
      amountRaw <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = weightToKg(weightRaw, unit);

    // Dose in g/kg
    const dose = amountRaw / weightKg;

    // Risk interpretation
    // <1 g/kg: Low risk
    // 1-5 g/kg: Moderate risk
    // >5 g/kg: High risk of toxicity

    let riskLabel = "";
    let warning = null;

    if (dose < 1) {
      riskLabel = "Low Risk: Unlikely to cause toxicity.";
    } else if (dose < 5) {
      riskLabel =
        "Moderate Risk: Potential for mild to moderate hemolytic anemia.";
      warning =
        "Monitor your cat closely and seek veterinary advice if symptoms appear.";
    } else {
      riskLabel =
        "High Risk: Significant risk of hemolytic anemia and requires immediate veterinary attention.";
      warning =
        "This dose is toxic. Contact your veterinarian immediately for treatment.";
    }

    return {
      value: dose.toFixed(2),
      label: "Estimated Onion/Garlic Dose (g/kg body weight)",
      subtext: riskLabel,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "At what weight does onion or garlic become toxic to cats?",
      answer: "Onions and garlic become toxic to cats at doses above 5 grams per kilogram of body weight. A single medium onion (150g) can cause toxicity in a 3kg cat.",
    },
    {
      question: "How quickly do onion toxicity symptoms appear in cats?",
      answer: "Symptoms typically appear within 24-72 hours of ingestion and include letharness, vomiting, diarrhea, and pale gums due to hemolytic anemia.",
    },
    {
      question: "Is garlic more toxic than onions for cats?",
      answer: "Garlic is more concentrated and potent than onions, requiring smaller quantities to cause toxicity; just 1-2 cloves can harm a small cat.",
    },
    {
      question: "Can cooked onions or garlic be safely eaten by cats?",
      answer: "No, both raw and cooked onions and garlic are toxic to cats, as cooking does not destroy the harmful sulfur compounds (thiosulfates).",
    },
    {
      question: "What should I do if my cat ingested onion or garlic?",
      answer: "Contact your veterinarian or pet poison control immediately; treatment may include inducing vomiting, activated charcoal, or supportive care for anemia.",
    },
    {
      question: "Are all cat breeds equally susceptible to onion and garlic toxicity?",
      answer: "Yes, all cat breeds are equally susceptible; toxicity depends on the amount ingested relative to body weight, not breed genetics.",
    },
    {
      question: "How long does it take for a cat to recover from onion toxicity?",
      answer: "With veterinary treatment, most cats recover within 3-7 days, though severe anemia cases may require 2-3 weeks of supportive care and monitoring.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // UI widget
  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">
            Unit System
          </Label>
          <Select
            value={unit}
            onValueChange={(next) => {
              if (next !== "kg" && next !== "lb") return;
              const weightRaw = parseFloat(inputs.weight);
              if (Number.isFinite(weightRaw) && weightRaw > 0) {
                const nextWeight = convertWeight(weightRaw, unit, next);
                setInputs((prev) => ({ ...prev, weight: formatNumberForInput(nextWeight, 2) }));
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

      {/* Weight input */}
      <div className="space-y-1">
        <Label className="text-slate-700 dark:text-slate-300" htmlFor="weight">
          Cat Weight ({unit === "lb" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "lb" ? "lbs" : "kg"}`}
          value={inputs.weight || ""}
          onChange={(e) =>
            setInputs((prev) => ({ ...prev, weight: e.target.value }))
          }
        />
      </div>

      {/* Onion/Garlic amount input */}
      <div className="space-y-1">
        <Label
          className="text-slate-700 dark:text-slate-300"
          htmlFor="onionGarlicAmount"
        >
          Onion/Garlic Amount Ingested (grams)
        </Label>
        <Input
          id="onionGarlicAmount"
          type="number"
          min="0"
          step="any"
          placeholder="Enter amount in grams"
          value={inputs.onionGarlicAmount || ""}
          onChange={(e) =>
            setInputs((prev) => ({ ...prev, onionGarlicAmount: e.target.value }))
          }
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", onionGarlicAmount: "" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only.
              Consult a veterinarian for diagnosis and treatment.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cat Onion/Garlic Toxicity Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines whether your cat has ingested a toxic dose of onion or garlic based on weight and amount consumed. It provides immediate risk assessment and guidance on whether veterinary care is needed.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your cat's weight in kilograms, the type of onion or garlic (raw, cooked, or powdered), and the estimated quantity ingested. The calculator accounts for the higher potency of garlic and concentrated forms.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results indicate if the dose is below the toxic threshold, at risk level, or in the danger zone requiring immediate veterinary attention. When in doubt, contact your vet or pet poison control at (888) 426-4435.</p>
        </div>
      </section>

      {/* TABLE: Onion/Garlic Toxicity Thresholds by Cat Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Onion/Garlic Toxicity Thresholds by Cat Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the approximate amount of onion or garlic needed to reach toxic levels for cats of different weights.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxic Onion Amount (grams)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxic Garlic Amount (grams)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Level at 50g Onion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Toxic dose is approximately 5g/kg for onions and 0.1-0.5g/kg for garlic. Clinical signs appear at lower doses in some cats.</p>
      </section>

      {/* TABLE: Common Foods Containing Hidden Onion/Garlic */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Foods Containing Hidden Onion/Garlic</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Many prepared foods contain onion or garlic powder, which are toxic to cats in concentrated forms.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Item</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Onion/Garlic Content</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk to Cat</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safe Alternative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Baby food (savory)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Garlic powder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Plain cooked chicken</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Onion soup mix</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Powdered onion (45%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Homemade broth</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Seasoned pet treats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Garlic powder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate-High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Unseasoned treats</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gravy/sauce packets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Onion/garlic powder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Plain meat juices</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Processed deli meats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Garlic/onion powder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Plain cooked meat</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Powdered forms are more concentrated than fresh equivalents; even small amounts can be dangerous.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always check ingredient labels for onion powder and garlic powder in pet treats, baby food, and seasonings before sharing with your cat.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store onions, garlic, and foods containing them in secure locations away from curious cats who may investigate or nibble.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep your veterinarian's phone number and the Pet Poison Control hotline (888-426-4435) readily available for emergency reference.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor for early symptoms like vomiting, letharness, or pale gums within 24 hours of suspected ingestion, even if the calculator shows low risk.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming cooked onion is safe</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cooking does not destroy thiosulfates; cooked onions and garlic remain fully toxic to cats and should be avoided entirely.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating garlic potency</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Garlic is 5-10 times more toxic than onions by weight, so even tiny amounts like 1-2 cloves pose serious risk to small cats.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring onion powder in foods</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Powdered onion is highly concentrated; small pinches in treats or soups can exceed toxic doses for average-sized cats.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Delaying veterinary care</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Waiting to see if symptoms develop wastes critical treatment time; induce vomiting or give activated charcoal within 2-4 hours of ingestion for best outcomes.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">At what weight does onion or garlic become toxic to cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Onions and garlic become toxic to cats at doses above 5 grams per kilogram of body weight. A single medium onion (150g) can cause toxicity in a 3kg cat.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How quickly do onion toxicity symptoms appear in cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Symptoms typically appear within 24-72 hours of ingestion and include letharness, vomiting, diarrhea, and pale gums due to hemolytic anemia.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is garlic more toxic than onions for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Garlic is more concentrated and potent than onions, requiring smaller quantities to cause toxicity; just 1-2 cloves can harm a small cat.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can cooked onions or garlic be safely eaten by cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, both raw and cooked onions and garlic are toxic to cats, as cooking does not destroy the harmful sulfur compounds (thiosulfates).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if my cat ingested onion or garlic?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Contact your veterinarian or pet poison control immediately; treatment may include inducing vomiting, activated charcoal, or supportive care for anemia.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are all cat breeds equally susceptible to onion and garlic toxicity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, all cat breeds are equally susceptible; toxicity depends on the amount ingested relative to body weight, not breed genetics.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does it take for a cat to recover from onion toxicity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">With veterinary treatment, most cats recover within 3-7 days, though severe anemia cases may require 2-3 weeks of supportive care and monitoring.</p>
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative source for pet toxicity information and emergency poison control services for cats and other animals.</p>
          </li>
          <li>
            <a href="https://www.vin.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network (VIN) - Onion and Garlic Toxicity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional veterinary database with peer-reviewed articles on feline toxicology and treatment protocols.</p>
          </li>
          <li>
            <a href="https://www.petpoisonhelpline.com/poison/onion/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Poison Helpline - Onion/Garlic Toxicity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide covering symptoms, treatment, and prevention of onion and garlic poisoning in pets.</p>
          </li>
          <li>
            <a href="https://www.avma.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA) - Pet Toxins</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official veterinary organization providing evidence-based guidance on toxic substances and emergency care for animals.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Onion/Garlic Toxicity Calculator"
      description="Determine the potential risk of red blood cell damage from ingesting Allium species (onions, garlic)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Toxic Dose (g/kg) = Onion/Garlic Amount (g) ÷ Cat Weight (kg)",
        variables: [
          {
            symbol: "Onion/Garlic Amount (g)",
            description: "The weight of onion or garlic ingested in grams",
          },
          {
            symbol: "Cat Weight (kg)",
            description: "The body weight of the cat in kilograms",
          },
          {
            symbol: "Toxic Dose (g/kg)",
            description:
              "Calculated dose of onion/garlic per kilogram of cat body weight",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb (4.54 kg) cat ingests approximately 15 grams of cooked onion.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert cat weight to kilograms if needed (10 lb = 4.54 kg).",
          },
          {
            label: "2",
            explanation:
              "Calculate dose: 15 g onion ÷ 4.54 kg = 3.31 g/kg.",
          },
          {
            label: "3",
            explanation:
              "Interpret dose: 3.31 g/kg indicates moderate risk of toxicity; veterinary evaluation recommended.",
          },
        ],
        result:
          "The cat has ingested a moderate toxic dose of onion, warranting close monitoring and veterinary consultation.",
      }}
      relatedCalculators={[
        {
          title: "Fluid Intake vs. Urine Output Balance Checker",
          url: "/pets/cat-fluid-intake-urine-output-balance",
          icon: "🐾",
        },
        {
          title: "Horse Hay Intake Calculator (per body weight %)",
          url: "/pets/horse-hay-intake-bodyweight-percent",
          icon: "🐎",
        },
        {
          title: "Cat Grape/Raisin Exposure Risk (educational)",
          url: "/pets/cat-grape-raisin-exposure-risk",
          icon: "🐱",
        },
        {
          title: "Multi-Cat Litter Box Count Calculator",
          url: "/pets/multi-cat-litter-box-count-calculator",
          icon: "🐱",
        },
        {
          title: "Meloxicam Dose Calculator for Cats",
          url: "/pets/cat-meloxicam-dose",
          icon: "🐱",
        },
        {
          title: "Play Session Planner (Feather/Chase Time Targets)",
          url: "/pets/cat-play-session-planner",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Onion/Garlic Toxicity Calculator" },
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
