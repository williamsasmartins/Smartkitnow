import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PortfolioValueTrackerCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    initialInvestment: "", 
    currentValue: "", 
    additionalInvestment: "" 
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
    const initialInvestment = parseFloat(inputs.initialInvestment) || 0;
    const currentValue = parseFloat(inputs.currentValue) || 0;
    const additionalInvestment = parseFloat(inputs.additionalInvestment) || 0;

    // Validate
    if (initialInvestment <= 0 || currentValue <= 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const totalValue = initialInvestment + additionalInvestment;
    const gainLoss = currentValue - totalValue;
    const percentageChange = (gainLoss / totalValue) * 100;

    // Generate schedule data if applicable
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      investment: totalValue / 12,
      gain: (gainLoss / 12) * (i + 1),
      balance: totalValue + ((gainLoss / 12) * (i + 1))
    }));

    return { 
      mainResult: currentValue, 
      result2: gainLoss, 
      result3: percentageChange, 
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
    setInputs({ initialInvestment: "", currentValue: "", additionalInvestment: "" });
  };

  const faqs = [
    {
      question: "What is portfolio value tracker and why is it important?",
      answer: "A portfolio value tracker is a tool that helps investors monitor the total value of their investment portfolio. It provides insights into gains and losses, enabling users to make informed decisions about their investments. This tool is crucial for maintaining a clear understanding of your financial position and ensuring that your investment strategy aligns with your financial goals. By regularly tracking your portfolio's value, you can identify trends and adjust your strategy as needed. This proactive approach helps you capitalize on opportunities and mitigate risks. For more information, check out our <a href=\"/financial/interest-only-loan\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Interest-Only Loan Calculator</a>."
    },
    {
      question: "How accurate is this calculator?",
      answer: "The Portfolio Value Tracker is designed to provide accurate and reliable results. However, its accuracy depends on the quality of the input data. Factors such as market volatility and changes in asset prices can affect the results. It's important to regularly update your data and consult with financial professionals if needed. To ensure the best results, double-check your inputs and consider using additional financial tools for comprehensive analysis."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use the Portfolio Value Tracker, you'll need information about your initial investment, the current value of your assets, and any additional investments made. This data provides a comprehensive view of your portfolio's performance, allowing for accurate calculations. Ensure that the data you enter is up-to-date and reflects the latest market conditions. This will help you obtain the most accurate results and make informed decisions about your investments."
    },
    {
      question: "Can I use this calculator for specific scenarios?",
      answer: "Yes, the Portfolio Value Tracker can be used for a variety of scenarios, including tracking the performance of individual assets or entire portfolios. It is versatile and can accommodate different investment strategies and objectives. However, it's important to understand the limitations of the tool and consider consulting with financial professionals for complex scenarios. They can provide tailored advice and insights to help you achieve your financial goals."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "One common mistake is entering inaccurate or outdated data, which can lead to misleading results. It's crucial to ensure that your inputs reflect the latest market conditions and accurately represent your investments. Another mistake is failing to consider the impact of external factors, such as market volatility and economic indicators. By staying informed and regularly updating your data, you can avoid these pitfalls and make informed decisions."
    },
    {
      question: "How often should I recalculate?",
      answer: "It's recommended to recalculate your portfolio's value regularly, especially after significant market events or changes in your investment strategy. This ensures that your data remains accurate and reflects the latest market conditions. Consider setting a schedule for recalculating, such as monthly or quarterly, to maintain a clear understanding of your financial position and make informed decisions."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results from the Portfolio Value Tracker to assess your investment strategy and make informed decisions. Consider whether your current strategy aligns with your financial goals and make adjustments as needed. If you're unsure about your next steps, consider consulting with a financial advisor for personalized advice. They can provide insights and recommendations tailored to your specific needs. For more tools, visit our <a href=\"/financial/refinance-savings\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Refinance Savings Calculator</a>."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "There are alternative methods for tracking portfolio value, such as using financial software or consulting with investment professionals. These alternatives can provide additional insights and tools for managing your investments. Consider the pros and cons of each method and choose the one that best suits your needs and preferences. By exploring different options, you can find the most effective approach for achieving your financial goals."
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
              Initial Investment
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10000"
              value={inputs.initialInvestment}
              onChange={(e) => setInputs({ ...inputs, initialInvestment: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Current Value
            </Label>
            <Input
              type="number"
              placeholder="e.g., 15000"
              value={inputs.currentValue}
              onChange={(e) => setInputs({ ...inputs, currentValue: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Additional Investment
            </Label>
            <Input
              type="number"
              placeholder="e.g., 2000"
              value={inputs.additionalInvestment}
              onChange={(e) => setInputs({ ...inputs, additionalInvestment: e.target.value })}
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
                      Current Portfolio Value
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
                      Gain/Loss
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
                      Percentage Change
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {results.result3.toFixed(2)}%
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SCHEDULE TABLE */}
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
                        <TableHead className="font-semibold">Gain</TableHead>
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
                              {formatCurrency(row.gain)}
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
          Understanding Portfolio Value Tracker
        </h2>
        
        <p className="mb-6">
          The Portfolio Value Tracker is an essential tool for anyone invested in the cryptocurrency market. It allows users to monitor the total value of their digital asset holdings, providing insights into gains and losses over time. This calculator is particularly useful for investors who hold a diverse range of cryptocurrencies, as it consolidates data into a single, easy-to-understand format. By tracking your portfolio's performance, you can make informed decisions about buying, selling, or holding assets, ultimately optimizing your investment strategy.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial in the volatile world of cryptocurrencies. A small error in tracking could lead to significant financial consequences, such as missed opportunities or unexpected losses. This tool helps mitigate such risks by providing precise and up-to-date information about your portfolio's value. According to recent studies, investors who regularly monitor their portfolios are more likely to achieve their financial goals. By using this calculator, you can ensure that your investment decisions are based on reliable data. For more insights, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use the Portfolio Value Tracker effectively, gather information about your initial investment, the current value of your assets, and any additional investments made. Enter these values into the calculator to receive a comprehensive analysis of your portfolio's performance. Each input field is designed to capture specific data points, ensuring accurate results. For instance, the initial investment field should reflect the total amount invested at the start, while the current value field should represent the latest market valuation of your holdings. For more detailed guidance, visit our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Regularly updating your portfolio data is crucial for maintaining accuracy. Market conditions can change rapidly, affecting the value of your investments. By keeping your data current, you can make timely decisions that align with your financial objectives. Consider setting a reminder to update your portfolio tracker weekly or after significant market events.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using the Portfolio Value Tracker include setting realistic financial goals and regularly reviewing your investment strategy. Consider factors such as market trends, economic indicators, and personal financial objectives when analyzing your results. By understanding these elements, you can make informed decisions that enhance your portfolio's performance. Remember, the key to successful investing is staying informed and adaptable.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Portfolio Value Tracker Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Portfolio Value Tracker is designed to provide a clear picture of your investment's performance. It calculates the total value of your portfolio by summing the initial investment and any additional investments, then subtracting this total from the current market value of your holdings. This approach allows for a straightforward assessment of gains or losses, expressed both in absolute terms and as a percentage change. The formula is widely recognized in the financial industry for its accuracy and reliability.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Current Value = Initial Investment + Additional Investment + Gain/Loss
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Initial Investment = The amount initially invested in the portfolio</li>
              <li>Additional Investment = Any subsequent investments made</li>
              <li>Gain/Loss = The difference between the current value and the total investment</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a critical role in determining the portfolio's value. The initial investment represents the starting point of your financial journey, providing a baseline for measuring growth. Additional investments reflect your ongoing commitment to building wealth, while the gain/loss component captures the real-time performance of your assets. By understanding how these variables interact, you can better manage your portfolio and make strategic decisions that align with your financial goals.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your portfolio's value is essential for effective financial management. These factors can vary widely, impacting your results in different ways. By recognizing how they interact, you can take proactive steps to optimize your investment strategy and achieve your financial objectives.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Volatility
        </h3>
        <p className="mb-4">
          Market volatility refers to the rapid and unpredictable changes in asset prices. It is a significant factor affecting portfolio value, as it can lead to substantial gains or losses. Understanding market trends and staying informed about economic indicators can help you navigate volatility effectively. For instance, during periods of high volatility, you might consider diversifying your investments to mitigate risk.
        </p>
        <p className="mb-6">
          To manage market volatility, consider adopting a long-term investment perspective. This approach allows you to ride out short-term fluctuations and focus on the overall growth of your portfolio. Additionally, regularly reviewing your investment strategy and adjusting it based on market conditions can help you stay on track. Explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a> for more insights.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Asset Allocation
        </h3>
        <p className="mb-4">
          Asset allocation involves distributing your investments across different asset classes, such as stocks, bonds, and cryptocurrencies. This strategy helps balance risk and reward, as different assets perform differently under various market conditions. A well-diversified portfolio can enhance returns while reducing overall risk.
        </p>
        <p className="mb-6">
          When determining your asset allocation, consider factors such as your risk tolerance, investment goals, and time horizon. For example, younger investors with a longer time horizon may opt for a more aggressive allocation, while those nearing retirement might prefer a conservative approach. Regularly reassessing your asset allocation ensures it aligns with your evolving financial objectives.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Economic Indicators
        </h3>
        <p className="mb-4">
          Economic indicators, such as inflation rates, interest rates, and GDP growth, provide valuable insights into the overall health of the economy. These indicators can influence asset prices and, consequently, your portfolio's value. Staying informed about economic trends can help you anticipate market movements and adjust your investment strategy accordingly.
        </p>
        <p className="mb-6">
          To effectively incorporate economic indicators into your investment strategy, consider subscribing to financial news outlets and reports. This information can guide your decision-making process and help you identify opportunities for growth. Additionally, consulting with financial advisors can provide expert insights tailored to your specific needs.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Regulatory Changes
        </h3>
        <p className="mb-6">
          Regulatory changes can significantly impact the financial markets and, by extension, your portfolio's value. These changes may include new tax laws, financial regulations, or government policies. Staying informed about regulatory developments is crucial for making informed investment decisions. For example, changes in cryptocurrency regulations could affect the value and liquidity of your digital assets.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Technological Advancements
        </h3>
        <p className="mb-6">
          Technological advancements can create new investment opportunities and disrupt existing markets. Innovations such as blockchain technology and artificial intelligence are transforming the financial landscape, offering new ways to invest and manage portfolios. Staying abreast of technological trends can help you capitalize on emerging opportunities and enhance your investment strategy.
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
                Federal Reserve - Economic Data
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on economic indicators and financial regulations.
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
                Internal Revenue Service - Tax Guidelines
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
      title="Portfolio Value Tracker"
      description="Track the total value of your crypto portfolio. Monitor gains and losses across all your digital asset holdings in one place."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Portfolio Value Tracker" },
        { id: "formula", label: "Portfolio Value Tracker Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Current Value = Initial Investment + Additional Investment + Gain/Loss",
        variables: [
          { symbol: "Initial Investment", description: "The amount initially invested in the portfolio" },
          { symbol: "Additional Investment", description: "Any subsequent investments made" },
          { symbol: "Gain/Loss", description: "The difference between the current value and the total investment" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have an initial investment of $10,000, the current value of your assets is $15,000, and you've made an additional investment of $2,000.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Initial Investment + Additional Investment = $10,000 + $2,000 = $12,000", 
            explanation: "Calculate the total investment made." 
          },
          { 
            label: "Step 2", 
            calculation: "Current Value - Total Investment = $15,000 - $12,000 = $3,000", 
            explanation: "Determine the gain or loss." 
          },
          { 
            label: "Step 3", 
            calculation: "($3,000 / $12,000) × 100 = 25%", 
            explanation: "Calculate the percentage change in value." 
          }
        ],
        result: "The final result is a 25% gain, meaning your portfolio has increased in value by 25%."
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