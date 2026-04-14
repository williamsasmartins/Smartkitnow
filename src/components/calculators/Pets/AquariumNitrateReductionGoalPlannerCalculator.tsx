import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumNitrateReductionGoalPlannerCalculator() {
  // 1. STATE
  // Unit system is not relevant here, so removed unit selector and state.
  
  // Inputs: current nitrate ppm, target nitrate ppm
  const [inputs, setInputs] = useState({
    currentPpm: "",
    targetPpm: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Water Change % = ((Current ppm - Target ppm) / Current ppm) * 100
  // Result capped between 0 and 100%
  const results = useMemo(() => {
    const current = parseFloat(inputs.currentPpm);
    const target = parseFloat(inputs.targetPpm);

    if (
      isNaN(current) ||
      isNaN(target) ||
      current <= 0 ||
      target < 0 ||
      target >= current
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          target >= current
            ? "Target nitrate must be less than current nitrate for reduction."
            : "Please enter valid positive numbers for nitrate levels.",
      };
    }

    const waterChangePercent = ((current - target) / current) * 100;
    const rounded = Math.round(waterChangePercent * 10) / 10;

    return {
      value: rounded,
      label: "Water Change Percentage (%)",
      subtext:
        "Percentage of aquarium water to change to reach target nitrate level.",
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What ppm nitrate level is safe for my aquarium?",
      answer: "Most freshwater aquariums should maintain nitrate levels below 20 ppm, while saltwater reef tanks require &lt;10 ppm for corals. Levels above 40 ppm become toxic to most fish and invertebrates.",
    },
    {
      question: "How does this calculator determine required water change percentage?",
      answer: "The calculator uses the formula: Water Change % = ((Current Nitrate - Target Nitrate) / Current Nitrate) × 100 to show what percentage of tank water needs replacement to reach your goal.",
    },
    {
      question: "Can I lower nitrates without doing water changes?",
      answer: "While plants and live rock absorb some nitrates, water changes are the most reliable method. Biological filtration only converts fish waste to nitrate, not out of the system.",
    },
    {
      question: "What's the difference between ppm and mg/L for nitrates?",
      answer: "For practical purposes, ppm (parts per million) and mg/L are equivalent when measuring nitrates in freshwater; 1 ppm = 1 mg/L in aquarium contexts.",
    },
    {
      question: "How often should I test nitrate levels?",
      answer: "Test weekly during the first month of establishing a tank, then bi-weekly for established tanks, and weekly again if nitrates exceed 20 ppm.",
    },
    {
      question: "Will doing one large water change hurt my fish?",
      answer: "Water changes above 50% in one day can shock fish by altering pH and temperature rapidly; spread large reductions across 2-3 days using 25-30% changes instead.",
    },
    {
      question: "What if my tap water already contains nitrates?",
      answer: "Test your tap water with a nitrate kit; if it contains 5+ ppm, account for this in your calculations by using (tap nitrate level) as your baseline instead of zero.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="currentPpm" className="text-slate-700 dark:text-slate-300">
              Current Nitrate Level (ppm)
            </Label>
            <Input
              id="currentPpm"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 40"
              value={inputs.currentPpm}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, currentPpm: e.target.value }))
              }
              aria-describedby="currentPpmHelp"
            />
            <p id="currentPpmHelp" className="text-xs text-slate-400 mt-1">
              Enter the current nitrate concentration in your aquarium water.
            </p>
          </div>
          <div>
            <Label htmlFor="targetPpm" className="text-slate-700 dark:text-slate-300">
              Target Nitrate Level (ppm)
            </Label>
            <Input
              id="targetPpm"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 10"
              value={inputs.targetPpm}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, targetPpm: e.target.value }))
              }
              aria-describedby="targetPpmHelp"
            />
            <p id="targetPpmHelp" className="text-xs text-slate-400 mt-1">
              Enter the desired safe nitrate concentration after water change.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo on inputs change
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ currentPpm: "", targetPpm: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}%</p>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 5. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Nitrate Reduction Goal Planner (ppm → water change %)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps aquarists determine the exact water change percentage needed to reduce current nitrate levels to a safe target level. Simply input your current nitrate reading (measured with a test kit) and your desired target ppm, and the tool calculates the percentage of tank water you must replace.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include your current nitrate concentration in ppm (test with a quality kit like API or Salifert), your target nitrate level based on tank type, and optionally your tap water's baseline nitrate content. Accuracy depends on recent test results, so test your tank and source water before using the calculator.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The result shows the minimum water change percentage needed in a single change. If the number exceeds 50%, consider splitting the change across multiple days to avoid shocking fish with rapid pH and temperature swings. Monitor nitrate levels 24 hours after your water change to confirm effectiveness.</p>
        </div>
      </section>

      {/* TABLE: Nitrate Safety Benchmarks by Aquarium Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Nitrate Safety Benchmarks by Aquarium Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Safe nitrate ranges vary significantly based on aquarium inhabitants and system maturity.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Aquarium Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safe Range (ppm)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Action Level (ppm)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Emergency Level (ppm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Freshwater Community</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;40</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Planted Freshwater</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;50</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Saltwater Fish Only</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;40</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Saltwater Reef (SPS/LPS)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;20</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Goldfish/Cichlids</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;80</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Action Level indicates water changes are recommended; Emergency Level requires immediate intervention.</p>
      </section>

      {/* TABLE: Water Change Reduction Results by Starting Nitrate */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Water Change Reduction Results by Starting Nitrate</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Quick reference showing final nitrate levels after specific water change percentages.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Starting Nitrate (ppm)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">25% Water Change</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">50% Water Change</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">75% Water Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">80 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 ppm</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15 ppm</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 ppm</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 ppm</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes tap water has 0 ppm nitrate; adjust if your source water contains nitrates.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always test your tap water's nitrate level separately; some municipal supplies contain 10-20 ppm, which affects your reduction calculations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Perform water changes during feeding time when fish are active and less stressed by water movement and temperature shifts.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a gravel vacuum during water changes to remove accumulated detritus where nitrate-producing bacteria thrive.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Reduce nitrate buildup between changes by cutting feeding amounts by 10-20% and increasing plant mass in planted tanks.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Source Water Nitrates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to account for nitrates already in tap water means your actual reduction will be less than calculated, leaving levels higher than expected.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Performing 100% Water Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Replacing all water at once removes beneficial bacteria and crashes the nitrogen cycle, even if it temporarily zeros nitrates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Testing at Wrong Times</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Testing immediately after feeding or water changes gives inaccurate readings; test 24 hours after maintenance for true nitrate levels.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Addressing Root Causes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Doing frequent water changes without reducing overstocking or overfeeding means nitrates will spike again within days.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What ppm nitrate level is safe for my aquarium?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most freshwater aquariums should maintain nitrate levels below 20 ppm, while saltwater reef tanks require &lt;10 ppm for corals. Levels above 40 ppm become toxic to most fish and invertebrates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does this calculator determine required water change percentage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses the formula: Water Change % = ((Current Nitrate - Target Nitrate) / Current Nitrate) × 100 to show what percentage of tank water needs replacement to reach your goal.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I lower nitrates without doing water changes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While plants and live rock absorb some nitrates, water changes are the most reliable method. Biological filtration only converts fish waste to nitrate, not out of the system.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between ppm and mg/L for nitrates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For practical purposes, ppm (parts per million) and mg/L are equivalent when measuring nitrates in freshwater; 1 ppm = 1 mg/L in aquarium contexts.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I test nitrate levels?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Test weekly during the first month of establishing a tank, then bi-weekly for established tanks, and weekly again if nitrates exceed 20 ppm.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Will doing one large water change hurt my fish?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Water changes above 50% in one day can shock fish by altering pH and temperature rapidly; spread large reductions across 2-3 days using 25-30% changes instead.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my tap water already contains nitrates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Test your tap water with a nitrate kit; if it contains 5+ ppm, account for this in your calculations by using (tap nitrate level) as your baseline instead of zero.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.epa.gov/groundwater-and-drinking-water/drinking-water-standards-health-advisories" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Drinking Water Standards for Nitrate</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal drinking water data showing nitrate toxicity thresholds applicable to aquarium safety.</p>
          </li>
          <li>
            <a href="https://www.americanaquariumproducts.com/articles/page13.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Aquarium Products - Water Quality Testing</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide on nitrate testing methods and safe parameter ranges for aquarium types.</p>
          </li>
          <li>
            <a href="https://www.aquariumwiki.net/Nitrogen_Cycle" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Aquarium Wiki - Nitrogen Cycle</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">In-depth explanation of how nitrate accumulates and why water changes are essential for removal.</p>
          </li>
          <li>
            <a href="https://www.reefkeeping.com/issues/2003-12/rhf/feature/index.php" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Reef Aquarium Research - Coral Health Parameters</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scientific data on nitrate thresholds for SPS and LPS coral survival and growth.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Nitrate Reduction Goal Planner (ppm → water change %)"
      description="Determine the necessary water change percentage to reduce nitrate levels from the current reading to a safe target level (ppm)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Water Change % = ((Current ppm - Target ppm) / Current ppm) × 100",
        variables: [
          { symbol: "Current ppm", description: "Current nitrate concentration in ppm" },
          { symbol: "Target ppm", description: "Desired nitrate concentration in ppm after water change" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "An aquarium has a current nitrate level of 40 ppm, and the aquarist wants to reduce it to 10 ppm to ensure fish health.",
        steps: [
          {
            label: "1",
            explanation:
              "Input the current nitrate level (40 ppm) and the target nitrate level (10 ppm) into the calculator.",
          },
          {
            label: "2",
            explanation:
              "Calculate the water change percentage using the formula: ((40 - 10) / 40) × 100 = 75%.",
          },
          {
            label: "3",
            explanation:
              "Perform a 75% water change to reduce the nitrate concentration from 40 ppm to approximately 10 ppm.",
          },
        ],
        result: "Recommended water change percentage: 75%",
      }}
      relatedCalculators={[
        {
          title: "Life Expectancy Estimator (lifestyle factors; educational)",
          url: "/pets/cat-life-expectancy-estimator",
          icon: "🐱",
        },
        {
          title: "Horse Water Intake by Temperature & Weight",
          url: "/pets/horse-water-intake-temperature-weight",
          icon: "🐎",
        },
        {
          title: "Senior Cat Care Readiness Checklist (scored helper)",
          url: "/pets/senior-cat-care-readiness-checklist",
          icon: "🐱",
        },
        {
          title: "Cat Chocolate Toxicity Calculator",
          url: "/pets/cat-chocolate-toxicity",
          icon: "🐱",
        },
        {
          title: "Essential Oils Exposure Risk (diffuser/dermal)",
          url: "/pets/cat-essential-oils-exposure-risk",
          icon: "💉",
        },
        {
          title: "Kitten Adult Weight Predictor",
          url: "/pets/kitten-adult-weight-predictor",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Nitrate Reduction Goal Planner (ppm → water change %)" },
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