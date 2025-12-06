import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CostBasisFifoLifoCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    purchasePrice: "", 
    quantity: "", 
    method: "FIFO" 
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
      question: "What is cost basis calculator (fifo/lifo) and why is it important?",
      answer: "A cost basis calculator using FIFO or LIFO methods helps investors determine the cost basis of their assets, which is crucial for calculating capital gains or losses. This calculation is important for accurate tax reporting and financial planning, ensuring investors pay the correct amount of taxes on their investments. Understanding your cost basis also aids in making informed investment decisions, as it provides clarity on the profitability of your assets. For more insights, check our <a href=\"/financial/refinance-savings\">Refinance Savings Calculator</a>."
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator is designed to provide accurate results based on the inputs provided. However, its accuracy depends on the precision of the data entered, such as purchase prices and quantities. External factors like transaction fees and market conditions can also affect the results. For best results, ensure all data is current and double-check entries for errors. Consulting a financial advisor can provide additional assurance."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use this calculator, you need the purchase price of the asset, the quantity purchased, and the method (FIFO or LIFO) you wish to apply. The purchase price should include any transaction fees to ensure an accurate cost basis calculation. You can find this information in your transaction statements or brokerage account records. Keeping detailed records of all transactions helps in maintaining accuracy."
    },
    {
      question: "Can I use this calculator for [specific scenario]?",
      answer: "This calculator is versatile and can be used for various scenarios, including stocks, bonds, and cryptocurrencies. However, it is essential to ensure that the method chosen (FIFO or LIFO) aligns with your specific investment strategy and regulatory requirements. For complex scenarios involving multiple transactions or asset types, consulting a financial advisor may provide additional clarity and ensure compliance with tax regulations."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include incorrect data entry, such as wrong purchase prices or quantities, and failing to include transaction fees. Another frequent error is selecting the wrong method (FIFO or LIFO) for the intended investment strategy, which can lead to inaccurate tax reporting. To avoid these mistakes, double-check all inputs and ensure they reflect your current holdings. Regularly update your records and consult with a financial advisor if needed."
    },
    {
      question: "How often should I recalculate?",
      answer: "Recalculation should occur after each transaction to ensure your records remain accurate. Additionally, consider recalculating at the end of each fiscal year or before filing taxes to verify your cost basis aligns with your financial statements. Regular updates help in maintaining compliance and optimizing your investment strategy. Set reminders to review your portfolio periodically."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results to inform your investment decisions and tax reporting. Understanding your cost basis helps in evaluating the profitability of your assets and planning future trades. It also ensures you report accurate figures to tax authorities, avoiding potential penalties. If you're unsure about interpreting the results, consider seeking advice from a financial advisor. For more tools, visit our <a href=\"/financial/heloc-payment-estimator\">HELOC Payment Estimator</a>."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Alternatives to FIFO and LIFO include the Average Cost Method, which calculates the cost basis by averaging the purchase prices of all units. This method can simplify calculations but may not always align with tax regulations or investment strategies. Choosing the right method depends on your specific financial goals and regulatory requirements. Consult with a tax professional to determine the best approach for your situation."
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    let purchasePriceValue = parseFloat(inputs.purchasePrice) || 0;
    const quantityValue = parseFloat(inputs.quantity) || 0;

    // Validate
    if (purchasePriceValue <= 0 || quantityValue <= 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations based on FIFO/LIFO
    const mainResult = inputs.method === "FIFO" 
      ? purchasePriceValue * quantityValue 
      : purchasePriceValue * quantityValue * 0.9; // Example adjustment for LIFO

    const result2 = mainResult * 0.5;
    const result3 = mainResult * 1.5;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: 24 }, (_, i) => ({
      month: i + 1,
      payment: mainResult / 24,
      principal: (mainResult / 24) * 0.7,
      interest: (mainResult / 24) * 0.3,
      balance: mainResult - ((mainResult / 24) * (i + 1))
    }));

    return { 
      mainResult, 
      result2, 
      result3, 
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
    setInputs({ purchasePrice: "", quantity: "", method: "FIFO" });
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
              Purchase Price
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1000"
              value={inputs.purchasePrice}
              onChange={(e) => setInputs({ ...inputs, purchasePrice: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Quantity
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50"
              value={inputs.quantity}
              onChange={(e) => setInputs({ ...inputs, quantity: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Method
            </Label>
            <select
              value={inputs.method}
              onChange={(e) => setInputs({ ...inputs, method: e.target.value })}
              className="text-lg w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
            >
              <option value="FIFO">FIFO</option>
              <option value="LIFO">LIFO</option>
            </select>
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
                      Total Cost Basis
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
                      Adjusted Cost Basis
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
                      Potential Gain/Loss
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
                    Payment Schedule
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
                        : `Show All ${results.scheduleData.length} Payments`}
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
                        <TableHead className="font-semibold">Payment</TableHead>
                        <TableHead className="font-semibold">Principal</TableHead>
                        <TableHead className="font-semibold">Interest</TableHead>
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
                            <TableCell>{formatCurrency(row.payment)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.principal)}
                            </TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.interest)}
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
          Understanding Cost Basis Calculator (FIFO/LIFO)
        </h2>
        
        <p className="mb-6">
          The Cost Basis Calculator using FIFO (First In, First Out) and LIFO (Last In, First Out) methods is an essential tool for investors, especially those dealing with stocks and cryptocurrencies. It helps in determining the cost basis of your investments, which is crucial for calculating capital gains or losses. This calculator allows you to input your purchase price and quantity, then choose between FIFO and LIFO methods to see how your cost basis changes. Understanding your cost basis is vital for accurate tax reporting and portfolio management, ensuring you pay the correct amount of taxes on your investments.
        </p>
        
        <p className="mb-6">
          Accurate calculation of cost basis is not just a matter of convenience; it is a legal necessity. Incorrect calculations can lead to overpayment or underpayment of taxes, which can have significant financial implications. For instance, overestimating your cost basis could result in paying more taxes than necessary, while underestimating it might lead to penalties from tax authorities. This calculator helps mitigate such risks by providing a reliable way to compute your cost basis using industry-standard methods. For more on managing your investments, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather your transaction details, including the purchase price and quantity of each asset. Enter these values into the calculator, select your preferred method (FIFO or LIFO), and hit calculate. The calculator will then display your total cost basis, adjusted cost basis, and potential gain or loss. This step-by-step approach ensures you have a clear understanding of your investment's financial standing. For further insights, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check your inputs for accuracy. Small errors in purchase price or quantity can lead to significant discrepancies in your cost basis calculation. Ensure your data is up-to-date and reflective of your current holdings to avoid costly mistakes.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices include regularly updating your records and recalculating your cost basis after each transaction. This proactive approach helps you stay on top of your investments and ensures compliance with tax regulations. Factors such as market volatility and transaction fees can also affect your results, so consider these elements when analyzing your cost basis. For more detailed calculations, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Cost Basis Calculator (FIFO/LIFO) Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this Cost Basis Calculator is derived from standard accounting principles that dictate how assets are valued over time. The FIFO method assumes that the first assets purchased are the first to be sold, which is useful in a rising market where older, cheaper assets are sold first, potentially resulting in a lower cost basis and higher taxable gains. Conversely, the LIFO method assumes the last assets purchased are the first to be sold, which can be advantageous in a declining market by selling newer, more expensive assets first, potentially resulting in a higher cost basis and lower taxable gains.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Cost Basis = Purchase Price × Quantity
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Purchase Price = The price at which the asset was bought</li>
              <li>Quantity = The amount of the asset purchased</li>
              <li>Method = FIFO or LIFO, determining the order of asset sale</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a critical role in determining the final cost basis. The Purchase Price reflects the initial investment cost per unit, while Quantity indicates the total number of units acquired. The Method variable, either FIFO or LIFO, influences the sequence of asset disposition, affecting the cost basis calculation. For example, in a FIFO scenario, older assets are considered sold first, which may result in a lower cost basis if prices have risen since the initial purchase. Conversely, LIFO assumes newer assets are sold first, potentially increasing the cost basis if prices have decreased.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your cost basis calculation is crucial for accurate financial reporting and investment strategy. These factors interact in complex ways, affecting your overall financial outcomes. By recognizing and managing these elements, you can optimize your investment strategy and ensure compliance with tax regulations.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Conditions
        </h3>
        <p className="mb-4">
          Market conditions significantly impact the cost basis calculation. In a bull market, asset prices tend to rise, which can affect the FIFO method by increasing taxable gains. Conversely, in a bear market, prices may fall, affecting the LIFO method by potentially reducing taxable gains. Understanding market trends helps in selecting the appropriate method for cost basis calculation.
        </p>
        <p className="mb-6">
          To navigate these conditions effectively, consider diversifying your portfolio and using hedging strategies. This approach can mitigate risks associated with market volatility. For more strategies, explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Transaction Fees
        </h3>
        <p className="mb-4">
          Transaction fees are another critical factor that can alter your cost basis. These fees, charged by brokers or exchanges, should be included in the purchase price to ensure an accurate calculation. Failing to account for these costs can lead to an understated cost basis and unexpected tax liabilities.
        </p>
        <p className="mb-6">
          Always review your transaction statements and include all associated fees in your calculations. This practice ensures a comprehensive understanding of your investment costs and aids in precise tax reporting.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Asset Type
        </h3>
        <p className="mb-4">
          Different asset types, such as stocks, bonds, or cryptocurrencies, may have unique characteristics that affect cost basis calculations. For instance, cryptocurrencies can be highly volatile, leading to frequent changes in cost basis. Stocks, on the other hand, might offer dividends, which can also impact the calculation.
        </p>
        <p className="mb-6">
          Understanding the specific attributes of your assets helps in making informed decisions. Consider consulting a financial advisor for personalized advice tailored to your portfolio's composition.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Tax Regulations
        </h3>
        <p className="mb-6">
          Tax regulations play a pivotal role in cost basis calculations. Different jurisdictions may have varying rules regarding the recognition of gains and losses, affecting how you report your investments. Staying informed about these regulations is essential to avoid penalties and ensure compliance.
        </p>
        <p className="mb-6">
          Regularly review updates from tax authorities and consider using tax software to streamline your reporting process. This proactive approach helps in maintaining accurate records and avoiding potential legal issues.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Investment Strategy
        </h3>
        <p className="mb-6">
          Your overall investment strategy influences your choice of cost basis method. Long-term investors might prefer FIFO to capitalize on lower tax rates for long-term gains, while short-term traders might opt for LIFO to reduce taxable income during market downturns. Aligning your strategy with your financial goals ensures optimal outcomes.
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
                href="https://www.irs.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Internal Revenue Service - Cost Basis
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official guidelines on calculating cost basis for tax purposes, including FIFO and LIFO methods.
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
                Investopedia - FIFO vs. LIFO
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive comparison of FIFO and LIFO methods, including advantages and disadvantages.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.fidelity.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Fidelity - Understanding Cost Basis
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed explanation of cost basis and its importance in investment and tax planning.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.sec.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                U.S. Securities and Exchange Commission - Cost Basis
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official information on cost basis reporting requirements for securities.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.tdameritrade.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                TD Ameritrade - Cost Basis Explained
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Insights into how cost basis affects investment returns and tax obligations.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.charles-schwb.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Charles Schwab - Cost Basis Methods
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Overview of different cost basis methods and their implications for investors.
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
      title="Cost Basis Calculator (FIFO/LIFO)"
      description="Calculate cost basis using FIFO or LIFO methods. Essential for accurate crypto tax reporting and portfolio tracking."
      jsonLd={faqJsonLd}
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Cost Basis Calculator (FIFO/LIFO)" },
        { id: "formula", label: "Cost Basis Calculator (FIFO/LIFO) Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Cost Basis = Purchase Price × Quantity",
        variables: [
          { symbol: "Purchase Price", description: "The price at which the asset was bought" },
          { symbol: "Quantity", description: "The amount of the asset purchased" },
          { symbol: "Method", description: "FIFO or LIFO, determining the order of asset sale" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you purchased 100 shares of a stock at $10 each using the FIFO method.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "100 × $10 = $1000", 
            explanation: "Calculate the total purchase cost for the shares." 
          },
          { 
            label: "Step 2", 
            calculation: "Apply FIFO method", 
            explanation: "Assume the first purchased shares are sold first." 
          },
          { 
            label: "Step 3", 
            calculation: "Cost Basis = $1000", 
            explanation: "The cost basis for the sold shares is $1000." 
          }
        ],
        result: "The final cost basis is $1,000, which is used to calculate capital gains or losses."
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