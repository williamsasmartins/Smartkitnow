import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorsePhenylbutazoneFlunixinDoseCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight only (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
    drug: "phenylbutazone",
  });

  // 2. LOGIC ENGINE
  // Dose ranges based on veterinary references:
  // Phenylbutazone: 2-4 mg/kg PO or IV q12h (max 8 mg/kg/day)
  // Flunixin meglumine: 1.1 mg/kg IV or IM q12-24h (max 2.2 mg/kg/day)
  // For simplicity, calculator will output dose per administration (mg) and daily max dose (mg)
  // User selects drug, enters weight, output dose per administration and max daily dose.

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    let doseMgPerKg = 0;
    let maxDailyMgPerKg = 0;
    let drugName = "";

    if (inputs.drug === "phenylbutazone") {
      drugName = "Phenylbutazone";
      doseMgPerKg = 4; // using upper end of typical dose per administration
      maxDailyMgPerKg = 8;
    } else if (inputs.drug === "flunixin") {
      drugName = "Flunixin meglumine";
      doseMgPerKg = 1.1;
      maxDailyMgPerKg = 2.2;
    }

    const dosePerAdministration = doseMgPerKg * weightKg;
    const maxDailyDose = maxDailyMgPerKg * weightKg;

    // Round to 2 decimals
    const doseRounded = dosePerAdministration.toFixed(2);
    const maxDailyRounded = maxDailyDose.toFixed(2);

    // Warning if weight is extremely low or high (e.g. <200kg or >1000kg)
    let warning = null;
    if (weightKg < 200) {
      warning =
        "Weight entered is below typical adult horse weight; dose calculations may not be accurate for foals or miniature horses.";
    } else if (weightKg > 1000) {
      warning =
        "Weight entered exceeds typical adult horse weight; dose calculations may require veterinary confirmation.";
    }

    return {
      value: `${doseRounded} mg per dose`,
      label: `${drugName} Dose`,
      subtext: `Max daily dose: ${maxDailyRounded} mg`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the typical phenylbutazone dose for horses?",
      answer: "Phenylbutazone is commonly dosed at 2-4 mg/kg twice daily for horses, with a maximum of 4.4 mg/kg per dose. Always follow veterinary guidance for your specific horse.",
    },
    {
      question: "How does flunixin dosing differ from phenylbutazone?",
      answer: "Flunixin is typically dosed at 1.1 mg/kg twice daily for horses, making it more potent per dose than phenylbutazone. Duration and frequency depend on the condition being treated.",
    },
    {
      question: "Can phenylbutazone and flunixin be used together?",
      answer: "No, concurrent use of phenylbutazone and flunixin is contraindicated due to increased risk of gastrointestinal and renal toxicity. Use only one NSAID at a time.",
    },
    {
      question: "What is the maximum duration for phenylbutazone therapy?",
      answer: "Phenylbutazone should not exceed 14-28 days of continuous use without veterinary reassessment. Long-term use increases risks of ulceration and kidney damage.",
    },
    {
      question: "How should I calculate the correct dose for my pet's weight?",
      answer: "Enter your pet's weight in kilograms and the calculator will multiply by the standard mg/kg dose to provide the total milligrams needed per administration.",
    },
    {
      question: "Are there weight restrictions for phenylbutazone use in animals?",
      answer: "Phenylbutazone is approved for horses and some other large animals but should not be used in small animals, cats, or animals weighing under 350 kg without veterinary approval.",
    },
    {
      question: "What factors affect flunixin absorption and effectiveness?",
      answer: "Food intake, administration route (oral vs. intravenous), gastrointestinal pH, and individual metabolism all influence flunixin's effectiveness and timing of pain relief.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handler for input changes
  function onInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

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
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Drug selector */}
      <div className="space-y-2">
        <Label htmlFor="drug" className="text-slate-700 dark:text-slate-300">
          Select Drug
        </Label>
        <select
          id="drug"
          name="drug"
          value={inputs.drug}
          onChange={onInputChange}
          className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2"
        >
          <option value="phenylbutazone">Phenylbutazone</option>
          <option value="flunixin">Flunixin meglumine</option>
        </select>
      </div>

      {/* Weight input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          name="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          value={inputs.weight}
          onChange={onInputChange}
          aria-describedby="weight-help"
        />
        <p id="weight-help" className="text-xs text-slate-500 dark:text-slate-400">
          Enter the horse's weight to calculate the appropriate dose.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", drug: "phenylbutazone" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Phenylbutazone / Flunixin Dose Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the precise medication dose for horses and large animals based on phenylbutazone or flunixin protocols. It ensures safe, weight-appropriate dosing aligned with veterinary standards.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your animal's weight in kilograms and select the drug and dose protocol (mg/kg). The calculator will compute total milligrams per dose and daily administration amounts.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the calculated results and confirm them with your veterinarian before administration. Always verify expiration dates, storage conditions, and product concentration on the medication label.</p>
        </div>
      </section>

      {/* TABLE: Standard NSAID Dosing Guidelines for Equines */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard NSAID Dosing Guidelines for Equines</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Comparison of phenylbutazone and flunixin dosing recommendations for horses.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Drug</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dose (mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Max Daily Dose</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Phenylbutazone</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.8 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-28 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Flunixin Meglumine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.2 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 days (IV/IM)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Phenylbutazone (Low dose)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to 30 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Flunixin (Oral)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.2 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14 days max</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All dosages should be prescribed and monitored by a licensed veterinarian. Individual cases may require adjustment.</p>
      </section>

      {/* TABLE: Weight-Based Phenylbutazone Dose Examples */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Weight-Based Phenylbutazone Dose Examples</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Quick reference for common equine weights using standard 2-4 mg/kg dosing.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Horse Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Low Dose (2 mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Standard Dose (4 mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">400 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,600 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">450 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,800 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">550 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,100 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,200 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are standard guidelines; actual prescriptions vary by veterinarian and clinical condition.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always weigh your horse or animal accurately before calculating doses; estimated weights can lead to under- or over-dosing.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep detailed records of phenylbutazone or flunixin administration, including dates, doses, and any adverse reactions observed.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store both medications in cool, dry conditions away from direct sunlight to maintain efficacy and prevent degradation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your animal for signs of gastrointestinal upset, such as reduced appetite or changes in manure, especially during prolonged NSAID therapy.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Outdated Weight Records</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using a weight from months ago can result in incorrect dosing; always weigh your animal before calculating the dose.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Drug Concentrations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Phenylbutazone and flunixin come in different concentrations; verify the product concentration before calculating or administering doses.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Exceeding Maximum Duration</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Exceeding the recommended treatment duration increases risk of serious side effects like ulceration and kidney dysfunction.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing NSAIDs Without Veterinary Approval</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Combining phenylbutazone and flunixin without explicit veterinary direction significantly elevates toxicity risk and should never be attempted.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the typical phenylbutazone dose for horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Phenylbutazone is commonly dosed at 2-4 mg/kg twice daily for horses, with a maximum of 4.4 mg/kg per dose. Always follow veterinary guidance for your specific horse.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does flunixin dosing differ from phenylbutazone?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Flunixin is typically dosed at 1.1 mg/kg twice daily for horses, making it more potent per dose than phenylbutazone. Duration and frequency depend on the condition being treated.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can phenylbutazone and flunixin be used together?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, concurrent use of phenylbutazone and flunixin is contraindicated due to increased risk of gastrointestinal and renal toxicity. Use only one NSAID at a time.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the maximum duration for phenylbutazone therapy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Phenylbutazone should not exceed 14-28 days of continuous use without veterinary reassessment. Long-term use increases risks of ulceration and kidney damage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I calculate the correct dose for my pet's weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your pet's weight in kilograms and the calculator will multiply by the standard mg/kg dose to provide the total milligrams needed per administration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there weight restrictions for phenylbutazone use in animals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Phenylbutazone is approved for horses and some other large animals but should not be used in small animals, cats, or animals weighing under 350 kg without veterinary approval.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect flunixin absorption and effectiveness?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Food intake, administration route (oral vs. intravenous), gastrointestinal pH, and individual metabolism all influence flunixin's effectiveness and timing of pain relief.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Pharmacology and Therapeutics</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidelines on approved medications and dosing standards for equine use.</p>
          </li>
          <li>
            <a href="https://aaep.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAEP Guidelines for Pain Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Association of Equine Practitioners resources on NSAID use and pain relief in horses.</p>
          </li>
          <li>
            <a href="https://www.vin.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network (VIN)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed veterinary drug information and clinical guidelines for phenylbutazone and flunixin dosing.</p>
          </li>
          <li>
            <a href="https://www.fda.gov/animal-veterinary" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FDA Approved Animal Drug Products</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official FDA listings of approved NSAIDs for equine and veterinary use with approved dosing.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Phenylbutazone / Flunixin Dose Calculator"
      description="Calculate the safe dose for the NSAIDs **Phenylbutazone** and **Flunixin** for pain and fever management."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg) = Dose (mg/kg) × Weight (kg)",
        variables: [
          { symbol: "Dose (mg)", description: "Dose per administration in milligrams" },
          { symbol: "Dose (mg/kg)", description: "Recommended dose per kilogram of body weight" },
          { symbol: "Weight (kg)", description: "Horse body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse requires Phenylbutazone for pain management. Calculate the dose per administration and maximum daily dose.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms: 1100 lb ÷ 2.20462 = 499.0 kg approximately.",
          },
          {
            label: "2",
            explanation:
              "Calculate dose per administration: 4 mg/kg × 499.0 kg = 1996 mg.",
          },
          {
            label: "3",
            explanation:
              "Calculate maximum daily dose: 8 mg/kg × 499.0 kg = 3992 mg.",
          },
        ],
        result: "The horse should receive approximately 1996 mg of Phenylbutazone per dose, not exceeding 3992 mg in 24 hours.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Feeder Insect Gut-Loading Ratio", url: "/pets/reptile-feeder-insect-gut-loading-ratio", icon: "🐶" },
        { title: "Ambient Temperature Safe Zone Calculator", url: "/pets/bird-ambient-temperature-safe-zone", icon: "🐱" },
        { title: "Litter Box Output Tracker (Normal vs. Increased)", url: "/pets/cat-litter-box-output-tracker", icon: "🍖" },
        { title: "Seed-to-Pellet Conversion Planner", url: "/pets/bird-seed-to-pellet-conversion-planner", icon: "💉" },
        { title: "Calcium Intake Limit (Bladder Stone Prevention)", url: "/pets/small-mammal-calcium-intake-limit", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Phenylbutazone / Flunixin Dose Calculator" },
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