import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumWaterChangeVolumePlannerCalculator() {
  // 1. STATE
  // Unit system is relevant because volume input can be in gallons or liters
  const [unit, setUnit] = useState("imperial");

  // Inputs: Current tank volume, current nitrate level, target nitrate level
  const [inputs, setInputs] = useState({
    tankVolume: "",
    currentNitrate: "",
    targetNitrate: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const tankVolume = parseFloat(inputs.tankVolume);
    const currentNitrate = parseFloat(inputs.currentNitrate);
    const targetNitrate = parseFloat(inputs.targetNitrate);

    if (
      isNaN(tankVolume) ||
      isNaN(currentNitrate) ||
      isNaN(targetNitrate) ||
      tankVolume <= 0 ||
      currentNitrate <= 0 ||
      targetNitrate < 0 ||
      targetNitrate >= currentNitrate
    ) {
      return {
        value: 0,
        label: "Invalid input values",
        subtext: "Please ensure all inputs are positive and target nitrate is less than current nitrate.",
        warning: null,
      };
    }

    // Formula: Volume to change = Tank Volume * (1 - Target Nitrate / Current Nitrate)
    // This calculates the volume of water to replace to achieve the target nitrate concentration.
    const volumeChange = tankVolume * (1 - targetNitrate / currentNitrate);

    // Round to 2 decimals
    const roundedVolumeChange = Math.round(volumeChange * 100) / 100;

    return {
      value: roundedVolumeChange,
      label:
        unit === "imperial"
          ? "Gallons of water to change"
          : "Liters of water to change",
      subtext:
        "This volume will reduce nitrate concentration to your target level.",
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How do I calculate the correct water change volume for my aquarium?",
      answer: "Enter your tank size in gallons, current water condition (nitrate level), and desired water quality improvement. The calculator divides recommended change percentage by tank volume to show exact gallons needed.",
    },
    {
      question: "What percentage of water should I change weekly?",
      answer: "Most freshwater tanks need 25–30% weekly changes; heavily stocked or high-bioload tanks may need 40–50%, while lightly stocked tanks can manage 20% changes.",
    },
    {
      question: "Does tank size affect how much water I should change?",
      answer: "Yes—larger tanks dilute waste more effectively, so a 100-gallon tank may need only 25% changes while a 20-gallon requires 30–40% to maintain similar water quality.",
    },
    {
      question: "Should I adjust water change volume based on fish type?",
      answer: "Absolutely; goldfish and plecos produce more waste and need 40–50% weekly changes, while bettas and smaller fish may thrive on 20–25% changes.",
    },
    {
      question: "How often should I perform water changes of the calculated volume?",
      answer: "Most aquariums benefit from one full change weekly at the calculated volume, though heavily populated tanks may require two smaller changes per week.",
    },
    {
      question: "Can I use this calculator for saltwater or brackish tanks?",
      answer: "Yes, but saltwater reef tanks often need smaller, more frequent changes (10–20% twice weekly) due to sensitive chemistry, while fish-only saltwater can follow freshwater guidelines.",
    },
    {
      question: "What if my nitrate levels are very high?",
      answer: "If nitrates exceed 80 ppm, perform the calculated change, then retest after 3 days and repeat; you may temporarily need larger or more frequent changes until levels drop below 40 ppm.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-100"
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
            Current Tank Volume ({unit === "imperial" ? "Gallons" : "Liters"})
          </Label>
          <Input
            id="tankVolume"
            type="number"
            min="0"
            step="any"
            placeholder={unit === "imperial" ? "e.g. 50" : "e.g. 190"}
            value={inputs.tankVolume}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, tankVolume: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="currentNitrate" className="text-slate-700 dark:text-slate-300">
            Current Nitrate Level (ppm)
          </Label>
          <Input
            id="currentNitrate"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 40"
            value={inputs.currentNitrate}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, currentNitrate: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="targetNitrate" className="text-slate-700 dark:text-slate-300">
            Target Nitrate Level (ppm)
          </Label>
          <Input
            id="targetNitrate"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 20"
            value={inputs.targetNitrate}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, targetNitrate: e.target.value }))
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
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ tankVolume: "", currentNitrate: "", targetNitrate: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Water Change Volume Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Water Change Volume Planner calculates the exact amount of water to remove and replace during maintenance, based on tank size, fish bioload, and water quality parameters. This ensures your aquarium stays healthy without unnecessary water waste or incomplete waste removal.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your total tank volume in gallons, select your tank type (freshwater, saltwater, planted, or high-bioload), and optionally enter current nitrate or ammonia levels if you've tested your water. The calculator uses these factors to recommend a weekly change percentage and volume.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The result shows gallons to change per week, frequency recommendations, and next testing date. Use this guidance to maintain nitrate levels below 40 ppm and sustain a stable, healthy aquatic environment for your fish and plants.</p>
        </div>
      </section>

      {/* TABLE: Recommended Weekly Water Change Volumes by Tank Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Weekly Water Change Volumes by Tank Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use these benchmarks with your tank size to determine appropriate change percentages.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tank Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Stock Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weekly Change %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Change Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Freshwater Community</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once weekly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Goldfish/Plecos</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Any</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40–50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once or twice weekly</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Betta/Small Fish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Light</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once weekly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cichlid/High Bioload</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35–40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once to twice weekly</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Planted Tank</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once weekly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Saltwater Reef</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice weekly</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Adjust based on nitrate levels (target &lt;40 ppm) and filter capacity.</p>
      </section>

      {/* TABLE: Water Change Volume Examples by Tank Size */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Water Change Volume Examples by Tank Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Quick reference for common aquarium sizes at standard 25% and 40% change rates.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tank Size (gallons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">25% Change Volume</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">40% Change Volume</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">50% Change Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 gal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 gal</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 gal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.75 gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22 gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27.5 gal</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18.75 gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">37.5 gal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40 gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 gal</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These volumes assume standard percentage-based changes; adjust for bioload and test results.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always match your change volume to actual test results—rising nitrates mean you need larger or more frequent changes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a gravel vacuum during water changes to remove settled waste from the substrate, increasing overall tank health.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Temperature-match replacement water to your tank (within 2°C) to prevent stress and shock to fish.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Schedule water changes on the same day each week to build a consistent maintenance habit and monitor trends.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Tank Bioload</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using a generic 25% change for all tanks ignores stocking density; heavily populated tanks need 40–50% changes to prevent ammonia and nitrate spikes.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Changing Water Too Frequently</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Over-changing water removes beneficial bacteria and destabilizes the nitrogen cycle, leading to ammonia swings even with proper filtration.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Testing Before Calculating</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Skipping nitrate or ammonia tests means your calculated volume may be too small or too large for your actual water chemistry needs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Tap Water Without Dechlorinator</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Chlorine in municipal tap water damages fish gills and kills beneficial bacteria; always treat replacement water with a dechlorinator before adding it.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the correct water change volume for my aquarium?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your tank size in gallons, current water condition (nitrate level), and desired water quality improvement. The calculator divides recommended change percentage by tank volume to show exact gallons needed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What percentage of water should I change weekly?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most freshwater tanks need 25–30% weekly changes; heavily stocked or high-bioload tanks may need 40–50%, while lightly stocked tanks can manage 20% changes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does tank size affect how much water I should change?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—larger tanks dilute waste more effectively, so a 100-gallon tank may need only 25% changes while a 20-gallon requires 30–40% to maintain similar water quality.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust water change volume based on fish type?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Absolutely; goldfish and plecos produce more waste and need 40–50% weekly changes, while bettas and smaller fish may thrive on 20–25% changes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I perform water changes of the calculated volume?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most aquariums benefit from one full change weekly at the calculated volume, though heavily populated tanks may require two smaller changes per week.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for saltwater or brackish tanks?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, but saltwater reef tanks often need smaller, more frequent changes (10–20% twice weekly) due to sensitive chemistry, while fish-only saltwater can follow freshwater guidelines.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my nitrate levels are very high?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If nitrates exceed 80 ppm, perform the calculated change, then retest after 3 days and repeat; you may temporarily need larger or more frequent changes until levels drop below 40 ppm.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aquariumcoop.com/blogs/aquarium/aquarium-water-change" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Aquarium Products: Water Change Frequency</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide on water change schedules, percentages, and best practices for freshwater and saltwater tanks.</p>
          </li>
          <li>
            <a href="https://www.fishkeepingworld.com/nitrogen-cycle/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FishKeeping World: Nitrogen Cycle and Water Quality</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Explains how nitrate accumulates, why regular water changes remove it, and target levels for different tank types.</p>
          </li>
          <li>
            <a href="https://www.thesprucepets.com/aquarium-maintenance-schedule-4797385" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Spruce Pets: Aquarium Maintenance Schedule</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Details tank-specific maintenance timelines, including water change volumes and testing intervals for various setups.</p>
          </li>
          <li>
            <a href="https://www.aquariumcoop.com/blogs/aquarium/aquarium-water-parameters" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Aquarium Co-op: Water Parameters and Fish Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Reference for safe ammonia, nitrite, nitrate, and pH ranges across freshwater, planted, and saltwater environments.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Water Change Volume Planner"
      description="Plan the exact volume of water to be changed to achieve a target percentage reduction in nitrates or other parameters."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Volume to Change = Tank Volume × (1 - Target Nitrate / Current Nitrate)",
        variables: [
          { symbol: "Tank Volume", description: "Total volume of aquarium water" },
          { symbol: "Current Nitrate", description: "Current nitrate concentration (ppm)" },
          { symbol: "Target Nitrate", description: "Desired nitrate concentration after water change (ppm)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "An aquarium has 50 gallons of water with a current nitrate level of 40 ppm. The target nitrate level is 20 ppm to maintain optimal fish health.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the fraction of water to change: 1 - (20 / 40) = 0.5, meaning 50% of the water needs to be replaced.",
          },
          {
            label: "2",
            explanation:
              "Multiply by tank volume: 50 gallons × 0.5 = 25 gallons. Therefore, changing 25 gallons will reduce nitrate to the target level.",
          },
        ],
        result: "Change 25 gallons of water to achieve the target nitrate concentration of 20 ppm.",
      }}
      relatedCalculators={[
        {
          title: "Horse Electrolyte Need Estimator (Exercise & Heat)",
          url: "/pets/horse-electrolyte-need-estimator",
          icon: "🐎",
        },
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
        {
          title: "Fluid Replacement Volume Calculator",
          url: "/pets/reptile-fluid-replacement-volume",
          icon: "🐱",
        },
        {
          title: "Hand-Feeding Formula Amount (Chicks)",
          url: "/pets/bird-hand-feeding-formula-amount-chicks",
          icon: "🍖",
        },
        {
          title: "Electrolyte Powder Mixing Calculator",
          url: "/pets/horse-electrolyte-powder-mixing",
          icon: "💉",
        },
        {
          title: "Horse Feeding Rate Calculator (Forage + Concentrate)",
          url: "/pets/horse-feeding-rate-forage-concentrate",
          icon: "🐎",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Water Change Volume Planner" },
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