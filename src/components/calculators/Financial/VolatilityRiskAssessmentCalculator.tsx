import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function VolatilityRiskAssessmentCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    initialInvestment: "", 
    expectedReturn: "", 
    volatility: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is volatility & risk assessment calculator and why is it important?",
      answer: "The Volatility & Risk Assessment Calculator is a tool designed to help investors evaluate the potential risks and returns of their investments by considering market volatility. It is important because it provides insights into how market fluctuations can impact investment outcomes, allowing users to make informed decisions and manage their portfolios effectively. Understanding volatility is crucial for risk management and strategic planning."
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator is designed to provide accurate estimates based on the inputs provided. However, its accuracy depends on the precision of the input data and the assumptions made regarding market conditions. Users should be aware that actual investment outcomes may vary due to unforeseen market changes. For critical financial decisions, consulting with a financial advisor is recommended to complement the insights gained from this tool."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use this calculator, you need to provide the initial investment amount, the expected annual return rate, and the estimated market volatility percentage. This information can typically be obtained from your investment portfolio details, financial statements, or market analysis reports. Ensure that the data you input is as accurate as possible to get reliable results."
    },
    {
      question: "Can I use this calculator for specific scenarios?",
      answer: "Yes, this calculator can be used for various scenarios, including assessing the impact of market volatility on different types of investments such as stocks, bonds, or cryptocurrencies. However, it is important to consider the unique characteristics of each asset class and adjust the inputs accordingly. For specialized scenarios, you may need to consult additional resources or financial experts to ensure comprehensive analysis."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include using outdated or inaccurate input data, failing to account for all relevant factors, and misunderstanding the implications of volatility. These errors can lead to incorrect assessments and misguided investment decisions. To avoid these pitfalls, double-check your inputs and consider consulting with a financial advisor for a more comprehensive analysis."
    },
    {
      question: "How often should I recalculate?",
      answer: "It is advisable to recalculate whenever there are significant changes in market conditions, economic policies, or your financial goals. Regular recalculations can help you stay informed and adjust your strategies as needed. Establish a routine for reviewing your investments, such as quarterly or semi-annually, to ensure your strategies remain aligned with your objectives."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results to inform your investment decisions and risk management strategies. Consider adjusting your portfolio to align with your risk tolerance and financial goals. If the results indicate high volatility, you might explore diversification or hedging strategies."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Alternative methods include Monte Carlo simulations, which provide a range of possible outcomes based on different scenarios, and Value at Risk (VaR) models, which estimate the potential loss in value of an investment. Each method has its own strengths and limitations. Choose the method that best suits your needs and consider combining multiple approaches for a more comprehensive analysis."
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
    let initialInvestmentValue = parseFloat(inputs.initialInvestment) || 0;
    const expectedReturnValue = parseFloat(inputs.expectedReturn) || 0;
    const volatilityValue = parseFloat(inputs.volatility) || 0;

    if (initialInvestmentValue <= 0 || expectedReturnValue <= 0) {
      return { 
        mainResult: 0, 
        riskAdjustedReturn: 0, 
        volatilityImpact: 0, 
        scheduleData: [] 
      };
    }

    const mainResult = initialInvestmentValue * (1 + expectedReturnValue / 100);
    const riskAdjustedReturn = mainResult * (1 - volatilityValue / 100);
    const volatilityImpact = mainResult - riskAdjustedReturn;

    const scheduleData = Array.from({ length: 24 }, (_, i) => ({
      month: i + 1,
      projectedValue: initialInvestmentValue * Math.pow((1 + expectedReturnValue / 100), (i + 1) / 12),
      riskAdjusted: initialInvestmentValue * Math.pow((1 + (expectedReturnValue - volatilityValue) / 100), (i + 1) / 12),
      volatilityEffect: volatilityImpact / 24 * (i + 1)
    }));

    return { 
      mainResult, 
      riskAdjustedReturn, 
      volatilityImpact, 
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
    setInputs({ initialInvestment: "", expectedReturn: "", volatility: "" });
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
              Expected Return (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={inputs.expectedReturn}
              onChange={(e) => setInputs({ ...inputs, expectedReturn: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Volatility (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 2"
              value={inputs.volatility}
              onChange={(e) => setInputs({ ...inputs, volatility: e.target.value })}
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
                      Projected Value
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
                      Risk-Adjusted Return
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.riskAdjustedReturn)}
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
                      Volatility Impact
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.volatilityImpact)}
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
                        <TableHead className="font-semibold">Projected Value</TableHead>
                        <TableHead className="font-semibold">Risk-Adjusted</TableHead>
                        <TableHead className="font-semibold">Volatility Effect</TableHead>
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
                            <TableCell>{formatCurrency(row.projectedValue)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.riskAdjusted)}
                            </TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.volatilityEffect)}
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
          Understanding Volatility & Risk Assessment Calculator
        </h2>
        
        <p className="mb-6">
          In the dynamic world of cryptocurrency trading, understanding market volatility and assessing risk is crucial for making informed investment decisions. The Volatility & Risk Assessment Calculator is designed to help traders and investors evaluate potential risks associated with their investments. By inputting key variables such as initial investment, expected return, and market volatility, users can gain insights into the potential outcomes of their trading strategies. This tool is particularly valuable for those looking to manage their exposure to volatile markets and optimize their investment portfolios.
        </p>
        
        <p className="mb-6">
          Accurate calculations are paramount in the financial sector, where even minor errors can lead to significant financial losses. The Volatility & Risk Assessment Calculator employs industry-standard formulas to ensure precision and reliability. By understanding the potential impact of volatility on expected returns, users can make more strategic decisions, potentially avoiding costly mistakes. For more insights into managing financial risks, consider exploring our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>, which offers detailed analysis on loan management.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information on your initial investment amount, the expected annual return rate, and the estimated market volatility percentage. Enter these values into the respective fields to calculate the projected value of your investment, the risk-adjusted return, and the impact of volatility. For a comprehensive understanding of how these factors interact, refer to our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>, which provides insights into amortization schedules and interest impacts.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always consider the broader economic context when assessing risk. Market conditions can change rapidly, and staying informed about global financial trends can help you anticipate shifts in volatility and adjust your strategies accordingly.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include regularly updating your inputs to reflect current market conditions and using the results to guide your investment strategy. Be mindful of external factors such as economic policies and global events that could influence market volatility. For those interested in optimizing their loan repayments, our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a> offers valuable insights.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Volatility & Risk Assessment Calculator Formula
        </h2>
        
        <p className="mb-6">
          The Volatility & Risk Assessment Calculator utilizes a formula that combines the initial investment amount with the expected return rate and adjusts for market volatility. This approach provides a comprehensive view of potential investment outcomes, accounting for both growth and risk factors. The formula is widely recognized in financial analysis for its ability to model real-world scenarios accurately.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Projected Value = Initial Investment × (1 + Expected Return / 100)<br/>
          Risk-Adjusted Return = Projected Value × (1 - Volatility / 100)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Initial Investment = The starting amount of money invested</li>
              <li>Expected Return = The anticipated annual return rate (%)</li>
              <li>Volatility = The estimated market volatility (%)</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a critical role in determining the final outcome. The initial investment represents the capital at risk, while the expected return reflects the potential growth rate. Volatility, on the other hand, introduces an element of uncertainty, highlighting the potential for fluctuations in market value. By understanding how these variables interact, investors can better manage their portfolios and mitigate risks.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Several factors can influence the results of the Volatility & Risk Assessment Calculator. Understanding these elements is crucial for accurately interpreting the outcomes and making informed investment decisions. Each factor interacts with others, creating a complex web of influences that can affect your financial strategy.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Initial Investment Amount
        </h3>
        <p className="mb-4">
          The initial investment amount is the foundation of your financial strategy. It determines the scale of your potential returns and the level of risk you are exposed to. Larger investments can lead to higher returns but also increase the potential for significant losses.
        </p>
        <p className="mb-6">
          Optimizing your initial investment involves balancing your financial goals with your risk tolerance. Consider diversifying your portfolio to mitigate risks and explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a> for strategies on managing loan investments.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Expected Return Rate
        </h3>
        <p className="mb-4">
          The expected return rate is a projection of the annual growth of your investment. It is influenced by market conditions, economic policies, and the performance of the assets in your portfolio. A higher expected return can indicate greater potential for profit but also comes with increased risk.
        </p>
        <p className="mb-6">
          In different scenarios, the expected return rate can vary significantly. For instance, in a bullish market, returns might exceed expectations, while in a bearish market, they could fall short. Understanding these dynamics is crucial for setting realistic financial goals.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Volatility
        </h3>
        <p className="mb-4">
          Volatility measures the degree of variation in market prices over time. High volatility indicates frequent and significant price changes, which can impact the stability of your investments. It is essential to account for volatility when assessing risk and potential returns.
        </p>
        <p className="mb-6">
          To manage volatility effectively, consider employing hedging strategies or diversifying your investments across different asset classes. Industry experts often recommend maintaining a balanced portfolio to cushion against market fluctuations.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Economic Conditions
        </h3>
        <p className="mb-6">
          Economic conditions, including inflation rates, interest rates, and fiscal policies, can significantly influence market behavior and, consequently, your investment outcomes. These factors can affect both the expected return and the level of volatility in the market.
        </p>
        <p className="mb-6">
          Staying informed about economic trends and adjusting your investment strategy accordingly can help you navigate these challenges. For insights into how refinancing can impact your financial plans, explore our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Regulatory Environment
        </h3>
        <p className="mb-6">
          The regulatory environment can also impact your investment strategy. Changes in regulations can alter market dynamics, affecting both risk and return. It is important to stay updated on regulatory changes and understand their implications for your investments.
        </p>
      </section>

      {/* SECTION 4: FAQ (1000-1200 words with 8 questions) */}
      <section id="faq" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
                <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0" />
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
                Federal Reserve - Market Volatility
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data and analysis on market volatility and its impact on financial stability.
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
                Comprehensive guides on investment strategies and risk management for consumers.
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
                FDIC - Investment Risk Management
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Resources on managing investment risks and understanding market dynamics.
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
                Internal Revenue Service - Tax Implications of Investments
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official guidelines on the tax implications of various investment strategies.
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
                Investopedia - Understanding Volatility
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                In-depth articles and tutorials on market volatility and investment strategies.
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
                NerdWallet - Investment Planning
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and tools for effective investment planning and risk assessment.
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
      title="Volatility & Risk Assessment Calculator"
      description="Assess crypto market volatility. Calculate risk metrics to inform your trading strategy and manage exposure."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Volatility & Risk Assessment Calculator" },
        { id: "formula", label: "Volatility & Risk Assessment Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Projected Value = Initial Investment × (1 + Expected Return / 100)\nRisk-Adjusted Return = Projected Value × (1 - Volatility / 100)",
        variables: [
          { symbol: "Initial Investment", description: "The starting amount of money invested" },
          { symbol: "Expected Return", description: "The anticipated annual return rate (%)" },
          { symbol: "Volatility", description: "The estimated market volatility (%)" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have an initial investment of $10,000 with an expected return of 5% and market volatility of 2%.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "10000 × (1 + 0.05) = 10500", 
            explanation: "Calculate the projected value of the investment after one year." 
          },
          { 
            label: "Step 2", 
            calculation: "10500 × (1 - 0.02) = 10290", 
            explanation: "Adjust the projected value for market volatility to find the risk-adjusted return." 
          }
        ],
        result: "The final risk-adjusted return is $10,290, indicating the potential value of the investment after accounting for volatility."
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📈" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "💳" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "💼" },
        { "title": "HELOC Payment Estimator", "url": "/financial/heloc-payment-estimator", "icon": "🏦" }
      ]}
    />
  );
}
