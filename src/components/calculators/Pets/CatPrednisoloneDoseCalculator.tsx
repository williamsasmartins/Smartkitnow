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

export default function CatPrednisoloneDoseCalculator() {
  // 1. STATE
  // Unit system needed for weight input (imperial or metric)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight only, as dose is mg/kg
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Prednisolone dose range for cats: 0.5 to 2 mg/kg/day depending on indication
  // We'll calculate dose at 1 mg/kg/day as a standard reference dose.
  // User inputs weight, dose = weightKg * 1 mg

  const results = useMemo(() => {
    const weightRaw = inputs.weight;
    if (!weightRaw) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }
    const weightNum = parseFloat(weightRaw);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive number for weight.",
      };
    }

    // Convert weight to kg if imperial
    const weightKg = weightToKg(weightNum, unit);

    // Calculate dose at 1 mg/kg/day
    const doseMg = weightKg * 1;

    // Round to 2 decimals
    const doseRounded = Math.round(doseMg * 100) / 100;

    // Warning if weight is outside typical range (e.g. <1kg or >10kg)
    let warning = null;
    if (weightKg < 1) {
      warning =
        "Weight entered is very low for an average adult cat. Please verify the weight or consult your veterinarian.";
    } else if (weightKg > 10) {
      warning =
        "Weight entered is unusually high for a typical cat. Please verify the weight or consult your veterinarian.";
    }

    return {
      value: doseRounded,
      label: "Prednisolone Dose (mg/day)",
      subtext:
        "Calculated at 1 mg/kg/day. Actual dose may vary based on condition and vet prescription.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the typical starting dose of prednisolone for cats?",
      answer: "The typical starting dose ranges from 0.5 to 1 mg/kg twice daily, depending on the condition being treated. Your veterinarian will adjust based on your cat's specific diagnosis and response.",
    },
    {
      question: "How does cat weight affect prednisolone dosing?",
      answer: "Prednisolone dosing is weight-based, typically calculated as mg/kg. A 5 kg cat requires half the dose of a 10 kg cat at the same mg/kg rate.",
    },
    {
      question: "Can I use this calculator for kittens?",
      answer: "This calculator works for kittens, but prednisolone dosing in young cats may differ. Always consult your veterinarian before treating kittens with corticosteroids.",
    },
    {
      question: "What conditions require prednisolone in cats?",
      answer: "Common conditions include allergies, asthma, immune-mediated diseases, and inflammatory bowel disease. Dosing varies significantly based on the specific condition.",
    },
    {
      question: "How long can cats safely take prednisolone?",
      answer: "Short-term use (1-2 weeks) is generally safe, but prolonged use requires monitoring for side effects like increased thirst and weight gain. Your vet will recommend tapering schedules for longer treatments.",
    },
    {
      question: "What is the maximum safe dose of prednisolone for cats?",
      answer: "Maximum doses typically do not exceed 2-4 mg/kg daily for most conditions, though emergency situations may require higher doses temporarily.",
    },
    {
      question: "Should prednisolone be given with food?",
      answer: "Prednisolone can be given with or without food, but administering with a meal may reduce gastrointestinal upset in sensitive cats.",
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
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat Weight ({unit === "lb" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="0.01"
          placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
          value={inputs.weight || ""}
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          aria-describedby="weightHelp"
        />
        <p id="weightHelp" className="text-xs text-slate-500 dark:text-slate-400">
          Accurate weight is essential for correct dosing.
        </p>
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Prednisolone Dose Calculator for Cats</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps determine appropriate prednisolone doses for cats based on weight and condition. It provides quick reference dosing to support veterinary decision-making and medication administration.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your cat's weight in kilograms and select the condition or desired mg/kg dosing rate. The calculator instantly displays the recommended dose and frequency for reference.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results are estimates only and must be verified by your veterinarian. Always follow your vet's prescribed dosing schedule and tapering instructions, as individual cats may require adjustments based on response and side effects.</p>
        </div>
      </section>

      {/* TABLE: Prednisolone Dosing Guidelines for Common Feline Conditions */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Prednisolone Dosing Guidelines for Common Feline Conditions</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard dosing ranges for prednisolone in cats by condition type.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Initial Dose (mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Allergic dermatitis</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5–1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–4 weeks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Asthma/airway disease</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–8 weeks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Immune-mediated hemolytic anemia</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6–12 weeks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Inflammatory bowel disease</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5–1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4–12 weeks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Anaphylaxis (emergency)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once or twice daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–7 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lymphoma (palliative)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5–1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once or twice daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ongoing</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Doses must be individualized by your veterinarian based on your cat's specific condition and response. Always follow prescribed tapering schedules.</p>
      </section>

      {/* TABLE: Prednisolone Dosing by Cat Weight */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Prednisolone Dosing by Cat Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Quick reference for approximate doses at common mg/kg rates.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">0.5 mg/kg</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">1 mg/kg</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2 mg/kg</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.5 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.25 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 mg</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 mg</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7.5 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.75 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15 mg</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 mg</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12.5 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.25 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.5 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 mg</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are approximate doses for reference only. Your veterinarian will determine the precise dose for your individual cat.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always weigh your cat accurately before calculating doses, as even small weight variations significantly affect the calculated amount.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Set reminders for prednisolone administration times, especially for twice-daily dosing, to maintain consistent therapeutic levels.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your cat for side effects like increased thirst, appetite changes, and lethargy, and report them to your veterinarian immediately.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Never stop prednisolone abruptly after long-term use; your vet must provide a tapering schedule to prevent adrenal insufficiency.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using human prednisolone formulations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Feline prednisolone products have different concentrations and fillers; always use veterinary-approved formulations to ensure accurate dosing.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring tapering schedules</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Abruptly stopping prednisolone after weeks of treatment can cause serious complications; follow your vet's gradual dose reduction plan.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Rounding doses incorrectly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Small rounding errors compound over time; use precise calculations or tablets that match your cat's exact prescribed dose.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all cats respond identically</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Individual cats have different sensitivities and responses; calculator results are guidelines, not final prescriptions.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the typical starting dose of prednisolone for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The typical starting dose ranges from 0.5 to 1 mg/kg twice daily, depending on the condition being treated. Your veterinarian will adjust based on your cat's specific diagnosis and response.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does cat weight affect prednisolone dosing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Prednisolone dosing is weight-based, typically calculated as mg/kg. A 5 kg cat requires half the dose of a 10 kg cat at the same mg/kg rate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for kittens?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator works for kittens, but prednisolone dosing in young cats may differ. Always consult your veterinarian before treating kittens with corticosteroids.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What conditions require prednisolone in cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common conditions include allergies, asthma, immune-mediated diseases, and inflammatory bowel disease. Dosing varies significantly based on the specific condition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long can cats safely take prednisolone?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Short-term use (1-2 weeks) is generally safe, but prolonged use requires monitoring for side effects like increased thirst and weight gain. Your vet will recommend tapering schedules for longer treatments.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the maximum safe dose of prednisolone for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Maximum doses typically do not exceed 2-4 mg/kg daily for most conditions, though emergency situations may require higher doses temporarily.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should prednisolone be given with food?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Prednisolone can be given with or without food, but administering with a meal may reduce gastrointestinal upset in sensitive cats.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.elsevier.com/books/feline-medicine/ettinger/978-0-323-59656-7" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Feline Medicine: Diagnosis and Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive veterinary reference covering prednisolone use in cats and corticosteroid pharmacology.</p>
          </li>
          <li>
            <a href="https://www.aaha.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Animal Hospital Association (AAHA) Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based clinical guidelines for feline medication dosing and corticosteroid management.</p>
          </li>
          <li>
            <a href="https://www.isfm.net" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Society of Feline Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative resource for feline-specific medical information and treatment protocols.</p>
          </li>
          <li>
            <a href="https://www.wiley.com/en-us/Veterinary+Pharmacology+and+Therapeutics" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Pharmacology and Therapeutics Textbook</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed reference on prednisolone pharmacokinetics, metabolism, and dosing considerations in cats.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Prednisolone Dose Calculator for Cats"
      description="Calculate the correct dosage for the anti-inflammatory steroid **Prednisolone** in cats."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Prednisolone Dose (mg) = Weight (kg) × 1 mg/kg",
        variables: [
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "1 mg/kg", description: "Standard prednisolone dose per kilogram" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10-pound (4.54 kg) cat requires prednisolone treatment for inflammation. The veterinarian prescribes 1 mg/kg/day.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed: 10 lbs ÷ 2.20462 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Multiply weight by dose: 4.54 kg × 1 mg/kg = 4.54 mg prednisolone per day.",
          },
        ],
        result: "The cat’s daily prednisolone dose is approximately 4.5 mg.",
      }}
      relatedCalculators={[
        { title: "Parasite Treatment Dose Reference", url: "/pets/small-mammal-parasite-treatment-dose-reference", icon: "🐾" },
        { title: "Cat Carrier Size & Fit Guide", url: "/pets/cat-carrier-size-fit-guide", icon: "🐱" },
        { title: "Dog Step-Goal & Activity Time Planner", url: "/pets/dog-step-goal-activity-time-planner", icon: "🐶" },
        { title: "Heat Risk/Walk Safety Window (Temp & Humidity)", url: "/pets/dog-heat-risk-walk-safety-window", icon: "🍖" },
        { title: "Cat Calorie Needs (RER/MER) Calculator", url: "/pets/cat-calorie-needs-rer-mer", icon: "🐱" },
        { title: "Dog Harness Size & Fit Guide", url: "/pets/dog-harness-size-fit-guide", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Prednisolone Dose Calculator for Cats" },
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
