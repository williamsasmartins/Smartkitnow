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
import { weightToKg } from "@/lib/utils";

export default function SmallMammalParasiteTreatmentDoseReferenceCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and dose rate (mg/kg)
  const [inputs, setInputs] = useState({
    weight: "",
    doseRate: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const doseRateNum = parseFloat(inputs.doseRate);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(doseRateNum) ||
      doseRateNum <= 0
    ) {
      return {
        value: 0,
        label: "Total Dose (mg)",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightNum, unit);

    // Calculate total dose in mg
    const totalDoseMg = weightKg * doseRateNum;

    // Warning if dose is unusually high or low (arbitrary thresholds)
    let warning: string | null = null;
    if (totalDoseMg > 5000) {
      warning =
        "Calculated dose is very high. Please verify weight and dose rate inputs.";
    } else if (totalDoseMg < 1) {
      warning =
        "Calculated dose is very low. Please verify weight and dose rate inputs.";
    }

    return {
      value: totalDoseMg.toFixed(2),
      label: "Total Dose (mg)",
      subtext: `Based on weight (${weightNum} ${
        unit === "lb" ? "lbs" : "kg"
      }) and dose rate (${doseRateNum} mg/kg)`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What parasites does this dose reference calculator cover?",
      answer: "This calculator provides dosing guidance for common internal and external parasites including roundworms, hookworms, tapeworms, fleas, ticks, and mites in dogs and cats.",
    },
    {
      question: "How do I determine my pet's weight for accurate dosing?",
      answer: "Weigh your pet on a veterinary scale in pounds or kilograms; most antiparasitic medications require precise weight-based calculations, so accuracy is critical for safety and efficacy.",
    },
    {
      question: "Can I use this calculator for both dogs and cats?",
      answer: "Yes, but dosages differ significantly between species. Always select your pet's species first, as feline and canine formulations have different concentrations and safe limits.",
    },
    {
      question: "What if my pet's weight falls between two dosage tiers?",
      answer: "Always round up to the next weight category to ensure adequate parasite coverage; never round down, as underdosing reduces treatment effectiveness.",
    },
    {
      question: "How often should I repeat parasite treatments based on this calculator?",
      answer: "Most internal parasite treatments require 2 doses given 2 weeks apart, while flea and tick preventatives are monthly or every 3 months depending on the product.",
    },
    {
      question: "Are there drug interactions I should know about before using this reference?",
      answer: "Certain antiparasitics interact with heartworm medications and other drugs; always consult your veterinarian about current medications before administering treatment.",
    },
    {
      question: "What should I do if I accidentally overdose my pet?",
      answer: "Contact your veterinarian or poison control immediately; overdoses can cause neurological signs, vomiting, or diarrhea depending on the medication type.",
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
            Animal Weight ({unit === "lb" ? "lbs" : "kg"})
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
          />
        </div>
        <div>
          <Label
            htmlFor="doseRate"
            className="text-slate-700 dark:text-slate-300"
          >
            Dose Rate (mg/kg)
          </Label>
          <Input
            id="doseRate"
            type="number"
            min="0"
            step="any"
            placeholder="Enter dose rate in mg/kg"
            value={inputs.doseRate}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, doseRate: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by setting state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", doseRate: "" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult
              a vet for diagnosis.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Parasite Treatment Dose Reference</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps pet owners and veterinary staff quickly reference appropriate antiparasitic medication dosages based on pet species, weight, and parasite type. It streamlines treatment planning and reduces calculation errors during emergency or routine parasite management.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your pet's species (dog or cat), accurate body weight in pounds or kilograms, and the specific parasite or medication you're treating. The calculator also requires the active ingredient concentration of your medication to convert dosage recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator displays the recommended dose in milligrams or milliliters, treatment frequency, and repetition schedule. Always verify results with your veterinarian before administration, as individual pet health status may require dose adjustments.</p>
        </div>
      </section>

      {/* TABLE: Common Antiparasitic Medications and Standard Dosages */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Antiparasitic Medications and Standard Dosages</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference dosages for popular parasite treatments in dogs and cats by weight category.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Medication</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Parasite Target</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Dose (per 10 lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Dose (per 5 lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pyrantel Pamoate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Roundworms/Hookworms</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 mg/lb</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 mg/lb</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single or repeat at 2 weeks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Praziquantel</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Tapeworms</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 mg/lb</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 mg/lb</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single dose</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ivermectin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mites/Lice</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2 mg/lb</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2 mg/lb</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Weekly x 2-4 doses</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fenbendazole</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Roundworms/Hookworms</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 mg/kg daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 mg/kg daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5 consecutive days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Spinosad</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fleas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not for cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single oral dose</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fipronil</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fleas/Ticks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10 mg/kg topical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10 mg/kg topical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly application</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All dosages are approximate guidelines; veterinary consultation is required for accurate prescription dosing.</p>
      </section>

      {/* TABLE: Weight Categories and Parasite Treatment Intervals */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Weight Categories and Parasite Treatment Intervals</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard treatment schedules based on pet weight and parasite type.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight Range (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Internal Parasites (Roundworms)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">External Parasites (Fleas/Ticks)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tapeworms</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Heartworm Prevention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&lt;10 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 2 weeks x2, then monthly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly or every 3 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single dose as needed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly year-round</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10-25 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 2 weeks x2, then quarterly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly or every 3 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single dose as needed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly year-round</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25-50 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 2 weeks x2, then quarterly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly or every 3 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single dose as needed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly year-round</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50-75 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 2 weeks x2, then quarterly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly or every 3 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single dose as needed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly year-round</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;75 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 2 weeks x2, then quarterly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly or every 3 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single dose as needed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly year-round</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Intervals vary by region, climate, and product type; consult your veterinarian for personalized schedules.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your pet monthly to maintain accurate dosing records, especially for young or growing animals whose weight changes frequently.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store antiparasitic medications in cool, dry conditions away from light, as many formulations degrade quickly when exposed to heat or humidity.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine parasite treatments strategically: monthly flea/tick prevention often includes heartworm prevention, reducing injection frequency.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track treatment dates in a calendar or app to prevent missed doses or accidental overdosing from multiple preventatives.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Outdated Weight Records</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Relying on weights from previous visits can lead to under- or overdosing; always use current weight measured within the same month.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Species-Specific Dosages</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cat dosages are often lower than dog dosages for the same medication; using canine doses on felines can cause toxicity.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Medication Concentration</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Different brands have different active ingredient concentrations; calculating based on the wrong percentage dramatically changes the required volume or tablets.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping the Second Dose for Internal Parasites</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Most internal parasite treatments require a second dose 2 weeks later to eliminate newly hatched parasites; one dose alone is often insufficient.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What parasites does this dose reference calculator cover?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator provides dosing guidance for common internal and external parasites including roundworms, hookworms, tapeworms, fleas, ticks, and mites in dogs and cats.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I determine my pet's weight for accurate dosing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Weigh your pet on a veterinary scale in pounds or kilograms; most antiparasitic medications require precise weight-based calculations, so accuracy is critical for safety and efficacy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for both dogs and cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, but dosages differ significantly between species. Always select your pet's species first, as feline and canine formulations have different concentrations and safe limits.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my pet's weight falls between two dosage tiers?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Always round up to the next weight category to ensure adequate parasite coverage; never round down, as underdosing reduces treatment effectiveness.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I repeat parasite treatments based on this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most internal parasite treatments require 2 doses given 2 weeks apart, while flea and tick preventatives are monthly or every 3 months depending on the product.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there drug interactions I should know about before using this reference?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Certain antiparasitics interact with heartworm medications and other drugs; always consult your veterinarian about current medications before administering treatment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if I accidentally overdose my pet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Contact your veterinarian or poison control immediately; overdoses can cause neurological signs, vomiting, or diarrhea depending on the medication type.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.avma.org/resources/pet-owners/petcare/parasites" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AVMA Pet Parasite Protocols</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official American Veterinary Medical Association guidelines for parasite prevention and treatment in companion animals.</p>
          </li>
          <li>
            <a href="https://capcvet.org/guidelines/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Companion Animal Parasite Council</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations for diagnosing and treating parasites in dogs and cats by veterinary specialists.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com/pharmacology/antiparasitic-agents" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Merck Veterinary Manual - Antiparasitic Drugs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive reference for antiparasitic medication mechanisms, dosages, and safety profiles for veterinary use.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care/animal-poison-control" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Poison Control - Common Pet Toxins</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Emergency resource for identifying and managing overdose or toxicity from antiparasitic medications in pets.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Parasite Treatment Dose Reference"
      description="Reference guide for common anti-parasitic medication dosages (e.g., for mites, fleas, or intestinal parasites)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Total Dose (mg) = Weight (kg) × Dose Rate (mg/kg)",
        variables: [
          { symbol: "Weight (kg)", description: "Animal's body weight in kilograms" },
          { symbol: "Dose Rate (mg/kg)", description: "Recommended medication dose per kilogram" },
          { symbol: "Total Dose (mg)", description: "Calculated total medication dose in milligrams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A small mammal weighs 4.4 lbs (2 kg) and requires a parasite treatment with a dose rate of 5 mg/kg.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight from pounds to kilograms if necessary. Here, 4.4 lbs equals 2 kg.",
          },
          {
            label: "2",
            explanation:
              "Multiply the weight (2 kg) by the dose rate (5 mg/kg) to find the total dose.",
          },
          {
            label: "3",
            explanation: "Calculate: 2 kg × 5 mg/kg = 10 mg total dose.",
          },
        ],
        result: "The animal should receive a total dose of 10 mg of the medication.",
      }}
      relatedCalculators={[
        {
          title: "Horse Electrolyte Need Estimator (Exercise & Heat)",
          url: "/pets/horse-electrolyte-need-estimator",
          icon: "🐎",
        },
        {
          title: "Cat Calorie Needs (RER/MER) Calculator",
          url: "/pets/cat-calorie-needs-rer-mer",
          icon: "🐱",
        },
        {
          title: "Protein/Fat Intake Guide for Cats (by Goal)",
          url: "/pets/cat-protein-fat-intake-guide",
          icon: "🐱",
        },
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🐶",
        },
        {
          title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs",
          url: "/pets/dog-benadryl-diphenhydramine-dose",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Parasite Treatment Dose Reference" },
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
