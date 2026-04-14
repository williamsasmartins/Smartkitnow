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

const PROPANE_DENSITY_LB_PER_GAL = 4.24; // Propane density in pounds per gallon (liquid)
const PROPANE_BTU_PER_LB = 21_548; // Approximate energy content per pound of propane (BTU)
const PROPANE_LB_PER_CUBIC_FT = 0.116; // Propane weight per cubic foot (gas)
const PROPANE_GAL_TO_LB = PROPANE_DENSITY_LB_PER_GAL; // For liquid propane gallons to pounds

export default function PropaneTankBurnTimeCalculator() {
  const [inputs, setInputs] = useState({
    tankSize: "", // in gallons
    btuUsage: "", // in BTU/hr
    applianceType: "Grill",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Calculate burn time in hours
  // Formula: Burn Time (hours) = (Tank Size in gallons * Propane density lb/gal * BTU/lb) / Appliance BTU/hr
  // Explanation: Total BTUs in tank divided by appliance consumption rate
  const results = useMemo(() => {
    const tankSize = parseFloat(inputs.tankSize);
    const btuUsage = parseFloat(inputs.btuUsage);

    if (!tankSize || tankSize <= 0) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid propane tank size in gallons.",
        warning: null,
        formulaUsed: null,
      };
    }
    if (!btuUsage || btuUsage <= 0) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid appliance BTU usage per hour.",
        warning: null,
        formulaUsed: null,
      };
    }

    // Calculate total BTUs in tank
    const totalBTUs = tankSize * PROPANE_DENSITY_LB_PER_GAL * PROPANE_BTU_PER_LB;
    const burnTimeHours = totalBTUs / btuUsage;

    // Warn if burn time is very short or very long (arbitrary thresholds)
    let warning = null;
    if (burnTimeHours < 0.1) {
      warning = "Warning: Burn time is very short. Check your inputs.";
    } else if (burnTimeHours > 1000) {
      warning = "Warning: Burn time is unusually long. Verify appliance BTU usage.";
    }

    return {
      value: burnTimeHours.toFixed(2) + " hours",
      label: `Estimated Burn Time for your ${inputs.applianceType}`,
      subtext: `Based on a ${tankSize} gallon tank and ${btuUsage.toLocaleString()} BTU/hr appliance consumption.`,
      warning,
      formulaUsed: `Burn Time = (Tank Size × ${PROPANE_DENSITY_LB_PER_GAL} lb/gal × ${PROPANE_BTU_PER_LB.toLocaleString()} BTU/lb) ÷ Appliance BTU/hr`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I calculate propane burn time for my grill?",
      answer: "Enter your tank size (in lbs or gallons), the BTU output of your appliance, and the calculator divides tank capacity by hourly consumption to estimate runtime in hours.",
    },
    {
      question: "What's the difference between water weight and propane weight on a tank?",
      answer: "Water weight is the tank's empty container weight; propane weight is the actual fuel inside. Always use propane weight for burn time calculations.",
    },
    {
      question: "How many BTUs does a standard propane grill use per hour?",
      answer: "Most residential grills operate between 30,000–60,000 BTUs per hour; check your grill's manual for the exact specification.",
    },
    {
      question: "Can I estimate burn time for a propane heater or fireplace?",
      answer: "Yes—input the heater's BTU rating and tank size; most space heaters range from 10,000–40,000 BTUs per hour depending on model and setting.",
    },
    {
      question: "Why does my propane tank feel full but the calculator shows fewer hours?",
      answer: "Propane expands and contracts with temperature changes, affecting gauge readings; the calculator uses actual fuel weight, which is more reliable than visual gauges.",
    },
    {
      question: "How accurate is this burn time estimate?",
      answer: "The estimate assumes steady BTU output; real-world usage varies by weather, appliance condition, and usage patterns, so treat results as approximate guidelines.",
    },
    {
      question: "What should I do when my propane tank reaches 20% capacity?",
      answer: "Schedule a refill when tank capacity drops below 20% to ensure you don't run out unexpectedly; most suppliers recommend this threshold for safety.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tankSize" className="mb-1 flex items-center gap-1">
              Propane Tank Size (gallons) <Droplets className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="tankSize"
              type="number"
              min={0}
              step="any"
              placeholder="e.g., 20"
              value={inputs.tankSize}
              onChange={e => handleInputChange("tankSize", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="btuUsage" className="mb-1 flex items-center gap-1">
              Appliance BTU Usage per Hour <Zap className="w-4 h-4 text-yellow-600" />
            </Label>
            <Input
              id="btuUsage"
              type="number"
              min={0}
              step="any"
              placeholder="e.g., 30000"
              value={inputs.btuUsage}
              onChange={e => handleInputChange("btuUsage", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="applianceType" className="mb-1 flex items-center gap-1">
              Appliance Type <Utensils className="w-4 h-4 text-green-600" />
            </Label>
            <Select
              value={inputs.applianceType}
              onValueChange={v => handleInputChange("applianceType", v)}
              id="applianceType"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select appliance type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Grill">Grill</SelectItem>
                <SelectItem value="Heater">Heater</SelectItem>
                <SelectItem value="Generator">Generator</SelectItem>
                <SelectItem value="Stove">Stove</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs (no-op here since useMemo depends on inputs)
            setInputs(p => ({ ...p }));
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ tankSize: "", btuUsage: "", applianceType: "Grill" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Propane Tank Burn Time Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates how many hours your propane tank will last based on tank size and appliance BTU consumption. Input your tank capacity and the BTU rating of your grill, heater, or other propane appliance to get an estimate.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include the propane tank size (in pounds or gallons), the appliance's BTU per hour rating, and optionally the current fuel level if you're estimating remaining runtime. Find your appliance's BTU specification in its manual or on the manufacturer's nameplate.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The result shows estimated burn hours under steady-state conditions; actual runtime varies based on weather, appliance settings, and maintenance. Use this estimate to plan refills and avoid running out during critical times like outdoor events or winter heating.</p>
        </div>
      </section>

      {/* TABLE: Common Propane Appliance BTU Ratings */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Propane Appliance BTU Ratings</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use these typical BTU ranges to estimate burn time for your specific appliance.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Appliance Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BTU Range (Per Hour)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Propane Grill</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30,000–60,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High heat cooking</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Space Heater</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10,000–40,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Room heating</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Propane Fireplace</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15,000–50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ambiance &amp; warmth</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Propane Cooktop</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25,000–35,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Stovetop cooking</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Propane Water Heater</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30,000–50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24/7 hot water</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Propane Oven</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20,000–30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baking &amp; roasting</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Patio Heater</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40,000–90,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Outdoor warmth</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Check your appliance manual for exact BTU output; ratings vary by brand and model.</p>
      </section>

      {/* TABLE: Propane Tank Sizes &amp; Typical Burn Times */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Propane Tank Sizes &amp; Typical Burn Times</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimated burn hours for standard residential tank sizes at mid-range BTU consumption.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tank Size (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tank Size (gallons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hours at 40,000 BTU/hr</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hours at 60,000 BTU/hr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.5 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.8 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.5 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">52.5 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">63 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">117.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">262.5 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">175 hours</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Times assume 90% fuel usability; actual burn duration depends on appliance BTU rating and outdoor temperature.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify your appliance's exact BTU rating from the manual rather than guessing—wrong input values lead to inaccurate estimates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for seasonal temperature swings; propane density changes with weather, affecting actual burn efficiency and runtime.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep propane tank pressure gauges separate from calculator estimates—gauges are visual only; weight-based calculations are more precise.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Refill when the tank reaches 20% capacity to maintain adequate backup supply and avoid midnight supply runs.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Water Weight Instead of Fuel Weight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Tank labels show both weights; using the empty tank weight instead of propane weight inflates burn time estimates by 10–20%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Variable BTU Settings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many appliances operate at reduced BTU on low settings, which increases runtime; the calculator assumes constant output unless adjusted.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting About Tank Reserve Regulations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Propane tanks legally retain a 10% minimum reserve for pressure maintenance, reducing usable fuel below tank capacity.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Constant Burn Rate in Cold Weather</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Propane density decreases in cold temperatures, reducing fuel efficiency and actual burn hours compared to warm-weather estimates.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate propane burn time for my grill?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your tank size (in lbs or gallons), the BTU output of your appliance, and the calculator divides tank capacity by hourly consumption to estimate runtime in hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between water weight and propane weight on a tank?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Water weight is the tank's empty container weight; propane weight is the actual fuel inside. Always use propane weight for burn time calculations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many BTUs does a standard propane grill use per hour?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most residential grills operate between 30,000–60,000 BTUs per hour; check your grill's manual for the exact specification.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I estimate burn time for a propane heater or fireplace?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—input the heater's BTU rating and tank size; most space heaters range from 10,000–40,000 BTUs per hour depending on model and setting.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does my propane tank feel full but the calculator shows fewer hours?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Propane expands and contracts with temperature changes, affecting gauge readings; the calculator uses actual fuel weight, which is more reliable than visual gauges.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is this burn time estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The estimate assumes steady BTU output; real-world usage varies by weather, appliance condition, and usage patterns, so treat results as approximate guidelines.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do when my propane tank reaches 20% capacity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Schedule a refill when tank capacity drops below 20% to ensure you don't run out unexpectedly; most suppliers recommend this threshold for safety.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.propane.com/safety/tank-sizing-guide/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Propane.com — Tank Sizing Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guide to residential propane tank sizes, capacity ratings, and selection criteria.</p>
          </li>
          <li>
            <a href="https://www.api.org/products-and-services/standards/standards-development-process" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Petroleum Institute — Propane Storage Safety</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standards and safety requirements for propane tank design and maintenance.</p>
          </li>
          <li>
            <a href="https://www.energy.gov/energysaver/propane" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy — Propane Efficiency Tips</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal resources on propane efficiency, safety, and cost-saving strategies for homeowners.</p>
          </li>
          <li>
            <a href="https://www.npga.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Propane Gas Association — Consumer Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Trade association providing propane safety standards, certification programs, and consumer education.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Propane Tank Burn Time Estimator"
      description="Estimate propane tank burn time. Calculate how long your grill, heater, or generator will run based on tank size and BTU usage."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          `Burn Time (hours) = (Tank Size (gallons) × Propane Density (lb/gal) × Energy Content (BTU/lb)) ÷ Appliance BTU Usage per Hour`,
        variables: [
          { symbol: "Tank Size", description: "Propane tank volume in gallons" },
          { symbol: "Propane Density", description: "Weight of propane per gallon (approx. 4.24 lb/gal)" },
          { symbol: "Energy Content", description: "Energy content of propane per pound (approx. 21,548 BTU/lb)" },
          { symbol: "Appliance BTU Usage", description: "Appliance fuel consumption rate in BTU per hour" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a 20-gallon propane tank connected to a grill that consumes 30,000 BTU per hour. You want to know how long the grill will run before the tank is empty.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate total BTUs in the tank: 20 gallons × 4.24 lb/gal × 21,548 BTU/lb = 1,828,390 BTUs approximately.",
          },
          {
            label: "Step 2",
            explanation:
              "Divide total BTUs by appliance consumption: 1,828,390 BTUs ÷ 30,000 BTU/hr = 60.95 hours.",
          },
          {
            label: "Step 3",
            explanation: "The grill will run for approximately 61 hours on a full 20-gallon tank.",
          },
        ],
        result: "Estimated burn time: ~61 hours.",
      }}
      relatedCalculators={[
        { title: "Appliance Energy Consumption Calculator", url: "/everyday/appliance-energy-consumption", icon: "💡" },
        { title: "Sleep Debt & Ideal Bedtime Planner", url: "/everyday/sleep-debt-ideal-bedtime", icon: "💡" },
        { title: "Wine/Beer/Soft Drink Mix Estimator", url: "/everyday/beverage-mix-estimator", icon: "🎉" },
        { title: "Plant Spacing Calculator", url: "/everyday/plant-spacing-calculator", icon: "🌿" },
        { title: "Body Mass Index (BMI) Calculator", url: "/everyday/bmi-calculator", icon: "❤️" },
        { title: "Caffeine Max per Day Calculator", url: "/everyday/caffeine-max-per-day", icon: "💡" },
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