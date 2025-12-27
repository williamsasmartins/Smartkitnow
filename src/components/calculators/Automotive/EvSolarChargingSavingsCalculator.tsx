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

export default function EvSolarChargingSavingsCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    electricityRate: "", // $/kWh
    dailySunHours: "", // hours of effective solar charging per day
    solarPanelOutput: "", // kW peak solar panel output
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const batteryCapacity = parseFloat(inputs.batteryCapacity);
    const electricityRate = parseFloat(inputs.electricityRate);
    const dailySunHours = parseFloat(inputs.dailySunHours);
    const solarPanelOutput = parseFloat(inputs.solarPanelOutput);

    if (
      isNaN(batteryCapacity) || batteryCapacity <= 0 ||
      isNaN(electricityRate) || electricityRate <= 0 ||
      isNaN(dailySunHours) || dailySunHours <= 0 ||
      isNaN(solarPanelOutput) || solarPanelOutput <= 0
    ) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Awaiting valid inputs"
      };
    }

    // Calculate daily solar energy production (kWh)
    // solarPanelOutput (kW) * dailySunHours (h) = kWh/day
    const dailySolarEnergy = solarPanelOutput * dailySunHours;

    // Calculate how many days it takes to fully charge the EV battery using solar energy alone
    // days = batteryCapacity / dailySolarEnergy
    const daysToFullCharge = batteryCapacity / dailySolarEnergy;

    // Calculate cost to fully charge from grid (no solar)
    const costFullChargeGrid = batteryCapacity * electricityRate;

    // Calculate cost savings per full charge if solar covers dailySolarEnergy kWh
    // Savings = dailySolarEnergy * electricityRate
    const dailySavings = dailySolarEnergy * electricityRate;

    // Calculate time to fully charge in hours assuming home charger at 7.2 kW (Level 2)
    // Charge time (hours) = batteryCapacity / 7.2
    const chargeTimeHours = batteryCapacity / 7.2;

    return {
      primary: `${daysToFullCharge.toFixed(2)} days`,
      secondary: `$${dailySavings.toFixed(2)} saved per day`,
      details: `Full charge cost from grid: $${costFullChargeGrid.toFixed(2)} | Estimated charge time: ${chargeTimeHours.toFixed(1)} hours`,
      feedback: "Solar charging can significantly reduce your electricity costs and charging time."
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does solar charging reduce my EV charging costs?",
      answer:
        "Solar charging uses energy generated from your solar panels to charge your electric vehicle, reducing the amount of electricity you need to buy from the grid. This can significantly lower your charging costs, especially if you have high electricity rates. The savings depend on your solar panel capacity, sunlight availability, and your EV's battery size."
    },
    {
      question: "What inputs do I need to use this calculator accurately?",
      answer:
        "You need to enter your EV's battery capacity in kilowatt-hours (kWh), your local electricity rate in dollars per kWh, the average daily effective sunlight hours your solar panels receive, and your solar panel system's peak output in kilowatts (kW). Accurate inputs ensure precise savings and time estimates."
    },
    {
      question: "Can I fully charge my EV using solar power alone?",
      answer:
        "Whether you can fully charge your EV using solar power depends on your solar panel system size, sunlight availability, and your driving habits. This calculator estimates how many days it would take to fully charge your battery using only solar energy generated daily. Many users combine solar charging with grid electricity for convenience."
    },
    {
      question: "Does this calculator consider charging efficiency losses?",
      answer:
        "This calculator provides estimates based on ideal conditions and does not explicitly account for charging efficiency losses, which typically range from 10-15%. Actual savings and charging times may vary slightly due to these losses and other factors like inverter efficiency and battery health."
    },
    {
      question: "How can I increase my solar charging savings?",
      answer:
        "To maximize solar charging savings, consider increasing your solar panel capacity, optimizing panel orientation and tilt for maximum sunlight, and charging your EV during peak sunlight hours. Additionally, using energy storage systems like home batteries can help store excess solar energy for nighttime charging."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $40,000 electric sedan with a 60 kWh battery, charging at a residential electricity rate of $0.15 per kWh. The homeowner has a 5 kW solar panel system receiving an average of 5 peak sun hours daily.",
    steps: [
      {
        label: "Step 1: Calculate daily solar energy production",
        explanation: "5 kW solar system × 5 hours = 25 kWh/day"
      },
      {
        label: "Step 2: Calculate days to fully charge EV using solar",
        explanation: "60 kWh battery ÷ 25 kWh/day = 2.4 days"
      },
      {
        label: "Step 3: Calculate daily savings from solar charging",
        explanation: "25 kWh × $0.15/kWh = $3.75 saved per day"
      },
      {
        label: "Step 4: Calculate cost to fully charge from grid",
        explanation: "60 kWh × $0.15/kWh = $9.00 per full charge"
      },
      {
        label: "Step 5: Calculate estimated charge time at 7.2 kW charger",
        explanation: "60 kWh ÷ 7.2 kW = 8.33 hours"
      }
    ],
    result:
      "Using solar power, it takes approximately 2.4 days to fully charge the EV, saving about $3.75 daily on electricity costs. A full grid charge costs $9.00, and charging time is roughly 8.3 hours."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "U.S. Department of Energy - Electric Vehicle Charging",
      description:
        "Comprehensive guide on EV charging types, costs, and efficiency considerations."
    },
    {
      title: "National Renewable Energy Laboratory (NREL) - Solar Radiation Data",
      description:
        "Reliable data source for solar irradiance and peak sun hours by location."
    },
    {
      title: "EnergySage - Solar Panel Cost and Savings Calculator",
      description:
        "Tool and resources for estimating solar panel system output and financial benefits."
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
          <Label>EV Battery Capacity (kWh)</Label>
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
            placeholder="e.g. 0.15"
            value={inputs.electricityRate}
            onChange={(e) => handleInputChange("electricityRate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Average Daily Sunlight Hours (peak sun hours)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5"
            value={inputs.dailySunHours}
            onChange={(e) => handleInputChange("dailySunHours", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Solar Panel System Output (kW peak)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5"
            value={inputs.solarPanelOutput}
            onChange={(e) => handleInputChange("solarPanelOutput", e.target.value)}
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
            <p className="mt-3 italic text-slate-600 dark:text-slate-400">{results.feedback}</p>
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
            <strong>Step 1:</strong> Enter your electric vehicle's battery capacity in kilowatt-hours (kWh). This value is usually found in your vehicle's specifications.
          </li>
          <li>
            <strong>Step 2:</strong> Input your local electricity rate in dollars per kilowatt-hour ($/kWh), which you can find on your utility bill.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the average daily peak sunlight hours your solar panels receive. This depends on your location and panel orientation.
          </li>
          <li>
            <strong>Step 4:</strong> Enter your solar panel system's peak output in kilowatts (kW), representing the maximum power your panels can produce under ideal conditions.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to see how many days it would take to fully charge your EV using solar energy, your daily savings, and estimated charging time.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV Solar Charging Savings Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The EV Solar Charging Savings Calculator is designed to help electric vehicle owners estimate the financial and time benefits of charging their vehicles using solar energy. By inputting your EV's battery capacity, local electricity rates, and solar panel system details, you can understand how solar power offsets grid electricity costs and how long it takes to charge your EV using solar energy alone.
          </p>
          <p>
            Solar panels generate electricity during daylight hours, which can be used directly to charge your EV or stored in home batteries for later use. The calculator estimates daily solar energy production by multiplying your solar panel system's peak output by the average daily peak sun hours. This value represents the energy available for charging your EV each day.
          </p>
          <p>
            The calculator then divides your EV battery capacity by the daily solar energy to estimate how many days it would take to fully charge your vehicle using solar power alone. It also calculates the cost savings by multiplying the solar energy used for charging by your electricity rate, showing how much money you save daily by using solar instead of grid electricity.
          </p>
          <p>
            Additionally, the calculator estimates the time required to fully charge your EV using a typical Level 2 home charger rated at 7.2 kW. This helps you plan your charging schedule effectively. Keep in mind that actual savings and charging times may vary due to factors such as charging efficiency, weather conditions, and driving habits.
          </p>
          <p>
            Using this calculator empowers EV owners to make informed decisions about investing in solar power systems and optimizing their charging strategies to maximize savings and sustainability.
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
            <strong>1. Ignoring solar panel system size:</strong> Entering an incorrect or estimated solar panel output without considering your actual system size can lead to inaccurate savings estimates.
          </p>
          <p>
            <strong>2. Overestimating sunlight hours:</strong> Using peak sun hours that are higher than your location's average will inflate the expected solar energy production and savings.
          </p>
          <p>
            <strong>3. Not accounting for charging efficiency:</strong> This calculator assumes ideal conditions; real-world charging losses can reduce actual savings.
          </p>
          <p>
            <strong>4. Using outdated electricity rates:</strong> Electricity prices fluctuate, so ensure you use your current rate for accurate cost calculations.
          </p>
          <p>
            <strong>5. Neglecting seasonal variations:</strong> Solar energy production varies seasonally, so consider that savings may be lower in winter months.
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
              <a href="#" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1">
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
      title="EV Solar Charging Savings Calculator"
      description="Professional automotive calculator: EV Solar Charging Savings Calculator. Get accurate estimates, expert advice, and financial insights."
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