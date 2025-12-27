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
      question: "What factors affect the cost per mile of an electric vehicle?",
      answer:
        "The cost per mile of an electric vehicle (EV) primarily depends on the electricity rate you pay per kilowatt-hour (kWh) and the vehicle's efficiency, measured in miles per kWh. Other factors include driving habits, terrain, temperature, and battery health, which can influence energy consumption. Additionally, charging infrastructure and time-of-use electricity rates can impact overall costs. Understanding these variables helps you estimate your true cost per mile accurately."
    },
    {
      question: "How do I find my EV's efficiency in miles per kWh?",
      answer:
        "You can find your EV's efficiency in miles per kWh from the vehicle's official specifications or user manual. Many EVs also display this information on their dashboard or companion apps. Alternatively, you can calculate it by dividing the miles driven by the kWh consumed during that trip. Efficiency varies based on driving conditions, so using an average value provides a good estimate for cost calculations."
    },
    {
      question: "Why is electricity rate important in calculating EV cost per mile?",
      answer:
        "Electricity rate, usually expressed in dollars per kilowatt-hour ($/kWh), directly impacts how much you pay to charge your EV. Different regions and utility providers have varying rates, and some offer time-of-use pricing that can lower costs during off-peak hours. Knowing your electricity rate allows you to accurately estimate the cost of energy consumed per mile, making it a crucial input for this calculator."
    },
    {
      question: "Can I use this calculator for different units like metric or imperial?",
      answer:
        "Yes, this calculator supports both imperial and metric units. The key inputs are battery capacity in kilowatt-hours (kWh), electricity rate in dollars per kWh, and vehicle efficiency in miles per kWh (imperial) or kilometers per kWh (metric). Make sure to input efficiency consistent with your chosen unit system to get accurate cost per mile or cost per kilometer results."
    },
    {
      question: "Does this calculator include charging time or other costs?",
      answer:
        "This calculator focuses on estimating the direct electricity cost per mile based on your inputs. It does not include charging time, infrastructure costs, maintenance, or other expenses associated with EV ownership. For a comprehensive cost analysis, consider additional factors such as charger installation, battery degradation, and incentives or rebates available in your area."
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
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Enter your EV's battery capacity in kilowatt-hours (kWh). This is usually found in your vehicle's specifications.
          </li>
          <li>
            <strong>Step 2:</strong> Input the electricity rate you pay per kWh, which you can find on your utility bill or from your electricity provider.
          </li>
          <li>
            <strong>Step 3:</strong> Enter your vehicle's efficiency in miles per kWh (or kilometers per kWh if using metric). This indicates how far your EV can travel on one kWh of energy.
          </li>
          <li>
            <strong>Step 4:</strong> Select your preferred unit system (Imperial or Metric) to ensure the efficiency input matches the unit.
          </li>
          <li>
            <strong>Step 5:</strong> Click the "Calculate" button to see your estimated cost per mile or kilometer.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV Cost Per Mile Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding the cost per mile of driving an electric vehicle (EV) is essential for budgeting and comparing it to traditional gasoline vehicles. This calculator helps you estimate the direct electricity cost based on three key inputs: battery capacity, electricity rate, and vehicle efficiency. Battery capacity, measured in kilowatt-hours (kWh), represents the total energy storage of your EV's battery. The electricity rate is the price you pay per kWh from your utility provider, which can vary widely depending on your location and time of use.
          </p>
          <p>
            Vehicle efficiency, expressed as miles per kWh (or kilometers per kWh), indicates how far your EV can travel on one unit of electrical energy. This efficiency depends on factors such as driving style, terrain, weather conditions, and vehicle model. By dividing the electricity rate by the efficiency, the calculator determines the cost to drive one mile or kilometer. This straightforward calculation provides a practical estimate of your EV's operating cost, helping you make informed decisions about your transportation expenses.
          </p>
          <p>
            While this calculator focuses on electricity costs, keep in mind that total ownership costs include other factors such as maintenance, insurance, and depreciation. Additionally, charging infrastructure and time-of-use rates can influence your actual expenses. Using this tool regularly with updated inputs can help you track changes in your EV's cost efficiency over time and optimize your charging habits to save money.
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
            <strong>1. Mixing Units:</strong> Entering efficiency in miles per kWh while the calculator is set to metric units (kilometers per kWh) or vice versa can lead to inaccurate results. Always ensure your inputs match the selected unit system.
          </p>
          <p>
            <strong>2. Using Average Electricity Rates:</strong> Electricity rates vary by time and location. Using a generic average rate may not reflect your actual costs, especially if you have time-of-use pricing or solar panels.
          </p>
          <p>
            <strong>3. Ignoring Real-World Efficiency Variations:</strong> Vehicle efficiency can fluctuate due to driving habits, weather, and terrain. Using a single efficiency value might oversimplify your cost estimates.
          </p>
          <p>
            <strong>4. Forgetting to Update Inputs:</strong> Battery degradation or changes in electricity rates over time can affect your cost per mile. Regularly update your inputs for the most accurate calculations.
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