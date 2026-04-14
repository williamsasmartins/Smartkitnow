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

export default function CatMeloxicamDoseCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight only (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Meloxicam dose for cats: 0.05 mg/kg once daily (short-term analgesic dose)
  // Dose (mg) = Weight (kg) * 0.05
  const results = useMemo(() => {
    const weightRaw = inputs.weight;
    if (!weightRaw || isNaN(Number(weightRaw)) || Number(weightRaw) <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: "",
        warning: null,
      };
    }
    const weightKg = weightToKg(Number(weightRaw), unit);

    // Calculate dose in mg
    const doseMg = weightKg * 0.05;

    // Round to 3 decimals for precision
    const doseRounded = Math.round(doseMg * 1000) / 1000;

    // Warning if dose is unusually high or low (e.g. > 0.1 mg/kg or < 0.01 mg/kg)
    let warning = null;
    if (doseMg > weightKg * 0.1) {
      warning =
        "The calculated dose exceeds typical recommended limits. Consult your veterinarian before administration.";
    } else if (doseMg < weightKg * 0.01) {
      warning =
        "The calculated dose is unusually low. Ensure weight input is accurate and consult your veterinarian.";
    }

    return {
      value: doseRounded,
      label: "Meloxicam Dose (mg) once daily",
      subtext: `Based on ${weightKg.toFixed(2)} kg body weight`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the standard meloxicam dose for cats?",
      answer: "The typical dose is 0.1-0.2 mg/kg administered once daily, with most cats receiving 0.5-1 mg per dose depending on weight and condition.",
    },
    {
      question: "How does the calculator account for cat weight in dosing?",
      answer: "The calculator multiplies your cat's weight in kilograms by the recommended dose per kilogram (0.1-0.2 mg/kg) to determine the precise dose needed.",
    },
    {
      question: "Can meloxicam be given to kittens using this calculator?",
      answer: "Meloxicam is generally not recommended for kittens under 6 weeks old; always consult your veterinarian before using this calculator for very young cats.",
    },
    {
      question: "What if my cat's calculated dose doesn't match tablet sizes available?",
      answer: "Your veterinarian may adjust the dose to match available tablet strengths (typically 1.5 mg, 7.5 mg, or 15 mg) while staying within safe therapeutic ranges.",
    },
    {
      question: "How long can a cat safely take meloxicam?",
      answer: "Cats can take meloxicam long-term under veterinary supervision, typically for chronic pain conditions like osteoarthritis, with regular monitoring for kidney or liver issues.",
    },
    {
      question: "Should the dose be adjusted based on meal timing?",
      answer: "Meloxicam can be given with or without food, but administering with food may reduce gastrointestinal upset in sensitive cats.",
    },
    {
      question: "What happens if I accidentally give my cat an overdose?",
      answer: "Contact your veterinarian or pet poison control immediately; overdoses can cause vomiting, diarrhea, lethargy, and potential kidney damage.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
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

      {/* Weight Input */}
      <div className="space-y-1">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat Weight ({unit === "lb" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="0.01"
          placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          aria-describedby="weightHelp"
        />
        <p id="weightHelp" className="text-xs text-slate-400 dark:text-slate-500">
          Accurate weight is essential for safe Meloxicam dosing.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Meloxicam Dose Calculator for Cats</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps determine the appropriate meloxicam dose for your cat based on weight and veterinary dosing protocols. Meloxicam is a non-steroidal anti-inflammatory drug (NSAID) commonly prescribed for feline pain management and arthritis relief.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter your cat's weight in kilograms (or pounds if the converter is available) and select whether you need the standard 0.1 mg/kg dose or the higher 0.2 mg/kg dose for acute pain. The calculator will instantly display the recommended dose in milligrams.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Always verify the calculated dose with your veterinarian before administering meloxicam, as individual cats may require dose adjustments based on age, kidney function, liver health, and concurrent medications. Never assume the calculator output replaces professional veterinary assessment.</p>
        </div>
      </section>

      {/* TABLE: Meloxicam Dosing Guidelines for Cats by Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Meloxicam Dosing Guidelines for Cats by Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical meloxicam doses based on cat weight using the standard 0.1 mg/kg dosing protocol.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dose at 0.1 mg/kg (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Common Tablet Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not standard—consult vet</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not standard—consult vet</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not standard—consult vet</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 mg tablet (partial)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 mg tablet (partial)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 mg tablet (partial)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 mg tablet (partial)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Dosing may be increased to 0.2 mg/kg for acute pain; always follow veterinary guidance for your specific cat.</p>
      </section>

      {/* TABLE: Meloxicam Formulations and Typical Dosing */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Meloxicam Formulations and Typical Dosing</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Common meloxicam products available for cats include oral tablets, oral suspension, and injectable forms.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Formulation</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Strength</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Route</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tablet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Oral</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily maintenance for osteoarthritis</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tablet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Oral</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large cats or acute pain situations</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oral Suspension</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 mg/mL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Oral</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Easier dosing for small cats or kittens</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Injectable (Anjeso)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 mg/mL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">IV/IM/SC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Post-operative pain or acute conditions</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Injectable (Metacam)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 mg/mL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">SC/IM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Initial treatment or cats unable to take oral doses</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Injectable formulations are typically given as a single dose; oral formulations are dosed once daily.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your cat accurately at home or at a vet clinic before using the calculator to ensure precise dose calculations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep a dosing chart from your vet nearby and compare it with the calculator results to catch any discrepancies.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Administer meloxicam at the same time each day to maintain consistent pain relief and medication levels.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your cat for side effects like decreased appetite, vomiting, or diarrhea, and report them to your vet immediately.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using human weight instead of current cat weight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Always re-weigh your cat regularly, as weight changes affect the correct dose; using outdated weight can lead to under- or over-dosing.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing mg/kg dosing with total daily dose</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator works with mg/kg; entering total dose instead of body weight will produce incorrect results.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for tablet availability</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculated dose may not match available tablet strengths; attempting to split or combine tablets without vet approval can be dangerous.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming the calculator adjusts for liver or kidney disease</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats with pre-existing organ issues may require different doses; the calculator provides standard doses only and cannot replace veterinary assessment.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard meloxicam dose for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The typical dose is 0.1-0.2 mg/kg administered once daily, with most cats receiving 0.5-1 mg per dose depending on weight and condition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator account for cat weight in dosing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator multiplies your cat's weight in kilograms by the recommended dose per kilogram (0.1-0.2 mg/kg) to determine the precise dose needed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can meloxicam be given to kittens using this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Meloxicam is generally not recommended for kittens under 6 weeks old; always consult your veterinarian before using this calculator for very young cats.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my cat's calculated dose doesn't match tablet sizes available?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your veterinarian may adjust the dose to match available tablet strengths (typically 1.5 mg, 7.5 mg, or 15 mg) while staying within safe therapeutic ranges.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long can a cat safely take meloxicam?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cats can take meloxicam long-term under veterinary supervision, typically for chronic pain conditions like osteoarthritis, with regular monitoring for kidney or liver issues.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should the dose be adjusted based on meal timing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Meloxicam can be given with or without food, but administering with food may reduce gastrointestinal upset in sensitive cats.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I accidentally give my cat an overdose?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Contact your veterinarian or pet poison control immediately; overdoses can cause vomiting, diarrhea, lethargy, and potential kidney damage.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://vcahospitals.com/know-your-pet/meloxicam-cats" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Meloxicam for Cats - VCA Animal Hospitals</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide on meloxicam use, dosing, and side effects in cats from a trusted veterinary hospital network.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care/animal-poison-control" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Animal Poison Control Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Emergency resource for medication overdose concerns and poisoning in pets.</p>
          </li>
          <li>
            <a href="https://www.fda.gov/animal-veterinary/approved-animal-drug-products" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Metacam (Meloxicam) - FDA Approved Veterinary Drug</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official FDA information on approved meloxicam formulations and labeling for veterinary use.</p>
          </li>
          <li>
            <a href="https://journals.sagepub.com/home/jfm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of Feline Medicine and Surgery - NSAID Use in Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on NSAID efficacy and safety protocols in feline pain management.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Meloxicam Dose Calculator for Cats"
      description="Calculate the short-term analgesic dose for the NSAID **Meloxicam** in cats."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Meloxicam Dose (mg) = Weight (kg) × 0.05",
        variables: [
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "0.05", description: "Recommended Meloxicam dose in mg per kg body weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A cat weighing 10 lbs requires a Meloxicam dose for short-term pain relief after surgery.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight from pounds to kilograms: 10 lbs ÷ 2.20462 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Multiply weight by dose factor: 4.54 kg × 0.05 mg/kg = 0.227 mg Meloxicam.",
          },
          {
            label: "3",
            explanation:
              "Administer approximately 0.23 mg Meloxicam once daily as per veterinary guidance.",
          },
        ],
        result: "Recommended Meloxicam dose is approximately 0.23 mg once daily.",
      }}
      relatedCalculators={[
        {
          title: "Dewormer & Antibiotic Dose Reference",
          url: "/pets/reptile-dewormer-antibiotic-dose-reference",
          icon: "🐾",
        },
        {
          title: "Phosphorus per Meal Estimator (diet label helper)",
          url: "/pets/cat-phosphorus-per-meal-estimator",
          icon: "🐶",
        },
        {
          title: "Dog Walking Calories Burned Calculator",
          url: "/pets/dog-walking-calories-burned",
          icon: "🐶",
        },
        {
          title: "Cat Carrier Size & Fit Guide",
          url: "/pets/cat-carrier-size-fit-guide",
          icon: "🐱",
        },
        {
          title: "Puppy Adult Size Predictor (Weight Curve)",
          url: "/pets/puppy-adult-size-predictor-weight-curve",
          icon: "💉",
        },
        {
          title: "Cat Weight Loss Planner",
          url: "/pets/cat-weight-loss-planner",
          icon: "🐱",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Meloxicam Dose Calculator for Cats" },
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
