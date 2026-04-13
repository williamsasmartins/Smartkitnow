import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Car,
  Fuel,
  DollarSign,
  Info,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Settings,
  Zap,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TripFuelCostCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    dist: "",
    mpg: "",
    price: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const dist = parseFloat(inputs.dist);
    const mpg = parseFloat(inputs.mpg);
    const price = parseFloat(inputs.price);

    if (
      isNaN(dist) ||
      isNaN(mpg) ||
      isNaN(price) ||
      dist <= 0 ||
      mpg <= 0 ||
      price <= 0
    ) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Invalid input",
      };
    }

    // Calculate gallons/liters needed
    // Imperial: miles and mpg
    // Metric: kilometers and L/100km (convert to mpg equivalent)
    let fuelNeeded = 0;
    let cost = 0;

    if (inputs.unit === "imperial") {
      // dist in miles, mpg in miles per gallon
      fuelNeeded = dist / mpg; // gallons
      cost = fuelNeeded * price; // dollars
    } else {
      // metric: dist in km, mpg input is L/100km (fuel consumption)
      // Convert L/100km to mpg equivalent for calculation:
      // Actually, better to calculate fuelNeeded = (dist * L/100km) / 100
      fuelNeeded = (dist * mpg) / 100; // liters
      cost = fuelNeeded * price; // currency unit per liter
    }

    return {
      primary:
        inputs.unit === "imperial"
          ? fuelNeeded.toFixed(2) + " gallons"
          : fuelNeeded.toFixed(2) + " liters",
      secondary: `$${cost.toFixed(2)}`,
      details: `Fuel needed: ${fuelNeeded.toFixed(
        2
      )} ${inputs.unit === "imperial" ? "gallons" : "liters"} × Price per ${
        inputs.unit === "imperial" ? "gallon" : "liter"
      } = $${cost.toFixed(2)}`,
      feedback: "Calculation successful",
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How do I calculate fuel cost for a road trip?",
      answer: "To calculate fuel cost, multiply the distance traveled by your vehicle's fuel consumption rate (gallons per mile or liters per kilometer), then multiply by the current fuel price. For example, a 500-mile trip in a vehicle with 25 MPG at $3.50 per gallon costs (500 ÷ 25) × $3.50 = $70. This calculator automates this calculation and accounts for varying fuel prices and vehicle efficiency across your route.",
    },
    {
      question: "What is MPG and how does it affect trip fuel costs?",
      answer: "MPG (miles per gallon) measures how far your vehicle travels on one gallon of fuel. A vehicle with 30 MPG is 50% more efficient than one with 20 MPG. On a 1,000-mile trip at $3.50 per gallon, the 30 MPG vehicle costs $116.67 while the 20 MPG vehicle costs $175, a difference of $58.33. Better MPG directly reduces your total trip fuel expense.",
    },
    {
      question: "How do current gas prices affect my trip fuel cost estimate?",
      answer: "Gas prices have a direct linear relationship with fuel costs. A $0.50 per gallon increase raises trip costs proportionally—on a trip requiring 40 gallons, that's an extra $20 in fuel expenses. The Trip Fuel Cost Calculator updates with real-time or entered fuel prices so you can compare costs across different days or plan budget for price fluctuations between $2.50 and $4.50 per gallon.",
    },
    {
      question: "Should I use EPA estimated MPG or real-world MPG for accurate calculations?",
      answer: "EPA estimates are laboratory-tested but often differ from real-world performance by 10-20%. Highway driving typically yields better MPG than EPA city ratings, while aggressive acceleration or stop-and-go traffic worsens efficiency. For the most accurate trip estimate, use your vehicle's actual observed MPG from previous highway trips rather than manufacturer estimates.",
    },
    {
      question: "How do weather and terrain impact fuel consumption on road trips?",
      answer: "Cold weather reduces fuel economy by 10-15% due to engine inefficiency and increased tire rolling resistance, while mountainous terrain can reduce MPG by 20-30% compared to flat highways. Headwinds also decrease efficiency significantly. When planning trips in winter or through mountains, budget an additional 15-25% fuel cost beyond standard calculations to account for these environmental factors.",
    },
    {
      question: "Can I use this calculator to compare fuel costs between different vehicle routes?",
      answer: "Yes, the Trip Fuel Cost Calculator is excellent for route comparison. A route 50 miles longer but on flat, efficient highways might cost less than a shorter mountain pass route in a 20 MPG vehicle. Input the same origin and destination using different routes or enter different vehicle MPG ratings to see which combination delivers the best fuel economy and lowest overall trip cost.",
    },
    {
      question: "How accurate are trip fuel cost predictions for long-distance travel?",
      answer: "Predictions are typically accurate within 5-10% for highway trips of 500+ miles when using actual vehicle MPG data and current fuel prices. Accuracy decreases for trips &lt;100 miles due to proportionally larger warm-up inefficiencies and route variation. For multi-day road trips, calculate segments separately and sum costs, then add 10-15% buffer for unexpected detours or traffic.",
    },
    {
      question: "What fuel price should I use for a trip planned several months away?",
      answer: "For trips planned 3+ months ahead, use the current national average (typically $2.80-$3.80 per gallon as of 2024-2025) as a baseline estimate. Fuel prices fluctuate $0.30-$0.80 per gallon seasonally, with summer peaks 15-20% higher than winter lows. Re-run the calculation 1-2 weeks before your trip using actual current prices for the most precise budget.",
    },
    {
      question: "How do highway speeds affect fuel consumption and trip costs?",
      answer: "Fuel economy decreases significantly above 50 MPH—driving at 70 MPH instead of 55 MPH reduces efficiency by approximately 15-20% due to increased aerodynamic drag. On a 1,000-mile trip, this speed difference could add $15-$25 to fuel costs. The Trip Fuel Cost Calculator assumes steady highway speeds; adjust your expected MPG downward by 10-15% if planning high-speed driving.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the fuel cost for a 300-mile trip in a midsize sedan with an average fuel efficiency of 30 MPG and a fuel price of $4.00 per gallon.",
    steps: [
      {
        label: "Step 1: Calculate fuel needed",
        explanation: "Fuel needed = Distance ÷ MPG = 300 miles ÷ 30 MPG = 10 gallons",
      },
      {
        label: "Step 2: Calculate total fuel cost",
        explanation: "Cost = Fuel needed × Price per gallon = 10 gallons × $4.00 = $40.00",
      },
    ],
    result: "Final Result: The trip will cost approximately $40.00 in fuel.",
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description:
        "Official source for MPG ratings and fuel economy information provided by the U.S. Environmental Protection Agency.",
      url: "https://www.fueleconomy.gov/",
    },
    {
      title: "Kelley Blue Book",
      description:
        "Trusted vehicle valuation and pricing resource offering insights on vehicle fuel efficiency and costs.",
      url: "https://www.kbb.com/",
    },
    {
      title: "Edmunds Automotive",
      description:
        "Comprehensive car reviews, buying advice, and automotive cost calculators including fuel cost estimators.",
      url: "https://www.edmunds.com/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
        >
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
            Distance ({inputs.unit === "imperial" ? "miles" : "kilometers"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={
              inputs.unit === "imperial" ? "e.g. 300" : "e.g. 480"
            }
            value={inputs.dist}
            onChange={(e) => handleInputChange("dist", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Fuel Efficiency (
            {inputs.unit === "imperial" ? "MPG" : "L/100km"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={
              inputs.unit === "imperial" ? "e.g. 30" : "e.g. 7.8"
            }
            value={inputs.mpg}
            onChange={(e) => handleInputChange("mpg", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Fuel Price per {inputs.unit === "imperial" ? "gallon" : "liter"}
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={
              inputs.unit === "imperial" ? "e.g. 4.00" : "e.g. 1.06"
            }
            value={inputs.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Estimated Result
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.primary}
            </div>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Trip Fuel Cost Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Trip Fuel Cost Calculator is a practical tool designed to estimate the fuel expenses for your road trip before you hit the road. Whether planning a weekend getaway or a cross-country adventure, this calculator takes the guesswork out of budgeting by combining distance, vehicle efficiency, and fuel prices into a precise cost projection. Accurate trip fuel estimates help you plan finances, compare vehicle options, and make informed routing decisions.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator effectively, you'll need three key inputs: the total trip distance in miles, your vehicle's fuel efficiency measured in miles per gallon (MPG), and the current or projected fuel price per gallon. Your vehicle's actual observed highway MPG (from your dashboard or previous long drives) is more reliable than EPA estimates, which often run 5-15% optimistic. Enter the fuel price in your region or the price you expect during your travel dates—current national averages typically range from $2.50-$4.50 per gallon depending on season and market conditions.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator outputs your total fuel cost and cost per mile, allowing you to budget accurately and compare different routes or vehicles. Interpret the results as a baseline estimate that may vary by 5-10% based on actual driving conditions, traffic, weather, and speed variations. For long trips, consider adding a 10-15% contingency buffer to account for detours, unexpected traffic, or engine inefficiencies from cold weather or mountainous terrain.</p>
        </div>
      </section>

      {/* TABLE: Estimated Fuel Costs by Vehicle Type and Distance */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Estimated Fuel Costs by Vehicle Type and Distance</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows projected fuel costs for typical vehicle categories across common trip distances at $3.50 per gallon average fuel price.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical MPG</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">250 Miles</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">500 Miles</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">1,000 Miles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact Car (Honda Civic)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$27.34</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$54.69</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$109.38</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedan (Toyota Camry)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$31.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$62.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$125.00</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">SUV (Toyota RAV4)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$36.46</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$72.92</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$145.83</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full-Size Truck (Ford F-150)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$48.61</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$97.22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$194.44</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hybrid Vehicle (Prius)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">52</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$16.83</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$33.65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$67.31</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs based on $3.50/gallon average U.S. fuel price (2024-2025). Actual costs vary with regional prices, driving conditions, and individual vehicle efficiency.</p>
      </section>

      {/* TABLE: Impact of Fuel Price Fluctuations on Trip Costs */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Fuel Price Fluctuations on Trip Costs</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how fuel price changes affect total trip expenses for a 600-mile journey in a 25 MPG vehicle.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fuel Price Per Gallon</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gallons Needed (600 miles ÷ 25 MPG)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Trip Fuel Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost vs. $3.50 Baseline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$2.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$24.00</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$2.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$66.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$18.00</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$3.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$72.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$12.00</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$3.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$84.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$4.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$96.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$12.00</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$4.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$108.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$24.00</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Even modest $0.50/gallon price changes add $12 to trip costs. Summer driving season typically sees prices $0.40-$0.80/gallon higher than winter baseline.</p>
      </section>

      {/* TABLE: Real-World MPG vs. EPA Estimates for Popular Vehicles */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Real-World MPG vs. EPA Estimates for Popular Vehicles</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares EPA highway ratings to actual observed fuel economy, highlighting the importance of using real-world data in trip cost calculations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Model</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EPA Highway Rating</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Observed Real-World Highway MPG</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Efficiency Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Honda Civic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34-36 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-5% to -11%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Toyota Camry</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-32 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-3% to -9%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Toyota RAV4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26-28 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-3% to -10%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ford F-150 (3.5L)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-22 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-8% to -17%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tesla Model 3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">132 MPGe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110-120 MPGe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-9% to -17%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Real-world efficiency typically runs 5-15% below EPA estimates due to varied driving patterns, terrain, and climate. Using actual observed MPG improves trip cost accuracy significantly.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Update your fuel price 1-2 weeks before travel—prices fluctuate weekly by $0.10-$0.30 per gallon, so waiting until closer to your trip date ensures your budget reflects current market conditions and seasonal variations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use actual vehicle MPG from your trip computer or previous highway drives rather than EPA estimates—real-world highway efficiency typically runs 5-15% better than city EPA ratings but may be 10-20% worse than optimistic manufacturer claims.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in terrain and weather adjustments: subtract 15-25% from expected MPG for winter trips or mountain passes, and add 10-15% fuel budget for high-altitude or snow-covered routes to avoid underestimating costs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare total trip costs across multiple routes and vehicle options by running separate calculations—a longer highway route at 28 MPG may cost less than a shorter mountain route at 18 MPG, helping you choose the most economical path.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your actual fuel consumption during the trip by noting odometer readings and fuel purchases at each fill-up—this real-time data improves accuracy for return trip calculations and future road trip estimates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Plan fuel stops strategically using gas price comparison apps (GasBuddy, Waze) to buy fuel in cheaper regions—saving $0.30-$0.50 per gallon on high-fuel-volume trips can reduce total costs by $10-$20 or more.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using EPA City MPG Instead of Highway MPG</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">EPA city ratings are 20-30% lower than highway ratings because stop-and-go traffic drastically reduces efficiency. Using a vehicle's city MPG for highway trip calculations overestimates fuel consumption and inflates cost projections by 15-25%, leading to inaccurate budgets and overly pessimistic planning.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Seasonal Fuel Price Variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Summer gasoline prices run 15-25% higher than winter lows due to seasonal refining changes and increased demand. Calculating a summer trip using winter baseline prices ($2.80/gallon) instead of actual summer averages ($3.50-$4.00/gallon) can underestimate costs by $20-$40 on long trips.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Elevation and Terrain</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Mountain passes and high-altitude driving reduce fuel economy by 20-30%, but many trip planners use flat-highway estimates. A trip through the Rocky Mountains in a 25 MPG vehicle should budget for 18-20 MPG efficiency, adding $15-$30 to projected fuel costs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating the Impact of Highway Speed</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Driving at 70 MPH instead of 55 MPH reduces fuel efficiency by 15-20%, but calculators assume steady speeds. Highway traffic and aggressive driving can reduce your vehicle's actual efficiency by 10-15%, inflating the actual fuel cost $10-$25 beyond baseline calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Cold Starting and Warm-Up Inefficiency Only for Short Trips</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Every trip start burns fuel inefficiently for the first 10-15 minutes. On a 200-mile trip with one fuel stop, you experience two warm-up cycles instead of one, consuming approximately 5-10% more fuel than steady-state calculations suggest, adding $2-$4 to costs.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate fuel cost for a road trip?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To calculate fuel cost, multiply the distance traveled by your vehicle's fuel consumption rate (gallons per mile or liters per kilometer), then multiply by the current fuel price. For example, a 500-mile trip in a vehicle with 25 MPG at $3.50 per gallon costs (500 ÷ 25) × $3.50 = $70. This calculator automates this calculation and accounts for varying fuel prices and vehicle efficiency across your route.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is MPG and how does it affect trip fuel costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">MPG (miles per gallon) measures how far your vehicle travels on one gallon of fuel. A vehicle with 30 MPG is 50% more efficient than one with 20 MPG. On a 1,000-mile trip at $3.50 per gallon, the 30 MPG vehicle costs $116.67 while the 20 MPG vehicle costs $175, a difference of $58.33. Better MPG directly reduces your total trip fuel expense.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do current gas prices affect my trip fuel cost estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gas prices have a direct linear relationship with fuel costs. A $0.50 per gallon increase raises trip costs proportionally—on a trip requiring 40 gallons, that's an extra $20 in fuel expenses. The Trip Fuel Cost Calculator updates with real-time or entered fuel prices so you can compare costs across different days or plan budget for price fluctuations between $2.50 and $4.50 per gallon.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I use EPA estimated MPG or real-world MPG for accurate calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">EPA estimates are laboratory-tested but often differ from real-world performance by 10-20%. Highway driving typically yields better MPG than EPA city ratings, while aggressive acceleration or stop-and-go traffic worsens efficiency. For the most accurate trip estimate, use your vehicle's actual observed MPG from previous highway trips rather than manufacturer estimates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do weather and terrain impact fuel consumption on road trips?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cold weather reduces fuel economy by 10-15% due to engine inefficiency and increased tire rolling resistance, while mountainous terrain can reduce MPG by 20-30% compared to flat highways. Headwinds also decrease efficiency significantly. When planning trips in winter or through mountains, budget an additional 15-25% fuel cost beyond standard calculations to account for these environmental factors.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator to compare fuel costs between different vehicle routes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the Trip Fuel Cost Calculator is excellent for route comparison. A route 50 miles longer but on flat, efficient highways might cost less than a shorter mountain pass route in a 20 MPG vehicle. Input the same origin and destination using different routes or enter different vehicle MPG ratings to see which combination delivers the best fuel economy and lowest overall trip cost.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate are trip fuel cost predictions for long-distance travel?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Predictions are typically accurate within 5-10% for highway trips of 500+ miles when using actual vehicle MPG data and current fuel prices. Accuracy decreases for trips &lt;100 miles due to proportionally larger warm-up inefficiencies and route variation. For multi-day road trips, calculate segments separately and sum costs, then add 10-15% buffer for unexpected detours or traffic.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What fuel price should I use for a trip planned several months away?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For trips planned 3+ months ahead, use the current national average (typically $2.80-$3.80 per gallon as of 2024-2025) as a baseline estimate. Fuel prices fluctuate $0.30-$0.80 per gallon seasonally, with summer peaks 15-20% higher than winter lows. Re-run the calculation 1-2 weeks before your trip using actual current prices for the most precise budget.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do highway speeds affect fuel consumption and trip costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Fuel economy decreases significantly above 50 MPH—driving at 70 MPH instead of 55 MPH reduces efficiency by approximately 15-20% due to increased aerodynamic drag. On a 1,000-mile trip, this speed difference could add $15-$25 to fuel costs. The Trip Fuel Cost Calculator assumes steady highway speeds; adjust your expected MPG downward by 10-15% if planning high-speed driving.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.fueleconomy.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FuelEconomy.gov - EPA Official Fuel Economy Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official EPA database providing certified fuel economy ratings, real-world data comparisons, and tools for finding your vehicle's actual MPG performance.</p>
          </li>
          <li>
            <a href="https://www.eia.gov/petroleum/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Energy Information Administration - Weekly Petroleum Report</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Government source tracking national and regional fuel price trends, historical data, and current gasoline price averages updated weekly.</p>
          </li>
          <li>
            <a href="https://gasprices.aaa.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAA Gas Prices - Daily Fuel Price Tracker</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time fuel price data by state and region, enabling accurate trip cost calculations based on current market conditions and local variations.</p>
          </li>
          <li>
            <a href="https://www.nhtsa.gov/vehicle-manufacturers/fuel-economy" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NHTSA Fuel Economy Label Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">National Highway Traffic Safety Administration resource explaining how EPA fuel economy labels work and the differences between city, highway, and combined MPG ratings.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Trip Fuel Cost Calculator"
      description="Professional automotive calculator: Trip Fuel Cost Calculator. Get accurate estimates, expert advice, and financial insights."
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
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}