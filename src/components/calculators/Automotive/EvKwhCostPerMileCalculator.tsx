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

export default function EvKwhCostPerMileCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    kwhPer100mi: "", // EV consumption in kWh per 100 miles
    ratePerKwh: "",  // Electricity cost in $ per kWh
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const kwh = parseFloat(inputs.kwhPer100mi);
    const rate = parseFloat(inputs.ratePerKwh);

    if (isNaN(kwh) || kwh <= 0 || isNaN(rate) || rate <= 0) {
      return {
        primary: "0.00",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for both inputs.",
        feedback: "Awaiting valid inputs"
      };
    }

    // Cost per mile = (kWh per 100 miles * $ per kWh) / 100
    const costPerMile = (kwh * rate) / 100;

    // Time to drive 100 miles at average speed (optional, not requested but can be added)
    // For now, just cost per mile and cost per 100 miles

    return {
      primary: costPerMile.toFixed(3), // cost per mile in dollars
      secondary: `$${(costPerMile * 100).toFixed(2)} per 100 miles`,
      details: `Based on ${kwh.toFixed(1)} kWh/100mi and $${rate.toFixed(3)}/kWh`,
      feedback: costPerMile < 0.05 ? "Excellent efficiency" : costPerMile < 0.10 ? "Good efficiency" : "Standard range"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What does kWh per 100 miles mean for electric vehicles?",
      answer: "kWh per 100 miles measures how much electrical energy an EV consumes to travel 100 miles, similar to MPG for gas cars. A lower number indicates better efficiency—for example, a Tesla Model 3 uses approximately 25 kWh per 100 miles, while larger vehicles like the Hummer EV use around 40 kWh per 100 miles. This metric is crucial for calculating your actual fuel costs and understanding real-world EV operating expenses.",
    },
    {
      question: "How do I convert kWh per 100 miles to cost per mile?",
      answer: "To convert, multiply your vehicle's kWh per 100 miles by your local electricity rate (in dollars per kWh) and divide by 100. For example, if your EV uses 28 kWh per 100 miles and electricity costs $0.15 per kWh, your cost per mile is (28 × $0.15) ÷ 100 = $0.042 per mile. This calculator automates this conversion to help you quickly compare EV operating costs.",
    },
    {
      question: "What is the average electricity cost per kWh in the US?",
      answer: "As of 2024-2025, the average U.S. residential electricity rate is approximately $0.16 per kWh, though rates vary significantly by region—from around $0.11 per kWh in Louisiana to over $0.24 per kWh in Hawaii. Time-of-use (TOU) rates and off-peak charging can reduce your effective cost by 30-50%, making the actual cost per mile substantially lower than calculations using average rates.",
    },
    {
      question: "How does my EV's efficiency compare to gasoline vehicles?",
      answer: "A typical EV with 26 kWh per 100 miles costs approximately $0.039 per mile at $0.15/kWh, while a 25 MPG gas car costs about $0.16 per mile at $3.50/gallon. This means EVs are roughly 4 times more efficient on a per-mile cost basis, even before accounting for maintenance savings and government incentives that can further improve EV economics.",
    },
    {
      question: "Why do some EVs use more kWh per 100 miles than others?",
      answer: "EV efficiency depends on vehicle weight, aerodynamics, tire rolling resistance, battery capacity, and driving conditions. Larger SUVs and trucks naturally consume more energy—a Rivian R1T uses about 35-38 kWh per 100 miles, while compact EVs like the Hyundai Ioniq 6 achieve 22-24 kWh per 100 miles. Cold weather, highway driving, and aggressive acceleration can increase consumption by 20-40% compared to optimal conditions.",
    },
    {
      question: "How should I factor in home charging versus public charging costs?",
      answer: "Home charging typically costs $0.13-$0.18 per kWh using residential rates, while DC fast charging at public stations averages $0.25-$0.35 per kWh. If you charge at home 90% of the time and use public chargers occasionally, calculate a blended rate (e.g., 0.90 × $0.15 + 0.10 × $0.30 = $0.165/kWh) to accurately reflect your total charging costs in your cost-per-mile analysis.",
    },
    {
      question: "What electricity rates should I use for this calculator?",
      answer: "Check your utility bill for your current residential rate, which typically appears as cents per kWh or as a total charge divided by kilowatt-hours used. If you use time-of-use rates, use your off-peak rate since most EV owners charge overnight when rates are 20-40% lower than peak hours. For road trips with public charging, use a higher rate ($0.25-$0.35/kWh) for those segments only.",
    },
    {
      question: "How does battery size affect my cost per mile calculation?",
      answer: "Battery size doesn't directly change the cost per mile metric—a 50 kWh battery and 100 kWh battery in the same vehicle model have identical efficiency ratings (kWh per 100 miles). However, larger batteries increase purchase price, affecting total cost of ownership, and may have slightly better efficiency at highway speeds due to lower percentage of parasitic loads relative to total capacity.",
    },
    {
      question: "Can I use this calculator to compare EVs when shopping?",
      answer: "Yes, this calculator is ideal for comparing operating costs across different EV models. Simply input each vehicle's EPA-rated kWh per 100 miles and your local electricity rate to calculate cost per mile—for example, comparing a Chevy Bolt EV (26 kWh/100 mi) at $0.039/mile versus a Tesla Model Y (24 kWh/100 mi) at $0.036/mile reveals a meaningful difference over 100,000 miles of ownership.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the cost per mile for a 2023 Tesla Model 3 Standard Range Plus with an average consumption of 24 kWh per 100 miles and an electricity rate of $0.13 per kWh.",
    steps: [
      {
        label: "Step 1: Identify EV consumption",
        explanation: "The Tesla Model 3 consumes approximately 24 kWh to travel 100 miles."
      },
      {
        label: "Step 2: Identify electricity rate",
        explanation: "The local electricity rate is $0.13 per kWh."
      },
      {
        label: "Step 3: Calculate cost per mile",
        explanation:
          "Cost per mile = (24 kWh/100 miles * $0.13/kWh) / 100 = $0.0312 per mile."
      },
      {
        label: "Step 4: Calculate cost per 100 miles",
        explanation:
          "Cost per 100 miles = 24 kWh * $0.13 = $3.12."
      }
    ],
    result: "Final Result: The Tesla Model 3 costs approximately $0.031 per mile or $3.12 per 100 miles to operate based on the given inputs."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for electric vehicle energy consumption and efficiency ratings."
    },
    {
      title: "U.S. Energy Information Administration (EIA)",
      description: "Provides average residential electricity rates by state."
    },
    {
      title: "InsideEVs",
      description: "Comprehensive EV reviews and real-world consumption data."
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
            <SelectItem value="metric">Metric (Coming Soon)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>EV Consumption (kWh per 100 miles)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 24"
            value={inputs.kwhPer100mi}
            onChange={(e) => handleInputChange("kwhPer100mi", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($ per kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.001"
            placeholder="e.g. 0.13"
            value={inputs.ratePerKwh}
            onChange={(e) => handleInputChange("ratePerKwh", e.target.value)}
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
            <p className="mt-1 text-sm font-medium text-blue-700">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the EV kWh per 100 mi ↔ Cost per Mile Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator converts between two critical EV efficiency metrics: kilowatt-hours per 100 miles (kWh/100 mi) and cost per mile. Understanding this relationship is essential for evaluating true operating costs, comparing different EV models, and budgeting your transportation expenses. Whether you're shopping for an electric vehicle or tracking the efficiency of your current EV, this tool helps you make data-driven decisions.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The primary inputs are your vehicle's EPA-rated efficiency (in kWh per 100 miles—find this on the vehicle's label or EPA website) and your local electricity rate (in dollars per kWh—check your utility bill or use regional averages). The calculator instantly converts these inputs to show your cost per mile, allowing you to compare operating expenses across different vehicle models and charging locations. You can also work backward: enter a cost-per-mile target and your electricity rate to determine what efficiency rating you need.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret your results by comparing your EV's cost per mile against gasoline vehicles (which typically range $0.09–$0.20+ per mile) and other EVs in the same class. Use your calculated cost per mile multiplied by your annual mileage to project yearly fuel costs, or extend it to 100,000-200,000 miles to understand total ownership expenses. Remember that these calculations reflect average conditions; cold weather, highway driving, and aggressive acceleration can increase consumption by 20-40%, while ideal conditions may reduce costs.</p>
        </div>
      </section>

      {/* TABLE: EPA-Rated Efficiency for Popular EV Models (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">EPA-Rated Efficiency for Popular EV Models (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows real-world EPA efficiency ratings for leading electric vehicles, allowing you to use accurate data in your cost-per-mile calculations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EV Model</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">kWh per 100 Miles</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Battery Size (kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EPA Range (miles)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tesla Model 3 Standard Range</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">272</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chevy Bolt EV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">66</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">259</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hyundai Ioniq 6 SE RWD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">53</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">361</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tesla Model Y Long Range</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">330</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ford Mustang Mach-E Premium RWD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">76</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">312</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">BMW i4 eDrive40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">81</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">301</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kia EV9 Long Range RWD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">99</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">304</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rivian R1T Long Range</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">135</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hummer EV 3X (Supertruck)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">348</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data based on EPA certification ratings. Actual efficiency varies with driving conditions, weather, and driving habits. Highway driving typically increases consumption by 15-25%.</p>
      </section>

      {/* TABLE: Cost Per Mile Comparison by Region (25 kWh per 100 mi baseline) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Cost Per Mile Comparison by Region (25 kWh per 100 mi baseline)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how regional electricity rates significantly impact EV operating costs using a standard 25 kWh/100 mi efficiency baseline.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Region</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Electricity Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Per Mile</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Cost (10,000 mi)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hawaii</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.24/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.060</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">California</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.18/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.045</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$450</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Northeast (avg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.17/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.043</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$425</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">National Average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.16/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.040</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Texas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.14/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.035</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$350</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Louisiana</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.11/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.028</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$275</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Off-Peak Rate (avg home)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.12/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.030</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates as of Q1 2025. Off-peak rates typically apply to 11 PM–6 AM charging. Regional rates vary by utility; check your specific bill for accurate calculations.</p>
      </section>

      {/* TABLE: Gas vs. EV Operating Cost Comparison */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Gas vs. EV Operating Cost Comparison</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This comparison shows real operating costs between EVs and gas vehicles across different efficiency levels and fuel prices.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Energy Consumption</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Per Unit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Per Mile</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Cost (15,000 mi)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">EV (efficient)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 kWh/100 mi</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.15/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.036</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$540</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">EV (average)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28 kWh/100 mi</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.15/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.042</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$630</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">EV (large SUV)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35 kWh/100 mi</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.15/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.053</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$795</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gas Car (efficient)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.50/gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.109</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,638</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gas Car (average)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.50/gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.146</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,188</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gas Car (poor efficiency)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.50/gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.194</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,917</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">EV costs use national average electricity rate of $0.15/kWh. Gas prices assumed at $3.50/gallon. EVs offer 60-85% lower per-mile operating costs before maintenance savings.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use your vehicle's EPA efficiency rating from the window sticker or fueleconomy.gov rather than estimated figures, as EPA ratings account for standardized testing procedures that reflect real-world driving patterns.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If your utility offers time-of-use (TOU) rates, calculate your blended electricity cost by weighting off-peak and peak rates according to your actual charging schedule—most EV owners who charge overnight save 20-40% compared to peak-hour rates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Include charging losses (typically 10-15% when accounting for charger efficiency) in your calculations for public DC fast charging, as network averages often quote per-kWh rates that don't reflect the extra energy drawn from the grid.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your actual energy consumption using your vehicle's trip computer or mobile app, then recalculate quarterly to verify that your real-world efficiency matches EPA estimates—significant deviations may indicate battery degradation, tire pressure issues, or seasonal weather impacts.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Peak Electricity Rates Instead of Off-Peak Rates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many EV owners mistakenly use their daytime peak rate ($0.20+/kWh) to calculate costs when they actually charge mostly overnight at off-peak rates ($0.10-$0.14/kWh). This overstates true operating costs by 50% or more, leading to inaccurate vehicle comparison and budgeting.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Charger Efficiency Losses</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">DC fast chargers and Level 2 chargers lose 10-15% of energy as heat during conversion. Using only the vehicle's onboard consumption underestimates true grid-to-wheel costs by roughly this percentage, particularly for frequent road-trip users relying on public infrastructure.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Comparing EPA Efficiency Ratings Across Different Test Cycles</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Older EVs tested under different EPA protocols may not be directly comparable to newer models' ratings. Always verify the test year and consider that highway efficiency typically runs 15-25% worse than EPA combined ratings, affecting real-world cost-per-mile accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Seasonal and Temperature Variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cold weather reduces EV efficiency by 20-40% due to battery conditioning and heater load, while highway speeds significantly increase consumption compared to city driving. Using annual average efficiency masks these variations, leading to underfunded winter budgets.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does kWh per 100 miles mean for electric vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">kWh per 100 miles measures how much electrical energy an EV consumes to travel 100 miles, similar to MPG for gas cars. A lower number indicates better efficiency—for example, a Tesla Model 3 uses approximately 25 kWh per 100 miles, while larger vehicles like the Hummer EV use around 40 kWh per 100 miles. This metric is crucial for calculating your actual fuel costs and understanding real-world EV operating expenses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I convert kWh per 100 miles to cost per mile?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To convert, multiply your vehicle's kWh per 100 miles by your local electricity rate (in dollars per kWh) and divide by 100. For example, if your EV uses 28 kWh per 100 miles and electricity costs $0.15 per kWh, your cost per mile is (28 × $0.15) ÷ 100 = $0.042 per mile. This calculator automates this conversion to help you quickly compare EV operating costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average electricity cost per kWh in the US?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">As of 2024-2025, the average U.S. residential electricity rate is approximately $0.16 per kWh, though rates vary significantly by region—from around $0.11 per kWh in Louisiana to over $0.24 per kWh in Hawaii. Time-of-use (TOU) rates and off-peak charging can reduce your effective cost by 30-50%, making the actual cost per mile substantially lower than calculations using average rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does my EV's efficiency compare to gasoline vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A typical EV with 26 kWh per 100 miles costs approximately $0.039 per mile at $0.15/kWh, while a 25 MPG gas car costs about $0.16 per mile at $3.50/gallon. This means EVs are roughly 4 times more efficient on a per-mile cost basis, even before accounting for maintenance savings and government incentives that can further improve EV economics.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do some EVs use more kWh per 100 miles than others?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">EV efficiency depends on vehicle weight, aerodynamics, tire rolling resistance, battery capacity, and driving conditions. Larger SUVs and trucks naturally consume more energy—a Rivian R1T uses about 35-38 kWh per 100 miles, while compact EVs like the Hyundai Ioniq 6 achieve 22-24 kWh per 100 miles. Cold weather, highway driving, and aggressive acceleration can increase consumption by 20-40% compared to optimal conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I factor in home charging versus public charging costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Home charging typically costs $0.13-$0.18 per kWh using residential rates, while DC fast charging at public stations averages $0.25-$0.35 per kWh. If you charge at home 90% of the time and use public chargers occasionally, calculate a blended rate (e.g., 0.90 × $0.15 + 0.10 × $0.30 = $0.165/kWh) to accurately reflect your total charging costs in your cost-per-mile analysis.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What electricity rates should I use for this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Check your utility bill for your current residential rate, which typically appears as cents per kWh or as a total charge divided by kilowatt-hours used. If you use time-of-use rates, use your off-peak rate since most EV owners charge overnight when rates are 20-40% lower than peak hours. For road trips with public charging, use a higher rate ($0.25-$0.35/kWh) for those segments only.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does battery size affect my cost per mile calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Battery size doesn't directly change the cost per mile metric—a 50 kWh battery and 100 kWh battery in the same vehicle model have identical efficiency ratings (kWh per 100 miles). However, larger batteries increase purchase price, affecting total cost of ownership, and may have slightly better efficiency at highway speeds due to lower percentage of parasitic loads relative to total capacity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator to compare EVs when shopping?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator is ideal for comparing operating costs across different EV models. Simply input each vehicle's EPA-rated kWh per 100 miles and your local electricity rate to calculate cost per mile—for example, comparing a Chevy Bolt EV (26 kWh/100 mi) at $0.039/mile versus a Tesla Model Y (24 kWh/100 mi) at $0.036/mile reveals a meaningful difference over 100,000 miles of ownership.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.eia.gov/electricity/monthly/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Energy Information Administration – Electric Power Monthly</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official source for U.S. average electricity rates by state and region updated monthly.</p>
          </li>
          <li>
            <a href="https://www.fueleconomy.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA FuelEconomy.gov – Find a Car</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official EPA database of all vehicle efficiency ratings, including EPA kWh per 100 miles for electric vehicles.</p>
          </li>
          <li>
            <a href="https://afdc.energy.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy – Alternative Fuels Data Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource for EV charging infrastructure, electricity rates, and vehicle efficiency comparisons.</p>
          </li>
          <li>
            <a href="https://www.consumerreports.org/cars/electric-vehicles/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Reports – EV Ratings and Reliability</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Independent testing and real-world efficiency data for electric vehicles, including long-term cost-of-ownership analysis.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="EV kWh per 100 mi ↔ Cost per Mile"
      description="Professional automotive calculator: EV kWh per 100 mi ↔ Cost per Mile. Get accurate estimates, expert advice, and financial insights."
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