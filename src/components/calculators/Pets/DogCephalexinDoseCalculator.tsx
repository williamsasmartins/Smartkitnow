import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Syringe } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { convertWeight, formatNumberForInput, weightToKg } from "@/lib/utils";

export default function DogCephalexinDoseCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    dosageMgPerKg: "20", // default dosage mg/kg/day (typical range 20-30 mg/kg/day)
    frequencyPerDay: "2", // default frequency (BID)
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const dosageMgPerKg = parseFloat(inputs.dosageMgPerKg);
    const frequencyPerDay = parseInt(inputs.frequencyPerDay);

    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "Enter valid dog weight",
        subtext: null,
        warning: null,
      };
    }
    if (!dosageMgPerKg || dosageMgPerKg <= 0) {
      return {
        value: 0,
        label: "Enter valid dosage (mg/kg/day)",
        subtext: null,
        warning: null,
      };
    }
    if (!frequencyPerDay || frequencyPerDay <= 0) {
      return {
        value: 0,
        label: "Enter valid frequency per day",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = weightToKg(weightRaw, unit);

    // Total daily dose in mg = weightKg * dosageMgPerKg
    const totalDailyDoseMg = weightKg * dosageMgPerKg;

    // Dose per administration = totalDailyDoseMg / frequencyPerDay
    const dosePerAdminMg = totalDailyDoseMg / frequencyPerDay;

    // Round to 2 decimals
    const dosePerAdminMgRounded = Math.round(dosePerAdminMg * 100) / 100;

    // Warning if dosage outside typical range (20-30 mg/kg/day)
    let warning = null;
    if (dosageMgPerKg < 20) {
      warning =
        "Dosage is below the commonly recommended range (20-30 mg/kg/day). Consult your veterinarian before proceeding.";
    } else if (dosageMgPerKg > 30) {
      warning =
        "Dosage exceeds the commonly recommended range (20-30 mg/kg/day). High doses may increase risk of side effects.";
    }

    return {
      value: dosePerAdminMgRounded,
      label: `Dose per administration (mg) given ${frequencyPerDay} times daily`,
      subtext: `Total daily dose: ${Math.round(totalDailyDoseMg * 100) / 100} mg`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What is the standard cephalexin dosage for dogs?",
      answer: "The typical dose is 10-15 mg/kg every 6-8 hours, or 22-35 mg/kg once daily. Always follow your veterinarian's specific prescription for your dog.",
    },
    {
      question: "How does the calculator account for my dog's weight?",
      answer: "The calculator uses your dog's weight in pounds or kilograms to compute the precise milligram dose based on recommended mg/kg dosing guidelines for canine infections.",
    },
    {
      question: "Can I use this calculator instead of consulting my vet?",
      answer: "No, this calculator is educational only and should never replace veterinary advice; always consult your veterinarian before administering any medication to your dog.",
    },
    {
      question: "What infections does cephalexin treat in dogs?",
      answer: "Cephalexin treats bacterial skin infections, ear infections, urinary tract infections, and soft tissue infections in dogs caused by susceptible bacteria.",
    },
    {
      question: "Are there dogs that shouldn't take cephalexin?",
      answer: "Dogs with penicillin or cephalosporin allergies should not receive cephalexin; inform your vet of any drug allergies before treatment begins.",
    },
    {
      question: "How long does a typical cephalexin course last for dogs?",
      answer: "Treatment typically lasts 7-14 days depending on the infection type and severity; complete the full course even if symptoms improve earlier.",
    },
    {
      question: "What should I do if I miss a dose?",
      answer: "Give the missed dose as soon as you remember, but skip it if the next dose is due within 2-3 hours; never double-dose to make up for a missed one.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  function handleFrequencyChange(value: string) {
    setInputs((prev) => ({ ...prev, frequencyPerDay: value }));
  }

  // Widget JSX
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
              setInputs((prev) => {
                const weightRaw = parseFloat(prev.weight);
                if (!Number.isFinite(weightRaw) || weightRaw <= 0) return prev;
                const nextWeight = convertWeight(weightRaw, unit, next);
                return { ...prev, weight: formatNumberForInput(nextWeight, 2) };
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

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "lb" ? "e.g. 50" : "e.g. 22.7"}
            value={inputs.weight}
            onChange={handleInputChange}
          />
        </div>

        {/* Dosage Input */}
        <div>
          <Label htmlFor="dosageMgPerKg" className="text-slate-700 dark:text-slate-300">
            Dosage (mg/kg/day)
          </Label>
          <Input
            id="dosageMgPerKg"
            name="dosageMgPerKg"
            type="number"
            min={0}
            step="any"
            placeholder="Typical: 20-30"
            value={inputs.dosageMgPerKg}
            onChange={handleInputChange}
          />
        </div>

        {/* Frequency Input */}
        <div>
          <Label htmlFor="frequencyPerDay" className="text-slate-700 dark:text-slate-300">
            Frequency (times per day)
          </Label>
          <Select value={inputs.frequencyPerDay} onValueChange={handleFrequencyChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Once daily (SID)</SelectItem>
              <SelectItem value="2">Twice daily (BID)</SelectItem>
              <SelectItem value="3">Three times daily (TID)</SelectItem>
              <SelectItem value="4">Four times daily (QID)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", dosageMgPerKg: "20", frequencyPerDay: "2" })}
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value} mg</p>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and tailored treatment.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cephalexin Dose Calculator for Dogs</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you estimate appropriate cephalexin doses for your dog based on veterinary dosing guidelines. It provides educational reference values for typical infections, supporting informed conversations with your veterinarian.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your dog's weight in pounds or kilograms and select the dosing protocol your vet recommended. The calculator will display the estimated dose in milligrams for each administration.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Use the results to verify your vet's prescription and understand proper dosing intervals. Always follow your veterinarian's specific instructions, as individual dogs may require dose adjustments based on age, health status, and infection severity.</p>
        </div>
      </section>

      {/* TABLE: Cephalexin Dosing Guidelines for Dogs by Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Cephalexin Dosing Guidelines for Dogs by Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows recommended cephalexin doses based on dog weight using standard veterinary guidelines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Single Dose at 15 mg/kg (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Dose at 30 mg/kg (mg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">68</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">135</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">170</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">340</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">340</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">681</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">510</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1020</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">681</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1361</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Doses are calculated for reference only; veterinarians may adjust based on infection type and severity.</p>
      </section>

      {/* TABLE: Cephalexin Dosing Intervals and Common Infection Types */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Cephalexin Dosing Intervals and Common Infection Types</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Typical cephalexin dosing schedules vary by infection and treatment protocol.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Infection Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Dosage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Skin infections</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-30 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours or once daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-14 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Urinary tract infection</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-30 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours or once daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-14 days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ear infections</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-30 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours or once daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-14 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Soft tissue/wound</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-30 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours or once daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-14 days</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Dosing frequency and duration determined by veterinarian based on infection severity and response.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always complete the full antibiotic course even if your dog improves, to prevent bacterial resistance and infection recurrence.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Administer cephalexin with food if your dog experiences stomach upset, unless your vet advises otherwise.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store cephalexin in a cool, dry place and check the expiration date before each dose to ensure medication effectiveness.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep a dosing log to track administration times and monitor your dog's response to treatment.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping doses to save medication</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Skipping doses reduces antibiotic effectiveness and increases the risk of antibiotic-resistant bacterial infections in your dog.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using outdated weight measurements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Inaccurate weight leads to incorrect dose calculations; weigh your dog regularly, especially if treating a young or growing dog.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Adjusting doses without veterinary approval</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Never increase, decrease, or change dosing frequency without explicit approval from your veterinarian.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Sharing leftover cephalexin with other dogs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Antibiotics are prescribed individually; sharing medication risks improper dosing and adverse reactions in other dogs.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard cephalexin dosage for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The typical dose is 10-15 mg/kg every 6-8 hours, or 22-35 mg/kg once daily. Always follow your veterinarian's specific prescription for your dog.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator account for my dog's weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses your dog's weight in pounds or kilograms to compute the precise milligram dose based on recommended mg/kg dosing guidelines for canine infections.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator instead of consulting my vet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, this calculator is educational only and should never replace veterinary advice; always consult your veterinarian before administering any medication to your dog.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What infections does cephalexin treat in dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cephalexin treats bacterial skin infections, ear infections, urinary tract infections, and soft tissue infections in dogs caused by susceptible bacteria.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there dogs that shouldn't take cephalexin?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dogs with penicillin or cephalosporin allergies should not receive cephalexin; inform your vet of any drug allergies before treatment begins.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does a typical cephalexin course last for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Treatment typically lasts 7-14 days depending on the infection type and severity; complete the full course even if symptoms improve earlier.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if I miss a dose?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Give the missed dose as soon as you remember, but skip it if the next dose is due within 2-3 hours; never double-dose to make up for a missed one.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.merckvetmanual.com/pharmacology/antimicrobials/cephalosporins" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Merck Veterinary Manual - Cephalexin</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive veterinary reference on cephalosporin antibiotics including dosing and clinical applications in dogs.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals - Cephalexin for Dogs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Client education resource providing information on cephalexin use, side effects, and proper administration in canine patients.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/avma-policies/antimicrobial-stewardship" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AVMA - Antimicrobial Stewardship</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Veterinary Medical Association guidelines on responsible antibiotic use in veterinary medicine.</p>
          </li>
          <li>
            <a href="https://www.petmd.com/dog/conditions/cephalexin-dogs" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">PetMD - Cephalexin for Dogs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Client-friendly guide covering cephalexin uses, dosing expectations, and potential side effects in dogs.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cephalexin Dose Calculator for Dogs"
      description="Calculate the veterinarian-recommended dosage for the antibiotic **Cephalexin** in dogs based on body weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula: "Dose per administration (mg) = (Weight (kg) × Dosage (mg/kg/day)) ÷ Frequency (times/day)",
        variables: [
          { symbol: "Weight (kg)", description: "Dog's body weight in kilograms" },
          { symbol: "Dosage (mg/kg/day)", description: "Prescribed daily dosage in milligrams per kilogram" },
          { symbol: "Frequency (times/day)", description: "Number of doses administered per day" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 50 lb (22.7 kg) dog is prescribed Cephalexin at 25 mg/kg/day, to be given twice daily (BID). Calculate the dose per administration.",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert weight to kilograms if necessary. Here, 50 lb ÷ 2.20462 = 22.7 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate total daily dose: 22.7 kg × 25 mg/kg/day = 567.5 mg/day. Then divide by frequency: 567.5 mg ÷ 2 = 283.75 mg per dose.",
          },
        ],
        result: "The dog should receive approximately 284 mg of Cephalexin per dose, twice daily.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💉" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cephalexin Dose Calculator for Dogs" },
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
