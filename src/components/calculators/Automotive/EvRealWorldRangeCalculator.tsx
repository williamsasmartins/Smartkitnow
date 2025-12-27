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

export default function EvRealWorldRangeCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    consumptionRate: "", // Wh/mile or Wh/km depending on unit
    electricityRate: "", // $/kWh
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const battery = parseFloat(inputs.batteryCapacity);
    const consumption = parseFloat(inputs.consumptionRate);
    const rate = parseFloat(inputs.electricityRate);
    const unit = inputs.unit;

    if (
      isNaN(battery) || battery <= 0 ||
      isNaN(consumption) || consumption <= 0 ||
      isNaN(rate) || rate <= 0
    ) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Awaiting valid inputs"
      };
    }

    // Consumption is Wh per mile (imperial) or Wh per km (metric)
    // Calculate range = battery capacity (Wh) / consumption (Wh per distance)
    // batteryCapacity is in kWh, convert to Wh
    const batteryWh = battery * 1000;

    // Calculate range in miles or km
    const range = batteryWh / consumption;

    // Calculate cost to fully charge battery
    const cost = battery * rate;

    // Estimate charging time (optional) - assume average charging power 7.2 kW (Level 2 home charger)
    // chargingTime = batteryCapacity (kWh) / chargingPower (kW)
    // This is a rough estimate
    const chargingPower = 7.2;
    const chargingTime = battery / chargingPower;

    return {
      primary: `${range.toFixed(1)} ${unit === "imperial" ? "miles" : "km"}`,
      secondary: `$${cost.toFixed(2)}`,
      details: `Estimated charging time: ${chargingTime.toFixed(1)} hours`,
      feedback: "Estimated real-world range and charging cost"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How accurate is the EV Real-World Range Estimator?",
      answer:
        "The estimator provides a close approximation based on your inputs for battery capacity, consumption rate, and electricity cost. Real-world range can vary due to driving habits, terrain, weather, and vehicle condition. Always consider these factors as the calculator assumes average conditions and steady consumption rates."
    },
    {
      question: "What does the consumption rate input represent?",
      answer:
        "The consumption rate is the average energy your EV uses per unit distance, expressed in watt-hours per mile (Wh/mi) for imperial units or watt-hours per kilometer (Wh/km) for metric units. This value is crucial for estimating how far your EV can travel on a full charge."
    },
    {
      question: "Why do I need to input the electricity rate?",
      answer:
        "Electricity rates vary by location and provider. Inputting your local rate in dollars per kilowatt-hour ($/kWh) allows the calculator to estimate the cost of fully charging your EV’s battery, helping you understand your potential charging expenses."
    },
    {
      question: "Can I use this calculator for any EV model?",
      answer:
        "Yes, as long as you know the battery capacity and average consumption rate of your EV, you can use this calculator. These values are often available in your vehicle’s specifications or from real-world user data."
    },
    {
      question: "Does the calculator consider fast charging times?",
      answer:
        "The charging time estimate is based on a typical Level 2 home charger with 7.2 kW power output. Fast charging times vary widely depending on charger type and battery state, so this is a rough estimate for home charging scenarios."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the estimated range and charging cost for a 60 kWh battery EV with an average consumption of 300 Wh/mile, and an electricity rate of $0.13/kWh in the US.",
    steps: [
      {
        label: "Step 1: Convert battery capacity to watt-hours",
        explanation: "60 kWh × 1000 = 60,000 Wh"
      },
      {
        label: "Step 2: Calculate estimated range",
        explanation: "60,000 Wh ÷ 300 Wh/mile = 200 miles"
      },
      {
        label: "Step 3: Calculate charging cost",
        explanation: "60 kWh × $0.13/kWh = $7.80"
      },
      {
        label: "Step 4: Estimate charging time (Level 2 charger at 7.2 kW)",
        explanation: "60 kWh ÷ 7.2 kW = 8.3 hours"
      }
    ],
    result: "Estimated range: 200 miles, Charging cost: $7.80, Charging time: 8.3 hours"
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for electric vehicle efficiency and range ratings."
    },
    {
      title: "U.S. Department of Energy - Alternative Fuels Data Center",
      description: "Comprehensive data on electric vehicle charging and energy consumption."
    },
    {
      title: "InsideEVs - Real-World EV Efficiency",
      description: "Community-sourced data on real-world EV consumption and range."
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
          <Label>
            Average Consumption Rate (Wh/{inputs.unit === "imperial" ? "mile" : "km"})
          </Label>
          <Input
            type="number"
            min="0"
            step="1"
            value={inputs.consumptionRate}
            onChange={(e) => handleInputChange("consumptionRate", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 300" : "e.g. 186"}
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
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system: Imperial (miles) or Metric (kilometers).
          </li>
          <li>
            <strong>Step 2:</strong> Enter your EV’s battery capacity in kilowatt-hours (kWh). This value is typically found in your vehicle’s specifications.
          </li>
          <li>
            <strong>Step 3:</strong> Input the average energy consumption rate of your EV in watt-hours per mile (Wh/mi) or watt-hours per kilometer (Wh/km), depending on your selected unit.
          </li>
          <li>
            <strong>Step 4:</strong> Enter your local electricity rate in dollars per kilowatt-hour ($/kWh) to estimate charging costs.
          </li>
          <li>
            <strong>Step 5:</strong> Click the Calculate button to see your estimated real-world driving range, charging cost, and approximate charging time.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV Real-World Range Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Electric vehicles (EVs) are becoming increasingly popular due to their environmental benefits and lower operating costs compared to traditional internal combustion engine vehicles. However, one of the most common concerns among potential EV buyers is understanding the real-world driving range and the cost of charging. This calculator helps bridge that gap by providing an estimate based on your vehicle’s battery capacity, energy consumption, and local electricity rates.
          </p>
          <p>
            The battery capacity, measured in kilowatt-hours (kWh), represents the total amount of energy your EV’s battery can store. The consumption rate, expressed in watt-hours per mile or kilometer (Wh/mi or Wh/km), indicates how much energy your vehicle uses to travel a given distance. By dividing the total battery energy by the consumption rate, you get an estimate of how far your EV can travel on a full charge under typical conditions.
          </p>
          <p>
            Charging cost is another important factor to consider. Electricity prices vary widely depending on location, time of day, and provider. By inputting your local electricity rate, the calculator estimates the cost to fully recharge your battery. Additionally, the calculator provides a rough estimate of charging time based on a standard Level 2 home charger output of 7.2 kW, which is common for residential EV charging setups.
          </p>
          <p>
            Keep in mind that real-world conditions such as driving style, terrain, temperature, and use of climate control systems can significantly affect both range and consumption. This tool provides a solid baseline estimate to help you plan trips, budget charging costs, and better understand your EV’s capabilities.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Using Manufacturer’s Range Instead of Real-World Consumption:</strong> Manufacturer range estimates are often optimistic and based on ideal conditions. Always use real-world consumption data for more accurate results.
          </p>
          <p>
            <strong>2. Mixing Units:</strong> Ensure that the consumption rate matches the selected unit system (Wh/mile for imperial, Wh/km for metric). Mixing units will lead to incorrect range calculations.
          </p>
          <p>
            <strong>3. Ignoring Electricity Rate Variations:</strong> Electricity costs can vary by time of day and location. Using an average or incorrect rate can misrepresent charging costs.
          </p>
          <p>
            <strong>4. Overlooking Charging Power Differences:</strong> Charging time estimates assume a 7.2 kW Level 2 charger. Fast chargers or slower chargers will affect actual charging times.
          </p>
          <p>
            <strong>5. Not Accounting for Environmental Factors:</strong> Temperature, terrain, and driving habits significantly impact EV efficiency and range. Use this calculator as a baseline, not a guarantee.
          </p>
        </div>
      </section>

      {/* 4. FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. REFERENCES */}
      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                {ref.title} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="EV Real-World Range Estimator"
      description="Professional automotive calculator: EV Real-World Range Estimator. Get accurate estimates, expert advice, and financial insights."
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