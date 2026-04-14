import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ReptileCalciumToPhosphorusRatioCalculator() {
  // 1. STATE
  // Unit selector is needed because calcium and phosphorus can be input in mg or g, but here we keep it simple: inputs in mg.
  // We keep imperial/metric for weight if needed, but this calculator only needs Ca and P in mg.
  // So no unit switcher needed.
  
  // Inputs: Calcium (mg), Phosphorus (mg)
  const [inputs, setInputs] = useState({
    calciumMg: "",
    phosphorusMg: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const calcium = parseFloat(inputs.calciumMg);
    const phosphorus = parseFloat(inputs.phosphorusMg);

    if (
      isNaN(calcium) ||
      isNaN(phosphorus) ||
      calcium <= 0 ||
      phosphorus <= 0
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter positive numeric values for both Calcium and Phosphorus in mg.",
        warning: null,
      };
    }

    const ratio = +(calcium / phosphorus).toFixed(2);

    let warning = null;
    if (ratio < 1) {
      warning =
        "Warning: A Calcium-to-Phosphorus ratio below 1:1 may lead to metabolic bone disease in reptiles. Consult a veterinarian for dietary adjustments.";
    } else if (ratio > 2) {
      warning =
        "Caution: A Calcium-to-Phosphorus ratio above 2:1 might cause phosphorus deficiency. Balanced nutrition is essential for reptile health.";
    }

    return {
      value: ratio,
      label: "Calcium-to-Phosphorus Ratio (Ca:P)",
      subtext:
        "Ideal dietary ratio is generally between 1:1 and 2:1 for most reptiles to maintain bone and metabolic health.",
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the ideal calcium-to-phosphorus ratio for dogs?",
      answer: "The ideal ratio for adult dogs is 1.2:1 to 1.5:1, while puppies require 1.2:1 to 1.8:1 for proper bone development.",
    },
    {
      question: "Why is the calcium-to-phosphorus ratio important for pets?",
      answer: "This ratio regulates mineral absorption and bone health; imbalances can cause metabolic bone disease, skeletal deformities, and organ dysfunction.",
    },
    {
      question: "What happens if the calcium-to-phosphorus ratio is too high?",
      answer: "Excessive calcium relative to phosphorus can inhibit phosphorus absorption and lead to secondary hyperparathyroidism and bone resorption.",
    },
    {
      question: "What happens if the calcium-to-phosphorus ratio is too low?",
      answer: "A ratio below 1:1 can cause calcium depletion, weak bones, and nutritional secondary hyperparathyroidism in growing pets.",
    },
    {
      question: "How do I calculate the calcium-to-phosphorus ratio from pet food labels?",
      answer: "Divide the calcium percentage by the phosphorus percentage listed on the AAFCO statement to get the ratio.",
    },
    {
      question: "Does the calcium-to-phosphorus ratio differ for cats and dogs?",
      answer: "Cats require a ratio of 1.0:1 to 2.0:1, slightly different from dogs, as they have different mineral metabolism rates.",
    },
    {
      question: "Should I use this calculator for raw diets?",
      answer: "Yes, this calculator helps ensure raw homemade diets maintain proper mineral ratios; consult a veterinary nutritionist to balance all nutrients.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="calciumMg" className="text-slate-700 dark:text-slate-300">
            Calcium (mg)
          </Label>
          <Input
            id="calciumMg"
            type="number"
            min="0"
            step="any"
            placeholder="Enter calcium content in mg"
            value={inputs.calciumMg}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, calciumMg: e.target.value }))
            }
            aria-describedby="calciumHelp"
          />
          <p id="calciumHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the amount of calcium in milligrams (mg) present in the diet portion.
          </p>
        </div>

        <div>
          <Label htmlFor="phosphorusMg" className="text-slate-700 dark:text-slate-300">
            Phosphorus (mg)
          </Label>
          <Input
            id="phosphorusMg"
            type="number"
            min="0"
            step="any"
            placeholder="Enter phosphorus content in mg"
            value={inputs.phosphorusMg}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, phosphorusMg: e.target.value }))
            }
            aria-describedby="phosphorusHelp"
          />
          <p id="phosphorusHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the amount of phosphorus in milligrams (mg) present in the diet portion.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs to current values (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate Calcium-to-Phosphorus Ratio"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ calciumMg: "", phosphorusMg: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and personalized dietary advice.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Calcium-to-Phosphorus Ratio Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines whether your pet's diet maintains the proper mineral balance for bone health and metabolic function. It helps identify nutritional deficiencies or excesses that could lead to health problems.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input the calcium and phosphorus percentages from your pet food's nutrition label or use measured amounts if preparing homemade diets. The calculator processes these values instantly to compute the exact ratio.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Compare your result against the recommended range for your pet's species and life stage displayed in the results. Ratios outside safe ranges should be corrected by adjusting food ingredients or consulting a veterinary nutritionist.</p>
        </div>
      </section>

      {/* TABLE: Recommended Calcium-to-Phosphorus Ratios by Pet Type and Life Stage */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Calcium-to-Phosphorus Ratios by Pet Type and Life Stage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different pets and life stages require specific mineral ratios for optimal health.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Life Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ideal Ratio Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calcium %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Phosphorus %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Adult</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2:1 to 1.5:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0-1.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8-1.2%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Puppy (Large Breed)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2:1 to 1.8:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2-1.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8-1.2%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Puppy (Small Breed)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0:1 to 1.5:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0-1.6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8-1.2%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Adult</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0:1 to 2.0:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6-1.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4-0.8%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Kitten</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0:1 to 1.5:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.9-1.6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6-1.2%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rabbit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Adult</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5:1 to 2.5:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4-1.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2-0.6%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Guinea Pig</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Adult</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.3:1 to 1.8:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4-0.7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3-0.4%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data based on AAFCO standards and veterinary nutritional guidelines; adjust based on individual health status and vet recommendations.</p>
      </section>

      {/* TABLE: Common Pet Foods and Their Calcium-to-Phosphorus Ratios */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Pet Foods and Their Calcium-to-Phosphorus Ratios</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Review typical ratios found in commercial pet foods to compare against calculator results.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Calcium %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Phosphorus %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calculated Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Premium Dog Kibble</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.9%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.33:1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chicken-Based Canned Food</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.75%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.33:1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Grain-Free Dog Food</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.85%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.76:1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Commercial Cat Food</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.65%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.23:1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Raw Dog Diet (Beef)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2:1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Homemade Dog Recipe (Unbalanced)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.38:1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Prescription Renal Diet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.75:1</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values are averages; always verify specific product labels as formulations vary by brand and batch.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always use guaranteed analysis percentages from pet food labels, as estimated values can skew calcium-to-phosphorus calculations significantly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor growing puppies and kittens closely, as improper ratios during development can cause permanent skeletal damage.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Vitamin D levels affect calcium absorption, so ensure your pet's diet contains adequate vitamin D alongside proper mineral ratios.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Recalculate ratios when switching foods or adjusting homemade diet recipes to prevent unintended mineral imbalances.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using ash content instead of specific minerals</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ash percentages don't indicate calcium or phosphorus; always use individual mineral values from the AAFCO guaranteed analysis.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring vitamin D in ratio assessment</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A good ratio without sufficient vitamin D won't improve calcium absorption; ensure vitamin D3 levels are &gt;1000 IU/kg.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Applying dog ratios to cats and vice versa</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats have different mineral metabolism; using dog standards for cats can create nutritional imbalances and health issues.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for supplement additions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calcium or phosphorus supplements alter the natural ratio; recalculate totals after adding any mineral supplements.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the ideal calcium-to-phosphorus ratio for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The ideal ratio for adult dogs is 1.2:1 to 1.5:1, while puppies require 1.2:1 to 1.8:1 for proper bone development.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is the calcium-to-phosphorus ratio important for pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This ratio regulates mineral absorption and bone health; imbalances can cause metabolic bone disease, skeletal deformities, and organ dysfunction.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if the calcium-to-phosphorus ratio is too high?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excessive calcium relative to phosphorus can inhibit phosphorus absorption and lead to secondary hyperparathyroidism and bone resorption.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if the calcium-to-phosphorus ratio is too low?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A ratio below 1:1 can cause calcium depletion, weak bones, and nutritional secondary hyperparathyroidism in growing pets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the calcium-to-phosphorus ratio from pet food labels?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Divide the calcium percentage by the phosphorus percentage listed on the AAFCO statement to get the ratio.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the calcium-to-phosphorus ratio differ for cats and dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cats require a ratio of 1.0:1 to 2.0:1, slightly different from dogs, as they have different mineral metabolism rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I use this calculator for raw diets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator helps ensure raw homemade diets maintain proper mineral ratios; consult a veterinary nutritionist to balance all nutrients.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Dog Food Nutrient Profiles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official AAFCO standards for canine nutrition including mineral requirements and ratios.</p>
          </li>
          <li>
            <a href="https://avmajournals.avma.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of the American Veterinary Medical Association</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on pet nutrition, mineral metabolism, and metabolic bone disease prevention.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis School of Veterinary Medicine - Nutrition Service</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expert veterinary nutritional guidance and diet formulation services for pets with specific mineral needs.</p>
          </li>
          <li>
            <a href="https://www.balanceit.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">BalanceIT.com Nutritional Database</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive pet food analysis and nutritional information for evaluating calcium-to-phosphorus ratios.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Calcium-to-Phosphorus Ratio Calculator"
      description="Calculate the vital **Calcium-to-Phosphorus ratio** of a reptile's diet, which should be maintained above 1:1."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Calcium-to-Phosphorus Ratio = Calcium (mg) ÷ Phosphorus (mg)",
        variables: [
          { symbol: "Calcium (mg)", description: "Amount of calcium in milligrams in the diet portion" },
          { symbol: "Phosphorus (mg)", description: "Amount of phosphorus in milligrams in the diet portion" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A reptile owner wants to evaluate the calcium-to-phosphorus ratio in a homemade diet containing 500 mg of calcium and 300 mg of phosphorus per serving.",
        steps: [
          { label: "1", explanation: "Input calcium content: 500 mg" },
          { label: "2", explanation: "Input phosphorus content: 300 mg" },
          { label: "3", explanation: "Calculate ratio: 500 ÷ 300 = 1.67" },
        ],
        result:
          "The resulting ratio is 1.67, which is within the ideal range of 1:1 to 2:1, indicating a balanced mineral profile for the reptile's diet.",
      }}
      relatedCalculators={[
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
        {
          title: "Cat Chocolate Toxicity Calculator",
          url: "/pets/cat-chocolate-toxicity",
          icon: "🐱",
        },
        {
          title: "Dehydration Risk Estimator (Weight & Symptoms Aware)",
          url: "/pets/dog-dehydration-risk-estimator",
          icon: "🐱",
        },
        {
          title: "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)",
          url: "/pets/dog-human-medication-exposure-alert",
          icon: "🐶",
        },
        {
          title: "Dehydration Risk Estimator (Symptoms + Intake)",
          url: "/pets/cat-dehydration-risk-estimator",
          icon: "💉",
        },
        {
          title: "Lilies Poisoning Risk Guide (cats)",
          url: "/pets/cat-lilies-poisoning-risk-guide",
          icon: "🐱",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Calcium-to-Phosphorus Ratio Calculator" },
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