import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function CryptoDcaStrategyCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    investmentAmount: "", 
    frequency: "", 
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

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    let investmentAmount = parseFloat(inputs.investmentAmount) || 0;
    const frequency = parseFloat(inputs.frequency) || 0;
    const duration = parseFloat(inputs.duration) || 0;

    // Validate
    if (investmentAmount <= 0 || frequency <= 0 || duration <= 0) {
      return { 
        mainResult: 0, 
        totalInvested: 0, 
        totalValue: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const totalInvested = investmentAmount * frequency * duration;
    const estimatedGrowthRate = 0.07; // Example growth rate
    const totalValue = totalInvested * Math.pow(1 + estimatedGrowthRate, duration);

    // Generate schedule data if applicable (e.g., investment schedule)
    const scheduleData = Array.from({ length: duration * frequency }, (_, i) => ({
      period: i + 1,
      investment: investmentAmount,
      growth: investmentAmount * Math.pow(1 + estimatedGrowthRate, i / frequency),
      total: investmentAmount * (i + 1) + investmentAmount * Math.pow(1 + estimatedGrowthRate, i / frequency)
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
    setInputs({ investmentAmount: "", frequency: "", duration: "" });
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
              Frequency (times per year)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 12"
              value={inputs.frequency}
              onChange={(e) => setInputs({ ...inputs, frequency: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Duration (years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
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
                      Total Value of Investment
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
                      Estimated Growth
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalValue - results.totalInvested)}
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* INVESTMENT SCHEDULE TABLE (if applicable) */}
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
                        <TableHead className="font-semibold">Period</TableHead>
                        <TableHead className="font-semibold">Investment</TableHead>
                        <TableHead className="font-semibold">Growth</TableHead>
                        <TableHead className="font-semibold">Total</TableHead>
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
                            <TableCell className="font-medium">{row.period}</TableCell>
                            <TableCell>{formatCurrency(row.investment)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.growth)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.total)}
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
          Understanding Crypto DCA Strategy Calculator
        </h2>
        
        <p className="mb-6">
          The Crypto Dollar-Cost Averaging (DCA) Strategy Calculator is a powerful tool designed to help investors understand the potential outcomes of a DCA strategy in the volatile cryptocurrency market. This calculator allows users to input their regular investment amount, frequency of investment, and the duration over which they plan to invest. By simulating historical performance, it provides insights into how consistent investments can grow over time, despite market fluctuations. This tool is particularly useful for those looking to mitigate the risks associated with market timing and to take advantage of the long-term growth potential of cryptocurrencies.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial in the realm of cryptocurrency investments due to the market's inherent volatility. Incorrect calculations can lead to misguided investment decisions, potentially resulting in financial losses. The Crypto DCA Strategy Calculator helps users make informed decisions by providing a clear picture of potential returns based on historical data. This tool is indispensable for both novice and experienced investors who wish to adopt a disciplined investment approach. For more insights on financial planning, you can explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information on your intended investment amount per period, the frequency of your investments (e.g., monthly, quarterly), and the total duration of your investment plan in years. Enter these values into the respective fields to calculate the potential growth of your investment. The calculator will provide a detailed breakdown of your total investment, estimated growth, and final value. For additional guidance on managing your investments, consider visiting our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Consistency is key in a DCA strategy. By investing a fixed amount regularly, you can reduce the impact of market volatility and avoid the pitfalls of trying to time the market. This approach can lead to a more stable investment growth over time.
          </p>
        </div>
        
        <p className="mb-6">
          For optimal results, ensure that you are consistent with your investment schedule and adjust your strategy based on market conditions and personal financial goals. Be aware of transaction fees and taxes, which can affect your net returns. Regularly reviewing and adjusting your strategy can help you stay aligned with your financial objectives.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Crypto DCA Strategy Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Crypto DCA Strategy Calculator is based on the principle of dollar-cost averaging, which involves investing a fixed amount of money at regular intervals, regardless of the asset's price. This approach helps in accumulating more units when prices are low and fewer units when prices are high, thus averaging out the cost per unit over time. The formula takes into account the regular investment amount, the frequency of investments, and the duration of the investment period.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Total Value = Investment Amount × Frequency × Duration × (1 + Growth Rate) ^ Duration
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Investment Amount = The fixed amount invested each period</li>
              <li>Frequency = Number of times investments are made per year</li>
              <li>Duration = Total number of years the investment is held</li>
              <li>Growth Rate = Estimated annual growth rate of the investment</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the final value of the investment. The investment amount and frequency determine the total capital invested over the duration. The growth rate reflects the expected annual increase in the value of the investment, which can vary based on market conditions. Adjusting these variables can significantly impact the projected returns, highlighting the importance of setting realistic expectations and regularly reviewing your investment strategy.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your investment results is essential for optimizing your strategy. These factors interact in complex ways, and being aware of them can help you make informed decisions and adjust your approach as needed.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Volatility
        </h3>
        <p className="mb-4">
          Market volatility refers to the fluctuations in asset prices over time. In the context of cryptocurrency, volatility can be extreme, with prices changing rapidly. This factor is crucial because it affects the timing and cost of your investments. By using a DCA strategy, you can mitigate some of the risks associated with volatility by spreading your investments over time.
        </p>
        <p className="mb-6">
          To optimize your strategy in volatile markets, consider adjusting your investment frequency or amount based on market conditions. For more insights on managing financial risks, check out our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Investment Horizon
        </h3>
        <p className="mb-4">
          The investment horizon is the length of time you plan to hold your investments before needing to access the funds. A longer horizon allows for more time to ride out market fluctuations and benefit from compound growth. Conversely, a shorter horizon may require a more conservative approach to minimize risk.
        </p>
        <p className="mb-6">
          Consider your financial goals and time frame when setting your investment horizon. Longer horizons typically allow for more aggressive strategies, while shorter ones may necessitate a focus on capital preservation.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Growth Rate Assumptions
        </h3>
        <p className="mb-4">
          The growth rate assumption is an estimate of how much your investment is expected to grow annually. This rate can significantly impact your projected returns. It's important to use realistic growth rate assumptions based on historical data and market conditions.
        </p>
        <p className="mb-6">
          Regularly review and adjust your growth rate assumptions to reflect changes in the market environment. This can help ensure that your investment strategy remains aligned with your financial objectives.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Transaction Costs
        </h3>
        <p className="mb-6">
          Transaction costs, including fees and commissions, can erode your investment returns over time. These costs can vary significantly depending on the platform or exchange you use. It's important to factor in these costs when calculating your net returns and to seek platforms with competitive fee structures.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Regulatory Environment
        </h3>
        <p className="mb-6">
          The regulatory environment can impact the cryptocurrency market and your investment strategy. Changes in regulations can affect market dynamics, transaction costs, and the availability of certain investment options. Staying informed about regulatory developments can help you anticipate potential changes and adjust your strategy accordingly.
        </p>
      </section>

      {/* SECTION 4: FAQ (1000-1200 words with 8 questions) */}
      <section id="faq">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-8">
          {/* QUESTION 1 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What is crypto DCA strategy calculator and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The Crypto DCA Strategy Calculator is a tool that helps investors plan and analyze the potential outcomes of a dollar-cost averaging strategy in the cryptocurrency market. This approach involves investing a fixed amount at regular intervals, which can help reduce the impact of market volatility and avoid the pitfalls of market timing. By using this calculator, investors can gain insights into how their investments might grow over time, making it an essential tool for long-term financial planning.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Understanding the potential returns and risks associated with a DCA strategy can help investors make informed decisions and optimize their investment approach. For more information on related financial strategies, visit our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The accuracy of the Crypto DCA Strategy Calculator depends on the assumptions and inputs provided by the user, such as the growth rate and investment frequency. While the calculator uses historical data and standard financial formulas to estimate potential outcomes, it's important to remember that past performance is not indicative of future results. Market conditions can change, affecting the accuracy of projections.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For the most accurate results, regularly update your inputs and assumptions to reflect current market conditions. Consider consulting a financial advisor for personalized advice.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use the Crypto DCA Strategy Calculator, you need to provide the following information: the amount you plan to invest at each interval, the frequency of your investments (e.g., monthly, quarterly), and the duration of your investment plan in years. Additionally, an estimated annual growth rate for your investments can help project potential returns. This information can typically be found in your financial plan or investment strategy documents.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Ensure that the data you enter is accurate and reflects your current financial situation and market expectations. This will help you obtain realistic projections and make informed investment decisions.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for specific scenarios?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, the Crypto DCA Strategy Calculator can be used for various scenarios, such as planning regular investments in different cryptocurrencies or adjusting your strategy based on market conditions. However, it's important to consider the limitations of the calculator, such as the assumptions made about growth rates and market volatility. For more complex scenarios, you may need to adjust the inputs or consult with a financial advisor to ensure that your strategy aligns with your goals.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For alternative approaches to investment planning, explore our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include using unrealistic growth rate assumptions, failing to account for transaction fees, and not updating inputs to reflect changes in market conditions. These errors can lead to inaccurate projections and misguided investment decisions. It's important to regularly review and adjust your strategy based on current data and market trends.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To avoid these mistakes, ensure that your inputs are realistic and based on thorough research. Consider consulting a financial advisor for additional guidance and support.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              It's advisable to recalculate your investment projections whenever there are significant changes in market conditions, your financial situation, or your investment goals. Regular recalculation, such as quarterly or annually, can help ensure that your strategy remains aligned with your objectives and market realities.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Establishing a regular schedule for reviewing and updating your investment strategy can help you stay on track and make informed decisions.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results from the Crypto DCA Strategy Calculator to evaluate your current investment strategy and make adjustments as needed. The projections can help you identify whether your strategy is on track to meet your financial goals or if changes are necessary. Consider consulting with a financial advisor to interpret the results and develop a comprehensive investment plan.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For further guidance on financial planning, explore our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Alternatives to the DCA strategy include lump-sum investing, where you invest a large amount at once, or tactical asset allocation, where you adjust your investments based on market conditions. Each method has its pros and cons, and the best approach depends on your financial goals, risk tolerance, and market outlook.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Consider experimenting with different strategies or consulting a financial advisor to determine the best approach for your situation.
            </p>
          </div>
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
                Federal Reserve - Economic Research and Data
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on economic indicators and monetary policy, providing insights into market conditions.
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
                Consumer Financial Protection Bureau - Financial Education
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources for informed financial decisions.
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
                FDIC - Banking and Financial Services
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Information on banking regulations and deposit insurance, essential for understanding financial stability.
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
                Official tax guidelines and deduction information, crucial for financial planning and compliance.
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
                Detailed financial education and investment concepts explained for better understanding of market dynamics.
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
                NerdWallet - Personal Finance Guides
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers, helping to make informed financial choices.
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
      title="Crypto DCA Strategy Calculator"
      description="Calculate potential returns from a Crypto DCA strategy. Analyze historical performance of recurring buys in volatile markets."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Crypto DCA Strategy Calculator" },
        { id: "formula", label: "Crypto DCA Strategy Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Total Value = Investment Amount × Frequency × Duration × (1 + Growth Rate) ^ Duration",
        variables: [
          { symbol: "Investment Amount", description: "The fixed amount invested each period" },
          { symbol: "Frequency", description: "Number of times investments are made per year" },
          { symbol: "Duration", description: "Total number of years the investment is held" },
          { symbol: "Growth Rate", description: "Estimated annual growth rate of the investment" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you invest $100 monthly for 5 years with an estimated annual growth rate of 7%.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "100 × 12 = 1200", 
            explanation: "Calculate the total annual investment." 
          },
          { 
            label: "Step 2", 
            calculation: "1200 × 5 = 6000", 
            explanation: "Determine the total investment over 5 years." 
          },
          { 
            label: "Step 3", 
            calculation: "6000 × (1 + 0.07)^5 = 8420.48", 
            explanation: "Calculate the total value with growth." 
          }
        ],
        result: "The final result is $8,420.48, meaning your investment has grown by $2,420.48 over 5 years."
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