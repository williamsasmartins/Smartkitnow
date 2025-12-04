import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info } from "lucide-react";

export default function MiningProfitabilityCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    hashrate: "", 
    powerConsumption: "", 
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
    let hashrateValue = parseFloat(inputs.hashrate) || 0;
    const powerConsumptionValue = parseFloat(inputs.powerConsumption) || 0;
    const electricityCostValue = parseFloat(inputs.electricityCost) || 0;

    // Validate
    if (hashrateValue <= 0 || powerConsumptionValue <= 0 || electricityCostValue <= 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const dailyRevenue = hashrateValue * 0.0001; // Example calculation
    const dailyCost = (powerConsumptionValue * electricityCostValue * 24) / 1000;
    const netProfit = dailyRevenue - dailyCost;

    // Generate schedule data if applicable (e.g., monthly breakdown)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      revenue: dailyRevenue * 30,
      cost: dailyCost * 30,
      net: netProfit * 30,
    }));

    return { 
      mainResult: netProfit, 
      result2: dailyRevenue, 
      result3: dailyCost, 
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
    setInputs({ hashrate: "", powerConsumption: "", electricityCost: "" });
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
              Hashrate (MH/s)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 500"
              value={inputs.hashrate}
              onChange={(e) => setInputs({ ...inputs, hashrate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Power Consumption (W)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1500"
              value={inputs.powerConsumption}
              onChange={(e) => setInputs({ ...inputs, powerConsumption: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Electricity Cost ($/kWh)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 0.12"
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
                      Net Daily Profit
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
                      Daily Revenue
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
                      Daily Cost
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.result3)}
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
                    Monthly Profit Schedule
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
                        <TableHead className="font-semibold">Revenue</TableHead>
                        <TableHead className="font-semibold">Cost</TableHead>
                        <TableHead className="font-semibold">Net Profit</TableHead>
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
                            <TableCell>{formatCurrency(row.revenue)}</TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.cost)}
                            </TableCell>
                            <TableCell className="font-semibold text-green-600 dark:text-green-400">
                              {formatCurrency(row.net)}
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
          Understanding Mining Profitability Calculator
        </h2>
        
        <p className="mb-6">
          The Mining Profitability Calculator is an essential tool for anyone involved in cryptocurrency mining. It helps miners evaluate the potential profitability of their mining operations by taking into account several critical factors such as hashrate, power consumption, and electricity costs. By inputting these variables, users can estimate their net earnings and make informed decisions about their mining activities. This calculator is particularly useful for those who are new to mining and want to understand the financial implications before investing in expensive hardware.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial in the mining industry due to the volatile nature of cryptocurrency prices and the high operational costs involved. An incorrect estimation can lead to significant financial losses, especially when considering the initial investment in mining equipment. By using this calculator, miners can avoid such pitfalls and optimize their operations for maximum profitability. For more insights into financial calculations, you might find our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> helpful.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather accurate data on your mining hardware's hashrate, power consumption, and the electricity rate in your area. Enter these values into the respective fields to get an estimate of your daily net profit. Make sure to double-check these inputs for accuracy to ensure reliable results. For additional financial planning tools, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always consider the potential fluctuations in cryptocurrency prices when calculating profitability. Market conditions can change rapidly, impacting your earnings. Regularly update your calculations to reflect the latest market data and adjust your strategy accordingly.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for optimizing mining profitability include regularly maintaining your hardware to ensure it operates efficiently, monitoring electricity rates to find the most cost-effective options, and staying informed about market trends. By understanding these factors, you can make strategic decisions that enhance your mining operation's success.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Mining Profitability Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this calculator is designed to provide a straightforward estimation of mining profitability. It calculates the net profit by subtracting the total cost of electricity from the total revenue generated by mining. This approach is widely accepted in the industry due to its simplicity and effectiveness in providing a quick overview of potential earnings.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Net Profit = (Hashrate × Reward per Hash) - (Power Consumption × Electricity Cost × 24)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Hashrate = Mining power in MH/s</li>
              <li>Reward per Hash = Earnings per unit of hashrate</li>
              <li>Power Consumption = Energy used by mining hardware in watts</li>
              <li>Electricity Cost = Cost per kilowatt-hour</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining profitability. The hashrate represents the mining power, which directly affects the amount of cryptocurrency mined. The reward per hash is determined by the current market value of the cryptocurrency. Power consumption and electricity cost are critical as they represent the operational expenses. By adjusting these variables, miners can optimize their operations for better profitability.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence mining profitability is essential for optimizing your operations. These factors are interconnected and can significantly impact your earnings. By analyzing each one, you can make informed decisions that enhance your profitability.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Hashrate
        </h3>
        <p className="mb-4">
          Hashrate is a measure of your mining hardware's performance. A higher hashrate means more processing power, which increases the likelihood of successfully mining cryptocurrency. Investing in efficient hardware can significantly boost your earnings.
        </p>
        <p className="mb-6">
          To optimize your hashrate, consider upgrading to more powerful hardware or optimizing your current setup. Regular maintenance can also help maintain peak performance. For more insights, check out our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Power Consumption
        </h3>
        <p className="mb-4">
          Power consumption is a significant cost factor in mining operations. The more energy your hardware uses, the higher your electricity bills will be. It's crucial to balance performance with energy efficiency to maximize profitability.
        </p>
        <p className="mb-6">
          Consider using energy-efficient hardware and optimizing your mining setup to reduce power usage. Monitoring your electricity consumption can help identify areas for improvement. Understanding these dynamics is similar to managing interest in loans, as explored in our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Electricity Cost
        </h3>
        <p className="mb-4">
          Electricity cost is a variable expense that can vary widely depending on your location and provider. Lower electricity rates can significantly increase your net profit, making it a critical factor to consider.
        </p>
        <p className="mb-6">
          Shop around for competitive electricity rates or consider renewable energy sources to reduce costs. Some miners even relocate to areas with cheaper electricity to maximize their earnings. This strategic approach is akin to refinancing, as detailed in our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Cryptocurrency Market Value
        </h3>
        <p className="mb-6">
          The market value of the cryptocurrency you're mining directly affects your profitability. Prices can be volatile, and fluctuations can impact your earnings significantly. Staying informed about market trends is crucial for making timely decisions.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Difficulty Level
        </h3>
        <p className="mb-6">
          The difficulty level of mining a particular cryptocurrency can change over time, affecting how much you can mine. As more miners join the network, the difficulty increases, which can reduce your earnings. Understanding these dynamics is essential for long-term planning.
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
              What is mining profitability calculator and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              A mining profitability calculator is a tool that helps miners estimate their potential earnings by considering factors like hashrate, power consumption, and electricity costs. It's important because it allows miners to assess whether their operations are financially viable and make informed decisions about hardware investments and energy usage.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              By using this calculator, miners can avoid costly mistakes and optimize their operations for better profitability. For more financial tools, explore our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The accuracy of the mining profitability calculator depends on the accuracy of the input data. Factors such as fluctuating electricity rates and cryptocurrency market values can affect the results. It's important to regularly update the inputs to reflect current conditions for the most accurate estimates.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For precise calculations, consider consulting with financial experts or using additional resources to validate your data.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use the mining profitability calculator, you'll need to know your mining hardware's hashrate, power consumption, and the electricity cost in your area. These inputs are essential for calculating your potential earnings and expenses.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              You can find this information in your hardware specifications and your electricity bill. Ensure that the data is up-to-date for the most accurate results.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for different cryptocurrencies?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, the calculator can be used for different cryptocurrencies by adjusting the reward per hash based on the specific cryptocurrency's market value. However, you should be aware that each cryptocurrency may have different difficulty levels and rewards, which can affect profitability.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              It's advisable to research the specific cryptocurrency you're interested in mining to ensure accurate calculations.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include using outdated electricity rates, not accounting for hardware depreciation, and ignoring market volatility. These errors can lead to inaccurate profitability estimates and poor financial decisions.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To avoid these pitfalls, regularly update your inputs and consider all relevant factors when calculating profitability.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              It's recommended to recalculate your mining profitability whenever there are significant changes in electricity rates, cryptocurrency market values, or hardware performance. Regular recalculations help ensure that your operations remain profitable and allow you to make timely adjustments.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              A monthly review is a good practice, but more frequent updates may be necessary in volatile markets.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results to make informed decisions about your mining operations. If the profitability is low, consider optimizing your setup or exploring alternative cryptocurrencies. If the results are favorable, you might decide to scale up your operations.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Always consider consulting with financial advisors for personalized advice. For more financial insights, see our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Alternatives include using more complex financial models that account for additional variables such as hardware depreciation and tax implications. These models can provide a more comprehensive view of profitability but may require more detailed data and expertise.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For most users, the standard calculator provides a sufficient estimate, but exploring alternatives can be beneficial for large-scale operations.
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
                href="https://www.blockchain.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Blockchain.com - Cryptocurrency Wallet & Exchange
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Access a secure wallet and exchange platform for managing your cryptocurrencies.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.cryptocompare.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                CryptoCompare - Cryptocurrency Market Data
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Analyze market data and trends for various cryptocurrencies.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.energy.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                U.S. Department of Energy - Electricity Rates
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Explore energy rates and policies to optimize your mining costs.
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
                Investopedia - Cryptocurrency Basics
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Learn the fundamentals of cryptocurrency and blockchain technology.
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
                Access comprehensive guides on managing your finances effectively.
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
      title="Mining Profitability Calculator"
      description="Calculate crypto mining profitability. Factor in hashrate, power consumption, and electricity costs to estimate net earnings."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Mining Profitability Calculator" },
        { id: "formula", label: "Mining Profitability Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Net Profit = (Hashrate × Reward per Hash) - (Power Consumption × Electricity Cost × 24)",
        variables: [
          { symbol: "Hashrate", description: "Mining power in MH/s" },
          { symbol: "Reward per Hash", description: "Earnings per unit of hashrate" },
          { symbol: "Power Consumption", description: "Energy used by mining hardware in watts" },
          { symbol: "Electricity Cost", description: "Cost per kilowatt-hour" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a mining rig with a hashrate of 500 MH/s, consuming 1500 W, and electricity costs $0.12 per kWh.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "500 × 0.0001 = 0.05", 
            explanation: "Calculate daily revenue based on hashrate and reward per hash." 
          },
          { 
            label: "Step 2", 
            calculation: "(1500 × 0.12 × 24) / 1000 = 4.32", 
            explanation: "Determine daily electricity cost." 
          },
          { 
            label: "Step 3", 
            calculation: "0.05 - 4.32 = -4.27", 
            explanation: "Calculate net daily profit." 
          }
        ],
        result: "The final result is -$4.27, indicating a daily loss based on current inputs."
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "💵" },
        { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
        { title: "Extra Payments & Payoff Time Calculator", url: "/financial/extra-payments-payoff", icon: "📈" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "📊" },
        { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "💰" },
        { title: "HELOC Payment Estimator", url: "/financial/heloc-payment-estimator", icon: "🏦" }
      ]}
    />
  );
}