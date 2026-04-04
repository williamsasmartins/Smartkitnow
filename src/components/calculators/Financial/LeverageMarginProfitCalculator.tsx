import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function LeverageMarginProfitCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    leverage: "", 
    margin: "", 
    priceChange: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "How accurate are leverage calculations and what limitations should I be aware of?",
      answer: "This calculator provides estimates based on the inputs you provide. For leverage, accuracy depends on using current margin trading data -- rates, prices, and regulatory thresholds change frequently. The results are most reliable for planning purposes and comparative analysis. For financial decisions involving significant amounts, verify results against official sources or consult a margin trading professional."
    },
    {
      question: "What key factors most affect leverage results?",
      answer: "The most impactful variables in leverage calculations are typically the primary rate or percentage input and the time horizon. Small changes in these variables compound significantly over longer periods. For example, a 1% difference in return rate over 20 years can change outcomes by 20–30%. Always run the calculation at multiple input values to understand your sensitivity to each variable."
    },
    {
      question: "When should I recalculate leverage?",
      answer: "Recalculate whenever margin trading conditions change significantly: after major margin trading events, when your inputs change (income, rates, holdings), or when margin trading regulations are updated. For time-sensitive margin trading metrics, recalculate monthly. For long-term planning tools, a quarterly review is typically sufficient. Set a calendar reminder to revisit projections annually at minimum."
    },
    {
      question: "How does leverage relate to other financial planning metrics?",
      answer: "No single metric tells the complete financial picture. Leverage should be evaluated alongside related measures like liquidation risk. These metrics interact: improving one often affects another. Build a dashboard of 3–5 key metrics that together reflect the health of your margin trading situation, rather than optimizing any single number in isolation."
    },
    {
      question: "What are the most common mistakes when calculating leverage?",
      answer: "The most frequent errors in leverage calculations: (1) Using pre-tax instead of post-tax figures where after-tax analysis is needed, (2) Ignoring fees and transaction costs that reduce net returns, (3) Using nominal figures without inflation adjustment for long-horizon projections, (4) Assuming constant rates -- real-world margin trading conditions fluctuate. Double-check your inputs against current margin trading data before relying on results for significant financial decisions."
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
    const leverageValue = parseFloat(inputs.leverage) || 0;
    const marginValue = parseFloat(inputs.margin) || 0;
    const priceChangeValue = parseFloat(inputs.priceChange) || 0;

    // Validate
    if (leverageValue <= 0 || marginValue <= 0) {
      return { 
        mainResult: 0, 
        profit: 0, 
        loss: 0, 
        liquidationData: [] 
      };
    }

    // Perform calculations here
    const mainResult = leverageValue * marginValue * priceChangeValue;
    const profit = mainResult > 0 ? mainResult : 0;
    const loss = mainResult < 0 ? -mainResult : 0;

    // Generate liquidation data if applicable
    const liquidationData = Array.from({ length: 24 }, (_, i) => ({
      month: i + 1,
      equity: marginValue + (mainResult / 24) * (i + 1),
      marginCall: marginValue * 0.75,
      balance: marginValue - ((mainResult / 24) * (i + 1))
    }));

    return { 
      mainResult, 
      profit, 
      loss, 
      liquidationData 
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
    setInputs({ leverage: "", margin: "", priceChange: "" });
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
              Leverage
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10"
              value={inputs.leverage}
              onChange={(e) => setInputs({ ...inputs, leverage: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Margin
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1000"
              value={inputs.margin}
              onChange={(e) => setInputs({ ...inputs, margin: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Price Change
            </Label>
            <Input
              type="number"
              placeholder="e.g., 0.05"
              value={inputs.priceChange}
              onChange={(e) => setInputs({ ...inputs, priceChange: e.target.value })}
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
      {results.mainResult !== 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Total Profit/Loss
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
                      Potential Profit
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(results.profit)}
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
                      Potential Loss
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.loss)}
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AMORTIZATION/SCHEDULE TABLE (if applicable) */}
          {results.liquidationData && results.liquidationData.length > 0 && (
            <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Liquidation Schedule
                  </span>
                  {results.liquidationData.length > 12 && (
                    <Button 
                      onClick={() => setShowFullTable(!showFullTable)} 
                      variant="outline"
                      size="sm"
                      className="border-gray-300 dark:border-gray-600"
                    >
                      {showFullTable 
                        ? 'Show Less' 
                        : `Show All ${results.liquidationData.length} Entries`}
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
                        <TableHead className="font-semibold">Equity</TableHead>
                        <TableHead className="font-semibold">Margin Call</TableHead>
                        <TableHead className="font-semibold">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.liquidationData
                        .slice(0, showFullTable ? undefined : 12)
                        .map((row, idx) => (
                          <TableRow 
                            key={idx} 
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <TableCell className="font-medium">{row.month}</TableCell>
                            <TableCell>{formatCurrency(row.equity)}</TableCell>
                            <TableCell className="text-yellow-600 dark:text-yellow-400">
                              {formatCurrency(row.marginCall)}
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
          Understanding Leverage & Margin Profit Calculator
        </h2>
        
        <p className="mb-6">
          The Leverage & Margin Profit Calculator is an essential tool for traders and investors who engage in margin trading. This calculator helps you determine potential profits and losses based on leverage, margin, and price changes. By inputting these variables, users can assess the financial impact of their trading strategies. Whether you're trading stocks, forex, or cryptocurrencies, understanding how leverage amplifies both gains and losses is crucial. This tool is designed to provide clarity and precision, allowing users to make informed decisions in volatile markets.
        </p>
        
        <p className="mb-6">
          Accurate calculations in margin trading are vital due to the high-risk nature of leveraged positions. A small change in price can lead to significant gains or devastating losses. Statistics show that a majority of traders lose money due to improper risk management and misunderstanding of leverage. This calculator mitigates such risks by providing precise calculations, helping users to strategize effectively. By using this tool, traders can avoid common pitfalls and optimize their trading performance. For more insights, explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information on your current leverage ratio, the margin amount you have invested, and the expected price change of the asset. Enter these values into the respective fields to calculate potential outcomes. The leverage ratio indicates how much your position is amplified, while the margin is the amount of capital at risk. The price change reflects the expected movement in the asset's value. For more detailed guidance, refer to our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always consider the potential for a margin call when trading on leverage. A margin call occurs when your equity falls below the required maintenance margin, prompting you to deposit more funds or close positions. This calculator helps you anticipate such scenarios, allowing you to manage risk proactively.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include regularly updating your inputs as market conditions change. Monitor your positions closely and adjust your leverage and margin accordingly. Be aware of external factors such as market volatility and economic news, which can significantly impact price movements. By staying informed and using this tool, you can optimize your trading strategy and enhance your financial outcomes.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Leverage & Margin Profit Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this calculator is designed to quantify the financial impact of leverage on your trading position. It calculates the potential profit or loss by multiplying the leverage ratio by the margin amount and the price change. This approach is widely accepted in financial markets as it provides a clear representation of how leverage magnifies both gains and losses. Understanding this formula is crucial for traders who wish to manage their risk effectively.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Profit/Loss = Leverage × Margin × Price Change
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Leverage = The ratio of borrowed funds to your own capital</li>
              <li>Margin = The amount of capital you have invested</li>
              <li>Price Change = The percentage change in the asset's price</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a critical role. Leverage determines the extent to which your position is amplified, making it a double-edged sword. Margin represents your initial investment and the capital at risk. Price Change reflects the market movement, which can be influenced by various factors such as economic data, geopolitical events, and market sentiment. By manipulating these variables, traders can simulate different scenarios and prepare for potential outcomes.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your trading results is essential for effective risk management. These factors interact dynamically, affecting the potential profit or loss of your leveraged positions. By analyzing these elements, traders can make informed decisions and optimize their strategies.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Volatility
        </h3>
        <p className="mb-4">
          Market volatility refers to the degree of variation in asset prices over time. High volatility can lead to rapid price changes, increasing the risk of significant losses or gains. Traders should be cautious during volatile periods and consider reducing leverage to mitigate risk.
        </p>
        <p className="mb-6">
          To manage volatility, traders can use stop-loss orders to limit potential losses. Additionally, diversifying your portfolio can help spread risk across different assets. For more strategies, check out our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Economic Indicators
        </h3>
        <p className="mb-4">
          Economic indicators such as GDP growth, unemployment rates, and inflation can significantly impact asset prices. Traders should monitor these indicators to anticipate market movements and adjust their strategies accordingly.
        </p>
        <p className="mb-6">
          Understanding how economic data affects market sentiment can provide a competitive edge. For example, a positive GDP report may boost investor confidence, leading to price increases. Conversely, rising unemployment could signal economic downturns, affecting asset values.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rates
        </h3>
        <p className="mb-4">
          Interest rates influence borrowing costs and can affect the profitability of leveraged positions. Higher interest rates increase the cost of borrowing, potentially reducing profit margins. Traders should consider interest rate trends when planning their trades.
        </p>
        <p className="mb-6">
          Keeping abreast of central bank policies and interest rate announcements can help traders anticipate market reactions. Adjusting leverage and margin requirements in response to interest rate changes can optimize trading outcomes.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Regulatory Environment
        </h3>
        <p className="mb-6">
          Regulatory changes can impact trading conditions and leverage limits. Traders should stay informed about regulatory developments in their markets to ensure compliance and adapt their strategies accordingly. Understanding the legal framework can prevent potential penalties and optimize trading efficiency.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Trader Psychology
        </h3>
        <p className="mb-6">
          Emotional factors such as fear and greed can influence trading decisions. Maintaining discipline and adhering to a well-defined trading plan can mitigate the impact of psychological biases. Traders should focus on long-term goals and avoid impulsive decisions driven by short-term market fluctuations.
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
                Federal Reserve - Economic Research
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on economic indicators and monetary policy affecting financial markets.
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
                Consumer Financial Protection Bureau - Trading Guides
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources for traders.
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
                Information on banking regulations and deposit insurance relevant to margin trading.
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
                Internal Revenue Service - Tax Implications
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information for traders and investors.
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
                Investopedia - Leverage & Margin
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained, including leverage.
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
                NerdWallet - Trading Strategies
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers, including trading tips.
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
      title="Leverage & Margin Profit Calculator"
      description="Calculate potential profits and losses with leverage. Assess risk and potential liquidation points for margin trading."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Leverage & Margin Profit Calculator" },
        { id: "formula", label: "Leverage & Margin Profit Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Profit/Loss = Leverage × Margin × Price Change",
        variables: [
          { symbol: "Leverage", description: "The ratio of borrowed funds to your own capital" },
          { symbol: "Margin", description: "The amount of capital you have invested" },
          { symbol: "Price Change", description: "The percentage change in the asset's price" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a leverage of 10, a margin of $1000, and expect a price change of 5%",
        steps: [
          { 
            label: "Step 1", 
            calculation: "10 × 1000 = 10000", 
            explanation: "Calculate the total leveraged position" 
          },
          { 
            label: "Step 2", 
            calculation: "10000 × 0.05 = 500", 
            explanation: "Determine the potential profit or loss" 
          },
          { 
            label: "Step 3", 
            calculation: "500 is your potential profit or loss", 
            explanation: "Interpret the result based on market direction" 
          }
        ],
        result: "The final result is a potential profit or loss of $500, meaning your position is significantly affected by the leverage."
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📅" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "💰" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "🔄" },
        { "title": "HELOC Payment Estimator", "url": "/financial/heloc-payment-estimator", "icon": "🏦" }
      ]}
    />
  );
}
