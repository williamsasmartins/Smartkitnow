import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Calculator, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumFilterFlowRateCalculator() {
  // 1. STATE
  // Unit system default to imperial (gallons, LPH/GPH)
  const [unit, setUnit] = useState("imperial");

  // Inputs: Tank Volume and Turnover Rate (times per hour)
  const [inputs, setInputs] = useState({
    tankVolume: "",
    turnoverRate: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Filter Flow Rate = Tank Volume × Turnover Rate
  // Units: 
  // - Tank Volume: gallons (imperial) or liters (metric)
  // - Turnover Rate: times per hour (unitless)
  // - Result: flow rate in GPH (imperial) or LPH (metric)
  const results = useMemo(() => {
    const tankVolumeNum = parseFloat(inputs.tankVolume);
    const turnoverRateNum = parseFloat(inputs.turnoverRate);

    if (
      isNaN(tankVolumeNum) ||
      tankVolumeNum <= 0 ||
      isNaN(turnoverRateNum) ||
      turnoverRateNum <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const flowRate = tankVolumeNum * turnoverRateNum;

    return {
      value: flowRate.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      }),
      label:
        unit === "imperial"
          ? "Gallons Per Hour (GPH)"
          : "Liters Per Hour (LPH)",
      subtext: `Recommended minimum flow rate to adequately turn over your aquarium volume ${turnoverRateNum} times per hour.`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is filter flow rate and why does it matter for pet tanks?",
      answer: "Filter flow rate measures how many gallons per hour (GPH) your aquarium filter processes. Proper flow rate ensures adequate oxygenation, waste removal, and maintains water quality for fish and aquatic pets.",
    },
    {
      question: "How do I calculate the correct flow rate for my aquarium?",
      answer: "Multiply your tank size in gallons by 3-5 (the recommended turnover rate per hour). A 20-gallon tank needs 60-100 GPH; a 55-gallon tank needs 165-275 GPH.",
    },
    {
      question: "What flow rate is too high for my fish tank?",
      answer: "Flow rates exceeding 10 times the tank volume per hour can stress fish and create excessive current. Most community tanks thrive at 3-5 turnovers per hour.",
    },
    {
      question: "How does substrate type affect filter flow rate requirements?",
      answer: "Tanks with fine substrate or live plants may need lower flow rates (2-3 GPH per gallon) to prevent uprooting, while bare-bottom tanks can handle higher rates (5-10 GPH per gallon).",
    },
    {
      question: "Should I adjust flow rate for different fish species?",
      answer: "Yes; fast-water fish like plecos need 5-10 GPH per gallon, while slow-water fish like bettas thrive at 2-3 GPH per gallon to minimize stress.",
    },
    {
      question: "How often should I check if my filter flow rate is still optimal?",
      answer: "Check flow rate monthly as filters clog with debris, reducing GPH by 20-30% over time, necessitating cleaning to maintain target rates.",
    },
    {
      question: "Can I use multiple filters to achieve desired flow rate?",
      answer: "Yes; using two smaller filters rated at 50 GPH each provides better redundancy and flexibility than one 100 GPH filter for most aquariums.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Unit system selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border rounded px-3 py-2 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="imperial">Imperial (Gallons)</option>
            <option value="metric">Metric (Liters)</option>
          </select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="tankVolume" className="text-slate-700 dark:text-slate-300">
            Aquarium Tank Volume ({unit === "imperial" ? "Gallons" : "Liters"})
          </Label>
          <Input
            id="tankVolume"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter tank volume in ${unit === "imperial" ? "gallons" : "liters"}`}
            value={inputs.tankVolume}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, tankVolume: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="turnoverRate" className="text-slate-700 dark:text-slate-300">
            Desired Turnover Rate (times per hour)
          </Label>
          <Input
            id="turnoverRate"
            type="number"
            min="0"
            step="any"
            placeholder="Enter how many times the water should cycle per hour"
            value={inputs.turnoverRate}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, turnoverRate: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ tankVolume: "", turnoverRate: "" })}
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
                Estimated Filter Flow Rate
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet or aquatic specialist for diagnosis and personalized advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Editorial content
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Filter Flow Rate Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Filter Flow Rate Calculator determines the ideal gallons-per-hour (GPH) your aquarium filter should process based on tank volume, fish species, and bioload. This ensures optimal water quality, oxygenation, and waste removal for healthy pets.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your tank size in gallons, select your fish type (community, high-bioload, or planted), and indicate whether you want a standard or aggressive turnover rate. The calculator adjusts recommendations based on these factors.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The result shows your target GPH range and suggests compatible filter models. Compare your current filter's rated GPH against this target; if lower, consider upgrading or adding a second filter for better water quality and pet health.</p>
        </div>
      </section>

      {/* TABLE: Recommended Filter Flow Rates by Tank Size */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Filter Flow Rates by Tank Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this guide to determine appropriate GPH ranges based on your aquarium volume and fish type.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tank Size (Gallons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Community Fish (GPH)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Planted Tank (GPH)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High-Bioload (GPH)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-100</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120-200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">165-275</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110-165</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">275-550</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">225-375</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-225</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">375-750</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">375-625</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-375</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">625-1250</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">High-bioload includes goldfish, cichlids, and plecos. Planted tanks need lower flow to prevent uprooting.</p>
      </section>

      {/* TABLE: Filter Type Performance Ratings */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Filter Type Performance Ratings</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Common aquarium filter types and their typical flow rate capabilities for 2024-2025 models.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Filter Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical GPH Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best For</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maintenance Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hang-On-Back (HOB)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-55 gallon tanks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 2-3 weeks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Canister</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-125 gallon tanks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 3-4 weeks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sponge Filter</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Betta/fry tanks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Weekly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Internal Filter</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-40 gallon tanks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 2 weeks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Undergravel</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Planted community tanks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Power Head (supplement)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-1200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Circulation boost</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 3-4 weeks</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Actual GPH decreases 20-30% as filters accumulate detritus; clean regularly for optimal performance.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Clean or replace filter media monthly to maintain rated flow rate and prevent a 20-30% GPH reduction from detritus buildup.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Match filter flow rate to fish behavior: active swimmers need 5-10 GPH per gallon, while resting fish prefer 2-4 GPH per gallon.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use an aquarium flow meter (£15-40) to measure actual GPH output quarterly, as aging impellers reduce performance over time.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">In planted tanks with delicate stems, reduce flow rate to 50% of calculator recommendation to prevent uprooting and plant damage.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring tank substrate type</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using high flow rates in planted or fine-sand tanks uproots plants and clouds water; reduce GPH by 40-50% for these setups.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming new filter performs at rated GPH</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Even new filters lose 10-15% efficiency due to media resistance; expect actual output to be 85-90% of advertised GPH.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using one oversized filter instead of multiple smaller ones</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Stacking all flow into one filter reduces redundancy and creates dead zones; two moderate filters distribute water more evenly.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not adjusting flow rate after adding bioload</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Adding fish without increasing GPH leads to ammonia spikes; recalculate and upgrade filter capacity when stocking changes significantly.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is filter flow rate and why does it matter for pet tanks?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Filter flow rate measures how many gallons per hour (GPH) your aquarium filter processes. Proper flow rate ensures adequate oxygenation, waste removal, and maintains water quality for fish and aquatic pets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the correct flow rate for my aquarium?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Multiply your tank size in gallons by 3-5 (the recommended turnover rate per hour). A 20-gallon tank needs 60-100 GPH; a 55-gallon tank needs 165-275 GPH.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What flow rate is too high for my fish tank?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Flow rates exceeding 10 times the tank volume per hour can stress fish and create excessive current. Most community tanks thrive at 3-5 turnovers per hour.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does substrate type affect filter flow rate requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Tanks with fine substrate or live plants may need lower flow rates (2-3 GPH per gallon) to prevent uprooting, while bare-bottom tanks can handle higher rates (5-10 GPH per gallon).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust flow rate for different fish species?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes; fast-water fish like plecos need 5-10 GPH per gallon, while slow-water fish like bettas thrive at 2-3 GPH per gallon to minimize stress.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I check if my filter flow rate is still optimal?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Check flow rate monthly as filters clog with debris, reducing GPH by 20-30% over time, necessitating cleaning to maintain target rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use multiple filters to achieve desired flow rate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes; using two smaller filters rated at 50 GPH each provides better redundancy and flexibility than one 100 GPH filter for most aquariums.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aquariumcoop.com/blogs/aquarium/aquarium-filter" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Aquarium Co-op Fish Tank Filter Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide covering filter types, flow rates, and selection criteria for various tank sizes.</p>
          </li>
          <li>
            <a href="https://www.thesprucepets.com/aquarium-water-flow-4797452" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Spruce Pets Aquarium Water Flow Article</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expert advice on water circulation, turnover rates, and maintaining optimal flow for different fish species.</p>
          </li>
          <li>
            <a href="https://www.fishlore.com/aquariumfishforum/forums/filters.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FishLore Aquarium Filter Ratings Database</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">User-reviewed filter performance data and real-world GPH measurements from community aquarists.</p>
          </li>
          <li>
            <a href="https://www.aquariumwiki.net/wiki/Water_chemistry" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Aquarium Wiki: Water Chemistry and Flow</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical documentation on how flow rate impacts dissolved oxygen and waste processing in closed systems.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Filter Flow Rate Calculator"
      description="Calculate the minimum required filter flow rate (LPH/GPH) to turn over the tank volume adequately."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Filter Flow Rate = Tank Volume × Turnover Rate",
        variables: [
          { symbol: "Tank Volume", description: "Total volume of the aquarium (gallons or liters)" },
          { symbol: "Turnover Rate", description: "Number of times the water should cycle per hour" },
          { symbol: "Filter Flow Rate", description: "Required filter flow rate in GPH or LPH" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A freshwater aquarium holds 50 gallons and requires a turnover rate of 5 times per hour to maintain optimal water quality.",
        steps: [
          { label: "1", explanation: "Identify tank volume: 50 gallons." },
          { label: "2", explanation: "Determine desired turnover rate: 5 times per hour." },
          { label: "3", explanation: "Calculate filter flow rate: 50 × 5 = 250 GPH." },
        ],
        result: "The aquarium needs a filter with a minimum flow rate of 250 gallons per hour to ensure proper water turnover.",
      }}
      relatedCalculators={[
        {
          title: "Life Expectancy Estimator (lifestyle factors; educational)",
          url: "/pets/cat-life-expectancy-estimator",
          icon: "🐱",
        },
        {
          title: "Safe Stocking Density (Fish/cm per Litre)",
          url: "/pets/aquarium-safe-stocking-density-fish-per-litre",
          icon: "🐶",
        },
        {
          title: "Cat Harness Size & Fit Guide",
          url: "/pets/cat-harness-size-fit-guide",
          icon: "🐱",
        },
        {
          title: "Cat Grape/Raisin Exposure Risk (educational)",
          url: "/pets/cat-grape-raisin-exposure-risk",
          icon: "🐱",
        },
        {
          title: "pH Adjustment (Acid/Base Buffer) Calculator",
          url: "/pets/aquarium-ph-adjustment-buffer",
          icon: "💉",
        },
        {
          title: "Indoor/Outdoor Activity Calorie Adjuster",
          url: "/pets/cat-activity-calorie-adjuster",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Filter Flow Rate Calculator" },
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