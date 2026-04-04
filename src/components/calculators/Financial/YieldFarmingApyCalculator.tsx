import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function YieldFarmingApyCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    initialInvestment: "", 
    dailyInterestRate: "", 
    compoundingFrequency: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "How accurate are yield farming APY calculations and what limitations should I be aware of?",
      answer: "This calculator provides estimates based on the inputs you provide. For yield farming APY, accuracy depends on using current DeFi risk data -- rates, prices, and regulatory thresholds change frequently. The results are most reliable for planning purposes and comparative analysis. For financial decisions involving significant amounts, verify results against official sources or consult a DeFi risk professional."
    },
    {
      question: "What key factors most affect yield farming APY results?",
      answer: "The most impactful variables in yield farming APY calculations are typically the primary rate or percentage input and the time horizon. Small changes in these variables compound significantly over longer periods. For example, a 1% difference in return rate over 20 years can change outcomes by 20–30%. Always run the calculation at multiple input values to understand your sensitivity to each variable."
    },
    {
      question: "When should I recalculate yield farming APY?",
      answer: "Recalculate whenever DeFi risk conditions change significantly: after major DeFi risk events, when your inputs change (income, rates, holdings), or when DeFi risk regulations are updated. For time-sensitive DeFi risk metrics, recalculate monthly. For long-term planning tools, a quarterly review is typically sufficient. Set a calendar reminder to revisit projections annually at minimum."
    },
    {
      question: "How does yield farming APY relate to other financial planning metrics?",
      answer: "No single metric tells the complete financial picture. Yield farming apy should be evaluated alongside related measures like impermanent loss. These metrics interact: improving one often affects another. Build a dashboard of 3–5 key metrics that together reflect the health of your DeFi risk situation, rather than optimizing any single number in isolation."
    },
    {
      question: "What are the most common mistakes when calculating yield farming APY?",
      answer: "The most frequent errors in yield farming APY calculations: (1) Using pre-tax instead of post-tax figures where after-tax analysis is needed, (2) Ignoring fees and transaction costs that reduce net returns, (3) Using nominal figures without inflation adjustment for long-horizon projections, (4) Assuming constant rates -- real-world DeFi risk conditions fluctuate. Double-check your inputs against current DeFi risk data before relying on results for significant financial decisions."
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
    const initialInvestment = parseFloat(inputs.initialInvestment) || 0;
    const dailyInterestRate = parseFloat(inputs.dailyInterestRate) || 0;
    const compoundingFrequency = parseInt(inputs.compoundingFrequency) || 0;

    // Validate
    if (initialInvestment <= 0 || dailyInterestRate <= 0 || compoundingFrequency <= 0) {
      return { 
        mainResult: 0, 
        annualYield: 0, 
        totalInterest: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const dailyRate = dailyInterestRate / 100;
    const periods = 365 * compoundingFrequency;
    const mainResult = initialInvestment * Math.pow((1 + dailyRate / compoundingFrequency), periods);
    const totalInterest = mainResult - initialInvestment;
    const annualYield = (Math.pow((1 + dailyRate / compoundingFrequency), compoundingFrequency) - 1) * 100;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      balance: initialInvestment * Math.pow((1 + dailyRate / compoundingFrequency), (i + 1) * compoundingFrequency),
      interest: (initialInvestment * Math.pow((1 + dailyRate / compoundingFrequency), (i + 1) * compoundingFrequency)) - initialInvestment
    }));

    return { 
      mainResult, 
      annualYield, 
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
    setInputs({ initialInvestment: "", dailyInterestRate: "", compoundingFrequency: "" });
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
              Daily Interest Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 0.1"
              value={inputs.dailyInterestRate}
              onChange={(e) => setInputs({ ...inputs, dailyInterestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Compounding Frequency (times per year)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 365"
              value={inputs.compoundingFrequency}
              onChange={(e) => setInputs({ ...inputs, compoundingFrequency: e.target.value })}
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
                      Total Future Value
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
                      Annual Yield
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {results.annualYield.toFixed(2)}%
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
                    Monthly Growth Schedule
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
                        <TableHead className="font-semibold">Balance</TableHead>
                        <TableHead className="font-semibold">Interest Earned</TableHead>
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
                            <TableCell>{formatCurrency(row.balance)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
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
          Understanding Yield Farming APY Calculator
        </h2>
        
        <p className="mb-6">
          Yield farming, a popular strategy in the decentralized finance (DeFi) space, involves staking or lending crypto assets to generate high returns or rewards in the form of additional cryptocurrency. The Yield Farming APY Calculator is designed to help investors estimate the potential annual percentage yield (APY) they can earn from their yield farming activities. This tool is crucial for anyone involved in DeFi as it provides a clear picture of potential earnings, allowing for better financial planning and decision-making.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital in yield farming due to the volatile nature of cryptocurrency markets. An incorrect estimation can lead to significant financial losses or missed opportunities for profit. This calculator takes into account various factors such as initial investment, daily interest rate, and compounding frequency to provide a reliable estimate of potential returns. By using this tool, investors can make informed decisions about where to allocate their resources for maximum benefit. For more insights, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use the Yield Farming APY Calculator effectively, gather information about your initial investment, the expected daily interest rate, and the frequency of compounding. Enter these values into the calculator to get an estimate of your annual yield and total interest earned. This step-by-step approach ensures that you input accurate data, resulting in more precise calculations. For further guidance on financial calculations, visit our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check your input values before calculating. Small errors in data entry can lead to significantly different results, affecting your investment strategy. Ensure you understand the terms and conditions of the yield farming platform you are using.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include regularly updating your inputs as market conditions change, and considering the impact of fees and other costs associated with yield farming. These factors can significantly affect your net returns. Additionally, it's advisable to diversify your investments across multiple platforms to mitigate risk. For more strategies, explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Yield Farming APY Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Yield Farming APY Calculator is based on the compound interest formula, which is a standard approach for calculating investment growth over time. This formula considers the initial investment, the interest rate, and the frequency of compounding to determine the future value of the investment. The compound interest formula is widely used in finance due to its ability to accurately model the effects of compounding, which is a key feature of yield farming.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          FV = P × (1 + r/n)^(nt)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>P = Initial investment</li>
              <li>r = Daily interest rate</li>
              <li>n = Compounding frequency</li>
              <li>t = Time period in years</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the final result. The initial investment (P) is the amount of money you start with. The daily interest rate (r) is the rate at which your investment grows each day. The compounding frequency (n) is how often the interest is applied to the investment. Finally, the time period (t) is the duration of the investment in years. Changes in any of these variables will affect the future value of the investment, highlighting the importance of accurate data entry.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your yield farming results is crucial for optimizing your investment strategy. These factors interact in complex ways, and being aware of them can help you make more informed decisions.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Initial Investment
        </h3>
        <p className="mb-4">
          The initial investment is the starting point of your yield farming journey. A larger initial investment can lead to higher returns due to the compounding effect. However, it's important to balance potential gains with the risk of loss, especially in volatile markets.
        </p>
        <p className="mb-6">
          To optimize your initial investment, consider diversifying across different yield farming platforms. This approach can help mitigate risk while maximizing potential returns. For more insights, visit our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Daily Interest Rate
        </h3>
        <p className="mb-4">
          The daily interest rate is a critical factor in determining your returns. It represents the percentage increase in your investment each day. Higher rates can lead to substantial gains, but they also come with increased risk.
        </p>
        <p className="mb-6">
          Interest rates can vary significantly across different platforms and projects. It's essential to research and compare rates to ensure you're getting the best possible return on your investment. Keep an eye on market trends and adjust your strategy accordingly.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Compounding Frequency
        </h3>
        <p className="mb-4">
          Compounding frequency refers to how often the interest is applied to your investment. More frequent compounding can lead to higher returns, as interest is calculated on an increasingly larger balance.
        </p>
        <p className="mb-6">
          While daily compounding is common in yield farming, some platforms may offer different frequencies. Understanding the impact of compounding frequency on your returns can help you choose the best platform for your needs.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Volatility
        </h3>
        <p className="mb-6">
          Market volatility can significantly impact your yield farming results. Cryptocurrency prices can fluctuate rapidly, affecting the value of your investment. It's important to stay informed about market trends and adjust your strategy as needed.
        </p>
        <p className="mb-6">
          Diversifying your investments and setting stop-loss orders can help protect your portfolio from sudden market changes. Regularly reviewing your investment strategy can also ensure that you're prepared for any market conditions.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Platform Fees
        </h3>
        <p className="mb-6">
          Fees associated with yield farming platforms can eat into your returns. These fees can include transaction fees, withdrawal fees, and management fees. It's essential to factor these costs into your calculations to get an accurate picture of your net returns.
        </p>
        <p className="mb-6">
          Comparing fees across different platforms can help you choose the most cost-effective option. Look for platforms that offer competitive rates and transparent fee structures to maximize your earnings.
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
                href="https://www.coindesk.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                CoinDesk - Cryptocurrency News
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Stay updated with the latest news and trends in the cryptocurrency market.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.defipulse.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                DeFi Pulse - DeFi Market Tracker
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Track the latest trends and data in the decentralized finance space.
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
                Comprehensive guides and articles on financial concepts and investment strategies.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.binance.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Binance Academy - Crypto Education
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Learn about cryptocurrency and blockchain technology through detailed articles and tutorials.
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
                Access official data and research on economic conditions and policies.
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
      title="Yield Farming APY Calculator"
      description="Calculate Annual Percentage Yield (APY) for yield farming. Estimate daily and yearly returns on your liquidity provider positions."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Yield Farming APY Calculator" },
        { id: "formula", label: "Yield Farming APY Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "FV = P × (1 + r/n)^(nt)",
        variables: [
          { symbol: "P", description: "Initial investment" },
          { symbol: "r", description: "Daily interest rate" },
          { symbol: "n", description: "Compounding frequency" },
          { symbol: "t", description: "Time period in years" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you invest $10,000 with a daily interest rate of 0.1% compounded daily.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "10000 × (1 + 0.001/365)^(365×1) = 11051.27", 
            explanation: "Calculate the future value after one year." 
          },
          { 
            label: "Step 2", 
            calculation: "11051.27 - 10000 = 1051.27", 
            explanation: "Determine the total interest earned." 
          },
          { 
            label: "Step 3", 
            calculation: "1051.27 / 10000 × 100 = 10.51%", 
            explanation: "Calculate the annual yield percentage." 
          }
        ],
        result: "The final result is $11,051.27, meaning you earn $1,051.27 in interest, resulting in a 10.51% APY."
      }}
      relatedCalculators={[
        {"title":"Loan Payment Calculator (Principal, Rate, Term)","url":"/financial/loan-payment","icon":"💵"},
        {"title":"Mortgage Payment & Amortization Calculator","url":"/financial/mortgage-amortization","icon":"🏠"},
        {"title":"Extra Payments & Payoff Time Calculator","url":"/financial/extra-payments-payoff","icon":"📊"},
        {"title":"Interest-Only Loan Calculator","url":"/financial/interest-only-loan","icon":"📈"},
        {"title":"Refinance Savings Calculator","url":"/financial/refinance-savings","icon":"💰"},
        {"title":"HELOC Payment Estimator","url":"/financial/heloc-payment-estimator","icon":"🏦"}
      ]}
    />
  );
}
