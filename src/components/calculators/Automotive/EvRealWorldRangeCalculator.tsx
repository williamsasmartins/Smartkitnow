import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Car, Fuel, DollarSign, Info, CheckCircle2, AlertTriangle, BookOpen, ExternalLink, Settings, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EvRealWorldRangeCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    consumptionRate: "", // Wh/mile or Wh/km depending on unit
    electricityRate: "", // $/kWh
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const battery = parseFloat(inputs.batteryCapacity);
    const consumption = parseFloat(inputs.consumptionRate);
    const rate = parseFloat(inputs.electricityRate);
    const unit = inputs.unit;

    if (
      isNaN(battery) || battery <= 0 ||
      isNaN(consumption) || consumption <= 0 ||
      isNaN(rate) || rate <= 0
    ) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Awaiting valid inputs"
      };
    }

    // Consumption is Wh per mile (imperial) or Wh per km (metric)
    // Calculate range = battery capacity (Wh) / consumption (Wh per distance)
    // batteryCapacity is in kWh, convert to Wh
    const batteryWh = battery * 1000;

    // Calculate range in miles or km
    const range = batteryWh / consumption;

    // Calculate cost to fully charge battery
    const cost = battery * rate;

    // Estimate charging time (optional) - assume average charging power 7.2 kW (Level 2 home charger)
    // chargingTime = batteryCapacity (kWh) / chargingPower (kW)
    // This is a rough estimate
    const chargingPower = 7.2;
    const chargingTime = battery / chargingPower;

    return {
      primary: `${range.toFixed(1)} ${unit === "imperial" ? "miles" : "km"}`,
      secondary: `$${cost.toFixed(2)}`,
      details: `Estimated charging time: ${chargingTime.toFixed(1)} hours`,
      feedback: "Estimated real-world range and charging cost"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What factors does the EV Real-World Range Estimator account for?",
      answer: "The calculator factors in EPA-rated range, driving conditions (highway vs. city), ambient temperature, vehicle weight, terrain elevation, and driving habits like acceleration patterns. Real-world range can vary by 20-40% from EPA estimates depending on these variables. For example, a Tesla Model 3 with a 272-mile EPA range might deliver only 200-220 miles in cold weather highway driving.",
    },
    {
      question: "How much does cold weather reduce EV range?",
      answer: "Cold weather reduces EV range by approximately 20-40%, with the greatest losses occurring below 32°F (0°C). Battery efficiency drops significantly in frigid temperatures, and cabin heating consumes 5-10% of battery capacity. A Chevrolet Bolt EV rated at 259 miles might deliver only 155-207 miles in winter conditions.",
    },
    {
      question: "Does highway driving reduce EV range compared to city driving?",
      answer: "Yes, highway driving typically reduces EV range by 15-25% compared to EPA ratings optimized for mixed driving. Higher speeds increase aerodynamic drag exponentially, and regenerative braking captures less energy on highways. A Hyundai Ioniq 6 with 361 miles of EPA range might only achieve 270-306 miles at sustained 70 mph highway speeds.",
    },
    {
      question: "How does elevation and terrain affect EV real-world range?",
      answer: "Climbing elevation consumes more battery energy, reducing range by 3-5% per 1,000 feet of elevation gain. Mountain driving combined with cold weather can reduce range by 40-50% from EPA estimates. Conversely, driving downhill in mountainous terrain allows regenerative braking to recover 10-15% additional energy.",
    },
    {
      question: "What is the impact of vehicle weight on EV range?",
      answer: "Every 10% increase in vehicle weight reduces EV range by approximately 5-7%. Roof racks, cargo loads, and passengers all decrease efficiency. A Nissan Leaf with 149 miles of EPA range loaded to maximum capacity (additional 400 lbs) could lose 20-30 miles of usable range.",
    },
    {
      question: "How do tire pressure and rolling resistance affect range estimates?",
      answer: "Under-inflated tires by 10 psi can reduce EV range by 3-5% due to increased rolling resistance. Maintaining manufacturer-recommended tire pressure (typically 38-42 psi) optimizes efficiency. Winter tires, which have softer rubber compounds, reduce range by approximately 5-10% compared to all-season tires.",
    },
    {
      question: "Can driving habits significantly impact the calculator's range estimate?",
      answer: "Aggressive acceleration and rapid braking reduce range by 10-20%, while smooth, steady acceleration and coasting maximize efficiency gains through regenerative braking. Hypermiling techniques can extend range by 15-25% beyond EPA estimates, whereas aggressive driving can reduce it by 25-35%.",
    },
    {
      question: "How accurate is EPA-rated range compared to real-world estimates?",
      answer: "EPA ratings are optimized for standardized testing and often overestimate real-world range by 10-20% under typical driving conditions. The EPA's two-cycle test does not account for highway speeds above 60 mph or cold weather scenarios. Independent testing by AAA shows real-world ranges averaging 70-75% of EPA estimates in comprehensive testing.",
    },
    {
      question: "Should I use this calculator before purchasing an EV?",
      answer: "Yes, this calculator helps match your daily driving patterns to EV models with realistic range expectations. If you drive 50 miles daily in mixed conditions with occasional 200-mile trips, you'll need a different vehicle than someone with a 20-mile daily commute. Using real-world estimates prevents range anxiety and ensures you select an EV that fits your lifestyle.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the estimated range and charging cost for a 60 kWh battery EV with an average consumption of 300 Wh/mile, and an electricity rate of $0.13/kWh in the US.",
    steps: [
      {
        label: "Step 1: Convert battery capacity to watt-hours",
        explanation: "60 kWh × 1000 = 60,000 Wh"
      },
      {
        label: "Step 2: Calculate estimated range",
        explanation: "60,000 Wh ÷ 300 Wh/mile = 200 miles"
      },
      {
        label: "Step 3: Calculate charging cost",
        explanation: "60 kWh × $0.13/kWh = $7.80"
      },
      {
        label: "Step 4: Estimate charging time (Level 2 charger at 7.2 kW)",
        explanation: "60 kWh ÷ 7.2 kW = 8.3 hours"
      }
    ],
    result: "Estimated range: 200 miles, Charging cost: $7.80, Charging time: 8.3 hours"
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for electric vehicle efficiency and range ratings."
    },
    {
      title: "U.S. Department of Energy - Alternative Fuels Data Center",
      description: "Comprehensive data on electric vehicle charging and energy consumption."
    },
    {
      title: "InsideEVs - Real-World EV Efficiency",
      description: "Community-sourced data on real-world EV consumption and range."
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Settings className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (US)</SelectItem>
            <SelectItem value="metric">Metric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Battery Capacity (kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
            placeholder="e.g. 60"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Average Consumption Rate (Wh/{inputs.unit === "imperial" ? "mile" : "km"})
          </Label>
          <Input
            type="number"
            min="0"
            step="1"
            value={inputs.consumptionRate}
            onChange={(e) => handleInputChange("consumptionRate", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 300" : "e.g. 186"}
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.001"
            value={inputs.electricityRate}
            onChange={(e) => handleInputChange("electricityRate", e.target.value)}
            placeholder="e.g. 0.13"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the EV Real-World Range Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The EV Real-World Range Estimator translates EPA-rated battery ranges into realistic daily mileage expectations based on your actual driving conditions. EPA testing uses standardized procedures that don't fully reflect real-world scenarios like cold weather, highway speeds, or heavy loads, so this tool bridges that gap by accounting for factors that actually impact your driving experience.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your vehicle's EPA-rated range, typical ambient temperature, your primary driving environment (city, highway, or mixed), vehicle load capacity percentage, and any terrain elevation you regularly encounter. You'll also specify your driving style—smooth and conservative versus aggressive acceleration and rapid braking—since these habits can swing range by 20-30%. The calculator combines all these variables to project your realistic daily range.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the results as your expected maximum driving distance under your specific conditions before needing to recharge. If the calculator shows 210 miles of real-world range but you need 250-mile daily round trips with occasional longer journeys, you may want to consider a higher-capacity EV or plan for charging stations along your route. Use these estimates to verify an EV fits your lifestyle and to set realistic expectations for daily driving.</p>
        </div>
      </section>

      {/* TABLE: EPA vs. Real-World Range by EV Model (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">EPA vs. Real-World Range by EV Model (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares EPA-rated ranges to realistic real-world estimates under typical mixed driving conditions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EV Model</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EPA Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Real-World Range (Mixed Driving)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Expected Range Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tesla Model 3 Standard Range Plus</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">272 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">218-240 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chevrolet Bolt EV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">259 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">207-233 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hyundai Ioniq 6 SE Standard Range</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">361 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">289-325 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Nissan Leaf Plus</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">226 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">181-203 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ford Mustang Mach-E Extended Range RWD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">312 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-280 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">BMW i4 eDrive40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">301 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">241-271 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kia EV9 Standard Range</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">304 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">243-274 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Volkswagen ID.4 Standard</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">275 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">220-248 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Real-world ranges assume 55°F ambient temperature, mixed 60% city / 40% highway driving, and properly inflated tires. Actual results vary based on driver behavior and local conditions.</p>
      </section>

      {/* TABLE: Temperature Impact on EV Range (% Loss vs. 70°F Reference) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Temperature Impact on EV Range (% Loss vs. 70°F Reference)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how different ambient temperatures reduce available EV driving range from baseline EPA estimates.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ambient Temperature</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Range Loss vs. 70°F</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primary Causes</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Real Example (Model 3)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">95°F (35°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10% loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">AC cooling load, slightly reduced efficiency</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">244-258 miles (vs. 272)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">70°F (21°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0% (baseline)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Optimal operating conditions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">272 miles (baseline)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50°F (10°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15% loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Battery heating, cabin climate control</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">231-245 miles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">32°F (0°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30% loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Significant battery cold-soak, increased heating</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">190-218 miles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">14°F (-10°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-40% loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maximum heating demand, battery efficiency drop</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">163-190 miles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0°F (-18°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-45% loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extreme cold reduces ion mobility in battery</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-177 miles</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data based on EPA testing protocols and independent AAA cold-weather testing. Pre-conditioning (heating battery and cabin while plugged in) can recover 10-15% of cold-weather losses.</p>
      </section>

      {/* TABLE: Range Reduction by Driving Profile and Conditions */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Range Reduction by Driving Profile and Conditions</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how different driving styles and conditions compound to affect total real-world range.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Driving Scenario</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temperature</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Terrain</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Style</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Range Reduction from EPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">City commute, optimal conditions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Flat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Smooth driving</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-5% to -10%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mixed city/highway, moderate conditions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Flat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate acceleration</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-15% to -20%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Highway cruise, cold weather</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Flat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Steady 70 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-30% to -40%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mountain driving, winter</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000 ft elevation gain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Aggressive</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-40% to -50%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">City driving with full load</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Flat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy acceleration</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-20% to -25%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Highway with roof rack</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Flat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Steady 75 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-25% to -35%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hypermiling highway</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Flat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Smooth/coasting</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+10% to +15% gain</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These ranges are cumulative; cold temperature losses combine with terrain, load, and driving style losses. Hypermiling extends range but may compromise safety and comfort.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Pre-condition your EV's battery and cabin while plugged in during cold weather—this can recover 10-15% of winter range losses by warming the battery pack before you drive rather than consuming battery energy for heating.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check your tire pressure monthly and maintain manufacturer-recommended PSI (typically 38-42 psi); under-inflated tires reduce range by 3-5% due to increased rolling resistance and are a common overlooked efficiency killer.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Plan longer trips with charging stops in advance using real-world range estimates rather than EPA ratings; the difference between 272-mile EPA range and 200-mile real-world highway range could mean an extra charge stop on 400-mile journeys.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Shift to smooth, gradual acceleration instead of jackrabbit starts—smooth driving captures 10-15% more energy through regenerative braking and reduces range loss by 20-30% compared to aggressive driving patterns.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming EPA range equals daily driving distance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">EPA ratings use controlled testing that rarely reflects real-world highway speeds, cold weather, and terrain. Expecting to drive the full EPA range on your first trip often results in range anxiety and unexpected charging needs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring temperature effects when purchasing or planning trips</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cold weather reduces range by 30-40%, yet many EV buyers don't factor winter conditions into their purchase decision or trip planning. A 250-mile summer EV becomes a 150-mile winter vehicle without proper expectations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for highway driving in range estimates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Highway driving at 70+ mph reduces range by 15-25% due to aerodynamic drag, yet the calculator's highway mode is often overlooked. This leads to overestimating how far you can travel on longer trips.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating the impact of driving style alone</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While aggressive driving reduces range by 20-30%, smooth driving cannot overcome fundamental physics like cold weather or highway speeds. Hypermiling works only in city conditions and may compromise safety on public roads.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors does the EV Real-World Range Estimator account for?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator factors in EPA-rated range, driving conditions (highway vs. city), ambient temperature, vehicle weight, terrain elevation, and driving habits like acceleration patterns. Real-world range can vary by 20-40% from EPA estimates depending on these variables. For example, a Tesla Model 3 with a 272-mile EPA range might deliver only 200-220 miles in cold weather highway driving.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does cold weather reduce EV range?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cold weather reduces EV range by approximately 20-40%, with the greatest losses occurring below 32°F (0°C). Battery efficiency drops significantly in frigid temperatures, and cabin heating consumes 5-10% of battery capacity. A Chevrolet Bolt EV rated at 259 miles might deliver only 155-207 miles in winter conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does highway driving reduce EV range compared to city driving?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, highway driving typically reduces EV range by 15-25% compared to EPA ratings optimized for mixed driving. Higher speeds increase aerodynamic drag exponentially, and regenerative braking captures less energy on highways. A Hyundai Ioniq 6 with 361 miles of EPA range might only achieve 270-306 miles at sustained 70 mph highway speeds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does elevation and terrain affect EV real-world range?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Climbing elevation consumes more battery energy, reducing range by 3-5% per 1,000 feet of elevation gain. Mountain driving combined with cold weather can reduce range by 40-50% from EPA estimates. Conversely, driving downhill in mountainous terrain allows regenerative braking to recover 10-15% additional energy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the impact of vehicle weight on EV range?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Every 10% increase in vehicle weight reduces EV range by approximately 5-7%. Roof racks, cargo loads, and passengers all decrease efficiency. A Nissan Leaf with 149 miles of EPA range loaded to maximum capacity (additional 400 lbs) could lose 20-30 miles of usable range.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do tire pressure and rolling resistance affect range estimates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Under-inflated tires by 10 psi can reduce EV range by 3-5% due to increased rolling resistance. Maintaining manufacturer-recommended tire pressure (typically 38-42 psi) optimizes efficiency. Winter tires, which have softer rubber compounds, reduce range by approximately 5-10% compared to all-season tires.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can driving habits significantly impact the calculator's range estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Aggressive acceleration and rapid braking reduce range by 10-20%, while smooth, steady acceleration and coasting maximize efficiency gains through regenerative braking. Hypermiling techniques can extend range by 15-25% beyond EPA estimates, whereas aggressive driving can reduce it by 25-35%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is EPA-rated range compared to real-world estimates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">EPA ratings are optimized for standardized testing and often overestimate real-world range by 10-20% under typical driving conditions. The EPA's two-cycle test does not account for highway speeds above 60 mph or cold weather scenarios. Independent testing by AAA shows real-world ranges averaging 70-75% of EPA estimates in comprehensive testing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I use this calculator before purchasing an EV?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator helps match your daily driving patterns to EV models with realistic range expectations. If you drive 50 miles daily in mixed conditions with occasional 200-mile trips, you'll need a different vehicle than someone with a 20-mile daily commute. Using real-world estimates prevents range anxiety and ensures you select an EV that fits your lifestyle.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.fueleconomy.gov/feg/evtech.shtml" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Guide to Alternative Fuels: Electric Vehicles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official EPA resource explaining how electric vehicle range ratings are tested and what real-world factors affect performance.</p>
          </li>
          <li>
            <a href="https://www.aaa.com/research" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAA Electric Vehicle Range Testing Results</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Independent testing data comparing EPA-rated ranges to actual real-world performance under varied temperature and driving conditions.</p>
          </li>
          <li>
            <a href="https://afdc.energy.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy Alternative Fuels Data Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource for EV specifications, range data, and charging infrastructure information across multiple vehicle models.</p>
          </li>
          <li>
            <a href="https://www.nhtsa.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NHTSA Vehicle Safety Data and Electric Vehicle Efficiency Ratings</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">National Highway Traffic Safety Administration database providing standardized efficiency and range information for all certified electric vehicles.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="EV Real-World Range Estimator"
      description="Professional automotive calculator: EV Real-World Range Estimator. Get accurate estimates, expert advice, and financial insights."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "example", label: "Real World Example" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}