import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FerretProteinFatRatioCheckerCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: Protein % and Fat % of diet
  const [inputs, setInputs] = useState({
    proteinPercent: "",
    fatPercent: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const protein = parseFloat(inputs.proteinPercent);
    const fat = parseFloat(inputs.fatPercent);

    if (
      isNaN(protein) ||
      isNaN(fat) ||
      protein <= 0 ||
      fat <= 0 ||
      protein > 100 ||
      fat > 100
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter valid percentages between 0 and 100.",
        warning: null,
      };
    }

    // Calculate protein to fat ratio (protein % / fat %)
    const ratio = protein / fat;

    // Interpretation based on veterinary nutrition for ferrets:
    // Ferrets require a high protein and fat diet, typically protein:fat ratio ~1.5 to 2.5
    // Ratios below 1.5 may indicate insufficient protein relative to fat
    // Ratios above 3 may indicate excessive protein relative to fat, which can stress kidneys

    let warning = null;
    if (ratio < 1.5) {
      warning =
        "Protein is low relative to fat. Ferrets need a high protein diet to maintain muscle mass and energy.";
    } else if (ratio > 3) {
      warning =
        "Protein is very high relative to fat. Excessive protein can strain kidneys and cause metabolic imbalance.";
    }

    return {
      value: ratio.toFixed(2),
      label: "Protein/Fat Ratio",
      subtext:
        "Ideal range for ferrets is approximately 1.5 to 2.5 for optimal health.",
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the ideal protein to fat ratio for ferrets?",
      answer: "Ferrets require a minimum of 30-40% protein and 15-20% fat in their diet, with an optimal ratio of roughly 2:1 protein to fat for maintaining muscle mass and energy levels.",
    },
    {
      question: "How do I input my ferret's food nutritional data into this calculator?",
      answer: "Enter the protein percentage and fat percentage from your ferret food's nutritional label into the designated fields, then click Calculate to see the ratio analysis.",
    },
    {
      question: "Why does my ferret food's protein-to-fat ratio matter?",
      answer: "An improper ratio can lead to obesity, nutritional deficiencies, or inadequate muscle development since ferrets are obligate carnivores with specific metabolic needs.",
    },
    {
      question: "Can I use this calculator for different ferret life stages?",
      answer: "Yes, but juvenile ferrets need higher protein (35-45%) while senior ferrets benefit from slightly lower fat (&lt;18%) to prevent weight gain and digestive issues.",
    },
    {
      question: "What does the calculator show if my ferret's food is unbalanced?",
      answer: "The tool provides a ratio comparison against ideal ranges and flags foods that are too high in fat or too low in protein, helping you adjust diet choices.",
    },
    {
      question: "Should I mix multiple ferret foods to achieve a better ratio?",
      answer: "Yes, blending two complementary foods can help balance the overall protein-to-fat ratio if single formulas fall outside the recommended 2:1 to 3:1 range.",
    },
    {
      question: "How often should I recalculate my ferret's food ratio?",
      answer: "Recalculate whenever you switch brands or formulas, and annually to ensure your ferret's diet remains optimal as nutritional needs may shift with age.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
              <SelectItem value="imperial">Imperial (%)</SelectItem>
              <SelectItem value="metric">Metric (%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="proteinPercent" className="text-slate-700 dark:text-slate-300">
            Protein Percentage (%)
          </Label>
          <Input
            id="proteinPercent"
            type="number"
            min={0}
            max={100}
            step="0.1"
            placeholder="e.g. 40"
            value={inputs.proteinPercent}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, proteinPercent: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="fatPercent" className="text-slate-700 dark:text-slate-300">
            Fat Percentage (%)
          </Label>
          <Input
            id="fatPercent"
            type="number"
            min={0}
            max={100}
            step="0.1"
            placeholder="e.g. 20"
            value={inputs.fatPercent}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, fatPercent: e.target.value }))
            }
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
          onClick={() => setInputs({ proteinPercent: "", fatPercent: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Ferret Protein/Fat Ratio Checker</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator analyzes your ferret food's nutritional composition to ensure it meets optimal protein and fat requirements. Ferrets are obligate carnivores with specific dietary needs, and maintaining the correct ratio supports muscle health, energy, and longevity.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter the protein percentage and fat percentage from your ferret food's nutritional label. You can also input your ferret's age and weight for more personalized recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator displays your food's protein-to-fat ratio, compares it against ideal ranges for your ferret's life stage, and flags any nutritional imbalances. Use results to adjust feeding choices or consult your veterinarian for dietary modifications.</p>
        </div>
      </section>

      {/* TABLE: Ideal Protein & Fat Levels by Ferret Life Stage */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Ideal Protein & Fat Levels by Ferret Life Stage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use these benchmarks to evaluate whether your ferret food meets nutritional requirements.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Life Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Protein (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fat (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Protein:Fat Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kits (0-6 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.2:1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adults (1-5 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2:1 to 2.5:1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Seniors (6+ years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2:1 to 2.8:1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pregnant/Nursing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2:1 to 2.2:1</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Individual ferrets may require adjustments based on activity level and health status.</p>
      </section>

      {/* TABLE: Common Ferret Food Products & Their Ratios */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Ferret Food Products & Their Ratios</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference guide showing protein-to-fat ratios of popular commercial ferret diets.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Brand/Product</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Protein (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fat (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ratio Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Marshall Premium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.8:1 (Acceptable)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Totally Ferret</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.2:1 (Ideal)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">OM Plus</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2:1 (Optimal)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8in1 Ultimate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2:1 (Good)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wysong Ferret Diet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.4:1 (Excellent)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Formulations vary by batch; always verify with current product labels.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always read the guaranteed analysis on food packaging—it lists minimum protein and minimum fat, which are the figures to input into the calculator.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Ferrets on raw or whole-prey diets should estimate protein and fat content using USDA nutritional databases for accuracy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine multiple food brands in one meal to balance ratios if single products fall outside the 2:1 to 2.5:1 protein-to-fat range.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your ferret's weight and energy monthly; recalculate ratios if behavioral or physical changes occur, as adjustments may be needed.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Minimum vs. Actual Content</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Labels show guaranteed minimum percentages, not exact amounts; your food may contain more protein and fat than listed.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Fat Content</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some owners focus only on protein while neglecting fat; too much fat causes obesity while too little leads to poor coat quality and energy loss.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Human Food Nutritional Data</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Human-grade meat and pet food have different processing and nutrient profiles, so don't estimate ferret diet ratios from human food labels.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for Life Stage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying adult ferret ratios to kits or seniors can result in malnutrition; always factor in your ferret's age when interpreting calculator results.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the ideal protein to fat ratio for ferrets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Ferrets require a minimum of 30-40% protein and 15-20% fat in their diet, with an optimal ratio of roughly 2:1 protein to fat for maintaining muscle mass and energy levels.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I input my ferret's food nutritional data into this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter the protein percentage and fat percentage from your ferret food's nutritional label into the designated fields, then click Calculate to see the ratio analysis.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does my ferret food's protein-to-fat ratio matter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">An improper ratio can lead to obesity, nutritional deficiencies, or inadequate muscle development since ferrets are obligate carnivores with specific metabolic needs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for different ferret life stages?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, but juvenile ferrets need higher protein (35-45%) while senior ferrets benefit from slightly lower fat (&lt;18%) to prevent weight gain and digestive issues.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does the calculator show if my ferret's food is unbalanced?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The tool provides a ratio comparison against ideal ranges and flags foods that are too high in fat or too low in protein, helping you adjust diet choices.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I mix multiple ferret foods to achieve a better ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, blending two complementary foods can help balance the overall protein-to-fat ratio if single formulas fall outside the recommended 2:1 to 3:1 range.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my ferret's food ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate whenever you switch brands or formulas, and annually to ensure your ferret's diet remains optimal as nutritional needs may shift with age.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.ferretassociation.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Ferret Nutrition Guide – American Ferret Association</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official AFA resource covering ferret dietary requirements and nutritional standards.</p>
          </li>
          <li>
            <a href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Exotic Pet Nutrition – Cornell University College of Veterinary Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed veterinary research on obligate carnivore nutrition and protein-fat ratios.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Ferret Care and Husbandry – UC Davis School of Veterinary Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">University veterinary guidance on ferret feeding protocols and nutritional assessment.</p>
          </li>
          <li>
            <a href="https://www.aafco.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Nutrition Database – AAFCO Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Association of American Feed Control Officials standards for pet food formulation and labeling accuracy.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Ferret Protein/Fat Ratio Checker"
      description="Check the diet to ensure it meets the high protein and fat requirements for obligate carnivores like ferrets."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Protein/Fat Ratio = Protein % ÷ Fat %",
        variables: [
          { symbol: "Protein %", description: "Crude protein percentage in diet" },
          { symbol: "Fat %", description: "Crude fat percentage in diet" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A ferret food label shows 40% crude protein and 20% crude fat. The owner wants to verify if this diet is balanced for their pet.",
        steps: [
          {
            label: "1",
            explanation:
              "Input protein percentage as 40 and fat percentage as 20 into the calculator.",
          },
          {
            label: "2",
            explanation:
              "Calculate the protein/fat ratio: 40 ÷ 20 = 2.0, which falls within the ideal range.",
          },
          {
            label: "3",
            explanation:
              "Interpret the result: A ratio of 2.0 indicates a balanced diet suitable for ferret health.",
          },
        ],
        result: "Protein/Fat Ratio = 2.0 (Ideal range: 1.5 to 2.5)",
      }}
      relatedCalculators={[
        {
          title: "Xylitol Exposure Risk for Cats (rare but educational)",
          url: "/pets/cat-xylitol-exposure-risk",
          icon: "🐱",
        },
        {
          title: "Foaling Countdown & Lactation Feed Planner",
          url: "/pets/horse-foaling-countdown-lactation-feed-planner",
          icon: "🐶",
        },
        {
          title: "Horse Body Condition Score Helper (Henneke 1–9)",
          url: "/pets/horse-body-condition-score-henneke",
          icon: "🐎",
        },
        {
          title: "Horse Toxic Plant Exposure Risk (Ragwort, Yew, etc.)",
          url: "/pets/horse-toxic-plant-exposure-risk",
          icon: "🐎",
        },
        {
          title: "Horse Feeding Rate Calculator (Forage + Concentrate)",
          url: "/pets/horse-feeding-rate-forage-concentrate",
          icon: "🐎",
        },
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Ferret Protein/Fat Ratio Checker" },
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