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

export default function CatGrapeRaisinExposureRiskCalculator() {
  // 1. STATE
  // No unit selector needed since inputs are count-based
  // Inputs: number of grapes or raisins ingested
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    grapes: "",
    raisins: "",
    catWeight: "",
  });

  // 2. LOGIC ENGINE
  // Risk assessment based on number of grapes/raisins ingested and cat weight
  // Toxicity threshold in cats is not well established, but we use a conservative approach:
  // Toxic dose estimated ~0.5 g/kg of grapes/raisins (based on dog data, cats likely similar or more sensitive)
  // Average grape weight ~5 g, raisin ~1 g
  // Calculate total grape/raisin weight ingested, then mg/kg dose
  // Risk categories:
  //   Low: < 10 mg/kg
  //   Moderate: 10-50 mg/kg
  //   High: > 50 mg/kg
  const results = useMemo(() => {
    const grapesNum = parseInt(inputs.grapes);
    const raisinsNum = parseInt(inputs.raisins);
    const weightRaw = parseFloat(inputs.catWeight);

    if (
      isNaN(grapesNum) ||
      grapesNum < 0 ||
      isNaN(raisinsNum) ||
      raisinsNum < 0 ||
      isNaN(weightRaw) ||
      weightRaw <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Calculate total grape/raisin weight in grams
    const grapeWeightG = grapesNum * 5; // 5 g per grape
    const raisinWeightG = raisinsNum * 1; // 1 g per raisin
    const totalIngestedG = grapeWeightG + raisinWeightG;

    // Dose in mg/kg
    const doseMgPerKg = (totalIngestedG * 1000) / weightKg;

    let riskLabel = "Low Risk";
    let warning = null;

    if (doseMgPerKg >= 50) {
      riskLabel = "High Risk";
      warning =
        "This exposure level is considered high risk for kidney toxicity in cats. Immediate veterinary evaluation is strongly recommended.";
    } else if (doseMgPerKg >= 10) {
      riskLabel = "Moderate Risk";
      warning =
        "This exposure level poses a moderate risk. Monitor your cat closely and consult your veterinarian promptly.";
    }

    return {
      value: doseMgPerKg.toFixed(1),
      label: `Estimated Grape/Raisin Exposure Dose (mg/kg) - ${riskLabel}`,
      subtext:
        "Dose calculated based on estimated grape and raisin weights relative to cat's body weight.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What amount of grapes or raisins is toxic to cats?",
      answer: "The exact toxic dose is unknown, but veterinarians recommend treating any ingestion as potentially dangerous since some cats show symptoms after consuming as few as 1-2 grapes or raisins.",
    },
    {
      question: "How does this calculator estimate exposure risk?",
      answer: "The calculator combines cat weight, quantity ingested, and time since exposure to generate a risk level—educational only and not a substitute for veterinary diagnosis.",
    },
    {
      question: "What are the early signs of grape or raisin toxicity in cats?",
      answer: "Early symptoms include vomiting, diarrhea, lethargy, and decreased appetite, typically appearing within 6-12 hours of ingestion.",
    },
    {
      question: "Are raisins more dangerous than grapes for cats?",
      answer: "Raisins are more concentrated and considered equally or slightly more toxic per gram than fresh grapes due to higher toxin density.",
    },
    {
      question: "Should I induce vomiting if my cat ate grapes?",
      answer: "Never induce vomiting at home—contact your veterinarian or poison control immediately for professional guidance on decontamination.",
    },
    {
      question: "Can cooking or processing change the toxicity of grapes for cats?",
      answer: "The toxic compound persists through cooking, drying, and processing, so all forms—fresh, dried, cooked, or juiced—remain hazardous.",
    },
    {
      question: "Is this calculator a replacement for veterinary care?",
      answer: "No—this tool is educational only; always consult a veterinarian or animal poison control center (ASPCA: 888-426-4435) for actual exposure incidents.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(next) => {
              if (next !== "kg" && next !== "lb") return;
              const weightRaw = parseFloat(inputs.catWeight);
              if (Number.isFinite(weightRaw) && weightRaw > 0) {
                const nextWeight = convertWeight(weightRaw, unit, next);
                setInputs((prev) => ({
                  ...prev,
                  catWeight: formatNumberForInput(nextWeight, 2),
                }));
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
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="catWeight" className="text-slate-700 dark:text-slate-300">
            Cat Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="catWeight"
            type="number"
            min="0"
            step="0.1"
            placeholder={unit === "lb" ? "e.g. 10.5" : "e.g. 4.8"}
            value={inputs.catWeight}
            onChange={(e) => setInputs({ ...inputs, catWeight: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="grapes" className="text-slate-700 dark:text-slate-300">
            Number of Grapes Ingested
          </Label>
          <Input
            id="grapes"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 3"
            value={inputs.grapes}
            onChange={(e) => setInputs({ ...inputs, grapes: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="raisins" className="text-slate-700 dark:text-slate-300">
            Number of Raisins Ingested
          </Label>
          <Input
            id="raisins"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 5"
            value={inputs.raisins}
            onChange={(e) => setInputs({ ...inputs, raisins: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
            setInputs((i) => ({ ...i }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ grapes: "", raisins: "", catWeight: "" })}
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

  // 5. EDITORIAL JSX
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cat Grape/Raisin Exposure Risk (educational)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This educational calculator helps cat owners assess potential grape or raisin exposure risk based on their cat's weight and the quantity consumed. It provides risk-level estimates to help guide urgency of veterinary consultation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your cat's weight in pounds and the number of grapes or raisins ingested, along with the time elapsed since exposure. The calculator uses these inputs to generate a relative risk assessment.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the resulting risk level and recommended action—low-risk cases may warrant monitoring at home, while moderate-to-high risk exposures require immediate veterinary or poison control contact. Remember this tool is educational; veterinary professionals must make final medical decisions.</p>
        </div>
      </section>

      {/* TABLE: Grape &amp; Raisin Toxicity Risk Thresholds by Cat Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Grape &amp; Raisin Toxicity Risk Thresholds by Cat Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimated risk escalation based on body weight and quantity consumed.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Low Risk (&lt;1 grape)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Risk (1-3 grapes)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Risk (&gt;3 grapes)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5–8 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal concern</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitor closely</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Contact vet immediately</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9–12 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Generally safe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Observe for symptoms</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Seek emergency care</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">13+ lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lower sensitivity</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mild to moderate risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High risk zone</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Individual cat susceptibility varies; this is an educational guide only.</p>
      </section>

      {/* TABLE: Timeline of Toxicity Symptoms in Cats */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Timeline of Toxicity Symptoms in Cats</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Expected symptom onset varies but typically follows this pattern after ingestion.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time Frame</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Common Symptoms</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Severity Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0-2 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None or mild lethargy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vomiting, diarrhea, decreased appetite</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12-72 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Abdominal pain, dehydration, kidney dysfunction signs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3+ days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Acute kidney injury indicators, anuria possible</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Early veterinary intervention improves outcomes significantly.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Store grapes and raisins in sealed containers on high shelves or inside cupboards to prevent accidental cat access.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Educate family members and visitors that grapes and raisins are toxic to cats—many people don't realize the danger.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep the ASPCA Animal Poison Control Center number (888-426-4435) saved in your phone for quick reference during emergencies.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your cat for behavioral changes even after minor exposure; kidney damage can develop silently over days.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming small amounts are safe</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Even 1-2 grapes or raisins can trigger toxicity in sensitive cats; no amount is proven universally safe.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Delaying veterinary contact</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Early intervention within 2-4 hours significantly improves prognosis; waiting for symptoms to appear reduces treatment effectiveness.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Relying solely on this calculator for diagnosis</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">This tool estimates risk only; a veterinarian must perform blood work and urinalysis to confirm kidney damage.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring raisins in baked goods or cereals</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Raisins in cookies, granola, and trail mix are equally toxic and are often overlooked as hazards.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What amount of grapes or raisins is toxic to cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The exact toxic dose is unknown, but veterinarians recommend treating any ingestion as potentially dangerous since some cats show symptoms after consuming as few as 1-2 grapes or raisins.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does this calculator estimate exposure risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator combines cat weight, quantity ingested, and time since exposure to generate a risk level—educational only and not a substitute for veterinary diagnosis.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the early signs of grape or raisin toxicity in cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Early symptoms include vomiting, diarrhea, lethargy, and decreased appetite, typically appearing within 6-12 hours of ingestion.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are raisins more dangerous than grapes for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Raisins are more concentrated and considered equally or slightly more toxic per gram than fresh grapes due to higher toxin density.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I induce vomiting if my cat ate grapes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Never induce vomiting at home—contact your veterinarian or poison control immediately for professional guidance on decontamination.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can cooking or processing change the toxicity of grapes for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The toxic compound persists through cooking, drying, and processing, so all forms—fresh, dried, cooked, or juiced—remain hazardous.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is this calculator a replacement for veterinary care?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No—this tool is educational only; always consult a veterinarian or animal poison control center (ASPCA: 888-426-4435) for actual exposure incidents.</p>
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official resource for pet toxin emergencies with 24/7 hotline and comprehensive toxicity database.</p>
          </li>
          <li>
            <a href="https://www.petpoisonhelpline.com/poison/grapes-and-raisins/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Poison Helpline—Grape and Raisin Toxicity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical overview of grape and raisin toxicity mechanisms, symptoms, and emergency treatment protocols.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/know-your-pet/grapes-and-raisins-poisoning-in-cats" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals—Grape and Raisin Toxicity in Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary-reviewed guide covering symptoms, risk factors, and management of grape/raisin exposure.</p>
          </li>
          <li>
            <a href="https://www.aafmonline.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Feline Medical Association—Feline Toxicology</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional veterinary organization providing evidence-based information on common feline toxins and poisonings.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Grape/Raisin Exposure Risk (educational)"
      description="Educational tool on the potential, though rare, kidney toxicity risk from grapes and raisins in cats."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Exposure Dose (mg/kg) = (Number of Grapes × 5000 + Number of Raisins × 1000) / Cat Weight (g)",
        variables: [
          { symbol: "Number of Grapes", description: "Count of grapes ingested" },
          { symbol: "Number of Raisins", description: "Count of raisins ingested" },
          { symbol: "Cat Weight (g)", description: "Cat body weight in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb cat ingests 3 grapes and 5 raisins. The owner wants to estimate the risk of kidney toxicity.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert cat weight to grams: 10 lb × 453.592 = 4535.92 g.",
          },
          {
            label: "2",
            explanation:
              "Calculate total grape and raisin weight: (3 × 5 g) + (5 × 1 g) = 15 g + 5 g = 20 g.",
          },
          {
            label: "3",
            explanation:
              "Calculate exposure dose: (20,000 mg) / 4535.92 g = 4.41 mg/g = 4.41 mg/kg.",
          },
          {
            label: "4",
            explanation:
              "Interpret dose: 4.41 mg/kg is considered low risk but still warrants monitoring and veterinary consultation.",
          },
        ],
        result: "Estimated exposure dose is 4.4 mg/kg, categorized as Low Risk.",
      }}
      relatedCalculators={[
        { title: "Dog Walking Calories Burned Calculator", url: "/pets/dog-walking-calories-burned", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Cat BMI/Body Index (educational)", url: "/pets/cat-bmi-body-index-educational", icon: "🐱" },
        { title: "Dewormer & Antibiotic Dose Reference", url: "/pets/reptile-dewormer-antibiotic-dose-reference", icon: "🍖" },
        { title: "Dog Crate Size Finder", url: "/pets/dog-crate-size-finder", icon: "🐶" },
        { title: "Horse Feeding Rate Calculator (Forage + Concentrate)", url: "/pets/horse-feeding-rate-forage-concentrate", icon: "🐎" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Grape/Raisin Exposure Risk (educational)" },
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
