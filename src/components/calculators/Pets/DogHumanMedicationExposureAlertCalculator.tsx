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

export default function DogHumanMedicationExposureAlertCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    medication: "ibuprofen",
    doseTaken: "",
  });

  // 2. LOGIC ENGINE
  // Toxic dose thresholds (mg/kg) for dogs:
  // Ibuprofen: toxic dose ~ 50 mg/kg (mild toxicity), severe toxicity > 100 mg/kg
  // Acetaminophen: toxic dose ~ 75 mg/kg (mild toxicity), severe toxicity > 100 mg/kg
  // These are approximate and vary by source; always consult a vet.
  // This calculator alerts if the ingested dose exceeds mild toxicity threshold.

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const doseTakenRaw = parseFloat(inputs.doseTaken);
    if (!weightRaw || weightRaw <= 0) {
      return { value: 0, label: "Enter valid dog weight", subtext: null, warning: null };
    }
    if (!doseTakenRaw || doseTakenRaw <= 0) {
      return { value: 0, label: "Enter valid medication dose taken", subtext: null, warning: null };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Calculate mg/kg dose ingested by dog
    const mgPerKgDose = doseTakenRaw / weightKg;

    // Define toxic thresholds per medication
    let mildToxicDose = 0;
    let severeToxicDose = 0;
    let medName = "";
    if (inputs.medication === "ibuprofen") {
      mildToxicDose = 50;
      severeToxicDose = 100;
      medName = "Ibuprofen";
    } else if (inputs.medication === "acetaminophen") {
      mildToxicDose = 75;
      severeToxicDose = 100;
      medName = "Acetaminophen";
    } else {
      return { value: 0, label: "Select a valid medication", subtext: null, warning: null };
    }

    // Determine toxicity level
    let toxicityLabel = "Dose below toxic threshold";
    let warning = null;
    if (mgPerKgDose >= severeToxicDose) {
      toxicityLabel = "Severe toxicity risk! Immediate veterinary care required.";
      warning =
        "This dose exceeds the severe toxicity threshold. Immediate veterinary attention is critical to prevent life-threatening complications.";
    } else if (mgPerKgDose >= mildToxicDose) {
      toxicityLabel = "Mild to moderate toxicity risk. Veterinary consultation recommended.";
      warning =
        "This dose exceeds the mild toxicity threshold. Contact your veterinarian promptly for advice and possible treatment.";
    }

    return {
      value: mgPerKgDose.toFixed(1),
      label: `${medName} dose ingested (mg/kg)`,
      subtext: toxicityLabel,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What is the toxic dose of ibuprofen for dogs?",
      answer: "Ibuprofen becomes toxic to dogs at doses &gt;100 mg/kg body weight, with clinical signs appearing at 50 mg/kg and above. A single 200 mg tablet can be dangerous for small dogs under 20 lbs.",
    },
    {
      question: "Is acetaminophen safe for dogs?",
      answer: "Acetaminophen is toxic to dogs at doses &gt;150 mg/kg and should generally be avoided entirely. Even small amounts can cause liver damage and hemolytic anemia in canines.",
    },
    {
      question: "How do I calculate my dog's risk from accidental medication exposure?",
      answer: "Input your dog's weight in pounds, the medication type (ibuprofen or acetaminophen), and the dose ingested in milligrams. The calculator compares it against toxic thresholds to determine risk level.",
    },
    {
      question: "What should I do if my dog ingested ibuprofen or acetaminophen?",
      answer: "Contact your veterinarian or poison control immediately; do not wait for symptoms. Time is critical—activated charcoal and supportive care within 2-4 hours can prevent serious harm.",
    },
    {
      question: "How long does ibuprofen toxicity take to develop in dogs?",
      answer: "Signs of ibuprofen toxicity can appear within 2-4 hours, including vomiting, abdominal pain, and dark stools; liver and kidney damage may develop over 24-72 hours if untreated.",
    },
    {
      question: "Can a small dose of acetaminophen harm my dog?",
      answer: "Yes—acetaminophen has no true safe margin in dogs; even a single dose of 500 mg or more can cause hepatotoxicity and Heinz body anemia depending on the dog's size and health status.",
    },
    {
      question: "What factors increase my dog's risk from NSAIDs like ibuprofen?",
      answer: "Pre-existing kidney disease, dehydration, age over 7 years, and concurrent medications increase toxicity risk significantly, requiring even lower safe exposure thresholds.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
              Dog Weight ({unit === "lb" ? "lbs" : "kg"})
            </Label>
            <Input
              id="weight"
              type="number"
              min={0}
              step="any"
              placeholder={`Enter dog weight in ${unit === "lb" ? "lbs" : "kg"}`}
              value={inputs.weight}
              onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="medication" className="text-slate-700 dark:text-slate-300">
              Medication
            </Label>
            <Select
              value={inputs.medication}
              onValueChange={(value) => setInputs({ ...inputs, medication: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ibuprofen">Ibuprofen</SelectItem>
                <SelectItem value="acetaminophen">Acetaminophen (Tylenol)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="doseTaken" className="text-slate-700 dark:text-slate-300">
              Estimated Dose Taken (mg)
            </Label>
            <Input
              id="doseTaken"
              type="number"
              min={0}
              step="any"
              placeholder="Enter amount ingested in mg"
              value={inputs.doseTaken}
              onChange={(e) => setInputs({ ...inputs, doseTaken: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", medication: "ibuprofen", doseTaken: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps pet owners assess the severity of accidental medication exposure by comparing the ingested dose against established veterinary toxicity thresholds for dogs. It provides immediate risk classification to guide whether emergency veterinary care is needed.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your dog's current weight in pounds, select the medication type (ibuprofen or acetaminophen), and input the total dose ingested in milligrams. Accurate weight and dose information is critical for correct risk assessment.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results are categorized as minimal, mild, moderate, severe, or life-threatening risk. Any result above minimal warrants immediate veterinary contact; do not rely solely on this tool for medical decisions.</p>
        </div>
      </section>

      {/* TABLE: Ibuprofen Toxicity Thresholds in Dogs */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Ibuprofen Toxicity Thresholds in Dogs</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference thresholds for ibuprofen toxicity based on body weight and dose.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mild Risk (&gt;25 mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Risk (&gt;50 mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Severe Risk (&gt;100 mg/kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">112 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">225 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">450 mg</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">282 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">565 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,130 mg</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">567 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,135 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,270 mg</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">850 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,700 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,400 mg</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,135 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,270 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,540 mg</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Doses &gt;100 mg/kg are potentially life-threatening; &lt;50 mg/kg may cause gastrointestinal upset; 50-100 mg/kg risks organ damage.</p>
      </section>

      {/* TABLE: Acetaminophen Toxicity Thresholds in Dogs */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Acetaminophen Toxicity Thresholds in Dogs</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference thresholds for acetaminophen toxicity—note there is minimal safe margin for canines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">At-Risk Threshold (&gt;50 mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxic Range (&gt;100 mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Life-Threatening (&gt;150 mg/kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">225 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">450 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">675 mg</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">565 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,130 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,695 mg</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,135 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,270 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,405 mg</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,700 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,400 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,100 mg</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,270 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,540 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,810 mg</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Acetaminophen should be avoided entirely in dogs; even low doses carry hepatotoxicity and hemolytic anemia risks.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify the medication dosage on the bottle label—a standard ibuprofen tablet is 200 mg and acetaminophen is often 325–500 mg per tablet.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your dog before using the calculator; medication risk scales directly with body weight, so accurate weight is essential for proper assessment.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep all human medications in locked cabinets or high shelves; dogs can open pill bottles and consume multiple tablets, escalating exposure rapidly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If your dog ingests any amount of acetaminophen, contact your vet immediately—there is no truly safe margin, and early intervention is lifesaving.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing milligrams with milliliters</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">This calculator requires dose in milligrams (mg), not milliliters (mL); liquid medications have different concentrations and require separate dosing calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating multiple-tablet ingestion</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dogs often swallow multiple tablets at once; always count how many pills are missing from the bottle, as one tablet underestimation can shift risk categories.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring time elapsed since ingestion</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">This calculator does not account for time passed; toxicity risk increases if several hours have elapsed without veterinary intervention, so act quickly regardless of initial risk level.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming small dogs tolerate NSAIDs better</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Small dogs (&lt;20 lbs) are at higher risk per dose ingested due to lower body weight, making even pediatric doses potentially dangerous for Chihuahuas and toy breeds.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the toxic dose of ibuprofen for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Ibuprofen becomes toxic to dogs at doses &gt;100 mg/kg body weight, with clinical signs appearing at 50 mg/kg and above. A single 200 mg tablet can be dangerous for small dogs under 20 lbs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is acetaminophen safe for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Acetaminophen is toxic to dogs at doses &gt;150 mg/kg and should generally be avoided entirely. Even small amounts can cause liver damage and hemolytic anemia in canines.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my dog's risk from accidental medication exposure?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Input your dog's weight in pounds, the medication type (ibuprofen or acetaminophen), and the dose ingested in milligrams. The calculator compares it against toxic thresholds to determine risk level.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if my dog ingested ibuprofen or acetaminophen?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Contact your veterinarian or poison control immediately; do not wait for symptoms. Time is critical—activated charcoal and supportive care within 2-4 hours can prevent serious harm.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does ibuprofen toxicity take to develop in dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Signs of ibuprofen toxicity can appear within 2-4 hours, including vomiting, abdominal pain, and dark stools; liver and kidney damage may develop over 24-72 hours if untreated.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can a small dose of acetaminophen harm my dog?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—acetaminophen has no true safe margin in dogs; even a single dose of 500 mg or more can cause hepatotoxicity and Heinz body anemia depending on the dog's size and health status.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors increase my dog's risk from NSAIDs like ibuprofen?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pre-existing kidney disease, dehydration, age over 7 years, and concurrent medications increase toxicity risk significantly, requiring even lower safe exposure thresholds.</p>
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">24/7 emergency poison control hotline and toxicology database for pets exposed to medications and toxins.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com/toxicology/nsaids/ibuprofen" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Merck Veterinary Manual: Ibuprofen Toxicity in Animals</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical reference on ibuprofen toxicity mechanisms, signs, and treatment protocols in dogs and cats.</p>
          </li>
          <li>
            <a href="https://www.petpoisonhelpline.com/poison/acetaminophen/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Poison Helpline: Acetaminophen Toxicity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based overview of acetaminophen toxicity in pets, including dose-response and emergency care guidelines.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources/pet-owners/petcare" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association: Emergency Care Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative guidance on when to seek emergency veterinary care for medication overdose and toxin exposure.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)"
      description="Alert tool for accidental exposure to common human pain relievers like **Ibuprofen** or **Acetaminophen (Tylenol)**."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: mg/kg = total mg ingested ÷ dog weight (kg)
      formula={{
        title: "Scientific Formula",
        formula: "mg/kg = Dose Ingested (mg) ÷ Dog Weight (kg)",
        variables: [
          { symbol: "mg/kg", description: "Dose per kilogram of dog body weight" },
          { symbol: "Dose Ingested (mg)", description: "Total amount of medication ingested in milligrams" },
          { symbol: "Dog Weight (kg)", description: "Dog's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30 lb (13.6 kg) dog accidentally ingests two 200 mg ibuprofen tablets (total 400 mg). The owner wants to assess toxicity risk.",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert dog weight to kilograms if needed: 30 lbs ÷ 2.20462 = 13.6 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate mg/kg dose: 400 mg ÷ 13.6 kg = 29.4 mg/kg, which is below the mild toxicity threshold of 50 mg/kg for ibuprofen.",
          },
        ],
        result:
          "The ingested dose is below the mild toxicity threshold but still warrants veterinary consultation due to individual sensitivity and potential delayed effects.",
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
        { id: "what-is", label: "Understanding Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)" },
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
