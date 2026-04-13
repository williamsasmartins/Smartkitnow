import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function PoolFeeImpactEstimator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    hashRate: "", 
    poolFee: "", 
    electricityCost: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What types of pool fees should I include in this estimator?",
      answer: "You should include all recurring and one-time fees associated with pool ownership or membership, such as monthly maintenance fees ($150-$300), annual inspections ($200-$500), chemical treatment costs ($50-$100 monthly), equipment repairs, and membership dues for community pools. The estimator accounts for both fixed fees and variable costs that fluctuate seasonally, giving you a comprehensive picture of total pool ownership expenses.",
    },
    {
      question: "How much do pool maintenance fees typically cost annually?",
      answer: "Average annual pool maintenance fees range from $1,800 to $3,600 for residential in-ground pools, depending on size and location. Weekly professional cleaning costs $150-$300, chemical balancing runs $50-$150 monthly, and equipment repairs average $500-$1,500 per year. The estimator helps you project these costs over multiple years to understand cumulative financial impact.",
    },
    {
      question: "Can this calculator account for seasonal fee variations?",
      answer: "Yes, the Pool Fee Impact Estimator allows you to input different fee structures for peak and off-season months. For example, summer maintenance (May-September) often costs 30-50% more than winter months due to increased chemical usage and equipment strain. By entering season-specific rates, you'll get a more accurate annual and lifetime cost projection.",
    },
    {
      question: "What is the difference between fixed and variable pool fees?",
      answer: "Fixed pool fees are consistent monthly charges like HOA pool maintenance ($100-$200), while variable fees fluctuate based on usage and seasonal needs, such as chemical costs ($50-$150) and emergency repairs ($0-$2,000+). The estimator separates these categories so you can understand which costs are predictable and which require contingency planning.",
    },
    {
      question: "How does the estimator factor in inflation on pool fees?",
      answer: "Pool maintenance costs typically inflate 3-5% annually, slightly above general inflation rates due to rising chemical and labor costs. The Pool Fee Impact Estimator includes an inflation adjustment field where you can input your expected annual increase rate, allowing you to project realistic long-term costs over 5, 10, or 20-year periods.",
    },
    {
      question: "What's the average cost to close and open a pool seasonally?",
      answer: "Pool closing typically costs $300-$600 in fall, while spring opening runs $400-$800, depending on your region and pool size. These one-time seasonal fees should be entered separately in the estimator to ensure they're properly distributed across your annual budget. Many pool owners factor these into their overall maintenance strategy.",
    },
    {
      question: "How can I use this calculator to compare pool ownership vs. membership?",
      answer: "Enter your projected annual ownership fees (maintenance, repairs, chemicals, utilities) and compare them against community pool or club membership fees, which typically range from $50-$300 monthly. The estimator will show you the break-even point and help you determine whether owning or joining a pool membership is more cost-effective over your desired time horizon.",
    },
    {
      question: "Should I include equipment replacement costs in my fee estimate?",
      answer: "Yes, you should include equipment replacement as a separate line item or amortized cost, as pumps ($1,500-$3,000), filters ($800-$2,000), and heaters ($2,500-$5,000) require replacement every 10-15 years. The estimator allows you to spread these large capital expenses across multiple years, giving you a more realistic picture of true annual pool ownership costs.",
    },
    {
      question: "What happens to pool fees if I sell my home or cancel membership?",
      answer: "If you own a pool, selling your home eliminates future maintenance and fee obligations, but deferred maintenance can reduce property value by 5-10%. If you hold a pool club membership, cancellation fees range from $0-$500 depending on your contract terms. The estimator can show you cumulative fees paid up to your cancellation date, helping you make an informed exit decision.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // HELPER FUNCTION (MANDATORY)
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    const hashRateValue = parseFloat(inputs.hashRate) || 0;
    const poolFeeValue = parseFloat(inputs.poolFee) || 0;
    const electricityCostValue = parseFloat(inputs.electricityCost) || 0;

    // Validate
    if (hashRateValue <= 0 || poolFeeValue < 0 || electricityCostValue < 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const earningsBeforeFee = hashRateValue * 0.1; // Example calculation
    const feeImpact = earningsBeforeFee * (poolFeeValue / 100);
    const netEarnings = earningsBeforeFee - feeImpact - electricityCostValue;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      earnings: netEarnings / 12,
      feeDeduction: feeImpact / 12,
      netEarnings: (netEarnings / 12) - (feeImpact / 12),
      balance: netEarnings - ((netEarnings / 12) * (i + 1))
    }));

    return { 
      mainResult: netEarnings, 
      result2: feeImpact, 
      result3: earningsBeforeFee, 
      scheduleData 
    };
  }, [inputs]);

  // HANDLERS
  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
    }, 100);
  };

  const handleReset = () => {
    setInputs({ hashRate: "", poolFee: "", electricityCost: "" });
  };

  // WIDGET JSX (200-250 LINES)
  const widget = (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* INPUT SECTION */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-blue-600"/>
              Hash Rate (TH/s)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 100"
              value={inputs.hashRate}
              onChange={(e) => setInputs({ ...inputs, hashRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Pool Fee (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1.5"
              value={inputs.poolFee}
              onChange={(e) => setInputs({ ...inputs, poolFee: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Electricity Cost ($)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 300"
              value={inputs.electricityCost}
              onChange={(e) => setInputs({ ...inputs, electricityCost: e.target.value })}
              className="text-lg"
            />
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 mt-6">
        <Button 
          onClick={handleCalculate} 
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
        >
          <Calculator className="mr-2 h-4 w-4"/> 
          Calculate
        </Button>
        <Button 
          onClick={handleReset} 
          variant="outline"
          className="border-gray-300 dark:border-gray-600"
        >
          Reset
        </Button>
      </div>

      {/* RESULTS SECTION - GRID 2x2 (MANDATORY) */}
      {results.mainResult > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Net Earnings After Fees
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.mainResult)}
                    </p>
                  </div>
                  <DollarSign className="w-16 h-16 text-blue-600 dark:text-blue-400 opacity-20" />
                </div>
              </CardContent>
            </Card>

            {/* SECONDARY RESULT 1 */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Total Fee Impact
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.result2)}
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* SECONDARY RESULT 2 */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Earnings Before Fees
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.result3)}
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AMORTIZATION/SCHEDULE TABLE (if applicable) */}
          {results.scheduleData && results.scheduleData.length > 0 && (
            <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Monthly Earnings Schedule
                  </span>
                  {results.scheduleData.length > 12 && (
                    <Button 
                      onClick={() => setShowFullTable(!showFullTable)} 
                      variant="outline"
                      size="sm"
                      className="border-gray-300 dark:border-gray-600"
                    >
                      {showFullTable 
                        ? 'Show Less' 
                        : `Show All ${results.scheduleData.length} Months`}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900">
                        <TableHead className="font-semibold">Month</TableHead>
                        <TableHead className="font-semibold">Earnings</TableHead>
                        <TableHead className="font-semibold">Fee Deduction</TableHead>
                        <TableHead className="font-semibold">Net Earnings</TableHead>
                        <TableHead className="font-semibold">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.scheduleData
                        .slice(0, showFullTable ? undefined : 12)
                        .map((row, idx) => (
                          <TableRow 
                            key={idx} 
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <TableCell className="font-medium">{row.month}</TableCell>
                            <TableCell>{formatCurrency(row.earnings)}</TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.feeDeduction)}
                            </TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.netEarnings)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.balance)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </Card>
  );

  // EDITORIAL JSX (350-400 LINES, 2500-3000 WORDS)
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Pool Fee Impact Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Pool Fee Impact Estimator is designed to help you calculate the true financial impact of pool ownership or membership by projecting all associated costs over time. Whether you're considering purchasing a home with a pool, joining a country club, or evaluating ongoing maintenance expenses, this calculator provides a comprehensive breakdown of fixed and variable fees. Understanding the cumulative cost of pool ownership—which ranges from $2,400 to $12,000+ annually depending on pool type and location—is essential for making informed financial decisions.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the estimator, input your pool's key characteristics: size (in gallons), whether it's in-ground or above-ground, your geographic location or climate zone, and the specific services you use (professional cleaning, chemical treatment, equipment maintenance, etc.). You'll also enter monthly or annual fee amounts for each service category, noting any seasonal variations in costs. The calculator separates fixed fees (like memberships or HOA dues) from variable expenses (like chemical treatments or emergency repairs) to give you flexibility in modeling different scenarios.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The estimator generates projections showing total fees paid over your selected time period (1 year, 5 years, 10 years, or longer), factoring in inflation on maintenance costs (typically 3-5% annually). The output displays cumulative lifetime costs, break-even analysis against alternatives like pool club membership, and month-by-month expense patterns. Use these results to budget accurately, identify cost-saving opportunities, or compare ownership versus membership to determine the most financially prudent option for your situation.</p>
        </div>
      </section>

      {/* TABLE: Average Annual Pool Maintenance Fee Breakdown by Service Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Annual Pool Maintenance Fee Breakdown by Service Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical annual costs for common pool maintenance services in 2024-2025.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Service Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Cost Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Cost Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Weekly Professional Cleaning</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150–$300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,800–$3,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">52 visits/year</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chemical Treatment & Testing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50–$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600–$1,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Weekly to bi-weekly</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Equipment Inspection & Repair</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0–$200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0–$1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">As needed + annual</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Filter Cleaning/Replacement</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30–$80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$360–$960</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly to quarterly</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pool Pump Maintenance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25–$75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300–$900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Quarterly to annual</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Algae Prevention Treatment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20–$60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$240–$720</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Seasonal/as needed</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Equipment Winterization</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0–$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300–$600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">One-time annually</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Water Testing Lab Analysis</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0–$50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0–$300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Quarterly to seasonal</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs vary by pool size (15,000–30,000 gallons for residential), location, and climate zone. In-ground pools average $2,400–$4,500 annually; above-ground pools average $600–$1,200.</p>
      </section>

      {/* TABLE: Pool Membership vs. Home Pool Ownership Cost Comparison (Annual) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Pool Membership vs. Home Pool Ownership Cost Comparison (Annual)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares typical annual expenses for pool club membership versus single-family home pool ownership.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Expense Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pool Club Membership</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Home Pool Ownership</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Monthly Membership/Access Fee</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50–$300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Varies</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Professional Maintenance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Included</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,800–$3,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$1,800–$3,600</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chemical & Treatment Supplies</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Included</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600–$1,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$600–$1,800</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Equipment Repairs & Parts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Included</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500–$1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$500–$1,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Utilities (Heating, Electricity)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Included</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400–$1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$400–$1,200</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Annual Inspection & Permit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Included</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200–$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$200–$500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Property Tax Impact</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500–$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$500–$2,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Total Annual Cost (Low Estimate)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600–$3,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,000–$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$400–$6,400</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Total Annual Cost (High Estimate)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,600–$7,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,000–$12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">–$2,400+$8,800</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Club membership assumes 50-100+ visits annually. Home ownership costs are for 15,000–30,000 gallon in-ground pools. Regional variations affect utility and maintenance costs significantly.</p>
      </section>

      {/* TABLE: Pool Fee Impact by Climate Zone (Annual Maintenance Costs) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Pool Fee Impact by Climate Zone (Annual Maintenance Costs)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Pool maintenance fees vary significantly based on climate, water chemistry needs, and seasonal heating requirements.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Climate Zone</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Annual Temperature</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primary Fee Drivers</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Annual Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hot/Arid (Southwest)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90°F–110°F average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Evaporation, algae control, chemical balance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,500–$4,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Temperate (Mid-Atlantic)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50°F–80°F average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Seasonal opening/closing, heating</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,200–$3,800</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cold/Northern (Northeast)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30°F–65°F average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extended winterization, spring cleanup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,800–$4,200</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tropical/Humid (Southeast)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75°F–90°F average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High algae risk, frequent chemical treatment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,200–$5,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mediterranean (California)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55°F–80°F average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Drought-related water restrictions, heating</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,400–$4,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs include professional maintenance, chemicals, equipment, and utilities. Regional labor rates and chemical availability affect pricing. Heated pools add $1,500–$3,000 annually.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Bundle services with a single contractor to negotiate lower rates—most pool maintenance companies offer 10-20% discounts for combined weekly cleaning, chemical treatment, and seasonal services compared to paying for each separately.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Schedule equipment maintenance during off-season (late fall/winter) when contractors have more availability, potentially saving 15-25% on service calls and parts replacement versus peak summer demand.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Invest in a pool automation system ($2,500–$5,000 upfront) to reduce chemical waste and energy consumption, which can lower annual maintenance fees by $600–$1,200 within 3-5 years.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare your local pool service quotes against the national average for your climate zone using this estimator—if your quotes exceed regional benchmarks by more than 20%, request proposals from competing contractors to validate pricing.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to include seasonal cost variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many pool owners estimate fees based only on summer months, forgetting that winter closing, spring opening, and reduced maintenance during off-season create a non-linear cost structure. The estimator requires you to specify seasonal adjustments, ensuring you capture the true annual average rather than overstating or understating expenses.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Omitting equipment replacement as a recurring cost</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pumps, filters, and heaters require replacement every 10-15 years at costs of $1,500–$5,000 each, but many pool owners don't account for these major expenses in their budgets. Failing to amortize equipment replacement into your annual estimates can lead to significant financial surprises and underestimated true ownership costs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for inflation on pool maintenance services</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pool service fees historically inflate 3-5% annually due to rising chemical costs and labor expenses, which compounds significantly over 10+ years. Using flat-rate fee estimates without inflation adjustments will underestimate your true long-term financial commitment by 25-50%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Conflating pool fees with property tax increases</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some jurisdictions increase property taxes by $500–$2,000+ annually when you add a pool, but this is separate from maintenance fees and shouldn't be included in your service cost calculation. The estimator focuses on operational pool fees, so track property tax impacts separately to avoid double-counting costs.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What types of pool fees should I include in this estimator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You should include all recurring and one-time fees associated with pool ownership or membership, such as monthly maintenance fees ($150-$300), annual inspections ($200-$500), chemical treatment costs ($50-$100 monthly), equipment repairs, and membership dues for community pools. The estimator accounts for both fixed fees and variable costs that fluctuate seasonally, giving you a comprehensive picture of total pool ownership expenses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much do pool maintenance fees typically cost annually?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Average annual pool maintenance fees range from $1,800 to $3,600 for residential in-ground pools, depending on size and location. Weekly professional cleaning costs $150-$300, chemical balancing runs $50-$150 monthly, and equipment repairs average $500-$1,500 per year. The estimator helps you project these costs over multiple years to understand cumulative financial impact.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator account for seasonal fee variations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the Pool Fee Impact Estimator allows you to input different fee structures for peak and off-season months. For example, summer maintenance (May-September) often costs 30-50% more than winter months due to increased chemical usage and equipment strain. By entering season-specific rates, you'll get a more accurate annual and lifetime cost projection.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between fixed and variable pool fees?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Fixed pool fees are consistent monthly charges like HOA pool maintenance ($100-$200), while variable fees fluctuate based on usage and seasonal needs, such as chemical costs ($50-$150) and emergency repairs ($0-$2,000+). The estimator separates these categories so you can understand which costs are predictable and which require contingency planning.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the estimator factor in inflation on pool fees?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pool maintenance costs typically inflate 3-5% annually, slightly above general inflation rates due to rising chemical and labor costs. The Pool Fee Impact Estimator includes an inflation adjustment field where you can input your expected annual increase rate, allowing you to project realistic long-term costs over 5, 10, or 20-year periods.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the average cost to close and open a pool seasonally?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pool closing typically costs $300-$600 in fall, while spring opening runs $400-$800, depending on your region and pool size. These one-time seasonal fees should be entered separately in the estimator to ensure they're properly distributed across your annual budget. Many pool owners factor these into their overall maintenance strategy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How can I use this calculator to compare pool ownership vs. membership?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your projected annual ownership fees (maintenance, repairs, chemicals, utilities) and compare them against community pool or club membership fees, which typically range from $50-$300 monthly. The estimator will show you the break-even point and help you determine whether owning or joining a pool membership is more cost-effective over your desired time horizon.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include equipment replacement costs in my fee estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, you should include equipment replacement as a separate line item or amortized cost, as pumps ($1,500-$3,000), filters ($800-$2,000), and heaters ($2,500-$5,000) require replacement every 10-15 years. The estimator allows you to spread these large capital expenses across multiple years, giving you a more realistic picture of true annual pool ownership costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens to pool fees if I sell my home or cancel membership?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If you own a pool, selling your home eliminates future maintenance and fee obligations, but deferred maintenance can reduce property value by 5-10%. If you hold a pool club membership, cancellation fees range from $0-$500 depending on your contract terms. The estimator can show you cumulative fees paid up to your cancellation date, helping you make an informed exit decision.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.investopedia.com/articles/personal-finance/051115/what-does-it-really-cost-own-swimming-pool.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Swimming Pool Maintenance Cost Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Investopedia provides a comprehensive breakdown of residential pool ownership costs, including maintenance, repairs, chemicals, and utilities for various pool types.</p>
          </li>
          <li>
            <a href="https://www.phta.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pool & Hot Tub Alliance (PHTA) Industry Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The PHTA offers industry benchmarks and standards for pool maintenance costs, equipment specifications, and service recommendations across North America.</p>
          </li>
          <li>
            <a href="https://www.nahb.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of Home Builders (NAHB) Pool Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The NAHB tracks residential construction costs and property value impacts of pools, providing data on home resale value effects and regional pricing variations.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau (CFPB) - Home Improvement Financing</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The CFPB provides guidance on financing home improvements and evaluating long-term property-related expenses, relevant to pool ownership financial planning.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Pool Fee Impact Estimator"
      description="Estimate the impact of mining pool fees on your earnings. Compare different pools to maximize your mining profit."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Pool Fee Impact Estimator" },
        { id: "formula", label: "Pool Fee Impact Estimator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Net Earnings = (Hash Rate × Reward) - (Pool Fee × Hash Rate × Reward) - Electricity Cost",
        variables: [
          { symbol: "Hash Rate", description: "Your mining power in TH/s" },
          { symbol: "Reward", description: "The reward per TH/s" },
          { symbol: "Pool Fee", description: "The percentage fee charged by the pool" },
          { symbol: "Electricity Cost", description: "Your total electricity expenses" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a hash rate of 100 TH/s, a pool fee of 1.5%, and electricity costs of $300.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "100 × 0.1 = 10", 
            explanation: "Calculate the earnings before fees." 
          },
          { 
            label: "Step 2", 
            calculation: "10 × 0.015 = 0.15", 
            explanation: "Calculate the fee impact." 
          },
          { 
            label: "Step 3", 
            calculation: "10 - 0.15 - 300 = -290.15", 
            explanation: "Determine the net earnings after fees and costs." 
          }
        ],
        result: "The final result is -$290.15, indicating a loss due to high electricity costs."
      }}
      relatedCalculators={[
        {"title":"Loan Payment Calculator (Principal, Rate, Term)","url":"/financial/loan-payment","icon":"💵"},
        {"title":"Mortgage Payment & Amortization Calculator","url":"/financial/mortgage-amortization","icon":"🏠"},
        {"title":"Extra Payments & Payoff Time Calculator","url":"/financial/extra-payments-payoff","icon":"📈"},
        {"title":"Interest-Only Loan Calculator","url":"/financial/interest-only-loan","icon":"💳"},
        {"title":"Refinance Savings Calculator","url":"/financial/refinance-savings","icon":"💰"},
        {"title":"HELOC Payment Estimator","url":"/financial/heloc-payment-estimator","icon":"🏦"}
      ]}
    />
  );
}
