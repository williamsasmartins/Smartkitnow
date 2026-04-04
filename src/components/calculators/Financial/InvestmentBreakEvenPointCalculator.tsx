import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function InvestmentBreakEvenPointCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    initialInvestment: "", 
    currentPrice: "", 
    fees: "" 
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

  // FAQ STRUCTURED DATA
  const faqs = [
    {
      question: "How do I calculate the break-even point for an investment with upfront fees?",
      answer: "Break-even years = ln(Cost / (Cost − Fee)) / ln(1 + annual return). Example: $10,000 investment with $500 upfront fee (5%) at 7% annual return. Break-even = ln(10000 / 9500) / ln(1.07) = 0.0513 / 0.0677 ≈ 0.76 years (about 9 months). Without the fee, you start ahead; with the fee, you need 9 months of 7% growth just to recover the 5% charge. This calculation is especially important when comparing load mutual funds (5.75% front-end load) against no-load equivalents -- the load fund needs nearly a full year of performance advantage just to break even on fees."
    },
    {
      question: "What is the break-even analysis for real estate investment including all costs?",
      answer: "Real estate break-even includes: purchase price + closing costs (2–5%) + renovation costs + carrying costs (mortgage, taxes, insurance) − rental income. Break-even on a rental: if your all-in cost is $250,000 and monthly net cash flow is $500, payback period = 250,000 / (500 × 12) = 41.7 years (without appreciation). With 4% annual appreciation: use an amortizing model. The 1% rule (monthly rent ≥ 1% of purchase price) is a quick filter -- a $250,000 property should generate $2,500/month to break even in under 15 years. Most markets no longer support the 1% rule; evaluate total return (cash flow + appreciation) rather than cash flow alone."
    },
    {
      question: "How does the break-even point change when comparing two investment options with different fees?",
      answer: "Compare two ETFs: Fund A with 0.03% expense ratio, Fund B with 0.75% expense ratio, both returning 8% nominal. After 1 year: A = $10,797, B = $10,725. Differential = $72. The break-even concept here is when Fund B would need to outperform to justify its higher fees: never, since expense ratios are a guaranteed drag. Over 30 years: Fund A = $100,627, Fund B = $80,635 -- a $19,992 difference on a $10,000 investment solely from the 0.72% fee difference. Use break-even analysis when evaluating: load vs. no-load funds, advisor-managed vs. self-directed portfolios, and actively managed vs. index funds."
    },
    {
      question: "What is the break-even return rate needed to justify investment risk?",
      answer: "The break-even return is the minimum rate that makes an investment worth doing versus a risk-free alternative. If the risk-free rate (US Treasury yield) is 4.5% (2024), a stock investment must deliver at least 4.5% just to match -- and typically requires a 3–5% equity risk premium (ERP) to compensate for volatility, putting the required return at 7.5–9.5%. Break-even risk-adjusted return = risk-free rate + (beta × ERP). For a crypto investment with high volatility, the required return is much higher -- many investors implicitly require 20%+ annualized to justify crypto's volatility versus holding stocks. If your expected return does not exceed this threshold, the investment destroys risk-adjusted value even if it technically gains."
    },
    {
      question: "How long does it take for an investment in index funds to break even after a market crash?",
      answer: "Historical S&P 500 recovery periods after major crashes: 2000–2002 dot-com crash (−49%): 7 years to nominal break-even (2007). 2008–2009 financial crisis (−57%): 5.4 years to nominal break-even (2013). 2020 COVID crash (−34%): 5 months to break-even. A 50% loss requires 100% gain to recover -- this asymmetry is why drawdown control matters. With dividends reinvested, break-even periods shorten by 1–2 years. Dollar-cost averaging during the crash (rather than sitting in cash) significantly shortens recovery because you buy units at lower prices, reducing your effective cost basis below the pre-crash level."
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    const initialInvestmentValue = parseFloat(inputs.initialInvestment) || 0;
    const currentPriceValue = parseFloat(inputs.currentPrice) || 0;
    const feesValue = parseFloat(inputs.fees) || 0;

    // Validate
    if (initialInvestmentValue <= 0 || currentPriceValue <= 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const breakEvenPrice = (initialInvestmentValue + feesValue) / currentPriceValue;
    const profit = currentPriceValue - breakEvenPrice;
    const roi = (profit / breakEvenPrice) * 100;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      investmentValue: initialInvestmentValue + (profit * (i + 1) / 12),
      fees: feesValue,
      balance: initialInvestmentValue + (profit * (i + 1) / 12) - feesValue
    }));

    return { 
      mainResult: breakEvenPrice, 
      result2: profit, 
      result3: roi, 
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
    setInputs({ initialInvestment: "", currentPrice: "", fees: "" });
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
              Current Price
            </Label>
            <Input
              type="number"
              placeholder="e.g., 150"
              value={inputs.currentPrice}
              onChange={(e) => setInputs({ ...inputs, currentPrice: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Fees
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50"
              value={inputs.fees}
              onChange={(e) => setInputs({ ...inputs, fees: e.target.value })}
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
                      Break-Even Price
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
                      Profit
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
                      ROI (%)
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
                        <TableHead className="font-semibold">Investment Value</TableHead>
                        <TableHead className="font-semibold">Fees</TableHead>
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
                            <TableCell>{formatCurrency(row.investmentValue)}</TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.fees)}
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
          Understanding Investment Break-Even Point Calculator
        </h2>
        
        <p className="mb-6">
          Investing in cryptocurrencies can be both exciting and daunting due to the volatile nature of the market. One of the crucial aspects of investing is understanding when your investment will break even, meaning when the value of your investment equals the initial amount you put in, accounting for any fees. The Investment Break-Even Point Calculator is a tool designed to help investors determine this critical point, allowing them to make informed decisions about their trades. By knowing the break-even price, investors can strategize their entry and exit points more effectively.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital in the world of investments. A miscalculation can lead to significant financial losses or missed opportunities. This calculator provides a reliable way to compute the break-even point by considering initial investment, current price, and associated fees. With the right data, investors can avoid the pitfalls of guesswork and make data-driven decisions. For those interested in further financial planning, our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> offers insights into managing loan repayments effectively.
        </p>
        
        <p className="mb-6">
          To use this calculator, gather information about your initial investment amount, the current price of the asset, and any fees incurred during the transaction. Enter these values into the respective fields to calculate your break-even point. This tool is intuitive and user-friendly, designed to provide results quickly and accurately. For a comprehensive understanding of your financial commitments, consider using our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check the fees associated with your investments. These can significantly impact your break-even point. Ensure you are aware of both upfront and hidden fees to avoid unexpected costs that could affect your investment strategy.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include regularly updating your inputs as market conditions change. This ensures that your calculations remain relevant and accurate. Additionally, consider the impact of market volatility on your investments and adjust your strategy accordingly. Understanding these dynamics can help you optimize your investment outcomes.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Investment Break-Even Point Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Investment Break-Even Point Calculator is straightforward yet powerful. It calculates the break-even price by dividing the sum of the initial investment and fees by the current price of the asset. This formula is widely accepted in financial circles for its simplicity and effectiveness in determining the point at which an investment becomes profitable.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Break-Even Price = (Initial Investment + Fees) / Current Price
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Initial Investment = The amount of money initially invested</li>
              <li>Fees = Total fees associated with the investment</li>
              <li>Current Price = The current market price of the asset</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in this formula plays a crucial role in determining the break-even point. The initial investment represents the capital you have put into the asset, while fees cover any costs incurred during the transaction. The current price reflects the market value of the asset, which can fluctuate based on market conditions. Understanding how these variables interact can help you make more informed investment decisions.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Several factors can influence the results of your break-even point calculation. Understanding these factors is essential for accurate and meaningful results. They interact in complex ways, and being aware of them can help you optimize your investment strategy.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Volatility
        </h3>
        <p className="mb-4">
          Market volatility refers to the rapid and significant price changes in the market. It can greatly affect your break-even point as the current price of the asset fluctuates. High volatility can lead to unexpected changes in your investment's value, impacting your strategy.
        </p>
        <p className="mb-6">
          To manage volatility, consider diversifying your portfolio and setting stop-loss orders to minimize potential losses. Additionally, stay informed about market trends and news that could impact asset prices. For more insights, check out our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Fees and Commissions
        </h3>
        <p className="mb-4">
          Fees and commissions are costs associated with buying, selling, or holding an asset. They can significantly impact your break-even point by increasing the amount needed to cover your initial investment. Understanding the fee structure of your investments is crucial.
        </p>
        <p className="mb-6">
          Different platforms and brokers have varying fee structures. Always read the fine print and compare fees across different services to ensure you are getting the best deal. This can help you minimize costs and improve your investment returns.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Investment Time Horizon
        </h3>
        <p className="mb-4">
          The investment time horizon is the period you plan to hold your investment before selling it. A longer time horizon can allow for more market fluctuations, potentially smoothing out short-term volatility. However, it also requires patience and a long-term perspective.
        </p>
        <p className="mb-6">
          Consider your financial goals and risk tolerance when determining your investment time horizon. Long-term investments may benefit from compound growth, while short-term investments might require more active management. Consult our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a> for more financial planning tools.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Asset Liquidity
        </h3>
        <p className="mb-6">
          Liquidity refers to how easily an asset can be bought or sold in the market without affecting its price. Highly liquid assets can be quickly converted to cash, while illiquid assets may take longer to sell and could incur additional costs. Liquidity can impact your ability to reach the break-even point, especially if you need to sell quickly.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Economic Conditions
        </h3>
        <p className="mb-6">
          Economic conditions, such as inflation rates, interest rates, and overall economic growth, can influence asset prices and investment returns. Staying informed about economic trends can help you anticipate changes in market conditions and adjust your strategy accordingly. Consider consulting financial news sources and economic reports for the latest updates.
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
                Access comprehensive data and analysis on economic conditions and trends.
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
                Explore educational resources and guides on making informed investment decisions.
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
                FDIC - Banking and Investment Resources
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Learn about banking regulations and investment protections available to consumers.
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
                Find official tax guidelines and information relevant to investment income.
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
                Access detailed articles and tutorials on various investment strategies and concepts.
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
                NerdWallet - Personal Finance and Investment Tools
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Discover tools and resources to help manage your personal finances and investments.
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
      title="Investment Break-Even Point Calculator"
      description="Determine when your investment will become profitable based on initial costs and expected returns."
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "calculator", label: "Calculator" },
        { id: "editorial", label: "Editorial" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" }
      ]}
      formula={{
        formula: "(Initial Investment + Fees) / Current Price",
        variables: [
          { symbol: "Initial Investment", description: "The amount of money initially invested" },
          { symbol: "Fees", description: "Total fees associated with the investment" },
          { symbol: "Current Price", description: "The current market price of the asset" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have invested $10,000 in a cryptocurrency currently priced at $150, with $50 in fees.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "($10,000 + $50) / $150 = $67.00", 
            explanation: "Calculate the break-even price by dividing the total cost by the current price." 
          },
          { 
            label: "Step 2", 
            calculation: "$150 - $67.00 = $83.00", 
            explanation: "Determine the profit per unit by subtracting the break-even price from the current price." 
          },
          { 
            label: "Step 3", 
            calculation: "($83.00 / $67.00) × 100 = 123.88%", 
            explanation: "Calculate the ROI percentage to understand the return on investment." 
          }
        ],
        result: "The final result is a break-even price of $67.00, meaning you need the asset to be priced at least this much to cover costs."
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
