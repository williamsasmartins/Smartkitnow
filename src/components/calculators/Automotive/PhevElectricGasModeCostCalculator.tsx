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

export default function PhevElectricGasModeCostCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // Battery capacity in kWh
    electricityRate: "", // Electricity rate in $/kWh
    electricRange: "", // Electric range in miles or km
    gasPrice: "", // Gasoline price in $/gallon or $/liter
    gasEfficiency: "" // Gas mode fuel efficiency in MPG or km/l
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const batteryCapacity = parseFloat(inputs.batteryCapacity);
    const electricityRate = parseFloat(inputs.electricityRate);
    const electricRange = parseFloat(inputs.electricRange);
    const gasPrice = parseFloat(inputs.gasPrice);
    const gasEfficiency = parseFloat(inputs.gasEfficiency);

    if (
      isNaN(batteryCapacity) || batteryCapacity <= 0 ||
      isNaN(electricityRate) || electricityRate <= 0 ||
      isNaN(electricRange) || electricRange <= 0 ||
      isNaN(gasPrice) || gasPrice <= 0 ||
      isNaN(gasEfficiency) || gasEfficiency <= 0
    ) {
      return {
        primary: "—",
        secondary: "Please enter valid positive numbers for all inputs.",
        details: "",
        feedback: ""
      };
    }

    // Calculate electric mode cost per mile (or km)
    // Energy consumption (kWh per mile) = batteryCapacity / electricRange
    const energyPerDistance = batteryCapacity / electricRange; // kWh per mile or km
    const costPerDistanceElectric = energyPerDistance * electricityRate; // $ per mile or km

    // Calculate gas mode cost per mile (or km)
    // Fuel consumption (gallons or liters per mile) = 1 / gasEfficiency
    const fuelPerDistance = 1 / gasEfficiency; // gallons or liters per mile or km
    const costPerDistanceGas = fuelPerDistance * gasPrice; // $ per mile or km

    // Feedback on cost difference
    let feedback = "";
    if (costPerDistanceElectric < costPerDistanceGas) {
      feedback = "Electric mode is cheaper per distance.";
    } else if (costPerDistanceElectric > costPerDistanceGas) {
      feedback = "Gas mode is cheaper per distance.";
    } else {
      feedback = "Costs are approximately equal per distance.";
    }

    // Format results
    const unitLabel = inputs.unit === "imperial" ? "mile" : "km";

    return {
      primary: `${costPerDistanceElectric.toFixed(3)} $/${unitLabel}`,
      secondary: `${costPerDistanceGas.toFixed(3)} $/${unitLabel} (Gas Mode)`,
      details: `Electric mode cost per ${unitLabel}: $${costPerDistanceElectric.toFixed(3)}; Gas mode cost per ${unitLabel}: $${costPerDistanceGas.toFixed(3)}`,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does this calculator determine the cost difference between electric and gas modes in a PHEV?",
      answer:
        "This calculator estimates the cost per mile (or kilometer) for both electric and gas modes by using your PHEV's battery capacity, electric range, electricity rate, gas price, and fuel efficiency. It calculates the energy consumption per distance for electric mode and fuel consumption per distance for gas mode, then multiplies by their respective costs. This provides a direct comparison of operating costs per distance traveled in each mode."
    },
    {
      question: "Why do I need to input both battery capacity and electric range?",
      answer:
        "Battery capacity alone doesn't tell you how far the vehicle can travel on electric power. The electric range indicates how many miles or kilometers the battery can power the vehicle before switching to gas mode. By dividing battery capacity by electric range, the calculator estimates the energy consumption per distance, which is essential for calculating electricity cost per mile or kilometer."
    },
    {
      question: "Can I use this calculator for both imperial and metric units?",
      answer:
        "Yes, the calculator supports both imperial (miles, gallons) and metric (kilometers, liters) units. Make sure to input all values consistently in the selected unit system to get accurate results. For example, if you choose imperial units, enter electric range in miles and fuel efficiency in miles per gallon."
    },
    {
      question: "What factors can affect the accuracy of this cost comparison?",
      answer:
        "Several factors can influence accuracy, including driving habits, terrain, temperature, and vehicle condition, which affect energy and fuel consumption. Electricity rates and gas prices can also vary by location and time. This calculator provides estimates based on average values you input, so real-world costs may differ."
    },
    {
      question: "How can I use the results to save money on my PHEV?",
      answer:
        "By comparing the cost per mile or kilometer for electric and gas modes, you can identify which mode is more economical for your driving conditions. If electric mode is cheaper, maximizing electric driving can reduce fuel expenses. Conversely, if gas mode is cheaper due to high electricity rates or low gas prices, you might adjust your charging habits or consider other cost-saving strategies."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a 2023 PHEV sedan with a 12 kWh battery, an electric range of 40 miles, electricity rate of $0.13 per kWh, gas price of $3.50 per gallon, and gas mode fuel efficiency of 40 MPG.",
    steps: [
      {
        label: "Step 1: Calculate energy consumption per mile in electric mode",
        explanation: "Energy per mile = Battery capacity / Electric range = 12 kWh / 40 miles = 0.3 kWh/mile"
      },
      {
        label: "Step 2: Calculate electric mode cost per mile",
        explanation: "Electric cost per mile = Energy per mile × Electricity rate = 0.3 kWh/mile × $0.13/kWh = $0.039/mile"
      },
      {
        label: "Step 3: Calculate fuel consumption per mile in gas mode",
        explanation: "Fuel per mile = 1 / Fuel efficiency = 1 / 40 MPG = 0.025 gallons/mile"
      },
      {
        label: "Step 4: Calculate gas mode cost per mile",
        explanation: "Gas cost per mile = Fuel per mile × Gas price = 0.025 gallons/mile × $3.50/gallon = $0.0875/mile"
      },
      {
        label: "Step 5: Compare costs",
        explanation: "Electric mode costs $0.039/mile, gas mode costs $0.0875/mile. Electric mode is cheaper by $0.0485/mile."
      }
    ],
    result: "Final Result: Driving in electric mode costs approximately 44% less per mile than gas mode under these conditions."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and fuel economy data for vehicles."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing resource with detailed vehicle specs."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, pricing, and automotive advice."
    },
    {
      title: "U.S. Energy Information Administration (EIA)",
      description: "Data on electricity rates and fuel prices across the United States."
    },
    {
      title: "Alternative Fuels Data Center (AFDC)",
      description: "Information on electric vehicle efficiency and alternative fuel costs."
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
            placeholder="e.g. 12"
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.001"
            placeholder="e.g. 0.13"
            value={inputs.electricityRate}
            onChange={(e) => handleInputChange("electricityRate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Electric Range ({inputs.unit === "imperial" ? "miles" : "km"})</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder={inputs.unit === "imperial" ? "e.g. 40" : "e.g. 64"}
            value={inputs.electricRange}
            onChange={(e) => handleInputChange("electricRange", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Gas Price (${inputs.unit === "imperial" ? "/gallon" : "/liter"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder={inputs.unit === "imperial" ? "e.g. 3.50" : "e.g. 0.92"}
            value={inputs.gasPrice}
            onChange={(e) => handleInputChange("gasPrice", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Gas Mode Fuel Efficiency ({inputs.unit === "imperial" ? "MPG" : "km/l"})</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder={inputs.unit === "imperial" ? "e.g. 40" : "e.g. 17"}
            value={inputs.gasEfficiency}
            onChange={(e) => handleInputChange("gasEfficiency", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Cost per Distance</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 font-semibold text-blue-700">{results.feedback}</p>
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
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) from the dropdown at the top right.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your PHEV's battery capacity in kilowatt-hours (kWh).
          </li>
          <li>
            <strong>Step 3:</strong> Input the electricity rate you pay per kWh (e.g., from your utility bill).
          </li>
          <li>
            <strong>Step 4:</strong> Enter the electric-only driving range of your vehicle in miles or kilometers.
          </li>
          <li>
            <strong>Step 5:</strong> Provide the current gas price per gallon or liter.
          </li>
          <li>
            <strong>Step 6:</strong> Enter your vehicle's fuel efficiency in gas mode (MPG or km/l).
          </li>
          <li>
            <strong>Step 7:</strong> Click the "Calculate" button to see the estimated cost per mile or kilometer for both electric and gas modes.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to PHEV Electric vs Gas Mode Cost Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Plug-in Hybrid Electric Vehicles (PHEVs) offer the flexibility of driving on electric power for short distances and switching to gasoline for longer trips. Understanding the cost implications of each mode is essential for optimizing your driving habits and saving money. This calculator helps you compare the operating costs of electric and gas modes by considering your vehicle's battery capacity, electric range, electricity rates, gas prices, and fuel efficiency.
          </p>
          <p>
            The core concept is to estimate how much it costs to drive one mile or kilometer in each mode. For electric mode, the calculator divides the battery capacity by the electric range to find the energy consumption per distance, then multiplies by your electricity rate to find the cost per distance. For gas mode, it calculates fuel consumption per distance by taking the reciprocal of your fuel efficiency, then multiplies by the gas price.
          </p>
          <p>
            This approach provides a straightforward comparison of costs, helping you decide when to prioritize electric driving or when gas mode might be more economical. Keep in mind that real-world factors such as driving style, terrain, temperature, and vehicle maintenance can affect actual costs. Regularly updating your inputs with current electricity and gas prices will ensure the calculator remains accurate and useful.
          </p>
          <p>
            By leveraging this tool, you can make informed decisions to maximize your PHEV’s efficiency, reduce your carbon footprint, and save money on fuel and electricity expenses.
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
            <strong>1. Mixing units:</strong> Ensure all inputs are consistent with the selected unit system. For example, if you choose imperial units, enter electric range in miles and fuel efficiency in miles per gallon. Mixing kilometers with miles or liters with gallons will produce inaccurate results.
          </p>
          <p>
            <strong>2. Using outdated or estimated rates:</strong> Electricity rates and gas prices fluctuate frequently. Using outdated values can mislead your cost comparison. Always use current rates from your utility bill and local gas stations.
          </p>
          <p>
            <strong>3. Ignoring driving conditions:</strong> Real-world energy and fuel consumption vary with driving habits, terrain, and weather. This calculator provides estimates based on average values and may not reflect your exact costs.
          </p>
          <p>
            <strong>4. Overlooking battery degradation:</strong> Over time, battery capacity and electric range may decrease, affecting electric mode efficiency. Update your inputs accordingly to maintain accuracy.
          </p>
          <p>
            <strong>5. Not considering charging efficiency:</strong> Some energy is lost during charging and discharging the battery. This calculator assumes ideal conditions and does not account for these losses, which can slightly increase electric mode costs.
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
      title="PHEV Electric vs Gas Mode Cost Calculator"
      description="Professional automotive calculator: PHEV Electric vs Gas Mode Cost Calculator. Get accurate estimates, expert advice, and financial insights."
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