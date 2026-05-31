import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseOmega3SupplementPlannerCalculator() {
  // 1. STATE
  // Default unit system is imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs or kg), desired EPA/DHA dose mg per kg body weight
  const [inputs, setInputs] = useState({
    weight: "",
    doseMgPerKg: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const doseNum = parseFloat(inputs.doseMgPerKg);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(doseNum) ||
      doseNum <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if input is imperial (lbs)
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Total EPA/DHA supplement dose in mg = dose (mg/kg) * weight (kg)
    const totalDoseMg = doseNum * weightKg;

    // Format result with commas and 1 decimal place
    const formattedDose = totalDoseMg.toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

    // Warning if dose is unusually high (e.g. > 100 mg/kg)
    const warning =
      doseNum > 100
        ? "The dose entered is quite high. Please consult a veterinarian before administering such amounts."
        : null;

    return {
      value: formattedDose,
      label: "Total EPA/DHA Supplement Dose (mg)",
      subtext: `Based on ${weightKg.toFixed(2)} kg body weight and ${doseNum} mg/kg dose`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the recommended EPA/DHA dosage per kilogram of body weight for dogs?",
      answer: "Most veterinarians recommend 40–55 mg of combined EPA/DHA per kg of body weight daily for adult dogs, though therapeutic doses for joint or cognitive support may reach 100 mg/kg.",
    },
    {
      question: "How do I calculate the right omega-3 dose for my cat's weight?",
      answer: "Cats typically require 20–40 mg of combined EPA/DHA per kg of body weight daily; multiply your cat's weight in kg by the recommended dose range to determine total daily mg needed.",
    },
    {
      question: "Why does the calculator use EPA/DHA per kilogram instead of total milligrams?",
      answer: "Weight-based dosing ensures accurate supplementation across different pet sizes and prevents under- or over-supplementation, which is especially important for safety in smaller animals.",
    },
    {
      question: "Can I use human omega-3 supplements for my pet?",
      answer: "No; human supplements often contain unsafe additives and incorrect ratios of EPA/DHA for pets—always use veterinary-formulated products designed for your pet's species and size.",
    },
    {
      question: "What is the maximum safe EPA/DHA dose per kg for pets?",
      answer: "Most sources recommend not exceeding 200 mg of combined EPA/DHA per kg daily; excess intake may cause bleeding, diarrhea, or immune suppression in some animals.",
    },
    {
      question: "How long does it take to see benefits from omega-3 supplementation?",
      answer: "Most pets show improvements in coat quality within 4–6 weeks and joint health benefits within 8–12 weeks of consistent daily supplementation.",
    },
    {
      question: "Does the EPA/DHA ratio matter when selecting a supplement?",
      answer: "Yes; a balanced ratio of EPA to DHA (typically 1.5:1 to 2:1) is most effective for reducing inflammation, though some conditions benefit from higher EPA ratios.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET JSX
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
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="doseMgPerKg" className="text-slate-700 dark:text-slate-300">
            Desired EPA/DHA Dose (mg per kg body weight)
          </Label>
          <Input
            id="doseMgPerKg"
            type="number"
            min="0"
            step="any"
            placeholder="Typical range: 30 - 60 mg/kg"
            value={inputs.doseMgPerKg}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, doseMgPerKg: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", doseMgPerKg: "" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 5. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Omega-3 Supplement Planner (EPA/DHA per kg)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps pet owners determine the correct daily omega-3 dose for their dogs, cats, or other pets by converting weight-based EPA/DHA recommendations into practical dosing amounts. It removes guesswork from supplementation and ensures your pet receives therapeutic benefits without overdosing.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet's weight in kilograms, select their species and health goal (maintenance, joint support, or cognitive health), and choose your supplement type to see the EPA/DHA concentration. The calculator will display your pet's daily target dose in milligrams and the recommended number of capsules or volume to administer.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Use the result to cross-check your supplement label's EPA/DHA content and confirm you're giving the correct amount each day. Adjust doses gradually over 1–2 weeks and monitor for side effects like soft stools or fishy breath, which may indicate the need for a lower dose.</p>
        </div>
      </section>

      {/* TABLE: Recommended Omega-3 (EPA/DHA) Dosage by Pet Type and Goal */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Omega-3 (EPA/DHA) Dosage by Pet Type and Goal</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to identify baseline EPA/DHA targets per kg for your pet based on health goal and species.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maintenance (mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Joint Support (mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cognitive/Senior (mg/kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dogs (adult)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40–55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75–100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60–85</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cats (adult)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50–75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45–70</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Puppies (growth)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kittens (growth)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior dogs (8+)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50–75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80–110</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70–95</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior cats (10+)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60–85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55–80</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are general guidelines; consult your veterinarian for personalized dosing, especially for pets with bleeding disorders or on blood-thinning medications.</p>
      </section>

      {/* TABLE: EPA/DHA Content in Common Pet Supplement Sources */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">EPA/DHA Content in Common Pet Supplement Sources</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Compare the concentration of EPA and DHA across popular supplement types to calculate doses accurately.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Supplement Source</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EPA per 1,000 mg</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">DHA per 1,000 mg</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total EPA+DHA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fish oil (standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300 mg</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fish oil (concentrated)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">230 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">580 mg</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Krill oil</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250 mg</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Algae-based (vegan)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280 mg</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Salmon oil</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">140 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">340 mg</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Anchovy oil</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">220 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">130 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350 mg</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Product labels may vary by brand and batch; always verify EPA/DHA content on the supplement label before calculating dosage.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always source omega-3 supplements from reputable veterinary brands that third-party test for purity, rancidity, and contaminants like heavy metals.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store fish oil supplements in the refrigerator or freezer to prevent oxidation and rancidity, which reduces potency and can cause GI upset.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If your pet is on anticoagulant medications (warfarin, aspirin), consult your vet before supplementing, as omega-3s have mild blood-thinning properties.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Mix liquid omega-3 supplements with wet food or a small treat to improve palatability and ensure your pet consumes the full dose.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing total product weight with EPA/DHA content</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 1,000 mg fish oil capsule does not contain 1,000 mg of EPA/DHA; it typically contains only 300–350 mg combined—always read the Supplement Facts label carefully.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the same dose for all life stages</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Puppies and kittens require lower doses than adults, while senior pets often benefit from higher therapeutic doses; adjust recommendations based on age and health status.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overdosing to speed up results</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Exceeding 200 mg/kg daily can cause loose stools, bleeding gums, and immune suppression—more is not better, and consistency matters more than high doses.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring the EPA-to-DHA ratio</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Selecting a supplement with the wrong EPA/DHA balance may reduce effectiveness; joint support typically requires higher EPA, while cognitive health benefits from balanced or DHA-heavy formulas.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the recommended EPA/DHA dosage per kilogram of body weight for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most veterinarians recommend 40–55 mg of combined EPA/DHA per kg of body weight daily for adult dogs, though therapeutic doses for joint or cognitive support may reach 100 mg/kg.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the right omega-3 dose for my cat's weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cats typically require 20–40 mg of combined EPA/DHA per kg of body weight daily; multiply your cat's weight in kg by the recommended dose range to determine total daily mg needed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does the calculator use EPA/DHA per kilogram instead of total milligrams?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Weight-based dosing ensures accurate supplementation across different pet sizes and prevents under- or over-supplementation, which is especially important for safety in smaller animals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use human omega-3 supplements for my pet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No; human supplements often contain unsafe additives and incorrect ratios of EPA/DHA for pets—always use veterinary-formulated products designed for your pet's species and size.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the maximum safe EPA/DHA dose per kg for pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most sources recommend not exceeding 200 mg of combined EPA/DHA per kg daily; excess intake may cause bleeding, diarrhea, or immune suppression in some animals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does it take to see benefits from omega-3 supplementation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most pets show improvements in coat quality within 4–6 weeks and joint health benefits within 8–12 weeks of consistent daily supplementation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the EPA/DHA ratio matter when selecting a supplement?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes; a balanced ratio of EPA to DHA (typically 1.5:1 to 2:1) is most effective for reducing inflammation, though some conditions benefit from higher EPA ratios.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.isfm.net" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Society of Feline Medicine: Omega-3 Supplementation in Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical guidelines on safe omega-3 dosing and efficacy in feline patients.</p>
          </li>
          <li>
            <a href="https://www.aaha.org/aaha-guidelines" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Animal Hospital Association: Nutritional Guidelines for Dogs and Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations for essential fatty acid supplementation in companion animals.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">PubMed Central: EPA and DHA in Canine Joint and Cognitive Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on omega-3 efficacy for osteoarthritis and age-related cognitive decline in dogs.</p>
          </li>
          <li>
            <a href="https://www.ifos.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Omega-3 Index: Quality Standards for Pet Supplements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">International standards for purity, potency, and labeling accuracy of omega-3 products for animals.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Omega-3 Supplement Planner (EPA/DHA per kg)"
      description="Determine the required supplement dosage of Omega-3 fatty acids based on the horse's weight (kg)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Total EPA/DHA Dose (mg) = Dose (mg/kg) × Body Weight (kg)",
        variables: [
          { symbol: "Dose (mg/kg)", description: "Desired EPA/DHA dose per kilogram of body weight" },
          { symbol: "Body Weight (kg)", description: "Horse's body weight in kilograms" },
          { symbol: "Total EPA/DHA Dose (mg)", description: "Total supplement dose in milligrams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse requires an EPA/DHA dose of 50 mg/kg to support joint health during training.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight from pounds to kilograms: 1100 lbs ÷ 2.20462 = 499.0 kg (approx).",
          },
          {
            label: "2",
            explanation:
              "Multiply the dose by the weight: 50 mg/kg × 499.0 kg = 24,950 mg total EPA/DHA required.",
          },
          {
            label: "3",
            explanation:
              "Administer approximately 24,950 mg (24.95 grams) of EPA/DHA daily as per supplement instructions.",
          },
        ],
        result: "Total EPA/DHA Supplement Dose = 24,950 mg",
      }}
      relatedCalculators={[
        {
          title: "Dehydration Signs Estimator",
          url: "/pets/bird-dehydration-signs-estimator",
          icon: "🐾",
        },
        {
          title: "Dog Step-Goal & Activity Time Planner",
          url: "/pets/dog-step-goal-activity-time-planner",
          icon: "🐶",
        },
        {
          title: "Horse Calorie & Energy Requirement Calculator (DE / TDN)",
          url: "/pets/horse-calorie-energy-requirement-de-tdn",
          icon: "🐎",
        },
        {
          title: "Benadryl (Diphenhydramine) Dose Calculator for Cats",
          url: "/pets/cat-benadryl-diphenhydramine-dose",
          icon: "🐱",
        },
        {
          title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs",
          url: "/pets/dog-benadryl-diphenhydramine-dose",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Omega-3 Supplement Planner (EPA/DHA per kg)" },
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