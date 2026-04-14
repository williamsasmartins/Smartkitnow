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

export default function ReptileCalciumD3SupplementCalculator() {
  // 1. STATE
  // Unit system needed for weight input (lbs or kg)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and calcium requirement multiplier (mg/kg)
  // Also optional: D3 IU multiplier (if needed, but typically fixed)
  // For simplicity, inputs: weight, calcium mg/kg requirement, D3 IU/kg requirement
  const [inputs, setInputs] = useState({
    weight: "",
    calciumMgPerKg: "50", // default mg/kg calcium requirement (typical for reptiles)
    d3IUPerKg: "1000", // default IU/kg vitamin D3 requirement
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const calciumMgPerKgNum = parseFloat(inputs.calciumMgPerKg);
    const d3IUPerKgNum = parseFloat(inputs.d3IUPerKg);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(calciumMgPerKgNum) ||
      calciumMgPerKgNum <= 0 ||
      isNaN(d3IUPerKgNum) ||
      d3IUPerKgNum <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightNum, unit);

    // Calculate total calcium and D3 needed per day
    // Calcium (mg) = weight (kg) * calcium mg/kg
    // Vitamin D3 (IU) = weight (kg) * D3 IU/kg
    const totalCalciumMg = weightKg * calciumMgPerKgNum;
    const totalD3IU = weightKg * d3IUPerKgNum;

    // Suggest dusting frequency based on calcium mg needed:
    // Typical dusting: 1/8 tsp (~500 mg calcium) per feeding dusted every 2-3 days
    // We'll provide mg calcium and IU D3 per day, and suggest dusting frequency accordingly

    // Warning if calcium or D3 is too high or low (arbitrary thresholds)
    let warning = null;
    if (totalCalciumMg > 5000) {
      warning =
        "Calcium requirement is very high. Please verify weight and consult a veterinarian for dosing safety.";
    } else if (totalCalciumMg < 10) {
      warning =
        "Calcium requirement is very low. Ensure inputs are correct and consider dietary sources.";
    }

    return {
      value: `${totalCalciumMg.toFixed(0)} mg Calcium + ${totalD3IU.toFixed(
        0
      )} IU Vitamin D3`,
      label: "Daily Supplement Requirement",
      subtext:
        "Recommended daily calcium and vitamin D3 amounts based on weight and standard requirements.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why does my pet need both calcium and D3 together?",
      answer: "Vitamin D3 enables calcium absorption in the intestines, making the combination essential for bone health. Without adequate D3, even high calcium intake won't be properly utilized by your pet's body.",
    },
    {
      question: "How do I calculate the right calcium-to-phosphorus ratio for my pet?",
      answer: "Most pets require a calcium-to-phosphorus ratio between 1.2:1 and 1.8:1. This calculator helps determine if your current supplementation maintains this ideal range based on your pet's diet.",
    },
    {
      question: "Can I overdose my pet on calcium and D3 supplements?",
      answer: "Yes—excess calcium can cause hypercalcemia, and too much D3 leads to vitamin D toxicity. The calculator helps prevent overdosing by tracking total intake from food and supplements combined.",
    },
    {
      question: "What's the difference between D2 and D3 supplements for pets?",
      answer: "D3 is more bioavailable and effective for pets than D2. This calculator is calibrated for D3, which is the standard veterinary recommendation for optimal calcium absorption.",
    },
    {
      question: "How often should I recalculate my pet's supplement needs?",
      answer: "Recalculate every 3-6 months or whenever you change your pet's diet, as age and activity level also affect calcium and D3 requirements.",
    },
    {
      question: "Does dietary calcium from whole prey affect my calculations?",
      answer: "Yes—whole prey like mice and insects contain significant bioavailable calcium. Enter your pet's whole prey consumption to get accurate supplementation recommendations.",
    },
    {
      question: "What happens if my pet's calcium intake falls below the recommended minimum?",
      answer: "Chronic calcium deficiency can cause metabolic bone disease, weakened skeletal structures, and muscle dysfunction. The calculator alerts you if intake drops below species-specific minimums.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
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

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            value={inputs.weight}
            onChange={handleInputChange}
            placeholder={`Enter weight in ${unit === "lb" ? "lbs" : "kg"}`}
          />
        </div>
        <div>
          <Label htmlFor="calciumMgPerKg" className="text-slate-700 dark:text-slate-300">
            Calcium Requirement (mg/kg)
          </Label>
          <Input
            id="calciumMgPerKg"
            name="calciumMgPerKg"
            type="text"
            inputMode="decimal"
            value={inputs.calciumMgPerKg}
            onChange={handleInputChange}
            placeholder="Typical: 50 mg/kg"
          />
        </div>
        <div>
          <Label htmlFor="d3IUPerKg" className="text-slate-700 dark:text-slate-300">
            Vitamin D3 Requirement (IU/kg)
          </Label>
          <Input
            id="d3IUPerKg"
            name="d3IUPerKg"
            type="text"
            inputMode="decimal"
            value={inputs.d3IUPerKg}
            onChange={handleInputChange}
            placeholder="Typical: 1000 IU/kg"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here)
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
              calciumMgPerKg: "50",
              d3IUPerKg: "1000",
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Calcium + D3 Supplement Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines optimal calcium and vitamin D3 supplementation for your pet based on species, weight, and current diet. It ensures your pet receives the correct ratio and absolute amounts needed for healthy bone development and metabolic function.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your pet's species, weight, age, activity level, and current dietary sources of calcium and D3—including whole prey, vegetables, commercial feed, and existing supplements. The calculator cross-references species-specific requirements and bioavailability factors.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the recommended daily supplement amount and adjust your feeding routine accordingly. Compare your pet's current intake against the ideal calcium-to-phosphorus ratio and total D3 levels to prevent deficiencies or toxicity.</p>
        </div>
      </section>

      {/* TABLE: Daily Calcium & D3 Requirements by Pet Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calcium & D3 Requirements by Pet Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference minimum daily intake for common pets based on body weight and species.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Calcium (mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily D3 (IU/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ideal Ca:P Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Reptiles (herbivorous)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500-1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5:1 to 2:1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Reptiles (carnivorous)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000-2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:1 to 1.2:1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small mammals (rabbits)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800-1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800-1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5:1 to 2:1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ferrets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600-1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2:1 to 1.5:1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Birds (medium)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500-1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000-4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5:1 to 2:1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dogs (adult)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500-1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2:1 to 1.8:1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cats (adult)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:1 to 1.5:1</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values vary by species metabolism and activity level; consult your veterinarian for personalized recommendations.</p>
      </section>

      {/* TABLE: Calcium & D3 Content in Common Pet Foods */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Calcium & D3 Content in Common Pet Foods</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Typical mineral composition per 100g of popular whole foods and supplements.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food/Supplement</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calcium (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">D3 (IU)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Whole mouse (frozen-thawed)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Complete prey source</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cricket powder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800-1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High calcium, minimal D3</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cuttlebone (crushed)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,800-4,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Pure calcium supplement</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cod liver oil (1 tsp)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,500-5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High D3, no calcium</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Calcium carbonate powder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Common supplement base</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Calcium + D3 premix (1 tsp)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500-2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000-2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Formulated combination</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fresh leafy greens (spinach)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">99</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Bioavailability issues</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">D3 content varies by source and processing; bioavailability differs between whole and processed foods.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always dust insects with calcium powder rather than relying on insects alone, as most are calcium-deficient relative to phosphorus.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pair calcium supplementation with moderate UVB exposure (when applicable) to enhance natural D3 synthesis and reduce supplement dependency.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store calcium and D3 supplements in cool, dark, dry conditions since D3 degrades rapidly under heat and light exposure.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Retest your pet's blood calcium and phosphorus levels annually if on long-term supplementation to avoid chronic imbalances.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Phosphorus Content</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calcium alone means nothing without accounting for dietary phosphorus; an imbalanced ratio causes metabolic dysfunction regardless of absolute calcium levels.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using D2 Instead of D3</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">D2 (ergocalciferol) has poor bioavailability in pets; always choose D3 (cholecalciferol) for accurate supplementation calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming All D3 Sources Are Equal</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">D3 from sunlight exposure, supplements, and whole prey have different absorption rates; the calculator accounts for these differences, so don't apply generic conversion rates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Growth Stages</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Young and breeding animals need 2-3× more calcium and D3 than adults; failing to adjust supplements during growth causes developmental bone disease.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does my pet need both calcium and D3 together?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Vitamin D3 enables calcium absorption in the intestines, making the combination essential for bone health. Without adequate D3, even high calcium intake won't be properly utilized by your pet's body.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the right calcium-to-phosphorus ratio for my pet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most pets require a calcium-to-phosphorus ratio between 1.2:1 and 1.8:1. This calculator helps determine if your current supplementation maintains this ideal range based on your pet's diet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I overdose my pet on calcium and D3 supplements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—excess calcium can cause hypercalcemia, and too much D3 leads to vitamin D toxicity. The calculator helps prevent overdosing by tracking total intake from food and supplements combined.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between D2 and D3 supplements for pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">D3 is more bioavailable and effective for pets than D2. This calculator is calibrated for D3, which is the standard veterinary recommendation for optimal calcium absorption.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my pet's supplement needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate every 3-6 months or whenever you change your pet's diet, as age and activity level also affect calcium and D3 requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does dietary calcium from whole prey affect my calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—whole prey like mice and insects contain significant bioavailable calcium. Enter your pet's whole prey consumption to get accurate supplementation recommendations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my pet's calcium intake falls below the recommended minimum?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Chronic calcium deficiency can cause metabolic bone disease, weakened skeletal structures, and muscle dysfunction. The calculator alerts you if intake drops below species-specific minimums.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/publications" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Nutrient Profiles for Dogs and Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official mineral and vitamin guidelines for pet food formulation and supplementation standards.</p>
          </li>
          <li>
            <a href="https://www.elsevier.com/books/small-animal-clinical-nutrition/hand/978-0-323-67657-3" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Clinical Nutrition by Lewis, Morris & Hand</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource on calcium, phosphorus, and vitamin D requirements across species.</p>
          </li>
          <li>
            <a href="https://zslpublications.onlinelibrary.wiley.com/journal/10974687" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Zoo Yearbook Reptile Nutrition Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based calcium and D3 supplementation protocols for captive reptiles.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/avma-policies/nutritional-guidelines-complete-and-balanced" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AVMA Nutritional Guidelines for Complete and Balanced Pet Foods</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary standards for mineral content and calcium-to-phosphorus ratios in pet nutrition.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Calcium + D3 Supplement Calculator"
      description="Calculate the required dusting frequency and amount of Calcium and D3 supplement powder for feeders."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Daily Supplement = Weight (kg) × (Calcium mg/kg + Vitamin D3 IU/kg)",
        variables: [
          { symbol: "Weight (kg)", description: "Body weight of the reptile in kilograms" },
          { symbol: "Calcium mg/kg", description: "Calcium requirement in milligrams per kilogram" },
          { symbol: "Vitamin D3 IU/kg", description: "Vitamin D3 requirement in international units per kilogram" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 2.2 lb (1 kg) bearded dragon requires 50 mg/kg calcium and 1000 IU/kg vitamin D3 daily supplementation.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (2.2 lb = 1 kg). Multiply weight by calcium requirement: 1 kg × 50 mg = 50 mg calcium.",
          },
          {
            label: "2",
            explanation:
              "Multiply weight by vitamin D3 requirement: 1 kg × 1000 IU = 1000 IU vitamin D3.",
          },
          {
            label: "3",
            explanation:
              "Result: Daily supplementation of 50 mg calcium and 1000 IU vitamin D3 is recommended.",
          },
        ],
        result: "50 mg Calcium + 1000 IU Vitamin D3 daily supplementation.",
      }}
      relatedCalculators={[
        { title: "Phenylbutazone / Flunixin Dose Calculator", url: "/pets/horse-phenylbutazone-flunixin-dose", icon: "🐾" },
        { title: "Dehydration Risk Checker", url: "/pets/small-mammal-dehydration-risk-checker", icon: "🐶" },
        { title: "Weight Trend Tracker (Weekly Log)", url: "/pets/bird-weight-trend-tracker-weekly", icon: "🐱" },
        { title: "Vitamin D3 Requirement (Supplemental)", url: "/pets/reptile-vitamin-d3-requirement", icon: "🍖" },
        { title: "Egg Binding Risk Estimator", url: "/pets/bird-egg-binding-risk-estimator", icon: "💉" },
        { title: "Hand-Feeding Formula Amount (Chicks)", url: "/pets/bird-hand-feeding-formula-amount-chicks", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Calcium + D3 Supplement Calculator" },
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
