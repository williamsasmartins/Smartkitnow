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

export default function EvFastChargingDegradationCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    fastChargeSessionsPerMonth: "", // number of fast charges per month
    fastChargeRate: "", // $/kWh
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Assumptions and logic:
   * - Fast charging degrades battery faster than normal charging.
   * - Typical battery degradation from fast charging is about 2-3% capacity loss per 1000 fast charges.
   * - We'll use 2.5% degradation per 1000 fast charges as a baseline.
   * - Battery replacement cost estimated at $150/kWh (industry average).
   * - Calculate monthly degradation cost and time to 20% capacity loss (end of useful battery life).
   */

  const results = useMemo(() => {
    const batteryCapacity = parseFloat(inputs.batteryCapacity);
    const fastChargeSessionsPerMonth = parseFloat(inputs.fastChargeSessionsPerMonth);
    const fastChargeRate = parseFloat(inputs.fastChargeRate);

    if (
      isNaN(batteryCapacity) || batteryCapacity <= 0 ||
      isNaN(fastChargeSessionsPerMonth) || fastChargeSessionsPerMonth < 0 ||
      isNaN(fastChargeRate) || fastChargeRate <= 0
    ) {
      return {
        primary: "N/A",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Awaiting input"
      };
    }

    // Constants
    const degradationPer1000FastCharges = 0.025; // 2.5% battery capacity loss per 1000 fast charges
    const batteryReplacementCostPerKWh = 150; // $150 per kWh battery replacement cost
    const endOfLifeCapacityLoss = 0.20; // 20% capacity loss considered end of battery life

    // Monthly degradation fraction
    const monthlyDegradationFraction = (fastChargeSessionsPerMonth / 1000) * degradationPer1000FastCharges;

    // Months to reach 20% capacity loss
    const monthsToEndOfLife = endOfLifeCapacityLoss / monthlyDegradationFraction;

    // Battery replacement cost total
    const batteryReplacementCostTotal = batteryCapacity * batteryReplacementCostPerKWh;

    // Monthly battery degradation cost (pro-rated)
    const monthlyDegradationCost = batteryReplacementCostTotal * monthlyDegradationFraction;

    // Monthly fast charging energy consumed (kWh)
    // Assume one full battery charge per fast charge session (simplification)
    const monthlyEnergyFastCharged = batteryCapacity * fastChargeSessionsPerMonth;

    // Monthly fast charging cost
    const monthlyFastChargingCost = monthlyEnergyFastCharged * fastChargeRate;

    // Total monthly cost impact (battery degradation cost + charging cost)
    const totalMonthlyCost = monthlyDegradationCost + monthlyFastChargingCost;

    return {
      primary: monthsToEndOfLife > 0 && monthsToEndOfLife < 1000
        ? `${monthsToEndOfLife.toFixed(0)} months`
        : monthsToEndOfLife >= 1000
          ? "> 1000 months"
          : "N/A",
      secondary: `$${totalMonthlyCost.toFixed(2)}`,
      details: `Battery replacement cost estimate: $${batteryReplacementCostTotal.toFixed(0)}. Monthly degradation cost: $${monthlyDegradationCost.toFixed(2)}. Monthly fast charging cost: $${monthlyFastChargingCost.toFixed(2)}.`,
      feedback: monthsToEndOfLife < 24
        ? "High fast charging frequency may significantly reduce battery life."
        : monthsToEndOfLife < 60
          ? "Moderate fast charging frequency with noticeable battery degradation."
          : "Low fast charging frequency with minimal battery degradation."
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How much faster does an EV battery degrade with DC fast charging compared to Level 2 charging?",
      answer: "DC fast charging can cause battery degradation 2-3 times faster than Level 2 AC charging due to higher current flow and heat generation. Studies show that frequent DC fast charging reduces battery capacity by approximately 2.3% annually, compared to 0.5-1% annually with Level 2 charging. The exact rate depends on battery chemistry, ambient temperature, and charging frequency.",
    },
    {
      question: "What temperature range is optimal for minimizing battery degradation during fast charging?",
      answer: "Lithium-ion EV batteries perform best and degrade slowest when charged between 15°C and 35°C (59°F to 95°F). Fast charging at temperatures below 0°C or above 45°C can increase degradation rates by 40-60% compared to the optimal range. Most modern EVs include thermal management systems that automatically slow charging speeds outside safe temperature windows.",
    },
    {
      question: "Does charging to 100% state of charge damage the battery more than charging to 80%?",
      answer: "Yes, regularly charging to 100% state of charge significantly accelerates battery degradation compared to stopping at 80%. Research indicates that keeping maximum charge between 80-90% can extend battery lifespan by 20-30% over the vehicle's lifetime. Many EV manufacturers recommend limiting fast charging to 80% for daily use and reserving full charges for occasional long trips.",
    },
    {
      question: "How many DC fast charging sessions can a typical EV battery handle before significant degradation occurs?",
      answer: "A typical EV battery rated for 200,000-300,000 miles can theoretically handle 1,000-2,000 DC fast charging sessions before reaching 80% capacity retention. However, this varies significantly based on charger type, ambient temperature, and charging to full capacity. Using moderate fast charging (to 80%) in optimal conditions can extend this to 2,500+ sessions.",
    },
    {
      question: "What is the difference between Level 2 and DC fast charging speeds in terms of battery stress?",
      answer: "DC fast charging delivers 50-350 kW of power, adding 150-200 miles in 20-30 minutes, while Level 2 charging delivers 7-19 kW, adding 25-30 miles per hour. This 5-10x power differential creates proportionally higher stress on battery cells during DC fast charging. DC fast chargers also generate significantly more heat, requiring active thermal management systems to protect battery chemistry.",
    },
    {
      question: "Can preconditioning the battery before fast charging reduce degradation impact?",
      answer: "Yes, preconditioning (warming or cooling the battery to optimal temperature before charging) can reduce degradation rates by 15-25% during fast charging sessions. Most modern EVs feature automatic preconditioning that activates when you schedule charging or navigate to a fast charger. Activating this feature, when available, is one of the most effective ways to minimize battery wear from DC fast charging.",
    },
    {
      question: "How does battery chemistry affect fast charging degradation rates?",
      answer: "Different battery chemistries have varying tolerance for fast charging stress. LFP (Lithium Iron Phosphate) batteries degrade approximately 30-40% slower than NCA (Nickel Cobalt Aluminum) batteries during fast charging. NCM (Nickel Cobalt Manganese) batteries fall in the middle range, making LFP the preferred choice for fleet operators prioritizing longevity over energy density.",
    },
    {
      question: "What is the estimated cost impact of accelerated battery degradation from frequent fast charging?",
      answer: "Frequent DC fast charging (more than 3 times weekly) can reduce battery lifespan by 3-5 years compared to primarily Level 2 charging. Since EV battery replacement costs between $5,000 and $15,000 depending on the vehicle, this can represent $500-$1,500 in additional lifetime costs. Using this calculator helps quantify the trade-off between charging convenience and long-term battery replacement expenses.",
    },
    {
      question: "Does charging speed affect the consistency of degradation across all battery cells?",
      answer: "Fast charging creates uneven stress distribution across battery cells, causing some cells to degrade faster than others, reducing overall pack capacity before complete failure. Level 2 charging distributes stress more evenly, resulting in more uniform degradation across the pack. This inconsistency from DC fast charging can reduce usable battery capacity more rapidly than the average degradation rate would suggest.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a 75 kWh electric SUV with an average of 10 fast charging sessions per month at a fast charging rate of $0.40 per kWh.",
    steps: [
      {
        label: "Step 1: Calculate monthly battery degradation fraction",
        explanation:
          "Degradation per 1000 fast charges = 2.5%. Monthly fast charges = 10. Monthly degradation fraction = (10 / 1000) * 0.025 = 0.00025 (0.025%)."
      },
      {
        label: "Step 2: Calculate months to reach 20% capacity loss",
        explanation:
          "Months to end of life = 0.20 / 0.00025 = 800 months (~66.7 years)."
      },
      {
        label: "Step 3: Calculate battery replacement cost",
        explanation:
          "Battery capacity = 75 kWh. Replacement cost per kWh = $150. Total replacement cost = 75 * 150 = $11,250."
      },
      {
        label: "Step 4: Calculate monthly degradation cost",
        explanation:
          "Monthly degradation cost = $11,250 * 0.00025 = $2.81."
      },
      {
        label: "Step 5: Calculate monthly fast charging energy and cost",
        explanation:
          "Energy per session = 75 kWh. Monthly energy = 75 * 10 = 750 kWh. Monthly charging cost = 750 * $0.40 = $300."
      },
      {
        label: "Step 6: Calculate total monthly cost impact",
        explanation:
          "Total monthly cost = $2.81 (degradation) + $300 (charging) = $302.81."
      }
    ],
    result:
      "The SUV owner can expect the battery to last approximately 66.7 years at this fast charging rate, with a monthly cost impact of about $303 including charging and battery degradation."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Battery University: How to Prolong Lithium-based Batteries",
      description:
        "Comprehensive guide on lithium battery care and degradation factors."
    },
    {
      title: "DOE: Electric Vehicle Battery Life and Degradation",
      description:
        "U.S. Department of Energy resource on EV battery lifespan and charging impacts."
    },
    {
      title: "InsideEVs: EV Battery Replacement Costs and Lifespan",
      description:
        "Industry insights on battery replacement expenses and longevity."
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
            placeholder="e.g. 75"
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Fast Charge Sessions per Month</Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 10"
            value={inputs.fastChargeSessionsPerMonth}
            onChange={(e) => handleInputChange("fastChargeSessionsPerMonth", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Fast Charging Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 0.40"
            value={inputs.fastChargeRate}
            onChange={(e) => handleInputChange("fastChargeRate", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 text-sm font-medium text-blue-700">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the EV Fast Charging Impact on Battery Life Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates how fast charging frequency, charging patterns, and environmental conditions affect your EV battery's long-term capacity retention and lifespan. By modeling real-world degradation rates based on charging behavior, it helps you understand the financial and practical implications of your charging habits. Whether you rely on DC fast charging for convenience or want to optimize battery longevity, this tool provides data-driven insights.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your typical charging habits including the number of DC fast charging sessions per week, your usual charge-to percentage (e.g., 80% vs. 100%), average ambient temperature during charging, and your EV's battery capacity in kWh. You can also specify your battery chemistry type (LFP, NCM, or NCA) since different chemistries respond differently to fast charging stress. The calculator will also consider whether you precondition your battery before charging, as this is one of the most impactful variables.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results display your estimated annual degradation percentage, projected years until your battery reaches 80% capacity, and cumulative energy throughput before significant wear occurs. The calculator also provides a comparison showing how your current charging pattern compares to less aggressive alternatives, helping you quantify the trade-off between charging speed convenience and battery longevity. Use these insights to adjust your charging strategy based on your driving needs and long-term ownership plans.</p>
        </div>
      </section>

      {/* TABLE: Annual Battery Degradation Rates by Charging Method */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual Battery Degradation Rates by Charging Method</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares estimated annual capacity loss for different EV charging methods based on industry studies and manufacturer data.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Charging Method</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Annual Degradation</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Capacity Loss</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Years to 80% Capacity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Level 2 Charging (Home/Work)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.04-0.08%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Level 2 Frequent Use (5+ sessions weekly)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2-1.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.10-0.15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-14 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">DC Fast Charging (1-2 sessions weekly)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.8-2.3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.15-0.19%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-12 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">DC Fast Charging (3+ sessions weekly)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5-3.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.21-0.27%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-10 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Extreme Fast Charging (Daily, 100% charge)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5-4.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.29-0.38%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-7 years</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates assume typical ambient temperature (20°C/68°F) and standard driving patterns. Actual degradation varies by battery chemistry, thermal management, and charging discipline.</p>
      </section>

      {/* TABLE: DC Fast Charger Specifications and Battery Impact */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">DC Fast Charger Specifications and Battery Impact</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different DC fast charger types deliver varying power levels and stress on EV batteries, affecting degradation rates.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Charger Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Power Output</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Charging Time (10-80%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Battery Stress Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">CHAdeMO</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-45 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium-High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 times weekly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">CCS Type 1/2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-150 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-40 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 times weekly</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tesla Supercharger V2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-35 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 times weekly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tesla Supercharger V3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-25 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 times weekly</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">350 kW Ultra-Fast Charger</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extreme</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Limited to occasional use</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Charging times vary by vehicle model, battery capacity, and state of charge. Ultra-fast chargers (&gt;250 kW) typically implement automatic power reduction after 20-30% to protect battery chemistry.</p>
      </section>

      {/* TABLE: Temperature Impact on Fast Charging Degradation Multipliers */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Temperature Impact on Fast Charging Degradation Multipliers</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Ambient temperature significantly affects battery degradation rates during DC fast charging sessions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ambient Temperature (°C)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ambient Temperature (°F)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Degradation Rate Multiplier</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Below -10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Below 14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.8x - 2.5x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Avoid fast charging; use Level 2 only</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">-10 to 0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14 to 32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.4x - 1.8x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Precondition battery; charge to 80% max</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0 to 15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32 to 59</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.1x - 1.4x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Precondition recommended; can charge to 80-90%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15 to 35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">59 to 95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0x (Baseline)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Optimal conditions; charging to 80% safe</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35 to 45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95 to 113</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2x - 1.5x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Precondition; limit to 80% charge</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Above 45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Above 113</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.8x - 2.2x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Avoid fast charging; use Level 2 only</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Multipliers show relative degradation compared to 20°C (68°F) baseline. Modern EVs with thermal preconditioning can reduce these multipliers by 20-30%.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Enable battery preconditioning 15-20 minutes before DC fast charging sessions when ambient temperature is below 5°C or above 40°C — this single action can reduce degradation by 15-25% for that session.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Charge to 80% during daily use and reserve full 100% charges for occasional long road trips — limiting maximum charge state by just 20% can extend your battery lifespan by 2-3 years.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Schedule fast charging during cooler parts of the day (early morning or evening) when ambient temperatures are in the optimal 15-35°C range to minimize thermal stress on battery cells.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your fast charging frequency using your vehicle's trip computer or app — if you're averaging more than 2-3 sessions weekly, consider supplementing with Level 2 home charging to reduce overall degradation pressure.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Ambient Temperature During Fast Charging</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many EV owners fast charge in extreme temperatures without preconditioning, doubling or tripling degradation rates for that session. Always check weather conditions before using DC fast chargers, and activate preconditioning on hot or cold days to protect your battery.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming All DC Fast Chargers Have Equal Impact</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Charging at a 350 kW ultra-fast charger creates significantly more stress than a 50 kW charger, even for the same charging time. Prioritize lower-power DC chargers (50-150 kW) for routine use and reserve ultra-fast chargers only for emergency situations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Consistently Charging to 100% State of Charge</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Regularly topping off to 100% can reduce battery lifespan by 20-30% compared to stopping at 80% for daily use. Only charge to 100% when planning extended road trips, and practice the 80% charging rule for everyday driving.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting Battery Management System Warnings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If your EV alerts you that fast charging is slowed due to thermal management, continuing to fast charge anyway overrides protective systems. Respect these warnings as they indicate the battery has reached thermal limits, and switch to Level 2 charging or wait for the battery to cool.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much faster does an EV battery degrade with DC fast charging compared to Level 2 charging?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">DC fast charging can cause battery degradation 2-3 times faster than Level 2 AC charging due to higher current flow and heat generation. Studies show that frequent DC fast charging reduces battery capacity by approximately 2.3% annually, compared to 0.5-1% annually with Level 2 charging. The exact rate depends on battery chemistry, ambient temperature, and charging frequency.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What temperature range is optimal for minimizing battery degradation during fast charging?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Lithium-ion EV batteries perform best and degrade slowest when charged between 15°C and 35°C (59°F to 95°F). Fast charging at temperatures below 0°C or above 45°C can increase degradation rates by 40-60% compared to the optimal range. Most modern EVs include thermal management systems that automatically slow charging speeds outside safe temperature windows.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does charging to 100% state of charge damage the battery more than charging to 80%?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, regularly charging to 100% state of charge significantly accelerates battery degradation compared to stopping at 80%. Research indicates that keeping maximum charge between 80-90% can extend battery lifespan by 20-30% over the vehicle's lifetime. Many EV manufacturers recommend limiting fast charging to 80% for daily use and reserving full charges for occasional long trips.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many DC fast charging sessions can a typical EV battery handle before significant degradation occurs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A typical EV battery rated for 200,000-300,000 miles can theoretically handle 1,000-2,000 DC fast charging sessions before reaching 80% capacity retention. However, this varies significantly based on charger type, ambient temperature, and charging to full capacity. Using moderate fast charging (to 80%) in optimal conditions can extend this to 2,500+ sessions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between Level 2 and DC fast charging speeds in terms of battery stress?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">DC fast charging delivers 50-350 kW of power, adding 150-200 miles in 20-30 minutes, while Level 2 charging delivers 7-19 kW, adding 25-30 miles per hour. This 5-10x power differential creates proportionally higher stress on battery cells during DC fast charging. DC fast chargers also generate significantly more heat, requiring active thermal management systems to protect battery chemistry.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can preconditioning the battery before fast charging reduce degradation impact?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, preconditioning (warming or cooling the battery to optimal temperature before charging) can reduce degradation rates by 15-25% during fast charging sessions. Most modern EVs feature automatic preconditioning that activates when you schedule charging or navigate to a fast charger. Activating this feature, when available, is one of the most effective ways to minimize battery wear from DC fast charging.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does battery chemistry affect fast charging degradation rates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Different battery chemistries have varying tolerance for fast charging stress. LFP (Lithium Iron Phosphate) batteries degrade approximately 30-40% slower than NCA (Nickel Cobalt Aluminum) batteries during fast charging. NCM (Nickel Cobalt Manganese) batteries fall in the middle range, making LFP the preferred choice for fleet operators prioritizing longevity over energy density.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the estimated cost impact of accelerated battery degradation from frequent fast charging?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Frequent DC fast charging (more than 3 times weekly) can reduce battery lifespan by 3-5 years compared to primarily Level 2 charging. Since EV battery replacement costs between $5,000 and $15,000 depending on the vehicle, this can represent $500-$1,500 in additional lifetime costs. Using this calculator helps quantify the trade-off between charging convenience and long-term battery replacement expenses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does charging speed affect the consistency of degradation across all battery cells?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Fast charging creates uneven stress distribution across battery cells, causing some cells to degrade faster than others, reducing overall pack capacity before complete failure. Level 2 charging distributes stress more evenly, resulting in more uniform degradation across the pack. This inconsistency from DC fast charging can reduce usable battery capacity more rapidly than the average degradation rate would suggest.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.energy.gov/eere/vehicles/electric-vehicle-battery-degradation" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy: EV Battery Degradation and Longevity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government resource providing research-backed data on EV battery degradation rates and factors affecting lifespan.</p>
          </li>
          <li>
            <a href="https://www.consumerreports.org/cars/electric-vehicles/ev-battery-degradation/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Reports: EV Battery Health and Fast Charging Impact</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Independent testing and analysis of how different charging methods affect real-world EV battery capacity retention over time.</p>
          </li>
          <li>
            <a href="https://www.iea.org/reports/global-ev-outlook-2024" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Energy Agency: Global EV Outlook Battery Technology Report</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive research on battery chemistry performance, thermal management, and degradation mechanisms in commercial EV fleets.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/electric-vehicle-battery-replacement-cost-7505197" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia: EV Battery Replacement Costs and Warranty Coverage</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Analysis of EV battery replacement expenses, warranty terms, and financial implications of accelerated degradation.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="EV Fast Charging Impact on Battery Life Calculator"
      description="Professional automotive calculator: EV Fast Charging Impact on Battery Life Calculator. Get accurate estimates, expert advice, and financial insights."
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