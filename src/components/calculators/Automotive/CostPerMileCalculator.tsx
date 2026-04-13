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

export default function CostPerMileCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    purchasePrice: "",
    annualMiles: "",
    annualFuelCost: "",
    annualMaintenanceCost: "",
    annualInsuranceCost: "",
    annualDepreciationCost: "",
    annualOtherCosts: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const purchasePrice = parseFloat(inputs.purchasePrice);
    const annualMiles = parseFloat(inputs.annualMiles);
    const annualFuelCost = parseFloat(inputs.annualFuelCost);
    const annualMaintenanceCost = parseFloat(inputs.annualMaintenanceCost);
    const annualInsuranceCost = parseFloat(inputs.annualInsuranceCost);
    const annualDepreciationCost = parseFloat(inputs.annualDepreciationCost);
    const annualOtherCosts = parseFloat(inputs.annualOtherCosts);

    // Validate inputs
    if (
      isNaN(purchasePrice) || purchasePrice <= 0 ||
      isNaN(annualMiles) || annualMiles <= 0
    ) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for purchase price and annual miles.",
        feedback: "Invalid input"
      };
    }

    // Sum all annual costs (fuel, maintenance, insurance, depreciation, others)
    const totalAnnualCosts =
      (isNaN(annualFuelCost) ? 0 : annualFuelCost) +
      (isNaN(annualMaintenanceCost) ? 0 : annualMaintenanceCost) +
      (isNaN(annualInsuranceCost) ? 0 : annualInsuranceCost) +
      (isNaN(annualDepreciationCost) ? 0 : annualDepreciationCost) +
      (isNaN(annualOtherCosts) ? 0 : annualOtherCosts);

    // Calculate cost per mile or km
    const costPerUnit = totalAnnualCosts / annualMiles;

    // Format results
    const unitLabel = inputs.unit === "imperial" ? "mile" : "kilometer";
    const primary = costPerUnit.toFixed(4);
    const secondary = `$${costPerUnit.toFixed(2)} per ${unitLabel}`;
    const details = `Total annual costs: $${totalAnnualCosts.toFixed(2)} ÷ Annual ${unitLabel}s: ${annualMiles.toLocaleString()}`;

    return {
      primary,
      secondary,
      details,
      feedback: "Calculation based on your inputs"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is cost per mile and why should I calculate it?",
      answer: "Cost per mile (CPM) is the total expense you incur to operate your vehicle divided by the number of miles driven. This metric helps you understand your true driving costs, which is essential for budgeting, comparing vehicle efficiency, and making informed decisions about vehicle purchases or usage. For example, if you spend $3,000 annually on a vehicle that travels 12,000 miles, your CPM is $0.25 per mile.",
    },
    {
      question: "What expenses should I include in my cost per mile calculation?",
      answer: "You should include fuel, insurance, maintenance, repairs, registration and licensing fees, depreciation, and tolls. Some drivers also factor in parking costs and roadside assistance fees. For a comprehensive calculation, the IRS standard mileage rate of $0.67 per mile (2024) accounts for all these factors combined. Excluding depreciation often underestimates true vehicle costs by 30-40%.",
    },
    {
      question: "How does the IRS mileage rate compare to my calculated cost per mile?",
      answer: "The IRS standard mileage rate of $0.67 per mile (2024) includes fuel, depreciation, insurance, maintenance, and repairs combined. If your calculated CPM is significantly lower, you may be underestimating depreciation or not accounting for all expenses. If your CPM exceeds $0.67, your vehicle may be costlier than average, suggesting you should evaluate fuel efficiency or maintenance spending.",
    },
    {
      question: "Does cost per kilometer differ significantly from cost per mile?",
      answer: "One kilometer equals approximately 0.621 miles, so cost per kilometer will be roughly 61% higher as a numerical value than cost per mile for the same vehicle. For example, $0.40 per mile converts to approximately $0.64 per kilometer. This conversion is purely mathematical and doesn't reflect actual cost differences; it's simply how distances are measured in different regions.",
    },
    {
      question: "How can I reduce my cost per mile?",
      answer: "Improve fuel efficiency by maintaining proper tire pressure (which can boost MPG by 3-5%), regular oil changes, and reducing idling. Consider carpooling or combining trips to spread fixed costs across more miles. Additionally, shopping for competitive insurance rates can save 15-25% annually, and routine maintenance prevents costly repairs that spike CPM. Switching to a more fuel-efficient vehicle can reduce CPM by 30-50% depending on your current vehicle.",
    },
    {
      question: "What is a typical cost per mile for different vehicle types?",
      answer: "Sedans typically range from $0.50-$0.70 per mile, SUVs from $0.70-$1.00 per mile, and trucks from $0.80-$1.20 per mile. Hybrids can achieve $0.40-$0.60 per mile, while electric vehicles may cost $0.15-$0.35 per mile when accounting for lower fuel and maintenance costs. These ranges assume average insurance rates, regular maintenance, and typical depreciation over a 10-year ownership period.",
    },
    {
      question: "How should I account for depreciation in my cost per mile calculation?",
      answer: "Depreciation is typically the largest component of vehicle ownership costs, often representing 40-50% of total CPM. To calculate it, subtract your vehicle's current value from its purchase price and divide by total miles driven or expected lifetime miles (typically 150,000-200,000 miles). For example, if you purchased a car for $25,000, it's now worth $15,000 after 50,000 miles, your depreciation CPM is $0.20 per mile.",
    },
    {
      question: "Can I use cost per mile to compare leasing versus buying?",
      answer: "Yes, cost per mile is an excellent metric for this comparison. A lease might cost $0.35-$0.50 per mile including the monthly payment, maintenance, and insurance, while ownership might cost $0.55-$0.80 per mile when factoring in depreciation. High-mileage drivers typically benefit from buying, while low-mileage drivers (&lt;12,000 miles annually) often save money leasing since they avoid depreciation risk.",
    },
    {
      question: "How do fuel prices impact my cost per mile?",
      answer: "Fuel costs directly affect CPM based on your vehicle's fuel economy and current gas prices. If you drive a vehicle with 25 MPG and gas costs $3.50 per gallon, fuel contributes $0.14 per mile; at $4.50 per gallon, it increases to $0.18 per mile. A 10% increase in fuel prices typically raises overall CPM by 2-3% since fuel represents only 20-30% of total vehicle costs, though this percentage is higher for less expensive vehicles.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $35,000 SUV with average annual driving of 12,000 miles, including fuel, maintenance, insurance, depreciation, and other costs.",
    steps: [
      {
        label: "Step 1: Gather Annual Costs",
        explanation:
          "Fuel cost: $1,800, Maintenance: $600, Insurance: $1,200, Depreciation: $3,000, Other costs: $400. Total annual costs = 1800 + 600 + 1200 + 3000 + 400 = $7,000."
      },
      {
        label: "Step 2: Calculate Cost Per Mile",
        explanation:
          "Divide total annual costs by annual miles: $7,000 ÷ 12,000 miles = $0.5833 per mile."
      }
    ],
    result: "Final Result: The cost per mile for this SUV is approximately $0.58 per mile."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and fuel cost estimates."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing resource."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, ownership costs, and advice."
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
            <SelectItem value="imperial">Imperial (Miles)</SelectItem>
            <SelectItem value="metric">Metric (Kilometers)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Purchase Price of Vehicle ($)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 35000"
            value={inputs.purchasePrice}
            onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Distance Driven ({inputs.unit === "imperial" ? "Miles" : "Kilometers"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 12000"
            value={inputs.annualMiles}
            onChange={(e) => handleInputChange("annualMiles", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Fuel Cost ($)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 1800"
            value={inputs.annualFuelCost}
            onChange={(e) => handleInputChange("annualFuelCost", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Maintenance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 600"
            value={inputs.annualMaintenanceCost}
            onChange={(e) => handleInputChange("annualMaintenanceCost", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Insurance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 1200"
            value={inputs.annualInsuranceCost}
            onChange={(e) => handleInputChange("annualInsuranceCost", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Depreciation Cost ($)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 3000"
            value={inputs.annualDepreciationCost}
            onChange={(e) => handleInputChange("annualDepreciationCost", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Other Annual Costs ($)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 400"
            value={inputs.annualOtherCosts}
            onChange={(e) => handleInputChange("annualOtherCosts", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cost Per Mile (Per Kilometer) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Cost Per Mile (Per Kilometer) Calculator is designed to help you determine the true expense of operating your vehicle by dividing your total ownership and operating costs by miles or kilometers driven. This metric is invaluable for understanding whether your vehicle is economical, comparing different vehicles before purchase, and tracking how your driving habits affect total costs. Knowing your CPM empowers you to make data-driven decisions about vehicle maintenance, fuel efficiency improvements, and whether to keep or replace your current vehicle.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you'll need to gather four key inputs: your total annual vehicle costs (including fuel, insurance, maintenance, repairs, registration, and depreciation), the total miles or kilometers you drive annually, the type of vehicle or fuel type (optional, for context), and the time period for your calculation. The calculator accepts both annual figures and lifetime costs; if using lifetime data, enter your total miles driven over the vehicle's ownership period. Each input directly influences your final CPM, so accuracy in gathering expense data is critical to obtaining meaningful results.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once calculated, your cost per mile result should be interpreted in context of vehicle type, age, and driving patterns. Compare your result to the IRS standard mileage rate of $0.67 per mile (2024) or industry benchmarks for your vehicle category to assess whether your costs are typical. A CPM significantly higher than benchmarks suggests you may benefit from improved maintenance, shopping for better insurance rates, or evaluating fuel efficiency upgrades. Track your CPM over time to identify trends and validate whether changes in driving or maintenance routines are delivering expected cost reductions.</p>
        </div>
      </section>

      {/* TABLE: Average Cost Per Mile by Vehicle Type (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Cost Per Mile by Vehicle Type (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical cost per mile calculations across common vehicle categories, including all ownership expenses.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Mileage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Annual Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Per Mile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedan (Mid-size)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.60</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact Car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.45</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">SUV (Standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.85</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Truck (Full-size)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.95</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hybrid Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,160</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.43</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Electric Vehicle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.30</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Luxury Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$13,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.10</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Minivan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.70</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Estimates include fuel, insurance, maintenance, repairs, depreciation, and registration for vehicles in their first 5 years of ownership. Actual costs vary by location, driving habits, and specific insurance rates.</p>
      </section>

      {/* TABLE: IRS Standard Mileage Rates and Cost Components (2024) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">IRS Standard Mileage Rates and Cost Components (2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">The IRS standard mileage rate provides a simplified method for calculating business vehicle costs and serves as a benchmark for all vehicle expenses.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mileage Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rate Per Mile</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primary Use</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard Business</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.67</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">General business driving</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">January 2024</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medical/Charitable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medical appointments and charity work</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">January 2024</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Armed Forces Active Duty</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Military personnel relocation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">January 2024</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Historical Rate (2023)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.655</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reference comparison</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">January 2023</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Historical Rate (2022)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.585</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reference comparison</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">January 2022</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Business mileage rates can be deducted on federal taxes. Rates typically increase annually to account for fuel price changes and inflation.</p>
      </section>

      {/* TABLE: Cost Per Kilometer Conversions (2024 Benchmarks) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Cost Per Kilometer Conversions (2024 Benchmarks)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table converts cost per mile figures to cost per kilometer for international reference and comparison.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Per Mile</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Per Kilometer</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Region Using CPK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedan (Average)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.94</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Canada, Europe, Australia</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact Car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Canada, Europe, Australia</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">SUV (Standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Canada, Europe, Australia</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Electric Vehicle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.47</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Canada, Europe, Australia</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Truck (Average)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Canada, Europe, Australia</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">IRS Standard Rate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.67</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.05</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">USA Business Benchmark</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Conversion factor: 1 mile = 1.609 kilometers. Cost per kilometer multiplied by 1.609 equals cost per mile for direct comparison.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Include depreciation in your cost per mile calculation, not just fuel and maintenance—depreciation typically represents 40-50% of total vehicle costs and is often overlooked by drivers calculating only variable expenses.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Calculate your cost per mile quarterly or semi-annually to track trends and identify when maintenance spikes or fuel prices significantly impact your true driving costs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use your calculated CPM to evaluate business use deductions or mileage reimbursement from employers; if your CPM exceeds the IRS rate of $0.67 per mile (2024), you should be claiming every business mile driven.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare cost per mile before and after major maintenance or repairs to quantify the financial impact—if CPM jumps more than 10% after a repair, investigate whether the work was necessary or competitively priced.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Depreciation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many drivers only count fuel and maintenance in CPM calculations, missing depreciation—which typically accounts for 40-50% of total vehicle costs. Excluding depreciation can underestimate true CPM by 30-40%, leading to poor vehicle comparison decisions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Incorrect Annual Mileage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Underestimating or overestimating miles driven distorts CPM significantly; a 20% mileage error can swing CPM by 15-20%. Use actual odometer readings or GPS tracking data rather than estimates to ensure accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Fixed Costs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Excluding insurance, registration, and licensing fees understates CPM because these fixed costs must be spread across your miles driven. A driver traveling 6,000 miles annually has double the CPM impact from fixed costs compared to someone driving 12,000 miles.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing Lifetime and Annual Figures</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Combining annual fuel costs with lifetime depreciation or vice versa produces meaningless CPM calculations. Ensure all cost inputs cover the same time period—either annual costs divided by annual miles, or total lifetime costs divided by total lifetime miles.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is cost per mile and why should I calculate it?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cost per mile (CPM) is the total expense you incur to operate your vehicle divided by the number of miles driven. This metric helps you understand your true driving costs, which is essential for budgeting, comparing vehicle efficiency, and making informed decisions about vehicle purchases or usage. For example, if you spend $3,000 annually on a vehicle that travels 12,000 miles, your CPM is $0.25 per mile.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What expenses should I include in my cost per mile calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You should include fuel, insurance, maintenance, repairs, registration and licensing fees, depreciation, and tolls. Some drivers also factor in parking costs and roadside assistance fees. For a comprehensive calculation, the IRS standard mileage rate of $0.67 per mile (2024) accounts for all these factors combined. Excluding depreciation often underestimates true vehicle costs by 30-40%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the IRS mileage rate compare to my calculated cost per mile?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The IRS standard mileage rate of $0.67 per mile (2024) includes fuel, depreciation, insurance, maintenance, and repairs combined. If your calculated CPM is significantly lower, you may be underestimating depreciation or not accounting for all expenses. If your CPM exceeds $0.67, your vehicle may be costlier than average, suggesting you should evaluate fuel efficiency or maintenance spending.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does cost per kilometer differ significantly from cost per mile?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">One kilometer equals approximately 0.621 miles, so cost per kilometer will be roughly 61% higher as a numerical value than cost per mile for the same vehicle. For example, $0.40 per mile converts to approximately $0.64 per kilometer. This conversion is purely mathematical and doesn't reflect actual cost differences; it's simply how distances are measured in different regions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How can I reduce my cost per mile?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Improve fuel efficiency by maintaining proper tire pressure (which can boost MPG by 3-5%), regular oil changes, and reducing idling. Consider carpooling or combining trips to spread fixed costs across more miles. Additionally, shopping for competitive insurance rates can save 15-25% annually, and routine maintenance prevents costly repairs that spike CPM. Switching to a more fuel-efficient vehicle can reduce CPM by 30-50% depending on your current vehicle.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a typical cost per mile for different vehicle types?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Sedans typically range from $0.50-$0.70 per mile, SUVs from $0.70-$1.00 per mile, and trucks from $0.80-$1.20 per mile. Hybrids can achieve $0.40-$0.60 per mile, while electric vehicles may cost $0.15-$0.35 per mile when accounting for lower fuel and maintenance costs. These ranges assume average insurance rates, regular maintenance, and typical depreciation over a 10-year ownership period.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I account for depreciation in my cost per mile calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Depreciation is typically the largest component of vehicle ownership costs, often representing 40-50% of total CPM. To calculate it, subtract your vehicle's current value from its purchase price and divide by total miles driven or expected lifetime miles (typically 150,000-200,000 miles). For example, if you purchased a car for $25,000, it's now worth $15,000 after 50,000 miles, your depreciation CPM is $0.20 per mile.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use cost per mile to compare leasing versus buying?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, cost per mile is an excellent metric for this comparison. A lease might cost $0.35-$0.50 per mile including the monthly payment, maintenance, and insurance, while ownership might cost $0.55-$0.80 per mile when factoring in depreciation. High-mileage drivers typically benefit from buying, while low-mileage drivers (&lt;12,000 miles annually) often save money leasing since they avoid depreciation risk.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do fuel prices impact my cost per mile?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Fuel costs directly affect CPM based on your vehicle's fuel economy and current gas prices. If you drive a vehicle with 25 MPG and gas costs $3.50 per gallon, fuel contributes $0.14 per mile; at $4.50 per gallon, it increases to $0.18 per mile. A 10% increase in fuel prices typically raises overall CPM by 2-3% since fuel represents only 20-30% of total vehicle costs, though this percentage is higher for less expensive vehicles.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/tax-professionals/standard-mileage-rates" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Standard Mileage Rates for 2024</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on standard mileage rates for business, medical, and charitable driving, updated annually.</p>
          </li>
          <li>
            <a href="https://www.bts.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bureau of Transportation Statistics – Vehicle Operating Costs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">U.S. Department of Transportation data on average vehicle operating costs and transportation trends by vehicle type.</p>
          </li>
          <li>
            <a href="https://www.aaa.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Automobile Association (AAA) Driving Costs Study</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive annual analysis of vehicle ownership and operating costs across sedan, SUV, truck, and hybrid categories.</p>
          </li>
          <li>
            <a href="https://fred.stlouisfed.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve Economic Data – Gasoline Prices</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Historical gasoline price data and economic indicators for tracking fuel cost trends and inflation impact on vehicle expenses.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cost Per Mile (Per Kilometer) Calculator"
      description="Professional automotive calculator: Cost Per Mile (Per Kilometer) Calculator. Get accurate estimates, expert advice, and financial insights."
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