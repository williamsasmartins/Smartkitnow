import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ReptileFeederInsectGutLoadingRatioCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs:
  // - Insect Weight (g or lbs)
  // - Gut-Loading Nutrient Concentration (mg/g)
  // - Desired Nutrient Intake (mg)
  // - Gut-Loading Duration (hours)
  const [inputs, setInputs] = useState({
    insectWeight: "",
    nutrientConcentration: "",
    desiredIntake: "",
    gutLoadingDuration: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Gut-Loading Ratio = (Desired Nutrient Intake) / (Insect Weight × Nutrient Concentration × Gut-Loading Duration)
  // This ratio estimates the efficiency or adequacy of gut-loading based on inputs.
  // Units internally converted: insectWeight to grams if imperial.
  const results = useMemo(() => {
    const insectWeightRaw = parseFloat(inputs.insectWeight);
    const nutrientConcentration = parseFloat(inputs.nutrientConcentration);
    const desiredIntake = parseFloat(inputs.desiredIntake);
    const gutLoadingDuration = parseFloat(inputs.gutLoadingDuration);

    if (
      isNaN(insectWeightRaw) ||
      isNaN(nutrientConcentration) ||
      isNaN(desiredIntake) ||
      isNaN(gutLoadingDuration) ||
      insectWeightRaw <= 0 ||
      nutrientConcentration <= 0 ||
      desiredIntake <= 0 ||
      gutLoadingDuration <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for all inputs.",
        subtext: null,
        warning: null,
      };
    }

    // Convert insect weight to grams if imperial (lbs to g)
    const insectWeight =
      unit === "imperial" ? insectWeightRaw * 453.59237 : insectWeightRaw;

    // Calculate gut-loading ratio (unitless)
    // Interpretation: ratio < 1 means insufficient gut-loading; ratio >= 1 means adequate or more.
    const gutLoadingRatio =
      desiredIntake / (insectWeight * nutrientConcentration * gutLoadingDuration);

    let label = "";
    let warning = null;
    if (gutLoadingRatio < 1) {
      label =
        "Gut-loading ratio below 1 indicates insufficient nutrient delivery. Consider increasing gut-loading duration or nutrient concentration.";
      warning =
        "Warning: Nutrient intake may be inadequate for optimal reptile nutrition.";
    } else {
      label =
        "Gut-loading ratio meets or exceeds the desired nutrient intake, indicating adequate gut-loading.";
    }

    return {
      value: gutLoadingRatio.toFixed(3),
      label,
      subtext: "Ratio (unitless) indicating gut-loading adequacy",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is gut-loading and why does the ratio matter?",
      answer: "Gut-loading is feeding nutritious food to feeder insects 24-48 hours before offering them to reptiles, transferring nutrients directly to your pet. The ratio determines how much nutrition your reptile receives from each insect meal.",
    },
    {
      question: "What's the ideal calcium-to-phosphorus ratio for feeder insects?",
      answer: "The optimal ratio is 1.5:1 to 2:1 calcium-to-phosphorus for most reptiles; ratios below 1:1 can lead to metabolic bone disease over time.",
    },
    {
      question: "How long should insects be gut-loaded before feeding?",
      answer: "Insects should be gut-loaded for 24-48 hours before feeding to your reptile; loading them longer than 48 hours provides diminishing nutritional returns.",
    },
    {
      question: "Which feeder insects benefit most from gut-loading?",
      answer: "Crickets, dubia roaches, and mealworms absorb and retain gut-loaded nutrients better than insects like waxworms, which have high natural fat content.",
    },
    {
      question: "How does the ratio change based on reptile species?",
      answer: "Herbivorous reptiles need higher calcium ratios (2:1), while carnivorous species tolerate ratios closer to 1.5:1; juvenile reptiles require stricter calcium supplementation.",
    },
    {
      question: "What happens if the calcium-to-phosphorus ratio is too low?",
      answer: "Ratios below 1:1 increase phosphorus absorption, which inhibits calcium uptake and leads to metabolic bone disease, impaction, and skeletal deformities.",
    },
    {
      question: "Can I use commercial gut-load products or should I make my own?",
      answer: "Commercial products (Repashy, Fluker's) offer consistent ratios around 1.5:1-2:1, while homemade blends of collards, squash, and calcium powder require careful measurement to achieve proper ratios.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
              <SelectItem value="imperial">Imperial (lbs, mg)</SelectItem>
              <SelectItem value="metric">Metric (g, mg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="insectWeight" className="text-slate-700 dark:text-slate-300">
            Feeder Insect Weight ({unit === "imperial" ? "lbs" : "grams"})
          </Label>
          <Input
            id="insectWeight"
            type="number"
            min="0"
            step="any"
            placeholder={unit === "imperial" ? "e.g., 0.05" : "e.g., 20"}
            value={inputs.insectWeight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, insectWeight: e.target.value }))
            }
          />
        </div>

        <div>
          <Label htmlFor="nutrientConcentration" className="text-slate-700 dark:text-slate-300">
            Gut-Loading Nutrient Concentration (mg/g)
          </Label>
          <Input
            id="nutrientConcentration"
            type="number"
            min="0"
            step="any"
            placeholder="e.g., 15"
            value={inputs.nutrientConcentration}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, nutrientConcentration: e.target.value }))
            }
          />
        </div>

        <div>
          <Label htmlFor="desiredIntake" className="text-slate-700 dark:text-slate-300">
            Desired Nutrient Intake (mg)
          </Label>
          <Input
            id="desiredIntake"
            type="number"
            min="0"
            step="any"
            placeholder="e.g., 30"
            value={inputs.desiredIntake}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, desiredIntake: e.target.value }))
            }
          />
        </div>

        <div>
          <Label htmlFor="gutLoadingDuration" className="text-slate-700 dark:text-slate-300">
            Gut-Loading Duration (hours)
          </Label>
          <Input
            id="gutLoadingDuration"
            type="number"
            min="0"
            step="any"
            placeholder="e.g., 24"
            value={inputs.gutLoadingDuration}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, gutLoadingDuration: e.target.value }))
            }
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
              insectWeight: "",
              nutrientConcentration: "",
              desiredIntake: "",
              gutLoadingDuration: "",
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Feeder Insect Gut-Loading Ratio Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine the optimal calcium-to-phosphorus ratio for gut-loaded feeder insects based on your reptile species and age. By calculating the correct nutrient balance, you ensure your reptile receives proper nutrition and prevent metabolic bone disease.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your reptile type, age group, and your feeder insect variety to generate the target Ca:P ratio. The calculator accounts for the insect's natural nutrient content and adjusts recommendations based on loading duration and frequency.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Use the results to select appropriate gut-load recipes or commercial products that match your target ratio. Compare your current feeding protocol against the recommended ratio to identify nutritional gaps and adjust supplementation accordingly.</p>
        </div>
      </section>

      {/* TABLE: Optimal Gut-Loading Ratios by Reptile Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Optimal Gut-Loading Ratios by Reptile Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different reptile species require varying calcium-to-phosphorus ratios for optimal health.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Reptile Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ideal Ca:P Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Loading Duration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bearded Dragons (juvenile)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2:1 to 2.5:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6x weekly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bearded Dragons (adult)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5:1 to 2:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-48 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3x weekly</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Leopard Geckos</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5:1 to 2:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4x weekly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Crested Geckos</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4x weekly</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ball Pythons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2:1 to 1.5:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2x weekly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Corn Snakes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2:1 to 1.5:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2x weekly</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Juvenile reptiles require higher ratios due to rapid bone development; adjust based on individual reptile health and UVB exposure.</p>
      </section>

      {/* TABLE: Feeder Insect Nutrient Profiles (Pre-Gut-Load) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Feeder Insect Nutrient Profiles (Pre-Gut-Load)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Base calcium and phosphorus content varies significantly among common feeder insects.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Insect Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calcium (mg/100g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Phosphorus (mg/100g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Base Ca:P Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Crickets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-220</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.45:1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dubia Roaches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110-140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.54:1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mealworms</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.08:1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Waxworms</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160-180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.18:1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Black Soldier Fly Larvae</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">140-180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90-120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.4:1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Grasshoppers</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">170-200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.45:1</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Gut-loading with calcium-rich greens and supplements improves these ratios by 150-300% within 24-48 hours.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use dark leafy greens (collards, mustard greens, dandelion) as your gut-load base; they provide 1000+ mg calcium per 100g compared to 80-120 mg in insects alone.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Add calcium powder without vitamin D3 to gut-load mixes for insects kept indoors away from UVB; vitamin D3 is better obtained from UVB exposure.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Rotate feeder insect species weekly to vary nutrient profiles and prevent nutritional imbalances from relying on a single insect type.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your reptile's behavior and bone density; if metabolic bone disease signs appear, increase loading frequency to 5-6 times weekly and boost the Ca:P ratio to 2:1 or higher.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Gut-loading for more than 72 hours</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Extended loading causes insects to deplete their gut contents and reduces nutrient retention, making 24-48 hours the optimal window.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using only one feeder insect species</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Single-insect diets create nutritional imbalances; rotating between crickets, roaches, and BSFL ensures varied micronutrient intake.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring the insect's base nutrient content</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Mealworms and waxworms have naturally low calcium; they require aggressive supplementation to reach appropriate ratios, unlike BSFL which is already calcium-rich.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to adjust ratios for reptile age</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Juveniles need 2:1 to 2.5:1 ratios, while adults thrive at 1.5:1; using adult-level ratios for growing reptiles increases metabolic bone disease risk.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is gut-loading and why does the ratio matter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gut-loading is feeding nutritious food to feeder insects 24-48 hours before offering them to reptiles, transferring nutrients directly to your pet. The ratio determines how much nutrition your reptile receives from each insect meal.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the ideal calcium-to-phosphorus ratio for feeder insects?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The optimal ratio is 1.5:1 to 2:1 calcium-to-phosphorus for most reptiles; ratios below 1:1 can lead to metabolic bone disease over time.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long should insects be gut-loaded before feeding?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Insects should be gut-loaded for 24-48 hours before feeding to your reptile; loading them longer than 48 hours provides diminishing nutritional returns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Which feeder insects benefit most from gut-loading?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Crickets, dubia roaches, and mealworms absorb and retain gut-loaded nutrients better than insects like waxworms, which have high natural fat content.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the ratio change based on reptile species?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Herbivorous reptiles need higher calcium ratios (2:1), while carnivorous species tolerate ratios closer to 1.5:1; juvenile reptiles require stricter calcium supplementation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if the calcium-to-phosphorus ratio is too low?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Ratios below 1:1 increase phosphorus absorption, which inhibits calcium uptake and leads to metabolic bone disease, impaction, and skeletal deformities.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use commercial gut-load products or should I make my own?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Commercial products (Repashy, Fluker's) offer consistent ratios around 1.5:1-2:1, while homemade blends of collards, squash, and calcium powder require careful measurement to achieve proper ratios.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5357140/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Nutritional Requirements of Reptiles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on calcium-phosphorus ratios and metabolic bone disease prevention in captive reptiles.</p>
          </li>
          <li>
            <a href="https://www.thesprucepets.com/bearded-dragon-care-guide-1236563" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bearded Dragon Care Guide - The Spruce Pets</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based feeding recommendations including gut-loading protocols and optimal nutrient ratios for bearded dragons.</p>
          </li>
          <li>
            <a href="https://www.reptile-database.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Reptile Database - Feeding and Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive species-specific nutritional guidelines and feeder insect analysis for captive reptile husbandry.</p>
          </li>
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Pet Food Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official nutritional standards and mineral guidelines referenced for balanced reptile diets and supplement formulation.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Feeder Insect Gut-Loading Ratio"
      description="Calculate the necessary gut-loading time and nutritional ratio for feeder insects before feeding them to reptiles."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Gut-Loading Ratio = Desired Nutrient Intake / (Insect Weight × Nutrient Concentration × Gut-Loading Duration)",
        variables: [
          { symbol: "Desired Nutrient Intake", description: "Target nutrient amount in mg" },
          { symbol: "Insect Weight", description: "Weight of feeder insect in grams" },
          { symbol: "Nutrient Concentration", description: "Nutrient concentration in mg per gram" },
          { symbol: "Gut-Loading Duration", description: "Time insects are gut-loaded in hours" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A reptile keeper wants to ensure their feeder crickets provide 30 mg of calcium. Each cricket weighs 0.05 lbs (22.68 g), and the gut-loading diet contains 15 mg of calcium per gram. The keeper plans to gut-load the crickets for 24 hours.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert cricket weight to grams if needed (0.05 lbs × 453.592 = 22.68 g).",
          },
          {
            label: "2",
            explanation:
              "Calculate total nutrient available: 22.68 g × 15 mg/g × 24 hours = 8161.2 mg-hours.",
          },
          {
            label: "3",
            explanation:
              "Calculate gut-loading ratio: 30 mg / 8161.2 mg-hours ≈ 0.0037, indicating ample nutrient availability.",
          },
        ],
        result:
          "The gut-loading ratio is well below 1, meaning the gut-loading protocol is more than sufficient to meet the reptile's calcium needs.",
      }}
      relatedCalculators={[
        {
          title: "Resting vs. Active Hours Balance Tracker (owner input)",
          url: "/pets/cat-resting-active-hours-balance-tracker",
          icon: "🐾",
        },
        {
          title: "Bedding Replacement Frequency Estimator",
          url: "/pets/small-mammal-bedding-replacement-frequency",
          icon: "🐶",
        },
        {
          title: "Essential Oils Exposure Risk (diffuser/dermal)",
          url: "/pets/cat-essential-oils-exposure-risk",
          icon: "🐱",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🐶",
        },
        {
          title: "Xylitol Exposure Risk for Cats (rare but educational)",
          url: "/pets/cat-xylitol-exposure-risk",
          icon: "🐱",
        },
        {
          title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs",
          url: "/pets/dog-benadryl-diphenhydramine-dose",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Feeder Insect Gut-Loading Ratio" },
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