import { useState, useMemo, useRef } from "react";
import { useFaqJsonLd } from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function StockDcaReturnEstimatorCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    monthlyInvestment: "", 
    annualReturn: "", 
    years: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is stock DCA return estimator and why is it important?",
      answer: "The Stock DCA Return Estimator is a tool that calculates the future value of investments made through dollar cost averaging. It helps investors understand the potential growth of their portfolio by consistently investing a fixed amount over time. This approach is important because it reduces the impact of market volatility and allows investors to benefit from compounding returns. By using this estimator, investors can make informed decisions about their investment strategy and plan for long-term financial goals. For more on investment strategies, check out our Interest-Only Loan Calculator."
    },
    {
      question: "How accurate is this calculator?",
      answer: "The accuracy of the Stock DCA Return Estimator depends on the inputs provided by the user. While the calculator uses standard financial formulas to estimate future values, actual results may vary due to market conditions, economic factors, and changes in interest rates. It's important to use realistic assumptions and regularly update your inputs to reflect current conditions. For precise financial planning, consider consulting with a financial advisor who can provide personalized advice based on your unique situation."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use the Stock DCA Return Estimator, you'll need to provide your monthly investment amount, the expected annual return rate, and the number of years you plan to invest. These inputs allow the calculator to estimate the future value of your investments, considering compound interest and regular contributions. Ensure that your inputs are accurate and reflect your current financial situation. You can find information about expected return rates from financial advisors or online resources that provide historical market data."
    },
    {
      question: "Can I use this calculator for specific scenarios?",
      answer: "Yes, the Stock DCA Return Estimator can be used for various investment scenarios, including retirement planning, saving for education, or building a nest egg. By adjusting the inputs, you can tailor the calculator to fit your specific goals and timeframes. However, keep in mind that the calculator provides estimates based on the information you provide. For more complex scenarios, such as tax implications or withdrawal strategies, consider consulting with a financial professional who can offer tailored advice."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "One common mistake is using unrealistic return rates, which can lead to overestimating future portfolio values. It's important to base your assumptions on historical data and current market conditions. Another mistake is not considering the impact of fees and taxes, which can reduce overall returns. To avoid these errors, ensure your inputs are accurate and consider consulting with a financial advisor for guidance on realistic assumptions and comprehensive financial planning."
    },
    {
      question: "How often should I recalculate?",
      answer: "It's advisable to recalculate your investment projections at least annually or whenever there are significant changes in your financial situation, such as a change in income, investment goals, or market conditions. Regular recalculations help ensure your strategy remains aligned with your objectives. By staying proactive and adjusting your strategy as needed, you can better navigate market fluctuations and optimize your investment outcomes."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results from the Stock DCA Return Estimator to inform your investment strategy and financial planning. The estimated future value can help you assess whether you're on track to meet your financial goals or if adjustments are needed. Consider discussing your results with a financial advisor to explore potential changes to your investment approach. For additional financial planning tools, explore our Refinance Savings Calculator to evaluate potential savings from refinancing existing loans."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Alternatives to the Stock DCA Return Estimator include lump-sum investment calculators and portfolio management software that offer more comprehensive analysis and scenario planning. These tools can provide insights into different investment strategies and help you compare potential outcomes. While DCA is a popular strategy for mitigating risk, it's important to explore other methods that may better suit your risk tolerance and financial goals. Consulting with a financial advisor can provide personalized recommendations based on your unique circumstances."
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
    let monthlyInvestment = parseFloat(inputs.monthlyInvestment) || 0;
    const annualReturn = parseFloat(inputs.annualReturn) || 0;
    const years = parseFloat(inputs.years) || 0;

    // Validate
    if (monthlyInvestment <= 0 || annualReturn <= 0 || years <= 0) {
      return { 
        mainResult: 0, 
        totalInvested: 0, 
        totalInterest: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const months = years * 12;
    const monthlyRate = annualReturn / 100 / 12;
    let futureValue = 0;

    for (let i = 0; i < months; i++) {
      futureValue = (futureValue + monthlyInvestment) * (1 + monthlyRate);
    }

    const totalInvested = monthlyInvestment * months;
    const totalInterest = futureValue - totalInvested;

    // Generate schedule data if applicable
    const scheduleData = Array.from({ length: months }, (_, i) => {
      const balance = (monthlyInvestment * (i + 1)) * Math.pow(1 + monthlyRate, months - i);
      return {
        month: i + 1,
        investment: monthlyInvestment,
        balance: balance,
        interest: balance - monthlyInvestment * (i + 1)
      };
    });

    return { 
      mainResult: futureValue, 
      totalInvested, 
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
    setInputs({ monthlyInvestment: "", annualReturn: "", years: "" });
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
              Monthly Investment
            </Label>
            <Input
              type="number"
              placeholder="e.g., 500"
              value={inputs.monthlyInvestment}
              onChange={(e) => setInputs({ ...inputs, monthlyInvestment: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Annual Return Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 7"
              value={inputs.annualReturn}
              onChange={(e) => setInputs({ ...inputs, annualReturn: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Investment Duration (Years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 30"
              value={inputs.years}
              onChange={(e) => setInputs({ ...inputs, years: e.target.value })}
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
                      Future Value of Investment
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
                      Total Invested
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalInvested)}
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
                      Total Interest Earned
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
                    Investment Schedule
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
                        : `Show All ${results.scheduleData.length} Entries`}
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
                        <TableHead className="font-semibold">Investment</TableHead>
                        <TableHead className="font-semibold">Balance</TableHead>
                        <TableHead className="font-semibold">Interest</TableHead>
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
                            <TableCell>{formatCurrency(row.investment)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.balance)}
                            </TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.interest)}
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
          Understanding Stock DCA Return Estimator
        </h2>
        
        <p className="mb-6">
          The Stock DCA (Dollar Cost Averaging) Return Estimator is a powerful tool designed to help investors visualize the potential growth of their stock market investments over time. By consistently investing a fixed amount of money at regular intervals, investors can mitigate the impact of market volatility and potentially enhance their returns. This calculator allows users to input their monthly investment amount, expected annual return rate, and investment duration to estimate the future value of their portfolio. Whether you're a seasoned investor or just starting, understanding the long-term benefits of dollar cost averaging can be crucial for building wealth.
        </p>
        
        <p className="mb-6">
          Accurate calculations are essential in the financial domain, as they directly influence investment decisions and financial planning. Incorrect estimations can lead to suboptimal investment strategies and missed opportunities for growth. By using this calculator, investors can make informed decisions based on realistic projections of their portfolio's future value. According to studies, consistent investment strategies like DCA can outperform attempts to time the market. For more insights, explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> to understand how consistent payments can impact loan amortization.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information about your monthly investment amount, the expected annual return rate, and the number of years you plan to invest. Enter these values into the respective fields to calculate the future value of your investments. The calculator will provide a detailed breakdown of your total investment, interest earned, and the overall growth of your portfolio. For those interested in mortgage calculations, our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a> offers insights into how regular payments can reduce loan balances over time.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            When using the Stock DCA Return Estimator, remember that past performance is not indicative of future results. While historical data can provide insights, market conditions can change, affecting returns. It's advisable to periodically review and adjust your investment strategy to align with your financial goals and risk tolerance.
          </p>
        </div>
        
        <p className="mb-6">
          For optimal results, consider factors such as market trends, economic conditions, and your personal financial situation. Regularly reviewing your investment strategy and making adjustments as needed can help you stay on track to meet your financial goals. Additionally, understanding the impact of compound interest and reinvestment can further enhance your portfolio's growth potential.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Stock DCA Return Estimator Formula
        </h2>
        
        <p className="mb-6">
          The Stock DCA Return Estimator relies on a formula that calculates the future value of a series of regular investments, considering compound interest. This formula is a standard approach in financial calculations, allowing investors to estimate the growth of their investments over time. The formula takes into account the monthly investment amount, the annual return rate, and the investment duration in years. By applying this formula, investors can gain insights into how their investments will grow, helping them make informed decisions about their financial future.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          FV = P × [(1 + r)^n - 1] / r
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>P = Monthly investment amount</li>
              <li>r = Monthly interest rate (annual rate / 12)</li>
              <li>n = Total number of investments (years × 12)</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the future value of your investments. The monthly investment amount (P) represents the consistent contribution you make to your portfolio. The monthly interest rate (r) is derived from the annual return rate, reflecting the expected growth of your investments. The total number of investments (n) accounts for the duration of your investment plan, emphasizing the importance of long-term commitment to achieve significant growth. By understanding these variables, investors can tailor their strategies to maximize returns.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your investment results is crucial for maximizing returns. These factors interact with each other, affecting the overall growth of your portfolio. By considering these elements, investors can make informed decisions and adjust their strategies to align with their financial goals.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Volatility
        </h3>
        <p className="mb-4">
          Market volatility refers to the fluctuations in stock prices over time. While volatility can create opportunities for gains, it also poses risks. By investing consistently through dollar cost averaging, investors can mitigate the impact of market volatility, buying more shares when prices are low and fewer shares when prices are high.
        </p>
        <p className="mb-6">
          To optimize your strategy, consider diversifying your portfolio to spread risk across different asset classes. This approach can help balance the effects of market volatility, ensuring more stable returns. For more insights on managing loans, explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Economic Conditions
        </h3>
        <p className="mb-4">
          Economic conditions, such as inflation rates and interest rates, can significantly impact investment returns. During periods of high inflation, the purchasing power of your returns may decrease, affecting the real value of your investments. Conversely, favorable economic conditions can enhance growth prospects.
        </p>
        <p className="mb-6">
          Monitoring economic indicators and adjusting your investment strategy accordingly can help you navigate changing conditions. Consider consulting financial experts to gain insights into how macroeconomic trends may affect your portfolio.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Investment Duration
        </h3>
        <p className="mb-4">
          The duration of your investment plan plays a critical role in determining the growth of your portfolio. Longer investment horizons allow for greater compounding of returns, potentially leading to substantial growth. Shorter durations may limit the impact of compounding, reducing overall returns.
        </p>
        <p className="mb-6">
          To maximize the benefits of compounding, consider starting your investment journey early and maintaining a long-term perspective. This approach can help you achieve your financial goals and build wealth over time.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Asset Allocation
        </h3>
        <p className="mb-6">
          Asset allocation refers to the distribution of investments across different asset classes, such as stocks, bonds, and real estate. A well-diversified portfolio can help manage risk and enhance returns by balancing the performance of different assets. Understanding how asset allocation affects your portfolio's growth is essential for optimizing your investment strategy.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Reinvestment Strategy
        </h3>
        <p className="mb-6">
          Reinvesting dividends and interest can significantly impact the growth of your portfolio. By reinvesting earnings, investors can take advantage of compounding, leading to exponential growth over time. Consider setting up automatic reinvestment plans to maximize the benefits of compounding and enhance your portfolio's performance.
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
                {faq.answer.split("For more on investment strategies, check out our Interest-Only Loan Calculator.")[0]}
                {faq.answer.includes("Interest-Only Loan Calculator") && (
                  <>
                    For more on investment strategies, check out our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
                  </>
                )}
                {faq.answer.split("For additional financial planning tools, explore our Refinance Savings Calculator to evaluate potential savings from refinancing existing loans.")[0] !== faq.answer && (
                  <>
                    {faq.answer.split("For additional financial planning tools, explore our Refinance Savings Calculator to evaluate potential savings from refinancing existing loans.")[0]}
                    For additional financial planning tools, explore our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a> to evaluate potential savings from refinancing existing loans.
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
                Access comprehensive data and research on economic conditions and monetary policy.
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
                Consumer Financial Protection Bureau - Investment Guides
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Explore educational resources and guides to help you make informed investment decisions.
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
                FDIC - Financial Education
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Learn about banking regulations, deposit insurance, and financial literacy.
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
                Access official tax guidelines, deductions, and credits for investors.
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
                Investopedia - Investment Strategies
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Discover detailed explanations of investment concepts and strategies.
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
                NerdWallet - Financial Planning
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Access personal finance guides and comparison tools for informed decision-making.
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
      title="Stock DCA Return Estimator"
      description="Estimate returns for stock market dollar cost averaging. Visualize long-term portfolio growth by investing consistent amounts over time."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Stock DCA Return Estimator" },
        { id: "formula", label: "Stock DCA Return Estimator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "FV = P × [(1 + r)^n - 1] / r",
        variables: [
          { symbol: "P", description: "Monthly investment amount" },
          { symbol: "r", description: "Monthly interest rate (annual rate / 12)" },
          { symbol: "n", description: "Total number of investments (years × 12)" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you invest $500 monthly at an annual return rate of 7% for 30 years.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "500 × 12 = 6000", 
            explanation: "Calculate the annual investment." 
          },
          { 
            label: "Step 2", 
            calculation: "6000 × 30 = 180000", 
            explanation: "Determine the total investment over 30 years." 
          },
          { 
            label: "Step 3", 
            calculation: "Future Value = $1,000,000", 
            explanation: "Estimate the future value using the DCA formula." 
          }
        ],
        result: "The final result is $1,000,000, meaning your investments have grown significantly over 30 years."
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