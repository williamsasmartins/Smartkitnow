import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SipMonthlyInvestmentPlannerCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    monthlyInvestment: "", 
    annualInterestRate: "", 
    investmentPeriod: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is SIP/Monthly Investment Planner and why is it important?",
      answer: "The SIP/Monthly Investment Planner is a tool that helps investors calculate the future value of their monthly investments in mutual funds or stocks. It is important because it provides insights into how investments can grow over time, allowing individuals to plan their financial goals effectively. By understanding the potential returns, investors can make informed decisions and optimize their investment strategies. This planner is particularly useful for long-term financial planning, helping users set realistic expectations and adjust their investments as needed. For more tools, check out our <a href=\"/financial/interest-only-loan\" class=\"text-blue-600 dark:text-blue-400 hover:underline\">Interest-Only Loan Calculator</a>."
    },
    {
      question: "How accurate is this calculator?",
      answer: "The calculator is designed to provide accurate estimates based on the inputs provided. However, actual investment returns can vary due to market fluctuations, changes in interest rates, and other economic factors. It's important to use this tool as a guide rather than a guaranteed prediction of future returns. For precise financial planning, consider consulting with a financial advisor who can provide personalized advice based on your unique circumstances."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use this calculator, you need to know your monthly investment amount, the expected annual interest rate, and the investment duration in years. These inputs will allow the calculator to estimate the future value of your investments. You can typically find interest rate information from your investment provider or financial institution. Ensure that the data you enter is as accurate as possible to get reliable results. Regularly updating these inputs can help you track your investment progress and make necessary adjustments."
    },
    {
      question: "Can I use this calculator for specific scenarios?",
      answer: "Yes, this calculator can be used for various scenarios, such as planning for retirement, saving for a child's education, or building a wealth portfolio. However, it's important to consider the specific details of each scenario, such as risk tolerance and investment goals, which may require additional analysis beyond what the calculator provides. For tailored advice, consider consulting with a financial advisor who can help align your investment strategy with your personal goals and circumstances."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include entering incorrect data, such as unrealistic interest rates or investment periods, which can skew the results. Additionally, failing to account for inflation or market volatility can lead to overestimating future returns. It's crucial to use realistic assumptions and regularly update your inputs to reflect current market conditions. Avoid these errors by double-checking your data and considering a range of scenarios to understand potential outcomes better."
    },
    {
      question: "How often should I recalculate?",
      answer: "It's advisable to recalculate your investment projections at least annually or whenever there are significant changes in your financial situation, such as a change in income, interest rates, or investment goals. Regular recalculations help ensure that your investment strategy remains aligned with your financial objectives. Keeping track of market trends and economic indicators can also inform your recalculations, allowing you to make timely adjustments to your investment plan."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results to assess whether your current investment strategy aligns with your financial goals. If the projected returns fall short of your expectations, consider adjusting your investment amount, duration, or portfolio composition. The results can also guide discussions with financial advisors, helping you refine your investment approach. For further analysis, explore our <a href=\"/financial/refinance-savings\" class=\"text-blue-600 dark:text-blue-400 hover:underline\">Refinance Savings Calculator</a> to evaluate potential savings from refinancing options."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Alternatives to this calculation method include using financial software or consulting with financial advisors who can provide more personalized projections. These alternatives may offer additional features, such as risk analysis and scenario planning, which can enhance your investment strategy. Consider these options if you require more comprehensive planning tools or if your investment needs are complex and require expert guidance."
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
    let monthlyInvestmentValue = parseFloat(inputs.monthlyInvestment) || 0;
    const annualInterestRateValue = parseFloat(inputs.annualInterestRate) || 0;
    const investmentPeriodValue = parseFloat(inputs.investmentPeriod) || 0;

    // Validate
    if (monthlyInvestmentValue <= 0 || annualInterestRateValue <= 0 || investmentPeriodValue <= 0) {
      return { 
        mainResult: 0, 
        totalInvestment: 0, 
        totalInterestEarned: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const monthlyRate = annualInterestRateValue / 12 / 100;
    const numberOfMonths = investmentPeriodValue * 12;
    const futureValue = monthlyInvestmentValue * ((Math.pow(1 + monthlyRate, numberOfMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvestment = monthlyInvestmentValue * numberOfMonths;
    const totalInterestEarned = futureValue - totalInvestment;

    // Generate schedule data if applicable
    const scheduleData = Array.from({ length: numberOfMonths }, (_, i) => {
      const balance = monthlyInvestmentValue * ((Math.pow(1 + monthlyRate, i + 1) - 1) / monthlyRate) * (1 + monthlyRate);
      return {
        month: i + 1,
        investment: monthlyInvestmentValue,
        interest: balance - (monthlyInvestmentValue * (i + 1)),
        balance: balance
      };
    });

    return { 
      mainResult: futureValue, 
      totalInvestment, 
      totalInterestEarned, 
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
    setInputs({ monthlyInvestment: "", annualInterestRate: "", investmentPeriod: "" });
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
              Annual Interest Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 7"
              value={inputs.annualInterestRate}
              onChange={(e) => setInputs({ ...inputs, annualInterestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Investment Period (Years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10"
              value={inputs.investmentPeriod}
              onChange={(e) => setInputs({ ...inputs, investmentPeriod: e.target.value })}
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
                      Total Investment
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalInvestment)}
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
                      {formatCurrency(results.totalInterestEarned)}
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
                        <TableHead className="font-semibold">Investment</TableHead>
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
                            <TableCell>{formatCurrency(row.investment)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
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
    <div className="skn-editorial space-y-12 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      
      {/* SECTION 1: INTRODUCTION (400-500 words) */}
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Understanding SIP/Monthly Investment Planner
        </h2>
        
        <p className="mb-6">
          A Systematic Investment Plan (SIP) is a disciplined investment strategy that allows individuals to invest a fixed amount regularly in mutual funds or stocks. The SIP/Monthly Investment Planner is a tool designed to help investors calculate the expected returns on their monthly investments over a specified period. By understanding the potential growth of their investments, individuals can make informed decisions about their financial future. This calculator is particularly useful for those who want to plan their investments systematically and achieve long-term financial goals.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial in the realm of investments, as even minor errors can lead to significant financial discrepancies over time. The SIP/Monthly Investment Planner ensures that users can accurately project their investment growth, taking into account factors such as the investment amount, interest rate, and investment duration. This tool helps users avoid common pitfalls and make strategic decisions to maximize their returns. For a deeper understanding of financial planning, consider exploring our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information such as your monthly investment amount, expected annual interest rate, and the duration of your investment in years. Enter these values into the respective fields to calculate the future value of your investment. The calculator will provide insights into the total investment, interest earned, and the overall growth of your portfolio. For more investment planning tools, visit our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Consistency is key when it comes to SIPs. Regular investments, even if small, can lead to substantial growth over time due to the power of compounding. Ensure that you stick to your investment plan and review your portfolio periodically to make necessary adjustments.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for optimizing your SIP include setting clear financial goals, choosing the right mutual funds or stocks, and regularly reviewing your investment strategy. Be mindful of market trends and economic factors that could impact your returns. By staying informed and proactive, you can enhance the effectiveness of your investment plan.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          SIP/Monthly Investment Planner Formula
        </h2>
        
        <p className="mb-6">
          The SIP/Monthly Investment Planner uses a formula that calculates the future value of a series of regular investments. This formula is derived from the concept of compound interest, which allows investments to grow exponentially over time. The standard formula used is:
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          FV = P × ((1 + r)^n - 1) / r × (1 + r)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>FV = Future Value of the investment</li>
              <li>P = Monthly investment amount</li>
              <li>r = Monthly interest rate (annual rate / 12)</li>
              <li>n = Total number of investments (months)</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the future value of your investments. The monthly investment amount (P) is the fixed sum you invest regularly. The monthly interest rate (r) is derived from the annual rate, reflecting the compounding effect on a monthly basis. The total number of investments (n) represents the duration of your investment in months. By adjusting these variables, you can see how different scenarios impact your investment growth.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your investment results is essential for effective financial planning. These factors interact in complex ways, affecting the growth and stability of your investment portfolio.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Investment Amount
        </h3>
        <p className="mb-4">
          The amount you invest each month is a primary determinant of your investment's future value. Larger investments result in greater compounding effects, leading to higher returns. For instance, increasing your monthly investment from $500 to $600 can significantly boost your portfolio's growth over time.
        </p>
        <p className="mb-6">
          To optimize this factor, consider gradually increasing your investment amount as your financial situation improves. This strategy, known as "step-up SIP," allows you to capitalize on the power of compounding. For more strategies, explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate determines how quickly your investments grow. Higher rates lead to faster compounding and greater returns. However, interest rates can fluctuate based on market conditions, impacting your investment's performance.
        </p>
        <p className="mb-6">
          It's important to choose investments with competitive interest rates and to stay informed about market trends. Diversifying your portfolio can help mitigate the risks associated with interest rate fluctuations.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Investment Duration
        </h3>
        <p className="mb-4">
          The length of time you invest affects the extent of compounding. Longer durations allow your investments to grow more, as compounding has more time to work its magic. For example, a 10-year investment will yield significantly higher returns than a 5-year investment, given the same monthly contribution and interest rate.
        </p>
        <p className="mb-6">
          To maximize your returns, start investing as early as possible and maintain your investments for longer periods. This approach leverages the full potential of compounding.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Conditions
        </h3>
        <p className="mb-6">
          Market conditions, including economic stability and geopolitical factors, can influence the performance of your investments. During periods of economic growth, investments typically perform well, while downturns can lead to reduced returns. It's crucial to monitor market trends and adjust your investment strategy accordingly. Diversification can help protect your portfolio from market volatility, ensuring more stable returns.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Inflation
        </h3>
        <p className="mb-6">
          Inflation erodes the purchasing power of your returns, making it a critical factor to consider. Investments that outpace inflation ensure that your returns maintain their value over time. Consider investing in assets that historically offer returns above the inflation rate, such as equities or real estate. Understanding inflation's impact on your investments can help you make informed decisions and safeguard your financial future.
        </p>
      </section>

      {/* SECTION 4: FAQ (1000-1200 words with 8 questions) */}
      <section id="faq">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-8">
          {/* FAQ SECTION */}
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
                <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
                {faq.question}
              </h3>
              <div 
                className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8"
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
                Federal Reserve - Economic Research
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Access comprehensive economic data and research reports to understand market trends and interest rate movements.
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
                Explore educational resources and guides to make informed investment decisions and protect your financial interests.
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
                Learn about banking regulations, deposit insurance, and financial literacy to enhance your investment knowledge.
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
                Access official tax guidelines and information on deductions to optimize your investment tax strategy.
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
                Discover detailed explanations of investment concepts and strategies to enhance your financial planning.
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
                NerdWallet - Financial Planning Tools
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Utilize personal finance guides and comparison tools to make informed investment decisions.
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
      title="SIP/Monthly Investment Planner"
      description="Plan your Systematic Investment Plan (SIP). Calculate the expected returns on your monthly mutual fund or stock market investments."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding SIP/Monthly Investment Planner" },
        { id: "formula", label: "SIP/Monthly Investment Planner Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "FV = P × ((1 + r)^n - 1) / r × (1 + r)",
        variables: [
          { symbol: "FV", description: "Future Value of the investment" },
          { symbol: "P", description: "Monthly investment amount" },
          { symbol: "r", description: "Monthly interest rate (annual rate / 12)" },
          { symbol: "n", description: "Total number of investments (months)" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you invest $500 monthly at an annual interest rate of 7% for 10 years.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "500 × ((1 + 0.005833)^120 - 1) / 0.005833 × (1 + 0.005833)", 
            explanation: "Calculate the future value using the formula." 
          },
          { 
            label: "Step 2", 
            calculation: "Future Value = $87,000", 
            explanation: "The total value of your investment after 10 years." 
          }
        ],
        result: "The final result is $87,000, meaning your investment has grown significantly over the period."
      }}
      relatedCalculators={[
        {"title":"Loan Payment Calculator (Principal, Rate, Term)","url":"/financial/loan-payment","icon":"💵"},
        {"title":"Mortgage Payment & Amortization Calculator","url":"/financial/mortgage-amortization","icon":"🏠"},
        {"title":"Extra Payments & Payoff Time Calculator","url":"/financial/extra-payments-payoff","icon":"📈"},
        {"title":"Interest-Only Loan Calculator","url":"/financial/interest-only-loan","icon":"📊"},
        {"title":"Refinance Savings Calculator","url":"/financial/refinance-savings","icon":"💰"},
        {"title":"HELOC Payment Estimator","url":"/financial/heloc-payment-estimator","icon":"🏦"}
      ]}
    />
  );
}
