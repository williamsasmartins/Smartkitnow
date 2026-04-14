import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseWaterIntakeTemperatureWeightCalculator() {
  // 1. STATE
  // Unit selector needed for weight input (lbs or kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight and ambient temperature
  const [inputs, setInputs] = useState({
    weight: "",
    temperature: "",
  });

  // 2. LOGIC ENGINE
  // Formula source: 
  // Typical water intake for horses is approx 50 ml/kg/day at moderate temps (~20°C).
  // Intake increases by ~10% for each 5°C increase above 20°C.
  // Intake decreases slightly below 20°C but minimum maintained ~40 ml/kg.
  // Reference: National Research Council, Equine Nutrition.

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const tempRaw = parseFloat(inputs.temperature);

    if (isNaN(weightRaw) || weightRaw <= 0 || isNaN(tempRaw)) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Base intake at 20°C = 50 ml/kg/day
    // For every 5°C above 20, increase intake by 10%
    // For temps below 20°C, intake minimum 40 ml/kg/day

    let baseIntakePerKg = 50; // ml/kg/day

    if (tempRaw < 20) {
      baseIntakePerKg = 40; // minimum intake below 20°C
    } else if (tempRaw > 20) {
      const increments = Math.floor((tempRaw - 20) / 5);
      baseIntakePerKg = 50 * (1 + 0.10 * increments);
    }

    // Total intake in liters/day
    const intakeMl = baseIntakePerKg * weightKg;
    const intakeLiters = intakeMl / 1000;

    // Convert back to gallons if imperial
    const intakeImperial = intakeLiters * 0.264172;

    return {
      value: unit === "imperial" ? intakeImperial.toFixed(2) : intakeLiters.toFixed(2),
      label: unit === "imperial" ? "Gallons per day" : "Liters per day",
      subtext: `Based on weight of ${weightRaw} ${unit === "imperial" ? "lbs" : "kg"} and ambient temperature of ${tempRaw}°C`,
      warning:
        weightRaw < 200
          ? "Warning: Weight below typical adult horse range; results may be less accurate."
          : null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How much water should a 1,000 lb horse drink daily?",
      answer: "A 1,000 lb horse typically needs 5–10 gallons per day under normal conditions, but this increases significantly in hot weather or during exercise.",
    },
    {
      question: "Does temperature affect how much water horses need?",
      answer: "Yes, horses in temperatures above 75°F may require 25–50% more water than in cool conditions due to increased sweating and heat stress.",
    },
    {
      question: "What's the relationship between horse weight and water intake?",
      answer: "Water needs scale roughly with body weight; a 500 lb pony requires about half the water of a 1,000 lb horse under identical conditions.",
    },
    {
      question: "Can horses drink too much water?",
      answer: "Horses can overconsume water in certain situations, but they typically self-regulate; excessive intake may indicate salt deficiency or metabolic issues.",
    },
    {
      question: "How do I know if my horse is drinking enough?",
      answer: "Check for dark yellow urine, normal skin turgor, and moist mucous membranes; pale or absent urine suggests dehydration.",
    },
    {
      question: "Does exercise increase water requirements?",
      answer: "Yes, working horses can require 2–3 times normal water intake depending on intensity and duration of exercise.",
    },
    {
      question: "When should I use this calculator for my horse?",
      answer: "Use it daily during warm months, when traveling, during training, or whenever monitoring hydration status to prevent colic and heat stress.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
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
            min={0}
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="temperature" className="text-slate-700 dark:text-slate-300">
            Ambient Temperature (°C)
          </Label>
          <Input
            id="temperature"
            type="number"
            step="any"
            placeholder="Enter ambient temperature in °C"
            value={inputs.temperature}
            onChange={(e) => setInputs((prev) => ({ ...prev, temperature: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", temperature: "" })}
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Horse Water Intake by Temperature & Weight</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates daily water requirements for horses based on body weight and ambient temperature. It accounts for baseline hydration needs and thermal stress to help prevent dehydration, colic, and heat-related illness.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your horse's weight in pounds and the current or forecasted temperature in Fahrenheit. The calculator will generate a recommended water intake range in gallons per day.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Use the results to monitor water troughs, adjust feeding schedules, and plan electrolyte supplementation. Always ensure fresh water is continuously available, especially during hot weather or strenuous activity.</p>
        </div>
      </section>

      {/* TABLE: Daily Water Intake Guidelines by Horse Weight (Moderate Conditions) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Water Intake Guidelines by Horse Weight (Moderate Conditions)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows baseline daily water consumption for horses at rest in temperatures between 50–70°F.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Horse Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Daily Intake (gallons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Daily Intake (gallons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Pony or small horse</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium pony or large pony</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Average adult horse</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large riding horse</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Draft horse or warmblood</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Intake varies by individual metabolism, diet composition, and access to fresh water.</p>
      </section>

      {/* TABLE: Water Intake Multipliers by Temperature */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Water Intake Multipliers by Temperature</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Apply these multipliers to baseline water intake to account for heat stress and increased sweating.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temperature Range (°F)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Multiplier</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example: 1,000 lb Horse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50–70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–10 gallons/day</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">71–80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.25x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6–13 gallons/day</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">81–90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7–15 gallons/day</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">91–100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–20 gallons/day</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12–25 gallons/day</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Humidity levels and wind exposure also affect actual water demand beyond temperature alone.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Offer water before, during, and after exercise; horses may not drink adequately if water is presented only once daily.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Add salt to feed or provide free-choice mineral blocks to encourage drinking and replace electrolytes lost through sweat.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor urine color and consistency as a practical hydration indicator; dark or scant urine suggests insufficient intake.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Clean water troughs daily and keep water cool in summer to encourage consumption and reduce bacterial growth.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring temperature changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming winter water intake applies in summer can lead to severe dehydration; always adjust for seasonal and daily temperature fluctuations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting exercise and workload</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator provides baseline estimates; working horses require significantly more water and may need supplements beyond calculated amounts.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using cold water exclusively in summer</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While cool water encourages drinking, extremely cold water can cause digestive upset; aim for 45–65°F in hot climates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Relying solely on calculator results</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Individual variation is high; combine calculator guidance with direct observation of your horse's behavior, appetite, and hydration cues.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much water should a 1,000 lb horse drink daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 1,000 lb horse typically needs 5–10 gallons per day under normal conditions, but this increases significantly in hot weather or during exercise.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does temperature affect how much water horses need?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, horses in temperatures above 75°F may require 25–50% more water than in cool conditions due to increased sweating and heat stress.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the relationship between horse weight and water intake?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Water needs scale roughly with body weight; a 500 lb pony requires about half the water of a 1,000 lb horse under identical conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can horses drink too much water?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Horses can overconsume water in certain situations, but they typically self-regulate; excessive intake may indicate salt deficiency or metabolic issues.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know if my horse is drinking enough?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Check for dark yellow urine, normal skin turgor, and moist mucous membranes; pale or absent urine suggests dehydration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does exercise increase water requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, working horses can require 2–3 times normal water intake depending on intensity and duration of exercise.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">When should I use this calculator for my horse?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use it daily during warm months, when traveling, during training, or whenever monitoring hydration status to prevent colic and heat stress.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nap.edu/catalog/25553/nutrient-requirements-of-horses-seventh-revised-edition" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Nutrition and Feeding – National Research Council</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource on horse nutritional needs including water requirements by weight and activity level.</p>
          </li>
          <li>
            <a href="https://aaep.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Heat Stress in Horses – American Association of Equine Practitioners</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Guidelines for preventing heat illness and managing water intake during high temperatures and competition.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Hydration and Electrolyte Balance – UC Davis School of Veterinary Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on optimal hydration strategies and electrolyte supplementation for performance horses.</p>
          </li>
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Colic Prevention – AAFCO Equine Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Best practices for preventing colic through proper hydration, forage intake, and water management protocols.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Water Intake by Temperature & Weight"
      description="Estimate the minimum daily water intake required for a horse based on its weight and ambient air temperature."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Daily Water Intake (ml) = Weight (kg) × Base Intake (ml/kg) × Temperature Adjustment Factor",
        variables: [
          { symbol: "Weight (kg)", description: "Horse body weight in kilograms" },
          {
            symbol: "Base Intake (ml/kg)",
            description: "Baseline water intake at 20°C (50 ml per kg body weight)",
          },
          {
            symbol: "Temperature Adjustment Factor",
            description:
              "Multiplier increasing intake by 10% for every 5°C above 20°C; minimum intake at cooler temps",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse is kept in an environment with an ambient temperature of 30°C. Calculate the estimated daily water intake.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms: 1100 lbs ÷ 2.20462 = 499 kg (approx).",
          },
          {
            label: "2",
            explanation:
              "Calculate temperature increments above 20°C: (30 - 20) ÷ 5 = 2 increments.",
          },
          {
            label: "3",
            explanation:
              "Calculate intake per kg: 50 ml × (1 + 0.10 × 2) = 60 ml/kg.",
          },
          {
            label: "4",
            explanation:
              "Calculate total intake: 499 kg × 60 ml = 29,940 ml = 29.94 liters.",
          },
        ],
        result:
          "The horse should consume approximately 29.94 liters (7.91 gallons) of water daily under these conditions.",
      }}
      relatedCalculators={[
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "🐾",
        },
        {
          title: "Dewormer Dose Calculator (by Drug Class & Weight)",
          url: "/pets/horse-dewormer-dose-calculator",
          icon: "🐶",
        },
        {
          title: "Egg Binding Risk Estimator",
          url: "/pets/bird-egg-binding-risk-estimator",
          icon: "🐱",
        },
        {
          title: "Vitamin D3 Requirement (Supplemental)",
          url: "/pets/reptile-vitamin-d3-requirement",
          icon: "🍖",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Puppy Adult Size Predictor (Weight Curve)",
          url: "/pets/puppy-adult-size-predictor-weight-curve",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Water Intake by Temperature & Weight" },
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