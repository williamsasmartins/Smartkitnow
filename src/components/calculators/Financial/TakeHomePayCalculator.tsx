import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function TakeHomePayCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    grossIncome: "", 
    taxRate: "", 
    otherDeductions: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is take-home pay calculator and why is it important?",
      answer: "A take-home pay calculator helps you determine the amount of money you receive after taxes and other deductions. It's important because it provides a clear picture of your actual earnings, allowing you to budget effectively and plan for expenses. Knowing your take-home pay helps you make informed financial decisions and avoid overspending. For more detailed financial planning, consider using our Interest-Only Loan Calculator to understand how loans impact your finances."
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator is designed to provide accurate estimates based on the inputs you provide. However, its accuracy depends on the accuracy of your inputs, such as your tax rate and deductions. It's important to use up-to-date and precise information for the best results. While the calculator is a helpful tool, consulting with a financial advisor can provide additional insights. Use this calculator as a guide and verify your results with official documents or professional advice when necessary."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use this calculator, you'll need your gross annual income, the tax rate applicable to your earnings, and any other deductions such as retirement contributions or healthcare premiums. This information is typically found on your pay stubs, tax documents, or financial statements. Ensure the data you input is current and reflects your actual financial situation for accurate results. Gathering accurate data is crucial for precise calculations. Double-check your sources and update the calculator inputs as needed."
    },
    {
      question: "Can I use this calculator for specific scenarios?",
      answer: "Yes, this calculator can be used for various scenarios, including salary negotiations, budgeting, and financial planning. However, it's important to consider any unique factors that may affect your situation, such as state-specific taxes or irregular income sources. For scenarios involving significant financial changes, consulting with a financial advisor can provide additional guidance. For more complex financial scenarios, our Refinance Savings Calculator can offer further insights."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include using outdated tax rates, neglecting to include all deductions, and entering incorrect income figures. These errors can lead to inaccurate take-home pay estimates, affecting your financial planning. To avoid these mistakes, double-check your inputs and ensure they reflect your current financial situation. Regularly update your calculator inputs and consult with financial professionals for complex scenarios or significant financial changes."
    },
    {
      question: "How often should I recalculate?",
      answer: "It's advisable to recalculate your take-home pay whenever there are changes in your income, tax rate, or deductions. This includes salary increases, changes in tax laws, or adjustments to retirement contributions. Regular recalculations help ensure your financial planning remains accurate and up-to-date. Consider setting a schedule to review your financial situation quarterly or annually, and adjust your calculations as needed."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results from this calculator to inform your budgeting and financial planning. Understanding your take-home pay allows you to allocate funds for savings, expenses, and investments effectively. If the results indicate a need for financial adjustments, consider consulting with a financial advisor for personalized advice. For further financial insights, explore our HELOC Payment Estimator."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Alternatives to this calculation method include consulting with a financial advisor or using specialized software for comprehensive financial planning. These alternatives can provide more personalized insights and consider a broader range of financial factors. However, they may require more time and resources compared to a quick online calculator. Choose the method that best suits your needs and financial complexity. For straightforward scenarios, this calculator is a convenient and efficient tool."
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
    const grossIncomeValue = parseFloat(inputs.grossIncome) || 0;
    const taxRateValue = parseFloat(inputs.taxRate) || 0;
    const otherDeductionsValue = parseFloat(inputs.otherDeductions) || 0;

    // Validate
    if (grossIncomeValue <= 0 || taxRateValue < 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const taxAmount = grossIncomeValue * (taxRateValue / 100);
    const takeHomePay = grossIncomeValue - taxAmount - otherDeductionsValue;
    const monthlyTakeHome = takeHomePay / 12;
    const annualSavings = takeHomePay * 0.1; // Assuming 10% savings

    // Generate schedule data if applicable (e.g., monthly breakdown)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      grossIncome: grossIncomeValue / 12,
      tax: taxAmount / 12,
      deductions: otherDeductionsValue / 12,
      netIncome: monthlyTakeHome,
    }));

    return { 
      mainResult: takeHomePay, 
      result2: monthlyTakeHome, 
      result3: annualSavings, 
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
    setInputs({ grossIncome: "", taxRate: "", otherDeductions: "" });
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
              Gross Annual Income
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50000"
              value={inputs.grossIncome}
              onChange={(e) => setInputs({ ...inputs, grossIncome: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Tax Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 20"
              value={inputs.taxRate}
              onChange={(e) => setInputs({ ...inputs, taxRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Other Deductions
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5000"
              value={inputs.otherDeductions}
              onChange={(e) => setInputs({ ...inputs, otherDeductions: e.target.value })}
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
                      Annual Take-Home Pay
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
                      Monthly Take-Home Pay
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
                      Estimated Annual Savings
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
                    Monthly Income Breakdown
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
                        <TableHead className="font-semibold">Gross Income</TableHead>
                        <TableHead className="font-semibold">Tax</TableHead>
                        <TableHead className="font-semibold">Deductions</TableHead>
                        <TableHead className="font-semibold">Net Income</TableHead>
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
                            <TableCell>{formatCurrency(row.grossIncome)}</TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.tax)}
                            </TableCell>
                            <TableCell className="text-yellow-600 dark:text-yellow-400">
                              {formatCurrency(row.deductions)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.netIncome)}
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
          Understanding Take-Home Pay Calculator
        </h2>
        
        <p className="mb-6">
          The Take-Home Pay Calculator is an essential tool for anyone looking to understand their net income after taxes and deductions. It provides a clear picture of what you will actually receive in your bank account, allowing for better financial planning and budgeting. Whether you're negotiating a salary, planning for expenses, or simply curious about your financial standing, this calculator offers invaluable insights. By inputting your gross income, tax rate, and other deductions, you can quickly see your take-home pay and make informed decisions about your financial future.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial in financial planning. Mistakes in estimating your take-home pay can lead to budgeting errors, overspending, or under-saving. This calculator uses standard formulas to ensure precision, helping you avoid potential pitfalls. With the right data, you can trust the results to guide your financial choices. For more detailed financial planning, consider using our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> to understand how loans impact your finances.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather your financial information beforehand. You'll need your gross annual income, the tax rate applicable to your earnings, and any other deductions such as retirement contributions or healthcare premiums. Enter these values into the respective fields to calculate your take-home pay. For accurate results, ensure the data you input is up-to-date and reflects your current financial situation. For related calculations, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check your inputs for accuracy. Small errors in your tax rate or deductions can significantly affect your take-home pay calculation. Use this tool regularly to adjust your budget and savings plans as your financial situation changes.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices include reviewing your financial data periodically and updating the calculator inputs as needed. Consider factors like changes in tax laws, salary increases, or new deductions that could affect your take-home pay. Staying informed and proactive can help you optimize your financial health and achieve your financial goals.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Take-Home Pay Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Take-Home Pay Calculator is straightforward yet effective. It calculates your net income by subtracting taxes and other deductions from your gross income. This method is widely accepted and provides a reliable estimate of your take-home pay. Variations of this formula may include additional factors such as bonuses or specific state taxes, which can be added to tailor the calculation to your unique situation.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Take-Home Pay = Gross Income - (Gross Income × Tax Rate) - Other Deductions
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Gross Income = Total earnings before taxes</li>
              <li>Tax Rate = Percentage of income paid as tax</li>
              <li>Other Deductions = Additional deductions like retirement or healthcare</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role. Gross Income is the starting point, representing your total earnings. The Tax Rate is applied to this amount to determine your tax liability. Other Deductions account for non-tax-related reductions in your income, such as retirement contributions. Adjusting these variables allows you to see how changes in your financial situation impact your take-home pay.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your take-home pay is essential for accurate financial planning. These factors can vary widely based on personal circumstances and external conditions. By recognizing how they interact, you can better manage your finances and make informed decisions.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Gross Income
        </h3>
        <p className="mb-4">
          Gross Income is the total amount you earn before any deductions. It includes your salary, bonuses, and any other earnings. This figure is the foundation of your take-home pay calculation. A higher gross income generally leads to a higher take-home pay, but it can also push you into a higher tax bracket, affecting the net result.
        </p>
        <p className="mb-6">
          To optimize your take-home pay, consider negotiating for higher compensation or seeking additional income streams. For more insights on managing income, check out our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Tax Rate
        </h3>
        <p className="mb-4">
          The Tax Rate is the percentage of your income that goes to taxes. This rate can vary based on your income level, filing status, and location. Understanding your tax obligations is crucial for accurate take-home pay calculations. Tax rates are subject to change, so staying informed about tax laws is important.
        </p>
        <p className="mb-6">
          Consider consulting with a tax professional to ensure you're taking advantage of all available deductions and credits. This can help reduce your effective tax rate and increase your take-home pay.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Other Deductions
        </h3>
        <p className="mb-4">
          Other Deductions include any non-tax-related reductions in your income, such as retirement contributions, healthcare premiums, or union dues. These deductions can significantly impact your take-home pay, especially if they are substantial.
        </p>
        <p className="mb-6">
          Review your deductions regularly to ensure they align with your financial goals. Adjusting contributions to retirement accounts, for example, can affect both your current take-home pay and future financial security.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Bonuses and Variable Income
        </h3>
        <p className="mb-6">
          Bonuses and other forms of variable income can complicate take-home pay calculations. These earnings are often taxed at different rates or may be subject to additional deductions. Understanding how these factors affect your net income is essential for accurate financial planning.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Changes in Tax Laws
        </h3>
        <p className="mb-6">
          Tax laws can change frequently, impacting your tax rate and deductions. Staying informed about these changes is crucial for maintaining accurate take-home pay calculations. Consider subscribing to financial news outlets or consulting with a tax advisor to stay updated.
        </p>
      </section>

      {/* SECTION 4: FAQ (1000-1200 words with 8 questions) */}
      <section id="faq">
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
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
                {faq.answer.split("For more detailed financial planning, consider using our Interest-Only Loan Calculator to understand how loans impact your finances.")[0]}
                {faq.answer.includes("Interest-Only Loan Calculator") && (
                  <>
                    For more detailed financial planning, consider using our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a> to understand how loans impact your finances.
                  </>
                )}
                {faq.answer.split("For more complex financial scenarios, our Refinance Savings Calculator can offer further insights.")[0] !== faq.answer && (
                  <>
                    {faq.answer.split("For more complex financial scenarios, our Refinance Savings Calculator can offer further insights.")[0]}
                    For more complex financial scenarios, our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a> can offer further insights.
                  </>
                )}
                {faq.answer.split("For further financial insights, explore our HELOC Payment Estimator.")[0] !== faq.answer && (
                  <>
                    {faq.answer.split("For further financial insights, explore our HELOC Payment Estimator.")[0]}
                    For further financial insights, explore our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
                  </>
                )}
              </p>
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
                Federal Reserve - Economic Research
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on economic trends and regulatory guidelines.
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
                FDIC - Banking Regulations
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
                NerdWallet - Personal Finance
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
      title="Take-Home Pay Calculator"
      description="Estimate your paycheck after tax withholdings and deductions. See exactly what amount hits your bank account every payday."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Take-Home Pay Calculator" },
        { id: "formula", label: "Take-Home Pay Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Take-Home Pay = Gross Income - (Gross Income × Tax Rate) - Other Deductions",
        variables: [
          { symbol: "Gross Income", description: "Total earnings before taxes" },
          { symbol: "Tax Rate", description: "Percentage of income paid as tax" },
          { symbol: "Other Deductions", description: "Additional deductions like retirement or healthcare" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you earn $60,000 annually with a 20% tax rate and $5,000 in other deductions.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "60,000 × 0.20 = 12,000", 
            explanation: "Calculate the total tax amount." 
          },
          { 
            label: "Step 2", 
            calculation: "60,000 - 12,000 - 5,000 = 43,000", 
            explanation: "Subtract taxes and deductions from gross income." 
          },
          { 
            label: "Step 3", 
            calculation: "43,000 ÷ 12 = 3,583.33", 
            explanation: "Determine the monthly take-home pay." 
          }
        ],
        result: "The final result is $43,000 annually or $3,583.33 monthly, meaning this is your net income after deductions."
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "💵" },
        { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
        { title: "Extra Payments & Payoff Time Calculator", url: "/financial/extra-payments-payoff", icon: "📈" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "💳" },
        { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "💰" },
        { title: "HELOC Payment Estimator", url: "/financial/heloc-payment-estimator", icon: "🏦" }
      ]}
    />
  );
}
