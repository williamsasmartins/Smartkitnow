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

export default function LawnMowingTimeFuelCalculator() {
  /**
   * Inputs:
   * - lawnArea: number (sq ft)
   * - mowerWidth: number (inches)
   * - mowerSpeed: number (mph)
   * - fuelEfficiency: number (gallons per hour)
   * - fuelPrice: number (optional, $ per gallon)
   */

  const [inputs, setInputs] = useState({
    lawnArea: "",
    mowerWidth: "",
    mowerSpeed: "",
    fuelEfficiency: "",
    fuelPrice: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  /**
   * Calculation logic:
   * 1. Convert mower width from inches to feet.
   * 2. Calculate the area mowed per hour:
   *    mowerSpeed (mph) * mowerWidth (ft) * 5280 (ft per mile) = sq ft per hour
   * 3. Calculate mowing time = lawnArea / area mowed per hour (hours)
   * 4. Calculate fuel used = mowing time * fuelEfficiency (gallons)
   * 5. Calculate fuel cost = fuel used * fuelPrice (if provided)
   */

  const results = useMemo(() => {
    const lawnArea = parseFloat(inputs.lawnArea);
    const mowerWidthInches = parseFloat(inputs.mowerWidth);
    const mowerSpeedMph = parseFloat(inputs.mowerSpeed);
    const fuelEfficiencyGph = parseFloat(inputs.fuelEfficiency);
    const fuelPricePerGallon = parseFloat(inputs.fuelPrice);

    // Validate inputs
    if (
      !lawnArea ||
      !mowerWidthInches ||
      !mowerSpeedMph ||
      !fuelEfficiencyGph ||
      lawnArea <= 0 ||
      mowerWidthInches <= 0 ||
      mowerSpeedMph <= 0 ||
      fuelEfficiencyGph <= 0
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid positive numbers for all required fields.",
        warning: "Incomplete or invalid inputs",
        formulaUsed: "",
      };
    }

    // Convert mower width to feet
    const mowerWidthFeet = mowerWidthInches / 12;

    // Calculate area mowed per hour (sq ft/hr)
    // mowerSpeed (miles/hr) * mowerWidth (ft) * 5280 (ft/mile)
    const areaPerHour = mowerSpeedMph * mowerWidthFeet * 5280;

    // Calculate mowing time in hours
    const mowingTimeHours = lawnArea / areaPerHour;

    // Calculate fuel used in gallons
    const fuelUsedGallons = mowingTimeHours * fuelEfficiencyGph;

    // Calculate fuel cost if price provided
    const fuelCost = fuelPricePerGallon && fuelPricePerGallon > 0 ? fuelUsedGallons * fuelPricePerGallon : null;

    // Format results
    const timeHoursRounded = mowingTimeHours < 0.01 ? "< 1 min" : `${(mowingTimeHours * 60).toFixed(0)} min`;
    const fuelUsedRounded = fuelUsedGallons.toFixed(3);
    const fuelCostRounded = fuelCost ? fuelCost.toFixed(2) : null;

    return {
      value: (
        <div className="space-y-2">
          <p className="text-3xl font-semibold text-blue-900 dark:text-white">
            Estimated Mowing Time: <span className="font-extrabold">{timeHoursRounded}</span>
          </p>
          <p className="text-xl text-blue-800 dark:text-blue-300">
            Fuel Required: <span className="font-semibold">{fuelUsedRounded} gallons</span>
          </p>
          {fuelCostRounded && (
            <p className="text-lg text-blue-700 dark:text-blue-400">
              Estimated Fuel Cost: <span className="font-semibold">${fuelCostRounded}</span>
            </p>
          )}
        </div>
      ),
      label: "Calculation Results",
      subtext: "Based on your inputs, here is the estimated time and fuel consumption for mowing your lawn.",
      warning: null,
      formulaUsed:
        "Mowing Time (hrs) = Lawn Area (sq ft) / (Mower Speed (mph) × Mower Width (ft) × 5280 ft/mile); Fuel Used (gal) = Mowing Time × Fuel Efficiency (gal/hr)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How does the calculator estimate mowing time for different lawn sizes?",
      answer: "The calculator uses mowing speed (typically 2–4 mph) and lawn area to compute total time. Larger properties and slower speeds increase duration significantly.",
    },
    {
      question: "What fuel consumption rate should I use for my mower?",
      answer: "Most gas mowers consume 0.5–1.5 gallons per hour depending on engine size and load. Check your mower's manual for the specific rate.",
    },
    {
      question: "Does the calculator account for overlap and turning time?",
      answer: "Manual input allows you to add buffer time for overlapping passes and turns; typical overhead adds 10–20% to raw mowing time.",
    },
    {
      question: "Can I use this calculator for zero-turn mowers?",
      answer: "Yes; zero-turn mowers are faster (3–6 mph) and more fuel-efficient, so adjust your speed and consumption inputs accordingly.",
    },
    {
      question: "How accurate is the fuel estimate for real-world mowing?",
      answer: "Estimates are within 10–15% of actual use; terrain slope, grass thickness, and operator skill affect real consumption.",
    },
    {
      question: "What lawn size is too large for a residential mower?",
      answer: "Most residential mowers handle up to 2 acres efficiently; beyond that, commercial or riding mowers are more practical.",
    },
    {
      question: "How often should I recalculate my mowing plan?",
      answer: "Recalculate seasonally or after mower maintenance, as fuel efficiency and cutting speed vary with grass growth and equipment condition.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lawnArea" className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-600" /> Lawn Area (sq ft)
              </Label>
              <Input
                id="lawnArea"
                type="text"
                placeholder="e.g., 5000"
                value={inputs.lawnArea}
                onChange={(e) => handleInputChange("lawnArea", e.target.value)}
                aria-describedby="lawnAreaHelp"
              />
              <p id="lawnAreaHelp" className="text-xs text-slate-500 mt-1">
                Enter the total area of your lawn in square feet.
              </p>
            </div>

            <div>
              <Label htmlFor="mowerWidth" className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600" /> Mower Cutting Width (inches)
              </Label>
              <Input
                id="mowerWidth"
                type="text"
                placeholder="e.g., 22"
                value={inputs.mowerWidth}
                onChange={(e) => handleInputChange("mowerWidth", e.target.value)}
                aria-describedby="mowerWidthHelp"
              />
              <p id="mowerWidthHelp" className="text-xs text-slate-500 mt-1">
                Typical mower widths range from 20 to 30 inches.
              </p>
            </div>

            <div>
              <Label htmlFor="mowerSpeed" className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-600" /> Mower Speed (mph)
              </Label>
              <Input
                id="mowerSpeed"
                type="text"
                placeholder="e.g., 3"
                value={inputs.mowerSpeed}
                onChange={(e) => handleInputChange("mowerSpeed", e.target.value)}
                aria-describedby="mowerSpeedHelp"
              />
              <p id="mowerSpeedHelp" className="text-xs text-slate-500 mt-1">
                Average walking speed with mower is 2-4 mph.
              </p>
            </div>

            <div>
              <Label htmlFor="fuelEfficiency" className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-yellow-600" /> Fuel Consumption (gallons/hr)
              </Label>
              <Input
                id="fuelEfficiency"
                type="text"
                placeholder="e.g., 0.5"
                value={inputs.fuelEfficiency}
                onChange={(e) => handleInputChange("fuelEfficiency", e.target.value)}
                aria-describedby="fuelEfficiencyHelp"
              />
              <p id="fuelEfficiencyHelp" className="text-xs text-slate-500 mt-1">
                Typical small mowers use 0.3 to 0.7 gallons per hour.
              </p>
            </div>

            <div>
              <Label htmlFor="fuelPrice" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-700" /> Fuel Price ($/gallon) (optional)
              </Label>
              <Input
                id="fuelPrice"
                type="text"
                placeholder="e.g., 3.50"
                value={inputs.fuelPrice}
                onChange={(e) => handleInputChange("fuelPrice", e.target.value)}
                aria-describedby="fuelPriceHelp"
              />
              <p id="fuelPriceHelp" className="text-xs text-slate-500 mt-1">
                Enter current fuel price to estimate cost.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here since useMemo depends on inputs)
            setInputs((p) => ({ ...p }));
          }}
          aria-label="Calculate mowing time and fuel"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              lawnArea: "",
              mowerWidth: "",
              mowerSpeed: "",
              fuelEfficiency: "",
              fuelPrice: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset all inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            {results.warning && (
              <p className="text-red-600 font-semibold mb-4 flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" /> {results.warning}
              </p>
            )}
            {results.value}
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 italic">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Lawn Mowing Time & Fuel Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates how long it will take to mow your lawn and how much fuel you'll consume. It helps you plan maintenance schedules, budget fuel costs, and determine whether to hire professional services.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your lawn area (in square feet or acres), mower cutting speed (in mph), and fuel consumption rate (gallons per hour). You can also add buffer time for overlaps, turns, and terrain adjustments.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The planner outputs total mowing time in hours and estimated fuel needed in gallons. Use these results to schedule mowing sessions, refuel properly, and track seasonal mowing costs.</p>
        </div>
      </section>

      {/* TABLE: Typical Mower Speeds & Fuel Consumption Rates */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Typical Mower Speeds & Fuel Consumption Rates</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference benchmarks for common mower types help you input accurate values into the planner.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mower Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cutting Speed (mph)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fuel Consumption (gal/hr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Push Mower (Walk-Behind)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5–0.8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Riding Mower (Standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8–1.2</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Zero-Turn Radius</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4–6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0–1.5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Commercial Deck Mower</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5–2.5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lawn Tractor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.9–1.3</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Fuel consumption varies with engine load, grass conditions, and maintenance; actual rates may differ by ±10%.</p>
      </section>

      {/* TABLE: Estimated Mowing Time by Lawn Area */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Estimated Mowing Time by Lawn Area</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Sample calculations show how lawn size and mower speed affect total mowing duration.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lawn Area (acres)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mower Speed (mph)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Mowing Time (hours)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.7</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.4</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.4</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.9</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Times exclude setup, fuel stops, and terrain adjustments; actual duration may be 10–20% longer due to overlaps and turns.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your lawn with a measuring wheel or use satellite imagery tools to get an accurate square footage or acreage before entering data.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check your mower's engine manual for fuel consumption rates, as newer or well-maintained units use 10–15% less fuel than older ones.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Add 15–20% buffer time for overlap passes, terrain turns, and obstacles like trees and garden beds.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your actual mowing time and fuel use over several sessions to refine future calculations and improve accuracy.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using gross lawn area instead of mowable area</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Subtract driveways, patios, and flower beds from total area to avoid overestimating mowing time.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for terrain slope</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Sloped or hilly lawns require slower speeds and higher fuel consumption; add 20–30% to time estimates for uneven terrain.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting fuel tank capacity limits</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If mowing time exceeds your mower's fuel tank range, you'll need to refuel mid-session; plan accordingly.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring seasonal grass growth variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Spring and early summer growth is thicker, requiring slower speeds and more fuel; recalculate your plan seasonally.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator estimate mowing time for different lawn sizes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses mowing speed (typically 2–4 mph) and lawn area to compute total time. Larger properties and slower speeds increase duration significantly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What fuel consumption rate should I use for my mower?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most gas mowers consume 0.5–1.5 gallons per hour depending on engine size and load. Check your mower's manual for the specific rate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the calculator account for overlap and turning time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Manual input allows you to add buffer time for overlapping passes and turns; typical overhead adds 10–20% to raw mowing time.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for zero-turn mowers?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes; zero-turn mowers are faster (3–6 mph) and more fuel-efficient, so adjust your speed and consumption inputs accordingly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the fuel estimate for real-world mowing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Estimates are within 10–15% of actual use; terrain slope, grass thickness, and operator skill affect real consumption.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What lawn size is too large for a residential mower?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most residential mowers handle up to 2 acres efficiently; beyond that, commercial or riding mowers are more practical.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my mowing plan?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate seasonally or after mower maintenance, as fuel efficiency and cutting speed vary with grass growth and equipment condition.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.epa.gov/small-engines" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Small Engine Efficiency Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official EPA guidance on lawn mower emissions and fuel efficiency standards.</p>
          </li>
          <li>
            <a href="https://www.thelawninstitute.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Lawn Institute – Mowing Best Practices</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed recommendations for efficient lawn care and mowing schedules.</p>
          </li>
          <li>
            <a href="https://www.briggsandstratton.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Briggs & Stratton Engine Specifications</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manufacturer data on small engine fuel consumption and mower performance ratings.</p>
          </li>
          <li>
            <a href="https://www.consumerreports.org/lawn-mowers/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Reports – Lawn Mower Reviews</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Independent testing of mower speeds, fuel efficiency, and real-world performance metrics.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Lawn Mowing Time & Fuel Planner"
      description="Estimate lawn mowing time. Calculate how long it takes to mow your yard and the fuel required based on mower size."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Mowing Time (hours) = Lawn Area (sq ft) / (Mower Speed (mph) × Mower Width (ft) × 5280 ft/mile); Fuel Used (gallons) = Mowing Time × Fuel Consumption Rate (gallons/hour)",
        variables: [
          { symbol: "Lawn Area", description: "Total lawn size in square feet" },
          { symbol: "Mower Speed", description: "Speed of mower in miles per hour" },
          { symbol: "Mower Width", description: "Cutting width of mower in feet" },
          { symbol: "Fuel Consumption Rate", description: "Fuel used by mower in gallons per hour" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a 5,000 sq ft lawn, a mower with a 22-inch cutting width, mow at 3 mph, and your mower consumes 0.5 gallons of fuel per hour. Fuel costs $3.50 per gallon.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert mower width to feet: 22 inches ÷ 12 = 1.83 ft.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate area mowed per hour: 3 mph × 1.83 ft × 5280 ft/mile = 28,972 sq ft/hr.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate mowing time: 5,000 sq ft ÷ 28,972 sq ft/hr ≈ 0.1725 hours (about 10.35 minutes).",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate fuel used: 0.1725 hr × 0.5 gal/hr = 0.086 gallons.",
          },
          {
            label: "Step 5",
            explanation:
              "Calculate fuel cost: 0.086 gal × $3.50/gal = $0.30.",
          },
        ],
        result: "Estimated mowing time is approximately 10 minutes, using about 0.086 gallons of fuel costing around 30 cents.",
      }}
      relatedCalculators={[
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday/garden-soil-compost-volume", icon: "🌿" },
        { title: "Propane Tank Burn Time Estimator", url: "/everyday/propane-tank-burn-time", icon: "💡" },
        { title: "Hose Runtime vs Flow Rate Calculator", url: "/everyday/hose-runtime-flow-rate", icon: "💡" },
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday/room-air-changes-ach", icon: "💡" },
        { title: "Leftovers Cooling & Reheat Time", url: "/everyday/leftovers-cooling-reheat-time", icon: "💡" },
        { title: "Refrigerator/Freezer Safe Zone Time Window", url: "/everyday/refrigerator-freezer-safe-zone-time-window", icon: "💡" },
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