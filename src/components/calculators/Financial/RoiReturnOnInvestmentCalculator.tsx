import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, Calendar, Percent, HelpCircle, BookOpen, Info, CheckCircle, TrendingUp } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RoiReturnOnInvestmentCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    initialInvestment: "", 
    finalValue: "", 
    investmentDuration: "" 
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
    // Parse inputs (use 'let' for mutable variables)
    const initialInvestment = parseFloat(inputs.initialInvestment) || 0;
    const finalValue = parseFloat(inputs.finalValue) || 0;
    const investmentDuration = parseFloat(inputs.investmentDuration) || 0;

    // Validate
    if (initialInvestment <= 0 || finalValue <= 0 || investmentDuration <= 0) {
      return { 
        roiPercentage: 0, 
        annualizedReturn: 0, 
        totalGain: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const totalGain = finalValue - initialInvestment;
    const roiPercentage = (totalGain / initialInvestment) * 100;
    const annualizedReturn = ((finalValue / initialInvestment) ** (1 / investmentDuration) - 1) * 100;

    // Generate schedule data if applicable
    const scheduleData = Array.from({ length: investmentDuration }, (_, i) => ({
      year: i + 1,
      value: initialInvestment * ((1 + annualizedReturn / 100) ** (i + 1)),
      gain: initialInvestment * ((1 + annualizedReturn / 100) ** (i + 1)) - initialInvestment,
    }));

    return { 
      roiPercentage, 
      annualizedReturn, 
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
    setInputs({ initialInvestment: "", finalValue: "", investmentDuration: "" });
  };

  const faqs = [
    {
      question: "What is Return on Investment (ROI)?",
      answer: "ROI measures the gain or loss generated on an investment relative to the amount of money invested. It helps compare the efficiency of different investments."
    },
    {
      question: "How do I interpret ROI results?",
      answer: "A positive ROI indicates profit, while a negative ROI indicates a loss. Higher ROI suggests better performance, but consider risk and time horizon."
    },
    {
      question: "What is annualized return?",
      answer: "Annualized return normalizes performance over a yearly basis, allowing fair comparison between investments with different durations."
    },
    {
      question: "Does ROI include fees and taxes?",
      answer: "Basic ROI typically excludes fees and taxes. For accuracy, subtract applicable costs from final value before calculating ROI."
    },
    {
      question: "What inputs do I need?",
      answer: "You need the initial investment, final value, and investment duration in years to compute ROI and annualized return."
    },
    {
      question: "Can ROI be compared across assets?",
      answer: "ROI is comparable, but consider volatility, liquidity, and risk. Annualized return helps normalize time differences."
    },
    {
      question: "How often should I recalculate?",
      answer: "Recalculate when values change—after dividends, additional contributions, or market movements that update your final value."
    },
    {
      question: "Are there alternatives to ROI?",
      answer: "Alternatives include IRR, NPV, and risk-adjusted metrics like Sharpe ratio for more nuanced performance evaluation."
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
              Investment Duration (Years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={inputs.investmentDuration}
              onChange={(e) => setInputs({ ...inputs, investmentDuration: e.target.value })}
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
      {results.roiPercentage > 0 && (
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
                      {results.roiPercentage.toFixed(2)}%
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
                      Annualized Return
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {results.annualizedReturn.toFixed(2)}%
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
                    Investment Growth Schedule
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
                        : `Show All ${results.scheduleData.length} Years`}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900">
                        <TableHead className="font-semibold">Year</TableHead>
                        <TableHead className="font-semibold">Value</TableHead>
                        <TableHead className="font-semibold">Gain</TableHead>
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
                            <TableCell className="font-medium">{row.year}</TableCell>
                            <TableCell>{formatCurrency(row.value)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.gain)}
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
          Understanding Investment Return (ROI) Calculator
        </h2>
        
        <p className="mb-6">
          The Investment Return (ROI) Calculator is a crucial tool for anyone looking to evaluate the profitability of their investments. By calculating the ROI, investors can determine how much profit or loss their investment has generated relative to its cost. This calculator is particularly useful for comparing the efficiency of several investments, helping you make informed decisions about where to allocate your resources. Whether you're a seasoned investor or just starting, understanding your ROI is essential for strategic financial planning.
        </p>
        
        <p className="mb-6">
          Accurate ROI calculations are vital because they directly impact your financial decisions. Miscalculating your ROI can lead to poor investment choices, potentially resulting in financial losses. For instance, an inflated ROI might encourage you to invest more in a losing asset, while an underestimated ROI could cause you to miss out on lucrative opportunities. This tool provides a reliable way to assess your investments, ensuring that your financial strategies are based on accurate data. For more insights, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use the ROI Calculator effectively, gather all relevant financial data before starting. You'll need the initial investment amount, the final value of the investment, and the duration of the investment. Enter these values into the calculator to get an accurate ROI percentage. It's important to use precise figures to ensure the reliability of the results. For additional guidance, visit our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check your input values for accuracy. A small error in the initial investment or final value can significantly skew your ROI results. Ensure all figures are up-to-date and reflect any changes in market conditions or investment terms.
          </p>
        </div>
        
        <p className="mb-6">
          For optimal results, consider the impact of external factors such as market volatility and economic changes on your investments. Regularly updating your calculations can help you stay informed and adjust your strategies accordingly. Understanding these dynamics will enable you to make better investment decisions and maximize your returns.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Investment Return (ROI) Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula for calculating the Return on Investment (ROI) is a straightforward mathematical expression that helps investors evaluate the efficiency of their investments. The standard formula is: ROI = (Final Value - Initial Investment) / Initial Investment × 100. This formula provides a percentage that represents the gain or loss relative to the initial investment cost. It's widely used because it offers a clear and concise measure of investment performance.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          ROI = (Final Value - Initial Investment) / Initial Investment × 100
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Final Value = The value of the investment at the end of the period</li>
              <li>Initial Investment = The original amount of money invested</li>
              <li>ROI = Return on Investment percentage</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a critical role in determining the ROI. The Final Value represents the current worth of the investment, which could include capital gains, dividends, or interest earned. The Initial Investment is the starting amount of money put into the investment. By comparing these two values, the ROI formula provides a percentage that indicates the profitability of the investment. A higher ROI percentage signifies a more profitable investment.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your ROI is essential for making informed investment decisions. These factors can significantly impact the outcome of your ROI calculations, and being aware of them can help you optimize your investment strategy.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Conditions
        </h3>
        <p className="mb-4">
          Market conditions play a pivotal role in determining the ROI of an investment. Economic factors such as inflation, interest rates, and market volatility can affect the final value of your investments. For instance, a booming economy might lead to higher returns, while a recession could result in losses.
        </p>
        <p className="mb-6">
          To manage this factor, stay informed about economic trends and adjust your investment strategy accordingly. Diversifying your portfolio can also mitigate risks associated with market fluctuations. For more strategies, explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Investment Duration
        </h3>
        <p className="mb-4">
          The duration of your investment can significantly impact your ROI. Longer investment periods generally allow more time for compound growth, potentially leading to higher returns. However, longer durations also expose investments to more market risks.
        </p>
        <p className="mb-6">
          Consider your financial goals and risk tolerance when deciding on the investment duration. Short-term investments might offer quick returns but with higher volatility, while long-term investments can provide stability and growth over time.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Initial Investment Amount
        </h3>
        <p className="mb-4">
          The amount of money you initially invest can influence the ROI. Larger investments might yield higher absolute returns, but they also come with increased risk. It's important to balance the potential rewards with the risks involved.
        </p>
        <p className="mb-6">
          Evaluate your financial situation and investment goals to determine the appropriate initial investment amount. Consider consulting with a financial advisor to ensure your investment aligns with your long-term objectives.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Fees and Expenses
        </h3>
        <p className="mb-6">
          Investment-related fees and expenses can erode your returns. Management fees, transaction costs, and taxes can all reduce the final value of your investment. It's crucial to account for these costs when calculating your ROI.
        </p>
        <p className="mb-6">
          To minimize the impact of fees, consider low-cost investment options such as index funds or ETFs. Regularly review your investment portfolio to ensure that fees are not disproportionately affecting your returns.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Economic and Political Factors
        </h3>
        <p className="mb-6">
          Broader economic and political factors can also influence your investment returns. Changes in government policies, trade agreements, and geopolitical events can all affect market performance. Staying informed about these factors can help you anticipate potential impacts on your investments.
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
                Federal Reserve - Economic Data
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Access comprehensive economic data and insights from the Federal Reserve, including interest rates and market trends.
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
                Explore investment guides and resources to help you make informed financial decisions and protect your investments.
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
                Learn about banking regulations and investment information from the Federal Deposit Insurance Corporation.
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
                Access official tax guidelines and information on deductions related to investments from the IRS.
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
                Investopedia - Investment Education
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Discover detailed financial education and investment concepts explained in depth on Investopedia.
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
                Utilize personal finance guides and comparison tools to manage your investments effectively on NerdWallet.
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
      title="Investment Return (ROI) Calculator"
      description="Calculate your Return on Investment (ROI) percentage. Measure the profitability of your assets and portfolio performance easily."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Investment Return (ROI) Calculator" },
        { id: "formula", label: "Investment Return (ROI) Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "ROI = (Final Value - Initial Investment) / Initial Investment × 100",
        variables: [
          { symbol: "Final Value", description: "The value of the investment at the end of the period" },
          { symbol: "Initial Investment", description: "The original amount of money invested" },
          { symbol: "ROI", description: "Return on Investment percentage" }
        ],
        title: "Calculation Formula"
      }}
      jsonLd={faqJsonLd}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you invest $10,000 in a stock, and after 5 years, it's worth $15,000.",
        steps: [
          { 
            step: 1, 
            calculation: "$15,000 - $10,000 = $5,000", 
            description: "Calculate the total gain from the investment." 
          },
          { 
            step: 2, 
            calculation: "($5,000 / $10,000) × 100 = 50%", 
            description: "Determine the ROI percentage." 
          },
          { 
            step: 3, 
            calculation: "ROI is 50%", 
            description: "The investment has grown by 50% over 5 years." 
          }
        ],
        result: "The final result is a 50% ROI, indicating a profitable investment."
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
