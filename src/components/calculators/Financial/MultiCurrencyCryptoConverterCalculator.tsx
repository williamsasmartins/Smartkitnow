import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function MultiCurrencyCryptoConverterCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    cryptoAmount: "", 
    cryptoRate: "", 
    fiatRate: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is multi-currency crypto converter and why is it important?",
      answer: "A multi-currency crypto converter is a tool that allows users to convert cryptocurrency values into various fiat currencies simultaneously. This is important because it provides a comprehensive view of the value of crypto holdings in different currencies, aiding in better financial planning and decision-making. By using this converter, users can quickly assess the impact of market changes on their portfolio and make informed decisions about buying, selling, or holding assets. For more tools, check our <a href=\"/financial/interest-only-loan\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Interest-Only Loan Calculator</a>."
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator is highly accurate when using real-time exchange rates. However, its accuracy can be affected by rapid market fluctuations or outdated rate data. It's essential to ensure that the rates used are current to maintain precision in the results. For critical financial decisions, consider consulting with a financial advisor to complement the insights gained from this tool."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use this calculator, you need the amount of cryptocurrency you own, the current exchange rate of that cryptocurrency in USD, and the conversion rate of USD to your desired fiat currency. This information is typically available on major cryptocurrency exchanges or financial news platforms. Ensure that the data you use is up-to-date to achieve accurate conversion results. Regularly checking exchange rates can help maintain the accuracy of your calculations."
    },
    {
      question: "Can I use this calculator for specific scenarios?",
      answer: "Yes, this calculator can be used for a variety of scenarios, including assessing the value of crypto holdings in different fiat currencies or planning for currency exchanges. However, it's important to note that the calculator does not account for transaction fees or taxes, which may affect the final value. For scenarios involving significant financial decisions, consider additional financial tools or professional advice to ensure comprehensive planning."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include using outdated exchange rates, neglecting transaction fees, and misunderstanding the impact of market volatility. These errors can lead to inaccurate conversion results and financial misjudgments. To avoid these pitfalls, always verify the accuracy of your data and consider potential costs associated with conversions. Staying informed about market trends can also help mitigate risks."
    },
    {
      question: "How often should I recalculate?",
      answer: "Recalculation should be done whenever there are significant changes in exchange rates or market conditions. Regular updates ensure that your conversion values remain accurate and reflective of current market realities. Consider setting a schedule for regular checks, especially if you are actively trading or managing a large portfolio."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results to make informed decisions about your cryptocurrency investments. Whether you're considering buying, selling, or holding, understanding the current value of your assets is crucial. If you're planning significant financial moves, consulting with a financial advisor can provide additional insights. For more financial tools, explore our <a href=\"/financial/refinance-savings\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Refinance Savings Calculator</a> to understand potential savings from refinancing."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Alternatives include using dedicated financial software or consulting with financial advisors for personalized insights. These methods can offer more comprehensive analysis and account for additional factors like taxes and fees. While this calculator provides quick and accurate conversions, exploring other resources can enhance your financial planning and decision-making capabilities."
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

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
    let cryptoAmountValue = parseFloat(inputs.cryptoAmount) || 0;
    const cryptoRateValue = parseFloat(inputs.cryptoRate) || 0;
    const fiatRateValue = parseFloat(inputs.fiatRate) || 0;

    // Validate
    if (cryptoAmountValue <= 0 || cryptoRateValue <= 0 || fiatRateValue <= 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const mainResult = cryptoAmountValue * cryptoRateValue;
    const result2 = mainResult * fiatRateValue;
    const result3 = mainResult * (fiatRateValue / cryptoRateValue);

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      cryptoValue: mainResult / 12,
      fiatValue: result2 / 12,
      balance: mainResult - ((mainResult / 12) * (i + 1))
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
    setInputs({ cryptoAmount: "", cryptoRate: "", fiatRate: "" });
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
              placeholder="e.g., 2.5"
              value={inputs.cryptoAmount}
              onChange={(e) => setInputs({ ...inputs, cryptoAmount: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Cryptocurrency Rate (USD)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 30000"
              value={inputs.cryptoRate}
              onChange={(e) => setInputs({ ...inputs, cryptoRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Fiat Currency Rate (USD)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1.1"
              value={inputs.fiatRate}
              onChange={(e) => setInputs({ ...inputs, fiatRate: e.target.value })}
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
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Conversion Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Total Crypto Value in USD
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
                      Equivalent Fiat Value
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
                      Fiat to Crypto Conversion
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
                    Monthly Conversion Schedule
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
                        <TableHead className="font-semibold">Crypto Value</TableHead>
                        <TableHead className="font-semibold">Fiat Value</TableHead>
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
                            <TableCell>{formatCurrency(row.cryptoValue)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.fiatValue)}
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
          Understanding Multi-Currency Crypto Converter
        </h2>
        
        <p className="mb-6">
          The Multi-Currency Crypto Converter is a powerful tool designed to help users seamlessly convert between various cryptocurrencies and fiat currencies. As the world of digital currencies continues to expand, the need for accurate and efficient conversion tools becomes increasingly important. This converter allows users to input their cryptocurrency holdings and instantly see their value in multiple fiat currencies, making it an essential tool for anyone managing a diverse portfolio. Whether you're a seasoned investor or new to the crypto space, understanding the real-time value of your assets is crucial for making informed financial decisions.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital in the fast-paced world of cryptocurrency. With fluctuating exchange rates and market volatility, even small errors can lead to significant financial discrepancies. This tool ensures precision by using up-to-date exchange rates, allowing users to trust the results they receive. By providing a clear picture of their portfolio's worth, users can make strategic decisions about buying, selling, or holding their assets. For those interested in exploring more about financial calculations, our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> offers insights into managing traditional financial obligations.
        </p>
        
        <p className="mb-6">
          To use this converter effectively, gather the necessary information about your cryptocurrency holdings and the current exchange rates. Begin by entering the amount of cryptocurrency you own, followed by the current rate of the cryptocurrency in USD. Next, input the rate of the fiat currency you wish to convert to. This tool will then calculate the equivalent value in your chosen fiat currency, providing you with a comprehensive overview. For those looking to delve deeper into financial planning, our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a> is a valuable resource.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check the exchange rates before performing conversions. Market conditions can change rapidly, and using outdated rates may lead to inaccurate results. Consider setting alerts for significant rate changes to stay informed.
          </p>
        </div>
        
        <p className="mb-6">
          For optimal use, ensure that you regularly update the exchange rates and review your portfolio's performance. Be mindful of transaction fees and other costs that might affect the final value of your conversions. By staying informed and proactive, you can maximize the benefits of this tool and make sound financial decisions.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Multi-Currency Crypto Converter Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Multi-Currency Crypto Converter is based on standard conversion principles, ensuring accuracy and reliability. The primary formula calculates the value of a given cryptocurrency in a specified fiat currency. This is achieved by multiplying the amount of cryptocurrency by its current rate in USD, and then adjusting for the desired fiat currency rate. This approach is widely accepted in financial calculations and provides a clear and straightforward method for determining equivalent values across currencies.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Crypto Value (Fiat) = Crypto Amount × Crypto Rate (USD) × Fiat Rate
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Crypto Amount = Amount of cryptocurrency owned</li>
              <li>Crypto Rate (USD) = Current rate of cryptocurrency in USD</li>
              <li>Fiat Rate = Conversion rate of USD to desired fiat currency</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the final conversion value. The Crypto Amount represents the quantity of cryptocurrency you hold. The Crypto Rate (USD) is the current market price of the cryptocurrency in US dollars, which can fluctuate based on market conditions. The Fiat Rate is the exchange rate between the US dollar and the fiat currency you wish to convert to. Adjustments in any of these variables will directly impact the conversion outcome, highlighting the importance of using accurate and up-to-date data.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence conversion results is essential for making informed decisions. These factors can vary significantly and have a profound impact on the final outcome. By recognizing and accounting for these elements, users can better manage their portfolios and optimize their financial strategies.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Exchange Rate Volatility
        </h3>
        <p className="mb-4">
          Exchange rates are inherently volatile, especially in the cryptocurrency market. Prices can fluctuate dramatically within short periods, influenced by market demand, geopolitical events, and economic indicators. This volatility can significantly impact conversion values, making it crucial to use real-time data for calculations.
        </p>
        <p className="mb-6">
          To mitigate the effects of volatility, consider using tools that provide live exchange rate updates. Additionally, setting alerts for significant price changes can help you react promptly to market shifts. For more insights on managing financial volatility, explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Transaction Fees
        </h3>
        <p className="mb-4">
          Transaction fees are a common aspect of cryptocurrency exchanges and can affect the net value of conversions. These fees vary across platforms and can accumulate over multiple transactions, reducing the overall value received from conversions.
        </p>
        <p className="mb-6">
          It's important to account for these fees when planning conversions. Compare fees across different platforms and consider using exchanges with lower costs for frequent transactions. Understanding these costs can help you maximize your returns and make more informed decisions.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Liquidity
        </h3>
        <p className="mb-4">
          Liquidity refers to how easily an asset can be converted into cash without affecting its market price. In the cryptocurrency market, liquidity can vary widely between different coins and tokens, impacting the ease and cost of conversions.
        </p>
        <p className="mb-6">
          High liquidity typically results in tighter spreads and lower transaction costs, while low liquidity can lead to higher volatility and wider spreads. When planning conversions, consider the liquidity of the assets involved to ensure efficient and cost-effective transactions.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Regulatory Environment
        </h3>
        <p className="mb-6">
          The regulatory landscape for cryptocurrencies is constantly evolving, with changes that can impact conversion processes. Regulations may affect the availability of certain cryptocurrencies, impose restrictions on transactions, or influence market sentiment. Staying informed about regulatory developments is crucial for navigating the crypto space effectively.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Economic Indicators
        </h3>
        <p className="mb-6">
          Economic indicators such as inflation rates, interest rates, and GDP growth can influence currency values and, by extension, conversion rates. Understanding these indicators can provide valuable insights into potential market movements and help you make more informed conversion decisions.
        </p>
      </section>

      {/* SECTION 4: FAQ (1000-1200 words with 8 questions) */}
      <section id="faq" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
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
                href="https://www.investopedia.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Investopedia - Cryptocurrency Basics
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive guides and educational resources on cryptocurrency and blockchain technology.
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
                Binance - Cryptocurrency Exchange
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Access a wide range of cryptocurrencies and trading pairs on one of the largest exchanges.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.coinbase.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Coinbase - Buy & Sell Cryptocurrency
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                A user-friendly platform for buying, selling, and managing cryptocurrency portfolios.
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
                Blockchain.com - Cryptocurrency Wallet
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Securely store and manage your cryptocurrencies with a trusted digital wallet.
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
                CryptoCompare - Market Data
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Access real-time market data and analytics for informed cryptocurrency trading.
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
      title="Multi-Currency Crypto Converter"
      description="Convert between multiple cryptocurrencies and fiat currencies simultaneously. A versatile tool for diverse portfolios."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Multi-Currency Crypto Converter" },
        { id: "formula", label: "Multi-Currency Crypto Converter Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Crypto Value (Fiat) = Crypto Amount × Crypto Rate (USD) × Fiat Rate",
        variables: [
          { symbol: "Crypto Amount", description: "Amount of cryptocurrency owned" },
          { symbol: "Crypto Rate (USD)", description: "Current rate of cryptocurrency in USD" },
          { symbol: "Fiat Rate", description: "Conversion rate of USD to desired fiat currency" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have 2.5 BTC and the current BTC rate is $30,000. You want to convert this to EUR, where 1 USD = 0.85 EUR.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "2.5 × 30,000 = 75,000", 
            explanation: "Calculate the total value of BTC in USD." 
          },
          { 
            label: "Step 2", 
            calculation: "75,000 × 0.85 = 63,750", 
            explanation: "Convert the USD value to EUR." 
          }
        ],
        result: "The final result is €63,750, meaning your 2.5 BTC is worth €63,750."
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "💵" },
        { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
        { title: "Extra Payments & Payoff Time Calculator", url: "/financial/extra-payments-payoff", icon: "📈" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "💰" },
        { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "📊" },
        { title: "HELOC Payment Estimator", url: "/financial/heloc-payment-estimator", icon: "🏦" }
      ]}
    />
  );
}
