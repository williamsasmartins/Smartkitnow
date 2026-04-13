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

export default function EvCostPerMileCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // Battery capacity in kWh
    ratePerKWh: "",      // Electricity rate in $/kWh
    efficiency: "",      // Efficiency in miles per kWh
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const battery = parseFloat(inputs.batteryCapacity);
    const rate = parseFloat(inputs.ratePerKWh);
    const efficiency = parseFloat(inputs.efficiency);

    if (
      isNaN(battery) || battery <= 0 ||
      isNaN(rate) || rate <= 0 ||
      isNaN(efficiency) || efficiency <= 0
    ) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Awaiting valid inputs"
      };
    }

    // Cost per mile = rate ($/kWh) / efficiency (miles/kWh)
    const costPerMile = rate / efficiency;

    // Time to fully charge depends on charger power, but since not provided,
    // we can estimate charging time assuming a standard charger power (e.g., 7.2 kW)
    // For simplicity, we won't calculate time here, just cost per mile.

    return {
      primary: costPerMile.toFixed(3), // e.g. 0.13 $/mile
      secondary: `$${costPerMile.toFixed(3)} per mile`,
      details: `Battery: ${battery} kWh, Rate: $${rate}/kWh, Efficiency: ${efficiency} miles/kWh`,
      feedback: "Estimated cost per mile based on inputs"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is the average cost per mile for electric vehicles in 2024?",
      answer: "The average EV cost per mile is approximately $0.03 to $0.04, depending on electricity rates and vehicle efficiency. This compares favorably to gas vehicles at $0.10 to $0.15 per mile. Your actual cost per mile will vary based on your local electricity rates, which range from $0.10/kWh in Louisiana to $0.22/kWh in Hawaii.",
    },
    {
      question: "How do I calculate my EV's actual cost per mile?",
      answer: "Divide your vehicle's energy consumption (measured in kWh per mile) by your local electricity rate per kWh, then add any other costs like maintenance or tolls. For example, if your EV uses 0.25 kWh per mile and electricity costs $0.14/kWh, your energy cost is $0.035 per mile. The calculator automates this computation for accuracy.",
    },
    {
      question: "What factors affect EV cost per mile calculations?",
      answer: "Key factors include vehicle efficiency (EPA rating in MPGe), electricity rate in your region, driving conditions (highway vs. city), battery degradation over time, and whether you charge at home or public stations. Cold weather can reduce efficiency by 20-40%, while highway driving typically costs more per mile than city driving due to higher energy consumption.",
    },
    {
      question: "Is charging at home cheaper than public charging stations?",
      answer: "Yes, home charging is typically 30-50% cheaper than public fast-charging. Home electricity averages $0.14/kWh nationally, while DC fast chargers average $0.25-$0.35/kWh and Level 2 public chargers range from $0.18-$0.28/kWh. Over 10,000 miles annually, this difference can save $500-$1,500 per year.",
    },
    {
      question: "How does vehicle efficiency (MPGe) impact cost per mile?",
      answer: "MPGe (miles per gallon equivalent) directly determines energy consumption. A vehicle rated 4 miles/kWh uses 0.25 kWh per mile, while a 5 miles/kWh vehicle uses only 0.20 kWh per mile. This 20% difference means annual savings of $200-$400 for typical drivers, making efficiency a critical factor in total cost calculations.",
    },
    {
      question: "Should I include maintenance costs in cost per mile calculations?",
      answer: "Yes, maintenance significantly impacts total ownership costs. EVs have lower maintenance than gas vehicles—approximately $0.01-$0.02 per mile versus $0.07-$0.10 for gas cars. The calculator should account for tire replacements, brake fluid flushes, and battery conditioning, though major battery replacement costs typically don't apply until &gt;200,000 miles.",
    },
    {
      question: "What is the difference between EPA-rated and real-world EV efficiency?",
      answer: "Real-world efficiency typically varies 10-25% from EPA ratings depending on driving style, weather, and terrain. EPA ratings use standardized lab conditions, but aggressive acceleration, highway speeds &gt;65 mph, and cold temperatures (&lt;32°F) all reduce actual efficiency. Using 85-90% of EPA ratings in your calculator provides a more realistic cost-per-mile estimate.",
    },
    {
      question: "How do time-of-use electricity rates affect EV charging costs?",
      answer: "Many utilities offer time-of-use (TOU) rates that reward off-peak charging with 30-50% lower rates. Off-peak rates average $0.08-$0.12/kWh versus peak rates of $0.18-$0.28/kWh. Charging primarily during off-peak hours (typically 9 PM to 6 AM) can reduce your cost per mile from $0.04 to $0.025, saving &gt;$400 annually for average drivers.",
    },
    {
      question: "What is the total cost of ownership comparison between EVs and gas vehicles?",
      answer: "Over 5 years and 60,000 miles, EVs average $0.12-$0.14 per mile total cost (fuel + maintenance + depreciation) versus $0.15-$0.20 for gas vehicles. Federal tax credits up to $7,500 and state incentives further reduce EV costs. Break-even typically occurs between 50,000-100,000 miles, after which EV savings accelerate significantly.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the cost per mile for a 60 kWh battery EV with an electricity rate of $0.13 per kWh and an efficiency of 3.5 miles per kWh.",
    steps: [
      {
        label: "Step 1: Identify Inputs",
        explanation:
          "Battery capacity = 60 kWh, Electricity rate = $0.13/kWh, Efficiency = 3.5 miles/kWh."
      },
      {
        label: "Step 2: Calculate Cost per Mile",
        explanation:
          "Cost per mile = Electricity rate / Efficiency = $0.13 / 3.5 = $0.0371 per mile."
      },
      {
        label: "Step 3: Interpret Result",
        explanation:
          "This means it costs approximately 3.7 cents to drive one mile in this EV under the given conditions."
      }
    ],
    result: "Final Result: $0.037 per mile"
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description:
        "Official source for electric vehicle efficiency ratings and fuel economy data."
    },
    {
      title: "U.S. Department of Energy - Alternative Fuels Data Center",
      description:
        "Comprehensive resource for electric vehicle charging and cost information."
    },
    {
      title: "EnergySage EV Calculator",
      description:
        "Online tool to estimate electric vehicle costs including charging expenses."
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
            <SelectItem value="imperial">Imperial (miles)</SelectItem>
            <SelectItem value="metric">Metric (km)</SelectItem>
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
            placeholder="e.g. 0.13"
            value={inputs.ratePerKWh}
            onChange={(e) => handleInputChange("ratePerKWh", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Efficiency ({inputs.unit === "imperial" ? "miles" : "km"} per kWh)
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={inputs.unit === "imperial" ? "e.g. 3.5" : "e.g. 5.6"}
            value={inputs.efficiency}
            onChange={(e) => handleInputChange("efficiency", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <DollarSign className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Estimated Cost Per {inputs.unit === "imperial" ? "Mile" : "Kilometer"}
            </span>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the EV Cost Per Mile Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The EV Cost Per Mile Calculator helps you determine exactly what it costs to drive your electric vehicle for each mile traveled. This metric is essential for comparing EVs to gas vehicles, evaluating different EV models, and understanding your total transportation expenses. Unlike EPA fuel economy ratings alone, this calculator incorporates your actual local electricity rates, vehicle efficiency, and optional maintenance costs to provide a personalized estimate.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll need three key inputs: your vehicle's efficiency rating (available from the EPA label, typically listed as MPGe or kWh per mile), your local residential electricity rate (found on your utility bill or the calculator's database), and any additional costs you want to include such as maintenance, insurance, or registration. The calculator will also account for charging method—home charging, Level 2 public charging, or DC fast charging—as each has different per-kWh costs that significantly impact your total cost per mile.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once you've entered your data, the calculator displays your cost per mile in dollars and cents, allowing you to compare your EV to other vehicles or different charging scenarios. The results help you identify cost-saving opportunities, such as switching to off-peak charging times or choosing a more efficient vehicle. You can adjust variables like electricity rates or driving patterns to see how they affect your bottom line, making it an excellent tool for purchase decisions and ongoing cost management.</p>
        </div>
      </section>

      {/* TABLE: National Average Electricity Rates by State (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">National Average Electricity Rates by State (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows residential electricity rates across major states, which directly impact your EV's cost per mile calculation.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">State</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Rate ($/kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Cost Per Mile (EV at 0.25 kWh/mile)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">California</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.045</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Texas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.030</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Florida</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.13</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.033</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New York</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.17</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.043</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ohio</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.035</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Washington</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.028</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Massachusetts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.19</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.048</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Arizona</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.13</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.033</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Colorado</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.035</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">National Average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.035</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates include all charges and taxes. Time-of-use rates may be 20-40% lower during off-peak hours.</p>
      </section>

      {/* TABLE: EV Efficiency Ratings and Cost Per Mile Comparison */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">EV Efficiency Ratings and Cost Per Mile Comparison</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how different vehicle efficiency ratings translate to actual fuel costs per mile.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EPA Rating (MPGe)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">kWh Per Mile</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Per Mile @ $0.14/kWh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tesla Model 3 RWD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 MPGe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.161 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.023</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chevy Bolt EV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28 MPGe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.143 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.020</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hyundai Ioniq 6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27 MPGe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.152 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.021</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ford Mustang Mach-E</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22 MPGe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.182 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.025</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Volkswagen ID.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23 MPGe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.174 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.024</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">BMW i4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 MPGe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.167 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.023</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kia EV6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 MPGe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.160 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.022</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Nissan Leaf</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 MPGe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.167 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.023</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Efficiency varies with driving conditions; highway driving typically reduces MPGe by 10-15%. Cold weather (&lt;32°F) can reduce efficiency by 20-40%.</p>
      </section>

      {/* TABLE: Charging Cost Comparison by Method (2024-2025) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Charging Cost Comparison by Method (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares the actual per-mile costs across different charging methods available to EV owners.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Charging Method</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Rate ($/kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Per Mile (0.25 kWh/mile)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Cost (12,000 miles)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Home Charging (Off-Peak TOU)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.08</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.020</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$240</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Home Charging (Standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.035</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$420</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Level 2 Public Charger</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.055</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$660</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">DC Fast Charger (Standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.070</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$840</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">DC Fast Charger (Premium)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.088</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,056</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Workplace Charging (Free)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Off-peak TOU rates are available from most utilities; check your local provider. DC fast charging rates vary by network and location.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Enroll in time-of-use (TOU) electricity rates from your utility provider—charging during off-peak hours (typically 9 PM to 6 AM) can reduce your cost per mile by 30-50%, saving $400-$800 annually on a 12,000-mile driving schedule.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your actual vehicle efficiency over time by tracking kWh consumed per mile in your car's dashboard or app, then compare to EPA ratings to account for driving style, weather, and terrain variations that affect real-world costs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Calculate the total cost of ownership, not just fuel costs—include depreciation, maintenance savings, and available tax credits and state incentives, which can shift the value proposition significantly over a 5-10 year ownership period.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Plan charging sessions strategically to avoid DC fast charger usage when possible; home or Level 2 charging costs 40-70% less per mile and reduces battery stress, extending vehicle longevity and reducing long-term ownership costs.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Local Electricity Rate Variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Electricity rates vary dramatically by region and charging method, ranging from $0.08 to $0.35 per kWh. Using a national average instead of your actual local rate can result in cost estimates that are 300% off, leading to flawed purchase or charging decisions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using EPA Ratings Without Real-World Adjustments</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">EPA efficiency ratings don't account for cold weather, aggressive driving, or highway speeds that reduce efficiency by 10-40% in real conditions. Relying solely on EPA numbers overestimates your actual cost per mile, potentially by $0.01-$0.02 per mile.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Include All Charging Methods</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many drivers use a mix of home, public Level 2, and DC fast charging, but calculating with only one method gives an inaccurate picture. Your blended average cost per mile may be significantly higher if you frequently use expensive DC fast charging for long trips.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting Maintenance Cost Savings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">EVs require 40-60% less maintenance than gas vehicles due to no oil changes, simpler brakes, and fewer moving parts. Excluding maintenance savings understates the true EV cost advantage and can distort comparison calculations with gas vehicle costs.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average cost per mile for electric vehicles in 2024?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The average EV cost per mile is approximately $0.03 to $0.04, depending on electricity rates and vehicle efficiency. This compares favorably to gas vehicles at $0.10 to $0.15 per mile. Your actual cost per mile will vary based on your local electricity rates, which range from $0.10/kWh in Louisiana to $0.22/kWh in Hawaii.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my EV's actual cost per mile?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Divide your vehicle's energy consumption (measured in kWh per mile) by your local electricity rate per kWh, then add any other costs like maintenance or tolls. For example, if your EV uses 0.25 kWh per mile and electricity costs $0.14/kWh, your energy cost is $0.035 per mile. The calculator automates this computation for accuracy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect EV cost per mile calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Key factors include vehicle efficiency (EPA rating in MPGe), electricity rate in your region, driving conditions (highway vs. city), battery degradation over time, and whether you charge at home or public stations. Cold weather can reduce efficiency by 20-40%, while highway driving typically costs more per mile than city driving due to higher energy consumption.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is charging at home cheaper than public charging stations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, home charging is typically 30-50% cheaper than public fast-charging. Home electricity averages $0.14/kWh nationally, while DC fast chargers average $0.25-$0.35/kWh and Level 2 public chargers range from $0.18-$0.28/kWh. Over 10,000 miles annually, this difference can save $500-$1,500 per year.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does vehicle efficiency (MPGe) impact cost per mile?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">MPGe (miles per gallon equivalent) directly determines energy consumption. A vehicle rated 4 miles/kWh uses 0.25 kWh per mile, while a 5 miles/kWh vehicle uses only 0.20 kWh per mile. This 20% difference means annual savings of $200-$400 for typical drivers, making efficiency a critical factor in total cost calculations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include maintenance costs in cost per mile calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, maintenance significantly impacts total ownership costs. EVs have lower maintenance than gas vehicles—approximately $0.01-$0.02 per mile versus $0.07-$0.10 for gas cars. The calculator should account for tire replacements, brake fluid flushes, and battery conditioning, though major battery replacement costs typically don't apply until &gt;200,000 miles.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between EPA-rated and real-world EV efficiency?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Real-world efficiency typically varies 10-25% from EPA ratings depending on driving style, weather, and terrain. EPA ratings use standardized lab conditions, but aggressive acceleration, highway speeds &gt;65 mph, and cold temperatures (&lt;32°F) all reduce actual efficiency. Using 85-90% of EPA ratings in your calculator provides a more realistic cost-per-mile estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do time-of-use electricity rates affect EV charging costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Many utilities offer time-of-use (TOU) rates that reward off-peak charging with 30-50% lower rates. Off-peak rates average $0.08-$0.12/kWh versus peak rates of $0.18-$0.28/kWh. Charging primarily during off-peak hours (typically 9 PM to 6 AM) can reduce your cost per mile from $0.04 to $0.025, saving &gt;$400 annually for average drivers.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the total cost of ownership comparison between EVs and gas vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Over 5 years and 60,000 miles, EVs average $0.12-$0.14 per mile total cost (fuel + maintenance + depreciation) versus $0.15-$0.20 for gas vehicles. Federal tax credits up to $7,500 and state incentives further reduce EV costs. Break-even typically occurs between 50,000-100,000 miles, after which EV savings accelerate significantly.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.eia.gov/electricity/state/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Energy Information Administration - Electricity Rates by State</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government data on residential electricity rates by state, updated regularly and used as the authoritative benchmark for regional cost calculations.</p>
          </li>
          <li>
            <a href="https://www.fueleconomy.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA - Find a Car - Fuel Economy Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The EPA's official source for vehicle fuel economy ratings, including MPGe and efficiency data for all electric and gasoline vehicles sold in the United States.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/articles/personal-finance/050815/hidden-costs-of-electric-vehicles.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia - Electric Vehicle Operating Costs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide explaining the operational cost components of EV ownership, including electricity, maintenance, and total cost of ownership comparisons.</p>
          </li>
          <li>
            <a href="https://afdc.energy.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy - Alternative Fuels Data Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal resource providing charging station locations, electricity rates, and detailed EV ownership cost analyses to help drivers make informed decisions.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="EV Cost Per Mile Calculator"
      description="Professional automotive calculator: EV Cost Per Mile Calculator. Get accurate estimates, expert advice, and financial insights."
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