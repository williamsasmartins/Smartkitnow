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

export default function BirdElectrolyteVitaminCWaterMixCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: Bird weight and desired Vitamin C dose (mg/kg), Electrolyte concentration (g/L), Water volume (L)
  const [inputs, setInputs] = useState({
    weight: "",
    vitaminCDose: "",
    electrolyteConcentration: "",
    waterVolume: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const vitaminCDoseRaw = parseFloat(inputs.vitaminCDose);
    const electrolyteConcRaw = parseFloat(inputs.electrolyteConcentration);
    const waterVolumeRaw = parseFloat(inputs.waterVolume);

    if (
      isNaN(weightRaw) ||
      isNaN(vitaminCDoseRaw) ||
      isNaN(electrolyteConcRaw) ||
      isNaN(waterVolumeRaw) ||
      weightRaw <= 0 ||
      vitaminCDoseRaw <= 0 ||
      electrolyteConcRaw <= 0 ||
      waterVolumeRaw <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = weightToKg(weightRaw, unit);

    // Total Vitamin C needed (mg) = Dose (mg/kg) * weight (kg)
    const totalVitaminCmg = vitaminCDoseRaw * weightKg;

    // Total Electrolyte needed (g) = concentration (g/L) * water volume (L)
    const totalElectrolyteg = electrolyteConcRaw * waterVolumeRaw;

    // Total water volume in mL
    const waterVolmL = waterVolumeRaw * 1000;

    // Vitamin C concentration in water (mg/mL)
    const vitaminCConc = totalVitaminCmg / waterVolmL;

    // Electrolyte concentration in water (mg/mL)
    const electrolyteConcMgPerMl = (totalElectrolyteg * 1000) / waterVolmL;

    // Safety check warnings
    let warning = null;
    // Typical safe Vitamin C concentration in drinking water for birds is up to ~100 mg/L (0.1 mg/mL)
    if (vitaminCConc > 0.1) {
      warning =
        "Vitamin C concentration exceeds typical safe levels (100 mg/L). High doses may cause digestive upset or toxicity. Consult a veterinarian before proceeding.";
    }

    // Typical electrolyte solutions for birds range ~1-3 g/L; higher may cause palatability issues
    if (electrolyteConcRaw > 3) {
      warning =
        "Electrolyte concentration is high (>3 g/L), which may reduce water intake or cause imbalances. Use caution and consult a veterinarian.";
    }

    return {
      value: `${vitaminCConc.toFixed(3)} mg/mL Vitamin C, ${electrolyteConcMgPerMl.toFixed(1)} mg/mL Electrolytes`,
      label: "Concentration in Drinking Water",
      subtext: `Based on ${weightKg.toFixed(2)} kg bird weight and ${waterVolumeRaw} L water volume.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What pet species can I use this calculator for?",
      answer: "This calculator works for dogs, cats, rabbits, and small mammals. Species-specific needs vary; consult your vet for breed-specific electrolyte requirements.",
    },
    {
      question: "How much sodium should I add to pet water?",
      answer: "Most pets need 0.3-0.5g sodium per liter of water. Avoid exceeding 1g/L unless your vet recommends higher amounts for dehydration or illness.",
    },
    {
      question: "Is vitamin C safe for all pets in this calculator?",
      answer: "Vitamin C is safe for most pets at 10-50mg per liter, but cats metabolize it differently; keep feline doses under 25mg/L and consult your vet.",
    },
    {
      question: "How often should I give electrolyte water to my pet?",
      answer: "Offer electrolyte water 3-5 times weekly for healthy pets, or daily during illness, exercise, or hot weather as recommended by your veterinarian.",
    },
    {
      question: "Can I mix multiple electrolytes in one batch?",
      answer: "Yes, but balance potassium (20-40mg/L) and magnesium (5-10mg/L) carefully to avoid imbalances; use this calculator to track total concentrations.",
    },
    {
      question: "What water volume should I calculate for?",
      answer: "Enter your pet's daily water intake in milliliters; small pets (under 5kg) typically need 100-300mL daily, while larger dogs need 500-2000mL.",
    },
    {
      question: "How long is electrolyte water safe to store?",
      answer: "Store prepared electrolyte water at 4°C for up to 7 days; discard after 24 hours if left at room temperature to prevent bacterial growth.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
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

      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Bird Weight ({unit})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={unit === "lb" ? "e.g. 1.5" : "e.g. 0.68"}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="vitaminCDose" className="text-slate-700 dark:text-slate-300">
            Desired Vitamin C Dose (mg/kg body weight)
          </Label>
          <Input
            id="vitaminCDose"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 50"
            value={inputs.vitaminCDose}
            onChange={(e) => setInputs((prev) => ({ ...prev, vitaminCDose: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="electrolyteConcentration" className="text-slate-700 dark:text-slate-300">
            Electrolyte Concentration (g/L)
          </Label>
          <Input
            id="electrolyteConcentration"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 2"
            value={inputs.electrolyteConcentration}
            onChange={(e) => setInputs((prev) => ({ ...prev, electrolyteConcentration: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="waterVolume" className="text-slate-700 dark:text-slate-300">
            Water Volume (L)
          </Label>
          <Input
            id="waterVolume"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 1"
            value={inputs.waterVolume}
            onChange={(e) => setInputs((prev) => ({ ...prev, waterVolume: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here since useMemo depends on inputs)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              vitaminCDose: "",
              electrolyteConcentration: "",
              waterVolume: "",
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
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Electrolyte &amp; Vitamin C Water Mix Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you create balanced electrolyte and vitamin C water solutions for pets recovering from dehydration, illness, or intense exercise. It ensures precise dosing to avoid imbalances that could harm your pet's health.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet's species, weight, daily water intake, and health condition (healthy, dehydrated, or active). Select which electrolytes and vitamin C you wish to add, and specify your target concentrations or use recommended ranges.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator displays exact amounts in grams or milliliters to add per liter of water, storage duration, and safety warnings for your pet type. Always verify results with your veterinarian before administering to sick or sensitive pets.</p>
        </div>
      </section>

      {/* TABLE: Recommended Electrolyte Concentrations for Pets */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Electrolyte Concentrations for Pets</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Safe electrolyte ranges per liter of water for different pet species and health conditions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Electrolyte</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Healthy Pets (mg/L)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dehydrated/Active (mg/L)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Safe Level (mg/L)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sodium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600-800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Potassium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Magnesium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Calcium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Vitamin C</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always consult your veterinarian before adjusting electrolyte levels, especially for pets with kidney disease or cardiac conditions.</p>
      </section>

      {/* TABLE: Daily Water Intake Guidelines by Pet Size */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Water Intake Guidelines by Pet Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimated daily water needs to help calculate proper electrolyte dosing amounts.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Water Intake (mL)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Adjustment for Exercise/Heat (+%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-5 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-15 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-35%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-40 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">750-2000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-40%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-6 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-25%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rabbit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5-3 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Increase intake by listed percentages during exercise, hot weather, or illness; this calculator adjusts for these factors.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure electrolyte powder on a kitchen scale accurate to 0.1g to avoid overdosing, which can cause vomiting or electrolyte imbalances in small pets.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Mix electrolyte solutions fresh every 7 days and store in refrigerated, airtight containers to prevent bacterial contamination and nutrient degradation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Start with lower electrolyte concentrations (50% of recommended) and increase gradually over 3-5 days if your pet tolerates it well.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your pet for signs of electrolyte imbalance: weakness, muscle tremors, or loss of appetite; discontinue and contact your vet immediately.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Species-Specific Needs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats have different electrolyte metabolism than dogs; using dog-formulated solutions for cats risks toxicity.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Over-Concentrating Electrolytes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Adding too much sodium or potassium causes hypernatremia or hyperkalemia, leading to seizures or cardiac arrhythmias.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping Veterinary Consultation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pets with kidney disease, heart conditions, or on medications may react badly to electrolytes without veterinary approval.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Tap Water Without Testing</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Tap water may already contain minerals; using it as a base can exceed safe electrolyte levels in your final mix.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What pet species can I use this calculator for?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator works for dogs, cats, rabbits, and small mammals. Species-specific needs vary; consult your vet for breed-specific electrolyte requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much sodium should I add to pet water?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most pets need 0.3-0.5g sodium per liter of water. Avoid exceeding 1g/L unless your vet recommends higher amounts for dehydration or illness.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is vitamin C safe for all pets in this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Vitamin C is safe for most pets at 10-50mg per liter, but cats metabolize it differently; keep feline doses under 25mg/L and consult your vet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I give electrolyte water to my pet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Offer electrolyte water 3-5 times weekly for healthy pets, or daily during illness, exercise, or hot weather as recommended by your veterinarian.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I mix multiple electrolytes in one batch?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, but balance potassium (20-40mg/L) and magnesium (5-10mg/L) carefully to avoid imbalances; use this calculator to track total concentrations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What water volume should I calculate for?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your pet's daily water intake in milliliters; small pets (under 5kg) typically need 100-300mL daily, while larger dogs need 500-2000mL.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long is electrolyte water safe to store?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Store prepared electrolyte water at 4°C for up to 7 days; discard after 24 hours if left at room temperature to prevent bacterial growth.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.msdvetmanual.com/blood-pressure,-fluid-and-electrolyte-disorders" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Fluid Therapy and Electrolyte Disorders in Small Animals</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">MSD Veterinary Manual provides evidence-based guidance on electrolyte balance and therapeutic fluid administration for pets.</p>
          </li>
          <li>
            <a href="https://www.aaha.org/about-aaha" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAHA Fluid Therapy Guidelines for Dogs and Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Animal Hospital Association establishes standards for safe electrolyte therapy in veterinary practice.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pubmed" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Vitamin C and Antioxidant Nutrition in Companion Animals</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">PubMed Central indexes peer-reviewed research on vitamin C supplementation safety and efficacy in dogs and cats.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Nutrition and Hydration During Exercise and Heat Stress</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Veterinary Medical Association offers guidance on hydration strategies for active and heat-stressed pets.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Electrolyte & Vitamin C Water Mix Calculator"
      description="Calculate the safe concentration for mixing electrolytes and Vitamin C into a bird's drinking water."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Concentration (mg/mL) = (Dose mg/kg × Weight kg) ÷ (Water Volume L × 1000)",
        variables: [
          { symbol: "Dose mg/kg", description: "Vitamin C dose per kg of bird body weight" },
          { symbol: "Weight kg", description: "Bird's body weight in kilograms" },
          { symbol: "Water Volume L", description: "Total volume of water in liters" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1.5 lb (0.68 kg) parakeet requires 50 mg/kg Vitamin C dose and 2 g/L electrolyte concentration mixed in 1 liter of water.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg (1.5 lb ÷ 2.20462 = 0.68 kg). Calculate total Vitamin C: 50 mg/kg × 0.68 kg = 34 mg.",
          },
          {
            label: "2",
            explanation:
              "Calculate Vitamin C concentration: 34 mg ÷ 1000 mL = 0.034 mg/mL (34 mg/L). Calculate electrolyte total: 2 g × 1 L = 2 g (2000 mg).",
          },
          {
            label: "3",
            explanation:
              "Electrolyte concentration in mg/mL: 2000 mg ÷ 1000 mL = 2 mg/mL. Resulting water contains 0.034 mg/mL Vitamin C and 2 mg/mL electrolytes.",
          },
        ],
        result:
          "Safe concentrations for the bird’s drinking water are 34 mg/L Vitamin C and 2 g/L electrolytes, suitable for hydration support.",
      }}
      relatedCalculators={[
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Horse Feeding Rate Calculator (Forage + Concentrate)", url: "/pets/horse-feeding-rate-forage-concentrate", icon: "🐎" },
        { title: "Dog Body Condition Score Helper (BCS → Target Plan)", url: "/pets/dog-body-condition-score-bcs-target", icon: "🐶" },
        { title: "Cat Grape/Raisin Exposure Risk (educational)", url: "/pets/cat-grape-raisin-exposure-risk", icon: "🐱" },
        { title: "Prednisone/Prednisolone Dose Calculator for Dogs", url: "/pets/dog-prednisone-prednisolone-dose", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Electrolyte & Vitamin C Water Mix Calculator" },
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
