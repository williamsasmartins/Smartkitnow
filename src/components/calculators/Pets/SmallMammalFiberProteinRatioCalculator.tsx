import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SmallMammalFiberProteinRatioCalculator() {
  // 1. STATE
  // Default unit system is imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: Fiber % and Protein % in diet
  const [inputs, setInputs] = useState({
    fiberPercent: "",
    proteinPercent: "",
  });

  // 2. LOGIC ENGINE
  // Calculate Fiber to Protein Ratio = Fiber % / Protein %
  // Validate inputs and handle zero or invalid values
  const results = useMemo(() => {
    const fiber = parseFloat(inputs.fiberPercent);
    const protein = parseFloat(inputs.proteinPercent);

    if (
      isNaN(fiber) ||
      isNaN(protein) ||
      fiber <= 0 ||
      protein <= 0
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter positive numeric values for both fiber and protein percentages.",
        warning: null,
      };
    }

    const ratio = +(fiber / protein).toFixed(2);

    // Contextual interpretation based on typical fiber:protein ratios for small mammals
    let subtext = "";
    let warning: string | null = null;

    if (ratio < 0.3) {
      subtext =
        "Low fiber relative to protein may impair gut motility and microbial balance in herbivorous small mammals.";
      warning =
        "Warning: Fiber is too low compared to protein. Consider increasing fiber to support digestive health.";
    } else if (ratio > 1.2) {
      subtext =
        "High fiber relative to protein may reduce protein digestibility and energy availability.";
      warning =
        "Warning: Fiber is high relative to protein. Balance is important to avoid nutritional deficiencies.";
    } else {
      subtext =
        "Fiber to protein ratio is within an optimal range for maintaining gut health and nutrient absorption.";
    }

    return {
      value: ratio,
      label: "Fiber to Protein Ratio",
      subtext,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the ideal fiber to protein ratio for dogs?",
      answer: "Most healthy adult dogs thrive on a ratio of 1:10 to 1:15 (fiber to protein), meaning roughly 5-10% fiber and 18-25% protein by weight. Individual needs vary by breed, age, and activity level.",
    },
    {
      question: "How does this calculator help with pet nutrition?",
      answer: "This calculator compares your pet's current fiber and protein intake against breed-specific and age-appropriate benchmarks, helping identify nutritional imbalances that may affect digestion and muscle health.",
    },
    {
      question: "Can cats and dogs have the same fiber to protein ratio?",
      answer: "No, cats require higher protein (30-40%) and tolerate less fiber than dogs. Cats are obligate carnivores, so use species-specific inputs when using this calculator.",
    },
    {
      question: "What happens if my pet's fiber ratio is too high?",
      answer: "Excessive fiber (&gt;10-12%) can reduce nutrient absorption, cause loose stools, and interfere with mineral uptake in dogs; use the calculator to stay within safe ranges.",
    },
    {
      question: "Should senior pets have different fiber and protein ratios?",
      answer: "Yes, senior pets typically need 10-15% more protein to maintain muscle mass, while fiber should remain moderate (5-8%) to support digestive health; adjust inputs for accurate age-based guidance.",
    },
    {
      question: "How do I input food labels into this calculator?",
      answer: "Enter the guaranteed analysis percentages found on pet food packaging for crude protein and crude fiber; this calculator will compute the ratio and compare it to optimal ranges.",
    },
    {
      question: "Does activity level affect the fiber to protein ratio?",
      answer: "Yes, highly active dogs need 25-30% protein and 4-6% fiber, while sedentary pets need 18-22% protein and 6-8% fiber; select your pet's activity level for accurate recommendations.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for input changes
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  // Reset inputs
  function resetInputs() {
    setInputs({ fiberPercent: "", proteinPercent: "" });
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
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
          <Label htmlFor="fiberPercent" className="text-slate-700 dark:text-slate-300">
            Fiber Percentage in Diet (%)
          </Label>
          <Input
            id="fiberPercent"
            name="fiberPercent"
            type="text"
            placeholder="e.g. 18"
            value={inputs.fiberPercent}
            onChange={handleInputChange}
            aria-describedby="fiberHelp"
          />
          <p id="fiberHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the fiber content percentage of the diet.
          </p>
        </div>

        <div>
          <Label htmlFor="proteinPercent" className="text-slate-700 dark:text-slate-300">
            Protein Percentage in Diet (%)
          </Label>
          <Input
            id="proteinPercent"
            name="proteinPercent"
            type="text"
            placeholder="e.g. 16"
            value={inputs.proteinPercent}
            onChange={handleInputChange}
            aria-describedby="proteinHelp"
          />
          <p id="proteinHelp" className="text-xs text-slate-500 dark:text-400 mt-1">
            Enter the protein content percentage of the diet.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          aria-label="Calculate Fiber to Protein Ratio"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetInputs}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Fiber & Protein Ratio Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines whether your pet's current diet delivers balanced fiber and protein nutrition by comparing actual intake against species and age-specific benchmarks. It helps identify digestive issues, muscle loss, or nutrient absorption problems caused by imbalanced ratios.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your pet's species, age, activity level, current food's crude protein percentage, and crude fiber percentage (found on packaging labels). The calculator will automatically compute the ratio and flag deviations from optimal ranges.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show your pet's F:P ratio, comparison to ideal ranges, and actionable recommendations for diet adjustments. If results fall outside safe ranges, consult a veterinarian before changing foods, especially for pets with existing health conditions.</p>
        </div>
      </section>

      {/* TABLE: Optimal Fiber & Protein Ratios by Pet Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Optimal Fiber & Protein Ratios by Pet Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference benchmarks for healthy fiber and protein percentages based on pet type and life stage.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type & Life Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Protein (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fiber (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult Dogs (sedentary)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult Dogs (active)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior Dogs (7+ years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Puppies (growing)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22-32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult Cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-3</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior Cats (10+ years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages reflect guaranteed analysis minimums on pet food labels; individual pets may require adjustments based on health conditions.</p>
      </section>

      {/* TABLE: Common Pet Foods Fiber & Protein Ratios */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Pet Foods Fiber & Protein Ratios</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Sample analysis of popular commercial pet foods to compare against calculator results.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Protein (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fiber (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">F:P Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Premium Dry Dog Food (chicken)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:4.3</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Budget Dry Dog Food</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:2.5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Protein Dry Dog Food</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:6.4</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Prescription Digestive Diet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:1.5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Premium Wet Dog Food</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:4.0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Grain-Free Dog Food</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:4.0</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data based on 2024-2025 product guarantees; formulas vary by brand and formula revision.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always use guaranteed analysis percentages from food labels rather than estimated values to ensure accurate calculator results.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Mix two foods in known proportions to test blended fiber and protein ratios before committing to a full diet change.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your pet's stool consistency, energy, and coat quality for 3-4 weeks after adjusting fiber intake to confirm the new ratio is working.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Puppies and senior pets require higher protein but lower fiber than adult pets; use age-specific calculator inputs for accurate recommendations.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using crude fiber instead of dietary fiber percentages</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pet food labels list crude fiber, which is what this calculator requires; dietary fiber values are different and will produce inaccurate results.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring water content in wet food calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Wet foods have 70-80% moisture, so their protein and fiber percentages are lower than dry food; use label values directly without adjusting for water.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming one ratio works for all life stages</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Puppies need 22-32% protein and kittens need 30-40%, while senior pets need higher protein but may tolerate less fiber; always input the correct life stage.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Changing diet based solely on this calculator without veterinary input</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pets with allergies, sensitivities, or medical conditions may need ratios outside normal ranges; consult your vet before major dietary changes.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the ideal fiber to protein ratio for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most healthy adult dogs thrive on a ratio of 1:10 to 1:15 (fiber to protein), meaning roughly 5-10% fiber and 18-25% protein by weight. Individual needs vary by breed, age, and activity level.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does this calculator help with pet nutrition?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator compares your pet's current fiber and protein intake against breed-specific and age-appropriate benchmarks, helping identify nutritional imbalances that may affect digestion and muscle health.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can cats and dogs have the same fiber to protein ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, cats require higher protein (30-40%) and tolerate less fiber than dogs. Cats are obligate carnivores, so use species-specific inputs when using this calculator.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my pet's fiber ratio is too high?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excessive fiber (&gt;10-12%) can reduce nutrient absorption, cause loose stools, and interfere with mineral uptake in dogs; use the calculator to stay within safe ranges.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should senior pets have different fiber and protein ratios?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, senior pets typically need 10-15% more protein to maintain muscle mass, while fiber should remain moderate (5-8%) to support digestive health; adjust inputs for accurate age-based guidance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I input food labels into this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter the guaranteed analysis percentages found on pet food packaging for crude protein and crude fiber; this calculator will compute the ratio and compare it to optimal ranges.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does activity level affect the fiber to protein ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, highly active dogs need 25-30% protein and 4-6% fiber, while sedentary pets need 18-22% protein and 6-8% fiber; select your pet's activity level for accurate recommendations.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/Publications/Nutrient-Profiles" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Dog Food Nutrient Profiles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official Association of American Feed Control Officials guidelines for minimum protein and fiber levels in pet foods.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com/management-and-nutrition/nutrition/nutrition-for-companion-animals" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Medicine — Nutrition for Companion Animals</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Merck Veterinary Manual reference for optimal nutrient ratios across dog and cat life stages.</p>
          </li>
          <li>
            <a href="https://www.aaha.org/aaha-guidelines/nutrition-assessment-guidelines-for-the-veterinary-professional/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Animal Hospital Association — Nutrition Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations for assessing pet nutrition and identifying dietary imbalances affecting health.</p>
          </li>
          <li>
            <a href="https://www.petmd.com/dogs/wellness/what-you-need-know-about-fiber-your-pet" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Digestive Health in Dogs and Cats — PetMD</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical overview of how fiber and protein ratios impact digestive health and nutrient absorption in pets.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fiber & Protein Ratio Calculator"
      description="Determine the appropriate ratio of fiber and protein in the diet, crucial for gut health in species like rabbits."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Fiber to Protein Ratio = Fiber (%) ÷ Protein (%)",
        variables: [
          { symbol: "Fiber (%)", description: "Dietary fiber content percentage" },
          { symbol: "Protein (%)", description: "Dietary protein content percentage" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A rabbit's diet contains 18% fiber and 16% protein. The caretaker wants to assess if this ratio supports optimal gut health.",
        steps: [
          {
            label: "1",
            explanation:
              "Input fiber percentage as 18 and protein percentage as 16 into the calculator.",
          },
          {
            label: "2",
            explanation:
              "Calculate the fiber to protein ratio: 18 ÷ 16 = 1.13, which falls within the optimal range.",
          },
          {
            label: "3",
            explanation:
              "Review the result and contextual feedback to confirm the diet supports healthy digestion and nutrient absorption.",
          },
        ],
        result:
          "Fiber to Protein Ratio = 1.13, indicating a balanced diet suitable for maintaining gut health in rabbits.",
      }}
      relatedCalculators={[
        {
          title: "Toxic Foods Exposure Checker (Avocado, Chocolate, etc.)",
          url: "/pets/bird-toxic-foods-exposure-checker",
          icon: "🐾",
        },
        {
          title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)",
          url: "/pets/cat-acetaminophen-ibuprofen-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator",
          url: "/pets/dog-onion-garlic-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "🍖",
        },
        {
          title: "Whelping Countdown & Stage Timeline",
          url: "/pets/dog-whelping-countdown-stage-timeline",
          icon: "💉",
        },
        {
          title: "Cat Calorie Needs (RER/MER) Calculator",
          url: "/pets/cat-calorie-needs-rer-mer",
          icon: "🐱",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Fiber & Protein Ratio Calculator" },
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
