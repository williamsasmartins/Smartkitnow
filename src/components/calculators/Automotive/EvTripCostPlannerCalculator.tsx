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

export default function EvTripCostPlannerCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    electricityRate: "", // $/kWh
    tripDistance: "", // miles or km based on unit
    efficiency: "", // Wh/mile or Wh/km based on unit
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const batteryCapacity = parseFloat(inputs.batteryCapacity);
    const electricityRate = parseFloat(inputs.electricityRate);
    const tripDistance = parseFloat(inputs.tripDistance);
    const efficiency = parseFloat(inputs.efficiency);

    if (
      isNaN(batteryCapacity) || batteryCapacity <= 0 ||
      isNaN(electricityRate) || electricityRate <= 0 ||
      isNaN(tripDistance) || tripDistance <= 0 ||
      isNaN(efficiency) || efficiency <= 0
    ) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Awaiting valid input"
      };
    }

    // Convert efficiency from Wh per mile/km to kWh per mile/km
    const efficiencyKWh = efficiency / 1000;

    // Total energy needed for the trip (kWh)
    const totalEnergyNeeded = efficiencyKWh * tripDistance;

    // Total cost for charging for the trip
    const totalCost = totalEnergyNeeded * electricityRate;

    // Calculate charging stops needed (assuming full battery usage per charge)
    // Number of full battery charges needed = totalEnergyNeeded / batteryCapacity
    // Subtract 1 because you start with a full battery
    const chargingStops = Math.max(0, Math.ceil(totalEnergyNeeded / batteryCapacity) - 1);

    // Estimate charging time per stop (assuming fast charger at 150 kW)
    // Charging time per stop = batteryCapacity / 150 (hours)
    // Total charging time = chargingStops * charging time per stop
    const chargingPower = 150; // kW, typical fast charger
    const chargingTimePerStop = batteryCapacity / chargingPower; // hours
    const totalChargingTime = chargingStops * chargingTimePerStop; // hours

    // Format outputs
    const costFormatted = `$${totalCost.toFixed(2)}`;
    const chargingTimeFormatted = `${(totalChargingTime * 60).toFixed(0)} min`;
    const stopsFormatted = `${chargingStops} stop${chargingStops !== 1 ? "s" : ""}`;

    return {
      primary: stopsFormatted,
      secondary: costFormatted,
      details: `Estimated charging time: ${chargingTimeFormatted}`,
      feedback: `Trip requires approximately ${stopsFormatted} and costs about ${costFormatted} in electricity.`
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How do I calculate the cost of an EV trip?",
      answer:
        "To calculate the cost of an EV trip, multiply the total energy consumption for the trip (in kWh) by the electricity rate ($/kWh). Energy consumption depends on your vehicle's efficiency (Wh/mile or Wh/km) and the trip distance. This calculator helps you estimate the total cost by inputting your EV's battery capacity, electricity rate, trip distance, and efficiency."
    },
    {
      question: "Why do I need to input my EV's efficiency?",
      answer:
        "Your EV's efficiency, usually measured in watt-hours per mile (Wh/mi) or kilometer (Wh/km), indicates how much energy your vehicle consumes to travel a certain distance. This value is crucial to estimate how much energy you'll need for your trip, which directly affects the charging cost and number of charging stops."
    },
    {
      question: "How is charging time estimated in this calculator?",
      answer:
        "Charging time is estimated based on the number of charging stops required and the charging power of a typical fast charger (assumed here as 150 kW). The calculator divides your battery capacity by the charging power to estimate the time to fully charge, then multiplies by the number of stops to give total charging time."
    },
    {
      question: "Can I use this calculator for both miles and kilometers?",
      answer:
        "Yes, the calculator supports both imperial (miles) and metric (kilometers) units. Make sure to input your trip distance and efficiency in the same units to get accurate results. You can switch units using the selector at the top."
    },
    {
      question: "What factors can affect the accuracy of this trip cost estimate?",
      answer:
        "Several factors can influence the accuracy, including driving habits, terrain, weather conditions, and charging station availability. Real-world efficiency may vary from rated values, and charging speeds can differ based on charger type and battery state. Use this calculator as a guideline and plan for contingencies."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Planning a 300-mile trip in a Tesla Model 3 with a 75 kWh battery, electricity rate of $0.13 per kWh, and efficiency of 260 Wh/mile.",
    steps: [
      {
        label: "Step 1: Calculate total energy needed",
        explanation: "Efficiency is 260 Wh/mile, so energy per mile = 260 / 1000 = 0.26 kWh/mile. For 300 miles, total energy = 0.26 * 300 = 78 kWh."
      },
      {
        label: "Step 2: Calculate total cost",
        explanation: "Total cost = 78 kWh * $0.13/kWh = $10.14."
      },
      {
        label: "Step 3: Calculate charging stops",
        explanation: "Battery capacity is 75 kWh. Number of full charges needed = 78 / 75 = 1.04, so 2 charges total (start full + 1 stop). Charging stops = 2 - 1 = 1 stop."
      },
      {
        label: "Step 4: Estimate charging time",
        explanation: "Charging time per stop = 75 kWh / 150 kW = 0.5 hours = 30 minutes. Total charging time = 1 stop * 30 minutes = 30 minutes."
      }
    ],
    result: "You will need 1 charging stop, spend approximately $10.14 on electricity, and spend about 30 minutes charging during your trip."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for electric vehicle efficiency and range ratings.",
      url: "https://www.fueleconomy.gov/feg/evsbs.shtml"
    },
    {
      title: "Department of Energy - Alternative Fuels Data Center",
      description: "Comprehensive information on electric vehicle charging and costs.",
      url: "https://afdc.energy.gov/fuels/electricity_cost_calculator.html"
    },
    {
      title: "Tesla Charging Guide",
      description: "Tesla's official guide on charging times and speeds.",
      url: "https://www.tesla.com/support/charging"
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
            placeholder="e.g. 75"
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
            value={inputs.electricityRate}
            onChange={(e) => handleInputChange("electricityRate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Trip Distance ({inputs.unit === "imperial" ? "miles" : "km"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={inputs.unit === "imperial" ? "e.g. 300" : "e.g. 480"}
            value={inputs.tripDistance}
            onChange={(e) => handleInputChange("tripDistance", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Efficiency (Wh/{inputs.unit === "imperial" ? "mile" : "km"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={inputs.unit === "imperial" ? "e.g. 260" : "e.g. 160"}
            value={inputs.efficiency}
            onChange={(e) => handleInputChange("efficiency", e.target.value)}
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
            <strong>Step 1:</strong> Select your preferred unit system (Imperial for miles or Metric for kilometers) using the dropdown at the top right.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your EV's battery capacity in kilowatt-hours (kWh). This is typically found in your vehicle's specifications.
          </li>
          <li>
            <strong>Step 3:</strong> Input the electricity rate you pay per kWh in dollars. This can be found on your electric bill or charging station pricing.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the total distance of your planned trip in miles or kilometers, matching your selected unit system.
          </li>
          <li>
            <strong>Step 5:</strong> Provide your EV's efficiency in watt-hours per mile (Wh/mi) or per kilometer (Wh/km). This indicates how much energy your vehicle consumes per distance.
          </li>
          <li>
            <strong>Step 6:</strong> Click the "Calculate" button to see the estimated number of charging stops, total electricity cost, and approximate charging time for your trip.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV Trip Cost & Charging Planner
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Planning a long-distance trip in an electric vehicle (EV) requires careful consideration of your vehicle's battery capacity, energy consumption, electricity costs, and charging infrastructure. Unlike traditional gasoline vehicles, EVs rely on battery energy measured in kilowatt-hours (kWh), and their range depends heavily on efficiency, which varies by model, driving conditions, and terrain.
          </p>
          <p>
            This calculator helps you estimate the total cost of electricity for your trip and the number of charging stops you will likely need. By inputting your EV's battery capacity, electricity rate, trip distance, and efficiency, you can get a clear picture of your trip's energy requirements. The calculator assumes a typical fast charger power of 150 kW to estimate charging times, which can vary based on charger type and battery state of charge.
          </p>
          <p>
            Understanding these factors allows you to plan your route more effectively, budget for charging costs, and minimize downtime. Remember that real-world conditions such as weather, driving speed, and use of climate control can affect your EV's efficiency. Always allow for some buffer in your planning to ensure a smooth and stress-free journey.
          </p>
          <p>
            Additionally, electricity rates can vary widely depending on your location and time of day. Some charging stations may charge premium rates, so it's beneficial to research charging options along your route. This tool provides a professional and practical approach to estimating your EV trip costs and charging needs, empowering you to make informed decisions for your electric journeys.
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
            <strong>1. Mixing units:</strong> Entering trip distance and efficiency in different units (e.g., miles and Wh/km) leads to incorrect calculations. Always ensure both inputs use the same unit system.
          </p>
          <p>
            <strong>2. Ignoring real-world factors:</strong> The calculator assumes average efficiency and charging speeds. Factors like weather, terrain, and driving style can significantly affect energy consumption and charging time.
          </p>
          <p>
            <strong>3. Overestimating battery usage:</strong> Planning to fully deplete your battery before charging is not recommended. It's safer to plan for partial charges to preserve battery health and avoid range anxiety.
          </p>
          <p>
            <strong>4. Using outdated electricity rates:</strong> Electricity prices fluctuate. Use your most recent rates for accurate cost estimates.
          </p>
          <p>
            <strong>5. Not accounting for charging station availability:</strong> The number of stops estimated assumes ideal charging infrastructure. In reality, availability and charger types may vary, affecting your trip plan.
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
      title="EV Trip Cost & Charging Planner"
      description="Professional automotive calculator: EV Trip Cost & Charging Planner. Get accurate estimates, expert advice, and financial insights."
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