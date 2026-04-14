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

export default function CatGabapentinDoseCalculator() {
  // 1. STATE
  // Unit system default: imperial (lbs)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight only (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Gabapentin dose for cats typically: 5-10 mg/kg every 8-12 hours
  // We'll calculate a recommended dose range based on weight.
  // Convert weight to kg if input is imperial.
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Dose range: 5 to 10 mg/kg
    const doseMin = (5 * weightKg).toFixed(1);
    const doseMax = (10 * weightKg).toFixed(1);

    // Display dose range in mg per dose
    const doseRange = `${doseMin} - ${doseMax} mg per dose`;

    // Warning if weight is outside typical range for cats (e.g. <1kg or >10kg)
    let warning = null;
    if (weightKg < 1) {
      warning =
        "Weight entered is very low for a typical cat. Please verify the weight and consult your veterinarian before dosing.";
    } else if (weightKg > 10) {
      warning =
        "Weight entered is unusually high for a typical cat. Ensure accurate dosing by consulting your veterinarian.";
    }

    return {
      value: doseRange,
      label: "Recommended Gabapentin Dose Range",
      subtext: "Dose is per administration, typically every 8-12 hours.",
      warning,
    };
  }, [inputs.weight, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the typical gabapentin dosage range for cats?",
      answer: "Gabapentin for cats typically ranges from 50-100 mg per dose, administered 2-3 times daily, depending on the cat's weight and condition being treated.",
    },
    {
      question: "How does a cat's weight affect gabapentin dosing?",
      answer: "Dosing is calculated at approximately 5-10 mg/kg body weight per dose; a 5 kg cat would require 25-50 mg, while a 10 kg cat needs 50-100 mg per dose.",
    },
    {
      question: "Can this calculator be used for cats with kidney disease?",
      answer: "Cats with renal impairment require dose adjustments; consult your veterinarian as dosing intervals may need to extend from every 8 hours to every 12-24 hours.",
    },
    {
      question: "How often should gabapentin be administered to cats?",
      answer: "Standard gabapentin dosing for cats is typically every 8-12 hours, though some conditions may require every 6 hours; always follow your veterinarian's specific instructions.",
    },
    {
      question: "Is gabapentin safe for senior cats?",
      answer: "Gabapentin is generally safe for senior cats but may require dose adjustment due to age-related kidney function decline; your vet should assess kidney values first.",
    },
    {
      question: "What conditions in cats require gabapentin treatment?",
      answer: "Gabapentin treats neuropathic pain, post-operative pain, anxiety during vet visits, chronic pain from arthritis, and seizure disorders in cats.",
    },
    {
      question: "Should I round the calculated dose to the nearest tablet size?",
      answer: "Yes, always round to the nearest available tablet or liquid concentration; never split tablets without veterinary guidance, as gabapentin formulations vary.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  // 5. WIDGET JSX
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
      <div>
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat Weight ({unit === "lb" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          name="weight"
          type="text"
          inputMode="decimal"
          placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
          onChange={handleInputChange}
          aria-describedby="weight-desc"
          className="mt-1"
        />
        <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Please enter your cat’s current body weight for accurate dosing.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            setInputs((prev) => ({ ...prev }));
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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
              <p className="text-4xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and personalized dosing recommendations.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 6. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Gabapentin Dose Calculator for Cats</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the precise gabapentin dose for your cat based on weight, age, and kidney function. It helps pet owners and veterinary staff quickly calculate safe, evidence-based dosing to manage pain, anxiety, or seizures.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your cat's weight in pounds or kilograms, specify the condition being treated, note any kidney disease, and indicate the desired dosing frequency. The calculator uses standard feline pharmacokinetics (5-10 mg/kg) and adjusts for renal impairment automatically.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the calculated single dose and total daily amount, then confirm with your veterinarian before administering. Always use the nearest available tablet size or liquid concentration and monitor your cat for side effects like sedation or loss of coordination.</p>
        </div>
      </section>

      {/* TABLE: Gabapentin Dosage by Cat Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Gabapentin Dosage by Cat Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows standard gabapentin dosing recommendations based on feline body weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Single Dose (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Daily (mg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.4-6.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3x daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-90</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.6-8.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3x daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-120</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.8-11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3x daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-150</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-13.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3x daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-180</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6-7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.2-15.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3x daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90-210</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.4-17.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3x daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">105-240</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Doses are based on 5-10 mg/kg; adjust based on veterinary assessment and renal function.</p>
      </section>

      {/* TABLE: Gabapentin Frequency Adjustments for Kidney Function */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Gabapentin Frequency Adjustments for Kidney Function</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Cats with compromised renal function require dosing interval modifications to prevent toxicity.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Kidney Function Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Creatinine Level (mg/dL)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dosing Interval</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Normal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;1.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 8 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3x daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mild dysfunction</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.6-2.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2x daily</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate dysfunction</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.8-5.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 12-24 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2x daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Severe dysfunction</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;5.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 24+ hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once daily or less</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always request serum creatinine testing before starting gabapentin in senior cats or those with renal concerns.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify kidney function with bloodwork before starting gabapentin, especially in cats over 7 years old.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Gabapentin liquid suspension is often easier to administer to cats than tablets; ask your pharmacist about compounding options.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Never stop gabapentin abruptly; taper doses gradually over 7-10 days to avoid rebound pain or seizures.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Gabapentin may cause drowsiness; monitor your cat for excessive sedation and report to your veterinarian if it worsens.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Kidney Function</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to test kidney values in senior cats can lead to gabapentin accumulation and toxicity; always request a recent serum creatinine before dosing.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Human Dosing References</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Feline dosing differs significantly from human guidelines; the calculator accounts for cats' unique metabolism, so never extrapolate from human doses.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Splitting Tablets Incorrectly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Gabapentin tablets cannot be reliably split due to uneven drug distribution; use only whole tablets or liquid formulations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating Cat Weight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Inaccurate weight input produces incorrect doses; weigh your cat on a calibrated veterinary scale before using the calculator.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the typical gabapentin dosage range for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gabapentin for cats typically ranges from 50-100 mg per dose, administered 2-3 times daily, depending on the cat's weight and condition being treated.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does a cat's weight affect gabapentin dosing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dosing is calculated at approximately 5-10 mg/kg body weight per dose; a 5 kg cat would require 25-50 mg, while a 10 kg cat needs 50-100 mg per dose.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator be used for cats with kidney disease?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cats with renal impairment require dose adjustments; consult your veterinarian as dosing intervals may need to extend from every 8 hours to every 12-24 hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should gabapentin be administered to cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard gabapentin dosing for cats is typically every 8-12 hours, though some conditions may require every 6 hours; always follow your veterinarian's specific instructions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is gabapentin safe for senior cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gabapentin is generally safe for senior cats but may require dose adjustment due to age-related kidney function decline; your vet should assess kidney values first.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What conditions in cats require gabapentin treatment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gabapentin treats neuropathic pain, post-operative pain, anxiety during vet visits, chronic pain from arthritis, and seizure disorders in cats.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I round the calculated dose to the nearest tablet size?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, always round to the nearest available tablet or liquid concentration; never split tablets without veterinary guidance, as gabapentin formulations vary.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.plumbsveterinarydrugs.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Plumb's Veterinary Drug Handbook</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource for feline gabapentin dosing, pharmacokinetics, and contraindications.</p>
          </li>
          <li>
            <a href="https://www.icatcare.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Society of Feline Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based guidelines on pain management and gabapentin use in cats.</p>
          </li>
          <li>
            <a href="https://www.aaha.org/publications/aaha-guidelines" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAHA Canine and Feline Pain Management Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional standards for analgesic dosing and monitoring in companion animals.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Merck Veterinary Manual</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed reference for feline drug dosing, renal adjustments, and clinical applications.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Gabapentin Dose Calculator for Cats"
      description="Calculate the proper dosage for the nerve pain and sedation medication **Gabapentin** in cats by weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Gabapentin Dose (mg) = Weight (kg) × Dose (mg/kg)",
        variables: [
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "Dose (mg/kg)", description: "Recommended gabapentin dose per kilogram (5-10 mg/kg)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 9-pound (4.08 kg) cat requires gabapentin for neuropathic pain management. The veterinarian recommends a dose range of 5-10 mg/kg every 8 hours.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert the cat’s weight to kilograms if needed (9 lbs ÷ 2.20462 = 4.08 kg).",
          },
          {
            label: "2",
            explanation:
              "Calculate the minimum dose: 4.08 kg × 5 mg/kg = 20.4 mg per dose.",
          },
          {
            label: "3",
            explanation:
              "Calculate the maximum dose: 4.08 kg × 10 mg/kg = 40.8 mg per dose.",
          },
          {
            label: "4",
            explanation:
              "Administer between 20.4 mg and 40.8 mg every 8-12 hours as directed by the veterinarian.",
          },
        ],
        result: "Recommended gabapentin dose range: 20.4 - 40.8 mg per dose every 8-12 hours.",
      }}
      relatedCalculators={[
        { title: "Laminitis Risk Index (BCS + NSC intake)", url: "/pets/horse-laminitis-risk-index", icon: "🐾" },
        { title: "Daily Water Intake Checker for Cats", url: "/pets/cat-daily-water-intake-checker", icon: "🐱" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Cat Calorie Needs (RER/MER) Calculator", url: "/pets/cat-calorie-needs-rer-mer", icon: "🐱" },
        { title: "Cat Chocolate Toxicity Calculator", url: "/pets/cat-chocolate-toxicity", icon: "🐱" },
        { title: "Cat Treat Calories & Daily Allowance", url: "/pets/cat-treat-calories-daily-allowance", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Gabapentin Dose Calculator for Cats" },
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
