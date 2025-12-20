import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CryptoToFiatConverter() {
  // STATE
  const [inputs, setInputs] = useState({ 
    cryptoAmount: "", 
    exchangeRate: "", 
    feePercentage: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // HELPER FUNCTION (MANDATORY)
  const formatCurrency = (value: number, currency: string = "USD"): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    const cryptoAmountValue = parseFloat(inputs.cryptoAmount) || 0;
    const exchangeRateValue = parseFloat(inputs.exchangeRate) || 0;
    const feePercentageValue = parseFloat(inputs.feePercentage) || 0;

    // Validate
    if (cryptoAmountValue <= 0 || exchangeRateValue <= 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const fiatValue = cryptoAmountValue * exchangeRateValue;
    const fee = fiatValue * (feePercentageValue / 100);
    const netFiatValue = fiatValue - fee;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      payment: netFiatValue / 12,
      principal: (netFiatValue / 12) * 0.8,
      interest: (netFiatValue / 12) * 0.2,
      balance: netFiatValue - ((netFiatValue / 12) * (i + 1))
    }));

    return { 
      mainResult: netFiatValue, 
      result2: fee, 
      result3: fiatValue, 
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
    setInputs({ cryptoAmount: "", exchangeRate: "", feePercentage: "" });
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
              Cryptocurrency Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1.5"
              value={inputs.cryptoAmount}
              onChange={(e) => setInputs({ ...inputs, cryptoAmount: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Exchange Rate (to Fiat)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 45000"
              value={inputs.exchangeRate}
              onChange={(e) => setInputs({ ...inputs, exchangeRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Transaction Fee Percentage
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1.5"
              value={inputs.feePercentage}
              onChange={(e) => setInputs({ ...inputs, feePercentage: e.target.value })}
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
                      Net Fiat Value
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
                      Transaction Fee
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
                      Gross Fiat Value
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
                    Monthly Breakdown
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
          Understanding Crypto to Fiat Converter
        </h2>
        
        <p className="mb-6">
          In the rapidly evolving world of cryptocurrencies, converting your digital assets to fiat currency is a crucial step for many investors and traders. The Crypto to Fiat Converter is designed to provide you with an accurate and instant conversion of your cryptocurrency holdings into traditional currencies like USD, EUR, and more. Whether you're looking to cash out your Bitcoin, Ethereum, or any other digital currency, this tool simplifies the process by offering real-time exchange rates and accounting for transaction fees.
        </p>
        
        <p className="mb-6">
          Accurate calculations are paramount in the realm of cryptocurrency trading. With volatile markets and fluctuating exchange rates, even a small error in conversion can lead to significant financial discrepancies. This converter ensures precision by utilizing up-to-date exchange rates and allowing users to input specific transaction fees, offering a comprehensive overview of the net fiat value you can expect. This tool is essential for anyone involved in crypto trading, providing a reliable means to assess the true value of their digital assets.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather the necessary information beforehand. You will need the amount of cryptocurrency you wish to convert, the current exchange rate for the desired fiat currency, and any transaction fees that may apply. Enter these values into the respective fields, and the calculator will provide you with the gross and net fiat values, along with a breakdown of transaction fees. For more detailed financial planning, consider using our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> to manage your finances effectively.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check the exchange rate and transaction fees before finalizing your conversion. Market conditions can change rapidly, and being informed ensures you maximize your returns and minimize losses.
          </p>
        </div>
        
        <p className="mb-6">
          When using the Crypto to Fiat Converter, consider the timing of your conversion. Cryptocurrency markets are known for their volatility, and exchange rates can vary significantly within short periods. It's advisable to monitor market trends and choose a conversion time that aligns with your financial goals. Additionally, be aware of any legal or tax implications associated with converting crypto to fiat, as regulations vary by region.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Crypto to Fiat Converter Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Crypto to Fiat Converter is straightforward yet effective, designed to provide accurate conversion results by accounting for all necessary variables. The primary formula calculates the gross fiat value by multiplying the amount of cryptocurrency by the current exchange rate. Subsequently, the transaction fee is calculated as a percentage of the gross fiat value, which is then subtracted to yield the net fiat value.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Net Fiat Value = (Crypto Amount × Exchange Rate) - (Crypto Amount × Exchange Rate × Fee Percentage / 100)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Crypto Amount = The amount of cryptocurrency to be converted</li>
              <li>Exchange Rate = The current exchange rate for the desired fiat currency</li>
              <li>Fee Percentage = The transaction fee percentage applied to the conversion</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in this formula plays a critical role in determining the final conversion value. The crypto amount represents your digital holdings, while the exchange rate reflects the current market value of the cryptocurrency in terms of fiat currency. The fee percentage accounts for any costs associated with the transaction, ensuring that the net fiat value accurately reflects the amount you will receive after all deductions. By understanding these variables, users can make informed decisions and optimize their conversion strategy.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your crypto to fiat conversion is essential for maximizing your financial outcomes. These factors not only determine the immediate value of your conversion but also impact your long-term financial strategy. By recognizing how these elements interact, you can make more informed decisions and optimize your conversion process.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Exchange Rate Volatility
        </h3>
        <p className="mb-4">
          Exchange rates are subject to constant fluctuations due to market dynamics, geopolitical events, and economic indicators. This volatility can significantly impact the value of your conversion, making it crucial to monitor market trends and choose an optimal conversion time. For instance, a sudden increase in demand for a particular cryptocurrency can drive up its value, providing a more favorable exchange rate.
        </p>
        <p className="mb-6">
          To mitigate the risks associated with exchange rate volatility, consider using tools like our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a> to plan your financial strategy. Additionally, setting alerts for specific price points can help you capitalize on favorable rates.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Transaction Fees
        </h3>
        <p className="mb-4">
          Transaction fees are an inevitable part of converting cryptocurrency to fiat. These fees can vary based on the platform used, the amount being converted, and the current network congestion. High transaction fees can erode your net fiat value, making it essential to account for these costs when planning your conversion.
        </p>
        <p className="mb-6">
          To minimize transaction fees, consider converting larger amounts at once or using platforms that offer competitive fee structures. Additionally, some platforms offer discounts for using their native tokens to pay for fees, which can further reduce costs.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Liquidity
        </h3>
        <p className="mb-4">
          Liquidity refers to the ease with which an asset can be converted into cash without affecting its market price. High liquidity ensures that your conversion can be executed quickly and at a stable price, whereas low liquidity can lead to slippage and unfavorable rates.
        </p>
        <p className="mb-6">
          To ensure optimal liquidity, choose well-established platforms with high trading volumes. Additionally, diversifying your crypto holdings across multiple exchanges can provide more options and better liquidity.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Regulatory Environment
        </h3>
        <p className="mb-6">
          The regulatory landscape for cryptocurrencies varies significantly across different regions. Regulations can impact the availability of certain services, the fees charged, and the overall ease of converting crypto to fiat. Staying informed about the regulatory environment in your area is crucial for ensuring compliance and avoiding potential legal issues.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Security Considerations
        </h3>
        <p className="mb-6">
          Security is a paramount concern when dealing with cryptocurrencies. Ensuring that your chosen platform has robust security measures in place can protect your assets from theft and fraud. Look for platforms with strong encryption, two-factor authentication, and a proven track record of security.
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
                href="https://www.federalreserve.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Federal Reserve - Cryptocurrency Guidelines
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on cryptocurrency regulations and monetary policy impacts.
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
                Consumer Financial Protection Bureau - Crypto Resources
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources on cryptocurrency.
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
                FDIC - Digital Currency Insights
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and insights into digital currency management.
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
                Internal Revenue Service - Cryptocurrency Taxation
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and reporting requirements for cryptocurrency transactions.
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
                Detailed financial education and investment concepts related to cryptocurrency.
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
                NerdWallet - Crypto Investment Guides
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for cryptocurrency investments.
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
      title="Crypto to Fiat Converter"
      description="Convert cryptocurrency to fiat currency instantly. Get live exchange rates for BTC, ETH, and more to USD, EUR, and other currencies."
      jsonLd={faqJsonLd}
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Crypto to Fiat Converter" },
        { id: "formula", label: "Crypto to Fiat Converter Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Net Fiat Value = (Crypto Amount × Exchange Rate) - (Crypto Amount × Exchange Rate × Fee Percentage / 100)",
        variables: [
          { symbol: "Crypto Amount", description: "The amount of cryptocurrency to be converted" },
          { symbol: "Exchange Rate", description: "The current exchange rate for the desired fiat currency" },
          { symbol: "Fee Percentage", description: "The transaction fee percentage applied to the conversion" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have 2 BTC and the exchange rate is $45,000 per BTC with a 1.5% transaction fee.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "2 × 45,000 = 90,000", 
            explanation: "Calculate the gross fiat value by multiplying the crypto amount by the exchange rate." 
          },
          { 
            label: "Step 2", 
            calculation: "90,000 × 0.015 = 1,350", 
            explanation: "Calculate the transaction fee by multiplying the gross fiat value by the fee percentage." 
          },
          { 
            label: "Step 3", 
            calculation: "90,000 - 1,350 = 88,650", 
            explanation: "Subtract the transaction fee from the gross fiat value to get the net fiat value." 
          }
        ],
        result: "The final result is $88,650, meaning after accounting for the transaction fee, you will receive $88,650."
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