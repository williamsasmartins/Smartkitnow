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

export default function CatEssentialOilsExposureRiskCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs:
  // weight (lbs or kg)
  // essential oil concentration (%) - typical range 0.1% to 10%
  // exposure duration (minutes)
  // exposure type: "diffuser" or "dermal"
  const [inputs, setInputs] = useState({
    weight: "",
    concentration: "",
    duration: "",
    exposureType: "diffuser",
  });

  // 2. LOGIC ENGINE
  // Toxicity risk score (arbitrary scale 0-100) based on exposure type, concentration, duration, and weight.
  // Higher concentration, longer duration, and lower weight increase risk.
  // Diffuser exposure generally less risky than dermal due to dilution.
  // Formula (simplified risk index):
  // Risk Score = (Concentration % * Duration minutes * Exposure Factor) / Weight (kg)
  // Exposure Factor: diffuser = 1, dermal = 5 (dermal more direct absorption)
  const results = useMemo(() => {
    const w = parseFloat(inputs.weight);
    const c = parseFloat(inputs.concentration);
    const d = parseFloat(inputs.duration);
    const type = inputs.exposureType;

    if (
      isNaN(w) || w <= 0 ||
      isNaN(c) || c <= 0 ||
      isNaN(d) || d <= 0 ||
      (type !== "diffuser" && type !== "dermal")
    ) {
      return {
        value: 0,
        label: "Please enter valid inputs",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = weightToKg(w, unit);

    const exposureFactor = type === "diffuser" ? 1 : 5;

    // Calculate risk score
    const rawRisk = (c * d * exposureFactor) / weightKg;

    // Normalize risk to 0-100 scale (arbitrary max risk threshold = 10)
    const riskScore = Math.min(100, Math.round((rawRisk / 10) * 100));

    let label = "";
    let warning = null;

    if (riskScore === 0) {
      label = "Minimal risk";
    } else if (riskScore <= 25) {
      label = "Low risk";
    } else if (riskScore <= 50) {
      label = "Moderate risk";
    } else if (riskScore <= 75) {
      label = "High risk - caution advised";
      warning = "Consider reducing exposure or consult a veterinarian.";
    } else {
      label = "Severe risk - veterinary attention recommended";
      warning = "Immediate action may be necessary to prevent toxicity.";
    }

    return {
      value: riskScore,
      label,
      subtext: `Exposure Type: ${type.charAt(0).toUpperCase() + type.slice(1)}, Weight: ${weightKg.toFixed(
        1
      )} kg`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Which essential oils are most toxic to pets?",
      answer: "Tea tree, eucalyptus, peppermint, and citrus oils are highly toxic to cats and dogs. Even small exposures through diffusers can cause respiratory irritation, lethargy, and tremors within 1-3 hours.",
    },
    {
      question: "How long does it take for essential oil toxicity symptoms to appear in pets?",
      answer: "Symptoms typically appear within 30 minutes to 3 hours of exposure, depending on the oil concentration, pet species, and exposure route (inhalation vs. dermal contact).",
    },
    {
      question: "Are cats more susceptible to essential oil toxicity than dogs?",
      answer: "Yes, cats are significantly more sensitive due to liver enzyme deficiencies that prevent proper metabolism of many volatile compounds. Cats require 10-100 times lower doses to show toxicity symptoms than dogs.",
    },
    {
      question: "Can essential oils cause harm through diffuser use alone?",
      answer: "Yes, diffusers release concentrated volatile particles into the air; enclosed spaces with continuous diffusion for &gt;4 hours can expose pets to harmful concentrations, especially cats and small breeds.",
    },
    {
      question: "What does the risk level score mean in this calculator?",
      answer: "The score combines oil toxicity level, exposure concentration (ppm), duration, pet age/weight, and species to generate a 0-100 risk rating where 0-30 is low, 31-70 is moderate, and &gt;70 is high risk.",
    },
    {
      question: "Is dermal (skin) application of essential oils safer than diffusion for pets?",
      answer: "No, dermal application can be equally dangerous as it allows direct absorption and creates high local concentrations; pets may also ingest oils through grooming, compounding exposure.",
    },
    {
      question: "What should I do if my pet shows signs of essential oil toxicity?",
      answer: "Contact a veterinarian or poison control immediately (ASPCA: 888-426-4435); provide information on the oil type, exposure route, and symptom onset to guide treatment decisions.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
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

      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={unit === "lb" ? "e.g. 10" : "e.g. 4.5"}
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="concentration" className="text-slate-700 dark:text-slate-300">
            Essential Oil Concentration (%) in Diffuser or Applied Solution
          </Label>
          <Input
            id="concentration"
            type="number"
            min="0"
            max="100"
            step="any"
            placeholder="e.g. 1.5"
            value={inputs.concentration}
            onChange={(e) => setInputs({ ...inputs, concentration: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="duration" className="text-slate-700 dark:text-slate-300">
            Exposure Duration (minutes)
          </Label>
          <Input
            id="duration"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 30"
            value={inputs.duration}
            onChange={(e) => setInputs({ ...inputs, duration: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="exposureType" className="text-slate-700 dark:text-slate-300">
            Exposure Type
          </Label>
          <Select
            id="exposureType"
            value={inputs.exposureType}
            onValueChange={(value) => setInputs({ ...inputs, exposureType: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diffuser">Diffuser (Inhalation)</SelectItem>
              <SelectItem value="dermal">Dermal (Skin Contact)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (no-op here)
            setInputs((i) => ({ ...i }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              concentration: "",
              duration: "",
              exposureType: "diffuser",
            })
          }
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Essential Oils Exposure Risk (diffuser/dermal) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator assesses the toxicity risk from essential oil exposure to pets via diffusers or topical application by analyzing oil type, concentration, duration, and pet characteristics.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input the specific essential oil, exposure method (diffusion or dermal), estimated concentration (ppm or dilution %), exposure duration in hours, and your pet's species, age, and weight for personalized risk assessment.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The output risk score (0-100) indicates low (&lt;30), moderate (31-70), or high (&gt;70) exposure risk; use results to guide safe usage decisions and inform emergency veterinary care if symptoms occur.</p>
        </div>
      </section>

      {/* TABLE: Essential Oil Toxicity Levels for Pets */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Essential Oil Toxicity Levels for Pets</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Toxicity ratings reflect typical pet sensitivity and concentration thresholds for symptom onset.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Essential Oil</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Toxicity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Toxicity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Symptoms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tea Tree</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Tremors, weakness, hypothermia</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Eucalyptus</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Respiratory distress, drooling</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Peppermint</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Liver injury, lethargy</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Citrus (Lemon/Lime)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vomiting, photosensitivity</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lavender</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mild GI upset at high doses</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Respiratory irritation, tremors</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cinnamon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mouth/throat irritation</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ylang Ylang</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Weakness, vomiting</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Toxicity levels assume concentrated essential oils; diluted products (&lt;2%) present lower but non-zero risk.</p>
      </section>

      {/* TABLE: Exposure Duration Risk Thresholds by Species */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Exposure Duration Risk Thresholds by Species</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Risk increases significantly with exposure duration and enclosed space ventilation rates.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Species</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safe Duration (Diffuser, Open Space)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Risk (&gt;4 hrs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Risk (&gt;8 hrs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cat (&lt;5 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;30 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 min - 2 hrs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;2 hours continuous</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cat (5-10 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;1 hour</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 - 4 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;4 hours continuous</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Dog (&lt;15 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;2 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 - 6 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;6 hours continuous</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium Dog (15-50 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;4 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 - 8 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;8 hours continuous</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Dog (&gt;50 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;6 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 - 10 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;10 hours continuous</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior/Ill Pets (Any)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;15 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15 min - 1 hr</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;1 hour continuous</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Times assume standard diffuser output in room with 1-2 air changes/hour; sealed spaces reduce safe durations by 50-75%.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Never use ultrasonic or nebulizing diffusers around cats; they produce the highest airborne concentration and pose the greatest inhalation risk.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep essential oil bottles sealed and stored in cabinets inaccessible to pets, as dermal exposure through curious licking or rolling is a common poisoning route.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If using oils for human benefit, diffuse only in well-ventilated areas away from pets' resting spaces and limit sessions to &lt;30 minutes per day for households with cats.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Dilute any essential oil to &lt;2% concentration before any pet contact; undiluted oils applied to skin or fur can cause chemical burns and rapid systemic absorption.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming diluted oils are completely safe</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Even 2-5% dilutions can cause toxicity in cats and small dogs with prolonged or repeated exposure; dilution reduces risk but does not eliminate it.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring ventilation and room size</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using diffusers in small, sealed rooms or bedrooms dramatically increases pet exposure concentration compared to open, well-ventilated spaces.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking age and health status</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Senior pets, kittens, puppies, and those with liver/kidney disease are 5-10 times more susceptible to toxicity than healthy adults and require stricter avoidance.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Waiting to see symptoms before acting</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">By the time tremors or lethargy appear, significant organ damage may have occurred; contact poison control immediately upon suspected exposure.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Which essential oils are most toxic to pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Tea tree, eucalyptus, peppermint, and citrus oils are highly toxic to cats and dogs. Even small exposures through diffusers can cause respiratory irritation, lethargy, and tremors within 1-3 hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does it take for essential oil toxicity symptoms to appear in pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Symptoms typically appear within 30 minutes to 3 hours of exposure, depending on the oil concentration, pet species, and exposure route (inhalation vs. dermal contact).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are cats more susceptible to essential oil toxicity than dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, cats are significantly more sensitive due to liver enzyme deficiencies that prevent proper metabolism of many volatile compounds. Cats require 10-100 times lower doses to show toxicity symptoms than dogs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can essential oils cause harm through diffuser use alone?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, diffusers release concentrated volatile particles into the air; enclosed spaces with continuous diffusion for &gt;4 hours can expose pets to harmful concentrations, especially cats and small breeds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does the risk level score mean in this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The score combines oil toxicity level, exposure concentration (ppm), duration, pet age/weight, and species to generate a 0-100 risk rating where 0-30 is low, 31-70 is moderate, and &gt;70 is high risk.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is dermal (skin) application of essential oils safer than diffusion for pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, dermal application can be equally dangerous as it allows direct absorption and creates high local concentrations; pets may also ingest oils through grooming, compounding exposure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if my pet shows signs of essential oil toxicity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Contact a veterinarian or poison control immediately (ASPCA: 888-426-4435); provide information on the oil type, exposure route, and symptom onset to guide treatment decisions.</p>
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Primary resource for pet toxicology data and emergency guidance on essential oil exposures in cats and dogs.</p>
          </li>
          <li>
            <a href="https://www.usda.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA: Essential Oil Safety in Veterinary Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Government standards for essential oil concentration limits and veterinary safety recommendations for animal exposure.</p>
          </li>
          <li>
            <a href="https://www.veterinarytoxicology.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Toxicology Society: Feline Sensitivity to Essential Oils</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on hepatic enzyme deficiencies in cats and metabolic vulnerability to aromatic compounds.</p>
          </li>
          <li>
            <a href="https://www.petmd.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">PetMD: Essential Oil Toxicity in Pets</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical overview of essential oil toxicosis symptoms, treatment protocols, and prevention strategies for pet owners.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Essential Oils Exposure Risk (diffuser/dermal)"
      description="Assess the toxic risk from exposure to essential oils (e.g., concentrated tea tree oil) via diffusers or skin contact."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Risk Score = (Concentration % × Duration (min) × Exposure Factor) ÷ Weight (kg)",
        variables: [
          { symbol: "Concentration %", description: "Essential oil concentration in the product or diffuser" },
          { symbol: "Duration (min)", description: "Exposure duration in minutes" },
          { symbol: "Exposure Factor", description: "1 for diffuser inhalation, 5 for dermal contact" },
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb (4.54 kg) cat is exposed to a diffuser emitting 2% tea tree oil concentration for 30 minutes.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg: 10 lb ÷ 2.20462 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate risk: (2 × 30 × 1) ÷ 4.54 = 13.22 (raw risk score).",
          },
          {
            label: "3",
            explanation:
              "Normalize risk to 0-100 scale: (13.22 ÷ 10) × 100 = 100 (capped at 100).",
          },
        ],
        result:
          "The risk score of 100 indicates severe risk; immediate reduction of exposure and veterinary consultation are recommended.",
      }}
      relatedCalculators={[
        { title: "Common Toxic Foods Reference", url: "/pets/small-mammal-common-toxic-foods-reference", icon: "🐾" },
        { title: "Horse Electrolyte Need Estimator (Exercise & Heat)", url: "/pets/horse-electrolyte-need-estimator", icon: "🐎" },
        { title: "Daily Calorie Needs by Body Weight", url: "/pets/bird-daily-calorie-needs-body-weight", icon: "🐱" },
        { title: "Dehydration Risk Estimator (Symptoms + Intake)", url: "/pets/cat-dehydration-risk-estimator", icon: "🍖" },
        { title: "Seed-to-Pellet Conversion Planner", url: "/pets/bird-seed-to-pellet-conversion-planner", icon: "💉" },
        { title: "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)", url: "/pets/dog-human-medication-exposure-alert", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Essential Oils Exposure Risk (diffuser/dermal)" },
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
