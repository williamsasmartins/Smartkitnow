import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function PaycheckCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    hoursWorked: "", 
    hourlyRate: "", 
    overtimeHours: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is paycheck calculator and why is it important?",
      answer: "A paycheck calculator is a tool that helps you estimate your earnings based on your work hours, hourly rate, and overtime. It's important because it allows you to plan your finances accurately, ensuring you know how much money you'll have available for expenses, savings, and investments. Understanding your paycheck is crucial for effective budgeting and financial planning. For more insights, visit our <a href=\"/financial/heloc-payment-estimator\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">HELOC Payment Estimator</a>."
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator provides a high level of accuracy for estimating gross pay based on the inputs provided. However, it does not account for taxes and other deductions, which can affect your net pay. For precise financial planning, consider these factors or consult with a financial advisor. Always ensure your input data is correct to maximize the calculator's accuracy."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "You need to know your total hours worked, your hourly rate, and any overtime hours. This information is typically found on your timesheet or work schedule. Ensure that you have the most recent and accurate data to input into the calculator for the best results. Having this information readily available will streamline your use of the calculator and improve the accuracy of your paycheck estimation."
    },
    {
      question: "Can I use this calculator for specific scenarios?",
      answer: "Yes, this calculator can be used for various scenarios, including part-time work, freelance projects, and jobs with irregular hours. However, it is designed to estimate gross pay and does not account for taxes or deductions, which should be considered separately. For specific scenarios involving complex deductions or benefits, consulting with a payroll specialist might be beneficial."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include entering incorrect hours or rates, not accounting for all overtime, and misunderstanding the impact of deductions. These errors can lead to inaccurate paycheck estimates and financial planning issues. Double-check your inputs and ensure you understand your pay structure to avoid these mistakes."
    },
    {
      question: "How often should I recalculate?",
      answer: "Recalculate your paycheck whenever there is a change in your work hours, hourly rate, or overtime. Regular recalculations ensure that your financial planning remains accurate and up-to-date. Consider recalculating at the start of each pay period or when you receive a raise or change in job role."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results to plan your budget, allocate funds for savings, and manage expenses. Understanding your paycheck allows you to make informed financial decisions and avoid overspending. If you're looking to optimize your savings, consider using our <a href=\"/financial/refinance-savings\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Refinance Savings Calculator</a>."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Alternatives include using payroll software or consulting with a payroll specialist for more complex calculations. These methods may offer additional insights into deductions and benefits. For those with straightforward pay structures, this calculator provides a quick and efficient way to estimate earnings."
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
    const hoursWorked = parseFloat(inputs.hoursWorked) || 0;
    const hourlyRate = parseFloat(inputs.hourlyRate) || 0;
    const overtimeHours = parseFloat(inputs.overtimeHours) || 0;

    // Validate
    if (hoursWorked <= 0 || hourlyRate <= 0) {
      return { 
        mainResult: 0, 
        overtimePay: 0, 
        totalPay: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const regularPay = hoursWorked * hourlyRate;
    const overtimePay = overtimeHours * hourlyRate * 1.5;
    const totalPay = regularPay + overtimePay;

    // Generate schedule data if applicable (e.g., pay breakdown)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      regularPay: regularPay / 12,
      overtimePay: overtimePay / 12,
      totalPay: totalPay / 12,
    }));

    return { 
      mainResult: regularPay, 
      overtimePay, 
      totalPay, 
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
    setInputs({ hoursWorked: "", hourlyRate: "", overtimeHours: "" });
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
              Hours Worked
            </Label>
            <Input
              type="number"
              placeholder="e.g., 40"
              value={inputs.hoursWorked}
              onChange={(e) => setInputs({ ...inputs, hoursWorked: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Hourly Rate
            </Label>
            <Input
              type="number"
              placeholder="e.g., 15"
              value={inputs.hourlyRate}
              onChange={(e) => setInputs({ ...inputs, hourlyRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Overtime Hours
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={inputs.overtimeHours}
              onChange={(e) => setInputs({ ...inputs, overtimeHours: e.target.value })}
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
                      Regular Pay
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
                      Overtime Pay
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.overtimePay)}
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
                      Total Pay
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalPay)}
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* PAY SCHEDULE TABLE */}
          {results.scheduleData && results.scheduleData.length > 0 && (
            <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Weekly Pay Breakdown
                  </span>
                  {results.scheduleData.length > 6 && (
                    <Button 
                      onClick={() => setShowFullTable(!showFullTable)} 
                      variant="outline"
                      size="sm"
                      className="border-gray-300 dark:border-gray-600"
                    >
                      {showFullTable 
                        ? 'Show Less' 
                        : `Show All ${results.scheduleData.length} Weeks`}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900">
                        <TableHead className="font-semibold">Week</TableHead>
                        <TableHead className="font-semibold">Regular Pay</TableHead>
                        <TableHead className="font-semibold">Overtime Pay</TableHead>
                        <TableHead className="font-semibold">Total Pay</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.scheduleData
                        .slice(0, showFullTable ? undefined : 6)
                        .map((row, idx) => (
                          <TableRow 
                            key={idx} 
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <TableCell className="font-medium">{row.week}</TableCell>
                            <TableCell>{formatCurrency(row.regularPay)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.overtimePay)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.totalPay)}
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
    <div className="skn-editorial space-y-12 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      
      {/* SECTION 1: INTRODUCTION (400-500 words) */}
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Understanding Paycheck Calculator
        </h2>
        
        <p className="mb-6">
          The Paycheck Calculator is an essential tool for anyone looking to understand their earnings more comprehensively. Whether you're a full-time employee, a part-time worker, or a freelancer, knowing exactly how much you'll take home after a week or month of work is crucial for effective financial planning. This calculator helps you estimate your paycheck by considering the hours you've worked, your hourly rate, and any overtime hours. It's particularly useful for those with variable hours or who frequently work overtime, as it allows for a more accurate prediction of earnings.
        </p>
        
        <p className="mb-6">
          Accurate paycheck calculations are vital because they directly impact your budgeting and financial health. Miscalculations can lead to overspending or under-saving, which might cause financial stress. According to a survey by the American Payroll Association, nearly 70% of Americans live paycheck to paycheck, highlighting the importance of precise paycheck management. This tool aids in eliminating guesswork, ensuring you have a clear picture of your financial standing. For more insights on financial planning, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information such as your total hours worked, your hourly wage, and any overtime hours. Enter these values into the respective fields to calculate your expected earnings. This tool is designed to be user-friendly, providing instant results that help you plan your finances better. For those interested in mortgage calculations, our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a> might be of interest.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check your inputs for accuracy. Small errors in the number of hours worked or your hourly rate can lead to significant discrepancies in your paycheck estimation. Ensure that you account for any overtime correctly to avoid underestimating your earnings.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include regularly updating your inputs to reflect any changes in your work schedule or pay rate. This is especially important for those with fluctuating work hours. Additionally, consider the impact of taxes and other deductions, which this calculator does not account for. For a comprehensive financial overview, consider using our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Paycheck Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this paycheck calculator is straightforward yet effective for estimating earnings. It calculates your regular pay by multiplying the hours worked by your hourly rate. For overtime, it multiplies the overtime hours by the hourly rate and then by 1.5, which is the standard overtime pay rate. This method is widely accepted and used across various industries, ensuring that the calculations align with common payroll practices.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Total Pay = (Hours Worked × Hourly Rate) + (Overtime Hours × Hourly Rate × 1.5)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Hours Worked = Total regular hours worked</li>
              <li>Hourly Rate = Your pay per hour</li>
              <li>Overtime Hours = Total hours worked beyond regular hours</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each component of the formula plays a critical role in determining your paycheck. The "Hours Worked" and "Hourly Rate" are straightforward inputs that reflect your standard earnings. The "Overtime Hours" factor is crucial for those who work beyond the typical workweek, as it accounts for the increased pay rate. Adjusting any of these variables will directly affect the total pay, making it essential to input accurate data. For further reading on financial calculations, visit our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your paycheck calculations is crucial for accurate financial planning. These factors interact in complex ways, and being aware of them can help you optimize your earnings and budgeting strategies.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Hours Worked
        </h3>
        <p className="mb-4">
          The total number of hours worked is the most significant factor in determining your paycheck. This includes both regular and overtime hours. Accurately tracking your hours ensures that you receive the correct compensation for your work.
        </p>
        <p className="mb-6">
          It's important to log your hours meticulously, especially if your work schedule varies. Many employers use time-tracking software to ensure accuracy, but keeping a personal record can help verify your paycheck. For more on managing work hours, see our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Hourly Rate
        </h3>
        <p className="mb-4">
          Your hourly rate is the foundation of your earnings calculation. It varies based on your job role, industry, and experience level. Understanding how your rate compares to industry standards can provide insights into your earning potential.
        </p>
        <p className="mb-6">
          Negotiating your hourly rate can significantly impact your overall earnings. Consider factors such as your skills, experience, and the demand for your role when discussing pay rates with employers.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Overtime Hours
        </h3>
        <p className="mb-4">
          Overtime hours are typically compensated at a higher rate, often 1.5 times the regular hourly rate. This can substantially increase your paycheck if you frequently work beyond standard hours.
        </p>
        <p className="mb-6">
          It's essential to understand your company's overtime policy and ensure that all extra hours are documented and approved. This ensures that you're compensated fairly for your additional efforts.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Tax Deductions
        </h3>
        <p className="mb-6">
          While this calculator provides a gross pay estimate, tax deductions can significantly affect your net pay. Understanding the tax implications of your earnings is crucial for accurate financial planning. Consider consulting with a tax professional to optimize your deductions and maximize your take-home pay.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Benefits and Deductions
        </h3>
        <p className="mb-6">
          Additional deductions such as health insurance, retirement contributions, and other benefits can also impact your net pay. Understanding these deductions and how they affect your paycheck can help you better plan your finances and ensure that you're maximizing your benefits.
        </p>
      </section>

      {/* SECTION 4: FAQ (1000-1200 words with 8 questions) */}
      <section id="faq" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
                <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
                {faq.question}
              </h3>
              <p 
                className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: REFERENCES WITH DESCRIPTIONS (MANDATORY) */}
      <section id="references" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Official References & Resources
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.federalreserve.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Federal Reserve - Wage and Employment Data
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on employment, wages, and economic conditions.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.consumerfinance.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Consumer Financial Protection Bureau - Financial Guides
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.fdic.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                FDIC - Banking and Financial Services
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and deposit insurance information.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.irs.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Internal Revenue Service - Tax Information
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.investopedia.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Investopedia - Financial Education
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.nerdwallet.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                NerdWallet - Personal Finance Tools
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Paycheck Calculator"
      description="Calculate your paycheck based on hours worked, pay rate, and overtime. Get an accurate salary estimation for your next pay period."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Paycheck Calculator" },
        { id: "formula", label: "Paycheck Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Total Pay = (Hours Worked × Hourly Rate) + (Overtime Hours × Hourly Rate × 1.5)",
        variables: [
          { symbol: "Hours Worked", description: "Total regular hours worked" },
          { symbol: "Hourly Rate", description: "Your pay per hour" },
          { symbol: "Overtime Hours", description: "Total hours worked beyond regular hours" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you work 40 regular hours and 5 overtime hours at a rate of $20/hour.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "40 × 20 = 800", 
            explanation: "Calculate regular pay" 
          },
          { 
            label: "Step 2", 
            calculation: "5 × 20 × 1.5 = 150", 
            explanation: "Calculate overtime pay" 
          },
          { 
            label: "Step 3", 
            calculation: "800 + 150 = 950", 
            explanation: "Total pay for the period" 
          }
        ],
        result: "The final result is $950, meaning your total earnings for the week including overtime."
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📈" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "💳" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "💰" },
        { "title": "HELOC Payment Estimator", "url": "/financial/heloc-payment-estimator", "icon": "🏦" }
      ]}
    />
  );
}
