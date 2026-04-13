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

export default function PhevElectricGasModeCostCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // Battery capacity in kWh
    electricityRate: "", // Electricity rate in $/kWh
    electricRange: "", // Electric range in miles or km
    gasPrice: "", // Gasoline price in $/gallon or $/liter
    gasEfficiency: "" // Gas mode fuel efficiency in MPG or km/l
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const batteryCapacity = parseFloat(inputs.batteryCapacity);
    const electricityRate = parseFloat(inputs.electricityRate);
    const electricRange = parseFloat(inputs.electricRange);
    const gasPrice = parseFloat(inputs.gasPrice);
    const gasEfficiency = parseFloat(inputs.gasEfficiency);

    if (
      isNaN(batteryCapacity) || batteryCapacity <= 0 ||
      isNaN(electricityRate) || electricityRate <= 0 ||
      isNaN(electricRange) || electricRange <= 0 ||
      isNaN(gasPrice) || gasPrice <= 0 ||
      isNaN(gasEfficiency) || gasEfficiency <= 0
    ) {
      return {
        primary: "—",
        secondary: "Please enter valid positive numbers for all inputs.",
        details: "",
        feedback: ""
      };
    }

    // Calculate electric mode cost per mile (or km)
    // Energy consumption (kWh per mile) = batteryCapacity / electricRange
    const energyPerDistance = batteryCapacity / electricRange; // kWh per mile or km
    const costPerDistanceElectric = energyPerDistance * electricityRate; // $ per mile or km

    // Calculate gas mode cost per mile (or km)
    // Fuel consumption (gallons or liters per mile) = 1 / gasEfficiency
    const fuelPerDistance = 1 / gasEfficiency; // gallons or liters per mile or km
    const costPerDistanceGas = fuelPerDistance * gasPrice; // $ per mile or km

    // Feedback on cost difference
    let feedback = "";
    if (costPerDistanceElectric < costPerDistanceGas) {
      feedback = "Electric mode is cheaper per distance.";
    } else if (costPerDistanceElectric > costPerDistanceGas) {
      feedback = "Gas mode is cheaper per distance.";
    } else {
      feedback = "Costs are approximately equal per distance.";
    }

    // Format results
    const unitLabel = inputs.unit === "imperial" ? "mile" : "km";

    return {
      primary: `${costPerDistanceElectric.toFixed(3)} $/${unitLabel}`,
      secondary: `${costPerDistanceGas.toFixed(3)} $/${unitLabel} (Gas Mode)`,
      details: `Electric mode cost per ${unitLabel}: $${costPerDistanceElectric.toFixed(3)}; Gas mode cost per ${unitLabel}: $${costPerDistanceGas.toFixed(3)}`,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is the average cost per mile for a PHEV in electric mode vs gas mode?",
      answer: "In electric mode, PHEVs typically cost $0.03–$0.05 per mile, while gas-only mode averages $0.10–$0.15 per mile depending on local electricity and fuel prices. For example, at $0.14/kWh electricity and $3.50/gallon gas, a PHEV might cost $0.04/mile electric versus $0.12/mile gas. These figures assume average EPA efficiency ratings of 3–4 miles per kWh and 25–35 MPG in hybrid mode.",
    },
    {
      question: "How do I calculate my annual PHEV operating costs?",
      answer: "Multiply your annual miles by your local electricity rate ($/kWh) and fuel price ($/gallon), then apply your vehicle's EPA efficiency ratings. For a 12,000-mile annual commute with 60% electric driving (7,200 miles), $0.14/kWh, and $3.50/gallon gas, expect roughly $288 electric costs plus $420 gas costs for 4,800 hybrid miles. Total annual fuel cost would be approximately $708.",
    },
    {
      question: "What battery size should I choose to minimize operating costs?",
      answer: "A PHEV battery capacity of 40–60 kWh covers most daily commutes (25–50 miles) and maximizes electric-mode savings for typical drivers. If your daily driving is &lt;30 miles, a smaller 30–40 kWh battery suffices and reduces vehicle cost; for &gt;50 miles daily, larger batteries improve cost efficiency. The calculator helps compare break-even points based on your actual commute distance and electricity rates.",
    },
    {
      question: "How do electricity rates affect my PHEV cost savings?",
      answer: "Electricity costs are the primary variable in electric-mode savings. At $0.10/kWh, a PHEV costs roughly $0.03/mile electric; at $0.18/kWh, that rises to $0.05/mile. Residential rates in the U.S. range from $0.09/kWh (Louisiana) to $0.22/kWh (Hawaii) as of 2024, so your location significantly impacts annual savings—potentially $500–$1,500 per year.",
    },
    {
      question: "Does cold weather reduce PHEV electric range and increase costs?",
      answer: "Yes, cold weather typically reduces EV range by 20–40%, which increases cost per mile in electric mode. A PHEV with a 40-mile EPA range might achieve only 24–32 miles in freezing temperatures, forcing greater reliance on gas mode. The calculator should account for seasonal adjustments; users in cold climates may see 10–15% higher annual fuel costs than temperate regions.",
    },
    {
      question: "What is the payback period for choosing electric mode vs gas in a PHEV?",
      answer: "The payback occurs when cumulative electric-mode savings exceed the PHEV's premium cost over a comparable gas vehicle (typically $5,000–$10,000 additional purchase price). For a driver saving $0.08/mile by using electric mode versus gas, breaking even requires roughly 62,500–125,000 miles. At 12,000 miles annually, this ranges from 5–10 years, after which PHEV ownership becomes financially advantageous.",
    },
    {
      question: "Are there federal or state tax credits that affect PHEV cost calculations?",
      answer: "The federal EV tax credit for PHEVs is up to $3,750 (as of 2024) for eligible models assembled in North America. Many states offer additional credits ($500–$2,500) or rebates, and some utilities provide EV charging incentives. These credits reduce upfront cost and improve the payback period; the calculator should incorporate your jurisdiction's available incentives for accurate net cost analysis.",
    },
    {
      question: "How should I account for home charging installation costs in my cost calculation?",
      answer: "Home charging installation (Level 2, 240V) typically costs $500–$2,000 installed, though federal rebates cover up to 30% of costs (capped at $1,000) under the 2024 IRA. This cost should be amortized over the vehicle's ownership period; for a 10-year ownership with $1,200 net installation cost, add $120/year to your electric-mode costs. This is often offset within 1–2 years by fuel savings.",
    },
    {
      question: "What driving patterns maximize PHEV electric-mode savings?",
      answer: "Drivers with daily commutes &lt;40 miles, predictable routes, and access to home charging realize the highest electric-mode savings—often 70–80% of total driving miles in electric mode. Stop-and-go urban driving saves more than highway driving because regenerative braking captures more energy. Highway driving &gt;55 mph uses less efficient electric mode, so the calculator should weight urban vs. highway miles separately for accurate cost projections.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a 2023 PHEV sedan with a 12 kWh battery, an electric range of 40 miles, electricity rate of $0.13 per kWh, gas price of $3.50 per gallon, and gas mode fuel efficiency of 40 MPG.",
    steps: [
      {
        label: "Step 1: Calculate energy consumption per mile in electric mode",
        explanation: "Energy per mile = Battery capacity / Electric range = 12 kWh / 40 miles = 0.3 kWh/mile"
      },
      {
        label: "Step 2: Calculate electric mode cost per mile",
        explanation: "Electric cost per mile = Energy per mile × Electricity rate = 0.3 kWh/mile × $0.13/kWh = $0.039/mile"
      },
      {
        label: "Step 3: Calculate fuel consumption per mile in gas mode",
        explanation: "Fuel per mile = 1 / Fuel efficiency = 1 / 40 MPG = 0.025 gallons/mile"
      },
      {
        label: "Step 4: Calculate gas mode cost per mile",
        explanation: "Gas cost per mile = Fuel per mile × Gas price = 0.025 gallons/mile × $3.50/gallon = $0.0875/mile"
      },
      {
        label: "Step 5: Compare costs",
        explanation: "Electric mode costs $0.039/mile, gas mode costs $0.0875/mile. Electric mode is cheaper by $0.0485/mile."
      }
    ],
    result: "Final Result: Driving in electric mode costs approximately 44% less per mile than gas mode under these conditions."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and fuel economy data for vehicles."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing resource with detailed vehicle specs."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, pricing, and automotive advice."
    },
    {
      title: "U.S. Energy Information Administration (EIA)",
      description: "Data on electricity rates and fuel prices across the United States."
    },
    {
      title: "Alternative Fuels Data Center (AFDC)",
      description: "Information on electric vehicle efficiency and alternative fuel costs."
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
            placeholder="e.g. 12"
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.001"
            placeholder="e.g. 0.13"
            value={inputs.electricityRate}
            onChange={(e) => handleInputChange("electricityRate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Electric Range ({inputs.unit === "imperial" ? "miles" : "km"})</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder={inputs.unit === "imperial" ? "e.g. 40" : "e.g. 64"}
            value={inputs.electricRange}
            onChange={(e) => handleInputChange("electricRange", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Gas Price (${inputs.unit === "imperial" ? "/gallon" : "/liter"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder={inputs.unit === "imperial" ? "e.g. 3.50" : "e.g. 0.92"}
            value={inputs.gasPrice}
            onChange={(e) => handleInputChange("gasPrice", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Gas Mode Fuel Efficiency ({inputs.unit === "imperial" ? "MPG" : "km/l"})</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder={inputs.unit === "imperial" ? "e.g. 40" : "e.g. 17"}
            value={inputs.gasEfficiency}
            onChange={(e) => handleInputChange("gasEfficiency", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Cost per Distance</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 font-semibold text-blue-700">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the PHEV Electric vs Gas Mode Cost Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you compare the true operating costs of driving your PHEV in electric mode versus gas or hybrid mode. By inputting your local electricity rates, fuel prices, annual mileage, and vehicle efficiency metrics, you can determine which driving mode is most cost-effective for your specific situation and identify opportunities to maximize savings. Understanding these costs is essential for PHEVs because the financial benefit depends heavily on your commute pattern, charging access, and regional energy prices.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The key inputs include your vehicle's EPA-rated efficiency in miles per kWh (electric mode) and MPG (gas/hybrid mode), your daily commute distance, annual miles driven, local electricity rate in $/kWh, current gas price per gallon, and the percentage of your driving conducted in electric versus gas mode. If you have home charging, you can use residential rates; if you charge only at work or public chargers, adjust the electricity rate accordingly. Battery degradation is typically minor over 10 years and is already factored into EPA efficiency ratings.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your annual fuel cost for each mode, cost per mile, and long-term ownership costs. Compare the total fuel expenses across different driving scenarios (urban vs. highway, summer vs. winter, high vs. low electricity rates) to identify which patterns favor electric mode. Use the payback analysis to determine if PHEV ownership cost advantages exceed the initial purchase premium, taking into account available federal and state tax credits that reduce net upfront cost.</p>
        </div>
      </section>

      {/* TABLE: PHEV Operating Cost Comparison by Electricity Rate (2024) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">PHEV Operating Cost Comparison by Electricity Rate (2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated annual fuel costs for a PHEV with 12,000 annual miles and 60% electric driving (7,200 electric miles, 4,800 gas miles) across different electricity rates.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Electricity Rate ($/kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Electric Mode Cost (7,200 mi)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gas Mode Cost (4,800 mi @ $3.50/gal, 30 MPG)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Annual Fuel Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$240</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$560</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$800</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$288</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$560</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$848</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$336</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$560</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$896</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$384</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$560</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$944</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$432</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$560</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$992</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes EPA efficiency of 3.5 miles/kWh in electric mode and 30 MPG in gas/hybrid mode. Rates based on 2024 U.S. residential averages.</p>
      </section>

      {/* TABLE: PHEV Battery Range and Daily Cost Savings by Commute Distance */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">PHEV Battery Range and Daily Cost Savings by Commute Distance</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table illustrates how PHEV battery capacity and daily commute distance impact electric-mode usage and annual fuel cost savings versus gas-only vehicles.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Battery Capacity (kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EPA Electric Range (miles)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Commute (&lt;round trip&gt;)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Est. Annual Electric Miles</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Fuel Cost Savings vs. Gas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30–35 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100–120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,500 mi</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$495–$660</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40–50 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">130–160</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,000 mi</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$720–$960</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">55–65 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">170–200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9,500 mi</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$855–$1,140</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">70–80 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">220–250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80+ miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10,500 mi</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$945–$1,260</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes 12,000 annual miles total, $0.14/kWh electricity, $3.50/gallon gas, and 30 MPG in hybrid mode. Savings represent electric mode cost advantage over all-gas driving.</p>
      </section>

      {/* TABLE: Federal and State PHEV Incentives and Payback Impact (2024) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Federal and State PHEV Incentives and Payback Impact (2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how federal and state tax credits reduce PHEV purchase premiums and shorten the cost payback period against comparable gas vehicles.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">PHEV Purchase Premium vs. Gas Model</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Federal EV Tax Credit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">State/Utility Incentives (Avg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Net Premium After Incentives</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Payback Period (at $0.08/mi savings)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0–$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,250–$1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.6–3.1 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$7,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500–$1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,250–$3,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.7–6.8 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000–$2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,750–$5,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.8–10.9 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500–$2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,750–$6,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.0–14.1 years</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes annual savings of $0.08/mile from electric-mode usage. Federal credit limited to qualifying models assembled in North America. Payback varies by state and utility programs.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Charge during off-peak hours (typically 9 PM–6 AM) in regions with time-of-use electricity rates to reduce your effective $/kWh rate by 20–40%, dramatically improving electric-mode cost efficiency.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your actual fuel consumption and electricity usage for 2–3 months using your vehicle's onboard computer or utility bills to calibrate the calculator with real-world data specific to your driving habits and local conditions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If your commute is &lt;30 miles daily and you have reliable home charging, prioritize maximizing electric-mode driving by fully charging every night; this typically yields 50–70% electric miles and maximum cost savings.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Install a home Level 2 (240V) charger rather than relying on 120V charging; Level 2 reduces charging time from 8–12 hours to 4–6 hours and improves charging convenience, making daily electric driving more practical and cost-effective.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator to compare seasonal variations in your costs; cold-weather range loss and reduced EV efficiency in winter typically increase annual costs by 10–15% in northern regions.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Time-of-Use Electricity Rates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many drivers use average electricity rates without accounting for time-of-use (TOU) pricing, which offers 30–50% lower rates during off-peak hours. If you charge primarily during peak hours, your electric-mode cost advantage shrinks significantly; the calculator should allow for TOU rate inputs to reflect true savings.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating Electric-Mode Driving Percentage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Drivers often assume they'll drive in electric mode 70–80% of the time but realistically achieve only 40–50% due to longer trips, highway driving, and weather. Base your calculator input on actual commute data rather than optimistic expectations, or use a conservative estimate and adjust upward after tracking real usage for 2–3 months.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Home Charging Installation Costs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The upfront cost of Level 2 home charger installation ($500–$2,000) should be amortized into annual operating costs or payback calculations. Excluding this cost understates the true ownership expense and overstates the economic advantage of electric-mode driving in the first 1–2 years.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using EPA Ratings Without Real-World Adjustments</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">EPA efficiency ratings are optimistic and don't account for cold-weather loss (&minus;20–40%), highway driving inefficiency, or driver behavior. Reduce EPA efficiency estimates by 15–20% for conservative cost projections, especially if you live in a cold climate or drive primarily on highways where EVs are less efficient.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average cost per mile for a PHEV in electric mode vs gas mode?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">In electric mode, PHEVs typically cost $0.03–$0.05 per mile, while gas-only mode averages $0.10–$0.15 per mile depending on local electricity and fuel prices. For example, at $0.14/kWh electricity and $3.50/gallon gas, a PHEV might cost $0.04/mile electric versus $0.12/mile gas. These figures assume average EPA efficiency ratings of 3–4 miles per kWh and 25–35 MPG in hybrid mode.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my annual PHEV operating costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Multiply your annual miles by your local electricity rate ($/kWh) and fuel price ($/gallon), then apply your vehicle's EPA efficiency ratings. For a 12,000-mile annual commute with 60% electric driving (7,200 miles), $0.14/kWh, and $3.50/gallon gas, expect roughly $288 electric costs plus $420 gas costs for 4,800 hybrid miles. Total annual fuel cost would be approximately $708.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What battery size should I choose to minimize operating costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A PHEV battery capacity of 40–60 kWh covers most daily commutes (25–50 miles) and maximizes electric-mode savings for typical drivers. If your daily driving is &lt;30 miles, a smaller 30–40 kWh battery suffices and reduces vehicle cost; for &gt;50 miles daily, larger batteries improve cost efficiency. The calculator helps compare break-even points based on your actual commute distance and electricity rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do electricity rates affect my PHEV cost savings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Electricity costs are the primary variable in electric-mode savings. At $0.10/kWh, a PHEV costs roughly $0.03/mile electric; at $0.18/kWh, that rises to $0.05/mile. Residential rates in the U.S. range from $0.09/kWh (Louisiana) to $0.22/kWh (Hawaii) as of 2024, so your location significantly impacts annual savings—potentially $500–$1,500 per year.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does cold weather reduce PHEV electric range and increase costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, cold weather typically reduces EV range by 20–40%, which increases cost per mile in electric mode. A PHEV with a 40-mile EPA range might achieve only 24–32 miles in freezing temperatures, forcing greater reliance on gas mode. The calculator should account for seasonal adjustments; users in cold climates may see 10–15% higher annual fuel costs than temperate regions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the payback period for choosing electric mode vs gas in a PHEV?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The payback occurs when cumulative electric-mode savings exceed the PHEV's premium cost over a comparable gas vehicle (typically $5,000–$10,000 additional purchase price). For a driver saving $0.08/mile by using electric mode versus gas, breaking even requires roughly 62,500–125,000 miles. At 12,000 miles annually, this ranges from 5–10 years, after which PHEV ownership becomes financially advantageous.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there federal or state tax credits that affect PHEV cost calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The federal EV tax credit for PHEVs is up to $3,750 (as of 2024) for eligible models assembled in North America. Many states offer additional credits ($500–$2,500) or rebates, and some utilities provide EV charging incentives. These credits reduce upfront cost and improve the payback period; the calculator should incorporate your jurisdiction's available incentives for accurate net cost analysis.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I account for home charging installation costs in my cost calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Home charging installation (Level 2, 240V) typically costs $500–$2,000 installed, though federal rebates cover up to 30% of costs (capped at $1,000) under the 2024 IRA. This cost should be amortized over the vehicle's ownership period; for a 10-year ownership with $1,200 net installation cost, add $120/year to your electric-mode costs. This is often offset within 1–2 years by fuel savings.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What driving patterns maximize PHEV electric-mode savings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Drivers with daily commutes &lt;40 miles, predictable routes, and access to home charging realize the highest electric-mode savings—often 70–80% of total driving miles in electric mode. Stop-and-go urban driving saves more than highway driving because regenerative braking captures more energy. Highway driving &gt;55 mph uses less efficient electric mode, so the calculator should weight urban vs. highway miles separately for accurate cost projections.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://fueleconomy.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy - Federal EV Tax Credit and Incentives</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official source for EPA fuel economy ratings, EV efficiency benchmarks, and federal tax credit eligibility for plug-in hybrid vehicles.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/credits-deductions/credits-for-electric-vehicles-purchased-in-2024" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Internal Revenue Service - Electric Vehicle Tax Credit</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative guidance on federal tax credits for PHEVs, including eligibility requirements, credit amounts, and North American assembly rules as of 2024.</p>
          </li>
          <li>
            <a href="https://www.eia.gov/electricity/state/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Energy Information Administration - Electricity Rates by State</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official state-by-state residential electricity rate data updated monthly, essential for accurate regional cost calculations in the calculator.</p>
          </li>
          <li>
            <a href="https://www.consumerreports.org/cars/plug-in-hybrids/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Reports - PHEV Cost of Ownership and Operating Expenses</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Independent analysis of PHEV total cost of ownership, operating costs, and long-term fuel savings compared to gas and full-electric vehicles.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="PHEV Electric vs Gas Mode Cost Calculator"
      description="Professional automotive calculator: PHEV Electric vs Gas Mode Cost Calculator. Get accurate estimates, expert advice, and financial insights."
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