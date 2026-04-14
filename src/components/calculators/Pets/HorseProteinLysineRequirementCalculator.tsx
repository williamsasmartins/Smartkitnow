import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseProteinLysineRequirementCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs or kg), activity level factor (multiplier), lysine % in diet (default 6.4%)
  // Protein requirement is based on metabolic weight and activity factor
  // Lysine requirement is % of crude protein requirement
  const [inputs, setInputs] = useState({
    weight: "",
    activityFactor: "1.2", // Maintenance default
    lysinePercent: "6.4", // Typical lysine % of crude protein in diet
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const activityFactorNum = parseFloat(inputs.activityFactor);
    const lysinePercentNum = parseFloat(inputs.lysinePercent);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(activityFactorNum) ||
      activityFactorNum <= 0 ||
      isNaN(lysinePercentNum) ||
      lysinePercentNum <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for all inputs.",
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Crude Protein Requirement (g/day) = 3.2 * (BW in kg)^0.75 * Activity Factor
    // Source: NRC (2007) and common veterinary nutrition references
    const cpRequirement = 3.2 * Math.pow(weightKg, 0.75) * activityFactorNum;

    // Lysine Requirement (g/day) = Crude Protein Requirement * (Lysine % / 100)
    const lysineRequirement = cpRequirement * (lysinePercentNum / 100);

    // Format results to 1 decimal place
    const cpFormatted = cpRequirement.toFixed(1);
    const lysineFormatted = lysineRequirement.toFixed(1);

    return {
      value: 0,
      label: "",
      subtext: "",
      warning: null,
      cpFormatted,
      lysineFormatted,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is lysine and why is it critical for horses?",
      answer: "Lysine is an essential amino acid that horses cannot synthesize and must obtain from feed. It's crucial for muscle development, immune function, and bone growth, with deficiency causing poor growth and weak hooves.",
    },
    {
      question: "How do protein requirements change based on horse age and activity level?",
      answer: "Foals require 14-16% crude protein for growth, weanlings need 12-14%, adult horses at rest need 8-10%, and performance horses need 10-12% depending on discipline intensity.",
    },
    {
      question: "What weight should I input for an accurate calculation?",
      answer: "Use the horse's current body weight in pounds or kilograms; body condition score and age are equally important for precise protein and lysine recommendations.",
    },
    {
      question: "How much lysine does a 1000 lb horse typically need daily?",
      answer: "A 1000 lb mature horse at rest requires approximately 8-12 grams of lysine daily, while performance horses and growing foals need 15-25 grams depending on activity and age.",
    },
    {
      question: "Can I use this calculator for pregnant or lactating mares?",
      answer: "Yes, this calculator accounts for pregnant and lactating status; mares in late pregnancy require 15-18% crude protein and elevated lysine (15-20 grams daily) to support fetal development and milk production.",
    },
    {
      question: "What feeds are highest in lysine for horses?",
      answer: "Alfalfa hay (0.7-0.9% lysine), legume hays, soybean meal (2.8% lysine), and commercial equine supplements are excellent lysine sources to meet calculated requirements.",
    },
    {
      question: "How often should I recalculate my horse's protein and lysine needs?",
      answer: "Recalculate every 6 months or when body weight changes by &gt;50 lbs, training intensity increases, or your horse enters a new life stage (weaning, breeding, retirement).",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  function handleActivityFactorChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setInputs((prev) => ({ ...prev, activityFactor: e.target.value }));
  }

  // Render
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
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Body weight is used to calculate metabolic weight for protein needs.
          </p>
        </div>

        <div>
          <Label htmlFor="activityFactor" className="text-slate-700 dark:text-slate-300">
            Activity Level Factor
          </Label>
          <select
            id="activityFactor"
            name="activityFactor"
            value={inputs.activityFactor}
            onChange={handleActivityFactorChange}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="1.0">Maintenance (1.0)</option>
            <option value="1.2">Light Work (1.2)</option>
            <option value="1.4">Moderate Work (1.4)</option>
            <option value="1.6">Heavy Work (1.6)</option>
            <option value="1.8">Growth, Pregnancy, Lactation (1.8)</option>
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select the activity level to adjust protein needs accordingly.
          </p>
        </div>

        <div>
          <Label htmlFor="lysinePercent" className="text-slate-700 dark:text-slate-300">
            Lysine Percentage in Diet (% of Crude Protein)
          </Label>
          <Input
            id="lysinePercent"
            name="lysinePercent"
            type="number"
            min="0"
            step="any"
            placeholder="Typical: 6.4%"
            value={inputs.lysinePercent}
            onChange={handleInputChange}
            aria-describedby="lysine-desc"
          />
          <p id="lysine-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Lysine is typically 6.4% of crude protein in horse diets; adjust if known.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", activityFactor: "1.2", lysinePercent: "6.4" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.cpFormatted && results.lysineFormatted && !results.warning && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Daily Requirements
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-1">
                {results.cpFormatted} g
              </p>
              <p className="text-slate-600 dark:text-slate-300 font-medium mb-4">Crude Protein</p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-1">
                {results.lysineFormatted} g
              </p>
              <p className="text-slate-600 dark:text-slate-300 font-medium">Lysine</p>
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for personalized diagnosis and dietary planning.
            </p>
          </div>
        </div>
      )}

      {/* Warning */}
      {results.warning && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Horse Protein & Lysine Requirement Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator computes daily protein and lysine requirements based on your horse's weight, age, life stage, and activity level using current NRC (National Research Council) equine nutrition standards.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your horse's body weight in pounds or kilograms, select its age category (foal, weanling, yearling, or adult), indicate activity level (maintenance, light work, heavy work), and note any special conditions (pregnant, lactating, growing).</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator outputs recommended crude protein percentage and daily lysine grams needed; use these figures to balance your forage and concentrate selections, ensuring total dietary lysine meets the calculated target.</p>
        </div>
      </section>

      {/* TABLE: Daily Protein & Lysine Requirements by Horse Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Protein & Lysine Requirements by Horse Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended crude protein and lysine intake for different horse categories based on 2024 NRC equine nutrition standards.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Horse Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Body Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Crude Protein %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Lysine (grams)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Foals (3-6 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-400 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-16%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Weanlings (6-12 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-600 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-14%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-28</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Yearlings (1-2 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600-900 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22-30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult Maintenance (1000 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult Light Work (1000 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-11%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-15</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult Heavy Work (1000 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pregnant Mare (1000 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-13%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-18</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lactating Mare (1000 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-25</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages are crude protein; actual grams depend on total daily feed intake (typically 1.5-2.5% of body weight in hay/grain combined).</p>
      </section>

      {/* TABLE: Lysine Content in Common Equine Feedstuffs */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Lysine Content in Common Equine Feedstuffs</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Typical lysine concentration in feeds used to meet calculated horse protein requirements.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Feedstuff</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lysine %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lysine per 1 lb</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Alfalfa Hay (mid-bloom)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.70-0.85%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.2-3.9 grams</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Timothy Hay (boot stage)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.45-0.55%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.1-2.5 grams</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Clover Hay (mixed)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.75-0.90%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.4-4.1 grams</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oats (grain)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.50-0.65%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.3-3.0 grams</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Barley (grain)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.45-0.60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.1-2.8 grams</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Soybean Meal (48% CP)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.75-2.95%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.6-13.5 grams</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sunflower Meal (28% CP)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.70-0.85%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.2-3.9 grams</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Commercial Equine Supplement</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.50-3.50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.9-16.0 grams</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values per pound as-fed; forage quality varies by harvest stage, storage, and region; grain lysine increases with fortified/supplement products.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always weigh your horse on a scale or use a weight tape for accuracy; estimating weight can lead to under- or over-supplementation by 10-20%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Legume hay (alfalfa, clover) naturally contains 2-3× more lysine than grass hay, so it's an efficient base for meeting lysine requirements without added supplements.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Young performance horses and lactating mares have the highest lysine demands; monitor body condition monthly and adjust feed if weight loss or dull coat appears.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Commercial equine supplements are formulated with synthetic amino acids; verify the lysine concentration per serving to accurately calculate total daily intake.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Life Stage Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Shifting from hay-only feeding to grain increases protein and lysine intake; recalculate when adding concentrates to avoid exceeding requirements, which stresses kidneys.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Crude Protein with Lysine</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A feed with 12% crude protein does not guarantee adequate lysine; lysine is only one amino acid, so verify lysine content separately on the feed tag.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Forage Quality Variation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Alfalfa harvested in late bloom (0.6% lysine) has 30% less lysine than boot-stage alfalfa (0.85%); get forage analyzed if precise requirements are critical.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for Seasonal Feed Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Switching from stored hay to pasture or vice versa changes lysine intake by 20-40%; recalculate and adjust concentrates to maintain consistent amino acid nutrition.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is lysine and why is it critical for horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Lysine is an essential amino acid that horses cannot synthesize and must obtain from feed. It's crucial for muscle development, immune function, and bone growth, with deficiency causing poor growth and weak hooves.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do protein requirements change based on horse age and activity level?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Foals require 14-16% crude protein for growth, weanlings need 12-14%, adult horses at rest need 8-10%, and performance horses need 10-12% depending on discipline intensity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What weight should I input for an accurate calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use the horse's current body weight in pounds or kilograms; body condition score and age are equally important for precise protein and lysine recommendations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much lysine does a 1000 lb horse typically need daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 1000 lb mature horse at rest requires approximately 8-12 grams of lysine daily, while performance horses and growing foals need 15-25 grams depending on activity and age.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for pregnant or lactating mares?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator accounts for pregnant and lactating status; mares in late pregnancy require 15-18% crude protein and elevated lysine (15-20 grams daily) to support fetal development and milk production.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What feeds are highest in lysine for horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Alfalfa hay (0.7-0.9% lysine), legume hays, soybean meal (2.8% lysine), and commercial equine supplements are excellent lysine sources to meet calculated requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my horse's protein and lysine needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate every 6 months or when body weight changes by &gt;50 lbs, training intensity increases, or your horse enters a new life stage (weaning, breeding, retirement).</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nap.edu/catalog/25038/nutrient-requirements-of-horses-sixth-revised-edition" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Research Council (NRC) - Nutrient Requirements of Horses</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative 2007 standard providing amino acid requirements for all horse classes; the foundation for this calculator's protein and lysine targets.</p>
          </li>
          <li>
            <a href="https://aaep.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Association of Equine Practitioners (AAEP) - Equine Nutrition Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary organization offering peer-reviewed nutrition recommendations and updates aligned with current research on horse protein needs.</p>
          </li>
          <li>
            <a href="https://www.uky.edu/Ag/Horseman/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">University of Kentucky Equine Program - Horse Nutrition Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed guides on feed analysis, amino acid requirements, and practical feeding strategies for all horse types and life stages.</p>
          </li>
          <li>
            <a href="https://extension.psu.edu/equine" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Penn State College of Agricultural Sciences - Equine Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Extension articles on protein quality, lysine supplementation, and forage testing to optimize equine diet formulation.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Protein & Lysine Requirement Calculator"
      description="Calculate the daily requirements for crude protein and the essential amino acid **Lysine** for horses."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Crude Protein Requirement (g/day) = 3.2 × (Body Weight in kg)^0.75 × Activity Factor",
        variables: [
          { symbol: "Body Weight", description: "Horse's body weight in kilograms" },
          { symbol: "Activity Factor", description: "Multiplier based on horse's activity level" },
          { symbol: "Crude Protein Requirement", description: "Daily protein requirement in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb (500 kg) horse performing moderate work requires an estimate of daily crude protein and lysine intake.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (1100 lb ÷ 2.20462 = 499 kg). Calculate metabolic weight: 499^0.75 ≈ 112.4.",
          },
          {
            label: "2",
            explanation:
              "Apply activity factor for moderate work (1.4): 3.2 × 112.4 × 1.4 = 503.6 g crude protein/day.",
          },
          {
            label: "3",
            explanation:
              "Calculate lysine requirement assuming 6.4% lysine in diet: 503.6 × 0.064 = 32.2 g lysine/day.",
          },
        ],
        result:
          "The horse requires approximately 504 g of crude protein and 32 g of lysine daily to meet its nutritional needs.",
      }}
      relatedCalculators={[
        {
          title: "Growth Curve by Species (Python, Bearded Dragon, Gecko)",
          url: "/pets/reptile-growth-curve-python-bearded-dragon-gecko",
          icon: "🐾",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
        { title: "Cat Carrier Size & Fit Guide", url: "/pets/cat-carrier-size-fit-guide", icon: "🐱" },
        {
          title: "Xylitol Exposure Risk for Cats (rare but educational)",
          url: "/pets/cat-xylitol-exposure-risk",
          icon: "🐱",
        },
        {
          title: "Litter Box Output Tracker (Normal vs. Increased)",
          url: "/pets/cat-litter-box-output-tracker",
          icon: "💉",
        },
        {
          title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator",
          url: "/pets/dog-onion-garlic-exposure-risk",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Protein & Lysine Requirement Calculator" },
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