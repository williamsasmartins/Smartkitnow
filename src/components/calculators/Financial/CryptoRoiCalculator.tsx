import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CryptoRoiCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    initialInvestment: "", 
    finalValue: "", 
    timePeriod: "" 
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
    let initialInvestmentValue = parseFloat(inputs.initialInvestment) || 0;
    const finalValueValue = parseFloat(inputs.finalValue) || 0;
    const timePeriodValue = parseFloat(inputs.timePeriod) || 0;

    if (initialInvestmentValue <= 0 || finalValueValue <= 0 || timePeriodValue <= 0) {
      return { 
        roi: 0, 
        annualizedRoi: 0, 
        totalGain: 0, 
        scheduleData: [] 
      };
    }

    const totalGain = finalValueValue - initialInvestmentValue;
    const roi = (totalGain / initialInvestmentValue) * 100;
    const annualizedRoi = ((Math.pow(finalValueValue / initialInvestmentValue, 1 / timePeriodValue) - 1) * 100);

    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      value: initialInvestmentValue * Math.pow(1 + annualizedRoi / 100, (i + 1) / 12),
    }));

    return { 
      roi, 
      annualizedRoi, 
      totalGain, 
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
    setInputs({ initialInvestment: "", finalValue: "", timePeriod: "" });
  };

  const faqs = [
    {
      question: "What is ROI (Return on Investment) calculator and why is it important?",
      answer: "The ROI Calculator is a financial tool that measures the profitability of an investment relative to its cost. It is crucial for investors as it provides a clear percentage that indicates how well an investment has performed. By calculating ROI, investors can compare the efficiency of different investments and make informed decisions about where to allocate their resources. Understanding ROI helps in setting realistic financial goals and assessing the success of investment strategies."
    },
    {
      question: "How accurate is this calculator?",
      answer: "The accuracy of the ROI Calculator depends on the precision of the input data. It provides a reliable estimate based on the values entered, but external factors such as market volatility and unexpected costs can affect the actual ROI. It is advisable to use the calculator as a guide and consult financial professionals for comprehensive analysis. For best results, ensure that all inputs are accurate and up-to-date. Regularly revisiting and updating your calculations can help maintain accuracy over time."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use the ROI Calculator, you need the initial investment amount, the final value of the investment, and the time period over which the investment was held. This information can typically be found in your investment account statements or transaction records. Ensure that the data reflects any additional contributions or withdrawals made during the investment period. Gathering accurate data is crucial for precise calculations. Double-check your figures and consider any fees or taxes that might affect the final value."
    },
    {
      question: "Can I use this calculator for specific scenarios?",
      answer: "Yes, the ROI Calculator can be used for a variety of scenarios, including evaluating the performance of individual stocks, mutual funds, real estate, and cryptocurrencies. However, it is important to consider the unique characteristics of each asset class, such as volatility and liquidity, which can impact the ROI. For complex investment scenarios, it may be beneficial to consult with a financial advisor to ensure a comprehensive analysis. The calculator is a useful starting point for assessing investment performance."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include using inaccurate or outdated data, neglecting to account for fees and taxes, and misunderstanding the impact of market volatility. These errors can lead to misleading ROI calculations and potentially poor investment decisions. To avoid these pitfalls, ensure that your data is current and comprehensive. Consider all relevant costs and market conditions when interpreting your results. Regularly updating your calculations can help maintain accuracy."
    },
    {
      question: "How often should I recalculate?",
      answer: "It is advisable to recalculate your ROI whenever there are significant changes in your investment, such as additional contributions, withdrawals, or changes in market conditions. Regular recalculations can help you stay informed about your investment performance and make timely adjustments to your strategy. Establishing a regular schedule for reviewing your investments, such as quarterly or annually, can also be beneficial. This practice ensures that you remain proactive in managing your portfolio."
    },
    {
      question: "What should I do with these results?",
      answer: "Once you have your ROI results, use them to evaluate the effectiveness of your investment strategy. If your ROI is below your expectations, consider adjusting your asset allocation or exploring new investment opportunities. Conversely, a high ROI may indicate that your strategy is working well. For further guidance on interpreting your results, consider consulting a financial advisor. They can provide personalized advice based on your financial goals and risk tolerance. For more tools to assist in financial planning, visit our Refinance Savings Calculator."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "While the ROI formula is a widely used metric, there are alternative methods for evaluating investment performance. These include metrics such as the Internal Rate of Return (IRR), Net Present Value (NPV), and the Sharpe Ratio. Each method offers a different perspective on investment performance and may be more suitable for specific scenarios. Consider using these alternatives in conjunction with ROI to gain a comprehensive understanding of your investments. Each metric provides unique insights that can enhance your decision-making process."
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
              Final Value
            </Label>
            <Input
              type="number"
              placeholder="e.g., 15000"
              value={inputs.finalValue}
              onChange={(e) => setInputs({ ...inputs, finalValue: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Time Period (Years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={inputs.timePeriod}
              onChange={(e) => setInputs({ ...inputs, timePeriod: e.target.value })}
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
      {results.roi > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      ROI Percentage
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {results.roi.toFixed(2)}%
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
                      Annualized ROI
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {results.annualizedRoi.toFixed(2)}%
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
                      Total Gain
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalGain)}
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
                    Investment Growth Over Time
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
                        <TableHead className="font-semibold">Value</TableHead>
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
                            <TableCell>{formatCurrency(row.value)}</TableCell>
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
          Understanding ROI (Return on Investment) Calculator
        </h2>
        
        <p className="mb-6">
          The ROI (Return on Investment) Calculator is an essential tool for investors looking to assess the profitability of their investments in the cryptocurrency market. By calculating the percentage return on an initial investment over a specified period, this calculator helps investors understand how well their assets have performed. Whether you're a seasoned trader or a newcomer to the crypto world, understanding your ROI is crucial for making informed decisions and optimizing your investment strategy.
        </p>
        
        <p className="mb-6">
          Accurate ROI calculations are vital because they provide a clear picture of your investment's performance. Miscalculations can lead to misleading decisions, potentially resulting in financial losses. According to recent studies, investors who regularly monitor their ROI are more likely to achieve their financial goals. This tool empowers users by offering precise calculations, enabling them to make strategic adjustments to their portfolios. For those interested in exploring other financial calculators, consider checking out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information about your initial investment amount, the final value of your investment, and the time period over which the investment was held. Enter these values into the respective fields, and the calculator will compute your ROI and annualized ROI. For the most accurate results, ensure that the data you input is up-to-date and reflects any additional contributions or withdrawals made during the investment period. For further insights, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always consider the impact of market volatility on your investment returns. Cryptocurrency markets are known for their rapid fluctuations, which can significantly affect your ROI. Regularly updating your calculations can help you stay ahead and make timely decisions.
          </p>
        </div>
        
        <p className="mb-6">
          For optimal use of the ROI Calculator, consider the broader market trends and economic factors that might influence your investment's performance. Stay informed about regulatory changes and technological advancements in the crypto space, as these can also impact your returns. By incorporating these insights into your investment strategy, you can better manage risks and maximize potential gains.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          ROI (Return on Investment) Calculator Formula
        </h2>
        
        <p className="mb-6">
          The ROI formula is a straightforward yet powerful tool for measuring the profitability of an investment. It is calculated by taking the difference between the final value and the initial investment, dividing it by the initial investment, and then multiplying by 100 to get a percentage. This formula is widely used in finance because it provides a clear, comparable metric for evaluating investment performance across different assets and timeframes.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          ROI = [(Final Value - Initial Investment) / Initial Investment] × 100
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Final Value = The value of the investment at the end of the period</li>
              <li>Initial Investment = The amount of money initially invested</li>
              <li>ROI = Return on Investment, expressed as a percentage</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each component of the formula plays a crucial role in determining ROI. The final value reflects the current worth of your investment, while the initial investment is the baseline from which growth is measured. By understanding how each variable contributes to the overall calculation, investors can better assess the factors driving their returns. For instance, a higher final value relative to the initial investment indicates a successful investment, while a lower value suggests potential losses.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence ROI is essential for accurate calculations and strategic decision-making. These factors can vary widely depending on the investment type and market conditions, and they often interact in complex ways that can amplify or mitigate their effects.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Volatility
        </h3>
        <p className="mb-4">
          Market volatility refers to the rapid and unpredictable changes in asset prices. In the cryptocurrency market, volatility is particularly pronounced, with prices capable of swinging dramatically in short periods. This volatility can significantly impact your ROI, either enhancing gains or exacerbating losses.
        </p>
        <p className="mb-6">
          To manage volatility, consider diversifying your portfolio across different assets and timeframes. Diversification can help mitigate the risks associated with any single investment. For more strategies on managing volatility, explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Time Horizon
        </h3>
        <p className="mb-4">
          The time horizon of an investment is the duration over which it is held. Longer time horizons can smooth out short-term volatility and provide a clearer picture of an investment's performance. However, they also require patience and a long-term perspective.
        </p>
        <p className="mb-6">
          Consider aligning your investment time horizon with your financial goals. For instance, long-term investments might be suitable for retirement savings, while shorter-term investments could be used for specific financial milestones. Understanding your time horizon can help you set realistic expectations for your ROI.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Investment Costs
        </h3>
        <p className="mb-4">
          Investment costs, including transaction fees, management fees, and taxes, can erode your returns. These costs should be factored into your ROI calculations to ensure an accurate assessment of your investment's profitability.
        </p>
        <p className="mb-6">
          To minimize costs, consider using low-cost investment platforms and tax-efficient strategies. Regularly reviewing your investment costs can help you identify areas for improvement and enhance your overall returns.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Economic Conditions
        </h3>
        <p className="mb-6">
          Economic conditions, such as interest rates, inflation, and economic growth, can influence investment returns. For example, rising interest rates might lead to lower asset prices, while inflation can erode purchasing power. Understanding these conditions can help you anticipate potential changes in your ROI and adjust your strategy accordingly.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Regulatory Environment
        </h3>
        <p className="mb-6">
          The regulatory environment can impact the cryptocurrency market significantly. Changes in regulations can affect market sentiment, liquidity, and asset prices. Staying informed about regulatory developments can help you navigate potential challenges and capitalize on opportunities.
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
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
                {faq.answer}
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
                Federal Reserve - Economic Data
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on economic indicators, interest rates, and financial stability.
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
                Comprehensive consumer protection information and educational resources on investments.
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
                FDIC - Banking and Investment Information
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and deposit insurance information for investors.
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
                Internal Revenue Service - Tax Information for Investors
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information relevant to investment income.
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
                Detailed financial education and investment concepts explained for all levels.
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
                Personal finance guides and comparison tools for consumers seeking investment advice.
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
      title="ROI (Return on Investment) Calculator"
      description="Calculate crypto Return on Investment. Measure the performance of your digital asset investments over specific timeframes."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding ROI (Return on Investment) Calculator" },
        { id: "formula", label: "ROI (Return on Investment) Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "ROI = [(Final Value - Initial Investment) / Initial Investment] × 100",
        variables: [
          { symbol: "Final Value", description: "The value of the investment at the end of the period" },
          { symbol: "Initial Investment", description: "The amount of money initially invested" },
          { symbol: "ROI", description: "Return on Investment, expressed as a percentage" }
        ],
        title: "Calculation Formula"
      }}
      jsonLd={faqJsonLd}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you invested $10,000 in a cryptocurrency, and after 5 years, the value increased to $15,000.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "15000 - 10000 = 5000", 
            explanation: "Calculate the total gain by subtracting the initial investment from the final value." 
          },
          { 
            label: "Step 2", 
            calculation: "(5000 / 10000) × 100 = 50%", 
            explanation: "Divide the total gain by the initial investment and multiply by 100 to get the ROI." 
          },
          { 
            label: "Step 3", 
            calculation: "[(1 + 0.50)^(1/5) - 1] × 100 = 8.45%", 
            explanation: "Calculate the annualized ROI using the formula for compound annual growth rate." 
          }
        ],
        result: "The final result is a 50% ROI over 5 years, with an annualized ROI of 8.45%."
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