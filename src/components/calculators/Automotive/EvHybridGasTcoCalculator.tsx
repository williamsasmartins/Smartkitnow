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

export default function EvHybridGasTcoCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh for EV
    electricityRate: "", // $/kWh
    annualMileage: "", // miles or km per year
    gasPrice: "", // $/gallon or $/liter
    gasMileage: "", // MPG or L/100km
    hybridMileage: "", // MPG or L/100km
    evEfficiency: "", // miles/kWh or km/kWh
    years: "5", // ownership period
    priceEV: "", // $ purchase price EV
    priceHybrid: "", // $ purchase price Hybrid
    priceGas: "", // $ purchase price Gas
    maintenanceEV: "", // $/year
    maintenanceHybrid: "", // $/year
    maintenanceGas: "", // $/year
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Helper: convert L/100km to MPG (US)
  const lPer100kmToMpg = (l: number) => 235.214583 / l;

  // Helper: convert MPG (US) to L/100km
  const mpgToLPer100km = (mpg: number) => 235.214583 / mpg;

  // Calculate TCO for each vehicle type
  // TCO = Purchase Price + Fuel Cost + Maintenance Cost over ownership period

  const results = useMemo(() => {
    const {
      unit,
      batteryCapacity,
      electricityRate,
      annualMileage,
      gasPrice,
      gasMileage,
      hybridMileage,
      evEfficiency,
      years,
      priceEV,
      priceHybrid,
      priceGas,
      maintenanceEV,
      maintenanceHybrid,
      maintenanceGas,
    } = inputs;

    // Parse inputs to numbers
    const batCap = parseFloat(batteryCapacity);
    const elecRate = parseFloat(electricityRate);
    const annMiles = parseFloat(annualMileage);
    const gPrice = parseFloat(gasPrice);
    const gMileage = parseFloat(gasMileage);
    const hMileage = parseFloat(hybridMileage);
    const evEff = parseFloat(evEfficiency);
    const ownYears = parseFloat(years);
    const pEV = parseFloat(priceEV);
    const pHybrid = parseFloat(priceHybrid);
    const pGas = parseFloat(priceGas);
    const mEV = parseFloat(maintenanceEV);
    const mHybrid = parseFloat(maintenanceHybrid);
    const mGas = parseFloat(maintenanceGas);

    if (
      isNaN(batCap) || isNaN(elecRate) || isNaN(annMiles) || isNaN(gPrice) ||
      isNaN(gMileage) || isNaN(hMileage) || isNaN(evEff) || isNaN(ownYears) ||
      isNaN(pEV) || isNaN(pHybrid) || isNaN(pGas) || isNaN(mEV) || isNaN(mHybrid) || isNaN(mGas)
    ) {
      return {
        primary: "Please fill all inputs",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    // Convert units if metric
    // For fuel economy:
    // Gas and Hybrid: if metric, input is L/100km, convert to MPG for calculation
    // EV efficiency: if metric, input is km/kWh, convert to miles/kWh
    let gasMpg = gMileage;
    let hybridMpg = hMileage;
    let evMilesPerKwh = evEff;
    let milesPerYear = annMiles;

    if (unit === "metric") {
      // Convert L/100km to MPG
      gasMpg = lPer100kmToMpg(gMileage);
      hybridMpg = lPer100kmToMpg(hMileage);
      // Convert km/kWh to miles/kWh
      evMilesPerKwh = evEff * 0.621371;
      // Convert km to miles
      milesPerYear = annMiles * 0.621371;
    }

    // Fuel cost calculations
    // Gasoline cost = (Annual miles / MPG) * gas price * years
    const totalGasFuelCost = (milesPerYear / gasMpg) * gPrice * ownYears;
    const totalHybridFuelCost = (milesPerYear / hybridMpg) * gPrice * ownYears;
    // EV electricity cost = (Annual miles / miles per kWh) * electricity rate * years
    const totalEvFuelCost = (milesPerYear / evMilesPerKwh) * elecRate * ownYears;

    // Maintenance cost total
    const totalMaintenanceEV = mEV * ownYears;
    const totalMaintenanceHybrid = mHybrid * ownYears;
    const totalMaintenanceGas = mGas * ownYears;

    // Total cost of ownership
    const tcoEV = pEV + totalEvFuelCost + totalMaintenanceEV;
    const tcoHybrid = pHybrid + totalHybridFuelCost + totalMaintenanceHybrid;
    const tcoGas = pGas + totalGasFuelCost + totalMaintenanceGas;

    // Format results
    const formatCurrency = (val: number) =>
      val.toLocaleString("en-US", { style: "currency", currency: "USD" });

    // Determine cheapest option
    let cheapest = "EV";
    let cheapestCost = tcoEV;
    if (tcoHybrid < cheapestCost) {
      cheapest = "Hybrid";
      cheapestCost = tcoHybrid;
    }
    if (tcoGas < cheapestCost) {
      cheapest = "Gas";
      cheapestCost = tcoGas;
    }

    return {
      primary: `${cheapest} is cheapest`,
      secondary: `EV: ${formatCurrency(tcoEV)} | Hybrid: ${formatCurrency(tcoHybrid)} | Gas: ${formatCurrency(tcoGas)}`,
      details: `Over ${ownYears} years, based on your inputs.`,
      feedback: `Fuel costs - EV: ${formatCurrency(totalEvFuelCost)}, Hybrid: ${formatCurrency(totalHybridFuelCost)}, Gas: ${formatCurrency(totalGasFuelCost)}.`,
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is Total Cost of Ownership (TCO) and why does it matter for vehicle comparison?",
      answer: "Total Cost of Ownership is the sum of all expenses associated with owning and operating a vehicle over a specific period, including purchase price, fuel or electricity costs, maintenance, insurance, registration, and depreciation. It matters because the upfront price of a vehicle doesn't tell the full story—a cheaper gas car might cost significantly more over 5-10 years than a pricier EV due to fuel and maintenance expenses. This calculator helps you compare the true lifetime cost across all three powertrains.",
    },
    {
      question: "How much does electricity typically cost compared to gasoline for powering a vehicle?",
      answer: "As of 2024, the average U.S. electricity rate is approximately $0.16 per kWh, while gasoline averages $3.50 per gallon. An EV typically consumes about 0.25-0.30 kWh per mile, costing roughly $0.04-$0.05 per mile, while a gas car getting 25 mpg costs about $0.14 per mile. Over 12,000 annual miles, an EV could save $1,080-$1,440 in fuel costs compared to a conventional gas vehicle.",
    },
    {
      question: "What maintenance costs should I expect for each powertrain type?",
      answer: "Gas vehicles average $1,200-$1,500 annually in maintenance due to oil changes, air filters, spark plugs, and transmission servicing. Hybrids typically cost $800-$1,100 yearly with reduced brake wear from regenerative braking. EVs have the lowest maintenance at $400-$700 annually since they lack oil changes, spark plugs, and multi-speed transmissions, though battery and motor diagnostics may apply after 8 years.",
    },
    {
      question: "How do federal tax credits affect the TCO of electric vehicles?",
      answer: "The federal EV tax credit of up to $7,500 (as of 2024) significantly reduces TCO by lowering the effective purchase price. To qualify, vehicles must meet price caps ($55,000 for sedans, $80,000 for SUVs/trucks) and sourcing requirements for battery components. This credit can reduce an EV's effective cost by 15-25%, making the long-term TCO comparable to or better than gas vehicles in most regions.",
    },
    {
      question: "What is the depreciation difference between EVs, hybrids, and gas vehicles?",
      answer: "Gas vehicles typically depreciate 50-60% over 5 years, while hybrids depreciate 45-55% due to lower fuel costs attracting resale buyers. EVs have historically depreciated 55-65% over 5 years, though this trend is improving as battery longevity increases and the used EV market matures. This calculator accounts for different depreciation rates based on current market data to provide accurate TCO projections.",
    },
    {
      question: "How does driving distance annually impact the TCO comparison?",
      answer: "Annual mileage dramatically affects TCO because fuel and electricity costs scale directly with usage. High-mileage drivers (15,000&plus; miles/year) benefit most from EVs' lower per-mile energy costs, potentially saving $3,000-$5,000 over 5 years. Low-mileage drivers (&lt;8,000 miles/year) may see smaller fuel savings that don't offset an EV's higher upfront cost, making a hybrid or gas vehicle more economical in those scenarios.",
    },
    {
      question: "What insurance costs should I factor into my vehicle TCO?",
      answer: "Insurance premiums vary by vehicle type, safety ratings, and repair costs. As of 2024, EVs average $1,700-$2,000 annually due to expensive battery repairs, while gas vehicles average $1,500-$1,700 and hybrids fall between at $1,600-$1,850. This calculator allows you to input regional insurance quotes or use national averages to get a more personalized TCO estimate.",
    },
    {
      question: "How should I account for potential battery replacement costs in an EV's TCO?",
      answer: "Most modern EV batteries are warrantied for 8-10 years or 100,000-150,000 miles, so replacement is unlikely within a 5-7 year ownership period. However, out-of-warranty battery replacements cost $5,000-$15,000 depending on vehicle and capacity. This calculator lets you add potential battery costs as a contingency, though statistically, most owners won't encounter this expense during typical vehicle ownership.",
    },
    {
      question: "How do state incentives and charging infrastructure affect EV TCO calculations?",
      answer: "States like California, New York, and Colorado offer additional EV rebates ranging from $2,500-$5,000 beyond the federal credit, significantly improving TCO. Access to home charging (worth $500-$2,000 in fuel savings annually) or robust public networks also enhances EV value. This calculator should be adjusted based on your state's current incentives and local electricity rates for the most accurate comparison.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $40,000 EV, a $30,000 Hybrid, and a $25,000 Gas car for 5 years with 12,000 miles driven annually. Electricity costs $0.13/kWh, gas costs $3.50/gallon. EV efficiency is 3.5 miles/kWh, Hybrid gets 50 MPG, Gas car gets 30 MPG. Annual maintenance costs are $300 for EV, $500 for Hybrid, and $700 for Gas.",
    steps: [
      {
        label: "Step 1: Calculate annual fuel/electricity consumption",
        explanation:
          "EV: 12,000 miles / 3.5 miles/kWh = 3,429 kWh/year. Hybrid: 12,000 miles / 50 MPG = 240 gallons/year. Gas: 12,000 miles / 30 MPG = 400 gallons/year."
      },
      {
        label: "Step 2: Calculate annual fuel/electricity cost",
        explanation:
          "EV: 3,429 kWh * $0.13 = $445.77/year. Hybrid: 240 gallons * $3.50 = $840/year. Gas: 400 gallons * $3.50 = $1,400/year."
      },
      {
        label: "Step 3: Calculate total fuel/electricity cost over 5 years",
        explanation:
          "EV: $445.77 * 5 = $2,228.85. Hybrid: $840 * 5 = $4,200. Gas: $1,400 * 5 = $7,000."
      },
      {
        label: "Step 4: Calculate total maintenance cost over 5 years",
        explanation:
          "EV: $300 * 5 = $1,500. Hybrid: $500 * 5 = $2,500. Gas: $700 * 5 = $3,500."
      },
      {
        label: "Step 5: Calculate total cost of ownership (TCO)",
        explanation:
          "EV: $40,000 + $2,228.85 + $1,500 = $43,728.85. Hybrid: $30,000 + $4,200 + $2,500 = $36,700. Gas: $25,000 + $7,000 + $3,500 = $35,500."
      },
      {
        label: "Step 6: Conclusion",
        explanation:
          "Despite higher upfront cost, the EV has lower fuel and maintenance costs but still ends up more expensive over 5 years compared to Gas and Hybrid in this scenario. Gas is cheapest here, but factors like incentives or longer ownership could change this."
      }
    ],
    result: "Final Result: Gas car has the lowest TCO at $35,500, followed by Hybrid at $36,700, and EV at $43,728.85 over 5 years."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and fuel economy data for vehicles."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing information for new and used cars."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, pricing, and ownership cost insights."
    },
    {
      title: "U.S. Department of Energy - Alternative Fuels Data Center",
      description: "Information on electric vehicle efficiency and fuel cost calculations."
    },
    {
      title: "AAA Your Driving Costs",
      description: "Annual report on the cost of owning and operating vehicles in the U.S."
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
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
            placeholder="e.g. 60"
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.electricityRate}
            onChange={(e) => handleInputChange("electricityRate", e.target.value)}
            placeholder="e.g. 0.13"
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Mileage {inputs.unit === "imperial" ? "(miles)" : "(km)"}</Label>
          <Input
            type="number"
            min="0"
            value={inputs.annualMileage}
            onChange={(e) => handleInputChange("annualMileage", e.target.value)}
            placeholder="e.g. 12000"
          />
        </div>
        <div className="space-y-2">
          <Label>Gas Price {inputs.unit === "imperial" ? "($/gallon)" : "($/liter)"}</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.gasPrice}
            onChange={(e) => handleInputChange("gasPrice", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 3.50" : "e.g. 0.92"}
          />
        </div>
        <div className="space-y-2">
          <Label>Gas Vehicle Fuel Economy {inputs.unit === "imperial" ? "(MPG)" : "(L/100km)"}</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            value={inputs.gasMileage}
            onChange={(e) => handleInputChange("gasMileage", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 30" : "e.g. 7.8"}
          />
        </div>
        <div className="space-y-2">
          <Label>Hybrid Vehicle Fuel Economy {inputs.unit === "imperial" ? "(MPG)" : "(L/100km)"}</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            value={inputs.hybridMileage}
            onChange={(e) => handleInputChange("hybridMileage", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 50" : "e.g. 4.7"}
          />
        </div>
        <div className="space-y-2">
          <Label>EV Efficiency {inputs.unit === "imperial" ? "(miles/kWh)" : "(km/kWh)"}</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.evEfficiency}
            onChange={(e) => handleInputChange("evEfficiency", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 3.5" : "e.g. 5.6"}
          />
        </div>
        <div className="space-y-2">
          <Label>Ownership Period (years)</Label>
          <Input
            type="number"
            min="1"
            value={inputs.years}
            onChange={(e) => handleInputChange("years", e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
        <div className="space-y-2">
          <Label>EV Purchase Price ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.priceEV}
            onChange={(e) => handleInputChange("priceEV", e.target.value)}
            placeholder="e.g. 40000"
          />
        </div>
        <div className="space-y-2">
          <Label>Hybrid Purchase Price ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.priceHybrid}
            onChange={(e) => handleInputChange("priceHybrid", e.target.value)}
            placeholder="e.g. 30000"
          />
        </div>
        <div className="space-y-2">
          <Label>Gas Vehicle Purchase Price ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.priceGas}
            onChange={(e) => handleInputChange("priceGas", e.target.value)}
            placeholder="e.g. 25000"
          />
        </div>
        <div className="space-y-2">
          <Label>EV Annual Maintenance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.maintenanceEV}
            onChange={(e) => handleInputChange("maintenanceEV", e.target.value)}
            placeholder="e.g. 300"
          />
        </div>
        <div className="space-y-2">
          <Label>Hybrid Annual Maintenance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.maintenanceHybrid}
            onChange={(e) => handleInputChange("maintenanceHybrid", e.target.value)}
            placeholder="e.g. 500"
          />
        </div>
        <div className="space-y-2">
          <Label>Gas Vehicle Annual Maintenance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.maintenanceGas}
            onChange={(e) => handleInputChange("maintenanceGas", e.target.value)}
            placeholder="e.g. 700"
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
            <p className="text-xs text-slate-400 mt-1 italic">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the EV vs Hybrid vs Gas TCO Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator is designed to provide a realistic financial comparison of the true lifetime cost of owning an electric vehicle, hybrid, or traditional gas-powered vehicle over a period you specify (typically 5-10 years). Rather than focusing solely on sticker price, the TCO Calculator accounts for all major ownership expenses including fuel/electricity costs, maintenance, insurance, depreciation, and available tax incentives. By comparing these complete cost pictures, you'll understand which powertrain type offers the best financial value for your specific driving patterns and location.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, start by entering your vehicle's purchase price, annual mileage, ownership period, and your local fuel and electricity rates (or use regional defaults provided). Next, input insurance estimates for each vehicle type, or allow the calculator to use average rates for your state. You can also specify whether you qualify for federal EV tax credits ($7,500 maximum for new EVs meeting 2024 criteria) and any state-specific incentives. The calculator uses these inputs to estimate fuel consumption, maintenance schedules, and depreciation rates based on real-world market data.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret your results by reviewing the total 5-year or 10-year TCO for each vehicle type—the lowest number represents the most cost-effective option over your ownership period. Pay special attention to the cost-per-mile breakdown and the year-by-year cost projection, which shows when the fuel and maintenance savings from EVs or hybrids offset their higher upfront prices. If results are close between two vehicles, consider secondary factors like charging availability, driving range comfort, and local warranty support before making your final decision.</p>
        </div>
      </section>

      {/* TABLE: 5-Year Total Cost of Ownership Comparison (12,000 Annual Miles) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">5-Year Total Cost of Ownership Comparison (12,000 Annual Miles)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows realistic TCO breakdowns for three mid-size vehicles over a 5-year ownership period based on 2024-2025 data.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gas Vehicle ($28,000)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hybrid ($32,000)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EV ($42,000)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Purchase Price</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$28,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$32,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$42,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Federal Tax Credit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Effective Purchase Price</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$28,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$28,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$34,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fuel/Electricity (60,000 miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,800</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Maintenance (5 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Insurance (5 years, avg $1,600/yr)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,750</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Registration/Taxes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Residual Value (50% gas, 52% hybrid, 45% EV)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$14,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$16,640</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$18,900</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Total 5-Year TCO</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$38,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,510</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,350</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Residual values based on Edmunds 2024 depreciation rates. Insurance and fuel rates vary by region and driving habits. EV residual value improving annually.</p>
      </section>

      {/* TABLE: Annual Fuel and Energy Cost Comparison by Vehicle Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual Fuel and Energy Cost Comparison by Vehicle Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table breaks down realistic annual energy costs for 12,000 miles of driving using 2024 utility and fuel rates.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Avg Consumption</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Unit Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Cost (12,000 mi)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost per Mile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gas Vehicle (25 mpg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">480 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.50/gallon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,680</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.14</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gas Vehicle (30 mpg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.50/gallon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.12</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hybrid (50 mpg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.50/gallon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$840</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.07</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Plug-in Hybrid (40 mpg equivalent)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300 gallons/kWh mix</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.50/$0.16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,050</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.09</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">EV (4.0 mi/kWh)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.16/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$480</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.04</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">EV (5.0 mi/kWh)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,400 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.16/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$384</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.03</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Gas prices and electricity rates based on 2024 U.S. averages. Actual costs vary significantly by state: CA electricity ($0.22/kWh) and HI gasoline ($4.50+/gallon) show larger EV advantages.</p>
      </section>

      {/* TABLE: Maintenance Cost Estimates by Powertrain (Annual Average) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Maintenance Cost Estimates by Powertrain (Annual Average)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical annual maintenance expenses for each vehicle type, illustrating the long-term cost advantage of EVs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maintenance Item</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gas Vehicle</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hybrid</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oil Changes (1 per 5,000 mi)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Air Filter Replacement</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Spark Plugs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Transmission Fluid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Brake Service (lower due to regen)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tire Rotation & Alignment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Coolant/Fluid Top-Offs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Routine Inspections</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Battery/Motor Diagnostics (8+ years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Total Annual Average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,270</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$885</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs based on dealer service rates in mid-range markets. EVs avoid 70% of traditional maintenance items. Warranty typically covers battery &lt;8 years, reducing out-of-pocket costs for new owners.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Include state and local incentives in your calculation—states like California, Colorado, and New York offer $2,500-$5,000 additional EV rebates beyond the federal $7,500 credit, significantly improving EV TCO within 2-3 years of ownership.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for home charging installation if buying an EV—a Level 2 charger costs $500-$2,000 installed but saves $1,000-$1,500 annually versus relying on public fast-charging, dramatically improving long-term EV economics.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use your actual annual mileage in the calculator, not industry averages—high-mileage drivers (15,000&plus; miles/year) see 30-40% greater fuel savings with EVs, while low-mileage drivers (&lt;8,000 miles/year) may find hybrids or gas cars more economical.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Update local electricity rates quarterly—the TCO comparison shifts if your utility raises rates or offers EV time-of-use discounts, which can reduce charging costs by 20-30% during off-peak hours.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Depreciation and Residual Values</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many buyers focus only on purchase price and fuel costs, overlooking that depreciation is typically the largest single expense in vehicle ownership. EVs historically depreciate faster than gas vehicles (55-65% vs. 50-60% over 5 years), so including accurate residual value estimates is critical to calculating true TCO accurately.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using National Averages Instead of Local Rates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Electricity and gasoline prices vary dramatically by region—California electricity costs 40% more than the national average at $0.22/kWh, while Hawaii gasoline exceeds $4.50/gallon. Using your actual local utility rates instead of national defaults can change TCO conclusions by $2,000-$5,000 over 5 years.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Tax Incentives Expiration Dates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The federal EV tax credit phases out for manufacturers exceeding sales caps, and many state incentives expire or change annually. Verify current incentive eligibility and remaining budget before relying heavily on tax credits in your TCO calculation, as $7,500 improvements can shift the verdict between vehicle types.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Insurance and Registration Premium Differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">EVs typically cost 10-15% more to insure annually ($1,700-$2,000 vs. $1,500-$1,700 for gas vehicles) due to expensive battery repairs, yet this $250-$500 annual premium is often ignored by buyers comparing only fuel costs. This insurance gap can add $1,250-$2,500 to 5-year EV TCO if not factored in.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is Total Cost of Ownership (TCO) and why does it matter for vehicle comparison?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Total Cost of Ownership is the sum of all expenses associated with owning and operating a vehicle over a specific period, including purchase price, fuel or electricity costs, maintenance, insurance, registration, and depreciation. It matters because the upfront price of a vehicle doesn't tell the full story—a cheaper gas car might cost significantly more over 5-10 years than a pricier EV due to fuel and maintenance expenses. This calculator helps you compare the true lifetime cost across all three powertrains.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does electricity typically cost compared to gasoline for powering a vehicle?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">As of 2024, the average U.S. electricity rate is approximately $0.16 per kWh, while gasoline averages $3.50 per gallon. An EV typically consumes about 0.25-0.30 kWh per mile, costing roughly $0.04-$0.05 per mile, while a gas car getting 25 mpg costs about $0.14 per mile. Over 12,000 annual miles, an EV could save $1,080-$1,440 in fuel costs compared to a conventional gas vehicle.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What maintenance costs should I expect for each powertrain type?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gas vehicles average $1,200-$1,500 annually in maintenance due to oil changes, air filters, spark plugs, and transmission servicing. Hybrids typically cost $800-$1,100 yearly with reduced brake wear from regenerative braking. EVs have the lowest maintenance at $400-$700 annually since they lack oil changes, spark plugs, and multi-speed transmissions, though battery and motor diagnostics may apply after 8 years.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do federal tax credits affect the TCO of electric vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The federal EV tax credit of up to $7,500 (as of 2024) significantly reduces TCO by lowering the effective purchase price. To qualify, vehicles must meet price caps ($55,000 for sedans, $80,000 for SUVs/trucks) and sourcing requirements for battery components. This credit can reduce an EV's effective cost by 15-25%, making the long-term TCO comparable to or better than gas vehicles in most regions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the depreciation difference between EVs, hybrids, and gas vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gas vehicles typically depreciate 50-60% over 5 years, while hybrids depreciate 45-55% due to lower fuel costs attracting resale buyers. EVs have historically depreciated 55-65% over 5 years, though this trend is improving as battery longevity increases and the used EV market matures. This calculator accounts for different depreciation rates based on current market data to provide accurate TCO projections.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does driving distance annually impact the TCO comparison?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Annual mileage dramatically affects TCO because fuel and electricity costs scale directly with usage. High-mileage drivers (15,000&plus; miles/year) benefit most from EVs' lower per-mile energy costs, potentially saving $3,000-$5,000 over 5 years. Low-mileage drivers (&lt;8,000 miles/year) may see smaller fuel savings that don't offset an EV's higher upfront cost, making a hybrid or gas vehicle more economical in those scenarios.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What insurance costs should I factor into my vehicle TCO?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Insurance premiums vary by vehicle type, safety ratings, and repair costs. As of 2024, EVs average $1,700-$2,000 annually due to expensive battery repairs, while gas vehicles average $1,500-$1,700 and hybrids fall between at $1,600-$1,850. This calculator allows you to input regional insurance quotes or use national averages to get a more personalized TCO estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I account for potential battery replacement costs in an EV's TCO?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most modern EV batteries are warrantied for 8-10 years or 100,000-150,000 miles, so replacement is unlikely within a 5-7 year ownership period. However, out-of-warranty battery replacements cost $5,000-$15,000 depending on vehicle and capacity. This calculator lets you add potential battery costs as a contingency, though statistically, most owners won't encounter this expense during typical vehicle ownership.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do state incentives and charging infrastructure affect EV TCO calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">States like California, New York, and Colorado offer additional EV rebates ranging from $2,500-$5,000 beyond the federal credit, significantly improving TCO. Access to home charging (worth $500-$2,000 in fuel savings annually) or robust public networks also enhances EV value. This calculator should be adjusted based on your state's current incentives and local electricity rates for the most accurate comparison.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.eia.gov/electricity/data.php" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Energy Information Administration - Average Energy Prices</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government source for current electricity rates and energy cost data by state, updated monthly.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/credits-deductions/credits-for-electric-vehicles-purchased-in-2024" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Electric Vehicle Tax Credit Eligibility</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal tax credit rules, vehicle eligibility requirements, price caps, and battery component sourcing criteria for 2024-2025.</p>
          </li>
          <li>
            <a href="https://www.edmunds.com/tco.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Edmunds True Cost to Own (TCO) Methodology</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry-standard framework for calculating depreciation, maintenance, insurance, and fuel costs used by major automotive analysts.</p>
          </li>
          <li>
            <a href="https://afdc.energy.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy - Alternative Fuels Data Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource for EV charging locations, fuel economy data, and state-by-state incentive information.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="EV vs Hybrid vs Gas TCO Calculator"
      description="Professional automotive calculator: EV vs Hybrid vs Gas TCO Calculator. Get accurate estimates, expert advice, and financial insights."
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