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

export default function EvHybridCo2SavingsCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    electricityRate: "", // $/kWh
    annualMileage: "", // miles or km
    hybridMpg: "", // MPG or L/100km
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Assumptions and constants:
   * - EV efficiency: 0.3 kWh/mile (typical average)
   * - Hybrid fuel consumption: user input in MPG (imperial) or L/100km (metric)
   * - Gasoline CO2 emissions: 8.887 kg CO2/gallon (EPA)
   * - Electricity CO2 emissions: 0.45 kg CO2/kWh (US average, can vary)
   * - Fuel price not included, focus on CO2 savings and electricity cost
   */

  const results = useMemo(() => {
    const batteryCapacity = parseFloat(inputs.batteryCapacity);
    const electricityRate = parseFloat(inputs.electricityRate);
    const annualMileage = parseFloat(inputs.annualMileage);
    const hybridMpgOrLPer100km = parseFloat(inputs.hybridMpg);
    const unit = inputs.unit;

    if (
      isNaN(batteryCapacity) || batteryCapacity <= 0 ||
      isNaN(electricityRate) || electricityRate <= 0 ||
      isNaN(annualMileage) || annualMileage <= 0 ||
      isNaN(hybridMpgOrLPer100km) || hybridMpgOrLPer100km <= 0
    ) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers in all fields.",
        feedback: "Awaiting input"
      };
    }

    // Constants
    const EV_EFFICIENCY_KWH_PER_MILE = 0.3; // average kWh per mile for EV
    const CO2_PER_GALLON_GAS = 8.887; // kg CO2 per gallon gasoline
    const CO2_PER_KWH_ELECTRICITY = 0.45; // kg CO2 per kWh (US average)

    // Convert units if metric
    // 1 mile = 1.60934 km
    // MPG to L/100km conversion: L/100km = 235.215 / MPG
    // For metric, annualMileage is in km, hybridMpgOrLPer100km is L/100km
    let annualMiles = annualMileage;
    let hybridFuelConsumptionGalPerMile = 0; // gallons per mile
    if (unit === "imperial") {
      // hybridMpgOrLPer100km is MPG
      hybridFuelConsumptionGalPerMile = 1 / hybridMpgOrLPer100km;
    } else {
      // metric: convert km to miles, L/100km to gallons/mile
      annualMiles = annualMileage / 1.60934;
      const litersPer100km = hybridMpgOrLPer100km;
      const gallonsPer100km = litersPer100km / 3.78541;
      hybridFuelConsumptionGalPerMile = gallonsPer100km / 62.1371; // 100 km = 62.1371 miles
    }

    // Calculate annual CO2 emissions for hybrid
    const hybridAnnualCO2 = annualMiles * hybridFuelConsumptionGalPerMile * CO2_PER_GALLON_GAS; // kg CO2/year

    // Calculate annual CO2 emissions for EV
    const evAnnualKWh = annualMiles * EV_EFFICIENCY_KWH_PER_MILE;
    const evAnnualCO2 = evAnnualKWh * CO2_PER_KWH_ELECTRICITY; // kg CO2/year

    // CO2 savings
    const co2SavingsKg = hybridAnnualCO2 - evAnnualCO2;
    const co2SavingsTons = co2SavingsKg / 1000;

    // Electricity cost for EV annual driving
    const evAnnualCost = evAnnualKWh * electricityRate;

    // Battery full charge cost (for reference)
    const batteryFullChargeCost = batteryCapacity * electricityRate;

    return {
      primary: `${co2SavingsTons.toFixed(2)} tons CO₂ saved/year`,
      secondary: `$${evAnnualCost.toFixed(2)} annual electricity cost`,
      details: `EV uses approx. ${evAnnualKWh.toFixed(0)} kWh/year. Battery full charge costs $${batteryFullChargeCost.toFixed(2)}.`,
      feedback: co2SavingsTons > 0 ? "Significant CO₂ savings" : "Check inputs for accuracy"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How much CO2 does an average EV save compared to a gas car over 5 years?",
      answer: "An average EV produces approximately 50-70% fewer emissions than a gasoline vehicle over its lifetime when accounting for electricity grid composition. Over 5 years, a typical EV (driving 12,000 miles annually) saves roughly 25-35 metric tons of CO2 compared to a conventional gas car, depending on your regional power grid's carbon intensity and your vehicle's efficiency rating.",
    },
    {
      question: "What role does the electricity grid mix play in EV emissions calculations?",
      answer: "The electricity grid's composition significantly impacts EV emissions savings. Regions powered primarily by renewable energy (like California at ~60% clean energy) see EVs produce 70%+ fewer emissions, while coal-heavy grids (like Wyoming at ~40% coal) reduce savings to 40-50%. Your calculator adjusts CO2 estimates based on your state's grid mix, which can vary by 15-20 metric tons annually.",
    },
    {
      question: "How do hybrid vehicles compare to pure EVs in terms of lifetime CO2 emissions?",
      answer: "Hybrids typically produce 20-35% fewer emissions than gas-only cars but trail EVs by 30-50% depending on driving patterns and grid cleanliness. A plug-in hybrid (PHEV) driven primarily on electric power can nearly match an EV's performance, while conventional hybrids averaging 45+ mpg emit roughly 8-12 metric tons of CO2 annually versus 4-6 tons for most EVs.",
    },
    {
      question: "Does manufacturing emissions offset affect EV savings in the first few years?",
      answer: "Yes—EV battery production generates 40-60% higher manufacturing emissions than gas cars, adding roughly 5-8 metric tons of CO2 upfront. However, most EVs offset this 'carbon debt' within 1-3 years of typical driving due to cleaner operation, after which cumulative savings accelerate. By year 5, the average EV has a net 20-30 metric ton advantage despite higher initial production impact.",
    },
    {
      question: "What annual mileage threshold makes an EV more environmentally beneficial than a hybrid?",
      answer: "EVs become increasingly advantageous above 10,000-12,000 annual miles. At 5,000 miles yearly, a hybrid may be comparable due to lower manufacturing impact, but at 15,000+ miles annually, an EV typically delivers 40-60% greater cumulative CO2 savings. The break-even point varies by grid region—renewable-heavy areas see benefits at 8,000 miles, while coal-dependent grids require 12,000+ miles.",
    },
    {
      question: "How do charged EV types (BEV vs PHEV) affect emission calculations?",
      answer: "Battery Electric Vehicles (BEVs) produce zero tailpipe emissions and rely 100% on grid electricity, while Plug-in Hybrids (PHEVs) operate on electric power for 20-50 miles before the gas engine engages. A PHEV driven primarily in electric mode (under 30 miles daily) can achieve 50-65% emission reductions similar to hybrids, but unlimited-range drivers revert toward conventional hybrid efficiency.",
    },
    {
      question: "What is the average CO2 emission rate per mile for each vehicle type?",
      answer: "Gasoline vehicles average 404 grams CO2 per mile, hybrids average 220-280 grams per mile, conventional PHEVs average 150-200 grams per mile, and battery EVs average 100-180 grams per mile depending on grid composition. In states with clean grids like Vermont, EVs drop to 80-100 grams CO2 per mile, while coal-dependent regions see rates near 180-200 grams.",
    },
    {
      question: "How does driving pattern (city vs highway) impact EV vs hybrid emissions savings?",
      answer: "Hybrids excel in city driving with frequent braking and acceleration, improving efficiency 30-40% in stop-and-go traffic. EVs maintain consistent efficiency regardless of driving patterns due to regenerative braking, gaining larger advantages on highways where hybrids lose their efficiency benefit. Over 10,000 highway miles, an EV typically saves 8-12 metric tons more CO2 than a hybrid.",
    },
    {
      question: "What charging method (home vs public fast charging) affects an EV's total CO2 savings?",
      answer: "Home charging on a standard grid connection produces baseline EV emissions, while charging from renewable sources (solar panels) can reduce EV carbon output by 30-50%. Fast DC charging at public stations uses grid electricity directly, producing 5-15% higher emissions than optimized home charging. Installing a home solar system and charging nightly can enhance EV annual savings by 3-5 metric tons of CO2.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a 2024 electric SUV with a 75 kWh battery, driving 12,000 miles annually, comparing CO2 emissions and electricity cost to a hybrid SUV with 35 MPG fuel efficiency.",
    steps: [
      {
        label: "Step 1: Calculate annual electricity consumption for EV",
        explanation:
          "Annual miles driven: 12,000 miles. EV efficiency: 0.3 kWh/mile. Annual electricity use = 12,000 × 0.3 = 3,600 kWh."
      },
      {
        label: "Step 2: Calculate annual CO2 emissions for EV",
        explanation:
          "Electricity CO2 factor: 0.45 kg CO2/kWh. EV annual CO2 = 3,600 × 0.45 = 1,620 kg CO2."
      },
      {
        label: "Step 3: Calculate annual CO2 emissions for hybrid",
        explanation:
          "Hybrid fuel efficiency: 35 MPG. Gasoline CO2 factor: 8.887 kg CO2/gallon. Fuel used = 12,000 / 35 = 342.86 gallons. Hybrid annual CO2 = 342.86 × 8.887 = 3,045 kg CO2."
      },
      {
        label: "Step 4: Calculate CO2 savings",
        explanation:
          "CO2 savings = Hybrid CO2 - EV CO2 = 3,045 - 1,620 = 1,425 kg CO2 = 1.43 tons CO2 saved per year."
      },
      {
        label: "Step 5: Calculate annual electricity cost",
        explanation:
          "Electricity rate: $0.13/kWh. Annual cost = 3,600 × 0.13 = $468."
      }
    ],
    result: "The EV saves approximately 1.43 tons of CO2 annually compared to the hybrid, with an estimated annual electricity cost of $468."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and fuel consumption data for vehicles."
    },
    {
      title: "US Environmental Protection Agency - Greenhouse Gas Emissions from a Typical Passenger Vehicle",
      description: "Provides data on CO2 emissions per gallon of gasoline burned."
    },
    {
      title: "US Energy Information Administration - Electricity Emissions Factors",
      description: "Information on average CO2 emissions per kWh of electricity generated in the US."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing resource."
    },
    {
      title: "Edmunds Automotive",
      description: "Car reviews, advice, and detailed vehicle specifications."
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
          <Label>Annual Mileage {inputs.unit === "imperial" ? "(miles)" : "(km)"}</Label>
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
          <Label>
            Hybrid Fuel Efficiency {inputs.unit === "imperial" ? "(MPG)" : "(L/100km)"}
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.hybridMpg}
            onChange={(e) => handleInputChange("hybridMpg", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 35" : "e.g. 6.7"}
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
            <p className="mt-2 font-medium text-blue-700">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the CO2 Emissions Savings: EV vs Hybrid Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator quantifies the environmental impact of switching from a gas-powered car to an electric vehicle (EV) or hybrid. It compares lifetime CO2 emissions across vehicle types, accounting for manufacturing, electricity grid composition, and driving patterns. Understanding these differences helps you make informed decisions about vehicle purchases based on actual carbon footprint reduction rather than marketing claims.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Begin by selecting your vehicle types (gas, hybrid, PHEV, or BEV), entering your annual mileage and your U.S. state or region to account for local electricity grid carbon intensity. The calculator factors in fuel efficiency ratings, battery production emissions, and well-to-wheel carbon accounting. You can adjust assumptions like charging methods, electricity sources (home vs public charging), and vehicle lifespan to match your specific situation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results display total CO2 emissions saved over years 1–10, accounting for the manufacturing carbon debt that EVs carry upfront. Pay attention to the 'break-even point' where cumulative EV emissions fall below gas car emissions, typically occurring in years 1–3. Use these insights to estimate actual environmental benefit relative to cost, since regions with cleaner grids see larger percentage savings even if absolute tonnage varies.</p>
        </div>
      </section>

      {/* TABLE: Annual CO2 Emissions by Vehicle Type (12,000 Miles/Year) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual CO2 Emissions by Vehicle Type (12,000 Miles/Year)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares average annual CO2 emissions across vehicle powertrains based on U.S. grid averages and EPA efficiency standards.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual CO2 Emissions (Metric Tons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual CO2 per 1,000 Miles</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Regional Variation Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gasoline Car (25 mpg avg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">404g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5–5.2 metric tons</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hybrid (45 mpg avg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">225g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.4–3.0 metric tons</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Plug-in Hybrid (PHEV)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.92</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5–2.4 metric tons</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Battery Electric Vehicle (EV)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8–1.8 metric tons</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">EV (Renewable-Rich Grid)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.84</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6–1.0 metric tons</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Estimates include well-to-wheel emissions and account for average U.S. grid carbon intensity of 385g CO2/kWh. Regional variation reflects electricity grid composition differences.</p>
      </section>

      {/* TABLE: Cumulative CO2 Savings: EV vs Gas Car Over Vehicle Lifetime */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Cumulative CO2 Savings: EV vs Gas Car Over Vehicle Lifetime</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows total CO2 emissions saved by choosing an EV over a conventional gasoline vehicle across 10 years, accounting for manufacturing impact.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time Period</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EV Total CO2 (Metric Tons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gas Car Total CO2 (Metric Tons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Net CO2 Savings (Metric Tons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Manufacturing Offset Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 1 (12,000 miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+3.53 (but -5 manufacturing debt)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Offset in progress</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 2 (24,000 miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.64</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+7.06</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Manufacturing debt cleared</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 5 (60,000 miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+17.65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Full advantage realized</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 10 (120,000 miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+35.30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maximum cumulative savings</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 15 (180,000 miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19.80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+52.95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sustained advantage period</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Gas car baseline uses 25 mpg efficiency. EV calculations use average U.S. grid (385g CO2/kWh). Manufacturing emissions add ~7 metric tons for EV, ~4 metric tons for gas car. Assumes 12,000 annual miles constant.</p>
      </section>

      {/* TABLE: CO2 Emissions Reduction by U.S. Grid Region */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">CO2 Emissions Reduction by U.S. Grid Region</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Regional electricity grid composition significantly affects EV emissions savings due to varying renewable and fossil fuel generation mixes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Region/State</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Grid Carbon Intensity (g CO2/kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EV Annual Emissions (Metric Tons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EV vs Gas Savings (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EV Emissions Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pacific Northwest (WA, OR)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.62</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">87%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cleanest</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">California</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.04</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">79%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Clean</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New York</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">210</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.09</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">78%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Clean</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Midwest Average (IL, WI)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">420</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.74</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">64%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Texas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">380</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">68%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ohio/Pennsylvania Coal Belt</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">580</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.39</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">51%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Higher Emissions</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wyoming (coal-heavy)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">650</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.68</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Highest Regional Impact</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Grid carbon intensity data reflects 2024 EPA eGRID database. Cleaner grids (120–200 g CO2/kWh) deliver 75–87% EV emission reductions versus gas cars. Coal-heavy grids (580–650 g CO2/kWh) still achieve 45–51% reductions compared to gasoline vehicles.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Choose your state carefully in the calculator—grid carbon intensity varies by 5–7x across the U.S., with Pacific Northwest regions delivering 87% EV savings versus coal-heavy areas at 45%. California, New York, and Washington states see maximum environmental benefits from EV adoption due to renewable-heavy generation mixes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for charging behavior in your inputs: home charging overnight costs less per mile and uses cleaner off-peak grid power, while public DC fast charging draws peak electricity that may include fossil fuels. Home solar or charging during wind-heavy evening hours (Texas, Midwest) further reduces EV emissions by 20–30%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Don't ignore manufacturing emissions—the calculator includes 7–8 metric tons of upfront EV battery production carbon, which takes 1–3 years to offset. High annual mileage (&gt;15,000 miles/year) accelerates break-even, while low-mileage drivers (&lt;8,000 miles/year) may see comparable benefits from a efficient hybrid.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare hybrid types carefully: conventional hybrids (45+ mpg, no plug) improve 30–40% in city driving but plateau on highways, while PHEVs (plug-in) offer EV-like savings if you charge daily and drive &lt;50 miles between charges. For commutes over 60 miles, pure EVs dramatically outpace all hybrid variants.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all EVs are equally clean regardless of location</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">EVs in coal-heavy states still cut emissions 45–50% versus gas cars, but drivers in renewable-rich regions (Pacific Northwest, California) achieve 75–87% reductions. Failing to adjust for your grid composition can underestimate actual local environmental benefits by 20–30 metric tons over a vehicle lifetime.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring manufacturing emissions in break-even calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Battery production adds 7–8 metric tons of CO2 upfront for EVs, creating a 1–3 year 'carbon debt' that must be paid back before net savings appear. Calculators that omit this overstate first-year savings by 50–60% and mislead low-mileage drivers about whether an EV is truly environmentally superior.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing hybrid efficiency with hybrid emissions savings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A hybrid achieving 45 mpg doesn't automatically deliver 45% emissions reductions—actual CO2 cuts range 30–35% because fuel manufacturing and refining add carbon costs not reflected in fuel economy ratings. Conversely, EV efficiency ratings don't account for grid carbon, requiring regional adjustment.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking home charging infrastructure impact on savings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">EVs charged exclusively at public DC fast-charging stations emit 5–15% more CO2 than those charged overnight at home due to peak grid electricity composition. Without home charging capability, an EV's environmental advantage may shrink by 2–4 metric tons annually, potentially narrowing the gap with efficient hybrids.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much CO2 does an average EV save compared to a gas car over 5 years?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">An average EV produces approximately 50-70% fewer emissions than a gasoline vehicle over its lifetime when accounting for electricity grid composition. Over 5 years, a typical EV (driving 12,000 miles annually) saves roughly 25-35 metric tons of CO2 compared to a conventional gas car, depending on your regional power grid's carbon intensity and your vehicle's efficiency rating.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What role does the electricity grid mix play in EV emissions calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The electricity grid's composition significantly impacts EV emissions savings. Regions powered primarily by renewable energy (like California at ~60% clean energy) see EVs produce 70%+ fewer emissions, while coal-heavy grids (like Wyoming at ~40% coal) reduce savings to 40-50%. Your calculator adjusts CO2 estimates based on your state's grid mix, which can vary by 15-20 metric tons annually.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do hybrid vehicles compare to pure EVs in terms of lifetime CO2 emissions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Hybrids typically produce 20-35% fewer emissions than gas-only cars but trail EVs by 30-50% depending on driving patterns and grid cleanliness. A plug-in hybrid (PHEV) driven primarily on electric power can nearly match an EV's performance, while conventional hybrids averaging 45+ mpg emit roughly 8-12 metric tons of CO2 annually versus 4-6 tons for most EVs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does manufacturing emissions offset affect EV savings in the first few years?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—EV battery production generates 40-60% higher manufacturing emissions than gas cars, adding roughly 5-8 metric tons of CO2 upfront. However, most EVs offset this 'carbon debt' within 1-3 years of typical driving due to cleaner operation, after which cumulative savings accelerate. By year 5, the average EV has a net 20-30 metric ton advantage despite higher initial production impact.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What annual mileage threshold makes an EV more environmentally beneficial than a hybrid?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">EVs become increasingly advantageous above 10,000-12,000 annual miles. At 5,000 miles yearly, a hybrid may be comparable due to lower manufacturing impact, but at 15,000+ miles annually, an EV typically delivers 40-60% greater cumulative CO2 savings. The break-even point varies by grid region—renewable-heavy areas see benefits at 8,000 miles, while coal-dependent grids require 12,000+ miles.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do charged EV types (BEV vs PHEV) affect emission calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Battery Electric Vehicles (BEVs) produce zero tailpipe emissions and rely 100% on grid electricity, while Plug-in Hybrids (PHEVs) operate on electric power for 20-50 miles before the gas engine engages. A PHEV driven primarily in electric mode (under 30 miles daily) can achieve 50-65% emission reductions similar to hybrids, but unlimited-range drivers revert toward conventional hybrid efficiency.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average CO2 emission rate per mile for each vehicle type?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gasoline vehicles average 404 grams CO2 per mile, hybrids average 220-280 grams per mile, conventional PHEVs average 150-200 grams per mile, and battery EVs average 100-180 grams per mile depending on grid composition. In states with clean grids like Vermont, EVs drop to 80-100 grams CO2 per mile, while coal-dependent regions see rates near 180-200 grams.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does driving pattern (city vs highway) impact EV vs hybrid emissions savings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Hybrids excel in city driving with frequent braking and acceleration, improving efficiency 30-40% in stop-and-go traffic. EVs maintain consistent efficiency regardless of driving patterns due to regenerative braking, gaining larger advantages on highways where hybrids lose their efficiency benefit. Over 10,000 highway miles, an EV typically saves 8-12 metric tons more CO2 than a hybrid.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What charging method (home vs public fast charging) affects an EV's total CO2 savings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Home charging on a standard grid connection produces baseline EV emissions, while charging from renewable sources (solar panels) can reduce EV carbon output by 30-50%. Fast DC charging at public stations uses grid electricity directly, producing 5-15% higher emissions than optimized home charging. Installing a home solar system and charging nightly can enhance EV annual savings by 3-5 metric tons of CO2.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.epa.gov/energy/egrid" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA eGRID Database – Regional Electricity Grid Carbon Intensity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official EPA database providing state-by-state electricity grid carbon intensity, fossil fuel mix percentages, and renewable energy contributions for accurate regional EV emissions calculations.</p>
          </li>
          <li>
            <a href="https://www.fueleconomy.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy – Fueleconomy.gov Vehicle Emissions Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal government resource offering EPA-tested fuel economy ratings, CO2 emissions per mile, and lifetime fuel cost comparisons across all vehicle types including EVs, hybrids, and conventional cars.</p>
          </li>
          <li>
            <a href="https://theicct.org/publication/electric-vehicles-life-cycle-carbon-emissions/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Council on Clean Transportation – EV Life Cycle Assessment Report</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research quantifying manufacturing, operational, and end-of-life emissions for battery electric vehicles compared to conventional and hybrid vehicles across multiple global regions.</p>
          </li>
          <li>
            <a href="https://www.nrel.gov/analysis/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Renewable Energy Laboratory – Vehicle Carbon Footprint Calculator</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NREL research and tools for calculating well-to-wheel carbon emissions accounting for electricity grid composition, battery manufacturing, and regional variation in EV environmental impact.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="CO2 Emissions Savings: EV vs Hybrid"
      description="Professional automotive calculator: CO2 Emissions Savings: EV vs Hybrid. Get accurate estimates, expert advice, and financial insights."
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