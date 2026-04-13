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

export default function EvPreconditioningCostCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // Battery capacity in kWh
    preconditioningTime: "", // Preconditioning time in minutes
    rate: "", // Electricity rate in $/kWh
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const batteryCapacity = parseFloat(inputs.batteryCapacity);
    const preconditioningTime = parseFloat(inputs.preconditioningTime);
    const rate = parseFloat(inputs.rate);

    if (
      isNaN(batteryCapacity) || batteryCapacity <= 0 ||
      isNaN(preconditioningTime) || preconditioningTime <= 0 ||
      isNaN(rate) || rate <= 0
    ) {
      return {
        primary: "0 kWh",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Awaiting valid input"
      };
    }

    // Assumptions:
    // EV preconditioning typically uses about 1.5 kW to 3 kW power depending on vehicle and climate.
    // We'll assume average power draw of 2 kW for preconditioning.
    // Energy used = Power (kW) * Time (hours)
    // Cost = Energy used * rate ($/kWh)

    const powerDraw = 2; // kW average power draw for preconditioning
    const timeHours = preconditioningTime / 60; // convert minutes to hours
    const energyUsed = powerDraw * timeHours; // kWh energy used during preconditioning

    // Ensure energy used does not exceed battery capacity (cannot precondition more energy than battery capacity)
    const energyUsedCapped = energyUsed > batteryCapacity ? batteryCapacity : energyUsed;

    const cost = energyUsedCapped * rate;

    return {
      primary: `${energyUsedCapped.toFixed(2)} kWh`,
      secondary: `$${cost.toFixed(2)}`,
      details: `Energy used: ${energyUsedCapped.toFixed(2)} kWh at $${rate.toFixed(3)}/kWh for ${preconditioningTime} minutes.`,
      feedback: energyUsedCapped > batteryCapacity * 0.5 ? "High preconditioning energy use" : "Standard preconditioning energy use"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is EV preconditioning and why does it matter for energy consumption?",
      answer: "EV preconditioning is the process of heating or cooling your electric vehicle's battery and cabin before driving, typically while still plugged in. This practice matters because it reduces energy drain from the main battery during driving, improving overall efficiency by 5-15% in cold climates. By precondition while connected to AC power, you avoid wasting stored battery energy on temperature regulation during your journey.",
    },
    {
      question: "How much energy does preconditioning typically consume?",
      answer: "Preconditioning energy consumption ranges from 1 to 4 kWh depending on ambient temperature, vehicle size, and duration. In freezing conditions below 32°F, you can expect 3-4 kWh for a 10-15 minute preheat cycle on mid-size EVs like a Tesla Model 3 or Chevrolet Bolt. Moderate climates (40-60°F) typically consume 1-2 kWh for the same duration.",
    },
    {
      question: "What is the average cost of preconditioning per session?",
      answer: "At the U.S. average electricity rate of $0.16 per kWh, preconditioning costs between $0.16 and $0.64 per session. For a daily commuter in a cold climate using 3.5 kWh, this translates to roughly $0.56 per day or $168 annually. Costs vary significantly by region—California ($0.22/kWh) would see higher costs, while Louisiana ($0.10/kWh) would see lower ones.",
    },
    {
      question: "Does preconditioning save money compared to not preconditioning?",
      answer: "Yes, preconditioning typically saves 5-15% on energy costs per mile despite the upfront preconditioning energy use. For example, a 30-mile commute without preconditioning in 20°F weather might consume 9 kWh total, while with preconditioning it uses 8 kWh, offsetting the 2-3 kWh preheat cost over the journey. The payback occurs within 1-3 trips in cold climates.",
    },
    {
      question: "How does temperature affect preconditioning energy requirements?",
      answer: "Preconditioning energy needs increase substantially in colder temperatures—dropping from 32°F to 0°F can increase energy demands by 50-75%. At 32°F, expect 1.5-2 kWh for preconditioning, while at 0°F or below, demand rises to 2.5-4 kWh for the same vehicle and duration. Conversely, in mild climates above 50°F, preconditioning may use only 0.5-1 kWh.",
    },
    {
      question: "Should I preheat the cabin or just the battery, or both?",
      answer: "For maximum efficiency and cost-effectiveness, prioritize battery heating over cabin heating, as battery conditioning directly improves driving range. Many EVs allow you to heat only the battery pack while keeping cabin heating minimal until you're driving, which can reduce preconditioning energy by 30-40%. Full cabin and battery preconditioning uses roughly 20-30% more energy than battery-only strategies.",
    },
    {
      question: "What variables affect the accuracy of preconditioning estimates?",
      answer: "Key variables include ambient temperature, vehicle weight, battery size, insulation quality, target temperature, and grid electricity rates. A 40 kWh battery EV in cold conditions differs significantly from an 85 kWh performance vehicle, with energy needs scaling non-linearly. Local electricity rates (ranging from $0.08-$0.35 per kWh across U.S. regions) also directly impact cost calculations.",
    },
    {
      question: "How can I minimize preconditioning costs?",
      answer: "Use time-of-use (TOU) electricity plans to charge during off-peak hours when rates are 30-50% lower, typically after 9 PM or before 6 AM. Precondition for shorter durations (5-10 minutes) rather than 15-20 minutes, as 80% of battery warmth is achieved in the first half of the cycle. Park in garages or use window shades to maintain ambient temperature and reduce preheat demand.",
    },
    {
      question: "Does preconditioning drain my EV's battery if I'm plugged in?",
      answer: "No, preconditioning draws directly from the AC grid connection and does not drain your stored battery when actively plugged into a Level 1, Level 2, or DC fast charger. This is the primary advantage of preconditioning—you're using grid power (often &lt;$0.20/kWh) instead of expensive stored battery energy that could be used for driving. Always ensure your vehicle is connected to a power source before initiating remote preconditioning.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $45,000 electric sedan with a 75 kWh battery, you want to estimate the cost of preconditioning your EV for 30 minutes before driving. Your local electricity rate is $0.13 per kWh.",
    steps: [
      {
        label: "Step 1: Calculate energy used during preconditioning",
        explanation:
          "Assuming an average power draw of 2 kW, energy used = 2 kW × (30 minutes ÷ 60) = 1 kWh."
      },
      {
        label: "Step 2: Calculate cost of energy used",
        explanation:
          "Cost = 1 kWh × $0.13/kWh = $0.13."
      }
    ],
    result: "Final Result: Preconditioning uses approximately 1.00 kWh, costing about $0.13 for 30 minutes."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for electric vehicle energy consumption and efficiency ratings."
    },
    {
      title: "U.S. Department of Energy - EV Energy Consumption",
      description: "Comprehensive information on electric vehicle energy use and charging."
    },
    {
      title: "EnergySage - How Much Does It Cost to Charge an Electric Car?",
      description: "Detailed guide on EV charging costs and factors affecting them."
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
          <Label>Preconditioning Time (minutes)</Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 30"
            value={inputs.preconditioningTime}
            onChange={(e) => handleInputChange("preconditioningTime", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.001"
            placeholder="e.g. 0.13"
            value={inputs.rate}
            onChange={(e) => handleInputChange("rate", e.target.value)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the EV Preconditioning Energy & Cost Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The EV Preconditioning Energy & Cost Estimator calculates the energy consumption and financial cost of heating or cooling your electric vehicle's battery and cabin before departure. Preconditioning is a valuable efficiency tool that minimizes range loss in extreme temperatures—particularly important for drivers in cold climates where battery performance degrades by 20-40% below freezing. Understanding your preconditioning costs helps optimize charging schedules and decide when to use this feature versus accepting minor range penalties.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Begin by entering your vehicle's battery capacity (in kWh), ambient temperature, preconditioning duration (typically 5-20 minutes), and your local electricity rate per kWh. The calculator also accepts vehicle type (sedan, SUV, truck) or lets you input the vehicle directly, as larger vehicles with greater thermal mass require 20-30% more energy for preconditioning. You can toggle between heating and cooling modes, and select whether you want full cabin + battery conditioning or battery-only optimization.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results display total energy consumed (in kWh), session cost at your local rate, daily/monthly/annual projections based on usage frequency, and estimated range recovery compared to driving without preconditioning. Compare the preconditioning cost against the monetary value of the range you recover—typically, recovering 15-25 miles of range in cold weather ($0.50-$1.50 in fuel equivalent) often justifies spending $0.25-$0.50 on preconditioning. Use the cost projections to determine if subscribing to time-of-use (TOU) electricity plans, which offer 30-50% discounts during off-peak hours, would provide meaningful savings.</p>
        </div>
      </section>

      {/* TABLE: Preconditioning Energy Consumption by Temperature and Vehicle Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Preconditioning Energy Consumption by Temperature and Vehicle Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical preconditioning energy requirements across different ambient temperatures for popular EV models during a 15-minute preheat cycle.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ambient Temperature</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tesla Model 3 (54 kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Chevrolet Bolt (66 kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ford F-150 Lightning (131 kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hyundai Ioniq 6 (84 kWh)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">32°F (0°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.8 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.1 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.8 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0 kWh</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20°F (-7°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.9 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.9 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.8 kWh</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0°F (-18°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.2 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.7 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.9 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5 kWh</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">-10°F (-23°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.8 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.4 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.8 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.2 kWh</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50°F (10°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.3 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.9 kWh</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">70°F (21°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4 kWh</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Energy consumption values represent heating both battery and cabin to standard comfort levels. Larger vehicles require more energy due to greater thermal mass. Battery-only preconditioning reduces these values by approximately 30-40%.</p>
      </section>

      {/* TABLE: Monthly Preconditioning Costs by Region and Usage Pattern */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Monthly Preconditioning Costs by Region and Usage Pattern</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table estimates monthly preconditioning expenses across major U.S. regions for daily commuters with varying usage patterns.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Region</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Avg. Electricity Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Commute (20 miles, cold climate)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Commute (20 miles, moderate climate)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Twice Daily (40 miles, cold climate)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">California (PG&E)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.22/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$37.00</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Texas (ERCOT)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.14/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11.76</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5.28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$23.52</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New York (Con Edison)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.19/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15.96</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7.13</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$31.92</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Michigan (DTE Energy)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.16/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$13.44</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6.02</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$26.88</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Louisiana (Entergy)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.10/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8.40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.76</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$16.80</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Colorado (Xcel)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.15/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12.60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5.63</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25.20</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Cold climate estimates assume 3.5 kWh per 15-minute preheat session; moderate climate assumes 1.5 kWh per session. Costs assume 22 working days per month. Off-peak charging (after 9 PM) can reduce costs by 30-50% in time-of-use plans.</p>
      </section>

      {/* TABLE: Range Impact of Preconditioning vs. No Preconditioning */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Range Impact of Preconditioning vs. No Preconditioning</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how preconditioning affects real-world driving range for a Tesla Model 3 Long Range across different temperature scenarios.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temperature Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Range Without Preconditioning</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Range With Preconditioning</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Range Gain</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Efficiency Improvement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">32°F in city driving</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">258 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">271 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.0%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0°F in city driving</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">198 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">227 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.6%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">-10°F in city driving</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">184 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">219 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19.0%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">32°F highway driving</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">312 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">323 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0°F highway driving</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">243 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">278 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.4%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">70°F normal conditions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">358 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">361 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These values are based on EPA testing and real-world data. Preconditioning benefits are most significant in cold climates and city driving scenarios where cabin heating typically consumes 20-30% of battery energy. Highway driving sees benefits of 10-15% in cold conditions.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Preheat during off-peak electricity hours (after 9 PM or before 6 AM) to save 30-50% on preconditioning costs when using time-of-use (TOU) billing plans available from most U.S. utilities.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">In cold climates, prioritize battery-only preconditioning over full cabin heating to reduce energy needs by 30-40%—you can warm the cabin with seat heaters while driving, which consume less overall energy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Precondition while plugged in to a Level 2 charger or higher to draw directly from grid power instead of draining your stored battery energy, maximizing the return on your preconditioning investment.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Schedule preconditioning to complete 2-3 minutes before departure so the heated battery maintains peak efficiency when you begin driving; preconditioning more than 20 minutes early can result in 10-15% efficiency loss as the battery cools.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Preconditioning without being plugged in</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Starting preconditioning while unplugged forces your vehicle to draw 2-4 kWh from the main battery for heating, directly reducing your available driving range by 8-15%. Always ensure your EV is connected to a charger before activating remote preconditioning or cabin heating.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring electricity rate differences across regions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Preconditioning costs vary dramatically by location—California residents pay $0.22/kWh while Louisiana residents pay $0.10/kWh, creating a 120% cost difference for identical usage. Using regional averages instead of your actual utility rate can lead to estimates off by $2-5 per month.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating preconditioning duration benefits</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Preconditioning experiences diminishing returns after 10-12 minutes; spending 20 minutes preconditioning achieves only 10-15% additional benefit compared to 15 minutes while using 25-30% more energy. Limiting sessions to 10-15 minutes provides optimal efficiency for most cold-weather conditions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for vehicle weight and insulation differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A lightweight Hyundai Ioniq 6 (4,375 lbs) requires 30-40% less preconditioning energy than a Ford F-150 Lightning (5,500+ lbs), yet many calculators fail to adjust for this significant factor. Enter your specific vehicle model or battery size for accurate estimates rather than using generic vehicle category assumptions.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is EV preconditioning and why does it matter for energy consumption?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">EV preconditioning is the process of heating or cooling your electric vehicle's battery and cabin before driving, typically while still plugged in. This practice matters because it reduces energy drain from the main battery during driving, improving overall efficiency by 5-15% in cold climates. By precondition while connected to AC power, you avoid wasting stored battery energy on temperature regulation during your journey.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much energy does preconditioning typically consume?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Preconditioning energy consumption ranges from 1 to 4 kWh depending on ambient temperature, vehicle size, and duration. In freezing conditions below 32°F, you can expect 3-4 kWh for a 10-15 minute preheat cycle on mid-size EVs like a Tesla Model 3 or Chevrolet Bolt. Moderate climates (40-60°F) typically consume 1-2 kWh for the same duration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average cost of preconditioning per session?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">At the U.S. average electricity rate of $0.16 per kWh, preconditioning costs between $0.16 and $0.64 per session. For a daily commuter in a cold climate using 3.5 kWh, this translates to roughly $0.56 per day or $168 annually. Costs vary significantly by region—California ($0.22/kWh) would see higher costs, while Louisiana ($0.10/kWh) would see lower ones.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does preconditioning save money compared to not preconditioning?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, preconditioning typically saves 5-15% on energy costs per mile despite the upfront preconditioning energy use. For example, a 30-mile commute without preconditioning in 20°F weather might consume 9 kWh total, while with preconditioning it uses 8 kWh, offsetting the 2-3 kWh preheat cost over the journey. The payback occurs within 1-3 trips in cold climates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does temperature affect preconditioning energy requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Preconditioning energy needs increase substantially in colder temperatures—dropping from 32°F to 0°F can increase energy demands by 50-75%. At 32°F, expect 1.5-2 kWh for preconditioning, while at 0°F or below, demand rises to 2.5-4 kWh for the same vehicle and duration. Conversely, in mild climates above 50°F, preconditioning may use only 0.5-1 kWh.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I preheat the cabin or just the battery, or both?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For maximum efficiency and cost-effectiveness, prioritize battery heating over cabin heating, as battery conditioning directly improves driving range. Many EVs allow you to heat only the battery pack while keeping cabin heating minimal until you're driving, which can reduce preconditioning energy by 30-40%. Full cabin and battery preconditioning uses roughly 20-30% more energy than battery-only strategies.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What variables affect the accuracy of preconditioning estimates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Key variables include ambient temperature, vehicle weight, battery size, insulation quality, target temperature, and grid electricity rates. A 40 kWh battery EV in cold conditions differs significantly from an 85 kWh performance vehicle, with energy needs scaling non-linearly. Local electricity rates (ranging from $0.08-$0.35 per kWh across U.S. regions) also directly impact cost calculations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How can I minimize preconditioning costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use time-of-use (TOU) electricity plans to charge during off-peak hours when rates are 30-50% lower, typically after 9 PM or before 6 AM. Precondition for shorter durations (5-10 minutes) rather than 15-20 minutes, as 80% of battery warmth is achieved in the first half of the cycle. Park in garages or use window shades to maintain ambient temperature and reduce preheat demand.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does preconditioning drain my EV's battery if I'm plugged in?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, preconditioning draws directly from the AC grid connection and does not drain your stored battery when actively plugged into a Level 1, Level 2, or DC fast charger. This is the primary advantage of preconditioning—you're using grid power (often &lt;$0.20/kWh) instead of expensive stored battery energy that could be used for driving. Always ensure your vehicle is connected to a power source before initiating remote preconditioning.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.eia.gov/electricity/state/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Energy Information Administration - Average Electricity Rates by State</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government data on electricity consumption and average rates across all U.S. states, updated quarterly.</p>
          </li>
          <li>
            <a href="https://fueleconomy.gov/feg/noframes/20271.shtml" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy - Compare Electric Vehicles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive database of EV efficiency ratings, battery sizes, and real-world range data for all current electric vehicle models.</p>
          </li>
          <li>
            <a href="https://www.consumerreports.org/cars/electric-cars/how-cold-weather-affects-ev-battery-performance/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Reports - Electric Vehicle Battery Performance in Cold Weather</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed analysis of how freezing temperatures impact battery range, charging speed, and vehicle efficiency across multiple EV models.</p>
          </li>
          <li>
            <a href="https://www.tesla.com/support/energy/powerwalls/guides/overview" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Tesla Vehicle Specifications and Energy Consumption Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official specifications for Tesla EV models including battery capacity, thermal management system details, and energy consumption benchmarks.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="EV Preconditioning Energy & Cost Estimator"
      description="Professional automotive calculator: EV Preconditioning Energy & Cost Estimator. Get accurate estimates, expert advice, and financial insights."
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