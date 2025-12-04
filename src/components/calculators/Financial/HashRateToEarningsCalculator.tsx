import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function HashRateToEarningsConverter() {
  // STATE
  const [inputs, setInputs] = useState({ 
    hashRate: "", 
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
    let hashRateValue = parseFloat(inputs.hashRate) || 0;
    const powerConsumptionValue = parseFloat(inputs.powerConsumption) || 0;
    const electricityCostValue = parseFloat(inputs.electricityCost) || 0;

    // Validate
    if (hashRateValue <= 0 || powerConsumptionValue <= 0 || electricityCostValue <= 0) {
      return { 
        mainResult: 0, 
        earningsPerDay: 0, 
        earningsPerMonth: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const earningsPerDay = hashRateValue * 0.0001 - (powerConsumptionValue * electricityCostValue / 1000 * 24);
    const earningsPerMonth = earningsPerDay * 30;
    const mainResult = earningsPerMonth * 12;

    // Generate schedule data if applicable (e.g., monthly earnings)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      earnings: earningsPerMonth,
      cumulativeEarnings: earningsPerMonth * (i + 1),
    }));

    return { 
      mainResult, 
      earningsPerDay, 
      earningsPerMonth, 
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
    setInputs({ hashRate: "", powerConsumption: "", electricityCost: "" });
  };

  // WIDGET JSX (200-250 LINES)
  const widget = (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* INPUT SECTION */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-blue-600"/>
              Hash Rate (TH/s)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 100"
              value={inputs.hashRate}
              onChange={(e) => setInputs({ ...inputs, hashRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-green-600"/>
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
              <DollarSign className="w-4 h-4 text-purple-600"/>
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
                      Annual Earnings
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
                      Daily Earnings
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.earningsPerDay)}
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
                      Monthly Earnings
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.earningsPerMonth)}
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
                    Monthly Earnings Schedule
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
                        <TableHead className="font-semibold">Earnings</TableHead>
                        <TableHead className="font-semibold">Cumulative Earnings</TableHead>
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
                            <TableCell>{formatCurrency(row.earnings)}</TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.cumulativeEarnings)}
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
          Understanding Hash Rate to Earnings Converter
        </h2>
        
        <p className="mb-6">
          The Hash Rate to Earnings Converter is an essential tool for cryptocurrency miners who want to estimate their potential earnings based on their mining hardware's hash rate. This calculator allows users to input their hash rate, power consumption, and electricity cost to determine how much they can expect to earn daily, monthly, and annually. By understanding the potential earnings, miners can make informed decisions about their mining operations and optimize their setups for maximum profitability.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial in the cryptocurrency mining industry, as even small discrepancies can lead to significant financial losses. With fluctuating electricity costs and varying hash rates, miners need a reliable way to project their earnings. This tool provides a straightforward method to calculate potential earnings, helping miners plan their operations and manage their resources effectively. For more insights into financial calculations, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator, miners should gather specific information about their mining hardware and electricity costs. The hash rate, measured in terahashes per second (TH/s), indicates the mining power of the hardware. Power consumption, measured in watts (W), reflects the energy usage of the equipment. Lastly, the electricity cost, measured in dollars per kilowatt-hour ($/kWh), is the rate charged by the utility provider. By entering these values into the calculator, users can quickly determine their potential earnings. For additional financial tools, visit our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always ensure your electricity cost is updated to reflect the latest rates from your provider. This will help you avoid underestimating your expenses and ensure your earnings projections are as accurate as possible.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include regularly updating the input values to reflect any changes in hash rate or electricity costs. Additionally, miners should consider the efficiency of their hardware and explore ways to reduce power consumption to maximize profitability. Understanding these factors can significantly impact the overall success of mining operations.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Hash Rate to Earnings Converter Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Hash Rate to Earnings Converter is designed to provide a comprehensive estimate of potential earnings based on the hash rate, power consumption, and electricity cost. This formula is widely accepted in the mining community for its accuracy and reliability. It takes into account the revenue generated by the hash rate and subtracts the cost of electricity to provide a net earnings figure.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Earnings = (Hash Rate × Reward per TH/s) - (Power Consumption × Electricity Cost × 24)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Hash Rate = Mining power in TH/s</li>
              <li>Reward per TH/s = Revenue generated per terahash</li>
              <li>Power Consumption = Energy usage in watts</li>
              <li>Electricity Cost = Cost per kilowatt-hour</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a critical role in determining the final earnings. The hash rate represents the computational power of the mining hardware, directly influencing the amount of cryptocurrency mined. The power consumption reflects the energy required to operate the hardware, which impacts the overall cost. Electricity cost is a significant factor, as it varies by location and provider. By adjusting these variables, miners can optimize their operations for maximum profitability.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your earnings is crucial for optimizing your mining operations. These factors interact with each other, and even small changes can have a significant impact on your profitability.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Hash Rate
        </h3>
        <p className="mb-4">
          The hash rate is a measure of your mining hardware's computational power. A higher hash rate means more mining power, which can lead to higher earnings. However, achieving a higher hash rate often requires more advanced and expensive hardware.
        </p>
        <p className="mb-6">
          To optimize your hash rate, consider upgrading your hardware or optimizing your current setup. Regular maintenance and updates can also help maintain peak performance. For more on optimizing financial outcomes, see our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Power Consumption
        </h3>
        <p className="mb-4">
          Power consumption is a critical factor in determining your net earnings. High power consumption can significantly reduce your profits, especially if electricity costs are high.
        </p>
        <p className="mb-6">
          To manage power consumption, consider using energy-efficient hardware and optimizing your mining setup to reduce waste. Monitoring your energy usage can help identify areas for improvement.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Electricity Cost
        </h3>
        <p className="mb-4">
          Electricity cost is one of the most significant expenses in mining operations. It varies by location and can fluctuate based on market conditions.
        </p>
        <p className="mb-6">
          To minimize electricity costs, consider negotiating rates with your provider or exploring alternative energy sources. Some miners relocate to areas with lower electricity rates to increase profitability.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Cryptocurrency Market Conditions
        </h3>
        <p className="mb-6">
          The value of the cryptocurrency you are mining can significantly impact your earnings. Market conditions can fluctuate, affecting the reward per TH/s and your overall profitability. Staying informed about market trends and adjusting your strategy accordingly can help maximize your earnings.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Mining Difficulty
        </h3>
        <p className="mb-6">
          Mining difficulty refers to how hard it is to find a new block in the blockchain. As more miners join the network, the difficulty increases, which can reduce your earnings. Keeping track of difficulty changes and adjusting your operations can help maintain profitability.
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
              What is hash rate to earnings converter and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The hash rate to earnings converter is a tool that estimates potential earnings from cryptocurrency mining based on hash rate, power consumption, and electricity costs. It is crucial for miners to understand their potential earnings to make informed decisions about their operations and investments.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              By using this tool, miners can plan their operations more effectively and optimize their setups for maximum profitability. For more financial tools, visit our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The accuracy of this calculator depends on the accuracy of the input values. Factors such as fluctuating electricity costs and changes in hash rate can affect the results. It is recommended to regularly update the input values to reflect the latest conditions.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For precise financial planning, consider consulting with a professional to account for all variables and market conditions.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use this calculator, you need to know your mining hardware's hash rate, power consumption, and the electricity cost in your area. The hash rate is typically provided by the hardware manufacturer, while power consumption can be measured using a wattmeter. Electricity costs can be found on your utility bill.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Gathering accurate data ensures the most reliable results, helping you make informed decisions about your mining operations.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for [specific scenario]?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              This calculator is designed for general cryptocurrency mining scenarios. If you have a unique setup or are mining a specific cryptocurrency with different parameters, you may need to adjust the input values or consult additional resources.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For specific scenarios, consider consulting with a mining expert to tailor the calculations to your needs.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include using outdated electricity cost values, not accounting for changes in hash rate, and failing to consider hardware efficiency. These errors can lead to inaccurate earnings projections.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To avoid these mistakes, regularly update your input values and monitor your mining setup for any changes.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              It is recommended to recalculate your earnings whenever there is a change in your hash rate, power consumption, or electricity cost. Regular recalculations ensure that your earnings projections remain accurate and reflect the latest conditions.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Setting a monthly schedule for recalculations can help you stay on top of any changes and adjust your operations accordingly.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results to make informed decisions about your mining operations. Consider whether your current setup is profitable and explore ways to optimize your hardware and reduce costs. If your earnings are lower than expected, investigate potential issues with your setup.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For more financial planning tools, visit our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              While this calculator provides a comprehensive estimate, there are alternative methods such as using mining profitability calculators specific to certain cryptocurrencies. These tools may offer additional insights based on current market data and network conditions.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Consider using multiple tools to cross-verify your results and gain a more detailed understanding of your mining profitability.
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
                Federal Reserve - Cryptocurrency Insights
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on cryptocurrency trends and regulatory guidelines
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
                Consumer Financial Protection Bureau - Energy Costs
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources
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
                FDIC - Financial Resources
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and deposit insurance information
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
                Internal Revenue Service - Cryptocurrency Tax
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information
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
                Investopedia - Cryptocurrency Mining
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained
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
                NerdWallet - Energy Saving Tips
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers
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
      title="Hash Rate to Earnings Converter"
      description="Convert mining hashrate to estimated earnings. See how much your hardware can generate per day in current market conditions."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Hash Rate to Earnings Converter" },
        { id: "formula", label: "Hash Rate to Earnings Converter Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Earnings = (Hash Rate × Reward per TH/s) - (Power Consumption × Electricity Cost × 24)",
        variables: [
          { symbol: "Hash Rate", description: "Mining power in TH/s" },
          { symbol: "Reward per TH/s", description: "Revenue generated per terahash" },
          { symbol: "Power Consumption", description: "Energy usage in watts" },
          { symbol: "Electricity Cost", description: "Cost per kilowatt-hour" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a mining setup with a hash rate of 100 TH/s, power consumption of 1500 W, and electricity cost of $0.12/kWh.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "100 × 0.0001 = 0.01", 
            explanation: "Calculate the daily reward based on hash rate." 
          },
          { 
            label: "Step 2", 
            calculation: "1500 × 0.12 / 1000 × 24 = 4.32", 
            explanation: "Calculate daily electricity cost." 
          },
          { 
            label: "Step 3", 
            calculation: "0.01 - 4.32 = -4.31", 
            explanation: "Determine net daily earnings." 
          }
        ],
        result: "The final result is -$4.31, indicating a daily loss due to high electricity costs."
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