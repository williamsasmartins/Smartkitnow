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

export default function EvIncentivesEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // Battery capacity in kWh
    ratePerKWh: "",      // Rate in $/kWh
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const battery = parseFloat(inputs.batteryCapacity);
    const rate = parseFloat(inputs.ratePerKWh);

    if (isNaN(battery) || battery <= 0 || isNaN(rate) || rate <= 0) {
      return {
        primary: "0 kWh",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for battery capacity and rate.",
        feedback: "Awaiting valid input"
      };
    }

    // Calculate estimated charging cost for a full battery charge
    const cost = battery * rate;

    // Estimate time to fully charge based on typical home charger rates (Level 2 ~7.2 kW)
    // Time (hours) = Battery capacity (kWh) / Charger power (kW)
    // Using 7.2 kW as a common Level 2 charger rate
    const chargerPower = 7.2;
    const timeHours = battery / chargerPower;

    return {
      primary: `${battery.toFixed(1)} kWh`,
      secondary: `$${cost.toFixed(2)}`,
      details: `Estimated full charge time: ${timeHours.toFixed(1)} hours at ${chargerPower} kW charger.`,
      feedback: "Calculation based on typical home charging rates"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What inputs do I need to use this EV Incentives & Tax Credits Estimator?",
      answer:
        "To use this calculator, you need to input your electric vehicle's battery capacity in kilowatt-hours (kWh) and the electricity rate you pay per kWh in dollars. These inputs allow the calculator to estimate the cost to fully charge your EV and the approximate time it will take using a typical home Level 2 charger. Accurate inputs ensure precise cost and time estimates."
    },
    {
      question: "Does this calculator include federal or state EV tax credits?",
      answer:
        "This calculator focuses on estimating charging costs and time based on battery capacity and electricity rates. It does not directly calculate federal or state EV tax credits or incentives, as those vary widely by location and vehicle model. For tax credit details, consult your local government or IRS resources."
    },
    {
      question: "Why is the charging time estimate based on 7.2 kW?",
      answer:
        "The 7.2 kW charging rate represents a common Level 2 home charger power output, which many EV owners use for overnight charging. Charging times can vary significantly depending on charger type, battery size, and vehicle acceptance rate. This estimate provides a practical average for typical home charging scenarios."
    },
    {
      question: "Can I use this calculator for commercial or fast charging stations?",
      answer:
        "No, this calculator is designed for estimating home charging costs and times using typical residential electricity rates and Level 2 chargers. Commercial or fast chargers operate at much higher power levels and often have different pricing structures, which are not accounted for here."
    },
    {
      question: "How can I reduce my EV charging costs?",
      answer:
        "To reduce charging costs, consider charging during off-peak hours if your utility offers time-of-use rates, use solar power if available, or select an electricity plan with lower rates. Additionally, efficient driving habits and regular maintenance can help maximize your EV's range, reducing overall charging frequency."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $40,000 electric sedan with a 60 kWh battery and an average electricity rate of $0.13 per kWh at home.",
    steps: [
      {
        label: "Step 1: Input Battery Capacity",
        explanation: "The vehicle has a 60 kWh battery capacity."
      },
      {
        label: "Step 2: Input Electricity Rate",
        explanation: "The average residential electricity rate is $0.13 per kWh."
      },
      {
        label: "Step 3: Calculate Charging Cost",
        explanation:
          "Charging cost = Battery capacity × Rate = 60 kWh × $0.13/kWh = $7.80 per full charge."
      },
      {
        label: "Step 4: Estimate Charging Time",
        explanation:
          "Charging time = Battery capacity ÷ Charger power = 60 kWh ÷ 7.2 kW ≈ 8.3 hours for a full charge."
      }
    ],
    result:
      "Final Result: It will cost approximately $7.80 to fully charge the EV at home, taking about 8.3 hours using a typical Level 2 charger."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "U.S. Department of Energy - Alternative Fuels Data Center",
      description:
        "Comprehensive resource on electric vehicle charging, incentives, and tax credits."
    },
    {
      title: "Internal Revenue Service - Plug-In Electric Drive Vehicle Credit",
      description:
        "Official IRS page detailing federal tax credits available for qualifying electric vehicles."
    },
    {
      title: "EnergySage - Electric Vehicle Charging Costs",
      description:
        "Detailed analysis and calculators for estimating EV charging costs and savings."
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
            step="0.01"
            placeholder="e.g. 0.13"
            value={inputs.ratePerKWh}
            onChange={(e) => handleInputChange("ratePerKWh", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
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
            <strong>Step 1:</strong> Enter your electric vehicle's battery capacity in kilowatt-hours (kWh). This information is usually found in your vehicle's specifications.
          </li>
          <li>
            <strong>Step 2:</strong> Input your electricity rate in dollars per kilowatt-hour ($/kWh). Check your utility bill or provider's website for the most accurate rate.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to see the estimated cost to fully charge your EV and the approximate charging time using a typical Level 2 home charger.
          </li>
          <li>
            <strong>Step 4:</strong> Review the results and use them to plan your charging costs and schedule effectively.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV Incentives & Tax Credits Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Electric vehicles (EVs) are becoming increasingly popular due to their environmental benefits and lower operating costs compared to traditional gasoline vehicles. However, understanding the true cost of owning and operating an EV requires more than just the purchase price. Charging costs and available incentives play a crucial role in the overall financial picture.
          </p>
          <p>
            This calculator helps estimate the cost to fully charge your EV based on its battery capacity and your local electricity rate. Battery capacity, measured in kilowatt-hours (kWh), indicates how much energy your vehicle's battery can store. The electricity rate, typically expressed in dollars per kWh, varies by location and utility provider. Multiplying these two values gives you an estimate of the cost for a full charge.
          </p>
          <p>
            Additionally, the calculator estimates the time required to fully charge your EV using a common Level 2 home charger, which typically delivers around 7.2 kW of power. This helps you plan your charging schedule effectively. While this tool does not directly calculate tax credits or incentives, understanding your charging costs is essential for evaluating the total cost of ownership.
          </p>
          <p>
            For tax credits and incentives, consult federal, state, and local resources as these vary widely and can significantly reduce your upfront costs. Combining charging cost estimates with available incentives will give you a comprehensive understanding of your EV's financial impact.
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
            <strong>1. Entering incorrect battery capacity:</strong> Using inaccurate or estimated battery sizes can lead to misleading cost and time calculations. Always verify your vehicle’s exact battery capacity from official specifications.
          </p>
          <p>
            <strong>2. Using outdated or incorrect electricity rates:</strong> Electricity rates vary by location and time of day. Using an average or incorrect rate may not reflect your actual charging costs, especially if you have time-of-use pricing.
          </p>
          <p>
            <strong>3. Assuming all chargers have the same power output:</strong> Charging times depend heavily on the charger’s power rating. This calculator assumes a typical Level 2 charger; faster chargers will reduce charging time but may cost more.
          </p>
          <p>
            <strong>4. Expecting the calculator to include tax credits:</strong> This tool estimates charging costs and times only. Tax credits and incentives must be researched separately as they depend on your location and vehicle.
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
                href={
                  ref.title === "U.S. Department of Energy - Alternative Fuels Data Center"
                    ? "https://afdc.energy.gov/fuels/electricity.html"
                    : ref.title === "Internal Revenue Service - Plug-In Electric Drive Vehicle Credit"
                    ? "https://www.irs.gov/credits-deductions/individuals/plug-in-electric-drive-vehicle-credit-section-30d"
                    : "https://www.energysage.com/electric-vehicles/ev-charging-cost/"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
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
      title="EV Incentives & Tax Credits Estimator"
      description="Professional automotive calculator: EV Incentives & Tax Credits Estimator. Get accurate estimates, expert advice, and financial insights."
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