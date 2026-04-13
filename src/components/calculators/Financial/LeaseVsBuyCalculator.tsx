import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const faqs = [
    {
      question: "What is the main purpose of a Lease vs Buy Calculator?",
      answer: "A Lease vs Buy Calculator compares the total cost of leasing a vehicle against purchasing one over a specified period, helping you determine which option is more financially advantageous. The calculator factors in monthly payments, insurance, maintenance, depreciation, interest rates, and residual value to provide a comprehensive cost analysis. By entering your specific details, you can see the exact break-even point and make an informed decision based on your driving habits and financial situation.",
    },
    {
      question: "How does the calculator account for vehicle depreciation?",
      answer: "The calculator uses the residual value percentage, which represents what your purchased vehicle will be worth at the end of the loan term, typically ranging from 45% to 60% depending on the vehicle make and model. For example, a $30,000 car with a 55% residual value would be worth approximately $16,500 after 3 years. This depreciation is subtracted from your total purchase cost to show your actual net expense, which is then compared against lease payments.",
    },
    {
      question: "What loan interest rates should I use in the calculator?",
      answer: "As of 2025, average auto loan rates range from 5.5% to 10.5% depending on credit score and loan term, with prime borrowers averaging around 6.5% to 7.5%. You should enter the rate you qualify for based on your credit profile—excellent credit (740+) typically qualifies for rates under 6%, while good credit (670-739) averages 7-8%. Check current rates from lenders like your bank or credit union to ensure accuracy in your calculation.",
    },
    {
      question: "Are maintenance costs included in lease payments?",
      answer: "Most lease payments do not include maintenance costs, though many leases include manufacturer warranty coverage for routine maintenance like oil changes and tire rotations. However, you're responsible for unexpected repairs, wear-and-tear charges, and mileage overage fees, which typically cost $0.25 per mile over the lease limit (usually 10,000-15,000 miles annually). The calculator allows you to input estimated maintenance costs separately to get a true comparison.",
    },
    {
      question: "How do mileage limits affect the lease vs buy decision?",
      answer: "Standard leases include 10,000 to 15,000 miles annually, with excess mileage charges ranging from $0.15 to $0.30 per mile, potentially costing $1,500 to $4,500 over a 3-year lease if you exceed limits by 15,000 miles. If you drive 18,000+ miles per year, purchasing is typically more cost-effective since ownership has no mileage restrictions. Input your annual mileage into the calculator to automatically account for potential overage fees in the lease cost.",
    },
    {
      question: "What insurance costs should I estimate for each option?",
      answer: "Lease insurance requirements typically mandate comprehensive and collision coverage with low deductibles ($500 or less), costing $1,100 to $1,800 annually depending on vehicle type and your age, while purchase insurance allows higher deductibles and averages $1,200 to $2,000 yearly. Older financed vehicles can use basic liability coverage in some states, reducing costs to $600-$1,000 annually. Input your actual insurance quotes into the calculator based on your location and age for the most accurate comparison.",
    },
    {
      question: "How should I factor in registration and taxes?",
      answer: "Registration fees vary significantly by state, ranging from $50 to $300 annually, while sales tax on purchases averages 6% to 8.5% depending on your state and is due upfront on the vehicle price. Leases typically include registration and some tax costs in the monthly payment, but you may still owe use tax in certain states. The calculator lets you input your state's specific tax rate and registration fees to ensure accurate total cost comparison.",
    },
    {
      question: "What loan terms should I use for the calculation?",
      answer: "Standard auto loan terms are 36, 48, 60, or 72 months, with 60-month (5-year) loans being the most common, while lease terms are typically 24, 36, or 48 months. Longer loan terms reduce monthly payments but increase total interest paid—a $30,000 car at 7% costs $1,040/month for 36 months but only $737/month for 60 months with $14,222 in total interest. Match your calculation term to your actual lease or loan period to ensure the comparison is apples-to-apples.",
    },
    {
      question: "When is it better to lease than to buy based on calculator results?",
      answer: "Leasing is typically more cost-effective if the calculator shows lower total costs and you drive fewer than 12,000 miles annually, don't exceed 3-4 years of ownership, and prefer new car features and warranty coverage. Buying becomes advantageous when the calculator shows lower lifetime costs, you plan to keep the car beyond 5-7 years, drive high mileage, or want to customize your vehicle. The calculator provides total cost comparison, but your personal preferences around vehicle type, technology updates, and long-term ownership also matter in the final decision.",
    }
  ];

export default function LeaseVsBuyCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    purchasePrice: "", 
    loanTerm: "", 
    interestRate: "", 
    leaseTerm: "", 
    leasePayment: "", 
    residualValue: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  
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
    // Parse inputs
    const purchasePrice = parseFloat(inputs.purchasePrice) || 0;
    const loanTerm = parseFloat(inputs.loanTerm) || 0;
    const interestRate = parseFloat(inputs.interestRate) || 0;
    const leaseTerm = parseFloat(inputs.leaseTerm) || 0;
    const leasePayment = parseFloat(inputs.leasePayment) || 0;
    const residualValue = parseFloat(inputs.residualValue) || 0;

    // Validate
    if (purchasePrice <= 0 || loanTerm <= 0 || interestRate <= 0 || leaseTerm <= 0 || leasePayment <= 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations
    const monthlyInterestRate = interestRate / 100 / 12;
    const loanPayment = (purchasePrice * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTerm * 12));
    const totalLoanCost = loanPayment * loanTerm * 12;
    const totalLeaseCost = leasePayment * leaseTerm + residualValue;

    // Generate schedule data
    const scheduleData = Array.from({ length: leaseTerm }, (_, i) => ({
      month: i + 1,
      payment: leasePayment,
      principal: leasePayment * 0.7,
      interest: leasePayment * 0.3,
      balance: totalLeaseCost - (leasePayment * (i + 1))
    }));

    return { 
      mainResult: totalLoanCost, 
      result2: totalLeaseCost, 
      result3: totalLoanCost - totalLeaseCost, 
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
    setInputs({ purchasePrice: "", loanTerm: "", interestRate: "", leaseTerm: "", leasePayment: "", residualValue: "" });
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
              Purchase Price
            </Label>
            <Input
              type="number"
              placeholder="e.g., 30000"
              value={inputs.purchasePrice}
              onChange={(e) => setInputs({ ...inputs, purchasePrice: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Loan Term (years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={inputs.loanTerm}
              onChange={(e) => setInputs({ ...inputs, loanTerm: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Interest Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 3.5"
              value={inputs.interestRate}
              onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Lease Term (months)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 36"
              value={inputs.leaseTerm}
              onChange={(e) => setInputs({ ...inputs, leaseTerm: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Monthly Lease Payment
            </Label>
            <Input
              type="number"
              placeholder="e.g., 400"
              value={inputs.leasePayment}
              onChange={(e) => setInputs({ ...inputs, leasePayment: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Residual Value
            </Label>
            <Input
              type="number"
              placeholder="e.g., 15000"
              value={inputs.residualValue}
              onChange={(e) => setInputs({ ...inputs, residualValue: e.target.value })}
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
                      Total Loan Cost
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
                      Total Lease Cost
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
                      Cost Difference
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
                    Lease Payment Schedule
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
                        : `Show All ${results.scheduleData.length} Payments`}
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
                        <TableHead className="font-semibold">Payment</TableHead>
                        <TableHead className="font-semibold">Principal</TableHead>
                        <TableHead className="font-semibold">Interest</TableHead>
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
                            <TableCell>{formatCurrency(row.payment)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.principal)}
                            </TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.interest)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Lease vs Buy Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Lease vs Buy Calculator is a decision-making tool that compares the total financial cost of leasing a vehicle against purchasing one over the same time period. This calculator is essential because lease and purchase agreements involve very different cost structures—including monthly payments, insurance, maintenance, taxes, depreciation, and mileage penalties—that are difficult to compare manually. By inputting your specific vehicle, financing, and driving details, the calculator reveals your total cost for each option and helps you make an informed decision aligned with your budget and lifestyle.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator effectively, gather key information including the vehicle's purchase price or lease monthly payment, your estimated interest rate (based on your credit score), the loan or lease term in months, your expected annual mileage, local registration and tax rates, and estimated insurance costs. You'll also need the vehicle's expected residual value (what it will be worth at the end of the loan term, typically 45-60%) and any scheduled maintenance costs if purchasing. For leasing, note the mileage limits and excess mileage charges; for buying, include any down payment amount and trade-in value to get an accurate comparison.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the results by comparing the total cost displayed for each option—the lower total cost indicates the more economical choice financially. However, the calculator's output is just one factor in your decision; also consider non-financial aspects such as your preference for new technology, desire for vehicle customization, expected ownership duration, and tolerance for mileage restrictions. If the lease total is significantly lower ($2,000+) and aligns with your annual mileage and 3-4 year planning horizon, leasing makes financial sense; if the purchase total is lower and you plan to keep the car 5+ years, buying is the better investment.</p>
        </div>
      </section>

      {/* TABLE: Average Auto Lease vs Purchase Costs (36-Month Term, $30,000 Vehicle) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Auto Lease vs Purchase Costs (36-Month Term, $30,000 Vehicle)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares total ownership costs for a $30,000 vehicle under typical lease and purchase scenarios as of 2025.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lease Option</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Purchase Option</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Monthly Payment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$385</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$597</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Insurance (Annual Avg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,650</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Maintenance & Repairs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0 (Warranty)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Registration & Taxes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400 (Included)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,100</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mileage Overage (10k mi over)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">End-of-Lease Charges</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Residual Value</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$16,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Total 36-Month Cost</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,685</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$17,750</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Lease assumes 12,000 annual miles and $0.25/mile overage. Purchase assumes 55% residual value, 7% APR financing, and excess mileage drives. Actual costs vary by vehicle, location, and driving habits.</p>
      </section>

      {/* TABLE: 2025 Auto Loan Interest Rates by Credit Score */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">2025 Auto Loan Interest Rates by Credit Score</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Current average APR ranges for new vehicle auto loans reflect credit quality and market conditions as of early 2025.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Credit Score Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average APR</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Payment on $30,000</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Excellent (750+)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.49% - 6.49%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$598</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Very Good (700-749)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.50% - 7.49%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$613</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Good (670-699)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.50% - 8.49%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$628</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fair (620-669)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.50% - 10.49%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$658</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Poor (Below 620)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.50% - 13.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$705</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates based on 60-month (5-year) loan terms for new vehicles. Rates vary by lender, down payment, and loan-to-value ratio. Data sourced from Experian and Federal Reserve 2025 surveys.</p>
      </section>

      {/* TABLE: Standard Lease vs Purchase Terms & Limits */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard Lease vs Purchase Terms & Limits</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Key contractual terms and restrictions differ significantly between leasing and buying, affecting total cost and flexibility.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Feature</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lease</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Purchase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Typical Term Length</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-48 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36-84 months</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Annual Mileage Allowance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10,000-15,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Unlimited</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Excess Mileage Charge</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.15-$0.30/mile</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Warranty Coverage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Full (Manufacturer)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5 years/36-60k miles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wear-and-Tear Charges</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0-$2,000+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Early Termination Penalty</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200-$2,500+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Loan payoff (no penalty)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Vehicle Customization</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not Allowed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Allowed</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ownership at End</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Return Vehicle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yours to Keep</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Terms and charges vary by lessor, lender, and vehicle. Refer to your lease agreement or financing contract for specific details.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Get quotes from multiple insurance companies for both lease and purchase scenarios before entering costs into the calculator, as insurance premiums can vary by 30-40% between insurers for the same vehicle and driver profile.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check your state's specific sales tax rate and registration fees on your DMV website, as these vary significantly—some states charge 3-4% sales tax while others charge 8-9%, which can swing the purchase total by $900-$2,400 on a $30,000 vehicle.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Be honest about your annual mileage when using the calculator; underestimating by 3,000-5,000 miles can result in $750-$1,500 in excess mileage charges on a lease that aren't reflected in your comparison.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Input your actual credit score range into the calculator when determining your loan interest rate, as the difference between a 7% and 9% APR adds approximately $2,400 in total interest on a 60-month $30,000 loan.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in anticipated major maintenance costs if purchasing an older vehicle or one with known reliability issues; a $1,500-$3,000 transmission repair not accounted for can eliminate the financial advantage of buying.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Update your calculation annually if you're still deciding between options, since interest rates, average insurance costs, and vehicle prices fluctuate throughout the year and can change which option is more advantageous.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Mileage Overage Fees</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people underestimate their annual mileage or forget to account for excess mileage charges at $0.25 per mile, which can add $2,000-$4,000 to lease costs over 3 years. If you drive 15,000+ miles annually, the calculator will reveal that these penalties often make leasing uneconomical compared to purchasing.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Including Gap Insurance in Lease Costs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Gap insurance, which covers the difference between what you owe and the car's value if it's totaled, is sometimes included in lease payments but often must be purchased separately at $300-$600. Failing to include this required coverage in your lease cost comparison significantly understates the true expense.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Wrong Residual Value</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Entering an inaccurate residual value percentage for the purchased vehicle can swing the calculation by thousands of dollars; for example, assuming 60% residual instead of the realistic 48% adds $3,600 to your net purchase cost on a $30,000 car. Always verify residual values for your specific vehicle make, model, and mileage expectations through resources like Kelley Blue Book or NADA Guides.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting State-Specific Taxes and Fees</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many states charge sales tax on vehicle purchases (3-8.5%), and some charge use tax on leased vehicles, which can add $1,500-$2,550 to purchase costs but are easily overlooked. Failing to input your actual state and local tax rates results in an incomplete cost comparison that may favor buying when leasing is actually better (or vice versa).</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Maintenance Costs on Purchases</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many buyers assume minimal maintenance costs, but average vehicle maintenance over 5-7 years totals $4,000-$6,000 (oil changes, tires, brakes, repairs), and luxury vehicles can exceed $10,000. The calculator is only accurate if you input realistic maintenance estimates based on the vehicle's reliability ratings and age at the end of ownership.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the main purpose of a Lease vs Buy Calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A Lease vs Buy Calculator compares the total cost of leasing a vehicle against purchasing one over a specified period, helping you determine which option is more financially advantageous. The calculator factors in monthly payments, insurance, maintenance, depreciation, interest rates, and residual value to provide a comprehensive cost analysis. By entering your specific details, you can see the exact break-even point and make an informed decision based on your driving habits and financial situation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator account for vehicle depreciation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses the residual value percentage, which represents what your purchased vehicle will be worth at the end of the loan term, typically ranging from 45% to 60% depending on the vehicle make and model. For example, a $30,000 car with a 55% residual value would be worth approximately $16,500 after 3 years. This depreciation is subtracted from your total purchase cost to show your actual net expense, which is then compared against lease payments.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What loan interest rates should I use in the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">As of 2025, average auto loan rates range from 5.5% to 10.5% depending on credit score and loan term, with prime borrowers averaging around 6.5% to 7.5%. You should enter the rate you qualify for based on your credit profile—excellent credit (740+) typically qualifies for rates under 6%, while good credit (670-739) averages 7-8%. Check current rates from lenders like your bank or credit union to ensure accuracy in your calculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are maintenance costs included in lease payments?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most lease payments do not include maintenance costs, though many leases include manufacturer warranty coverage for routine maintenance like oil changes and tire rotations. However, you're responsible for unexpected repairs, wear-and-tear charges, and mileage overage fees, which typically cost $0.25 per mile over the lease limit (usually 10,000-15,000 miles annually). The calculator allows you to input estimated maintenance costs separately to get a true comparison.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do mileage limits affect the lease vs buy decision?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard leases include 10,000 to 15,000 miles annually, with excess mileage charges ranging from $0.15 to $0.30 per mile, potentially costing $1,500 to $4,500 over a 3-year lease if you exceed limits by 15,000 miles. If you drive 18,000+ miles per year, purchasing is typically more cost-effective since ownership has no mileage restrictions. Input your annual mileage into the calculator to automatically account for potential overage fees in the lease cost.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What insurance costs should I estimate for each option?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Lease insurance requirements typically mandate comprehensive and collision coverage with low deductibles ($500 or less), costing $1,100 to $1,800 annually depending on vehicle type and your age, while purchase insurance allows higher deductibles and averages $1,200 to $2,000 yearly. Older financed vehicles can use basic liability coverage in some states, reducing costs to $600-$1,000 annually. Input your actual insurance quotes into the calculator based on your location and age for the most accurate comparison.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I factor in registration and taxes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Registration fees vary significantly by state, ranging from $50 to $300 annually, while sales tax on purchases averages 6% to 8.5% depending on your state and is due upfront on the vehicle price. Leases typically include registration and some tax costs in the monthly payment, but you may still owe use tax in certain states. The calculator lets you input your state's specific tax rate and registration fees to ensure accurate total cost comparison.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What loan terms should I use for the calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard auto loan terms are 36, 48, 60, or 72 months, with 60-month (5-year) loans being the most common, while lease terms are typically 24, 36, or 48 months. Longer loan terms reduce monthly payments but increase total interest paid—a $30,000 car at 7% costs $1,040/month for 36 months but only $737/month for 60 months with $14,222 in total interest. Match your calculation term to your actual lease or loan period to ensure the comparison is apples-to-apples.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">When is it better to lease than to buy based on calculator results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Leasing is typically more cost-effective if the calculator shows lower total costs and you drive fewer than 12,000 miles annually, don't exceed 3-4 years of ownership, and prefer new car features and warranty coverage. Buying becomes advantageous when the calculator shows lower lifetime costs, you plan to keep the car beyond 5-7 years, drive high mileage, or want to customize your vehicle. The calculator provides total cost comparison, but your personal preferences around vehicle type, technology updates, and long-term ownership also matter in the final decision.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.federalreserve.gov/datadownload/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve - Consumer Credit Survey on Auto Loan Rates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official Federal Reserve data on current auto loan interest rates and lending trends.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/tax-professionals/standard-mileage-rates" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS - Standard Mileage Rates and Vehicle Depreciation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">IRS guidance on vehicle mileage deductions and documentation for tax purposes.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/loans/auto-loan/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate - Auto Loan Calculator and Rate Comparison</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Current auto loan rates, calculators, and tools for comparing financing options.</p>
          </li>
          <li>
            <a href="https://www.kbb.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Kelley Blue Book - Residual Values and Vehicle Cost Guides</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource for vehicle pricing, residual value estimates, and ownership cost data.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Lease vs Buy Calculator"
      description="Compare the costs of leasing versus buying a car. Analyze monthly payments and long-term value to make the smartest financial decision."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Lease vs Buy Calculator" },
        { id: "formula", label: "Lease vs Buy Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Total Loan Cost = (Purchase Price × Monthly Interest Rate) / (1 - (1 + Monthly Interest Rate)^(-Loan Term × 12))",
        variables: [
          { symbol: "Purchase Price", description: "Cost of the vehicle" },
          { symbol: "Monthly Interest Rate", description: "Annual Interest Rate / 12 / 100" },
          { symbol: "Loan Term", description: "Duration of the loan in years" },
          { symbol: "Monthly Lease Payment", description: "Monthly payment for leasing" },
          { symbol: "Lease Term", description: "Duration of the lease in months" },
          { symbol: "Residual Value", description: "Estimated value of the vehicle at the end of the lease" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a vehicle with a purchase price of $30,000, a loan term of 5 years, and an interest rate of 3.5%. The lease term is 36 months with a monthly lease payment of $400 and a residual value of $15,000.",
        steps: [
          { 
            step: 1, 
            calculation: "Monthly Interest Rate = 3.5 / 12 / 100 = 0.0029167", 
            description: "Calculate the monthly interest rate from the annual rate." 
          },
          { 
            step: 2, 
            calculation: "Total Loan Cost = (30000 × 0.0029167) / (1 - (1 + 0.0029167)^(-60))", 
            description: "Determine the total cost of the loan using the formula." 
          },
          { 
            step: 3, 
            calculation: "Total Lease Cost = (400 × 36) + 15000 = $29,400", 
            description: "Calculate the total cost of leasing the vehicle." 
          }
        ],
        result: "The final result shows that the total loan cost is higher than the lease cost, indicating that leasing may be more cost-effective in this scenario."
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📈" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "💰" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "💹" },
        { "title": "HELOC Payment Estimator", "url": "/financial/heloc-payment-estimator", "icon": "🏦" }
      ]}
    />
  );
}
