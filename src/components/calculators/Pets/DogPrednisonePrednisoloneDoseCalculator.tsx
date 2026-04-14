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

export default function DogPrednisonePrednisoloneDoseCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    dosageMgPerKg: "0.5", // default starting dosage mg/kg (typical anti-inflammatory range)
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const dosageRaw = parseFloat(inputs.dosageMgPerKg);
    const perWeightUnitLabel = unit === "kg" ? "mg/kg" : "mg/lb";

    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight.",
        subtext: null,
        warning: null,
      };
    }
    if (!dosageRaw || dosageRaw <= 0) {
      return {
        value: 0,
        label: `Please enter a valid dosage (${perWeightUnitLabel}).`,
        subtext: null,
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);
    const dosageMgPerKg = unit === "kg" ? dosageRaw : dosageRaw * LB_PER_KG;
    const displayedDosage = unit === "kg" ? dosageMgPerKg : dosageMgPerKg / LB_PER_KG;
    const weightUnitLabel = unit === "kg" ? "kg" : "lb";

    // Calculate dose in mg: Dose (mg) = weightKg * dosageMgPerKg
    const doseMg = weightKg * dosageMgPerKg;

    // Round dose to 2 decimals for display
    const doseRounded = Math.round(doseMg * 100) / 100;

    // Warning for high doses (above typical max 2 mg/kg/day)
    let warning = null;
    if (dosageMgPerKg > 2) {
      warning =
        "Dosage exceeds typical maximum recommended dose (2 mg/kg/day). Consult your veterinarian before administering.";
    }

    return {
      value: doseRounded,
      label: `Prednisone/Prednisolone dose for your dog`,
      subtext: `Based on weight ${weightRaw.toFixed(2)} ${weightUnitLabel} and dosage ${formatNumberForInput(displayedDosage, 2)} ${perWeightUnitLabel}.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What is the standard prednisone dosage range for dogs?",
      answer: "Most dogs receive 0.5–1 mg/kg twice daily for anti-inflammatory conditions, though immunosuppressive doses may reach 2–3 mg/kg daily divided into multiple doses.",
    },
    {
      question: "How do I calculate my dog's prednisone dose by weight?",
      answer: "Multiply your dog's weight in kilograms by the prescribed dose per kg (e.g., 10 kg dog × 0.5 mg/kg = 5 mg), then verify with your veterinarian before administering.",
    },
    {
      question: "Is prednisone the same as prednisolone for dogs?",
      answer: "Prednisone requires liver conversion to prednisolone; prednisolone is the active form and preferred for dogs with liver disease, though dosing equivalence is 1:1.",
    },
    {
      question: "How often should I give my dog prednisone or prednisolone?",
      answer: "Standard dosing is typically twice daily (every 12 hours) for acute conditions, though tapering schedules and maintenance doses may shift to once daily or every-other-day regimens.",
    },
    {
      question: "What are common side effects of prednisone in dogs?",
      answer: "Increased thirst, appetite, and urination are frequent; longer-term use may cause hair loss, lethargy, or behavioral changes—always monitor and report concerns to your vet.",
    },
    {
      question: "Can I use this calculator for all dog breeds and sizes?",
      answer: "Yes, the calculator works for all breeds using weight-based dosing, but senior dogs, pregnant dogs, or those with liver/kidney disease may require dose adjustments reviewed by your veterinarian.",
    },
    {
      question: "How long can my dog safely take prednisone?",
      answer: "Short-term use (7–14 days) is generally safe; prolonged use over weeks requires gradual tapering to avoid adrenal insufficiency and close veterinary monitoring for complications.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  // 5. WIDGET JSX
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
              const dosageRaw = parseFloat(inputs.dosageMgPerKg);
              if (Number.isFinite(weightRaw) && weightRaw > 0) {
                const nextWeight = convertWeight(weightRaw, unit, next);
                setInputs((prev) => ({ ...prev, weight: formatNumberForInput(nextWeight, 2) }));
              }
              if (Number.isFinite(dosageRaw) && dosageRaw > 0) {
                const nextDosage =
                  unit === "kg" && next === "lb"
                    ? dosageRaw / LB_PER_KG
                    : unit === "lb" && next === "kg"
                      ? dosageRaw * LB_PER_KG
                      : dosageRaw;
                setInputs((prev) => ({ ...prev, dosageMgPerKg: formatNumberForInput(nextDosage, 4) }));
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
            Dog Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weightHelp"
          />
          <p id="weightHelp" className="text-xs text-slate-500 mt-1">
            Please enter your dog’s current weight.
          </p>
        </div>

        {/* Dosage Input */}
        <div>
          <Label htmlFor="dosageMgPerKg" className="text-slate-700 dark:text-slate-300">
            Dosage ({unit === "kg" ? "mg/kg" : "mg/lb"})
          </Label>
          <Input
            id="dosageMgPerKg"
            name="dosageMgPerKg"
            type="text"
            placeholder={`Typical range: 0.5 - 2 ${unit === "kg" ? "mg/kg" : "mg/lb"}`}
            value={inputs.dosageMgPerKg}
            onChange={handleInputChange}
            aria-describedby="dosageHelp"
          />
          <p id="dosageHelp" className="text-xs text-slate-500 mt-1">
            Enter the prescribed dosage in milligrams per kilogram of body weight.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          aria-label="Calculate Prednisone dose"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", dosageMgPerKg: "0.5" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and treatment.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 6. EDITORIAL JSX
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Prednisone/Prednisolone Dose Calculator for Dogs</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine the appropriate prednisone or prednisolone dose for your dog based on weight and the veterinarian-prescribed mg/kg dosing. It serves as a verification tool to ensure accurate administration and helps you understand your dog's medication regimen.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your dog's current weight in pounds or kilograms and input the dose per kilogram prescribed by your vet (commonly 0.5–1 mg/kg for inflammation or 2–3 mg/kg for immunosuppression). The calculator instantly shows the total dose per administration and daily totals.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the results alongside your veterinarian's written prescription; never alter doses without professional guidance. Use the calculator each time your dog's weight changes or when tapering doses, and always follow your vet's timeline for administration and duration.</p>
        </div>
      </section>

      {/* TABLE: Prednisone/Prednisolone Dosing Guidelines by Condition */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Prednisone/Prednisolone Dosing Guidelines by Condition</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Common veterinary dosing ranges for dogs based on clinical indication.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dose (mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Inflammation/Allergy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5–1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7–14 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Immunosuppression</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14–30 days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Autoimmune Disease</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–90 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Maintenance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.25–0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">As needed</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Shock/Emergency</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 IV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">As directed</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pruritus (Itch)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5–1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–7 days</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All doses must be confirmed by a licensed veterinarian; this table is educational reference only.</p>
      </section>

      {/* TABLE: Prednisone Dosage by Dog Weight */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Prednisone Dosage by Dog Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Quick reference for common dog weights at standard 0.5 mg/kg anti-inflammatory dosing.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dose per Administration (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Twice Daily Total (mg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.3</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.3</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.7</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45.4</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Based on 0.5 mg/kg dose; higher immunosuppressive doses require multiplying by 2–3 and veterinary consultation.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify calculated doses with your veterinarian's prescription before administering to avoid overdosing or underdosing your dog.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Give prednisone with food to reduce stomach upset, and space doses consistently 12 hours apart when dosing twice daily.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep detailed records of dose dates, times, and any side effects observed to share with your veterinarian at follow-up visits.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Never stop prednisone abruptly after prolonged use; work with your vet to gradually taper the dose to allow adrenal gland recovery.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Prednisone Dosing for Humans on Dogs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Human prednisone doses are not directly applicable to dogs; canine metabolism differs significantly and veterinary-calculated weight-based doses are essential for safety.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Dog Weight Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Recalculate doses if your dog gains or loses significant weight during treatment, as the original prescription may no longer be appropriate.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Prednisone with Prednisolone Formulations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Tablets, liquids, and concentrations vary by brand; double-check the product label to ensure you're giving the correct volume or pill count.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping Doses or Altering the Schedule Independently</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Inconsistent dosing reduces efficacy and increases side effect risk; follow your vet's prescribed frequency even if your dog seems better.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard prednisone dosage range for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most dogs receive 0.5–1 mg/kg twice daily for anti-inflammatory conditions, though immunosuppressive doses may reach 2–3 mg/kg daily divided into multiple doses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my dog's prednisone dose by weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Multiply your dog's weight in kilograms by the prescribed dose per kg (e.g., 10 kg dog × 0.5 mg/kg = 5 mg), then verify with your veterinarian before administering.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is prednisone the same as prednisolone for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Prednisone requires liver conversion to prednisolone; prednisolone is the active form and preferred for dogs with liver disease, though dosing equivalence is 1:1.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I give my dog prednisone or prednisolone?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard dosing is typically twice daily (every 12 hours) for acute conditions, though tapering schedules and maintenance doses may shift to once daily or every-other-day regimens.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are common side effects of prednisone in dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Increased thirst, appetite, and urination are frequent; longer-term use may cause hair loss, lethargy, or behavioral changes—always monitor and report concerns to your vet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for all dog breeds and sizes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator works for all breeds using weight-based dosing, but senior dogs, pregnant dogs, or those with liver/kidney disease may require dose adjustments reviewed by your veterinarian.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long can my dog safely take prednisone?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Short-term use (7–14 days) is generally safe; prolonged use over weeks requires gradual tapering to avoid adrenal insufficiency and close veterinary monitoring for complications.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.elsevier.com/products/plumbs-veterinary-drug-handbook" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Plumb's Veterinary Drug Handbook</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive veterinary pharmacology resource with evidence-based prednisone and prednisolone dosing protocols for canines.</p>
          </li>
          <li>
            <a href="https://www.avma.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AVMA: Glucocorticoid Use in Veterinary Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Veterinary Medical Association guidance on appropriate corticosteroid use, monitoring, and tapering in small animal practice.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals: Prednisone and Prednisolone</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Client-focused educational information on prednisone/prednisolone administration, side effects, and long-term management in dogs.</p>
          </li>
          <li>
            <a href="https://www.vin.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network (VIN): Corticosteroid Dosing</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed veterinary literature and clinical decision support for glucocorticoid therapy in companion animals.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Prednisone/Prednisolone Dose Calculator for Dogs"
      description="Calculate the correct dosage for the anti-inflammatory and immunosuppressant steroid **Prednisone/Prednisolone**."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg) = Weight (kg) × Dosage (mg/kg)",
        variables: [
          { symbol: "Dose (mg)", description: "Total Prednisone/Prednisolone dose in milligrams" },
          { symbol: "Weight (kg)", description: "Dog’s body weight in kilograms" },
          { symbol: "Dosage (mg/kg)", description: "Prescribed dosage per kilogram of body weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30-pound dog is prescribed Prednisolone at an anti-inflammatory dose of 0.5 mg/kg daily. Calculate the total daily dose in milligrams.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert the dog’s weight from pounds to kilograms: 30 lbs ÷ 2.20462 = 13.61 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Multiply the weight in kg by the dosage: 13.61 kg × 0.5 mg/kg = 6.805 mg.",
          },
        ],
        result: "The recommended daily dose is approximately 6.8 mg of Prednisolone.",
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
        { id: "what-is", label: "Understanding Prednisone/Prednisolone Dose Calculator for Dogs" },
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
