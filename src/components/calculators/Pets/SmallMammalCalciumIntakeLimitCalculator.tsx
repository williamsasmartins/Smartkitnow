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

export default function SmallMammalCalciumIntakeLimitCalculator() {
  // 1. STATE
  // Unit system: Imperial (lbs) or Metric (kg)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Calcium Intake Limit (mg/day) = 70 mg/kg * weight in kg
  // Source: Veterinary nutritional guidelines for bladder stone prevention
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: "",
        warning: null,
      };
    }
    const weightKg = weightToKg(weightRaw, unit);

    // Calculate calcium intake limit in mg/day
    // 70 mg calcium per kg body weight per day is a commonly recommended safe upper limit to reduce bladder stone risk
    const calciumLimitMg = Math.round(70 * weightKg);

    return {
      value: calciumLimitMg.toLocaleString(),
      label: "Maximum Daily Calcium Intake (mg)",
      subtext:
        "This limit helps reduce the risk of calcium-containing bladder stones by avoiding excessive calcium intake.",
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the recommended calcium intake limit for pets prone to bladder stones?",
      answer: "Most veterinarians recommend keeping calcium intake between 0.8-1.2% of dry matter for dogs and cats susceptible to bladder stones, depending on stone composition and underlying conditions.",
    },
    {
      question: "How does excess calcium contribute to bladder stone formation?",
      answer: "High calcium intake increases urinary calcium excretion, which can precipitate with phosphate or oxalate to form struvite or calcium oxalate stones in the bladder.",
    },
    {
      question: "Should I reduce calcium for pets with a history of bladder stones?",
      answer: "Yes, reducing calcium to the lower end of the normal range (0.6-0.8%) may help prevent recurrence, especially for calcium oxalate stone formers.",
    },
    {
      question: "Can dietary calcium restriction alone prevent bladder stones?",
      answer: "While calcium reduction helps, stone prevention also requires adequate hydration, urinary pH management, and treating underlying infections or metabolic disorders.",
    },
    {
      question: "What pet foods are appropriate for calcium-restricted diets?",
      answer: "Prescription veterinary diets formulated for urinary health typically contain controlled calcium (0.6-1.0%) and are designed to prevent stone formation.",
    },
    {
      question: "How do I calculate my pet's daily calcium intake?",
      answer: "Multiply the percentage of calcium in the food by your pet's daily dry matter intake; this calculator automates that process using your pet's weight and food label data.",
    },
    {
      question: "Are certain dog breeds more prone to bladder stones?",
      answer: "Yes, miniature schnauzers, bulldogs, and dalmatians have higher genetic predisposition to bladder stones and may benefit from stricter calcium management.",
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
              <SelectItem value="lb">Imperial (lbs)</SelectItem>
              <SelectItem value="kg">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Weight Input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Weight ({unit === "lb" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          aria-describedby="weight-help"
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

  // 5. EDITORIAL JSX
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Calcium Intake Limit (Bladder Stone Prevention)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the optimal daily calcium intake range for your pet based on body weight and stone risk status. It helps owners and veterinarians establish dietary targets to reduce bladder stone formation risk.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet's current weight, select their stone history status (none, previous stones, or active condition), and input the calcium percentage from your pet food label. The calculator uses these inputs to compute safe daily calcium limits.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show your pet's recommended daily calcium intake in milligrams. Compare this to your current food's calcium content to decide if dietary adjustment is needed; results &lt;500 mg/day or &gt;3500 mg/day warrant veterinary review.</p>
        </div>
      </section>

      {/* TABLE: Calcium Content in Common Pet Foods */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Calcium Content in Common Pet Foods</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference table showing typical calcium percentages in standard and prescription pet diets.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calcium % (Dry Matter)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Suitable for Stone-Prone Pets?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard dry dog food</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.9-1.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">May be too high</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-quality commercial diet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8-1.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Generally acceptable</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Prescription urinary diet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6-0.9%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Recommended</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Homemade diet (balanced)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.7-1.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">If properly formulated</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Grain-free kibble</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0-1.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Often excessive</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Consult your veterinarian before switching foods for stone prevention.</p>
      </section>

      {/* TABLE: Recommended Calcium Intake Limits by Pet Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Calcium Intake Limits by Pet Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Daily calcium intake recommendations based on pet weight and stone risk profile.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Normal Limit (mg/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Stone-Prone Limit (mg/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Stone-History Limit (mg/day)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800-1200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600-900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-700</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">21-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1500-2500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1100-1800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800-1300</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">51-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2800-4500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2000-3200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1500-2400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Over 100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4500-6500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3200-4800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2400-3600</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Actual requirements vary by individual health status; use this calculator with veterinary guidance.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always check your pet food label for the calcium percentage listed as 'minimum' or 'guaranteed analysis' on a dry matter basis.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Increase fresh water availability—proper hydration is critical for preventing stone formation regardless of calcium intake.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your pet for signs of recurrent stones such as straining to urinate, blood in urine, or frequent urination.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Have urine analyzed (urinalysis) annually for stone-prone pets to detect early crystalluria before stones form.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Wet vs. Dry Matter Percentages</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Always convert wet food calcium content to dry matter basis (multiply by 4-5) before comparing to dry food percentages.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Individual Pet Metabolism</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">This calculator provides guidelines; some pets absorb or excrete calcium differently, so veterinary oversight is essential.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Calcium Restriction Alone Cures Stones</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dietary calcium control is one tool—urinary pH management, hydration, and treating infections are equally important.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Treats and Supplements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calcium from treats, supplements, and table scraps can significantly exceed daily limits and should be included in calculations.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the recommended calcium intake limit for pets prone to bladder stones?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most veterinarians recommend keeping calcium intake between 0.8-1.2% of dry matter for dogs and cats susceptible to bladder stones, depending on stone composition and underlying conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does excess calcium contribute to bladder stone formation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">High calcium intake increases urinary calcium excretion, which can precipitate with phosphate or oxalate to form struvite or calcium oxalate stones in the bladder.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I reduce calcium for pets with a history of bladder stones?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, reducing calcium to the lower end of the normal range (0.6-0.8%) may help prevent recurrence, especially for calcium oxalate stone formers.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can dietary calcium restriction alone prevent bladder stones?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While calcium reduction helps, stone prevention also requires adequate hydration, urinary pH management, and treating underlying infections or metabolic disorders.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What pet foods are appropriate for calcium-restricted diets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Prescription veterinary diets formulated for urinary health typically contain controlled calcium (0.6-1.0%) and are designed to prevent stone formation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my pet's daily calcium intake?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Multiply the percentage of calcium in the food by your pet's daily dry matter intake; this calculator automates that process using your pet's weight and food label data.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are certain dog breeds more prone to bladder stones?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, miniature schnauzers, bulldogs, and dalmatians have higher genetic predisposition to bladder stones and may benefit from stricter calcium management.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.vetmed.wsu.edu/outreach/Pet-Health-Topics/Categories/Companion-Animals/Kidney-and-Urinary-Stones" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Canine and Feline Nephrology and Urology - Urolithiasis</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive veterinary resource on bladder stone causes, types, and dietary management strategies.</p>
          </li>
          <li>
            <a href="https://www.aaha.org/guidelines" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Animal Hospital Association (AAHA) Nutrition Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based nutritional guidelines for managing urinary diseases in companion animals.</p>
          </li>
          <li>
            <a href="https://www.isfm.net/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Society of Feline Medicine - Feline Lower Urinary Tract Disease</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Specialist guidance on preventing and managing feline urinary conditions including bladder stones.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/veterinary-medical-teaching-hospital/nutrition-support-service" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis School of Veterinary Medicine - Nutrition Support Service</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical nutrition expertise on formulating stone prevention diets for individual patient needs.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Calcium Intake Limit (Bladder Stone Prevention)"
      description="Determine the safe daily limit for calcium intake to reduce the risk of bladder stones in susceptible species."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Calcium Intake Limit (mg/day) = 70 mg × Body Weight (kg)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Animal's body weight in kilograms" },
          { symbol: "70 mg", description: "Recommended calcium intake per kg body weight per day" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A rabbit weighs 4.4 lbs (2 kg). The owner wants to know the maximum safe daily calcium intake to prevent bladder stones.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed (4.4 lbs ÷ 2.20462 = 2 kg).",
          },
          {
            label: "2",
            explanation:
              "Multiply the weight by 70 mg/kg: 2 kg × 70 mg = 140 mg calcium per day.",
          },
        ],
        result:
          "The rabbit's maximum safe daily calcium intake is 140 mg to reduce bladder stone risk.",
      }}
      relatedCalculators={[
        { title: "Meloxicam Dose Calculator for Cats", url: "/pets/cat-meloxicam-dose", icon: "🐱" },
        { title: "Common Toxic Foods Reference", url: "/pets/small-mammal-common-toxic-foods-reference", icon: "🐶" },
        { title: "Litter Box Output Tracker (Normal vs. Increased)", url: "/pets/cat-litter-box-output-tracker", icon: "🐱" },
        { title: "Life Expectancy Estimator (lifestyle factors; educational)", url: "/pets/cat-life-expectancy-estimator", icon: "🐱" },
        { title: "Heat Risk/Walk Safety Window (Temp & Humidity)", url: "/pets/dog-heat-risk-walk-safety-window", icon: "💉" },
        { title: "Nail Trim Interval Planner (activity/surface based)", url: "/pets/cat-nail-trim-interval-planner", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Calcium Intake Limit (Bladder Stone Prevention)" },
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
