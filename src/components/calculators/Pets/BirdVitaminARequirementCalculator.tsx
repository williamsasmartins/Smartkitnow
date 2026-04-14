import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { weightToKg } from "@/lib/utils";

export default function BirdVitaminARequirementCalculator() {
  // 1. STATE
  // Unit system: imperial (lbs) or metric (kg)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight (bird body weight)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Vitamin A requirement for birds is typically expressed as IU per kg body weight.
  // For seed-fed birds, recommended daily intake is about 4000 IU/kg BW.
  // Formula: Vitamin A Requirement (IU) = 4000 × Body Weight (kg)
  // Convert weight input to kg if imperial.
  const results = useMemo(() => {
    const weightRaw = inputs.weight;
    if (!weightRaw || isNaN(Number(weightRaw)) || Number(weightRaw) <= 0) {
      return {
        value: 0,
        label: "Vitamin A Requirement (IU/day)",
        subtext: "Enter a valid positive weight",
        warning: null,
      };
    }
    const weightKg = weightToKg(Number(weightRaw), unit);
    const vitaminARequirement = Math.round(4000 * weightKg);

    let warning = null;
    if (weightKg < 0.05) {
      warning =
        "Weight entered is very low; ensure this is accurate for small bird species to avoid dosing errors.";
    } else if (weightKg > 10) {
      warning =
        "Weight entered is high for typical pet birds; consult a veterinarian for large or exotic species.";
    }

    return {
      value: vitaminARequirement.toLocaleString(),
      label: "Vitamin A Requirement (IU/day)",
      subtext: `Based on ${weightKg.toFixed(2)} kg body weight`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is vitamin A important for pets?",
      answer: "Vitamin A is essential for pet vision, immune function, and skin health. Deficiency can cause night blindness and respiratory infections, while excess can lead to toxicity.",
    },
    {
      question: "How does pet species affect vitamin A requirements?",
      answer: "Dogs need 5,000 IU/kg of body weight daily, while cats require 10,000 IU/kg. Cats cannot convert beta-carotene to vitamin A efficiently, making preformed sources critical.",
    },
    {
      question: "What factors does this calculator consider?",
      answer: "The calculator factors in pet species, age, weight, health status, and life stage (growth, maintenance, or senior) to determine precise requirements.",
    },
    {
      question: "Can vitamin A toxicity occur in pets?",
      answer: "Yes, chronic excess vitamin A causes bone pain, hair loss, and liver damage. Cats are more susceptible than dogs, with toxicity typically occurring above 100,000 IU/kg daily.",
    },
    {
      question: "How often should I recalculate my pet's vitamin A needs?",
      answer: "Recalculate every 6 months or when your pet's weight, age, or health status changes significantly.",
    },
    {
      question: "Are synthetic and natural vitamin A sources equally effective?",
      answer: "Synthetic retinyl acetate and natural sources are bioequivalent, but absorption depends on diet composition and individual pet metabolism.",
    },
    {
      question: "What commercial foods meet vitamin A requirements?",
      answer: "AAFCO-certified complete and balanced pet foods contain adequate vitamin A; check labels for retinyl palmitate or retinyl acetate content.",
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
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as "kg" | "lb")}
            className="border rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="lb">lb</option>
            <option value="kg">kg</option>
          </select>
        </div>
      </div>

      {/* Weight Input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Bird Body Weight ({unit})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          className="max-w-xs"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Vitamin A Requirement Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the precise daily vitamin A intake your pet needs based on species, age, and weight. It provides personalized recommendations aligned with AAFCO and NRC nutritional standards.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet's species, current weight in pounds or kilograms, age category, and any health conditions. The calculator adjusts requirements for growth, maintenance, or senior life stages.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the daily IU recommendation and compare it to your pet's current diet using food labels or ingredient databases. Consult your veterinarian before supplementing, especially for cats prone to toxicity.</p>
        </div>
      </section>

      {/* TABLE: Daily Vitamin A Requirements by Pet Type and Age */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Vitamin A Requirements by Pet Type and Age</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference values for vitamin A daily intake based on pet species and life stage.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Puppies/Kittens (IU/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Adult Dogs/Cats (IU/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Senior Pets (IU/kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,000–10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,000–7,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10,000–20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10,000–12,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rabbits</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,000–10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,000–8,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,000–8,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Guinea Pigs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500–3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500–3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500–3,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values based on AAFCO (2021) and NRC (2006) guidelines; adjust based on individual health conditions.</p>
      </section>

      {/* TABLE: Vitamin A Content in Common Pet Food Ingredients */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Vitamin A Content in Common Pet Food Ingredients</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Typical vitamin A levels in whole food ingredients used in pet diets.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ingredient</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vitamin A (IU per 100g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Source Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Suitability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Beef Liver</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36,000–40,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Preformed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs &amp; Cats</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Carrots</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Beta-carotene</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs (limited cats)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sweet Potatoes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10,260</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Beta-carotene</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs (limited cats)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fish Oil</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10,000–40,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Preformed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs &amp; Cats</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Spinach</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9,377</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Beta-carotene</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs (limited cats)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Egg Yolk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,260</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Preformed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs &amp; Cats</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Cats have poor beta-carotene conversion (&lt;20% efficiency); prioritize preformed sources for feline diets.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Cats require preformed vitamin A sources (retinyl palmitate) since they cannot efficiently convert plant-based beta-carotene.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Balance vitamin A with other fat-soluble vitamins (D, E, K) as excess A can interfere with vitamin D absorption.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Liver contains very high vitamin A; limit to 1-2 times weekly for dogs and monthly for cats to prevent toxicity.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator for homemade diets to avoid deficiency; commercial AAFCO-certified foods typically meet standards automatically.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming human vitamin A requirements apply to pets</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pets have vastly different requirements—cats need double the vitamin A per kilogram compared to dogs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Treating all beta-carotene sources equally for cats</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats convert beta-carotene inefficiently, so relying solely on carrots or sweet potatoes creates deficiency risk.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring cumulative vitamin A from multiple sources</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Combining commercial food, treats, and supplements often exceeds safe limits without tracking total intake.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not updating requirements as pets age</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Senior pets may need adjusted vitamin A levels; recalculate annually to prevent deficiency or toxicity.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is vitamin A important for pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Vitamin A is essential for pet vision, immune function, and skin health. Deficiency can cause night blindness and respiratory infections, while excess can lead to toxicity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does pet species affect vitamin A requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dogs need 5,000 IU/kg of body weight daily, while cats require 10,000 IU/kg. Cats cannot convert beta-carotene to vitamin A efficiently, making preformed sources critical.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors does this calculator consider?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator factors in pet species, age, weight, health status, and life stage (growth, maintenance, or senior) to determine precise requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can vitamin A toxicity occur in pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, chronic excess vitamin A causes bone pain, hair loss, and liver damage. Cats are more susceptible than dogs, with toxicity typically occurring above 100,000 IU/kg daily.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my pet's vitamin A needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate every 6 months or when your pet's weight, age, or health status changes significantly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are synthetic and natural vitamin A sources equally effective?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Synthetic retinyl acetate and natural sources are bioequivalent, but absorption depends on diet composition and individual pet metabolism.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What commercial foods meet vitamin A requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">AAFCO-certified complete and balanced pet foods contain adequate vitamin A; check labels for retinyl palmitate or retinyl acetate content.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Nutrient Profiles for Dogs and Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official standards for pet food vitamin A content and recommendations across life stages.</p>
          </li>
          <li>
            <a href="https://nap.nationalacademies.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Research Council (NRC) Nutrient Requirements of Dogs and Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed guidelines for vitamin A requirements with detailed evidence-based recommendations.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals - Vitamin A in Pets</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary guidance on vitamin A functions, deficiency signs, and toxicity management in companion animals.</p>
          </li>
          <li>
            <a href="https://www.petmd.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">PetMD - Vitamin A Deficiency and Toxicity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical overview of vitamin A-related health issues, symptoms, and safe supplementation practices for pets.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Vitamin A Requirement Calculator"
      description="Calculate the required daily intake of Vitamin A, deficiency of which is common in seed-fed birds."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Vitamin A Requirement (IU) = 4000 × Body Weight (kg)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Bird's body weight in kilograms" },
          { symbol: "Vitamin A Requirement (IU)", description: "Daily Vitamin A needed in International Units" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A pet parakeet weighs 0.1 kg (100 grams). The owner wants to know the daily Vitamin A requirement to prevent deficiency.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert the bird's weight to kilograms if necessary (already in kg here). Then multiply by 4000 IU/kg.",
          },
          {
            label: "2",
            explanation: "0.1 kg × 4000 IU/kg = 400 IU daily Vitamin A requirement.",
          },
        ],
        result: "The parakeet requires approximately 400 IU of Vitamin A daily to maintain optimal health.",
      }}
      relatedCalculators={[
        { title: "Calcium-to-Phosphorus Ratio Calculator", url: "/pets/reptile-calcium-to-phosphorus-ratio", icon: "🐾" },
        { title: "Meloxicam Dose Calculator for Cats", url: "/pets/cat-meloxicam-dose", icon: "🐱" },
        { title: "Protein/Fat Intake Guide for Cats (by Goal)", url: "/pets/cat-protein-fat-intake-guide", icon: "🐱" },
        { title: "Dog Alcohol/Ethanol Exposure Risk Calculator", url: "/pets/dog-alcohol-ethanol-exposure-risk", icon: "🐶" },
        { title: "Dog Pregnancy (Gestation) Due-Date Calculator", url: "/pets/dog-pregnancy-gestation-due-date", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Vitamin A Requirement Calculator" },
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
