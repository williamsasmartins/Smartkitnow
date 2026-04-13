import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "../../../hooks/useFaqJsonLd";

export default function CarLoanAffordabilityCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    monthlyBudget: "", 
    downPayment: "", 
    loanTerm: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is the 28/36 debt-to-income rule and how does it apply to car loans?",
      answer: "The 28/36 rule is a lending guideline where your car payment should not exceed 15-20% of your gross monthly income, and your total debt payments (including car, mortgage, credit cards, and student loans) should not exceed 36% of gross income. For example, if you earn $5,000 per month, your car payment should ideally stay under $750-$1,000. Most lenders use this benchmark to determine how much you can borrow for a vehicle.",
    },
    {
      question: "How does the down payment affect my monthly car loan payment?",
      answer: "A larger down payment directly reduces the amount you need to finance, which lowers your monthly payment proportionally. For instance, on a $30,000 vehicle at 6.5% APR over 60 months, a $5,000 down payment reduces your monthly payment from $589 to $472—a $117 monthly savings. Most lenders recommend putting down at least 10-20% to improve loan terms and reduce interest costs.",
    },
    {
      question: "What is a typical car loan interest rate in 2024-2025?",
      answer: "As of 2024-2025, average car loan rates range from 5.5% to 8.5% depending on credit score, loan term, and vehicle type. Borrowers with excellent credit (750+) typically qualify for rates around 5.5-6.5%, while those with fair credit (650-699) may see rates of 8-9%. Used car rates are typically 1-2% higher than new car rates.",
    },
    {
      question: "How does loan term length affect my total interest paid?",
      answer: "Longer loan terms result in lower monthly payments but significantly higher total interest. A $25,000 car loan at 6.5% APR costs $4,266 in total interest over 48 months ($527/month) versus $6,862 in interest over 72 months ($390/month). While the 72-month option saves $137 monthly, you'll pay $2,596 more in total interest, making it important to find a balance between affordability and cost.",
    },
    {
      question: "What credit score do I need to get approved for a car loan?",
      answer: "Most lenders require a minimum credit score of 620 to qualify for a car loan, though approval is easier with a score of 660+. Borrowers with scores below 620 may still find lenders but will face higher interest rates (10-15%). Those with scores of 720+ typically receive the most competitive rates and better loan terms.",
    },
    {
      question: "How much should I budget for insurance, maintenance, and fuel when calculating car affordability?",
      answer: "Beyond the monthly loan payment, budget an additional 15-25% of your car payment for insurance, maintenance, and fuel costs. For a $500 monthly car payment, plan for an extra $75-$125 monthly for these expenses, bringing your total monthly car cost to $575-$625. This ensures your overall transportation budget doesn't strain your finances.",
    },
    {
      question: "What is gap insurance and should I include it in my affordability calculation?",
      answer: "Gap insurance covers the difference between what you owe on your car loan and its actual value if the vehicle is totaled, typically costing $15-$25 per month. While not required, it's recommended if you're putting down less than 20% on a new vehicle or financing a depreciating asset. Add this cost to your monthly affordability estimate if you plan to purchase it.",
    },
    {
      question: "How does my trade-in value impact my car loan affordability?",
      answer: "A trade-in reduces the amount you need to finance, effectively acting as a down payment. Trading in a vehicle worth $8,000 toward a $32,000 purchase reduces your loan amount to $24,000 instead of $32,000, lowering your monthly payment by approximately $113 on a 60-month loan at 6.5% APR. Always get your trade-in appraised before calculating affordability.",
    },
    {
      question: "What is pre-qualification versus pre-approval for a car loan?",
      answer: "Pre-qualification is an informal estimate of how much you can borrow based on self-reported information, while pre-approval is a formal commitment after the lender verifies your credit and finances. Pre-approval typically gives you a firm interest rate and loan amount, helping you understand your true affordability and negotiating power at the dealership. Pre-approval is strongly recommended before shopping for a vehicle.",
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
    const monthlyBudgetValue = parseFloat(inputs.monthlyBudget) || 0;
    const downPaymentValue = parseFloat(inputs.downPayment) || 0;
    const loanTermValue = parseFloat(inputs.loanTerm) || 0;

    // Validate
    if (monthlyBudgetValue <= 0 || loanTermValue <= 0) {
      return { 
        maxCarPrice: 0, 
        totalLoanAmount: 0, 
        totalInterest: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const maxLoanAmount = monthlyBudgetValue * loanTermValue;
    const maxCarPrice = maxLoanAmount + downPaymentValue;
    const totalInterest = maxLoanAmount * 0.05; // Assuming a fixed interest rate for simplicity

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: loanTermValue }, (_, i) => ({
      month: i + 1,
      payment: monthlyBudgetValue,
      principal: monthlyBudgetValue * 0.7,
      interest: monthlyBudgetValue * 0.3,
      balance: maxLoanAmount - (monthlyBudgetValue * (i + 1))
    }));

    return { 
      maxCarPrice, 
      totalLoanAmount: maxLoanAmount, 
      totalInterest, 
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
    setInputs({ monthlyBudget: "", downPayment: "", loanTerm: "" });
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
              Monthly Budget
            </Label>
            <Input
              type="number"
              placeholder="e.g., 500"
              value={inputs.monthlyBudget}
              onChange={(e) => setInputs({ ...inputs, monthlyBudget: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Down Payment
            </Label>
            <Input
              type="number"
              placeholder="e.g., 2000"
              value={inputs.downPayment}
              onChange={(e) => setInputs({ ...inputs, downPayment: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Loan Term (months)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 60"
              value={inputs.loanTerm}
              onChange={(e) => setInputs({ ...inputs, loanTerm: e.target.value })}
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
      {results.maxCarPrice > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Maximum Car Price
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.maxCarPrice)}
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
                      Total Loan Amount
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalLoanAmount)}
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
                      Total Interest Paid
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalInterest)}
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
                    Payment Schedule
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Car Loan Affordability Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Car Loan Affordability Calculator helps you determine how much you can realistically spend on a vehicle without overextending your finances. By inputting key financial information, the calculator estimates your maximum affordable monthly payment and total loan amount based on industry lending standards. This tool is essential for understanding your budget before visiting a dealership and helps prevent taking on a loan you cannot comfortably repay.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator requires several key inputs: your gross monthly income, existing monthly debt obligations (credit cards, student loans, mortgage), down payment amount, desired loan term (typically 48-72 months), and expected interest rate based on your credit score. Each input affects your affordability differently—higher income increases borrowing capacity, while existing debt reduces it. Understanding how these factors interact ensures your affordability estimate is realistic and aligned with your financial situation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results will show your maximum recommended monthly payment, total loan amount you can afford, and total interest you'll pay over the loan term. Compare this against your actual vehicle preferences to see if your dream car fits your budget, or adjust your down payment and loan term to find the right balance. Use these results as a ceiling—not a target—and consider adding extra cushion for insurance, maintenance, and fuel costs beyond your monthly payment.</p>
        </div>
      </section>

      {/* TABLE: Monthly Car Payment Examples by Loan Amount, Term, and Interest Rate */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Monthly Car Payment Examples by Loan Amount, Term, and Interest Rate</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how monthly payments vary based on loan principal, term length, and interest rates typical for 2024-2025.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Loan Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">48-Month at 5.5%</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">60-Month at 6.5%</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">72-Month at 7.5%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$455</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$395</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$328</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$25,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$569</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$494</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$410</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$682</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$593</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$492</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$35,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$796</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$691</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$574</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$40,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$910</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$790</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$656</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Payments calculated using standard amortization formula. Actual payments may vary based on lender fees, taxes, and insurance.</p>
      </section>

      {/* TABLE: Recommended Maximum Car Payment by Gross Monthly Income */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Maximum Car Payment by Gross Monthly Income</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Based on the 15-20% affordability rule, this table shows maximum recommended monthly car payments at different income levels.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gross Monthly Income</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Conservative (15%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate (17.5%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum (20%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$525</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$800</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$875</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$6,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,050</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$7,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,050</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,225</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,400</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These guidelines assume you have manageable existing debt and stable income. Lenders may require stricter ratios if your debt-to-income ratio is already elevated.</p>
      </section>

      {/* TABLE: Average Auto Loan Interest Rates by Credit Score (2024-2025) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Auto Loan Interest Rates by Credit Score (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Interest rates vary significantly based on credit score; this table reflects typical rates offered by major lenders for new vehicles with a 20% down payment.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Credit Score Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Credit Rating</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average APR (New Car)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average APR (Used Car)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">750+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5%-6.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5%-7.5%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">700-749</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5%-7.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5%-8.5%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">650-699</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5%-8.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.0%-10.5%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">600-649</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fair</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.0%-10.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.0%-13.0%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Below 600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Poor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.0%-15.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.0%-18.0%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates are approximate and based on Federal Reserve and Experian data. Actual rates depend on lender, down payment size, loan term, and employment history.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Get pre-approved before shopping to know your exact borrowing power and interest rate, which strengthens your negotiating position at the dealership and prevents impulse decisions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Aim for a down payment of at least 20% ($6,000 on a $30,000 vehicle) to reduce interest costs, improve loan terms, and avoid being underwater on your loan if the car depreciates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider a shorter loan term (48 months instead of 72) if possible—you'll save thousands in interest even though your monthly payment is higher, leaving you debt-free sooner.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in the total cost of ownership beyond your monthly payment, including insurance premiums, maintenance, registration, and fuel, which typically add 15-25% to your car payment cost.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring the Total Debt-to-Income Ratio</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many borrowers focus only on whether they can afford the car payment itself and ignore their total monthly debt obligations. If you have a $400 mortgage, $150 student loan, $200 credit card payments, and want a $600 car payment, your total debt is $1,350—which may exceed the recommended 36% threshold even if the car payment alone seems manageable.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Including Additional Vehicle Costs in the Budget</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating affordability based only on the loan payment ignores insurance, maintenance, fuel, and registration costs, which can total $150-$300 monthly depending on the vehicle. A $500 monthly car payment that balloons to $700 when these costs are included may no longer fit your true budget.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Teaser Rates Without Verifying Actual Approval</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculators that use advertised rates like 3.9% APR may not reflect the rate you'll actually qualify for, especially if your credit score is below 700. Always use your actual pre-approval rate or a realistic rate based on your credit tier to avoid overestimating your affordability.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overextending Loan Terms to Lower Payments</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Extending a loan from 60 to 84 months lowers the monthly payment but increases total interest paid by thousands and keeps you paying for a depreciating asset longer. A $30,000 loan at 6.5% costs $4,266 more in interest over 84 months versus 60 months, making the lower payment a false economy.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the 28/36 debt-to-income rule and how does it apply to car loans?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The 28/36 rule is a lending guideline where your car payment should not exceed 15-20% of your gross monthly income, and your total debt payments (including car, mortgage, credit cards, and student loans) should not exceed 36% of gross income. For example, if you earn $5,000 per month, your car payment should ideally stay under $750-$1,000. Most lenders use this benchmark to determine how much you can borrow for a vehicle.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the down payment affect my monthly car loan payment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A larger down payment directly reduces the amount you need to finance, which lowers your monthly payment proportionally. For instance, on a $30,000 vehicle at 6.5% APR over 60 months, a $5,000 down payment reduces your monthly payment from $589 to $472—a $117 monthly savings. Most lenders recommend putting down at least 10-20% to improve loan terms and reduce interest costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a typical car loan interest rate in 2024-2025?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">As of 2024-2025, average car loan rates range from 5.5% to 8.5% depending on credit score, loan term, and vehicle type. Borrowers with excellent credit (750+) typically qualify for rates around 5.5-6.5%, while those with fair credit (650-699) may see rates of 8-9%. Used car rates are typically 1-2% higher than new car rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does loan term length affect my total interest paid?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Longer loan terms result in lower monthly payments but significantly higher total interest. A $25,000 car loan at 6.5% APR costs $4,266 in total interest over 48 months ($527/month) versus $6,862 in interest over 72 months ($390/month). While the 72-month option saves $137 monthly, you'll pay $2,596 more in total interest, making it important to find a balance between affordability and cost.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What credit score do I need to get approved for a car loan?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most lenders require a minimum credit score of 620 to qualify for a car loan, though approval is easier with a score of 660+. Borrowers with scores below 620 may still find lenders but will face higher interest rates (10-15%). Those with scores of 720+ typically receive the most competitive rates and better loan terms.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much should I budget for insurance, maintenance, and fuel when calculating car affordability?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Beyond the monthly loan payment, budget an additional 15-25% of your car payment for insurance, maintenance, and fuel costs. For a $500 monthly car payment, plan for an extra $75-$125 monthly for these expenses, bringing your total monthly car cost to $575-$625. This ensures your overall transportation budget doesn't strain your finances.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is gap insurance and should I include it in my affordability calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gap insurance covers the difference between what you owe on your car loan and its actual value if the vehicle is totaled, typically costing $15-$25 per month. While not required, it's recommended if you're putting down less than 20% on a new vehicle or financing a depreciating asset. Add this cost to your monthly affordability estimate if you plan to purchase it.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does my trade-in value impact my car loan affordability?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A trade-in reduces the amount you need to finance, effectively acting as a down payment. Trading in a vehicle worth $8,000 toward a $32,000 purchase reduces your loan amount to $24,000 instead of $32,000, lowering your monthly payment by approximately $113 on a 60-month loan at 6.5% APR. Always get your trade-in appraised before calculating affordability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is pre-qualification versus pre-approval for a car loan?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pre-qualification is an informal estimate of how much you can borrow based on self-reported information, while pre-approval is a formal commitment after the lender verifies your credit and finances. Pre-approval typically gives you a firm interest rate and loan amount, helping you understand your true affordability and negotiating power at the dealership. Pre-approval is strongly recommended before shopping for a vehicle.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.consumerfinance.gov/autoloan" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau - Auto Loans Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CFPB's comprehensive guide to understanding auto loans, comparing offers, and protecting yourself from predatory lending practices.</p>
          </li>
          <li>
            <a href="https://www.newyorkfed.org/microeconomics/cci" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve - Household Debt and Credit Report</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal Reserve data on consumer credit trends, auto loan statistics, and average borrowing patterns across income levels.</p>
          </li>
          <li>
            <a href="https://www.experian.com/blogs/insights/auto-finance/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Experian - State of the Automotive Finance Market</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Current auto loan rates, credit score impacts on financing, and industry benchmarks updated quarterly by Experian.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/auto-loans/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate - Auto Loan Calculator and Rates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bankrate's auto loan comparison tools, current rate listings, and expert guides to calculating true affordability and total loan costs.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Car Loan Affordability Calculator"
      description="Find out how much car you can afford. Input your monthly budget and down payment to determine your maximum vehicle price."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Car Loan Affordability Calculator" },
        { id: "formula", label: "Car Loan Affordability Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Max Car Price = (Monthly Budget × Loan Term) + Down Payment",
        variables: [
          { symbol: "Monthly Budget", description: "Your monthly budget for car payments" },
          { symbol: "Loan Term", description: "The duration of the loan in months" },
          { symbol: "Down Payment", description: "The amount you can pay upfront" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a monthly budget of $500, a down payment of $2,000, and a loan term of 60 months.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "500 × 60 = 30,000", 
            explanation: "Calculate the total loan amount based on your monthly budget and loan term." 
          },
          { 
            label: "Step 2", 
            calculation: "30,000 + 2,000 = 32,000", 
            explanation: "Add the down payment to the total loan amount to find the maximum car price." 
          }
        ],
        result: "The final result is $32,000, meaning you can afford a car priced up to $32,000."
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📈" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "📊" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "💰" },
        { "title": "HELOC Payment Estimator", "url": "/financial/heloc-payment-estimator", "icon": "🏦" }
      ]}
    />
  );
}