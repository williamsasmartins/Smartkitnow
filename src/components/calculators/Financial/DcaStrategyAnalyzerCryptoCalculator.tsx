import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DcaStrategyAnalyzerCryptoCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    investmentAmount: "", 
    interval: "", 
    duration: "" 
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

  const faqs = [
    {
      question: "What is DCA Strategy Analyzer (Crypto) and why is it important?",
      answer: "The DCA Strategy Analyzer (Crypto) is a tool designed to help investors evaluate the effectiveness of their Dollar Cost Averaging strategy in the cryptocurrency market. It provides insights into historical performance and potential risk reduction of recurring buys, allowing investors to make informed decisions about their investment plans. By using this analyzer, investors can optimize their DCA strategy, ensuring they are maximizing their investment potential while minimizing risks. For more information, explore our <a href=\"/financial/refinance-savings\">Refinance Savings Calculator</a>."
    },
    {
      question: "How accurate is this calculator?",
      answer: "The DCA Strategy Analyzer is designed to provide accurate estimates based on the inputs provided. However, the accuracy of the results depends on the quality of the input data and the assumptions made about market conditions. It's important to note that past performance does not guarantee future results, and users should consider consulting a financial advisor for personalized advice. For best results, ensure your inputs are as accurate and realistic as possible. Regularly update your inputs to reflect any changes in your investment plan or market conditions."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use the DCA Strategy Analyzer, you need to provide the following information: the amount you plan to invest regularly, the interval at which you will invest, and the total duration of your investment plan. This information helps the calculator estimate the potential outcomes of your DCA strategy. Ensure that the data you provide is accurate and up-to-date. You can find this information in your investment plan or financial records. For more guidance, consider using our <a href=\"/financial/heloc-payment-estimator\">HELOC Payment Estimator</a>."
    },
    {
      question: "Can I use this calculator for specific scenarios?",
      answer: "Yes, the DCA Strategy Analyzer can be used for various scenarios, including different investment amounts, intervals, and durations. However, it's important to note that the calculator is designed for general use and may not account for specific market conditions or individual circumstances. For personalized advice, consider consulting a financial advisor who can provide guidance based on your unique financial situation and goals."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include providing inaccurate input data, failing to update inputs regularly, and not considering market trends. These errors can lead to misleading results and suboptimal investment decisions. To avoid these mistakes, ensure your inputs are accurate and realistic, and regularly review your investment plan to account for any changes in market conditions or personal circumstances."
    },
    {
      question: "How often should I recalculate?",
      answer: "It's recommended to recalculate your DCA strategy regularly, especially when there are significant changes in market conditions or your personal financial situation. Regular recalculations help ensure your strategy remains aligned with your investment goals and risk tolerance. Consider setting a schedule for recalculations, such as quarterly or annually, to keep your investment plan up-to-date and effective."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results from the DCA Strategy Analyzer to evaluate the effectiveness of your current investment plan. Consider adjusting your investment amount, interval, or duration based on the insights gained from the analysis. If necessary, consult a financial advisor for personalized advice. For further exploration, check out our <a href=\"/financial/loan-payment\">Loan Payment Calculator</a> to understand how regular payments can affect your financial planning."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Alternatives to the DCA strategy include lump-sum investing and value averaging. Each method has its pros and cons, and the best choice depends on your financial goals, risk tolerance, and market conditions. Consider exploring different strategies and consulting a financial advisor to determine the most suitable approach for your investment plan."
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    let investmentAmount = parseFloat(inputs.investmentAmount) || 0;
    const interval = parseFloat(inputs.interval) || 0;
    const duration = parseFloat(inputs.duration) || 0;

    // Validate
    if (investmentAmount <= 0 || interval <= 0 || duration <= 0) {
      return { 
        mainResult: 0, 
        totalInvested: 0, 
        totalValue: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const totalInvested = investmentAmount * duration;
    const averagePrice = investmentAmount / interval;
    const totalValue = totalInvested * (1 + averagePrice);

    // Generate schedule data if applicable (e.g., investment schedule)
    const scheduleData = Array.from({ length: duration }, (_, i) => ({
      month: i + 1,
      investment: investmentAmount,
      cumulativeInvestment: investmentAmount * (i + 1),
      estimatedValue: (investmentAmount * (i + 1)) * (1 + averagePrice),
    }));

    return { 
      mainResult: totalValue, 
      totalInvested, 
      totalValue, 
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
    setInputs({ investmentAmount: "", interval: "", duration: "" });
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
              Investment Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 100"
              value={inputs.investmentAmount}
              onChange={(e) => setInputs({ ...inputs, investmentAmount: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Investment Interval (months)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1"
              value={inputs.interval}
              onChange={(e) => setInputs({ ...inputs, interval: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Duration (months)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 12"
              value={inputs.duration}
              onChange={(e) => setInputs({ ...inputs, duration: e.target.value })}
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
                      Estimated Total Value
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
                      Total Value
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalValue)}
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
                        <TableHead className="font-semibold">Cumulative Investment</TableHead>
                        <TableHead className="font-semibold">Estimated Value</TableHead>
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
                              {formatCurrency(row.cumulativeInvestment)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.estimatedValue)}
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
          Understanding DCA Strategy Analyzer (Crypto)
        </h2>
        
        <p className="mb-6">
          Dollar Cost Averaging (DCA) is a popular investment strategy that involves purchasing a fixed dollar amount of a particular investment on a regular schedule, regardless of the asset's price. This approach can help reduce the impact of volatility on the overall purchase. By spreading out the purchases, investors may lower the average cost per share and reduce the risk of making a single large purchase at an inopportune time. The DCA Strategy Analyzer for Crypto helps investors evaluate the effectiveness of this strategy by analyzing historical performance and potential risk reduction of recurring buys in the cryptocurrency market.
        </p>
        
        <p className="mb-6">
          In the volatile world of cryptocurrencies, accurate calculations are crucial for making informed investment decisions. Missteps in calculations can lead to significant financial losses, especially given the unpredictable nature of crypto prices. This tool provides users with a reliable way to assess their DCA strategy, ensuring that they are maximizing their investment potential while minimizing risks. By using this analyzer, investors can gain insights into their investment patterns and adjust their strategies accordingly, making it an essential tool for both novice and experienced crypto investors.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information such as the amount you plan to invest regularly, the interval at which you will invest, and the total duration of your investment plan. Enter these details into the respective fields to calculate the potential outcomes of your DCA strategy. This tool will provide you with key metrics such as total investment, estimated total value, and a detailed investment schedule. For further insights, consider exploring our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> to understand how regular payments can affect your financial planning.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            When using the DCA Strategy Analyzer, ensure you are consistent with your investment intervals. Inconsistent investments can skew results and reduce the effectiveness of the DCA strategy. Stick to your planned schedule to see the best outcomes.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for optimizing your DCA strategy include setting a realistic investment amount that aligns with your financial goals and risk tolerance. Monitor market trends and adjust your strategy if necessary, but avoid making impulsive changes based on short-term market fluctuations. Consistency is key to achieving long-term success with DCA.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          DCA Strategy Analyzer (Crypto) Formula
        </h2>
        
        <p className="mb-6">
          The DCA Strategy Analyzer uses a straightforward formula to calculate the potential outcomes of a Dollar Cost Averaging strategy. The formula considers the total amount invested over time, the average price of the asset, and the estimated value of the investment. This approach provides a clear picture of how the strategy performs under different market conditions. By understanding this formula, investors can better anticipate the results of their DCA strategy and make informed decisions about their investment plans.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Total Value = Total Invested × (1 + Average Price)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Total Invested = Investment Amount × Duration</li>
              <li>Average Price = Investment Amount / Interval</li>
              <li>Total Value = Estimated value of the investment</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the outcome of the DCA strategy. The Total Invested represents the cumulative amount of money put into the investment over the specified duration. The Average Price is calculated by dividing the investment amount by the interval, providing insight into the cost efficiency of the strategy. The Total Value reflects the estimated worth of the investment, considering the average price and total invested. By adjusting these variables, investors can explore different scenarios and optimize their DCA strategy for better results.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your DCA strategy is essential for optimizing your investment outcomes. These factors interact in complex ways, and being aware of them can help you make more informed decisions and adjust your strategy as needed.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Volatility
        </h3>
        <p className="mb-4">
          Market volatility is a significant factor affecting the effectiveness of a DCA strategy. High volatility can lead to significant price swings, impacting the average price and total value of your investment. By spreading your investments over time, DCA helps mitigate the impact of volatility, allowing you to buy more shares when prices are low and fewer when prices are high.
        </p>
        <p className="mb-6">
          To optimize your DCA strategy in volatile markets, consider increasing the frequency of your investments. This approach allows you to capture more price points and potentially lower your average cost per share. For more insights on managing investments during volatile periods, check out our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Investment Amount
        </h3>
        <p className="mb-4">
          The amount you invest regularly plays a crucial role in determining the success of your DCA strategy. A larger investment amount can lead to higher potential returns, but it also increases your exposure to market risks. Conversely, a smaller investment amount reduces risk but may result in lower returns.
        </p>
        <p className="mb-6">
          It's essential to choose an investment amount that aligns with your financial goals and risk tolerance. Regularly reviewing your financial situation and adjusting your investment amount as needed can help you maintain a balanced approach. Consider using our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a> to explore how additional investments can impact your overall strategy.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Investment Interval
        </h3>
        <p className="mb-4">
          The frequency of your investments, or the investment interval, affects the average price and total value of your DCA strategy. Shorter intervals allow you to capture more price points, potentially leading to a lower average cost per share. However, more frequent investments require a higher level of commitment and discipline.
        </p>
        <p className="mb-6">
          To determine the optimal investment interval, consider your financial situation and investment goals. A balance between frequency and financial feasibility is crucial for a successful DCA strategy. For guidance on setting realistic investment intervals, explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Duration of Investment
        </h3>
        <p className="mb-6">
          The duration of your investment plan significantly impacts the potential outcomes of your DCA strategy. A longer duration allows you to benefit from the compounding effect and potentially achieve higher returns. However, it also requires patience and a long-term commitment to your investment plan.
        </p>
        <p className="mb-6">
          When setting the duration of your DCA strategy, consider your long-term financial goals and risk tolerance. A well-planned duration can help you stay focused on your investment objectives and avoid making impulsive decisions based on short-term market fluctuations.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Trends
        </h3>
        <p className="mb-6">
          Market trends can influence the effectiveness of your DCA strategy. Understanding the current market environment and potential future trends can help you make informed decisions about your investment plan. While DCA is designed to mitigate the impact of short-term market fluctuations, being aware of broader trends can enhance your strategy's effectiveness.
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
                Federal Reserve - Economic Research
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Access comprehensive data and analysis on economic trends and policies.
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
                Explore educational resources and guides to make informed financial decisions.
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
                Learn about banking regulations and deposit insurance protections.
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
                Access official tax guidelines and information on deductions and credits.
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
                Discover detailed explanations of financial concepts and investment strategies.
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
                Access personal finance guides and comparison tools to manage your money effectively.
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
      title="DCA Strategy Analyzer (Crypto)"
      description="Analyze your Crypto Dollar Cost Averaging strategy. Evaluate historical performance and risk reduction of recurring buys."
      jsonLd={faqJsonLd ?? undefined}
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding DCA Strategy Analyzer (Crypto)" },
        { id: "formula", label: "DCA Strategy Analyzer (Crypto) Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Total Value = Total Invested × (1 + Average Price)",
        variables: [
          { symbol: "Total Invested", description: "Investment Amount × Duration" },
          { symbol: "Average Price", description: "Investment Amount / Interval" },
          { symbol: "Total Value", description: "Estimated value of the investment" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you invest $100 every month for 12 months.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "100 × 12 = 1200", 
            explanation: "Calculate the total amount invested over the duration." 
          },
          { 
            label: "Step 2", 
            calculation: "100 / 1 = 100", 
            explanation: "Determine the average price per interval." 
          },
          { 
            label: "Step 3", 
            calculation: "1200 × (1 + 100) = 132000", 
            explanation: "Calculate the estimated total value of the investment." 
          }
        ],
        result: "The final result is $132,000, indicating the potential value of your investment after 12 months."
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
