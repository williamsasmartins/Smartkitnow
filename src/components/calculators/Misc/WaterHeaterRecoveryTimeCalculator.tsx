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

export default function WaterHeaterRecoveryTimeCalculator() {
  /**
   * Inputs:
   * - tankCapacity (gallons)
   * - heatingPower (kW)
   * - temperatureRise (°F)
   * - efficiency (%)
   * 
   * Formula:
   * Recovery Time (minutes) = (Tank Capacity × Temperature Rise × 8.34) / (Heating Power × Efficiency × 60)
   * Where:
   * - 8.34 = weight of 1 gallon of water in lbs
   * - Heating Power in kW converted to BTU/hr (1 kW = 3412 BTU/hr)
   * 
   * For simplicity, we use the formula:
   * Recovery Time (minutes) = (Tank Capacity × Temperature Rise × 8.34) / (Heating Power (kW) × 3412 × Efficiency) × 60
   * Simplified to:
   * Recovery Time (minutes) = (Tank Capacity × Temperature Rise × 8.34 × 60) / (Heating Power × 3412 × Efficiency)
   * 
   * To avoid confusion, we will use the direct formula:
   * Recovery Time (minutes) = (Tank Capacity × Temperature Rise × 8.34) / (Heating Power × Efficiency × 60)
   * where Heating Power is in kW, Efficiency is decimal (e.g., 0.9)
   * 
   * We'll clarify this in editorial.
   */

  const [inputs, setInputs] = useState({
    tankCapacity: "",
    heatingPower: "",
    temperatureRise: "",
    efficiency: "90",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const tankCapacity = parseFloat(inputs.tankCapacity);
    const heatingPower = parseFloat(inputs.heatingPower);
    const temperatureRise = parseFloat(inputs.temperatureRise);
    const efficiencyPercent = parseFloat(inputs.efficiency);

    if (
      !tankCapacity ||
      tankCapacity <= 0 ||
      !heatingPower ||
      heatingPower <= 0 ||
      !temperatureRise ||
      temperatureRise <= 0 ||
      !efficiencyPercent ||
      efficiencyPercent <= 0 ||
      efficiencyPercent > 100
    ) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter valid positive numbers for all inputs. Efficiency must be between 1 and 100%.",
        formulaUsed: "",
      };
    }

    // Convert efficiency to decimal
    const efficiency = efficiencyPercent / 100;

    // Constants
    const waterWeightPerGallon = 8.34; // lbs
    const heatingPowerBTUperHr = heatingPower * 3412; // kW to BTU/hr

    // Recovery time in hours = (Tank Capacity × Temp Rise × Water Weight) / (Heating Power BTU/hr × Efficiency)
    const recoveryTimeHours = (tankCapacity * temperatureRise * waterWeightPerGallon) / (heatingPowerBTUperHr * efficiency);

    // Convert hours to minutes
    const recoveryTimeMinutes = recoveryTimeHours * 60;

    // Format result with 1 decimal place
    const formattedTime = recoveryTimeMinutes.toFixed(1);

    return {
      value: `${formattedTime} minutes`,
      label: "Estimated Recovery Time",
      subtext: `Based on your inputs, it will take approximately ${formattedTime} minutes for your water heater to recover.`,
      warning: null,
      formulaUsed:
        "Recovery Time (minutes) = (Tank Capacity (gal) × Temperature Rise (°F) × 8.34) / (Heating Power (kW) × 3412 × Efficiency) × 60",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is water heater recovery time?",
      answer: "Recovery time is how long it takes your water heater to reheat a full tank after hot water is depleted. A 50-gallon tank with an 4 kW element typically recovers in 1-2 hours.",
    },
    {
      question: "How does tank size affect recovery time?",
      answer: "Larger tanks take longer to heat; a 75-gallon tank requires 50% more recovery time than a 50-gallon tank with identical heating elements.",
    },
    {
      question: "What's the difference between gas and electric recovery times?",
      answer: "Gas water heaters recover 2-3 times faster than electric models; a gas 40-gallon tank recovers in 30-40 minutes versus 1-2 hours for electric.",
    },
    {
      question: "Does incoming water temperature affect recovery time?",
      answer: "Yes—cold incoming water (40°F) requires more energy to heat than warm water (60°F), extending recovery time by 15-25% depending on climate.",
    },
    {
      question: "Can I reduce my water heater recovery time?",
      answer: "Upgrade to a higher-capacity heating element, insulate the tank, or consider a tankless water heater for instant recovery and 24-44% energy savings.",
    },
    {
      question: "What heater wattage should I use in calculations?",
      answer: "Standard electric elements are 4-6 kW (3,800-5,500 watts); check your water heater's nameplate or manual for exact specifications.",
    },
    {
      question: "How accurate is this recovery time estimate?",
      answer: "Estimates assume 100°F temperature rise and optimal heating conditions; actual times vary 10-20% based on thermostat settings and element efficiency.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="tankCapacity" className="flex items-center gap-2">
              <Droplets /> Tank Capacity (gallons)
            </Label>
            <Input
              id="tankCapacity"
              type="text"
              inputMode="decimal"
              placeholder="e.g., 40"
              value={inputs.tankCapacity}
              onChange={(e) => handleInputChange("tankCapacity", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="heatingPower" className="flex items-center gap-2">
              <Zap /> Heating Power (kW)
            </Label>
            <Input
              id="heatingPower"
              type="text"
              inputMode="decimal"
              placeholder="e.g., 4.5"
              value={inputs.heatingPower}
              onChange={(e) => handleInputChange("heatingPower", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="temperatureRise" className="flex items-center gap-2">
              <Scale /> Temperature Rise (°F)
            </Label>
            <Input
              id="temperatureRise"
              type="text"
              inputMode="decimal"
              placeholder="e.g., 70"
              value={inputs.temperatureRise}
              onChange={(e) => handleInputChange("temperatureRise", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="efficiency" className="flex items-center gap-2">
              <Leaf /> Efficiency (%)
            </Label>
            <Input
              id="efficiency"
              type="text"
              inputMode="decimal"
              placeholder="e.g., 90"
              value={inputs.efficiency}
              onChange={(e) => handleInputChange("efficiency", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              tankCapacity: "",
              heatingPower: "",
              temperatureRise: "",
              efficiency: "90",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-yellow-50 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700">
          <CardContent className="text-yellow-800 dark:text-yellow-300 text-center font-semibold">
            <AlertTriangle className="inline-block mr-2" /> {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Water Heater Recovery Time Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines how long your water heater takes to reheat a full tank after use. Enter your tank size, heating element wattage or BTU output, and desired temperature rise to get an accurate recovery time estimate.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include tank capacity (in gallons), heating element power (in watts or BTU/hour), and the temperature difference between incoming water and your target temperature. The calculator uses these values to compute energy requirements and heating duration.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show recovery time in minutes or hours. Compare estimates across different tank and element combinations to identify which setup best matches your household's hot water demand and usage patterns.</p>
        </div>
      </section>

      {/* TABLE: Typical Water Heater Recovery Times by Type and Size */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Typical Water Heater Recovery Times by Type and Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recovery times vary significantly based on fuel type, tank capacity, and heating element power.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tank Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Electric (4 kW)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Electric (5.5 kW)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gas (40,000 BTU)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tankless</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Instant</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">43 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Instant</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">54 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Instant</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">113 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">81 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">52 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Instant</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">108 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Instant</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Times assume 100°F temperature rise and average incoming water temperature of 50°F. Gas recovery based on standard residential BTU ratings.</p>
      </section>

      {/* TABLE: Water Heater Element Specifications and Energy Output */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Water Heater Element Specifications and Energy Output</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Heating element wattage and BTU output directly impact recovery time calculations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Element Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wattage (Watts)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BTU/Hour</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Recovery (50-gal)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard Electric</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,800–4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13,000–13,650</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75–85 min</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Efficiency Electric</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18,770</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">54–60 min</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dual Element (Simultaneous)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,000–9,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27,300–30,700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40–45 min</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard Gas (Residential)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40,000 BTU</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35–40 min</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Capacity Gas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50,000+ BTU</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50,000+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–30 min</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Electric wattage conversions: 1 watt ≈ 3.41 BTU/hour. Dual-element systems heat from top and bottom simultaneously, reducing recovery time significantly.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Insulate your water heater tank and hot water pipes to reduce heat loss and improve effective recovery by up to 10–15%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Choose a higher-wattage heating element (5.5 kW instead of 4 kW) to reduce recovery time by 25–30% with minimal cost increase.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check your water heater's nameplate rating—nameplate wattage is more accurate than estimates when calculating true recovery time.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider tankless water heaters if recovery time is critical; they provide unlimited hot water without tank-based recovery delays.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Tank Capacity with Recovery Volume</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Recovery time applies to reheating the entire tank—not partial refills; using only half your tank capacity will cut recovery time by roughly 50%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Incoming Water Temperature Variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Seasonal changes shift incoming water temperature from 40°F (winter) to 60°F (summer), varying recovery time by 15–20% without changing your heater.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Nameplate vs. Actual Element Wattage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Older or degraded heating elements deliver less power than their nameplate rating; actual recovery times may be 10–20% longer than theoretical estimates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Thermostat Setpoint Impact</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Setting your thermostat lower (120°F vs. 140°F) reduces recovery time; each 10°F reduction cuts recovery by roughly 8–10%.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is water heater recovery time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recovery time is how long it takes your water heater to reheat a full tank after hot water is depleted. A 50-gallon tank with an 4 kW element typically recovers in 1-2 hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does tank size affect recovery time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Larger tanks take longer to heat; a 75-gallon tank requires 50% more recovery time than a 50-gallon tank with identical heating elements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between gas and electric recovery times?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gas water heaters recover 2-3 times faster than electric models; a gas 40-gallon tank recovers in 30-40 minutes versus 1-2 hours for electric.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does incoming water temperature affect recovery time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—cold incoming water (40°F) requires more energy to heat than warm water (60°F), extending recovery time by 15-25% depending on climate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I reduce my water heater recovery time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Upgrade to a higher-capacity heating element, insulate the tank, or consider a tankless water heater for instant recovery and 24-44% energy savings.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What heater wattage should I use in calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard electric elements are 4-6 kW (3,800-5,500 watts); check your water heater's nameplate or manual for exact specifications.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is this recovery time estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Estimates assume 100°F temperature rise and optimal heating conditions; actual times vary 10-20% based on thermostat settings and element efficiency.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.energy.gov/energysaver/water-heating" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy - Water Heating Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidance on water heater types, efficiency ratings, and recovery time optimization strategies.</p>
          </li>
          <li>
            <a href="https://www.ashrae.org/technical-resources/standards-and-guidelines" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASHRAE Standards for Water Heater Performance</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standards for water heater testing, recovery time measurement, and efficiency benchmarks.</p>
          </li>
          <li>
            <a href="https://www.energystar.gov/products/water_heaters" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Water Heater Buyer's Guide - Energy Star</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Energy Star certified water heater comparisons, recovery time data, and long-term operating cost estimates.</p>
          </li>
          <li>
            <a href="https://www.awwa.org/resources-tools/standards" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Water Works Association - Water Quality Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical standards for residential water heating systems and temperature maintenance requirements.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Water Heater Recovery Time Estimator"
      description="Estimate water heater recovery time. Calculate how long it takes for your tank to provide hot water again after depletion."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Recovery Time (minutes) = (Tank Capacity (gal) × Temperature Rise (°F) × 8.34) / (Heating Power (kW) × 3412 × Efficiency) × 60",
        variables: [
          { symbol: "Tank Capacity", description: "Volume of water in the tank (gallons)" },
          { symbol: "Temperature Rise", description: "Difference between cold and hot water temperature (°F)" },
          { symbol: "8.34", description: "Weight of one gallon of water (lbs)" },
          { symbol: "Heating Power", description: "Power of heating element (kilowatts)" },
          { symbol: "3412", description: "Conversion factor from kW to BTU/hr" },
          { symbol: "Efficiency", description: "Efficiency of the water heater (decimal)" },
          { symbol: "60", description: "Conversion from hours to minutes" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Suppose you have a 40-gallon electric water heater with a heating element rated at 4.5 kW. The incoming cold water temperature is 50°F, and you want to heat it to 120°F. The water heater efficiency is approximately 90%.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate the temperature rise: 120°F - 50°F = 70°F.",
          },
          {
            label: "Step 2",
            explanation:
              "Convert efficiency to decimal: 90% = 0.9.",
          },
          {
            label: "Step 3",
            explanation:
              "Apply the formula: Recovery Time = (40 × 70 × 8.34) / (4.5 × 3412 × 0.9) × 60.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate numerator: 40 × 70 × 8.34 = 23352.",
          },
          {
            label: "Step 5",
            explanation:
              "Calculate denominator: 4.5 × 3412 × 0.9 = 13806.6.",
          },
          {
            label: "Step 6",
            explanation:
              "Divide and convert to minutes: (23352 / 13806.6) × 60 ≈ 101.5 minutes.",
          },
        ],
        result: "The estimated recovery time is approximately 101.5 minutes.",
      }}
      relatedCalculators={[
        { title: "Steps → Distance Converter", url: "/everyday/steps-to-distance-converter", icon: "💡" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday/hydration-reminder-interval", icon: "💡" },
        { title: "Life Expectancy Calculator", url: "/everyday/life-expectancy", icon: "💡" },
        { title: "Basal Metabolic Rate (BMR) Calculator", url: "/everyday/bmr-calculator", icon: "💡" },
        { title: "Caffeine Max per Day Calculator", url: "/everyday/caffeine-max-per-day", icon: "💡" },
        { title: "Leftovers Cooling & Reheat Time", url: "/everyday/leftovers-cooling-reheat-time", icon: "💡" },
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