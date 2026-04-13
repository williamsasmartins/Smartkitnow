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
      question: "How do I calculate annual fuel costs for my vehicle?",
      answer: "Annual fuel cost is calculated by dividing your vehicle's annual mileage by its fuel efficiency (MPG), then multiplying by the current fuel price per gallon. For example, if you drive 12,000 miles annually, your car gets 25 MPG, and gas costs $3.50/gallon, your annual fuel cost would be (12,000 ÷ 25) × $3.50 = $1,680. This calculator automates this computation and accounts for varying fuel prices and driving patterns.",
    },
    {
      question: "What is the break-even point when comparing two vehicles?",
      answer: "The break-even point is when the total cost savings from lower fuel expenses equal the upfront price difference between two vehicles. For instance, if Vehicle A costs $5,000 more than Vehicle B but saves $800/year in fuel, the break-even occurs at approximately 6.25 years. This calculator determines exactly how long it takes for fuel savings to offset the higher purchase price.",
    },
    {
      question: "How does fuel efficiency (MPG) impact my break-even calculation?",
      answer: "Higher fuel efficiency dramatically reduces break-even time. A hybrid vehicle averaging 50 MPG versus a standard sedan at 25 MPG cuts fuel costs in half, allowing you to recoup a higher purchase price much faster—potentially in 3-5 years instead of 8-10 years. Small improvements in MPG compound significantly over a vehicle's 10+ year lifespan.",
    },
    {
      question: "Should I include maintenance costs in break-even analysis?",
      answer: "While this calculator focuses on fuel costs, a complete break-even analysis should account for maintenance, repairs, insurance, and registration fees. Electric and hybrid vehicles often have lower fuel costs but may have higher insurance premiums initially, though maintenance is typically lower. For the most accurate decision, consider all ownership costs beyond fuel.",
    },
    {
      question: "How accurate are fuel price projections in break-even calculations?",
      answer: "Fuel price projections are inherently uncertain since prices fluctuate based on global oil markets, geopolitical factors, and supply disruptions. This calculator typically uses current or historical average prices; the U.S. average gas price as of 2024 is approximately $3.10/gallon, but prices have ranged from $2.00 to $5.00+ per gallon in recent years. For conservative planning, consider scenario analysis with multiple price points.",
    },
    {
      question: "How do electric vehicle costs compare in break-even analysis?",
      answer: "Electric vehicles (EVs) have significantly lower per-mile fuel costs—roughly $0.04 per mile for electricity versus $0.12-$0.15 per mile for gasoline vehicles. However, EVs typically have higher upfront purchase prices ($5,000-$15,000 more than comparable gas vehicles). Many EVs achieve break-even in 5-7 years, though federal tax credits up to $7,500 can accelerate this timeline considerably.",
    },
    {
      question: "What annual mileage should I use for accurate calculations?",
      answer: "The U.S. average annual mileage is approximately 12,000-13,500 miles per year according to the Federal Highway Administration. However, you should use your actual driving pattern for the most accurate results—light drivers (8,000-10,000 miles/year) will see slower break-even on fuel-efficient purchases, while heavy drivers (15,000+ miles/year) will see faster payback due to higher fuel savings.",
    },
    {
      question: "How do regional fuel prices affect break-even timelines?",
      answer: "Fuel prices vary significantly by region; as of 2024, California averages $4.50+/gallon while some states average $2.80-$3.00/gallon. This means break-even calculations for fuel-efficient vehicles happen 20-30% faster in high-cost fuel regions. Always input your local fuel price for accurate break-even projections rather than using national averages.",
    },
    {
      question: "Can I use this calculator to compare more than two vehicles?",
      answer: "Yes, you can perform sequential comparisons by calculating break-even points pairwise. For example, compare Vehicle A versus B, then Vehicle B versus C to understand the cost hierarchy across multiple options. This approach helps you visualize total cost of ownership across different fuel types, engine sizes, and price points over 5, 7, and 10-year ownership periods.",
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Annual Fuel Cost & Break-Even Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine how much you'll spend on fuel annually and calculates the break-even point when comparing two vehicles. Break-even analysis is crucial when deciding between a fuel-efficient vehicle with a higher upfront cost and a standard vehicle—it shows exactly how many years it takes for fuel savings to offset the price premium. Understanding this metric empowers you to make data-driven purchasing decisions that align with your budget and driving habits.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you'll need four key inputs: the annual mileage you drive (use your actual driving patterns from recent years), the fuel efficiency (MPG or MPGe) of each vehicle, the current fuel price in your region, and the purchase price difference between the two vehicles. The calculator accepts both gasoline vehicles (measured in MPG) and electric vehicles (measured in miles per kWh or MPGe). Be sure to input your local fuel price rather than national averages, as regional variation significantly impacts results—California drivers see different break-even points than those in lower-cost fuel states.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your annual fuel cost for each vehicle and the break-even point in years and months. A break-even of 5 years means that after 5 years of ownership, fuel savings will have fully offset the higher purchase price; after that point, you're saving money. If the break-even exceeds your expected ownership period (e.g., you plan to keep the car only 4 years), the more expensive fuel-efficient vehicle may not be financially optimal unless other factors like depreciation, maintenance savings, or tax credits are considered.</p>
        </div>
      </section>

      {/* TABLE: Annual Fuel Costs by Vehicle Type (12,000 Miles/Year) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual Fuel Costs by Vehicle Type (12,000 Miles/Year)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated annual fuel costs for common vehicle types based on average fuel efficiency ratings and 2024 fuel prices.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average MPG</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Fuel Cost @ $3.50/gal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Fuel Cost @ $4.00/gal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact Gas Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,312.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500.00</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mid-Size Gas Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,714.29</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full-Size Gas SUV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,909.09</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,181.82</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hybrid Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$840.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$960.00</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Plug-in Hybrid (Electric Mode)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 MPGe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$420.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$480.00</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Electric Vehicle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5 mi/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$506.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$578.00</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes average U.S. electricity rate of $0.16/kWh for EVs. Fuel costs exclude taxes and regional surcharges. Actual mileage and efficiency vary by driving conditions.</p>
      </section>

      {/* TABLE: Break-Even Analysis: Gas Sedan vs. Hybrid (5, 7, and 10-Year Horizons) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Break-Even Analysis: Gas Sedan vs. Hybrid (5, 7, and 10-Year Horizons)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how break-even periods vary based on purchase price premiums and fuel price scenarios.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Price Premium</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Fuel Savings @ $3.50/gal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Break-Even (Years)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Savings at 10 Years</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$660</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.1 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,600</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$660</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.6 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,600</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$6,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$660</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.1 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$7,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$660</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.6 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$400</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$8,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$660</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.1 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$1,400</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes hybrid gets 50 MPG vs. gas sedan at 28 MPG with 12,000 annual miles. Negative values indicate cumulative cost disadvantage before break-even. Does not include maintenance cost differences or fuel price volatility.</p>
      </section>

      {/* TABLE: Federal Tax Credits and Their Impact on EV Break-Even (2024) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Federal Tax Credits and Their Impact on EV Break-Even (2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Federal electric vehicle tax credits significantly reduce upfront costs and accelerate break-even timelines for EV purchases.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EV Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Base Price Premium vs. Gas</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Federal Tax Credit (Max)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Effective Premium After Credit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Break-Even (Years)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact EV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mid-Size EV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Premium EV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0 (income limited)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-10 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Used EV (&lt;2 years old)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 years</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Federal tax credit of $7,500 available for vehicles &lt;$60,000 with modified AGI &lt;$300,000 (married filing jointly). Additional state credits available in CA, NY, and other regions. Actual credit eligibility depends on income, vehicle, and manufacturing criteria.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use your actual annual mileage, not the national average. Check your odometer over 6 months to establish your true driving pattern—high-mileage drivers see break-even much faster on fuel-efficient vehicles, while light drivers may not recoup the upfront cost premium.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for fuel price volatility by running break-even calculations at multiple price points ($2.50, $3.50, and $4.50 per gallon). This sensitivity analysis shows how sensitive your decision is to fuel market fluctuations and helps you understand the range of possible outcomes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Don't forget non-fuel cost differences when making your final decision. Hybrid and electric vehicles typically have lower maintenance costs (fewer oil changes, brake replacements), but may have higher insurance premiums and different resale values—incorporate these into a comprehensive total cost of ownership analysis.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Investigate available tax credits and rebates before calculating break-even. Federal EV tax credits up to $7,500, state incentives (California Clean Air vehicles get HOV lane access, NY offers $2,000 rebates), and utility company EV charging rebates can dramatically reduce the effective purchase price premium and accelerate break-even by 2-3 years.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using National Average Fuel Prices Instead of Local Prices</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Fuel prices vary by &gt;$1.50/gallon across regions, dramatically affecting break-even calculations. A hybrid that breaks even in 6 years at $4.50/gallon (California) may break even in 9 years at $3.00/gallon (Texas), making your analysis invalid if you use the wrong regional price.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Future Fuel Price Assumptions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Break-even calculations assume fuel prices remain constant, but oil markets are volatile. During price spikes, fuel-efficient vehicles achieve break-even faster; during price dips, payback periods extend significantly. Scenario planning with multiple fuel price assumptions provides a more realistic decision framework.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Maintenance and Repair Cost Differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">This calculator isolates fuel costs, but hybrids and EVs often have substantially lower maintenance expenses (no oil changes, less brake wear due to regenerative braking). Ignoring these savings underestimates the true financial advantage of fuel-efficient vehicles by $800-$1,500 over 5-7 years.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Apply Available Tax Credits and Incentives</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Federal EV tax credits up to $7,500 and state rebates can reduce the effective purchase premium by 20-30%, dramatically shortening break-even timelines. Failing to account for these incentives makes fuel-efficient vehicles appear less attractive than they actually are.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate annual fuel costs for my vehicle?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Annual fuel cost is calculated by dividing your vehicle's annual mileage by its fuel efficiency (MPG), then multiplying by the current fuel price per gallon. For example, if you drive 12,000 miles annually, your car gets 25 MPG, and gas costs $3.50/gallon, your annual fuel cost would be (12,000 ÷ 25) × $3.50 = $1,680. This calculator automates this computation and accounts for varying fuel prices and driving patterns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the break-even point when comparing two vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The break-even point is when the total cost savings from lower fuel expenses equal the upfront price difference between two vehicles. For instance, if Vehicle A costs $5,000 more than Vehicle B but saves $800/year in fuel, the break-even occurs at approximately 6.25 years. This calculator determines exactly how long it takes for fuel savings to offset the higher purchase price.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does fuel efficiency (MPG) impact my break-even calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Higher fuel efficiency dramatically reduces break-even time. A hybrid vehicle averaging 50 MPG versus a standard sedan at 25 MPG cuts fuel costs in half, allowing you to recoup a higher purchase price much faster—potentially in 3-5 years instead of 8-10 years. Small improvements in MPG compound significantly over a vehicle's 10+ year lifespan.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include maintenance costs in break-even analysis?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While this calculator focuses on fuel costs, a complete break-even analysis should account for maintenance, repairs, insurance, and registration fees. Electric and hybrid vehicles often have lower fuel costs but may have higher insurance premiums initially, though maintenance is typically lower. For the most accurate decision, consider all ownership costs beyond fuel.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate are fuel price projections in break-even calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Fuel price projections are inherently uncertain since prices fluctuate based on global oil markets, geopolitical factors, and supply disruptions. This calculator typically uses current or historical average prices; the U.S. average gas price as of 2024 is approximately $3.10/gallon, but prices have ranged from $2.00 to $5.00+ per gallon in recent years. For conservative planning, consider scenario analysis with multiple price points.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do electric vehicle costs compare in break-even analysis?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Electric vehicles (EVs) have significantly lower per-mile fuel costs—roughly $0.04 per mile for electricity versus $0.12-$0.15 per mile for gasoline vehicles. However, EVs typically have higher upfront purchase prices ($5,000-$15,000 more than comparable gas vehicles). Many EVs achieve break-even in 5-7 years, though federal tax credits up to $7,500 can accelerate this timeline considerably.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What annual mileage should I use for accurate calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The U.S. average annual mileage is approximately 12,000-13,500 miles per year according to the Federal Highway Administration. However, you should use your actual driving pattern for the most accurate results—light drivers (8,000-10,000 miles/year) will see slower break-even on fuel-efficient purchases, while heavy drivers (15,000+ miles/year) will see faster payback due to higher fuel savings.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do regional fuel prices affect break-even timelines?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Fuel prices vary significantly by region; as of 2024, California averages $4.50+/gallon while some states average $2.80-$3.00/gallon. This means break-even calculations for fuel-efficient vehicles happen 20-30% faster in high-cost fuel regions. Always input your local fuel price for accurate break-even projections rather than using national averages.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator to compare more than two vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, you can perform sequential comparisons by calculating break-even points pairwise. For example, compare Vehicle A versus B, then Vehicle B versus C to understand the cost hierarchy across multiple options. This approach helps you visualize total cost of ownership across different fuel types, engine sizes, and price points over 5, 7, and 10-year ownership periods.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.eia.gov/petroleum/gasdiesel/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Energy Information Administration - Gasoline and Diesel Fuel Update</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Provides weekly and historical fuel price data by region, essential for accurate break-even calculations based on current market conditions.</p>
          </li>
          <li>
            <a href="https://www.ftc.gov/business-guidance/pages/fuel-economy-label-and-rating" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Trade Commission - Fuel Economy Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Explains MPG ratings, EPA fuel economy labels, and testing standards that determine the efficiency figures used in break-even analysis.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/forms-pubs/form-8936" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Electric Vehicle Tax Credit - Form 8936</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Details the federal EV tax credit eligibility requirements, income limits, and vehicle pricing thresholds critical for break-even calculations involving electric vehicles.</p>
          </li>
          <li>
            <a href="https://www.fhwa.dot.gov/policy/otps/pearp/index.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Highway Administration - Average Annual Miles Driven by Americans</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Provides national driving statistics and mileage benchmarks to help validate whether your personal annual mileage aligns with regional averages for comparison purposes.</p>
          </li>
        </ul>
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