import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ElectricityCostVsMiningRevenueCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    electricityCost: "", 
    miningRevenue: "", 
    operationalDays: "" 
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

  const faqs = [
    {
      question: "What is electricity cost vs mining revenue and why is it important?",
      answer: "Electricity cost vs mining revenue is a comparison of the expenses incurred from electricity consumption against the income generated from mining activities. This metric is crucial for determining the profitability of a mining operation. By understanding this balance, miners can make informed decisions about scaling operations, investing in new equipment, or adjusting their strategies to maximize profits. For more insights into managing financial aspects of mining, explore our <a href=\"/financial/interest-only-loan\">Interest-Only Loan Calculator</a>."
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator provides a high level of accuracy by using industry-standard formulas and allowing for customizable inputs. However, the accuracy depends on the precision of the data entered, such as electricity rates and mining revenue estimates. External factors like market volatility and unexpected equipment downtime can also affect results. For critical financial decisions, consider consulting with a financial advisor to complement the insights gained from this tool."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use this calculator, you need to know your daily electricity cost, which can be obtained from your utility bill. You also need an estimate of your daily mining revenue, which can be calculated based on your mining hardware's performance and the current market value of the cryptocurrency you're mining. Lastly, determine the number of operational days you plan to run your mining setup. Accurate data input is crucial for reliable results. Consider using historical data to refine your estimates."
    },
    {
      question: "Can I use this calculator for specific scenarios?",
      answer: "This calculator is versatile and can be used for various scenarios, including different types of mining operations and varying electricity rates. However, it may not account for all unique factors in specialized setups, such as renewable energy sources or fluctuating market conditions. For these cases, additional adjustments or professional advice may be necessary. For tailored financial planning, consider consulting with experts who understand the nuances of your specific situation."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include using outdated electricity rates, overestimating mining revenue, and neglecting to account for downtime or maintenance. These errors can lead to inaccurate profitability assessments. It's important to regularly update your inputs and consider all operational costs to ensure reliable results. For more guidance on avoiding financial pitfalls, explore our <a href=\"/financial/refinance-savings\">Refinance Savings Calculator</a>."
    },
    {
      question: "How often should I recalculate?",
      answer: "Recalculation should occur whenever there are significant changes in electricity rates, mining revenue, or operational conditions. Regular updates ensure that your profitability assessments remain accurate. A monthly review is recommended, but more frequent checks may be necessary in volatile markets. Establishing a routine for reviewing your financial metrics can help you stay on top of your mining operation's performance."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results to make informed decisions about scaling your mining operations, investing in new equipment, or adjusting your strategies. If the results indicate low profitability, consider optimizing your setup or exploring alternative energy sources. For comprehensive financial planning, consult with a financial advisor. For more tools to enhance your financial strategy, visit our <a href=\"/financial/heloc-payment-estimator\">HELOC Payment Estimator</a>."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Alternatives include using specialized software that accounts for more variables, such as hardware depreciation and market trends. These tools can provide a more comprehensive analysis but may require more detailed data input and technical expertise. Consider the complexity of your operation and the level of detail you need when choosing the right tool for your financial assessments."
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    const electricityCostValue = parseFloat(inputs.electricityCost) || 0;
    const miningRevenueValue = parseFloat(inputs.miningRevenue) || 0;
    const operationalDaysValue = parseFloat(inputs.operationalDays) || 0;

    // Validate
    if (electricityCostValue <= 0 || miningRevenueValue <= 0 || operationalDaysValue <= 0) {
      return { 
        mainResult: 0, 
        netProfit: 0, 
        costPerDay: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const totalElectricityCost = electricityCostValue * operationalDaysValue;
    const totalMiningRevenue = miningRevenueValue * operationalDaysValue;
    const netProfit = totalMiningRevenue - totalElectricityCost;
    const costPerDay = totalElectricityCost / operationalDaysValue;

    // Generate schedule data if applicable (e.g., daily breakdown)
    const scheduleData = Array.from({ length: operationalDaysValue }, (_, i) => ({
      day: i + 1,
      dailyCost: electricityCostValue,
      dailyRevenue: miningRevenueValue,
      dailyNet: miningRevenueValue - electricityCostValue,
      cumulativeNet: (miningRevenueValue - electricityCostValue) * (i + 1)
    }));

    return { 
      mainResult: netProfit, 
      netProfit, 
      costPerDay, 
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
    setInputs({ electricityCost: "", miningRevenue: "", operationalDays: "" });
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
              Electricity Cost per Day ($)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50"
              value={inputs.electricityCost}
              onChange={(e) => setInputs({ ...inputs, electricityCost: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Mining Revenue per Day ($)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 100"
              value={inputs.miningRevenue}
              onChange={(e) => setInputs({ ...inputs, miningRevenue: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Operational Days
            </Label>
            <Input
              type="number"
              placeholder="e.g., 30"
              value={inputs.operationalDays}
              onChange={(e) => setInputs({ ...inputs, operationalDays: e.target.value })}
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
                      Net Profit
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.netProfit)}
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
                      Total Electricity Cost
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.costPerDay * parseFloat(inputs.operationalDays))}
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
                      Cost Per Day
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.costPerDay)}
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
                    Daily Financial Breakdown
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
                        : `Show All ${results.scheduleData.length} Days`}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900">
                        <TableHead className="font-semibold">Day</TableHead>
                        <TableHead className="font-semibold">Daily Cost</TableHead>
                        <TableHead className="font-semibold">Daily Revenue</TableHead>
                        <TableHead className="font-semibold">Daily Net</TableHead>
                        <TableHead className="font-semibold">Cumulative Net</TableHead>
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
                            <TableCell className="font-medium">{row.day}</TableCell>
                            <TableCell>{formatCurrency(row.dailyCost)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.dailyRevenue)}
                            </TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.dailyNet)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.cumulativeNet)}
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
          Understanding Electricity Cost vs Mining Revenue
        </h2>
        
        <p className="mb-6">
          In the world of cryptocurrency mining, understanding the balance between electricity costs and mining revenue is crucial for maintaining profitability. This calculator is designed to help miners evaluate their operations by comparing the daily costs of electricity against the revenue generated from mining activities. Whether you're a hobbyist miner or managing a large-scale operation, this tool provides valuable insights into your financial performance.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital in this domain as they directly impact your bottom line. With fluctuating electricity rates and variable mining outputs, having a reliable method to assess your profitability is essential. This calculator uses industry-standard formulas to ensure you get precise results, helping you make informed decisions about your mining activities. For more insights into financial calculations, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information on your daily electricity costs, expected mining revenue, and the number of operational days. Enter these values into the respective fields to calculate your net profit. This tool also provides a detailed daily breakdown of costs and revenues, allowing you to analyze your financial performance over time. For additional resources, visit our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Ensure you regularly update your electricity rates and mining revenue estimates to maintain accuracy. Market conditions can change rapidly, affecting both costs and profits. Staying informed and adaptable is key to successful mining operations.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices include monitoring your electricity usage closely and optimizing your mining setup for efficiency. Consider factors such as hardware performance, cooling requirements, and local electricity tariffs. By understanding these elements, you can maximize your profitability and reduce unnecessary expenses.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Electricity Cost vs Mining Revenue Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this calculator is designed to provide a clear picture of your mining operation's financial health. It calculates the net profit by subtracting the total electricity cost from the total mining revenue over a specified period. This straightforward approach allows you to quickly assess whether your mining activities are profitable.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Net Profit = (Mining Revenue per Day × Operational Days) - (Electricity Cost per Day × Operational Days)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Mining Revenue per Day = Expected earnings from mining each day</li>
              <li>Electricity Cost per Day = Cost of electricity consumed each day</li>
              <li>Operational Days = Total number of days the mining operation runs</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a critical role in determining your net profit. The Mining Revenue per Day is influenced by factors such as the cryptocurrency's market value and your mining hardware's efficiency. Electricity Cost per Day depends on your local electricity rates and the power consumption of your mining equipment. Operational Days should reflect the actual time your setup is running, accounting for any downtime due to maintenance or other issues.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your mining operation's profitability is essential for optimizing performance. These factors interact with each other, and changes in one can significantly impact your overall results.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Electricity Rates
        </h3>
        <p className="mb-4">
          Electricity rates are a major cost driver in mining operations. High rates can quickly erode profits, making it crucial to secure the best possible rates. Consider negotiating with your provider or exploring alternative energy sources like solar power.
        </p>
        <p className="mb-6">
          Monitoring rate fluctuations and adjusting your operation accordingly can help maintain profitability. For more strategies on managing costs, see our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Mining Hardware Efficiency
        </h3>
        <p className="mb-4">
          The efficiency of your mining hardware directly affects your revenue. More efficient hardware can generate more cryptocurrency for the same amount of electricity, improving your profit margins.
        </p>
        <p className="mb-6">
          Regularly upgrading your hardware and optimizing settings can enhance performance. Consider the long-term benefits of investing in newer, more efficient equipment.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Cryptocurrency Market Value
        </h3>
        <p className="mb-4">
          The market value of the cryptocurrency you're mining significantly impacts your revenue. Prices can be volatile, so staying informed and ready to adapt your strategy is crucial.
        </p>
        <p className="mb-6">
          Diversifying your mining portfolio and hedging against market fluctuations can mitigate risks. Keep an eye on market trends and adjust your operations as needed.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Operational Efficiency
        </h3>
        <p className="mb-6">
          Efficient operations minimize downtime and maximize output. Regular maintenance, effective cooling systems, and strategic scheduling can enhance your setup's efficiency. Ensure your operation runs smoothly to avoid unnecessary losses.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Regulatory Environment
        </h3>
        <p className="mb-6">
          Regulations can affect mining operations, from environmental laws to financial regulations. Staying compliant is essential to avoid fines and disruptions. Keep abreast of changes in the regulatory landscape and adjust your operations accordingly.
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
                className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3"
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
                href="https://www.eia.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                U.S. Energy Information Administration
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive data on electricity rates and energy consumption trends.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.coinmarketcap.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                CoinMarketCap
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Real-time cryptocurrency market data and historical price charts.
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
                Blockchain.com
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Explore blockchain data and cryptocurrency transaction insights.
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
                U.S. Department of Energy
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Information on energy policies, regulations, and innovations.
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
                CryptoCompare
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Cryptocurrency comparison and market analysis tools.
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
                Investopedia - Cryptocurrency
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Educational resources on cryptocurrency and blockchain technology.
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
      title="Electricity Cost vs Mining Revenue"
      description="Compare electricity costs against mining revenue. Ensure your mining operation remains profitable with this cost analysis tool."
      jsonLd={faqJsonLd}
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Electricity Cost vs Mining Revenue" },
        { id: "formula", label: "Electricity Cost vs Mining Revenue Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Net Profit = (Mining Revenue per Day × Operational Days) - (Electricity Cost per Day × Operational Days)",
        variables: [
          { symbol: "Mining Revenue per Day", description: "Expected earnings from mining each day" },
          { symbol: "Electricity Cost per Day", description: "Cost of electricity consumed each day" },
          { symbol: "Operational Days", description: "Total number of days the mining operation runs" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a mining operation running for 30 days, with a daily electricity cost of $50 and a daily mining revenue of $100.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "100 × 30 = 3000", 
            explanation: "Calculate total mining revenue over 30 days." 
          },
          { 
            label: "Step 2", 
            calculation: "50 × 30 = 1500", 
            explanation: "Calculate total electricity cost over 30 days." 
          },
          { 
            label: "Step 3", 
            calculation: "3000 - 1500 = 1500", 
            explanation: "Subtract total electricity cost from total mining revenue to find net profit." 
          }
        ],
        result: "The final result is $1,500, meaning your operation is profitable over the 30-day period."
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "💵" },
        { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
        { title: "Extra Payments & Payoff Time Calculator", url: "/financial/extra-payments-payoff", icon: "📈" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "💳" },
        { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "💰" },
        { title: "HELOC Payment Estimator", url: "/financial/heloc-payment-estimator", icon: "🏦" }
      ]}
    />
  );
}