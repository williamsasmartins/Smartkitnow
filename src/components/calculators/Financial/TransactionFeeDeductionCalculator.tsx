import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function TransactionFeeDeductionCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    transactionAmount: "", 
    gasFee: "", 
    exchangeFee: "" 
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
    let transactionAmountValue = parseFloat(inputs.transactionAmount) || 0;
    const gasFeeValue = parseFloat(inputs.gasFee) || 0;
    const exchangeFeeValue = parseFloat(inputs.exchangeFee) || 0;

    // Validate
    if (transactionAmountValue <= 0 || gasFeeValue < 0 || exchangeFeeValue < 0) {
      return { 
        mainResult: 0, 
        totalFees: 0, 
        netAmount: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const totalFees = gasFeeValue + exchangeFeeValue;
    const netAmount = transactionAmountValue - totalFees;
    const mainResult = netAmount;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      fee: totalFees / 12,
      gas: (gasFeeValue / 12),
      exchange: (exchangeFeeValue / 12),
      balance: netAmount - ((totalFees / 12) * (i + 1))
    }));

    return { 
      mainResult, 
      totalFees, 
      netAmount, 
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
    setInputs({ transactionAmount: "", gasFee: "", exchangeFee: "" });
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
              Transaction Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5000"
              value={inputs.transactionAmount}
              onChange={(e) => setInputs({ ...inputs, transactionAmount: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Gas Fee
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50"
              value={inputs.gasFee}
              onChange={(e) => setInputs({ ...inputs, gasFee: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Exchange Fee
            </Label>
            <Input
              type="number"
              placeholder="e.g., 25"
              value={inputs.exchangeFee}
              onChange={(e) => setInputs({ ...inputs, exchangeFee: e.target.value })}
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
                      Net Amount After Fees
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
                      Total Fees
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalFees)}
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
                      Initial Transaction Amount
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(parseFloat(inputs.transactionAmount) || 0)}
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
                    Fee Distribution Schedule
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
                        <TableHead className="font-semibold">Total Fee</TableHead>
                        <TableHead className="font-semibold">Gas Fee</TableHead>
                        <TableHead className="font-semibold">Exchange Fee</TableHead>
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
                            <TableCell>{formatCurrency(row.fee)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.gas)}
                            </TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.exchange)}
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
          Understanding Transaction Fee Deduction Tool
        </h2>
        
        <p className="mb-6">
          The Transaction Fee Deduction Tool is designed to help individuals and businesses accurately calculate the fees associated with financial transactions. Whether you're dealing with cryptocurrency exchanges, stock trades, or other financial operations, understanding the fees involved is crucial for accurate financial reporting and tax deductions. This tool allows users to input transaction amounts along with associated fees such as gas and exchange fees, providing a clear picture of the net amount after deductions. This is particularly useful for traders and investors who need to report their net gains or losses for tax purposes.
        </p>
        
        <p className="mb-6">
          Accurate calculation of transaction fees is essential to avoid overpaying taxes or misreporting financial gains. Incorrect calculations can lead to significant financial implications, including penalties or audits from tax authorities. By using this tool, users can ensure that they are accounting for all relevant fees, which can vary widely depending on the type of transaction and the platforms used. For example, cryptocurrency transactions often involve gas fees that can fluctuate based on network demand. This tool helps users make informed decisions by providing a detailed breakdown of fees and net amounts.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather all necessary information before starting. You'll need the total transaction amount and any fees associated with the transaction, such as gas fees for blockchain transactions or exchange fees for trading platforms. Enter these values into the calculator to see a detailed breakdown of fees and the net amount. This step-by-step approach ensures that you capture all relevant costs, providing a comprehensive view of your financial transactions. For more detailed financial planning, consider using our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check the fees associated with your transactions. Fees can vary significantly based on the platform and transaction type. Consider using multiple sources to verify fee amounts, especially for large transactions. This practice can help you avoid unexpected costs and ensure accurate financial reporting.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this tool include regularly updating your fee data and staying informed about changes in fee structures on the platforms you use. Be aware of any promotional rates or changes in fee policies that might affect your calculations. By keeping your data current, you can optimize your financial strategies and ensure compliance with tax regulations.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Transaction Fee Deduction Tool Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Transaction Fee Deduction Tool is designed to provide a clear and accurate calculation of the net amount after fees. The primary formula is: Net Amount = Transaction Amount - (Gas Fee + Exchange Fee). This formula is widely used in financial calculations to determine the actual value of a transaction after accounting for all associated costs. It is a straightforward approach that ensures all fees are deducted from the transaction amount, providing a true reflection of the net gain or loss.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Net Amount = Transaction Amount - (Gas Fee + Exchange Fee)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Transaction Amount = Total value of the transaction</li>
              <li>Gas Fee = Cost associated with processing the transaction on a blockchain</li>
              <li>Exchange Fee = Fee charged by the platform for facilitating the transaction</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the net amount. The Transaction Amount is the total value of the transaction before any deductions. The Gas Fee is specific to blockchain transactions and can vary based on network congestion and demand. The Exchange Fee is a percentage or fixed amount charged by the platform for processing the transaction. Understanding these variables helps users accurately calculate the net amount and make informed financial decisions. For example, a high gas fee during peak network usage can significantly reduce the net amount, affecting profitability.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that affect your transaction fee calculations is essential for accurate financial planning. These factors can vary widely depending on the type of transaction, the platforms used, and external market conditions. By considering these factors, you can optimize your transactions and ensure compliance with financial regulations.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Transaction Amount
        </h3>
        <p className="mb-4">
          The transaction amount is the starting point for any fee calculation. It represents the total value of the transaction before any deductions. A larger transaction amount typically results in higher fees, as many platforms charge fees as a percentage of the transaction value. For instance, a 2% fee on a $10,000 transaction would be $200, while the same percentage on a $1,000 transaction would be only $20.
        </p>
        <p className="mb-6">
          It's important to consider the transaction amount when planning your financial activities. Larger transactions may benefit from negotiated fee rates or bulk discounts. Conversely, smaller transactions might incur minimum fees that disproportionately affect the net amount. For more insights on managing large transactions, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Gas Fees
        </h3>
        <p className="mb-4">
          Gas fees are specific to blockchain transactions and represent the cost of processing transactions on the network. These fees can fluctuate significantly based on network congestion and demand. During peak times, gas fees can skyrocket, making transactions more expensive. For example, Ethereum gas fees can vary from a few dollars to over $100 depending on network activity.
        </p>
        <p className="mb-6">
          To manage gas fees effectively, consider timing your transactions during periods of lower network activity. Some platforms offer tools to estimate gas fees and suggest optimal times for transactions. Understanding gas fees can help you avoid unexpected costs and optimize your transaction strategy.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Exchange Fees
        </h3>
        <p className="mb-4">
          Exchange fees are charged by trading platforms for facilitating transactions. These fees can be a fixed amount or a percentage of the transaction value. It's important to understand the fee structure of the platform you are using, as fees can vary widely between exchanges. For example, some platforms offer tiered fee structures based on trading volume.
        </p>
        <p className="mb-6">
          To minimize exchange fees, consider using platforms that offer competitive rates or fee discounts for high-volume traders. Additionally, some platforms offer fee reductions for using their native tokens. Understanding exchange fees can help you choose the most cost-effective platform for your transactions.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Conditions
        </h3>
        <p className="mb-6">
          Market conditions can have a significant impact on transaction fees. During periods of high volatility, fees may increase as demand for transactions rises. Conversely, during stable market conditions, fees may decrease. It's important to stay informed about market trends and adjust your transaction strategy accordingly. For example, during a market rally, fees may increase as more traders enter the market, while fees may decrease during a market correction.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Regulatory Considerations
        </h3>
        <p className="mb-6">
          Regulatory considerations can also affect transaction fees. Some jurisdictions impose taxes or additional fees on certain types of transactions. It's important to understand the regulatory environment in your area and account for any additional costs. For example, some countries impose a tax on cryptocurrency transactions, which can affect the net amount. Staying informed about regulatory changes can help you avoid unexpected costs and ensure compliance with financial regulations.
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
              What is transaction fee deduction tool and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The transaction fee deduction tool is a calculator designed to help users accurately determine the net amount of a transaction after accounting for all associated fees. This tool is important because it provides a clear understanding of the actual financial outcome of a transaction, which is crucial for budgeting, financial planning, and tax reporting. By using this tool, users can avoid overestimating their net gains or underestimating their expenses.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Understanding the impact of transaction fees is essential for making informed financial decisions. This tool helps users identify the true cost of transactions and optimize their strategies accordingly. For more on financial planning, check out our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              This calculator is designed to provide highly accurate results based on the inputs provided. However, the accuracy of the results depends on the accuracy of the input data. Users should ensure that they enter precise transaction amounts and fee values to achieve the best results. It's also important to consider that fees can fluctuate, especially in volatile markets, which may affect the accuracy of the calculation.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For complex transactions or when in doubt, consulting a financial advisor or tax professional is recommended. They can provide additional insights and help verify the calculations.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use this calculator, you will need the total transaction amount, the gas fee, and the exchange fee. The transaction amount is the total value of the transaction before any deductions. The gas fee is specific to blockchain transactions and represents the cost of processing the transaction on the network. The exchange fee is the fee charged by the platform for facilitating the transaction.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              You can find this information on the transaction receipt or by checking the fee schedule on the platform you are using. Ensure that you have the most up-to-date information to achieve accurate results.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for specific scenarios?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, this calculator can be used for a variety of scenarios, including cryptocurrency transactions, stock trades, and other financial operations that involve fees. However, it's important to note that the calculator is designed to handle standard fee structures. For transactions with unique or complex fee arrangements, additional calculations may be necessary.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              If you encounter a scenario that the calculator cannot handle, consider consulting a financial advisor for tailored advice. They can help you navigate complex fee structures and ensure accurate financial reporting.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include entering incorrect fee amounts, failing to account for all fees, and using outdated fee data. These errors can lead to inaccurate results and financial misreporting. It's important to double-check all inputs and ensure that you have the most current fee information.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Another mistake is not considering the impact of market conditions on fees. For example, gas fees can fluctuate significantly based on network congestion. Staying informed about market trends can help you avoid unexpected costs.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Recalculation is necessary whenever there is a change in transaction amounts or fee structures. It's also advisable to recalculate periodically to ensure that your financial records are up-to-date. For frequent traders or investors, recalculating after each transaction can help maintain accurate financial reporting.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Consider setting a regular schedule for recalculating, such as monthly or quarterly, depending on your transaction volume. This practice can help you stay organized and prepared for tax reporting.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The results from this calculator can be used to update your financial records and ensure accurate tax reporting. They provide a clear picture of your net gains or losses, which is essential for budgeting and financial planning. Use the results to make informed decisions about future transactions and optimize your financial strategies.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              If you're unsure how to interpret the results, consider consulting a financial advisor. They can provide additional insights and help you develop a comprehensive financial plan. For more detailed analysis, explore our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              While this calculator provides a straightforward method for calculating transaction fees, there are alternative approaches. Some users may prefer using spreadsheet software for more complex calculations or to incorporate additional variables. Others may choose to use specialized financial software that offers advanced features and integration with financial accounts.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Each method has its pros and cons, and the best choice depends on your specific needs and preferences. For simple transactions, this calculator is often sufficient. For more complex financial planning, consider exploring other tools and resources.
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
                Federal Reserve - Understanding Financial Transactions
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on financial transactions and regulatory guidelines.
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
                Comprehensive consumer protection information and educational resources.
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
                Banking regulations and deposit insurance information.
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
                Internal Revenue Service - Tax Guidelines
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information.
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
                Detailed financial education and investment concepts explained.
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
        </ul>
      </section>
    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Transaction Fee Deduction Tool"
      description="Calculate deductible transaction fees. Reduce your taxable gain by accounting for gas and exchange fees accurately."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Transaction Fee Deduction Tool" },
        { id: "formula", label: "Transaction Fee Deduction Tool Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Net Amount = Transaction Amount - (Gas Fee + Exchange Fee)",
        variables: [
          { symbol: "Transaction Amount", description: "Total value of the transaction" },
          { symbol: "Gas Fee", description: "Cost associated with processing the transaction on a blockchain" },
          { symbol: "Exchange Fee", description: "Fee charged by the platform for facilitating the transaction" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a transaction amount of $5,000 with a gas fee of $50 and an exchange fee of $25.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "5000 - (50 + 25) = 4925", 
            explanation: "Calculate the net amount by subtracting the total fees from the transaction amount." 
          },
          { 
            label: "Step 2", 
            calculation: "50 + 25 = 75", 
            explanation: "Calculate the total fees by adding the gas fee and exchange fee." 
          },
          { 
            label: "Step 3", 
            calculation: "4925 is the net amount", 
            explanation: "The final result shows the amount after all fees are deducted." 
          }
        ],
        result: "The final result is $4,925, meaning you retain this amount after all fees are deducted."
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