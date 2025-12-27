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

export default function AnnualEvHybridCostCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    dist: "", // Annual distance driven (miles or km)
    mpg: "",  // Fuel efficiency (MPG or L/100km)
    price: "", // Fuel or electricity price per gallon/kWh or liter
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const dist = parseFloat(inputs.dist);
    const mpg = parseFloat(inputs.mpg);
    const price = parseFloat(inputs.price);
    const unit = inputs.unit;

    if (isNaN(dist) || dist <= 0 || isNaN(mpg) || mpg <= 0 || isNaN(price) || price <= 0) {
      return {
        primary: "—",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Awaiting valid input"
      };
    }

    // Conversion for metric units:
    // If metric: dist in km, mpg is L/100km, price in $/L
    // Cost = (dist * (mpg / 100)) * price
    // If imperial: dist in miles, mpg in miles/gallon, price in $/gallon
    // Cost = (dist / mpg) * price

    let annualCost = 0;
    if (unit === "imperial") {
      annualCost = (dist / mpg) * price;
    } else {
      // metric
      annualCost = (dist * (mpg / 100)) * price;
    }

    const formattedCost = annualCost.toLocaleString(undefined, { style: "currency", currency: "USD" });

    return {
      primary: formattedCost,
      secondary: formattedCost,
      details: `Annual distance: ${dist.toLocaleString()} ${unit === "imperial" ? "miles" : "km"}, Efficiency: ${mpg} ${unit === "imperial" ? "MPG" : "L/100km"}, Price: $${price.toFixed(2)} per ${unit === "imperial" ? "gallon/kWh" : "liter/kWh"}`,
      feedback: "Estimated annual fuel/electricity cost"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does this calculator compare EV and hybrid annual costs?",
      answer:
        "This calculator estimates the annual fuel or electricity cost based on your driving distance, vehicle efficiency, and fuel or electricity price. For EVs, efficiency is often expressed in kWh per distance, while hybrids use MPG or L/100km. By inputting these values, you can compare the yearly energy costs of an electric vehicle versus a hybrid, helping you make an informed financial decision."
    },
    {
      question: "Why is it important to consider both distance and efficiency?",
      answer:
        "Annual driving distance and vehicle efficiency directly impact your total energy consumption and cost. A highly efficient vehicle driven extensively may still incur significant costs, while a less efficient vehicle driven minimally might cost less. This calculator combines these factors to provide a realistic estimate of your yearly fuel or electricity expenses."
    },
    {
      question: "Can I use this calculator for both US and metric units?",
      answer:
        "Yes, the calculator supports both imperial (miles, MPG, gallons) and metric (kilometers, L/100km, liters) units. Simply select your preferred unit system, and input the corresponding values. The calculator will handle the calculations accordingly to provide accurate annual cost estimates."
    },
    {
      question: "How accurate are the cost estimates?",
      answer:
        "The estimates are based on the inputs you provide and standard calculation formulas. Real-world factors such as driving habits, terrain, weather, and vehicle maintenance can affect actual costs. Use this calculator as a guideline rather than an exact prediction."
    },
    {
      question: "What is the difference between fuel price and electricity price inputs?",
      answer:
        "Fuel price refers to the cost per gallon or liter of gasoline or diesel, while electricity price is the cost per kWh for charging an EV. Ensure you input the correct price for the energy type your vehicle uses to get an accurate annual cost estimate."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $35,000 hybrid SUV with an average annual driving distance of 12,000 miles, fuel efficiency of 35 MPG, and gasoline price of $4.00 per gallon.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Calculate the annual gallons of fuel used: 12,000 miles ÷ 35 MPG = 342.86 gallons."
      },
      {
        label: "Step 2",
        explanation:
          "Calculate the annual fuel cost: 342.86 gallons × $4.00/gallon = $1,371.43."
      }
    ],
    result: "Final Result: The estimated annual fuel cost for the hybrid SUV is $1,371.43."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and fuel economy data.",
      url: "https://www.fueleconomy.gov/"
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing resource.",
      url: "https://www.kbb.com/"
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, pricing, and advice.",
      url: "https://www.edmunds.com/"
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>
            Annual Distance Driven ({inputs.unit === "imperial" ? "miles" : "km"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.dist}
            onChange={(e) => handleInputChange("dist", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 12000" : "e.g. 20000"}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Fuel Efficiency ({inputs.unit === "imperial" ? "MPG" : "L/100km"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.mpg}
            onChange={(e) => handleInputChange("mpg", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 35" : "e.g. 6.7"}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Fuel/Electricity Price ({inputs.unit === "imperial" ? "$/gallon or $/kWh" : "$/liter or $/kWh"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 4.00" : "e.g. 1.06"}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Fuel className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Estimated Annual Fuel/Electricity Cost
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
            <strong>Step 1:</strong> Select your preferred unit system — Imperial (miles, MPG, gallons) or Metric (kilometers, L/100km, liters).
          </li>
          <li>
            <strong>Step 2:</strong> Enter your estimated annual driving distance in miles or kilometers.
          </li>
          <li>
            <strong>Step 3:</strong> Input your vehicle's fuel efficiency (MPG for Imperial, L/100km for Metric). For EVs, use electricity consumption equivalent.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the current price of fuel or electricity per gallon/liter or per kWh.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to see your estimated annual fuel or electricity cost.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Annual Fuel/Electricity Cost: EV vs Hybrid
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding the annual fuel or electricity cost of your vehicle is crucial for budgeting and making informed decisions between electric vehicles (EVs) and hybrids. This calculator helps you estimate these costs based on your driving habits and local energy prices. For traditional hybrids, fuel efficiency is typically measured in miles per gallon (MPG) or liters per 100 kilometers (L/100km), while EVs use electricity consumption measured in kilowatt-hours (kWh) per distance. By entering your annual driving distance, vehicle efficiency, and the price of fuel or electricity, you receive an estimate of your yearly energy expenses.
          </p>
          <p>
            The calculation differs slightly depending on the unit system you choose. In the imperial system, the formula divides the annual distance by the vehicle's MPG to find gallons consumed, then multiplies by the fuel price. In the metric system, it multiplies the distance by the fuel consumption rate (L/100km) divided by 100, then multiplies by the fuel price per liter. For EVs, the same principles apply, but the efficiency input corresponds to kWh per mile or km, and the price is per kWh. This tool is invaluable for comparing the cost-effectiveness of EVs versus hybrids, helping you understand potential savings or expenses over a year.
          </p>
          <p>
            Keep in mind that real-world factors such as driving style, terrain, climate, and vehicle maintenance can affect actual consumption and costs. This calculator provides a reliable estimate based on your inputs, serving as a guide to help you plan your vehicle expenses more accurately.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Mixing Units:</strong> Entering distance, efficiency, or price in different unit systems (e.g., miles with L/100km) can lead to incorrect results. Always ensure all inputs correspond to the selected unit system.
          </p>
          <p>
            <strong>2. Using Average Prices:</strong> Fuel and electricity prices fluctuate by location and time. Using outdated or generalized prices may not reflect your actual costs.
          </p>
          <p>
            <strong>3. Ignoring Real-World Factors:</strong> This calculator assumes consistent driving conditions. Variations in terrain, traffic, and weather can impact fuel or electricity consumption.
          </p>
          <p>
            <strong>4. Confusing Efficiency Metrics:</strong> For EVs, efficiency is often in kWh per mile or km, not MPG. Ensure you use the correct efficiency figure for your vehicle type.
          </p>
          <p>
            <strong>5. Not Updating Inputs Regularly:</strong> Changes in driving habits or energy prices should be updated to keep estimates accurate.
          </p>
        </div>
      </section>

      {/* 4. FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
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
          <BookOpen className="w-5 h-5 text-blue-500" />
          References & additional resources
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
      title="Annual Fuel/Electricity Cost: EV vs Hybrid"
      description="Professional automotive calculator: Annual Fuel/Electricity Cost: EV vs Hybrid. Get accurate estimates, expert advice, and financial insights."
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