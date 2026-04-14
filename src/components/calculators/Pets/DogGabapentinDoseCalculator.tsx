import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { convertWeight, formatNumberForInput, weightToKg } from "@/lib/utils";

export default function DogGabapentinDoseCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    dosageMgPerKg: "10",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const dosageRaw = parseFloat(inputs.dosageMgPerKg);

    if (!weightRaw || weightRaw <= 0)
      return {
        value: 0,
        label: "Enter a valid dog weight to calculate dosage.",
        subtext: null,
        warning: null,
      };
    if (!dosageRaw || dosageRaw <= 0)
      return {
        value: 0,
        label: "Enter a valid dosage (mg/kg).",
        subtext: null,
        warning: null,
      };

    const weightKg = weightToKg(weightRaw, unit);

    // Gabapentin dose calculation:
    // Dose (mg) = weightKg * dosageMgPerKg
    const doseMg = weightKg * dosageRaw;

    // Typical gabapentin dosing range for dogs is 5-10 mg/kg every 8-12 hours.
    // Warn if dosage is outside typical range
    let warning = null;
    if (dosageRaw < 5) {
      warning =
        "Entered dosage is below the commonly recommended minimum of 5 mg/kg. Consult your veterinarian before administering.";
    } else if (dosageRaw > 20) {
      warning =
        "Entered dosage exceeds typical maximum recommendations (usually up to 20 mg/kg in special cases). Use caution and consult a veterinarian.";
    }

    // Format dose to 1 decimal place
    const doseFormatted = doseMg.toFixed(1);

    return {
      value: doseFormatted,
      label: `Gabapentin dose for your dog (${dosageRaw} mg/kg)`,
      subtext: `Based on a weight of ${weightKg.toFixed(
        2
      )} kg (${unit === "lb" ? weightRaw + " lbs" : weightRaw + " kg"})`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What is the typical gabapentin dosage range for dogs?",
      answer: "Most dogs receive 5-10 mg/kg every 8-12 hours, with some cases requiring up to 15 mg/kg three times daily. Always consult your veterinarian before adjusting doses.",
    },
    {
      question: "How does the calculator determine the correct dose for my dog's weight?",
      answer: "The calculator uses your dog's weight in pounds or kilograms and multiplies by the standard dosing range (5-10 mg/kg) to estimate appropriate daily doses. It then divides by frequency to show per-dose amounts.",
    },
    {
      question: "Can I use this calculator for puppies under 10 pounds?",
      answer: "Puppies may require adjusted dosing; this calculator works best for dogs over 5 pounds. Consult your vet for smaller or very young dogs, as their metabolism differs.",
    },
    {
      question: "Is gabapentin safe for long-term use in dogs?",
      answer: "Gabapentin is generally safe for chronic pain and nerve conditions with long-term use, though some dogs may experience drowsiness or loss of coordination. Regular veterinary monitoring is recommended.",
    },
    {
      question: "What factors affect gabapentin dosing besides weight?",
      answer: "Age, kidney function, other medications, and the condition being treated (pain vs. anxiety vs. seizures) all influence optimal dosing. Your vet will adjust doses based on individual response.",
    },
    {
      question: "How should I interpret the calculator results?",
      answer: "Results show estimated doses per administration and daily totals in milligrams. Use these as starting points only; your veterinarian has final authority on prescribed amounts.",
    },
    {
      question: "Can gabapentin be given with food?",
      answer: "Gabapentin can be given with or without food, though some dogs tolerate it better with meals. Consistent timing helps maintain steady medication levels.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
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

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={`Enter weight in ${unit === "lb" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-400 mt-1">
            Please enter your dog's current body weight.
          </p>
        </div>

        {/* Dosage Input */}
        <div>
          <Label
            htmlFor="dosageMgPerKg"
            className="text-slate-700 dark:text-slate-300"
          >
            Dosage (mg/kg)
          </Label>
          <Input
            id="dosageMgPerKg"
            name="dosageMgPerKg"
            type="text"
            inputMode="decimal"
            placeholder="Typical: 5 - 10 mg/kg"
            value={inputs.dosageMgPerKg}
            onChange={handleInputChange}
            aria-describedby="dosage-desc"
          />
          <p id="dosage-desc" className="text-xs text-slate-400 mt-1">
            Enter the prescribed gabapentin dosage in milligrams per kilogram.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via state update, no extra logic needed
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", dosageMgPerKg: "10" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult
              a veterinarian for diagnosis and personalized dosing.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Gabapentin Dose Calculator for Dogs</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates appropriate gabapentin doses based on your dog's weight and the standard dosing range of 5-10 mg/kg. It helps pet owners understand typical dosage ranges before consulting their veterinarian.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your dog's weight in pounds or kilograms and select the desired dosing frequency (every 8, 12, or 24 hours). The calculator automatically determines the dose range for each administration.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results display as milligram amounts per dose and daily totals. Remember these are estimates only—your veterinarian will prescribe the final dose based on your dog's age, health status, and condition being treated.</p>
        </div>
      </section>

      {/* TABLE: Gabapentin Dosing Guidelines for Dogs by Weight */}
      <section id="table-dosing-guidelines" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Gabapentin Dosing Guidelines for Dogs by Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard dosing recommendations based on dog weight and frequency of administration.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">5 mg/kg Dose (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">10 mg/kg Dose (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">57</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">113</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">114</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">227</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">170</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">341</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">227</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">454</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">284</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">568</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12 hours</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always follow veterinary dosing; this table provides reference ranges only.</p>
      </section>

      {/* TABLE: Gabapentin Dosing by Condition in Dogs */}
      <section id="table-conditions-dosing" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Gabapentin Dosing by Condition in Dogs</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different conditions may require adjusted dosing ranges within veterinary guidelines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Dose Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chronic Pain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3x daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Long-term</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Nerve Pain (Neuropathy)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3x daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Long-term</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Anxiety/Stress</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3x daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">As needed</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Post-Surgical Pain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3x daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-14 days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Seizure Management</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-15 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3x daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Long-term</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Osteoarthritis</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3x daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Long-term</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Dosing varies; veterinarian assessment determines best protocol for each dog.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always give gabapentin exactly as prescribed; don't adjust doses without veterinary approval, even if your dog seems improvement.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your dog's response to gabapentin by noting any reduction in pain, anxiety, or seizure frequency to share with your vet.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Set phone reminders for consistent dosing times, as maintaining steady medication levels improves effectiveness for chronic conditions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store gabapentin in a cool, dry place away from pets' reach, and keep precise records of administration for your veterinarian.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using human dosage calculators for dogs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Human gabapentin dosing differs significantly; always use canine-specific guidelines or this calculator to avoid overdosing or underdosing your pet.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming weight-based calculations equal final prescription</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">This calculator provides estimates; kidney function, age, and drug interactions require veterinary assessment for safe dosing.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Stopping gabapentin abruptly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Suddenly discontinuing gabapentin, especially for seizure management, can cause rebound effects; always taper under veterinary supervision.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking drug interactions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Gabapentin interacts with certain medications; inform your vet of all supplements and drugs your dog takes before starting treatment.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the typical gabapentin dosage range for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most dogs receive 5-10 mg/kg every 8-12 hours, with some cases requiring up to 15 mg/kg three times daily. Always consult your veterinarian before adjusting doses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator determine the correct dose for my dog's weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses your dog's weight in pounds or kilograms and multiplies by the standard dosing range (5-10 mg/kg) to estimate appropriate daily doses. It then divides by frequency to show per-dose amounts.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for puppies under 10 pounds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Puppies may require adjusted dosing; this calculator works best for dogs over 5 pounds. Consult your vet for smaller or very young dogs, as their metabolism differs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is gabapentin safe for long-term use in dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gabapentin is generally safe for chronic pain and nerve conditions with long-term use, though some dogs may experience drowsiness or loss of coordination. Regular veterinary monitoring is recommended.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect gabapentin dosing besides weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Age, kidney function, other medications, and the condition being treated (pain vs. anxiety vs. seizures) all influence optimal dosing. Your vet will adjust doses based on individual response.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I interpret the calculator results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Results show estimated doses per administration and daily totals in milligrams. Use these as starting points only; your veterinarian has final authority on prescribed amounts.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can gabapentin be given with food?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gabapentin can be given with or without food, though some dogs tolerate it better with meals. Consistent timing helps maintain steady medication levels.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.vcahospitals.com/know-your-pet/gabapentin-for-dogs" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Gabapentin for Dogs: Uses, Side Effects, Dosage</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">VCA Animal Hospital's comprehensive guide on gabapentin use, dosing, and side effects in canine patients.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com/pharmacology/analgesics/gabapentin" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Gabapentin in Veterinary Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Merck Veterinary Manual's clinical information on gabapentin pharmacology and canine dosing protocols.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners/petcare/pain-management-dogs" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Chronic Pain Management in Dogs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Veterinary Medical Association's resource on pain management strategies including gabapentin therapy.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5427625/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Clinical Use of Gabapentin in Dogs and Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">PubMed research article detailing clinical applications and dosing recommendations for canine gabapentin therapy.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Gabapentin Dose Calculator for Dogs"
      description="Calculate the proper dosage for the nerve pain and anxiety medication **Gabapentin** in dogs by weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg) = Weight (kg) × Dosage (mg/kg)",
        variables: [
          {
            symbol: "Weight (kg)",
            description: "Dog's body weight in kilograms",
          },
          {
            symbol: "Dosage (mg/kg)",
            description:
              "Prescribed gabapentin dosage in milligrams per kilogram of body weight",
          },
          {
            symbol: "Dose (mg)",
            description: "Calculated gabapentin dose in milligrams",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30-pound dog is prescribed gabapentin at 10 mg/kg to manage nerve pain.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert the dog's weight from pounds to kilograms: 30 lbs ÷ 2.20462 = 13.61 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Multiply the weight in kg by the dosage: 13.61 kg × 10 mg/kg = 136.1 mg.",
          },
        ],
        result:
          "The calculated gabapentin dose for this dog is approximately 136 mg per administration.",
      }}
      relatedCalculators={[
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
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "💉",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Gabapentin Dose Calculator for Dogs" },
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
