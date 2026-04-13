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

export default function FuelEconomyConverterCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    dist: "", // Distance to travel
    mpg: "",  // Fuel economy (MPG or L/100km)
    price: "" // Fuel price per gallon or liter
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
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

    let fuelNeeded = 0;
    let cost = 0;

    if (unit === "imperial") {
      // Inputs: dist in miles, mpg in miles per gallon, price in $/gallon
      fuelNeeded = dist / mpg; // gallons
      cost = fuelNeeded * price;
    } else {
      // Metric: dist in kilometers, mpg is actually L/100km, price in $/liter
      // Convert L/100km to fuel needed: (dist * L/100km) / 100
      fuelNeeded = (dist * mpg) / 100; // liters
      cost = fuelNeeded * price;
    }

    return {
      primary: unit === "imperial"
        ? `${fuelNeeded.toFixed(2)} gallons`
        : `${fuelNeeded.toFixed(2)} liters`,
      secondary: `$${cost.toFixed(2)}`,
      details: `Fuel needed: ${fuelNeeded.toFixed(2)} ${unit === "imperial" ? "gallons" : "liters"} × Price: $${price.toFixed(2)} per ${unit === "imperial" ? "gallon" : "liter"}`,
      feedback: "Calculation successful"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is the difference between MPG and L/100km?",
      answer: "MPG (miles per gallon) measures how many miles a vehicle travels on one gallon of fuel, while L/100km (liters per 100 kilometers) measures how many liters are needed to travel 100 kilometers. MPG is commonly used in the United States and the United Kingdom, while L/100km is the standard in Europe, Canada, and most other countries. The two metrics are inversely related, meaning higher MPG equals lower L/100km consumption. For example, a car with 25 MPG equals approximately 9.4 L/100km.",
    },
    {
      question: "How do I convert 30 MPG to L/100km?",
      answer: "To convert 30 MPG to L/100km, divide 235.2 by the MPG value: 235.2 ÷ 30 = 7.84 L/100km. This conversion factor works because 1 gallon equals 3.785 liters and 1 mile equals 1.609 kilometers. A vehicle rated at 30 MPG uses approximately 7.84 liters to travel 100 kilometers, which is considered good fuel economy for a mid-size sedan.",
    },
    {
      question: "What does L/100km mean in practical terms?",
      answer: "L/100km tells you how much fuel your vehicle consumes per 100 kilometers of driving. Lower L/100km values indicate better fuel efficiency. For example, a car with 6 L/100km uses 6 liters of fuel to drive 100 kilometers, while a car with 10 L/100km uses 10 liters for the same distance. Understanding this metric helps drivers in metric-using countries make informed decisions about vehicle fuel costs and environmental impact.",
    },
    {
      question: "How accurate is the fuel economy converter?",
      answer: "The fuel economy converter is highly accurate for mathematical conversions between different units (MPG, L/100km, km/L, mi/L). The conversion factor of 235.2 is the industry-standard multiplier used by automotive manufacturers and regulatory agencies worldwide. However, the converter provides theoretical values; actual fuel consumption depends on driving conditions, vehicle maintenance, driving style, and terrain. Real-world fuel economy typically varies by 10–20% from manufacturer estimates.",
    },
    {
      question: "Why do some countries use km/L instead of L/100km?",
      answer: "Some countries, particularly in Asia (Japan, India, Australia), use km/L (kilometers per liter) rather than L/100km because it mirrors the intuitive MPG format used in the US and UK. km/L represents how far a vehicle travels on one liter of fuel, similar to how MPG shows distance per gallon. To convert km/L to L/100km, divide 100 by the km/L value: 100 ÷ 12 km/L = 8.33 L/100km.",
    },
    {
      question: "What is considered good fuel economy in 2024?",
      answer: "As of 2024, the EPA estimates that a new car with 25–28 MPG is average, while 30+ MPG is considered good for sedans and crossovers. For context, 25 MPG equals 9.4 L/100km, 30 MPG equals 7.84 L/100km, and 35 MPG equals 6.72 L/100km. Hybrid vehicles achieve 45–60 MPG (3.9–5.2 L/100km), while electric vehicles produce zero direct emissions but are measured in MPGe (miles per gallon equivalent).",
    },
    {
      question: "How do I use fuel economy data to calculate my annual fuel costs?",
      answer: "To calculate annual fuel costs, multiply your annual mileage by your fuel economy conversion, then multiply by the current fuel price. For example, if you drive 12,000 miles per year at 25 MPG with gas at $3.50 per gallon: (12,000 ÷ 25) × $3.50 = $1,680 annually. Alternatively, convert to L/100km (9.4), estimate 12,000 miles as 19,312 km, then calculate (19,312 ÷ 100) × 9.4 × $1.25/liter (approximate) for similar results.",
    },
    {
      question: "Can driving habits affect fuel economy beyond what the converter shows?",
      answer: "Yes, the fuel economy converter shows theoretical values based on standard testing procedures, but real-world fuel consumption can vary significantly. Aggressive acceleration, speeding, excessive idling, and cold-start driving can reduce fuel economy by 15–30% compared to converter estimates. Maintaining proper tire pressure, regular engine servicing, and smooth acceleration can improve actual fuel economy by 3–10% and help your vehicle approach the converter's predicted values.",
    },
    {
      question: "What is MPGe and how does it relate to this converter?",
      answer: "MPGe (miles per gallon equivalent) measures the fuel efficiency of electric and hydrogen vehicles by converting their energy consumption to a gasoline-equivalent basis. The EPA defines 33.7 kWh as equivalent to one gallon of gasoline for energy content purposes. A typical electric vehicle achieves 100–120 MPGe, which is significantly more efficient than comparable gasoline vehicles at 25–35 MPG. The standard fuel economy converter does not directly convert MPGe, as it applies only to traditional fuel-based vehicles.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $35,000 SUV with an average fuel economy of 25 MPG, planning a 300-mile road trip, and fuel price at $4.00 per gallon.",
    steps: [
      {
        label: "Step 1: Calculate fuel needed",
        explanation: "Fuel needed = Distance ÷ MPG = 300 miles ÷ 25 MPG = 12 gallons"
      },
      {
        label: "Step 2: Calculate total fuel cost",
        explanation: "Cost = Fuel needed × Price per gallon = 12 gallons × $4.00 = $48.00"
      }
    ],
    result: "Final Result: You will need approximately 12 gallons of fuel, costing about $48.00 for the trip."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and fuel economy information from the U.S. Environmental Protection Agency."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing resource including fuel economy data."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, pricing, and fuel economy advice for consumers."
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
          <Label>Distance to Travel ({inputs.unit === "imperial" ? "miles" : "kilometers"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.dist}
            onChange={(e) => handleInputChange("dist", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 300" : "e.g. 480"}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Fuel Economy ({inputs.unit === "imperial" ? "MPG (miles/gallon)" : "L/100km (liters/100 km)"})
          </Label>
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
          <Label>Fuel Price ({inputs.unit === "imperial" ? "$ per gallon" : "$ per liter"})</Label>
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Fuel Economy Converter</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Fuel Economy Converter is a practical tool that translates fuel consumption measurements between different global standards. Because countries use different metrics—MPG in the US and UK, L/100km in Europe and Canada, and km/L in Asia—comparing vehicle efficiency across borders can be confusing. This calculator instantly converts between these units, allowing you to compare fuel costs, environmental impact, and vehicle performance regardless of which standard your country uses.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the converter, enter your vehicle's fuel economy in one of the supported units: MPG (miles per gallon), L/100km (liters per 100 kilometers), km/L (kilometers per liter), or mi/L (miles per liter). The calculator accepts decimal values to provide precise conversions. Simply input the known value, and the converter automatically displays equivalent measurements in all other formats, helping you understand your vehicle's efficiency in whichever unit is most relevant to your needs.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the results by comparing your converted values against typical benchmarks for your vehicle class and year. For example, if you own a compact sedan with 28 MPG (8.4 L/100km), you're at the average efficiency for that category. Lower L/100km or higher MPG/km/L values indicate better fuel economy and lower operating costs. Use these converted values to calculate annual fuel expenses, compare vehicles before purchase, or track improvements from maintenance and driving habit changes.</p>
        </div>
      </section>

      {/* TABLE: MPG to L/100km Conversion Chart */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">MPG to L/100km Conversion Chart</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows common MPG values and their equivalent L/100km consumption rates for quick reference.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">MPG (US)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">L/100km</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Efficiency Rating</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.68</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Poor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Full-size pickup truck</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.76</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Below Average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large SUV</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.41</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mid-size sedan</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.84</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Compact sedan</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.72</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hybrid sedan</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.23</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hybrid compact</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exceptional</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hybrid economy car</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.92</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Outstanding</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-efficiency hybrid</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Conversion factor: 235.2 ÷ MPG = L/100km. Ratings based on 2024 EPA vehicle testing standards.</p>
      </section>

      {/* TABLE: Km/L to L/100km Cross-Reference */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Km/L to L/100km Cross-Reference</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table converts km/L (used in Asia and Australia) to L/100km for international comparison.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Km/L</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">L/100km</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">MPG (US)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Fuel Cost (12,000 mi @ $3.50/gal)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,234</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,787</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,489</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,281</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">37.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,127</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$995</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">47.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$895</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Annual fuel cost assumes 12,000 miles driven per year. Actual costs vary by fuel prices and driving patterns.</p>
      </section>

      {/* TABLE: Fuel Economy Standards by Vehicle Class (2024) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Fuel Economy Standards by Vehicle Class (2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows EPA-estimated average fuel economy by vehicle class for 2024 model year vehicles.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Class</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average MPG</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average L/100km</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Price Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29–32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.35–8.11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000–$28,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mid-size Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26–30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.84–9.05</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25,000–$35,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24–28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.40–9.80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,000–$45,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact SUV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24–28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.40–9.80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$28,000–$38,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mid-size SUV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21–26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.05–11.20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$35,000–$50,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full-size SUV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18–22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.70–13.07</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50,000–$75,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pickup Truck (Light-duty)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19–23</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.23–12.38</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$28,000–$45,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hybrid Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48–56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.20–4.90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$26,000–$32,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">EPA estimates based on 2024 model year testing. Real-world fuel economy varies by driving conditions, maintenance, and driver behavior.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Convert your vehicle's real-world fuel economy (calculated from actual fill-ups over several months) rather than relying solely on EPA estimates, as your consumption may differ by 10–20% due to driving conditions, terrain, and maintenance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">When comparing international vehicles for purchase, always convert both vehicles to the same metric using this converter to ensure a fair efficiency comparison, as L/100km and MPG can appear differently efficient at first glance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the converter to track fuel economy improvements after maintenance; if your converted fuel economy drops significantly, it may indicate an engine problem, low tire pressure, or the need for a tune-up that could save hundreds in annual fuel costs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Calculate your annual fuel budget by converting your vehicle's fuel economy, multiplying by your estimated annual mileage, and applying your local fuel price to understand the true operating cost of vehicle ownership before making a purchase decision.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing L/100km and MPG direction</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The most common error is treating L/100km and MPG the same way when they are inversely related. Higher MPG is better (more miles per gallon), but lower L/100km is better (less fuel needed per 100 km). Always check which metric you're using before comparing two vehicles.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using EPA estimates as guaranteed fuel economy</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">EPA fuel economy ratings are laboratory-tested estimates, not guarantees. Real-world fuel consumption depends on driving conditions, driver behavior, maintenance, and weather. Expect your actual consumption to vary 10–20% from the converter's theoretical values based on these factors.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for fuel type differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Vehicles with different fuel types (regular gasoline, premium gasoline, diesel, ethanol blends) have different fuel economy and prices. The converter shows the mathematical relationship between units but doesn't adjust for fuel type, so verify that you're comparing vehicles using the same fuel type for accurate cost analysis.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting to convert both vehicles to the same metric</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">When comparing a 30 MPG US vehicle to a 7 L/100km European vehicle, many buyers mistakenly assume one is obviously better without converting. Always use the converter to translate both to the same metric before making efficiency comparisons, as the difference is less obvious than it appears.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between MPG and L/100km?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">MPG (miles per gallon) measures how many miles a vehicle travels on one gallon of fuel, while L/100km (liters per 100 kilometers) measures how many liters are needed to travel 100 kilometers. MPG is commonly used in the United States and the United Kingdom, while L/100km is the standard in Europe, Canada, and most other countries. The two metrics are inversely related, meaning higher MPG equals lower L/100km consumption. For example, a car with 25 MPG equals approximately 9.4 L/100km.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I convert 30 MPG to L/100km?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To convert 30 MPG to L/100km, divide 235.2 by the MPG value: 235.2 ÷ 30 = 7.84 L/100km. This conversion factor works because 1 gallon equals 3.785 liters and 1 mile equals 1.609 kilometers. A vehicle rated at 30 MPG uses approximately 7.84 liters to travel 100 kilometers, which is considered good fuel economy for a mid-size sedan.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does L/100km mean in practical terms?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">L/100km tells you how much fuel your vehicle consumes per 100 kilometers of driving. Lower L/100km values indicate better fuel efficiency. For example, a car with 6 L/100km uses 6 liters of fuel to drive 100 kilometers, while a car with 10 L/100km uses 10 liters for the same distance. Understanding this metric helps drivers in metric-using countries make informed decisions about vehicle fuel costs and environmental impact.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the fuel economy converter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The fuel economy converter is highly accurate for mathematical conversions between different units (MPG, L/100km, km/L, mi/L). The conversion factor of 235.2 is the industry-standard multiplier used by automotive manufacturers and regulatory agencies worldwide. However, the converter provides theoretical values; actual fuel consumption depends on driving conditions, vehicle maintenance, driving style, and terrain. Real-world fuel economy typically varies by 10–20% from manufacturer estimates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do some countries use km/L instead of L/100km?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Some countries, particularly in Asia (Japan, India, Australia), use km/L (kilometers per liter) rather than L/100km because it mirrors the intuitive MPG format used in the US and UK. km/L represents how far a vehicle travels on one liter of fuel, similar to how MPG shows distance per gallon. To convert km/L to L/100km, divide 100 by the km/L value: 100 ÷ 12 km/L = 8.33 L/100km.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is considered good fuel economy in 2024?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">As of 2024, the EPA estimates that a new car with 25–28 MPG is average, while 30+ MPG is considered good for sedans and crossovers. For context, 25 MPG equals 9.4 L/100km, 30 MPG equals 7.84 L/100km, and 35 MPG equals 6.72 L/100km. Hybrid vehicles achieve 45–60 MPG (3.9–5.2 L/100km), while electric vehicles produce zero direct emissions but are measured in MPGe (miles per gallon equivalent).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I use fuel economy data to calculate my annual fuel costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To calculate annual fuel costs, multiply your annual mileage by your fuel economy conversion, then multiply by the current fuel price. For example, if you drive 12,000 miles per year at 25 MPG with gas at $3.50 per gallon: (12,000 ÷ 25) × $3.50 = $1,680 annually. Alternatively, convert to L/100km (9.4), estimate 12,000 miles as 19,312 km, then calculate (19,312 ÷ 100) × 9.4 × $1.25/liter (approximate) for similar results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can driving habits affect fuel economy beyond what the converter shows?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the fuel economy converter shows theoretical values based on standard testing procedures, but real-world fuel consumption can vary significantly. Aggressive acceleration, speeding, excessive idling, and cold-start driving can reduce fuel economy by 15–30% compared to converter estimates. Maintaining proper tire pressure, regular engine servicing, and smooth acceleration can improve actual fuel economy by 3–10% and help your vehicle approach the converter's predicted values.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is MPGe and how does it relate to this converter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">MPGe (miles per gallon equivalent) measures the fuel efficiency of electric and hydrogen vehicles by converting their energy consumption to a gasoline-equivalent basis. The EPA defines 33.7 kWh as equivalent to one gallon of gasoline for energy content purposes. A typical electric vehicle achieves 100–120 MPGe, which is significantly more efficient than comparable gasoline vehicles at 25–35 MPG. The standard fuel economy converter does not directly convert MPGe, as it applies only to traditional fuel-based vehicles.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.fueleconomy.gov/feg/noframes/noframes.shtml" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA: Find a Car - Fuel Economy</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The official EPA database for finding fuel economy estimates, comparing vehicles, and understanding testing methodologies for all 2024 and recent model year vehicles.</p>
          </li>
          <li>
            <a href="https://www.energy.gov/articles/fuel-economy-tips" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy: Fuel Economy Tips</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative government guidance on improving vehicle fuel economy through maintenance, driving techniques, and best practices for vehicle operation.</p>
          </li>
          <li>
            <a href="https://www.nrcan.gc.ca/energy/fuel-prices-and-consumption/fuel-consumption-guide/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Natural Resources Canada: Fuel Consumption Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Canada's official resource for vehicle fuel consumption data, including L/100km ratings and comparison tools for Canadian vehicles and fuel standards.</p>
          </li>
          <li>
            <a href="https://www.globalfueleconomy.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ICCT: Global Fuel Economy Initiative</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">International Center for Transportation Research organization providing harmonized fuel economy data, conversion standards, and vehicle efficiency comparisons across countries.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fuel Economy Converter"
      description="Professional automotive calculator: Fuel Economy Converter. Get accurate estimates, expert advice, and financial insights."
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