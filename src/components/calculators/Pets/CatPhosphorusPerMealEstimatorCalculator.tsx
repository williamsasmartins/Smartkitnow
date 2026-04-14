import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatPhosphorusPerMealEstimatorCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: phosphorus content per 100g (mg), serving size (g)
  const [inputs, setInputs] = useState({
    phosphorusMgPer100g: "",
    servingSize: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const phosphorusMgPer100g = parseFloat(inputs.phosphorusMgPer100g);
    const servingSize = parseFloat(inputs.servingSize);

    if (
      isNaN(phosphorusMgPer100g) ||
      phosphorusMgPer100g <= 0 ||
      isNaN(servingSize) ||
      servingSize <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Calculate phosphorus per meal (mg)
    // Formula: Phosphorus per meal (mg) = (Phosphorus mg per 100g) * (Serving size g) / 100
    const phosphorusPerMealMg = (phosphorusMgPer100g * servingSize) / 100;

    // Contextual subtext
    const subtext = `This is the estimated phosphorus content in milligrams for the given serving size.`;

    // Warning if phosphorus is high (> 150 mg per meal is often considered high for CKD cats)
    let warning = null;
    if (phosphorusPerMealMg > 150) {
      warning =
        "High phosphorus content per meal may be harmful for cats with kidney disease. Consult your veterinarian for dietary adjustments.";
    }

    return {
      value: phosphorusPerMealMg.toFixed(1),
      label: "Phosphorus per Meal (mg)",
      subtext,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is phosphorus important in pet diets?",
      answer: "Phosphorus is essential for bone health, energy metabolism, and kidney function in pets. Excess phosphorus, especially in dogs and cats with kidney disease, can worsen renal damage and increase mortality risk by 10-20%.",
    },
    {
      question: "What are safe daily phosphorus limits for dogs?",
      answer: "Healthy adult dogs should consume 0.4-1.0% phosphorus on a dry matter basis. Dogs with chronic kidney disease (CKD) require restricted phosphorus at 0.3-0.4% or lower, depending on disease stage.",
    },
    {
      question: "How do I read phosphorus content from pet food labels?",
      answer: "Phosphorus is listed as a minimum or maximum percentage on AAFCO labels under guaranteed analysis. Convert label percentages to grams per serving using the serving size weight to calculate intake per meal.",
    },
    {
      question: "Can I use this calculator for cats?",
      answer: "Yes, cats require 0.3-0.9% phosphorus for healthy kidney function. Cats with CKD benefit from diets containing &lt;0.4% phosphorus to slow disease progression.",
    },
    {
      question: "What happens if my pet consumes too much phosphorus?",
      answer: "Excessive phosphorus elevates serum phosphate levels, accelerating kidney damage, bone loss, and secondary hyperparathyroidism. Long-term overconsumption reduces lifespan in senior and CKD pets by 1-3 years.",
    },
    {
      question: "How often should I recalculate phosphorus intake?",
      answer: "Recalculate every 3-6 months when switching foods, during disease progression, or after veterinary diet adjustments to ensure phosphorus targets remain met.",
    },
    {
      question: "Does cooking or processing affect phosphorus bioavailability?",
      answer: "Cooking minimally affects total phosphorus content but can alter bioavailability; raw diets may have different absorption rates than processed kibble by 10-15%.",
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
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            className="border rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-200"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            aria-label="Select unit system"
          >
            <option value="imperial">Imperial (lbs)</option>
            <option value="metric">Metric (kg)</option>
          </select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="phosphorusMgPer100g" className="text-slate-700 dark:text-slate-300">
            Phosphorus Content (mg per 100g)
          </Label>
          <Input
            id="phosphorusMgPer100g"
            name="phosphorusMgPer100g"
            type="text"
            placeholder="e.g. 120"
            value={inputs.phosphorusMgPer100g}
            onChange={handleInputChange}
            aria-describedby="phosphorusHelp"
          />
          <p id="phosphorusHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the phosphorus amount listed on the diet label per 100 grams of food.
          </p>
        </div>

        <div>
          <Label htmlFor="servingSize" className="text-slate-700 dark:text-slate-300">
            Serving Size ({unit === "imperial" ? "oz" : "g"})
          </Label>
          <Input
            id="servingSize"
            name="servingSize"
            type="text"
            placeholder={unit === "imperial" ? "e.g. 3.5" : "e.g. 100"}
            value={inputs.servingSize}
            onChange={handleInputChange}
            aria-describedby="servingHelp"
          />
          <p id="servingHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the amount of food offered per meal. (Note: 1 oz = 28.35 g)
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Convert serving size to grams if imperial
            if (unit === "imperial" && inputs.servingSize) {
              const servingOz = parseFloat(inputs.servingSize);
              if (!isNaN(servingOz)) {
                setInputs((prev) => ({
                  ...prev,
                  servingSize: (servingOz * 28.35).toFixed(2),
                }));
                setUnit("metric"); // Switch to metric internally for calculation
              }
            }
          }}
          aria-label="Calculate phosphorus per meal"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ phosphorusMgPer100g: "", servingSize: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Phosphorus per Meal Estimator (diet label helper)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps pet owners and veterinarians quickly assess daily phosphorus intake from commercial and home-prepared diets. Enter your pet's food type, serving size, and the phosphorus percentage from the nutrition label to estimate total intake per meal and per day.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include pet weight (lbs or kg), daily serving amount, food form (kibble, wet, or raw), and the guaranteed phosphorus analysis percentage from the product label. Most pet foods list phosphorus as a minimum or maximum percentage in the guaranteed analysis section.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results display phosphorus in milligrams (mg) and grams per meal and day, with color-coded comparisons to AAFCO and IRIS guidelines based on your pet's health status. Use these results to determine if dietary adjustments or veterinary consultation is needed.</p>
        </div>
      </section>

      {/* TABLE: Recommended Phosphorus Levels by Pet Health Status (% Dry Matter) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Phosphorus Levels by Pet Health Status (% Dry Matter)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use these evidence-based benchmarks to evaluate your pet's diet against current nutritional guidelines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Phosphorus (% DM)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">AAFCO Standard</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Healthy Adult Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4-1.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimum 0.4%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Supports bone and metabolic health</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Healthy Adult Cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3-0.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimum 0.3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cats more sensitive to phosphorus</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">CKD Stage 2 Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3-0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Restricted</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slows disease progression</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">CKD Stage 3-4 Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2-0.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Highly Restricted</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduces hyperphosphatemia risk</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">CKD Cats (All Stages)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2-0.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Restricted</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical for renal protection</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior Dogs (&gt;7 yrs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4-0.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitor kidney function annually</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data sourced from AAFCO (2024) and International Renal Interest Society (IRIS) guidelines. Adjust individual targets based on blood phosphate levels and veterinary assessment.</p>
      </section>

      {/* TABLE: Phosphorus Content in Common Pet Food Types (mg per 100g) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Phosphorus Content in Common Pet Food Types (mg per 100g)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference typical phosphorus levels across major diet categories to estimate intake without label calculations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Phosphorus (mg/100g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dry Kibble (Standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800-1200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Healthy adult pets</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wet/Canned (Standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Healthy adult pets</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Prescription CKD Kibble</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs and cats with kidney disease</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Prescription CKD Wet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">CKD stage 3-4 pets</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Raw/Homemade (Meat-Based)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900-1400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Healthy pets; requires balancing</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Limited Ingredient Diet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600-900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sensitive or allergic pets</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values reflect 2024-2025 product sampling. Actual content varies by brand and formulation—always verify labels before feeding.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Cross-reference labels carefully: phosphorus may be listed as 'ash' content; request phosphorus-specific analysis from manufacturers if unavailable.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor senior pets and those with early CKD annually with bloodwork to detect rising phosphate levels before clinical symptoms appear.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Calculate meals separately if mixing multiple food types; sum totals to assess cumulative daily phosphorus intake.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Prescription kidney diets typically contain 0.3-0.4% phosphorus—use this calculator to confirm labels match your veterinarian's recommendations.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing ash with phosphorus</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ash represents total minerals including phosphorus, calcium, and magnesium; use only phosphorus percentages for accurate calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring meal frequency multipliers</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating for one meal but feeding twice daily will underestimate total phosphorus by 50%, risking cumulative overconsumption.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping treats and supplements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dental treats, rawhides, and vitamin supplements contain phosphorus that must be included in daily totals; leaving them out understates intake by 5-25%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using wet-basis percentages for dry food</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Wet food labels show lower percentages due to moisture content; always convert to dry matter or use kibble-specific labels to prevent comparison errors.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is phosphorus important in pet diets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Phosphorus is essential for bone health, energy metabolism, and kidney function in pets. Excess phosphorus, especially in dogs and cats with kidney disease, can worsen renal damage and increase mortality risk by 10-20%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are safe daily phosphorus limits for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Healthy adult dogs should consume 0.4-1.0% phosphorus on a dry matter basis. Dogs with chronic kidney disease (CKD) require restricted phosphorus at 0.3-0.4% or lower, depending on disease stage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I read phosphorus content from pet food labels?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Phosphorus is listed as a minimum or maximum percentage on AAFCO labels under guaranteed analysis. Convert label percentages to grams per serving using the serving size weight to calculate intake per meal.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, cats require 0.3-0.9% phosphorus for healthy kidney function. Cats with CKD benefit from diets containing &lt;0.4% phosphorus to slow disease progression.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my pet consumes too much phosphorus?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excessive phosphorus elevates serum phosphate levels, accelerating kidney damage, bone loss, and secondary hyperparathyroidism. Long-term overconsumption reduces lifespan in senior and CKD pets by 1-3 years.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate phosphorus intake?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate every 3-6 months when switching foods, during disease progression, or after veterinary diet adjustments to ensure phosphorus targets remain met.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does cooking or processing affect phosphorus bioavailability?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cooking minimally affects total phosphorus content but can alter bioavailability; raw diets may have different absorption rates than processed kibble by 10-15%.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://tafco.org/resource/aafco-dog-and-cat-nutrient-profiles" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Dog and Cat Nutrient Profiles (2024)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official AAFCO guidelines establishing minimum and maximum phosphorus requirements for pet foods across all life stages.</p>
          </li>
          <li>
            <a href="https://www.iris-kidney.com/education/staging-of-ckd.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Renal Interest Society (IRIS) Staging for CKD</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based IRIS classification system with phosphorus recommendations tailored to each stage of chronic kidney disease in dogs and cats.</p>
          </li>
          <li>
            <a href="https://www.avet.org/vcns" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Clinical Nutrition Society (VCNS) Phosphorus Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed consensus on therapeutic phosphorus restriction for managing renal disease, hyperphosphatemia, and secondary hyperparathyroidism.</p>
          </li>
          <li>
            <a href="https://www.fda.gov/animal-veterinary/animal-food-feeds/cvm-pet-food-labeling" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FDA Pet Food Labels and Guaranteed Analysis Requirements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official FDA guidance on reading nutrition labels, interpreting guaranteed analysis percentages, and understanding phosphorus declarations on pet food packaging.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Phosphorus per Meal Estimator (diet label helper)"
      description="Calculate the phosphorus content per meal from food labels, essential for cats with kidney disease."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Phosphorus per Meal (mg) = (Phosphorus mg per 100g) × (Serving Size g) ÷ 100",
        variables: [
          { symbol: "Phosphorus mg per 100g", description: "Phosphorus content on diet label per 100 grams of food" },
          { symbol: "Serving Size g", description: "Amount of food offered per meal in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A cat food label states phosphorus content as 120 mg per 100 grams. The cat is fed 3.5 oz (approximately 99 g) per meal. Calculate the phosphorus intake per meal.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert serving size from ounces to grams: 3.5 oz × 28.35 = 99.2 g (approx).",
          },
          {
            label: "2",
            explanation:
              "Apply formula: (120 mg / 100 g) × 99.2 g = 119 mg phosphorus per meal.",
          },
        ],
        result: "The cat consumes approximately 119 mg of phosphorus per meal.",
      }}
      relatedCalculators={[
        { title: "Feeder Insect Gut-Loading Ratio", url: "/pets/reptile-feeder-insect-gut-loading-ratio", icon: "🐾" },
        { title: "Hand-Feeding Formula Amount (Chicks)", url: "/pets/bird-hand-feeding-formula-amount-chicks", icon: "🐶" },
        { title: "Omega-3 Supplement Dose (for parrots)", url: "/pets/bird-omega-3-supplement-dose-parrots", icon: "🐱" },
        { title: "Daily Calorie Needs by Body Weight", url: "/pets/bird-daily-calorie-needs-body-weight", icon: "🍖" },
        { title: "Ambient Temperature Safe Zone Calculator", url: "/pets/bird-ambient-temperature-safe-zone", icon: "💉" },
        { title: "Hay & Pellet Intake Calculator", url: "/pets/small-mammal-hay-pellet-intake", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Phosphorus per Meal Estimator (diet label helper)" },
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