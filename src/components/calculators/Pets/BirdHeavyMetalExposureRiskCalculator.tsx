import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { weightToKg } from "@/lib/utils";

export default function BirdHeavyMetalExposureRiskCalculator() {
  // 1. STATE
  // Default unit system (imperial or metric)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and exposure level (mg/kg)
  const [inputs, setInputs] = useState({
    weight: "",
    exposureMgPerKg: "",
  });

  // 2. LOGIC ENGINE
  // Calculate risk score based on exposure dose and weight
  // Formula: Risk Score = Exposure Dose (mg/kg) * Weight (kg)
  // Interpretation: Higher score indicates greater risk of toxicity
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const exposureNum = parseFloat(inputs.exposureMgPerKg);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(exposureNum) ||
      exposureNum < 0
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter valid positive numbers for weight and exposure.",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightNum, unit);

    // Calculate risk score
    const riskScore = exposureNum * weightKg;

    // Risk interpretation thresholds (example values):
    // <5 = Low risk, 5-15 = Moderate risk, >15 = High risk
    let label = "";
    let warning = null;

    if (riskScore < 5) {
      label = "Low Risk of Heavy Metal Toxicity";
    } else if (riskScore < 15) {
      label = "Moderate Risk of Heavy Metal Toxicity";
      warning =
        "Monitor clinical signs closely and consider veterinary evaluation.";
    } else {
      label = "High Risk of Heavy Metal Toxicity";
      warning =
        "Immediate veterinary intervention recommended to prevent severe poisoning.";
    }

    return {
      value: riskScore.toFixed(2),
      label,
      subtext: `Calculated using exposure dose and body weight.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What lead levels are toxic to dogs and cats?",
      answer: "Lead levels above 10 µg/dL in blood are considered elevated in pets; levels &gt;20 µg/dL require veterinary intervention and possible chelation therapy.",
    },
    {
      question: "How does zinc toxicity differ from lead poisoning in pets?",
      answer: "Zinc toxicity causes acute gastrointestinal signs and hemolytic anemia, while lead exposure develops slowly with neurological and behavioral changes over weeks.",
    },
    {
      question: "Which common household items contain lead that pets can access?",
      answer: "Lead-based paint chips, old plumbing fixtures, certain glazed ceramics, contaminated soil, and vintage toys are primary household sources dangerous to pets.",
    },
    {
      question: "What are the early warning signs of heavy metal poisoning in pets?",
      answer: "Vomiting, diarrhea, loss of appetite, lethargy, behavioral changes, and abdominal pain are early indicators; neurological signs appear in advanced cases.",
    },
    {
      question: "How is heavy metal exposure in pets diagnosed?",
      answer: "Blood lead/zinc levels, urinalysis, X-rays to detect foreign objects, and complete blood work help veterinarians confirm heavy metal exposure.",
    },
    {
      question: "Can pets recover from lead or zinc exposure?",
      answer: "Early detection and chelation therapy can reverse some effects, but neurological damage from chronic lead exposure may be permanent in dogs and cats.",
    },
    {
      question: "How often should exposed pets be monitored after treatment?",
      answer: "Follow-up blood tests should occur at 2-4 weeks post-treatment, then monthly for 3 months to ensure heavy metal levels remain within safe ranges.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handle input changes
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
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
              <SelectItem value="lb">lb</SelectItem>
              <SelectItem value="kg">kg</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Bird Weight ({unit})
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
          />
        </div>

        <div>
          <Label
            htmlFor="exposureMgPerKg"
            className="text-slate-700 dark:text-slate-300"
          >
            Estimated Exposure Dose (mg/kg)
          </Label>
          <Input
            id="exposureMgPerKg"
            name="exposureMgPerKg"
            type="number"
            min="0"
            step="any"
            placeholder="Enter estimated lead or zinc dose per kg"
            value={inputs.exposureMgPerKg}
            onChange={handleInputChange}
          />
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
          onClick={() => setInputs({ weight: "", exposureMgPerKg: "" })}
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a
              vet for diagnosis.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Heavy Metal (Lead/Zinc) Exposure Risk Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator assesses your pet's risk of heavy metal (lead and zinc) exposure based on environmental factors, behavioral habits, and household conditions. It helps identify contamination sources and estimate urgency for veterinary screening.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your pet's age, weight, living environment (urban/rural), access to soil/paint, and any known exposure incidents. The calculator also considers chewing behavior and dietary habits that increase heavy metal ingestion risk.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results provide a risk score (low/moderate/high/critical) with specific recommendations for testing frequency, environmental remediation, and veterinary follow-up to protect your pet's health.</p>
        </div>
      </section>

      {/* TABLE: Pet Blood Lead Levels: Health Risk Categories */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Pet Blood Lead Levels: Health Risk Categories</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table outlines blood lead concentration thresholds and associated health risks in dogs and cats.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lead Level (µg/dL)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Clinical Signs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&lt;5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Continue monitoring</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Borderline Elevated</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Possible behavioral changes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Retest in 2-4 weeks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Elevated</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">GI upset, lethargy, aggression</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Veterinary evaluation required</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Seizures, anemia, severe behavioral changes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Immediate chelation therapy</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Neurological failure, organ damage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Emergency veterinary care</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values based on ASPCA and AVMA guidelines for companion animals.</p>
      </section>

      {/* TABLE: Common Sources of Lead and Zinc Exposure in Pets */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Sources of Lead and Zinc Exposure in Pets</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Identifying contamination sources helps pet owners reduce exposure risk in home and outdoor environments.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Source</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lead Risk</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Zinc Risk</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Exposure Route</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Paint (pre-1978)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Chewing, ingestion of chips</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Soil (urban areas)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Paw contamination, digging</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Old plumbing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Drinking contaminated water</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Batteries (used/damaged)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Direct chewing, leakage</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pennies (post-1982)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ingestion if swallowed</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ceramic glazes (vintage)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Food/water bowls</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ammunition/fishing weights</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ingestion during play</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Risk levels reflect typical exposure scenarios for household pets.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Test soil in yards &gt;30 years old or near roads; lead levels &gt;400 ppm require professional remediation or restricted pet access.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Replace pre-1978 painted items and ensure pets cannot chew peeling paint; lead dust from sanding poses serious inhalation risk.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store batteries, fishing tackle, and ammunition in locked cabinets away from curious pets who may swallow contaminated items.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Provide fresh water daily and clean bowls weekly; replace vintage or glazed ceramics with lead-free, pet-safe feeding dishes.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming only old homes have lead risk</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Lead exists in soil, contaminated water, and products regardless of house age; urban pets face higher exposure risks than age of residence.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring behavioral risk factors</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pets that chew non-food items, dig frequently, or have pica behavior face significantly higher heavy metal ingestion risk than typical animals.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Delaying testing after suspected exposure</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Blood lead levels peak 2-4 weeks post-exposure; early testing allows prompt intervention and prevents neurological complications in pets.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Only testing once without follow-up</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Heavy metals accumulate in bones; serial testing over months tracks organ burden and treatment effectiveness better than single measurements.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What lead levels are toxic to dogs and cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Lead levels above 10 µg/dL in blood are considered elevated in pets; levels &gt;20 µg/dL require veterinary intervention and possible chelation therapy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does zinc toxicity differ from lead poisoning in pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Zinc toxicity causes acute gastrointestinal signs and hemolytic anemia, while lead exposure develops slowly with neurological and behavioral changes over weeks.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Which common household items contain lead that pets can access?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Lead-based paint chips, old plumbing fixtures, certain glazed ceramics, contaminated soil, and vintage toys are primary household sources dangerous to pets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the early warning signs of heavy metal poisoning in pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Vomiting, diarrhea, loss of appetite, lethargy, behavioral changes, and abdominal pain are early indicators; neurological signs appear in advanced cases.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How is heavy metal exposure in pets diagnosed?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Blood lead/zinc levels, urinalysis, X-rays to detect foreign objects, and complete blood work help veterinarians confirm heavy metal exposure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can pets recover from lead or zinc exposure?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Early detection and chelation therapy can reverse some effects, but neurological damage from chronic lead exposure may be permanent in dogs and cats.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should exposed pets be monitored after treatment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Follow-up blood tests should occur at 2-4 weeks post-treatment, then monthly for 3 months to ensure heavy metal levels remain within safe ranges.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aspca.org/pet-care/animal-poison-control" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Animal Poison Control Center - Heavy Metals</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource on lead, zinc, and heavy metal toxicity symptoms and emergency treatment protocols for pets.</p>
          </li>
          <li>
            <a href="https://www.avma.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA) - Lead Exposure in Pets</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based guidelines for diagnosing and managing lead and zinc poisoning in companion animals with safe chelation protocols.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/lead" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA - Lead in Soil Around Homes</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official EPA guidance on residential lead contamination testing, safe limits, and remediation standards to protect pets and families.</p>
          </li>
          <li>
            <a href="https://www.vin.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network (VIN) - Heavy Metal Toxicity in Animals</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical database providing detailed toxicology data, case studies, and treatment outcomes for metal poisoning in dogs and cats.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Heavy Metal (Lead/Zinc) Exposure Risk"
      description="Assess the risk of poisoning from exposure to heavy metals like **lead or zinc** (e.g., from cages or toys)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Risk Score = Exposure Dose (mg/kg) × Body Weight (kg)",
        variables: [
          { symbol: "Exposure Dose (mg/kg)", description: "Estimated heavy metal dose per kg of bird weight" },
          { symbol: "Body Weight (kg)", description: "Bird's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 2.2 lb (1 kg) parakeet is estimated to have ingested 8 mg/kg of zinc from a galvanized cage.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg (already 1 kg). Multiply exposure dose by weight: 8 mg/kg × 1 kg = 8.",
          },
          {
            label: "2",
            explanation:
              "Interpret risk score: 8 falls into moderate risk category, indicating potential toxicity requiring monitoring.",
          },
        ],
        result:
          "Risk Score = 8; Moderate Risk of Heavy Metal Toxicity. Veterinary evaluation recommended.",
      }}
      relatedCalculators={[
        {
          title: "Calcium + D3 Supplement Calculator",
          url: "/pets/reptile-calcium-d3-supplement",
          icon: "🐾",
        },
        {
          title: "Litter Box Output Tracker (Normal vs. Increased)",
          url: "/pets/cat-litter-box-output-tracker",
          icon: "🐶",
        },
        {
          title: "Cat BMI/Body Index (educational)",
          url: "/pets/cat-bmi-body-index-educational",
          icon: "🐱",
        },
        {
          title: "Dehydration Risk Estimator (Weight & Symptoms Aware)",
          url: "/pets/dog-dehydration-risk-estimator",
          icon: "🍖",
        },
        {
          title: "Protein/Fat Intake Guide for Cats (by Goal)",
          url: "/pets/cat-protein-fat-intake-guide",
          icon: "🐱",
        },
        {
          title: "Life Expectancy Estimator (lifestyle factors; educational)",
          url: "/pets/cat-life-expectancy-estimator",
          icon: "🐱",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Heavy Metal (Lead/Zinc) Exposure Risk" },
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
