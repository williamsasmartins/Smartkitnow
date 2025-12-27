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

export default function EvChargingCostTimeCalculator() {
  const [inputs, setInputs] = useState({
    batteryCapacity: "", // kWh
    chargingRate: "", // kW (charging power)
    electricityRate: "", // $/kWh
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const battery = parseFloat(inputs.batteryCapacity);
    const rate = parseFloat(inputs.electricityRate);
    const chargingPower = parseFloat(inputs.chargingRate);

    if (
      isNaN(battery) || battery <= 0 ||
      isNaN(rate) || rate <= 0 ||
      isNaN(chargingPower) || chargingPower <= 0
    ) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Awaiting valid input"
      };
    }

    // Calculate cost = battery capacity (kWh) * electricity rate ($/kWh)
    const cost = battery * rate;

    // Calculate time = battery capacity (kWh) / charging power (kW)
    // Charging time in hours
    const timeHours = battery / chargingPower;

    // Format time to hours and minutes
    const hours = Math.floor(timeHours);
    const minutes = Math.round((timeHours - hours) * 60);

    const timeFormatted = `${hours}h ${minutes}m`;

    return {
      primary: timeFormatted,
      secondary: `$${cost.toFixed(2)}`,
      details: `Charging Time: ${timeHours.toFixed(2)} hours (approx.) | Cost: $${cost.toFixed(2)}`,
      feedback: "Estimated charging time and cost"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How accurate is the EV Charging Cost & Time Estimator?",
      answer:
        "This calculator provides an estimate based on the inputs you provide, such as battery capacity, charging power, and electricity rate. Actual charging times may vary due to factors like battery state of charge, charger efficiency, ambient temperature, and vehicle charging curve. Similarly, electricity rates can fluctuate based on your location and time of use. Always consider these variables for precise planning."
    },
    {
      question: "Why do I need to input the charging power (kW)?",
      answer:
        "Charging power (in kW) represents the rate at which your EV charger can deliver electricity to your vehicle. Different chargers have different power outputs, such as Level 1 (around 1.4 kW), Level 2 (up to 19.2 kW), or DC fast chargers (50 kW+). This input helps the calculator estimate how long it will take to fully charge your battery."
    },
    {
      question: "Can I use this calculator for partial charges?",
      answer:
        "Yes, but you should adjust the battery capacity input to reflect the amount of energy you intend to add. For example, if your battery is 60 kWh but you only want to charge from 20% to 80%, input 60 kWh × 0.6 = 36 kWh as the battery capacity for the calculation."
    },
    {
      question: "Does this calculator consider charging efficiency?",
      answer:
        "No, this calculator assumes 100% charging efficiency for simplicity. In reality, charging efficiency ranges from 85% to 95%, meaning some energy is lost during charging. To get a more accurate cost estimate, you can increase the battery capacity input by 5-15% to account for these losses."
    },
    {
      question: "How do electricity rates affect charging cost?",
      answer:
        "Electricity rates vary by region, time of day, and provider. Charging during off-peak hours can reduce costs significantly. This calculator uses the rate you input to estimate cost, so ensure you use the correct rate for your charging time to get an accurate estimate."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Charging a 60 kWh battery EV using a Level 2 charger rated at 7.2 kW with an electricity rate of $0.13 per kWh.",
    steps: [
      {
        label: "Step 1: Calculate charging cost",
        explanation:
          "Multiply battery capacity by electricity rate: 60 kWh × $0.13/kWh = $7.80."
      },
      {
        label: "Step 2: Calculate charging time",
        explanation:
          "Divide battery capacity by charging power: 60 kWh ÷ 7.2 kW ≈ 8.33 hours, which is 8 hours and 20 minutes."
      }
    ],
    result: "Final Result: Charging will cost approximately $7.80 and take about 8h 20m."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "U.S. Department of Energy - Electric Vehicle Charging",
      description:
        "Comprehensive information on EV charging types, rates, and best practices.",
      url: "https://afdc.energy.gov/fuels/electricity_charging.html"
    },
    {
      title: "EPA Fuel Economy Guide",
      description:
        "Official source for electric vehicle efficiency and charging information.",
      url: "https://www.fueleconomy.gov/feg/evtech.shtml"
    },
    {
      title: "ChargePoint - EV Charging Basics",
      description:
        "Detailed explanations of charging speeds, costs, and equipment.",
      url: "https://www.chargepoint.com/resources/ev-charging-basics/"
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="batteryCapacity">Battery Capacity (kWh)</Label>
          <Input
            id="batteryCapacity"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 60"
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chargingRate">Charging Power (kW)</Label>
          <Input
            id="chargingRate"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 7.2"
            value={inputs.chargingRate}
            onChange={(e) => handleInputChange("chargingRate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="electricityRate">Electricity Rate ($/kWh)</Label>
          <Input
            id="electricityRate"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 0.13"
            value={inputs.electricityRate}
            onChange={(e) => handleInputChange("electricityRate", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Zap className="mr-2 h-5 w-5" /> Calculate
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
            <strong>Enter your EV's battery capacity</strong> in kilowatt-hours (kWh). This is typically found in your vehicle's specifications.
          </li>
          <li>
            <strong>Input the charging power</strong> of your charger in kilowatts (kW). This represents how fast your charger can deliver electricity.
          </li>
          <li>
            <strong>Provide the electricity rate</strong> you pay per kWh in dollars. Check your utility bill or provider website for accurate rates.
          </li>
          <li>
            <strong>Click the Calculate button</strong> to see the estimated charging time and cost based on your inputs.
          </li>
          <li>
            <strong>Review the results</strong> which show the approximate time to fully charge and the total cost.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV Charging Cost & Time Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Electric vehicles (EVs) have become increasingly popular due to their environmental benefits and lower operating costs compared to traditional gasoline vehicles. One of the key considerations for EV owners is understanding how much it costs and how long it takes to charge their vehicle. This calculator helps you estimate these values based on your EV's battery size, the power of your charging equipment, and your local electricity rates.
          </p>
          <p>
            The battery capacity, measured in kilowatt-hours (kWh), represents the total amount of energy your EV's battery can store. Charging power, measured in kilowatts (kW), indicates the rate at which your charger can deliver electricity to the battery. Higher charging power means faster charging times. Electricity rates vary widely depending on your location, provider, and time of use, so inputting your accurate rate is essential for a precise cost estimate.
          </p>
          <p>
            This calculator assumes a full charge from empty to full and 100% charging efficiency for simplicity. In reality, charging efficiency losses and partial charges will affect actual time and cost. Use this tool as a baseline to plan your charging sessions and budget accordingly. Understanding these factors can help you optimize your charging habits, save money, and make the most of your EV ownership experience.
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
            <strong>1. Ignoring charging power:</strong> Using a charger with lower power than your EV’s maximum charging capability will increase charging time. Always input the actual charger power, not just the vehicle’s max.
          </p>
          <p>
            <strong>2. Using incorrect electricity rates:</strong> Electricity prices vary by time and location. Using an average or incorrect rate can lead to inaccurate cost estimates.
          </p>
          <p>
            <strong>3. Assuming 100% charging efficiency:</strong> Real-world charging involves energy losses. Not accounting for this can underestimate costs and charging times.
          </p>
          <p>
            <strong>4. Not adjusting for partial charges:</strong> If you only charge part of the battery, input the corresponding energy amount, not the full battery capacity.
          </p>
          <p>
            <strong>5. Forgetting to convert units:</strong> Ensure all inputs are in the correct units (kWh for battery and electricity, kW for charging power) to avoid calculation errors.
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
                href={ref.url}
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
      title="EV Charging Cost & Time Estimator"
      description="Professional automotive calculator: EV Charging Cost & Time Estimator. Get accurate estimates, expert advice, and financial insights."
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