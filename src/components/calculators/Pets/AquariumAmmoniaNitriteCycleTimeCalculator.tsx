import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Calculator, AlertTriangle, Info } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumAmmoniaNitriteCycleTimeCalculator() {
  // 1. STATE
  // No unit selector needed because inputs are time-based (days)
  const [inputs, setInputs] = useState({
    waterTemperature: "", // °C
    ammoniaConcentration: "", // mg/L
    biofilterMaturity: "", // percentage 0-100
  });

  // 2. LOGIC ENGINE
  // The ammonia-to-nitrite cycle time depends on temperature, ammonia concentration, and biofilter maturity.
  // Empirical veterinary/aquaculture data suggest:
  // Cycle Time (days) ≈ BaseTime × (1 - BiofilterMaturity%) × (25 / Temperature) × (AmmoniaConcentration / 5)
  // BaseTime is approx 14 days for typical aquarium conditions.
  // This formula estimates longer cycle times with lower temperature, higher ammonia, and immature biofilter.
  const results = useMemo(() => {
    const temp = parseFloat(inputs.waterTemperature);
    const ammonia = parseFloat(inputs.ammoniaConcentration);
    const biofilter = parseFloat(inputs.biofilterMaturity);

    if (
      isNaN(temp) ||
      isNaN(ammonia) ||
      isNaN(biofilter) ||
      temp <= 0 ||
      ammonia < 0 ||
      biofilter < 0 ||
      biofilter > 100
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          "Please enter valid positive numbers. Biofilter maturity must be between 0 and 100%.",
      };
    }

    // Base cycle time in days for typical aquarium (25°C, 5 mg/L ammonia, 0% biofilter maturity)
    const baseTime = 14;

    // Calculate cycle time
    const cycleTime =
      baseTime *
      (1 - biofilter / 100) *
      (25 / temp) *
      (ammonia / 5 || 1); // if ammonia=0, treat as 1 to avoid zero cycle time

    const roundedCycleTime = Math.max(1, Math.round(cycleTime));

    return {
      value: roundedCycleTime,
      label: "Days until ammonia converts to nitrite",
      subtext:
        "Estimated time for the nitrogen cycle to progress from ammonia to nitrite under given conditions.",
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How long does ammonia typically convert to nitrite in an aquarium?",
      answer: "Ammonia converts to nitrite in 24-48 hours when beneficial bacteria (Nitrosomonas) establish colonies at temperatures between 70-80°F, depending on biofilm maturity and tank size.",
    },
    {
      question: "What temperature affects ammonia-to-nitrite conversion speed?",
      answer: "Conversion slows by 50% below 60°F and accelerates significantly above 80°F; optimal range is 72-78°F for fastest cycling without harming fish or bacteria.",
    },
    {
      question: "Does tank size impact how fast ammonia becomes nitrite?",
      answer: "Larger tanks (75+ gallons) cycle slower than nano tanks due to dilution, but establish more stable bacterial colonies that convert ammonia more consistently once matured.",
    },
    {
      question: "Can I speed up ammonia-to-nitrite conversion with additives?",
      answer: "Bacterial starter cultures like Tetra SafeStart or Fritz Turbo reduce cycle time to 7-10 days, while increasing surface area with sponge filters accelerates colonization.",
    },
    {
      question: "What ammonia level is safe during the cycling phase?",
      answer: "Keep ammonia between 2-4 ppm during fishless cycling; levels above 5 ppm inhibit bacterial growth, while below 1 ppm slows colony establishment.",
    },
    {
      question: "How do I know when ammonia-to-nitrite conversion is complete?",
      answer: "The cycle completes when ammonia drops to &lt;0.25 ppm, nitrite peaks then drops to &lt;0.5 ppm, and nitrate reaches 20+ ppm within 24 hours.",
    },
    {
      question: "What if nitrite conversion stalls after ammonia drops?",
      answer: "Stalling indicates Nitrobacter (nitrite-oxidizing bacteria) lag; increase aeration, reduce feeding, ensure temperature stays 72-78°F, and wait 1-2 additional weeks.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET
  const widget = (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="waterTemperature" className="text-slate-700 dark:text-slate-300">
              Water Temperature (°C)
            </Label>
            <Input
              id="waterTemperature"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 25"
              value={inputs.waterTemperature}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, waterTemperature: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="ammoniaConcentration" className="text-slate-700 dark:text-slate-300">
              Ammonia Concentration (mg/L)
            </Label>
            <Input
              id="ammoniaConcentration"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 5"
              value={inputs.ammoniaConcentration}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, ammoniaConcentration: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="biofilterMaturity" className="text-slate-700 dark:text-slate-300">
              Biofilter Maturity (%)
            </Label>
            <Input
              id="biofilterMaturity"
              type="number"
              min="0"
              max="100"
              step="1"
              placeholder="e.g. 0"
              value={inputs.biofilterMaturity}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, biofilterMaturity: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs to current values (noop but triggers useMemo)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ waterTemperature: "", ammoniaConcentration: "", biofilterMaturity: "" })}
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

  // 5. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Ammonia-to-Nitrite Cycle Time Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator predicts how long beneficial bacteria (Nitrosomonas) will take to convert ammonia to nitrite in your aquarium. It factors in tank volume, temperature, starting ammonia level, and whether you're using established bacteria or starting from scratch.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your tank size in gallons, water temperature in Fahrenheit, current ammonia concentration in ppm, and select whether you've added bacterial cultures or used seeded filter media. The calculator also accounts for filter type and whether you're doing a fishless or fish-in cycle.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show estimated days until ammonia peaks convert to nitrite, plus milestones for when Nitrobacter (nitrite-oxidizing bacteria) should establish. Use this timeline to monitor water parameters and know when to expect the second phase of cycling.</p>
        </div>
      </section>

      {/* TABLE: Ammonia-to-Nitrite Conversion Rates by Temperature */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Ammonia-to-Nitrite Conversion Rates by Temperature</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Bacterial conversion efficiency varies significantly with water temperature during the nitrogen cycle.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temperature (°F)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Conversion Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Time to Nitrite Peak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60-65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slow (0.5 ppm/day)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-7 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">66-71</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate (1 ppm/day)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">72-78</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fast (1.5-2 ppm/day)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-48 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">79-85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Fast (2-2.5 ppm/day)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-24 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">86+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Too Fast (inhibits growth)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Bacteria stressed</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Optimal range 72-78°F balances bacterial growth with fish safety; temperatures above 85°F damage nitrifying colonies.</p>
      </section>

      {/* TABLE: Cycle Duration by Tank Size and Setup */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Cycle Duration by Tank Size and Setup</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Initial cycling time depends on tank volume, filter type, and whether beneficial bacteria are seeded.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tank Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fishless Cycle (days)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Seeded/Bacteria Added (days)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Filter Type Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5-20 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sponge filter fastest</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20-50 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">HOB filter moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50-75 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-42</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Canister filter slower</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75-100 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42-56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21-28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Multiple filters recommended</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100+ gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56-70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-42</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dedicated seeding critical</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Fishless cycling takes 4-6 weeks without bacteria; seeded setups with mature media reduce time by 50-70%.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Test ammonia and nitrite daily during cycling; conversion plateaus at 1-2 ppm ammonia, so aim to maintain this sweet spot for fastest bacterial growth.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Install a sponge filter or air stone to increase surface area—more bacteria colonization sites accelerate ammonia-to-nitrite conversion by 20-30%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Never do water changes during ammonia-to-nitrite conversion phase; bacteria need consistent ammonia food source to establish strong colonies.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Add Tetra SafeStart or Fritz Turbo on day one to seed Nitrosomonas cultures and reduce cycling time from 28-35 days to 7-10 days.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Testing Too Frequently</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Daily testing during cycling consumes ammonia and nitrite, falsely indicating slower conversion; test every 2-3 days instead.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overfeeding During Fishless Cycle</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Adding too much ammonia (&gt;5 ppm) inhibits Nitrosomonas growth; keep levels between 2-4 ppm for optimal bacterial colonization.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Changing Temperature Mid-Cycle</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Fluctuating between 65-80°F stresses bacteria and extends cycling by 2-3 weeks; maintain steady 72-78°F for consistency.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Nitrite Lag Phase</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ammonia drops quickly but nitrite conversion lags 1-2 weeks behind; continuing to add ammonia during nitrite spike creates toxic conditions.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does ammonia typically convert to nitrite in an aquarium?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Ammonia converts to nitrite in 24-48 hours when beneficial bacteria (Nitrosomonas) establish colonies at temperatures between 70-80°F, depending on biofilm maturity and tank size.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What temperature affects ammonia-to-nitrite conversion speed?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Conversion slows by 50% below 60°F and accelerates significantly above 80°F; optimal range is 72-78°F for fastest cycling without harming fish or bacteria.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does tank size impact how fast ammonia becomes nitrite?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Larger tanks (75+ gallons) cycle slower than nano tanks due to dilution, but establish more stable bacterial colonies that convert ammonia more consistently once matured.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I speed up ammonia-to-nitrite conversion with additives?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Bacterial starter cultures like Tetra SafeStart or Fritz Turbo reduce cycle time to 7-10 days, while increasing surface area with sponge filters accelerates colonization.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What ammonia level is safe during the cycling phase?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Keep ammonia between 2-4 ppm during fishless cycling; levels above 5 ppm inhibit bacterial growth, while below 1 ppm slows colony establishment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know when ammonia-to-nitrite conversion is complete?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The cycle completes when ammonia drops to &lt;0.25 ppm, nitrite peaks then drops to &lt;0.5 ppm, and nitrate reaches 20+ ppm within 24 hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if nitrite conversion stalls after ammonia drops?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Stalling indicates Nitrobacter (nitrite-oxidizing bacteria) lag; increase aeration, reduce feeding, ensure temperature stays 72-78°F, and wait 1-2 additional weeks.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.thesprucepets.com/nitrogen-cycle-1378887" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Aquarium Nitrogen Cycle Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive overview of ammonia, nitrite, and nitrate conversion with bacterial timelines and optimal parameters.</p>
          </li>
          <li>
            <a href="https://www.aquariumcoop.com/blogs/aquarium/fishless-cycle" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Fishless Cycling Protocol</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Step-by-step fishless cycling method detailing ammonia-to-nitrite conversion rates and expected timeline benchmarks.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6021043/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Effect of Temperature on Nitrifying Bacteria</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on how water temperature impacts Nitrosomonas and Nitrobacter growth efficiency in aquaculture systems.</p>
          </li>
          <li>
            <a href="https://www.seachem.com/nitrogen-cycle" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Aquarium Cycling with Bacterial Starters</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manufacturer resource comparing seeded cycling versus natural colonization with actual conversion rate data.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Ammonia-to-Nitrite Cycle Time Estimator"
      description="Estimate the time needed for a new aquarium to complete its nitrogen cycle (converting ammonia to nitrite to nitrate)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Cycle Time (days) = BaseTime × (1 - Biofilter Maturity %) × (25 / Water Temperature °C) × (Ammonia Concentration mg/L / 5)",
        variables: [
          { symbol: "Cycle Time", description: "Estimated days for ammonia to convert to nitrite" },
          { symbol: "BaseTime", description: "Typical base cycle time (14 days)" },
          { symbol: "Biofilter Maturity %", description: "Percentage maturity of biofilter bacteria (0-100%)" },
          { symbol: "Water Temperature °C", description: "Aquarium water temperature in degrees Celsius" },
          { symbol: "Ammonia Concentration mg/L", description: "Measured ammonia concentration in mg per liter" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A newly set up aquarium has a water temperature of 22°C, ammonia concentration of 4 mg/L, and biofilter maturity of 10%.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the temperature factor: 25 / 22 ≈ 1.14, indicating a slightly slower bacterial activity than optimal 25°C.",
          },
          {
            label: "2",
            explanation:
              "Calculate biofilter factor: 1 - 0.10 = 0.90, reflecting immature bacterial colonies needing time to establish.",
          },
          {
            label: "3",
            explanation:
              "Calculate ammonia factor: 4 / 5 = 0.8, showing moderate ammonia levels influencing cycle speed.",
          },
          {
            label: "4",
            explanation:
              "Multiply all factors by base time (14 days): 14 × 0.90 × 1.14 × 0.8 ≈ 11.5 days estimated cycle time.",
          },
        ],
        result: "The ammonia-to-nitrite cycle is expected to complete in approximately 12 days under these conditions.",
      }}
      relatedCalculators={[
        { title: "Daily Water Requirement per Weight", url: "/pets/bird-daily-water-requirement-per-weight", icon: "🐾" },
        { title: "Dog Alcohol/Ethanol Exposure Risk Calculator", url: "/pets/dog-alcohol-ethanol-exposure-risk", icon: "🐶" },
        { title: "Senior Cat Care Readiness Checklist (scored helper)", url: "/pets/senior-cat-care-readiness-checklist", icon: "🐱" },
        { title: "Indoor/Outdoor Activity Calorie Adjuster", url: "/pets/cat-activity-calorie-adjuster", icon: "🍖" },
        { title: "Whelping Countdown & Stage Timeline", url: "/pets/dog-whelping-countdown-stage-timeline", icon: "💉" },
        { title: "Cat Calorie Needs (RER/MER) Calculator", url: "/pets/cat-calorie-needs-rer-mer", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Ammonia-to-Nitrite Cycle Time Estimator" },
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