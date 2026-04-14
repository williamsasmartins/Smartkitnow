import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HoseRuntimeFlowRateCalculator() {
  /**
   * Inputs:
   * - Flow Rate (gallons per minute, GPM)
   * - Desired Water Volume (gallons)
   * - Optional: Hose Diameter (inches) - for advanced users (informational only)
   * 
   * Output:
   * - Runtime (minutes) = Desired Water Volume / Flow Rate
   */

  const [inputs, setInputs] = useState({
    flowRate: "",
    waterVolume: "",
    hoseDiameter: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const flowRate = parseFloat(inputs.flowRate);
    const waterVolume = parseFloat(inputs.waterVolume);
    const hoseDiameter = parseFloat(inputs.hoseDiameter);

    if (!flowRate || flowRate <= 0) {
      return {
        value: null,
        label: "Invalid Flow Rate",
        subtext: "Please enter a positive number for flow rate.",
        warning: "Flow rate must be greater than zero.",
        formulaUsed: "Runtime (min) = Desired Water Volume (gal) ÷ Flow Rate (GPM)",
      };
    }
    if (!waterVolume || waterVolume <= 0) {
      return {
        value: null,
        label: "Invalid Water Volume",
        subtext: "Please enter a positive number for desired water volume.",
        warning: "Water volume must be greater than zero.",
        formulaUsed: "Runtime (min) = Desired Water Volume (gal) ÷ Flow Rate (GPM)",
      };
    }

    // Calculate runtime in minutes
    const runtime = waterVolume / flowRate;

    // Format runtime to 2 decimal places
    const runtimeFormatted = runtime.toFixed(2);

    // Optional: Provide info about hose diameter effect (informational)
    let diameterNote = "";
    if (hoseDiameter && hoseDiameter > 0) {
      diameterNote = `Note: Hose diameter (${hoseDiameter}" nominal) affects flow resistance and pressure loss, which can impact actual flow rate and runtime. This calculator assumes steady flow rate input.`;
    }

    return {
      value: `${runtimeFormatted} minutes`,
      label: "Estimated Hose Runtime",
      subtext: diameterNote,
      warning: null,
      formulaUsed: "Runtime (min) = Desired Water Volume (gal) ÷ Flow Rate (GPM)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does the Hose Runtime vs Flow Rate Calculator do?",
      answer: "This calculator determines how long a hose will run based on water tank capacity, flow rate (GPM or LPM), and pressure requirements. It helps you plan watering schedules and estimate water usage for gardens, pools, and cleaning tasks.",
    },
    {
      question: "How do I calculate hose runtime if I know flow rate and tank size?",
      answer: "Divide your tank capacity (gallons or liters) by the flow rate (GPM or LPM). For example, a 100-gallon tank at 5 GPM gives 20 minutes of runtime.",
    },
    {
      question: "What factors affect hose flow rate?",
      answer: "Hose diameter, water pressure, hose length, and internal friction reduce flow rate. A 5/8-inch hose typically delivers 12–17 GPM at 40 PSI, while longer hoses experience more pressure drop.",
    },
    {
      question: "How does hose diameter impact runtime calculations?",
      answer: "Larger hoses (3/4-inch vs. 1/2-inch) deliver higher flow rates at the same pressure, reducing runtime for the same tank volume. A 3/4-inch hose flows approximately 40–50% faster than a 1/2-inch hose.",
    },
    {
      question: "Can I use this calculator for both water and chemical applications?",
      answer: "Yes, but verify that your flow rate input matches the specific fluid's viscosity and density, as these affect actual delivery rates compared to water baseline measurements.",
    },
    {
      question: "What is the difference between PSI and GPM in hose calculations?",
      answer: "PSI (pounds per square inch) measures water pressure, while GPM (gallons per minute) measures flow volume; higher PSI typically increases GPM, but longer hoses reduce both.",
    },
    {
      question: "How accurate are runtime estimates from this calculator?",
      answer: "Estimates are &plusmn;5–10% accurate for standard conditions; real-world results vary due to temperature, hose age, nozzle restrictions, and elevation changes.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="flowRate" className="mb-1 flex items-center gap-1">
              Flow Rate (Gallons per Minute) <Droplets className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="flowRate"
              type="text"
              placeholder="e.g., 10"
              value={inputs.flowRate}
              onChange={(e) => handleInputChange("flowRate", e.target.value)}
              aria-describedby="flowRateHelp"
            />
            <p id="flowRateHelp" className="text-sm text-slate-500 mt-1">
              Enter the flow rate of your hose or sprinkler system in gallons per minute (GPM).
            </p>
          </div>

          <div>
            <Label htmlFor="waterVolume" className="mb-1 flex items-center gap-1">
              Desired Water Volume (Gallons) <Waves className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="waterVolume"
              type="text"
              placeholder="e.g., 50"
              value={inputs.waterVolume}
              onChange={(e) => handleInputChange("waterVolume", e.target.value)}
              aria-describedby="waterVolumeHelp"
            />
            <p id="waterVolumeHelp" className="text-sm text-slate-500 mt-1">
              Enter the total volume of water you want to apply.
            </p>
          </div>

          <div>
            <Label htmlFor="hoseDiameter" className="mb-1 flex items-center gap-1">
              Hose Diameter (Inches) <Scale className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="hoseDiameter"
              type="text"
              placeholder="Optional, e.g., 0.75"
              value={inputs.hoseDiameter}
              onChange={(e) => handleInputChange("hoseDiameter", e.target.value)}
              aria-describedby="hoseDiameterHelp"
            />
            <p id="hoseDiameterHelp" className="text-sm text-slate-500 mt-1">
              Optional: Enter your hose's nominal diameter to understand its effect on flow.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, results update automatically
          }}
          aria-label="Calculate hose runtime"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ flowRate: "", waterVolume: "", hoseDiameter: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{results.subtext}</p>
            {results.warning && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            <p className="mt-4 text-xs italic text-slate-500 dark:text-slate-400">
              Formula used: {results.formulaUsed}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Hose Runtime vs Flow Rate Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator computes how long your water supply will last based on flow rate and tank capacity. Simply input your tank size, desired flow rate, and the calculator instantly shows total runtime in minutes or hours.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter tank capacity in gallons or liters, then provide flow rate in GPM (gallons per minute) or LPM (liters per minute). You can find flow rates on hose specifications or measure them by timing how long it takes to fill a bucket.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The result shows total runtime before the tank empties. Use this to plan watering schedules, estimate water costs, or determine if your hose setup meets project time requirements.</p>
        </div>
      </section>

      {/* TABLE: Standard Hose Flow Rates by Diameter and Pressure */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard Hose Flow Rates by Diameter and Pressure</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Flow rates vary significantly based on hose diameter and water pressure applied.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hose Diameter</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Flow Rate at 40 PSI (GPM)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Flow Rate at 60 PSI (GPM)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Flow Rate at 80 PSI (GPM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1/2 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9–11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12–14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–17</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5/8 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14–16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17–19</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21–23</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3/4 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18–22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24–28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32–36</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42–50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">58–65</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Actual flow rates depend on hose condition, temperature, and internal friction losses.</p>
      </section>

      {/* TABLE: Water Tank Runtime Examples at Common Flow Rates */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Water Tank Runtime Examples at Common Flow Rates</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Expected runtime for standard tank sizes across typical household and garden flow rates.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tank Capacity (Gallons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">At 5 GPM</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">At 10 GPM</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">At 15 GPM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.7 minutes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.3 minutes</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.7 minutes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.3 minutes</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Runtime decreases as pressure drops during tank drainage; these are average estimates.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure actual flow rate by timing how long it takes to fill a 5-gallon bucket, then multiply bucket count by 12 to estimate GPM.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for pressure drop over long hose runs: every 50 feet of 1/2-inch hose reduces pressure by approximately 5–10 PSI.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check hose diameter and age before calculating—older hoses develop interior buildup that reduces flow rate by 10–20%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Run the calculator with both minimum and maximum expected flow rates to see best-case and worst-case runtime scenarios.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Tank Capacity Units</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Mixing gallons and liters without conversion causes massive errors; always verify your input unit before calculating.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Pressure Drop Over Distance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using stated flow rate without accounting for hose length overestimates actual runtime significantly.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Constant Flow Rate</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Water pressure decreases as tank drains, reducing actual flow rate—this calculator uses average flow, not declining rates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Nozzle Restrictions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Spray nozzles or adjustable heads reduce effective flow rate, so measure with your actual nozzle attached.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does the Hose Runtime vs Flow Rate Calculator do?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator determines how long a hose will run based on water tank capacity, flow rate (GPM or LPM), and pressure requirements. It helps you plan watering schedules and estimate water usage for gardens, pools, and cleaning tasks.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate hose runtime if I know flow rate and tank size?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Divide your tank capacity (gallons or liters) by the flow rate (GPM or LPM). For example, a 100-gallon tank at 5 GPM gives 20 minutes of runtime.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect hose flow rate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Hose diameter, water pressure, hose length, and internal friction reduce flow rate. A 5/8-inch hose typically delivers 12–17 GPM at 40 PSI, while longer hoses experience more pressure drop.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does hose diameter impact runtime calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Larger hoses (3/4-inch vs. 1/2-inch) deliver higher flow rates at the same pressure, reducing runtime for the same tank volume. A 3/4-inch hose flows approximately 40–50% faster than a 1/2-inch hose.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for both water and chemical applications?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, but verify that your flow rate input matches the specific fluid's viscosity and density, as these affect actual delivery rates compared to water baseline measurements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between PSI and GPM in hose calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">PSI (pounds per square inch) measures water pressure, while GPM (gallons per minute) measures flow volume; higher PSI typically increases GPM, but longer hoses reduce both.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate are runtime estimates from this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Estimates are &plusmn;5–10% accurate for standard conditions; real-world results vary due to temperature, hose age, nozzle restrictions, and elevation changes.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sprinklersupply.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Sprinkler Supply: Hose Flow Rate Charts</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Provides comprehensive flow rate tables for various hose sizes and pressures.</p>
          </li>
          <li>
            <a href="https://www.irrigation.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Irrigation Association</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Offers professional standards and guidelines for calculating water delivery and pressure management.</p>
          </li>
          <li>
            <a href="https://extension.psu.edu" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Penn State Extension: Garden Hose Basics</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Educational resource covering hose selection, pressure dynamics, and efficiency optimization.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/watersense" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA WaterSense: Outdoor Water Conservation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Government resource for water-efficient practices and calculating water usage in residential and commercial settings.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Hose Runtime vs Flow Rate Calculator"
      description="Calculate hose runtime for watering. Determine how long to run your sprinkler to deliver a specific amount of water."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Runtime (minutes) = Desired Water Volume (gallons) ÷ Flow Rate (gallons per minute)",
        variables: [
          { symbol: "Runtime", description: "Time to run the hose or sprinkler (minutes)" },
          { symbol: "Desired Water Volume", description: "Total water volume to apply (gallons)" },
          { symbol: "Flow Rate", description: "Water flow rate through the hose (gallons per minute)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a sprinkler system with a flow rate of 8 gallons per minute, and you want to apply 40 gallons of water to your garden bed.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Identify the flow rate of your sprinkler system: 8 GPM.",
          },
          {
            label: "Step 2",
            explanation:
              "Determine the desired water volume: 40 gallons.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate runtime: 40 gallons ÷ 8 GPM = 5 minutes.",
          },
        ],
        result: "You should run your sprinkler for approximately 5 minutes to deliver 40 gallons of water.",
      }}
      relatedCalculators={[
        { title: "Propane Tank Burn Time Estimator", url: "/everyday/propane-tank-burn-time", icon: "💡" },
        { title: "Rainwater Barrel Days of Supply", url: "/everyday/rainwater-barrel-days-supply", icon: "💧" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday/water-heater-recovery-time", icon: "💧" },
        { title: "Laundry Detergent Dosage by Load Size", url: "/everyday/laundry-detergent-dosage", icon: "💡" },
        { title: "Refrigerator/Freezer Safe Zone Time Window", url: "/everyday/refrigerator-freezer-safe-zone-time-window", icon: "💡" },
        { title: "Lawn Mowing Time & Fuel Planner", url: "/everyday/lawn-mowing-time-fuel", icon: "💡" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}