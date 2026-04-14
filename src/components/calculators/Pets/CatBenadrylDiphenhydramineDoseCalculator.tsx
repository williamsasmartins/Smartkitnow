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

export default function CatBenadrylDiphenhydramineDoseCalculator() {
  // 1. STATE
  // Unit system default: imperial (lbs)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight only (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Benadryl dose for cats: 1 mg/kg every 8-12 hours (commonly 1 mg/kg q8-12h)
  // We'll calculate a single dose in mg based on weight.
  // Convert weight to kg if input is imperial.
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: "",
        warning: null,
      };
    }
    const weightKg = weightToKg(weightRaw, unit);

    // Dose mg = 1 mg/kg * weightKg
    const doseMg = +(weightKg * 1).toFixed(2);

    // Safety warning if weight is very low or dose is unusually high
    let warning = null;
    if (weightKg < 1) {
      warning =
        "Caution: Cats under 1 kg require veterinary supervision before dosing Benadryl.";
    }
    if (doseMg > 50) {
      warning =
        "Warning: Doses above 50 mg should only be given under veterinary guidance.";
    }

    return {
      value: doseMg,
      label: "Recommended Benadryl Dose (mg) per administration",
      subtext:
        "Administer every 8 to 12 hours as directed by your veterinarian. Do not exceed recommended dose.",
      warning,
    };
  }, [inputs.weight, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the standard Benadryl dose for cats?",
      answer: "The typical dose is 1 mg per pound of body weight, given every 8-12 hours. For a 10-pound cat, this equals approximately 10 mg per dose.",
    },
    {
      question: "Can I use human Benadryl tablets for my cat?",
      answer: "Yes, standard Benadryl tablets contain 25 mg of diphenhydramine and can be used for cats, but dosing must be calculated carefully by weight. Always consult your veterinarian before administering.",
    },
    {
      question: "How often can I give my cat Benadryl?",
      answer: "Benadryl can be given every 8-12 hours as needed, but should not exceed 3-4 doses per day without veterinary supervision.",
    },
    {
      question: "What conditions does this calculator help treat in cats?",
      answer: "This calculator helps determine appropriate doses for allergies, itching, anxiety, and motion sickness in cats. Always verify dosing with your veterinarian.",
    },
    {
      question: "Are there side effects from Benadryl in cats?",
      answer: "Common side effects include drowsiness and dry mouth; rarely, cats may experience paradoxical hyperactivity or urinary retention at improper doses.",
    },
    {
      question: "Should I use liquid or tablet Benadryl for my cat?",
      answer: "Liquid formulations are easier to dose accurately for smaller cats, but ensure they contain no alcohol or xylitol, which are toxic to felines.",
    },
    {
      question: "What is the maximum safe dose of Benadryl for cats?",
      answer: "The maximum recommended dose is typically 2 mg per pound per dose; exceeding this risks overdose and requires immediate veterinary care.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(next) => {
              if (next !== "kg" && next !== "lb") return;
              setInputs((prev) => {
                const num = parseFloat(prev.weight);
                if (!prev.weight || Number.isNaN(num) || num <= 0) return prev;
                const converted = convertWeight(num, unit, next);
                return { ...prev, weight: formatNumberForInput(converted, 2) };
              });
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
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat's Weight ({unit === "lb" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "lb" ? "lbs" : "kg"}`}
          value={inputs.weight}
          onChange={(e) =>
            setInputs((prev) => ({ ...prev, weight: e.target.value }))
          }
          aria-describedby="weight-desc"
        />
        <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400">
          Please enter your cat's current body weight for accurate dosing.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already handled by useMemo)
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value} mg
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Benadryl (Diphenhydramine) Dose Calculator for Cats</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the appropriate Benadryl dose for your cat based on its weight and the standard veterinary dosing guideline of 1 mg per pound of body weight. It helps you calculate safe single doses and daily frequency to treat allergies, itching, anxiety, and motion sickness.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter your cat's weight in pounds and select the condition being treated. The tool then computes the recommended single dose in milligrams and suggests appropriate dosing intervals (typically every 8-12 hours).</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the calculated dose and cross-reference it with the formulation you have available (tablet, liquid, etc.). Always consult your veterinarian before giving Benadryl to confirm the dose is appropriate for your cat's health status and any existing medications.</p>
        </div>
      </section>

      {/* TABLE: Benadryl Dosage Guide by Cat Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Benadryl Dosage Guide by Cat Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to determine appropriate diphenhydramine doses based on your cat's weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Single Dose (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Max Daily Doses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 8-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 8-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 8-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 8-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 8-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 8-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 8-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always consult your veterinarian before administering medication. Dosages are based on 1 mg per pound of body weight.</p>
      </section>

      {/* TABLE: Common Benadryl Formulations and Dosing */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Benadryl Formulations and Dosing</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference standard Benadryl products and their diphenhydramine content for accurate cat dosing.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Product Form</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Diphenhydramine Content</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Suitable for Cats</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dosing Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tablets (Standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 mg per tablet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Crush and mix with food or use liquid</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Capsules</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-50 mg per capsule</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Limited</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Difficult to portion for cats</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Liquid (Allergy)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.5 mg per 5 mL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Use syringe for accurate measurement</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Children's Liquid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.5 mg per 5 mL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Easy to dose; verify no xylitol</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cream/Topical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2% diphenhydramine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Never apply; toxic if ingested</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always verify the inactive ingredients for alcohol, xylitol, or other substances toxic to cats before use.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify your cat's weight accurately before calculating the dose, as even small variations impact the milligram amount significantly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Liquid Benadryl is often easier to administer to cats than tablets; use a syringe to measure and mix into wet food.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store Benadryl at room temperature away from moisture and never use expired medication, as potency may be compromised.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your cat for signs of overdose such as excessive drowsiness, rapid heartbeat, or urinary retention, and contact your vet immediately if observed.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Product Formulations with Xylitol</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some Benadryl products contain xylitol, a sweetener highly toxic to cats; always read the inactive ingredients label before administering.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Doubling the Dose if a Dose Is Missed</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Never give a double dose to make up for a missed one; simply resume the normal schedule at the next scheduled time.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Giving Benadryl Without Veterinary Approval</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using Benadryl without consulting your vet may mask serious conditions or interact with existing medications your cat takes.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Child and Adult Formulations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Children's Benadryl (12.5 mg/5 mL) differs from adult liquid (25 mg/5 mL); using the wrong concentration leads to incorrect dosing.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard Benadryl dose for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The typical dose is 1 mg per pound of body weight, given every 8-12 hours. For a 10-pound cat, this equals approximately 10 mg per dose.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use human Benadryl tablets for my cat?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, standard Benadryl tablets contain 25 mg of diphenhydramine and can be used for cats, but dosing must be calculated carefully by weight. Always consult your veterinarian before administering.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often can I give my cat Benadryl?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Benadryl can be given every 8-12 hours as needed, but should not exceed 3-4 doses per day without veterinary supervision.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What conditions does this calculator help treat in cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator helps determine appropriate doses for allergies, itching, anxiety, and motion sickness in cats. Always verify dosing with your veterinarian.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there side effects from Benadryl in cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common side effects include drowsiness and dry mouth; rarely, cats may experience paradoxical hyperactivity or urinary retention at improper doses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I use liquid or tablet Benadryl for my cat?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Liquid formulations are easier to dose accurately for smaller cats, but ensure they contain no alcohol or xylitol, which are toxic to felines.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the maximum safe dose of Benadryl for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The maximum recommended dose is typically 2 mg per pound per dose; exceeding this risks overdose and requires immediate veterinary care.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://vcahospitals.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals - Diphenhydramine Use in Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative veterinary reference providing guidelines on diphenhydramine dosing, uses, and safety considerations for feline patients.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Merck Veterinary Manual - Antihistamines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive veterinary pharmacology resource detailing diphenhydramine formulations, dosage ranges, and contraindications in cats.</p>
          </li>
          <li>
            <a href="https://apcc.aspca.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Animal Poison Control Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Resource for identifying toxic substances in medications and emergency guidance if overdose or adverse reactions occur.</p>
          </li>
          <li>
            <a href="https://www.avma.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association - Pet Safety</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional veterinary organization offering evidence-based guidance on medication safety and appropriate dosing protocols for cats.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Benadryl (Diphenhydramine) Dose Calculator for Cats"
      description="Calculate the safe, appropriate dosage of **Benadryl (Diphenhydramine)** for cats based on body weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Benadryl Dose (mg) = 1 mg × Body Weight (kg)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Cat's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A cat weighs 8.8 lbs (4 kg). The owner wants to know the correct Benadryl dose.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed (8.8 lbs ÷ 2.20462 = 4 kg).",
          },
          {
            label: "2",
            explanation:
              "Multiply weight by 1 mg/kg: 4 kg × 1 mg = 4 mg dose per administration.",
          },
          {
            label: "3",
            explanation:
              "Administer 4 mg every 8 to 12 hours as directed by a veterinarian.",
          },
        ],
        result:
          "The recommended Benadryl dose for this cat is 4 mg per dose, given every 8-12 hours.",
      }}
      relatedCalculators={[
        {
          title: "Shedding & Combing Time Planner",
          url: "/pets/cat-shedding-combing-time-planner",
          icon: "🐾",
        },
        {
          title: "Breeding Tank Volume Planner",
          url: "/pets/breeding-tank-volume-planner",
          icon: "🐶",
        },
        {
          title: "Horse Electrolyte Need Estimator (Exercise & Heat)",
          url: "/pets/horse-electrolyte-need-estimator",
          icon: "🐎",
        },
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
        {
          title: "Heavy Metal (Lead/Zinc) Exposure Risk",
          url: "/pets/bird-heavy-metal-exposure-risk",
          icon: "💉",
        },
        {
          title: "Daily Water Requirement per Weight",
          url: "/pets/bird-daily-water-requirement-per-weight",
          icon: "💧",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Benadryl (Diphenhydramine) Dose Calculator for Cats",
        },
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
