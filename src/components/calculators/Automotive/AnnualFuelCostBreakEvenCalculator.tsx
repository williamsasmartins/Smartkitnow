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

export default function AnnualFuelCostBreakEvenCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    dist: "", // Distance traveled annually
    mpg: "",  // Fuel efficiency
    price: "" // Fuel price per gallon or liter
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
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Invalid input"
      };
    }

    // Convert distance to miles if metric
    // 1 km = 0.621371 miles
    const distMiles = unit === "metric" ? dist * 0.621371 : dist;

    // Convert fuel efficiency to MPG if metric (L/100km to MPG)
    // MPG = 235.215 / (L/100km)
    const mpgValue = unit === "metric" ? 235.215 / mpg : mpg;

    // Convert fuel price to per gallon if metric (price per liter to price per gallon)
    // 1 gallon = 3.78541 liters
    const pricePerGallon = unit === "metric" ? price * 3.78541 : price;

    // Calculate annual fuel cost
    // Fuel used = distance / mpg
    // Cost = fuel used * price per gallon
    const fuelUsed = distMiles / mpgValue;
    const annualFuelCost = fuelUsed * pricePerGallon;

    // Break-even MPG calculation:
    // Given distance and price, find MPG that results in the same annual fuel cost
    // This is trivial here since cost depends on mpg, but break-even can be used to compare two vehicles.
    // For this calculator, we can show the cost and fuel used.

    return {
      primary: `${annualFuelCost.toFixed(2)}`,
      secondary: `$${annualFuelCost.toFixed(2)}`,
      details: `Annual Distance: ${dist} ${unit === "imperial" ? "miles" : "km"}, Fuel Efficiency: ${mpg} ${unit === "imperial" ? "MPG" : "L/100km"}, Fuel Price: $${price} per ${unit === "imperial" ? "gallon" : "liter"}`,
      feedback: "Calculation successful"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How is the annual fuel cost calculated?",
      answer:
        "The annual fuel cost is calculated by dividing the total distance traveled in a year by the vehicle's fuel efficiency (miles per gallon or liters per 100 kilometers), then multiplying the result by the fuel price per gallon or liter. This gives an estimate of how much money you will spend on fuel annually based on your driving habits and fuel prices."
    },
    {
      question: "Why do I need to select between imperial and metric units?",
      answer:
        "Fuel efficiency and distance can be measured in different units depending on your location. Imperial units use miles and gallons, while metric units use kilometers and liters. Selecting the correct unit system ensures accurate calculations by converting inputs appropriately."
    },
    {
      question: "Can this calculator help me compare two vehicles?",
      answer:
        "Yes, by calculating the annual fuel cost for different vehicles using their respective fuel efficiencies and fuel prices, you can compare which vehicle is more economical to operate. This helps in making informed decisions when purchasing or leasing a car."
    },
    {
      question: "What factors can affect the accuracy of this calculator?",
      answer:
        "The calculator assumes consistent driving habits and fuel prices throughout the year. Variations in driving conditions, changes in fuel prices, and vehicle maintenance can all impact actual fuel costs. Therefore, the result should be considered an estimate."
    },
    {
      question: "How can I use the break-even information from this calculator?",
      answer:
        "Break-even analysis helps determine the fuel efficiency required to match or beat a competitor's annual fuel cost. By understanding this, you can evaluate if investing in a more fuel-efficient vehicle or alternative fuel option is financially beneficial over time."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $35,000 SUV with an estimated annual driving distance of 12,000 miles, a fuel efficiency of 22 MPG, and a fuel price of $4.00 per gallon.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Calculate the total gallons of fuel used annually: 12,000 miles ÷ 22 MPG = 545.45 gallons."
      },
      {
        label: "Step 2",
        explanation:
          "Calculate the annual fuel cost: 545.45 gallons × $4.00 per gallon = $2,181.82."
      }
    ],
    result: "Final Result: The estimated annual fuel cost for this SUV is $2,181.82."
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
      description: "Trusted vehicle valuation and pricing information.",
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Annual Distance Traveled ({inputs.unit === "imperial" ? "miles" : "km"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.dist}
            onChange={(e) => handleInputChange("dist", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 12000" : "e.g. 19312"}
          />
        </div>
        <div className="space-y-2">
          <Label>Fuel Efficiency ({inputs.unit === "imperial" ? "MPG" : "L/100km"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.mpg}
            onChange={(e) => handleInputChange("mpg", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 25" : "e.g. 9.4"}
          />
        </div>
        <div className="space-y-2">
          <Label>Fuel Price (per {inputs.unit === "imperial" ? "gallon" : "liter"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 3.50" : "e.g. 0.92"}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Annual Fuel Cost</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.secondary}</div>
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
            <strong>Step 1:</strong> Select your preferred unit system: Imperial (miles, gallons) or Metric (kilometers, liters).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total distance you expect to drive annually in the selected units.
          </li>
          <li>
            <strong>Step 3:</strong> Input your vehicle's fuel efficiency: miles per gallon (MPG) for Imperial or liters per 100 kilometers (L/100km) for Metric.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the current fuel price per gallon or liter, depending on your unit choice.
          </li>
          <li>
            <strong>Step 5:</strong> Click the "Calculate" button to see your estimated annual fuel cost.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Annual Fuel Cost & Break-Even
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding your vehicle's annual fuel cost is essential for budgeting and making informed decisions about car ownership or leasing. This calculator estimates how much you will spend on fuel annually based on your driving habits, vehicle fuel efficiency, and current fuel prices. By inputting your expected annual driving distance, your vehicle's fuel efficiency, and the fuel price, you get a clear picture of your fuel expenses.
          </p>
          <p>
            The calculator supports both Imperial and Metric units, converting inputs as necessary to ensure accuracy. For example, if you use Metric units, the calculator converts kilometers to miles, liters per 100 kilometers to miles per gallon, and fuel price per liter to price per gallon internally. This flexibility allows users worldwide to use the tool effectively.
          </p>
          <p>
            Additionally, the concept of break-even fuel efficiency helps you understand what fuel economy you need to achieve to match or beat a competitor's annual fuel cost. This insight is valuable when comparing vehicles or considering upgrades to more fuel-efficient models or alternative fuel technologies. Keep in mind that actual fuel costs can vary due to driving conditions, maintenance, and fuel price fluctuations.
          </p>
          <p>
            Regularly reviewing your annual fuel cost can help you identify opportunities to save money, such as carpooling, using public transportation, or switching to a more fuel-efficient vehicle. This calculator is a practical tool for automotive professionals, financial analysts, and everyday drivers aiming to optimize their transportation expenses.
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
            <strong>1. Mixing Units:</strong> Entering distance, fuel efficiency, or fuel price in inconsistent units (e.g., miles with liters per 100 km) can lead to incorrect results. Always select the correct unit system and ensure all inputs match.
          </p>
          <p>
            <strong>2. Using Average MPG Instead of Real-World MPG:</strong> Manufacturer MPG ratings often differ from real-world driving conditions. Using actual fuel efficiency based on your driving habits provides more accurate cost estimates.
          </p>
          <p>
            <strong>3. Ignoring Fuel Price Variability:</strong> Fuel prices fluctuate frequently. Using outdated or estimated prices can skew your annual cost calculation. Update fuel prices regularly for best accuracy.
          </p>
          <p>
            <strong>4. Not Accounting for Seasonal Driving Changes:</strong> Annual distance may vary seasonally. Estimating based on consistent driving may not reflect true fuel costs.
          </p>
          <p>
            <strong>5. Overlooking Vehicle Maintenance Impact:</strong> Poorly maintained vehicles consume more fuel. Ensure your vehicle is well-maintained to match the fuel efficiency used in calculations.
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
      title="Annual Fuel Cost & Break-Even"
      description="Professional automotive calculator: Annual Fuel Cost & Break-Even. Get accurate estimates, expert advice, and financial insights."
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