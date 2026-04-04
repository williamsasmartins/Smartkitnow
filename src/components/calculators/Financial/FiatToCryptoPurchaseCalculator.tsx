import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function FiatToCryptoPurchaseCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    fiatAmount: "", 
    cryptoPrice: "", 
    feePercentage: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What fees are included in a fiat-to-crypto purchase and how do I minimize them?",
      answer: "A fiat-to-crypto purchase typically includes: (1) Trading fee: 0.1–1.5% of transaction, (2) Spread: hidden markup between buy and sell price, (3) Deposit fee: varies by payment method (ACH: free; credit card: 3–5%; wire: $10–$25 flat). Total effective cost comparison (2024): Coinbase simple: 2.5–3.5% total. Coinbase Advanced: 0.6% taker + minimal spread. Kraken: 0.26% taker. Binance US: 0.1%. PayPal/CashApp: 1.5–2.5% spread (no stated fee but wide spread). To minimize: use ACH/bank transfer (not credit card), use limit orders on advanced trading interfaces, and compare all-in costs including the bid-ask spread, not just stated fees."
    },
    {
      question: "How does my choice of fiat currency affect crypto purchase rates outside the US?",
      answer: "Buying Bitcoin in USD on US exchanges provides the tightest spreads due to highest liquidity. In other currencies, you pay an implicit FX conversion fee. EUR→BTC on a EUR-denominated exchange: tighter spreads than USD→EUR→BTC via conversion. GBP→BTC: good liquidity on Coinbase UK, Kraken. Emerging market currencies (BRL, NGN, ARS): significantly wider spreads (2–5%) and fewer exchange options -- this is why P2P platforms like Paxful historically served these markets. For non-USD purchases, always calculate the all-in rate by comparing your fiat amount to the USD-equivalent value of crypto received."
    },
    {
      question: "What is the tax basis of crypto purchased with fiat?",
      answer: "Your cost basis = total fiat amount paid + all fees. If you buy $1,000 of BTC and pay $10 in trading fees, your cost basis is $1,010. This basis determines your capital gain or loss when you later sell or exchange the crypto. Keep records of: purchase date, amount of fiat paid, fees paid, and quantity of crypto received. The IRS requires these records; exchanges are required to report this data via 1099-DA starting 2025. Missing basis information forces you to either prove basis from transaction history or risk the IRS applying $0 basis (maximizing your taxable gain). Purchase confirmations should be saved permanently."
    },
    {
      question: "How quickly does a fiat-to-crypto purchase settle and why does timing matter?",
      answer: "Settlement times by method: ACH bank transfer: 3–5 business days (but many exchanges credit crypto immediately while holding the ACH settlement). Wire transfer: same day if sent before cutoff (typically 2PM local). Debit card: instant. Credit card: instant (but 3–5% fee and possible cash advance classification). The timing matters because crypto price fluctuates while fiat is in transit. Most exchanges lock in the price at order time (not settlement time), so a delayed ACH still gets the price at the moment of purchase. Verify your exchange's policy -- some use settlement price, which means your actual crypto quantity is determined after the ACH clears."
    },
    {
      question: "Is there a limit on how much fiat I can convert to crypto in a single purchase?",
      answer: "Purchase limits vary by exchange, KYC tier, and payment method. Typical 2024 limits: Coinbase basic: $25,000/day ACH. Coinbase verified: $50,000/day. Kraken: $500,000/day (Pro). Wire transfers often have higher limits. Limits exist due to KYC/AML regulations -- any purchase over $10,000 triggers a Currency Transaction Report (CTR) to FinCEN. Structuring transactions (making multiple purchases under $10,000 specifically to avoid CTR filing) is a federal crime under 31 U.S.C. § 5324, regardless of whether the underlying funds are legal. For large purchases ($100K+), contact your exchange's OTC desk for better rates and institutional-level service."
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

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
    const fiatAmount = parseFloat(inputs.fiatAmount) || 0;
    const cryptoPrice = parseFloat(inputs.cryptoPrice) || 0;
    const feePercentage = parseFloat(inputs.feePercentage) || 0;

    // Validate
    if (fiatAmount <= 0 || cryptoPrice <= 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const feeAmount = fiatAmount * (feePercentage / 100);
    const netFiat = fiatAmount - feeAmount;
    const cryptoAmount = netFiat / cryptoPrice;
    const mainResult = cryptoAmount;
    const result2 = feeAmount;
    const result3 = netFiat;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      fiatSpent: fiatAmount / 12,
      cryptoAcquired: (fiatAmount / 12) / cryptoPrice,
      fees: (fiatAmount / 12) * (feePercentage / 100),
      netCrypto: ((fiatAmount / 12) - ((fiatAmount / 12) * (feePercentage / 100))) / cryptoPrice
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
    setInputs({ fiatAmount: "", cryptoPrice: "", feePercentage: "" });
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
              Fiat Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1000"
              value={inputs.fiatAmount}
              onChange={(e) => setInputs({ ...inputs, fiatAmount: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Crypto Price
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50000"
              value={inputs.cryptoPrice}
              onChange={(e) => setInputs({ ...inputs, cryptoPrice: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Transaction Fee (%)
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
                      Crypto Amount
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {results.mainResult.toFixed(6)} BTC
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
                      Transaction Fees
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
                      Net Fiat Amount
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
                    Monthly Purchase Schedule
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
                        <TableHead className="font-semibold">Fiat Spent</TableHead>
                        <TableHead className="font-semibold">Crypto Acquired</TableHead>
                        <TableHead className="font-semibold">Fees</TableHead>
                        <TableHead className="font-semibold">Net Crypto</TableHead>
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
                            <TableCell>{formatCurrency(row.fiatSpent)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {row.cryptoAcquired.toFixed(6)} BTC
                            </TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.fees)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {row.netCrypto.toFixed(6)} BTC
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
          Understanding Fiat to Crypto Purchase Calculator
        </h2>
        
        <p className="mb-6">
          The Fiat to Crypto Purchase Calculator is an essential tool for anyone looking to enter the cryptocurrency market. By inputting the amount of fiat currency you wish to spend, the current price of the cryptocurrency, and any transaction fees, this calculator provides you with an accurate estimate of how much cryptocurrency you can acquire. This is particularly useful for planning your entry points and ensuring you make informed financial decisions. Whether you're a seasoned investor or a newcomer to the crypto world, understanding how much crypto you can buy with your fiat currency is crucial for effective portfolio management.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital in the fast-paced world of cryptocurrency. With volatile market conditions, even a small miscalculation can lead to significant financial implications. This calculator helps mitigate such risks by providing precise calculations, allowing you to strategize your investments better. According to recent studies, a well-planned entry into the crypto market can significantly enhance your investment returns. This tool empowers you to make data-driven decisions, reducing the guesswork often associated with crypto investments. For more insights, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather the necessary information beforehand. You'll need the total amount of fiat currency you plan to invest, the current market price of the cryptocurrency, and any applicable transaction fees. Enter these values into the respective fields to get started. The calculator will then compute the total amount of cryptocurrency you can purchase, taking into account the transaction fees. For a more comprehensive understanding, visit our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check the current market price of the cryptocurrency before making a purchase. Prices can fluctuate rapidly, and ensuring you have the most up-to-date information will help you avoid potential losses. Consider setting up alerts for price changes to stay informed.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices include regularly updating the crypto price and fee percentage to reflect current market conditions. This ensures your calculations remain accurate over time. Additionally, consider the impact of market volatility on your investment strategy. By staying informed and using this calculator, you can optimize your crypto purchases and enhance your investment outcomes.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Fiat to Crypto Purchase Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this calculator is designed to provide a clear and accurate representation of how much cryptocurrency you can purchase with a given amount of fiat currency. The formula takes into account the current price of the cryptocurrency and any transaction fees that may apply. This approach is widely accepted in the financial industry as it provides a straightforward method for calculating crypto purchases.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Crypto Amount = (Fiat Amount - (Fiat Amount × Fee Percentage)) / Crypto Price
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Fiat Amount = Total fiat currency you plan to spend</li>
              <li>Fee Percentage = Transaction fee percentage</li>
              <li>Crypto Price = Current market price of the cryptocurrency</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the final crypto amount. The Fiat Amount represents your total investment in fiat currency. The Fee Percentage accounts for any transaction costs, which can vary depending on the platform or exchange used. The Crypto Price is the current market value of the cryptocurrency. Changes in any of these variables will directly affect the amount of cryptocurrency you can purchase. For instance, a higher fee percentage will reduce the net fiat amount available for purchasing crypto.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your crypto purchase calculations is essential for making informed investment decisions. These factors can significantly impact the amount of cryptocurrency you can acquire and your overall investment strategy.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Volatility
        </h3>
        <p className="mb-4">
          Cryptocurrency markets are known for their volatility. Prices can fluctuate dramatically within short periods, affecting the amount of crypto you can purchase. Staying updated with market trends and using tools like price alerts can help you navigate these fluctuations effectively.
        </p>
        <p className="mb-6">
          To optimize your purchases during volatile periods, consider setting a budget and sticking to it. This approach helps mitigate risks associated with sudden price changes. For more strategies, explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Transaction Fees
        </h3>
        <p className="mb-4">
          Transaction fees can vary significantly between different exchanges and platforms. These fees directly impact the net amount of fiat currency available for purchasing crypto. It's crucial to compare fees across platforms to ensure you're getting the best deal.
        </p>
        <p className="mb-6">
          Consider using exchanges with lower fees or promotional offers to maximize your crypto acquisition. Be aware of hidden fees that may not be immediately apparent. For more insights, check out our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Exchange Rates
        </h3>
        <p className="mb-4">
          Exchange rates between fiat currencies and cryptocurrencies can vary. These rates are influenced by market demand, geopolitical events, and economic indicators. Understanding these factors can help you predict potential rate changes and plan your purchases accordingly.
        </p>
        <p className="mb-6">
          Monitoring exchange rates and using historical data can provide valuable insights into future trends. This information can guide your investment decisions and help you capitalize on favorable rates.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Regulatory Environment
        </h3>
        <p className="mb-6">
          The regulatory landscape for cryptocurrencies is continually evolving. Changes in regulations can impact the availability and pricing of cryptocurrencies. Staying informed about regulatory developments is crucial for making informed investment decisions. For instance, new regulations may introduce additional fees or restrictions on crypto transactions.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Security Measures
        </h3>
        <p className="mb-6">
          Security is a paramount concern when dealing with cryptocurrencies. Ensuring that your chosen platform has robust security measures in place can protect your investments from potential threats. Look for platforms with multi-factor authentication, encryption, and insurance against breaches.
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
                href="https://www.federalreserve.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Federal Reserve - Cryptocurrency Insights
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on cryptocurrency trends and regulatory guidelines.
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
                Consumer Financial Protection Bureau - Crypto Guide
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
                FDIC - Cryptocurrency Regulations
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and deposit insurance information related to cryptocurrencies.
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
                Internal Revenue Service - Crypto Tax Guidelines
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information for cryptocurrency transactions.
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
                Detailed financial education and investment concepts explained for beginners and experts alike.
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
                NerdWallet - Cryptocurrency Investing
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
      title="Fiat to Crypto Purchase Calculator"
      description="Calculate how much crypto you can buy with a specific amount of fiat currency. Plan your entry points accurately."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Fiat to Crypto Purchase Calculator" },
        { id: "formula", label: "Fiat to Crypto Purchase Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Crypto Amount = (Fiat Amount - (Fiat Amount × Fee Percentage)) / Crypto Price",
        variables: [
          { symbol: "Fiat Amount", description: "Total fiat currency you plan to spend" },
          { symbol: "Fee Percentage", description: "Transaction fee percentage" },
          { symbol: "Crypto Price", description: "Current market price of the cryptocurrency" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have $1,000 to invest in Bitcoin, with a market price of $50,000 per BTC and a transaction fee of 1.5%.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "1000 × 0.015 = 15", 
            explanation: "Calculate the transaction fee amount." 
          },
          { 
            label: "Step 2", 
            calculation: "1000 - 15 = 985", 
            explanation: "Subtract the fee from the total fiat amount to get the net fiat amount." 
          },
          { 
            label: "Step 3", 
            calculation: "985 / 50000 = 0.0197", 
            explanation: "Divide the net fiat amount by the crypto price to get the crypto amount." 
          }
        ],
        result: "The final result is 0.0197 BTC, meaning you can purchase approximately 0.0197 Bitcoin with $1,000 after accounting for the transaction fee."
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
