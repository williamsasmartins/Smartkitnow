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

export default function DogGrapeRaisinExposureRiskCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    grapesCount: "",
    raisinsGrams: "",
  });

  // 2. LOGIC ENGINE
  // Toxic dose thresholds from veterinary toxicology literature:
  // Grapes: Toxic dose ~ 0.7 g/kg (fresh grapes)
  // Raisins: Toxic dose ~ 0.3 g/kg (dried grapes)
  // We will convert counts of grapes to grams assuming average grape weight ~5g
  // Raisins input is already in grams

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const grapesCountRaw = parseFloat(inputs.grapesCount);
    const raisinsGramsRaw = parseFloat(inputs.raisinsGrams);

    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid dog weight.",
        subtext: null,
        warning: null,
      };
    }

    if (
      (!grapesCountRaw || grapesCountRaw < 0) &&
      (!raisinsGramsRaw || raisinsGramsRaw < 0)
    ) {
      return {
        value: 0,
        label: "Please enter the amount of grapes or raisins ingested.",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Convert grapes count to grams (avg grape ~5g)
    const grapesGrams = grapesCountRaw && grapesCountRaw > 0 ? grapesCountRaw * 5 : 0;

    // Raisins grams input is direct

    // Total toxicant grams ingested
    const totalGrapeEquivalentGrams = grapesGrams + raisinsGramsRaw;

    // Calculate dose per kg
    const doseGPerKg = totalGrapeEquivalentGrams / weightKg;

    // Toxic thresholds (g/kg)
    const toxicDoseGrape = 0.7; // grapes fresh
    const toxicDoseRaisin = 0.3; // raisins dried

    // Since raisins are more toxic, we weight raisins more:
    // We can calculate a weighted toxic dose threshold:
    // weightedDose = (grapesGrams / toxicDoseGrape + raisinsGramsRaw / toxicDoseRaisin) / weightKg
    // But for simplicity, we calculate dose per kg and compare to raisin threshold (more conservative)

    // Risk assessment:
    // If doseGPerKg >= 0.3 (raisin toxic dose), HIGH risk
    // If doseGPerKg >= 0.1 but < 0.3, MODERATE risk
    // Else LOW risk

    let riskLevel = "Low Risk";
    let warning = null;

    if (doseGPerKg >= toxicDoseRaisin) {
      riskLevel = "High Risk";
      warning =
        "This dose exceeds the known toxic threshold for raisins. Immediate veterinary attention is strongly recommended.";
    } else if (doseGPerKg >= 0.1) {
      riskLevel = "Moderate Risk";
      warning =
        "This dose is approaching toxic levels. Veterinary consultation is advised to evaluate your dog's condition.";
    }

    // Round dose to 2 decimals
    const doseRounded = doseGPerKg.toFixed(2);

    return {
      value: doseRounded,
      label: `${riskLevel} of Grape/Raisin Toxicity (g/kg)`,
      subtext:
        "Dose calculated as total grams ingested divided by dog weight in kg. Toxicity thresholds: Raisins ~0.3 g/kg, Grapes ~0.7 g/kg.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What is the toxic dose of grapes for dogs?",
      answer: "The toxic dose starts at approximately 0.32 ounces (9 grams) of grapes per kilogram of body weight, though some dogs show sensitivity at lower amounts. Individual sensitivity varies significantly between dogs.",
    },
    {
      question: "Are raisins more toxic than fresh grapes?",
      answer: "Yes, raisins are more concentrated and potentially more toxic than fresh grapes due to their dehydrated nature. A smaller amount of raisins can cause the same harm as a larger quantity of fresh grapes.",
    },
    {
      question: "What dog size is most at risk from grape exposure?",
      answer: "Smaller dogs weighing under 20 pounds face higher risk because even a few grapes represent a larger percentage of their body weight. A 10-pound dog is at greater risk than an 80-pound dog consuming the same number of grapes.",
    },
    {
      question: "How does this calculator determine risk level?",
      answer: "The calculator compares your dog's weight and grape/raisin quantity consumed against known toxicity thresholds to estimate mild, moderate, or severe risk exposure.",
    },
    {
      question: "What symptoms appear after grape toxicity exposure?",
      answer: "Symptoms typically include vomiting, diarrhea, lethargy, and loss of appetite within 6-12 hours, with kidney damage risk developing over subsequent days.",
    },
    {
      question: "Should I contact a vet for any exposure level?",
      answer: "Yes, contact your veterinarian or poison control immediately for any confirmed grape or raisin ingestion, regardless of calculated risk level, as individual sensitivity is unpredictable.",
    },
    {
      question: "Can this calculator replace professional veterinary advice?",
      answer: "No, this calculator is an educational tool only and cannot diagnose poisoning. Always consult your veterinarian for professional evaluation and treatment.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setInputs({ weight: "", grapesCount: "", raisinsGrams: "" });
  };

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
              placeholder={unit === "lb" ? "e.g. 30" : "e.g. 13.6"}
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="grapesCount" className="text-slate-700 dark:text-slate-300">
              Number of Grapes Ingested (approximate)
            </Label>
            <Input
              id="grapesCount"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 10"
              value={inputs.grapesCount}
              onChange={(e) => handleInputChange("grapesCount", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="raisinsGrams" className="text-slate-700 dark:text-slate-300">
              Weight of Raisins Ingested (grams)
            </Label>
            <Input
              id="raisinsGrams"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 15"
              value={inputs.raisinsGrams}
              onChange={(e) => handleInputChange("raisinsGrams", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Grape/Raisin Exposure Risk Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates your dog's exposure risk after accidental grape or raisin ingestion by comparing the quantity consumed against your dog's body weight and known toxicity thresholds. It provides an immediate risk assessment to help guide your decision to contact emergency veterinary care.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your dog's weight in pounds and the estimated number of grapes or raisins consumed. The calculator accepts fresh grapes, seedless grapes, and raisins, accounting for their varying potency levels.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results display as low, moderate, or severe risk, along with recommended actions. Remember this is an educational tool only—always contact your veterinarian immediately regardless of the calculated risk level, as individual sensitivity varies unpredictably.</p>
        </div>
      </section>

      {/* TABLE: Grape & Raisin Toxicity Thresholds by Dog Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Grape & Raisin Toxicity Thresholds by Dog Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference thresholds showing approximate quantities of grapes and raisins that may pose toxic risk.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Grapes (Low Risk)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Grapes (Moderate Risk)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Raisins (Toxic Range)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 lbs (4.5 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-3 grapes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-8 grapes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-5 raisins</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25 lbs (11 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-7 grapes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-15 grapes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-12 raisins</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50 lbs (22 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-15 grapes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-30 grapes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-25 raisins</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75 lbs (34 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-22 grapes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23-45 grapes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-38 raisins</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100 lbs (45 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-30 grapes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31-60 grapes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-50 raisins</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are general reference ranges; individual dog sensitivity varies. Any ingestion warrants veterinary contact.</p>
      </section>

      {/* TABLE: Timeline of Grape Toxicity Symptoms in Dogs */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Timeline of Grape Toxicity Symptoms in Dogs</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Expected symptom progression following grape or raisin ingestion.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time Frame</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Symptom Onset</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Critical Signs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Medical Urgency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0-2 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Possible nausea, drooling</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rare at this stage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Contact vet if ingestion confirmed</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vomiting, diarrhea, lethargy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Loss of appetite, abdominal pain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Immediate veterinary evaluation required</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12-24 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Continued GI upset, weakness</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Decreased urination, tremors</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Emergency veterinary care essential</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24-72 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Kidney dysfunction signs emerge</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe lethargy, anorexia, vomiting</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical monitoring and treatment needed</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3+ days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Potential acute kidney injury</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Organ failure risk if untreated</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Life-threatening without intervention</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Symptoms vary based on individual sensitivity and quantity consumed. Immediate veterinary contact is critical for any exposure.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Store grapes and raisins in secure cabinets away from curious dogs who may access them during unsupervised time.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Educate family members and visitors about the grape toxicity risk so everyone can help prevent accidental exposure.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Know your veterinarian's emergency contact number and poison control (888-426-4435) before an emergency occurs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your dog for 48-72 hours after any confirmed grape ingestion and maintain hydration support as recommended by your vet.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming seedless grapes are safer</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Seedless and seeded grapes carry identical toxicity risk; the seed is not the toxic component.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Waiting to see symptoms before calling a vet</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Kidney damage can occur without visible symptoms; immediate veterinary contact is critical for decontamination and monitoring.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating raisin quantities</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Raisins are concentrated and significantly more potent than grapes, so a small handful poses serious risk even in large dogs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Relying solely on this calculator for diagnosis</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Individual dog sensitivity varies greatly; this tool estimates risk only and cannot replace professional veterinary evaluation and treatment.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the toxic dose of grapes for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The toxic dose starts at approximately 0.32 ounces (9 grams) of grapes per kilogram of body weight, though some dogs show sensitivity at lower amounts. Individual sensitivity varies significantly between dogs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are raisins more toxic than fresh grapes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, raisins are more concentrated and potentially more toxic than fresh grapes due to their dehydrated nature. A smaller amount of raisins can cause the same harm as a larger quantity of fresh grapes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What dog size is most at risk from grape exposure?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Smaller dogs weighing under 20 pounds face higher risk because even a few grapes represent a larger percentage of their body weight. A 10-pound dog is at greater risk than an 80-pound dog consuming the same number of grapes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does this calculator determine risk level?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator compares your dog's weight and grape/raisin quantity consumed against known toxicity thresholds to estimate mild, moderate, or severe risk exposure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What symptoms appear after grape toxicity exposure?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Symptoms typically include vomiting, diarrhea, lethargy, and loss of appetite within 6-12 hours, with kidney damage risk developing over subsequent days.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I contact a vet for any exposure level?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, contact your veterinarian or poison control immediately for any confirmed grape or raisin ingestion, regardless of calculated risk level, as individual sensitivity is unpredictable.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator replace professional veterinary advice?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, this calculator is an educational tool only and cannot diagnose poisoning. Always consult your veterinarian for professional evaluation and treatment.</p>
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Primary resource for pet toxicology data and emergency guidance for grape and raisin poisoning.</p>
          </li>
          <li>
            <a href="https://www.petpoisonhelpline.com/poison/grapes-raisins/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Poison Helpline</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed clinical information on grape and raisin toxicity mechanisms and treatment protocols.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners/petcare" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based veterinary information on pet poisoning prevention and emergency response.</p>
          </li>
          <li>
            <a href="https://onlinelibrary.wiley.com/journal/14764431" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of Veterinary Emergency and Critical Care</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on canine acute kidney injury following grape toxicity exposure.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Grape/Raisin Exposure Risk Calculator"
      description="Assess the toxic risk following accidental ingestion of grapes or raisins. Provides immediate action guidelines."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "Dose (g/kg) = ( (Number of Grapes × 5 g) + Raisins (g) ) ÷ Dog Weight (kg)",
        variables: [
          { symbol: "Number of Grapes", description: "Approximate count of grapes ingested" },
          { symbol: "5 g", description: "Average weight of one grape" },
          { symbol: "Raisins (g)", description: "Weight of raisins ingested in grams" },
          { symbol: "Dog Weight (kg)", description: "Dog's body weight in kilograms" },
          {
            symbol: "Dose (g/kg)",
            description:
              "Calculated dose of grape/raisin toxicant per kilogram of dog body weight",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 20 lb (9.07 kg) dog accidentally ingests 12 grapes and 10 grams of raisins.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert dog weight to kilograms: 20 lbs ÷ 2.20462 = 9.07 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate total grape equivalent grams: (12 grapes × 5 g) + 10 g raisins = 70 g total.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate dose per kg: 70 g ÷ 9.07 kg = 7.72 g/kg, which exceeds toxic thresholds.",
          },
          {
            label: "Step 4",
            explanation:
              "Result indicates high risk of toxicity; immediate veterinary care is necessary.",
          },
        ],
        result: "Dose = 7.72 g/kg → High Risk of Grape/Raisin Toxicity",
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
        { id: "what-is", label: "Understanding Dog Grape/Raisin Exposure Risk Calculator" },
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
