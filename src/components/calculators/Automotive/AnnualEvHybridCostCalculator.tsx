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
      question: "How much does it cost to charge an electric vehicle per mile compared to a hybrid?",
      answer: "On average, charging an EV costs approximately $0.03 to $0.05 per mile, while hybrid fuel costs range from $0.08 to $0.12 per mile depending on electricity rates and fuel prices. Using the national average electricity rate of $0.16 per kWh and gasoline at $3.50 per gallon, a typical EV with 4 miles per kWh efficiency costs significantly less than a hybrid relying primarily on gas. Your actual costs will vary based on local utility rates and driving patterns.",
    },
    {
      question: "What annual mileage should I use to get an accurate comparison?",
      answer: "Most drivers average 12,000 to 15,000 miles annually in the United States. For an accurate comparison using this calculator, enter your actual expected annual mileage; however, if you're unsure, 12,500 miles is a reasonable baseline for typical sedan drivers. Higher mileage drivers benefit more from EVs due to lower per-mile operating costs, while lower mileage drivers may see less dramatic savings.",
    },
    {
      question: "How do local electricity rates affect EV charging costs?",
      answer: "Electricity rates vary dramatically by region, ranging from $0.10 per kWh in states like Louisiana to $0.23 per kWh in California. This means charging an EV in California costs more than double that in Louisiana for identical driving distances. When using this calculator, input your local utility rate or check your electric bill to ensure precise cost comparisons with hybrids in your area.",
    },
    {
      question: "Are there hidden costs I should consider beyond fuel and electricity?",
      answer: "EVs typically have lower maintenance costs due to regenerative braking and no oil changes, saving approximately $4,600 over the vehicle's lifetime compared to gas vehicles. However, hybrid maintenance costs fall between EVs and traditional gas cars at roughly $2,800 in additional costs. Battery replacement for EVs (rarely needed within 10 years) and hybrid battery costs should be factored in separately from fuel expenses.",
    },
    {
      question: "How do I account for time-of-use electricity pricing in my calculations?",
      answer: "Many utilities offer time-of-use (TOU) rates where off-peak charging (typically 9 PM to 6 AM) costs 30-50% less than peak rates. If your EV can charge during off-peak hours, your effective electricity rate could be $0.10 per kWh instead of $0.16, dramatically improving EV cost advantages. Enter your lowest available TOU rate into the calculator if you have the ability to charge during discounted periods.",
    },
    {
      question: "What's the impact of gasoline price volatility on hybrid costs?",
      answer: "Gasoline prices fluctuate between $2.50 and $4.50 per gallon seasonally and geographically, creating significant cost variance for hybrid owners. A hybrid costing $1,800 annually in fuel at $3.00 per gallon could cost $2,700 at $4.50 per gallon—a 50% increase. Use your local current gasoline price and consider regional trends when running this comparison, as fuel costs represent the largest variable in hybrid operating expenses.",
    },
    {
      question: "How does driving behavior (city vs. highway) affect the calculator results?",
      answer: "EVs achieve better efficiency in city driving due to regenerative braking, averaging 4-5 miles per kWh, while highway driving drops to 3-4 miles per kWh. Hybrids also perform better in city driving (25-30 MPG) versus highway (30-35 MPG), but both vehicle types benefit from city driving patterns. Adjust your annual mileage split between city and highway driving in your analysis for most accurate results.",
    },
    {
      question: "Should I account for federal tax credits or state incentives in my comparison?",
      answer: "The federal EV tax credit of up to $7,500 (available through 2032 for qualifying vehicles) significantly reduces EV purchase prices but doesn't directly affect fuel costs. Some states like California and New York offer additional $2,000-$5,000 incentives for EV purchases. While these credits don't change annual operating costs shown by this calculator, they improve the overall total cost of ownership when purchasing decisions are being made.",
    },
    {
      question: "Can this calculator help me determine break-even points between EV and hybrid purchases?",
      answer: "This calculator shows annual fuel/electricity costs only and doesn't factor vehicle purchase prices, which is essential for true break-even analysis. An EV might cost $5,000-$10,000 more upfront but save $1,500-$2,500 annually on fuel, reaching break-even in 2-6 years depending on mileage. For complete ROI analysis, combine this calculator's results with purchase price differences and factor in financing costs and incentives.",
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Annual Fuel/Electricity Cost: EV vs Hybrid Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator compares the annual operating costs of electric vehicles and hybrid vehicles based on your driving patterns and local fuel/electricity prices. Understanding these costs is critical for making informed vehicle purchase decisions, as fuel and electricity represent the largest ongoing operating expenses after insurance and maintenance. By inputting your specific driving habits and local utility rates, you can see precisely how much you'll spend annually on each powertrain option.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator requires three key inputs: your expected annual mileage (typically 12,000-15,000 miles for average U.S. drivers), your local electricity rate per kilowatt-hour (found on your utility bill or online), and the current gasoline price in your area. Vehicle efficiency ratings are pre-populated based on typical EPA data, but you can adjust these if you have your vehicle's specific MPG or miles-per-kWh rating from your owner's manual or fuel economy documentation. These inputs directly determine your total annual operating costs by multiplying miles driven by cost-per-mile for each vehicle type.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the results by comparing the total annual costs shown for each vehicle type—the difference reveals your potential annual savings. An EV showing $1,500 annual costs versus a hybrid at $2,625 means $1,125 in yearly savings, which compounds to $5,625-$11,250 over 5-10 years of ownership. Note that this calculator focuses solely on fuel/electricity costs and doesn't include vehicle purchase price, maintenance, insurance, or financing—consider these factors separately for complete total-cost-of-ownership analysis.</p>
        </div>
      </section>

      {/* TABLE: Annual Fuel/Electricity Costs by Vehicle Type and Annual Mileage */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual Fuel/Electricity Costs by Vehicle Type and Annual Mileage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows projected annual operating costs for electric vehicles versus hybrids at different annual mileage levels using 2024-2025 national average rates.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Mileage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EV Cost (at $0.16/kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hybrid Cost (at $3.50/gal)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Savings (EV)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,050</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$450</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$900</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12,500 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,625</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,125</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,350</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,800</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,250</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">EV costs assume 4 miles per kWh efficiency; hybrid costs assume 28 MPG combined. Actual savings vary by local electricity rates, gasoline prices, and vehicle efficiency ratings.</p>
      </section>

      {/* TABLE: Regional Electricity Rates Impact on EV Charging Costs */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Regional Electricity Rates Impact on EV Charging Costs</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Electricity rates vary significantly across U.S. regions, directly affecting annual EV operating costs for equivalent mileage.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Region/State</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Avg. Electricity Rate (2024)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Cost (12,500 mi)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">vs. National Average</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Louisiana</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.10/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$937</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-38% cheaper</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Texas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.12/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-25% cheaper</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">National Average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.16/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">baseline</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New York</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.19/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,781</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+19% more</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Massachusetts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.21/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,969</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+31% more</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">California</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.23/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,156</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+44% more</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Based on U.S. Energy Information Administration 2024 data. Residential rates include all taxes and fees. Time-of-use rates can reduce costs by 30-50% during off-peak hours.</p>
      </section>

      {/* TABLE: Vehicle Efficiency Ratings by Category (EPA 2024-2025) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Vehicle Efficiency Ratings by Category (EPA 2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard efficiency metrics show how vehicle type and size affect fuel/electricity consumption and operating costs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Efficiency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost per Mile (avg.)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Cost (12,500 mi)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact EV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5 mi/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.036</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$450</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mid-size EV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.0 mi/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.040</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full-size EV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5 mi/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.046</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$575</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact Hybrid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.073</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$912</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mid-size Hybrid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.083</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,038</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full-size Hybrid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38 MPG</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.092</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,150</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Efficiency ratings from EPA FuelEconomy.gov. EV costs use $0.16/kWh; hybrid costs use $3.50/gallon. Real-world efficiency varies with driving conditions.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Check your most recent utility bill for your exact per-kWh electricity rate rather than using national averages—rates vary by 130% between the cheapest and most expensive states, dramatically affecting EV cost comparisons.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If your utility offers time-of-use (TOU) pricing, calculate costs using off-peak rates (typically $0.08-$0.12/kWh) available during night charging hours—this can reduce annual EV costs by 30-50% compared to peak rates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in your actual commute distance and driving patterns; drivers with &lt;10,000 annual miles see smaller absolute savings with EVs despite better per-mile efficiency, while high-mileage drivers (&gt;20,000 miles) see the greatest benefit from lower EV operating costs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your actual vehicle's real-world efficiency for 2-3 months using your fuel/electricity receipts and odometer readings, then input these figures for the most accurate cost comparison tailored to your specific driving behavior and conditions.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Regional Electricity Rate Variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using national average electricity rates ($0.16/kWh) when your state's actual rate is $0.23/kWh (California) or $0.10/kWh (Louisiana) creates massive calculation errors. Always verify your local utility rate on your monthly bill or utility company website before running comparisons.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Off-Peak Charging Discounts</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many utilities offer time-of-use rates 30-50% cheaper during off-peak hours (typically 9 PM–6 AM), but only benefit drivers who can charge during these windows. If you have access to TOU pricing but use daytime charging exclusively, you'll overestimate your EV costs significantly.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Vehicle Efficiency Ratings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">MPG for hybrids and miles-per-kWh for EVs measure different things and aren't directly comparable without conversion. Using EPA ratings of 42 MPG (hybrid) versus 4.5 mi/kWh (EV) requires understanding that 4.5 mi/kWh roughly equals 120 MPGe (miles-per-gallon-equivalent) in energy content.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Excluding Long-Term Price Volatility</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Gasoline prices fluctuate $1-$2 per gallon seasonally and geographically, while electricity rates remain more stable; using a single gasoline price for 5-year projections underestimates hybrid cost uncertainty. Consider 10-year historical ranges ($2.50-$4.50 per gallon) when planning long-term ownership decisions.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does it cost to charge an electric vehicle per mile compared to a hybrid?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">On average, charging an EV costs approximately $0.03 to $0.05 per mile, while hybrid fuel costs range from $0.08 to $0.12 per mile depending on electricity rates and fuel prices. Using the national average electricity rate of $0.16 per kWh and gasoline at $3.50 per gallon, a typical EV with 4 miles per kWh efficiency costs significantly less than a hybrid relying primarily on gas. Your actual costs will vary based on local utility rates and driving patterns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What annual mileage should I use to get an accurate comparison?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most drivers average 12,000 to 15,000 miles annually in the United States. For an accurate comparison using this calculator, enter your actual expected annual mileage; however, if you're unsure, 12,500 miles is a reasonable baseline for typical sedan drivers. Higher mileage drivers benefit more from EVs due to lower per-mile operating costs, while lower mileage drivers may see less dramatic savings.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do local electricity rates affect EV charging costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Electricity rates vary dramatically by region, ranging from $0.10 per kWh in states like Louisiana to $0.23 per kWh in California. This means charging an EV in California costs more than double that in Louisiana for identical driving distances. When using this calculator, input your local utility rate or check your electric bill to ensure precise cost comparisons with hybrids in your area.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there hidden costs I should consider beyond fuel and electricity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">EVs typically have lower maintenance costs due to regenerative braking and no oil changes, saving approximately $4,600 over the vehicle's lifetime compared to gas vehicles. However, hybrid maintenance costs fall between EVs and traditional gas cars at roughly $2,800 in additional costs. Battery replacement for EVs (rarely needed within 10 years) and hybrid battery costs should be factored in separately from fuel expenses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for time-of-use electricity pricing in my calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Many utilities offer time-of-use (TOU) rates where off-peak charging (typically 9 PM to 6 AM) costs 30-50% less than peak rates. If your EV can charge during off-peak hours, your effective electricity rate could be $0.10 per kWh instead of $0.16, dramatically improving EV cost advantages. Enter your lowest available TOU rate into the calculator if you have the ability to charge during discounted periods.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the impact of gasoline price volatility on hybrid costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gasoline prices fluctuate between $2.50 and $4.50 per gallon seasonally and geographically, creating significant cost variance for hybrid owners. A hybrid costing $1,800 annually in fuel at $3.00 per gallon could cost $2,700 at $4.50 per gallon—a 50% increase. Use your local current gasoline price and consider regional trends when running this comparison, as fuel costs represent the largest variable in hybrid operating expenses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does driving behavior (city vs. highway) affect the calculator results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">EVs achieve better efficiency in city driving due to regenerative braking, averaging 4-5 miles per kWh, while highway driving drops to 3-4 miles per kWh. Hybrids also perform better in city driving (25-30 MPG) versus highway (30-35 MPG), but both vehicle types benefit from city driving patterns. Adjust your annual mileage split between city and highway driving in your analysis for most accurate results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I account for federal tax credits or state incentives in my comparison?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The federal EV tax credit of up to $7,500 (available through 2032 for qualifying vehicles) significantly reduces EV purchase prices but doesn't directly affect fuel costs. Some states like California and New York offer additional $2,000-$5,000 incentives for EV purchases. While these credits don't change annual operating costs shown by this calculator, they improve the overall total cost of ownership when purchasing decisions are being made.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator help me determine break-even points between EV and hybrid purchases?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator shows annual fuel/electricity costs only and doesn't factor vehicle purchase prices, which is essential for true break-even analysis. An EV might cost $5,000-$10,000 more upfront but save $1,500-$2,500 annually on fuel, reaching break-even in 2-6 years depending on mileage. For complete ROI analysis, combine this calculator's results with purchase price differences and factor in financing costs and incentives.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.eia.gov/electricity/state/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Energy Information Administration - Average Electricity Rates by State</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government source providing current residential electricity rates by state, updated monthly to reflect regional pricing variations.</p>
          </li>
          <li>
            <a href="https://www.fueleconomy.gov/feg/findacar.shtml" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA FuelEconomy.gov - Find a Car</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative EPA resource providing official fuel economy ratings, MPG estimates, and annual fuel cost data for all vehicle makes and models.</p>
          </li>
          <li>
            <a href="https://afdc.energy.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy - Alternative Fuels Data Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Government resource offering electric vehicle charging infrastructure data, EV cost comparisons, fuel price tracking, and total cost of ownership calculators.</p>
          </li>
          <li>
            <a href="https://consumer.ftc.gov/articles/buying-electric-vehicle" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Trade Commission - Buying an Electric Vehicle</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Consumer protection agency guidance on EV purchasing including cost considerations, tax credits, and operating expense factors for informed decision-making.</p>
          </li>
        </ul>
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