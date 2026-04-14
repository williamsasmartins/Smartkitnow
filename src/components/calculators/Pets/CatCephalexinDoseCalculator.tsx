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

export default function CatCephalexinDoseCalculator() {
  // 1. STATE
  // Unit system needed for weight input (lbs or kg)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight only (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Cephalexin dose for cats: 15-30 mg/kg/day divided q8-12h (commonly 20 mg/kg q12h)
  // We'll calculate total daily dose and per administration dose assuming q12h dosing.
  // Formula: Dose (mg per administration) = 20 mg/kg × weight (kg) / 2 doses per day

  const results = useMemo(() => {
    const weightRaw = inputs.weight;
    if (!weightRaw) {
      return {
        value: 0,
        label: "Please enter weight",
        subtext: "",
        warning: null,
      };
    }
    const weightNum = parseFloat(weightRaw);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "Invalid weight input",
        subtext: "",
        warning: null,
      };
    }
    const weightKg = weightToKg(weightNum, unit);

    // Calculate dose per administration (20 mg/kg q12h)
    const doseMgPerAdmin = 20 * weightKg;

    // Round to 1 decimal place
    const doseRounded = Math.round(doseMgPerAdmin * 10) / 10;

    // Warning if weight is outside typical cat range (2-10 kg)
    let warning = null;
    if (weightKg < 2) {
      warning =
        "Weight is below typical cat range; dose should be confirmed by a veterinarian.";
    } else if (weightKg > 10) {
      warning =
        "Weight is above typical cat range; dose should be confirmed by a veterinarian.";
    }

    return {
      value: doseRounded,
      label: "Cephalexin dose per administration (mg)",
      subtext: "Assuming 20 mg/kg every 12 hours",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the standard cephalexin dosage for cats?",
      answer: "The typical dose is 15-30 mg/kg every 6-8 hours, or 22-35 mg/kg every 12 hours, depending on the infection severity and your veterinarian's recommendations.",
    },
    {
      question: "How do I calculate my cat's cephalexin dose using this calculator?",
      answer: "Enter your cat's weight in pounds or kilograms, select the dosing frequency, and the calculator automatically computes the appropriate dose range based on standard feline dosing guidelines.",
    },
    {
      question: "Is cephalexin safe for all cats?",
      answer: "Cephalexin is generally safe for cats, but it should be avoided in cats with penicillin allergies or severe kidney disease; always consult your veterinarian first.",
    },
    {
      question: "Can I give cephalexin to a kitten?",
      answer: "Yes, kittens can receive cephalexin at the same mg/kg dosing as adult cats, though your veterinarian will determine the appropriate dose based on age and health status.",
    },
    {
      question: "What infections does cephalexin treat in cats?",
      answer: "Cephalexin treats bacterial infections including skin and soft tissue infections, urinary tract infections, and respiratory infections caused by susceptible gram-positive and some gram-negative bacteria.",
    },
    {
      question: "How long does a typical cephalexin treatment last for cats?",
      answer: "Most feline cephalexin treatments last 7-14 days depending on the infection type; always complete the full course as prescribed by your veterinarian.",
    },
    {
      question: "What should I do if I miss a dose of cephalexin for my cat?",
      answer: "Give the missed dose as soon as possible unless it's nearly time for the next dose; never double-dose to make up for a missed administration.",
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
          Cat's Body Weight ({unit === "lb" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
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
            // No special action needed, calculation is reactive
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cephalexin Dose Calculator for Cats</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator computes accurate cephalexin dosages for feline patients based on current veterinary pharmacology standards. It helps veterinarians and cat owners ensure proper antibiotic dosing for bacterial infections.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your cat's body weight in either pounds or kilograms, then select the recommended dosing interval (typically 6-8 hours or 12 hours). The calculator also allows you to specify the dosage range—standard protocols use 15-30 mg/kg.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The result displays the dose in milligrams per administration along with the total daily dose. Always verify the calculated dose with your veterinarian before giving cephalexin, as individual cats may require adjustments based on kidney function, age, and infection severity.</p>
        </div>
      </section>

      {/* TABLE: Cephalexin Dosage Chart for Cats by Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Cephalexin Dosage Chart for Cats by Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This chart shows approximate cephalexin doses for cats based on body weight using standard veterinary guidelines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Low Dose (15 mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Dose (30 mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">37.5 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">13.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">105 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">210 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">17.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 12 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">19.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">135 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">270 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 12 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 12 hours</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Doses are approximate; your veterinarian may adjust based on infection type, kidney function, and clinical response.</p>
      </section>

      {/* TABLE: Cephalexin Formulations and Concentrations Available */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Cephalexin Formulations and Concentrations Available</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Common cephalexin formulations used in feline medicine with their typical strengths.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Formulation</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Strengths</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Common Use in Cats</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Administration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Capsules</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250 mg, 500 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Oral dosing for older cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">By mouth with or without food</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Powder for Suspension</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125 mg/5 mL, 250 mg/5 mL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Easy dosing for kittens and small cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Measured with syringe orally</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tablets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250 mg, 500 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Convenient dosing form</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Crushed in food or given whole</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Liquid Suspension</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125 mg/5 mL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Preferred for young or sick cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Measured dose given orally</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Suspension formulations are often preferred for cats as they allow precise weight-based dosing and easier administration.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Give cephalexin with or without food, but consistent timing with meals can help reduce nausea in sensitive cats.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a pharmacy compounding service to create flavored liquid versions if your cat refuses capsules or tablets.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Complete the entire prescribed course even if your cat improves, as stopping early risks antibiotic resistance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store cephalexin suspension in the refrigerator and shake well before each dose to ensure uniform concentration.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using human dosing guidelines</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats metabolize medications differently than humans; always use feline-specific dosing calculations, not extrapolated human doses.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring kidney function</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats with renal disease may require lower doses or longer intervals; your veterinarian must assess kidney values before dosing.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Rounding doses imprecisely</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Always round to the nearest practical dose (usually to the nearest 5-10 mg) to match available formulations and maintain accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for concurrent medications</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some drugs interact with cephalexin; inform your veterinarian of all supplements and medications your cat receives.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard cephalexin dosage for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The typical dose is 15-30 mg/kg every 6-8 hours, or 22-35 mg/kg every 12 hours, depending on the infection severity and your veterinarian's recommendations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my cat's cephalexin dose using this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your cat's weight in pounds or kilograms, select the dosing frequency, and the calculator automatically computes the appropriate dose range based on standard feline dosing guidelines.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is cephalexin safe for all cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cephalexin is generally safe for cats, but it should be avoided in cats with penicillin allergies or severe kidney disease; always consult your veterinarian first.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I give cephalexin to a kitten?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, kittens can receive cephalexin at the same mg/kg dosing as adult cats, though your veterinarian will determine the appropriate dose based on age and health status.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What infections does cephalexin treat in cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cephalexin treats bacterial infections including skin and soft tissue infections, urinary tract infections, and respiratory infections caused by susceptible gram-positive and some gram-negative bacteria.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does a typical cephalexin treatment last for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most feline cephalexin treatments last 7-14 days depending on the infection type; always complete the full course as prescribed by your veterinarian.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if I miss a dose of cephalexin for my cat?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Give the missed dose as soon as possible unless it's nearly time for the next dose; never double-dose to make up for a missed administration.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.vin.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network (VIN) - Cephalexin in Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional veterinary pharmacology resource covering cephalexin dosing, interactions, and clinical use in feline patients.</p>
          </li>
          <li>
            <a href="https://www.catfriendly.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFP (American Association of Feline Practitioners) - Antimicrobial Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative feline-specific antimicrobial dosing and treatment recommendations from board-certified feline specialists.</p>
          </li>
          <li>
            <a href="https://www.plumbsveterinarydrugs.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Plumb's Veterinary Drug Handbook - Cephalexin</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive reference for cephalexin dosages, indications, and contraindications in veterinary medicine.</p>
          </li>
          <li>
            <a href="https://www.avma.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AVMA (American Veterinary Medical Association) - Antibiotic Stewardship</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Guidelines on appropriate antibiotic use and resistance prevention in companion animal practice.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cephalexin Dose Calculator for Cats"
      description="Calculate the veterinarian-recommended dosage for the antibiotic **Cephalexin** in cats based on body weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg per administration) = 20 mg/kg × Weight (kg)",
        variables: [
          { symbol: "Dose", description: "Cephalexin dose per administration in milligrams" },
          { symbol: "Weight", description: "Cat's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10-pound (4.54 kg) cat requires Cephalexin treatment for a skin infection. The veterinarian prescribes 20 mg/kg every 12 hours.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed: 10 lbs ÷ 2.20462 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate dose per administration: 20 mg × 4.54 kg = 90.8 mg per dose.",
          },
          {
            label: "3",
            explanation:
              "Administer approximately 90.8 mg of Cephalexin every 12 hours as prescribed.",
          },
        ],
        result: "The cat should receive about 90.8 mg of Cephalexin twice daily.",
      }}
      relatedCalculators={[
        {
          title: "Growth Curve by Species (Python, Bearded Dragon, Gecko)",
          url: "/pets/reptile-growth-curve-python-bearded-dragon-gecko",
          icon: "🐾",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Dog Grape/Raisin Exposure Risk Calculator",
          url: "/pets/dog-grape-raisin-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Heat Risk/Walk Safety Window (Temp & Humidity)",
          url: "/pets/dog-heat-risk-walk-safety-window",
          icon: "🍖",
        },
        {
          title: "Dehydration Risk Estimator (Weight & Symptoms Aware)",
          url: "/pets/dog-dehydration-risk-estimator",
          icon: "💉",
        },
        {
          title: "Kitten Calorie Needs by Age/Size",
          url: "/pets/kitten-calorie-needs-age-size",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cephalexin Dose Calculator for Cats" },
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
