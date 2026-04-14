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

export default function ReptileFluidReplacementVolumeCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: Weight and Dehydration Percentage
  const [inputs, setInputs] = useState({
    weight: "",
    dehydrationPercent: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const dehydrationNum = parseFloat(inputs.dehydrationPercent);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(dehydrationNum) ||
      dehydrationNum < 0 ||
      dehydrationNum > 15
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter valid weight and dehydration percentage (0-15%).",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightNum, unit);

    // Fluid Replacement Volume (mL) = Weight (kg) × Dehydration % × 10
    // 10 mL/kg per 1% dehydration is standard for reptiles (subcutaneous fluids)
    const volume = weightKg * dehydrationNum * 10;

    // Round to nearest 10 mL for practical use
    const roundedVolume = Math.round(volume / 10) * 10;

    return {
      value: `${roundedVolume.toLocaleString()} mL`,
      label: "Estimated Fluid Replacement Volume",
      subtext:
        "Volume of subcutaneous fluids needed to correct dehydration over 24 hours.",
      warning:
        dehydrationNum > 10
          ? "Severe dehydration detected. Consult a veterinarian immediately for intensive care."
          : null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How do I calculate fluid replacement volume for my dehydrated pet?",
      answer: "Enter your pet's current weight, estimated dehydration percentage (typically 5-10%), and the calculator will determine total fluid needed and safe replacement rate over 24-48 hours.",
    },
    {
      question: "What dehydration percentage should I use for my pet?",
      answer: "Mild dehydration is 5-6%, moderate is 7-8%, and severe is 10%+ based on skin turgor and mucous membrane appearance; your vet can assess this clinically.",
    },
    {
      question: "Is subcutaneous or intravenous fluid replacement better?",
      answer: "IV fluids work faster for severe dehydration, while subcutaneous fluids suit mild-moderate cases; the calculator helps determine volume regardless of route.",
    },
    {
      question: "How quickly can I replace fluids safely?",
      answer: "Most pets tolerate 40-50 mL/kg/day IV or 30-40 mL/kg/day subcutaneously; rapid replacement over &lt;12 hours risks overload and should only occur under veterinary supervision.",
    },
    {
      question: "Can I use this calculator for cats and dogs equally?",
      answer: "Yes, the calculator works for both species; however, cats are more sensitive to fluid overload, so monitor closely and consult your vet on appropriate rates.",
    },
    {
      question: "What if my pet has kidney disease or heart problems?",
      answer: "Pets with renal or cardiac conditions need slower, conservative replacement; always consult your veterinarian to adjust rates below standard recommendations.",
    },
    {
      question: "Should I account for ongoing fluid loss in my calculation?",
      answer: "Yes, add 10-20 mL/kg/day for maintenance and extra losses from vomiting or diarrhea to the replacement volume for total daily fluid needs.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
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

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-400 mt-1">
            Animal's body weight for fluid calculation.
          </p>
        </div>

        <div>
          <Label htmlFor="dehydrationPercent" className="text-slate-700 dark:text-slate-300">
            Dehydration Percentage (%)
          </Label>
          <Input
            id="dehydrationPercent"
            name="dehydrationPercent"
            type="text"
            placeholder="Enter dehydration % (e.g. 5)"
            value={inputs.dehydrationPercent}
            onChange={handleInputChange}
            aria-describedby="dehydration-desc"
          />
          <p id="dehydration-desc" className="text-xs text-slate-400 mt-1">
            Estimated dehydration severity (0-15% typical range).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", dehydrationPercent: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Fluid Replacement Volume Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the total fluid volume needed to rehydrate your pet based on body weight and estimated dehydration percentage. It helps veterinarians and pet owners plan safe, effective fluid therapy protocols.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your pet's current weight in kilograms or pounds, select the estimated dehydration severity (mild 5-6%, moderate 7-8%, severe 10%+), and choose your preferred fluid replacement route. The calculator will display total replacement volume and recommended daily rates.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show how much fluid is needed over 24-48 hours plus daily maintenance requirements. Always consult your veterinarian before administering fluids, especially if your pet has kidney disease, heart conditions, or is very young or elderly.</p>
        </div>
      </section>

      {/* TABLE: Dehydration Severity and Clinical Signs */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Dehydration Severity and Clinical Signs</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use these clinical indicators to estimate dehydration percentage for your calculator inputs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Severity</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dehydration %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Clinical Signs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Skin Turgor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mild</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slight dry mucous membranes, normal capillary refill</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Returns &lt;1 second</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dry mouth, weak pulses, slightly delayed capillary refill</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Returns 1-2 seconds</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Severe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very dry mucous membranes, weak pulses, lethargy, cool extremities</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Returns &gt;2 seconds</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Shock</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Collapse, weak/absent pulses, altered mental status, pale gums</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Returns &gt;3 seconds</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Clinical assessment by a veterinarian is essential; this table supports initial estimation only.</p>
      </section>

      {/* TABLE: Safe Fluid Replacement Rates by Route */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Safe Fluid Replacement Rates by Route</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Maximum safe daily fluid rates vary by administration route and pet condition.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Administration Route</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Healthy Pet (mL/kg/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">With Renal Disease (mL/kg/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maintenance + Replacement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Intravenous (IV)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maintenance 60-70 mL/kg/day total</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Subcutaneous (SC)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maintenance 60-70 mL/kg/day total</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oral (if tolerated)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maintenance 60-70 mL/kg/day total</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Emergency bolus IV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90 (over 15-30 min)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not recommended</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Shock protocol only</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always follow veterinary guidance; these are general guidelines and individual pets may require adjustment based on response and comorbidities.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your pet accurately before calculating, as dosing is weight-dependent; even small errors in weight affect fluid volume significantly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your pet's urine output, mucous membrane color, and skin turgor during rehydration to confirm adequate fluid absorption and prevent overload.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Add 10-15 mL/kg/day to your replacement total if your pet is actively vomiting or has diarrhea to account for ongoing losses.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use room-temperature fluids and warm IV fluids to body temperature when possible to prevent hypothermia and improve circulation during rehydration.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating dehydration percentage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming severe dehydration when only mild-moderate loss exists leads to unnecessary fluid overload; perform skin turgor and capillary refill tests.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring ongoing fluid losses</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating replacement volume alone without adding maintenance or accounting for vomiting/diarrhea results in persistent dehydration despite treatment.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using human or livestock reference rates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Small animal fluid rates differ significantly from larger species and humans; always use veterinary-specific guidelines for dogs and cats.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Replacing fluids too rapidly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Administering the entire replacement volume over &lt;12 hours risks pulmonary edema and hypervolemia, even though calculator shows total volume needed.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate fluid replacement volume for my dehydrated pet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your pet's current weight, estimated dehydration percentage (typically 5-10%), and the calculator will determine total fluid needed and safe replacement rate over 24-48 hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What dehydration percentage should I use for my pet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Mild dehydration is 5-6%, moderate is 7-8%, and severe is 10%+ based on skin turgor and mucous membrane appearance; your vet can assess this clinically.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is subcutaneous or intravenous fluid replacement better?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">IV fluids work faster for severe dehydration, while subcutaneous fluids suit mild-moderate cases; the calculator helps determine volume regardless of route.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How quickly can I replace fluids safely?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most pets tolerate 40-50 mL/kg/day IV or 30-40 mL/kg/day subcutaneously; rapid replacement over &lt;12 hours risks overload and should only occur under veterinary supervision.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for cats and dogs equally?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator works for both species; however, cats are more sensitive to fluid overload, so monitor closely and consult your vet on appropriate rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my pet has kidney disease or heart problems?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pets with renal or cardiac conditions need slower, conservative replacement; always consult your veterinarian to adjust rates below standard recommendations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I account for ongoing fluid loss in my calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, add 10-20 mL/kg/day for maintenance and extra losses from vomiting or diarrhea to the replacement volume for total daily fluid needs.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.fadavis.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">DavisPlus: Fluid Therapy in Small Animal Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive veterinary reference on intravenous and subcutaneous fluid administration protocols and safety limits.</p>
          </li>
          <li>
            <a href="https://www.aafco.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Nutrient Profiles and Fluid Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standards and guidelines for safe fluid volumes and electrolyte balance in companion animal medicine.</p>
          </li>
          <li>
            <a href="https://www.vin.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network (VIN) - Dehydration Assessment</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based clinical resources for assessing dehydration severity and selecting appropriate fluid therapy routes.</p>
          </li>
          <li>
            <a href="https://www.iris-kidney.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Renal Interest Society (IRIS) - Fluid Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Specialized recommendations for fluid therapy in pets with renal disease and modified replacement protocols.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fluid Replacement Volume Calculator"
      description="Calculate the necessary volume of subcutaneous fluids for a dehydrated reptile based on its weight and severity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Fluid Volume (mL) = Weight (kg) × Dehydration % × 10",
        variables: [
          { symbol: "Weight (kg)", description: "Body weight of the reptile in kilograms" },
          { symbol: "Dehydration %", description: "Estimated percentage of dehydration" },
          { symbol: "10", description: "Constant factor representing mL per kg per % dehydration" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 2.2 lb (1 kg) bearded dragon is estimated to be 8% dehydrated after clinical examination.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed (already 1 kg in this case).",
          },
          {
            label: "2",
            explanation:
              "Multiply weight (1 kg) by dehydration percentage (8%) and factor 10: 1 × 8 × 10 = 80 mL.",
          },
          {
            label: "3",
            explanation:
              "Administer approximately 80 mL of subcutaneous fluids over 24 hours to correct dehydration.",
          },
        ],
        result: "Estimated fluid replacement volume is 80 mL.",
      }}
      relatedCalculators={[
        {
          title: "Environmental Enrichment Planner (per room)",
          url: "/pets/cat-environmental-enrichment-planner",
          icon: "🐾",
        },
        {
          title: "Dog Grape/Raisin Exposure Risk Calculator",
          url: "/pets/dog-grape-raisin-exposure-risk",
          icon: "🐶",
        },
        {
          title: "pH Adjustment (Acid/Base Buffer) Calculator",
          url: "/pets/aquarium-ph-adjustment-buffer",
          icon: "🐱",
        },
        {
          title: "Dog Step-Goal & Activity Time Planner",
          url: "/pets/dog-step-goal-activity-time-planner",
          icon: "🐶",
        },
        {
          title: "Dog Daily Water Intake Checker",
          url: "/pets/dog-daily-water-intake-checker",
          icon: "🐶",
        },
        {
          title: "Insulin Starter Reference (info-only)",
          url: "/pets/cat-insulin-starter-reference",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Fluid Replacement Volume Calculator" },
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
