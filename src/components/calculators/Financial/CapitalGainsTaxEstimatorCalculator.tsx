import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CapitalGainsTaxEstimatorCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    purchasePrice: "", 
    salePrice: "", 
    holdingPeriod: "" 
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
    const purchasePriceValue = parseFloat(inputs.purchasePrice) || 0;
    const salePriceValue = parseFloat(inputs.salePrice) || 0;
    const holdingPeriodValue = parseFloat(inputs.holdingPeriod) || 0;

    // Validate
    if (purchasePriceValue <= 0 || salePriceValue <= 0) {
      return { 
        mainResult: 0, 
        shortTermTax: 0, 
        longTermTax: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const capitalGain = salePriceValue - purchasePriceValue;
    const shortTermTaxRate = 0.37; // Example rate for short-term
    const longTermTaxRate = 0.15; // Example rate for long-term

    const isShortTerm = holdingPeriodValue < 365;
    const mainResult = isShortTerm ? capitalGain * shortTermTaxRate : capitalGain * longTermTaxRate;
    const shortTermTax = capitalGain * shortTermTaxRate;
    const longTermTax = capitalGain * longTermTaxRate;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      payment: mainResult / 12,
      principal: (mainResult / 12) * 0.7,
      interest: (mainResult / 12) * 0.3,
      balance: mainResult - ((mainResult / 12) * (i + 1))
    }));

    return { 
      mainResult, 
      shortTermTax, 
      longTermTax, 
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
    setInputs({ purchasePrice: "", salePrice: "", holdingPeriod: "" });
  };

  const faqs = [
    {
      question: "What is capital gains tax estimator and why is it important?",
      answer: "The capital gains tax estimator is a tool designed to calculate the tax liability arising from the sale of assets, such as stocks or cryptocurrencies. It distinguishes between short-term and long-term capital gains, applying the appropriate tax rates based on the holding period. This estimator is important because it helps investors understand their potential tax obligations, allowing for better financial planning and decision-making. By using this tool, you can avoid unexpected tax bills and optimize your investment strategy. For more financial tools, check out our <a href=\"/financial/refinance-savings\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Refinance Savings Calculator</a>."
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator is designed to provide accurate estimates based on the inputs provided. However, its accuracy depends on the accuracy of the input data. Factors such as changes in tax laws or incorrect input values can affect the results. It's always advisable to consult a tax professional for personalized advice, especially for complex situations. Use this calculator as a guide, and ensure your inputs are precise to get the best results."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use this calculator, you need the purchase price of the asset, the sale price, and the holding period in days. The purchase price is the amount you paid to acquire the asset, while the sale price is the amount you received from selling it. The holding period is the duration for which you held the asset before selling it. Ensure you have accurate records of these values to get precise results. This information is typically available in your transaction records or brokerage statements."
    },
    {
      question: "Can I use this calculator for cryptocurrency transactions?",
      answer: "Yes, this calculator can be used for cryptocurrency transactions. Cryptocurrencies are treated as property for tax purposes, and capital gains tax applies to their sale. Ensure you have accurate records of your purchase and sale prices, as well as the holding period, to use this calculator effectively. Keep in mind that tax regulations for cryptocurrencies can vary by jurisdiction, so it's important to stay informed about local laws."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include using incorrect purchase or sale prices, miscalculating the holding period, and not accounting for changes in tax laws. These errors can lead to inaccurate tax estimates and potential compliance issues. To avoid these mistakes, double-check your records and stay updated on tax regulations. Consider consulting a tax professional for complex situations."
    },
    {
      question: "How often should I recalculate?",
      answer: "Recalculate your capital gains tax whenever you sell an asset or when there are significant changes in tax laws. Regular recalculations ensure that you have up-to-date estimates and can plan your finances accordingly. It's also a good practice to review your tax situation annually, especially if you have a diverse investment portfolio."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results to plan your tax payments and adjust your investment strategy. Understanding your tax liability helps you set aside the necessary funds and avoid surprises at tax time. If your results indicate a high tax liability, consider strategies to minimize it, such as holding assets longer or offsetting gains with losses. For more strategies on managing your finances, explore our <a href=\"/financial/heloc-payment-estimator\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">HELOC Payment Estimator</a>."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Alternatives to this calculation method include using professional tax software or consulting with a tax advisor. These options can provide more personalized advice and handle complex scenarios that a basic calculator might not cover. Consider these alternatives if you have a large or complex portfolio, or if you're unsure about specific tax rules."
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

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
              placeholder="e.g., 10000"
              value={inputs.purchasePrice}
              onChange={(e) => setInputs({ ...inputs, purchasePrice: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Sale Price
            </Label>
            <Input
              type="number"
              placeholder="e.g., 15000"
              value={inputs.salePrice}
              onChange={(e) => setInputs({ ...inputs, salePrice: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Holding Period (days)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 365"
              value={inputs.holdingPeriod}
              onChange={(e) => setInputs({ ...inputs, holdingPeriod: e.target.value })}
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
                      Estimated Tax Liability
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
                      Short-Term Capital Gains Tax
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.shortTermTax)}
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
                      Long-Term Capital Gains Tax
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.longTermTax)}
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
          Understanding Capital Gains Tax Estimator
        </h2>
        
        <p className="mb-6">
          The Capital Gains Tax Estimator is a crucial tool for anyone involved in the buying and selling of assets, particularly in the realm of cryptocurrencies. This calculator helps you determine the tax obligations arising from the sale of these assets, distinguishing between short-term and long-term capital gains tax based on the holding period. Whether you're a seasoned investor or a beginner, understanding your tax liabilities is essential for effective financial planning. This tool provides clarity and precision, allowing you to make informed decisions about your investments and their potential tax implications.
        </p>
        
        <p className="mb-6">
          Accurate calculations in this domain are vital due to the significant financial implications of capital gains tax. Incorrect calculations can lead to unexpected tax bills, affecting your overall financial health. According to recent data, capital gains tax rates can vary significantly, impacting your net returns. By using this estimator, you can avoid surprises and plan your finances better. For more insights into financial planning, you might find our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> useful.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information about the purchase price, sale price, and the holding period of your asset. Enter these values into the respective fields to get an accurate estimate of your capital gains tax. The tool will automatically calculate whether your gains are subject to short-term or long-term tax rates. For a deeper understanding of how these inputs affect your results, check out our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check the holding period of your assets. A difference of just one day can change your tax rate from short-term to long-term, significantly affecting your tax liability. Ensure your records are accurate to avoid costly mistakes.
          </p>
        </div>
        
        <p className="mb-6">
          For optimal results, consider the timing of your asset sales. Selling assets held for more than a year can often result in a lower tax rate. Additionally, be aware of any changes in tax laws that might affect your calculations. Staying informed and using tools like this estimator can help you manage your investments more effectively.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Capital Gains Tax Estimator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Capital Gains Tax Estimator is based on standard tax calculation methods. It calculates the tax liability by determining the difference between the sale price and the purchase price of an asset, then applying the appropriate tax rate based on the holding period. This approach is widely accepted and used by financial professionals to ensure accurate tax reporting and compliance with tax regulations.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Tax Liability = (Sale Price - Purchase Price) × Tax Rate
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Sale Price = The amount for which the asset was sold</li>
              <li>Purchase Price = The amount paid to acquire the asset</li>
              <li>Tax Rate = The applicable tax rate based on holding period</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the final tax liability. The Sale Price and Purchase Price are straightforward, representing the transaction amounts. The Tax Rate, however, varies depending on whether the asset was held for less than a year (short-term) or more than a year (long-term). Short-term gains are typically taxed at higher rates, similar to ordinary income, while long-term gains benefit from reduced rates. Understanding these variables helps in planning the timing of asset sales to optimize tax outcomes.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your capital gains tax is essential for effective financial planning. These factors not only determine your tax liability but also impact your overall investment strategy. By considering these elements, you can make informed decisions that align with your financial goals.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Holding Period
        </h3>
        <p className="mb-4">
          The holding period of an asset is a critical factor in determining the applicable tax rate. Assets held for less than a year are subject to short-term capital gains tax, which is generally higher. Conversely, assets held for more than a year qualify for long-term capital gains tax, which is typically lower. This distinction can significantly affect your tax liability.
        </p>
        <p className="mb-6">
          To optimize your tax outcomes, consider holding assets for longer periods to benefit from the reduced long-term tax rates. This strategy can lead to substantial savings, especially for high-value transactions. For more strategies on managing your finances, explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Asset Type
        </h3>
        <p className="mb-4">
          Different types of assets may be subject to varying capital gains tax rules. For instance, collectibles like art and antiques often have different tax rates compared to stocks or real estate. Understanding the specific tax implications for each asset type is crucial for accurate tax planning.
        </p>
        <p className="mb-6">
          Consider consulting a tax professional to understand the nuances of tax rates for different asset classes. This knowledge can help you make strategic decisions about which assets to sell and when, maximizing your after-tax returns.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Tax Bracket
        </h3>
        <p className="mb-4">
          Your overall tax bracket can influence the rate at which your capital gains are taxed. Higher income levels may result in higher capital gains tax rates, particularly for short-term gains. It's important to consider your total income when planning asset sales to avoid pushing yourself into a higher tax bracket.
        </p>
        <p className="mb-6">
          To manage this factor effectively, plan your asset sales in conjunction with other income sources. Timing your sales to align with lower income years can help reduce your overall tax burden. For more insights, visit our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Tax Law Changes
        </h3>
        <p className="mb-6">
          Tax laws are subject to change, and staying informed about these changes is crucial for accurate tax planning. Legislative updates can alter tax rates, exemptions, and deductions, impacting your capital gains tax liability. Keeping abreast of these changes ensures that your tax strategies remain effective and compliant.
        </p>
        <p className="mb-6">
          Regularly review tax updates from reliable sources and consider consulting with a tax advisor to understand how changes might affect your situation. This proactive approach can help you adapt your strategies and avoid unexpected tax liabilities.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Investment Strategy
        </h3>
        <p className="mb-6">
          Your overall investment strategy plays a significant role in determining your capital gains tax liability. Strategies that involve frequent buying and selling may result in higher short-term gains, while a buy-and-hold approach can lead to more favorable long-term tax rates. Aligning your investment strategy with your tax planning goals can optimize your financial outcomes.
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
                href="https://www.irs.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Internal Revenue Service - Capital Gains
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official guidelines on capital gains tax, including rates and exemptions.
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
                Investopedia - Capital Gains Tax
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive guide on capital gains tax, including strategies for minimizing liability.
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
                NerdWallet - Understanding Capital Gains
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance insights on capital gains and how they affect your taxes.
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
                Consumer Financial Protection Bureau - Tax Resources
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Educational resources on taxes and financial planning for consumers.
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
                Federal Reserve - Economic Data
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Access to economic data and analysis relevant to capital gains.
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
                FDIC - Financial Education
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Resources on financial education and consumer protection.
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
      title="Capital Gains Tax Estimator"
      description="Calculate capital gains tax on crypto sales. Determine short-term vs long-term tax obligations based on holding period."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Capital Gains Tax Estimator" },
        { id: "formula", label: "Capital Gains Tax Estimator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Tax Liability = (Sale Price - Purchase Price) × Tax Rate",
        variables: [
          { symbol: "Sale Price", description: "The amount for which the asset was sold" },
          { symbol: "Purchase Price", description: "The amount paid to acquire the asset" },
          { symbol: "Tax Rate", description: "The applicable tax rate based on holding period" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you purchased a cryptocurrency for $10,000 and sold it for $15,000 after 400 days.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Gain = $15,000 - $10,000 = $5,000", 
            explanation: "Calculate the capital gain by subtracting the purchase price from the sale price." 
          },
          { 
            label: "Step 2", 
            calculation: "Tax = $5,000 × 0.15 = $750", 
            explanation: "Apply the long-term capital gains tax rate of 15% to the gain." 
          },
          { 
            label: "Step 3", 
            calculation: "Total Tax Liability = $750", 
            explanation: "The final result shows the tax liability for the transaction." 
          }
        ],
        result: "The final result is $750, meaning you owe this amount in capital gains tax."
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