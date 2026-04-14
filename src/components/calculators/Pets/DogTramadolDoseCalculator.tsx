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

export default function DogTramadolDoseCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    painSeverity: "mild",
  });

  // Dosage guidelines (mg/kg) based on veterinary references:
  // Mild pain: 1 mg/kg every 8-12 hours
  // Moderate pain: 2 mg/kg every 8-12 hours
  // Severe pain: 3 mg/kg every 8-12 hours (use with caution, vet supervision required)

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Enter valid weight to calculate dose",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Determine dosage per pain severity
    let dosageMgPerKg = 0;
    let warning = null;
    switch (inputs.painSeverity) {
      case "mild":
        dosageMgPerKg = 1;
        break;
      case "moderate":
        dosageMgPerKg = 2;
        break;
      case "severe":
        dosageMgPerKg = 3;
        warning =
          "Severe pain dosage should only be used under strict veterinary supervision due to risk of side effects.";
        break;
      default:
        dosageMgPerKg = 1;
    }

    // Calculate total dose in mg
    const totalDoseMg = +(weightKg * dosageMgPerKg).toFixed(2);
    const displayedDosage = unit === "kg" ? dosageMgPerKg : dosageMgPerKg / LB_PER_KG;
    const perWeightUnitLabel = unit === "kg" ? "mg/kg" : "mg/lb";
    const weightUnitLabel = unit === "kg" ? "kg" : "lb";

    return {
      value: totalDoseMg,
      label: `Recommended Tramadol dose (${formatNumberForInput(displayedDosage, 2)} ${perWeightUnitLabel})`,
      subtext: `For a dog weighing ${weightRaw.toFixed(2)} ${weightUnitLabel}, administer approximately ${totalDoseMg} mg every 8-12 hours.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What is the standard tramadol dosage range for dogs?",
      answer: "The typical tramadol dose for dogs is 5-10 mg/kg every 6-8 hours, with a maximum daily dose of 40 mg/kg. Always consult your veterinarian for your dog's specific needs.",
    },
    {
      question: "How does dog weight affect tramadol dosing?",
      answer: "Tramadol is weight-based, meaning heavier dogs require higher absolute doses. A 20 kg dog needs roughly twice the dose of a 10 kg dog at the same mg/kg rate.",
    },
    {
      question: "Can I use this calculator for all dog breeds?",
      answer: "Yes, the calculator works for all breeds since dosing is weight-based; however, older dogs, those with liver/kidney disease, or on other medications may need dose adjustments your vet determines.",
    },
    {
      question: "What should I do if my dog misses a tramadol dose?",
      answer: "Give the missed dose as soon as remembered, unless it's almost time for the next dose; then skip the missed dose and resume the regular schedule without doubling up.",
    },
    {
      question: "Are there side effects I should monitor after giving tramadol?",
      answer: "Common side effects include drowsiness, dizziness, and constipation; contact your vet if your dog shows vomiting, severe lethargy, or difficulty urinating.",
    },
    {
      question: "How long does tramadol take to work in dogs?",
      answer: "Tramadol typically begins working within 30-60 minutes of oral administration, with peak pain relief occurring around 2-3 hours after dosing.",
    },
    {
      question: "Can tramadol be combined with other pain medications?",
      answer: "Combining tramadol with NSAIDs or other medications requires veterinary approval due to potential interactions; never combine without explicit instructions from your vet.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }
  function onPainSeverityChange(value: string) {
    setInputs((prev) => ({ ...prev, painSeverity: value }));
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
            Dog's Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={onInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 mt-1">
            Accurate weight is essential for safe dosing.
          </p>
        </div>

        {/* Pain Severity Select */}
        <div>
          <Label htmlFor="painSeverity" className="text-slate-700 dark:text-slate-300">
            Pain Severity
          </Label>
          <Select value={inputs.painSeverity} onValueChange={onPainSeverityChange}>
            <SelectTrigger id="painSeverity" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mild">Mild Pain</SelectItem>
              <SelectItem value="moderate">Moderate Pain</SelectItem>
              <SelectItem value="severe">Severe Pain</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 mt-1">
            Select the severity of your dog's pain as assessed by a veterinarian.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          aria-label="Calculate Tramadol Dose"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", painSeverity: "mild" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and personalized treatment.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Tramadol Dose Calculator for Dogs</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the appropriate tramadol dose for your dog based on weight and standard veterinary dosing guidelines (5-10 mg/kg). It provides a reference range to discuss with your veterinarian, not a substitute for professional medical advice.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your dog's weight in kilograms and select the dosing frequency your vet recommends. The calculator displays both the low-end (5 mg/kg) and high-end (10 mg/kg) dose recommendations for comparison.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the calculated dose range and maximum daily limits, then confirm the exact dose with your veterinarian before administration. Individual factors like age, kidney function, and concurrent medications may require dose adjustments.</p>
        </div>
      </section>

      {/* TABLE: Tramadol Dosage Guidelines by Dog Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Tramadol Dosage Guidelines by Dog Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows standard tramadol dosing calculations at 5 mg/kg and 10 mg/kg for common dog weights.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Low Dose 5 mg/kg (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Dose 10 mg/kg (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Maximum daily dose should not exceed 40 mg/kg. Always verify dosing with your veterinarian before administration.</p>
      </section>

      {/* TABLE: Tramadol Duration and Peak Effect Timeline */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Tramadol Duration and Peak Effect Timeline</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Understanding when tramadol reaches peak effectiveness and how long it lasts helps optimize your dog's pain management schedule.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Metric</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Timeframe</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Important Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Onset of Action</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-60 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">First signs of pain relief begin</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Peak Effect</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maximum pain relief achieved</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Duration</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Pain relief gradually decreases</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Half-Life</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-9 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Elimination from body at slower rate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full Clearance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-48 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Complete removal from system</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Individual dogs may vary in response time based on metabolism, age, and health status. Extended-release formulations have different kinetics.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always obtain a veterinary prescription before administering tramadol; dosing depends on your dog's specific health status.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a digital scale to weigh your dog accurately, as improper weight estimates lead to incorrect dose calculations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Give tramadol with food to reduce nausea and stomach upset in sensitive dogs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your dog for constipation, a common tramadol side effect, and increase water intake to prevent complications.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Exceeding Maximum Daily Dose</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Administering more than 40 mg/kg daily risks toxicity; the calculator prevents this error by clearly showing cumulative daily totals.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Dog Weight Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Recalculate doses if your dog gains or loses significant weight, as tramadol dosing is weight-dependent and outdated weights lead to incorrect dosing.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Incorrect Weight Units</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Entering weight in pounds instead of kilograms produces dangerously incorrect doses; convert using 1 kg = 2.2 lbs before inputting data.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping Veterinary Consultation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using only this calculator without vet approval is unsafe; seniors, dogs with liver/kidney disease, or those on other meds need individualized dosing.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard tramadol dosage range for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The typical tramadol dose for dogs is 5-10 mg/kg every 6-8 hours, with a maximum daily dose of 40 mg/kg. Always consult your veterinarian for your dog's specific needs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does dog weight affect tramadol dosing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Tramadol is weight-based, meaning heavier dogs require higher absolute doses. A 20 kg dog needs roughly twice the dose of a 10 kg dog at the same mg/kg rate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for all dog breeds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator works for all breeds since dosing is weight-based; however, older dogs, those with liver/kidney disease, or on other medications may need dose adjustments your vet determines.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if my dog misses a tramadol dose?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Give the missed dose as soon as remembered, unless it's almost time for the next dose; then skip the missed dose and resume the regular schedule without doubling up.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there side effects I should monitor after giving tramadol?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common side effects include drowsiness, dizziness, and constipation; contact your vet if your dog shows vomiting, severe lethargy, or difficulty urinating.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does tramadol take to work in dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Tramadol typically begins working within 30-60 minutes of oral administration, with peak pain relief occurring around 2-3 hours after dosing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can tramadol be combined with other pain medications?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Combining tramadol with NSAIDs or other medications requires veterinary approval due to potential interactions; never combine without explicit instructions from your vet.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://vcahospitals.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Tramadol in Dogs and Cats - VCA Animal Hospitals</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive veterinary resource on tramadol pharmacology, dosing, side effects, and contraindications in companion animals.</p>
          </li>
          <li>
            <a href="https://www.avma.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AVMA Canine Pain Management Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Veterinary Medical Association evidence-based guidelines for treating pain in dogs including opioid protocols.</p>
          </li>
          <li>
            <a href="https://www.plumbsveterinarydrugs.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Plumb's Veterinary Drug Handbook</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative drug reference providing detailed tramadol dosing, interactions, and precautions for veterinary use.</p>
          </li>
          <li>
            <a href="https://www.iacrpt.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Association for Canine Rehabilitation and Physical Therapy</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional organization offering evidence-based information on multimodal pain management strategies for dogs.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Tramadol Dose Calculator for Dogs"
      description="Calculate the appropriate pain relief dosage for **Tramadol** in dogs, considering weight and pain severity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg) = Weight (kg) × Dosage (mg/kg)",
        variables: [
          { symbol: "Dose (mg)", description: "Total Tramadol dose to administer" },
          { symbol: "Weight (kg)", description: "Dog's body weight in kilograms" },
          { symbol: "Dosage (mg/kg)", description: "Recommended Tramadol dose per kilogram based on pain severity" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30 lb dog is experiencing moderate pain after surgery. The veterinarian recommends Tramadol at 2 mg/kg every 8-12 hours.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert the dog's weight from pounds to kilograms: 30 lbs ÷ 2.20462 = 13.61 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate the dose: 13.61 kg × 2 mg/kg = 27.22 mg of Tramadol per dose.",
          },
        ],
        result:
          "The dog should receive approximately 27 mg of Tramadol every 8-12 hours as per veterinary guidance.",
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
        { id: "what-is", label: "Understanding Tramadol Dose Calculator for Dogs" },
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
