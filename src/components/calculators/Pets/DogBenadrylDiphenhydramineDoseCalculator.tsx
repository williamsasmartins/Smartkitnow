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

export default function DogBenadrylDiphenhydramineDoseCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Benadryl (Diphenhydramine) typical safe dose for dogs: 1 mg/kg to 2 mg/kg every 8-12 hours.
  // We'll calculate the dose range (min and max) based on weight.
  // Source: Veterinary pharmacology guidelines.

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (!weightRaw || weightRaw <= 0)
      return {
        value: 0,
        label: "Enter valid weight to calculate dosage",
        subtext: null,
        warning: null,
      };

    const weightKg = weightToKg(weightRaw, unit);

    // Dose range in mg
    const doseMin = weightKg * 1; // 1 mg/kg minimum dose
    const doseMax = weightKg * 2; // 2 mg/kg maximum dose

    // Round to 2 decimals for clarity
    const doseMinRounded = Math.round(doseMin * 100) / 100;
    const doseMaxRounded = Math.round(doseMax * 100) / 100;

    // Warning if weight is very low or very high (e.g. <1kg or >90kg)
    let warning = null;
    if (weightKg < 1) {
      warning =
        "Weight below 1 kg is uncommon for dogs; please verify weight and consult a veterinarian before dosing.";
    } else if (weightKg > 90) {
      warning =
        "Weight above 90 kg is uncommon for dogs; dosing should be carefully confirmed with a veterinarian.";
    }

    return {
      value: `${doseMinRounded} mg - ${doseMaxRounded} mg`,
      label: `Recommended Benadryl dose range every 8-12 hours`,
      subtext:
        "Dose is calculated based on 1-2 mg of Diphenhydramine per kg of body weight. Always consult your veterinarian before administration.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What is the standard Benadryl dose for dogs?",
      answer: "The typical dose is 1 mg per pound of body weight, given every 8-12 hours. A 50-pound dog would receive 50 mg per dose, with a maximum of 300 mg daily.",
    },
    {
      question: "Can I use this calculator for all dog breeds and sizes?",
      answer: "Yes, this calculator works for all breeds and sizes using weight-based dosing. However, always consult your veterinarian before administering Benadryl to your dog.",
    },
    {
      question: "What are common reasons vets prescribe Benadryl to dogs?",
      answer: "Veterinarians prescribe Benadryl for allergies, itching, anxiety, and motion sickness in dogs. It can also help reduce swelling from insect bites or minor allergic reactions.",
    },
    {
      question: "How often can I give my dog Benadryl?",
      answer: "Benadryl can be administered every 8-12 hours, typically 2-3 times daily, but never exceed 300 mg in 24 hours without veterinary guidance.",
    },
    {
      question: "Are there side effects of Benadryl in dogs?",
      answer: "Common side effects include drowsiness and dry mouth. Rare side effects include increased heart rate or urinary retention; contact your vet if you notice unusual behavior.",
    },
    {
      question: "What Benadryl formulations are safe for dogs?",
      answer: "Only plain diphenhydramine tablets or liquid are safe; avoid products containing acetaminophen, ibuprofen, or xylitol, as these are toxic to dogs.",
    },
    {
      question: "Should I give Benadryl with food?",
      answer: "Benadryl can be given with or without food, though administering with a small meal may reduce stomach upset in sensitive dogs.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Please enter your dog's current body weight accurately for best results.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via state update
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and personalized dosing.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Benadryl (Diphenhydramine) Dose Calculator for Dogs</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the safe diphenhydramine dose for your dog based on weight and age. It simplifies the 1 mg per pound guideline and provides maximum daily limits to prevent overdosing.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your dog's weight in pounds and age, then select the desired dosing frequency (every 8, 10, or 12 hours). The calculator instantly shows the recommended single dose and total daily maximum.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the results and consult your veterinarian before administering any medication. The calculator provides guidance, but professional veterinary approval ensures safe use for your specific dog's health condition.</p>
        </div>
      </section>

      {/* TABLE: Benadryl Dosage by Dog Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Benadryl Dosage by Dog Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to determine the appropriate diphenhydramine dose based on your dog's weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Single Dose (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Max Daily Dose (mg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">225</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Dosages based on 1 mg per pound every 8-12 hours. Maximum daily dose capped at 300 mg. Consult a veterinarian before use.</p>
      </section>

      {/* TABLE: Benadryl Formulation Strengths and Serving Sizes */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Benadryl Formulation Strengths and Serving Sizes</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Common over-the-counter Benadryl products available for dogs include tablets and liquids.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Product Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Strength per Unit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Serving Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tablet (standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 tablet</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tablet (extra strength)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 tablet</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Liquid (children's)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.5 mg/5 mL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 mL</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Capsule</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 capsule</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Liquid (generic)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 mg/5 mL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 mL</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always verify product ingredients; some formulations contain additives unsafe for dogs. Consult your veterinarian on proper administration methods.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always obtain veterinary approval before giving Benadryl; some dogs with heart conditions or on other medications may have adverse reactions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a pill organizer or dosing chart to track when you last gave your dog Benadryl to avoid accidental overdosing.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If your dog refuses tablets, ask your vet about compounding liquid diphenhydramine or hiding tablets in treats like peanut butter.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your dog for excessive drowsiness, increased thirst, or difficulty urinating after the first dose and report any concerns to your veterinarian immediately.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Benadryl PM or Cold Formulas</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Products containing acetaminophen or other active ingredients are toxic to dogs; use only plain diphenhydramine.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Exceeding 300 mg Daily Without Veterinary Guidance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The 300 mg daily limit protects against liver and kidney damage; never exceed this without explicit veterinary approval.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Giving Benadryl to Puppies Under 2 Weeks Old</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Very young puppies lack the liver function to metabolize diphenhydramine safely; consult a vet before use on young or geriatric dogs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Checking for Xylitol in Liquid Formulations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some liquid Benadryl products contain xylitol, an artificial sweetener highly toxic to dogs; read all labels carefully.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard Benadryl dose for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The typical dose is 1 mg per pound of body weight, given every 8-12 hours. A 50-pound dog would receive 50 mg per dose, with a maximum of 300 mg daily.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for all dog breeds and sizes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator works for all breeds and sizes using weight-based dosing. However, always consult your veterinarian before administering Benadryl to your dog.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are common reasons vets prescribe Benadryl to dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Veterinarians prescribe Benadryl for allergies, itching, anxiety, and motion sickness in dogs. It can also help reduce swelling from insect bites or minor allergic reactions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often can I give my dog Benadryl?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Benadryl can be administered every 8-12 hours, typically 2-3 times daily, but never exceed 300 mg in 24 hours without veterinary guidance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there side effects of Benadryl in dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common side effects include drowsiness and dry mouth. Rare side effects include increased heart rate or urinary retention; contact your vet if you notice unusual behavior.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What Benadryl formulations are safe for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Only plain diphenhydramine tablets or liquid are safe; avoid products containing acetaminophen, ibuprofen, or xylitol, as these are toxic to dogs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I give Benadryl with food?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Benadryl can be given with or without food, though administering with a small meal may reduce stomach upset in sensitive dogs.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aspca.org/pet-care/animal-poison-control" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Animal Poison Control Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative resource for pet medication safety and toxicity information.</p>
          </li>
          <li>
            <a href="https://www.avma.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional organization providing evidence-based guidance on veterinary medications and dosing.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Merck Veterinary Manual</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive veterinary drug reference with diphenhydramine dosing protocols for dogs.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals - Diphenhydramine in Dogs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical resource explaining appropriate use, side effects, and contraindications of diphenhydramine in canines.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Benadryl (Diphenhydramine) Dose Calculator for Dogs"
      description="Calculate the safe, appropriate dosage of **Benadryl (Diphenhydramine)** for dogs based on body weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg) = Weight (kg) × Dosage (mg/kg)",
        variables: [
          { symbol: "Dose (mg)", description: "Total Benadryl dose in milligrams" },
          { symbol: "Weight (kg)", description: "Dog's body weight in kilograms" },
          { symbol: "Dosage (mg/kg)", description: "Recommended dose per kilogram (1 to 2 mg/kg)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A dog weighs 30 lbs (approximately 13.6 kg). We want to calculate the safe Benadryl dose range.",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert weight from pounds to kilograms: 30 lbs ÷ 2.20462 = 13.6 kg",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate minimum dose: 13.6 kg × 1 mg/kg = 13.6 mg; Calculate maximum dose: 13.6 kg × 2 mg/kg = 27.2 mg",
          },
        ],
        result: "The recommended Benadryl dose range is 13.6 mg to 27.2 mg every 8-12 hours.",
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
        { id: "what-is", label: "Understanding Benadryl (Diphenhydramine) Dose Calculator for Dogs" },
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
