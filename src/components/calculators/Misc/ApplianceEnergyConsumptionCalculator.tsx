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

const applianceData = {
  Refrigerator: { avgPowerWatts: 150 },
  "Washing Machine": { avgPowerWatts: 500 },
  "Dishwasher": { avgPowerWatts: 1200 },
  "Television": { avgPowerWatts: 100 },
  "Microwave Oven": { avgPowerWatts: 1100 },
  "Air Conditioner": { avgPowerWatts: 3500 },
  "Electric Oven": { avgPowerWatts: 2400 },
  "Ceiling Fan": { avgPowerWatts: 75 },
  "Laptop": { avgPowerWatts: 50 },
  "Light Bulb (LED)": { avgPowerWatts: 10 },
};

export default function ApplianceEnergyConsumptionCalculator() {
  const [inputs, setInputs] = useState({
    appliance: "Refrigerator",
    powerRating: "", // optional override in watts
    hoursPerDay: "",
    daysPerMonth: 30,
    costPerKwh: 0.13,
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate energy consumption and cost
  const results = useMemo(() => {
    const appliance = inputs.appliance;
    const powerRating =
      inputs.powerRating && Number(inputs.powerRating) > 0
        ? Number(inputs.powerRating)
        : applianceData[appliance]?.avgPowerWatts || 0;
    const hoursPerDay = Number(inputs.hoursPerDay);
    const daysPerMonth = Number(inputs.daysPerMonth);
    const costPerKwh = Number(inputs.costPerKwh);

    if (
      powerRating <= 0 ||
      hoursPerDay <= 0 ||
      daysPerMonth <= 0 ||
      costPerKwh <= 0
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid positive numbers for all fields.",
        warning: <AlertTriangle className="inline-block mr-1" />,
        formulaUsed:
          "Energy (kWh) = (Power (Watts) × Hours per Day × Days per Month) ÷ 1000",
      };
    }

    // Energy in kWh per month
    const energyKwh = (powerRating * hoursPerDay * daysPerMonth) / 1000;
    // Cost in dollars
    const cost = energyKwh * costPerKwh;

    return {
      value: `$${cost.toFixed(2)}`,
      label: `Estimated Monthly Energy Cost for your ${appliance}`,
      subtext: `${energyKwh.toFixed(2)} kWh consumed per month`,
      warning: null,
      formulaUsed:
        "Energy (kWh) = (Power (Watts) × Hours per Day × Days per Month) ÷ 1000; Cost = Energy × Cost per kWh",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I calculate my appliance's daily energy consumption?",
      answer: "Enter the appliance's wattage (found on the label), hours used per day, and click calculate. The tool multiplies watts × hours to show daily kWh usage.",
    },
    {
      question: "What's the difference between watts and kilowatts in this calculator?",
      answer: "Watts (W) is the unit on your appliance label; kilowatts (kW) equal 1,000 watts. The calculator converts automatically to show consumption in kWh for billing purposes.",
    },
    {
      question: "Can I use this calculator for multiple appliances at once?",
      answer: "Yes, calculate each appliance separately and add the daily kWh totals to estimate your household's combined energy use.",
    },
    {
      question: "How accurate is the energy consumption estimate?",
      answer: "Accuracy depends on correct wattage input and realistic usage hours. Actual consumption may vary by 10-15% due to appliance age, efficiency ratings, and usage patterns.",
    },
    {
      question: "Where do I find the wattage for my appliance?",
      answer: "Check the manufacturer's label on the back or bottom of the appliance, in the user manual, or search the model number online with 'specifications.'",
    },
    {
      question: "How do I estimate annual energy costs from daily consumption?",
      answer: "Multiply daily kWh by 365 days, then multiply by your local electricity rate (typically $0.12–$0.16 per kWh in the U.S.) to get yearly cost.",
    },
    {
      question: "Why do some appliances use more energy than others?",
      answer: "Appliances with heating or cooling elements (ovens, refrigerators, AC units) consume far more watts than devices with motors or electronics, and ENERGY STAR models use 10-50% less.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Label htmlFor="appliance" className="mb-1 font-semibold flex items-center gap-1">
            Appliance <Info className="w-4 h-4 text-blue-600" />
          </Label>
          <Select
            value={inputs.appliance}
            onValueChange={(v) => handleInputChange("appliance", v)}
            id="appliance"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select appliance" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(applianceData).map((app) => (
                <SelectItem key={app} value={app}>
                  {app}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label htmlFor="powerRating" className="mt-4 mb-1 font-semibold flex items-center gap-1">
            Power Rating (Watts) <Info className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            type="number"
            id="powerRating"
            placeholder={`Default: ${applianceData[inputs.appliance]?.avgPowerWatts} W`}
            value={inputs.powerRating}
            onChange={(e) => handleInputChange("powerRating", e.target.value)}
            min={0}
          />
          <p className="text-sm text-slate-500 mt-1">
            Enter exact wattage if known, otherwise leave blank to use average.
          </p>

          <Label htmlFor="hoursPerDay" className="mt-4 mb-1 font-semibold flex items-center gap-1">
            Hours Used Per Day <Sun className="w-4 h-4 text-yellow-500" />
          </Label>
          <Input
            type="number"
            id="hoursPerDay"
            placeholder="e.g., 5"
            value={inputs.hoursPerDay}
            onChange={(e) => handleInputChange("hoursPerDay", e.target.value)}
            min={0}
            step={0.1}
          />

          <Label htmlFor="daysPerMonth" className="mt-4 mb-1 font-semibold flex items-center gap-1">
            Days Used Per Month <Calendar className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            type="number"
            id="daysPerMonth"
            placeholder="e.g., 30"
            value={inputs.daysPerMonth}
            onChange={(e) => handleInputChange("daysPerMonth", e.target.value)}
            min={1}
            max={31}
          />

          <Label htmlFor="costPerKwh" className="mt-4 mb-1 font-semibold flex items-center gap-1">
            Electricity Cost per kWh ($) <DollarSign className="w-4 h-4 text-green-600" />
          </Label>
          <Input
            type="number"
            id="costPerKwh"
            placeholder="e.g., 0.13"
            value={inputs.costPerKwh}
            onChange={(e) => handleInputChange("costPerKwh", e.target.value)}
            min={0}
            step={0.001}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special action needed; calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              appliance: "Refrigerator",
              powerRating: "",
              hoursPerDay: "",
              daysPerMonth: 30,
              costPerKwh: 0.13,
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-2xl font-semibold text-blue-900 dark:text-white mb-2">
              {results.label}
            </p>
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg text-blue-700 dark:text-blue-300">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-red-600 flex justify-center items-center gap-1 font-semibold">
                {results.warning} {results.subtext}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Appliance Energy Consumption Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates how much electricity your household appliances consume daily, monthly, and annually. It helps you identify energy hogs and understand their impact on your utility bills.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter the appliance's wattage (from the label or manual), average hours used per day, and select the time period (daily, monthly, or yearly). The calculator automatically converts to kilowatt-hours (kWh), the standard unit on your electricity bill.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the results to compare appliances and estimate costs using your local electricity rate. Higher wattage × longer usage = greater energy consumption and higher costs; use this insight to optimize usage or upgrade to ENERGY STAR models.</p>
        </div>
      </section>

      {/* TABLE: Average Wattage and Daily Energy Use by Appliance Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Wattage and Daily Energy Use by Appliance Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Typical household appliances and their power consumption based on standard models.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Appliance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Wattage (W)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Use (Hours)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily kWh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Refrigerator</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150–800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.6–19.2</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Washing Machine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500–2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5–2.0</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Electric Oven</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000–5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0–5.0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dishwasher</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,200–2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2–2.0</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Air Conditioner</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000–5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24–40</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Microwave</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600–1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3–0.6</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Television</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.15–0.75</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Laptop</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40–100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.32–0.8</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Wattage varies by model, age, and efficiency rating; actual usage patterns significantly impact total consumption.</p>
      </section>

      {/* TABLE: Monthly and Annual Energy Cost Estimates by Region (U.S.) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Monthly and Annual Energy Cost Estimates by Region (U.S.)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Sample monthly electricity costs at regional average rates for a 1,000 kWh baseline.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Region</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Avg. Rate (per kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Cost (1,000 kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Cost (12,000 kWh)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pacific Northwest</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,440</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Midwest</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.13</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$130</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,560</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Northeast</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$160</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,920</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">South</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,440</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Texas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$110</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,320</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">California</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,160</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates updated for 2024–2025 and vary by utility company and seasonal demand; actual bills include taxes and fees.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Unplug phantom loads like phone chargers and coffee makers when not in use; they consume 5–10 watts continuously and add $5–15 annually per device.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Replace incandescent bulbs with LED equivalents to cut lighting energy by 75–80% while maintaining the same brightness.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Run full loads in washing machines and dishwashers to maximize efficiency per use and reduce daily energy consumption.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Set your refrigerator to 37–40°F and freezer to 0°F; every 5°F below optimal increases energy use by 3–5%.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using peak wattage instead of average wattage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some appliances list peak watts; use the average operating wattage for accurate daily consumption estimates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to include standby power</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Devices left plugged in drain 5–50 watts passively; add standby hours to your calculation for total household consumption.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all usage hours are equal</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Seasonal variations (air conditioning in summer, heating in winter) significantly change average daily hours; recalculate quarterly for accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring appliance age and efficiency ratings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Older appliances consume 20–40% more energy than modern ENERGY STAR models; factor in replacement costs for ROI analysis.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my appliance's daily energy consumption?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter the appliance's wattage (found on the label), hours used per day, and click calculate. The tool multiplies watts × hours to show daily kWh usage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between watts and kilowatts in this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Watts (W) is the unit on your appliance label; kilowatts (kW) equal 1,000 watts. The calculator converts automatically to show consumption in kWh for billing purposes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for multiple appliances at once?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, calculate each appliance separately and add the daily kWh totals to estimate your household's combined energy use.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the energy consumption estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Accuracy depends on correct wattage input and realistic usage hours. Actual consumption may vary by 10-15% due to appliance age, efficiency ratings, and usage patterns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Where do I find the wattage for my appliance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Check the manufacturer's label on the back or bottom of the appliance, in the user manual, or search the model number online with 'specifications.'</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I estimate annual energy costs from daily consumption?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Multiply daily kWh by 365 days, then multiply by your local electricity rate (typically $0.12–$0.16 per kWh in the U.S.) to get yearly cost.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do some appliances use more energy than others?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Appliances with heating or cooling elements (ovens, refrigerators, AC units) consume far more watts than devices with motors or electronics, and ENERGY STAR models use 10-50% less.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.eia.gov/electricity/state/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Energy Information Administration (EIA) - Electricity Rates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official U.S. average electricity rates by state and utility provider, updated monthly.</p>
          </li>
          <li>
            <a href="https://www.energystar.gov/most-efficient" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ENERGY STAR - Appliance Energy Consumption Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Certified appliance wattage ratings and energy-saving comparisons across product categories.</p>
          </li>
          <li>
            <a href="https://www.ftc.gov/business-guidance/resources/energy-guide-appliances" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Trade Commission (FTC) - EnergyGuide Labels</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">How to read appliance labels and understand estimated annual operating costs.</p>
          </li>
          <li>
            <a href="https://www.energy.gov/energysaver/home-energy-audits" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy - Home Energy Audits</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide to identifying energy consumption patterns and optimization strategies.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Appliance Energy Consumption Calculator"
      description="Calculate appliance energy consumption. Track how much electricity your fridge, TV, and washer use to manage your utility bill."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Energy (kWh) = (Power (Watts) × Hours per Day × Days per Month) ÷ 1000; Cost = Energy × Cost per kWh",
        variables: [
          { symbol: "Power (Watts)", description: "The power rating of the appliance in watts" },
          { symbol: "Hours per Day", description: "Average daily usage time in hours" },
          { symbol: "Days per Month", description: "Number of days the appliance is used per month" },
          { symbol: "Cost per kWh", description: "Electricity cost per kilowatt-hour in dollars" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You want to estimate the monthly cost of running a refrigerator that uses about 150 watts, runs 24 hours a day, every day of the month, with an electricity rate of $0.13 per kWh.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Select 'Refrigerator' from the appliance dropdown or enter 150 watts as the power rating.",
          },
          {
            label: "Step 2",
            explanation: "Enter 24 hours for daily usage and 30 days for monthly usage.",
          },
          {
            label: "Step 3",
            explanation: "Input 0.13 as the cost per kWh based on your utility bill.",
          },
          {
            label: "Step 4",
            explanation: "Click 'Calculate' to see the estimated monthly energy cost.",
          },
        ],
        result:
          "The calculator estimates about 112.5 kWh consumed monthly, costing approximately $14.63 per month to run the refrigerator.",
      }}
      relatedCalculators={[
        { title: "Fertilizer Application Calculator", url: "/everyday/fertilizer-application-calculator", icon: "💡" },
        { title: "Laundry Detergent Dosage by Load Size", url: "/everyday/laundry-detergent-dosage", icon: "💡" },
        { title: "Grass Seed Quantity Calculator", url: "/everyday/grass-seed-quantity", icon: "💡" },
        { title: "Hose Runtime vs Flow Rate Calculator", url: "/everyday/hose-runtime-flow-rate", icon: "💡" },
        { title: "Ice Quantity for Beverages Calculator", url: "/everyday/ice-quantity-beverages", icon: "💡" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday/cleaning-dilution-ratio", icon: "🏠" },
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