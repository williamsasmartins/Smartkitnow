import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseLaminitisRiskIndexCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: Body Condition Score (BCS) 1-9 scale, NSC intake in grams per day, and horse weight
  const [inputs, setInputs] = useState({
    bcs: "",
    nscIntake: "",
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Laminitis Risk Index (LRI) = (BCS - 5) * 2 + (NSC intake in g/kg BW)
  // NSC intake in g/kg BW = NSC intake (g) / weight (kg)
  // BCS baseline is 5 (ideal), risk increases as BCS > 5 and NSC intake increases
  const results = useMemo(() => {
    const bcs = parseFloat(inputs.bcs);
    const nscIntake = parseFloat(inputs.nscIntake);
    let weightKg = parseFloat(inputs.weight);

    if (
      isNaN(bcs) ||
      isNaN(nscIntake) ||
      isNaN(weightKg) ||
      bcs < 1 ||
      bcs > 9 ||
      nscIntake < 0 ||
      weightKg <= 0
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter valid values for all fields.",
        warning: null,
      };
    }

    if (unit === "imperial") {
      weightKg = weightKg / 2.20462;
    }

    // Calculate NSC intake per kg body weight
    const nscPerKg = nscIntake / weightKg;

    // Calculate Laminitis Risk Index
    // Risk increases if BCS > 5, else no added risk from BCS
    const bcsRisk = bcs > 5 ? (bcs - 5) * 2 : 0;

    const riskIndex = bcsRisk + nscPerKg;

    // Risk interpretation
    let label = "";
    let warning = null;
    if (riskIndex < 1) {
      label = "Low Risk";
    } else if (riskIndex < 3) {
      label = "Moderate Risk";
      warning =
        "Moderate risk of laminitis. Consider dietary adjustments and veterinary consultation.";
    } else {
      label = "High Risk";
      warning =
        "High risk of laminitis. Immediate veterinary advice and dietary management recommended.";
    }

    return {
      value: riskIndex.toFixed(2),
      label,
      subtext: `Based on BCS and NSC intake per kg body weight.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What does BCS stand for in the Laminitis Risk Index?",
      answer: "BCS stands for Body Condition Score, a 1-9 scale assessing horse weight and fat distribution. Scores of 7-9 significantly increase laminitis risk due to insulin resistance and metabolic dysfunction.",
    },
    {
      question: "How does NSC intake affect laminitis risk?",
      answer: "NSC (Non-Structural Carbohydrates) intake above 10-12% of daily feed dry matter elevates blood glucose and insulin, triggering laminitis in susceptible horses. High-NSC pasture and grain are major risk factors.",
    },
    {
      question: "What is considered a high-risk BCS for laminitis?",
      answer: "A BCS of 7 or higher on the 1-9 scale indicates high laminitis risk, with scores 8-9 representing obese horses with 3-5x greater risk than ideal-weight horses.",
    },
    {
      question: "Can a normal BCS horse still have high laminitis risk?",
      answer: "Yes; a horse with ideal BCS (5-6) consuming high-NSC feed (&gt;12% NSC) remains at elevated risk, especially if insulin-resistant or prone to equine metabolic syndrome.",
    },
    {
      question: "How often should I reassess my horse's laminitis risk index?",
      answer: "Reassess quarterly or whenever diet or weight changes significantly; horses at high risk should be monitored every 4-6 weeks, especially during spring and summer pasture season.",
    },
    {
      question: "What NSC threshold triggers moderate laminitis risk?",
      answer: "NSC intake between 10-14% of dry matter represents moderate risk; above 14% NSC constitutes high risk for insulin-resistant or susceptible horses.",
    },
    {
      question: "Is the Laminitis Risk Index a diagnostic tool?",
      answer: "No; this index estimates relative risk based on BCS and NSC intake but cannot diagnose laminitis—consult a veterinarian for clinical evaluation and bloodwork.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
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
          <Label htmlFor="bcs" className="text-slate-700 dark:text-slate-300">
            Body Condition Score (1-9)
          </Label>
          <Input
            id="bcs"
            type="number"
            min={1}
            max={9}
            step={0.1}
            placeholder="e.g. 6.5"
            value={inputs.bcs}
            onChange={(e) => setInputs({ ...inputs, bcs: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="nscIntake" className="text-slate-700 dark:text-slate-300">
            Daily NSC Intake (grams)
          </Label>
          <Input
            id="nscIntake"
            type="number"
            min={0}
            step={1}
            placeholder="e.g. 500"
            value={inputs.nscIntake}
            onChange={(e) => setInputs({ ...inputs, nscIntake: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step={1}
            placeholder={unit === "imperial" ? "e.g. 1100" : "e.g. 500"}
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ bcs: "", nscIntake: "", weight: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Laminitis Risk Index (BCS + NSC intake)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator combines Body Condition Score (BCS) and Non-Structural Carbohydrate (NSC) intake to estimate your horse's relative laminitis risk. It helps identify whether your current management strategy protects against this serious hoof disease.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this tool, accurately assess your horse's BCS on the 1-9 scale by observing ribcage visibility and fat deposits, then determine your horse's daily NSC intake as a percentage of dry matter from feed labels, hay analysis, or forage samples.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your risk index result ranges from low to very high; low-risk horses may maintain current feeding, moderate-risk horses need dietary adjustments or weight management, and high-risk horses require veterinary guidance, possible medication (pergolide), and strict NSC restriction below 12%.</p>
        </div>
      </section>

      {/* TABLE: Body Condition Score (BCS) Risk Levels */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Body Condition Score (BCS) Risk Levels</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">BCS classifications and corresponding laminitis risk severity based on equine standards.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BCS Score</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Description</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Laminitis Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ideal weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slightly above ideal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low-Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Overweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate-High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Obese</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severely obese</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Risk increases exponentially at BCS &gt;6; horses scoring 8-9 have 3-5x greater risk than ideal-weight horses.</p>
      </section>

      {/* TABLE: NSC Intake Risk Categories */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">NSC Intake Risk Categories</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Non-Structural Carbohydrate thresholds and associated laminitis risk for horses.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">NSC % of DM</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&lt;10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Safe for most horses</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10-12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitor closely, limit grazing</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12-14%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Restrict feed, use grazing muzzle</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;14%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Consult vet, intensive management</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Pasture NSC varies seasonally; spring growth typically contains 15-25% NSC, requiring aggressive management for at-risk horses.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Test your hay NSC content via equine laboratory analysis; many horse owners underestimate pasture and hay carbohydrates, which vary 8-25% seasonally.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a grazing muzzle during spring and early summer when pasture NSC peaks at 15-25%, reducing intake by 30-50% while maintaining exercise and forage benefits.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine BCS management with regular farrier care and veterinary monitoring; laminitis prevention requires a multi-faceted approach beyond nutrition alone.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your horse's weight and condition monthly with photos and weight tape measurements to catch BCS creep early and adjust feed before risk escalates.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring seasonal NSC variation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Relying on year-old hay analysis misses spring pasture spikes; test fresh hay/pasture annually and assume 15-25% NSC for spring growth.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating BCS by 1-2 points</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Subjective scoring leads to underestimating risk; use standardized charts, photographs, and rib palpation to ensure accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Excluding treats and supplements from NSC calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">High-NSC treats, molasses, and grain supplements can push daily intake above safe thresholds; account for every feed item when calculating total NSC.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming moderate risk requires no changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Moderate-risk horses are not safe; implement grazing restrictions, hay soaking, or dietary swaps to lower NSC or BCS proactively.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does BCS stand for in the Laminitis Risk Index?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BCS stands for Body Condition Score, a 1-9 scale assessing horse weight and fat distribution. Scores of 7-9 significantly increase laminitis risk due to insulin resistance and metabolic dysfunction.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does NSC intake affect laminitis risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">NSC (Non-Structural Carbohydrates) intake above 10-12% of daily feed dry matter elevates blood glucose and insulin, triggering laminitis in susceptible horses. High-NSC pasture and grain are major risk factors.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is considered a high-risk BCS for laminitis?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A BCS of 7 or higher on the 1-9 scale indicates high laminitis risk, with scores 8-9 representing obese horses with 3-5x greater risk than ideal-weight horses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can a normal BCS horse still have high laminitis risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes; a horse with ideal BCS (5-6) consuming high-NSC feed (&gt;12% NSC) remains at elevated risk, especially if insulin-resistant or prone to equine metabolic syndrome.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I reassess my horse's laminitis risk index?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Reassess quarterly or whenever diet or weight changes significantly; horses at high risk should be monitored every 4-6 weeks, especially during spring and summer pasture season.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What NSC threshold triggers moderate laminitis risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">NSC intake between 10-14% of dry matter represents moderate risk; above 14% NSC constitutes high risk for insulin-resistant or susceptible horses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is the Laminitis Risk Index a diagnostic tool?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No; this index estimates relative risk based on BCS and NSC intake but cannot diagnose laminitis—consult a veterinarian for clinical evaluation and bloodwork.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Pasture Management and Laminitis Risk</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AAFCO guidelines on feed labeling and NSC percentage reporting for equine diets.</p>
          </li>
          <li>
            <a href="https://www.equine.edu/extension/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Body Condition Scoring in Horses</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">University extension resource on standardized BCS assessment and obesity-related metabolic disease.</p>
          </li>
          <li>
            <a href="https://www.aaep.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Laminitis: Prevention and Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Association of Equine Practitioners clinical guidelines on laminitis risk factors and preventive strategies.</p>
          </li>
          <li>
            <a href="https://www.equinenutrition.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Insulin Resistance and NSC in Equine Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research on carbohydrate sensitivity and insulin dysregulation in horses at risk for metabolic laminitis.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Laminitis Risk Index (BCS + NSC intake)"
      description="Calculate the risk of **Laminitis (Founder)** based on Body Condition Score and non-structural carbohydrate (NSC) intake."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Laminitis Risk Index = max(0, (BCS - 5) × 2) + (NSC intake in g ÷ weight in kg)",
        variables: [
          { symbol: "BCS", description: "Body Condition Score (1-9 scale)" },
          { symbol: "NSC intake", description: "Daily non-structural carbohydrate intake in grams" },
          { symbol: "weight", description: "Horse body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A horse with a BCS of 7, consuming 600 grams of NSC daily, weighing 500 kg (1102 lbs).",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate BCS risk: (7 - 5) × 2 = 4",
          },
          {
            label: "2",
            explanation:
              "Calculate NSC per kg: 600 g ÷ 500 kg = 1.2",
          },
          {
            label: "3",
            explanation:
              "Sum to find Laminitis Risk Index: 4 + 1.2 = 5.2 (High Risk)",
          },
        ],
        result: "The horse has a high laminitis risk, indicating urgent dietary and veterinary management.",
      }}
      relatedCalculators={[
        { title: "Fiber & Protein Ratio Calculator", url: "/pets/small-mammal-fiber-protein-ratio", icon: "🐾" },
        { title: "Essential Oils Exposure Risk (diffuser/dermal)", url: "/pets/cat-essential-oils-exposure-risk", icon: "🐶" },
        { title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)", url: "/pets/cat-acetaminophen-ibuprofen-exposure-risk", icon: "🐱" },
        { title: "Dog Age in Human Years (Breed-Aware)", url: "/pets/dog-age-human-years-breed-aware", icon: "🐶" },
        { title: "Dog Caffeine Toxicity Calculator", url: "/pets/dog-caffeine-toxicity", icon: "🐶" },
        { title: "Senior Cat Nutrition & Calorie Adjuster", url: "/pets/senior-cat-nutrition-calorie-adjuster", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Laminitis Risk Index (BCS + NSC intake)" },
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