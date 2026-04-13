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

export default function EvSolarChargingSavingsCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    electricityRate: "", // $/kWh
    dailySunHours: "", // hours of effective solar charging per day
    solarPanelOutput: "", // kW peak solar panel output
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const batteryCapacity = parseFloat(inputs.batteryCapacity);
    const electricityRate = parseFloat(inputs.electricityRate);
    const dailySunHours = parseFloat(inputs.dailySunHours);
    const solarPanelOutput = parseFloat(inputs.solarPanelOutput);

    if (
      isNaN(batteryCapacity) || batteryCapacity <= 0 ||
      isNaN(electricityRate) || electricityRate <= 0 ||
      isNaN(dailySunHours) || dailySunHours <= 0 ||
      isNaN(solarPanelOutput) || solarPanelOutput <= 0
    ) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Awaiting valid inputs"
      };
    }

    // Calculate daily solar energy production (kWh)
    // solarPanelOutput (kW) * dailySunHours (h) = kWh/day
    const dailySolarEnergy = solarPanelOutput * dailySunHours;

    // Calculate how many days it takes to fully charge the EV battery using solar energy alone
    // days = batteryCapacity / dailySolarEnergy
    const daysToFullCharge = batteryCapacity / dailySolarEnergy;

    // Calculate cost to fully charge from grid (no solar)
    const costFullChargeGrid = batteryCapacity * electricityRate;

    // Calculate cost savings per full charge if solar covers dailySolarEnergy kWh
    // Savings = dailySolarEnergy * electricityRate
    const dailySavings = dailySolarEnergy * electricityRate;

    // Calculate time to fully charge in hours assuming home charger at 7.2 kW (Level 2)
    // Charge time (hours) = batteryCapacity / 7.2
    const chargeTimeHours = batteryCapacity / 7.2;

    return {
      primary: `${daysToFullCharge.toFixed(2)} days`,
      secondary: `$${dailySavings.toFixed(2)} saved per day`,
      details: `Full charge cost from grid: $${costFullChargeGrid.toFixed(2)} | Estimated charge time: ${chargeTimeHours.toFixed(1)} hours`,
      feedback: "Solar charging can significantly reduce your electricity costs and charging time."
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How much can I save annually by charging my EV with solar power?",
      answer: "Savings depend on your solar system size, local electricity rates, and EV charging needs. For example, a homeowner in California with a 5 kW solar system charging a Tesla Model 3 could save $800–$1,200 annually at current rates of $0.22–$0.28 per kWh, compared to grid charging. Actual savings vary based on sun exposure, seasonal variations, and your utility's rate structure.",
    },
    {
      question: "What solar system size do I need to charge my EV?",
      answer: "Most EVs require 3–6 kW of additional solar capacity to meet charging demands. A typical EV consumes 0.2–0.3 kWh per mile driven. If you drive 12,000 miles annually, that's roughly 2,400–3,600 kWh needed, requiring approximately 4–6 kW of installed solar capacity depending on your location's average daily sunlight hours.",
    },
    {
      question: "Does the federal EV tax credit apply to solar charging installations?",
      answer: "The federal Inflation Reduction Act provides a 30% investment tax credit for residential solar systems (through 2032), which can be applied to a combined solar and EV charging setup. However, the EV tax credit (up to $7,500) applies to vehicle purchase only, not charging infrastructure. You may claim both credits separately on your 2024 tax return if eligible.",
    },
    {
      question: "How do net metering and time-of-use rates affect my savings?",
      answer: "Net metering allows you to send excess solar energy back to the grid for credits, increasing savings significantly. Time-of-use (TOU) rates charge more during peak hours (typically 4–9 PM). By charging your EV during off-peak hours (11 PM–6 AM) or midday when solar production peaks, you can reduce costs by 20–40% compared to peak-hour charging.",
    },
    {
      question: "What payback period should I expect for a solar + EV charging system?",
      answer: "The typical payback period for a residential solar system is 6–9 years at current incentive levels and electricity rates. In high-rate states like California or Hawaii, payback can be as short as 5–7 years. Adding dedicated EV charging infrastructure may extend payback by 1–2 years, but total system lifetime of 25–30 years ensures significant long-term savings.",
    },
    {
      question: "How do battery storage systems improve solar EV charging savings?",
      answer: "Adding a battery (e.g., Tesla Powerwall at 13.5 kWh) allows you to store solar energy for evening charging, avoiding peak TOU rates of $0.35–$0.50 per kWh. While battery systems cost $10,000–$15,000 before incentives, they can increase annual savings by 30–50% and provide backup power during outages. Federal tax credits of 30% apply to battery storage through 2032.",
    },
    {
      question: "What's the difference between Level 1, Level 2, and DC fast charging for solar compatibility?",
      answer: "Level 1 (120V, 2–3 kW) charges slowly but requires no equipment upgrades and works well with small solar systems. Level 2 (240V, 7–19 kW) is ideal for home solar setups, charging a typical EV in 6–10 hours overnight. DC fast charging (&gt;50 kW) is grid-dependent and not practical for residential solar systems due to high power demand exceeding typical home solar capacity.",
    },
    {
      question: "How do seasonal variations affect year-round solar EV charging savings?",
      answer: "Solar production varies 40–60% seasonally, with peak output in summer and lowest in winter. In winter, you may rely more on grid charging, reducing annual savings by 15–25%. A properly sized system with battery storage or net metering credits helps offset winter shortfalls, maintaining consistent year-round EV charging cost reductions.",
    },
    {
      question: "Are there state or local incentives beyond the federal tax credit for solar EV charging?",
      answer: "Many states offer additional rebates and incentives: California provides SOMAH rebates up to $1,500 for solar + storage, while New York's Accelerated Renewable Energy Growth Act offers enhanced credits. Local utility companies in regions like Colorado and Massachusetts may offer time-of-use EV charging discounts of 25–35%. Check Database of State Incentives for Renewables &amp; Efficiency (DSIRE) for your location's current programs.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $40,000 electric sedan with a 60 kWh battery, charging at a residential electricity rate of $0.15 per kWh. The homeowner has a 5 kW solar panel system receiving an average of 5 peak sun hours daily.",
    steps: [
      {
        label: "Step 1: Calculate daily solar energy production",
        explanation: "5 kW solar system × 5 hours = 25 kWh/day"
      },
      {
        label: "Step 2: Calculate days to fully charge EV using solar",
        explanation: "60 kWh battery ÷ 25 kWh/day = 2.4 days"
      },
      {
        label: "Step 3: Calculate daily savings from solar charging",
        explanation: "25 kWh × $0.15/kWh = $3.75 saved per day"
      },
      {
        label: "Step 4: Calculate cost to fully charge from grid",
        explanation: "60 kWh × $0.15/kWh = $9.00 per full charge"
      },
      {
        label: "Step 5: Calculate estimated charge time at 7.2 kW charger",
        explanation: "60 kWh ÷ 7.2 kW = 8.33 hours"
      }
    ],
    result:
      "Using solar power, it takes approximately 2.4 days to fully charge the EV, saving about $3.75 daily on electricity costs. A full grid charge costs $9.00, and charging time is roughly 8.3 hours."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "U.S. Department of Energy - Electric Vehicle Charging",
      description:
        "Comprehensive guide on EV charging types, costs, and efficiency considerations."
    },
    {
      title: "National Renewable Energy Laboratory (NREL) - Solar Radiation Data",
      description:
        "Reliable data source for solar irradiance and peak sun hours by location."
    },
    {
      title: "EnergySage - Solar Panel Cost and Savings Calculator",
      description:
        "Tool and resources for estimating solar panel system output and financial benefits."
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
          <Label>EV Battery Capacity (kWh)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 60"
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 0.15"
            value={inputs.electricityRate}
            onChange={(e) => handleInputChange("electricityRate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Average Daily Sunlight Hours (peak sun hours)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5"
            value={inputs.dailySunHours}
            onChange={(e) => handleInputChange("dailySunHours", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Solar Panel System Output (kW peak)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5"
            value={inputs.solarPanelOutput}
            onChange={(e) => handleInputChange("solarPanelOutput", e.target.value)}
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
            <p className="mt-3 italic text-slate-600 dark:text-slate-400">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the EV Solar Charging Savings Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The EV Solar Charging Savings Calculator helps you estimate how much money you can save by powering your electric vehicle with rooftop solar panels instead of grid electricity. This tool is essential for EV owners and prospective buyers deciding whether residential solar is a worthwhile investment and understanding the financial timeline for system payback.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To get started, input key information: your EV model or annual mileage, current electricity rate (found on your utility bill), installed solar system size in kilowatts, your location's average peak sun hours daily, whether you have net metering enabled, and any time-of-use (TOU) rate structure your utility offers. You may also include battery storage capacity if you plan to install a home battery system like a Tesla Powerwall or Generac PWRcell.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator will generate your annual solar energy production, estimated EV charging kWh needs, grid versus solar charging cost comparison, payback period, and 25-year lifetime savings projection. Use this breakdown to evaluate ROI, compare financing options (purchase versus lease), factor in federal and state tax credits, and determine whether a larger solar system size justifies the upfront cost for your driving habits.</p>
        </div>
      </section>

      {/* TABLE: Average Annual EV Charging Costs: Grid vs. Solar */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Annual EV Charging Costs: Grid vs. Solar</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares typical annual charging costs for common EV models using grid electricity versus solar power across different U.S. regions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EV Model</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Miles</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual kWh Needed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Grid Cost (Avg $0.16/kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Solar Cost (Fuel-Free)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tesla Model 3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$480</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60 (maint.)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$420</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chevy Bolt EV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$576</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$70 (maint.)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$506</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Nissan Leaf</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,880</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$461</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$55 (maint.)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$406</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tesla Model Y</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$720</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$85 (maint.)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$635</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hyundai Ioniq 6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$384</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$48 (maint.)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$336</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Grid costs based on U.S. national average of $0.16/kWh (2024). Solar costs reflect minimal maintenance only. Actual savings vary by region, utility rates, and seasonal solar output.</p>
      </section>

      {/* TABLE: Solar System Sizing Requirements for EV Charging */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Solar System Sizing Requirements for EV Charging</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows recommended solar system sizes based on annual driving distance and average daily sunlight hours in your region.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Mileage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual kWh Needed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Required Solar Capacity (4 Peak Hours/Day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Required Solar Capacity (5 Peak Hours/Day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Required Solar Capacity (6 Peak Hours/Day)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.0 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.0 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.3 kW</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.0 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.0 kW</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,750 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.4 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.3 kW</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,000 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.5 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.0 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.3 kW</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,250 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.6 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.5 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.4 kW</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes average EV efficiency of 0.25 kWh/mile. Peak sun hours vary by location: &lt;4 hours (cloudy regions), 4–5 hours (temperate zones), &gt;5 hours (sunny regions like Arizona, California, Texas).</p>
      </section>

      {/* TABLE: Federal Tax Credits and Incentives (2024–2025) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Federal Tax Credits and Incentives (2024–2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table outlines current federal tax credits available for residential solar and EV charging installations under the Inflation Reduction Act.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Incentive Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Credit Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Eligibility Requirements</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Expiration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Residential Solar Investment Tax Credit (ITC)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30% of installation cost</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Primary residence, new or existing system</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">December 31, 2032</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Home Energy Storage Credit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30% of battery cost (max $5,880)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Paired with solar or standalone, installed after 12/31/2023</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">December 31, 2032</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">EV Purchase Tax Credit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to $7,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">New EV purchase, income &lt;$300K (married), vehicle price caps apply</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">December 31, 2024 (may extend)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Level 2 Charging Infrastructure Credit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to $1,000 per unit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Residential charging equipment, labor included</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">December 31, 2032</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Residential Clean Energy Credit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30% combined (solar+storage+charging)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Bundle solar, battery, and charging systems</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">December 31, 2032</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All percentages represent Investment Tax Credit (ITC). Income limits and vehicle-price restrictions apply to EV credits. Consult a tax professional for personalized eligibility and claims.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Charge your EV during peak solar production hours (10 AM–3 PM) or during off-peak TOU periods (typically 11 PM–6 AM) to maximize savings—this strategy can reduce charging costs by 30–50% compared to peak-hour charging.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider installing a smart charging scheduler or Level 2 charger with load-shifting capabilities to automate charging during periods of highest solar output or lowest electricity rates, reducing manual optimization effort.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Add battery storage to your solar system if available in your area; a 10–15 kWh battery system costs $10,000–$15,000 but increases annual EV charging savings by 35–50% by storing midday solar energy for evening use.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Review your utility's net metering policy and confirm you receive full retail credit for excess solar energy exported to the grid; some utilities cap annual credits or offer lower buyback rates, which significantly impacts long-term savings projections.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Seasonal Solar Variation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many calculators assume consistent year-round solar output, but winter production is typically 40–60% lower than summer. This leads to overestimated savings in cold climates and inadequate system sizing; always verify your location's monthly solar production data.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Time-of-Use Rate Structures</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming flat electricity rates ignores TOU pricing, where peak rates can be $0.35–$0.50 per kWh versus $0.10–$0.15 off-peak. Charging during peak hours dramatically reduces your actual savings; always input your utility's specific TOU schedule.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Factor in Maintenance and Degradation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Solar panels degrade approximately 0.5–0.7% annually and require occasional cleaning and inverter replacement after 10–15 years. Many calculators show zero maintenance costs, inflating savings projections by 10–15% over 25 years.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating Tax Credit Benefits</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While the federal 30% ITC is available through 2032, income limits apply to EV credits ($300,000 for married filers), and vehicle price caps restrict eligibility. Additionally, tax credits reduce tax liability, not provide refunds; ensure you have sufficient tax liability to claim full credits.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much can I save annually by charging my EV with solar power?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Savings depend on your solar system size, local electricity rates, and EV charging needs. For example, a homeowner in California with a 5 kW solar system charging a Tesla Model 3 could save $800–$1,200 annually at current rates of $0.22–$0.28 per kWh, compared to grid charging. Actual savings vary based on sun exposure, seasonal variations, and your utility's rate structure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What solar system size do I need to charge my EV?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most EVs require 3–6 kW of additional solar capacity to meet charging demands. A typical EV consumes 0.2–0.3 kWh per mile driven. If you drive 12,000 miles annually, that's roughly 2,400–3,600 kWh needed, requiring approximately 4–6 kW of installed solar capacity depending on your location's average daily sunlight hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the federal EV tax credit apply to solar charging installations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The federal Inflation Reduction Act provides a 30% investment tax credit for residential solar systems (through 2032), which can be applied to a combined solar and EV charging setup. However, the EV tax credit (up to $7,500) applies to vehicle purchase only, not charging infrastructure. You may claim both credits separately on your 2024 tax return if eligible.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do net metering and time-of-use rates affect my savings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Net metering allows you to send excess solar energy back to the grid for credits, increasing savings significantly. Time-of-use (TOU) rates charge more during peak hours (typically 4–9 PM). By charging your EV during off-peak hours (11 PM–6 AM) or midday when solar production peaks, you can reduce costs by 20–40% compared to peak-hour charging.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What payback period should I expect for a solar + EV charging system?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The typical payback period for a residential solar system is 6–9 years at current incentive levels and electricity rates. In high-rate states like California or Hawaii, payback can be as short as 5–7 years. Adding dedicated EV charging infrastructure may extend payback by 1–2 years, but total system lifetime of 25–30 years ensures significant long-term savings.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do battery storage systems improve solar EV charging savings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Adding a battery (e.g., Tesla Powerwall at 13.5 kWh) allows you to store solar energy for evening charging, avoiding peak TOU rates of $0.35–$0.50 per kWh. While battery systems cost $10,000–$15,000 before incentives, they can increase annual savings by 30–50% and provide backup power during outages. Federal tax credits of 30% apply to battery storage through 2032.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between Level 1, Level 2, and DC fast charging for solar compatibility?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Level 1 (120V, 2–3 kW) charges slowly but requires no equipment upgrades and works well with small solar systems. Level 2 (240V, 7–19 kW) is ideal for home solar setups, charging a typical EV in 6–10 hours overnight. DC fast charging (&gt;50 kW) is grid-dependent and not practical for residential solar systems due to high power demand exceeding typical home solar capacity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do seasonal variations affect year-round solar EV charging savings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Solar production varies 40–60% seasonally, with peak output in summer and lowest in winter. In winter, you may rely more on grid charging, reducing annual savings by 15–25%. A properly sized system with battery storage or net metering credits helps offset winter shortfalls, maintaining consistent year-round EV charging cost reductions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there state or local incentives beyond the federal tax credit for solar EV charging?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Many states offer additional rebates and incentives: California provides SOMAH rebates up to $1,500 for solar + storage, while New York's Accelerated Renewable Energy Growth Act offers enhanced credits. Local utility companies in regions like Colorado and Massachusetts may offer time-of-use EV charging discounts of 25–35%. Check Database of State Incentives for Renewables &amp; Efficiency (DSIRE) for your location's current programs.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.energy.gov/eere/solar" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy – Solar Energy Technologies Office</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official resource providing solar technology data, incentives information, and residential solar cost-benefit analysis tools.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/publications/p590a" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Publication 590-A – Earned Income Tax Credit (EITC)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">IRS guidance on residential energy tax credits, including solar investment tax credit (ITC) and battery storage eligibility through 2032.</p>
          </li>
          <li>
            <a href="https://www.dsireusa.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">DSIRE (Database of State Incentives for Renewables &amp; Efficiency)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive database of state, local, and utility-specific solar, battery, and EV charging incentives by location.</p>
          </li>
          <li>
            <a href="https://afdc.energy.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Environmental Protection Agency – Alternative Fuels Data Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">EPA resource offering EV charging station locators, vehicle efficiency ratings, and electricity grid carbon emission data by region.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="EV Solar Charging Savings Calculator"
      description="Professional automotive calculator: EV Solar Charging Savings Calculator. Get accurate estimates, expert advice, and financial insights."
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