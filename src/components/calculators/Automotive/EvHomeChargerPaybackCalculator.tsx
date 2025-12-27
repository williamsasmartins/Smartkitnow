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

export default function EvHomeChargerPaybackCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    dailyMiles: "", // Average daily miles driven
    electricityRate: "", // Cost per kWh in $
    chargerCost: "", // Total home charger installation cost in $
    evEfficiency: "", // EV efficiency in miles per kWh
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const dailyMiles = parseFloat(inputs.dailyMiles);
    const electricityRate = parseFloat(inputs.electricityRate);
    const chargerCost = parseFloat(inputs.chargerCost);
    const evEfficiency = parseFloat(inputs.evEfficiency);

    if (
      isNaN(dailyMiles) || dailyMiles <= 0 ||
      isNaN(electricityRate) || electricityRate <= 0 ||
      isNaN(chargerCost) || chargerCost < 0 ||
      isNaN(evEfficiency) || evEfficiency <= 0
    ) {
      return {
        primary: "—",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Invalid input"
      };
    }

    // Calculate daily energy consumption (kWh)
    const dailyKWh = dailyMiles / evEfficiency;

    // Calculate daily charging cost
    const dailyCost = dailyKWh * electricityRate;

    // Calculate annual charging cost
    const annualCost = dailyCost * 365;

    // Assume average gasoline cost per mile for comparison (e.g., $0.12/mile)
    // This is a rough average for a gasoline vehicle (fuel + maintenance)
    const gasCostPerMile = 0.12;

    // Annual gasoline cost for same miles
    const annualGasCost = dailyMiles * 365 * gasCostPerMile;

    // Annual savings by using EV charger at home
    const annualSavings = annualGasCost - annualCost;

    // Payback period in years
    const paybackYears = annualSavings > 0 ? (chargerCost / annualSavings) : Infinity;

    return {
      primary: paybackYears === Infinity ? "N/A" : paybackYears.toFixed(1) + " years",
      secondary: `$${annualSavings.toFixed(2)} saved per year`,
      details: `Annual EV charging cost: $${annualCost.toFixed(2)} vs Gasoline cost: $${annualGasCost.toFixed(2)}. Charger cost: $${chargerCost.toFixed(2)}.`,
      feedback: annualSavings > 0 ? "Good investment" : "No savings with current inputs"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does this calculator estimate the payback period for a home EV charger installation?",
      answer:
        "This calculator estimates the payback period by comparing the annual savings on fuel costs when using an electric vehicle charged at home versus a gasoline vehicle. It factors in your average daily driving distance, your EV's efficiency (miles per kWh), the local electricity rate, and the total installation cost of the home charger. By calculating the difference in annual fuel costs, it determines how many years it will take to recover your installation investment through savings."
    },
    {
      question: "Why do I need to input my EV's efficiency in miles per kWh?",
      answer:
        "Your EV's efficiency, measured in miles per kilowatt-hour (kWh), indicates how far your vehicle can travel on one unit of electricity. This value is crucial for estimating how much electricity you will consume daily based on your driving habits. Accurate efficiency data ensures the calculator can precisely estimate your charging costs and potential savings."
    },
    {
      question: "What factors can affect the actual payback period beyond this calculator's estimate?",
      answer:
        "Several factors can influence the real payback period, including fluctuations in electricity and gasoline prices, changes in your driving habits, variations in charger installation costs due to home electrical infrastructure, and potential incentives or rebates. Additionally, maintenance costs and vehicle depreciation are not included but can impact overall savings."
    },
    {
      question: "Can this calculator be used for both Level 1 and Level 2 home chargers?",
      answer:
        "Yes, this calculator focuses on the financial aspects of home charger installation and payback, regardless of charger level. However, installation costs can vary significantly between Level 1 (standard outlet) and Level 2 (dedicated 240V circuit) chargers, so be sure to input the correct installation cost for your specific charger type."
    },
    {
      question: "How accurate is the estimated annual savings on fuel costs?",
      answer:
        "The estimated annual savings are based on average gasoline cost per mile and your input values for electricity rate and EV efficiency. While it provides a good baseline, actual savings may vary due to driving conditions, vehicle maintenance, regional fuel prices, and charging habits. It's recommended to use this calculator as a guide rather than an exact prediction."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $1,500 Level 2 home charger installation for an EV owner who drives 30 miles daily, with an electricity rate of $0.13 per kWh and an EV efficiency of 3.5 miles per kWh.",
    steps: [
      {
        label: "Step 1: Calculate daily energy consumption",
        explanation: "30 miles ÷ 3.5 miles/kWh = 8.57 kWh per day"
      },
      {
        label: "Step 2: Calculate daily charging cost",
        explanation: "8.57 kWh × $0.13/kWh = $1.11 per day"
      },
      {
        label: "Step 3: Calculate annual charging cost",
        explanation: "$1.11 × 365 days = $405.15 per year"
      },
      {
        label: "Step 4: Calculate annual gasoline cost for same miles",
        explanation: "30 miles × 365 days × $0.12/mile = $1,314 per year"
      },
      {
        label: "Step 5: Calculate annual savings",
        explanation: "$1,314 - $405.15 = $908.85 saved per year"
      },
      {
        label: "Step 6: Calculate payback period",
        explanation: "$1,500 ÷ $908.85 ≈ 1.65 years to recoup installation cost"
      }
    ],
    result: "Final Result: The home charger installation will pay for itself in approximately 1.7 years through fuel savings."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for vehicle efficiency ratings and fuel economy data.",
      url: "https://www.fueleconomy.gov/"
    },
    {
      title: "U.S. Energy Information Administration (EIA)",
      description: "Provides current electricity rates and energy consumption statistics.",
      url: "https://www.eia.gov/"
    },
    {
      title: "Department of Energy - Electric Vehicle Charging",
      description: "Comprehensive information on EV charging types, costs, and installation.",
      url: "https://afdc.energy.gov/fuels/electricity_infrastructure.html"
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
          <Label>Average Daily Miles Driven</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 30"
            value={inputs.dailyMiles}
            onChange={(e) => handleInputChange("dailyMiles", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($ per kWh)</Label>
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
          <Label>Home Charger Installation Cost ($)</Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 1500"
            value={inputs.chargerCost}
            onChange={(e) => handleInputChange("chargerCost", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>EV Efficiency (miles per kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 3.5"
            value={inputs.evEfficiency}
            onChange={(e) => handleInputChange("evEfficiency", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Payback Period</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-1 text-sm font-medium text-green-700 dark:text-green-400">{results.feedback}</p>
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
            <strong>Step 1:</strong> Enter your average daily miles driven in your electric vehicle. This helps estimate your daily energy consumption.
          </li>
          <li>
            <strong>Step 2:</strong> Input your local electricity rate in dollars per kilowatt-hour (kWh). This is the cost you pay for electricity from your utility.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the total cost of installing your home EV charger, including equipment and labor.
          </li>
          <li>
            <strong>Step 4:</strong> Enter your EV's efficiency in miles per kWh, which indicates how far your vehicle travels per unit of electricity.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to see your estimated payback period and annual savings from charging at home compared to gasoline costs.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Home Charger Installation Cost & Payback Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Installing a home electric vehicle (EV) charger is a popular choice for EV owners seeking convenience and cost savings. However, the upfront installation cost can vary widely depending on your home's electrical infrastructure, charger type, and labor costs. This calculator helps you understand how long it will take to recover that investment through savings on fuel costs by charging your EV at home instead of relying on gasoline.
          </p>
          <p>
            To estimate your payback period, the calculator uses your average daily driving distance and your EV's efficiency to determine how much electricity you consume daily. It then multiplies this by your local electricity rate to find your daily charging cost. By comparing this to the estimated cost of driving a gasoline vehicle the same distance, it calculates your annual savings. Dividing your charger installation cost by these savings gives you the payback period in years.
          </p>
          <p>
            Keep in mind that this is an estimate and actual savings can vary based on fluctuating fuel and electricity prices, driving habits, and potential incentives or rebates for EV charger installations. Understanding these factors can help you make an informed decision about investing in a home charger and managing your EV ownership costs effectively.
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
            <strong>1. Underestimating installation costs:</strong> Many users forget to include all expenses such as electrical upgrades, permits, or labor, leading to an underestimated payback period.
          </p>
          <p>
            <strong>2. Using inaccurate EV efficiency values:</strong> Inputting generic or outdated efficiency numbers can skew results. Always use your specific vehicle’s efficiency for best accuracy.
          </p>
          <p>
            <strong>3. Ignoring electricity rate variations:</strong> Electricity prices can vary by time of day or season. Using an average rate might not reflect your actual charging costs.
          </p>
          <p>
            <strong>4. Overlooking gasoline cost assumptions:</strong> The calculator uses a standard gasoline cost per mile, which may differ from your actual fuel expenses depending on vehicle type and fuel prices.
          </p>
          <p>
            <strong>5. Not considering incentives or rebates:</strong> Many regions offer financial incentives for EV charger installations that can significantly reduce your upfront costs and improve payback.
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
      title="Home Charger Installation Cost & Payback Calculator"
      description="Professional automotive calculator: Home Charger Installation Cost & Payback Calculator. Get accurate estimates, expert advice, and financial insights."
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