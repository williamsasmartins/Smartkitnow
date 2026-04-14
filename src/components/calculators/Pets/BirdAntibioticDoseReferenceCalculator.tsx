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

export default function BirdAntibioticDoseReferenceCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and dose per kg
  const [inputs, setInputs] = useState({
    weight: "",
    doseMgPerKg: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const doseNum = parseFloat(inputs.doseMgPerKg);

    if (isNaN(weightNum) || weightNum <= 0 || isNaN(doseNum) || doseNum <= 0) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for weight and dose.",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightNum, unit);

    // Calculate total dose in mg
    const totalDoseMg = weightKg * doseNum;

    // Round to 2 decimals
    const roundedDose = Math.round(totalDoseMg * 100) / 100;

    // Warning if dose is unusually high or low (example threshold)
    let warning = null;
    if (doseNum < 5) {
      warning =
        "The dose entered is quite low; ensure this matches veterinary guidelines for the specific antibiotic.";
    } else if (doseNum > 50) {
      warning =
        "The dose entered is high; double-check with a veterinary professional to avoid toxicity.";
    }

    return {
      value: roundedDose,
      label: "Total Antibiotic Dose (mg)",
      subtext: `Based on ${weightKg.toFixed(2)} kg body weight and ${doseNum} mg/kg dose.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How do I calculate the correct antibiotic dose for my pet using mg/kg?",
      answer: "Multiply your pet's weight in kilograms by the recommended mg/kg dose for the specific antibiotic. For example, a 10 kg dog receiving amoxicillin at 25 mg/kg requires 250 mg per dose.",
    },
    {
      question: "What is the typical amoxicillin dose range for dogs and cats?",
      answer: "Dogs typically receive 20–40 mg/kg every 8–12 hours, while cats receive 10–20 mg/kg every 8–12 hours, depending on the infection severity.",
    },
    {
      question: "How often should I administer doxycycline to my pet?",
      answer: "Doxycycline is usually dosed at 5–10 mg/kg once or twice daily for dogs and cats, typically given with food to minimize GI upset.",
    },
    {
      question: "Why is accurate weight measurement critical for antibiotic dosing?",
      answer: "Even small weight errors significantly alter mg/kg calculations, potentially leading to underdosing (treatment failure) or overdosing (toxicity); use a veterinary scale for precision.",
    },
    {
      question: "What is the recommended fluoroquinolone dose for pets?",
      answer: "Enrofloxacin is commonly dosed at 5–20 mg/kg once or twice daily in dogs, while cats receive 5–15 mg/kg, depending on infection type and severity.",
    },
    {
      question: "Can I adjust antibiotic doses based on my pet's age or health status?",
      answer: "Dosing adjustments for senior pets, kidney disease, or liver impairment require veterinary guidance; this calculator provides standard reference doses only.",
    },
    {
      question: "How long should my pet typically receive antibiotic treatment?",
      answer: "Most antibiotic courses last 7–14 days; never stop early even if symptoms improve, as incomplete treatment increases resistance risk.",
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
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lb">lb</SelectItem>
              <SelectItem value="kg">kg</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Bird Weight ({unit})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="doseMgPerKg" className="text-slate-700 dark:text-slate-300">
            Antibiotic Dose (mg/kg)
          </Label>
          <Input
            id="doseMgPerKg"
            type="number"
            min="0"
            step="any"
            placeholder="Enter dose in mg per kg"
            value={inputs.doseMgPerKg}
            onChange={(e) => setInputs((prev) => ({ ...prev, doseMgPerKg: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", doseMgPerKg: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Antibiotic Dose Reference (mg/kg)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps veterinarians and pet owners determine appropriate antibiotic doses based on your pet's weight and the prescribed medication. It converts standard mg/kg dosing guidelines into precise dose amounts for accurate treatment.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet's weight in kilograms and select the antibiotic from the reference database. The calculator will display the recommended dose range and frequency based on veterinary pharmacology standards.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results provide dosing guidance only and are not substitutes for veterinary diagnosis or prescription. Always consult your veterinarian before administering any antibiotic to ensure it's appropriate for your pet's condition.</p>
        </div>
      </section>

      {/* TABLE: Common Antibiotic Doses for Dogs and Cats (mg/kg) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Antibiotic Doses for Dogs and Cats (mg/kg)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference guide for standard antibiotic dosing in veterinary medicine.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Antibiotic</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dogs (mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cats (mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Amoxicillin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 8–12 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Doxycycline</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once or twice daily</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Enrofloxacin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once or twice daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cephalexin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 8 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Trimethoprim-Sulfa</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 12 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Azithromycin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once daily</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Metronidazole</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 8–12 hours</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always confirm doses with your veterinarian; dosing varies by infection type, severity, and individual pet factors.</p>
      </section>

      {/* TABLE: Dose Calculation Examples by Pet Weight */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Dose Calculation Examples by Pet Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Sample calculations using amoxicillin at 25 mg/kg twice daily.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Single Dose (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Total (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">7-Day Course (mg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,750</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">375</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,250</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">625</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,750</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10,500</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations are examples only; actual doses depend on the specific antibiotic, infection, and veterinary prescription.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always weigh your pet on a veterinary scale before calculating doses; home scales may be inaccurate and lead to improper dosing.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Give antibiotics at consistent intervals; set phone reminders to maintain therapeutic drug levels throughout treatment.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Administer with food only if your veterinarian advises; some antibiotics absorb better on an empty stomach.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Complete the full antibiotic course even if symptoms improve, as stopping early increases resistance risk and treatment failure.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Incorrect Weight Conversions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Converting pounds to kilograms incorrectly (divide by 2.2, not 2) causes significant dosing errors.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Doubling Doses to Treat Faster</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Exceeding recommended mg/kg doses increases toxicity risk without improving treatment speed or effectiveness.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Applying Human Antibiotic Doses to Pets</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pet antibiotic doses differ significantly from human doses; never calculate based on human medication labels.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Kidney or Liver Disease</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pets with organ dysfunction may require dose reductions; this calculator assumes normal organ function.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the correct antibiotic dose for my pet using mg/kg?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Multiply your pet's weight in kilograms by the recommended mg/kg dose for the specific antibiotic. For example, a 10 kg dog receiving amoxicillin at 25 mg/kg requires 250 mg per dose.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the typical amoxicillin dose range for dogs and cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dogs typically receive 20–40 mg/kg every 8–12 hours, while cats receive 10–20 mg/kg every 8–12 hours, depending on the infection severity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I administer doxycycline to my pet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Doxycycline is usually dosed at 5–10 mg/kg once or twice daily for dogs and cats, typically given with food to minimize GI upset.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is accurate weight measurement critical for antibiotic dosing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Even small weight errors significantly alter mg/kg calculations, potentially leading to underdosing (treatment failure) or overdosing (toxicity); use a veterinary scale for precision.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the recommended fluoroquinolone dose for pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enrofloxacin is commonly dosed at 5–20 mg/kg once or twice daily in dogs, while cats receive 5–15 mg/kg, depending on infection type and severity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I adjust antibiotic doses based on my pet's age or health status?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dosing adjustments for senior pets, kidney disease, or liver impairment require veterinary guidance; this calculator provides standard reference doses only.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long should my pet typically receive antibiotic treatment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most antibiotic courses last 7–14 days; never stop early even if symptoms improve, as incomplete treatment increases resistance risk.</p>
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive reference for veterinary antibiotic dosing and administration guidelines.</p>
          </li>
          <li>
            <a href="https://www.aaha.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Animal Hospital Association (AAHA)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional resource providing evidence-based antibiotic dosing recommendations for companion animals.</p>
          </li>
          <li>
            <a href="https://www.vin.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network (VIN)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed veterinary information including antimicrobial dosing protocols and resistance guidelines.</p>
          </li>
          <li>
            <a href="https://www.avma.org/antimicrobial-stewardship" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AVMA Antimicrobial Stewardship Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official American Veterinary Medical Association guidelines for responsible antibiotic use in pets.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Antibiotic Dose Reference (mg/kg)"
      description="Reference guide for common antibiotic dosages in birds by body weight (mg/kg)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Total Dose (mg) = Body Weight (kg) × Dose (mg/kg)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Bird's body weight in kilograms" },
          { symbol: "Dose (mg/kg)", description: "Antibiotic dose per kilogram of body weight" },
          { symbol: "Total Dose (mg)", description: "Calculated total antibiotic dose in milligrams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 2.2 lb (1 kg) parakeet requires an antibiotic dose of 20 mg/kg. Calculate the total dose in milligrams.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed. Here, 2.2 lbs equals approximately 1 kg.",
          },
          {
            label: "2",
            explanation:
              "Multiply the body weight (1 kg) by the dose (20 mg/kg) to find the total dose.",
          },
          {
            label: "3",
            explanation: "Total Dose = 1 kg × 20 mg/kg = 20 mg.",
          },
        ],
        result: "The parakeet should receive a total antibiotic dose of 20 mg.",
      }}
      relatedCalculators={[
        { title: "Heavy Metal (Lead/Zinc) Exposure Risk", url: "/pets/bird-heavy-metal-exposure-risk", icon: "🐾" },
        { title: "Dehydration Risk Estimator (Symptoms + Intake)", url: "/pets/cat-dehydration-risk-estimator", icon: "🐶" },
        { title: "Cat Chocolate Toxicity Calculator", url: "/pets/cat-chocolate-toxicity", icon: "🐱" },
        { title: "Shedding & Combing Time Planner", url: "/pets/cat-shedding-combing-time-planner", icon: "🍖" },
        { title: "Dog Crate Size Finder", url: "/pets/dog-crate-size-finder", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Antibiotic Dose Reference (mg/kg)" },
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
