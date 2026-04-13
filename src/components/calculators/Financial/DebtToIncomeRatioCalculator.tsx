import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DebtToIncomeRatioCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    monthlyIncome: "", 
    monthlyDebt: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

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
    const monthlyIncomeValue = parseFloat(inputs.monthlyIncome) || 0;
    const monthlyDebtValue = parseFloat(inputs.monthlyDebt) || 0;

    // Validate
    if (monthlyIncomeValue <= 0) {
      return { 
        dtiRatio: 0, 
        affordability: 0, 
        remainingIncome: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations
    const dtiRatio = (monthlyDebtValue / monthlyIncomeValue) * 100;
    const affordability = monthlyIncomeValue - monthlyDebtValue;
    const remainingIncome = monthlyIncomeValue - affordability;

    // Generate schedule data if applicable
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      income: monthlyIncomeValue,
      debt: monthlyDebtValue,
      balance: monthlyIncomeValue - (monthlyDebtValue * (i + 1))
    }));

    return { 
      dtiRatio, 
      affordability, 
      remainingIncome, 
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
    setInputs({ monthlyIncome: "", monthlyDebt: "" });
  };

  const faqs = [
    {
      question: "What is a good debt-to-income ratio?",
      answer: "A debt-to-income ratio below 36% is generally considered excellent by most lenders, while ratios between 36% and 49% are acceptable for many mortgage and auto loan applications. Anything above 50% is typically viewed as high risk and may disqualify you from conventional financing. The lower your ratio, the more financial flexibility and borrowing capacity you have.",
    },
    {
      question: "Does the debt-to-income calculator include student loans?",
      answer: "Yes, student loan payments should be included in your total monthly debt obligations for an accurate calculation. Even if you're on an income-driven repayment plan, use your actual monthly payment amount. Federal student loans, private student loans, and any outstanding education debt must all be factored into your DTI ratio.",
    },
    {
      question: "How do credit card balances affect my debt-to-income ratio?",
      answer: "Credit card debt is included in your DTI calculation based on your minimum monthly payment, not your total balance. If you carry a $5,000 balance with a minimum payment of $150 per month, use the $150 figure in the calculator. To improve your DTI, paying down credit card balances or requesting higher credit limits can lower your required minimum payments.",
    },
    {
      question: "What monthly debts should I include in this calculator?",
      answer: "Include all recurring monthly debt obligations: mortgage or rent, car loans, student loans, personal loans, credit card minimum payments, child support, alimony, and any other loans or payment plans. Do not include utilities, groceries, insurance premiums, or other variable living expenses, as DTI focuses strictly on debt obligations.",
    },
    {
      question: "Can I improve my debt-to-income ratio for a mortgage application?",
      answer: "Yes, you can improve your DTI by increasing your gross monthly income through a raise or second job, or by paying down existing debt before applying for a mortgage. Most lenders prefer a DTI of 43% or lower for mortgage qualification, so even reducing your ratio to 45% can significantly improve your approval chances. Many borrowers successfully lower their DTI by 5-10 percentage points within 3-6 months of focused debt repayment.",
    },
    {
      question: "Is rent included in the debt-to-income ratio calculation?",
      answer: "Rent is sometimes included depending on the type of loan you're applying for. For mortgage applications, lenders typically do not count current rent in your DTI, but they will count your projected mortgage payment as a debt obligation. For other types of loans like personal loans or auto loans, rent may or may not be included depending on the lender's policy.",
    },
    {
      question: "What income should I use in the debt-to-income calculator?",
      answer: "Use your gross monthly income before taxes, which includes salary, wages, bonuses, commissions, investment income, rental income, and alimony or child support received. Do not include overtime or bonuses unless they are guaranteed and documented for at least 2 years. For self-employed individuals, use your average net income over the past 2 years.",
    },
    {
      question: "What's the difference between front-end and back-end DTI ratios?",
      answer: "The front-end ratio (housing ratio) divides only housing-related debt by gross income and should not exceed 28% for most lenders. The back-end ratio (total DTI) includes all monthly debts and typically should not exceed 36% to 43%, depending on the lender. Most debt-to-income calculators compute the back-end ratio, which is more comprehensive for assessing overall financial health.",
    },
    {
      question: "How often should I recalculate my debt-to-income ratio?",
      answer: "Recalculate your DTI quarterly or whenever you experience a significant change in income or debt levels, such as a raise, job loss, paying off a loan, or taking on new debt. If you're planning to apply for major financing within the next 6-12 months, track your DTI monthly to monitor your progress toward your target ratio. This helps you understand when you'll be in the best position to qualify for favorable loan terms.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // WIDGET JSX (200-250 LINES)
  const widget = (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* INPUT SECTION */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-blue-600"/>
              Monthly Income
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5000"
              value={inputs.monthlyIncome}
              onChange={(e) => setInputs({ ...inputs, monthlyIncome: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Monthly Debt Payments
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1500"
              value={inputs.monthlyDebt}
              onChange={(e) => setInputs({ ...inputs, monthlyDebt: e.target.value })}
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
      {results.dtiRatio > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Debt-to-Income Ratio
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {results.dtiRatio.toFixed(2)}%
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
                      Affordability
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.affordability)}
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
                      Remaining Income
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.remainingIncome)}
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
                    Monthly Overview
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
                        <TableHead className="font-semibold">Income</TableHead>
                        <TableHead className="font-semibold">Debt</TableHead>
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
                            <TableCell>{formatCurrency(row.income)}</TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.debt)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Debt-to-Income Ratio Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Debt-to-Income Ratio Calculator helps you understand your financial leverage by measuring the percentage of your gross monthly income that goes toward debt payments. This metric is crucial for lenders evaluating your creditworthiness and is one of the primary factors determining your eligibility for mortgages, auto loans, and personal loans. Knowing your DTI ratio empowers you to make informed borrowing decisions and identify opportunities to improve your financial profile.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, gather your gross monthly income (salary, bonuses, investment income, etc.) and list all recurring monthly debt payments, including mortgage or rent, car loans, student loans, credit cards (minimum payments only), personal loans, child support, and alimony. The calculator divides your total monthly debt obligations by your gross monthly income and multiplies by 100 to generate your DTI percentage. Accuracy is essential—use actual payment amounts and current income figures to get a precise result.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpreting your results depends on your financial goals and the type of loan you're seeking. A DTI below 36% is considered excellent and qualifies you for favorable loan terms with most lenders. Ratios between 36% and 43% are acceptable for mortgages but may result in slightly higher interest rates or additional requirements. If your DTI exceeds 43%, focus on either increasing your income or paying down existing debt before applying for major loans, as lenders view higher ratios as increased financial risk.</p>
        </div>
      </section>

      {/* TABLE: Debt-to-Income Ratio Standards by Loan Type (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Debt-to-Income Ratio Standards by Loan Type (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different lenders and loan types have varying DTI requirements; here are the typical benchmarks used by major financial institutions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Loan Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Preferred DTI Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum DTI Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Conventional Mortgage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Below 36%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">43%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">FHA loans may allow up to 50% under certain conditions</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">FHA Mortgage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Below 43%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Requires mortgage insurance premium (MIP) at higher ratios</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">VA Mortgage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Below 41%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">VA loans offer more flexibility; lending varies by lender</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">USDA Rural Loan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Below 43%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Guaranteed rural development loans with flexible qualification</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Auto Loan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Below 20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Combined with all other debts; primary consideration is payment history</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Personal Loan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Below 40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Online lenders often more flexible than traditional banks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Credit Card Approval</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Below 35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Based on minimum monthly payments, not total balances</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Home Equity Line (HELOC)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Below 40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Includes existing mortgage payment in calculation</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Standards vary by individual lender, credit score, and economic conditions. These represent 2024-2025 industry norms from major institutional lenders.</p>
      </section>

      {/* TABLE: Sample Debt-to-Income Ratio Calculations */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Sample Debt-to-Income Ratio Calculations</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Real-world examples showing how monthly debts and income affect your final DTI ratio.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Income</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mortgage Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Auto Loan</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Student Loans</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Credit Cards</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Debts</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">DTI Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$6,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">37%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$7,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">43%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,075</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$8,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$5,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$175</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">39%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These examples assume gross monthly income and include all recurring monthly debt obligations. Ratios above 43% typically reduce mortgage approval chances with conventional lenders.</p>
      </section>

      {/* TABLE: Impact of Debt Paydown on DTI Ratio */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Debt Paydown on DTI Ratio</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">See how paying down specific debts can lower your DTI and improve your lending qualification.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Scenario</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Debts</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Income</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Current DTI</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">DTI After Payoff</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pay off $200/month credit card</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Decrease of 4 percentage points</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pay off auto loan ($350/month)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Decrease of 7 percentage points</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pay off personal loan ($250/month)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Decrease of 5 percentage points</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Reduce 3 credit cards by $75/month each</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Decrease of 4 percentage points</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Refinance student loan payment ($300→$150)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,950</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Decrease of 2 percentage points</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">This demonstrates the significant impact debt reduction has on DTI. Even small monthly payments add up; reducing total monthly obligations by $500 lowers a 40% DTI to approximately 30% for a $5,000 monthly income.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your DTI quarterly using this calculator to monitor progress toward your target ratio, especially if you're planning a major purchase like a home or car within the next 12 months.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Prioritize paying down high-interest credit card debt first, as it typically has minimum payments that disproportionately impact your DTI ratio compared to your actual balance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Request increases to your credit card limits without opening new accounts—this can lower your minimum payment requirement and improve your overall DTI without new debt.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If self-employed, calculate your gross income using your average net profit over the past 2 years, as lenders require documented history rather than projected future earnings.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Avoid taking on new debt or making major purchases 3-6 months before applying for a mortgage, as even small new debts can push your DTI above a lender's threshold.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Including Taxes and Deductions as Income Reduction</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using net income (after-tax) instead of gross income understates your actual DTI ratio. Always use your gross monthly income before taxes and deductions, as lenders assess your ability to service debt based on total earnings, not take-home pay.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Include Minimum Credit Card Payments</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people calculate DTI without including credit card minimum payments because they only focus on loan payments. Even small minimum payments of $50-100 per card add up quickly; omitting them can understate your true DTI by 3-5 percentage points.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Projected Income Before It's Documented</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Counting on a promised raise or bonus that hasn't been officially documented won't improve your DTI in a lender's eyes. Most lenders require 2 years of documented history for bonuses or commissions, so only include income you can prove with recent tax returns or pay stubs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Updating DTI After Recent Debt Payoff</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating your DTI with outdated information, such as debts you've already paid off, inflates your ratio and misrepresents your actual borrowing capacity. Recalculate using only active monthly debt obligations to get an accurate picture of your current financial standing.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a good debt-to-income ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A debt-to-income ratio below 36% is generally considered excellent by most lenders, while ratios between 36% and 49% are acceptable for many mortgage and auto loan applications. Anything above 50% is typically viewed as high risk and may disqualify you from conventional financing. The lower your ratio, the more financial flexibility and borrowing capacity you have.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the debt-to-income calculator include student loans?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, student loan payments should be included in your total monthly debt obligations for an accurate calculation. Even if you're on an income-driven repayment plan, use your actual monthly payment amount. Federal student loans, private student loans, and any outstanding education debt must all be factored into your DTI ratio.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do credit card balances affect my debt-to-income ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Credit card debt is included in your DTI calculation based on your minimum monthly payment, not your total balance. If you carry a $5,000 balance with a minimum payment of $150 per month, use the $150 figure in the calculator. To improve your DTI, paying down credit card balances or requesting higher credit limits can lower your required minimum payments.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What monthly debts should I include in this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Include all recurring monthly debt obligations: mortgage or rent, car loans, student loans, personal loans, credit card minimum payments, child support, alimony, and any other loans or payment plans. Do not include utilities, groceries, insurance premiums, or other variable living expenses, as DTI focuses strictly on debt obligations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I improve my debt-to-income ratio for a mortgage application?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, you can improve your DTI by increasing your gross monthly income through a raise or second job, or by paying down existing debt before applying for a mortgage. Most lenders prefer a DTI of 43% or lower for mortgage qualification, so even reducing your ratio to 45% can significantly improve your approval chances. Many borrowers successfully lower their DTI by 5-10 percentage points within 3-6 months of focused debt repayment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is rent included in the debt-to-income ratio calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Rent is sometimes included depending on the type of loan you're applying for. For mortgage applications, lenders typically do not count current rent in your DTI, but they will count your projected mortgage payment as a debt obligation. For other types of loans like personal loans or auto loans, rent may or may not be included depending on the lender's policy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What income should I use in the debt-to-income calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use your gross monthly income before taxes, which includes salary, wages, bonuses, commissions, investment income, rental income, and alimony or child support received. Do not include overtime or bonuses unless they are guaranteed and documented for at least 2 years. For self-employed individuals, use your average net income over the past 2 years.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between front-end and back-end DTI ratios?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The front-end ratio (housing ratio) divides only housing-related debt by gross income and should not exceed 28% for most lenders. The back-end ratio (total DTI) includes all monthly debts and typically should not exceed 36% to 43%, depending on the lender. Most debt-to-income calculators compute the back-end ratio, which is more comprehensive for assessing overall financial health.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my debt-to-income ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate your DTI quarterly or whenever you experience a significant change in income or debt levels, such as a raise, job loss, paying off a loan, or taking on new debt. If you're planning to apply for major financing within the next 6-12 months, track your DTI monthly to monitor your progress toward your target ratio. This helps you understand when you'll be in the best position to qualify for favorable loan terms.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.consumerfinance.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau - Mortgage Debt-to-Income Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal resource explaining DTI standards, mortgage qualification, and consumer lending regulations.</p>
          </li>
          <li>
            <a href="https://www.hud.gov/program_offices/public_indian_housing/programs/ph/phr/about/faq" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Housing Administration - FHA Loan Requirements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official FHA guidelines on debt-to-income ratios and mortgage insurance requirements for government-backed loans.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate - Debt-to-Income Ratio Explained</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide to understanding DTI ratios, lender standards, and how to improve your qualification chances.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia - Debt-to-Income Ratio Definition and Calculator</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Educational resource defining DTI ratios, explaining calculation methods, and providing context for different lending scenarios.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Debt-to-Income Ratio Calculator"
      description="Calculate your Debt-to-Income (DTI) ratio. Essential for assessing mortgage eligibility and understanding your overall financial health."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Debt-to-Income Ratio Calculator" },
        { id: "formula", label: "Debt-to-Income Ratio Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "DTI Ratio = (Total Monthly Debt Payments / Gross Monthly Income) × 100",
        variables: [
          { symbol: "Total Monthly Debt Payments", description: "Sum of all monthly debt obligations" },
          { symbol: "Gross Monthly Income", description: "Total income before taxes and deductions" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you earn $5,000 per month and have $1,500 in monthly debt payments.",
        steps: [
          { 
            step: 1, 
            calculation: "1500 / 5000 = 0.3", 
            description: "Calculate the ratio of debt payments to income." 
          },
          { 
            step: 2, 
            calculation: "0.3 × 100 = 30%", 
            description: "Convert the ratio to a percentage." 
          }
        ],
        result: "The final result is 30%, indicating a moderate debt-to-income ratio."
      }}
      relatedCalculators={[
        {"title":"Loan Payment Calculator (Principal, Rate, Term)","url":"/financial/loan-payment","icon":"💵"},
        {"title":"Mortgage Payment & Amortization Calculator","url":"/financial/mortgage-amortization","icon":"🏠"},
        {"title":"Extra Payments & Payoff Time Calculator","url":"/financial/extra-payments-payoff","icon":"📈"},
        {"title":"Interest-Only Loan Calculator","url":"/financial/interest-only-loan","icon":"💰"},
        {"title":"Refinance Savings Calculator","url":"/financial/refinance-savings","icon":"🔄"},
        {"title":"HELOC Payment Estimator","url":"/financial/heloc-payment-estimator","icon":"🏦"}
      ]}
    />
  );
}
