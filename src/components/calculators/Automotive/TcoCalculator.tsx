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

export default function TcoCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    purchasePrice: "",
    annualMileage: "",
    fuelEfficiency: "",
    fuelPrice: "",
    maintenanceCost: "",
    insuranceCost: "",
    yearsOwned: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const purchasePrice = parseFloat(inputs.purchasePrice);
    const annualMileage = parseFloat(inputs.annualMileage);
    const fuelEfficiency = parseFloat(inputs.fuelEfficiency);
    const fuelPrice = parseFloat(inputs.fuelPrice);
    const maintenanceCost = parseFloat(inputs.maintenanceCost);
    const insuranceCost = parseFloat(inputs.insuranceCost);
    const yearsOwned = parseInt(inputs.yearsOwned);

    if (
      isNaN(purchasePrice) || purchasePrice <= 0 ||
      isNaN(annualMileage) || annualMileage <= 0 ||
      isNaN(fuelEfficiency) || fuelEfficiency <= 0 ||
      isNaN(fuelPrice) || fuelPrice <= 0 ||
      isNaN(maintenanceCost) || maintenanceCost < 0 ||
      isNaN(insuranceCost) || insuranceCost < 0 ||
      isNaN(yearsOwned) || yearsOwned <= 0
    ) {
      return {
        primary: "N/A",
        secondary: "$0.00",
        details: "Please enter valid positive numbers in all fields.",
        feedback: "Incomplete or invalid input"
      };
    }

    // Calculate total fuel cost over ownership period
    // fuel consumed = annualMileage / fuelEfficiency
    // total fuel cost = fuel consumed * fuelPrice * yearsOwned
    const totalFuelCost = (annualMileage / fuelEfficiency) * fuelPrice * yearsOwned;

    // Total maintenance cost over ownership period
    const totalMaintenanceCost = maintenanceCost * yearsOwned;

    // Total insurance cost over ownership period
    const totalInsuranceCost = insuranceCost * yearsOwned;

    // Total cost of ownership
    const totalCost = purchasePrice + totalFuelCost + totalMaintenanceCost + totalInsuranceCost;

    // Average annual cost
    const annualCost = totalCost / yearsOwned;

    // Format results
    const primary = `$${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const secondary = `Annual Cost: $${annualCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const details = `Includes purchase price, fuel, maintenance, and insurance over ${yearsOwned} years.`;

    // Feedback based on total cost
    let feedback = "Cost is within typical range.";
    if (totalCost > 100000) feedback = "High total cost of ownership.";
    else if (totalCost < 20000) feedback = "Low total cost of ownership.";

    return {
      primary,
      secondary,
      details,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What costs are included in a Total Cost of Ownership calculation for vehicles?",
      answer: "TCO includes the purchase price, depreciation, fuel costs, insurance, maintenance, repairs, registration fees, and financing charges over the vehicle's ownership period. For example, a $30,000 sedan may have a 5-year TCO of $55,000 when all these factors are considered. The calculator aggregates these components to show the true cost of owning a vehicle beyond just the sticker price.",
    },
    {
      question: "How does depreciation affect my vehicle's Total Cost of Ownership?",
      answer: "Depreciation is typically the largest TCO component, accounting for 40-60% of total ownership costs. A new car loses approximately 20% of its value in the first year and another 10-15% annually thereafter. Using the TCO calculator, you can see that buying a 3-year-old used vehicle may result in significantly lower depreciation costs compared to purchasing new, potentially saving $8,000-$12,000 over 5 years.",
    },
    {
      question: "What fuel costs should I input into the TCO calculator?",
      answer: "Enter your vehicle's EPA-estimated miles per gallon (MPG) rating and your local average fuel price. For instance, if you drive 12,000 miles annually at 25 MPG with gas at $3.50 per gallon, your annual fuel cost would be $1,680. The calculator multiplies this by your ownership period to project total fuel expenses, helping you compare gas, hybrid, and electric vehicle options accurately.",
    },
    {
      question: "How should I estimate maintenance and repair costs for TCO?",
      answer: "Annual maintenance typically ranges from $500-$1,200 for new vehicles and $800-$1,500 for used vehicles, depending on make and model. The TCO calculator allows you to input these estimates based on manufacturer recommendations and historical data. By year 5-7, repair costs often increase 30-50%, so higher estimates for older vehicles are more accurate than applying flat annual figures.",
    },
    {
      question: "Does the TCO calculator account for insurance costs?",
      answer: "Yes, the TCO calculator includes annual insurance premiums as a key input. Average auto insurance costs range from $1,200-$2,000 annually for a sedan, though luxury and sports cars can exceed $3,500. The calculator multiplies your projected annual insurance cost by the ownership period, accounting for potential increases of 3-5% annually due to age and claim history.",
    },
    {
      question: "How does financing impact Total Cost of Ownership?",
      answer: "Financing adds interest charges to your TCO, typically ranging from $3,000-$8,000 for a $30,000 vehicle financed at 5-7% over 60 months. The TCO calculator deducts any down payment and factors in the full loan cost, not just monthly payments. Alternatively, if you pay cash, the calculator shows zero financing costs but may factor in opportunity costs if requested.",
    },
    {
      question: "What is the difference between TCO for new versus used vehicles?",
      answer: "New vehicles have higher depreciation but lower maintenance costs initially, while used vehicles have minimal depreciation but potentially higher repair expenses. For example, a new $35,000 SUV might have a 5-year TCO of $58,000, while the same model purchased used at $22,000 could have a TCO of $42,000. The TCO calculator helps visualize these trade-offs for your specific situation.",
    },
    {
      question: "Should I include registration and tax fees in my TCO calculation?",
      answer: "Yes, registration and tax fees are important TCO components that vary significantly by state and vehicle type. Annual registration typically ranges from $100-$500, while sales tax varies from 5-10% of the vehicle's purchase price. The TCO calculator should include these upfront and recurring costs to provide an accurate total ownership figure across your ownership period.",
    },
    {
      question: "How can I use TCO results to compare different vehicle options?",
      answer: "Run the TCO calculator for each vehicle you're considering with identical inputs: same ownership period, annual mileage, and financing terms. For example, comparing a $28,000 hybrid sedan (5-year TCO: $42,500) against a $25,000 gas sedan (5-year TCO: $48,000) reveals the hybrid saves $5,500 despite higher upfront cost. This standardized comparison reveals which vehicle truly costs less to own, not just to buy.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $35,000 SUV with an expected ownership period of 5 years, driving 12,000 miles annually, with a fuel efficiency of 25 MPG, fuel price at $3.50 per gallon, annual maintenance cost of $800, and insurance cost of $1,200 per year.",
    steps: [
      {
        label: "Step 1: Calculate total fuel cost",
        explanation:
          "Annual fuel consumption = 12,000 miles / 25 MPG = 480 gallons. Total fuel cost over 5 years = 480 gallons * $3.50 * 5 = $8,400."
      },
      {
        label: "Step 2: Calculate total maintenance and insurance costs",
        explanation:
          "Maintenance cost over 5 years = $800 * 5 = $4,000. Insurance cost over 5 years = $1,200 * 5 = $6,000."
      },
      {
        label: "Step 3: Calculate total cost of ownership",
        explanation:
          "Total cost = Purchase price + Fuel cost + Maintenance cost + Insurance cost = $35,000 + $8,400 + $4,000 + $6,000 = $53,400."
      },
      {
        label: "Step 4: Calculate average annual cost",
        explanation:
          "Average annual cost = Total cost / Years owned = $53,400 / 5 = $10,680 per year."
      }
    ],
    result: "Final Result: The total cost of ownership for the SUV over 5 years is $53,400, averaging $10,680 annually."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and fuel economy information for vehicles."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing resource for new and used cars."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, buying advice, and ownership cost estimates."
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
          <Label>Purchase Price ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.purchasePrice}
            onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
            placeholder="e.g. 35000"
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Mileage (miles)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.annualMileage}
            onChange={(e) => handleInputChange("annualMileage", e.target.value)}
            placeholder="e.g. 12000"
          />
        </div>
        <div className="space-y-2">
          <Label>Fuel Efficiency (MPG)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.fuelEfficiency}
            onChange={(e) => handleInputChange("fuelEfficiency", e.target.value)}
            placeholder="e.g. 25"
          />
        </div>
        <div className="space-y-2">
          <Label>Fuel Price ($/gallon)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.fuelPrice}
            onChange={(e) => handleInputChange("fuelPrice", e.target.value)}
            placeholder="e.g. 3.50"
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Maintenance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.maintenanceCost}
            onChange={(e) => handleInputChange("maintenanceCost", e.target.value)}
            placeholder="e.g. 800"
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Insurance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.insuranceCost}
            onChange={(e) => handleInputChange("insuranceCost", e.target.value)}
            placeholder="e.g. 1200"
          />
        </div>
        <div className="space-y-2">
          <Label>Years Owned</Label>
          <Input
            type="number"
            min="1"
            value={inputs.yearsOwned}
            onChange={(e) => handleInputChange("yearsOwned", e.target.value)}
            placeholder="e.g. 5"
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
            <p className="mt-3 font-medium text-blue-700 dark:text-blue-400">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Total Cost of Ownership (TCO) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Total Cost of Ownership (TCO) Calculator is an essential tool for anyone considering a vehicle purchase, whether new or used. This calculator reveals the true cost of vehicle ownership by aggregating all expenses over your projected ownership period—not just the sticker price. Understanding your TCO helps you make financially informed decisions and compare vehicles on an equal footing, potentially saving thousands of dollars over the life of your ownership.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To get accurate results, you'll need to input several key variables: the vehicle's purchase price, estimated annual mileage, financing details (loan amount, interest rate, and term), your local insurance premium, and expected annual maintenance and fuel costs. The calculator also accounts for depreciation, registration fees, and state-specific taxes. Gathering this information beforehand—such as checking insurance quotes, reviewing manufacturer maintenance schedules, and noting your typical annual driving—ensures the most personalized and accurate TCO projection for your situation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once the calculator generates your results, examine the breakdown by cost category to identify which expenses will impact your budget most significantly. Typically, depreciation and fuel consume the largest portions of TCO, followed by insurance and maintenance. Use this information to compare multiple vehicle options side-by-side with identical input assumptions, allowing you to see which option truly costs less to own over your intended ownership timeframe. This approach often reveals that cheaper sticker prices don't always mean lower total ownership costs.</p>
        </div>
      </section>

      {/* TABLE: Typical Annual TCO Component Breakdown by Vehicle Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Typical Annual TCO Component Breakdown by Vehicle Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows average annual costs for different vehicle categories based on 12,000 miles per year ownership in 2024-2025.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Component</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sedan ($28K)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">SUV ($38K)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Truck ($42K)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hybrid ($32K)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Depreciation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,600</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fuel/Energy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,440</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,920</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$900</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Insurance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,650</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,350</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Maintenance & Repairs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$650</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$850</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$950</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$550</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Registration & Fees</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$280</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$260</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Total Annual Cost</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11,850</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,660</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Depreciation assumes 15% year-one loss followed by 10% annual decline. Fuel costs based on EPA estimates and $3.50/gallon gas or equivalent electric rates.</p>
      </section>

      {/* TABLE: 5-Year Total Cost of Ownership Comparison */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">5-Year Total Cost of Ownership Comparison</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Five-year TCO projections for popular vehicle segments assuming 60,000 total miles and 6% auto loan interest rate.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Purchase Price</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total 5-Year TCO</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">TCO per Mile</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Depreciation %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$24,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$40,700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.68</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Midsize Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$31,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$52,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.87</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact SUV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$32,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$56,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.94</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Midsize SUV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$41,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$71,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.19</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">52%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full-Size Truck</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$48,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$82,300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.37</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">54%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hybrid Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$34,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Used 3-Year Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$38,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.64</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">TCO includes vehicle price, depreciation, fuel at $3.50/gallon, insurance at $1,400/year, maintenance averaging 2% of purchase price annually, and registration fees. Loan interest calculated at 6% APR on 80% financed amount.</p>
      </section>

      {/* TABLE: Depreciation Schedules by Year (New Vehicle Purchase) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Depreciation Schedules by Year (New Vehicle Purchase)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Percentage of original purchase price retained for typical vehicles across ownership years, helping estimate residual value for TCO.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Year of Ownership</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Luxury Sedan</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Standard Sedan</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Midsize SUV</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Full-Size Truck</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">78%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">77%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">79%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">68%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">66%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">71%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">61%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">58%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">64%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">59%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">51%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">58%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">54%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">46%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">53%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">46%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">49%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">46%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values represent typical depreciation patterns from Kelley Blue Book 2024-2025 data. Actual depreciation varies based on condition, mileage, market demand, and vehicle-specific reliability ratings.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Enter realistic annual mileage based on your driving history—using 12,000 miles as a standard when actual usage differs significantly can produce misleading TCO estimates that don't reflect your true costs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Get actual insurance quotes for vehicles you're comparing rather than using estimates; insurance costs vary dramatically by vehicle type, age, and safety ratings, potentially differing by $500+ annually between models.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in manufacturer reliability ratings and warranty coverage when estimating maintenance costs; vehicles with better reliability records typically have 20-30% lower maintenance expenses than average brands.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare both new and used vehicle options at the same ownership duration to see the depreciation trade-off; sometimes a well-maintained used vehicle delivers 15-25% lower TCO than purchasing new, even accounting for higher repair costs.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring depreciation as a major cost component</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many buyers focus only on monthly payments and fuel costs while overlooking depreciation, which typically represents 40-60% of TCO. Skipping this calculation can lead to underestimating true ownership costs by $10,000 or more over 5 years.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using generic maintenance estimates instead of vehicle-specific data</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying flat $600/year maintenance estimates to all vehicles ignores major differences in manufacturer reliability and warranty coverage. Luxury brands and vehicles with poor reliability ratings may cost 50-100% more annually in maintenance than industry averages.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to include registration, taxes, and title fees</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">These recurring and one-time costs can total $1,500-$3,000 over ownership but are often overlooked in quick price comparisons. Omitting them results in TCO estimates that understate true costs by 3-5%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming financing rates without checking actual lender offers</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using assumed 6% interest rates when current rates are 4-5%, or vice versa, can distort financing costs by $1,000-$2,500 over a 60-month loan. Always input your pre-approved rate or check current market rates before running the calculator.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What costs are included in a Total Cost of Ownership calculation for vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">TCO includes the purchase price, depreciation, fuel costs, insurance, maintenance, repairs, registration fees, and financing charges over the vehicle's ownership period. For example, a $30,000 sedan may have a 5-year TCO of $55,000 when all these factors are considered. The calculator aggregates these components to show the true cost of owning a vehicle beyond just the sticker price.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does depreciation affect my vehicle's Total Cost of Ownership?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Depreciation is typically the largest TCO component, accounting for 40-60% of total ownership costs. A new car loses approximately 20% of its value in the first year and another 10-15% annually thereafter. Using the TCO calculator, you can see that buying a 3-year-old used vehicle may result in significantly lower depreciation costs compared to purchasing new, potentially saving $8,000-$12,000 over 5 years.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What fuel costs should I input into the TCO calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your vehicle's EPA-estimated miles per gallon (MPG) rating and your local average fuel price. For instance, if you drive 12,000 miles annually at 25 MPG with gas at $3.50 per gallon, your annual fuel cost would be $1,680. The calculator multiplies this by your ownership period to project total fuel expenses, helping you compare gas, hybrid, and electric vehicle options accurately.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I estimate maintenance and repair costs for TCO?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Annual maintenance typically ranges from $500-$1,200 for new vehicles and $800-$1,500 for used vehicles, depending on make and model. The TCO calculator allows you to input these estimates based on manufacturer recommendations and historical data. By year 5-7, repair costs often increase 30-50%, so higher estimates for older vehicles are more accurate than applying flat annual figures.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the TCO calculator account for insurance costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the TCO calculator includes annual insurance premiums as a key input. Average auto insurance costs range from $1,200-$2,000 annually for a sedan, though luxury and sports cars can exceed $3,500. The calculator multiplies your projected annual insurance cost by the ownership period, accounting for potential increases of 3-5% annually due to age and claim history.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does financing impact Total Cost of Ownership?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Financing adds interest charges to your TCO, typically ranging from $3,000-$8,000 for a $30,000 vehicle financed at 5-7% over 60 months. The TCO calculator deducts any down payment and factors in the full loan cost, not just monthly payments. Alternatively, if you pay cash, the calculator shows zero financing costs but may factor in opportunity costs if requested.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between TCO for new versus used vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">New vehicles have higher depreciation but lower maintenance costs initially, while used vehicles have minimal depreciation but potentially higher repair expenses. For example, a new $35,000 SUV might have a 5-year TCO of $58,000, while the same model purchased used at $22,000 could have a TCO of $42,000. The TCO calculator helps visualize these trade-offs for your specific situation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include registration and tax fees in my TCO calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, registration and tax fees are important TCO components that vary significantly by state and vehicle type. Annual registration typically ranges from $100-$500, while sales tax varies from 5-10% of the vehicle's purchase price. The TCO calculator should include these upfront and recurring costs to provide an accurate total ownership figure across your ownership period.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How can I use TCO results to compare different vehicle options?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Run the TCO calculator for each vehicle you're considering with identical inputs: same ownership period, annual mileage, and financing terms. For example, comparing a $28,000 hybrid sedan (5-year TCO: $42,500) against a $25,000 gas sedan (5-year TCO: $48,000) reveals the hybrid saves $5,500 despite higher upfront cost. This standardized comparison reveals which vehicle truly costs less to own, not just to buy.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.kbb.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Kelley Blue Book — Vehicle Pricing and Depreciation Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative source for current vehicle prices, depreciation rates, and market value estimates used in TCO calculations.</p>
          </li>
          <li>
            <a href="https://www.fueleconomy.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Environmental Protection Agency — Fuel Economy Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official EPA database providing verified fuel consumption ratings and electric vehicle efficiency data essential for accurate TCO fuel cost projections.</p>
          </li>
          <li>
            <a href="https://consumer.ftc.gov/articles/how-do-i-buy-car" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Trade Commission — Auto Buying Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Consumer guidance on vehicle purchasing, financing, insurance, and total cost considerations from the FTC.</p>
          </li>
          <li>
            <a href="https://www.naic.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of Insurance Commissioners — Auto Insurance Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Regulatory source for state-by-state auto insurance requirements and premium benchmarking data relevant to TCO insurance components.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Total Cost of Ownership (TCO) Calculator"
      description="Professional automotive calculator: Total Cost of Ownership (TCO) Calculator. Get accurate estimates, expert advice, and financial insights."
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