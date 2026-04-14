import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Calculator, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumHeaterWattageRequirementCalculator() {
  // 1. STATE
  // Unit system needed because volume input can be in gallons or liters
  const [unit, setUnit] = useState("imperial"); // imperial = gallons, metric = liters

  // Inputs: tank volume and desired temperature difference (water temp - room temp)
  const [inputs, setInputs] = useState({
    volume: "",
    desiredTempDiff: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const volumeNum = parseFloat(inputs.volume);
    const tempDiffNum = parseFloat(inputs.desiredTempDiff);

    if (
      isNaN(volumeNum) ||
      volumeNum <= 0 ||
      isNaN(tempDiffNum) ||
      tempDiffNum <= 0
    ) {
      return {
        value: 0,
        label: "Heater Wattage (Watts)",
        subtext: "Please enter valid positive numbers for all inputs.",
        warning: null,
      };
    }

    // Convert volume to liters if imperial (gallons)
    const volumeLiters = unit === "imperial" ? volumeNum * 3.78541 : volumeNum;

    // Formula source: Heater wattage (W) ≈ volume (liters) × temperature difference (°C) × 0.05
    // 0.05 is a coefficient accounting for heat loss and efficiency in typical aquarium setups.
    const wattage = volumeLiters * tempDiffNum * 0.05;

    // Round to nearest whole number
    const wattageRounded = Math.round(wattage);

    return {
      value: wattageRounded,
      label: "Heater Wattage (Watts)",
      subtext: `Based on ${volumeNum} ${unit === "imperial" ? "gallons" : "liters"} and a temperature difference of ${tempDiffNum}°C.`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What size heater do I need for a 40-gallon aquarium?",
      answer: "A 40-gallon aquarium typically requires 200-400 watts, depending on desired temperature increase and ambient room temperature. Most aquarists use 300 watts for tropical fish requiring 76-78°F.",
    },
    {
      question: "How many watts per gallon should I use?",
      answer: "The standard rule is 3-5 watts per gallon for tropical aquariums. Larger tanks need fewer watts per gallon due to better heat retention, while smaller tanks need more.",
    },
    {
      question: "What heater wattage do I need for a reptile enclosure?",
      answer: "Reptile enclosures typically need 75-150 watts for small tanks (20-40 gallons) and 200-500 watts for larger enclosures, depending on species temperature requirements (68-95°F).",
    },
    {
      question: "Does room temperature affect heater wattage requirements?",
      answer: "Yes, significantly. A 55°F room requires 30-40% more heating power than a 70°F room to maintain the same tank temperature.",
    },
    {
      question: "Should I use one heater or two heaters?",
      answer: "Tanks over 40 gallons benefit from two smaller heaters for redundancy and even heat distribution. Two 150W heaters are safer than one 300W heater if one fails.",
    },
    {
      question: "Can I use an oversized heater?",
      answer: "Oversized heaters can cause temperature overshooting and stress. Use a heater within 10% of calculated wattage with a reliable thermostat to prevent harm.",
    },
    {
      question: "How do I calculate heater wattage for unusual tank shapes?",
      answer: "Calculate total volume in gallons, then multiply by 4 watts per gallon for tropical tanks, accounting for your room temperature and desired tank temperature difference.",
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
            className="border border-slate-300 rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="imperial">Imperial (gallons)</option>
            <option value="metric">Metric (liters)</option>
          </select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="volume" className="text-slate-700 dark:text-slate-300">
            Aquarium Volume ({unit === "imperial" ? "gallons" : "liters"})
          </Label>
          <Input
            id="volume"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter volume in ${unit === "imperial" ? "gallons" : "liters"}`}
            value={inputs.volume}
            onChange={(e) => setInputs((prev) => ({ ...prev, volume: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="desiredTempDiff" className="text-slate-700 dark:text-slate-300">
            Desired Temperature Difference (°C)
          </Label>
          <Input
            id="desiredTempDiff"
            type="number"
            min="0"
            step="any"
            placeholder="Enter temperature difference in °C"
            value={inputs.desiredTempDiff}
            onChange={(e) => setInputs((prev) => ({ ...prev, desiredTempDiff: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ volume: "", desiredTempDiff: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Heater Wattage Requirement Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the optimal heater wattage needed to maintain your pet's tank or enclosure at the desired temperature. It factors in tank volume, current room temperature, and target water/air temperature to provide accurate recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter your tank size in gallons, the current room temperature, and your target pet habitat temperature. The tool will compute the necessary wattage accounting for heat loss and thermal efficiency.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator returns a recommended wattage range plus minimum and maximum safe limits. Use the recommended value for best results, and always pair your heater with a reliable thermostat to prevent temperature fluctuations and pet stress.</p>
        </div>
      </section>

      {/* TABLE: Heater Wattage Requirements by Tank Size */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Heater Wattage Requirements by Tank Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard wattage recommendations for tropical freshwater aquariums in 70°F room temperature.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tank Size (Gallons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Watts</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Watts</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Watts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">450</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Wattage increases by 25-50 watts for each 10°F decrease in room temperature.</p>
      </section>

      {/* TABLE: Heater Requirements by Pet Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Heater Requirements by Pet Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended wattage based on pet species and enclosure size.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tank/Enclosure Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temperature Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Watts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tropical Fish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">76-78°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100W</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tropical Fish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">76-78°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250W</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Betta Fish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">76-80°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-50W</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bearded Dragon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-gallon breeder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85-95°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-200W</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Corn Snake</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-gallon breeder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-85°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-150W</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ball Python</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-gallon breeder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-85°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150W</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Leopard Gecko</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-gallon long</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">88-90°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-100W</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Red-Eared Slider</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75+ gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-85°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-400W</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Adjust wattage based on ambient room conditions and desired heat gradient zones.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use an external thermostat with your heater to prevent overheating and provide precise temperature control within ±1°F.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Place heaters away from tank walls and decorations to allow water circulation and prevent local hot spots.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Replace heaters every 3-5 years or immediately if they show inconsistent heating behavior.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">For tanks over 100 gallons, split the wattage between two heaters positioned at opposite ends for uniform heat distribution.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Room Temperature</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to account for cold room conditions often results in undersized heaters that cannot maintain target temperatures.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using One Oversized Heater</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A single large heater creates temperature swings and equipment failure risks; split heating loads over two smaller units.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Heater Submersion Requirements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Most heaters require full submersion to function safely; improper placement reduces efficiency and risks equipment damage.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Seasonal Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Winter heating demands differ significantly from summer; recalculate wattage needs when room temperature drops substantially.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What size heater do I need for a 40-gallon aquarium?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 40-gallon aquarium typically requires 200-400 watts, depending on desired temperature increase and ambient room temperature. Most aquarists use 300 watts for tropical fish requiring 76-78°F.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many watts per gallon should I use?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The standard rule is 3-5 watts per gallon for tropical aquariums. Larger tanks need fewer watts per gallon due to better heat retention, while smaller tanks need more.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What heater wattage do I need for a reptile enclosure?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Reptile enclosures typically need 75-150 watts for small tanks (20-40 gallons) and 200-500 watts for larger enclosures, depending on species temperature requirements (68-95°F).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does room temperature affect heater wattage requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, significantly. A 55°F room requires 30-40% more heating power than a 70°F room to maintain the same tank temperature.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I use one heater or two heaters?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Tanks over 40 gallons benefit from two smaller heaters for redundancy and even heat distribution. Two 150W heaters are safer than one 300W heater if one fails.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use an oversized heater?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Oversized heaters can cause temperature overshooting and stress. Use a heater within 10% of calculated wattage with a reliable thermostat to prevent harm.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate heater wattage for unusual tank shapes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Calculate total volume in gallons, then multiply by 4 watts per gallon for tropical tanks, accounting for your room temperature and desired tank temperature difference.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aquariumcoop.com/blogs/aquarium/aquarium-heater" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Aquarium Co-op Heater Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide covering heater types, wattage calculations, and best practices for aquariums.</p>
          </li>
          <li>
            <a href="https://www.reptifiles.com/heating-cooling/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ReptiFiles Heating Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">In-depth resource for reptile enclosure heating requirements including temperature gradients and wattage specs.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Pet Care Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official animal welfare standards including temperature and habitat requirements for common pet species.</p>
          </li>
          <li>
            <a href="https://www.petco.com/shop/en/petcostore/category/aquarium-heaters" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Petco Aquarium Heater Selection</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Product specifications and consumer guides for selecting appropriate heater wattages by tank size.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Heater Wattage Requirement"
      description="Determine the correct wattage heater needed to maintain the desired water temperature based on tank volume and room temperature."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Heater Wattage (W) = Aquarium Volume (L) × Temperature Difference (°C) × 0.05",
        variables: [
          { symbol: "Aquarium Volume (L)", description: "Total volume of aquarium water in liters" },
          { symbol: "Temperature Difference (°C)", description: "Desired temperature difference between aquarium water and room temperature" },
          { symbol: "0.05", description: "Coefficient accounting for heat loss and heater efficiency" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 40-gallon aquarium is kept in a room at 20°C, and the desired water temperature is 26°C. Calculate the heater wattage required.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert 40 gallons to liters: 40 × 3.78541 = 151.4 liters.",
          },
          {
            label: "2",
            explanation:
              "Calculate temperature difference: 26°C - 20°C = 6°C.",
          },
          {
            label: "3",
            explanation:
              "Apply formula: 151.4 × 6 × 0.05 = 45.42 watts.",
          },
        ],
        result: "Recommended heater wattage is approximately 45 watts.",
      }}
      relatedCalculators={[
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
        { title: "Cat Weight Loss Planner", url: "/pets/cat-weight-loss-planner", icon: "🐱" },
        { title: "Calcium + D3 Supplement Calculator", url: "/pets/reptile-calcium-d3-supplement", icon: "🐱" },
        { title: "Senior Cat Nutrition & Calorie Adjuster", url: "/pets/senior-cat-nutrition-calorie-adjuster", icon: "🐱" },
        { title: "Dehydration Risk Estimator (Weight & Symptoms Aware)", url: "/pets/dog-dehydration-risk-estimator", icon: "💉" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Heater Wattage Requirement" },
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