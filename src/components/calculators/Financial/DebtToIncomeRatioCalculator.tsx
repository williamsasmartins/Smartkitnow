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
    let monthlyIncomeValue = parseFloat(inputs.monthlyIncome) || 0;
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
      question: "What is a debt-to-income ratio calculator and why is it important?",
      answer: "A debt-to-income (DTI) ratio calculator measures the percentage of your gross monthly income that goes towards paying your monthly debt payments. It is a key indicator of your financial health and is widely used by lenders to assess your creditworthiness. A lower DTI ratio indicates a good balance between debt and income, making it easier to qualify for loans and credit cards. Understanding your DTI ratio helps you manage your finances better and plan for future financial goals. For more financial tools, visit our <a href=\"/financial/loan-payment\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Loan Payment Calculator</a>."
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator provides a highly accurate estimate of your DTI ratio based on the inputs you provide. However, the accuracy depends on the accuracy of the data entered. Ensure that all income and debt figures are current and correct to obtain the most reliable results. For complex financial situations, consider consulting a financial advisor for personalized advice."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use this calculator, you'll need to provide your gross monthly income and total monthly debt payments. Gross monthly income includes all sources of income before taxes and deductions, such as salary, bonuses, and rental income. Total monthly debt payments should cover all recurring obligations like loans, credit card payments, and other liabilities. Ensure that the figures are accurate and up-to-date to get the most reliable results."
    },
    {
      question: "Can I use this calculator for mortgage applications?",
      answer: "Yes, this calculator is particularly useful for mortgage applications. Lenders often use the DTI ratio to assess your ability to manage monthly payments and repay loans. A lower DTI ratio increases your chances of mortgage approval and may help you secure better interest rates. Ensure that all income and debt figures are accurate to get the most reliable results. For more mortgage-related calculations, explore our <a href=\"/financial/mortgage-amortization\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Mortgage Payment & Amortization Calculator</a>."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include underestimating debt payments, overestimating income, and not accounting for all sources of income and debt. These errors can lead to inaccurate DTI ratios and misinformed financial decisions. To avoid these mistakes, ensure that all figures are accurate and up-to-date. Regularly review and update your financial information to maintain a reliable DTI ratio."
    },
    {
      question: "How often should I recalculate?",
      answer: "It's advisable to recalculate your DTI ratio whenever there are significant changes in your income or debt levels. This includes changes in employment, salary adjustments, taking on new debt, or paying off existing debt. Regular recalculations help you stay informed about your financial health and make timely adjustments to your financial strategies."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results to assess your financial health and make informed decisions about future financial commitments. A low DTI ratio suggests financial stability, while a high ratio may indicate the need for debt reduction or income enhancement strategies. For personalized advice, consider consulting a financial advisor. Explore our <a href=\"/financial/refinance-savings\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Refinance Savings Calculator</a> for more strategies."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "While the DTI ratio is a standard measure of financial health, other metrics like the credit score and net worth can provide additional insights. Each method has its pros and cons, and the choice depends on your specific financial goals and circumstances. For a comprehensive financial assessment, consider using multiple metrics in conjunction with the DTI ratio."
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
    <div className="skn-editorial space-y-12 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      
      {/* SECTION 1: INTRODUCTION (400-500 words) */}
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Understanding Debt-to-Income Ratio Calculator
        </h2>
        
        <p className="mb-6">
          The Debt-to-Income (DTI) Ratio Calculator is an essential tool for anyone looking to understand their financial health and assess mortgage eligibility. This calculator helps you determine the percentage of your income that goes towards paying debts, which is a critical factor for lenders when evaluating loan applications. By calculating your DTI ratio, you can gain insights into your financial standing and make informed decisions about future financial commitments. Whether you're planning to buy a home, refinance an existing loan, or simply want to manage your finances better, knowing your DTI ratio is crucial.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital in the financial domain, as they can significantly impact your financial planning and decision-making. An incorrect DTI ratio could lead to misjudging your affordability and potentially overextending your finances. According to financial experts, a DTI ratio below 36% is generally considered healthy, while anything above 43% might indicate financial stress. This calculator ensures you have precise data to evaluate your financial situation and make strategic decisions. For more insights, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather your monthly income and total monthly debt payments. Enter these values into the respective fields to calculate your DTI ratio. Ensure that the income includes all sources, such as salary, bonuses, and rental income, while the debt payments should cover all recurring obligations like loans, credit card payments, and other liabilities. For a comprehensive understanding, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Ensure that all income and debt figures are accurate and up-to-date. Inaccurate data can lead to misleading results, affecting your financial decisions. Regularly update your figures to reflect any changes in your financial situation.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for optimizing your DTI ratio include reducing unnecessary debt, increasing income through side hustles or investments, and maintaining a disciplined budget. Understanding the factors that affect your DTI ratio can help you manage it effectively. For more tips, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Debt-to-Income Ratio Calculator Formula
        </h2>
        
        <p className="mb-6">
          The Debt-to-Income (DTI) ratio is calculated using a straightforward formula that divides your total monthly debt payments by your gross monthly income. This formula is widely accepted in the financial industry as a standard measure of financial health. It provides a clear picture of how much of your income is dedicated to servicing debts, which is crucial for lenders assessing your creditworthiness.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          DTI Ratio = (Total Monthly Debt Payments / Gross Monthly Income) × 100
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Total Monthly Debt Payments = Sum of all monthly debt obligations</li>
              <li>Gross Monthly Income = Total income before taxes and deductions</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a critical role in determining your DTI ratio. Total Monthly Debt Payments include all recurring debt obligations such as mortgages, car loans, student loans, and credit card payments. Gross Monthly Income encompasses all sources of income, including salaries, bonuses, and rental income. Changes in either variable can significantly impact your DTI ratio, influencing your financial decisions and loan eligibility.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that affect your Debt-to-Income (DTI) ratio is crucial for effective financial planning. These factors can influence your DTI ratio and, consequently, your financial health and loan eligibility. By managing these factors, you can optimize your DTI ratio and improve your financial standing.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Income Stability
        </h3>
        <p className="mb-4">
          Income stability is a significant factor affecting your DTI ratio. A stable and consistent income ensures that you can meet your debt obligations without financial strain. Lenders often prefer borrowers with steady income sources, as it indicates reliability and reduces the risk of default.
        </p>
        <p className="mb-6">
          To optimize this factor, consider diversifying your income streams or securing a stable job with consistent pay. This can help improve your DTI ratio and make you a more attractive candidate for loans. For more insights, visit our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Debt Management
        </h3>
        <p className="mb-4">
          Effective debt management is crucial for maintaining a healthy DTI ratio. High levels of debt can increase your DTI ratio, making it difficult to qualify for loans or secure favorable interest rates. Managing your debt involves timely payments and strategic debt reduction.
        </p>
        <p className="mb-6">
          Consider consolidating high-interest debts or negotiating better terms with creditors. Reducing unnecessary expenses and prioritizing debt repayment can also help lower your DTI ratio. Explore our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a> for more strategies.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Credit Utilization
        </h3>
        <p className="mb-4">
          Credit utilization refers to the percentage of your credit limit that you're currently using. High credit utilization can negatively impact your DTI ratio and credit score. It's essential to maintain a low credit utilization rate to improve your financial health.
        </p>
        <p className="mb-6">
          Aim to keep your credit utilization below 30% of your total credit limit. Regularly monitor your credit usage and pay off balances promptly to maintain a healthy DTI ratio. For more tips, check out our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Economic Conditions
        </h3>
        <p className="mb-6">
          Economic conditions can significantly influence your DTI ratio. During economic downturns, income stability may be threatened, and debt levels can increase due to financial strain. It's crucial to be aware of economic trends and adjust your financial strategies accordingly.
        </p>
        <p className="mb-6">
          Stay informed about economic indicators and consider building an emergency fund to cushion against economic uncertainties. This proactive approach can help you maintain a healthy DTI ratio even during challenging times.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Lifestyle Choices
        </h3>
        <p className="mb-6">
          Your lifestyle choices, including spending habits and financial priorities, can affect your DTI ratio. Overspending or living beyond your means can increase debt levels and negatively impact your financial health. It's essential to make conscious financial decisions and prioritize long-term stability over short-term gratification.
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
              <div 
                className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 space-y-3 prose dark:prose-invert max-w-none"
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
                Federal Reserve - Debt-to-Income Ratios
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on debt-to-income ratios and their impact on financial stability.
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
                Consumer Financial Protection Bureau - Managing Debt
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources on managing debt.
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
                FDIC - Personal Finance Resources
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and deposit insurance information relevant to personal finance.
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
                Internal Revenue Service - Financial Planning
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and financial planning resources from the IRS.
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
                Investopedia - Debt Management
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts related to debt management.
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
                NerdWallet - Personal Finance Guides
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers seeking financial advice.
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
