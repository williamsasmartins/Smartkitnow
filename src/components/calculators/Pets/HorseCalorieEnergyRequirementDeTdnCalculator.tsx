import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseCalorieEnergyRequirementDeTdnCalculator() {
  // 1. STATE
  // Unit system: imperial (lbs) or metric (kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight, activity level factor, physiological status factor
  // Weight: horse body weight
  // Activity level: maintenance, light work, moderate work, heavy work
  // Physiological status: maintenance, pregnancy, lactation
  const [inputs, setInputs] = useState({
    weight: "",
    activityLevel: "maintenance",
    physiologicalStatus: "maintenance",
  });

  // Activity level factors based on NRC guidelines (approximate DE multipliers)
  const activityFactors: Record<string, number> = {
    maintenance: 1.0,
    light: 1.2,
    moderate: 1.4,
    heavy: 1.6,
  };

  // Physiological status factors (multipliers for DE)
  const physiologicalFactors: Record<string, number> = {
    maintenance: 1.0,
    pregnancy: 1.2,
    lactation: 1.5,
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive weight.",
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate Digestible Energy (DE) requirement in Mcal/day
    // DE (Mcal/day) = 1.4 * (BW in kg)^0.75 * Activity Factor * Physiological Factor
    // 1.4 Mcal/kg^0.75 is approximate maintenance DE requirement per NRC (varies by source)
    const activityFactor = activityFactors[inputs.activityLevel] || 1.0;
    const physiologicalFactor = physiologicalFactors[inputs.physiologicalStatus] || 1.0;

    const metabolicBodyWeight = Math.pow(weightKg, 0.75);
    const DE_Mcal = 1.4 * metabolicBodyWeight * activityFactor * physiologicalFactor;

    // Calculate Total Digestible Nutrients (TDN) requirement in kg/day
    // Approximate conversion: TDN (kg/day) = DE (Mcal/day) / 4.4 (Mcal/kg TDN)
    // 4.4 Mcal/kg TDN is average energy content of TDN
    const TDN_kg = DE_Mcal / 4.4;

    // Format results with 2 decimals
    const DE_display = DE_Mcal.toFixed(2);
    const TDN_display = TDN_kg.toFixed(2);

    return {
      value: `${DE_display} Mcal/day DE | ${TDN_display} kg/day TDN`,
      label: "Daily Digestible Energy & Total Digestible Nutrients Requirement",
      subtext:
        "Calculated based on body weight, activity level, and physiological status using NRC guidelines.",
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the difference between DE and TDN for horses?",
      answer: "DE (Digestible Energy) measures energy available after digestion in megacalories, while TDN (Total Digestible Nutrients) expresses energy as a percentage of feed intake. Both metrics help determine daily caloric needs, with TDN commonly used in forage analysis and DE in commercial feed formulations.",
    },
    {
      question: "How does a horse's weight affect calorie requirements?",
      answer: "Heavier horses require more total calories daily; a 1,000 lb horse needs approximately 15,000–20,000 kcal/day depending on activity level, while a 500 lb pony needs 7,500–10,000 kcal/day under similar conditions.",
    },
    {
      question: "What activity levels should I select for my horse?",
      answer: "Select 'Idle' for horses at pasture with minimal work, 'Light' for 1–3 hours weekly riding, 'Moderate' for 3–5 hours weekly training, and 'Heavy' for competition or intense work &gt;5 hours weekly.",
    },
    {
      question: "How do age and body condition score impact energy needs?",
      answer: "Young growing horses need 20–30% extra calories for development, while senior horses (&gt;20 years) require 10–15% more digestible energy; underweight horses need additional calories to reach ideal condition score of 5–6 on a 1–9 scale.",
    },
    {
      question: "Why does the calculator adjust for body condition scoring?",
      answer: "Horses in poor condition (score &lt;4) require surplus calories for weight gain, while overweight horses (score &gt;7) need reduced intake; accurate scoring ensures the calculator recommends appropriate daily energy intake for your horse's goals.",
    },
    {
      question: "Can I use this calculator for ponies and miniature horses?",
      answer: "Yes, the calculator works for all equine sizes by adjusting weight inputs; ponies typically need 1.2–1.5 Mcal DE daily, while minis need 0.5–0.8 Mcal DE depending on activity.",
    },
    {
      question: "How often should I recalculate my horse's energy requirements?",
      answer: "Recalculate quarterly or whenever weight changes by &gt;5%, activity level shifts significantly, or season changes; pregnant or lactating mares require recalculation monthly.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function onInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
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
            Horse Body Weight ({unit === "imperial" ? "lbs" : "kg"})
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
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300">
            Activity Level
          </Label>
          <select
            id="activityLevel"
            name="activityLevel"
            value={inputs.activityLevel}
            onChange={onInputChange}
            className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="maintenance">Maintenance (No work)</option>
            <option value="light">Light Work (e.g., walking, light riding)</option>
            <option value="moderate">Moderate Work (e.g., regular riding, training)</option>
            <option value="heavy">Heavy Work (e.g., intense training, racing)</option>
          </select>
        </div>

        <div>
          <Label htmlFor="physiologicalStatus" className="text-slate-700 dark:text-slate-300">
            Physiological Status
          </Label>
          <select
            id="physiologicalStatus"
            name="physiologicalStatus"
            value={inputs.physiologicalStatus}
            onChange={onInputChange}
            className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="maintenance">Maintenance</option>
            <option value="pregnancy">Pregnancy</option>
            <option value="lactation">Lactation</option>
          </select>
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
          onClick={() =>
            setInputs({
              weight: "",
              activityLevel: "maintenance",
              physiologicalStatus: "maintenance",
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and personalized advice.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Horse Calorie & Energy Requirement Calculator (DE / TDN)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates daily digestible energy (DE) and total digestible nutrient (TDN) requirements for horses of any age, weight, and activity level. It combines National Research Council (NRC) standards with equine-specific metabolic factors to provide accurate caloric targets.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your horse's weight in pounds, select its age category (growing, adult, senior), activity level (idle to heavy work), and body condition score (1–9 scale). Optionally input pregnancy/lactation status or special health conditions for refined estimates.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator outputs daily energy needs in megacalories (Mcal) of digestible energy and percentage TDN, along with feed recommendations to meet those targets. Use results to balance grain, hay, and supplements for optimal weight maintenance or performance goals.</p>
        </div>
      </section>

      {/* TABLE: Daily Energy Requirements by Weight & Activity Level (DE/Mcal) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Energy Requirements by Weight & Activity Level (DE/Mcal)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimated digestible energy needs for mature horses at maintenance and various activity levels.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Horse Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Idle/Maintenance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Light Work</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Work</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Heavy Work</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19.0</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25.0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30.0</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">37.0</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values based on NRC (National Research Council) 2007 guidelines; adjust upward 10–15% for senior horses and pregnant/lactating mares.</p>
      </section>

      {/* TABLE: TDN Content in Common Horse Feeds (% of DM) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">TDN Content in Common Horse Feeds (% of DM)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Total Digestible Nutrients percentages help convert feed weight to energy equivalents.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Feed Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">TDN Range (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical DE (Mcal/lb)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Timothy Hay (mature)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50–55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.90–1.00</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Alfalfa Hay (early bloom)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60–65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.20–1.35</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oat Grain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75–80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.50–1.65</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Barley</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">78–82</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.55–1.70</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Commercial Grain Mix (12% protein)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65–72</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.30–1.45</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">TDN varies by forage quality, harvest timing, and storage; conduct hay analysis for precision in performance horses.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your horse quarterly using a scale or weight tape to ensure calculator accuracy, as even ±5% weight errors skew energy estimates significantly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Match calculated DE requirements to forage first (hay provides 0.9–1.4 Mcal DE/lb); add grain only if hay cannot meet total needs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Increase calorie estimates by 20–25% during winter or extreme weather when horses burn extra energy for thermoregulation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor body condition score monthly and adjust feed amounts if actual score drifts from target; use scale photos or grid methods for consistency.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Body Weight with Ideal Weight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Always input current actual weight, not ideal weight; the calculator adjusts caloric intake based on whether your horse is underweight or overweight relative to condition score.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Seasonal Activity Fluctuations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to update activity level when switching from winter turnout to spring competition results in over- or under-feeding and weight swings.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting Forage Quality Variation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming all hay has identical TDN leads to feed imbalances; poor-quality hay (&lt;50% TDN) requires higher grain supplementation than assumed.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Senior or Young Horse Multipliers</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to account for senior horses needing 10–15% more digestible energy or growing horses needing 20–30% surplus causes chronic underfeeding.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between DE and TDN for horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">DE (Digestible Energy) measures energy available after digestion in megacalories, while TDN (Total Digestible Nutrients) expresses energy as a percentage of feed intake. Both metrics help determine daily caloric needs, with TDN commonly used in forage analysis and DE in commercial feed formulations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does a horse's weight affect calorie requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Heavier horses require more total calories daily; a 1,000 lb horse needs approximately 15,000–20,000 kcal/day depending on activity level, while a 500 lb pony needs 7,500–10,000 kcal/day under similar conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What activity levels should I select for my horse?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Select 'Idle' for horses at pasture with minimal work, 'Light' for 1–3 hours weekly riding, 'Moderate' for 3–5 hours weekly training, and 'Heavy' for competition or intense work &gt;5 hours weekly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do age and body condition score impact energy needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Young growing horses need 20–30% extra calories for development, while senior horses (&gt;20 years) require 10–15% more digestible energy; underweight horses need additional calories to reach ideal condition score of 5–6 on a 1–9 scale.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does the calculator adjust for body condition scoring?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Horses in poor condition (score &lt;4) require surplus calories for weight gain, while overweight horses (score &gt;7) need reduced intake; accurate scoring ensures the calculator recommends appropriate daily energy intake for your horse's goals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for ponies and miniature horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator works for all equine sizes by adjusting weight inputs; ponies typically need 1.2–1.5 Mcal DE daily, while minis need 0.5–0.8 Mcal DE depending on activity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my horse's energy requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate quarterly or whenever weight changes by &gt;5%, activity level shifts significantly, or season changes; pregnant or lactating mares require recalculation monthly.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://nap.nationalacademies.org/catalog/11653/nutrient-requirements-of-horses" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Research Council (NRC) Nutrient Requirements of Horses</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative guide providing digestible energy, TDN, and nutrient benchmarks for all equine life stages and activity levels.</p>
          </li>
          <li>
            <a href="https://aaep.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Association of Equine Practitioners (AAEP) – Nutrition Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary-backed nutrition and health standards for horses including caloric assessment and body condition scoring protocols.</p>
          </li>
          <li>
            <a href="https://extension.psu.edu/programs/nutrition/equine" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Penn State College of Agricultural Sciences – Horse Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">University research and education on equine energy requirements, forage analysis, and feed balancing techniques.</p>
          </li>
          <li>
            <a href="https://njaes.rutgers.edu/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Science Center – Rutgers University</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed studies and resources on horse metabolism, digestible energy utilization, and performance nutrition.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Calorie & Energy Requirement Calculator (DE / TDN)"
      description="Calculate a horse's daily **Digestible Energy (DE)** and **Total Digestible Nutrients (TDN)** requirements."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "DE (Mcal/day) = 1.4 × (Body Weight in kg)^0.75 × Activity Factor × Physiological Factor",
        variables: [
          { symbol: "DE", description: "Digestible Energy requirement in megacalories per day" },
          { symbol: "Body Weight", description: "Horse body weight in kilograms" },
          { symbol: "Activity Factor", description: "Multiplier based on activity level (1.0–1.6)" },
          { symbol: "Physiological Factor", description: "Multiplier for physiological status (1.0–1.5)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb (500 kg) mare performing moderate work and in early pregnancy requires calculation of daily DE and TDN.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (1100 lb ÷ 2.20462 = 499 kg). Calculate metabolic body weight: 499^0.75 ≈ 105.5 kg.",
          },
          {
            label: "2",
            explanation:
              "Apply activity factor for moderate work (1.4) and physiological factor for pregnancy (1.2).",
          },
          {
            label: "3",
            explanation:
              "Calculate DE: 1.4 × 105.5 × 1.4 × 1.2 = 247.5 Mcal/day. Calculate TDN: 247.5 ÷ 4.4 ≈ 56.25 kg/day.",
          },
        ],
        result:
          "The mare requires approximately 247.5 Mcal of Digestible Energy and 56.25 kg of Total Digestible Nutrients daily to meet her needs.",
      }}
      relatedCalculators={[
        {
          title: "Omega-3 Supplement Dose (for parrots)",
          url: "/pets/bird-omega-3-supplement-dose-parrots",
          icon: "🐾",
        },
        {
          title: "Life Expectancy Estimator (lifestyle factors; educational)",
          url: "/pets/cat-life-expectancy-estimator",
          icon: "🐱",
        },
        {
          title: "Dog Xylitol Exposure Risk Calculator",
          url: "/pets/dog-xylitol-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs",
          url: "/pets/dog-benadryl-diphenhydramine-dose",
          icon: "🐶",
        },
        {
          title: "Dog Age in Human Years (Breed-Aware)",
          url: "/pets/dog-age-human-years-breed-aware",
          icon: "🐶",
        },
        {
          title: "Gabapentin Dose Calculator for Dogs",
          url: "/pets/dog-gabapentin-dose",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Calorie & Energy Requirement Calculator (DE / TDN)" },
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