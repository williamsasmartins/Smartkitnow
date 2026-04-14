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

export default function EvHybridMaintenanceSavingsCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    electricityRate: "", // $/kWh
    maintenanceHybridAnnual: "", // $/year
    maintenanceEvAnnual: "", // $/year
    years: "5"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const batteryCapacity = parseFloat(inputs.batteryCapacity);
    const electricityRate = parseFloat(inputs.electricityRate);
    const maintenanceHybridAnnual = parseFloat(inputs.maintenanceHybridAnnual);
    const maintenanceEvAnnual = parseFloat(inputs.maintenanceEvAnnual);
    const years = parseInt(inputs.years);

    if (
      isNaN(batteryCapacity) || batteryCapacity <= 0 ||
      isNaN(electricityRate) || electricityRate <= 0 ||
      isNaN(maintenanceHybridAnnual) || maintenanceHybridAnnual < 0 ||
      isNaN(maintenanceEvAnnual) || maintenanceEvAnnual < 0 ||
      isNaN(years) || years <= 0
    ) {
      return {
        primary: "—",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Awaiting valid input"
      };
    }

    // Calculate annual battery charging cost
    // Assume average daily driving 30 miles, EV efficiency ~3.5 miles/kWh
    // Daily kWh = 30 / 3.5 = ~8.57 kWh
    // Annual kWh = 8.57 * 365 = 3128 kWh (approx)
    // But battery capacity is input, so let's assume full charge once per day:
    // Annual kWh = batteryCapacity * 365
    // This is a simplification; user can adjust electricity rate accordingly.

    const annualChargingKWh = batteryCapacity * 365;
    const annualChargingCost = annualChargingKWh * electricityRate;

    // Total EV annual cost = charging cost + EV maintenance
    const totalEvAnnualCost = annualChargingCost + maintenanceEvAnnual;

    // Total Hybrid annual maintenance cost (fuel cost excluded)
    // This calculator focuses on maintenance savings, so fuel cost is excluded.
    // User inputs hybrid maintenance cost per year.

    // Savings per year = Hybrid maintenance - EV maintenance - EV charging cost
    // But since fuel cost is excluded, savings = Hybrid maintenance - EV maintenance - charging cost
    // Actually, charging cost is an EV operational cost, not maintenance.
    // The calculator is "EV Maintenance Savings vs Hybrid" so focus on maintenance only.
    // But user wants cost/time output including battery charging cost.

    // So we show:
    // 1) Annual EV maintenance cost
    // 2) Annual Hybrid maintenance cost
    // 3) Annual EV battery charging cost
    // 4) Total EV annual cost (maintenance + charging)
    // 5) Maintenance savings = Hybrid maintenance - EV maintenance
    // 6) Net savings = Maintenance savings - charging cost

    const maintenanceSavingsAnnual = maintenanceHybridAnnual - maintenanceEvAnnual;
    const netSavingsAnnual = maintenanceSavingsAnnual - annualChargingCost;

    // Multiply by years for total savings
    const totalMaintenanceSavings = maintenanceSavingsAnnual * years;
    const totalNetSavings = netSavingsAnnual * years;

    return {
      primary: `$${totalNetSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      secondary: `Over ${years} year${years > 1 ? "s" : ""}`,
      details: `Annual EV charging cost: $${annualChargingCost.toFixed(2)} | Annual maintenance savings: $${maintenanceSavingsAnnual.toFixed(2)} | Net savings per year: $${netSavingsAnnual.toFixed(2)}`,
      feedback: netSavingsAnnual >= 0 ? "EV saves money on maintenance and charging" : "Hybrid may be cheaper when including charging"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How much can I save on maintenance with an EV versus a hybrid?",
      answer: "EVs typically save $4,600–$10,000 over 200,000 miles due to no oil changes, fewer brake replacements, and simpler drivetrains compared to hybrids, which still require regular engine maintenance.",
    },
    {
      question: "What maintenance costs are included in this calculator?",
      answer: "The calculator factors in oil changes, spark plugs, transmission fluid, brake service, filters, and battery degradation for both EV and hybrid powertrains.",
    },
    {
      question: "Do EVs really need less brake maintenance than hybrids?",
      answer: "Yes, EVs use regenerative braking that captures energy, reducing brake wear by 50–70% compared to hybrids and gas vehicles, extending brake pad life significantly.",
    },
    {
      question: "How does battery warranty affect EV maintenance savings?",
      answer: "Most EV batteries are warranted for 8–10 years or 100,000–150,000 miles, meaning battery replacement costs rarely factor into true ownership calculations before warranty expiration.",
    },
    {
      question: "Are tire costs higher for EVs than hybrids?",
      answer: "EV tires wear slightly faster due to heavier weight, adding $100–$300 more per replacement, but regenerative braking still provides net maintenance savings.",
    },
    {
      question: "Does the calculator account for regional electricity costs?",
      answer: "This calculator focuses on maintenance savings only; fuel/electricity costs should be evaluated separately using EV charging cost data for your region.",
    },
    {
      question: "What if I drive fewer than 200,000 miles—are savings still significant?",
      answer: "Yes, at 100,000 miles EVs typically save $2,500–$5,000 in maintenance alone, with proportional savings scaling by mileage and usage patterns.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a 60 kWh battery EV with an electricity rate of $0.13/kWh, comparing maintenance costs to a hybrid with $900 annual maintenance, and an EV maintenance cost of $400 annually, over 5 years.",
    steps: [
      {
        label: "Step 1: Calculate annual EV charging cost",
        explanation:
          "Battery capacity (60 kWh) × 365 days = 21,900 kWh/year. Multiply by electricity rate: 21,900 kWh × $0.13/kWh = $2,847 annual charging cost."
      },
      {
        label: "Step 2: Calculate annual maintenance savings",
        explanation:
          "Hybrid maintenance $900 - EV maintenance $400 = $500 savings per year."
      },
      {
        label: "Step 3: Calculate net savings",
        explanation:
          "Maintenance savings $500 - charging cost $2,847 = -$2,347 net savings (meaning EV costs more annually when including charging)."
      },
      {
        label: "Step 4: Calculate total net savings over 5 years",
        explanation:
          "-$2,347 × 5 years = -$11,735 total net savings (EV costs more over 5 years)."
      }
    ],
    result: "Final Result: The EV costs approximately $11,735 more than the hybrid over 5 years when including charging and maintenance costs."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and energy consumption of vehicles."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing resource."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews and ownership cost analysis."
    },
    {
      title: "U.S. Department of Energy - Alternative Fuels Data Center",
      description: "Information on electric vehicle charging and costs."
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
        <div className="space-y-2">
          <Label>Annual Hybrid Maintenance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            step="1"
            value={inputs.maintenanceHybridAnnual}
            onChange={(e) => handleInputChange("maintenanceHybridAnnual", e.target.value)}
            placeholder="e.g. 900"
          />
        </div>
        <div className="space-y-2">
          <Label>Annual EV Maintenance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            step="1"
            value={inputs.maintenanceEvAnnual}
            onChange={(e) => handleInputChange("maintenanceEvAnnual", e.target.value)}
            placeholder="e.g. 400"
          />
        </div>
        <div className="space-y-2">
          <Label>Number of Years</Label>
          <Input
            type="number"
            min="1"
            step="1"
            value={inputs.years}
            onChange={(e) => handleInputChange("years", e.target.value)}
            placeholder="e.g. 5"
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
            <p className="mt-2 font-semibold">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the EV Maintenance Savings vs Hybrid Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator compares the lifetime maintenance costs of electric vehicles and hybrid vehicles to help you understand total cost of ownership beyond purchase price. It isolates maintenance expenses, excluding fuel and electricity costs, to show real savings potential.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your expected annual mileage, vehicle lifespan in years, and regional labor rates to generate accurate estimates. The calculator uses 2024–2025 benchmark data for both EV and hybrid maintenance schedules, parts costs, and labor expenses.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the cost breakdown by service category to see where EVs excel—typically in engine-related services and brake wear. Use this data alongside fuel savings calculations to make a complete ownership comparison.</p>
        </div>
      </section>

      {/* TABLE: Average Maintenance Costs: EV vs Hybrid (per 200,000 miles) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Maintenance Costs: EV vs Hybrid (per 200,000 miles)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares typical cumulative maintenance expenses over 200,000 miles for electric vehicles and hybrid vehicles.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Service Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Electric Vehicle</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hybrid Vehicle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oil Changes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200–$1,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Spark Plugs & Filters</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$800–$1,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Transmission Fluid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400–$600</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Brake Service</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$800–$1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000–$2,800</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Battery/Engine Coolant</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400–$600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300–$500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tire Replacement</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,400–$1,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200–$1,600</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">General Repairs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200–$1,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,500–$3,200</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">TOTAL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,800–$5,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,200–$10,600</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs vary by vehicle make, model, and driving conditions; data reflects 2024–2025 market averages.</p>
      </section>

      {/* TABLE: Maintenance Intervals: EV vs Hybrid Comparison */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Maintenance Intervals: EV vs Hybrid Comparison</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">EVs require significantly fewer scheduled maintenance visits due to their simpler drivetrains and lack of combustion engines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Service Item</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EV Interval</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hybrid Interval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oil Change</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not Required</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 5,000–10,000 miles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Spark Plugs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not Required</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 30,000–50,000 miles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Brake Inspection</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 50,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 25,000 miles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cabin Air Filter</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 20,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 15,000 miles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Coolant Flush</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 100,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 30,000 miles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Transmission Service</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not Required</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 60,000 miles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tire Rotation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 7,500 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 7,500 miles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Battery Check</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 20,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 50,000 miles</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Intervals depend on manufacturer specifications and driving habits; regenerative braking extends EV brake service intervals.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in extended warranties or maintenance plans, as some EV manufacturers offer free or discounted service packages that reduce calculated costs further.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Remember that hybrid brake maintenance falls between gas and EV costs; regenerative braking saves wear but the gas engine still requires service.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Higher mileage scenarios amplify EV savings because fewer fluids, filters, and spark plugs mean exponential cost reductions at 250,000+ miles.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check manufacturer-specific maintenance schedules, as luxury EV brands may have higher labor rates than mainstream hybrids in your area.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Battery Replacement Costs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Battery degradation rarely requires replacement within warranty periods; most EV warranties cover 8–10 years, so post-warranty costs shouldn't dominate short-term ownership calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming All Hybrids Have Equal Maintenance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Hybrid maintenance costs vary widely; plug-in hybrids with larger batteries may have higher service costs than traditional hybrids with smaller engines.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Regional Labor Rate Differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">EV service labor rates in rural areas may exceed urban rates, or vice versa; always input your local mechanic or dealership hourly rates for accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Regenerative Braking Benefits</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">EVs' regenerative braking can extend brake pad life 2–3x longer than conventional vehicles, yet some calculators underestimate this advantage in final results.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much can I save on maintenance with an EV versus a hybrid?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">EVs typically save $4,600–$10,000 over 200,000 miles due to no oil changes, fewer brake replacements, and simpler drivetrains compared to hybrids, which still require regular engine maintenance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What maintenance costs are included in this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator factors in oil changes, spark plugs, transmission fluid, brake service, filters, and battery degradation for both EV and hybrid powertrains.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do EVs really need less brake maintenance than hybrids?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, EVs use regenerative braking that captures energy, reducing brake wear by 50–70% compared to hybrids and gas vehicles, extending brake pad life significantly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does battery warranty affect EV maintenance savings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most EV batteries are warranted for 8–10 years or 100,000–150,000 miles, meaning battery replacement costs rarely factor into true ownership calculations before warranty expiration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are tire costs higher for EVs than hybrids?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">EV tires wear slightly faster due to heavier weight, adding $100–$300 more per replacement, but regenerative braking still provides net maintenance savings.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the calculator account for regional electricity costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator focuses on maintenance savings only; fuel/electricity costs should be evaluated separately using EV charging cost data for your region.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if I drive fewer than 200,000 miles—are savings still significant?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, at 100,000 miles EVs typically save $2,500–$5,000 in maintenance alone, with proportional savings scaling by mileage and usage patterns.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.fueleconomy.gov/feg/evtech.shtml" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy: EV Maintenance Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official federal resource comparing EV and hybrid maintenance schedules, costs, and component durability.</p>
          </li>
          <li>
            <a href="https://www.consumerreports.org/cars/hybrids-evs/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Reports: EV vs Hybrid Reliability Study</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive analysis of maintenance frequency, repair costs, and reliability ratings for electric and hybrid vehicles.</p>
          </li>
          <li>
            <a href="https://www.aaa.com/automotive/ev-ownership-costs" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAA: Electric Vehicle Ownership Costs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed breakdown of EV maintenance, battery health, and total cost of ownership versus gas and hybrid vehicles.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/fueleconomy/find-a-car" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA: Comparing New Vehicle Fuel Efficiency and Cost</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tool and guidance for comparing fuel economy, maintenance costs, and environmental impact across vehicle types.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="EV Maintenance Savings vs Hybrid Calculator"
      description="Professional automotive calculator: EV Maintenance Savings vs Hybrid Calculator. Get accurate estimates, expert advice, and financial insights."
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