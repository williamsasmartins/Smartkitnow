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
import { convertWeight, formatNumberForInput, LB_PER_KG, weightToKg } from "@/lib/utils";

export default function DogMeloxicamMetacamDoseCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    doseMgPerKg: "0.1", // default initial dose mg/kg
  });

  // 2. LOGIC ENGINE
  // Meloxicam dosing for dogs typically:
  // Initial dose: 0.1 mg/kg once daily (some protocols use 0.2 mg/kg first day)
  // Maintenance dose: 0.05 mg/kg once daily
  // This calculator will provide initial dose and maintenance dose based on weight.
  // User can adjust dose mg/kg if needed.

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const doseMgPerKgRaw = parseFloat(inputs.doseMgPerKg);
    const perWeightUnitLabel = unit === "kg" ? "mg/kg" : "mg/lb";

    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Enter a valid dog weight to calculate dosage.",
        subtext: null,
        warning: null,
      };
    }
    if (!doseMgPerKgRaw || doseMgPerKgRaw <= 0) {
      return {
        value: 0,
        label: `Enter a valid dose (${perWeightUnitLabel}) to calculate dosage.`,
        subtext: null,
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);
    const doseMgPerKg = unit === "kg" ? doseMgPerKgRaw : doseMgPerKgRaw * LB_PER_KG;

    // Calculate initial dose (mg)
    // Typical initial dose: 0.1 mg/kg (can be adjusted)
    const initialDoseMg = weightKg * doseMgPerKg;

    // Calculate maintenance dose (mg)
    // Maintenance dose is usually half initial dose (0.05 mg/kg)
    const maintenanceDoseMg = weightKg * (doseMgPerKg / 2);

    // Round to 2 decimals
    const initialDoseRounded = initialDoseMg.toFixed(2);
    const maintenanceDoseRounded = maintenanceDoseMg.toFixed(2);

    // Warning for max dose (max 0.2 mg/kg/day generally)
    let warning = null;
    if (doseMgPerKg > 0.2) {
      warning =
        "Warning: The dose entered exceeds the commonly recommended maximum of 0.2 mg/kg/day. Consult your veterinarian before administering higher doses.";
    }

    return {
      value: initialDoseRounded,
      label: `Initial Dose: ${initialDoseRounded} mg once daily`,
      subtext: `Maintenance Dose: ${maintenanceDoseRounded} mg once daily`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What is the standard meloxicam dose for dogs?",
      answer: "The typical initial dose is 0.2 mg/kg once daily, with a maximum recommended dose of 0.1 mg/kg daily for maintenance therapy in most dogs.",
    },
    {
      question: "How does the Metacam calculator account for dog weight?",
      answer: "The calculator uses your dog's weight in kilograms to compute the exact dose, as meloxicam dosing is weight-dependent and ranges from 0.1–0.2 mg/kg.",
    },
    {
      question: "Can I use this calculator for cats?",
      answer: "No, this calculator is specifically designed for dogs; cats require different meloxicam dosing protocols and should use a feline-specific calculator.",
    },
    {
      question: "How long does meloxicam take to work in dogs?",
      answer: "Most dogs show pain relief within 30 minutes to 1 hour of oral administration, though full anti-inflammatory effects may take 24–48 hours.",
    },
    {
      question: "What is the maximum daily meloxicam dose for large dogs?",
      answer: "For a 50 kg dog at maintenance dose (0.1 mg/kg), the maximum is approximately 5 mg daily; your veterinarian may adjust based on individual response.",
    },
    {
      question: "Does meloxicam require a prescription for dogs?",
      answer: "Yes, meloxicam (Metacam) is a prescription NSAID and must be prescribed by a licensed veterinarian after a proper diagnosis.",
    },
    {
      question: "How should I adjust meloxicam dosing if my dog misses a dose?",
      answer: "Give the missed dose as soon as possible, but skip it if the next scheduled dose is approaching; never double-dose to compensate.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
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
              const doseRaw = parseFloat(inputs.doseMgPerKg);
              if (Number.isFinite(weightRaw) && weightRaw > 0) {
                const nextWeight = convertWeight(weightRaw, unit, next);
                setInputs((prev) => ({ ...prev, weight: formatNumberForInput(nextWeight, 2) }));
              }
              if (Number.isFinite(doseRaw) && doseRaw > 0) {
                const nextDose =
                  unit === "kg" && next === "lb"
                    ? doseRaw / LB_PER_KG
                    : unit === "lb" && next === "kg"
                      ? doseRaw * LB_PER_KG
                      : doseRaw;
                setInputs((prev) => ({ ...prev, doseMgPerKg: formatNumberForInput(nextDose, 4) }));
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
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300 mb-1 block">
            Dog Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={onInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 mt-1">
            Accurate weight ensures correct Meloxicam dosing.
          </p>
        </div>

        {/* Dose Input */}
        <div>
          <Label htmlFor="doseMgPerKg" className="text-slate-700 dark:text-slate-300 mb-1 block">
            Dose ({unit === "kg" ? "mg/kg" : "mg/lb"}) - Initial Dose (Typical: 0.1)
          </Label>
          <Input
            id="doseMgPerKg"
            name="doseMgPerKg"
            type="text"
            inputMode="decimal"
            placeholder="e.g., 0.1"
            value={inputs.doseMgPerKg}
            onChange={onInputChange}
            aria-describedby="dose-desc"
          />
          <p id="dose-desc" className="text-xs text-slate-500 mt-1">
            Adjust dose per veterinary recommendation. Max recommended is 0.2 mg/kg/day.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          type="button"
          aria-label="Calculate Meloxicam Dose"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", doseMgPerKg: "0.1" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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
                Estimated Meloxicam Dose
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

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Meloxicam/Metacam Dose Calculator for Dogs</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the correct meloxicam dose for your dog based on weight and veterinary guidelines. It helps ensure safe, effective pain and inflammation management for conditions like arthritis, post-operative recovery, and acute injuries.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your dog's current weight in kilograms and select the dosing phase (initial or maintenance therapy). The calculator uses evidence-based protocols with standard doses of 0.2 mg/kg for initial treatment and 0.1 mg/kg for long-term maintenance.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your dog's recommended dose in milligrams. Always confirm this calculation with your veterinarian before administration, as individual dogs may require dose adjustments based on age, kidney function, and concurrent medications.</p>
        </div>
      </section>

      {/* TABLE: Meloxicam Dosing Guidelines for Dogs by Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Meloxicam Dosing Guidelines for Dogs by Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical initial and maintenance doses based on dog weight using standard veterinary protocols.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Initial Dose (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maintenance Dose (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once daily</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once daily</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once daily</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Doses based on 0.2 mg/kg initial and 0.1 mg/kg maintenance; always verify with your veterinarian before administration.</p>
      </section>

      {/* TABLE: Meloxicam Formulations and Concentrations Available */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Meloxicam Formulations and Concentrations Available</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Common meloxicam/Metacam products for dogs vary in concentration and form.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Formulation</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Concentration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Common Uses</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Route</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oral liquid suspension</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 mg/mL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs unable to take tablets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Oral</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tablet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium dogs, easy dosing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Oral</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tablet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Larger dogs, arthritis</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Oral</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tablet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large breed dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Oral</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Injectable solution</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 mg/mL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Post-operative pain, acute cases</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">IV/IM/SC</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Verify product availability in your region; injectable forms typically require veterinary administration.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always give meloxicam with food or a meal to reduce gastrointestinal upset and improve absorption.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store liquid meloxicam suspension at room temperature away from light and shake well before each use.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your dog for signs of NSAID sensitivity including vomiting, diarrhea, loss of appetite, or black tarry stools.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Have regular veterinary check-ups while your dog is on long-term meloxicam to monitor kidney and liver function.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using cat dosing for dogs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Meloxicam dosing differs significantly between species; never apply feline protocols to canine patients.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Rounding doses incorrectly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Small rounding errors compound over time; use the exact milligram dose provided by the calculator or veterinarian.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Exceeding maintenance dose duration</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Meloxicam should not be used long-term without veterinary oversight and periodic bloodwork to check organ function.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Combining with other NSAIDs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Never give meloxicam with other NSAIDs or certain pain medications without explicit veterinary approval, as this increases toxicity risk.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard meloxicam dose for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The typical initial dose is 0.2 mg/kg once daily, with a maximum recommended dose of 0.1 mg/kg daily for maintenance therapy in most dogs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the Metacam calculator account for dog weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses your dog's weight in kilograms to compute the exact dose, as meloxicam dosing is weight-dependent and ranges from 0.1–0.2 mg/kg.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, this calculator is specifically designed for dogs; cats require different meloxicam dosing protocols and should use a feline-specific calculator.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does meloxicam take to work in dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most dogs show pain relief within 30 minutes to 1 hour of oral administration, though full anti-inflammatory effects may take 24–48 hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the maximum daily meloxicam dose for large dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a 50 kg dog at maintenance dose (0.1 mg/kg), the maximum is approximately 5 mg daily; your veterinarian may adjust based on individual response.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does meloxicam require a prescription for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, meloxicam (Metacam) is a prescription NSAID and must be prescribed by a licensed veterinarian after a proper diagnosis.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I adjust meloxicam dosing if my dog misses a dose?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Give the missed dose as soon as possible, but skip it if the next scheduled dose is approaching; never double-dose to compensate.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aaha.org/guidelines/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAHA Canine Pain Management Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative veterinary guidelines on safe pain management protocols for dogs including NSAID dosing.</p>
          </li>
          <li>
            <a href="https://www.fda.gov/animal-veterinary/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FDA Center for Veterinary Medicine - Metacam Approval</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official FDA documentation on meloxicam approval, safety data, and approved uses in veterinary medicine.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Merck Veterinary Manual - Meloxicam</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive veterinary pharmacology reference covering meloxicam mechanism, dosing, and adverse effects in dogs.</p>
          </li>
          <li>
            <a href="https://www.boehringer-ingelheim.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Boehringer Ingelheim - Metacam Product Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manufacturer product details including approved concentrations, formulations, and prescribing information for canine use.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Meloxicam/Metacam Dose Calculator for Dogs"
      description="Calculate the safe initial and maintenance dosages for the NSAID **Meloxicam (Metacam)** for pain relief in dogs."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg) = Weight (kg) × Dose (mg/kg)",
        variables: [
          { symbol: "Dose (mg)", description: "Total Meloxicam dose in milligrams" },
          { symbol: "Weight (kg)", description: "Dog's body weight in kilograms" },
          { symbol: "Dose (mg/kg)", description: "Meloxicam dose per kilogram of body weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30 lb (13.6 kg) dog requires Meloxicam for osteoarthritis pain management. The veterinarian recommends an initial dose of 0.1 mg/kg.",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert weight to kilograms if needed: 30 lbs ÷ 2.20462 = 13.6 kg.",
          },
          {
            label: "Step 2",
            explanation: "Calculate initial dose: 13.6 kg × 0.1 mg/kg = 1.36 mg Meloxicam once daily.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate maintenance dose: 13.6 kg × 0.05 mg/kg = 0.68 mg Meloxicam once daily after initial treatment.",
          },
        ],
        result: "The dog should receive 1.36 mg Meloxicam once daily initially, followed by 0.68 mg once daily for maintenance.",
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
        { id: "what-is", label: "Understanding Meloxicam/Metacam Dose Calculator for Dogs" },
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
