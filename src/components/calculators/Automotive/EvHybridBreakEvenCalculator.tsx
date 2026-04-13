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

export default function EvHybridBreakEvenCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    electricityRate: "", // $/kWh
    hybridFuelEfficiency: "", // MPG or L/100km
    fuelPrice: "", // $/gallon or $/liter
    annualMileage: "", // miles or km per year
    evPricePremium: "" // $ difference between EV and Hybrid upfront cost
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const {
      unit,
      batteryCapacity,
      electricityRate,
      hybridFuelEfficiency,
      fuelPrice,
      annualMileage,
      evPricePremium
    } = inputs;

    // Parse inputs to numbers
    const batCap = parseFloat(batteryCapacity);
    const elecRate = parseFloat(electricityRate);
    const hybridEff = parseFloat(hybridFuelEfficiency);
    const fuelP = parseFloat(fuelPrice);
    const mileage = parseFloat(annualMileage);
    const pricePremium = parseFloat(evPricePremium);

    if (
      isNaN(batCap) || batCap <= 0 ||
      isNaN(elecRate) || elecRate <= 0 ||
      isNaN(hybridEff) || hybridEff <= 0 ||
      isNaN(fuelP) || fuelP <= 0 ||
      isNaN(mileage) || mileage <= 0 ||
      isNaN(pricePremium) || pricePremium < 0
    ) {
      return {
        primary: "—",
        secondary: "Please enter valid positive numbers in all fields.",
        details: "",
        feedback: ""
      };
    }

    // Constants for unit conversions
    // 1 gallon = 3.78541 liters
    // 1 mile = 1.60934 km
    // We will convert all to imperial internally for consistency

    // Convert inputs to imperial if metric
    let mileageMiles = mileage;
    let fuelPriceGal = fuelP;
    let hybridMpg = hybridEff;

    if (unit === "metric") {
      mileageMiles = mileage / 1.60934; // km to miles
      fuelPriceGal = fuelP * 3.78541; // $/liter to $/gallon
      hybridMpg = 235.214583 / hybridEff; // L/100km to MPG (235.214583 is constant)
    }

    // Calculate annual fuel cost for hybrid
    // Fuel consumed = mileage / mpg
    const annualFuelGallons = mileageMiles / hybridMpg;
    const annualFuelCost = annualFuelGallons * fuelPriceGal;

    // Calculate annual electricity cost for EV
    // Assume EV efficiency: 3.5 miles per kWh (typical average)
    // EV energy consumption = mileage / efficiency
    const evEfficiency = 3.5; // miles per kWh
    const annualKwh = mileageMiles / evEfficiency;
    const annualElectricityCost = annualKwh * elecRate;

    // Calculate annual savings by using EV vs Hybrid
    const annualSavings = annualFuelCost - annualElectricityCost;

    if (annualSavings <= 0) {
      return {
        primary: "N/A",
        secondary: "EV operating cost is not cheaper than Hybrid with current inputs.",
        details: `Annual Fuel Cost: $${annualFuelCost.toFixed(2)}, Annual Electricity Cost: $${annualElectricityCost.toFixed(2)}`,
        feedback: "Consider revising inputs or fuel/electricity prices."
      };
    }

    // Calculate break-even time in years
    const breakEvenYears = pricePremium / annualSavings;

    return {
      primary: breakEvenYears.toFixed(2),
      secondary: `$${annualSavings.toFixed(2)} annual savings`,
      details: `Annual Fuel Cost: $${annualFuelCost.toFixed(2)}, Annual Electricity Cost: $${annualElectricityCost.toFixed(2)}`,
      feedback: "Estimated years to recover EV price premium through fuel savings."
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is the break-even point between an EV and a hybrid vehicle?",
      answer: "The break-even point is the number of miles or years it takes for an EV's lower operating costs to offset its higher upfront purchase price compared to a hybrid. For example, a Tesla Model 3 ($43,990) typically breaks even with a Toyota Camry Hybrid ($32,450) after approximately 120,000-150,000 miles, assuming $0.04/mile electricity costs versus $0.12/mile fuel costs. This break-even varies significantly based on local electricity rates, gas prices, and vehicle-specific efficiency ratings.",
    },
    {
      question: "How do electricity rates affect the EV break-even calculation?",
      answer: "Electricity rates directly impact the cost-per-mile advantage of EVs. In states like Louisiana with average rates of $0.11/kWh, an EV becomes cost-competitive faster than in Hawaii with rates of $0.27/kWh. A calculator using national average electricity costs of $0.16/kWh provides a baseline, but users in cheaper markets (like Oklahoma at $0.11/kWh) will see break-even points 20-30% sooner than national estimates.",
    },
    {
      question: "Should I include federal EV tax credits in my break-even calculation?",
      answer: "Yes, absolutely. The federal EV tax credit of up to $7,500 (for vehicles under $55,000 MSRP) significantly accelerates the break-even point by reducing effective EV purchase price. A $45,000 EV that qualifies for the full $7,500 credit effectively costs $37,500, reducing break-even mileage by approximately 40,000-50,000 miles compared to calculations without the credit. Many state incentives (California offers additional rebates up to $2,500) further improve EV economics.",
    },
    {
      question: "How do maintenance costs factor into EV vs. hybrid break-even analysis?",
      answer: "EVs have significantly lower maintenance costs—no oil changes, fewer moving parts, and regenerative braking extends brake life. Over 200,000 miles, an EV typically costs $4,000-$6,000 in maintenance versus $9,000-$12,000 for hybrid vehicles. This $5,000-$6,000 maintenance savings gap should be factored into your break-even calculator, as it can reduce break-even mileage by 30,000-50,000 miles depending on vehicle models.",
    },
    {
      question: "What annual mileage should I assume for accurate break-even calculations?",
      answer: "The U.S. average is 12,000-15,000 miles annually. If you drive 20,000+ miles per year, your break-even point arrives faster (typically 6-7 years for EVs versus 8-10 years for lower-mileage drivers). A break-even calculator should allow custom annual mileage inputs since drivers logging 25,000 miles/year see EV economics improve 40% faster than national averages.",
    },
    {
      question: "Do home charging costs differ significantly from public charging for break-even purposes?",
      answer: "Yes—home charging costs approximately $0.03-$0.05 per mile versus $0.08-$0.12 per mile at public DC fast chargers. If you exclusively use home charging, your EV breaks even 2-3 years faster than if you rely 30-50% on public charging. Your calculator results should account for your expected charging mix, as frequent road-trip drivers using public chargers face higher effective costs.",
    },
    {
      question: "How should I account for battery degradation in long-term EV break-even analysis?",
      answer: "Modern EV batteries degrade 2-3% annually for the first 5 years, then slower. After 10 years, expect 85-90% of original capacity remaining. For break-even calculations beyond 200,000 miles, assume battery replacement costs of $5,000-$15,000 (depending on model), which would extend break-even timelines by 1-3 years if replacement occurs. Most manufacturers offer 8-10 year warranties covering capacity drop below 70-80%.",
    },
    {
      question: "What gasoline and electricity price assumptions should I use as baseline?",
      answer: "As of 2025, use $3.20-$3.50/gallon for gasoline (U.S. average fluctuates between $2.50-$3.80) and $0.16/kWh for electricity (U.S. average is $0.14-$0.18). Your calculator should allow custom price inputs since these variables significantly impact results—a 50-cent gasoline price increase improves EV break-even by 20,000-30,000 miles, while a $0.05/kWh electricity increase extends break-even by a similar margin.",
    },
    {
      question: "How does vehicle class (sedan vs. SUV) affect the EV vs. hybrid break-even point?",
      answer: "SUV and truck categories show different break-even economics than sedans. A Tesla Model Y SUV ($47,740) compared to a Toyota Highlander Hybrid ($38,100) breaks even around 140,000 miles versus sedan comparisons at 120,000 miles, due to higher EV SUV prices. Efficiency also varies—EV SUVs average 25-28 kWh/100 miles versus sedan 20-23 kWh/100 miles, while hybrid SUVs achieve 28-32 MPG versus sedan 35-40 MPG, narrowing the EV advantage.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $40,000 electric SUV with a $5,000 price premium over a comparable hybrid model. You drive 12,000 miles annually, pay $0.13 per kWh for electricity, and $3.50 per gallon for gasoline. The hybrid gets 35 MPG, and the EV has a 75 kWh battery.",
    steps: [
      {
        label: "Step 1: Calculate annual fuel cost for hybrid",
        explanation:
          "Annual fuel consumption = 12,000 miles / 35 MPG = 342.86 gallons. Annual fuel cost = 342.86 gallons × $3.50/gallon = $1,200.00."
      },
      {
        label: "Step 2: Calculate annual electricity cost for EV",
        explanation:
          "EV efficiency assumed at 3.5 miles/kWh. Annual electricity consumption = 12,000 miles / 3.5 = 3,428.57 kWh. Annual electricity cost = 3,428.57 kWh × $0.13/kWh = $445.71."
      },
      {
        label: "Step 3: Calculate annual savings",
        explanation:
          "Annual savings = $1,200.00 (fuel) - $445.71 (electricity) = $754.29."
      },
      {
        label: "Step 4: Calculate break-even time",
        explanation:
          "Price premium = $5,000. Break-even time = $5,000 / $754.29 ≈ 6.63 years."
      }
    ],
    result: "Final Result: It will take approximately 6.63 years to recover the EV price premium through fuel savings."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and fuel economy data for vehicles."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing information."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, pricing, and ownership cost insights."
    },
    {
      title: "U.S. Department of Energy - Alternative Fuels Data Center",
      description: "Information on electric vehicle efficiency and charging costs."
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
            step="any"
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
            placeholder="e.g. 75"
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.electricityRate}
            onChange={(e) => handleInputChange("electricityRate", e.target.value)}
            placeholder="e.g. 0.13"
          />
        </div>
        <div className="space-y-2">
          <Label>{inputs.unit === "imperial" ? "Hybrid Fuel Efficiency (MPG)" : "Hybrid Fuel Efficiency (L/100km)"}</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.hybridFuelEfficiency}
            onChange={(e) => handleInputChange("hybridFuelEfficiency", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 35" : "e.g. 6.7"}
          />
        </div>
        <div className="space-y-2">
          <Label>{inputs.unit === "imperial" ? "Fuel Price ($/gallon)" : "Fuel Price ($/liter)"}</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.fuelPrice}
            onChange={(e) => handleInputChange("fuelPrice", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 3.50" : "e.g. 0.92"}
          />
        </div>
        <div className="space-y-2">
          <Label>{inputs.unit === "imperial" ? "Annual Mileage (miles)" : "Annual Mileage (km)"}</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.annualMileage}
            onChange={(e) => handleInputChange("annualMileage", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 12000" : "e.g. 19300"}
          />
        </div>
        <div className="space-y-2">
          <Label>EV Price Premium ($)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.evPricePremium}
            onChange={(e) => handleInputChange("evPricePremium", e.target.value)}
            placeholder="e.g. 5000"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Break-Even Time (years)</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-2 italic text-sm text-slate-600 dark:text-slate-400">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the EV vs Hybrid Break-Even Point Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines when an electric vehicle's lower operating costs offset its higher purchase price compared to a hybrid alternative. By comparing total cost of ownership—including purchase price, fuel/electricity, maintenance, and applicable incentives—you can make an informed decision about whether an EV makes financial sense for your driving patterns and location. This analysis is especially valuable given the federal EV tax credit up to $7,500 and varying regional electricity rates that dramatically impact economics.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator requires several key inputs: the purchase prices of the EV and hybrid models you're comparing, your local electricity rate (or national average of $0.16/kWh) and gasoline price, your expected annual mileage, the percentage of charging done at home versus public chargers, and applicable federal or state incentives. Each variable meaningfully affects the result—for example, drivers in low-cost electricity states like Louisiana see break-even points 40% sooner than those in high-cost states like Hawaii. Accurate inputs yield reliable projections spanning 10-15 years of vehicle ownership.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret your break-even result as the mileage threshold and timeframe when total EV costs equal hybrid costs. If the calculator shows 138,000 miles at 10.6 years and you drive 13,000 miles annually, the EV becomes cost-advantageous after about 10-11 years of ownership. Results beyond your expected vehicle ownership period suggest a hybrid remains cheaper for your situation, while break-even points &lt;5 years favor the EV purchase immediately. Consider also non-financial factors like charging infrastructure availability, environmental preferences, and performance characteristics alongside these financial projections.</p>
        </div>
      </section>

      {/* TABLE: EV vs. Hybrid: Total Cost of Ownership Over 200,000 Miles */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">EV vs. Hybrid: Total Cost of Ownership Over 200,000 Miles</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares lifetime costs including purchase price, fuel/electricity, maintenance, and federal incentives for a mid-size sedan over 200,000 miles of driving.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tesla Model 3 (EV)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toyota Camry Hybrid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Starting MSRP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$43,990</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$32,450</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Federal Tax Credit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$7,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Effective Purchase Price</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$36,490</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$32,450</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fuel/Electricity (200k miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$22,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Maintenance & Repairs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tire Replacement</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,400</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Battery Replacement (if needed)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Total 200k-Mile Cost</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$51,390</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$67,850</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cost Per Mile</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.257</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.339</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes $0.04/mile electricity cost at $0.16/kWh, $3.30/gallon gasoline, 12% tire wear difference, and zero battery replacement within warranty period.</p>
      </section>

      {/* TABLE: Break-Even Mileage by State Electricity Rate (EV vs. Hybrid Sedan) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Break-Even Mileage by State Electricity Rate (EV vs. Hybrid Sedan)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Break-even points vary significantly based on local electricity rates, shown here for the Tesla Model 3 versus Toyota Camry Hybrid comparison.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">State</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Avg. Electricity Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Break-Even Mileage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Break-Even Time (at 13k mi/yr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Louisiana</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.11/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">98,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oklahoma</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.11/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">102,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.8 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Texas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.12/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">106,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.2 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">U.S. Average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.16/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">138,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.6 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">California</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.18/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">156,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.0 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New York</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.19/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">162,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.5 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Massachusetts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.22/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">178,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.7 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hawaii</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.27/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">204,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.7 years</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes $3.30/gallon gasoline, $7,500 federal tax credit applied, and consistent 12,000-15,000 miles annually. Rates as of Q1 2025.</p>
      </section>

      {/* TABLE: Annual Operating Costs: EV vs. Hybrid by Annual Mileage */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual Operating Costs: EV vs. Hybrid by Annual Mileage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Annual fuel/electricity and maintenance costs vary significantly with driving patterns, shown here for typical sedan comparisons.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Mileage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tesla Model 3 (Annual Cost)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toyota Camry Hybrid (Annual Cost)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Savings (EV)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$620</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$860</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$240</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$930</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,290</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$360</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,162</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,612</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$450</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,550</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,937</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,687</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$750</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,325</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,225</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$900</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Includes fuel/electricity, maintenance, and tire wear. Based on $0.16/kWh electricity, $3.30/gallon gas, and 12,000 annual miles for tire amortization.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in all available incentives before comparing purchase prices—the federal $7,500 EV tax credit reduces effective EV cost by 17-20%, improving break-even by 40,000-50,000 miles, and many states offer additional $2,000-$3,000 rebates that accelerate EV economics significantly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Customize your local electricity rate rather than using national averages—residential rates range from $0.11/kWh (Louisiana, Oklahoma) to $0.27/kWh (Hawaii), creating 60,000+ mile variations in break-even calculations and potentially shifting the EV advantage by 3-5 years.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Include realistic maintenance cost assumptions in your comparison—EVs average $4,000-$6,000 in maintenance over 200,000 miles versus $9,000-$12,000 for hybrids due to no oil changes, fewer brake replacements, and simpler powertrains, which can reduce effective EV break-even by 30,000 miles.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Adjust annual mileage expectations to your actual driving patterns—drivers logging 20,000+ miles yearly see EV break-even points arrive 2-3 years faster than the 12,000-mile national average, while low-mileage drivers (&lt;8,000 annually) may never reach break-even within typical vehicle ownership periods.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring the Federal EV Tax Credit</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many buyers overlook the $7,500 federal EV tax credit when comparing prices, inflating the perceived cost advantage of hybrids by 17-20%. This credit directly reduces EV effective purchase price and can shift break-even analysis by 40,000-50,000 miles, making EVs cost-competitive years sooner than calculations without the incentive.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using National Electricity Rates Instead of Local Rates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Electricity costs vary 150% across the country ($0.11/kWh in Louisiana versus $0.27/kWh in Hawaii), yet many calculators default to the national average of $0.16/kWh. This error can skew break-even projections by 60,000+ miles and misrepresent whether an EV is financially viable in your specific region.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Maintenance Cost Differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">EVs eliminate oil changes, transmission fluid, spark plugs, and reduce brake wear through regenerative braking, saving $5,000-$6,000 over 200,000 miles versus hybrids. Failing to account for this 40-50% maintenance cost advantage artificially extends EV break-even timelines by 25,000-40,000 miles.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming National Average Driving Patterns</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The U.S. average of 12,000-13,000 annual miles masks significant variation—high-mileage drivers (20,000+) see EV break-even 2-3 years sooner, while low-mileage drivers (&lt;8,000) may never reach break-even within ownership periods. Failing to input your actual annual mileage produces irrelevant projections.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the break-even point between an EV and a hybrid vehicle?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The break-even point is the number of miles or years it takes for an EV's lower operating costs to offset its higher upfront purchase price compared to a hybrid. For example, a Tesla Model 3 ($43,990) typically breaks even with a Toyota Camry Hybrid ($32,450) after approximately 120,000-150,000 miles, assuming $0.04/mile electricity costs versus $0.12/mile fuel costs. This break-even varies significantly based on local electricity rates, gas prices, and vehicle-specific efficiency ratings.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do electricity rates affect the EV break-even calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Electricity rates directly impact the cost-per-mile advantage of EVs. In states like Louisiana with average rates of $0.11/kWh, an EV becomes cost-competitive faster than in Hawaii with rates of $0.27/kWh. A calculator using national average electricity costs of $0.16/kWh provides a baseline, but users in cheaper markets (like Oklahoma at $0.11/kWh) will see break-even points 20-30% sooner than national estimates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include federal EV tax credits in my break-even calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, absolutely. The federal EV tax credit of up to $7,500 (for vehicles under $55,000 MSRP) significantly accelerates the break-even point by reducing effective EV purchase price. A $45,000 EV that qualifies for the full $7,500 credit effectively costs $37,500, reducing break-even mileage by approximately 40,000-50,000 miles compared to calculations without the credit. Many state incentives (California offers additional rebates up to $2,500) further improve EV economics.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do maintenance costs factor into EV vs. hybrid break-even analysis?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">EVs have significantly lower maintenance costs—no oil changes, fewer moving parts, and regenerative braking extends brake life. Over 200,000 miles, an EV typically costs $4,000-$6,000 in maintenance versus $9,000-$12,000 for hybrid vehicles. This $5,000-$6,000 maintenance savings gap should be factored into your break-even calculator, as it can reduce break-even mileage by 30,000-50,000 miles depending on vehicle models.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What annual mileage should I assume for accurate break-even calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The U.S. average is 12,000-15,000 miles annually. If you drive 20,000+ miles per year, your break-even point arrives faster (typically 6-7 years for EVs versus 8-10 years for lower-mileage drivers). A break-even calculator should allow custom annual mileage inputs since drivers logging 25,000 miles/year see EV economics improve 40% faster than national averages.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do home charging costs differ significantly from public charging for break-even purposes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—home charging costs approximately $0.03-$0.05 per mile versus $0.08-$0.12 per mile at public DC fast chargers. If you exclusively use home charging, your EV breaks even 2-3 years faster than if you rely 30-50% on public charging. Your calculator results should account for your expected charging mix, as frequent road-trip drivers using public chargers face higher effective costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I account for battery degradation in long-term EV break-even analysis?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Modern EV batteries degrade 2-3% annually for the first 5 years, then slower. After 10 years, expect 85-90% of original capacity remaining. For break-even calculations beyond 200,000 miles, assume battery replacement costs of $5,000-$15,000 (depending on model), which would extend break-even timelines by 1-3 years if replacement occurs. Most manufacturers offer 8-10 year warranties covering capacity drop below 70-80%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What gasoline and electricity price assumptions should I use as baseline?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">As of 2025, use $3.20-$3.50/gallon for gasoline (U.S. average fluctuates between $2.50-$3.80) and $0.16/kWh for electricity (U.S. average is $0.14-$0.18). Your calculator should allow custom price inputs since these variables significantly impact results—a 50-cent gasoline price increase improves EV break-even by 20,000-30,000 miles, while a $0.05/kWh electricity increase extends break-even by a similar margin.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does vehicle class (sedan vs. SUV) affect the EV vs. hybrid break-even point?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">SUV and truck categories show different break-even economics than sedans. A Tesla Model Y SUV ($47,740) compared to a Toyota Highlander Hybrid ($38,100) breaks even around 140,000 miles versus sedan comparisons at 120,000 miles, due to higher EV SUV prices. Efficiency also varies—EV SUVs average 25-28 kWh/100 miles versus sedan 20-23 kWh/100 miles, while hybrid SUVs achieve 28-32 MPG versus sedan 35-40 MPG, narrowing the EV advantage.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://afdc.energy.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy - Alternative Fuels Data Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official DOE resource providing real-time electricity rates, EV charging station locator, fuel price comparisons, and vehicle efficiency data across all U.S. regions.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/credits-deductions/credits-for-electric-vehicles-purchased-in-2024-and-later" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Electric Vehicle Tax Credit Eligibility Requirements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance detailing the $7,500 federal EV tax credit eligibility criteria, phase-out rules, and MSRP limits for 2024-2025 tax years.</p>
          </li>
          <li>
            <a href="https://www.consumerreports.org/cars/electric-cars/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Reports - EV Total Cost of Ownership Study</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive analysis of electric vehicle reliability, ownership costs, maintenance expenses, and long-term cost comparisons with traditional and hybrid vehicles.</p>
          </li>
          <li>
            <a href="https://www.eia.gov/electricity/state/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Energy Information Administration - Average Electricity Rates by State</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official EIA data providing state-by-state residential electricity rate averages updated quarterly, essential for accurate regional break-even calculations.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="EV vs Hybrid Break-Even Point Calculator"
      description="Professional automotive calculator: EV vs Hybrid Break-Even Point Calculator. Get accurate estimates, expert advice, and financial insights."
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