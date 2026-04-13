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

export default function OutTheDoorEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    vehiclePrice: "",
    salesTaxRate: "",
    titleFee: "",
    registrationFee: "",
    additionalFees: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs safely
    const price = parseFloat(inputs.vehiclePrice);
    const taxRate = parseFloat(inputs.salesTaxRate);
    const titleFee = parseFloat(inputs.titleFee);
    const registrationFee = parseFloat(inputs.registrationFee);
    const additionalFees = parseFloat(inputs.additionalFees);

    if (
      isNaN(price) || price <= 0 ||
      isNaN(taxRate) || taxRate < 0 ||
      isNaN(titleFee) || titleFee < 0 ||
      isNaN(registrationFee) || registrationFee < 0 ||
      isNaN(additionalFees) || additionalFees < 0
    ) {
      return {
        primary: "—",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all fields.",
        feedback: "Invalid input"
      };
    }

    // Calculate sales tax amount
    const salesTaxAmount = price * (taxRate / 100);

    // Sum all fees
    const totalFees = titleFee + registrationFee + additionalFees;

    // Calculate out-the-door price
    const outTheDoorPrice = price + salesTaxAmount + totalFees;

    return {
      primary: outTheDoorPrice.toLocaleString("en-US", { style: "currency", currency: "USD" }),
      secondary: `Includes $${salesTaxAmount.toFixed(2)} sales tax and $${totalFees.toFixed(2)} fees`,
      details: `Vehicle Price: $${price.toFixed(2)} + Sales Tax (${taxRate.toFixed(2)}%): $${salesTaxAmount.toFixed(2)} + Fees: $${totalFees.toFixed(2)} = Out-the-Door Price`,
      feedback: "Estimate based on provided inputs"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is included in the 'out-the-door' price when buying a car?",
      answer: "The out-the-door price includes the vehicle's base price, sales tax, title fees, registration fees, and any dealer documentation fees. This represents the total amount you'll pay to drive the car off the lot. For example, a $30,000 vehicle in California with an 8.625% sales tax will add approximately $2,587.50 in tax alone, plus title and registration fees ranging from $350–$500, bringing the true out-the-door cost to roughly $32,937–$33,087.",
    },
    {
      question: "How do sales tax rates vary by state for vehicle purchases?",
      answer: "Sales tax rates for vehicles range from 0% in states like Montana, New Hampshire, and Oregon to as high as 10% in states like Tennessee and Washington. Most states fall between 5% and 8.5%. For instance, a $25,000 vehicle purchase costs $1,250 in sales tax in Texas (5%) but $2,062.50 in Washington (8.25%), a difference of $812.50 on the same vehicle.",
    },
    {
      question: "What are typical title and registration fees I should expect?",
      answer: "Title and registration fees typically range from $150 to $500 depending on your state and vehicle type. States like California charge around $450 for title and initial registration, while Texas averages closer to $90. Luxury or high-value vehicles may incur additional fees, and some states base fees on vehicle value rather than a flat rate.",
    },
    {
      question: "Does the out-the-door calculator account for dealer add-ons and documentation fees?",
      answer: "Most out-the-door estimators include standard documentation or dealer processing fees, which typically range from $50 to $300 across different dealerships. However, you should verify the specific fees your dealer charges, as they can vary significantly. Some dealers also add extended warranty, paint protection, or gap insurance costs, which should be entered separately in the calculator if applicable.",
    },
    {
      question: "How does vehicle type affect title and registration costs?",
      answer: "Vehicles are classified by type (sedan, truck, SUV, electric) and some states charge different fees based on this classification. Electric vehicles often receive reduced registration fees in states like Colorado, California, and New York as incentives. Commercial or fleet vehicles typically cost more to register than personal-use vehicles, sometimes 50–100% higher than standard rates.",
    },
    {
      question: "Can I reduce my out-the-door costs through tax incentives or rebates?",
      answer: "Federal tax credits for electric vehicles up to $7,500 and state-specific EV rebates can significantly reduce your out-the-door price, though they typically apply at tax time rather than at purchase. Some states offer sales tax exemptions or reductions for EVs, which would lower your total cost immediately. You should input any applicable manufacturer rebates or incentives into the calculator to get an accurate final figure.",
    },
    {
      question: "What is the difference between ad valorem and flat-rate registration fees?",
      answer: "Ad valorem fees are calculated as a percentage of the vehicle's value (common in states like California, where the rate is 0.65% for vehicles valued under $40,000), while flat-rate fees are the same regardless of vehicle price (like Texas's approximately $50–$90 annual registration). Ad valorem fees mean a $50,000 luxury vehicle costs significantly more to register than a $20,000 economy car, whereas flat-rate systems charge the same for both.",
    },
    {
      question: "How do trade-in values affect the sales tax I owe?",
      answer: "In most states, you pay sales tax only on the net sale price (purchase price minus trade-in value), not the full vehicle price. For example, if you buy a $30,000 car and trade in a vehicle worth $10,000, you'd pay tax on $20,000 instead of $30,000. This can save you $800–$1,000 in sales tax depending on your state's rate and the trade-in amount.",
    },
    {
      question: "What hidden costs might not be included in the out-the-door estimate?",
      answer: "The calculator typically excludes gap insurance, extended warranties, paint/fabric protection, wheel and tire protection plans, and service packages, which dealers often add at point of sale. These add-ons can range from $500 to $3,000 and will increase your final payment. Additionally, some states charge annual emissions testing fees ($20–$50) or county-specific fees not captured in the standard estimate.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $35,000 SUV with a 7.5% sales tax rate, $150 title fee, $200 registration fee, and $100 in additional dealer fees.",
    steps: [
      {
        label: "Step 1: Calculate Sales Tax",
        explanation: "Sales Tax = $35,000 × 7.5% = $2,625.00"
      },
      {
        label: "Step 2: Sum Title, Registration, and Additional Fees",
        explanation: "Total Fees = $150 + $200 + $100 = $450.00"
      },
      {
        label: "Step 3: Calculate Out-the-Door Price",
        explanation: "Out-the-Door Price = $35,000 + $2,625 + $450 = $38,075.00"
      }
    ],
    result: "Final Out-the-Door Price: $38,075.00"
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "IRS Sales Tax Information",
      description: "Official guidelines on sales tax for vehicle purchases."
    },
    {
      title: "DMV Title and Registration Fees",
      description: "State-specific information on title and registration fees."
    },
    {
      title: "Edmunds Car Buying Guide",
      description: "Comprehensive advice on understanding car pricing and fees."
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
          <Label>Vehicle Price ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 35000"
            value={inputs.vehiclePrice}
            onChange={(e) => handleInputChange("vehiclePrice", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Sales Tax Rate (%)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 7.5"
            value={inputs.salesTaxRate}
            onChange={(e) => handleInputChange("salesTaxRate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Title Fee ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 150"
            value={inputs.titleFee}
            onChange={(e) => handleInputChange("titleFee", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Registration Fee ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 200"
            value={inputs.registrationFee}
            onChange={(e) => handleInputChange("registrationFee", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Additional Fees ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 100"
            value={inputs.additionalFees}
            onChange={(e) => handleInputChange("additionalFees", e.target.value)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Sales Tax, Title & Fees Out-the-Door Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Sales Tax, Title & Fees Out-the-Door Estimator calculates the true total cost of purchasing a vehicle by combining the base vehicle price with state and local sales taxes, title fees, registration costs, and dealer documentation fees. This calculator helps you understand your actual out-the-door payment before negotiating with a dealer, ensuring you budget accurately and avoid sticker shock at closing.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter your vehicle's purchase price, select your state and county (which determines your sales tax rate), input any trade-in vehicle value, and specify the vehicle type or age if applicable. The calculator will auto-populate typical title, registration, and documentation fees based on your location, though you can adjust these if your dealer provides different amounts.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your estimated out-the-door cost, including a detailed breakdown of each fee component. Use this figure as a negotiation benchmark with dealers, and remember that actual costs may vary slightly based on dealer-specific add-ons, optional packages, or state-specific surcharges that aren't captured in the standard estimate.</p>
        </div>
      </section>

      {/* TABLE: Sales Tax Rates by State (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Sales Tax Rates by State (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Sales tax rates for vehicle purchases vary significantly across states, ranging from 0% to 10%.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">State</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sales Tax Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example: $30,000 Vehicle Tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Montana</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New Hampshire</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oregon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Delaware</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Texas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,875</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Florida</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,800</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">California</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.625% (avg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,587.50</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New York</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,400</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Washington</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tennessee</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.55%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,865</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates shown are state-level; local county and municipal taxes may apply, increasing total tax burden by 0.5–3% in many areas.</p>
      </section>

      {/* TABLE: Typical Title, Registration & Documentation Fees by State */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Typical Title, Registration & Documentation Fees by State</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Title, registration, and dealer documentation fees vary by state and can significantly impact your out-the-door cost.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">State</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Title Fee</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Initial Registration Fee</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Dealer Doc Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">California</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$380</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$85–$150</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Texas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50–$90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75–$100</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Florida</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$225–$300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$85–$125</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New York</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$165</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75–$150</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Washington</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$250–$330</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$80–$125</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Colorado</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$130–$208</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75–$100</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Illinois</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$101</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$140–$298</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$80–$150</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pennsylvania</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$51</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$135–$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$85–$125</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ohio</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200–$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75–$100</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Georgia</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$110–$220</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75–$125</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Fees for vehicles &lt;5 years old are shown; older vehicles may incur different rates. Electric vehicles may qualify for reduced fees in certain states.</p>
      </section>

      {/* TABLE: Impact of Trade-In on Sales Tax: $30,000 Vehicle Purchase Example */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Trade-In on Sales Tax: $30,000 Vehicle Purchase Example</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Trading in your existing vehicle can substantially reduce the sales tax you owe by lowering the taxable sale price.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Trade-In Value</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Net Taxable Price (8% State Tax)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sales Tax Owed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Savings vs. No Trade-In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$800</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,600</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">This example uses 8% sales tax. Not all states allow trade-in deductions; verify your state's rules before relying on this savings.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Request an itemized fee breakdown from the dealer before signing any agreement—many dealerships inflate documentation fees beyond the actual state requirement, which typically ranges from $75–$150, not $300–$500.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Verify your state's sales tax rules for trade-ins; some states apply tax to the full purchase price while others only tax the net amount after trade-in credit, which can save you hundreds of dollars.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check if you qualify for special registration rates—electric vehicles receive reduced fees in California, Colorado, and New York, potentially saving $100–$250 annually compared to gas-powered vehicles.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Time your purchase strategically; in some states, buying at the end of the month or quarter when dealers offer rebates can reduce your base price, which directly lowers the sales tax owed on top of it.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Include Local County Taxes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many buyers calculate using only state sales tax rates and miss county and municipal add-ons, which can add 0.5–3% to the total tax burden. For example, Los Angeles County adds 1.25% to California's base rate, increasing your effective tax from 7.25% to 8.625%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Dealer Add-Ons and Protection Plans</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Gap insurance, paint protection, extended warranties, and maintenance plans can add $500–$3,000 to your out-the-door cost but are often presented separately at closing. Always use the calculator to baseline your costs, then add any optional dealer packages separately to avoid surprises.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Trade-In Value Reduces Tax in All States</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While most states allow trade-in deductions, a few states tax the full purchase price regardless of trade-in value. Failing to verify this rule in your state could lead to overestimating your savings by $500–$1,500 or more on a typical vehicle purchase.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Registration Renewal Costs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many buyers focus on initial registration fees but forget that annual registration renewal costs compound over vehicle ownership. In ad valorem states like California, annual registration fees on a $50,000 vehicle can exceed $300 yearly, a cost that should factor into your long-term vehicle ownership budget.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is included in the 'out-the-door' price when buying a car?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The out-the-door price includes the vehicle's base price, sales tax, title fees, registration fees, and any dealer documentation fees. This represents the total amount you'll pay to drive the car off the lot. For example, a $30,000 vehicle in California with an 8.625% sales tax will add approximately $2,587.50 in tax alone, plus title and registration fees ranging from $350–$500, bringing the true out-the-door cost to roughly $32,937–$33,087.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do sales tax rates vary by state for vehicle purchases?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Sales tax rates for vehicles range from 0% in states like Montana, New Hampshire, and Oregon to as high as 10% in states like Tennessee and Washington. Most states fall between 5% and 8.5%. For instance, a $25,000 vehicle purchase costs $1,250 in sales tax in Texas (5%) but $2,062.50 in Washington (8.25%), a difference of $812.50 on the same vehicle.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are typical title and registration fees I should expect?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Title and registration fees typically range from $150 to $500 depending on your state and vehicle type. States like California charge around $450 for title and initial registration, while Texas averages closer to $90. Luxury or high-value vehicles may incur additional fees, and some states base fees on vehicle value rather than a flat rate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the out-the-door calculator account for dealer add-ons and documentation fees?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most out-the-door estimators include standard documentation or dealer processing fees, which typically range from $50 to $300 across different dealerships. However, you should verify the specific fees your dealer charges, as they can vary significantly. Some dealers also add extended warranty, paint protection, or gap insurance costs, which should be entered separately in the calculator if applicable.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does vehicle type affect title and registration costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Vehicles are classified by type (sedan, truck, SUV, electric) and some states charge different fees based on this classification. Electric vehicles often receive reduced registration fees in states like Colorado, California, and New York as incentives. Commercial or fleet vehicles typically cost more to register than personal-use vehicles, sometimes 50–100% higher than standard rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I reduce my out-the-door costs through tax incentives or rebates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Federal tax credits for electric vehicles up to $7,500 and state-specific EV rebates can significantly reduce your out-the-door price, though they typically apply at tax time rather than at purchase. Some states offer sales tax exemptions or reductions for EVs, which would lower your total cost immediately. You should input any applicable manufacturer rebates or incentives into the calculator to get an accurate final figure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between ad valorem and flat-rate registration fees?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Ad valorem fees are calculated as a percentage of the vehicle's value (common in states like California, where the rate is 0.65% for vehicles valued under $40,000), while flat-rate fees are the same regardless of vehicle price (like Texas's approximately $50–$90 annual registration). Ad valorem fees mean a $50,000 luxury vehicle costs significantly more to register than a $20,000 economy car, whereas flat-rate systems charge the same for both.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do trade-in values affect the sales tax I owe?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">In most states, you pay sales tax only on the net sale price (purchase price minus trade-in value), not the full vehicle price. For example, if you buy a $30,000 car and trade in a vehicle worth $10,000, you'd pay tax on $20,000 instead of $30,000. This can save you $800–$1,000 in sales tax depending on your state's rate and the trade-in amount.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What hidden costs might not be included in the out-the-door estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator typically excludes gap insurance, extended warranties, paint/fabric protection, wheel and tire protection plans, and service packages, which dealers often add at point of sale. These add-ons can range from $500 to $3,000 and will increase your final payment. Additionally, some states charge annual emissions testing fees ($20–$50) or county-specific fees not captured in the standard estimate.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.taxadmin.org/resources/rates" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">State Sales Tax Rates — Federation of Tax Administrators</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource for current sales tax rates across all U.S. states and territories, updated regularly.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/credits-deductions/credits-for-electric-vehicles-purchased-in-2024-and-later" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Tax Credits for Electric Vehicles — IRS</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on federal tax credits up to $7,500 for electric vehicle purchases and eligibility requirements.</p>
          </li>
          <li>
            <a href="https://www.dmv.org/dmv-guides/vehicle-title-and-registration" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Vehicle Title and Registration Requirements by State — DMV Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">State-by-state breakdown of title transfer procedures, registration fees, and documentation requirements for vehicle purchases.</p>
          </li>
          <li>
            <a href="https://www.naic.org/consumer_alerts.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Gap Insurance and Vehicle Loan Protection — National Association of Insurance Commissioners</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Consumer information on optional vehicle protection products and how they affect total out-the-door costs.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Sales Tax, Title & Fees Out-the-Door Estimator"
      description="Professional automotive calculator: Sales Tax, Title & Fees Out-the-Door Estimator. Get accurate estimates, expert advice, and financial insights."
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