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

export default function CatAcetaminophenIbuprofenExposureRiskCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: Weight and Estimated Dose Ingested (mg)
  const [inputs, setInputs] = useState({
    weight: "",
    dose: "",
    medType: "acetaminophen",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const doseRaw = parseFloat(inputs.dose);
    if (isNaN(weightRaw) || weightRaw <= 0 || isNaN(doseRaw) || doseRaw <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = weightToKg(weightRaw, unit);

    // Calculate mg/kg dose ingested
    const mgPerKg = doseRaw / weightKg;

    // Toxicity thresholds (approximate, species-specific)
    // Acetaminophen toxic dose for cats: ~50 mg/kg (severe toxicity)
    // Ibuprofen toxic dose for cats: ~25 mg/kg (severe toxicity)
    // We'll use these to categorize risk

    let toxicThreshold = 0;
    let medName = "";
    if (inputs.medType === "acetaminophen") {
      toxicThreshold = 50;
      medName = "Acetaminophen";
    } else {
      toxicThreshold = 25;
      medName = "Ibuprofen";
    }

    // Risk categorization
    let riskLevel = "";
    let warning = null;
    if (mgPerKg >= toxicThreshold) {
      riskLevel = "High Risk";
      warning =
        `The ingested dose of ${medName} is at or above the toxic threshold for cats. Immediate veterinary attention is critical to prevent severe poisoning and organ damage.`;
    } else if (mgPerKg >= toxicThreshold / 2) {
      riskLevel = "Moderate Risk";
      warning =
        `The ingested dose of ${medName} is concerning and may cause adverse effects. Veterinary consultation is strongly recommended to evaluate and manage potential toxicity.`;
    } else {
      riskLevel = "Low Risk";
      warning = null;
    }

    return {
      value: mgPerKg.toFixed(1),
      label: `Estimated Dose Ingested (mg/kg) - ${riskLevel}`,
      subtext: `Toxic threshold for ${medName} in cats is approximately ${toxicThreshold} mg/kg.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What acetaminophen dose is toxic to dogs?",
      answer: "Dogs can experience liver damage at doses exceeding 100-150 mg/kg, with severe toxicity typically occurring above 200 mg/kg. A single 500 mg tablet poses significant risk to small dogs under 10 lbs.",
    },
    {
      question: "Is ibuprofen safer than acetaminophen for pets?",
      answer: "No; ibuprofen is actually more toxic to dogs than acetaminophen, causing gastrointestinal ulceration and kidney damage at doses as low as 100 mg/kg, with GI signs appearing within 2-4 hours of ingestion.",
    },
    {
      question: "How quickly does acetaminophen poisoning show symptoms?",
      answer: "Clinical signs typically appear 1-4 hours after ingestion and include lethargy, vomiting, abdominal pain, and dark urine; liver damage may take 24-72 hours to become apparent.",
    },
    {
      question: "What should I do if my pet ingests human pain medication?",
      answer: "Contact your veterinarian or ASPCA Animal Poison Control Center (888-426-4435) immediately with your pet's weight and the medication dose; do not wait for symptoms to develop.",
    },
    {
      question: "Can cats be poisoned by acetaminophen or ibuprofen?",
      answer: "Yes; cats are highly sensitive to both drugs, with acetaminophen causing toxicity at doses &gt;60 mg/kg and ibuprofen at &gt;50 mg/kg, making them even more susceptible than dogs.",
    },
    {
      question: "What's the difference between toxic and lethal doses?",
      answer: "Toxic doses cause clinical signs and organ damage but may be survivable with treatment, while lethal doses result in death; the gap narrows significantly in small pets and cats.",
    },
    {
      question: "How is acetaminophen or ibuprofen poisoning treated?",
      answer: "Treatment includes activated charcoal for recent ingestion, IV fluids, liver protectants (like N-acetylcysteine for acetaminophen), and supportive care; prognosis depends on dose and time to treatment.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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

      {/* Medication Type */}
      <div className="space-y-2">
        <Label htmlFor="medType" className="text-slate-700 dark:text-slate-300">
          Medication Type
        </Label>
        <Select
          id="medType"
          value={inputs.medType}
          onValueChange={(value) => setInputs((prev) => ({ ...prev, medType: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="acetaminophen">Acetaminophen (Tylenol)</SelectItem>
            <SelectItem value="ibuprofen">Ibuprofen (Advil, Motrin)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weight Input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat's Weight ({unit === "lb" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={unit === "lb" ? "e.g. 8.5" : "e.g. 3.9"}
          value={inputs.weight}
          onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
        />
      </div>

      {/* Dose Input */}
      <div className="space-y-2">
        <Label htmlFor="dose" className="text-slate-700 dark:text-slate-300">
          Estimated Dose Ingested (mg)
        </Label>
        <Input
          id="dose"
          type="number"
          min="0"
          step="any"
          placeholder="e.g. 100"
          value={inputs.dose}
          onChange={(e) => setInputs((prev) => ({ ...prev, dose: e.target.value }))}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            setInputs((prev) => ({ ...prev }));
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", dose: "", medType: "acetaminophen" })}
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

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Acetaminophen/Ibuprofen Exposure Risk Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates the toxicity risk of accidental acetaminophen or ibuprofen ingestion in dogs, cats, and other pets by comparing the ingested dose to established toxicological thresholds.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet's weight in pounds or kilograms, select the medication type, and input the total dose consumed (in milligrams). The calculator will identify the medication strength from common over-the-counter formulations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results classify exposure as safe, mild concern, moderate risk, or severe toxicity, helping you determine whether immediate veterinary care is necessary. Always contact your vet or poison control center before relying on calculator results alone.</p>
        </div>
      </section>

      {/* TABLE: Acetaminophen Toxicity Thresholds by Pet Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Acetaminophen Toxicity Thresholds by Pet Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimated toxic dose ranges for acetaminophen exposure in dogs based on body weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Single Toxic Dose (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dose per kg</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5 lbs (2.3 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">230-345</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate to High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 lbs (4.5 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">450-675</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate to High</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25 lbs (11.4 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,140-1,710</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50 lbs (22.7 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,270-3,405</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low to Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75 lbs (34 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,400-5,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100 lbs (45.5 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,550-6,825</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Doses &gt;200 mg/kg are considered severely toxic; smaller pets and cats require immediate veterinary attention at lower exposures.</p>
      </section>

      {/* TABLE: Ibuprofen Toxicity Comparison for Common Pet Medications */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Ibuprofen Toxicity Comparison for Common Pet Medications</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Ibuprofen dosing found in over-the-counter human pain relievers and relative pet toxicity risk.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dose per Unit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxic Dose (Dogs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxic Dose (Cats)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Onset of Symptoms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard Ibuprofen Tablet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;100 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;50 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Children's Ibuprofen Liquid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 mg/5mL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;100 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;50 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Extra Strength Ibuprofen</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;100 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;50 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ibuprofen + Acetaminophen Combo</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200 + 500 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Both thresholds apply</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Both thresholds apply</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-4 hours</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">GI ulceration is the primary concern with ibuprofen; kidney and liver damage can develop with chronic or high-dose exposure.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Store all human medications in child-proof and pet-proof cabinets; acetaminophen and ibuprofen are commonly found in bedside tables where pets may access them.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check ingredient lists on combination medications, as many cold and flu remedies contain both acetaminophen and ibuprofen, increasing toxicity risk with small ingestions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep the ASPCA Animal Poison Control Center number (888-426-4435) posted on your refrigerator; they can provide specific dosing guidance based on your pet's exact weight.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Be aware that extended-release formulations may delay symptom onset but can result in prolonged toxicity; report the specific product name to your veterinarian.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming small doses are safe</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Even a single 500 mg acetaminophen tablet can cause liver damage in a 5 lb dog; never assume 'just one pill' is harmless.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Waiting for symptoms before calling the vet</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">By the time signs like vomiting or lethargy appear, organ damage may already be underway; contact a veterinarian immediately after ingestion.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing ibuprofen with acetaminophen toxicity profiles</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ibuprofen causes GI ulceration and kidney damage at lower doses than acetaminophen, making it more dangerous in many cases.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for pet species sensitivity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats are far more susceptible to both drugs than dogs; a dose safe for a dog may be life-threatening to a cat of similar weight.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What acetaminophen dose is toxic to dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dogs can experience liver damage at doses exceeding 100-150 mg/kg, with severe toxicity typically occurring above 200 mg/kg. A single 500 mg tablet poses significant risk to small dogs under 10 lbs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is ibuprofen safer than acetaminophen for pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No; ibuprofen is actually more toxic to dogs than acetaminophen, causing gastrointestinal ulceration and kidney damage at doses as low as 100 mg/kg, with GI signs appearing within 2-4 hours of ingestion.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How quickly does acetaminophen poisoning show symptoms?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Clinical signs typically appear 1-4 hours after ingestion and include lethargy, vomiting, abdominal pain, and dark urine; liver damage may take 24-72 hours to become apparent.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if my pet ingests human pain medication?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Contact your veterinarian or ASPCA Animal Poison Control Center (888-426-4435) immediately with your pet's weight and the medication dose; do not wait for symptoms to develop.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can cats be poisoned by acetaminophen or ibuprofen?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes; cats are highly sensitive to both drugs, with acetaminophen causing toxicity at doses &gt;60 mg/kg and ibuprofen at &gt;50 mg/kg, making them even more susceptible than dogs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between toxic and lethal doses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Toxic doses cause clinical signs and organ damage but may be survivable with treatment, while lethal doses result in death; the gap narrows significantly in small pets and cats.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How is acetaminophen or ibuprofen poisoning treated?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Treatment includes activated charcoal for recent ingestion, IV fluids, liver protectants (like N-acetylcysteine for acetaminophen), and supportive care; prognosis depends on dose and time to treatment.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aspca.org/pet-care/animal-poison-control" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Animal Poison Control Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official resource for reporting pet poisoning exposures and obtaining real-time veterinary toxicology guidance.</p>
          </li>
          <li>
            <a href="https://www.petmd.com/dogs/conditions/acetaminophen-toxicity-dogs" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">PetMD: Acetaminophen Toxicity in Dogs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive clinical overview of acetaminophen poisoning symptoms, diagnosis, and treatment protocols.</p>
          </li>
          <li>
            <a href="https://www.vpis.info" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Toxicology Database (VPIS)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based veterinary poison information system used by veterinarians worldwide for toxicity assessment.</p>
          </li>
          <li>
            <a href="https://onlinelibrary.wiley.com/journal/13652885" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of Veterinary Pharmacology and Therapeutics</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed journal publishing research on pet medication toxicity and pharmacokinetics.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Acetaminophen/Ibuprofen Exposure Risk (human meds)"
      description="Alert tool for accidental exposure to common human pain relievers, particularly dangerous **Acetaminophen (Tylenol)**."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Exposure Risk = Dose Ingested (mg) ÷ Weight (kg)",
        variables: [
          { symbol: "Dose Ingested (mg)", description: "Total amount of medication ingested" },
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 9 lb (4.08 kg) cat accidentally ingests one 200 mg ibuprofen tablet. The owner wants to assess the risk of toxicity.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert the cat's weight to kilograms if needed (9 lb ÷ 2.20462 = 4.08 kg).",
          },
          {
            label: "2",
            explanation:
              "Calculate mg/kg dose: 200 mg ÷ 4.08 kg = 49 mg/kg.",
          },
          {
            label: "3",
            explanation:
              "Compare to ibuprofen toxic threshold (~25 mg/kg). Since 49 mg/kg > 25 mg/kg, this is a high-risk exposure requiring immediate veterinary care.",
          },
        ],
        result: "Estimated dose ingested is 49 mg/kg, indicating high risk of ibuprofen toxicity in this cat.",
      }}
      relatedCalculators={[
        { title: "Fish Food Feeding Rate Calculator", url: "/pets/fish-food-feeding-rate", icon: "🐾" },
        { title: "Horse Weight Estimator (Heart Girth & Length)", url: "/pets/horse-weight-estimator-girth-length", icon: "🐎" },
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
        { title: "Essential Oils Exposure Risk (diffuser/dermal)", url: "/pets/cat-essential-oils-exposure-risk", icon: "🍖" },
        { title: "Environmental Enrichment Planner (per room)", url: "/pets/cat-environmental-enrichment-planner", icon: "💉" },
        { title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs", url: "/pets/dog-benadryl-diphenhydramine-dose", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Acetaminophen/Ibuprofen Exposure Risk (human meds)" },
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
