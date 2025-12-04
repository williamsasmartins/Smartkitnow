import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function GpuAsicMiningRoiCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    hardwareCost: "", 
    dailyProfit: "", 
    electricityCost: "" 
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
    let hardwareCostValue = parseFloat(inputs.hardwareCost) || 0;
    const dailyProfitValue = parseFloat(inputs.dailyProfit) || 0;
    const electricityCostValue = parseFloat(inputs.electricityCost) || 0;

    // Validate
    if (hardwareCostValue <= 0 || dailyProfitValue <= 0) {
      return { 
        roiDays: 0, 
        monthlyProfit: 0, 
        annualProfit: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const netDailyProfit = dailyProfitValue - electricityCostValue;
    const roiDays = hardwareCostValue / netDailyProfit;
    const monthlyProfit = netDailyProfit * 30;
    const annualProfit = netDailyProfit * 365;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      cumulativeProfit: netDailyProfit * 30 * (i + 1),
      remainingCost: Math.max(hardwareCostValue - (netDailyProfit * 30 * (i + 1)), 0)
    }));

    return { 
      roiDays, 
      monthlyProfit, 
      annualProfit, 
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
    setInputs({ hardwareCost: "", dailyProfit: "", electricityCost: "" });
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
              Hardware Cost
            </Label>
            <Input
              type="number"
              placeholder="e.g., 3000"
              value={inputs.hardwareCost}
              onChange={(e) => setInputs({ ...inputs, hardwareCost: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Daily Profit
            </Label>
            <Input
              type="number"
              placeholder="e.g., 15"
              value={inputs.dailyProfit}
              onChange={(e) => setInputs({ ...inputs, dailyProfit: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Electricity Cost
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={inputs.electricityCost}
              onChange={(e) => setInputs({ ...inputs, electricityCost: e.target.value })}
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
      {results.roiDays > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Days to ROI
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {Math.ceil(results.roiDays)}
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
                      Monthly Profit
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.monthlyProfit)}
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
                      Annual Profit
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.annualProfit)}
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
                    Profit Schedule
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
                        <TableHead className="font-semibold">Cumulative Profit</TableHead>
                        <TableHead className="font-semibold">Remaining Cost</TableHead>
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
                            <TableCell>{formatCurrency(row.cumulativeProfit)}</TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.remainingCost)}
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
          Understanding GPU/ASIC Mining ROI Calculator
        </h2>
        
        <p className="mb-6">
          The GPU/ASIC Mining ROI Calculator is an essential tool for anyone involved in cryptocurrency mining. It helps miners determine how long it will take to recoup their investment in mining hardware, such as GPUs or ASICs, based on current profitability metrics. This calculation is crucial for making informed decisions about hardware purchases and operational strategies. By understanding the return on investment (ROI), miners can optimize their operations to maximize profits and minimize risks.
        </p>
        
        <p className="mb-6">
          Accurate ROI calculations are vital in the volatile world of cryptocurrency mining. An incorrect estimation can lead to significant financial losses, especially given the high upfront costs associated with purchasing mining hardware. This calculator provides a reliable way to assess potential returns, allowing miners to adjust their strategies accordingly. For more insights into financial planning, consider exploring our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information on your hardware cost, daily profit, and electricity expenses. Enter these values into the respective fields to calculate your ROI. The tool will provide an estimate of the number of days required to break even, along with monthly and annual profit projections. For additional guidance on managing financial resources, visit our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always consider the volatility of cryptocurrency markets when planning your mining operations. Prices can fluctuate significantly, impacting your profitability and ROI. Regularly update your calculations to reflect current market conditions and adjust your strategy accordingly.
          </p>
        </div>
        
        <p className="mb-6">
          For best results, ensure that your input data is accurate and up-to-date. Consider factors such as hardware efficiency, network difficulty, and electricity rates, as these can significantly influence your ROI. By staying informed and proactive, you can optimize your mining operations for maximum profitability.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          GPU/ASIC Mining ROI Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this calculator is designed to provide a straightforward estimation of the return on investment for mining hardware. It calculates the number of days required to break even based on the net daily profit, which is the difference between daily earnings from mining and electricity costs. This approach is widely accepted in the mining community due to its simplicity and effectiveness.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          ROI Days = Hardware Cost / (Daily Profit - Electricity Cost)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Hardware Cost = Initial investment in mining hardware</li>
              <li>Daily Profit = Earnings from mining per day</li>
              <li>Electricity Cost = Daily cost of electricity used by mining hardware</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the ROI. The hardware cost represents the initial investment, while the daily profit reflects the revenue generated from mining activities. Electricity cost is a critical factor, as it directly impacts the net profit. By adjusting these variables, miners can explore different scenarios and identify the most profitable strategies.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your mining ROI is essential for optimizing your operations. These factors can vary widely and interact in complex ways, affecting your overall profitability. By analyzing these elements, you can make informed decisions and enhance your mining strategy.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Hardware Efficiency
        </h3>
        <p className="mb-4">
          Hardware efficiency is a critical factor in mining profitability. More efficient hardware can produce more hashes per watt of electricity, reducing operational costs and increasing net profit. Investing in high-efficiency hardware can significantly shorten the time required to achieve ROI.
        </p>
        <p className="mb-6">
          To optimize hardware efficiency, consider upgrading to newer models or optimizing existing setups. Regular maintenance and monitoring can also help maintain peak performance. For more insights on financial optimization, explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Cryptocurrency Market Prices
        </h3>
        <p className="mb-4">
          The price of cryptocurrencies directly impacts mining profitability. Higher prices generally lead to increased earnings, while lower prices can reduce profit margins. Staying informed about market trends and price fluctuations is crucial for effective mining operations.
        </p>
        <p className="mb-6">
          To mitigate risks associated with price volatility, consider diversifying your mining portfolio or using hedging strategies. Regularly updating your ROI calculations can help you adapt to changing market conditions.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Network Difficulty
        </h3>
        <p className="mb-4">
          Network difficulty refers to the complexity of mining a new block. As more miners join the network, difficulty increases, potentially reducing individual earnings. Monitoring network difficulty is essential for understanding its impact on your ROI.
        </p>
        <p className="mb-6">
          To manage network difficulty, consider mining less competitive cryptocurrencies or joining mining pools. These strategies can help stabilize earnings and improve ROI.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Electricity Costs
        </h3>
        <p className="mb-6">
          Electricity costs are a significant expense in mining operations. High electricity rates can erode profits, making it essential to find cost-effective energy solutions. Consider relocating to regions with lower electricity costs or investing in renewable energy sources to reduce expenses.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Regulatory and Legal Considerations
        </h3>
        <p className="mb-6">
          Regulatory and legal factors can influence mining operations. Compliance with local laws and regulations is crucial to avoid potential fines or shutdowns. Stay informed about legal developments in your region and adjust your operations accordingly.
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
              What is gpu/asic mining roi calculator and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The GPU/ASIC Mining ROI Calculator is a tool designed to help miners estimate the time required to recoup their investment in mining hardware. It calculates the return on investment based on current profitability metrics, providing insights into the financial viability of mining operations.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Understanding ROI is crucial for making informed decisions about hardware purchases and operational strategies. For more financial tools, visit our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The accuracy of this calculator depends on the precision of the input data. Factors such as fluctuating cryptocurrency prices, network difficulty, and electricity costs can affect the results. It's important to regularly update your calculations to reflect current conditions.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For best results, ensure that your input data is accurate and up-to-date. Consider consulting professionals for complex scenarios.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use this calculator, you need to provide the cost of your mining hardware, the daily profit from mining activities, and the daily electricity cost. These inputs are essential for calculating the ROI and understanding the financial viability of your mining operations.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Accurate data is crucial for reliable results. Gather information from reliable sources and update regularly to reflect current market conditions.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for [specific scenario]?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              This calculator is versatile and can be used for various scenarios involving GPU or ASIC mining. Whether you're a small-scale miner or operating a large mining farm, the calculator can provide valuable insights into your ROI.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For specific scenarios, ensure that your input data accurately reflects your operational conditions. Adjust the inputs as necessary to explore different outcomes and strategies.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include using outdated or inaccurate input data, neglecting to account for fluctuations in cryptocurrency prices, and underestimating electricity costs. These errors can lead to incorrect ROI estimates and poor decision-making.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To avoid these mistakes, regularly update your input data and consider all relevant factors. Stay informed about market trends and adjust your calculations accordingly.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Recalculation is necessary whenever there are significant changes in market conditions, such as fluctuations in cryptocurrency prices or electricity rates. Regular updates ensure that your ROI estimates remain accurate and relevant.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              As a best practice, consider recalculating at least once a month or whenever you make significant changes to your mining operations.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results to make informed decisions about your mining operations. If the ROI is favorable, consider scaling up your operations or reinvesting profits into more efficient hardware. If the ROI is unfavorable, explore ways to optimize your setup or reduce costs.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For additional financial planning tools, check out our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              While this calculator provides a straightforward method for estimating ROI, alternative approaches include more complex financial models or consulting with financial advisors. These alternatives can offer deeper insights but may require more detailed data and analysis.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Consider using alternatives if you require a more comprehensive analysis or are dealing with large-scale mining operations.
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
                Federal Reserve - Economic Research
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on economic indicators and financial stability, providing insights into market trends.
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
                Comprehensive consumer protection information and educational resources on financial management.
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
                Information on banking regulations and deposit insurance, crucial for financial planning.
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
                Official tax guidelines and deduction information, essential for compliance and financial planning.
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
                Detailed financial education and investment concepts explained for better financial literacy.
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
                Personal finance guides and comparison tools for consumers, aiding in financial decision-making.
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
      title="GPU/ASIC Mining ROI Calculator"
      description="Calculate ROI for mining hardware. Estimate how long it takes to pay off GPUs or ASICs based on current profitability."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding GPU/ASIC Mining ROI Calculator" },
        { id: "formula", label: "GPU/ASIC Mining ROI Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "ROI Days = Hardware Cost / (Daily Profit - Electricity Cost)",
        variables: [
          { symbol: "Hardware Cost", description: "Initial investment in mining hardware" },
          { symbol: "Daily Profit", description: "Earnings from mining per day" },
          { symbol: "Electricity Cost", description: "Daily cost of electricity used by mining hardware" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a mining setup with a hardware cost of $3000, daily profit of $15, and electricity cost of $5.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Net Daily Profit = $15 - $5 = $10", 
            explanation: "Calculate the net profit after electricity costs." 
          },
          { 
            label: "Step 2", 
            calculation: "ROI Days = $3000 / $10 = 300", 
            explanation: "Determine the number of days to break even." 
          },
          { 
            label: "Step 3", 
            calculation: "Monthly Profit = $10 × 30 = $300", 
            explanation: "Calculate the monthly profit." 
          }
        ],
        result: "The final result is 300 days to ROI, with a monthly profit of $300, meaning it will take approximately 10 months to recoup your investment."
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "💵" },
        { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
        { title: "Extra Payments & Payoff Time Calculator", url: "/financial/extra-payments-payoff", icon: "📊" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "📈" },
        { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "💰" },
        { title: "HELOC Payment Estimator", url: "/financial/heloc-payment-estimator", icon: "🏦" }
      ]}
    />
  );
}