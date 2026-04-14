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

export default function DogMacadamiaNutToxicityCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    nutsConsumed: "",
  });

  // 2. LOGIC ENGINE
  /**
   * Veterinary literature indicates that macadamia nut toxicity in dogs can occur at doses as low as 2.4 grams per kilogram of body weight.
   * Symptoms typically appear within 12 hours and include weakness, ataxia, tremors, and hyperthermia.
   * This calculator estimates the risk level based on the dog's weight and the amount of macadamia nuts ingested.
   * 
   * Formula:
   * Dose (g/kg) = Total grams of nuts consumed / Dog's weight in kg
   * Toxicity threshold = 2.4 g/kg (lowest reported toxic dose)
   * 
   * Risk assessment:
   * - Dose < 2.4 g/kg: Low risk, monitor closely.
   * - Dose ≥ 2.4 g/kg and < 5 g/kg: Moderate risk, veterinary consultation recommended.
   * - Dose ≥ 5 g/kg: High risk, immediate veterinary care advised.
   */
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const nutsRaw = parseFloat(inputs.nutsConsumed);
    if (!weightRaw || weightRaw <= 0 || !nutsRaw || nutsRaw <= 0)
      return { value: 0, label: "Enter valid details...", subtext: null, warning: null };

    const weightKg = weightToKg(weightRaw, unit);

    // Dose in grams per kg
    const dose = nutsRaw / weightKg;

    // Risk assessment
    let riskLabel = "";
    let warning = null;

    if (dose < 2.4) {
      riskLabel = "Low Risk: Monitor your dog closely for symptoms.";
    } else if (dose >= 2.4 && dose < 5) {
      riskLabel = "Moderate Risk: Veterinary consultation is recommended.";
      warning = "Symptoms may develop; early veterinary intervention can improve outcomes.";
    } else {
      riskLabel = "High Risk: Immediate veterinary care is necessary!";
      warning = "Severe toxicity likely; do not delay seeking emergency veterinary attention.";
    }

    return {
      value: dose.toFixed(2),
      label: `${riskLabel} (Dose: ${dose.toFixed(2)} g/kg)`,
      subtext:
        "Macadamia nut toxicity threshold is approximately 2.4 g/kg body weight. This calculator estimates exposure risk based on ingestion.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "How much macadamia nuts are toxic to dogs?",
      answer: "Dogs can show toxicity symptoms at doses as low as 0.7-2.0 grams per kilogram of body weight, making even small quantities dangerous for smaller breeds.",
    },
    {
      question: "What is the toxic compound in macadamia nuts for dogs?",
      answer: "The specific toxic compound remains unidentified, but macadamia nuts cause neurotoxicity affecting the nervous system within 6-12 hours of ingestion.",
    },
    {
      question: "How do I use the macadamia toxicity calculator with my dog's weight?",
      answer: "Enter your dog's weight in pounds or kilograms, then input the number of macadamia nuts consumed to receive a toxicity risk assessment.",
    },
    {
      question: "What symptoms appear if my dog ate macadamia nuts?",
      answer: "Symptoms include tremors, weakness, vomiting, hyperthermia, and ataxia appearing 6-12 hours after ingestion, typically resolving within 24-48 hours.",
    },
    {
      question: "Is the calculator accurate for all dog breeds and sizes?",
      answer: "Yes, the calculator adjusts toxicity thresholds based on body weight, making it reliable for dogs ranging from toy breeds to large breeds.",
    },
    {
      question: "What should I do if the calculator shows high toxicity risk?",
      answer: "Contact your veterinarian or animal poison control immediately; activated charcoal or gastric lavage may be recommended within 6 hours of ingestion.",
    },
    {
      question: "Are roasted macadamia nuts more toxic than raw ones?",
      answer: "Roasting doesn't reduce toxicity; both raw and roasted macadamia nuts contain the same toxic compounds and pose equal risk to dogs.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
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
            placeholder={`Enter dog's weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Accurate weight is essential for toxicity risk calculation.
          </p>
        </div>

        {/* Nuts Consumed Input */}
        <div>
          <Label htmlFor="nutsConsumed" className="text-slate-700 dark:text-slate-300">
            Estimated Macadamia Nuts Consumed (grams)
          </Label>
          <Input
            id="nutsConsumed"
            name="nutsConsumed"
            type="number"
            min="0"
            step="any"
            placeholder="Enter total grams of macadamia nuts ingested"
            value={inputs.nutsConsumed}
            onChange={handleInputChange}
            aria-describedby="nuts-desc"
          />
          <p id="nuts-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Weigh or estimate the total grams of nuts your dog ate.
          </p>
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
          onClick={() => setInputs({ weight: "", nutsConsumed: "" })}
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
                Estimated Toxic Dose
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value} g/kg</p>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and treatment.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Macadamia Nut Toxicity Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates whether your dog has consumed a toxic amount of macadamia nuts based on scientific toxicity thresholds. It helps determine if veterinary care is urgently needed.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your dog's weight in either pounds or kilograms, then enter the exact number of macadamia nuts your dog consumed. The calculator will instantly compute the ingested dose relative to your dog's body weight.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results indicate low, moderate, or high toxicity risk. High-risk cases require immediate veterinary attention, while moderate cases warrant monitoring for symptoms like tremors, weakness, and vomiting over the next 12 hours.</p>
        </div>
      </section>

      {/* TABLE: Macadamia Nut Toxicity Thresholds by Dog Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Macadamia Nut Toxicity Thresholds by Dog Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this reference table to understand baseline toxicity risk before using the calculator.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxic Dose (nuts)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Approximate Threshold (g)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.6-4.6</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.2-9.0</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-23</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.9-22.6</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.9-45.4</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-68</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23.8-68.0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32-91</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31.8-91.0</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Toxic dose varies based on individual sensitivity; lower weights represent higher risk per nut consumed.</p>
      </section>

      {/* TABLE: Symptom Timeline and Severity Assessment */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Symptom Timeline and Severity Assessment</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Macadamia nut toxicity symptoms follow a predictable timeline based on ingestion amount.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time After Ingestion</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mild Symptoms</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Symptoms</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Severe Symptoms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2-6 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lethargy, mild tremors</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vomiting, weakness</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe tremors, hyperthermia</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Weakness, decreased appetite</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ataxia, inability to stand</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Paralysis, severe hyperthermia &gt;105°F</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12-24 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Continued weakness</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Recovery begins</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Continued weakness, veterinary care needed</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24-48 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Full recovery</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Nearly recovered</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Most recover with treatment</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Severity depends on dose relative to body weight; smaller dogs experience worse symptoms from the same number of nuts.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Call animal poison control (888-426-4435) immediately if the calculator shows high toxicity risk, even before symptoms appear.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Count nuts carefully—macadamia nuts vary in size, but the calculator uses average weight of 2 grams per nut for accuracy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your dog's temperature during the 6-12 hour window post-ingestion, as hyperthermia is a serious secondary concern requiring cooling measures.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep all macadamia products (nuts, nut butters, baked goods) stored in secure, elevated locations away from curious dogs.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming macadamia nut butter is safer</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Macadamia nut butter contains the same toxic compounds as whole nuts and poses identical toxicity risk to dogs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Only considering the largest dog in a multi-dog household</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Smaller dogs in the home face higher toxicity risk from the same number of nuts; calculate individually for each dog.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Waiting for symptoms before seeking veterinary care</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">High toxicity cases warrant immediate veterinary attention before symptoms develop; treatment is more effective within 6 hours of ingestion.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for macadamia nuts in desserts and granola</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Baked goods and granola bars containing macadamia nuts are equally toxic; count all sources of ingestion for accurate calculation.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much macadamia nuts are toxic to dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dogs can show toxicity symptoms at doses as low as 0.7-2.0 grams per kilogram of body weight, making even small quantities dangerous for smaller breeds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the toxic compound in macadamia nuts for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The specific toxic compound remains unidentified, but macadamia nuts cause neurotoxicity affecting the nervous system within 6-12 hours of ingestion.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I use the macadamia toxicity calculator with my dog's weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your dog's weight in pounds or kilograms, then input the number of macadamia nuts consumed to receive a toxicity risk assessment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What symptoms appear if my dog ate macadamia nuts?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Symptoms include tremors, weakness, vomiting, hyperthermia, and ataxia appearing 6-12 hours after ingestion, typically resolving within 24-48 hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is the calculator accurate for all dog breeds and sizes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator adjusts toxicity thresholds based on body weight, making it reliable for dogs ranging from toy breeds to large breeds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if the calculator shows high toxicity risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Contact your veterinarian or animal poison control immediately; activated charcoal or gastric lavage may be recommended within 6 hours of ingestion.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are roasted macadamia nuts more toxic than raw ones?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Roasting doesn't reduce toxicity; both raw and roasted macadamia nuts contain the same toxic compounds and pose equal risk to dogs.</p>
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official resource for pet poisoning emergencies with 24/7 hotline and toxicity database for thousands of substances.</p>
          </li>
          <li>
            <a href="https://www.petpoisonhelpline.com/poison/macadamia-nuts/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Poison Helpline - Macadamia Nuts</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide to macadamia nut toxicity in dogs with symptom timeline and treatment recommendations.</p>
          </li>
          <li>
            <a href="https://www.vin.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network - Macadamia Toxicity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed veterinary research on macadamia nut poisoning mechanisms and clinical management in dogs.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/avma-policies/toxic-foods-dogs-and-cats" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association Pet Toxins List</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AVMA-endorsed list of toxic foods for pets including macadamia nuts with safe and unsafe guidelines.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Macadamia Nut Toxicity Calculator"
      description="Assess the risk of macadamia nut poisoning, which causes severe weakness and elevated body temperature."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Dose (g/kg) = Total grams of macadamia nuts consumed ÷ Dog's weight in kilograms",
        variables: [
          { symbol: "Dose (g/kg)", description: "Estimated toxic dose per kilogram of dog's body weight" },
          { symbol: "Total grams of macadamia nuts consumed", description: "Weight of nuts ingested by the dog in grams" },
          { symbol: "Dog's weight in kilograms", description: "Body weight of the dog in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 20 lb (9.07 kg) dog ingests approximately 30 grams of macadamia nuts from a spilled snack bag.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert the dog's weight to kilograms if using imperial units: 20 lbs ÷ 2.20462 = 9.07 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate the dose: 30 grams ÷ 9.07 kg = 3.31 g/kg, which exceeds the 2.4 g/kg toxicity threshold.",
          },
          {
            label: "Step 3",
            explanation:
              "Interpret the result: 3.31 g/kg indicates moderate risk; veterinary consultation is recommended.",
          },
        ],
        result:
          "The dog is at moderate risk of macadamia nut toxicity and should be monitored closely with prompt veterinary evaluation advised.",
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
        { id: "what-is", label: "Understanding Dog Macadamia Nut Toxicity Calculator" },
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
